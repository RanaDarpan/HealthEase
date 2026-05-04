'use client';

import React, { useState } from 'react';
import { BarChart3, Sparkles, BookOpen, Wind, X, ChevronRight, Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface SessionSummaryProps {
    sentimentHistory: Array<{ score: number; label: string }>;
    summary: {
        emotionalJourney: string;
        keyThemes: string[];
        takeaway: string;
        suggestedAction: string;
    } | null;
    isLoading: boolean;
    onDismiss: () => void;
}

export function SessionSummary({
    sentimentHistory,
    summary,
    isLoading,
    onDismiss,
}: SessionSummaryProps) {
    const router = useRouter();
    const [isSavingJournal, setIsSavingJournal] = useState(false);
    const [journalSaved, setJournalSaved] = useState(false);

    // Calculate visual sentiment bars
    const maxBars = Math.min(sentimentHistory.length, 12);
    const barsToShow = sentimentHistory.slice(-maxBars);

    const getBarColor = (score: number) => {
        if (score >= 0.3) return 'bg-emerald-400';
        if (score >= 0) return 'bg-yellow-400';
        if (score >= -0.5) return 'bg-orange-400';
        return 'bg-red-400';
    };

    const getBarHeight = (score: number) => {
        return Math.max(20, Math.round(((score + 1) / 2) * 100));
    };

    // Calculate average mood from sentiment history (map -1..1 to 1..10)
    const getAverageMood = (): number => {
        if (sentimentHistory.length === 0) return 5;
        const avgScore = sentimentHistory.reduce((sum, s) => sum + s.score, 0) / sentimentHistory.length;
        return Math.max(1, Math.min(10, Math.round(((avgScore + 1) / 2) * 9 + 1)));
    };

    // Save session summary to journal automatically
    const handleSaveToJournal = async () => {
        if (!summary || isSavingJournal || journalSaved) return;

        setIsSavingJournal(true);

        try {
            // Build journal content from the session summary
            const journalContent = [
                `📊 Emotional Journey:`,
                summary.emotionalJourney,
                '',
                `🏷️ Key Themes: ${summary.keyThemes.join(', ')}`,
                '',
                `✨ Takeaway:`,
                summary.takeaway,
                '',
                `💡 Suggested Action:`,
                summary.suggestedAction,
            ].join('\n');

            const today = new Date();
            const dateStr = today.toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            const response = await fetch('/api/journal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    title: `Chat Session — ${dateStr}`,
                    content: journalContent,
                    mood: getAverageMood(),
                    tags: [...summary.keyThemes.slice(0, 3), 'chat-session'],
                    challenges: [],
                    wins: [summary.takeaway],
                    gratitude: [],
                }),
            });

            if (response.ok) {
                setJournalSaved(true);
                toast.success('Saved to your journal! 📝');
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            console.error('Failed to save journal entry:', error);
            toast.error('Failed to save. Please try again.');
        } finally {
            setIsSavingJournal(false);
        }
    };

    if (isLoading) {
        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
                <div className="glass-card rounded-3xl p-8 max-w-md mx-4 shadow-2xl border border-white/20 dark:border-gray-700/30 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-calm-500 to-peace-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Preparing your summary...</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Reflecting on our conversation 💙</p>
                    <Loader2 className="w-6 h-6 animate-spin text-calm-500 mx-auto mt-4" />
                </div>
            </div>
        );
    }

    if (!summary) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn overflow-y-auto py-8">
            <div className="glass-card rounded-3xl p-6 md:p-8 max-w-lg mx-4 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-scaleIn w-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-calm-500 to-peace-500 flex items-center justify-center shadow-glow">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Session Summary</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Your emotional journey today</p>
                        </div>
                    </div>
                    <button
                        onClick={onDismiss}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Sentiment Chart */}
                {barsToShow.length > 0 && (
                    <div className="mb-6">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Emotional Arc</p>
                        <div className="flex items-end gap-1.5 h-20 px-2">
                            {barsToShow.map((sentiment, i) => (
                                <div
                                    key={i}
                                    className="flex-1 flex flex-col items-center justify-end"
                                >
                                    <div
                                        className={`w-full rounded-t-md ${getBarColor(sentiment.score)} transition-all duration-500 min-w-[8px]`}
                                        style={{
                                            height: `${getBarHeight(sentiment.score)}%`,
                                            animationDelay: `${i * 100}ms`,
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-1.5 px-2">
                            <span className="text-[10px] text-gray-400">Start</span>
                            <span className="text-[10px] text-gray-400">End</span>
                        </div>
                    </div>
                )}

                {/* Emotional Journey */}
                <div className="mb-5 p-4 rounded-2xl bg-calm-50/50 dark:bg-calm-950/20 border border-calm-100 dark:border-calm-900/30">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {summary.emotionalJourney}
                    </p>
                </div>

                {/* Key Themes */}
                {summary.keyThemes.length > 0 && (
                    <div className="mb-5">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Key Themes</p>
                        <div className="flex flex-wrap gap-2">
                            {summary.keyThemes.map((theme, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-peace-100 dark:bg-peace-900/30 text-peace-700 dark:text-peace-400 border border-peace-200 dark:border-peace-800"
                                >
                                    {theme}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Takeaway */}
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-soothe-50 to-peace-50 dark:from-soothe-950/20 dark:to-peace-950/20 border border-soothe-100 dark:border-soothe-900/30">
                    <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-soothe-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-semibold text-soothe-600 dark:text-soothe-400 mb-1">Your Takeaway</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{summary.takeaway}</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                    <button
                        onClick={handleSaveToJournal}
                        disabled={isSavingJournal || journalSaved}
                        className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl font-medium transition-all ${
                            journalSaved
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gradient-to-r from-calm-500 to-peace-500 text-white hover:shadow-lg hover:scale-[1.02]'
                        } disabled:opacity-80 disabled:hover:scale-100`}
                    >
                        <span className="flex items-center gap-2">
                            {journalSaved ? (
                                <Check className="w-5 h-5" />
                            ) : isSavingJournal ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <BookOpen className="w-5 h-5" />
                            )}
                            {journalSaved ? 'Saved to Journal ✓' : isSavingJournal ? 'Saving...' : 'Save to Journal'}
                        </span>
                        {!journalSaved && !isSavingJournal && <ChevronRight className="w-5 h-5" />}
                    </button>

                    {journalSaved && (
                        <button
                            onClick={() => router.push('/journal')}
                            className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-medium border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-all"
                        >
                            <span className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                View My Journal
                            </span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}

                    <button
                        onClick={() => router.push('/breathing')}
                        className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    >
                        <span className="flex items-center gap-2">
                            <Wind className="w-5 h-5" />
                            Try Breathing Exercise
                        </span>
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Suggested Action */}
                <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
                    💡 {summary.suggestedAction}
                </p>
            </div>
        </div>
    );
}
