"use client";

import { ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pages = [1, 2, 3, "...", totalPages];

    return (
        <div className="mt-20 flex flex-col items-center gap-10 border-t border-gray-50 pt-5 dark:border-white/5">
            <div className="flex items-center gap-2 sm:gap-6">
                <button
                    disabled={currentPage === 1}
                    className="group hover:border-gold hover:text-gold flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 transition-all disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-400 sm:h-14 sm:w-14 dark:border-white/5"
                >
                    <ChevronRight className="rotate-180 transition-transform group-hover:-translate-x-1" size={16} />
                </button>

                <div className="flex items-center gap-1.5 sm:gap-5">
                    {pages.map((num, i) => (
                        <button
                            key={i}
                            onClick={() => typeof num === "number" && onPageChange(num)}
                            className={`relative flex h-10 w-10 items-center justify-center rounded-full text-[11px] font-bold tracking-widest transition-all sm:h-14 sm:w-14 sm:text-[13px] ${
                                num === currentPage
                                    ? "bg-gold ring-gold/10 text-white shadow-[0_10px_20px_-5px_rgba(202,162,71,0.3)] ring-4"
                                    : "text-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white"
                            } ${typeof num !== "number" ? "pointer-events-none cursor-default" : ""}`}
                        >
                            {typeof num === "number" ? (num < 10 ? `0${num}` : num) : num}
                            {num === currentPage && (
                                <span className="bg-gold absolute -bottom-2 h-1 w-1 animate-pulse rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                <button
                    disabled={currentPage === totalPages}
                    className="group hover:border-gold hover:text-gold flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 transition-all disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-400 sm:h-14 sm:w-14 dark:border-white/5"
                >
                    <ChevronRight className="transition-transform group-hover:translate-x-1" size={16} />
                </button>
            </div>

            <div className="text-[10px] font-bold tracking-[0.4rem] text-gray-400/60 uppercase">
                Maison <span className="text-gray-900 dark:text-white">0{currentPage}</span> of{" "}
                <span className="text-gray-900 dark:text-white">{totalPages < 10 ? `0${totalPages}` : totalPages}</span>
            </div>
        </div>
    );
}
