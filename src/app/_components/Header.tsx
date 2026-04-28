"use client";

import {
    ShoppingCart,
    Heart,
    ChevronRight,
    LogOut,
    Settings,
    UserCircle,
    ShoppingBag,
    ArrowUpRight,
} from "lucide-react";
import ThemeToggle from "../(home)/_components/ThemeToggle";
import { MegaMenu } from "./MegaMenu";
import SearchModal from "../(home)/_components/SearchModal";
import { GoldTicker } from "@/components/ui/GoldTicker";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useLogout } from "@/hooks/useAuth";
import { useState, useRef, useEffect } from "react";

export const Header = () => {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
    const cart = useSelector((state: RootState) => state.cart);
    const wishlistCount = useSelector((state: RootState) => state.wishlist.items.length);
    const logout = useLogout();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout.mutate();
    };

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
            {/* Live Gold Market Ticker */}
            <GoldTicker />

            {/* Main Navigation Header */}
            <header className="sticky top-0 z-[100] border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md transition-all dark:border-white/5 dark:bg-[#050505]/95">
                <div className="container mx-auto flex h-24 items-center justify-between px-4 lg:h-[100px]">

                    {/* ── LEFT: Logo ── */}
                    <Link href="/" className="group flex flex-shrink-0 items-center gap-3 transition-all hover:scale-[1.03]">
                        <div className="text-gold transition-transform duration-700 group-hover:rotate-[360deg]">
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
                        <div className="flex flex-col leading-none">
                            <span className="font-serif text-lg tracking-[0.22em] text-gray-900 uppercase lg:text-xl dark:text-white">
                                Yash Jewels
                            </span>
                            <span className="text-gold mt-1 text-[7px] font-bold tracking-[0.38em] uppercase lg:text-[8px]">
                                Maison de Haute Joaillerie
                            </span>
                        </div>
                    </Link>

                    {/* ── CENTER: MegaMenu + Search ── */}
                    <div className="hidden flex-1 items-center justify-center gap-4 lg:flex">
                        <MegaMenu />

                        {/* Divider */}
                        <div className="h-5 w-px bg-gray-200 dark:bg-white/10" />

                        {/* Search + Theme */}
                        <div className="flex items-center gap-2">
                            <SearchModal />
                            <ThemeToggle />
                        </div>
                    </div>


                    <div className="flex flex-shrink-0 items-center gap-2">
                        {isAuthenticated && user ? (
                            /* ─ Logged In ─ */
                            <>
                                {/* Wishlist */}
                                <Link
                                    href="/wishlist"
                                    className="hover:text-gold relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-gray-50 hover:scale-110 dark:hover:bg-white/5"
                                >
                                    <Heart size={20} strokeWidth={1.5} />
                                    {wishlistCount > 0 && (
                                        <span className="bg-gold absolute -top-0.5 -right-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white px-0.5 text-[8px] font-bold text-white dark:border-[#050505]">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </Link>

                                {/* Cart */}
                                <Link
                                    href="/cart"
                                    className="hover:text-gold relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-gray-50 hover:scale-110 dark:hover:bg-white/5"
                                >
                                    <ShoppingCart size={20} strokeWidth={1.5} />
                                    {cart?.items?.length > 0 && (
                                        <span className="bg-gold absolute -top-0.5 -right-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white px-0.5 text-[8px] font-bold text-white dark:border-[#050505]">
                                            {cart.items.length}
                                        </span>
                                    )}
                                </Link>

                                {/* Separator */}
                                <div className="mx-1 h-5 w-px bg-gray-200 dark:bg-white/10" />

                                {/* User Avatar + Dropdown */}
                                <div className="relative" ref={menuRef}>
                                    <button
                                        onMouseEnter={() => setIsUserMenuOpen(true)}
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="group flex items-center gap-2.5 rounded-full border border-gray-100 bg-white py-1 pl-1 pr-3.5 transition-all hover:border-gold hover:shadow-md dark:border-white/5 dark:bg-white/5 dark:hover:border-gold/50"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gold/10 text-gold shadow-inner">
                                            {user.avatarUrl ? (
                                                <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="font-serif text-xs font-bold tracking-tighter">
                                                    {getInitials(user.fullName)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="hidden flex-col items-start leading-tight xl:flex">
                                            <span className="max-w-[90px] truncate text-[11px] font-bold tracking-wider text-gray-900 uppercase dark:text-white">
                                                {user.fullName.split(" ")[0]}
                                            </span>
                                            <span className="text-gold text-[8px] font-medium tracking-[0.15em] uppercase">
                                                Private Salon
                                            </span>
                                        </div>
                                    </button>

                                    {/* Dropdown */}
                                    <div
                                        onMouseEnter={() => setIsUserMenuOpen(true)}
                                        onMouseLeave={() => setIsUserMenuOpen(false)}
                                        className={`absolute top-full right-0 z-[110] mt-4 w-72 origin-top-right overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] dark:border-white/10 dark:bg-[#0a0a0a] ${isUserMenuOpen
                                            ? "visible translate-y-0 opacity-100 scale-100"
                                            : "invisible translate-y-4 opacity-0 scale-95"
                                            }`}
                                    >
                                        {/* Header info */}
                                        <div className="mb-2 flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-white/5">
                                            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-gold/30 bg-white dark:bg-[#111]">
                                                {user.avatarUrl ? (
                                                    <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="font-serif text-base font-bold text-gold">
                                                        {getInitials(user.fullName)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <p className="truncate text-sm font-bold text-gray-900 dark:text-white">{user.fullName}</p>
                                                <p className="truncate text-[10px] tracking-wide text-gray-400 uppercase">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-0.5 p-1">
                                            <Link href="/profile" className="group/item flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold text-gray-600 transition-all hover:bg-gold/5 hover:text-gold dark:text-gray-400">
                                                <div className="flex items-center gap-3"><UserCircle size={15} strokeWidth={1.5} /> My Account</div>
                                                <ChevronRight size={13} className="opacity-0 -translate-x-2 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                                            </Link>
                                            <Link href="/profile?view=orders" className="group/item flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold text-gray-600 transition-all hover:bg-gold/5 hover:text-gold dark:text-gray-400">
                                                <div className="flex items-center gap-3"><ShoppingBag size={15} strokeWidth={1.5} /> My Orders</div>
                                                <ChevronRight size={13} className="opacity-0 -translate-x-2 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                                            </Link>
                                            <Link href="/settings" className="group/item flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold text-gray-600 transition-all hover:bg-gold/5 hover:text-gold dark:text-gray-400">
                                                <div className="flex items-center gap-3"><Settings size={15} strokeWidth={1.5} /> Settings</div>
                                                <ChevronRight size={13} className="opacity-0 -translate-x-2 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                                            </Link>
                                        </div>
                                        <div className="mx-4 my-2 border-t border-gray-100 dark:border-white/5" />
                                        <button
                                            onClick={handleLogout}
                                            className="mb-1 flex w-full items-center gap-3 rounded-xl px-5 py-3.5 text-xs font-bold text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-950/20"
                                        >
                                            <LogOut size={15} strokeWidth={1.5} /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* ─ Not Logged In ─ */
                            <div className="flex items-center gap-2.5">
                                <Link
                                    href="/auth/register"
                                    className="rounded-full border border-gray-200 px-5 py-2 text-[11px] font-bold tracking-[0.15em] text-gray-700 uppercase transition-all duration-300 hover:border-gray-900 hover:text-gray-900 dark:border-white/10 dark:text-gray-300 dark:hover:border-white/30 dark:hover:text-white"
                                >
                                    Sign Up
                                </Link>
                                <Link
                                    href="/auth/login"
                                    className="group flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2 text-[11px] font-bold tracking-[0.15em] text-white uppercase transition-all duration-300 hover:bg-gold hover:shadow-lg hover:shadow-gold/20 dark:bg-white dark:text-gray-900 dark:hover:bg-gold dark:hover:text-white"
                                >
                                    Sign In
                                    <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};
