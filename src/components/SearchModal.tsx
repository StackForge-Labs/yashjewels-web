"use client";

import React, { useState, useEffect } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

export default function SearchModal() {
    const [isOpen, setIsOpen] = useState(false);

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        if (isOpen) {
            document.body.style.overflow = "hidden"; // Prevent scrolling
            window.addEventListener("keydown", handleKeyDown);
        } else {
            document.body.style.overflow = "auto";
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="hover:text-gold transform transition-colors duration-300 hover:scale-110"
                aria-label="Open Search"
            >
                <Search size={22} strokeWidth={1.5} />
            </button>

            {/* Overlay */}
            <div
                className={`fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm transition-all duration-500 ${
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                }`}
            >
                {/* Modal Map */}
                <div
                    className={`relative mt-0 w-full bg-white shadow-2xl transition-all duration-500 md:mt-10 md:w-11/12 md:max-w-4xl md:rounded-2xl dark:bg-[#0a0a0a] border dark:border-white/10 ${
                        isOpen ? "translate-y-0" : "-translate-y-16"
                    }`}
                >
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors dark:hover:bg-white/10 dark:hover:text-white"
                    >
                        <X size={24} />
                    </button>

                    <div className="p-8 md:p-12">
                        {/* Search Input Box */}
                        <div className="relative mb-10">
                            <Search
                                size={28}
                                className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
                                strokeWidth={1.5}
                            />
                            <input
                                type="text"
                                placeholder="Search for jewelry, diamonds, collections..."
                                className="w-full border-b-2 border-gray-200 bg-transparent py-4 pl-12 pr-4 text-2xl lg:text-3xl font-light text-gray-900 placeholder:text-gray-300 focus:border-gold focus:outline-none transition-colors dark:border-white/10 dark:text-white dark:placeholder:text-gray-600"
                                autoFocus={isOpen}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                            {/* Search Criteria - Categories */}
                            <div>
                                <h4 className="mb-4 flex items-center gap-2 font-serif text-lg font-medium text-gray-900 dark:text-white">
                                    <SlidersHorizontal size={18} className="text-gold" /> Categories
                                </h4>
                                <ul className="space-y-3">
                                    {["Engagement Rings", "Wedding Bands", "Fine Necklaces", "Earrings", "Bracelets"].map((item) => (
                                        <li key={item}>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input type="checkbox" className="form-checkbox text-gold h-4 w-4 rounded border-gray-300 focus:ring-gold bg-transparent transition-colors custom-checkbox group-hover:border-gold" />
                                                <span className="text-sm text-gray-600 group-hover:text-gold transition-colors dark:text-gray-400">{item}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Search Criteria - Material */}
                            <div>
                                <h4 className="mb-4 font-serif text-lg font-medium text-gray-900 dark:text-white">Materials</h4>
                                <div className="flex flex-wrap gap-2">
                                    {["18K Yellow Gold", "18K White Gold", "18K Rose Gold", "Platinum", "Silver"].map((material) => (
                                        <button key={material} className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-gold hover:text-gold dark:border-white/10 dark:bg-black dark:text-gray-400 dark:hover:border-gold">
                                            {material}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Popular Suggestions */}
                            <div>
                                <h4 className="mb-4 font-serif text-lg font-medium text-gray-900 dark:text-white">Popular Right Now</h4>
                                <ul className="space-y-3">
                                    {["Diamond Tennis Bracelets", "Solitaire Rings", "GIA Certified Diamonds", "Pearl Drop Earrings"].map((item) => (
                                        <li key={item}>
                                            <a href="#" className="text-sm text-gray-500 hover:text-gold transition-colors flex items-center gap-2 dark:text-gray-400">
                                                <Search size={14} className="text-gray-300 dark:text-gray-600" />
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-6 dark:border-white/10">
                            <button className="text-sm font-medium text-gray-500 hover:text-gray-900 underline transition-colors dark:text-gray-400 dark:hover:text-white">
                                Clear All
                            </button>
                            <button className="bg-gray-900 px-8 py-3 text-sm font-bold tracking-widest text-white uppercase transition-colors hover:bg-gold dark:bg-white dark:text-black dark:hover:bg-gold dark:hover:text-white">
                                Generate Results
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .custom-checkbox:checked {
                    background-color: #d4af37;
                    border-color: #d4af37;
                }
            `}</style>
        </>
    );
}
