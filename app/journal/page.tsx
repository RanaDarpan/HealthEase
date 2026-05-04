'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles, BookOpen, PenLine, Trash2, Calendar, Tag, ChevronDown, ChevronUp, Loader2, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const JOURNAL_PROMPTS = [
    "What made you smile today?",
    "What challenge did you overcome?",
    "What are you grateful for right now?",
    "How did you take care of yourself today?",
    "What would you tell your younger self?",
    "What emotion are you feeling most strongly?",
];

interface JournalEntry {
    id: string;
    title: string;
    content: string;
    mood: number;
    tags: string[];
    gratitude?: string[];
    challenges?: string[];
    wins?: string[];
    createdAt: string;
}

function getMoodEmoji(mood: number) {
    if (mood <= 2) return '😢';
    if (mood <= 4) return '😟';
    if (mood <= 6) return '😐';
    if (mood <= 8) return '🙂';
    return '😄';
}

function getMoodColor(mood: number) {
    if (mood <= 3) return 'bg-red-500';
    if (mood <= 5) return 'bg-yellow-500';
    if (mood <= 7) return 'bg-emerald-500';
    return 'bg-green-500';
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function JournalPage() {
    const [activeTab, setActiveTab] = useState<'entries' | 'write'>('entries');

    // Write form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState(5);
    const [gratitude, setGratitude] = useState(['', '', '']);
    const [wins, setWins] = useState('');
    const [challenges, setChallenges] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [randomPrompt] = useState(JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]);

    // Entries state
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [isLoadingEntries, setIsLoadingEntries] = useState(true);
    const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchEntries = useCallback(async () => {
        setIsLoadingEntries(true);
        try {
            const res = await fetch('/api/journal?days=90&limit=50', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setEntries(data.entries || []);
            }
        } catch (e) {
            console.error('Failed to fetch journal entries:', e);
        } finally {
            setIsLoadingEntries(false);
        }
    }, []);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/journal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    title, content, mood,
                    gratitude: gratitude.filter(g => g.trim()),
                    wins: wins ? [wins] : [],
                    challenges: challenges ? [challenges] : [],
                }),
            });
            if (res.ok) {
                toast.success('Journal entry saved! ✨');
                setTitle(''); setContent(''); setMood(5);
                setGratitude(['', '', '']); setWins(''); setChallenges('');
                fetchEntries();
                setActiveTab('entries');
            } else throw new Error('Failed');
        } catch {
            toast.error('Failed to save. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this journal entry? This cannot be undone.')) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/journal?id=${id}`, { method: 'DELETE', credentials: 'include' });
            if (res.ok) {
                setEntries(prev => prev.filter(e => e.id !== id));
                toast.success('Entry deleted');
                if (expandedEntry === id) setExpandedEntry(null);
            } else throw new Error('Failed');
        } catch {
            toast.error('Failed to delete');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-calm-50 via-peace-50 to-soothe-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <div className="glass-strong border-b border-white/20 dark:border-gray-700/50 px-4 py-4">
                <div className="container mx-auto flex items-center justify-between">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass-card hover:scale-105 transition-all text-gray-700 dark:text-gray-300">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                    <h1 className="text-xl font-bold gradient-text">My Journal</h1>
                    <div className="w-28" />
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('entries')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                            activeTab === 'entries'
                                ? 'bg-gradient-to-r from-calm-500 to-peace-500 text-white shadow-lg'
                                : 'glass-card text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        <BookOpen className="w-4 h-4" />
                        My Entries {entries.length > 0 && <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs">{entries.length}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('write')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                            activeTab === 'write'
                                ? 'bg-gradient-to-r from-calm-500 to-peace-500 text-white shadow-lg'
                                : 'glass-card text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        <PenLine className="w-4 h-4" />
                        Write New
                    </button>
                </div>

                {/* ─── ENTRIES TAB ─── */}
                {activeTab === 'entries' && (
                    <div className="space-y-4 animate-fadeIn">
                        {isLoadingEntries ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-calm-500 mb-3" />
                                <p className="text-gray-500 dark:text-gray-400">Loading your journal...</p>
                            </div>
                        ) : entries.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-calm-500 to-peace-500 flex items-center justify-center mb-4 opacity-50">
                                    <BookOpen className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No entries yet</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
                                    Start writing your thoughts or chat with Ease — session summaries can be saved here automatically.
                                </p>
                                <div className="flex gap-3">
                                    <Button onClick={() => setActiveTab('write')} className="bg-gradient-to-r from-calm-500 to-peace-500 text-white">
                                        <PenLine className="w-4 h-4 mr-2" /> Write First Entry
                                    </Button>
                                    <Link href="/chat">
                                        <Button variant="outline"><MessageCircle className="w-4 h-4 mr-2" /> Chat with Ease</Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            entries.map((entry) => {
                                const isExpanded = expandedEntry === entry.id;
                                const isChatSession = entry.tags?.includes('chat-session');
                                return (
                                    <Card key={entry.id} className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${isChatSession ? 'border-l-4 border-l-calm-500' : ''}`}>
                                        {/* Entry Header — always visible */}
                                        <button
                                            onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                                            className="w-full text-left"
                                        >
                                            <CardHeader className="pb-2">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {isChatSession && (
                                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-calm-100 dark:bg-calm-900/30 text-calm-700 dark:text-calm-400 border border-calm-200 dark:border-calm-800">
                                                                    💬 Chat Session
                                                                </span>
                                                            )}
                                                        </div>
                                                        <CardTitle className="text-base md:text-lg truncate">{entry.title}</CardTitle>
                                                        <CardDescription className="flex items-center gap-3 mt-1">
                                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(entry.createdAt)}</span>
                                                            <span>{formatTime(entry.createdAt)}</span>
                                                        </CardDescription>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold text-white ${getMoodColor(entry.mood)}`}>{entry.mood}/10</span>
                                                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                        </button>

                                        {/* Expanded Content */}
                                        {isExpanded && (
                                            <CardContent className="pt-0 animate-fadeIn">
                                                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-2">
                                                    {/* Content */}
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed mb-4">
                                                        {entry.content}
                                                    </p>

                                                    {/* Tags */}
                                                    {entry.tags && entry.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                                            {entry.tags.filter(t => t !== 'chat-session').map((tag, i) => (
                                                                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-peace-100 dark:bg-peace-900/30 text-peace-700 dark:text-peace-400 border border-peace-200 dark:border-peace-800">
                                                                    <Tag className="w-3 h-3" /> {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Wins & Gratitude */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                                        {entry.wins && entry.wins.length > 0 && (
                                                            <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                                                                <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 mb-1">🎉 Wins</p>
                                                                {entry.wins.map((w, i) => <p key={i} className="text-sm text-gray-700 dark:text-gray-300">{w}</p>)}
                                                            </div>
                                                        )}
                                                        {entry.gratitude && entry.gratitude.length > 0 && (
                                                            <div className="p-3 rounded-xl bg-soothe-50 dark:bg-soothe-950/20 border border-soothe-200 dark:border-soothe-800">
                                                                <p className="text-xs font-semibold text-soothe-700 dark:text-soothe-400 mb-1">🙏 Gratitude</p>
                                                                {entry.gratitude.map((g, i) => <p key={i} className="text-sm text-gray-700 dark:text-gray-300">{g}</p>)}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Delete */}
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}
                                                            disabled={deletingId === entry.id}
                                                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all disabled:opacity-50"
                                                        >
                                                            {deletingId === entry.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                            Delete Entry
                                                        </button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        )}
                                    </Card>
                                );
                            })
                        )}
                    </div>
                )}

                {/* ─── WRITE TAB ─── */}
                {activeTab === 'write' && (
                    <div className="animate-fadeIn">
                        {/* Prompt Banner */}
                        <Card className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-200 dark:border-purple-800">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-purple-600" />
                                    <CardTitle className="text-lg">Reflection Prompt</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-800 dark:text-gray-200 text-lg italic">"{randomPrompt}"</p>
                            </CardContent>
                        </Card>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Card>
                                <CardHeader><CardTitle>Entry Title</CardTitle><CardDescription>Give your entry a meaningful title</CardDescription></CardHeader>
                                <CardContent><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., A peaceful Sunday afternoon" required className="text-lg" /></CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>How are you feeling?</CardTitle><CardDescription>Rate your overall mood</CardDescription></CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <input type="range" min="1" max="10" value={mood} onChange={e => setMood(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-calm-600" />
                                        <div className="text-center"><span className={`inline-block px-4 py-2 rounded-full text-white font-semibold ${getMoodColor(mood)}`}>{getMoodEmoji(mood)} {mood}/10</span></div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>Your Thoughts</CardTitle><CardDescription>Express yourself freely — this is your safe space</CardDescription></CardHeader>
                                <CardContent><Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write about your day, your feelings, your hopes..." required rows={8} className="resize-none" /></CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-soothe-50 to-green-50 dark:from-soothe-900/30 dark:to-green-900/30 border-soothe-200 dark:border-soothe-800">
                                <CardHeader><CardTitle>Gratitude Practice</CardTitle><CardDescription>Three things you're grateful for</CardDescription></CardHeader>
                                <CardContent className="space-y-3">
                                    {gratitude.map((item, i) => (
                                        <Input key={i} value={item} onChange={e => { const g = [...gratitude]; g[i] = e.target.value; setGratitude(g); }} placeholder={`${i + 1}. I'm grateful for...`} />
                                    ))}
                                </CardContent>
                            </Card>

                            <div className="grid md:grid-cols-2 gap-6">
                                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
                                    <CardHeader><CardTitle>Today's Win 🎉</CardTitle></CardHeader>
                                    <CardContent><Textarea value={wins} onChange={e => setWins(e.target.value)} placeholder="Even small wins count!" rows={3} /></CardContent>
                                </Card>
                                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                                    <CardHeader><CardTitle>Challenge Faced</CardTitle></CardHeader>
                                    <CardContent><Textarea value={challenges} onChange={e => setChallenges(e.target.value)} placeholder="It's okay to acknowledge struggles" rows={3} /></CardContent>
                                </Card>
                            </div>

                            <Button type="submit" disabled={isSaving} className="w-full bg-gradient-to-r from-calm-600 to-peace-600 hover:from-calm-700 hover:to-peace-700 text-white text-lg py-6">
                                <Save className="w-5 h-5 mr-2" />
                                {isSaving ? 'Saving...' : 'Save Journal Entry'}
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
