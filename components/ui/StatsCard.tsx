'use client';

import { useEffect, useRef, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    color?: string;
    trend?: 'up' | 'down' | 'neutral';
    subtitle?: string;
    animate?: boolean;
}

export function StatsCard({
    title,
    value,
    icon: Icon,
    color = 'from-calm-500 to-peace-500',
    trend = 'neutral',
    subtitle,
    animate = true,
}: StatsCardProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;

    useEffect(() => {
        if (!animate || typeof value !== 'number') {
            setDisplayValue(numericValue);
            return;
        }

        let startTime: number;
        const duration = 1500; // 1.5 seconds

        const animateCount = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            setDisplayValue(Math.floor(progress * numericValue));

            if (progress < 1) {
                requestAnimationFrame(animateCount);
            }
        };

        requestAnimationFrame(animateCount);
    }, [numericValue, animate, value]);

    const trendColors = {
        up: 'text-green-600 dark:text-green-400',
        down: 'text-red-600 dark:text-red-400',
        neutral: 'text-gray-600 dark:text-gray-400',
    };

    const trendSymbols = {
        up: '↑',
        down: '↓',
        neutral: '→',
    };

    return (
        <div className="glass-card p-6 hover:shadow-glass-lg hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {typeof value === 'number' ? displayValue.toFixed(1) : value}
                        </h3>
                        {trend !== 'neutral' && (
                            <span className={cn('text-sm font-medium', trendColors[trend])}>
                                {trendSymbols[trend]}
                            </span>
                        )}
                    </div>
                    {subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
                    )}
                </div>
                <div
                    className={cn(
                        'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center',
                        'group-hover:scale-110 transition-transform duration-300',
                        color
                    )}
                >
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
}
