"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import FilterDropdown from "./FilterDropdown";
import { RefItem } from "@/services/catalog.service";

interface CollectionSidebarProps {
    brands: RefItem[];
    selectedBrand: string;
    onBrandChange: (brand: string) => void;
    sortBy: string;
    onSortChange: (sort: string) => void;
    minPrice: string;
    onMinPriceChange: (val: string) => void;
    maxPrice: string;
    onMaxPriceChange: (val: string) => void;
    isReadyOnly: boolean;
    onReadyOnlyChange: (val: boolean) => void;
    onReset: () => void;
}

const CollectionSidebar: React.FC<CollectionSidebarProps> = ({
    brands,
    selectedBrand,
    onBrandChange,
    sortBy,
    onSortChange,
    minPrice,
    onMinPriceChange,
    maxPrice,
    onMaxPriceChange,
    isReadyOnly,
    onReadyOnlyChange,
    onReset,
}) => {
    return (
        <aside className="hidden w-64 shrink-0 space-y-12 lg:block">
            <FilterDropdown
                label="Brand"
                options={["All", ...brands.map((b) => b.name)]}
                value={selectedBrand}
                onChange={onBrandChange}
            />
            <FilterDropdown
                label="Sort By"
                options={["Price: Low to High", "Price: High to Low", "New Arrivals"]}
                value={sortBy}
                onChange={onSortChange}
            />

            {/* Price Range */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                    Price Range (VND)
                </h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => onMinPriceChange(e.target.value)}
                        className="focus:border-gold h-10 w-full rounded-sm border border-transparent bg-gray-50 px-4 text-[11px] font-bold text-gray-900 transition-colors outline-none dark:bg-white/5 dark:text-white"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => onMaxPriceChange(e.target.value)}
                        className="focus:border-gold h-10 w-full rounded-sm border border-transparent bg-gray-50 px-4 text-[11px] font-bold text-gray-900 transition-colors outline-none dark:bg-white/5 dark:text-white"
                    />
                </div>
            </div>

            {/* Reset & Availability */}
            <div className="space-y-4 pt-8">
                <button
                    onClick={() => onReadyOnlyChange(!isReadyOnly)}
                    className={`flex w-full items-center justify-between rounded-xl px-5 py-4 text-[10px] font-bold tracking-widest uppercase transition-all ${isReadyOnly ? "bg-gold shadow-gold/20 text-white shadow-xl" : "bg-gray-50 text-gray-400 dark:bg-white/5"}`}
                >
                    In Stock
                    <span className={`h-2 w-2 rounded-full ${isReadyOnly ? "bg-white" : "bg-gray-300"}`} />
                </button>
                <button
                    onClick={onReset}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-100 py-4 text-[10px] font-bold tracking-widest text-gray-400 uppercase transition-all hover:bg-gray-50 hover:text-gray-900 dark:border-white/5 dark:hover:bg-white/5"
                >
                    <RotateCcw size={14} /> Reset Filters
                </button>
            </div>
        </aside>
    );
};

export default CollectionSidebar;
