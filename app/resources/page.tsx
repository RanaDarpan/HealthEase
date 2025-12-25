'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Video, HeadphonesIcon, ExternalLink, Heart, Sparkles, Phone, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const RESOURCES = [
    {
        category: 'Crisis Support',
        icon: Heart,
        color: 'from-red-500 to-pink-500',
        bgGradient: 'from-red-50/50 to-pink-50/50',
        items: [
            {
                title: 'AASRA',
                description: '24/7 Suicide prevention helpline',
                phone: '91-9820466726',
                hours: '24/7',
            },
            {
                title: 'Vandrevala Foundation',
                description: 'Mental health support and counseling',
                phone: '1860-2662-345',
                hours: '24/7',
            },
            {
                title: 'iCall',
                description: 'Psychosocial helpline by TISS',
                phone: '022-25521111',
                hours: 'Mon-Sat, 8 AM - 10 PM',
            },
        ],
    },
    {
        category: 'Self-Help Articles',
        icon: Book,
        color: 'from-blue-500 to-cyan-500',
        bgGradient: 'from-blue-50/50 to-cyan-50/50',
        items: [
            {
                title: 'Understanding Anxiety',
                description: 'Learn about anxiety triggers and coping strategies',
                link: '#',
            },
            {
                title: 'Managing Depression',
                description: 'Evidence-based techniques for managing low mood',
                link: '#',
            },
            {
                title: 'Sleep Hygiene Guide',
                description: 'Improve your sleep quality naturally',
                link: '#',
            },
            {
                title: 'Mindfulness Basics',
                description: 'Introduction to mindfulness meditation',
                link: '#',
            },
        ],
    },
    {
        category: 'Guided Meditations',
        icon: HeadphonesIcon,
        color: 'from-purple-500 to-indigo-500',
        bgGradient: 'from-purple-50/50 to-indigo-50/50',
        items: [
            {
                title: '5-Minute Calm',
                description: 'Quick relaxation for busy moments',
                duration: '5 min',
            },
            {
                title: 'Body Scan Meditation',
                description: 'Release tension from head to toe',
                duration: '15 min',
            },
            {
                title: 'Sleep Meditation',
                description: 'Drift into peaceful sleep',
                duration: '20 min',
            },
        ],
    },
    {
        category: 'Video Resources',
        icon: Video,
        color: 'from-green-500 to-emerald-500',
        bgGradient: 'from-green-50/50 to-emerald-50/50',
        items: [
            {
                title: 'Breathing Techniques',
                description: 'Learn effective breathing exercises',
                duration: '8 min',
            },
            {
                title: 'Cognitive Behavioral Therapy Basics',
                description: 'Understanding CBT principles',
                duration: '12 min',
            },
            {
                title: 'Building Resilience',
                description: 'Strengthen your mental resilience',
                duration: '10 min',
            },
        ],
    },
];

const WELLNESS_TIPS = [
    {
        title: '5-4-3-2-1 Grounding',
        description: 'Notice 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.',
        icon: '👀',
    },
    {
        title: 'Box Breathing',
        description: 'Inhale for 4, hold for 4, exhale for 4, hold for 4. Repeat 4 times.',
        icon: '🫁',
    },
    {
        title: 'Progressive Muscle Relaxation',
        description: 'Tense and release each muscle group from toes to head.',
        icon: '💪',
    },
    {
        title: 'Journaling',
        description: 'Write for 10 minutes daily about thoughts, feelings, or gratitude.',
        icon: '📝',
    },
    {
        title: 'Nature Breaks',
        description: 'Spend 10-15 minutes outdoors for mood and focus boost.',
        icon: '🌳',
    },
    {
        title: 'Social Connection',
        description: 'Reach out to one friend or family member daily.',
        icon: '💙',
    },
];

export default function ResourcesPage() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-calm-50 via-peace-50 to-soothe-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Page Header */}
                <div className="mb-10 animate-fadeIn">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-calm-500 to-peace-500 flex items-center justify-center shadow-glow animate-float">
                            <Book className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold gradient-text flex items-center gap-2">
                                Wellness Resources
                                <Sparkles className="w-6 h-6 text-calm-500 animate-pulse" />
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-lg mt-1">
                                Evidence-based tools and support for your mental health journey
                            </p>
                        </div>
                    </div>
                </div>

                {/* Crisis Alert Banner */}
                <div className="mb-8 glass-card p-6 border-2 border-red-200 dark:border-red-800 rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 animate-fadeIn">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                In Crisis? You're Not Alone
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                If you're experiencing a mental health emergency, please reach out immediately. Help is available 24/7.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    onClick={() => window.location.href = 'tel:988'}
                                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg hover:shadow-glow text-white"
                                    size="sm"
                                >
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call 988 (Suicide & Crisis Lifeline)
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resource Categories */}
                <div className="space-y-10 mb-12">
                    {RESOURCES.map((category, idx) => {
                        const Icon = category.icon;
                        return (
                            <div key={idx} className="animate-fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{category.category}</h3>
                                        <div className="h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700 mt-2" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {category.items.map((item, itemIdx) => (
                                        <Card
                                            key={itemIdx}
                                            className={`group glass-card border border-white/20 dark:border-gray-700/30 hover:shadow-glow transition-all duration-300 bg-gradient-to-br ${category.bgGradient} dark:${category.bgGradient} overflow-hidden animate-scaleIn`}
                                            style={{ animationDelay: `${(idx * 0.1) + (itemIdx * 0.05)}s` }}
                                        >
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-calm-600 dark:group-hover:text-calm-400 transition-colors">
                                                    {item.title}
                                                </CardTitle>
                                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                                    {item.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                {(item as any).phone && (
                                                    <div className="space-y-2">
                                                        <Button
                                                            onClick={() => window.location.href = `tel:${(item as any).phone}`}
                                                            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg hover:shadow-glow transform hover:scale-105 transition-all"
                                                            size="sm"
                                                        >
                                                            <Phone className="w-4 h-4 mr-2" />
                                                            Call {(item as any).phone}
                                                        </Button>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 text-center font-medium">
                                                            Available: {(item as any).hours}
                                                        </p>
                                                    </div>
                                                )}
                                                {(item as any).link && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full border-2 hover:border-calm-500 hover:text-calm-600 dark:hover:border-calm-400 dark:hover:text-calm-400 transition-all group-hover:scale-105"
                                                    >
                                                        Read Article
                                                        <ExternalLink className="w-4 h-4 ml-2" />
                                                    </Button>
                                                )}
                                                {(item as any).duration && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full glass-card">
                                                            {(item as any).duration}
                                                        </span>
                                                        <Button
                                                            size="sm"
                                                            className="bg-gradient-to-r from-calm-600 to-peace-600 hover:from-calm-700 hover:to-peace-700 shadow-lg hover:shadow-glow"
                                                        >
                                                            Start
                                                        </Button>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Wellness Tips */}
                <div className="animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Wellness Tips</h3>
                            <div className="h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700 mt-2" />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {WELLNESS_TIPS.map((tip, idx) => (
                            <Card
                                key={idx}
                                className="glass-card border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/80 to-yellow-50/80 dark:from-amber-900/30 dark:to-yellow-900/30 hover:shadow-glow transition-all group animate-scaleIn"
                                style={{ animationDelay: `${0.5 + (idx * 0.05)}s` }}
                            >
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <span className="text-2xl">{tip.icon}</span>
                                        <span className="group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                            {tip.title}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {tip.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
