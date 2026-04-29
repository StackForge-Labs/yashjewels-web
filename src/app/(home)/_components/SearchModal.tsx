"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
    Search,
    X,
    Gem,
    DollarSign,
    ArrowRight,
    Loader2,
    TrendingUp,
    Layers,
    Package,
    ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { specService } from "@/services/spec.service";
import { Product } from "@/types/product.types";
import { Category } from "@/types/category.types";

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatUsd = (val: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: val % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    }).format(val);

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

// ── Sub-components ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
    <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-3 dark:border-white/5">
        <div className="h-16 w-16 shrink-0 animate-pulse rounded-lg bg-gray-100 dark:bg-white/5" />
        <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100 dark:bg-white/5" />
            <div className="h-2.5 w-1/2 animate-pulse rounded bg-gray-100 dark:bg-white/5" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100 dark:bg-white/5" />
        </div>
    </div>
);

interface FilterChipProps {
    label: string;
    active: boolean;
    onClick: () => void;
}
const FilterChip = ({ label, active, onClick }: FilterChipProps) => (
    <button
        onClick={onClick}
        className={`rounded-full border px-4 py-2 text-[11px] font-bold tracking-widest uppercase transition-all duration-200 ${
            active
                ? "border-gold bg-gold/10 text-gold shadow-sm shadow-gold/20"
                : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gold/50 hover:text-gold dark:border-white/10 dark:bg-white/5 dark:text-gray-400"
        }`}
    >
        {label}
    </button>
);

// ── Main Component ────────────────────────────────────────────────────────────
export default function SearchModal() {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    // Open/mount state
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Search & filter state
    const [query, setQuery] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedGoldKarat, setSelectedGoldKarat] = useState<string | null>(null);

    // Catalog data
    const [categories, setCategories] = useState<Category[]>([]);
    const [goldKarats, setGoldKarats] = useState<{ id: string; caratLabel?: string; name?: string }[]>([]);

    // Search results
    const [results, setResults] = useState<Product[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const [catalogLoading, setCatalogLoading] = useState(false);

    const debouncedQuery = useDebounce(query, 400);

    // ── Initialization ────────────────────────────────────────────────────────
    useEffect(() => {
        requestAnimationFrame(() => setMounted(true));
    }, []);

    // Load catalog data when modal opens
    useEffect(() => {
        if (!isOpen) return;
        setCatalogLoading(true);
        Promise.all([
            categoryService.getAll(),
            specService.goldKarats.getAll(),
        ]).then(([cats, karats]) => {
            setCategories(cats.filter((c) => c.isActive));
            setGoldKarats(karats.data.filter((k) => k.isActive));
            setCatalogLoading(false);
        });

        // Auto-focus search input
        setTimeout(() => inputRef.current?.focus(), 150);
    }, [isOpen]);

    // ── Live search ───────────────────────────────────────────────────────────
    const runSearch = useCallback(async () => {
        const hasFilters = selectedCategory || selectedGoldKarat || minPrice || maxPrice;
        if (!debouncedQuery && !hasFilters) {
            setResults([]);
            setTotalCount(0);
            return;
        }

        setIsSearching(true);
        const res = await productService.getAll({
            searchQuery: debouncedQuery || undefined,
            categoryId: selectedCategory || undefined,
            goldKaratId: selectedGoldKarat || undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            pageSize: 6,
            page: 1,
        });
        setIsSearching(false);

        if (res) {
            setResults(res.data);
            setTotalCount(res.totalCount);
        }
    }, [debouncedQuery, selectedCategory, selectedGoldKarat, minPrice, maxPrice]);

    useEffect(() => {
        runSearch();
    }, [runSearch]);

    // ── Keyboard + scroll lock ────────────────────────────────────────────────
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        };
        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        } else {
            document.body.style.overflow = "";
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const closeModal = () => {
        setIsOpen(false);
    };

    const resetFilters = () => {
        setQuery("");
        setMinPrice("");
        setMaxPrice("");
        setSelectedCategory(null);
        setSelectedGoldKarat(null);
        setResults([]);
        setTotalCount(0);
    };

    const handleViewAll = () => {
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (selectedGoldKarat) params.set("goldKaratId", selectedGoldKarat);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);

        // If a category is selected, navigate to its slug page; otherwise go to /all
        const targetCat = categories.find((c) => c.id === selectedCategory);
        const basePath = targetCat ? `/collections/${targetCat.slug}` : `/collections/all`;
        router.push(`${basePath}${params.toString() ? `?${params.toString()}` : ""}`);
        closeModal();
    };

    const handleProductClick = (product: Product) => {
        router.push(`/products/${product.slug}`);
        closeModal();
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) closeModal();
    };

    const getPrimaryImage = (product: Product) =>
        product.images?.find((img) => img.isPrimary)?.imageUrl ??
        product.images?.[0]?.imageUrl ??
        null;

    const hasActiveFilters = !!(query || selectedCategory || selectedGoldKarat || minPrice || maxPrice);

    // ── Trending/popular fallback (shown when no query) ───────────────────────
    const trendingSearches = ["Engagement Ring", "Diamond Necklace", "Gold Bracelet", "Solitaire", "Wedding Band"];

    // ── Modal UI ──────────────────────────────────────────────────────────────
    const modalContent = (
        <div
            onClick={handleBackdropClick}
            className={`fixed inset-0 z-[200] flex flex-col overflow-y-auto bg-black/70 backdrop-blur-md transition-all duration-500 ${
                isOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
            }`}
        >
            <div
                className={`relative mx-auto mt-10 mb-10 w-full max-w-5xl px-4 transition-all duration-500 ${
                    isOpen ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
                }`}
            >
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white shadow-[0_40px_100px_rgba(0,0,0,0.4)] dark:border-white/5 dark:bg-[#0a0a0a]">
                    {/* ── Header ── */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-8 pt-8 pb-6 dark:border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="text-gold">
                                <Search size={22} strokeWidth={1.5} />
                            </div>
                            <h2 className="font-serif text-xl text-gray-900 dark:text-white">Discover Jewelry</h2>
                        </div>
                        <button
                            onClick={closeModal}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-all hover:rotate-90 hover:bg-red-50 hover:text-red-500 dark:bg-white/5 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="p-8">
                        {/* ── Search Input ── */}
                        <div className="relative mb-8">
                            <Search
                                size={22}
                                className="text-gold absolute top-1/2 left-5 -translate-y-1/2"
                                strokeWidth={1.5}
                            />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search diamonds, rings, necklaces..."
                                className="focus:border-gold w-full rounded-2xl border-2 border-gray-100 bg-gray-50 py-5 pr-16 pl-14 font-serif text-xl text-gray-900 transition-all placeholder:text-gray-300 focus:bg-white focus:outline-none dark:border-white/5 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 dark:focus:bg-white/8"
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery("")}
                                    className="absolute top-1/2 right-5 -translate-y-1/2 rounded-full p-1 text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* ── Filters Row ── */}
                        <div className="mb-8 space-y-4">
                            {/* Categories */}
                            <div>
                                <div className="mb-3 flex items-center gap-2">
                                    <Layers size={13} className="text-gray-400" />
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Category</span>
                                </div>
                                {catalogLoading ? (
                                    <div className="flex gap-2">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-gray-100 dark:bg-white/5" />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {categories.slice(0, 8).map((cat) => (
                                            <FilterChip
                                                key={cat.id}
                                                label={cat.name}
                                                active={selectedCategory === cat.id}
                                                onClick={() =>
                                                    setSelectedCategory(
                                                        selectedCategory === cat.id ? null : cat.id
                                                    )
                                                }
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Gold Karats + Price Range */}
                            <div className="grid grid-cols-1 gap-6 border-t border-gray-100 pt-4 md:grid-cols-2 dark:border-white/5">
                                {/* Gold Karats */}
                                <div>
                                    <div className="mb-3 flex items-center gap-2">
                                        <Gem size={13} className="text-gray-400" />
                                        <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Gold Karat</span>
                                    </div>
                                    {catalogLoading ? (
                                        <div className="flex gap-2">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-gray-100 dark:bg-white/5" />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {goldKarats.map((k) => (
                                                <FilterChip
                                                    key={k.id}
                                                    label={k.caratLabel ?? k.name ?? k.id}
                                                    active={selectedGoldKarat === k.id}
                                                    onClick={() =>
                                                        setSelectedGoldKarat(
                                                            selectedGoldKarat === k.id ? null : k.id
                                                        )
                                                    }
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Price Range */}
                                <div>
                                    <div className="mb-3 flex items-center gap-2">
                                        <DollarSign size={13} className="text-gray-400" />
                                        <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Price Range (USD)</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex-1">
                                            <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-bold text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(e.target.value)}
                                                placeholder="Min"
                                                className="focus:border-gold w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-3 pl-8 text-sm font-bold text-gray-900 outline-none transition-all focus:ring-1 focus:ring-gold/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-gray-300">—</span>
                                        <div className="relative flex-1">
                                            <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-bold text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value)}
                                                placeholder="Max"
                                                className="focus:border-gold w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-3 pl-8 text-sm font-bold text-gray-900 outline-none transition-all focus:ring-1 focus:ring-gold/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Results Area ── */}
                        {!hasActiveFilters ? (
                            /* Trending Searches (no query, no filters) */
                            <div className="border-t border-gray-100 pt-6 dark:border-white/5">
                                <div className="mb-4 flex items-center gap-2">
                                    <TrendingUp size={14} className="text-gold" />
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Trending Searches</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {trendingSearches.map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => setQuery(term)}
                                            className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-600 transition-all hover:border-gold/50 hover:text-gold dark:border-white/10 dark:bg-white/5 dark:text-gray-400"
                                        >
                                            <Search size={11} className="opacity-50" />
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Search Results */
                            <div className="border-t border-gray-100 pt-6 dark:border-white/5">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Package size={14} className="text-gold" />
                                        <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                                            {isSearching
                                                ? "Searching..."
                                                : totalCount > 0
                                                ? `${totalCount.toLocaleString()} Result${totalCount !== 1 ? "s" : ""} Found`
                                                : "No results"}
                                        </span>
                                    </div>
                                    {isSearching && (
                                        <Loader2 size={15} className="text-gold animate-spin" />
                                    )}
                                </div>

                                {isSearching ? (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {[...Array(6)].map((_, i) => (
                                            <SkeletonCard key={i} />
                                        ))}
                                    </div>
                                ) : results.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {results.map((product) => {
                                            const img = getPrimaryImage(product);
                                            return (
                                                <button
                                                    key={product.id}
                                                    onClick={() => handleProductClick(product)}
                                                    className="group flex items-center gap-4 rounded-xl border border-gray-100 p-3 text-left transition-all duration-200 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 dark:border-white/5 dark:hover:border-gold/20"
                                                >
                                                    {/* Product Image */}
                                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-50 dark:bg-white/5">
                                                        {img ? (
                                                            <img
                                                                src={img}
                                                                alt={product.name}
                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <Gem size={20} className="text-gray-300" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-[11px] font-bold text-gray-900 transition-colors group-hover:text-gold dark:text-white">
                                                            {product.name}
                                                        </p>
                                                        <p className="mt-0.5 truncate text-[10px] text-gray-400">
                                                            {[product.categoryName, product.goldKaratName]
                                                                .filter(Boolean)
                                                                .join(" · ")}
                                                        </p>
                                                        <p className="text-gold mt-1.5 text-[11px] font-bold">
                                                            {formatUsd(product.estimatedFinalPrice)}
                                                        </p>
                                                    </div>

                                                    <ChevronRight
                                                        size={14}
                                                        className="-translate-x-2 text-gray-300 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-gold group-hover:opacity-100"
                                                    />
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    /* Empty State */
                                    <div className="flex flex-col items-center py-10 text-center">
                                        <div className="text-gold mb-4 opacity-30">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 2L2 9L12 22L22 9L12 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                                <path d="M2 9H22" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                                <path d="M12 22V9" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <p className="font-serif text-lg text-gray-900 dark:text-white">No pieces found</p>
                                        <p className="mt-1 text-sm text-gray-400">Try adjusting your search or filters</p>
                                        <button
                                            onClick={resetFilters}
                                            className="mt-4 text-xs font-bold tracking-widest text-gold underline-offset-4 hover:underline uppercase"
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Footer ── */}
                    <div className="flex items-center justify-between border-t border-gray-100 px-8 py-5 dark:border-white/5">
                        <button
                            onClick={resetFilters}
                            disabled={!hasActiveFilters}
                            className="text-[11px] font-bold tracking-widest text-gray-400 uppercase transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            Reset All
                        </button>

                        <div className="flex items-center gap-3">
                            <span className="text-[11px] text-gray-400">
                                {hasActiveFilters && !isSearching && (
                                    <>{totalCount > 0 ? `${totalCount} pieces available` : "No results"}</>
                                )}
                            </span>
                            <button
                                onClick={handleViewAll}
                                disabled={hasActiveFilters && totalCount === 0}
                                className="group flex items-center gap-2.5 bg-gray-900 px-8 py-3.5 text-[11px] font-bold tracking-[0.2em] text-white uppercase transition-all duration-300 hover:bg-gold hover:shadow-xl hover:shadow-gold/20 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-gold dark:hover:text-white"
                            >
                                {hasActiveFilters && totalCount > 0
                                    ? `View ${totalCount > 99 ? "99+" : totalCount} Results`
                                    : "Browse All Jewelry"}
                                <ArrowRight
                                    size={14}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="hover:text-gold transform transition-all duration-300 hover:scale-110"
                aria-label="Open Search"
            >
                <Search size={22} strokeWidth={1.5} />
            </button>
            {mounted && createPortal(modalContent, document.body)}
        </>
    );
}
