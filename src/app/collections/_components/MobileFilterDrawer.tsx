"use client";

import { X, Search } from "lucide-react";

interface MobileFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    resultsCount: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export default function MobileFilterDrawer({ isOpen, onClose, children, resultsCount, searchQuery, onSearchChange }: MobileFilterDrawerProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 lg:hidden">
            <div
                className="animate-fade-in absolute inset-0 bg-black/70 backdrop-blur-[2px] transition-opacity"
                onClick={onClose}
            />
            <div className="animate-slide-in-right absolute top-0 right-0 h-full w-full bg-white overflow-hidden flex flex-col dark:bg-[#080808] z-101">
                {/* Header Sequence */}
                <div className="shrink-0 border-b border-gray-50 bg-white/95 backdrop-blur-md px-6 py-5 dark:border-white/5 dark:bg-[#080808]/95 sticky top-0 z-10">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-[12px] font-bold tracking-[0.3em] text-gray-900 uppercase dark:text-white pl-1">
                            Refine Selection
                        </h3>
                        <button
                            onClick={onClose}
                            className="bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 dark:text-gray-400 dark:hover:text-white p-2 transition-colors rounded-full"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Integrated Mobile Search */}
                    <div className="relative flex items-center bg-gray-50 dark:bg-white/5 rounded-full border border-transparent focus-within:border-gold/50 focus-within:bg-white dark:focus-within:bg-[#111] transition-all">
                        <Search className="ml-5 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search masterpiece..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full bg-transparent py-3.5 px-4 text-sm font-medium tracking-wide text-gray-900 outline-none dark:text-white placeholder:text-gray-400 placeholder:italic"
                        />
                        {searchQuery && (
                            <button onClick={() => onSearchChange("")} className="mr-4 text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="grow overflow-y-auto px-6 py-8 space-y-12">
                   {children}
                </div>

                <div className="p-6 border-t border-gray-50 dark:border-white/5 bg-white/80 backdrop-blur-md dark:bg-[#080808]/80">
                    <button
                        onClick={onClose}
                        className="bg-gold w-full py-4 text-[10px] font-bold tracking-[0.3em] text-white uppercase shadow-[0_10px_20px_-5px_rgba(202,162,71,0.3)] active:scale-[0.98] transition-all rounded-sm"
                    >
                        Apply {resultsCount} Results
                    </button>
                </div>
            </div>
        </div>
    );
}
