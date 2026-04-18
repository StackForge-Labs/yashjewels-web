"use client";

import { Bell, Search, Menu, UserCircle } from "lucide-react";
import ThemeToggle from "@/app/_components/ThemeToggle";

interface AdminHeaderProps {
    onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white/70 px-4 backdrop-blur-xl dark:border-gray-800/50 dark:bg-[#0a0a0a]/70 lg:h-20 lg:px-10">
            <div className="flex flex-1 items-center gap-3 lg:gap-6">
                {/* Mobile menu trigger */}
                <button 
                    onClick={onToggleSidebar}
                    className="flex items-center justify-center rounded-xl p-2 text-gray-500 transition-all hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
                >
                    <Menu className="h-6 w-6" />
                </button>

                {/* Search bar - hidden on small mobile, shown on tablet/desktop */}
                <div className="hidden max-w-lg flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 dark:border-gray-800 dark:bg-[#111] dark:focus-within:border-blue-500 sm:flex">
                    <Search className="h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search for anything..."
                        className="w-full bg-transparent font-plus-jakarta text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 lg:gap-6">
                <ThemeToggle />
                <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white/50 text-gray-500 shadow-sm transition-all hover:border-gray-300 hover:text-gray-900 dark:border-gray-800 dark:bg-[#111] dark:hover:border-gray-700 dark:hover:text-gray-100">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-3 top-3 flex h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-white dark:ring-[#0a0a0a]"></span>
                </button>
            </div>
        </header>
    );
}
