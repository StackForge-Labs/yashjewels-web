import { ShoppingCart, User, Heart, ChevronRight, Phone, ArrowRight } from "lucide-react";
import ThemeToggle from "../(home)/_components/ThemeToggle";
import SearchModal from "../(home)/_components/SearchModal";
import Link from "next/link";

export const Header = () => {
    return (
        <>
            {/* Top Notification Bar */}
            <div className="border-b border-gray-200 bg-gray-50 py-2 text-xs text-gray-500 transition-colors dark:border-white/5 dark:bg-[#080808] dark:text-gray-400">
                <div className="container mx-auto flex items-center justify-between px-4">
                    <div className="flex shrink-0 items-center gap-3 md:gap-4">
                        <span className="bg-gold rounded-sm px-1.5 py-0.5 text-[9px] font-bold tracking-widest text-black uppercase md:text-[10px]">
                            Global
                        </span>
                        <span className="hidden text-[10px] font-medium tracking-wider uppercase lg:inline">
                            Official Retail Network
                        </span>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6">
                        <a
                            href="tel:+18001234567"
                            className="hover:text-gold flex items-center gap-1.5 transition-colors"
                        >
                            <Phone size={12} className="text-gold" />
                            <span className="text-[10px] font-bold tracking-wider md:text-xs">
                                <span className="hidden sm:inline">Hotline: </span>+1 (800) 123-4567
                            </span>
                        </a>
                        <div className="flex items-center gap-2 border-l border-gray-200 pl-4 md:pl-6 dark:border-white/10">
                            <span className="text-[10px] font-bold tracking-widest text-gray-800 uppercase dark:text-gray-200">
                                EN
                            </span>
                            <span className="text-gray-300">/</span>
                            <span className="hover:text-gold cursor-pointer text-[10px] tracking-widest uppercase transition-colors">
                                USD
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation Header */}
            <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 shadow-sm backdrop-blur-xl transition-all dark:border-white/5 dark:bg-[#050505]/90 dark:shadow-none">
                <div className="container mx-auto flex items-center justify-between px-4">
                    {/* Logo */}
                    <div className="group flex cursor-pointer flex-col items-center py-4 md:py-0">
                        <div className="text-gold mb-1 scale-75 transform transition-transform duration-500 group-hover:rotate-180 md:scale-100">
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
                        <h1 className="font-serif text-sm leading-none tracking-[0.2em] text-gray-900 uppercase md:text-xl dark:text-white">
                            Yash Jewels
                        </h1>
                        <span className="text-gold mt-1 text-[6px] font-bold tracking-[0.3em] uppercase md:text-[8px]">
                            High Jewelry
                        </span>
                    </div>

                    {/* Centered Nav with Hover Dropdowns */}
                    <nav className="hidden h-full items-center gap-8 xl:flex">
                        {/* 1. Active Home Item */}
                        <div className="flex h-full items-center">
                            <Link
                                href="/"
                                className="text-gold after:bg-gold relative py-8 text-xs font-bold tracking-[0.15em] uppercase transition-all after:absolute after:right-0 after:bottom-6 after:left-0 after:h-[2px] after:w-full after:content-['']"
                            >
                                Home
                            </Link>
                        </div>

                        {/* 2. Mega Menu Item (Submenu To) */}
                        <div className="group flex h-full items-center">
                            <Link
                                href="/collections"
                                className="hover:text-gold relative py-8 text-xs font-bold tracking-[0.15em] text-gray-700 uppercase transition-colors dark:text-gray-300"
                            >
                                High Jewelry
                            </Link>
                            {/* Enhanced Mega Menu Dropdown */}
                            <div className="invisible absolute top-full left-0 z-50 w-full border-t border-gray-100 bg-white/95 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-300 group-hover:visible group-hover:opacity-100 dark:border-white/5 dark:bg-[#050505]/95">
                                <div className="mx-auto flex max-w-[1500px] gap-8 px-8 py-16 text-left">
                                    <div className="w-[15%]">
                                        <h4 className="mb-8 border-b border-gray-100 pb-3 font-serif text-lg text-gray-900 dark:border-white/10 dark:text-white">
                                            Category
                                        </h4>
                                        <ul className="space-y-5 text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {[
                                                "Engagement Rings",
                                                "Fine Necklaces",
                                                "Diamond Earrings",
                                                "Luxury Bracelets",
                                                "Men's Collection",
                                            ].map((item) => (
                                                <li key={item}>
                                                    <a
                                                        href="#"
                                                        className="group/link hover:text-gold flex items-center justify-between transition-colors"
                                                    >
                                                        {item}
                                                        <ChevronRight
                                                            size={14}
                                                            className="-translate-x-2 opacity-0 transition-all group-hover/link:translate-x-0 group-hover/link:opacity-100"
                                                        />
                                                    </a>
                                                </li>
                                            ))}
                                            <li className="pt-4">
                                                <Link
                                                    href="/collections"
                                                    className="border-gold text-gold inline-block border-b pb-1 text-[11px] font-bold tracking-widest uppercase transition-colors hover:text-gray-900 dark:hover:text-white"
                                                >
                                                    View All Categories
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="w-[15%]">
                                        <h4 className="mb-8 border-b border-gray-100 pb-3 font-serif text-lg text-gray-900 dark:border-white/10 dark:text-white">
                                            Material
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
                                            <li>
                                                <a
                                                    href="#"
                                                    className="hover:text-gold flex items-center gap-3 transition-colors"
                                                >
                                                    <span className="block h-4 w-4 rounded-full border border-white bg-gray-800 shadow-sm"></span>{" "}
                                                    Titanium
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="w-[15%]">
                                        <h4 className="mb-8 border-b border-gray-100 pb-3 font-serif text-lg text-gray-900 dark:border-white/10 dark:text-white">
                                            Diamond Shape
                                        </h4>
                                        <ul className="space-y-5 text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {[
                                                "Round Brilliant",
                                                "Princess Cut",
                                                "Emerald Cut",
                                                "Oval Shape",
                                                "Pear Shape",
                                                "Cushion Cut",
                                            ].map((item) => (
                                                <li key={item}>
                                                    <a
                                                        href="#"
                                                        className="group/link hover:text-gold flex items-center justify-between transition-colors"
                                                    >
                                                        {item}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="w-[15%]">
                                        <h4 className="mb-8 border-b border-gray-100 pb-3 font-serif text-lg text-gray-900 dark:border-white/10 dark:text-white">
                                            Featured
                                        </h4>
                                        <ul className="space-y-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                                            <li>
                                                <a href="#" className="hover:text-gold block transition-colors">
                                                    <span className="mb-1 block font-serif text-black dark:text-white">
                                                        The Imperial
                                                    </span>
                                                    <span className="text-xs font-light text-gray-400">
                                                        Timeless masterpieces
                                                    </span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="hover:text-gold block transition-colors">
                                                    <span className="mb-1 block font-serif text-black dark:text-white">
                                                        Aura Solitaire
                                                    </span>
                                                    <span className="text-xs font-light text-gray-400">
                                                        Classic elegance
                                                    </span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="hover:text-gold block transition-colors">
                                                    <span className="mb-1 block font-serif text-black dark:text-white">
                                                        High Jewelry
                                                    </span>
                                                    <span className="text-xs font-light text-gray-400">
                                                        Exclusive creations
                                                    </span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="grid w-[40%] grid-cols-2 gap-6 border-l border-gray-100 pl-4 dark:border-white/5">
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

                        {/* Dropdown 1: Wedding & Bridal */}
                        <div className="group relative flex h-full items-center">
                            <a
                                href="#"
                                className="hover:text-gold relative py-8 text-xs font-bold tracking-[0.15em] text-gray-700 uppercase transition-colors dark:text-gray-300"
                            >
                                Wedding
                            </a>
                            <div className="invisible absolute top-full left-1/2 z-50 w-64 -translate-x-1/2 overflow-hidden rounded-b-lg border border-gray-100 bg-white opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:opacity-100 dark:border-white/5 dark:bg-[#0a0a0a]">
                                <ul className="flex flex-col text-sm font-medium text-gray-600 dark:text-gray-400">
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-gold block border-b border-gray-50 px-6 py-4 transition-colors hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
                                        >
                                            Engagement Rings
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-gold block border-b border-gray-50 px-6 py-4 transition-colors hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
                                        >
                                            Wedding Bands for Her
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-gold block border-b border-gray-50 px-6 py-4 transition-colors hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
                                        >
                                            Wedding Bands for Him
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-gold block px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                                        >
                                            Bridal Jewelry Sets
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Dropdown 2: Collections */}
                        <div className="group relative flex h-full items-center">
                            <Link
                                href="/collections"
                                className="hover:text-gold relative py-8 text-xs font-bold tracking-[0.15em] text-gray-700 uppercase transition-colors dark:text-gray-300"
                            >
                                Collections
                            </Link>
                            <div className="invisible absolute top-full left-1/2 z-50 w-56 -translate-x-1/2 overflow-hidden rounded-b-lg border border-gray-100 bg-white opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:opacity-100 dark:border-white/5 dark:bg-[#0a0a0a]">
                                <ul className="flex flex-col text-sm font-medium text-gray-600 dark:text-gray-400">
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-gold block border-b border-gray-50 px-6 py-4 transition-colors hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
                                        >
                                            The Imperial
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-gold block border-b border-gray-50 px-6 py-4 transition-colors hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
                                        >
                                            Aura Solitaire
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-gold block border-b border-gray-50 px-6 py-4 transition-colors hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
                                        >
                                            Modern Essentials
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-gold block px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                                        >
                                            Everyday Elegance
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Dropdown 3: Services */}
                        <div className="group relative flex h-full items-center">
                            <Link
                                href="/contact"
                                className="hover:text-gold relative py-8 text-xs font-bold tracking-[0.15em] text-gray-700 uppercase transition-colors dark:text-gray-300"
                            >
                                Services
                            </Link>
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
                                        <Link
                                            href="/contact"
                                            className="hover:text-gold block px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                                        >
                                            Appraisals
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Dropdown 4: The Maison */}
                        <div className="group relative flex h-full items-center">
                            <Link
                                href="/about"
                                className="hover:text-gold relative py-8 text-xs font-bold tracking-[0.15em] text-gray-700 uppercase transition-colors dark:text-gray-300"
                            >
                                The Maison
                            </Link>
                            <div className="invisible absolute top-full left-1/2 z-50 w-56 -translate-x-1/2 overflow-hidden rounded-b-lg border border-gray-100 bg-white opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:opacity-100 dark:border-white/5 dark:bg-[#0a0a0a]">
                                <ul className="flex flex-col text-sm font-medium text-gray-600 dark:text-gray-400">
                                    <li>
                                        <Link
                                            href="/about"
                                            className="hover:text-gold block border-b border-gray-50 px-6 py-4 transition-colors hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
                                        >
                                            Our Heritage
                                        </Link>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-gold block border-b border-gray-50 px-6 py-4 transition-colors hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
                                        >
                                            Savoir-Faire
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-gold block border-b border-gray-50 px-6 py-4 transition-colors hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
                                        >
                                            Journal & News
                                        </a>
                                    </li>
                                    <li>
                                        <Link
                                            href="/careers"
                                            className="hover:text-gold block px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                                        >
                                            Careers
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3 text-gray-700 md:gap-5 dark:text-gray-300">
                        <div className="hidden sm:block">
                            <ThemeToggle />
                        </div>
                        <div className="mx-1 hidden h-6 w-px bg-gray-200 md:block dark:bg-gray-800"></div>

                        <SearchModal />

                        <button className="hover:text-gold hidden transform transition-colors duration-300 hover:scale-110 sm:block">
                            <User size={22} strokeWidth={1.5} />
                        </button>

                        <Link href="/wishlist" className="hover:text-gold relative transform transition-colors duration-300 hover:scale-110">
                            <Heart size={22} strokeWidth={1.5} />
                        </Link>

                        <Link href="/cart" className="hover:text-gold relative transform transition-colors duration-300 hover:scale-110">
                            <ShoppingCart size={22} strokeWidth={1.5} />
                            <span className="bg-gold absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-bold text-white md:h-4 md:w-4 md:text-[9px] dark:text-black">
                                3
                            </span>
                        </Link>
                    </div>
                </div>
            </header>
        </>
    );
};
