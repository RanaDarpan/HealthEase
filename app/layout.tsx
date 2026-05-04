import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navigation } from "@/components/ui/Navigation";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "MindEase - Your Mental Wellness Companion",
    description: "Safe, anonymous mental health support available 24/7. AI-powered chat, mood tracking, breathing exercises, and crisis support.",
    keywords: ["mental health", "support", "anonymous", "wellbeing", "crisis help", "therapy", "counseling", "mood tracking"],
    authors: [{ name: "MindEase Team" }],
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#0ea5e9",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className} suppressHydrationWarning>
                <SessionProvider>
                    <ThemeProvider>
                        <Navigation />
                        <main className="pt-16">
                            {children}
                        </main>
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 4000,
                                style: {
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(16px)',
                                    color: '#1f2937',
                                    border: '1px solid rgba(229, 231, 235, 0.5)',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                },
                                success: {
                                    iconTheme: {
                                        primary: '#22c55e',
                                        secondary: '#fff',
                                    },
                                },
                                error: {
                                    iconTheme: {
                                        primary: '#ef4444',
                                        secondary: '#fff',
                                    },
                                },
                            }}
                        />
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
