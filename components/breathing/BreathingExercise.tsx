'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';

/**
 * Breathing Exercise Component
 * Implements 4-7-8 breathing technique
 * - Breathe in for 4 seconds
 * - Hold for 7 seconds
 * - Breathe out for 8 seconds
 */

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

const BREATHING_PATTERNS = {
    '4-7-8': {
        name: '4-7-8 Breathing',
        description: 'Calming technique for stress and anxiety',
        inhale: 4,
        hold: 7,
        exhale: 8,
        rest: 2,
    },
    'box': {
        name: 'Box Breathing',
        description: 'Equal breathing for focus and calm',
        inhale: 4,
        hold: 4,
        exhale: 4,
        rest: 4,
    },
};

export function BreathingExercise() {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<Phase>('rest');
    const [countdown, setCountdown] = useState(0);
    const [completedCycles, setCompletedCycles] = useState(0);
    const [pattern, setPattern] = useState<'4-7-8' | 'box'>('4-7-8');

    const currentPattern = BREATHING_PATTERNS[pattern];

    useEffect(() => {
        if (!isActive) return;

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev > 1) {
                    return prev - 1;
                }

                // Move to next phase
                switch (phase) {
                    case 'rest':
                        setPhase('inhale');
                        return currentPattern.inhale;
                    case 'inhale':
                        setPhase('hold');
                        return currentPattern.hold;
                    case 'hold':
                        setPhase('exhale');
                        return currentPattern.exhale;
                    case 'exhale':
                        setCompletedCycles(prev => prev + 1);
                        setPhase('rest');
                        return currentPattern.rest;
                    default:
                        return 0;
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, phase, currentPattern]);

    const start = () => {
        setIsActive(true);
        setPhase('rest');
        setCountdown(currentPattern.rest);
    };

    const pause = () => {
        setIsActive(false);
    };

    const reset = () => {
        setIsActive(false);
        setPhase('rest');
        setCountdown(0);
        setCompletedCycles(0);
    };

    const getPhaseColor = () => {
        switch (phase) {
            case 'inhale':
                return 'from-calm-400 to-calm-600';
            case 'hold':
                return 'from-peace-400 to-peace-600';
            case 'exhale':
                return 'from-soothe-400 to-soothe-600';
            default:
                return 'from-gray-300 to-gray-400';
        }
    };

    const getPhaseInstruction = () => {
        switch (phase) {
            case 'inhale':
                return 'Breathe In';
            case 'hold':
                return 'Hold';
            case 'exhale':
                return 'Breathe Out';
            default:
                return 'Get Ready';
        }
    };

    const getAnimationClass = () => {
        if (!isActive) return '';

        switch (phase) {
            case 'inhale':
                return 'scale-150';
            case 'hold':
                return 'scale-150';
            case 'exhale':
                return 'scale-100';
            default:
                return 'scale-100';
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] p-4">
            <Card className="w-full max-w-md p-8 text-center">
                {/* Pattern Selector */}
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Choose Pattern
                    </h3>
                    <div className="flex gap-2 justify-center">
                        {(Object.keys(BREATHING_PATTERNS) as Array<'4-7-8' | 'box'>).map(key => (
                            <Button
                                key={key}
                                onClick={() => {
                                    setPattern(key);
                                    reset();
                                }}
                                variant={pattern === key ? 'default' : 'outline'}
                                size="sm"
                                disabled={isActive}
                            >
                                {BREATHING_PATTERNS[key].name}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Breathing Circle Animation */}
                <div className="relative w-64 h-64 mx-auto mb-8">
                    <div
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${getPhaseColor()} transition-all duration-1000 ease-in-out ${getAnimationClass()} flex items-center justify-center`}
                        style={{
                            boxShadow: '0 0 60px rgba(59, 130, 246, 0.5)',
                        }}
                    >
                        <div className="text-white text-center">
                            <p className="text-2xl font-bold mb-2">{getPhaseInstruction()}</p>
                            {countdown > 0 && (
                                <p className="text-5xl font-bold">{countdown}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">
                        {currentPattern.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                        {currentPattern.description}
                    </p>
                    <p className="text-xs text-gray-500">
                        Completed cycles: {completedCycles}
                    </p>
                </div>

                {/* Controls */}
                <div className="flex gap-2 justify-center">
                    {!isActive ? (
                        <Button
                            onClick={start}
                            className="bg-calm-600 hover:bg-calm-700 text-white"
                        >
                            <Play className="w-4 h-4 mr-2" />
                            Start
                        </Button>
                    ) : (
                        <Button
                            onClick={pause}
                            variant="outline"
                        >
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                        </Button>
                    )}
                    <Button
                        onClick={reset}
                        variant="outline"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                </div>

                {/* Benefits */}
                <div className="mt-6 p-4 bg-calm-50 rounded-lg border border-calm-200">
                    <p className="text-sm text-gray-700">
                        <strong>Benefits:</strong> Reduces anxiety, lowers heart rate, promotes relaxation, and helps you feel grounded.
                    </p>
                </div>
            </Card>
        </div>
    );
}
