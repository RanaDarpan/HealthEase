import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { decrypt } from '@/lib/encryption';
import ChatSession from '@/models/ChatSession';

/**
 * GET /api/chat/history
 * Get chat history for the current user
 */
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId');
        const limit = parseInt(searchParams.get('limit') || '50');

        await connectDB();

        let query: any = { userId };
        if (sessionId) {
            query.sessionId = sessionId;
        }

        const sessions = await ChatSession.find(query)
            .sort({ lastMessageAt: -1 })
            .limit(10);

        // Decrypt messages
        const decryptedSessions = sessions.map(session => {
            const messages = session.messages
                .slice(-limit)
                .map(msg => {
                    try {
                        return {
                            role: msg.role,
                            content: decrypt(msg.content),
                            sentiment: msg.sentiment,
                            crisisDetected: msg.crisisDetected,
                            timestamp: msg.timestamp,
                        };
                    } catch (error) {
                        console.error('Failed to decrypt message:', error);
                        return null;
                    }
                })
                .filter(msg => msg !== null);

            return {
                sessionId: session.sessionId,
                messages,
                startedAt: session.startedAt,
                lastMessageAt: session.lastMessageAt,
                crisisCount: session.crisisCount,
                averageSentiment: session.averageSentiment,
            };
        });

        return NextResponse.json({ sessions: decryptedSessions });

    } catch (error) {
        console.error('Chat history API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch chat history' },
            { status: 500 }
        );
    }
}
