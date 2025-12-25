'use client';

import { BreathingExercise } from '@/components/breathing/BreathingExercise';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BreathingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-calm-50 via-peace-50 to-soothe-50">
            {/* Header */}
            <div className="bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">
                    Breathing Exercise
                </h1>
                <div className="w-24" /> {/* Spacer */}
            </div>

            {/* Breathing Exercise */}
            <BreathingExercise />
        </div>
    );
}
