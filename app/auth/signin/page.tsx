'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Mail, Lock, UserX, Loader2, Eye, EyeOff } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { FloatingElement } from '@/components/ui/FloatingElement';

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid email or password');
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnonymous = async () => {
        setIsLoading(true);
        try {
            const result = await signIn('credentials', {
                isAnonymous: 'true',
                redirect: false,
            });

            if (result?.ok) {
                router.push('/chat');
            }
        } catch (err) {
            setError('Failed to create anonymous session');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-calm-50 via-white to-peace-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Floating Background Elements */}
            <FloatingElement
                className="top-10 left-10"
                variant="circle"
                size="lg"
                color="from-calm-300/30 to-peace-300/30"
                delay={0}
            />
            <FloatingElement
                className="top-40 right-20"
                variant="blob"
                size="xl"
                color="from-peace-300/20 to-soothe-300/20"
                delay={2}
            />
            <FloatingElement
                className="bottom-20 left-1/4"
                variant="circle"
                size="md"
                color="from-soothe-300/25 to-calm-300/25"
                delay={4}
            />

            {/* Main Content */}
            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-calm-500 to-peace-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow">
                        <Heart className="w-7 h-7 text-white" fill="white" />
                    </div>
                    <span className="text-3xl font-bold gradient-text">HealthEase</span>
                </Link>

                {/* Signin Card */}
                <GlassCard className="p-8 animate-fadeInUp">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Sign in to continue your wellness journey
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSignIn} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-calm-500 dark:focus:border-calm-400 focus:ring-4 focus:ring-calm-500/20 transition-all outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-calm-500 dark:focus:border-calm-400 focus:ring-4 focus:ring-calm-500/20 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-calm-600 to-peace-600 hover:from-calm-700 hover:to-peace-700 text-white font-semibold shadow-lg hover:shadow-glow transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                Or continue as
                            </span>
                        </div>
                    </div>

                    {/* Anonymous Button */}
                    <button
                        onClick={handleAnonymous}
                        disabled={isLoading}
                        className="w-full py-3 px-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-calm-400 dark:hover:border-calm-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                        <UserX className="w-5 h-5" />
                        Anonymous User
                    </button>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                        Don't have an account?{' '}
                        <Link href="/auth/signup" className="text-calm-600 dark:text-calm-400 hover:text-calm-700 dark:hover:text-calm-300 font-semibold transition-colors">
                            Sign up
                        </Link>
                    </p>
                </GlassCard>

                {/* Privacy Note */}
                <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-6">
                    Your data is encrypted and secure. We prioritize your privacy.
                </p>
            </div>
        </div>
    );
}
