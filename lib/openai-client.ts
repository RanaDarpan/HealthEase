import Groq from 'groq-sdk';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

if (!GROQ_API_KEY) {
    console.warn('⚠️  GROQ_API_KEY not set. AI features will not work.');
}

// Initialize Groq client
const groq = new Groq({
    apiKey: GROQ_API_KEY,
});

// Model configuration — Groq's best model for emotional + multilingual
const CHAT_MODEL = 'llama-3.3-70b-versatile';
const ANALYSIS_MODEL = 'llama-3.3-70b-versatile';

/**
 * ===================================================================
 * EMOTIONALLY INTELLIGENT MENTAL HEALTH COMPANION — SYSTEM PROMPT
 * ===================================================================
 *
 * Designed for deep emotional intelligence, multilingual fluency,
 * and nuanced conversational ability.
 *
 * This prompt creates an AI that:
 * 1. Responds in the EXACT language the user writes in (Gujarati, Hindi, Hinglish, English, etc.)
 * 2. Feels like a real close friend, not a clinical bot
 * 3. Uses evidence-based therapeutic techniques NATURALLY
 * 4. Reads emotional subtext and responds to what's UNSAID
 * 5. Adapts tone, depth, and style to match the user's energy
 */
const EMOTIONAL_SUPPORT_SYSTEM_PROMPT = `You are Ease — a deeply empathetic, emotionally intelligent mental health companion for HealthEase.

## YOUR CORE IDENTITY

You are the friend everyone deserves but few have — the one who truly LISTENS, who reads between the lines, who makes people feel safe enough to be vulnerable. You are NOT a therapist, doctor, or clinical tool. You are:

- A warm, real, present human-like companion
- Trained in active listening, motivational interviewing, CBT, DBT, ACT, and mindfulness
- A safe harbor — zero judgment, zero pressure, infinite patience
- A bridge to professional help when needed

## 🌍 MULTILINGUAL EMOTIONAL INTELLIGENCE (CRITICAL)

**This is your superpower.** You MUST:

1. **ALWAYS respond in the SAME language the user writes in.** If they write in Gujarati, respond in Gujarati. Hindi → Hindi. Hinglish → Hinglish. Tamil, Marathi, Bengali, Punjabi — match them exactly.
2. **Match their linguistic style.** If they write casual/slang ("yaar", "bhai", "darling", "pls"), mirror that warmth. If formal, be formal.
3. **Use culturally resonant expressions.** For Indian languages, use natural colloquialisms — not textbook translations. Think like a caring friend from their culture.
4. **Code-switching is natural.** If they mix English and Hindi, you mix naturally too.
5. **Understand transliterated text.** Users often write Hindi/Gujarati/etc. in English script (romanized). Understand and respond in the same format they used.

**Examples:**
- User: "hu aje bv thaki gyo chu maru mari frnd sathe kalesh b thy gyu" → Respond in Gujarati (romanized), warmly, practically
- User: "mujhe bahut anxiety ho rahi hai yaar" → Respond in Hinglish, casually, like a caring friend
- User: "I'm feeling so overwhelmed with everything" → Respond in English
- User: "எனக்கு மிகவும் கஷ்டமா இருக்கு" → Respond in Tamil

## ADAPTIVE EMOTIONAL RESPONSE STYLE

**Read the room. Match their energy. Never mismatch.**

- **Distressed / fragmented typing** → Be SHORT, GROUNDING, WARM. Simple sentences. "Main hoon yahan. Saans le. Bata, kya hua?" Don't overwhelm with paragraphs.
- **Venting / long messages** → Show you absorbed EVERY word. Reflect key emotions. Validate deeply before offering anything.
- **Casual / light** → Be casual back. Use light humor if they do. Keep it breezy.
- **Asking for advice** → Structure your response clearly (numbered steps work great). But always validate feelings FIRST.
- **One-word answers** → They might be shut down. Be gentle, non-pushy. "Okay, I'm here whenever you want to talk. No pressure. 💙"
- **Using humor to mask pain** → Acknowledge the humor AND the pain underneath. "Haha, that's funny 😄 but I also feel like there's something heavier under that?"

## CONVERSATIONAL INTELLIGENCE

### Emotional Reading (Your Core Skill)
Read what they MEAN, not just what they SAY:
- "I'm fine" = usually NOT fine → "Main sun raha hoon. 'Fine' ke peeche kuch aur bhi hai kya? No pressure."
- "It's not a big deal" = it IS a big deal → Validate: "Chhoti cheez bhi matter karti hai jab wo tumhe affect kare."
- Deflecting with jokes = pain underneath → Gently touch both: "Tu mazaak mein uda raha hai but lagta hai andar se kuch chal raha hai?"
- "Whatever" / "I don't care" = often means they care deeply → "Samajh sakta hoon... kabhi kabhi 'I don't care' bolna easy hota hai jab bahut zyada care karte ho."

### Context Tracking
- Reference earlier parts of the conversation naturally
- Notice patterns: "Tu kai baar work stress ka mention kar raha hai. Lagta hai wo really bhari pad rahi hai."
- Track mood shifts: "Abhi tu thoda halka lag raha hai pehle se. Kya change hua?"

## THERAPEUTIC FRAMEWORK (Use Naturally, Never Force)

### Approach: Validate → Explore → Reflect → Reframe → Empower
1. **VALIDATE** their experience first (this is non-negotiable)
2. **EXPLORE** with open questions to go deeper
3. **REFLECT** their emotions back to show understanding
4. **REFRAME** gently (only after they feel heard)
5. **EMPOWER** them to find their own solutions

### When to Suggest Techniques
- NEVER lead with techniques. Lead with empathy.
- ONLY suggest after the user feels genuinely heard
- ASK permission: "Ek cheez try karna chahega jo help kar sakti hai?" or "Would it help if I walked you through something?"
- If they say no → fully respect it. Stay with them emotionally.

### Tool Markers (for interactive UI elements)
When you suggest a specific therapeutic exercise, include a marker so the app can show an interactive widget:
- For breathing exercises: include [TOOL:breathing] at the end of your message
- For grounding (5-4-3-2-1): include [TOOL:grounding] at the end
- For thought records/CBT: include [TOOL:cbt] at the end
- Only include ONE tool marker per message, and only when genuinely appropriate
- These markers will be hidden from the user and replaced with interactive widgets

## CRISIS SENSITIVITY

If the user expresses suicidal thoughts, self-harm, or extreme hopelessness:
1. Acknowledge their pain with genuine warmth — "Ye bahut heavy hai. Thank you for sharing this with me."
2. Stay present: "Main yahan hoon, tere saath."
3. Gently suggest professional support without being pushy
4. The app automatically shows crisis resources — don't list phone numbers
5. Keep talking: "Kya tu mere saath baat karte rehna chahega?"

## STRICT BOUNDARIES

❌ NEVER: Diagnose, prescribe medication, give medical advice, use toxic positivity ("sab theek ho jayega!"), compare pain ("auron ke paas aur bure haalat hai"), rush to solutions before listening, guilt-trip, or over-reference being an AI.

✅ ALWAYS: Validate emotions, encourage professional help for persistent issues, be honest about limitations when asked, use trauma-informed language, celebrate small wins.

## RESPONSE FORMAT

- **Default**: 2-5 sentences for natural flow
- **Longer**: When guiding through techniques, complex situations, or structured advice
- **Shorter**: Distress moments (be grounding), one-word convos (don't overwhelm)
- **Emojis**: Match their usage. If they use 💙✨, you can too (sparingly). If they don't, keep it minimal.
- **Formatting**: Use numbered lists for advice/steps. Use line breaks for readability. Never use markdown headers in conversation.

Remember: Your purpose is to make every person feel genuinely HEARD, deeply UNDERSTOOD, and quietly EMPOWERED — in THEIR language, in THEIR style, at THEIR pace.`;

/**
 * Sends a message to Groq AI with context-aware prompting
 * Supports streaming for real-time response delivery
 */
export async function sendChatMessage(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    onChunk?: (chunk: string) => void,
    userContext?: string
): Promise<string> {
    try {
        const systemMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [
            { role: 'system' as const, content: EMOTIONAL_SUPPORT_SYSTEM_PROMPT },
        ];

        if (userContext) {
            systemMessages.push({
                role: 'system' as const,
                content: `## USER CONTEXT (use naturally, never quote directly)\n${userContext}`,
            });
        }

        const fullMessages = [...systemMessages, ...messages];

        const trimmedMessages = [
            ...fullMessages.slice(0, systemMessages.length),
            ...fullMessages.slice(systemMessages.length).slice(-20),
        ];

        const stream = await groq.chat.completions.create({
            messages: trimmedMessages,
            model: CHAT_MODEL,
            temperature: 0.78,
            max_tokens: 1000,
            top_p: 0.92,
            frequency_penalty: 0.3,
            presence_penalty: 0.2,
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
    } catch (error: any) {
        console.error('Groq API error:', error);

        if (error?.status === 429) {
            return "Abhi thoda busy hoon, ek minute mein phir try karo. Main hoon yahan. 💙";
        }

        throw new Error('Failed to get AI response. Please try again.');
    }
}

/**
 * Sends a streaming chat response via SSE-compatible chunks
 * Returns an async generator that yields text chunks
 */
export async function* streamChatMessage(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    userContext?: string
): AsyncGenerator<string, void, unknown> {
    const systemMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [
        { role: 'system' as const, content: EMOTIONAL_SUPPORT_SYSTEM_PROMPT },
    ];

    if (userContext) {
        systemMessages.push({
            role: 'system' as const,
            content: `## USER CONTEXT (use naturally, never quote directly)\n${userContext}`,
        });
    }

    const fullMessages = [...systemMessages, ...messages];
    const trimmedMessages = [
        ...fullMessages.slice(0, systemMessages.length),
        ...fullMessages.slice(systemMessages.length).slice(-20),
    ];

    const stream = await groq.chat.completions.create({
        messages: trimmedMessages,
        model: CHAT_MODEL,
        temperature: 0.78,
        max_tokens: 1000,
        top_p: 0.92,
        frequency_penalty: 0.3,
        presence_penalty: 0.2,
        stream: true,
    });

    for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
            yield content;
        }
    }
}

/**
 * Analyzes sentiment — multilingual aware
 */
export async function analyzeSentiment(text: string): Promise<{
    score: number;
    label: 'positive' | 'neutral' | 'negative' | 'crisis';
    confidence: number;
}> {
    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are a sentiment analysis system for a mental health app. Analyze the emotional tone of the user's message. The message may be in ANY language (Hindi, Gujarati, Tamil, English, Hinglish, etc.) — understand it regardless.

RESPOND WITH ONLY A JSON OBJECT, no other text:
{"score": <number from -1 to 1>, "label": "<positive|neutral|negative|crisis>", "confidence": <number from 0 to 1>}

Scoring guide:
- crisis: Active suicidal ideation, self-harm mentions, wanting to die (-1 to -0.8)
- negative: Sadness, frustration, anxiety, anger, hopelessness (-0.8 to -0.2)
- neutral: Factual statements, greetings, mild emotions (-0.2 to 0.2)
- positive: Joy, gratitude, hope, progress, relief (0.2 to 1)

Be sensitive to subtle distress signals in ALL languages. When in doubt between negative and crisis, lean toward negative.`,
                },
                {
                    role: 'user',
                    content: text,
                },
            ],
            model: ANALYSIS_MODEL,
            temperature: 0.1,
            max_tokens: 80,
        });

        const result = response.choices[0]?.message?.content || '{}';

        const jsonMatch = result.match(/\{[\s\S]*?\}/);
        if (!jsonMatch) {
            console.warn('Sentiment analysis returned non-JSON:', result);
            return { score: 0, label: 'neutral', confidence: 0.3 };
        }

        const parsed = JSON.parse(jsonMatch[0]);

        const score = Math.max(-1, Math.min(1, Number(parsed.score) || 0));
        const confidence = Math.max(0, Math.min(1, Number(parsed.confidence) || 0.5));
        const validLabels = ['positive', 'neutral', 'negative', 'crisis'] as const;
        const label = validLabels.includes(parsed.label) ? parsed.label : 'neutral';

        return { score, label, confidence };
    } catch (error) {
        console.error('Sentiment analysis error:', error);
        return { score: 0, label: 'neutral', confidence: 0 };
    }
}

/**
 * Generates a conversation summary for long sessions
 */
export async function summarizeConversation(
    messages: Array<{ role: string; content: string }>
): Promise<string> {
    try {
        const conversationText = messages
            .map(m => `${m.role}: ${m.content}`)
            .join('\n');

        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `Summarize this mental health conversation in 3-5 sentences. The conversation may be in any language — summarize in English. Focus on:
1. Key emotions the user expressed
2. Main topics/concerns discussed
3. Any coping strategies suggested or tried
4. The emotional trajectory (did they feel better/worse by the end?)
5. Any important context for future conversations

Be concise but capture the emotional essence.`,
                },
                {
                    role: 'user',
                    content: conversationText,
                },
            ],
            model: ANALYSIS_MODEL,
            temperature: 0.3,
            max_tokens: 250,
        });

        return response.choices[0]?.message?.content?.trim() || '';
    } catch (error) {
        console.error('Conversation summary error:', error);
        return '';
    }
}

/**
 * Generates an end-of-session wellness summary
 */
export async function generateSessionSummary(
    messages: Array<{ role: string; content: string }>,
    sentimentHistory: Array<{ score: number; label: string }>
): Promise<{
    emotionalJourney: string;
    keyThemes: string[];
    takeaway: string;
    suggestedAction: string;
}> {
    try {
        const conversationText = messages
            .map(m => `${m.role}: ${m.content}`)
            .join('\n');

        const sentimentSummary = sentimentHistory
            .map((s, i) => `Message ${i + 1}: ${s.label} (${s.score})`)
            .join(', ');

        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are analyzing a mental health support session. Generate a wellness summary. Respond in JSON only:

{
  "emotionalJourney": "Brief 1-2 sentence description of the emotional arc (e.g., 'Started feeling anxious, gradually opened up and found some relief')",
  "keyThemes": ["theme1", "theme2", "theme3"],
  "takeaway": "One encouraging, warm takeaway message for the user (in the same language they predominantly used)",
  "suggestedAction": "One specific, actionable next step (e.g., 'Try the 4-7-8 breathing exercise before bed tonight')"
}`,
                },
                {
                    role: 'user',
                    content: `Conversation:\n${conversationText}\n\nSentiment progression: ${sentimentSummary}`,
                },
            ],
            model: ANALYSIS_MODEL,
            temperature: 0.4,
            max_tokens: 300,
        });

        const result = response.choices[0]?.message?.content || '{}';
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return {
                emotionalJourney: 'Your conversation today was meaningful.',
                keyThemes: ['Self-reflection'],
                takeaway: 'You showed courage by opening up. That matters. 💙',
                suggestedAction: 'Take a few deep breaths before continuing your day.',
            };
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Session summary generation error:', error);
        return {
            emotionalJourney: 'Your conversation today was meaningful.',
            keyThemes: ['Self-reflection'],
            takeaway: 'You showed courage by opening up. That matters. 💙',
            suggestedAction: 'Take a few deep breaths before continuing your day.',
        };
    }
}
