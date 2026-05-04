'use client';

import { BreathingExercise } from '@/components/breathing/BreathingExercise';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BreathingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-calm-50 via-peace-50 to-soothe-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <div className="glass-strong border-b border-white/20 dark:border-gray-700/50 px-4 py-3 flex items-center justify-between">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass-card hover:scale-105 transition-all text-gray-700 dark:text-gray-300 hover:text-calm-600 dark:hover:text-calm-400"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <h1 className="text-xl font-bold gradient-text">
                    Breathing Exercise
                </h1>
                <div className="w-28" />
            </div>

            {/* Breathing Exercise */}
            <BreathingExercise />
        </div>
    );
}
