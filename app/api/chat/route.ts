import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { sendChatMessage, analyzeSentiment } from '@/lib/groq';
import { encrypt, decrypt, hash } from '@/lib/encryption';
import { detectCrisis, INDIA_HELPLINES } from '@/lib/crisis-detection';
import ChatSession from '@/models/ChatSession';
import CrisisLog from '@/models/CrisisLog';
import User from '@/models/User';
import { generateToken } from '@/lib/encryption';

/**
 * POST /api/chat
 * Send a message to the AI and get a streaming response
 */
export async function POST(req: NextRequest) {
    try {
        // Get session
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const body = await req.json();
        const { message, sessionId } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        await connectDB();

        // Update user's last active time
        await User.findByIdAndUpdate(userId, { lastActive: new Date() });

        // Step 1: Analyze sentiment
        const sentiment = await analyzeSentiment(message);

        // Step 2: Detect crisis
        const crisisResult = detectCrisis(message, sentiment.score, sentiment.label);

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

        // Step 4: Encrypt and save user message
        const encryptedMessage = encrypt(message);
        chatSession.messages.push({
            role: 'user',
            content: encryptedMessage,
            sentiment,
            crisisDetected: crisisResult.isCrisis,
            timestamp: new Date(),
        });

        // Step 5: Log crisis event if detected
        if (crisisResult.requiresIntervention) {
            await CrisisLog.create({
                sessionId: chatSession.sessionId,
                anonymizedUserId: hash(userId),
                triggerPhrases: crisisResult.matchedPhrases,
                detectionMethod: sentiment.label === 'crisis' ? 'both' : 'keyword',
                severity: crisisResult.severity,
                resourcesProvided: INDIA_HELPLINES.map(h => h.name),
                sentimentScore: sentiment.score,
                timestamp: new Date(),
                metadata: {
                    timeOfDay: 'evening', // Will be auto-set by model
                    dayOfWeek: 0,
                    monthDay: 1,
                },
            });
        }

        // Step 6: Get conversation history (decrypted)
        const conversationHistory = chatSession.messages
            .slice(-10) // Last 10 messages only
            .map(msg => {
                try {
                    return {
                        role: msg.role,
                        content: decrypt(msg.content),
                    };
                } catch {
                    // Skip messages that can't be decrypted
                    return null;
                }
            })
            .filter(msg => msg !== null) as Array<{ role: 'user' | 'assistant'; content: string }>;

        // Step 7: Get AI response
        const startTime = Date.now();
        const aiResponse = await sendChatMessage(conversationHistory);
        const responseTime = Date.now() - startTime;

        // Step 8: Encrypt and save AI response
        const encryptedResponse = encrypt(aiResponse);
        chatSession.messages.push({
            role: 'assistant',
            content: encryptedResponse,
            timestamp: new Date(),
        });

        // Update metadata
        if (!chatSession.metadata.averageResponseTime) {
            chatSession.metadata.averageResponseTime = responseTime;
        } else {
            chatSession.metadata.averageResponseTime =
                (chatSession.metadata.averageResponseTime + responseTime) / 2;
        }

        await chatSession.save();

        // Step 9: Return response
        return NextResponse.json({
            message: aiResponse,
            sessionId: chatSession.sessionId,
            crisisDetected: crisisResult.requiresIntervention,
            crisisData: crisisResult.requiresIntervention ? {
                severity: crisisResult.severity,
                helplines: INDIA_HELPLINES,
            } : null,
            sentiment,
        });

    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Failed to process message. Please try again.' },
            { status: 500 }
        );
    }
}
