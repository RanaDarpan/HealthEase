'use client';

import { ChatInterface } from '@/components/chat/ChatInterface';
import { MessageCircle, Sparkles } from 'lucide-react';

export default function ChatPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-br from-calm-50 via-white to-peace-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Page Header */}
            <div className="glass-card mx-4 mt-4 mb-2 px-6 py-4 border border-white/20 dark:border-gray-700/30 shadow-glass-lg animate-fadeIn">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-calm-500 to-peace-500 flex items-center justify-center shadow-glow animate-float">
                            <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-white dark:border-gray-900 animate-pulse" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
                            AI Chat Companion
                            <Sparkles className="w-5 h-5 text-calm-500 dark:text-calm-400 animate-pulse" />
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                            Safe, anonymous support available 24/7
                        </p>
                    </div>
                </div>
            </div>

            {/* Chat Interface */}
            <div className="flex-1 overflow-hidden mx-4 mb-4">
                <div className="h-full glass-card border border-white/20 dark:border-gray-700/30 shadow-glass-lg rounded-2xl overflow-hidden animate-scaleIn">
                    <ChatInterface />
                </div>
            </div>
        </div>
    );
}
