"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    ChevronRight,
    ArrowLeftRight,
    MessageSquare,
    Gem,
} from "lucide-react";

const navGroups = [
    {
        title: "Tổng Quan",
        items: [{ name: "Dashboard", href: "/vendor", icon: LayoutDashboard }],
    },
    {
        title: "Vận Hành",
        items: [
            { name: "Đơn Hàng", href: "/vendor/orders", icon: ShoppingBag },
            { name: "Sản Phẩm", href: "/vendor/products", icon: Package },
            { name: "Hoàn Trả", href: "/vendor/returns", icon: ArrowLeftRight },
        ],
    },
    {
        title: "Chăm Sóc Khách Hàng",
        items: [
            { name: "Hòm Thư CSKH", href: "/vendor/inquiries", icon: MessageSquare },
        ],
    },
];

interface VendorSidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function VendorSidebar({ isOpen, setIsOpen }: VendorSidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-amber-100/60 bg-white/95 backdrop-blur-xl transition-all duration-300 ease-in-out md:translate-x-0 dark:border-amber-900/20 dark:bg-[#0a0a0a]/95 ${
                isOpen ? "translate-x-0 shadow-[0_0_50px_rgba(0,0,0,0.1)]" : "-translate-x-full shadow-none"
            }`}
        >
            {/* Mobile Close */}
            <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-500 md:hidden"
            >
                <ChevronRight className="h-4 w-4 rotate-180" />
            </button>

            {/* Logo */}
            <div className="flex h-20 shrink-0 items-center border-b border-amber-100/50 px-8 dark:border-amber-900/20">
                <Link href="/vendor" className="group mx-auto flex cursor-pointer flex-col items-center">
                    <div className="mb-1 transform text-amber-600 transition-transform duration-500 group-hover:rotate-180">
                        <Gem className="h-7 w-7" />
                    </div>
                    <h1 className="font-serif text-sm leading-none font-bold tracking-[0.2em] text-amber-700 uppercase dark:text-amber-500">
                        Yash Jewels
                    </h1>
                    <span className="mt-1 text-[8px] font-bold tracking-[0.3em] text-amber-500 uppercase">
                        Vendor Portal
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="scrollbar-hide flex-1 overflow-y-auto px-4 py-6">
                <div className="flex flex-col gap-6">
                    {navGroups.map((group) => (
                        <div key={group.title}>
                            <div className="font-plus-jakarta mb-2.5 px-4 text-[10px] font-bold tracking-[0.2em] text-amber-600/60 uppercase dark:text-amber-500/50">
                                {group.title}
                            </div>
                            <ul className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive =
                                        pathname === item.href ||
                                        (item.href !== "/vendor" && pathname.startsWith(`${item.href}/`));
                                    return (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className={`group font-plus-jakarta flex items-center justify-between rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                                                    isActive
                                                        ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                                                        : "text-gray-500 hover:bg-amber-50/50 hover:text-amber-700 dark:text-gray-400 dark:hover:bg-amber-500/5 dark:hover:text-amber-400"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon
                                                        className={`h-4 w-4 transition-colors ${isActive ? "text-amber-600 dark:text-amber-400" : "text-gray-400 group-hover:text-amber-600"}`}
                                                    />
                                                    <span>{item.name}</span>
                                                </div>
                                                {isActive && (
                                                    <div className="h-1.5 w-1.5 rounded-full bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.6)]" />
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </nav>

            {/* Footer Role Badge */}
            <div className="border-t border-amber-100/50 px-6 py-4 dark:border-amber-900/20">
                <div className="flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-500/5">
                    <div className="h-8 w-8 rounded-full bg-amber-600 flex items-center justify-center">
                        <Gem className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <p className="font-plus-jakarta text-xs font-bold text-amber-800 dark:text-amber-400">Vendor</p>
                        <p className="font-plus-jakarta text-[10px] text-amber-600/70 dark:text-amber-500/60">Quản lý gian hàng</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
