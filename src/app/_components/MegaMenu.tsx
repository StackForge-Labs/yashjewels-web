"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ChevronDown,
    ChevronRight,
    Gem,
    Sparkles,
    BookOpen,
    Phone,
    Scale,
    DollarSign,
    Ruler,
    Users,
    Briefcase,
    ArrowRight,
    Loader2,
    ArrowUpRight,
} from "lucide-react";
import { categoryService } from "@/services/category.service";
import { Category } from "@/types/category.types";

// ── Static curated imagery per category type ────────────────────────────────
const CATEGORY_IMAGES: Record<string, string> = {
    default0: "https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg?auto=compress&cs=tinysrgb&w=600",
    default1: "https://images.pexels.com/photos/1581554/pexels-photo-1581554.jpeg?auto=compress&cs=tinysrgb&w=600",
    default2: "https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=600",
    default3: "https://images.pexels.com/photos/1306281/pexels-photo-1306281.jpeg?auto=compress&cs=tinysrgb&w=600",
    default4: "https://images.pexels.com/photos/3266700/pexels-photo-3266700.jpeg?auto=compress&cs=tinysrgb&w=600",
};

const GOLD_FILTERS = [
    { label: "Yellow Gold 18K", color: "bg-yellow-400" },
    { label: "White Gold 18K", color: "bg-slate-200 border border-slate-300" },
    { label: "Rose Gold 18K", color: "bg-rose-300" },
    { label: "Platinum 950", color: "bg-slate-400" },
];

const WEDDING_ITEMS = [
    {
        label: "Engagement Rings",
        slug: "engagement-rings",
        img: "https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg?auto=compress&cs=tinysrgb&w=400",
        sub: "Solitaire · Halo · Pavé",
    },
    {
        label: "Wedding Bands",
        slug: "wedding-bands",
        img: "https://images.pexels.com/photos/1306281/pexels-photo-1306281.jpeg?auto=compress&cs=tinysrgb&w=400",
        sub: "His · Hers · Matching Sets",
    },
    {
        label: "Bridal Sets",
        slug: "bridal-sets",
        img: "https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=400",
        sub: "Complete Collections",
    },
];

const FEATURED_EDITORIALS = [
    {
        label: "New Arrivals",
        caption: "The Imperial Edit",
        img: "https://images.pexels.com/photos/1733604/pexels-photo-1733604.jpeg?auto=compress&cs=tinysrgb&w=600",
        href: "/collections/all?sortBy=newest",
    },
    {
        label: "Bridal Edit",
        caption: "Classic Elegance",
        img: "https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=600",
        href: "/collections/all?q=bridal",
    },
];

const FEATURED_COLLECTIONS = [
    {
        label: "The Imperial",
        slug: "the-imperial",
        img: "https://images.pexels.com/photos/1733604/pexels-photo-1733604.jpeg?auto=compress&cs=tinysrgb&w=800",
        sub: "Regal brilliance"
    },
    {
        label: "Aura Solitaire",
        slug: "aura-solitaire",
        img: "https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=800",
        sub: "Timeless purity"
    },
    {
        label: "Lotus Embrace",
        slug: "lotus-embrace",
        img: "https://images.pexels.com/photos/3266700/pexels-photo-3266700.jpeg?auto=compress&cs=tinysrgb&w=800",
        sub: "Nature inspired"
    },
];

const SERVICES = [
    { label: "Diamond Guide", icon: Gem, href: "/diamond-guide", sub: "4Cs · Clarity · Cut grading" },
    { label: "Live Gold Price", icon: DollarSign, href: "/gold-price", sub: "Real-time market rate" },
    { label: "Size Guide", icon: Ruler, href: "/size-guide", sub: "Ring · Bracelet · Necklace" },
    { label: "Bespoke Service", icon: Sparkles, href: "/contact", sub: "Custom design atelier" },
    { label: "Policies", icon: Scale, href: "/policies/warranty", sub: "Warranty · Exchange · Privacy" },
    { label: "Payment Guide", icon: BookOpen, href: "/policies/payment-guide", sub: "Instalment · Card · Crypto" },
];

const ABOUT_ITEMS = [
    { label: "Our Story", icon: BookOpen, href: "/about", sub: "Heritage since 1998" },
    { label: "Our Craft", icon: Gem, href: "/about#craft", sub: "Artisan workshops" },
    { label: "Careers", icon: Briefcase, href: "/careers", sub: "Join the Maison" },
    { label: "Contact Us", icon: Phone, href: "/contact", sub: "Salons & appointments" },
    { label: "API Docs", icon: Users, href: "/api-docs", sub: "Developer resources" },
];

// ── High Jewelry Mega Menu ───────────────────────────────────────────────────
function HighJewelryMenu({ categories, loading }: { categories: Category[]; loading: boolean }) {
    const router = useRouter();
    const handleQuickFilter = (karat: string) => {
        router.push(`/collections/all?q=${encodeURIComponent(karat)}`);
    };

    return (
        <div className="invisible absolute top-full left-0 right-0 z-[60] border-t border-gray-100 bg-white/98 opacity-0 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] backdrop-blur-2xl transition-all duration-500 group-hover:visible group-hover:opacity-100 dark:border-white/5 dark:bg-[#050505]/98">
            <div className="mx-auto flex max-w-[1400px] gap-12 px-12 py-16">

                {/* Col 1: Dynamic Categories */}
                <div className="w-1/5 min-w-[200px]">
                    <h4 className="mb-8 text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase">Shop By Category</h4>
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-4 w-4/5 animate-pulse rounded bg-gray-100 dark:bg-white/5" />
                            ))}
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        href={`/collections/${cat.slug}`}
                                        className="group/link flex items-center justify-between rounded-xl px-4 py-3 text-[12px] font-medium text-gray-600 transition-all hover:bg-gold/5 hover:text-gold dark:text-gray-400"
                                    >
                                        {cat.name}
                                        <ChevronRight size={14} className="-translate-x-2 opacity-0 transition-all group-hover/link:translate-x-0 group-hover/link:opacity-100" />
                                    </Link>
                                </li>
                            ))}
                            <li className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                <Link href="/collections" className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold tracking-widest text-gold uppercase hover:gap-3 transition-all">
                                    View All <ArrowRight size={12} />
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>

                {/* Col 2: Filters & Quick Links */}
                <div className="w-1/5 min-w-[200px] border-x border-gray-100 px-12 dark:border-white/5">
                    <h4 className="mb-8 text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase">Filter By Metal</h4>
                    <ul className="space-y-3">
                        {GOLD_FILTERS.map((g) => (
                            <li key={g.label}>
                                <button
                                    onClick={() => handleQuickFilter(g.label)}
                                    className="group/g flex w-full items-center gap-4 rounded-xl px-4 py-3 text-[12px] font-medium text-gray-600 transition-all hover:bg-gold/5 hover:text-gold dark:text-gray-400"
                                >
                                    <span className={`h-5 w-5 shrink-0 rounded-full shadow-inner ${g.color}`} />
                                    {g.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-10 pt-10 border-t border-gray-100 dark:border-white/5">
                        <h4 className="mb-6 text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase">Quick Filters</h4>
                        <div className="flex flex-wrap gap-2">
                            {["In Stock", "New Arrivals", "On Sale", "Under $500"].map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => router.push(`/collections/all?q=${encodeURIComponent(tag)}`)}
                                    className="rounded-lg border border-gray-200 px-3.5 py-1.5 text-[9px] font-bold tracking-widest text-gray-500 uppercase transition-all hover:border-gold hover:bg-gold hover:text-white dark:border-white/10 dark:text-gray-400"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Col 3: Editorial & Collections Grid */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase">Featured Editorials</h4>
                        <Link href="/collections" className="text-[10px] font-bold tracking-widest text-gold uppercase hover:underline">Discover More</Link>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {FEATURED_EDITORIALS.map((ed) => (
                            <Link key={ed.label} href={ed.href} className="group/img relative aspect-[16/9] overflow-hidden rounded-2xl shadow-2xl">
                                <img
                                    src={ed.img}
                                    alt={ed.label}
                                    className="h-full w-full object-cover transition-transform duration-[2.5s] ease-out group-hover/img:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-8">
                                    <span className="text-gold mb-2 block text-[10px] font-bold tracking-[0.4em] uppercase">{ed.label}</span>
                                    <p className="font-serif text-2xl leading-tight text-white">{ed.caption}</p>
                                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold tracking-widest text-white/70 uppercase group-hover/img:text-gold transition-colors">
                                        Shop Now <ArrowUpRight size={12} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Bottom strip: Popular Categories */}
                    <div className="mt-8 grid grid-cols-4 gap-4">
                        {categories.slice(0, 4).map((cat, i) => (
                            <Link key={cat.id} href={`/collections/${cat.slug}`} className="group/strip relative h-24 overflow-hidden rounded-2xl">
                                <img
                                    src={cat.iconUrl ?? CATEGORY_IMAGES[`default${i}`] ?? CATEGORY_IMAGES.default0}
                                    alt={cat.name}
                                    className="h-full w-full object-cover transition-transform duration-1000 group-hover/strip:scale-125"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase drop-shadow-md">
                                        {cat.name}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Wedding Dropdown ─────────────────────────────────────────────────────────
function WeddingMenu() {
    return (
        <div className="invisible absolute top-full left-1/2 z-50 w-[520px] -translate-x-1/2 overflow-hidden rounded-b-2xl border border-gray-100 bg-white opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:opacity-100 dark:border-white/5 dark:bg-[#0a0a0a]">
            <div className="p-5">
                <p className="mb-4 text-[9px] font-bold tracking-[0.35em] text-gray-400 uppercase">Bridal & Wedding</p>
                <div className="grid grid-cols-3 gap-3">
                    {WEDDING_ITEMS.map((item) => (
                        <Link key={item.label} href={`/collections/${item.slug}`} className="group/w relative overflow-hidden rounded-xl">
                            <img
                                src={item.img}
                                alt={item.label}
                                className="h-36 w-full object-cover transition-transform duration-700 group-hover/w:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-0 p-3">
                                <p className="text-[10px] font-bold text-white">{item.label}</p>
                                <p className="mt-0.5 text-[8px] text-white/60">{item.sub}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-100 dark:border-white/5">
                    <span className="text-[9px] text-gray-400">Complimentary engraving on all wedding bands</span>
                    <Link href="/collections/all?q=wedding" className="flex items-center gap-1 text-[9px] font-bold tracking-widest text-gold uppercase hover:underline">
                        View All <ArrowRight size={10} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ── Services Dropdown ────────────────────────────────────────────────────────
function ServicesMenu() {
    return (
        <div className="invisible absolute top-full left-1/2 z-50 w-[480px] -translate-x-1/2 overflow-hidden rounded-b-2xl border border-gray-100 bg-white opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:opacity-100 dark:border-white/5 dark:bg-[#0a0a0a]">
            <div className="p-5">
                <p className="mb-4 text-[9px] font-bold tracking-[0.35em] text-gray-400 uppercase">Client Services</p>
                <div className="grid grid-cols-2 gap-2">
                    {SERVICES.map(({ label, icon: Icon, href, sub }) => (
                        <Link
                            key={label}
                            href={href}
                            className="group/s flex items-start gap-3 rounded-xl p-3 transition-all hover:bg-gold/5"
                        >
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition-all group-hover/s:bg-gold/10 group-hover/s:text-gold dark:bg-white/5">
                                <Icon size={15} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-gray-800 transition-colors group-hover/s:text-gold dark:text-gray-200">{label}</p>
                                <p className="mt-0.5 text-[9px] text-gray-400">{sub}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="mt-3 rounded-xl bg-gold/5 p-4 border border-gold/10">
                    <p className="text-[10px] font-bold text-gold">✦ Bespoke Design Consultation</p>
                    <p className="mt-1 text-[9px] text-gray-500">Book a private appointment with our master jewellers.</p>
                    <Link href="/contact" className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold tracking-widest text-gold uppercase hover:underline">
                        Book Now <ArrowRight size={9} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ── About Dropdown ───────────────────────────────────────────────────────────
function AboutMenu() {
    return (
        <div className="invisible absolute top-full left-1/2 z-50 w-72 -translate-x-1/2 overflow-hidden rounded-b-2xl border border-gray-100 bg-white opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:opacity-100 dark:border-white/5 dark:bg-[#0a0a0a]">
            <div className="p-4">
                <p className="mb-3 text-[9px] font-bold tracking-[0.35em] text-gray-400 uppercase">The Maison</p>
                <ul className="space-y-0.5">
                    {ABOUT_ITEMS.map(({ label, icon: Icon, href, sub }) => (
                        <li key={label}>
                            <Link
                                href={href}
                                className="group/a flex items-center gap-3 rounded-xl px-3 py-3 transition-all hover:bg-gold/5"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-400 transition-all group-hover/a:bg-gold/10 group-hover/a:text-gold dark:bg-white/5">
                                    <Icon size={14} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-gray-800 transition-colors group-hover/a:text-gold dark:text-gray-200">{label}</p>
                                    <p className="text-[9px] text-gray-400">{sub}</p>
                                </div>
                                <ChevronRight size={12} className="ml-auto -translate-x-1 text-gray-300 opacity-0 transition-all group-hover/a:translate-x-0 group-hover/a:text-gold group-hover/a:opacity-100" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

// ── Collections Dropdown ─────────────────────────────────────────────────────
function CollectionsMenu({ categories, loading }: { categories: Category[]; loading: boolean }) {
    return (
        <div className="invisible absolute top-full left-1/2 z-[60] w-[900px] -translate-x-1/2 overflow-hidden rounded-b-2xl border border-gray-100 bg-white opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:opacity-100 dark:border-white/5 dark:bg-[#0a0a0a]">
            <div className="flex h-full min-h-[350px]">
                {/* Left: Collection List */}
                <div className="w-[35%] bg-gray-50/50 p-8 dark:bg-white/[0.02]">
                    <h4 className="mb-6 text-[9px] font-bold tracking-[0.35em] text-gray-400 uppercase">All Collections</h4>
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-white/5" />
                            ))}
                        </div>
                    ) : (
                        <ul className="space-y-1">
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        href={`/collections/${cat.slug}`}
                                        className="group/col flex items-center justify-between rounded-lg px-3 py-2.5 text-[12px] font-medium text-gray-600 transition-all hover:bg-white hover:text-gold hover:shadow-sm dark:text-gray-400 dark:hover:bg-white/5"
                                    >
                                        {cat.name}
                                        <ChevronRight size={14} className="-translate-x-2 opacity-0 transition-all group-hover/col:translate-x-0 group-hover/col:opacity-100" />
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-4 mt-2 border-t border-gray-200 dark:border-white/10">
                                <Link href="/collections" className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold tracking-widest text-gold uppercase hover:underline">
                                    View All Collections <ArrowRight size={11} />
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>

                {/* Right: Featured Collections Cards */}
                <div className="w-[65%] p-8">
                    <h4 className="mb-6 text-[9px] font-bold tracking-[0.35em] text-gray-400 uppercase">Featured Collections</h4>
                    <div className="grid grid-cols-3 gap-5">
                        {FEATURED_COLLECTIONS.map((col) => (
                            <Link key={col.label} href={`/collections/${col.slug}`} className="group/card relative flex flex-col">
                                <div className="relative overflow-hidden rounded-xl bg-gray-100">
                                    <img
                                        src={col.img}
                                        alt={col.label}
                                        className="h-56 w-full object-cover transition-transform duration-[1.5s] group-hover/card:scale-110"
                                    />
                                    {/* Subdued overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
                                </div>
                                <div className="mt-4 text-center">
                                    <h5 className="font-serif text-base text-gray-900 transition-colors group-hover/card:text-gold dark:text-white">{col.label}</h5>
                                    <p className="mt-1 text-[10px] tracking-wider text-gray-500 uppercase">{col.sub}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Main Export ──────────────────────────────────────────────────────────────
export function MegaMenu() {
    const [hasMounted, setHasMounted] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [catLoading, setCatLoading] = useState(true);

    const navLinkCls =
        "relative flex items-center gap-1 py-4 text-[11px] font-bold tracking-[0.2em] text-gray-800 uppercase transition-all " +
        "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gold after:transition-all after:duration-300 " +
        "group-hover:after:w-full hover:text-gold dark:text-gray-200";

    useEffect(() => {
        setHasMounted(true);
        categoryService.getAll().then((data) => {
            setCategories(data.filter((c) => c.isActive && !c.parentId));
            setCatLoading(false);
        });
    }, []);

    if (!hasMounted) {
        return <nav className="flex h-[100px] items-center gap-6" />;
    }

    return (
        <nav className="flex h-[100px] items-center gap-8">
            {/* ── High Jewelry — Full Mega ── */}
            <div className="group flex h-full items-center">
                <Link href="/collections" className={navLinkCls}>
                    <span className="flex items-center gap-1">
                        High Jewelry
                        <ChevronDown size={12} className="mt-0.5 transition-transform duration-300 group-hover:rotate-180" />
                    </span>
                </Link>
                <HighJewelryMenu categories={categories} loading={catLoading} />
            </div>

            {/* ── Wedding ── */}
            <div className="group relative flex h-full items-center">
                <Link href="/collections/all?q=wedding" className={navLinkCls}>
                    <span className="flex items-center gap-1">
                        Wedding
                        <ChevronDown size={12} className="mt-0.5 transition-transform duration-300 group-hover:rotate-180" />
                    </span>
                </Link>
                <WeddingMenu />
            </div>

            {/* ── Collections ── */}
            <div className="group relative flex h-full items-center">
                <Link href="/collections" className={navLinkCls}>
                    <span className="flex items-center gap-1">
                        Collections
                        <ChevronDown size={12} className="mt-0.5 transition-transform duration-300 group-hover:rotate-180" />
                    </span>
                </Link>
                <CollectionsMenu categories={categories} loading={catLoading} />
            </div>

            {/* ── Services ── */}
            <div className="group relative flex h-full items-center">
                <Link href="/contact" className={navLinkCls}>
                    <span className="flex items-center gap-1">
                        Services
                        <ChevronDown size={12} className="mt-0.5 transition-transform duration-300 group-hover:rotate-180" />
                    </span>
                </Link>
                <ServicesMenu />
            </div>

            {/* ── About ── */}
            <div className="group relative flex h-full items-center">
                <Link href="/about" className={navLinkCls}>
                    <span className="flex items-center gap-1">
                        About
                        <ChevronDown size={12} className="mt-0.5 transition-transform duration-300 group-hover:rotate-180" />
                    </span>
                </Link>
                <AboutMenu />
            </div>
        </nav>
    );
}
