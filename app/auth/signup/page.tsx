'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Mail, Lock, UserX, Loader2, Eye, EyeOff, Check } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { FloatingElement } from '@/components/ui/FloatingElement';

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            // Create account
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to create account');
                return;
            }

            // Auto sign in after successful signup
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setError('Account created but sign in failed. Please try signing in manually.');
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

    const passwordStrength = (password: string) => {
        if (password.length === 0) return { strength: 0, label: '', color: '' };
        if (password.length < 6) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
        if (password.length < 10) return { strength: 2, label: 'Fair', color: 'bg-yellow-500' };
        if (password.length < 14) return { strength: 3, label: 'Good', color: 'bg-blue-500' };
        return { strength: 4, label: 'Strong', color: 'bg-green-500' };
    };

    const strength = passwordStrength(formData.password);

    return (
        <div className="min-h-screen bg-gradient-to-br from-calm-50 via-white to-peace-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Floating Background Elements */}
            <FloatingElement
                className="top-10 right-10"
                variant="blob"
                size="lg"
                color="from-calm-300/30 to-peace-300/30"
                delay={0}
            />
            <FloatingElement
                className="top-40 left-20"
                variant="circle"
                size="xl"
                color="from-peace-300/20 to-soothe-300/20"
                delay={2}
            />
            <FloatingElement
                className="bottom-20 right-1/4"
                variant="blob"
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

                {/* Signup Card */}
                <GlassCard className="p-8 animate-fadeInUp">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Create Account
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Start your wellness journey today
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSignUp} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength={6}
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
                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded-full transition-all ${level <= strength.strength ? strength.color : 'bg-gray-200 dark:bg-gray-700'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{strength.label}</p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                    className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-calm-500 dark:focus:border-calm-400 focus:ring-4 focus:ring-calm-500/20 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                <p className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Passwords match
                                </p>
                            )}
                        </div>

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-calm-600 to-peace-600 hover:from-calm-700 hover:to-peace-700 text-white font-semibold shadow-lg hover:shadow-glow transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
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

                    {/* Sign In Link */}
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                        Already have an account?{' '}
                        <Link href="/auth/signin" className="text-calm-600 dark:text-calm-400 hover:text-calm-700 dark:hover:text-calm-300 font-semibold transition-colors">
                            Sign in
                        </Link>
                    </p>
                </GlassCard>

                {/* Privacy Note */}
                <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-6">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
