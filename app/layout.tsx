import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navigation } from "@/components/ui/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "HealthEase - Your Mental Wellness Companion",
    description: "Safe, anonymous mental health support available 24/7",
    keywords: ["mental health", "support", "anonymous", "wellbeing", "crisis help"],
    authors: [{ name: "HealthEase Team" }],
    viewport: "width=device-width, initial-scale=1",
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
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
