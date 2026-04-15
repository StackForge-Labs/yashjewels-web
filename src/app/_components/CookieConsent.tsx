"use client";

import { useState, useEffect } from "react";
import { Cookie, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already accepted
        const consent = localStorage.getItem("yash_cookie_consent");
        if (!consent) {
            // Show after a short delay for a more premium feel
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("yash_cookie_consent", "accepted");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] animate-in slide-in-from-bottom-full duration-700 ease-out">
            <div className="relative border-t border-gray-100 bg-white/80 px-6 py-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl dark:border-white/5 dark:bg-[#0a0a0a]/80 lg:px-12 lg:py-8">
                {/* Subtle decorative glow */}
                <div className="absolute left-1/2 top-0 h-[1px] w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>

                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 lg:flex-row">
                    {/* Left Side: Icon & Text */}
                    <div className="flex items-center gap-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold shadow-inner">
                            <Cookie size={20} className="animate-pulse" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-serif text-lg tracking-wide text-gray-900 dark:text-white lg:text-base">Maison Cookie Selection</h3>
                            <p className="max-w-2xl text-[10px] leading-relaxed text-gray-400 dark:text-gray-500 uppercase tracking-widest lg:text-[9px]">
                                Enhancing your browsing experience with premium cookies and analytical insights.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Actions & Shield */}
                    <div className="flex w-full flex-wrap items-center justify-center gap-6 lg:w-auto lg:gap-10">
                        <div className="hidden items-center gap-2 border-r border-gray-100 pr-10 dark:border-white/5 lg:flex">
                            <ShieldCheck size={14} className="text-gold/60" />
                            <span className="text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase">Secure Maison Policy</span>
                        </div>

                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setIsVisible(false)}
                                className="text-[10px] font-bold tracking-[0.2em] text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase transition-colors"
                            >
                                Preferences
                            </button>
                            <Button
                                onClick={handleAccept}
                                className="h-10 px-8 bg-gold hover:bg-gold/90 text-white font-bold tracking-[0.2em] uppercase rounded-lg shadow-lg shadow-gold/20 transition-all active:scale-95"
                            >
                                Accept All
                            </Button>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="ml-2 text-gray-400 hover:text-gold transition-colors lg:hidden"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
