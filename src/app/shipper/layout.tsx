"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShipperGuard } from "@/hooks/useAuthGuard";
import { Package, QrCode, User, Bell, LogOut } from "lucide-react";
import ThemeToggle from "@/app/_components/ThemeToggle";
import { clearTokens } from "@/lib/api-client";
import { useRouter } from "next/navigation";

// ─── Bottom Navigation ───────────────────────────────────────
const navItems = [
    { href: "/shipper", label: "Đơn Hàng", icon: Package },
    { href: "/shipper/scanner", label: "Quét Mã", icon: QrCode },
    { href: "/shipper/profile", label: "Cá Nhân", icon: User },
];

function ShipperBottomNav() {
    const pathname = usePathname();
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200/80 bg-white/95 backdrop-blur-xl dark:border-gray-800/50 dark:bg-[#0a0a0a]/95">
            <div className="flex items-center justify-around py-2 pb-safe">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/shipper" && pathname.startsWith(item.href));
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 px-6 py-2 transition-all ${isActive ? "text-teal-600 dark:text-teal-400" : "text-gray-400 dark:text-gray-500"}`}
                        >
                            <Icon className={`h-6 w-6 transition-transform ${isActive ? "scale-110" : ""}`} />
                            <span className={`text-[10px] font-bold tracking-wider ${isActive ? "text-teal-600 dark:text-teal-400" : "text-gray-400"}`}>
                                {item.label}
                            </span>
                            {isActive && <div className="h-1 w-1 rounded-full bg-teal-600 dark:bg-teal-400" />}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

function ShipperHeader() {
    const router = useRouter();
    const handleLogout = () => {
        clearTokens();
        router.replace("/auth/login");
    };

    return (
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-gray-100/80 bg-white/90 px-4 backdrop-blur-xl dark:border-gray-800/50 dark:bg-[#0a0a0a]/90">
            <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600">
                    <Package className="h-4 w-4 text-white" />
                </div>
                <div>
                    <p className="font-plus-jakarta text-xs font-black tracking-widest text-teal-700 uppercase dark:text-teal-400">Shipper</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="scale-90">
                    <ThemeToggle />
                </div>
                <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-white/50 text-gray-500 dark:border-gray-800 dark:bg-[#111]">
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
                </button>
                <button onClick={handleLogout} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-white/50 text-gray-500 hover:text-rose-500 dark:border-gray-800 dark:bg-[#111]">
                    <LogOut className="h-4 w-4" />
                </button>
            </div>
        </header>
    );
}

// ─── Layout ──────────────────────────────────────────────────
export default function ShipperLayout({ children }: { children: ReactNode }) {
    const { isLoading, profile, isError } = useShipperGuard();

    if (isLoading || !profile || isError) return null;

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-[#0a0a0a]">
            <ShipperHeader />
            <main className="flex-1 pb-24">
                {children}
            </main>
            <ShipperBottomNav />
        </div>
    );
}
