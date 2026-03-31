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
                className={`fixed inset-0 z-99999 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-500 overflow-y-auto p-4 ${
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                }`}
            >
                {/* Modal Map */}
                <div
                    className={`relative w-full bg-white shadow-[0_0_60px_rgba(0,0,0,0.5)] transition-all duration-500 md:w-11/12 md:max-w-6xl md:rounded-3xl dark:bg-[#090909] border border-transparent dark:border-white/10 ${
                        isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-8"
                    }`}
                >
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute right-6 top-6 z-10 rounded-full bg-gray-50 p-3 text-gray-500 hover:bg-red-50 hover:text-red-500 hover:rotate-90 transition-all duration-300 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                    >
                        <X size={24} />
                    </button>

                    <div className="p-8 md:p-12">
                        {/* Search Input Box */}
                        <div className="relative mb-12">
                            <Search
                                size={36}
                                className="absolute left-0 top-1/2 -translate-y-1/2 text-gold opacity-80"
                                strokeWidth={1.5}
                            />
                            <input
                                type="text"
                                placeholder="Search for exquisite diamonds, rings..."
                                className="w-full border-b-2 border-gray-200 bg-transparent py-6 pl-14 pr-4 text-3xl lg:text-5xl font-serif text-gray-900 placeholder:text-gray-300 focus:border-gold focus:outline-none transition-colors dark:border-white/10 dark:text-white dark:placeholder:text-gray-700"
                                autoFocus={isOpen}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                            {/* Search Criteria - Categories */}
                            <div>
                                <h4 className="mb-6 flex items-center gap-3 font-serif text-xl font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">
                                    <SlidersHorizontal size={20} className="text-gold" /> Categories
                                </h4>
                                <ul className="space-y-4">
                                    {["Engagement Rings", "Wedding Bands", "Fine Necklaces", "Diamond Earrings", "Luxury Bracelets"].map((item) => (
                                        <li key={item}>
                                            <label className="flex items-center gap-4 cursor-pointer group">
                                                <input type="checkbox" className="form-checkbox text-gold h-5 w-5 rounded border-gray-300 focus:ring-gold bg-gray-50 transition-colors custom-checkbox group-hover:border-gold pointer-events-none dark:bg-black dark:border-white/20" />
                                                <span className="text-sm font-medium text-gray-600 group-hover:text-gold transition-colors dark:text-gray-400">{item}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Search Criteria - Material */}
                            <div>
                                <h4 className="mb-6 flex items-center gap-3 font-serif text-xl font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">
                                    <Gem size={20} className="text-gold" /> Materials
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {["18K Yellow Gold", "18K White Gold", "18K Rose Gold", "Platinum 950", "Titanium", "Silver"].map((material) => (
                                        <button key={material} className="rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-[11px] uppercase tracking-widest font-bold text-gray-600 transition-all hover:border-gold hover:text-gold hover:shadow-md dark:border-white/10 dark:bg-black dark:text-gray-400 dark:hover:border-gold dark:hover:text-gold">
                                            {material}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* NEW: Price & Diamond Specs */}
                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-10">
                                {/* Price */}
                                <div>
                                    <h4 className="mb-6 flex items-center gap-3 font-serif text-xl font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">
                                        <DollarSign size={20} className="text-gold" /> Price Range (USD)
                                    </h4>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-full">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                            <input type="number" placeholder="Min" defaultValue="1000" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-3 text-sm font-bold focus:border-gold focus:ring-1 focus:ring-gold outline-none dark:bg-black dark:border-white/10 dark:text-white transition-all shadow-inner" />
                                        </div>
                                        <span className="text-gray-400 font-bold">-</span>
                                        <div className="relative w-full">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                            <input type="number" placeholder="Max" defaultValue="50000" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-3 text-sm font-bold focus:border-gold focus:ring-1 focus:ring-gold outline-none dark:bg-black dark:border-white/10 dark:text-white transition-all shadow-inner" />
                                        </div>
                                    </div>
                                    
                                    {/* Carat Weight Slider placeholder */}
                                    <h4 className="mt-8 mb-6 flex items-center gap-3 font-serif text-xl font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">
                                        <Activity size={20} className="text-gold" /> Carat Weight (ct)
                                    </h4>
                                    <div className="px-2">
                                        <input type="range" min="0.5" max="10" step="0.5" defaultValue="3" className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold dark:bg-gray-700" />
                                        <div className="flex justify-between text-xs text-gray-400 font-bold mt-2">
                                            <span>0.5ct</span>
                                            <span className="text-gold">3.0ct</span>
                                            <span>10ct+</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Diamond Cut */}
                                <div>
                                    <h4 className="mb-6 flex items-center gap-3 font-serif text-xl font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">
                                        Diamond Cut
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {["Round", "Princess", "Cushion", "Emerald", "Oval", "Pear"].map((cut) => (
                                            <button key={cut} className="border border-gray-200 bg-white py-3 px-2 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-600 hover:border-gold hover:text-gold transition-all dark:bg-[#111] dark:border-white/10 dark:text-gray-300 dark:hover:border-gold">
                                                {cut}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-14 flex items-center justify-between border-t border-gray-100 pt-8 dark:border-white/10">
                            <button className="text-sm font-bold tracking-widest uppercase text-gray-400 hover:text-red-500 transition-colors">
                                Reset Filters
                            </button>
                            <button className="bg-gray-900 px-12 py-4 text-sm font-bold tracking-[0.2em] text-white uppercase transition-all duration-300 hover:bg-gold shadow-lg hover:shadow-gold/30 dark:bg-white dark:text-black dark:hover:bg-gold dark:hover:text-white">
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
