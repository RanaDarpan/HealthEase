'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                'relative w-12 h-12 rounded-full glass-card transition-all duration-300',
                'hover:scale-110 hover:shadow-glow-sm',
                'flex items-center justify-center group'
            )}
            aria-label="Toggle theme"
        >
            <div className="relative w-6 h-6">
                <Sun
                    className={cn(
                        'absolute inset-0 w-6 h-6 text-yellow-500 transition-all duration-300',
                        theme === 'light'
                            ? 'rotate-0 scale-100 opacity-100'
                            : 'rotate-90 scale-0 opacity-0'
                    )}
                />
                <Moon
                    className={cn(
                        'absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-300',
                        theme === 'dark'
                            ? 'rotate-0 scale-100 opacity-100'
                            : '-rotate-90 scale-0 opacity-0'
                    )}
                />
            </div>

            {/* Glow effect */}
            <div className={cn(
                'absolute inset-0 rounded-full blur-md -z-10 transition-all duration-300',
                theme === 'light'
                    ? 'bg-yellow-400/20 group-hover:bg-yellow-400/40'
                    : 'bg-blue-400/20 group-hover:bg-blue-400/40'
            )} />
        </button>
    );
}
