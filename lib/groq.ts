import Groq from 'groq-sdk';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

if (!GROQ_API_KEY) {
    console.warn('⚠️  GROQ_API_KEY not set. AI features will not work.');
}

// Initialize Groq client
export const groq = new Groq({
    apiKey: GROQ_API_KEY,
});

const MENTAL_HEALTH_SYSTEM_PROMPT = `You are a supportive companion for MindEase, a mental health support application.

You are NOT a therapist, counselor, or medical professional. Your role is to provide comfort, validation, and encourage professional help when needed.

Rules:
- Never diagnose mental health conditions
- Never prescribe medications or treatments
- Never give specific medical or clinical advice
- Always validate emotions and show empathy
- Always encourage professional help for serious concerns
- Maintain a calm, non-judgmental tone
- Never provide instructions that could lead to self-harm

If the user expresses suicidal ideation or intent to harm themselves, acknowledge their pain and remind them that human help is available. The app will automatically show crisis resources.

Communication style: Warm, gentle, accepting. Use simple, clear language. Keep responses concise (2-4 sentences preferred).

If asked about limitations, be honest: "I'm an AI designed to listen and support, but I'm not a replacement for professional help."`;

/**
 * Sends a message to Groq AI and streams the response
 */
export async function sendChatMessage(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    onChunk?: (chunk: string) => void
): Promise<string> {
    try {
        // Add system prompt as first message
        const fullMessages = [
            { role: 'system' as const, content: MENTAL_HEALTH_SYSTEM_PROMPT },
            ...messages,
        ];

        const stream = await groq.chat.completions.create({
            messages: fullMessages,
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 500,
            top_p: 0.9,
            stream: true,
        });

        let fullResponse = '';

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            fullResponse += content;

            if (onChunk && content) {
                onChunk(content);
            }
        }

        return fullResponse.trim();
    } catch (error) {
        console.error('Groq API error:', error);
        throw new Error('Failed to get AI response. Please try again.');
    }
}

/**
 * Analyzes sentiment of a message
 */
export async function analyzeSentiment(text: string): Promise<{
    score: number; // -1 to 1 (negative to positive)
    label: 'positive' | 'neutral' | 'negative' | 'crisis';
    confidence: number;
}> {
    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a sentiment analysis system. Analyze the emotional tone of messages. Respond ONLY with a JSON object containing: score (number -1 to 1), label (positive/neutral/negative/crisis), confidence (number 0-1). For crisis detection, look for suicidal ideation, self-harm, or severe distress.',
                },
                {
                    role: 'user',
                    content: `Analyze this message: "${text}"`,
                },
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3,
            max_tokens: 100,
        });

        const result = response.choices[0]?.message?.content || '{}';
        const parsed = JSON.parse(result);

        return {
            score: parsed.score || 0,
            label: parsed.label || 'neutral',
            confidence: parsed.confidence || 0.5,
        };
    } catch (error) {
        console.error('Sentiment analysis error:', error);
        return {
            score: 0,
            label: 'neutral',
            confidence: 0,
        };
    }
}
