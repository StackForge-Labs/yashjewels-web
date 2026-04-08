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

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-slate-200 bg-white dark:border-[#222] dark:bg-[#111] md:flex">
            {/* Logo area */}
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6 dark:border-[#222]">
                <Link href="/admin" className="flex items-center gap-2">
                    <Gem className="h-6 w-6 text-yellow-500" />
                    <span className="font-serif text-xl font-semibold tracking-wide text-slate-900 dark:text-white">Admin Panel</span>
                </Link>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 overflow-y-auto py-6">
                <ul className="space-y-1.5 px-3">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-stone-100 text-slate-900 dark:bg-stone-900/50 dark:text-white"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#222] dark:hover:text-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={`h-5 w-5 ${isActive ? "text-yellow-600 dark:text-yellow-500" : ""}`} />
                                        <span>{item.name}</span>
                                    </div>
                                    {isActive && <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom area (user snapshot or quick actions) */}
            <div className="border-t border-slate-200 p-4 dark:border-[#222]">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-[#1a1a1a]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        A
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">Admin User</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">admin@yash.com</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
