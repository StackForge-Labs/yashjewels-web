"use client";

import { Bell, Menu, LogOut, ChevronLeft, ChevronRight, ShoppingBag, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import ThemeToggle from "@/app/_components/ThemeToggle";
import { useRouter } from "next/navigation";
import { clearTokens } from "@/lib/api-client";
import { useState, useRef, useEffect } from "react";

interface VendorHeaderProps {
    onToggleSidebar: () => void;
    onToggleCollapse: () => void;
    isCollapsed: boolean;
    storeName?: string;
}

export default function VendorHeader({ onToggleSidebar, onToggleCollapse, isCollapsed, storeName = "My Store" }: VendorHeaderProps) {
    const router = useRouter();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        clearTokens();
        router.replace("/auth/login");
    };

    // Close popover when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const mockNotifications = [
        { id: 1, type: 'order', title: 'New Order Received', desc: 'Order #ORD-7721 (24,500,000 USD) needs processing.', time: '5 mins ago', icon: <ShoppingBag className="h-4 w-4 text-amber-600" />, bg: 'bg-amber-50' },
        { id: 2, type: 'inquiry', title: 'New Customer Inquiry', desc: 'Customer asking about diamond ring sizing.', time: '30 mins ago', icon: <AlertTriangle className="h-4 w-4 text-blue-600" />, bg: 'bg-blue-50' },
        { id: 3, type: 'system', title: 'KYC Verified', desc: 'Your uploaded ID document was verified by Admin.', time: '2 hours ago', icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />, bg: 'bg-emerald-50' },
    ];

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

                {/* Desktop Collapse Toggle */}
                <button 
                    onClick={onToggleCollapse}
                    className="hidden md:flex h-9 w-9 items-center justify-center rounded-lg border border-amber-100 bg-amber-50 text-amber-600 transition-all hover:bg-amber-100 hover:text-amber-700 dark:border-amber-900/30 dark:bg-amber-500/5 dark:text-amber-400 dark:hover:bg-amber-500/10"
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>

                <div>
                    <p className="font-plus-jakarta text-xs font-semibold uppercase tracking-widest text-amber-600/70 dark:text-amber-500/60">Vendor Portal</p>
                    <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{storeName}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-6">
                <ThemeToggle />
                
                {/* Notifications Popover */}
                <div className="relative" ref={notifRef}>
                    <button 
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className={`relative flex h-11 w-11 items-center justify-center rounded-xl border border-amber-100/60 bg-white/50 shadow-sm transition-all hover:border-amber-300 dark:border-amber-900/30 dark:bg-[#111] dark:hover:border-amber-700 ${isNotifOpen ? 'border-amber-500 text-amber-600 bg-amber-50/50 ring-4 ring-amber-500/5 dark:bg-amber-500/10 dark:text-amber-400' : 'text-gray-500 hover:text-amber-700 dark:hover:text-amber-400'}`}
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute right-3 top-3 flex h-2.5 w-2.5 rounded-full bg-amber-600 ring-4 ring-white dark:ring-[#0a0a0a]"></span>
                    </button>

                    {isNotifOpen && (
                        <div className="absolute right-0 mt-3 w-80 lg:w-96 overflow-hidden rounded-2xl border border-amber-100/50 bg-white shadow-2xl animate-in fade-in zoom-in duration-200 dark:border-amber-900/30 dark:bg-[#111]">
                            <div className="flex items-center justify-between border-b border-amber-100/50 p-4 dark:border-amber-900/30">
                                <h3 className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
                                <button className="text-[10px] font-bold text-amber-600 hover:text-amber-700 uppercase tracking-wider dark:text-amber-500">Mark all read</button>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto">
                                {mockNotifications.map((notif) => (
                                    <div key={notif.id} className="group flex items-start gap-3 border-b border-amber-50/30 p-4 transition-colors hover:bg-amber-50/30 dark:border-amber-900/10 dark:hover:bg-white/5 cursor-pointer">
                                        <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${notif.bg} dark:bg-opacity-20`}>
                                            {notif.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-plus-jakarta text-xs font-bold text-gray-900 dark:text-white">{notif.title}</p>
                                            <p className="mt-0.5 font-plus-jakarta text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">{notif.desc}</p>
                                            <p className="mt-1 text-[10px] font-medium text-gray-400">{notif.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-amber-50/30 p-3 text-center dark:bg-black/20">
                                <button className="font-plus-jakarta text-[11px] font-bold text-gray-500 hover:text-amber-700 dark:hover:text-amber-400">View all activity</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-8 w-px bg-amber-100/50 dark:bg-amber-900/20 mx-1"></div>

                <button
                    onClick={handleLogout}
                    className="flex h-11 items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold tracking-wide text-red-600 transition-all hover:bg-red-100 dark:bg-red-500/10 dark:text-red-500 dark:hover:bg-red-500/20"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </header>
    );
}
