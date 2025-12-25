import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { encrypt, decrypt } from '@/lib/encryption';
import JournalEntry from '@/models/JournalEntry';
import User from '@/models/User';

/**
 * POST /api/journal
 * Create a new journal entry
 */
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const body = await req.json();
        const { title, content, mood, tags, gratitude, challenges, wins } = body;

        if (!title || !content || !mood) {
            return NextResponse.json(
                { error: 'Title, content, and mood are required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Update user's last active time
        await User.findByIdAndUpdate(userId, { lastActive: new Date() });

        // Encrypt content
        const encryptedContent = encrypt(content);

        // Create journal entry
        const entry = await JournalEntry.create({
            userId,
            title,
            content: encryptedContent,
            mood: parseInt(mood),
            tags: tags || [],
            gratitude: gratitude || [],
            challenges: challenges || [],
            wins: wins || [],
            isPrivate: true,
        });

        return NextResponse.json({
            success: true,
            entry: {
                id: entry._id,
                title: entry.title,
                mood: entry.mood,
                tags: entry.tags,
                createdAt: entry.createdAt,
            },
        });

    } catch (error) {
        console.error('Journal entry API error:', error);
        return NextResponse.json(
            { error: 'Failed to save journal entry' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/journal
 * Get journal entries for the current user
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
        const limit = parseInt(searchParams.get('limit') || '50');

        await connectDB();

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const entries = await JournalEntry.find({
            userId,
            createdAt: { $gte: startDate },
        })
            .sort({ createdAt: -1 })
            .limit(limit);

        // Decrypt content
        const decryptedEntries = entries.map(entry => ({
            id: entry._id,
            title: entry.title,
            content: decrypt(entry.content),
            mood: entry.mood,
            tags: entry.tags,
            gratitude: entry.gratitude,
            challenges: entry.challenges,
            wins: entry.wins,
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt,
        }));

        return NextResponse.json({
            entries: decryptedEntries,
            total: entries.length,
        });

    } catch (error) {
        console.error('Journal fetch API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch journal entries' },
            { status: 500 }
        );
    }
}
