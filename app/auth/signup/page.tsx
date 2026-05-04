'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Mail, Lock, Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Password strength indicators
    const passwordChecks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        match: password === confirmPassword && confirmPassword.length > 0,
    };

    const allChecksPassed = Object.values(passwordChecks).every(Boolean);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!allChecksPassed) {
            toast.error('Please meet all password requirements');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Account created! Redirecting to sign in...');
                setTimeout(() => router.push('/auth/signin'), 1500);
            } else {
                toast.error(data.error || 'Failed to create account');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const CheckItem = ({ passed, label }: { passed: boolean; label: string }) => (
        <div className={`flex items-center gap-2 text-xs transition-all ${passed ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
            {passed ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
            {label}
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-calm-50 via-peace-50 to-soothe-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-peace-300/20 dark:bg-peace-600/10 blur-3xl animate-float" />
                <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-soothe-300/20 dark:bg-soothe-600/10 blur-3xl animate-float-slow" />
            </div>

            <div className="w-full max-w-md relative z-10 animate-fadeInUp">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-calm-500 to-peace-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow">
                            <Heart className="w-7 h-7 text-white" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold gradient-text mt-4">Create Account</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Join your safe space for mental wellness</p>
                </div>

                <Card className="glass-card border border-white/20 dark:border-gray-700/50 shadow-glass-lg">
                    <CardContent className="p-6">
                        <form onSubmit={handleSignUp} className="space-y-4">
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
                                        placeholder="Create a strong password"
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

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your password"
                                        className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Strength */}
                            {password.length > 0 && (
                                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-1.5 animate-fadeIn">
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Password requirements:</p>
                                    <CheckItem passed={passwordChecks.length} label="At least 8 characters" />
                                    <CheckItem passed={passwordChecks.uppercase} label="One uppercase letter" />
                                    <CheckItem passed={passwordChecks.lowercase} label="One lowercase letter" />
                                    <CheckItem passed={passwordChecks.number} label="One number" />
                                    {confirmPassword.length > 0 && (
                                        <CheckItem passed={passwordChecks.match} label="Passwords match" />
                                    )}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading || !allChecksPassed}
                                className="w-full bg-gradient-to-r from-calm-600 to-peace-600 hover:from-calm-700 hover:to-peace-700 text-white shadow-lg hover:shadow-glow transition-all disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating Account...</>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </form>

                        {/* Sign In Link */}
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                            Already have an account?{' '}
                            <Link href="/auth/signin" className="text-calm-600 dark:text-calm-400 font-medium hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </CardContent>
                </Card>

                {/* Security Note */}
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    Your data is encrypted with AES-256 encryption
                </p>
            </div>
        </div>
    );
}
