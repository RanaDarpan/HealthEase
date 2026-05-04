'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Heart, Home, LayoutDashboard, MessageCircle, BookOpen, Package, LogOut, LogIn, UserPlus, User, UserX, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { useState, useRef, useEffect } from 'react';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/chat', label: 'Chat', icon: MessageCircle },
    { href: '/mood', label: 'Mood', icon: Heart },
    { href: '/resources', label: 'Resources', icon: Package },
];

export function Navigation() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menus when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/20 dark:border-gray-700/50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-calm-500 to-peace-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <span className="text-lg sm:text-xl font-bold gradient-text">
                                HealthEase
                            </span>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium',
                                            isActive
                                                ? 'bg-gradient-to-r from-calm-500 to-peace-500 text-white shadow-md'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:text-calm-600 dark:hover:text-calm-400'
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right Side: Theme Toggle & Auth & Mobile Menu */}
                        <div className="flex items-center gap-2">
                            <ThemeToggle />

                            {/* Auth Section — Desktop */}
                            <div className="hidden md:block">
                                {status === 'loading' ? (
                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                                ) : session ? (
                                    <div className="relative" ref={menuRef}>
                                        <button
                                            onClick={() => setShowUserMenu(!showUserMenu)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg glass-card hover:scale-105 transition-all"
                                        >
                                            {(session.user as any)?.anonymousMode ? (
                                                <UserX className="w-5 h-5 text-calm-600 dark:text-calm-400" />
                                            ) : (
                                                <User className="w-5 h-5 text-calm-600 dark:text-calm-400" />
                                            )}
                                            <span className="hidden lg:inline text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[160px] truncate">
                                                {(session.user as any)?.anonymousMode ? 'Anonymous' : session.user?.email}
                                            </span>
                                        </button>

                                        {showUserMenu && (
                                            <div className="absolute right-0 mt-2 w-56 glass-card rounded-xl shadow-glass-lg overflow-hidden animate-scaleIn z-50">
                                                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        {(session.user as any)?.anonymousMode ? 'Anonymous User' : session.user?.email}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        {(session.user as any)?.anonymousMode ? 'Private Session' : 'Signed In'}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={handleSignOut}
                                                    className="w-full px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href="/auth/signin"
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all"
                                        >
                                            <LogIn className="w-4 h-4" />
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/auth/signup"
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-calm-600 to-peace-600 text-white font-medium shadow-lg hover:shadow-glow transition-all hover:scale-105 text-sm"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Hamburger */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                ) : (
                                    <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fadeIn"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div className="absolute top-16 left-0 right-0 glass-strong border-b border-white/20 dark:border-gray-700/50 animate-slideUp max-h-[calc(100vh-4rem)] overflow-y-auto">
                        <div className="px-4 py-4 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-base font-medium',
                                            isActive
                                                ? 'bg-gradient-to-r from-calm-500 to-peace-500 text-white shadow-md'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.label}
                                    </Link>
                                );
                            })}

                            {/* Journal link in mobile */}
                            <Link
                                href="/journal"
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-base font-medium',
                                    pathname === '/journal'
                                        ? 'bg-gradient-to-r from-calm-500 to-peace-500 text-white shadow-md'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                                )}
                            >
                                <BookOpen className="w-5 h-5" />
                                Journal
                            </Link>
                        </div>

                        {/* Auth Section — Mobile */}
                        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                            {session ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 px-4 py-2">
                                        <User className="w-5 h-5 text-calm-600 dark:text-calm-400" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {(session.user as any)?.anonymousMode ? 'Anonymous User' : session.user?.email}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {(session.user as any)?.anonymousMode ? 'Private Session' : 'Signed In'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-base font-medium"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Link
                                        href="/auth/signin"
                                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-calm-400 transition-all"
                                    >
                                        <LogIn className="w-5 h-5" />
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-calm-600 to-peace-600 text-white font-medium shadow-lg text-base"
                                    >
                                        <UserPlus className="w-5 h-5" />
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
