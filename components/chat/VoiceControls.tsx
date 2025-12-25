'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceControlsProps {
    onTranscript: (text: string) => void;
    textToSpeak?: string;
    onSpeakingChange?: (isSpeaking: boolean) => void;
}

export function VoiceControls({ onTranscript, textToSpeak, onSpeakingChange }: VoiceControlsProps) {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const recognitionRef = useRef<any>(null);
    const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Check browser support on mount
    useEffect(() => {
        const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        setIsSupported(supported);

        if (supported) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                onTranscript(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = () => {
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, [onTranscript]);

    // Handle text-to-speech
    useEffect(() => {
        if (textToSpeak && window.speechSynthesis) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;

            utterance.onstart = () => {
                setIsSpeaking(true);
                onSpeakingChange?.(true);
            };

            utterance.onend = () => {
                setIsSpeaking(false);
                onSpeakingChange?.(false);
            };

            utterance.onerror = () => {
                setIsSpeaking(false);
                onSpeakingChange?.(false);
            };

            synthesisRef.current = utterance;
        }
    }, [textToSpeak, onSpeakingChange]);

    const toggleListening = () => {
        if (!isSupported || !recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (error) {
                console.error('Speech recognition error:', error);
                setIsListening(false);
            }
        }
    };

    const toggleSpeaking = () => {
        if (!window.speechSynthesis || !synthesisRef.current) return;

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            onSpeakingChange?.(false);
        } else {
            window.speechSynthesis.speak(synthesisRef.current);
        }
    };

    if (!isSupported) {
        return null; // Don't show if browser doesn't support
    }

    return (
        <div className="flex items-center gap-2">
            {/* Voice Input Button */}
            <button
                type="button"
                onClick={toggleListening}
                disabled={isSpeaking}
                className={cn(
                    'p-2 rounded-lg transition-all',
                    isListening
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse'
                        : 'text-gray-600 dark:text-gray-400 hover:text-calm-600 dark:hover:text-calm-400 hover:bg-gray-100 dark:hover:bg-gray-700',
                    'hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                aria-label={isListening ? 'Stop recording' : 'Start voice input'}
                title={isListening ? 'Stop recording' : 'Voice input'}
            >
                {isListening ? (
                    <MicOff className="w-5 h-5" />
                ) : (
                    <Mic className="w-5 h-5" />
                )}
            </button>

            {/* Voice Output Button (shown when there's text to speak) */}
            {textToSpeak && (
                <button
                    type="button"
                    onClick={toggleSpeaking}
                    disabled={isListening}
                    className={cn(
                        'p-2 rounded-lg transition-all',
                        isSpeaking
                            ? 'bg-calm-100 dark:bg-calm-900/30 text-calm-600 dark:text-calm-400 animate-pulse'
                            : 'text-gray-600 dark:text-gray-400 hover:text-calm-600 dark:hover:text-calm-400 hover:bg-gray-100 dark:hover:bg-gray-700',
                        'hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                    aria-label={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                    title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                >
                    {isSpeaking ? (
                        <VolumeX className="w-5 h-5" />
                    ) : (
                        <Volume2 className="w-5 h-5" />
                    )}
                </button>
            )}
        </div>
    );
}
