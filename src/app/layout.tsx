import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { AOSInit } from "@/components/AOSInit";
import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";

const cormorant = Cormorant_Garamond({
    variable: "--font-cormorant",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
});

const outfit = Outfit({
    variable: "--font-outfit",
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
        <html
            lang="en"
            className={`${cormorant.variable} ${outfit.variable} h-full antialiased`}
            suppressHydrationWarning
        >
            <body className="flex min-h-full flex-col bg-white font-sans dark:bg-[#030303]">
                <AOSInit />
                <Header />
                <main className="grow pb-0">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
