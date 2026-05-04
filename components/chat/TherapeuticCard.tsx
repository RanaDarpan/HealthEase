'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Wind, Eye, Brain, ChevronDown, ChevronUp, Play, Pause, RotateCcw, Check } from 'lucide-react';

type ToolType = 'breathing' | 'grounding' | 'cbt';

interface TherapeuticCardProps {
    type: ToolType;
}

/**
 * Breathing Exercise — Animated Inhale/Hold/Exhale circle
 */
function BreathingExercise() {
    const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
    const [isRunning, setIsRunning] = useState(false);
    const [cycleCount, setCycleCount] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const phaseDurations = { inhale: 4, hold: 7, exhale: 8 };

    useEffect(() => {
        if (!isRunning) return;

        const timer = setInterval(() => {
            setSeconds(prev => {
                const currentDuration = phase === 'idle' ? 0 : phaseDurations[phase];
                if (prev >= currentDuration - 1) {
                    // Move to next phase
                    if (phase === 'inhale') setPhase('hold');
                    else if (phase === 'hold') setPhase('exhale');
                    else if (phase === 'exhale') {
                        setPhase('inhale');
                        setCycleCount(c => c + 1);
                    }
                    return 0;
                }
                return prev + 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning, phase]);

    const startExercise = () => {
        setIsRunning(true);
        setPhase('inhale');
        setSeconds(0);
        setCycleCount(0);
    };

    const stopExercise = () => {
        setIsRunning(false);
        setPhase('idle');
        setSeconds(0);
    };

    const getCircleScale = () => {
        if (phase === 'inhale') return 1 + (seconds / phaseDurations.inhale) * 0.5;
        if (phase === 'hold') return 1.5;
        if (phase === 'exhale') return 1.5 - (seconds / phaseDurations.exhale) * 0.5;
        return 1;
    };

    const getPhaseLabel = () => {
        if (phase === 'idle') return 'Ready';
        if (phase === 'inhale') return 'Breathe In...';
        if (phase === 'hold') return 'Hold...';
        if (phase === 'exhale') return 'Breathe Out...';
    };

    const getPhaseColor = () => {
        if (phase === 'inhale') return 'from-cyan-400 to-blue-500';
        if (phase === 'hold') return 'from-purple-400 to-indigo-500';
        if (phase === 'exhale') return 'from-teal-400 to-emerald-500';
        return 'from-calm-400 to-peace-500';
    };

    return (
        <div className="flex flex-col items-center gap-4 py-4">
            {/* Breathing Circle */}
            <div className="relative w-32 h-32 flex items-center justify-center">
                <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${getPhaseColor()} opacity-20 transition-transform ease-in-out`}
                    style={{
                        transform: `scale(${getCircleScale()})`,
                        transitionDuration: phase === 'idle' ? '300ms' : `${phase === 'inhale' ? phaseDurations.inhale : phase === 'exhale' ? phaseDurations.exhale : 0}s`,
                    }}
                />
                <div
                    className={`w-24 h-24 rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center shadow-lg transition-transform ease-in-out`}
                    style={{
                        transform: `scale(${getCircleScale()})`,
                        transitionDuration: phase === 'idle' ? '300ms' : `${phase === 'inhale' ? phaseDurations.inhale : phase === 'exhale' ? phaseDurations.exhale : 0}s`,
                    }}
                >
                    <span className="text-white text-lg font-bold">
                        {phase === 'idle' ? '4-7-8' : seconds + 1}
                    </span>
                </div>
            </div>

            {/* Phase Label */}
            <p className="text-base font-semibold text-gray-700 dark:text-gray-300 transition-all">
                {getPhaseLabel()}
            </p>

            {/* Cycle Counter */}
            {cycleCount > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Cycle {cycleCount}/4
                </p>
            )}

            {/* Controls */}
            <div className="flex gap-2">
                {!isRunning ? (
                    <button
                        onClick={startExercise}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium hover:shadow-lg transition-all hover:scale-105"
                    >
                        <Play className="w-4 h-4" /> Start
                    </button>
                ) : (
                    <>
                        <button
                            onClick={stopExercise}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                        >
                            <Pause className="w-4 h-4" /> Stop
                        </button>
                        <button
                            onClick={startExercise}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                        >
                            <RotateCcw className="w-4 h-4" /> Restart
                        </button>
                    </>
                )}
            </div>

            {cycleCount >= 4 && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-4 h-4" /> Great job! You completed 4 cycles 💙
                </p>
            )}
        </div>
    );
}

/**
 * 5-4-3-2-1 Grounding Exercise — Interactive Checklist
 */
function GroundingExercise() {
    const steps = [
        { count: 5, sense: 'SEE', icon: '👁️', prompt: 'things you can see around you' },
        { count: 4, sense: 'TOUCH', icon: '✋', prompt: 'things you can physically touch' },
        { count: 3, sense: 'HEAR', icon: '👂', prompt: 'sounds you can hear right now' },
        { count: 2, sense: 'SMELL', icon: '👃', prompt: 'things you can smell' },
        { count: 1, sense: 'TASTE', icon: '👅', prompt: 'thing you can taste' },
    ];

    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [currentStep, setCurrentStep] = useState(0);

    const toggleStep = (index: number) => {
        if (completedSteps.includes(index)) {
            setCompletedSteps(prev => prev.filter(i => i !== index));
        } else {
            setCompletedSteps(prev => [...prev, index]);
            if (index === currentStep && currentStep < steps.length - 1) {
                setTimeout(() => setCurrentStep(currentStep + 1), 300);
            }
        }
    };

    const allDone = completedSteps.length === steps.length;

    return (
        <div className="space-y-3 py-2">
            {steps.map((step, index) => (
                <button
                    key={index}
                    onClick={() => toggleStep(index)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left ${
                        completedSteps.includes(index)
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800'
                            : index === currentStep
                                ? 'bg-calm-50 dark:bg-calm-950/30 border border-calm-200 dark:border-calm-800 shadow-sm'
                                : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 opacity-60'
                    }`}
                >
                    {/* Check/Number */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        completedSteps.includes(index)
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                        {completedSteps.includes(index) ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <span className="text-sm font-bold">{step.count}</span>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <p className={`text-sm font-medium ${
                            completedSteps.includes(index) ? 'text-emerald-700 dark:text-emerald-400 line-through' : 'text-gray-800 dark:text-gray-200'
                        }`}>
                            {step.icon} Name {step.count} {step.prompt}
                        </p>
                    </div>
                </button>
            ))}

            {allDone && (
                <div className="text-center py-3 animate-fadeIn">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        ✨ You're grounded. Notice how you feel now — you're present. 💙
                    </p>
                </div>
            )}
        </div>
    );
}

/**
 * CBT Thought Record — Simple fill-in form
 */
function CBTThoughtRecord() {
    const [answers, setAnswers] = useState({
        thought: '',
        evidence_for: '',
        evidence_against: '',
        balanced: '',
    });
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { key: 'thought', question: 'What thought is bothering you?', placeholder: 'Write the negative thought...' },
        { key: 'evidence_for', question: 'What evidence supports this thought?', placeholder: 'What makes you think this is true...' },
        { key: 'evidence_against', question: 'What evidence contradicts it?', placeholder: 'Times when this wasn\'t true...' },
        { key: 'balanced', question: 'What\'s a more balanced perspective?', placeholder: 'A kinder, more realistic way to see it...' },
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const isComplete = currentStep === steps.length - 1 && answers.balanced.trim().length > 0;

    return (
        <div className="py-2 space-y-4">
            {/* Progress */}
            <div className="flex gap-1.5">
                {steps.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                            i <= currentStep ? 'bg-gradient-to-r from-calm-500 to-peace-500' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                    />
                ))}
            </div>

            {/* Current Question */}
            <div className="animate-fadeIn">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {steps[currentStep].question}
                </p>
                <textarea
                    value={answers[steps[currentStep].key as keyof typeof answers]}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [steps[currentStep].key]: e.target.value }))}
                    placeholder={steps[currentStep].placeholder}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-calm-500 focus:border-transparent outline-none resize-none transition-all"
                    rows={2}
                />
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                {currentStep > 0 && (
                    <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                        ← Back
                    </button>
                )}
                <div className="flex-1" />
                {currentStep < steps.length - 1 ? (
                    <button
                        onClick={handleNext}
                        disabled={!answers[steps[currentStep].key as keyof typeof answers].trim()}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-calm-500 to-peace-500 text-white text-sm font-medium hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        Next →
                    </button>
                ) : null}
            </div>

            {/* Completion */}
            {isComplete && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 animate-fadeIn">
                    <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                        ✨ Beautiful reframe! Your balanced thought: "{answers.balanced}"
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">
                        Try reading your balanced thought to yourself a few times. 💙
                    </p>
                </div>
            )}
        </div>
    );
}

/**
 * Main TherapeuticCard Component
 */
export function TherapeuticCard({ type }: TherapeuticCardProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const config = {
        breathing: {
            icon: Wind,
            title: '4-7-8 Breathing Exercise',
            subtitle: 'Calm your nervous system in 2 minutes',
            gradient: 'from-cyan-500 to-blue-500',
            bgGradient: 'from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20',
            border: 'border-cyan-200 dark:border-cyan-800/50',
        },
        grounding: {
            icon: Eye,
            title: '5-4-3-2-1 Grounding',
            subtitle: 'Anchor yourself in the present moment',
            gradient: 'from-emerald-500 to-teal-500',
            bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20',
            border: 'border-emerald-200 dark:border-emerald-800/50',
        },
        cbt: {
            icon: Brain,
            title: 'Thought Record',
            subtitle: 'Challenge and reframe a negative thought',
            gradient: 'from-purple-500 to-indigo-500',
            bgGradient: 'from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20',
            border: 'border-purple-200 dark:border-purple-800/50',
        },
    };

    const { icon: Icon, title, subtitle, gradient, bgGradient, border } = config[type];

    return (
        <div className={`rounded-2xl bg-gradient-to-br ${bgGradient} border ${border} overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md mt-2`}>
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center gap-3 p-4 text-left"
            >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
            </button>

            {/* Content */}
            {isExpanded && (
                <div className="px-4 pb-4 animate-fadeIn">
                    {type === 'breathing' && <BreathingExercise />}
                    {type === 'grounding' && <GroundingExercise />}
                    {type === 'cbt' && <CBTThoughtRecord />}
                </div>
            )}
        </div>
    );
}
