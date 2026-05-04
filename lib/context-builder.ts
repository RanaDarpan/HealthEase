import { connectDB } from './db';
import MoodEntry from '@/models/MoodEntry';
import ChatSession from '@/models/ChatSession';
import { decrypt } from './encryption';
import mongoose from 'mongoose';

/**
 * Context Builder for Mental Health Chatbot
 * 
 * Builds rich context from user's mood history, past conversations,
 * and detected patterns to provide personalized, context-aware responses
 */

export interface UserContext {
    moodSummary: {
        recentMoods: Array<{
            score: number;
            date: Date;
            notes?: string;
            triggers?: string[];
        }>;
        averageMood: number;
        moodTrend: 'improving' | 'declining' | 'stable';
        lowestMood?: {
            score: number;
            date: Date;
        };
    };
    conversationSummary: {
        totalSessions: number;
        lastSessionDate?: Date;
        commonTopics: string[];
        crisisHistory: number;
    };
    patterns: {
        commonTriggers: string[];
        commonActivities: string[];
        timeOfDayPatterns?: string;
    };
}

/**
 * Build comprehensive context for the chatbot
 */
export async function buildUserContext(userId: string): Promise<UserContext> {
    await connectDB();

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Get recent mood entries (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentMoodEntries = await MoodEntry.find({
        userId: userObjectId,
        createdAt: { $gte: sevenDaysAgo },
    })
        .sort({ createdAt: -1 })
        .limit(14)
        .lean();

    // Get chat sessions for conversation history
    const chatSessions = await ChatSession.find({
        userId: userObjectId,
    })
        .sort({ lastMessageAt: -1 })
        .limit(5)
        .lean();

    // Build mood summary
    const moodSummary = buildMoodSummary(recentMoodEntries);

    // Build conversation summary
    const conversationSummary = buildConversationSummary(chatSessions);

    // Detect patterns
    const patterns = detectPatterns(recentMoodEntries);

    return {
        moodSummary,
        conversationSummary,
        patterns,
    };
}

/**
 * Build mood summary from recent entries
 */
function buildMoodSummary(moodEntries: any[]): UserContext['moodSummary'] {
    if (moodEntries.length === 0) {
        return {
            recentMoods: [],
            averageMood: 0,
            moodTrend: 'stable',
        };
    }

    const recentMoods = moodEntries.map(entry => ({
        score: entry.moodScore,
        date: entry.createdAt,
        notes: entry.notes ? tryDecrypt(entry.notes) : undefined,
        triggers: entry.triggers,
    }));

    // Calculate average mood
    const averageMood = recentMoods.reduce((sum, m) => sum + m.score, 0) / recentMoods.length;

    // Determine trend (compare first half to second half)
    const moodTrend = calculateMoodTrend(recentMoods);

    // Find lowest mood
    const lowestMood = recentMoods.reduce((lowest, current) => 
        current.score < lowest.score ? current : lowest
    );

    return {
        recentMoods,
        averageMood: Math.round(averageMood * 10) / 10,
        moodTrend,
        lowestMood: {
            score: lowestMood.score,
            date: lowestMood.date,
        },
    };
}

/**
 * Calculate mood trend
 */
function calculateMoodTrend(moods: any[]): 'improving' | 'declining' | 'stable' {
    if (moods.length < 4) return 'stable';

    const midpoint = Math.floor(moods.length / 2);
    const recentHalf = moods.slice(0, midpoint);
    const olderHalf = moods.slice(midpoint);

    const recentAvg = recentHalf.reduce((sum, m) => sum + m.score, 0) / recentHalf.length;
    const olderAvg = olderHalf.reduce((sum, m) => sum + m.score, 0) / olderHalf.length;

    const difference = recentAvg - olderAvg;

    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
}

/**
 * Build conversation summary from chat sessions
 */
function buildConversationSummary(sessions: any[]): UserContext['conversationSummary'] {
    const totalSessions = sessions.length;
    const lastSessionDate = sessions.length > 0 ? sessions[0].lastMessageAt : undefined;

    // Count crisis occurrences
    const crisisHistory = sessions.reduce((sum, s) => sum + (s.crisisCount || 0), 0);

    // Extract common topics (simplified - could be enhanced with NLP)
    const commonTopics: string[] = [];

    return {
        totalSessions,
        lastSessionDate,
        commonTopics,
        crisisHistory,
    };
}

/**
 * Detect patterns from mood entries
 */
function detectPatterns(moodEntries: any[]): UserContext['patterns'] {
    // Aggregate triggers
    const triggerCounts: { [key: string]: number } = {};
    const activityCounts: { [key: string]: number } = {};

    moodEntries.forEach(entry => {
        entry.triggers?.forEach((trigger: string) => {
            triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
        });

        entry.activities?.forEach((activity: string) => {
            activityCounts[activity] = (activityCounts[activity] || 0) + 1;
        });
    });

    // Get top 3 triggers and activities
    const commonTriggers = Object.entries(triggerCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([trigger]) => trigger);

    const commonActivities = Object.entries(activityCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([activity]) => activity);

    return {
        commonTriggers,
        commonActivities,
    };
}

/**
 * Try to decrypt, return empty string if fails
 */
function tryDecrypt(encrypted: string): string | undefined {
    try {
        return decrypt(encrypted);
    } catch {
        return undefined;
    }
}

/**
 * Generate context prompt for AI
 */
export function generateContextPrompt(context: UserContext): string {
    const parts: string[] = [];

    // Mood context
    if (context.moodSummary.recentMoods.length > 0) {
        const { averageMood, moodTrend, lowestMood } = context.moodSummary;
        
        parts.push(`MOOD CONTEXT:`);
        parts.push(`- Average mood (last 7 days): ${averageMood}/10`);
        parts.push(`- Trend: ${moodTrend}`);
        
        if (lowestMood && lowestMood.score <= 4) {
            const daysAgo = Math.floor((Date.now() - lowestMood.date.getTime()) / (1000 * 60 * 60 * 24));
            parts.push(`- Lowest mood: ${lowestMood.score}/10 (${daysAgo} days ago)`);
        }

        // Recent mood note highlights
        const recentMoodWithNotes = context.moodSummary.recentMoods
            .filter(m => m.notes)
            .slice(0, 2);
        
        if (recentMoodWithNotes.length > 0) {
            parts.push(`- Recent concerns: "${recentMoodWithNotes[0].notes}"`);
        }
    }

    // Conversation history
    if (context.conversationSummary.totalSessions > 0) {
        parts.push(`\nCONVERSATION HISTORY:`);
        parts.push(`- Previous sessions: ${context.conversationSummary.totalSessions}`);
        
        if (context.conversationSummary.lastSessionDate) {
            const daysAgo = Math.floor(
                (Date.now() - context.conversationSummary.lastSessionDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            
            if (daysAgo === 0) {
                parts.push(`- Last chat: Earlier today`);
            } else if (daysAgo === 1) {
                parts.push(`- Last chat: Yesterday`);
            } else if (daysAgo < 7) {
                parts.push(`- Last chat: ${daysAgo} days ago`);
            }
        }

        if (context.conversationSummary.crisisHistory > 0) {
            parts.push(`- ⚠️ Past crisis indicators: ${context.conversationSummary.crisisHistory}`);
        }
    }

    // Patterns
    if (context.patterns.commonTriggers.length > 0) {
        parts.push(`\nUSER PATTERNS:`);
        parts.push(`- Common triggers: ${context.patterns.commonTriggers.join(', ')}`);
    }

    if (context.patterns.commonActivities.length > 0) {
        parts.push(`- Helpful activities: ${context.patterns.commonActivities.join(', ')}`);
    }

    if (parts.length === 0) {
        return ''; // No context available
    }

    return '\n' + parts.join('\n') + '\n';
}
