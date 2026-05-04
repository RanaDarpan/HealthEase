'use client';

import { useState, useEffect } from 'react';
import { MoodEntry } from '@/components/mood/MoodEntry';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Heart, Calendar, Activity, Sparkles, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface MoodData {
    id: string;
    moodScore: number;
    notes: string | null;
    triggers: string[];
    activities: string[];
    createdAt: string;
}

export default function MoodPage() {
    const [moodHistory, setMoodHistory] = useState<MoodData[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMoodHistory();
    }, []);

    const fetchMoodHistory = async () => {
        try {
            const response = await fetch('/api/mood?days=30');
            if (response.ok) {
                const data = await response.json();
                setMoodHistory(data.entries);
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching mood history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data: any) => {
        try {
            const response = await fetch('/api/mood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                // Refresh history
                fetchMoodHistory();
                toast.success('Mood entry saved! Keep tracking your journey 💙');
            } else {
                throw new Error('Failed to save mood entry');
            }
        } catch (error) {
            console.error('Error saving mood:', error);
            toast.error('Failed to save mood entry. Please try again.');
        }
    };

    const getTrendIcon = () => {
        if (!stats?.trend) return <Minus className="w-5 h-5 text-gray-500" />;

        if (stats.trend === 'improving') {
            return <TrendingUp className="w-5 h-5 text-soothe-600" />;
        } else if (stats.trend === 'declining') {
            return <TrendingDown className="w-5 h-5 text-red-600" />;
        }
        return <Minus className="w-5 h-5 text-gray-500" />;
    };

    const getMoodColor = (score: number) => {
        if (score >= 8) return 'from-green-500 to-emerald-500';
        if (score >= 6) return 'from-soothe-500 to-green-500';
        if (score >= 4) return 'from-yellow-500 to-orange-400';
        return 'from-orange-500 to-red-500';
    };

    const getMoodLabel = (score: number) => {
        if (score >= 8) return 'Great';
        if (score >= 6) return 'Good';
        if (score >= 4) return 'Okay';
        return 'Low';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-calm-50 via-peace-50 to-soothe-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Page Header */}
                <div className="mb-8 animate-fadeIn">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-peace-500 to-pink-500 flex items-center justify-center shadow-glow animate-float">
                            <Heart className="w-7 h-7 text-white" fill="white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold gradient-text flex items-center gap-2">
                                Mood Tracking
                                <Sparkles className="w-6 h-6 text-peace-500 animate-pulse" />
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Track your emotional journey and celebrate your progress
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics Dashboard */}
                {stats && (
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card className="glass-card p-6 border border-white/20 dark:border-gray-700/30 hover:shadow-glow transition-all animate-scaleIn group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-calm-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                    <Activity className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xs font-medium px-3 py-1 rounded-full glass-card text-gray-600 dark:text-gray-400">
                                    30 Days
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Average Mood</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-bold text-gray-900 dark:text-white">{stats.averageMood}</p>
                                <p className="text-lg text-gray-500 dark:text-gray-400">/ 10</p>
                            </div>
                            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-calm-500 to-peace-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${(stats.averageMood / 10) * 100}%` }}
                                />
                            </div>
                        </Card>

                        <Card className="glass-card p-6 border border-white/20 dark:border-gray-700/30 hover:shadow-glow transition-all animate-scaleIn group" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xs font-medium px-3 py-1 rounded-full glass-card text-gray-600 dark:text-gray-400">
                                    Total
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Entries Logged</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-bold text-gray-900 dark:text-white">{stats.totalEntries}</p>
                                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                                    <ChevronRight className="w-4 h-4" />
                                    Keep going!
                                </p>
                            </div>
                        </Card>

                        <Card className="glass-card p-6 border border-white/20 dark:border-gray-700/30 hover:shadow-glow transition-all animate-scaleIn group" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-soothe-500 to-green-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                    {getTrendIcon()}
                                </div>
                                <span className="text-xs font-medium px-3 py-1 rounded-full glass-card text-gray-600 dark:text-gray-400">
                                    Trend
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your Progress</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
                                    {stats.trend === 'insufficient_data' ? 'Building' : stats.trend}
                                </p>
                            </div>
                            {stats.trend === 'improving' && (
                                <p className="text-sm text-soothe-600 dark:text-soothe-400 mt-2">You're making great progress! 🎉</p>
                            )}
                            {stats.trend === 'declining' && (
                                <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">Let's focus on self-care 💙</p>
                            )}
                        </Card>
                    </div>
                )}

                {/* Mood Entry Form */}
                <div className="mb-8">
                    <div className="glass-card p-6 border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-glass-lg animate-fadeInUp">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span>How are you feeling today?</span>
                            <Heart className="w-6 h-6 text-peace-500 animate-pulse" />
                        </h2>
                        <MoodEntry onSubmit={handleSubmit} />
                    </div>
                </div>

                {/* Mood History */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span>Your Mood Journey</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700" />
                    </h2>

                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="glass-card p-6 border border-white/20 dark:border-gray-700/30 rounded-2xl animate-pulse">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-700" />
                                        <div className="flex-1">
                                            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-2" />
                                            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4" />
                                        </div>
                                    </div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full" />
                                </div>
                            ))}
                        </div>
                    ) : moodHistory.length === 0 ? (
                        <Card className="glass-card p-12 text-center border border-white/20 dark:border-gray-700/30 rounded-2xl">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-peace-500/20 to-calm-500/20 flex items-center justify-center">
                                <Heart className="w-10 h-10 text-peace-500" />
                            </div>
                            <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Start Your Journey
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                                No mood entries yet. Record your first entry above to begin tracking your emotional wellness!
                            </p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {moodHistory.map((entry, index) => (
                                <Card
                                    key={entry.id}
                                    className="glass-card p-6 border border-white/20 dark:border-gray-700/30 rounded-2xl hover:shadow-glow transition-all animate-fadeInUp group"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Mood Score Badge */}
                                        <div className="relative flex-shrink-0">
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getMoodColor(entry.moodScore)} flex flex-col items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                                                <span className="text-2xl">{entry.moodScore}</span>
                                                <span className="text-xs opacity-90">{getMoodLabel(entry.moodScore)}</span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white text-lg">
                                                        {new Date(entry.createdAt).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(entry.createdAt).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            {entry.notes && (
                                                <p className="text-gray-700 dark:text-gray-300 mb-3 italic leading-relaxed">
                                                    "{entry.notes}"
                                                </p>
                                            )}

                                            <div className="flex flex-wrap gap-3">
                                                {entry.triggers.length > 0 && (
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Triggers</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {entry.triggers.map((trigger, idx) => (
                                                                <span key={idx} className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs rounded-full font-medium border border-orange-200 dark:border-orange-800">
                                                                    {trigger}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {entry.activities.length > 0 && (
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Activities</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {entry.activities.map((activity, idx) => (
                                                                <span key={idx} className="px-3 py-1 bg-soothe-100 dark:bg-soothe-900/30 text-soothe-700 dark:text-soothe-400 text-xs rounded-full font-medium border border-soothe-200 dark:border-soothe-800">
                                                                    {activity}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
