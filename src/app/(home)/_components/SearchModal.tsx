"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, X, SlidersHorizontal, Gem, DollarSign, Activity } from "lucide-react";

export default function SearchModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false);
        }
    };

    const modalContent = (
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
                onClick={handleBackdropClick}
                className={`fixed inset-0 z-99999 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md transition-all duration-500 ${
                    isOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
                }`}
            >
                {/* Modal Map */}
                <div
                    className={`relative w-full border border-transparent bg-white shadow-[0_0_60px_rgba(0,0,0,0.5)] transition-all duration-500 md:w-11/12 md:max-w-6xl md:rounded-3xl dark:border-white/10 dark:bg-[#090909] ${
                        isOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-95 opacity-0"
                    }`}
                >
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-6 right-6 z-10 rounded-full bg-gray-50 p-3 text-gray-500 transition-all duration-300 hover:rotate-90 hover:bg-red-50 hover:text-red-500 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                    >
                        <X size={24} />
                    </button>

                    <div className="p-8 md:p-12">
                        {/* Search Input Box */}
                        <div className="relative mb-12">
                            <Search
                                size={36}
                                className="text-gold absolute top-1/2 left-0 -translate-y-1/2 opacity-80"
                                strokeWidth={1.5}
                            />
                            <input
                                type="text"
                                placeholder="Search for exquisite diamonds, rings..."
                                className="focus:border-gold w-full border-b-2 border-gray-200 bg-transparent py-6 pr-4 pl-14 font-serif text-3xl text-gray-900 transition-colors placeholder:text-gray-300 focus:outline-none lg:text-5xl dark:border-white/10 dark:text-white dark:placeholder:text-gray-700"
                                autoFocus={isOpen}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                            {/* Search Criteria - Categories */}
                            <div>
                                <h4 className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-3 font-serif text-xl font-medium text-gray-900 dark:border-white/5 dark:text-white">
                                    <SlidersHorizontal size={20} className="text-gold" /> Categories
                                </h4>
                                <ul className="space-y-4">
                                    {[
                                        "Engagement Rings",
                                        "Wedding Bands",
                                        "Fine Necklaces",
                                        "Diamond Earrings",
                                        "Luxury Bracelets",
                                    ].map((item) => (
                                        <li key={item}>
                                            <label className="group flex cursor-pointer items-center gap-4">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox text-gold focus:ring-gold custom-checkbox group-hover:border-gold pointer-events-none h-5 w-5 rounded border-gray-300 bg-gray-50 transition-colors dark:border-white/20 dark:bg-black"
                                                />
                                                <span className="group-hover:text-gold text-sm font-medium text-gray-600 transition-colors dark:text-gray-400">
                                                    {item}
                                                </span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Search Criteria - Material */}
                            <div>
                                <h4 className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-3 font-serif text-xl font-medium text-gray-900 dark:border-white/5 dark:text-white">
                                    <Gem size={20} className="text-gold" /> Materials
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        "18K Yellow Gold",
                                        "18K White Gold",
                                        "18K Rose Gold",
                                        "Platinum 950",
                                        "Titanium",
                                        "Silver",
                                    ].map((material) => (
                                        <button
                                            key={material}
                                            className="hover:border-gold hover:text-gold dark:hover:border-gold dark:hover:text-gold rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-[11px] font-bold tracking-widest text-gray-600 uppercase transition-all hover:shadow-md dark:border-white/10 dark:bg-black dark:text-gray-400"
                                        >
                                            {material}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* NEW: Price & Diamond Specs */}
                            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:col-span-2">
                                {/* Price */}
                                <div>
                                    <h4 className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-3 font-serif text-xl font-medium text-gray-900 dark:border-white/5 dark:text-white">
                                        <DollarSign size={20} className="text-gold" /> Price Range (USD)
                                    </h4>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-full">
                                            <span className="absolute top-1/2 left-4 -translate-y-1/2 font-bold text-gray-400">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                defaultValue="1000"
                                                className="focus:border-gold focus:ring-gold w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pr-3 pl-10 text-sm font-bold shadow-inner transition-all outline-none focus:ring-1 dark:border-white/10 dark:bg-black dark:text-white"
                                            />
                                        </div>
                                        <span className="font-bold text-gray-400">-</span>
                                        <div className="relative w-full">
                                            <span className="absolute top-1/2 left-4 -translate-y-1/2 font-bold text-gray-400">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                defaultValue="50000"
                                                className="focus:border-gold focus:ring-gold w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pr-3 pl-10 text-sm font-bold shadow-inner transition-all outline-none focus:ring-1 dark:border-white/10 dark:bg-black dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    {/* Carat Weight Slider placeholder */}
                                    <h4 className="mt-8 mb-6 flex items-center gap-3 border-b border-gray-100 pb-3 font-serif text-xl font-medium text-gray-900 dark:border-white/5 dark:text-white">
                                        <Activity size={20} className="text-gold" /> Carat Weight (ct)
                                    </h4>
                                    <div className="px-2">
                                        <input
                                            type="range"
                                            min="0.5"
                                            max="10"
                                            step="0.5"
                                            defaultValue="3"
                                            className="accent-gold h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                                        />
                                        <div className="mt-2 flex justify-between text-xs font-bold text-gray-400">
                                            <span>0.5ct</span>
                                            <span className="text-gold">3.0ct</span>
                                            <span>10ct+</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Diamond Cut */}
                                <div>
                                    <h4 className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-3 font-serif text-xl font-medium text-gray-900 dark:border-white/5 dark:text-white">
                                        Diamond Cut
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {["Round", "Princess", "Cushion", "Emerald", "Oval", "Pear"].map((cut) => (
                                            <button
                                                key={cut}
                                                className="hover:border-gold hover:text-gold dark:hover:border-gold rounded-lg border border-gray-200 bg-white px-2 py-3 text-xs font-bold tracking-wider text-gray-600 uppercase transition-all dark:border-white/10 dark:bg-[#111] dark:text-gray-300"
                                            >
                                                {cut}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-14 flex items-center justify-between border-t border-gray-100 pt-8 dark:border-white/10">
                            <button className="text-sm font-bold tracking-widest text-gray-400 uppercase transition-colors hover:text-red-500">
                                Reset Filters
                            </button>
                            <button className="hover:bg-gold hover:shadow-gold/30 dark:hover:bg-gold bg-gray-900 px-12 py-4 text-sm font-bold tracking-[0.2em] text-white uppercase shadow-lg transition-all duration-300 dark:bg-white dark:text-black dark:hover:text-white">
                                Show 1,420 Results &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="hover:text-gold transform transition-colors duration-300 hover:scale-110"
                aria-label="Open Search"
            >
                <Search size={22} strokeWidth={1.5} />
            </button>
            {mounted && createPortal(modalContent, document.body)}
            <style jsx>{`
                .custom-checkbox:checked {
                    background-color: #d4af37;
                    border-color: #d4af37;
                }
            `}</style>
        </>
    );
}
