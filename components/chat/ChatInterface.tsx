'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Loader2, MessageCircle, Lock, Copy, Trash2, Check } from 'lucide-react';
import { CrisisOverlay } from '@/components/crisis/CrisisOverlay';
import { EmojiPicker } from './EmojiPicker';
import { VoiceControls } from './VoiceControls';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    sentiment?: {
        score: number;
        label: string;
    };
}

interface ChatInterfaceProps {
    sessionId?: string;
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
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    sessionId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();

            // Update session ID if new
            if (data.sessionId && !sessionId) {
                setSessionId(data.sessionId);
            }

            // Check for crisis
            if (data.crisisDetected) {
                setCrisisActive(true);
                setCrisisSeverity(data.crisisData.severity);

                // Log crisis event
                await fetch('/api/crisis/log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sessionId: data.sessionId,
                        action: 'none',
                    }),
                });
            }

            // Add AI response
            const aiMessage: Message = {
                role: 'assistant',
                content: data.message,
                timestamp: new Date(),
                sentiment: data.sentiment,
            };

            setMessages(prev => [...prev, aiMessage]);
            setLastAiMessage(data.message); // For text-to-speech
        } catch (error) {
            console.error('Error sending message:', error);

            // Add error message
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'I apologize, but I encountered an error. Please try again.',
                timestamp: new Date(),
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleEmojiSelect = (emoji: string) => {
        setInput(prev => prev + emoji);
    };

    const handleVoiceTranscript = (transcript: string) => {
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
    };

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
                body: JSON.stringify({
                    sessionId,
                    action,
                }),
            });
        }

        if (action === 'breathing') {
            // Navigate to breathing exercise
            window.location.href = '/breathing';
        }
    };

    const getSentimentColor = (sentiment?: { score: number; label: string }) => {
        if (!sentiment) return 'bg-gray-100';

        if (sentiment.label === 'crisis') return 'bg-red-50 border-red-200';
        if (sentiment.label === 'negative') return 'bg-orange-50 border-orange-200';
        if (sentiment.label === 'positive') return 'bg-soothe-50 border-soothe-200';
        return 'bg-gray-50 border-gray-200';
    };

    return (
        <>
            <div className="flex flex-col h-full bg-gradient-to-br from-calm-50/50 to-peace-50/50 dark:from-gray-900 dark:to-gray-800">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500 dark:text-gray-400 mt-8 animate-fadeIn">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-calm-500 to-peace-500 flex items-center justify-center animate-float shadow-glow">
                                <MessageCircle className="w-10 h-10 text-white" />
                            </div>
                            <p className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Welcome to HealthEase</p>
                            <p className="text-sm max-w-md mx-auto">
                                I'm here to listen and support you. Share what's on your mind in a safe, anonymous space.
                            </p>
                        </div>
                    )}

                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`group flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
                            style={{ animationDelay: `${index * 0.02}s` }}
                        >
                            <div className="relative">
                                <div
                                    className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-lg transition-all hover:scale-[1.02] ${message.role === 'user'
                                        ? 'bg-gradient-to-r from-calm-600 to-peace-600 text-white'
                                        : `glass-card border-2 ${getSentimentColor(message.sentiment)} dark:bg-gray-800/50`
                                        }`}
                                >
                                    <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                                        {message.content}
                                    </p>
                                    <div className={`flex items-center justify-between mt-2 ${message.role === 'user' ? 'text-calm-100' : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                        <p className="text-xs flex items-center gap-1">
                                            <span>{new Date(message.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}</span>
                                            {message.sentiment && (
                                                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20 dark:bg-black/20">
                                                    {message.sentiment.label}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                {/* Message Actions */}
                                <div className={`absolute ${message.role === 'user' ? 'left-full ml-2' : 'right-full mr-2'} top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1`}>
                                    <button
                                        onClick={() => copyMessage(message.content, index)}
                                        className="p-1.5 rounded-lg glass-card hover:scale-110 transition-all"
                                        title="Copy message"
                                    >
                                        {copiedMessageIndex === index ? (
                                            <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                                        ) : (
                                            <Copy className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => deleteMessage(index)}
                                        className="p-1.5 rounded-lg glass-card hover:scale-110 transition-all hover:bg-red-50 dark:hover:bg-red-900/20"
                                        title="Delete message"
                                    >
                                        <Trash2 className="w-3 h-3 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start animate-fadeIn">
                            <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-2 dark:bg-gray-800/50">
                                <Loader2 className="w-5 h-5 animate-spin text-calm-600 dark:text-calm-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-200 dark:border-gray-700 glass-strong dark:bg-gray-800/90 p-4">
                    <div className="flex flex-col gap-3">
                        {/* Textarea with controls */}
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <Textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message or use voice/emoji..."
                                    className="resize-none bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-calm-500 dark:focus:border-calm-400 transition-all pr-24"
                                    rows={3}
                                    disabled={isLoading}
                                    aria-label="Chat message input"
                                />
                                {/* Emoji & Voice Controls */}
                                <div className="absolute right-2 top-2 flex items-center gap-1">
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
                                className="bg-gradient-to-r from-calm-600 to-peace-600 hover:from-calm-700 hover:to-peace-700 shadow-lg hover:shadow-glow h-full transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 px-6"
                                aria-label="Send message"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center flex items-center justify-center gap-1">
                            <Lock className="w-3 h-3" />
                            This is a safe, anonymous space. Your messages are encrypted.
                        </p>
                    </div>
                </div>
            </div>

            {/* Crisis Overlay */}
            <CrisisOverlay
                isOpen={crisisActive}
                severity={crisisSeverity}
                onBreathingExercise={() => { }}
                onAction={handleCrisisAction}
            />
        </>
    );
}
