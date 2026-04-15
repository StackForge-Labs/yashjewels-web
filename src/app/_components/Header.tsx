"use client";

import {
    ShoppingCart,
    User,
    Heart,
    ChevronRight,
    Phone,
    ArrowRight,
    LogOut,
    Package,
    Settings,
    Loader2,
    ShieldCheck,
    Diamond,
    UserCircle,
    ShoppingBag,
    Bell,
    Search,
} from "lucide-react";
import ThemeToggle from "../(home)/_components/ThemeToggle";
import SearchModal from "../(home)/_components/SearchModal";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useLogout } from "@/hooks/useAuth";
import { useState, useRef, useEffect } from "react";

export const Header = () => {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
    const logout = useLogout();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout.mutate();
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getInitials = (name: string) => {
        if (!name) return "YJ";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            {/* Top Notification Bar */}
            <div className="border-b border-gray-200 bg-white py-2 text-[10px] text-gray-500 transition-colors md:text-[11px] dark:border-white/5 dark:bg-[#080808] dark:text-gray-400">
                <div className="container mx-auto flex items-center justify-between px-4">
                    <div className="flex shrink-0 items-center gap-4">
                        <span className="flex items-center gap-1 font-bold tracking-[0.1em] text-gray-900 uppercase dark:text-gray-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse"></span>
                            Free Global Delivery
                        </span>
                        <span className="hidden h-3 w-px bg-gray-200 lg:block dark:bg-white/10"></span>
                        <span className="hidden tracking-[0.05em] xl:inline">
                            Complementary Maison Packaging on all orders
                        </span>
                    </div>
                    <div className="flex items-center gap-5">
                        <a
                            href="tel:+18001234567"
                            className="hover:text-gold flex items-center gap-2 transition-colors font-medium"
                        >
                            <Phone size={12} className="text-gold" />
                            <span>Client Service</span>
                        </a>
                        <div className="flex items-center gap-2 border-l border-gray-200 pl-5 dark:border-white/10 uppercase tracking-widest font-bold">
                            <span className="text-gray-900 dark:text-white">EN</span>
                            <span className="text-gray-300">/</span>
                            <span className="hover:text-gold cursor-pointer transition-colors">USD</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation Header */}
            <header className="sticky top-0 z-[100] border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md transition-all dark:border-white/5 dark:bg-[#050505]/95">
                <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:h-24">
                    {/* Left Actions (Theme & Search) */}
                    <div className="hidden flex-1 items-center gap-6 lg:flex">
                        <SearchModal />
                        <ThemeToggle />
                    </div>

                    {/* Logo Section (Centered) */}
                    <Link href="/" className="group flex flex-col items-center transition-all hover:scale-105">
                        <div className="text-gold mb-1.5 transition-transform duration-700 group-hover:rotate-[360deg]">
                            <Diamond size={28} strokeWidth={1} />
                        </div>
                        <h1 className="font-serif text-lg leading-none tracking-[0.25em] text-gray-900 uppercase lg:text-2xl dark:text-white">
                            Yash Jewels
                        </h1>
                        <p className="text-gold mt-1.5 text-[7px] font-bold tracking-[0.4em] uppercase lg:text-[9px]">
                            Maison de Haute Joaillerie
                        </p>
                    </Link>

                    {/* Right Actions Panel */}
                    <div className="flex flex-1 items-center justify-end gap-2 md:gap-5">
                        {/* Profile Section */}
                        <div className="relative" ref={menuRef}>
                            {isAuthenticated && user ? (
                                <button
                                    onMouseEnter={() => setIsUserMenuOpen(true)}
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="group flex items-center gap-3 rounded-full border border-gray-100 bg-white p-1 pr-4 transition-all hover:border-gold hover:shadow-md dark:border-white/5 dark:bg-white/5 dark:hover:border-gold/50"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gold/10 text-gold shadow-inner">
                                        {user.avatarUrl ? (
                                            <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="font-serif text-sm font-bold tracking-tighter">
                                                {getInitials(user.fullName)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="hidden flex-col items-start leading-tight xl:flex">
                                        <span className="max-w-[100px] truncate text-[11px] font-bold tracking-wider text-gray-900 uppercase dark:text-white">
                                            {user.fullName.split(" ")[0]}
                                        </span>
                                        <span className="text-[9px] font-medium tracking-[0.15em] text-gold uppercase underline decoration-gold/30 underline-offset-2">
                                            Private Salon
                                        </span>
                                    </div>
                                </button>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className="hover:text-gold flex h-10 w-10 transform items-center justify-center rounded-full transition-all duration-300 hover:bg-gray-50 hover:scale-110 dark:hover:bg-white/5"
                                >
                                    <User size={22} strokeWidth={1.5} />
                                </Link>
                            )}

                            {/* User Dropdown Menu */}
                            {isAuthenticated && user && (
                                <div
                                    onMouseEnter={() => setIsUserMenuOpen(true)}
                                    onMouseLeave={() => setIsUserMenuOpen(false)}
                                    className={`absolute top-full right-0 z-[110] mt-4 w-72 origin-top-right overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] dark:border-white/10 dark:bg-[#0a0a0a] ${isUserMenuOpen
                                            ? "visible translate-y-0 opacity-100 scale-100"
                                            : "invisible translate-y-4 opacity-0 scale-95"
                                        }`}
                                >
                                    <div className="mb-2 flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-white/5">
                                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-gold/30 bg-white dark:bg-[#111]">
                                            {user.avatarUrl ? (
                                                <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="font-serif text-lg font-bold text-gold">
                                                    {getInitials(user.fullName)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <p className="truncate text-sm font-bold text-gray-900 dark:text-white">{user.fullName}</p>
                                            <p className="truncate text-[10px] tracking-wide text-gray-400 uppercase">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1 p-1">
                                        <Link href="/profile" className="group/item flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold text-gray-600 transition-all hover:bg-gold/5 hover:text-gold dark:text-gray-400">
                                            <div className="flex items-center gap-3"><UserCircle size={16} strokeWidth={1.5} /> My Account</div>
                                            <ChevronRight size={14} className="opacity-0 -translate-x-2 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                                        </Link>
                                        <Link href="/orders" className="group/item flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold text-gray-600 transition-all hover:bg-gold/5 hover:text-gold dark:text-gray-400">
                                            <div className="flex items-center gap-3"><ShoppingBag size={16} strokeWidth={1.5} /> My Orders</div>
                                            <ChevronRight size={14} className="opacity-0 -translate-x-2 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                                        </Link>
                                        <Link href="/settings" className="group/item flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold text-gray-600 transition-all hover:bg-gold/5 hover:text-gold dark:text-gray-400">
                                            <div className="flex items-center gap-3"><Settings size={16} strokeWidth={1.5} /> Settings</div>
                                            <ChevronRight size={14} className="opacity-0 -translate-x-2 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                                        </Link>
                                    </div>
                                    <div className="mx-4 my-2 border-t border-gray-100 dark:border-white/5"></div>
                                    <button onClick={handleLogout} className="mb-1 flex w-full items-center gap-3 rounded-xl px-5 py-4 text-xs font-bold text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-950/20">
                                        <LogOut size={18} strokeWidth={1.5} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>

                        <Link href="/wishlist" className="hover:text-gold relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-gray-50 hover:scale-110 dark:hover:bg-white/5">
                            <Heart size={22} strokeWidth={1.5} />
                        </Link>

                        <Link href="/cart" className="hover:text-gold relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-gray-50 hover:scale-110 dark:hover:bg-white/5">
                            <ShoppingCart size={22} strokeWidth={1.5} />
                            <span className="bg-gold absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white text-[8px] font-bold text-white dark:border-[#050505] dark:text-black">3</span>
                        </Link>
                    </div>
                </div>

                {/* RESTORED: Main Navigation Menu with Dropdowns */}
                <nav className="container mx-auto hidden h-14 items-center justify-center gap-12 lg:flex">
                    {/* 1. High Jewelry (Mega Menu) */}
                    <div className="group flex h-full items-center">
                        <Link href="/collections" className="hover:text-gold relative py-4 text-[11px] font-bold tracking-[0.2em] text-gray-800 uppercase transition-all dark:text-gray-200">
                            High Jewelry
                        </Link>
                        {/* THE MEGA MENU */}
                        <div className="invisible absolute top-full left-0 z-[60] w-full border-t border-gray-100 bg-white/95 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-500 group-hover:visible group-hover:opacity-100 dark:border-white/5 dark:bg-[#050505]/95">
                            <div className="mx-auto flex max-w-[1500px] gap-8 px-8 py-16 text-left">
                                <div className="w-[15%]">
                                    <h4 className="mb-8 border-b border-gray-100 pb-3 font-serif text-lg text-gray-900 dark:border-white/10 dark:text-white">Category</h4>
                                    <ul className="space-y-5 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {["Engagement Rings", "Fine Necklaces", "Diamond Earrings", "Luxury Bracelets", "Men's Collection"].map(item => (
                                            <li key={item}><a href="#" className="group/link hover:text-gold flex items-center justify-between transition-colors">{item}<ChevronRight size={14} className="-translate-x-2 opacity-0 transition-all group-hover/link:translate-x-0 group-hover/link:opacity-100" /></a></li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="w-[15%]">
                                    <h4 className="mb-8 border-b border-gray-100 pb-3 font-serif text-lg text-gray-900 dark:border-white/10 dark:text-white">Material</h4>
                                    <ul className="space-y-5 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {["Yellow Gold 18K", "White Gold 18K", "Rose Gold 18K", "Platinum 950"].map(m => (
                                            <li key={m}><a href="#" className="hover:text-gold flex items-center gap-3 transition-colors"><span className={`block h-4 w-4 rounded-full border border-white shadow-sm ${m.includes('Yellow') ? 'bg-yellow-500' : m.includes('White') ? 'bg-gray-200' : m.includes('Rose') ? 'bg-rose-300' : 'bg-slate-300'}`}></span>{m}</a></li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="w-[40%] grid grid-cols-2 gap-6 border-l border-gray-100 pl-8 dark:border-white/5">
                                    <div className="group/img relative cursor-pointer overflow-hidden rounded-xl shadow-lg">
                                        <img src="https://images.pexels.com/photos/1733604/pexels-photo-1733604.jpeg?auto=compress&cs=tinysrgb&w=600" alt="New" className="h-64 w-full object-cover transition-transform duration-[1.5s] group-hover/img:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                                            <span className="text-gold text-[10px] font-bold tracking-widest uppercase mb-1">New Arrivals</span>
                                            <p className="font-serif text-xl text-white">The Imperial</p>
                                        </div>
                                    </div>
                                    <div className="group/img relative cursor-pointer overflow-hidden rounded-xl shadow-lg">
                                        <img src="https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Bridal" className="h-64 w-full object-cover transition-transform duration-[1.5s] group-hover/img:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                                            <span className="text-gold text-[10px] font-bold tracking-widest uppercase mb-1">Bridal Edit</span>
                                            <p className="font-serif text-xl text-white">Classic Elegance</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Wedding (Standard Dropdown) */}
                    <div className="group relative flex h-full items-center">
                        <Link href="/collections" className="hover:text-gold relative py-4 text-[11px] font-bold tracking-[0.2em] text-gray-800 uppercase transition-all dark:text-gray-200">
                            Wedding
                        </Link>
                        <div className="invisible absolute top-full left-1/2 z-50 w-64 -translate-x-1/2 overflow-hidden rounded-b-xl border border-gray-100 bg-white opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:opacity-100 dark:border-white/5 dark:bg-[#0a0a0a]">
                            <ul className="flex flex-col text-xs font-bold tracking-widest text-gray-600 dark:text-gray-400">
                                {["Engagement Rings", "Wedding Bands Her", "Wedding Bands Him", "Bridal Sets"].map(item => (
                                    <li key={item}><Link href="#" className="hover:text-gold block px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 uppercase">{item}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* 3. Collections */}
                    <div className="group relative flex h-full items-center">
                        <Link href="/collections" className="hover:text-gold relative py-4 text-[11px] font-bold tracking-[0.2em] text-gray-800 uppercase transition-all dark:text-gray-200">
                            Collections
                        </Link>
                        <div className="invisible absolute top-full left-1/2 z-50 w-64 -translate-x-1/2 overflow-hidden rounded-b-xl border border-gray-100 bg-white opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:opacity-100 dark:border-white/5 dark:bg-[#0a0a0a]">
                            <ul className="flex flex-col text-xs font-bold tracking-widest text-gray-600 dark:text-gray-400">
                                {["The Imperial", "Aura Solitaire", "Modern Essentials", "Everyday Elegance"].map(item => (
                                    <li key={item}><Link href="#" className="hover:text-gold block px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 uppercase">{item}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* 4. Services */}
                    <div className="group relative flex h-full items-center">
                        <Link href="/contact" className="hover:text-gold relative py-4 text-[11px] font-bold tracking-[0.2em] text-gray-800 uppercase transition-all dark:text-gray-200">
                            Services
                        </Link>
                        <div className="invisible absolute top-full left-1/2 z-50 w-64 -translate-x-1/2 overflow-hidden rounded-b-xl border border-gray-100 bg-white opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:opacity-100 dark:border-white/5 dark:bg-[#0a0a0a]">
                            <ul className="flex flex-col text-xs font-bold tracking-widest text-gray-600 dark:text-gray-400">
                                {["Diamond Guide", "Gold Price", "Size Guide", "Bespoke Service"].map(item => (
                                    <li key={item}><Link href="#" className="hover:text-gold block px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 uppercase">{item}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* 5. About */}
                    <div className="group relative flex h-full items-center">
                        <Link href="/about" className="hover:text-gold relative py-4 text-[11px] font-bold tracking-[0.2em] text-gray-800 uppercase transition-all dark:text-gray-200">
                            About
                        </Link>
                        <div className="invisible absolute top-full left-1/2 z-50 w-64 -translate-x-1/2 overflow-hidden rounded-b-xl border border-gray-100 bg-white opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:opacity-100 dark:border-white/5 dark:bg-[#0a0a0a]">
                            <ul className="flex flex-col text-xs font-bold tracking-widest text-gray-600 dark:text-gray-400">
                                {["Our History", "Our Craft", "News", "Careers"].map(item => (
                                    <li key={item}><Link href="#" className="hover:text-gold block px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 uppercase">{item}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
};
