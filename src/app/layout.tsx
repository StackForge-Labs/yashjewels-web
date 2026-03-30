import type { Metadata } from "next";
import { Jost, Playfair_Display } from "next/font/google";
import "./globals.css";

const jost = Jost({
    variable: "--font-jost",
    subsets: ["latin"],
    display: "swap",
});

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Yash Jewels - High Jewelry",
    description: "The ultimate destination for earth-mined diamonds, high jewelry, and bespoke engagement rings.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${jost.variable} ${playfair.variable} h-full antialiased`} suppressHydrationWarning>
            <body className="flex min-h-full flex-col font-sans">{children}</body>
        </html>
    );
}
