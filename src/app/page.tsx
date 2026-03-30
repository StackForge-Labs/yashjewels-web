import React from "react";
import ThemeToggle from "../components/ThemeToggle";
import SearchModal from "../components/SearchModal";
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

            {/* Hero Banner with Cinematic Fade */}
            <section className="relative h-[75vh] min-h-[600px] w-full overflow-hidden bg-gray-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-white via-white/80 to-transparent transition-colors duration-700 dark:from-black dark:via-black/70" />
                    <img
                        src="https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg?auto=compress&cs=tinysrgb&w=1600"
                        alt="Hero Jewelry"
                        className="h-full w-full scale-105 animate-[pulse_20s_ease-in-out_infinite] object-cover object-center opacity-100 mix-blend-multiply dark:mix-blend-normal"
                    />
                </div>
                <div className="relative z-20 container mx-auto flex h-full items-center px-4">
                    <div className="max-w-2xl translate-y-8 transform animate-[fade-in-up_1s_ease-out_forwards]">
                        <div className="text-gold mb-6 flex items-center gap-4">
                            <span className="bg-gold h-[2px] w-16"></span>
                            <span className="dark:text-gold text-xs font-bold tracking-[0.4em] text-gray-800 uppercase">
                                The New Era
                            </span>
                        </div>
                        <h2 className="mb-6 font-serif text-6xl leading-[1.1] text-gray-900 drop-shadow-sm md:text-7xl dark:text-white">
                            Elegance in
                            <br />
                            <span className="text-gold font-serif italic">Every Facet</span>
                        </h2>
                        <p className="mb-10 max-w-md text-lg leading-relaxed font-light text-gray-600 dark:text-gray-300">
                            Discover unparalleled craftsmanship and breathtaking designs. Your journey to extraordinary
                            brilliance begins here.
                        </p>
                        <button className="group border-gold dark:text-gold hover:bg-gold flex items-center gap-4 border-2 bg-white/10 px-10 py-4 text-sm font-bold tracking-widest text-gray-900 uppercase backdrop-blur-md transition-all duration-500 hover:text-white hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] dark:bg-black/20 dark:hover:text-black">
                            Explore Collection
                            <ArrowRight
                                size={18}
                                className="transition-transform duration-500 group-hover:translate-x-2"
                            />
                        </button>
                    </div>
                </div>
            </section>

            {/* Categories Scroller - Replaced Images with reliable Pexels sources */}
            <section className="relative z-10 mx-4 -mt-8 rounded-t-3xl border-b border-gray-100 bg-white py-14 shadow-xl transition-colors duration-500 lg:mx-12 dark:border-white/5 dark:bg-[#0a0a0a] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <div className="relative container mx-auto px-4">
                    <div className="custom-scrollbar flex snap-x items-center justify-between gap-6 overflow-x-auto px-4 pb-4 text-center md:px-12">
                        {[
                            {
                                name: "Engagement Rings",
                                img: "https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=300",
                            },
                            {
                                name: "Fine Necklaces",
                                img: "https://images.pexels.com/photos/1733604/pexels-photo-1733604.jpeg?auto=compress&cs=tinysrgb&w=300",
                            },
                            {
                                name: "Diamond Earrings",
                                img: "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=300",
                            },
                            {
                                name: "Luxury Bracelets",
                                img: "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=300",
                            },
                            {
                                name: "Men&apos;s Collection",
                                img: "https://images.pexels.com/photos/298859/pexels-photo-298859.jpeg?auto=compress&cs=tinysrgb&w=300",
                            },
                            {
                                name: "Wedding Bands",
                                img: "https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg?auto=compress&cs=tinysrgb&w=300",
                            },
                        ].map((cat, i) => (
                            <div
                                key={i}
                                className="group flex min-w-[140px] cursor-pointer snap-center flex-col items-center gap-5 transition-all duration-500 hover:-translate-y-3"
                            >
                                <div className="group-hover:border-gold dark:group-hover:border-gold h-28 w-28 overflow-hidden rounded-full border-2 border-gray-100 bg-white p-1 shadow-md transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] dark:border-white/10 dark:bg-black">
                                    <img
                                        src={cat.img}
                                        alt={cat.name}
                                        className="h-full w-full rounded-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <span className="group-hover:text-gold dark:group-hover:text-gold text-[12px] font-bold tracking-widest text-gray-800 uppercase transition-colors dark:text-gray-300">
                                    {cat.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEW BENTO GRID SECTION: Categories Showcase */}
            <section className="bg-white py-24 transition-colors duration-500 dark:bg-[#050505]">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="mb-14 flex flex-col items-center text-center">
                        <span className="mb-2 text-xs font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-400">
                            Categories
                        </span>
                        <h2 className="mb-6 font-serif text-3xl tracking-wide text-gray-900 lg:text-4xl dark:text-white">
                            Jemmia Featured Products
                        </h2>
                    </div>

                    <div className="flex h-auto flex-col gap-4 md:h-[500px] md:flex-row lg:h-[600px]">
                        {/* 1. Left Tall */}
                        <div className="group relative h-[300px] w-full cursor-pointer overflow-hidden rounded-sm shadow-sm md:h-full md:w-1/4">
                            <img
                                src="https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=600"
                                alt="Engagement Rings"
                                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90"></div>
                            <span className="absolute inset-x-0 bottom-6 transform text-center text-sm font-bold tracking-widest text-white uppercase transition-transform duration-500 group-hover:-translate-y-2">
                                Engagement Rings
                            </span>
                        </div>

                        {/* 2. Middle Tall */}
                        <div className="group relative h-[300px] w-full cursor-pointer overflow-hidden rounded-sm shadow-sm md:h-full md:w-1/4">
                            <img
                                src="https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg?auto=compress&cs=tinysrgb&w=600"
                                alt="Wedding Bands"
                                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90"></div>
                            <span className="absolute inset-x-0 bottom-6 transform text-center text-sm font-bold tracking-widest text-white uppercase transition-transform duration-500 group-hover:-translate-y-2">
                                Wedding Bands
                            </span>
                        </div>

                        {/* 3. Right Area (Top Wide + Bottom 3) */}
                        <div className="flex h-[500px] w-full flex-col gap-4 md:h-full md:w-2/4">
                            {/* Top Wide */}
                            <div className="group relative h-1/2 w-full cursor-pointer overflow-hidden rounded-sm shadow-sm">
                                <img
                                    src="https://images.pexels.com/photos/1089148/pexels-photo-1089148.jpeg?auto=compress&cs=tinysrgb&w=1000"
                                    alt="Diamond Rings"
                                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90"></div>
                                <span className="absolute inset-x-0 bottom-6 transform text-center text-sm font-bold tracking-widest text-white uppercase transition-transform duration-500 group-hover:-translate-y-2">
                                    Diamond Rings
                                </span>
                            </div>
                            {/* Bottom 3 Smalls */}
                            <div className="flex h-1/2 w-full gap-4">
                                <div className="group relative h-full w-1/3 cursor-pointer overflow-hidden rounded-sm shadow-sm">
                                    <img
                                        src="https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400"
                                        alt="Earrings"
                                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90"></div>
                                    <span className="absolute inset-x-0 bottom-4 transform text-center text-[11px] font-bold tracking-widest text-white uppercase transition-transform duration-500 group-hover:-translate-y-2">
                                        Earrings
                                    </span>
                                </div>
                                <div className="group relative h-full w-1/3 cursor-pointer overflow-hidden rounded-sm shadow-sm">
                                    <img
                                        src="https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400"
                                        alt="Bracelets"
                                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90"></div>
                                    <span className="absolute inset-x-0 bottom-4 transform text-center text-[11px] font-bold tracking-widest text-white uppercase transition-transform duration-500 group-hover:-translate-y-2">
                                        Bracelets
                                    </span>
                                </div>
                                <div className="group relative h-full w-1/3 cursor-pointer overflow-hidden rounded-sm shadow-sm">
                                    <img
                                        src="https://images.pexels.com/photos/1733604/pexels-photo-1733604.jpeg?auto=compress&cs=tinysrgb&w=400"
                                        alt="Necklaces"
                                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90"></div>
                                    <span className="absolute inset-x-0 bottom-4 transform text-center text-[11px] font-bold tracking-widest text-white uppercase transition-transform duration-500 group-hover:-translate-y-2">
                                        Necklaces
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* New Section: Featured Collection (High-end layout for product introduction) */}
            <section className="bg-white py-24 transition-colors duration-500 dark:bg-[#030303]">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-stretch lg:gap-16">
                        {/* Text Content */}
                        <div className="flex flex-col justify-center text-center lg:w-5/12 lg:text-left">
                            <span className="text-gold mb-6 block text-[10px] font-bold tracking-[0.4em] uppercase">
                                Exclusive Release
                            </span>
                            <h2 className="mb-6 font-serif text-4xl leading-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                                The Imperial <br />
                                <span className="font-light text-gray-400 italic">Collection</span>
                            </h2>
                            <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed font-light text-gray-500 lg:mx-0 dark:text-gray-400">
                                Crafted with the rarest earth-mined diamonds and precision engineering. This new
                                collection represents the pinnacle of high jewelry design, where traditional methods
                                meet contemporary aesthetics to create timeless masterpieces.
                            </p>

                            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row lg:justify-start">
                                <button className="hover:bg-gold dark:hover:bg-gold w-full bg-gray-900 px-8 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase transition-colors duration-300 sm:w-auto dark:bg-white dark:text-black dark:hover:text-white">
                                    Shop Collection
                                </button>
                                <button className="group hover:text-gold dark:hover:text-gold flex w-full items-center justify-center gap-3 text-xs font-bold tracking-[0.2em] uppercase transition-colors sm:w-auto dark:text-gray-300">
                                    View Lookbook
                                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
                                </button>
                            </div>
                        </div>

                        {/* Image Showcase */}
                        <div className="group relative min-h-[500px] w-full overflow-hidden rounded-2xl lg:w-7/12 xl:min-h-[650px]">
                            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                            <img
                                src="https://images.pexels.com/photos/1733604/pexels-photo-1733604.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                alt="Featured Collection"
                                className="h-full w-full bg-black object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                            />

                            {/* Floating Product Cards */}
                            <div className="absolute right-4 bottom-4 left-4 z-20 flex flex-col gap-4 sm:right-8 sm:bottom-8 sm:left-8 sm:flex-row">
                                <div className="group/card flex flex-1 cursor-pointer items-center gap-4 rounded-xl border border-white/20 bg-white/90 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-md transition-transform duration-500 hover:-translate-y-2 dark:border-white/10 dark:bg-black/80">
                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-white/5">
                                        <img
                                            src="https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=150"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                                            alt="Ring"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="group-hover/card:text-gold mb-1 text-sm font-bold text-gray-900 transition-colors dark:text-white">
                                            Imperial Ring
                                        </h4>
                                        <p className="text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400">
                                            $12,500
                                        </p>
                                    </div>
                                    <div className="mr-2 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
                                        <div className="bg-gold flex h-8 w-8 items-center justify-center rounded-full text-white shadow-md">
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>

                                <div className="group/card hidden flex-1 cursor-pointer items-center gap-4 rounded-xl border border-white/20 bg-white/90 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-md transition-transform duration-500 hover:-translate-y-2 sm:flex dark:border-white/10 dark:bg-black/80">
                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-white/5">
                                        <img
                                            src="https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=150"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                                            alt="Earrings"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="group-hover/card:text-gold mb-1 text-sm font-bold text-gray-900 transition-colors dark:text-white">
                                            Imperial Drops
                                        </h4>
                                        <p className="text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400">
                                            $8,900
                                        </p>
                                    </div>
                                    <div className="mr-2 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
                                        <div className="bg-gold flex h-8 w-8 items-center justify-center rounded-full text-white shadow-md">
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modern Banners */}
            <section className="bg-gray-50 py-20 transition-colors duration-500 dark:bg-[#030303]">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="group relative h-[450px] overflow-hidden rounded-2xl bg-black shadow-lg">
                            <img
                                src="https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg?auto=compress&cs=tinysrgb&w=1000"
                                alt="Banner 1"
                                className="h-full w-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />
                            <div className="absolute right-12 bottom-12 left-12 transition-transform duration-500 group-hover:-translate-y-4">
                                <span className="text-gold mb-4 block text-xs font-bold tracking-[0.3em] uppercase">
                                    Signature Collection
                                </span>
                                <h3 className="mb-6 font-serif text-4xl leading-tight text-white">
                                    Timeless
                                    <br />
                                    Classics
                                </h3>
                                <button className="border-gold hover:text-gold flex w-max items-center gap-3 border-b-2 pb-2 text-sm font-bold tracking-widest text-white uppercase transition-colors">
                                    Shop Men&apos;s <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="group relative h-[450px] overflow-hidden rounded-2xl bg-black shadow-lg">
                            <img
                                src="https://images.pexels.com/photos/236151/pexels-photo-236151.jpeg?auto=compress&cs=tinysrgb&w=1000"
                                alt="Banner 2"
                                className="h-full w-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />
                            <div className="absolute right-12 bottom-12 left-12 transition-transform duration-500 group-hover:-translate-y-4">
                                <span className="text-gold mb-4 block text-xs font-bold tracking-[0.3em] uppercase">
                                    Bridal Exclusives
                                </span>
                                <h3 className="mb-6 font-serif text-4xl leading-tight text-white">
                                    Modern
                                    <br />
                                    Romance
                                </h3>
                                <button className="border-gold hover:text-gold flex w-max items-center gap-3 border-b-2 pb-2 text-sm font-bold tracking-widest text-white uppercase transition-colors">
                                    Shop Bridal <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium Loose Diamonds Grid */}
            <section className="bg-white py-24 transition-colors duration-500 dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="mb-16 flex flex-col items-center text-center">
                        <span className="text-gold mb-4 text-xs font-bold tracking-[0.3em] uppercase">
                            Certified Brilliance
                        </span>
                        <h2 className="mb-6 font-serif text-4xl tracking-wide text-gray-900 lg:text-5xl dark:text-white">
                            Loose Diamonds
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="h-[2px] w-20 bg-gray-200 dark:bg-white/10"></span>
                            <div className="bg-gold h-3 w-3 rotate-45 shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
                            <span className="h-[2px] w-20 bg-gray-200 dark:bg-white/10"></span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {diamonds.map((diamond, i) => (
                            <div key={i} className="group flex cursor-pointer flex-col">
                                {/* Image Wrapper */}
                                <div className="relative mb-5 aspect-square w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 transition-shadow duration-500 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:border-white/5 dark:bg-[#111] dark:group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                                    {/* Image 1 (Default) */}
                                    <img
                                        src="https://cashion.vn/wp-content/uploads/2024/01/kim-cuong-6-51-6-54-vvs1-f-bch2335747-1-768x768.jpg"
                                        alt={diamond.name}
                                        className="absolute inset-0 h-full w-full scale-100 object-cover opacity-100 transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:opacity-0"
                                    />
                                    {/* Image 2 (Hover) */}
                                    <img
                                        src="https://cashion.vn/wp-content/uploads/2024/01/kim-cuong-6-51-6-54-vvs1-f-bch2335747-3-768x768.jpg"
                                        alt={`${diamond.name} alternate`}
                                        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:scale-100 group-hover:opacity-100"
                                    />

                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex items-center gap-1 rounded-[4px] bg-blue-600/90 px-2 py-1 text-white shadow-sm backdrop-blur-sm">
                                        <span className="mr-1 border-r border-white/30 pr-1 text-[10px] font-bold tracking-widest">
                                            PNJ
                                        </span>
                                        <span className="text-[10px] font-bold tracking-widest">GIA</span>
                                    </div>

                                    <div className="absolute right-4 bottom-4 transform rounded-lg border border-red-100 bg-white/90 px-3 py-1.5 text-center font-bold text-red-500 shadow-sm backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 dark:border-red-900/30 dark:bg-black/80">
                                        <span className="mb-0.5 block text-[9px] leading-none tracking-widest uppercase">
                                            Sale
                                        </span>
                                        <span className="text-xl leading-none">{diamond.discount}</span>
                                    </div>

                                    {/* Quick Action Overlay on Hover */}
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-100/90 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-black/90"></div>
                                    <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 translate-y-4 gap-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                        <button className="hover:bg-gold flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg transition-colors hover:text-white dark:bg-[#222] dark:text-white">
                                            <Search size={16} />
                                        </button>
                                        <button className="hover:bg-gold flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-colors hover:text-white dark:bg-white dark:text-black">
                                            <ShoppingCart size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Info Area */}
                                <div className="relative px-2 text-center transition-transform duration-300 group-hover:-translate-y-1">
                                    <h3 className="group-hover:text-gold mb-1.5 line-clamp-2 text-[13px] font-medium text-gray-800 transition-colors duration-300 md:text-sm dark:text-gray-200">
                                        {diamond.name}
                                    </h3>
                                    <p className="mb-3 text-[11px] font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                                        SKU: {diamond.sku}
                                    </p>

                                    <div className="mb-1.5 flex items-center justify-center gap-3">
                                        <span className="text-[13px] text-gray-400 line-through decoration-gray-300 dark:text-gray-500 dark:decoration-gray-600">
                                            {diamond.original}
                                        </span>
                                        <span className="text-gold-dark dark:text-gold-light text-[16px] font-bold">
                                            {diamond.sale}
                                        </span>
                                    </div>
                                    <p className="text-[11px] font-bold tracking-wide text-red-500 uppercase">
                                        Extra {diamond.discount} discount
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 flex justify-center">
                        <button className="group hover:border-gold hover:bg-gold flex items-center gap-3 border border-gray-300 bg-transparent px-10 py-4 text-sm font-bold tracking-widest text-gray-900 uppercase transition-all hover:text-white hover:shadow-lg dark:border-white/20 dark:text-white dark:hover:text-black">
                            View All Diamonds
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Craftsmanship Parallax Segment */}
            <section className="group relative overflow-hidden bg-black py-32">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 z-10 bg-black/60 transition-opacity duration-1000 group-hover:bg-black/40" />
                    <img
                        src="https://images.pexels.com/photos/5439487/pexels-photo-5439487.jpeg?auto=compress&cs=tinysrgb&w=1600"
                        alt="Craftsmanship"
                        className="h-full w-full scale-110 transform object-cover object-center saturate-50 transition-transform duration-[20s] ease-linear group-hover:scale-125"
                    />
                </div>
                <div className="relative z-20 container mx-auto px-4 text-center">
                    <div className="mx-auto flex max-w-3xl flex-col items-center">
                        <Star size={32} className="text-gold mb-6 animate-pulse" />
                        <h2 className="mb-8 font-serif text-4xl leading-tight text-white md:text-5xl">
                            Master Craftsmanship
                            <br />
                            <span className="text-gray-300 italic">A Heritage of Excellence</span>
                        </h2>
                        <p className="mb-10 max-w-2xl text-lg leading-relaxed font-light text-gray-300">
                            Every Yash piece is forged by master artisans using time-honored techniques passed down
                            through generations. We source only the top 1% of ethically mined diamonds to ensure your
                            legacy shines forever.
                        </p>
                        <button className="text-gold border-gold border-b-2 pb-2 text-sm font-bold tracking-[0.2em] uppercase transition-colors hover:border-white hover:text-white">
                            Discover Our Process
                        </button>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="bg-gray-50 py-24 transition-colors dark:bg-[#030303]">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="grid grid-cols-1 gap-12 divide-y divide-gray-200 text-center md:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0 dark:divide-white/5">
                        {[
                            {
                                icon: Truck,
                                title: "Complimentary Shipping",
                                desc: "Secure shipping locally and globally.",
                            },
                            {
                                icon: ShieldCheck,
                                title: "100% Certified Authentic",
                                desc: "GIA & AGS certified diamonds.",
                            },
                            { icon: RefreshCw, title: "30-Day Returns", desc: "Hassle-free returns and exchanges." },
                            {
                                icon: Award,
                                title: "Lifetime Warranty",
                                desc: "Free cleaning, polishing, & prongs check.",
                            },
                        ].map((feat, i) => (
                            <div key={i} className="group flex cursor-default flex-col items-center px-6 pt-8 lg:pt-0">
                                <div className="mb-6 box-content flex h-16 w-16 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-lg dark:border-white/5 dark:bg-[#111] dark:group-hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)]">
                                    <feat.icon
                                        size={28}
                                        strokeWidth={1.5}
                                        className="text-gold transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <h4 className="mb-3 text-[15px] font-bold tracking-wider text-gray-900 uppercase dark:text-white">
                                    {feat.title}
                                </h4>
                                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Instagram Feed / Lifestyle (Fixed Pexels Links) */}
            <section className="flex flex-col items-center bg-white py-0 dark:bg-[#080808]">
                <div className="w-full py-16 text-center">
                    <span className="text-gold mb-4 block text-xs font-bold tracking-[0.3em] uppercase">
                        @yashjewels
                    </span>
                    <h2 className="font-serif text-3xl text-gray-900 dark:text-white">Follow Our Journey</h2>
                </div>
                <div className="grid w-full grid-cols-2 bg-black md:grid-cols-5">
                    {[
                        "https://images.pexels.com/photos/3266700/pexels-photo-3266700.jpeg?auto=compress&cs=tinysrgb&w=600",
                        "https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=600",
                        "https://images.pexels.com/photos/177332/pexels-photo-177332.jpeg?auto=compress&cs=tinysrgb&w=600",
                        "https://images.pexels.com/photos/8321590/pexels-photo-8321590.jpeg?auto=compress&cs=tinysrgb&w=600",
                        "https://images.pexels.com/photos/5608249/pexels-photo-5608249.jpeg?auto=compress&cs=tinysrgb&w=600",
                    ].map((url, i) => (
                        <div key={i} className="group relative aspect-square overflow-hidden">
                            <img
                                src={url}
                                alt="Instagram feed"
                                className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <Instagram
                                    size={32}
                                    className="scale-50 transform text-white transition-transform duration-500 group-hover:scale-100"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

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
