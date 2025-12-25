import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from './db';
import User from '@/models/User';
import { generateToken } from './encryption';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
                isAnonymous: { label: 'Anonymous', type: 'text' },
            },
            async authorize(credentials) {
                try {
                    await connectDB();

                    if (credentials?.isAnonymous === 'true') {
                        const anonymousId = generateToken(16);
                        const user = await User.create({
                            anonymousMode: true,
                            anonymousId,
                            lastActive: new Date(),
                        });

                        return {
                            id: user._id.toString(),
                            email: null,
                            name: 'Anonymous User',
                            anonymousMode: true,
                        };
                    }

                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    const user = await User.findOne({ email: credentials.email }).select('+password');

                    if (!user) {
                        return null;
                    }

                    const isValid = await user.comparePassword(credentials.password);

                    if (!isValid) {
                        return null;
                    }

                    user.lastActive = new Date();
                    await user.save();

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.email,
                        anonymousMode: user.anonymousMode,
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.anonymousMode = (user as any).anonymousMode;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).anonymousMode = token.anonymousMode;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};
