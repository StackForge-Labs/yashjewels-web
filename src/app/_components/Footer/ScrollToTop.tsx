"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed right-8 bottom-8 z-99 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow-2xl transition-all duration-300 hover:scale-110 dark:border dark:border-white/10 dark:bg-zinc-900 dark:text-white ${
                isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-10 opacity-0"
            }`}
            aria-label="Scroll to top"
        >
            <div className="text-gold absolute -top-1 left-1/2 -translate-x-1/2 overflow-hidden">
                <div className="h-1 w-1 animate-ping rounded-full bg-current"></div>
            </div>
            <ArrowUp size={20} strokeWidth={2} />
        </button>
    );
};
