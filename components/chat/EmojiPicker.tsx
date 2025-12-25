'use client';

import { useState, useRef, useEffect } from 'react';
import { Smile, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string) => void;
    className?: string;
}

const EMOJI_CATEGORIES = {
    '😊 Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥳', '😏'],
    '❤️ Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
    '👍 Gestures': ['👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘', '👌', '🤌', '🤏', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤙', '💪', '🙏'],
    '😢 Emotions': ['😢', '😭', '😤', '😠', '😡', '🤬', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤'],
    '🌟 Objects': ['⭐', '✨', '🌟', '💫', '🔥', '💧', '💦', '☀️', '🌙', '⚡', '☁️', '🌈', '🎉', '🎊', '🎈', '🎁', '🏆', '🏅', '🥇', '💎', '💰'],
    '🌸 Nature': ['🌸', '🌺', '🌻', '🌷', '🌹', '🥀', '🌼', '🌱', '🌿', '☘️', '🍀', '🌾', '🌵', '🎋', '🎍', '🍃', '🍂', '🍁', '🌴', '🌳', '🌲'],
};

export function EmojiPicker({ onEmojiSelect, className }: EmojiPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(Object.keys(EMOJI_CATEGORIES)[0]);
    const pickerRef = useRef<HTMLDivElement>(null);

    // Close picker when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleEmojiClick = (emoji: string) => {
        onEmojiSelect(emoji);
        // Don't close picker so users can select multiple emojis
    };

    return (
        <div className={cn('relative', className)} ref={pickerRef}>
            {/* Emoji Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'p-2 rounded-lg transition-all hover:scale-110',
                    'text-gray-600 dark:text-gray-400 hover:text-calm-600 dark:hover:text-calm-400',
                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                    isOpen && 'bg-calm-100 dark:bg-calm-900/30 text-calm-600 dark:text-calm-400'
                )}
                aria-label="Add emoji"
            >
                <Smile className="w-5 h-5" />
            </button>

            {/* Emoji Picker Popup */}
            {isOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-80 glass-card rounded-2xl shadow-glass-lg overflow-hidden animate-scaleIn dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Emojis</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-1 p-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                        {Object.keys(EMOJI_CATEGORIES).map((category) => {
                            const categoryEmoji = category.split(' ')[0];
                            return (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={cn(
                                        'px-3 py-1.5 rounded-lg text-lg transition-all',
                                        activeCategory === category
                                            ? 'bg-calm-100 dark:bg-calm-900/30 scale-110'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
                                    )}
                                    title={category}
                                >
                                    {categoryEmoji}
                                </button>
                            );
                        })}
                    </div>

                    {/* Emoji Grid */}
                    <div className="p-3 h-64 overflow-y-auto">
                        <div className="grid grid-cols-8 gap-2">
                            {EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES].map((emoji, index) => (
                                <button
                                    key={`${emoji}-${index}`}
                                    onClick={() => handleEmojiClick(emoji)}
                                    className="text-2xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-125 active:scale-95"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Click emoji to add to message
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
