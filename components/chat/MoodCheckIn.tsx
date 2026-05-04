'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface MoodCheckInProps {
    onMoodSelect: (mood: number, label: string) => void;
}

const MOOD_OPTIONS = [
    { value: 1, emoji: '😢', label: 'Really Low', color: 'from-red-400 to-rose-500', bg: 'bg-red-50 dark:bg-red-950/30', ring: 'ring-red-300 dark:ring-red-700' },
    { value: 2, emoji: '😟', label: 'Struggling', color: 'from-orange-400 to-amber-500', bg: 'bg-orange-50 dark:bg-orange-950/30', ring: 'ring-orange-300 dark:ring-orange-700' },
    { value: 3, emoji: '😐', label: 'Okay', color: 'from-yellow-400 to-amber-400', bg: 'bg-yellow-50 dark:bg-yellow-950/30', ring: 'ring-yellow-300 dark:ring-yellow-700' },
    { value: 4, emoji: '🙂', label: 'Good', color: 'from-emerald-400 to-green-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', ring: 'ring-emerald-300 dark:ring-emerald-700' },
    { value: 5, emoji: '😄', label: 'Great!', color: 'from-cyan-400 to-blue-500', bg: 'bg-cyan-50 dark:bg-cyan-950/30', ring: 'ring-cyan-300 dark:ring-cyan-700' },
];

export function MoodCheckIn({ onMoodSelect }: MoodCheckInProps) {
    const [hoveredMood, setHoveredMood] = useState<number | null>(null);
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleSelect = (mood: typeof MOOD_OPTIONS[0]) => {
        setSelectedMood(mood.value);
        setIsAnimating(true);

        // Animate out then callback
        setTimeout(() => {
            onMoodSelect(mood.value, mood.label);
        }, 600);
    };

    return (
        <div className={`flex flex-col items-center justify-center h-full text-center px-4 transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            {/* Floating Avatar */}
            <div className="relative mb-8 animate-fadeIn">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-calm-500 via-peace-500 to-soothe-500 flex items-center justify-center shadow-glow-lg animate-float">
                    <Sparkles className="w-14 h-14 text-white" />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700">
                    <span className="text-xs font-semibold text-calm-600 dark:text-calm-400 whitespace-nowrap">Ease is here 💙</span>
                </div>
            </div>

            {/* Greeting */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                How are you feeling?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm text-base mb-10 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                Tap how you're feeling right now — it helps me understand you better
            </p>

            {/* Mood Emoji Selector */}
            <div className="flex items-center gap-3 md:gap-5 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
                {MOOD_OPTIONS.map((mood) => (
                    <button
                        key={mood.value}
                        onClick={() => handleSelect(mood)}
                        onMouseEnter={() => setHoveredMood(mood.value)}
                        onMouseLeave={() => setHoveredMood(null)}
                        className={`relative group flex flex-col items-center transition-all duration-300 ${
                            selectedMood === mood.value
                                ? 'scale-125'
                                : hoveredMood === mood.value
                                    ? 'scale-110'
                                    : 'scale-100 hover:scale-105'
                        }`}
                    >
                        {/* Glow Ring */}
                        <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                            hoveredMood === mood.value || selectedMood === mood.value
                                ? `ring-4 ${mood.ring} scale-110`
                                : ''
                        }`} />

                        {/* Emoji Circle */}
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 ${mood.bg} ${
                            selectedMood === mood.value
                                ? 'shadow-xl'
                                : 'shadow-md hover:shadow-lg'
                        }`}>
                            <span className={`text-3xl md:text-4xl transition-transform duration-300 ${
                                hoveredMood === mood.value ? 'scale-110' : ''
                            }`}>
                                {mood.emoji}
                            </span>
                        </div>

                        {/* Label */}
                        <span className={`mt-2 text-xs md:text-sm font-medium transition-all duration-300 ${
                            hoveredMood === mood.value || selectedMood === mood.value
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-500 dark:text-gray-400'
                        }`}>
                            {mood.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Skip option */}
            <button
                onClick={() => onMoodSelect(0, 'skipped')}
                className="mt-8 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors animate-fadeInUp"
                style={{ animationDelay: '500ms' }}
            >
                Skip — just start chatting
            </button>
        </div>
    );
}
