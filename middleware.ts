import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting storage (in-memory for development)
// In production, use Redis or similar
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
};

function getRateLimitKey(req: NextRequest): string {
    // Use IP address or session ID for rate limiting
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown';
    return `rate-limit:${ip}`;
}

function checkRateLimit(key: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(key);

    if (!record || now > record.resetTime) {
        // New window
        rateLimitMap.set(key, {
            count: 1,
            resetTime: now + RATE_LIMIT.windowMs,
        });
        return true;
    }

    if (record.count >= RATE_LIMIT.maxRequests) {
        // Rate limit exceeded
        return false;
    }

    // Increment count
    record.count++;
    return true;
}

export function middleware(req: NextRequest) {
    // Apply rate limiting to API routes
    if (req.nextUrl.pathname.startsWith('/api/')) {
        const key = getRateLimitKey(req);
        const allowed = checkRateLimit(key);

        if (!allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }
    }

    // Add security headers
    const response = NextResponse.next();

    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
}

export const config = {
    matcher: [
        '/api/:path*',
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
