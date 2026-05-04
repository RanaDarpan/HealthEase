'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Mail, Lock, Eye, EyeOff, UserX, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAnonymousLoading, setIsAnonymousLoading] = useState(false);
    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error('Invalid email or password');
            } else {
                toast.success('Welcome back! 💙');
                router.push('/dashboard');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnonymousLogin = async () => {
        setIsAnonymousLoading(true);

        try {
            const result = await signIn('credentials', {
                anonymous: 'true',
                redirect: false,
            });

            if (result?.error) {
                toast.error('Failed to start anonymous session');
            } else {
                toast.success('Anonymous session started');
                router.push('/dashboard');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsAnonymousLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-calm-50 via-peace-50 to-soothe-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-calm-300/20 dark:bg-calm-600/10 blur-3xl animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-peace-300/20 dark:bg-peace-600/10 blur-3xl animate-float-slow" />
            </div>

            <div className="w-full max-w-md relative z-10 animate-fadeInUp">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-calm-500 to-peace-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow">
                            <Heart className="w-7 h-7 text-white" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold gradient-text mt-4">Welcome Back</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your safe space</p>
                </div>

                <Card className="glass-card border border-white/20 dark:border-gray-700/50 shadow-glass-lg">
                    <CardContent className="p-6 space-y-6">
                        <form onSubmit={handleSignIn} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-calm-600 to-peace-600 hover:from-calm-700 hover:to-peace-700 text-white shadow-lg hover:shadow-glow transition-all"
                            >
                                {isLoading ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing In...</>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-white/70 dark:bg-gray-800/70 text-gray-500 dark:text-gray-400 backdrop-blur-sm">
                                    or continue anonymously
                                </span>
                            </div>
                        </div>

                        {/* Anonymous Login */}
                        <Button
                            onClick={handleAnonymousLogin}
                            disabled={isAnonymousLoading}
                            variant="outline"
                            className="w-full border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-calm-400 dark:hover:border-calm-500 hover:text-calm-700 dark:hover:text-calm-400 transition-all"
                        >
                            {isAnonymousLoading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Starting session...</>
                            ) : (
                                <><UserX className="w-4 h-4 mr-2" /> Stay Anonymous</>
                            )}
                        </Button>

                        {/* Sign Up Link */}
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link href="/auth/signup" className="text-calm-600 dark:text-calm-400 font-medium hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </CardContent>
                </Card>

                {/* Security Note */}
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    Your data is encrypted and private
                </p>
            </div>
        </div>
    );
}
