import Link from 'next/link';
import { Heart, Home, MessageCircle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-calm-50 via-white to-peace-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-calm-200/30 dark:bg-calm-700/10 blur-3xl animate-float" />
                <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full bg-peace-200/30 dark:bg-peace-700/10 blur-3xl animate-float-slow" />
            </div>

            <div className="relative z-10 text-center max-w-lg">
                {/* Icon */}
                <div className="mb-8 animate-float">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-calm-500 to-peace-500 shadow-glow">
                        <Heart className="w-12 h-12 text-white" />
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-7xl font-bold gradient-text mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
                    It looks like you wandered off the path. Don't worry — let's get you back to a safe space.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-calm-600 to-peace-600 text-white font-medium hover:from-calm-700 hover:to-peace-700 shadow-lg hover:shadow-glow transition-all hover:scale-105"
                    >
                        <Home className="w-5 h-5" />
                        Go Home
                    </Link>
                    <Link
                        href="/chat"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-calm-300 dark:border-calm-700 text-calm-700 dark:text-calm-400 font-medium hover:bg-calm-50 dark:hover:bg-calm-900/20 transition-all"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Chat with Ease
                    </Link>
                </div>
            </div>
        </div>
    );
}
