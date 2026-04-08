"use client";

import { Bell, Search, Menu, UserCircle } from "lucide-react";

export default function AdminHeader() {
    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-[#222] dark:bg-[#111]/80 md:px-6 lg:px-8">
            <div className="flex items-center gap-4">
                {/* Mobile menu trigger */}
                <button className="flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-[#222] md:hidden">
                    <Menu className="h-5 w-5" />
                </button>

                {/* Search bar */}
                <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-100 dark:border-[#333] dark:bg-[#1a1a1a] dark:focus-within:border-[#444] dark:focus-within:ring-[#333] md:flex lg:w-80">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search across admin..."
                        className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none dark:text-white"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-5">
                <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-[#222]">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#111]"></span>
                </button>
                <div className="h-6 w-px bg-slate-200 dark:bg-[#333]"></div>
                <button className="flex items-center gap-2">
                    <UserCircle className="h-8 w-8 text-slate-400" />
                </button>
            </div>
        </header>
    );
}
