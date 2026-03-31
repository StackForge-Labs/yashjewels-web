import React from "react";
import { HomeViews } from "../components/HomeViews";
import ThemeToggle from "../components/ThemeToggle";
import SearchModal from "../components/SearchModal";
import ProductCard from "../components/ProductCard";
import { AOSInit } from "../components/AOSInit";
import {
    Search,
    ShoppingCart,
    User,
    Heart,
    ChevronRight,
    ChevronLeft,
    Phone,
    Truck,
    ShieldCheck,
    Award,
    RefreshCw,
    MapPin,
    Mail,
    Quote,
    ArrowRight,
    Star,
} from "lucide-react";

// The gold price widget data (usually fetched live)
const GOLD_PRICE = { "18K": "$55.70/g", "22K": "$69.23/g", "24K": "$75.10/g", PT950: "$42.30/g" };


const Facebook = ({ size = 24, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.81l.49-4H14V7a1 1 0 0 1 1-1h3z" />
    </svg>
);
const Instagram = ({ size = 24, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
);
const Youtube = ({ size = 24, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
);

export default function Home() {
    const diamonds = [
        {
            sku: "DDD2431907",
            name: "Natural Diamond 7.37 - 6.62 VS2-D",
            original: "$30,000",
            sale: "$26,700",
            discount: "11%",
        },
        {
            sku: "DDD2422675",
            name: "Natural Diamond 6.60 - 6.64 VVS2-D",
            original: "$11,600",
            sale: "$10,380",
            discount: "11%",
        },
        {
            sku: "DDD2412950",
            name: "Natural Diamond 6.86 - 6.90 VS1-D",
            original: "$11,100",
            sale: "$9,930",
            discount: "11%",
        },
        {
            sku: "DDD2335747",
            name: "Natural Diamond 6.51 - 6.54 VVS1-F",
            original: "$10,400",
            sale: "$9,270",
            discount: "11%",
        },
        {
            sku: "DDD2322500",
            name: "Natural Diamond 6.36 - 6.41 VVS1-F",
            original: "$10,000",
            sale: "$8,900",
            discount: "11%",
        },
        {
            sku: "DDD2420094",
            name: "Natural Diamond 6.22 - 6.24 VVS1-D",
            original: "$9,160",
            sale: "$8,150",
            discount: "11%",
        },
        {
            sku: "DDD2334760",
            name: "Natural Diamond 6.31 - 6.34 VVS2-E",
            original: "$9,160",
            sale: "$8,150",
            discount: "11%",
        },
        {
            sku: "DDD2406100",
            name: "Natural Diamond 6.50 - 6.53 VS1-E",
            original: "$7,900",
            sale: "$7,040",
            discount: "11%",
        },
    ];

    return (
        <div className="selection:bg-gold bg-white font-sans antialiased transition-colors duration-500 selection:text-black dark:bg-[#030303]">
            <AOSInit />
            {/* Top Notification Bar */}
            <div className="border-b border-gray-200 bg-gray-50 py-2 text-xs text-gray-500 transition-colors dark:border-white/5 dark:bg-[#080808] dark:text-gray-400">
                <div className="container mx-auto flex items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <span className="bg-gold rounded-sm px-2 py-0.5 text-[10px] font-medium tracking-widest text-black uppercase">
                            Global
                        </span>
                        <span className="hidden sm:inline">Official Yash Jewels Retail Network</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="hover:text-gold flex cursor-pointer items-center gap-2 transition-colors">
                            <Phone size={14} className="text-gold" />
                            Hotline: <strong className="text-gray-800 dark:text-gray-200">+1 (800) 123-4567</strong>
                        </span>
                        <div className="hidden items-center gap-3 border-l border-gray-300 pl-6 sm:flex dark:border-white/10">
                            <span className="hover:text-gold transform cursor-pointer transition-colors hover:-translate-y-0.5">
                                <Facebook size={14} />
                            </span>
                            <span className="hover:text-gold transform cursor-pointer transition-colors hover:-translate-y-0.5">
                                <Instagram size={14} />
                            </span>
                            <span className="hover:text-gold transform cursor-pointer transition-colors hover:-translate-y-0.5">
                                <Youtube size={14} />
                            </span>
                        </div>
                        <div className="flex items-center gap-2 border-l border-gray-300 pl-6 dark:border-white/10">
                            <span className="font-semibold text-gray-800 dark:text-gray-200">EN</span>
                            <span className="text-gray-400">/</span>
                            <span className="hover:text-gold cursor-pointer transition-colors">USD</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation Header */}
            <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 shadow-sm backdrop-blur-xl transition-all dark:border-white/5 dark:bg-[#050505]/90 dark:shadow-none">
                <div className="container mx-auto flex items-center justify-between px-4">
                    {/* Logo */}
                    <div className="group flex cursor-pointer flex-col items-center">
                        <div className="text-gold mb-1 transform transition-transform duration-500 group-hover:rotate-180">
                            <svg
                                width="34"
                                height="34"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 2L2 9L12 22L22 9L12 2Z"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinejoin="round"
                                />
                                <path d="M2 9H22" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                <path d="M12 22V9" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                <path
                                    d="M12 2L7 9L12 22"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M12 2L17 9L12 22"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <h1 className="font-serif text-xl leading-none tracking-[0.2em] text-gray-900 uppercase dark:text-white">
                            Yash Jewels
                        </h1>
                        <span className="text-gold mt-1.5 text-[8px] font-medium tracking-[0.3em] uppercase">
                            High Jewelry
                        </span>
                    </div>

                    {/* Centered Nav with Hover Dropdowns */}
                    <nav className="hidden h-full items-center gap-8 xl:flex">
                        {/* 1. Active Home Item */}
                        <div className="flex h-full items-center">
                            <a
                                href="#"
                                className="text-gold after:bg-gold relative py-8 text-xs font-bold tracking-[0.15em] uppercase transition-all after:absolute after:right-0 after:bottom-6 after:left-0 after:h-[2px] after:w-full after:content-['']"
                            >
                                Home
                            </a>
                        </div>

                        {/* 2. Mega Menu Item (Submenu To) */}
                        <div className="group flex h-full items-center">
                            <a
                                href="#"
                                className="hover:text-gold relative py-8 text-xs font-bold tracking-[0.15em] text-gray-700 uppercase transition-colors dark:text-gray-300"
                            >
                                Collections
                            </a>
                            {/* Enhanced Mega Menu Dropdown */}
                            <div className="invisible absolute top-full left-0 z-50 w-full border-t border-gray-100 bg-white/95 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-300 group-hover:visible group-hover:opacity-100 dark:border-white/5 dark:bg-[#050505]/95">
                                <div className="container mx-auto flex gap-10 px-4 py-16 text-left">
                                    <div className="w-1/5">
                                        <h4 className="mb-8 font-serif text-lg text-gray-900 dark:text-white">
                                            Shop By Category
                                        </h4>
                                        <ul className="space-y-5 text-sm font-medium text-gray-500 dark:text-gray-400">
                                            <li>
                                                <a
                                                    href="#"
                                                    className="group/link hover:text-gold flex items-center justify-between transition-colors"
                                                >
                                                    Engagement Rings{" "}
                                                    <ChevronRight
                                                        size={14}
                                                        className="-translate-x-2 opacity-0 transition-all group-hover/link:translate-x-0 group-hover/link:opacity-100"
                                                    />
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="group/link hover:text-gold flex items-center justify-between transition-colors"
                                                >
                                                    Fine Necklaces{" "}
                                                    <ChevronRight
                                                        size={14}
                                                        className="-translate-x-2 opacity-0 transition-all group-hover/link:translate-x-0 group-hover/link:opacity-100"
                                                    />
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="group/link hover:text-gold flex items-center justify-between transition-colors"
                                                >
                                                    Diamond Earrings{" "}
                                                    <ChevronRight
                                                        size={14}
                                                        className="-translate-x-2 opacity-0 transition-all group-hover/link:translate-x-0 group-hover/link:opacity-100"
                                                    />
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="group/link hover:text-gold flex items-center justify-between transition-colors"
                                                >
                                                    Luxury Bracelets{" "}
                                                    <ChevronRight
                                                        size={14}
                                                        className="-translate-x-2 opacity-0 transition-all group-hover/link:translate-x-0 group-hover/link:opacity-100"
                                                    />
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="group/link hover:text-gold flex items-center justify-between transition-colors"
                                                >
                                                    Men&apos;s Collection{" "}
                                                    <ChevronRight
                                                        size={14}
                                                        className="-translate-x-2 opacity-0 transition-all group-hover/link:translate-x-0 group-hover/link:opacity-100"
                                                    />
                                                </a>
                                            </li>
                                            <li className="pt-4">
                                                <a
                                                    href="#"
                                                    className="border-gold text-gold inline-block border-b pb-1 text-[11px] font-bold tracking-widest uppercase transition-colors hover:text-gray-900 dark:hover:text-white"
                                                >
                                                    View All Categories
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="w-1/5">
                                        <h4 className="mb-8 font-serif text-lg text-gray-900 dark:text-white">
                                            Shop By Material
                                        </h4>
                                        <ul className="space-y-5 text-sm font-medium text-gray-500 dark:text-gray-400">
                                            <li>
                                                <a
                                                    href="#"
                                                    className="hover:text-gold flex items-center gap-3 transition-colors"
                                                >
                                                    <span className="block h-4 w-4 rounded-full border border-white bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-sm"></span>{" "}
                                                    Yellow Gold 18K
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="hover:text-gold flex items-center gap-3 transition-colors"
                                                >
                                                    <span className="block h-4 w-4 rounded-full border border-white bg-gradient-to-br from-gray-200 to-gray-400 shadow-sm"></span>{" "}
                                                    White Gold 18K
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="hover:text-gold flex items-center gap-3 transition-colors"
                                                >
                                                    <span className="block h-4 w-4 rounded-full border border-white bg-gradient-to-br from-rose-300 to-rose-500 shadow-sm"></span>{" "}
                                                    Rose Gold 18K
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="hover:text-gold flex items-center gap-3 transition-colors"
                                                >
                                                    <span className="block h-4 w-4 rounded-full border border-white bg-gradient-to-br from-slate-300 to-slate-500 shadow-sm"></span>{" "}
                                                    Platinum 950
                                                </a>
                                            </li>
                                            <li className="pt-4">
                                                <a
                                                    href="#"
                                                    className="border-gold text-gold inline-block border-b pb-1 text-[11px] font-bold tracking-widest uppercase transition-colors hover:text-gray-900 dark:hover:text-white"
                                                >
                                                    Material Guide
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="w-1/5">
                                        <h4 className="mb-8 font-serif text-lg text-gray-900 dark:text-white">
                                            Featured Concepts
                                        </h4>
                                        <ul className="space-y-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                                            <li>
                                                <a href="#" className="hover:text-gold block transition-colors">
                                                    <span className="mb-1 block text-black dark:text-white">
                                                        The Imperial
                                                    </span>
                                                    <span className="text-xs font-light text-gray-400">
                                                        Timeless masterpieces
                                                    </span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="hover:text-gold block transition-colors">
                                                    <span className="mb-1 block text-black dark:text-white">
                                                        Eternity Bands
                                                    </span>
                                                    <span className="text-xs font-light text-gray-400">
                                                        Symbols of forever
                                                    </span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="hover:text-gold block transition-colors">
                                                    <span className="mb-1 block text-black dark:text-white">
                                                        Aura Solitaire
                                                    </span>
                                                    <span className="text-xs font-light text-gray-400">
                                                        Classic elegance
                                                    </span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="grid w-2/5 grid-cols-2 gap-6">
                                        <div className="group/img relative cursor-pointer overflow-hidden rounded-xl shadow-lg">
                                            <img
                                                src="https://images.pexels.com/photos/1733604/pexels-photo-1733604.jpeg?auto=compress&cs=tinysrgb&w=600"
                                                alt="Collection 1"
                                                className="h-72 w-full object-cover transition-transform duration-[1.5s] group-hover/img:scale-110"
                                            />
                                            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6">
                                                <p className="text-gold mb-2 text-[10px] font-bold tracking-widest uppercase">
                                                    New Arrivals
                                                </p>
                                                <p className="mb-2 font-serif text-2xl text-white">The Imperial</p>
                                                <p className="flex translate-y-4 transform items-center gap-2 text-[11px] font-bold tracking-widest text-gray-300 uppercase opacity-0 transition-all duration-500 group-hover/img:translate-y-0 group-hover/img:opacity-100">
                                                    Shop Now <ArrowRight size={14} />
                                                </p>
                                            </div>
                                        </div>
                                        <div className="group/img relative cursor-pointer overflow-hidden rounded-xl shadow-lg">
                                            <img
                                                src="https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=600"
                                                alt="Collection 2"
                                                className="h-72 w-full object-cover transition-transform duration-[1.5s] group-hover/img:scale-110"
                                            />
                                            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6">
                                                <p className="text-gold mb-2 text-[10px] font-bold tracking-widest uppercase">
                                                    Trending
                                                </p>
                                                <p className="mb-2 font-serif text-2xl text-white">Bridal Edit</p>
                                                <p className="flex translate-y-4 transform items-center gap-2 text-[11px] font-bold tracking-widest text-gray-300 uppercase opacity-0 transition-all duration-500 group-hover/img:translate-y-0 group-hover/img:opacity-100">
                                                    Shop Now <ArrowRight size={14} />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Small Dropdown Item (Submenu Nhỏ) */}
                        <div className="group relative flex h-full items-center">
                            <a
                                href="#"
                                className="hover:text-gold relative py-8 text-xs font-bold tracking-[0.15em] text-gray-700 uppercase transition-colors dark:text-gray-300"
                            >
                                Services
                            </a>
                            <div className="invisible absolute top-full left-1/2 z-50 w-56 -translate-x-1/2 overflow-hidden rounded-b-lg border border-gray-100 bg-white opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:opacity-100 dark:border-white/5 dark:bg-[#0a0a0a]">
                                <ul className="flex flex-col text-sm font-medium text-gray-600 dark:text-gray-400">
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-gold block border-b border-gray-50 px-6 py-4 transition-colors hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
                                        >
                                            Bespoke Design
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-gold block border-b border-gray-50 px-6 py-4 transition-colors hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
                                        >
                                            Diamond Upgrades
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-gold block border-b border-gray-50 px-6 py-4 transition-colors hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
                                        >
                                            Jewelry Repair
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-gold block px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                                        >
                                            Appraisals
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 4. Normal Item */}
                        <div className="flex h-full items-center">
                            <a
                                href="#"
                                className="hover:text-gold relative py-8 text-xs font-bold tracking-[0.15em] text-gray-700 uppercase transition-colors dark:text-gray-300"
                            >
                                Journal
                            </a>
                        </div>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-5 text-gray-700 dark:text-gray-300">
                        <ThemeToggle />
                        <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-800"></div>
                        <SearchModal />
                        <button className="hover:text-gold transform transition-colors duration-300 hover:scale-110">
                            <User size={22} strokeWidth={1.5} />
                        </button>
                        <button className="hover:text-gold relative transform transition-colors duration-300 hover:scale-110">
                            <Heart size={22} strokeWidth={1.5} />
                        </button>
                        <button className="hover:text-gold relative transform transition-colors duration-300 hover:scale-110">
                            <ShoppingCart size={22} strokeWidth={1.5} />
                            <span className="bg-gold absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white dark:text-black">
                                3
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            <HomeViews diamonds={diamonds} />

            {/* Main Footer (Fixed Logos) */}
            <footer className="border-t border-gray-200 bg-gray-100 pt-20 pb-10 transition-colors dark:border-white/5 dark:bg-[#050505]">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                        {/* Info */}
                        <div className="lg:pr-8">
                            <div className="mb-8 flex items-center gap-3">
                                <div className="text-gold">
                                    <svg
                                        width="28"
                                        height="28"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12 2L2 9L12 22L22 9L12 2Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <h2 className="font-serif text-2xl font-bold tracking-[0.2em] text-gray-900 uppercase dark:text-white">
                                    Yash
                                </h2>
                            </div>
                            <p className="mb-8 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                The ultimate destination for earth-mined diamonds, high jewelry, and bespoke engagement
                                rings. Handcrafted with passion, built for eternity.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="hover:bg-gold hover:border-gold flex h-10 w-10 transform cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:text-white dark:border-white/5 dark:bg-[#111] dark:text-gray-400">
                                    <Facebook size={18} />
                                </div>
                                <div className="hover:bg-gold hover:border-gold flex h-10 w-10 transform cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:text-white dark:border-white/5 dark:bg-[#111] dark:text-gray-400">
                                    <Instagram size={18} />
                                </div>
                                <div className="hover:bg-gold hover:border-gold flex h-10 w-10 transform cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:text-white dark:border-white/5 dark:bg-[#111] dark:text-gray-400">
                                    <Youtube size={18} />
                                </div>
                            </div>
                        </div>

                        {/* Links Group 1 */}
                        <div>
                            <h3 className="mb-8 text-sm font-bold tracking-widest text-gray-900 uppercase dark:text-white">
                                Customer Care
                            </h3>
                            <ul className="space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {["Contact Us", "Shipping & Returns", "Ring Size Guide", "Track Order", "FAQ"].map(
                                    (link, idx) => (
                                        <li key={idx}>
                                            <a
                                                href="#"
                                                className="hover:text-gold flex items-center gap-2 transition-all hover:translate-x-1"
                                            >
                                                <ChevronRight size={14} className="text-gray-300 dark:text-gray-600" />{" "}
                                                {link}
                                            </a>
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>

                        {/* Links Group 2 */}
                        <div>
                            <h3 className="mb-8 text-sm font-bold tracking-widest text-gray-900 uppercase dark:text-white">
                                Discover Yash
                            </h3>
                            <ul className="space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {["Our Story", "High Jewelry", "The Journal", "Boutique Locations", "Press"].map(
                                    (link, idx) => (
                                        <li key={idx}>
                                            <a
                                                href="#"
                                                className="hover:text-gold flex items-center gap-2 transition-all hover:translate-x-1"
                                            >
                                                <ChevronRight size={14} className="text-gray-300 dark:text-gray-600" />{" "}
                                                {link}
                                            </a>
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>

                        {/* Newsletter & Payment Methods */}
                        <div>
                            <h3 className="mb-8 text-sm font-bold tracking-widest text-gray-900 uppercase dark:text-white">
                                Newsletter
                            </h3>
                            <p className="mb-6 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                                Subscribe to receive updates, access to exclusive deals, and more.
                            </p>
                            <div className="group relative mb-8">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="focus:border-gold dark:focus:border-gold block w-full rounded-sm border border-gray-200 bg-white px-5 py-4 text-sm text-gray-900 shadow-sm transition-colors outline-none dark:border-white/10 dark:bg-[#111] dark:text-white"
                                />
                                <button className="hover:text-gold absolute top-0 right-0 bottom-0 flex items-center justify-center px-6 text-gray-900 transition-colors dark:text-white">
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                            <div className="mb-2 flex items-center gap-4 font-bold text-gray-400">
                                <span className="rounded border border-gray-300 bg-white px-2 py-1 text-xs tracking-widest opacity-70 dark:border-gray-700 dark:bg-[#111]">
                                    GIA CERTIFIED
                                </span>
                                <span className="font-serif text-xl italic">Visa</span>
                                <span className="font-sans text-xl italic">Pay</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 pb-4 md:flex-row dark:border-white/5">
                        <p className="text-xs font-medium tracking-wide text-gray-500">
                            &copy; {new Date().getFullYear()} Yash Jewels. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-[11px] font-medium tracking-wider text-gray-500 uppercase">
                            <a href="#" className="hover:text-gold transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="hover:text-gold transition-colors">
                                Terms of Service
                            </a>
                            <a href="#" className="hover:text-gold transition-colors">
                                Sitemap
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
