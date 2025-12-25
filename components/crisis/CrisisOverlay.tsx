'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Phone, MessageSquare, Wind } from 'lucide-react';

/**
 * CRITICAL SAFETY COMPONENT: Crisis Overlay
 * 
 * This overlay is displayed when crisis is detected
 * MUST BE NON-DISMISSIBLE to ensure user sees resources
 * Priority: Safety > UX
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
}

export function CrisisOverlay({ isOpen, severity, onBreathingExercise, onAction }: CrisisOverlayProps) {
    const [showContent, setShowContent] = useState(false);

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

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="crisis-title"
        >
            <div className="w-full max-w-2xl my-8">
                <Card className="p-6 md:p-8 bg-gradient-to-br from-peace-50 to-calm-50 border-peace-200">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-peace-500 mb-4 animate-pulse">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </div>
                        <h2
                            id="crisis-title"
                            className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
                        >
                            You're Not Alone
                        </h2>
                        <p className="text-gray-700 text-lg">
                            We're here to help. Please reach out to someone who can support you right now.
                        </p>
                    </div>

                    {/* Crisis Message */}
                    <div className="bg-white/70 rounded-lg p-4 mb-6 border border-peace-200">
                        <p className="text-gray-800 text-center">
                            You mentioned something that concerns us. Your life matters, and there are people who want to help.
                            Please consider reaching out to one of these resources.
                        </p>
                    </div>

                    {/* Helplines */}
                    <div className="space-y-3 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">
                            24/7 Crisis Helplines (India)
                        </h3>
                        {helplines.map((helpline, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg p-4 border border-gray-200 hover:border-peace-300 transition-all"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{helpline.name}</h4>
                                        <p className="text-sm text-gray-600">{helpline.description}</p>
                                        <p className="text-xs text-gray-500 mt-1">{helpline.hours}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleCall(helpline.number)}
                                            className="bg-soothe-600 hover:bg-soothe-700 text-white"
                                            size="sm"
                                        >
                                            <Phone className="w-4 h-4 mr-2" />
                                            Call
                                        </Button>
                                        <Button
                                            onClick={() => handleText(helpline.number)}
                                            variant="outline"
                                            size="sm"
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
                    <div className="bg-calm-100 rounded-lg p-4 border border-calm-300">
                        <h3 className="font-semibold text-gray-900 mb-2">
                            Need to calm down first?
                        </h3>
                        <p className="text-sm text-gray-700 mb-3">
                            Try a guided breathing exercise to help you feel more grounded.
                        </p>
                        <Button
                            onClick={handleBreathing}
                            className="w-full bg-calm-600 hover:bg-calm-700 text-white"
                        >
                            <Wind className="w-4 h-4 mr-2" />
                            Start Breathing Exercise
                        </Button>
                    </div>

                    {/* Footer Message */}
                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>
                            This is a safe space. We care about you and want you to get the support you deserve.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
