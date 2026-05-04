'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Phone, MessageSquare, Wind, X, Heart } from 'lucide-react';

/**
 * CRITICAL SAFETY COMPONENT: Crisis Overlay
 * 
 * This overlay is displayed when crisis is detected.
 * It shows crisis resources and can be acknowledged after a minimum delay
 * to ensure the user has seen the resources.
 * 
 * Priority: Safety > UX — but the user must be able to return to chat.
 */

interface Helpline {
    name: string;
    number: string;
    hours: string;
    description: string;
}

interface CrisisOverlayProps {
    isOpen: boolean;
    severity: 'low' | 'medium' | 'high' | 'critical';
    onBreathingExercise: () => void;
    onAction: (action: 'called' | 'breathing') => void;
    onDismiss?: () => void;
}

export function CrisisOverlay({ isOpen, severity, onBreathingExercise, onAction, onDismiss }: CrisisOverlayProps) {
    const [showContent, setShowContent] = useState(false);
    const [canDismiss, setCanDismiss] = useState(false);
    const [dismissCountdown, setDismissCountdown] = useState(10);

    // India crisis helplines
    const helplines: Helpline[] = [
        {
            name: 'AASRA',
            number: '91-9820466726',
            hours: '24/7',
            description: 'Suicide prevention helpline',
        },
        {
            name: 'Vandrevala Foundation',
            number: '1860-2662-345',
            hours: '24/7',
            description: 'Mental health support',
        },
        {
            name: 'iCall',
            number: '022-25521111',
            hours: 'Mon-Sat, 8 AM - 10 PM',
            description: 'Psychosocial helpline',
        },
        {
            name: 'Sneha India',
            number: '91-44-24640050',
            hours: '24/7',
            description: 'Emotional support',
        },
        {
            name: 'Sumaitri',
            number: '011-23389090',
            hours: '2 PM - 10 PM (Delhi)',
            description: 'Crisis intervention',
        },
    ];

    useEffect(() => {
        if (isOpen) {
            setShowContent(true);
            setCanDismiss(false);
            setDismissCountdown(10);

            // Allow dismissal after 10 seconds
            const timer = setInterval(() => {
                setDismissCountdown(prev => {
                    if (prev <= 1) {
                        setCanDismiss(true);
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isOpen]);

    if (!isOpen && !showContent) return null;

    const handleCall = (number: string) => {
        window.location.href = `tel:${number}`;
        onAction('called');
    };

    const handleText = (number: string) => {
        window.location.href = `sms:${number}`;
        onAction('called');
    };

    const handleBreathing = () => {
        onAction('breathing');
        onBreathingExercise();
    };

    const handleDismiss = () => {
        setShowContent(false);
        onDismiss?.();
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="crisis-title"
        >
            <div className="w-full max-w-2xl my-8">
                <Card className="p-6 md:p-8 bg-gradient-to-br from-peace-50 to-calm-50 dark:from-gray-800 dark:to-gray-900 border-peace-200 dark:border-peace-700 relative">
                    {/* Dismiss Button (appears after countdown) */}
                    {canDismiss && (
                        <button
                            onClick={handleDismiss}
                            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group"
                            aria-label="Return to chat"
                        >
                            <X className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
                        </button>
                    )}

                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-peace-500 to-calm-500 mb-4 animate-pulse shadow-glow">
                            <Heart className="w-8 h-8 text-white" fill="currentColor" />
                        </div>
                        <h2
                            id="crisis-title"
                            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2"
                        >
                            You're Not Alone
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 text-lg">
                            We're here to help. Please reach out to someone who can support you right now.
                        </p>
                    </div>

                    {/* Crisis Message */}
                    <div className="bg-white/70 dark:bg-gray-800/50 rounded-lg p-4 mb-6 border border-peace-200 dark:border-peace-700">
                        <p className="text-gray-800 dark:text-gray-200 text-center">
                            You mentioned something that concerns us. Your life matters, and there are people who want to help.
                            Please consider reaching out to one of these resources.
                        </p>
                    </div>

                    {/* Helplines */}
                    <div className="space-y-3 mb-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                            24/7 Crisis Helplines (India)
                        </h3>
                        {helplines.map((helpline, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-peace-300 dark:hover:border-peace-600 transition-all"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{helpline.name}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{helpline.description}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{helpline.hours}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleCall(helpline.number)}
                                            className="bg-soothe-600 hover:bg-soothe-700 text-white shadow-lg"
                                            size="sm"
                                        >
                                            <Phone className="w-4 h-4 mr-2" />
                                            Call
                                        </Button>
                                        <Button
                                            onClick={() => handleText(helpline.number)}
                                            variant="outline"
                                            size="sm"
                                            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            Text
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Immediate Calm Action */}
                    <div className="bg-calm-100 dark:bg-calm-900/30 rounded-lg p-4 border border-calm-300 dark:border-calm-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Need to calm down first?
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            Try a guided breathing exercise to help you feel more grounded.
                        </p>
                        <Button
                            onClick={handleBreathing}
                            className="w-full bg-calm-600 hover:bg-calm-700 text-white shadow-lg"
                        >
                            <Wind className="w-4 h-4 mr-2" />
                            Start Breathing Exercise
                        </Button>
                    </div>

                    {/* Return to Chat */}
                    <div className="mt-6 text-center">
                        {canDismiss ? (
                            <button
                                onClick={handleDismiss}
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-calm-600 dark:hover:text-calm-400 transition-colors underline underline-offset-2"
                            >
                                I've seen the resources — return to chat
                            </button>
                        ) : (
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                Please take a moment to review these resources ({dismissCountdown}s)
                            </p>
                        )}
                    </div>

                    {/* Footer Message */}
                    <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        <p>
                            This is a safe space. We care about you and want you to get the support you deserve. 💙
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
