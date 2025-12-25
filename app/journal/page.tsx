'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';

const JOURNAL_PROMPTS = [
    "What made you smile today?",
    "What challenge did you overcome?",
    "What are you grateful for right now?",
    "How did you take care of yourself today?",
    "What would you tell your younger self?",
    "What emotion are you feeling most strongly?",
];

export default function JournalPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState(5);
    const [gratitude, setGratitude] = useState(['', '', '']);
    const [wins, setWins] = useState('');
    const [challenges, setChallenges] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [randomPrompt, setRandomPrompt] = useState(
        JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await fetch('/api/journal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    mood,
                    gratitude: gratitude.filter(g => g.trim()),
                    wins: wins ? [wins] : [],
                    challenges: challenges ? [challenges] : [],
                }),
            });

            if (response.ok) {
                alert('Journal entry saved successfully!');
                // Reset form
                setTitle('');
                setContent('');
                setMood(5);
                setGratitude(['', '', '']);
                setWins('');
                setChallenges('');
                setRandomPrompt(JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]);
            } else {
                throw new Error('Failed to save entry');
            }
        } catch (error) {
            console.error('Error saving journal:', error);
            alert('Failed to save journal entry. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-calm-50 via-peace-50 to-soothe-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <div className="glass-strong border-b border-white/20 dark:border-gray-700/50 px-4 py-4">
                <div className="container mx-auto flex items-center justify-between">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass-card hover:scale-105 transition-all text-gray-700 dark:text-gray-300 hover:text-calm-600 dark:hover:text-calm-400">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Back to Dashboard</span>
                    </Link>
                    <h1 className="text-xl font-bold gradient-text">Daily Journal</h1>
                    <div className="w-32" />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Prompt Banner */}
                <Card className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                            <CardTitle className="text-lg">Reflection Prompt</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-800 text-lg italic">"{randomPrompt}"</p>
                    </CardContent>
                </Card>

                {/* Journal Form */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Title */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Entry Title</CardTitle>
                                <CardDescription>Give your entry a meaningful title</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., A peaceful Sunday afternoon"
                                    required
                                    className="text-lg"
                                />
                            </CardContent>
                        </Card>

                        {/* Mood Slider */}
                        <Card>
                            <CardHeader>
                                <CardTitle>How are you feeling?</CardTitle>
                                <CardDescription>Rate your overall mood today</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={mood}
                                        onChange={(e) => setMood(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-calm-600"
                                    />
                                    <div className="text-center">
                                        <span className={`inline-block px-4 py-2 rounded-full text-white font-semibold ${mood >= 8 ? 'bg-green-500' :
                                            mood >= 5 ? 'bg-yellow-500' :
                                                'bg-red-500'
                                            }`}>
                                            {mood}/10
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Main Content */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Thoughts</CardTitle>
                                <CardDescription>Express yourself freely - this is your safe space</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write about your day, your feelings, your hopes..."
                                    required
                                    rows={10}
                                    className="resize-none"
                                />
                            </CardContent>
                        </Card>

                        {/* Gratitude */}
                        <Card className="bg-gradient-to-br from-soothe-50 to-green-50 border-soothe-200">
                            <CardHeader>
                                <CardTitle>Gratitude Practice</CardTitle>
                                <CardDescription>Three things you're grateful for today</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {gratitude.map((item, index) => (
                                    <Input
                                        key={index}
                                        value={item}
                                        onChange={(e) => {
                                            const newGratitude = [...gratitude];
                                            newGratitude[index] = e.target.value;
                                            setGratitude(newGratitude);
                                        }}
                                        placeholder={`${index + 1}. I'm grateful for...`}
                                    />
                                ))}
                            </CardContent>
                        </Card>

                        {/* Wins & Challenges */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                                <CardHeader>
                                    <CardTitle>Today's Win 🎉</CardTitle>
                                    <CardDescription>Something you accomplished</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={wins}
                                        onChange={(e) => setWins(e.target.value)}
                                        placeholder="Even small wins count!"
                                        rows={3}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                                <CardHeader>
                                    <CardTitle>Challenge Faced</CardTitle>
                                    <CardDescription>What was difficult today?</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={challenges}
                                        onChange={(e) => setChallenges(e.target.value)}
                                        placeholder="It's okay to acknowledge struggles"
                                        rows={3}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-gradient-to-r from-calm-600 to-peace-600 hover:from-calm-700 hover:to-peace-700 text-white text-lg py-6"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            {isSaving ? 'Saving...' : 'Save Journal Entry'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
