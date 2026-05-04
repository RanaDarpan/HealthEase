'use client';

import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { FloatingElement } from '@/components/ui/FloatingElement';
import {
    MessageCircle, Wind, Heart, Shield, Lock, UserX, Sparkles,
    TrendingUp, Users, Clock, BookOpen, Activity, Zap,
    CheckCircle, ChevronDown, Mail, Phone, MapPin, Github,
    Twitter, Linkedin, ArrowRight, Play, Star, X
} from 'lucide-react';
import { useState, useEffect } from 'react';

const features = [
    {
        icon: MessageCircle,
        title: 'AI Chat Companion',
        description: 'Talk to a compassionate AI trained to listen and support. Available instantly, anytime you need with emoji and voice support.',
        gradient: 'from-calm-500 to-calm-600',
        bgGradient: 'from-calm-50 to-calm-100/50',
        delay: 0,
    },
    {
        icon: Heart,
        title: 'Mood Tracking',
        description: 'Track your emotional wellbeing over time. Identify patterns, celebrate progress, and gain insights into your mental health journey.',
        gradient: 'from-peace-500 to-peace-600',
        bgGradient: 'from-peace-50 to-peace-100/50',
        delay: 0.15,
    },
    {
        icon: Wind,
        title: 'Breathing Exercises',
        description: 'Science-backed breathing techniques to reduce anxiety and find calm in moments of stress with guided audio.',
        gradient: 'from-soothe-500 to-soothe-600',
        bgGradient: 'from-soothe-50 to-soothe-100/50',
        delay: 0.3,
    },
    {
        icon: BookOpen,
        title: 'Personal Journal',
        description: 'Express yourself freely in a private, encrypted journal. Write, reflect, and track your growth over time.',
        gradient: 'from-purple-500 to-purple-600',
        bgGradient: 'from-purple-50 to-purple-100/50',
        delay: 0.45,
    },
    {
        icon: Activity,
        title: 'Progress Dashboard',
        description: 'Visualize your wellness journey with detailed analytics, insights, and personalized recommendations.',
        gradient: 'from-blue-500 to-blue-600',
        bgGradient: 'from-blue-50 to-blue-100/50',
        delay: 0.6,
    },
    {
        icon: Shield,
        title: 'Crisis Detection',
        description: 'Automatic crisis detection with immediate access to helplines and emergency resources when you need them most.',
        gradient: 'from-red-500 to-red-600',
        bgGradient: 'from-red-50 to-red-100/50',
        delay: 0.75,
    },
];

const testimonials = [
    {
        name: 'Sarah M.',
        role: 'College Student',
        content: 'MindEase has been a lifeline during stressful times. The anonymous chat feature lets me open up without fear of judgment.',
        avatar: '👩‍🎓',
        rating: 5,
    },
    {
        name: 'James K.',
        role: 'Software Engineer',
        content: 'The breathing exercises and mood tracking have genuinely improved my daily anxiety. Best mental health app I\'ve used!',
        avatar: '👨‍💻',
        rating: 5,
    },
    {
        name: 'Maria L.',
        role: 'Healthcare Worker',
        content: 'As a healthcare worker, having 24/7 anonymous support has been invaluable. The AI companion really understands and helps.',
        avatar: '👩‍⚕️',
        rating: 5,
    },
];

const faqs = [
    {
        question: 'Is MindEase really anonymous?',
        answer: 'Yes! You can use MindEase completely anonymously without creating an account. No email required, no personal information collected. Your privacy is our top priority.',
    },
    {
        question: 'How does the AI chat work?',
        answer: 'Our AI companion uses advanced natural language processing to provide empathetic, supportive responses. It\'s trained on mental health best practices but is not a replacement for professional therapy.',
    },
    {
        question: 'Is my data secure?',
        answer: 'Absolutely. All conversations and mood data are encrypted with AES-256 encryption. Your data is never shared with third parties and you can delete it anytime.',
    },
    {
        question: 'Can MindEase replace therapy?',
        answer: 'No. MindEase is a supportive tool for daily mental wellness, not a replacement for professional mental health care. If you\'re in crisis, please contact emergency services or a crisis helpline.',
    },
    {
        question: 'Is MindEase free?',
        answer: 'Yes! MindEase is completely free to use. We believe mental health support should be accessible to everyone, anytime they need it.',
    },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <GlassCard className="p-6 cursor-pointer hover:shadow-glow transition-shadow" onClick={() => setIsOpen(!isOpen)}>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{question}</h3>
                <ChevronDown className={`w-5 h-5 text-calm-600 dark:text-calm-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed animate-fadeIn">
                    {answer}
                </p>
            )}
        </GlassCard>
    );
}

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-calm-50 via-white to-peace-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
            {/* Floating Background Elements */}
            <FloatingElement
                className="top-20 left-10"
                variant="circle"
                size="lg"
                color="from-calm-300/20 to-peace-300/20"
                delay={0}
            />
            <FloatingElement
                className="top-40 right-20"
                variant="blob"
                size="xl"
                color="from-peace-300/15 to-soothe-300/15"
                delay={2}
            />
            <FloatingElement
                className="bottom-20 left-1/4"
                variant="circle"
                size="md"
                color="from-soothe-300/20 to-calm-300/20"
                delay={4}
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4">
                <div className="container mx-auto text-center">
                    <div className="animate-fadeInUp">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 animate-float">
                            <Sparkles className="w-4 h-4 text-calm-600 dark:text-calm-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Ease Your Mind
                            </span>
                        </div>

                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-calm-500 via-peace-500 to-soothe-500 mb-8 animate-float shadow-glow-lg">
                            <Heart className="w-12 h-12 text-white" fill="white" />
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                            Your Mental Wellness,{' '}
                            <span className="gradient-text block mt-2">
                                Simplified & Secure
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                            Anonymous, AI-powered mental health support available 24/7.
                            <span className="block mt-2 font-semibold text-calm-600 dark:text-calm-400">
                                Chat • Track • Breathe • Heal
                            </span>
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center mb-8">
                            <Link
                                href="/chat"
                                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-calm-600 to-peace-600 text-white font-semibold rounded-2xl transition-all shadow-lg hover:shadow-glow transform hover:scale-105 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-peace-600 to-soothe-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <MessageCircle className="w-5 h-5 mr-2 relative z-10" />
                                <span className="relative z-10">Start Chat Now</span>
                                <ArrowRight className="w-5 h-5 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                href="/dashboard"
                                className="inline-flex items-center px-8 py-4 glass-strong text-gray-900 dark:text-white font-semibold rounded-2xl border-2 border-gray-200 dark:border-gray-700 transition-all hover:border-calm-400 hover:scale-105"
                            >
                                <Play className="w-5 h-5 mr-2" />
                                View Dashboard
                            </Link>
                        </div>

                        <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-soothe-600 dark:text-soothe-400" />
                                <span>100% Secure</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-calm-600 dark:text-calm-400" />
                                <span>AES-256 Encrypted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <UserX className="w-4 h-4 text-peace-600 dark:text-peace-400" />
                                <span>Anonymous</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-12 px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {[
                            { icon: Users, label: 'Active Users', value: '10+', color: 'from-calm-500 to-calm-600' },
                            { icon: MessageCircle, label: 'Conversations', value: '50+', color: 'from-peace-500 to-peace-600' },
                            { icon: Clock, label: 'Availability', value: '24/7', color: 'from-soothe-500 to-soothe-600' },
                            { icon: TrendingUp, label: 'Success Rate', value: '85%+', color: 'from-purple-500 to-pink-600' },
                        ].map((stat, index) => (
                            <GlassCard
                                key={index}
                                className="p-6 text-center animate-scaleIn hover:scale-105 transition-transform"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                                    <stat.icon className="w-7 h-7 text-white" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Everything You Need for{' '}
                            <span className="gradient-text">Mental Wellness</span>
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Comprehensive tools designed to support your mental health journey, all in one place
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative animate-fadeInUp"
                                style={{ animationDelay: `${feature.delay}s` }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-50`} />
                                <GlassCard className="relative p-8 h-full hover:shadow-glow-lg transition-all">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg`}>
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </GlassCard>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Loved by{' '}
                            <span className="gradient-text">Thousands</span>
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            See what our users say about their experience
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <GlassCard
                                key={index}
                                className="p-8 animate-fadeInUp hover:scale-105 transition-all"
                                style={{ animationDelay: `${index * 0.15}s` }}
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    ))}
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                                    "{testimonial.content}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-calm-500 to-peace-500 flex items-center justify-center text-2xl">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Frequently Asked{' '}
                            <span className="gradient-text">Questions</span>
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Everything you need to know about MindEase
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                                <FAQItem question={faq.question} answer={faq.answer} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-5xl">
                    <GlassCard className="p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-calm-500/10 to-peace-500/10 dark:from-calm-500/5 dark:to-peace-500/5" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                Ready to Start Your{' '}
                                <span className="gradient-text">Wellness Journey</span>?
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                                Join thousands of users who trust MindEase for their mental wellness.
                                Anonymous, secure, and always available.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link
                                    href="/auth/signup"
                                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-calm-600 to-peace-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-glow transform hover:scale-105 transition-all"
                                >
                                    <UserX className="w-5 h-5 mr-2" />
                                    Get Started Free
                                </Link>
                                <Link
                                    href="/auth/signin"
                                    className="inline-flex items-center px-8 py-4 glass-strong text-gray-900 dark:text-white font-semibold rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-calm-400 transition-all"
                                >
                                    Continue as Anonymous
                                </Link>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </section>

            {/* Enhanced Footer */}
            <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-4 mt-20">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        {/* Brand */}
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-calm-500 to-peace-500 flex items-center justify-center shadow-glow">
                                    <Heart className="w-6 h-6 text-white" fill="white" />
                                </div>
                                <span className="text-2xl font-bold">MindEase</span>
                            </div>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                Your safe, anonymous space for mental wellness. Available 24/7 to support your journey
                                with AI-powered conversations, mood tracking, and personalized resources.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                    <Github className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
                            <ul className="space-y-3">
                                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                                <li><Link href="/chat" className="text-gray-400 hover:text-white transition-colors">Chat</Link></li>
                                <li><Link href="/mood" className="text-gray-400 hover:text-white transition-colors">Mood Tracking</Link></li>
                                <li><Link href="/breathing" className="text-gray-400 hover:text-white transition-colors">Breathing</Link></li>
                                <li><Link href="/journal" className="text-gray-400 hover:text-white transition-colors">Journal</Link></li>
                                <li><Link href="/resources" className="text-gray-400 hover:text-white transition-colors">Resources</Link></li>
                            </ul>
                        </div>

                        {/* Crisis Support */}
                        <div>
                            <h4 className="font-semibold mb-4 text-lg">Crisis Support</h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-2">
                                    <Phone className="w-4 h-4 mt-0.5 text-calm-400" />
                                    <div>
                                        <p className="font-medium">National: 988</p>
                                        <p className="text-gray-400">Suicide & Crisis Lifeline</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <MessageCircle className="w-4 h-4 mt-0.5 text-calm-400" />
                                    <div>
                                        <p className="font-medium">Text HOME to 741741</p>
                                        <p className="text-gray-400">Crisis Text Line</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Phone className="w-4 h-4 mt-0.5 text-calm-400" />
                                    <div>
                                        <p className="font-medium">1-800-273-8255</p>
                                        <p className="text-gray-400">Veterans Crisis Line</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-gray-400 text-sm text-center md:text-left">
                                © {new Date().getFullYear()} MindEase. All rights reserved. Made with ❤️ for mental wellness.
                            </p>
                            <div className="flex gap-6 text-sm text-gray-400">
                                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                                <a href="#" className="hover:text-white transition-colors">Contact</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Important Notice */}
            {/* Important Notice — Dismissible */}
            <DismissibleNotice />
        </div>
    );
}

// Dismissible notice with localStorage persistence
function DismissibleNotice() {
    const [dismissed, setDismissed] = useState(true); // Start hidden to prevent flash

    useEffect(() => {
        const isDismissed = localStorage.getItem('mindease-notice-dismissed');
        setDismissed(!!isDismissed);
    }, []);

    const handleDismiss = () => {
        setDismissed(true);
        localStorage.setItem('mindease-notice-dismissed', 'true');
    };

    if (dismissed) return null;

    return (
        <div className="fixed bottom-4 right-4 z-40 max-w-sm animate-fadeInUp">
            <GlassCard className="p-4 border-2 border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30">
                <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-xs text-yellow-900 dark:text-yellow-200 leading-relaxed">
                            <strong>Important:</strong> MindEase is not a replacement for professional care.
                            In crisis? Call 988 immediately.
                        </p>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="flex-shrink-0 p-0.5 rounded hover:bg-yellow-200 dark:hover:bg-yellow-800/50 transition-colors"
                        aria-label="Dismiss notice"
                    >
                        <X className="w-4 h-4 text-yellow-700 dark:text-yellow-400" />
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}
