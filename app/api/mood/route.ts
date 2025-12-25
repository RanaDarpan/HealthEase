import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { encrypt, decrypt } from '@/lib/encryption';
import { analyzeSentiment } from '@/lib/groq';
import MoodEntry from '@/models/MoodEntry';
import User from '@/models/User';

/**
 * POST /api/mood
 * Create a new mood entry
 */
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const body = await req.json();
        const { moodScore, notes, triggers, activities } = body;

        // Validate mood score
        if (!moodScore || moodScore < 1 || moodScore > 10) {
            return NextResponse.json(
                { error: 'Mood score must be between 1 and 10' },
                { status: 400 }
            );
        }

        await connectDB();

        // Update user's last active time
        await User.findByIdAndUpdate(userId, { lastActive: new Date() });

        // Analyze sentiment if notes provided
        let detectedSentiment;
        if (notes && notes.trim()) {
            detectedSentiment = await analyzeSentiment(notes);
        }

        // Encrypt notes
        const encryptedNotes = notes ? encrypt(notes) : undefined;

        // Create mood entry
        const moodEntry = await MoodEntry.create({
            userId,
            moodScore: parseInt(moodScore),
            notes: encryptedNotes,
            detectedSentiment,
            triggers: triggers || [],
            activities: activities || [],
            createdAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            moodEntry: {
                id: moodEntry._id,
                moodScore: moodEntry.moodScore,
                triggers: moodEntry.triggers,
                activities: moodEntry.activities,
                detectedSentiment: moodEntry.detectedSentiment,
                createdAt: moodEntry.createdAt,
            },
        });

    } catch (error) {
        console.error('Mood entry API error:', error);
        return NextResponse.json(
            { error: 'Failed to save mood entry' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/mood
 * Get mood history for the current user
 */
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { searchParams } = new URL(req.url);
        const days = parseInt(searchParams.get('days') || '30');

        await connectDB();

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const moodEntries = await MoodEntry.find({
            userId,
            createdAt: { $gte: startDate },
        }).sort({ createdAt: -1 });

        // Decrypt notes
        const decryptedEntries = moodEntries.map(entry => ({
            id: entry._id,
            moodScore: entry.moodScore,
            notes: entry.notes ? decrypt(entry.notes) : null,
            detectedSentiment: entry.detectedSentiment,
            triggers: entry.triggers,
            activities: entry.activities,
            context: entry.context,
            createdAt: entry.createdAt,
        }));

        // Calculate statistics
        const avgMood = decryptedEntries.length > 0
            ? decryptedEntries.reduce((sum, e) => sum + e.moodScore, 0) / decryptedEntries.length
            : 0;

        const moodTrend = decryptedEntries.length >= 7
            ? calculateTrend(decryptedEntries.slice(0, 7))
            : 'insufficient_data';

        return NextResponse.json({
            entries: decryptedEntries,
            stats: {
                averageMood: Math.round(avgMood * 10) / 10,
                totalEntries: decryptedEntries.length,
                trend: moodTrend,
            },
        });

    } catch (error) {
        console.error('Mood history API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch mood history' },
            { status: 500 }
        );
    }
}

// Helper function to calculate mood trend
function calculateTrend(entries: any[]): 'improving' | 'stable' | 'declining' {
    const recent = entries.slice(0, 3).reduce((sum, e) => sum + e.moodScore, 0) / 3;
    const older = entries.slice(3, 7).reduce((sum, e) => sum + e.moodScore, 0) / 4;

    const diff = recent - older;

    if (diff > 0.5) return 'improving';
    if (diff < -0.5) return 'declining';
    return 'stable';
}
