'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FloatingElementProps {
    className?: string;
    variant?: 'circle' | 'blob' | 'square';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: string;
    delay?: number;
}

const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-96 h-96',
};

export function FloatingElement({
    className,
    variant = 'circle',
    size = 'md',
    color = 'from-calm-400/20 to-peace-400/20',
    delay = 0,
}: FloatingElementProps) {
    const shapeClass = variant === 'circle'
        ? 'rounded-full'
        : variant === 'blob'
            ? 'rounded-[40%_60%_70%_30%/60%_30%_70%_40%]'
            : 'rounded-3xl';

    return (
        <div
            className={cn(
                'absolute blur-3xl opacity-50',
                sizeClasses[size],
                shapeClass,
                'bg-gradient-to-br',
                color,
                'animate-float-slow pointer-events-none',
                className
            )}
            style={{ animationDelay: `${delay}s` }}
        />
    );
}
