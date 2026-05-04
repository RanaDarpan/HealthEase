'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatsCard } from '@/components/ui/StatsCard';
import Link from 'next/link';
import {
    MessageCircle,
    Wind,
    Heart,
    TrendingUp,
    Calendar,
    BookOpen,
    AlertCircle,
    Sparkles,
    ArrowRight,
    Activity,
    Smile,
    Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts';

interface DashboardStats {
    moodAverage: number;
    moodTrend: 'improving' | 'stable' | 'declining' | 'insufficient_data';
    totalMoodEntries: number;
    chatSessions: number;
    breathingSessions: number;
    currentStreak: number;
}

interface MoodChartData {
    date: string;
    score: number;
    label: string;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        moodAverage: 0,
        moodTrend: 'insufficient_data',
        totalMoodEntries: 0,
        chatSessions: 0,
        breathingSessions: 0,
        currentStreak: 0,
    });
    const [moodChartData, setMoodChartData] = useState<MoodChartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const moodResponse = await fetch('/api/mood?days=30');
            if (moodResponse.ok) {
                const moodData = await moodResponse.json();

                // Build chart data from entries
                const chartData = (moodData.entries || [])
                    .reverse()
                    .map((entry: any) => ({
                        date: new Date(entry.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                        }),
                        score: entry.moodScore,
                        label: entry.moodScore >= 8 ? 'Great' :
                            entry.moodScore >= 6 ? 'Good' :
                                entry.moodScore >= 4 ? 'Okay' : 'Low',
                    }));

                setMoodChartData(chartData);
                setStats({
                    moodAverage: moodData.stats?.averageMood || 0,
                    moodTrend: moodData.stats?.trend || 'insufficient_data',
                    totalMoodEntries: moodData.stats?.totalEntries || 0,
                    chatSessions: 0,
                    breathingSessions: 0,
                    currentStreak: calculateStreak(moodData.entries),
                });
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateStreak = (entries: any[]) => {
        if (!entries || entries.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < entries.length; i++) {
            const entryDate = new Date(entries[i].createdAt);
            entryDate.setHours(0, 0, 0, 0);

            const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

            if (daysDiff === i) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    };

    const getTrendIcon = () => {
        switch (stats.moodTrend) {
            case 'improving':
                return <TrendingUp className="w-5 h-5 text-green-600" />;
            case 'declining':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            default:
                return <Sparkles className="w-5 h-5 text-gray-500" />;
        }
    };

    const getTrendText = () => {
        switch (stats.moodTrend) {
            case 'improving':
                return 'Your mood is improving!';
            case 'declining':
                return 'Consider reaching out for support';
            case 'stable':
                return 'Your mood is stable';
            default:
                return 'Track more moods to see trends';
        }
    };

    const getTrendType = (): 'up' | 'down' | 'neutral' => {
        switch (stats.moodTrend) {
            case 'improving':
                return 'up';
            case 'declining':
                return 'down';
            default:
                return 'neutral';
        }
    };

    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

    // Custom tooltip for chart
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                    <p className="text-sm text-calm-600 dark:text-calm-400 font-bold">
                        Mood: {payload[0].value}/10
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-calm-50 via-white to-peace-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Main Content — NO duplicate <Navigation /> */}
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-12 animate-fadeInUp">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                                {greeting}! 👋
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Welcome to your mental wellness dashboard
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Today's Date</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {new Date().toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="animate-scaleIn" style={{ animationDelay: '0s' }}>
                        <StatsCard
                            title="Average Mood"
                            value={stats.moodAverage}
                            icon={Smile}
                            color="from-calm-500 to-calm-600"
                            trend={getTrendType()}
                            subtitle={getTrendText()}
                        />
                    </div>

                    <div className="animate-scaleIn" style={{ animationDelay: '0.1s' }}>
                        <StatsCard
                            title="Current Streak"
                            value={`${stats.currentStreak} 🔥`}
                            icon={Zap}
                            color="from-orange-500 to-orange-600"
                            trend="neutral"
                            subtitle={stats.currentStreak > 0 ? 'Keep it up!' : 'Start tracking today!'}
                        />
                    </div>

                    <div className="animate-scaleIn" style={{ animationDelay: '0.2s' }}>
                        <StatsCard
                            title="Total Entries"
                            value={stats.totalMoodEntries}
                            icon={Activity}
                            color="from-peace-500 to-peace-600"
                            trend="neutral"
                            subtitle="Mood check-ins"
                        />
                    </div>

                    <div className="animate-scaleIn" style={{ animationDelay: '0.3s' }}>
                        <StatsCard
                            title="This Week"
                            value={Math.min(stats.currentStreak, 7)}
                            icon={Calendar}
                            color="from-soothe-500 to-soothe-600"
                            trend="neutral"
                            subtitle="Days tracked"
                        />
                    </div>
                </div>

                {/* Mood Trend Chart */}
                {moodChartData.length > 1 && (
                    <div className="mb-12 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                        <GlassCard className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-calm-600 dark:text-calm-400" />
                                    Mood Trend (30 Days)
                                </h3>
                                <Link href="/mood">
                                    <Button variant="ghost" size="sm" className="text-calm-600 dark:text-calm-400 hover:text-calm-700 dark:hover:text-calm-300">
                                        View All
                                    </Button>
                                </Link>
                            </div>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={moodChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                                            axisLine={{ stroke: 'rgba(156,163,175,0.3)' }}
                                        />
                                        <YAxis
                                            domain={[0, 10]}
                                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                                            axisLine={{ stroke: 'rgba(156,163,175,0.3)' }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#0ea5e9"
                                            strokeWidth={3}
                                            fill="url(#moodGradient)"
                                            dot={{ fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, stroke: '#0ea5e9', strokeWidth: 2 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </GlassCard>
                    </div>
                )}

                {/* Action Cards & Wellness Tip Grid */}
                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {/* Quick Actions */}
                    <div className="lg:col-span-2">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-calm-600 dark:text-calm-400" />
                            Quick Actions
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Link href="/chat">
                                <GlassCard className="group cursor-pointer hover:shadow-glow transition-all">
                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-calm-500 to-calm-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                                <MessageCircle className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">Chat with Ease</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Get support anytime you need</p>
                                                <div className="flex items-center gap-1 text-calm-600 dark:text-calm-400 text-sm font-medium">
                                                    Start chatting <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </Link>

                            <Link href="/mood">
                                <GlassCard className="group cursor-pointer hover:shadow-glow transition-all">
                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-peace-500 to-peace-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                                <Heart className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">Track Mood</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Log how you're feeling today</p>
                                                <div className="flex items-center gap-1 text-peace-600 dark:text-peace-400 text-sm font-medium">
                                                    Track now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </Link>

                            <Link href="/breathing">
                                <GlassCard className="group cursor-pointer hover:shadow-glow transition-all">
                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-soothe-500 to-soothe-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                                <Wind className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">Breathe</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Find calm in moments of stress</p>
                                                <div className="flex items-center gap-1 text-soothe-600 dark:text-soothe-400 text-sm font-medium">
                                                    Start exercise <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </Link>

                            <Link href="/journal">
                                <GlassCard className="group cursor-pointer hover:shadow-glow transition-all">
                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                                <BookOpen className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">Journal</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Express your thoughts freely</p>
                                                <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 text-sm font-medium">
                                                    Write now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </Link>
                        </div>
                    </div>

                    {/* Daily Wellness Tip */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            Daily Tip
                        </h3>
                        <GlassCard className="h-full bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-800">
                            <div className="p-6 h-full flex flex-col">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">Grounding Technique</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                                    Practice the <strong>5-4-3-2-1 technique</strong>: Notice 5 things you see, 4 things you can touch,
                                    3 things you hear, 2 things you smell, and 1 thing you taste. This helps bring you back to the present moment.
                                </p>
                                <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-700">
                                    <p className="text-xs text-amber-800 dark:text-amber-400 font-medium">
                                        💡 Try this when feeling anxious or overwhelmed
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>

                {/* Recent Activity / Mood Insights */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Mood Insights */}
                    <GlassCard>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-calm-600 dark:text-calm-400" />
                                    Mood Insights
                                </h3>
                                <Link href="/mood">
                                    <Button variant="ghost" size="sm" className="text-calm-600 dark:text-calm-400 hover:text-calm-700 dark:hover:text-calm-300">
                                        View All
                                    </Button>
                                </Link>
                            </div>

                            {stats.totalMoodEntries > 0 ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        {getTrendIcon()}
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 dark:text-white">{getTrendText()}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Based on your last 30 days</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="text-center p-3 bg-calm-50 dark:bg-calm-900/20 rounded-lg">
                                            <p className="text-2xl font-bold text-calm-600 dark:text-calm-400">{stats.moodAverage.toFixed(1)}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Average Mood</p>
                                        </div>
                                        <div className="text-center p-3 bg-peace-50 dark:bg-peace-900/20 rounded-lg">
                                            <p className="text-2xl font-bold text-peace-600 dark:text-peace-400">{stats.totalMoodEntries}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Total Entries</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">No mood entries yet</p>
                                    <Link href="/mood">
                                        <Button className="bg-gradient-to-r from-calm-600 to-peace-600 text-white">
                                            Start Tracking
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Support Resources */}
                    <GlassCard>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-peace-600 dark:text-peace-400" />
                                    Support Resources
                                </h3>
                                <Link href="/resources">
                                    <Button variant="ghost" size="sm" className="text-peace-600 dark:text-peace-400 hover:text-peace-700 dark:hover:text-peace-300">
                                        View All
                                    </Button>
                                </Link>
                            </div>

                            <div className="space-y-3">
                                <div className="p-4 bg-gradient-to-r from-calm-50 to-peace-50 dark:from-calm-900/20 dark:to-peace-900/20 rounded-xl border border-calm-200 dark:border-calm-800 hover:shadow-md transition-shadow">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Crisis Support</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">24/7 helpline: Call 988</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">Immediate help for mental health emergencies</p>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-peace-50 to-soothe-50 dark:from-peace-900/20 dark:to-soothe-900/20 rounded-xl border border-peace-200 dark:border-peace-800 hover:shadow-md transition-shadow">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Mindfulness Resources</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Guided meditation & exercises</p>
                                    <Link href="/resources" className="text-xs text-peace-600 dark:text-peace-400 font-medium hover:underline">
                                        Explore resources →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
