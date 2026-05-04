'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Lock, Copy, Trash2, Check, Bot, User, LogOut } from 'lucide-react';
import { CrisisOverlay } from '@/components/crisis/CrisisOverlay';
import { EmojiPicker } from './EmojiPicker';
import { VoiceControls } from './VoiceControls';
import { MoodCheckIn } from './MoodCheckIn';
import { TherapeuticCard } from './TherapeuticCard';
import { SessionSummary } from './SessionSummary';
import { useRouter } from 'next/navigation';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    sentiment?: {
        score: number;
        label: string;
    };
    tool?: 'breathing' | 'grounding' | 'cbt' | null;
    isStreaming?: boolean;
}

interface ChatInterfaceProps {
    sessionId?: string;
}

// Map sentiment to emotion aura colors
function getAuraGradient(sentimentHistory: Array<{ score: number; label: string }>): string {
    if (sentimentHistory.length === 0) return 'from-calm-50/30 via-white to-peace-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800';

    const recent = sentimentHistory.slice(-3);
    const avgScore = recent.reduce((sum, s) => sum + s.score, 0) / recent.length;

    if (avgScore >= 0.3) return 'from-emerald-50/40 via-white to-cyan-50/30 dark:from-emerald-950/20 dark:via-gray-900 dark:to-cyan-950/15';
    if (avgScore >= 0) return 'from-calm-50/30 via-white to-peace-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800';
    if (avgScore >= -0.5) return 'from-amber-50/30 via-white to-orange-50/20 dark:from-amber-950/15 dark:via-gray-900 dark:to-orange-950/10';
    return 'from-rose-50/30 via-white to-red-50/20 dark:from-rose-950/15 dark:via-gray-900 dark:to-red-950/10';
}

// Mood ring color for bot avatar
function getMoodRingColor(sentimentHistory: Array<{ score: number; label: string }>): string {
    if (sentimentHistory.length === 0) return 'ring-calm-400';
    const recent = sentimentHistory.slice(-3);
    const avgScore = recent.reduce((sum, s) => sum + s.score, 0) / recent.length;
    if (avgScore >= 0.3) return 'ring-emerald-400';
    if (avgScore >= 0) return 'ring-calm-400';
    if (avgScore >= -0.5) return 'ring-amber-400';
    return 'ring-rose-400';
}

export function ChatInterface({ sessionId: initialSessionId }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(initialSessionId);
    const [crisisActive, setCrisisActive] = useState(false);
    const [crisisSeverity, setCrisisSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
    const [lastAiMessage, setLastAiMessage] = useState('');
    const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);
    const [sentimentHistory, setSentimentHistory] = useState<Array<{ score: number; label: string }>>([]);

    // New states for enhanced features
    const [showMoodCheckIn, setShowMoodCheckIn] = useState(true);
    const [initialMood, setInitialMood] = useState<number | null>(null);
    const [showSessionSummary, setShowSessionSummary] = useState(false);
    const [sessionSummaryData, setSessionSummaryData] = useState<any>(null);
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const router = useRouter();

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (!showMoodCheckIn) {
            textareaRef.current?.focus();
        }
    }, [showMoodCheckIn]);

    // Handle mood check-in selection
    const handleMoodSelect = useCallback((mood: number, label: string) => {
        setInitialMood(mood);
        setShowMoodCheckIn(false);

        // If mood is 0 (skipped), don't auto-send
        if (mood > 0) {
            // Auto-generate first message based on mood
            const moodMessages: Record<number, string> = {
                1: "I'm not feeling great right now...",
                2: "I'm struggling a bit today",
                3: "I'm doing okay, just wanted to chat",
                4: "I'm feeling pretty good today!",
                5: "I'm feeling great today! 😊",
            };
            setInput(moodMessages[mood] || '');
            textareaRef.current?.focus();
        }
    }, []);

    // Send message with streaming
    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        // Add a placeholder streaming message
        const streamingMessage: Message = {
            role: 'assistant',
            content: '',
            timestamp: new Date(),
            isStreaming: true,
        };
        setMessages(prev => [...prev, streamingMessage]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    message: currentInput,
                    sessionId,
                    initialMood: initialMood && messages.length === 0 ? initialMood : undefined,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Failed to send message';
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error || errorMessage;
                } catch { }
                throw new Error(errorMessage);
            }

            // Handle SSE streaming
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';
            let toolDetected: 'breathing' | 'grounding' | 'cbt' | null = null;
            let sentiment: { score: number; label: string } | undefined;

            if (reader) {
                let buffer = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });

                    // Process complete SSE events
                    const events = buffer.split('\n\n');
                    buffer = events.pop() || ''; // Keep incomplete event in buffer

                    for (const event of events) {
                        const dataMatch = event.match(/^data: (.+)$/m);
                        if (!dataMatch) continue;

                        try {
                            const data = JSON.parse(dataMatch[1]);

                            if (data.type === 'chunk') {
                                fullContent += data.content;
                                // Clean tool markers from display
                                const displayContent = fullContent.replace(/\[TOOL:(breathing|grounding|cbt)\]/gi, '').trim();
                                // Update the streaming message
                                setMessages(prev => {
                                    const updated = [...prev];
                                    const lastIdx = updated.length - 1;
                                    if (updated[lastIdx]?.isStreaming) {
                                        updated[lastIdx] = {
                                            ...updated[lastIdx],
                                            content: displayContent,
                                        };
                                    }
                                    return updated;
                                });
                                scrollToBottom();
                            } else if (data.type === 'meta') {
                                if (data.sessionId && !sessionId) {
                                    setSessionId(data.sessionId);
                                }
                                sentiment = data.sentiment;
                                toolDetected = data.tool || null;

                                if (data.sentiment) {
                                    setSentimentHistory(prev => [...prev, data.sentiment]);
                                }

                                if (data.crisisDetected) {
                                    setCrisisActive(true);
                                    setCrisisSeverity(data.crisisData.severity);
                                }
                            } else if (data.type === 'error') {
                                throw new Error(data.message);
                            }
                        } catch (e) {
                            // Skip malformed events
                            if (e instanceof Error && e.message !== 'Failed to send message') continue;
                            throw e;
                        }
                    }
                }
            }

            // Finalize the streaming message
            const displayContent = fullContent.replace(/\[TOOL:(breathing|grounding|cbt)\]/gi, '').trim();
            setMessages(prev => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                if (updated[lastIdx]?.isStreaming || updated[lastIdx]?.role === 'assistant') {
                    updated[lastIdx] = {
                        role: 'assistant',
                        content: displayContent,
                        timestamp: new Date(),
                        sentiment,
                        tool: toolDetected,
                        isStreaming: false,
                    };
                }
                return updated;
            });

            setLastAiMessage(displayContent);

        } catch (error: any) {
            console.error('Error sending message:', error);

            // Remove the streaming message and add error
            setMessages(prev => {
                const updated = prev.filter(m => !m.isStreaming);
                return [...updated, {
                    role: 'assistant' as const,
                    content: error.message?.includes('Too many')
                        ? 'I need a quick breather — please try again in a moment. 💙'
                        : 'I apologize, but I encountered an error. Please try again.',
                    timestamp: new Date(),
                }];
            });
        } finally {
            setIsLoading(false);
        }
    };

    // End session and show summary
    const handleEndSession = async () => {
        if (messages.length < 2) {
            // Not enough messages for a summary
            return;
        }

        setIsSummaryLoading(true);
        setShowSessionSummary(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    messages: messages.map(m => ({ role: m.role, content: m.content })),
                    sentimentHistory,
                }),
            });

            if (response.ok) {
                const summary = await response.json();
                setSessionSummaryData(summary);
            } else {
                // Fallback summary
                setSessionSummaryData({
                    emotionalJourney: 'You took time to connect with yourself today.',
                    keyThemes: ['Self-care'],
                    takeaway: 'Every conversation is a step forward. You showed up for yourself today. 💙',
                    suggestedAction: 'Take a few deep breaths before continuing your day.',
                });
            }
        } catch (error) {
            console.error('Failed to generate summary:', error);
            setSessionSummaryData({
                emotionalJourney: 'You took time to connect with yourself today.',
                keyThemes: ['Self-care'],
                takeaway: 'Every conversation is a step forward. You showed up for yourself today. 💙',
                suggestedAction: 'Take a few deep breaths before continuing your day.',
            });
        } finally {
            setIsSummaryLoading(false);
        }
    };



    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleEmojiSelect = useCallback((emoji: string) => {
        setInput(prev => prev + emoji);
    }, []);

    const handleVoiceTranscript = useCallback((transcript: string) => {
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
    }, []);

    const copyMessage = async (content: string, index: number) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedMessageIndex(index);
            setTimeout(() => setCopiedMessageIndex(null), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const deleteMessage = (index: number) => {
        setMessages(prev => prev.filter((_, i) => i !== index));
    };

    const handleCrisisAction = async (action: 'called' | 'breathing') => {
        if (sessionId) {
            await fetch('/api/crisis/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    sessionId,
                    action,
                }),
            }).catch(() => { });
        }

        if (action === 'breathing') {
            router.push('/breathing');
        }
    };

    const handleCrisisDismiss = () => {
        setCrisisActive(false);
    };

    const getSentimentIndicator = (sentiment?: { score: number; label: string }) => {
        if (!sentiment) return null;

        const indicators: Record<string, { color: string; dot: string }> = {
            crisis: { color: 'bg-red-500', dot: '🔴' },
            negative: { color: 'bg-orange-400', dot: '🟠' },
            neutral: { color: 'bg-gray-400', dot: '⚪' },
            positive: { color: 'bg-emerald-400', dot: '🟢' },
        };

        return indicators[sentiment.label] || indicators.neutral;
    };

    const auraGradient = getAuraGradient(sentimentHistory);
    const moodRingColor = getMoodRingColor(sentimentHistory);

    return (
        <>
            <div className={`relative flex flex-col h-full bg-gradient-to-br ${auraGradient} transition-all duration-1000`}>
                {/* Mood Check-In (shown at start) */}
                {showMoodCheckIn && messages.length === 0 && (
                    <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4">
                        <MoodCheckIn onMoodSelect={handleMoodSelect} />
                    </div>
                )}

                {/* Messages Area */}
                {!showMoodCheckIn && (
                    <>
                        <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn px-4">
                                    {/* Quick Start Suggestions */}
                                    <div className="relative mb-6">
                                        <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-calm-500 via-peace-500 to-soothe-500 flex items-center justify-center animate-float shadow-glow-lg ring-4 ${moodRingColor} ring-offset-2 ring-offset-white dark:ring-offset-gray-900 transition-all duration-700`}>
                                            <Bot className="w-12 h-12 text-white" />
                                        </div>
                                    </div>

                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        Ready when you are 💙
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-md text-base leading-relaxed mb-8">
                                        Type anything — in any language. I understand English, Hindi, Gujarati, Hinglish, and more.
                                    </p>

                                    <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                                        {[
                                            "I'm feeling anxious today",
                                            "Mujhe kisi se baat karni hai",
                                            "Help me with stress",
                                            "I'm having a bad day",
                                        ].map((suggestion, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setInput(suggestion);
                                                    textareaRef.current?.focus();
                                                }}
                                                className="px-4 py-2 rounded-full text-sm glass-card border border-calm-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-calm-400 dark:hover:border-calm-500 hover:text-calm-700 dark:hover:text-calm-400 hover:shadow-glow-sm transition-all hover:scale-105"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`group flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
                                    style={{ animationDelay: `${Math.min(index * 0.02, 0.1)}s` }}
                                >
                                    <div className={`flex gap-2.5 max-w-[88%] md:max-w-[75%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        {/* Avatar */}
                                        <div className="flex-shrink-0 mt-1">
                                            {message.role === 'assistant' ? (
                                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-calm-500 to-peace-500 flex items-center justify-center shadow-md ring-2 ${moodRingColor} ring-offset-1 ring-offset-white dark:ring-offset-gray-900 transition-all duration-700`}>
                                                    <Bot className="w-4 h-4 text-white" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center shadow-md">
                                                    <User className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Message Bubble */}
                                        <div className="relative">
                                            <div
                                                className={`rounded-2xl px-4 py-3 shadow-md transition-all ${message.role === 'user'
                                                    ? 'bg-gradient-to-r from-calm-600 to-peace-600 text-white rounded-tr-md'
                                                    : 'glass-card border border-gray-200/50 dark:border-gray-700/50 dark:bg-gray-800/60 rounded-tl-md'
                                                    }`}
                                            >
                                                <p className={`text-sm md:text-base whitespace-pre-wrap leading-relaxed ${message.role === 'assistant' ? 'text-gray-800 dark:text-gray-200' : ''
                                                    }`}>
                                                    {message.content}
                                                    {message.isStreaming && (
                                                        <span className="inline-block w-1.5 h-5 ml-0.5 bg-calm-500 animate-pulse rounded-sm" />
                                                    )}
                                                </p>

                                                {/* Footer: Time + Sentiment */}
                                                {!message.isStreaming && message.content && (
                                                    <div className={`flex items-center justify-between mt-2 gap-2 ${message.role === 'user' ? 'text-calm-100' : 'text-gray-400 dark:text-gray-500'
                                                        }`}>
                                                        <p className="text-xs flex items-center gap-1.5">
                                                            {new Date(message.timestamp).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </p>
                                                        {message.sentiment && message.role === 'assistant' && (
                                                            <div className="flex items-center gap-1">
                                                                <div className={`w-2 h-2 rounded-full ${getSentimentIndicator(message.sentiment)?.color}`} />
                                                                <span className="text-xs opacity-70">{message.sentiment.label}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Therapeutic Card (inline) */}
                                            {message.tool && !message.isStreaming && (
                                                <div className="mt-2">
                                                    <TherapeuticCard type={message.tool} />
                                                </div>
                                            )}

                                            {/* Action Buttons on Hover */}
                                            {!message.isStreaming && message.content && (
                                                <div className={`absolute ${message.role === 'user' ? '-left-16' : '-right-16'} top-1 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col gap-1`}>
                                                    <button
                                                        onClick={() => copyMessage(message.content, index)}
                                                        className="p-1.5 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:scale-110 transition-all"
                                                        title="Copy message"
                                                    >
                                                        {copiedMessageIndex === index ? (
                                                            <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                                                        ) : (
                                                            <Copy className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteMessage(index)}
                                                        className="p-1.5 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:scale-110 transition-all hover:border-red-300 dark:hover:border-red-700"
                                                        title="Remove from view"
                                                    >
                                                        <Trash2 className="w-3 h-3 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-gray-200/80 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-3 md:p-4">
                            <div className="max-w-4xl mx-auto">
                                <div className="flex gap-2 items-end">
                                    <div className="flex-1 relative">
                                        <Textarea
                                            ref={textareaRef}
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Type in any language..."
                                            className="resize-none bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-calm-500 dark:focus:border-calm-500 transition-all pr-24 rounded-xl min-h-[48px] max-h-[120px]"
                                            rows={1}
                                            disabled={isLoading}
                                            aria-label="Chat message input"
                                        />
                                        {/* Emoji & Voice Controls */}
                                        <div className="absolute right-2 bottom-2 flex items-center gap-0.5">
                                            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                                            <VoiceControls
                                                onTranscript={handleVoiceTranscript}
                                                textToSpeak={lastAiMessage}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={sendMessage}
                                        disabled={!input.trim() || isLoading}
                                        className="bg-gradient-to-r from-calm-600 to-peace-600 hover:from-calm-700 hover:to-peace-700 shadow-lg hover:shadow-glow h-12 w-12 p-0 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex-shrink-0"
                                        aria-label="Send message"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Send className="w-5 h-5" />
                                        )}
                                    </Button>
                                    {/* End Session Button */}
                                    {messages.length >= 4 && (
                                        <Button
                                            onClick={handleEndSession}
                                            variant="outline"
                                            className="h-12 w-12 p-0 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-soothe-400 dark:hover:border-soothe-500 transition-all hover:scale-105 flex-shrink-0"
                                            aria-label="End session"
                                            title="End session & see summary"
                                        >
                                            <LogOut className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                        </Button>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center flex items-center justify-center gap-1">
                                    <Lock className="w-3 h-3" />
                                    Safe & anonymous — your messages are encrypted end-to-end
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {/* Session Summary Overlay */}
                {showSessionSummary && (
                    <SessionSummary
                        sentimentHistory={sentimentHistory}
                        summary={sessionSummaryData}
                        isLoading={isSummaryLoading}
                        onDismiss={() => {
                            setShowSessionSummary(false);
                            setSessionSummaryData(null);
                        }}
                    />
                )}
            </div>

            {/* Crisis Overlay */}
            <CrisisOverlay
                isOpen={crisisActive}
                severity={crisisSeverity}
                onBreathingExercise={() => router.push('/breathing')}
                onAction={handleCrisisAction}
                onDismiss={handleCrisisDismiss}
            />
        </>
    );
}
