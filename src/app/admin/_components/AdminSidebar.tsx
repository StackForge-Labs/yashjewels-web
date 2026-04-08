"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Users, Settings, Package, ChevronRight, Gem } from "lucide-react";

const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-gray-100 bg-white/95 backdrop-blur-xl transition-all duration-300 ease-in-out md:translate-x-0 dark:border-gray-800/50 dark:bg-[#0a0a0a]/95 ${
                isOpen ? "translate-x-0 shadow-[0_0_50px_rgba(0,0,0,0.1)]" : "-translate-x-full shadow-none"
            }`}
        >
            {/* Mobile Close Button */}
            <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 md:hidden"
            >
                <ChevronRight className="h-4 w-4 rotate-180" />
            </button>
            {/* Logo area */}
            <div className="flex h-20 items-center px-8">
                <Link href="/admin" className="group mx-auto flex cursor-pointer flex-col items-center py-4 md:py-0">
                    <div className="text-gold mb-1 scale-75 transform transition-transform duration-500 group-hover:rotate-180 md:scale-100">
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 2L2 9L12 22L22 9L12 2Z"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinejoin="round"
                            />
                            <path d="M2 9H22" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                            <path d="M12 22V9" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                            <path d="M12 2L7 9L12 22" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                            <path d="M12 2L17 9L12 22" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="font-serif text-sm leading-none tracking-[0.2em] text-gray-900 uppercase md:text-xl dark:text-white">
                        Yash Jewels
                    </h1>
                    <span className="text-gold mt-1 text-[6px] font-bold tracking-[0.3em] uppercase md:text-[8px]">
                        High Jewelry
                    </span>
                </Link>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
                <div className="font-plus-jakarta mb-4 px-4 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase dark:text-gray-500">
                    Main Menu
                </div>
                <ul className="space-y-1.5">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`group font-plus-jakarta flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                                        isActive
                                            ? "bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <item.icon
                                            className={`h-5 w-5 transition-colors ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"}`}
                                        />
                                        <span>{item.name}</span>
                                    </div>
                                    {isActive && (
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom area (user snapshot) */}
            <div className="border-t border-gray-100 p-6 dark:border-gray-800/50">
                <div className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 px-3 py-3 transition-all hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800/30 dark:hover:bg-gray-800/50">
                    <div className="font-plus-jakarta flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        AS
                    </div>
                    <div className="flex flex-col truncate">
                        <span className="font-plus-jakarta truncate text-sm font-bold text-gray-900 dark:text-white">
                            Admin System
                        </span>
                        <span className="font-plus-jakarta truncate text-[10px] font-medium tracking-tight text-gray-400 uppercase dark:text-gray-500">
                            System Director
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
