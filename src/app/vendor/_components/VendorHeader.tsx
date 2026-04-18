"use client";

import { Bell, Menu, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearTokens } from "@/lib/api-client";

interface VendorHeaderProps {
    onToggleSidebar: () => void;
    storeName?: string;
}

export default function VendorHeader({ onToggleSidebar, storeName = "My Store" }: VendorHeaderProps) {
    const router = useRouter();

    const handleLogout = () => {
        clearTokens();
        router.replace("/auth/login");
    };

    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-amber-100/60 bg-white/70 px-4 backdrop-blur-xl dark:border-amber-900/20 dark:bg-[#0a0a0a]/70 lg:h-20 lg:px-8">
            <div className="flex flex-1 items-center gap-3 lg:gap-6">
                {/* Mobile menu trigger */}
                <button
                    onClick={onToggleSidebar}
                    className="flex items-center justify-center rounded-xl p-2 text-amber-600 transition-all hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10 md:hidden"
                >
                    <Menu className="h-6 w-6" />
                </button>

                <div>
                    <p className="font-plus-jakarta text-xs font-semibold uppercase tracking-widest text-amber-600/70 dark:text-amber-500/60">Vendor Portal</p>
                    <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{storeName}</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-amber-100 bg-white/50 text-gray-500 shadow-sm transition-all hover:border-amber-300 hover:text-amber-700 dark:border-amber-900/30 dark:bg-[#111] dark:hover:text-amber-400">
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-2.5 top-2.5 flex h-2 w-2 rounded-full bg-amber-600 ring-2 ring-white dark:ring-[#0a0a0a]" />
                </button>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white/50 px-3 py-2 font-plus-jakarta text-xs font-bold text-gray-500 shadow-sm transition-all hover:border-rose-200 hover:text-rose-600 dark:border-gray-800 dark:bg-[#111]"
                >
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Đăng Xuất</span>
                </button>
            </div>
        </header>
    );
}
