import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { hash } from '@/lib/encryption';
import CrisisLog from '@/models/CrisisLog';

/**
 * POST /api/crisis/log
 * Log a crisis event action (e.g., user called helpline)
 */
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { sessionId, action } = body;

        if (!sessionId || !action) {
            return NextResponse.json(
                { error: 'Session ID and action are required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Update the crisis log with user action
        const updated = await CrisisLog.findOneAndUpdate(
            { sessionId },
            { userAction: action },
            { new: true, sort: { timestamp: -1 } }
        );

        if (!updated) {
            return NextResponse.json(
                { error: 'Crisis log not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Crisis log API error:', error);
        return NextResponse.json(
            { error: 'Failed to log crisis action' },
            { status: 500 }
        );
    }
}
