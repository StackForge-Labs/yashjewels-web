"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    ShoppingBag,
    ChevronRight,
    MessageSquare,
    Users,
    Gem,
    Receipt,
    ShieldCheck,
    TrendingUp
} from "lucide-react";

const navGroups = [
    {
        title: "Overview",
        items: [{ name: "Dashboard", href: "/vendor", icon: LayoutDashboard }],
    },
    {
        title: "Operations",
        items: [
            { name: "Orders", href: "/vendor/orders", icon: ShoppingBag },
            { name: "Invoices", href: "/vendor/invoices", icon: Receipt },
        ],
    },
    {
        title: "Customer Service",
        items: [
            { name: "Customers (CRM)", href: "/vendor/customers", icon: Users },
            { name: "CS Inquiries", href: "/vendor/inquiries", icon: MessageSquare },
            { name: "KYC Verifications", href: "/vendor/kyc", icon: ShieldCheck },
        ],
    },
    {
        title: "Information",
        items: [
            { name: "Gold Rate History", href: "/vendor/gold-rate", icon: TrendingUp },
        ],
    },
];

interface NavItem {
    name: string;
    href: string;
    icon: any;
}

// Helper Component for Sidebar Items
function SidebarItem({ item, pathname, isCollapsed }: { item: NavItem, pathname: string, isCollapsed: boolean }) {
    const isActive = pathname === item.href || (item.href !== "/vendor" && pathname.startsWith(`${item.href}/`));
    return (
        <li>
            <Link
                href={item.href}
                className={`group font-plus-jakarta flex items-center justify-between rounded-xl px-4 py-2.5 text-[11px] font-semibold transition-all duration-200 ${
                    isActive
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                        : "text-gray-500 hover:bg-amber-50/50 hover:text-amber-700 dark:text-gray-400 dark:hover:bg-amber-500/5 dark:hover:text-amber-400"
                }`}
            >
                <div className="flex items-center gap-3">
                    <item.icon
                        className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-amber-600 dark:text-amber-400" : "text-gray-400 group-hover:text-amber-600"}`}
                    />
                    {!isCollapsed && <span>{item.name}</span>}
                </div>
                {isActive && !isCollapsed && (
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.6)]" />
                )}
            </Link>
        </li>
    );
}

interface VendorSidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isCollapsed: boolean;
}

export default function VendorSidebar({ isOpen, setIsOpen, isCollapsed }: VendorSidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-amber-100/60 bg-white/95 backdrop-blur-xl transition-all duration-300 ease-in-out md:translate-x-0 dark:border-amber-900/20 dark:bg-[#0a0a0a]/95 ${
                isOpen ? "translate-x-0 shadow-[0_0_50px_rgba(0,0,0,0.1)]" : "-translate-x-full shadow-none"
            } ${isCollapsed ? "w-[80px]" : "w-[280px]"}`}
        >
            {/* Mobile Close */}
            <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-500 md:hidden"
            >
                <ChevronRight className="h-4 w-4 rotate-180" />
            </button>

            {/* Logo */}
            <div className={`flex h-20 shrink-0 items-center border-b border-amber-100/50 dark:border-amber-900/20 ${isCollapsed ? "justify-center" : "px-8"}`}>
                <Link href="/vendor" className={`group flex cursor-pointer flex-col items-center py-4 md:py-0 ${isCollapsed ? "" : "mx-auto"}`}>
                    <div className={`text-amber-600 transition-transform duration-500 group-hover:rotate-180 ${isCollapsed ? "scale-90" : "mb-1"}`}>
                        <Gem className={isCollapsed ? "h-6 w-6" : "h-7 w-7"} />
                    </div>
                    {!isCollapsed && (
                        <>
                            <h1 className="font-serif text-sm leading-none font-bold tracking-[0.2em] text-amber-700 uppercase dark:text-amber-500">
                                Yash Jewels
                            </h1>
                            <span className="mt-1 text-[8px] font-bold tracking-[0.3em] text-amber-500 uppercase">
                                Vendor Portal
                            </span>
                        </>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="scrollbar-hide flex-1 overflow-y-auto px-4 py-6">
                <div className="flex flex-col gap-6">
                    {navGroups.map((group) => (
                        <div key={group.title}>
                            {!isCollapsed && (
                                <div className="font-plus-jakarta mb-2.5 px-4 text-[10px] font-bold tracking-[0.2em] text-amber-600/60 uppercase dark:text-amber-500/50">
                                    {group.title}
                                </div>
                            )}
                            <ul className="space-y-1">
                                {group.items.map((item) => (
                                    <SidebarItem key={item.name} item={item} pathname={pathname} isCollapsed={isCollapsed} />
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </nav>

            {/* Footer Role Badge */}
            {!isCollapsed && (
                <div className="border-t border-amber-100/50 px-6 py-4 dark:border-amber-900/20">
                    <div className="flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-500/5">
                        <div className="h-8 w-8 rounded-full bg-amber-600 flex items-center justify-center">
                            <Gem className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <p className="font-plus-jakarta text-xs font-bold text-amber-800 dark:text-amber-400">Vendor</p>
                            <p className="font-plus-jakarta text-[10px] text-amber-600/70 dark:text-amber-500/60">Store Staff</p>
                        </div>
                    </div>
                </div>
            )}
            {isCollapsed && (
                <div className="border-t border-amber-100/50 p-4 flex justify-center dark:border-amber-900/20">
                    <div className="h-8 w-8 rounded-full bg-amber-600 flex items-center justify-center">
                        <Gem className="h-4 w-4 text-white" />
                    </div>
                </div>
            )}
        </aside>
    );
}
