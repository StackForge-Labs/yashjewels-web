"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Settings,
    Package,
    ChevronRight,
    Gem,
    Layers,
    Receipt,
    ArrowLeftRight,
    ShieldCheck,
    CreditCard,
    Ticket,
    Store,
    ShieldAlert,
    Wallet,
    TrendingUp,
    HandHeart,
    Truck,
} from "lucide-react";

const navGroups = [
    {
        title: "Overview",
        items: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }],
    },
    {
        title: "Operations (God Mode)",
        items: [
            { name: "Orders Master", href: "/admin/orders", icon: ShoppingBag },
            { name: "Products Master", href: "/admin/products", icon: Package },
            { name: "Returns Manager", href: "/admin/returns", icon: ArrowLeftRight },
            { name: "System Invoices", href: "/admin/invoices", icon: Receipt },
        ],
    },
    {
        title: "Catalog Master",
        items: [
            {
                name: "Categories & Brands", icon: Layers, subItems: [
                    { name: "Categories", href: "/admin/categories" },
                    { name: "Brands", href: "/admin/brands" },
                    { name: "Product Types", href: "/admin/product-types" },
                    { name: "Jewel Types", href: "/admin/jewel-types" },
                ]
            },
            {
                name: "Jewelry Attributes", icon: Gem, subItems: [
                    { name: "Gold Karats", href: "/admin/gold-karats" },
                    { name: "Diamond Qualities", href: "/admin/diamond-qualities" },
                    { name: "Diamond Cuts", href: "/admin/diamond-cuts" },
                    { name: "Stone Types", href: "/admin/stone-types" },
                    { name: "Stone Qualities", href: "/admin/gemstones" },
                    { name: "Certifications", href: "/admin/certifications" },
                ]
            },
        ],
    },
    {
        title: "CRM & Services",
        items: [
            { name: "Customers", href: "/admin/customers", icon: Users },
            { name: "KYC Verifications", href: "/admin/kyc", icon: ShieldCheck },
        ],
    },
    {
        title: "Finance & Analytics",
        items: [
            { name: "Financial Ledger", href: "/admin/finance", icon: Wallet },
            { name: "Returns & Claims", href: "/admin/returns", icon: ArrowLeftRight },
            { name: "Gold Rate History", href: "/admin/gold-rates", icon: TrendingUp },
            { name: "Coupons & Promos", href: "/admin/marketing", icon: Ticket },
        ],
    },
    {
        title: "System & B2B",
        items: [
            { name: "Vendors Master", href: "/admin/vendors", icon: Store },
            { name: "Shipper Leads", href: "/admin/shippers", icon: Truck },
            { name: "Settings", href: "/admin/settings", icon: Settings },
        ],
    },
];

interface NavSubItem {
    name: string;
    href: string;
}

interface NavItem {
    name: string;
    href?: string;
    icon: any; // Lucide icon components are complex types, any is often used here but we can be more specific if needed
    subItems?: NavSubItem[];
}

// Helper Component for Sidebar Items (Handles Expansion)
function SidebarItem({ item, pathname, isCollapsed }: { item: NavItem, pathname: string, isCollapsed: boolean }) {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isSubActive = hasSubItems && item.subItems?.some((s: NavSubItem) => pathname === s.href || pathname.startsWith(`${s.href}/`));
    const [isOpen, setIsOpen] = useState(isSubActive || false);

    if (hasSubItems) {
        return (
            <li className="flex flex-col">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`group font-plus-jakarta flex items-center justify-between rounded-xl px-4 py-2.5 text-[11px] font-medium transition-all duration-200 ${
                        isSubActive ? "text-gray-900 dark:text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0 transition-colors text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                        {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed && <ChevronRight className={`h-3.5 w-3.5 text-gray-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />}
                </button>
                {isOpen && !isCollapsed && (
                    <ul className="mt-1 flex flex-col gap-1 pl-11 pr-2">
                        {item.subItems?.map((sub: NavSubItem) => {
                            const isChildActive = pathname === sub.href || pathname.startsWith(`${sub.href}/`);
                            return (
                                <li key={sub.name}>
                                    <Link
                                        href={sub.href}
                                        className={`block rounded-lg px-3 py-2 text-[11px] font-semibold transition-all ${
                                            isChildActive 
                                            ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" 
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/30 dark:hover:text-white"
                                        }`}
                                    >
                                        {sub.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </li>
        );
    }

    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
    return (
        <li>
            <Link
                href={item.href}
                className={`group font-plus-jakarta flex items-center justify-between rounded-xl px-4 py-2.5 text-[11px] font-medium transition-all duration-200 ${
                    isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white"
                }`}
            >
                <div className="flex items-center gap-3">
                    <item.icon
                        className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"}`}
                    />
                    {!isCollapsed && <span>{item.name}</span>}
                </div>
                {isActive && !isCollapsed && (
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                )}
            </Link>
        </li>
    );
}

interface AdminSidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isCollapsed: boolean;
}

export default function AdminSidebar({ isOpen, setIsOpen, isCollapsed }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-100 bg-white/95 backdrop-blur-xl transition-all duration-300 ease-in-out md:translate-x-0 dark:border-gray-800/50 dark:bg-[#0a0a0a]/95 ${
                isOpen ? "translate-x-0 shadow-[0_0_50px_rgba(0,0,0,0.1)]" : "-translate-x-full shadow-none"
            } ${isCollapsed ? "w-[80px]" : "w-[280px]"}`}
        >
            {/* Mobile Close Button */}
            <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 md:hidden"
            >
                <ChevronRight className="h-4 w-4 rotate-180" />
            </button>
            {/* Logo area */}
            <div className={`flex h-20 shrink-0 items-center border-b border-gray-100/50 dark:border-gray-800/30 ${isCollapsed ? "justify-center" : "px-8"}`}>
                <Link href="/admin" className={`group flex cursor-pointer flex-col items-center py-4 md:py-0 ${isCollapsed ? "" : ""}`}>
                    <div className={`text-blue-600 transition-transform duration-500 group-hover:rotate-180 ${isCollapsed ? "scale-90" : "mb-1"}`}>
                        <svg width={isCollapsed ? "28" : "34"} height={isCollapsed ? "28" : "34"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    {!isCollapsed && (
                        <>
                            <h1 className="font-serif text-sm leading-none font-bold tracking-[0.2em] text-blue-600 uppercase md:text-xl dark:text-white">
                                Yash Jewels
                            </h1>
                            <span className="mt-1 text-[6px] font-bold tracking-[0.3em] text-blue-600 uppercase md:text-[8px]">
                                High Jewelry
                            </span>
                        </>
                    )}
                </Link>
            </div>

            {/* Navigation links */}
            <nav className="scrollbar-hide flex-1 overflow-y-auto px-4 py-6">
                <div className="flex flex-col gap-6">
                    {navGroups.map((group) => (
                        <div key={group.title}>
                            {!isCollapsed && (
                                <div className="font-plus-jakarta mb-2.5 px-4 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase dark:text-gray-500">
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
        </aside>
    );
}
