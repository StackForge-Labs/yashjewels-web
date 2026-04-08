"use client";

import { Search as SearchIcon, Filter as FilterIcon } from "lucide-react";
import { ReactNode } from "react";

interface SearchFilterBarProps {
    placeholder?: string;
    value: string;
    onChange: (val: string) => void;
    onFilter?: () => void;
    extra?: ReactNode;
}

export function SearchFilterBar({ placeholder = "Search...", value, onChange, onFilter, extra }: SearchFilterBarProps) {
    return (
        <div className="flex flex-col gap-4 border-b border-gray-100 p-6 md:flex-row md:items-center md:justify-between dark:border-gray-800/50">
            <div className="flex max-w-md flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 dark:border-gray-800 dark:bg-[#1a1a1a]/50 dark:focus-within:border-blue-500">
                <SearchIcon className="h-4 w-4 shrink-0 text-gray-400" />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-transparent font-plus-jakarta text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
                />
            </div>
            <div className="flex items-center gap-3">
                {extra}
                {onFilter && (
                    <button
                        onClick={onFilter}
                        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-plus-jakarta text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300 dark:hover:bg-gray-800/50"
                    >
                        <FilterIcon className="h-4 w-4" />
                        Filters
                    </button>
                )}
            </div>
        </div>
    );
}
