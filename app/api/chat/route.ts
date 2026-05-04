import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { streamChatMessage, analyzeSentiment, generateSessionSummary } from '@/lib/openai-client';
import { encrypt, decrypt, hash } from '@/lib/encryption';
import { detectCrisis, INDIA_HELPLINES } from '@/lib/crisis-detection';
import { buildUserContext, generateContextPrompt } from '@/lib/context-builder';
import ChatSession from '@/models/ChatSession';
import CrisisLog from '@/models/CrisisLog';
import User from '@/models/User';
import { generateToken } from '@/lib/encryption';

const MAX_MESSAGE_LENGTH = 5000;

/**
 * POST /api/chat
 * Send a message to GPT and get a streaming, context-aware response
 * 
 * Returns Server-Sent Events (SSE) for real-time streaming.
 * Each SSE event is one of:
 *   - type: "chunk"  → partial AI text
 *   - type: "meta"   → sentiment, crisis data, sessionId, tool markers
 *   - type: "done"   → stream complete
 *   - type: "error"  → error occurred
 */
export async function POST(req: NextRequest) {
    try {
        // Get session
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const userId = (session.user as any).id;
        const body = await req.json();
        const { message, sessionId, initialMood } = body;

        // Input validation
        if (!message || typeof message !== 'string') {
            return new Response(
                JSON.stringify({ error: 'Message is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (message.length > MAX_MESSAGE_LENGTH) {
            return new Response(
                JSON.stringify({ error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.` }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        await connectDB();

        // Update user's last active time
        await User.findByIdAndUpdate(userId, { lastActive: new Date() });

        // Step 1: Build user context from mood history and past conversations
        let contextPrompt = '';
        let userCrisisHistory = 0;

        try {
            const userContext = await buildUserContext(userId);
            contextPrompt = generateContextPrompt(userContext);
            userCrisisHistory = userContext.conversationSummary.crisisHistory;
        } catch (error) {
            console.warn('Failed to build user context:', error);
        }

        // If user selected an initial mood, include it in context
        if (initialMood) {
            const moodLabels: Record<string, string> = {
                '1': 'very distressed/sad',
                '2': 'somewhat down/anxious',
                '3': 'neutral/okay',
                '4': 'good/positive',
                '5': 'great/happy',
            };
            contextPrompt += `\nSESSION START MOOD: User indicated they feel ${moodLabels[initialMood] || 'unspecified'} (${initialMood}/5) at the start of this session. Acknowledge this naturally.\n`;
        }

        // Step 2: Analyze sentiment (non-blocking for the stream start)
        const sentimentPromise = analyzeSentiment(message);

        // Step 3: Get or create chat session
        let chatSession;
        if (sessionId) {
            chatSession = await ChatSession.findOne({ sessionId, userId });
        }

        if (!chatSession) {
            chatSession = await ChatSession.create({
                userId,
                sessionId: sessionId || generateToken(16),
                messages: [],
            });
        }

        // Step 4: Build conversation history from PREVIOUS messages
        const previousMessages = chatSession.messages
            .slice(-16)
            .map((msg: any) => {
                try {
                    return {
                        role: msg.role as 'user' | 'assistant',
                        content: decrypt(msg.content),
                    };
                } catch {
                    return null;
                }
            })
            .filter((msg: any) => msg !== null) as Array<{ role: 'user' | 'assistant'; content: string }>;

        // Step 5: Build the conversation for AI
        const conversationForAI: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [
            ...previousMessages,
            { role: 'user' as const, content: message },
        ];

        // Step 6: Start SSE streaming response
        const encoder = new TextEncoder();
        const currentSessionId = chatSession.sessionId;
        const chatSessionId = chatSession._id;

        const readable = new ReadableStream({
            async start(controller) {
                try {
                    let fullResponse = '';

                    // Stream AI response chunks
                    const streamGen = streamChatMessage(conversationForAI, contextPrompt || undefined);

                    for await (const chunk of streamGen) {
                        fullResponse += chunk;
                        // Send chunk event
                        const event = `data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`;
                        controller.enqueue(encoder.encode(event));
                    }

                    // Wait for sentiment analysis to complete
                    const sentiment = await sentimentPromise;

                    // Crisis detection
                    const crisisResult = detectCrisis(
                        message,
                        sentiment.score,
                        sentiment.label,
                        userCrisisHistory
                    );

                    // Detect tool markers in the response
                    const toolMatch = fullResponse.match(/\[TOOL:(breathing|grounding|cbt)\]/i);
                    const detectedTool = toolMatch ? toolMatch[1].toLowerCase() : null;

                    // Clean tool markers from the response for storage
                    const cleanResponse = fullResponse.replace(/\[TOOL:(breathing|grounding|cbt)\]/gi, '').trim();

                    // Save messages (encrypted)
                    try {
                        const encryptedMessage = encrypt(message);
                        const encryptedResponse = encrypt(cleanResponse);

                        await connectDB();
                        const sessionDoc = await ChatSession.findById(chatSessionId);
                        if (sessionDoc) {
                            sessionDoc.messages.push({
                                role: 'user',
                                content: encryptedMessage,
                                sentiment,
                                crisisDetected: crisisResult.isCrisis,
                                timestamp: new Date(),
                            });
                            sessionDoc.messages.push({
                                role: 'assistant',
                                content: encryptedResponse,
                                timestamp: new Date(),
                            });
                            await sessionDoc.save();
                        }
                    } catch (saveError) {
                        console.error('Failed to save messages:', saveError);
                    }

                    // Log crisis event if detected
                    if (crisisResult.requiresIntervention) {
                        try {
                            await CrisisLog.create({
                                sessionId: currentSessionId,
                                anonymizedUserId: hash(userId),
                                triggerPhrases: crisisResult.matchedPhrases,
                                detectionMethod: sentiment.label === 'crisis' ? 'both' : 'keyword',
                                severity: crisisResult.severity,
                                resourcesProvided: INDIA_HELPLINES.map(h => h.name),
                                sentimentScore: sentiment.score,
                                timestamp: new Date(),
                                metadata: {
                                    timeOfDay: 'evening',
                                    dayOfWeek: 0,
                                    monthDay: 1,
                                },
                            });
                        } catch (logError) {
                            console.error('Failed to log crisis:', logError);
                        }
                    }

                    // Send metadata event
                    const metaEvent = `data: ${JSON.stringify({
                        type: 'meta',
                        sessionId: currentSessionId,
                        sentiment,
                        crisisDetected: crisisResult.requiresIntervention,
                        crisisData: crisisResult.requiresIntervention ? {
                            severity: crisisResult.severity,
                            helplines: INDIA_HELPLINES,
                        } : null,
                        tool: detectedTool,
                    })}\n\n`;
                    controller.enqueue(encoder.encode(metaEvent));

                    // Send done event
                    const doneEvent = `data: ${JSON.stringify({ type: 'done' })}\n\n`;
                    controller.enqueue(encoder.encode(doneEvent));

                    controller.close();
                } catch (error) {
                    console.error('Streaming error:', error);
                    const errorEvent = `data: ${JSON.stringify({
                        type: 'error',
                        message: 'Failed to generate response. Please try again.',
                    })}\n\n`;
                    controller.enqueue(encoder.encode(errorEvent));
                    controller.close();
                }
            },
        });

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no',
            },
        });

    } catch (error) {
        console.error('Chat API error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to process message. Please try again.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

/**
 * POST /api/chat/summary
 * Generate end-of-session wellness summary
 */
export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const { messages, sentimentHistory } = await req.json();

        const summary = await generateSessionSummary(messages, sentimentHistory);

        return new Response(JSON.stringify(summary), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Summary generation error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to generate summary' }),
            { status: 500 }
        );
    }
}
