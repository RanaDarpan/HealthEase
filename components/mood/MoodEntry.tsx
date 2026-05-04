'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Smile, Meh, Frown } from 'lucide-react';

interface MoodEntryProps {
    onSubmit: (data: {
        moodScore: number;
        notes: string;
        triggers: string[];
        activities: string[];
    }) => Promise<void>;
}

const MOOD_LABELS = [
    { score: 1, label: 'Terrible', color: 'bg-red-500' },
    { score: 2, label: 'Very Bad', color: 'bg-red-400' },
    { score: 3, label: 'Bad', color: 'bg-orange-500' },
    { score: 4, label: 'Poor', color: 'bg-orange-400' },
    { score: 5, label: 'Okay', color: 'bg-yellow-500' },
    { score: 6, label: 'Fair', color: 'bg-yellow-400' },
    { score: 7, label: 'Good', color: 'bg-lime-500' },
    { score: 8, label: 'Very Good', color: 'bg-green-500' },
    { score: 9, label: 'Great', color: 'bg-green-600' },
    { score: 10, label: 'Excellent', color: 'bg-green-700' },
];

const COMMON_TRIGGERS = [
    'Work stress',
    'Relationship issues',
    'Health concerns',
    'Financial worries',
    'Loneliness',
    'Family issues',
    'Sleep problems',
    'Other',
];

const COMMON_ACTIVITIES = [
    'Exercise',
    'Meditation',
    'Time with friends',
    'Hobbies',
    'Rest',
    'Therapy',
    'Journaling',
    'Other',
];

export function MoodEntry({ onSubmit }: MoodEntryProps) {
    const [moodScore, setMoodScore] = useState(5);
    const [notes, setNotes] = useState('');
    const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit({
                moodScore,
                notes,
                triggers: selectedTriggers,
                activities: selectedActivities,
            });

            // Reset form
            setMoodScore(5);
            setNotes('');
            setSelectedTriggers([]);
            setSelectedActivities([]);
        } catch (error) {
            console.error('Error submitting mood:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleTrigger = (trigger: string) => {
        setSelectedTriggers(prev =>
            prev.includes(trigger)
                ? prev.filter(t => t !== trigger)
                : [...prev, trigger]
        );
    };

    const toggleActivity = (activity: string) => {
        setSelectedActivities(prev =>
            prev.includes(activity)
                ? prev.filter(a => a !== activity)
                : [...prev, activity]
        );
    };

    const getMoodIcon = () => {
        if (moodScore <= 3) return <Frown className="w-8 h-8 text-red-500" />;
        if (moodScore <= 7) return <Meh className="w-8 h-8 text-yellow-500" />;
        return <Smile className="w-8 h-8 text-green-600" />;
    };

    return (
        <Card className="p-6 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Mood Score Selector */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            How are you feeling?
                        </h3>
                        {getMoodIcon()}
                    </div>

                    <div className="space-y-3">
                        {/* Slider */}
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={moodScore}
                            onChange={(e) => setMoodScore(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-calm-600"
                            aria-label="Mood score slider"
                        />

                        {/* Mood Label */}
                        <div className="text-center">
                            <span className={`inline-block px-4 py-2 rounded-full text-white font-semibold ${MOOD_LABELS[moodScore - 1].color
                                }`}>
                                {moodScore} - {MOOD_LABELS[moodScore - 1].label}
                            </span>
                        </div>

                        {/* Score Markers */}
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                            <span>1 (Worst)</span>
                            <span>10 (Best)</span>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        What's on your mind? (Optional)
                    </label>
                    <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Share your thoughts... This is private and encrypted."
                        rows={4}
                        className="w-full bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                </div>

                {/* Triggers */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        What contributed to this mood?
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {COMMON_TRIGGERS.map(trigger => (
                            <button
                                key={trigger}
                                type="button"
                                onClick={() => toggleTrigger(trigger)}
                                className={`px-3 py-1.5 rounded-full text-sm transition-all font-medium ${selectedTriggers.includes(trigger)
                                        ? 'bg-orange-500 text-white shadow-md'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                                    }`}
                            >
                                {trigger}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Activities */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        What did you do today?
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {COMMON_ACTIVITIES.map(activity => (
                            <button
                                key={activity}
                                type="button"
                                onClick={() => toggleActivity(activity)}
                                className={`px-3 py-1.5 rounded-full text-sm transition-all font-medium ${selectedActivities.includes(activity)
                                        ? 'bg-soothe-500 text-white shadow-md'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                                    }`}
                            >
                                {activity}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-calm-600 to-peace-600 hover:from-calm-700 hover:to-peace-700 text-white shadow-lg hover:shadow-glow transition-all"
                >
                    {isSubmitting ? 'Saving...' : 'Save Mood Entry'}
                </Button>
            </form>
        </Card>
    );
}
