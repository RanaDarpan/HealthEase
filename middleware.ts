import { NextRequest, NextResponse } from 'next/server';

/**
 * In-memory rate limiter with automatic cleanup.
 * NOTE: For production behind load balancers, use Redis (Upstash) instead.
 */
const rateLimitMap = new Map<string, { count: number; firstRequest: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30;
const MAX_MESSAGE_LENGTH = 5000; // Max chars per message

// Cleanup expired entries every 5 minutes to prevent memory leak
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredEntries() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;

    lastCleanup = now;
    const keys = Array.from(rateLimitMap.keys());
    for (const key of keys) {
        const value = rateLimitMap.get(key);
        if (value && now - value.firstRequest > RATE_LIMIT_WINDOW) {
            rateLimitMap.delete(key);
        }
    }
}

function rateLimit(ip: string): boolean {
    cleanupExpiredEntries();

    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now - entry.firstRequest > RATE_LIMIT_WINDOW) {
        rateLimitMap.set(ip, { count: 1, firstRequest: now });
        return true;
    }

    if (entry.count >= MAX_REQUESTS) {
        return false;
    }

    entry.count++;
    return true;
}

/**
 * Security headers applied to all routes
 */
const securityHeaders = {
    'X-DNS-Prefetch-Control': 'on',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(self), geolocation=()',
};

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Apply security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    // Rate limit API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
            'unknown';

        if (!rateLimit(ip)) {
            return NextResponse.json(
                {
                    error: 'Too many requests. Please wait a moment before trying again.',
                    retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000),
                },
                { status: 429 }
            );
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
