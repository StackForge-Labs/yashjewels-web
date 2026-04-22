import { Bell, Search, Menu, UserCircle, LogOut, Loader2, ChevronLeft, ChevronRight, MessageSquare, Info, AlertTriangle, CheckCircle2, ShoppingBag, ShieldCheck } from "lucide-react";
import ThemeToggle from "@/app/_components/ThemeToggle";
import { useLogout } from "@/hooks/useAuth";
import { useState, useRef, useEffect } from "react";

interface AdminHeaderProps {
    onToggleSidebar: () => void;
    onToggleCollapse: () => void;
    isCollapsed: boolean;
}

export default function AdminHeader({ onToggleSidebar, onToggleCollapse, isCollapsed }: AdminHeaderProps) {
    const logout = useLogout();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout.mutate();
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
        { id: 1, type: 'order', title: 'New High-Value Order', desc: 'Order #ORD-8829 (52,000,000 VND) requires review.', time: '2 mins ago', icon: <ShoppingBag className="h-4 w-4 text-blue-600" />, bg: 'bg-blue-50' },
        { id: 2, type: 'kyc', title: 'KYC Document Uploaded', desc: 'Customer "James Sterling" uploaded ID for verification.', time: '15 mins ago', icon: <ShieldCheck className="h-4 w-4 text-emerald-600" />, bg: 'bg-emerald-50' },
        { id: 3, type: 'inventory', title: 'Stock Alert', desc: 'Classic Solitaire Diamond Ring is running low (2 left).', time: '1 hour ago', icon: <AlertTriangle className="h-4 w-4 text-amber-600" />, bg: 'bg-amber-50' },
        { id: 4, type: 'system', title: 'System Update', desc: 'Maison de Yash v2.4 successfully deployed.', time: '5 hours ago', icon: <CheckCircle2 className="h-4 w-4 text-purple-600" />, bg: 'bg-purple-50' },
    ];

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

                {/* Desktop Collapse Toggle */}
                <button 
                    onClick={onToggleCollapse}
                    className="hidden md:flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 dark:border-gray-800 dark:bg-[#111] dark:hover:bg-gray-800"
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
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
                
                {/* Notifications Popover */}
                <div className="relative" ref={notifRef}>
                    <button 
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className={`relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white/50 shadow-sm transition-all hover:border-gray-300 dark:border-gray-800 dark:bg-[#111] dark:hover:border-gray-700 ${isNotifOpen ? 'border-blue-500 text-blue-600 bg-blue-50/50 ring-4 ring-blue-500/5' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'}`}
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute right-3 top-3 flex h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-white dark:ring-[#0a0a0a]"></span>
                    </button>

                    {isNotifOpen && (
                        <div className="absolute right-0 mt-3 w-80 lg:w-96 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl animate-in fade-in zoom-in duration-200 dark:border-gray-800 dark:bg-[#111]">
                            <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800/50">
                                <h3 className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
                                <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider">Mark all read</button>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto">
                                {mockNotifications.map((notif) => (
                                    <div key={notif.id} className="group flex items-start gap-3 border-b border-gray-50 p-4 transition-colors hover:bg-gray-50 dark:border-gray-800/30 dark:hover:bg-white/5 cursor-pointer">
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
                            <div className="bg-gray-50/50 p-3 text-center dark:bg-black/20">
                                <button className="font-plus-jakarta text-[11px] font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white">View all activity history</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>

                <button 
                    onClick={handleLogout}
                    disabled={logout.isPending}
                    className="flex h-11 items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold tracking-wide text-red-600 transition-all hover:bg-red-100 dark:bg-red-500/10 dark:text-red-500 dark:hover:bg-red-500/20 disabled:opacity-50"
                >
                    {logout.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </>
                    )}
                </button>
            </div>
        </header>
    );
}
