"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ChevronRight, Search, RotateCcw, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProductCard from "../../(home)/_components/ProductCard";
import FilterDropdown from "../_components/FilterDropdown";
import MobileFilterDrawer from "../_components/MobileFilterDrawer";
import Pagination from "../_components/Pagination";

import { productService } from "@/services/product.service";
import { catalogService, RefItem } from "@/services/catalog.service";
import { categoryService } from "@/services/category.service";
import { Product } from "@/types/product.types";
import { Category } from "@/types/category.types";

const METALS = [
    { name: "White Gold", color: "#E5E7EB" },
    { name: "Yellow Gold", color: "#FDE68A" },
    { name: "Rose Gold", color: "#FECACA" },
    { name: "Platinum", color: "#CBD5E1" },
];

const CollectionsPage = () => {
    const params = useParams();
    const slug = params.slug as string;

    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

    // Filters
    const [brands, setBrands] = useState<RefItem[]>([]);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("All");
    const [selectedCarat, setSelectedCarat] = useState("All");
    const [selectedMetal, setSelectedMetal] = useState("All");
    const [selectedType, setSelectedType] = useState("All");
    const [isReadyOnly, setIsReadyOnly] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("New Arrivals");

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [allCats, allProds, allBrands] = await Promise.all([
                categoryService.getAll(),
                productService.getAll(),
                catalogService.getBrands(),
            ]);

            const cat = allCats.find((c) => c.slug === slug);
            if (cat) {
                setCurrentCategory(cat);
                setProducts(allProds.filter((p) => p.categoryId === cat.id && p.status === "ACTIVE"));
            } else if (slug === "all") {
                setCurrentCategory({
                    id: "all",
                    name: "All Collections",
                    slug: "all",
                    sortOrder: 0,
                    isActive: true,
                    createdAt: "",
                });
                setProducts(allProds.filter((p) => p.status === "ACTIVE"));
            }
            setBrands(allBrands);
            setLoading(false);
        };
        loadData();
    }, [slug]);

    // Derived filtered list
    const filteredProducts = useMemo(() => {
        let result = products.filter((p) => {
            const matchesSearch =
                p.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.styleCode?.toLowerCase().includes(searchQuery.toLowerCase());

            const brandObj = brands.find((b) => b.id === p.brandId);
            const brandName = brandObj ? brandObj.name : "Unknown";
            const matchesBrand = selectedBrand === "All" || brandName === selectedBrand;

            const matchesReady = !isReadyOnly || p.stockQuantity > 0;

            const price = Number(p.basePrice) + Number(p.makingCharge);
            const min = minPrice ? Number(minPrice) : 0;
            const max = maxPrice ? Number(maxPrice) : Infinity;
            const matchesPrice = price >= min && price <= max;

            return matchesSearch && matchesBrand && matchesReady && matchesPrice;
        });

        if (sortBy === "Price: Low to High") {
            result.sort(
                (a, b) => Number(a.basePrice) + Number(a.makingCharge) - (Number(b.basePrice) + Number(b.makingCharge)),
            );
        } else if (sortBy === "Price: High to Low") {
            result.sort(
                (a, b) => Number(b.basePrice) + Number(b.makingCharge) - (Number(a.basePrice) + Number(a.makingCharge)),
            );
        }

        // Map to ui structure required by ProductCard
        return result.map((p) => ({
            sku: p.styleCode,
            name: p.productName,
            category: currentCategory?.name || "Jewelry",
            original: (Number(p.basePrice) + Number(p.makingCharge)).toLocaleString() + " VND",
            sale:
                p.discountPct && p.discountPct > 0
                    ? ((Number(p.basePrice) + Number(p.makingCharge)) * (1 - p.discountPct / 100)).toLocaleString() +
                      " VND"
                    : (Number(p.basePrice) + Number(p.makingCharge)).toLocaleString() + " VND",
            discount: p.discountPct && p.discountPct > 0 ? `${p.discountPct}%` : undefined,
            // Fallbacks for images as db structure for images not loaded yet on list
            image1: "https://tamluxury.vn/wp-content/uploads/2025/12/Nhan-nu-kim-cuong-thien-nhien-Mia-Ma-SP-NNU1544-scaled.jpg",
            image2: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=600",
            badge: "New",
            brand: brands.find((b) => b.id === p.brandId)?.name || "Yash",
            metal: "Gold",
            carat: "18K",
            stone: "Diamond",
            readyToShip: p.stockQuantity > 0,
            slug: p.slug,
        }));
    }, [products, brands, currentCategory, searchQuery, selectedBrand, isReadyOnly, minPrice, maxPrice, sortBy]);

    if (loading) return <div className="py-32 text-center dark:text-gray-400">Loading collection...</div>;
    if (!currentCategory) return <div className="py-32 text-center dark:text-gray-400">Collection not found</div>;

    return (
        <main className="bg-white pt-10 pb-32 transition-colors dark:bg-[#050505]">
            <div className="container mx-auto px-4 lg:px-12">
                {/* Header Section */}
                <div className="mb-16 flex flex-col items-center text-center">
                    <nav className="mb-6 flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                        <Link href="/" className="hover:text-gold transition-colors">
                            Home
                        </Link>
                        <ChevronRight size={10} />
                        <Link href="/collections" className="hover:text-gold transition-colors">
                            Collections
                        </Link>
                        <ChevronRight size={10} />
                        <span className="text-gray-900 dark:text-white">{currentCategory.name}</span>
                    </nav>
                    <h1 className="mb-6 font-serif text-5xl text-gray-900 lg:text-7xl dark:text-white">
                        {currentCategory.name}
                    </h1>
                </div>

                {/* Search & Layout Toggle */}
                <div className="mb-10 flex flex-col gap-6 border-b border-gray-50 pb-10 lg:flex-row lg:items-center lg:justify-between dark:border-white/5">
                    <div className="relative w-full max-w-xl">
                        <Search className="absolute top-1/2 left-0 -translate-y-1/2 text-gray-300" size={18} />
                        <input
                            type="text"
                            placeholder="Find your masterpiece..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="focus:border-gold w-full border-b border-gray-100 bg-transparent py-3 pr-6 pl-8 text-sm font-medium tracking-wide text-gray-900 transition-all outline-none dark:border-white/5 dark:text-white"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
                    {/* Desktop Sidebar Filters */}
                    <aside className="hidden w-64 shrink-0 space-y-12 lg:block">
                        <FilterDropdown
                            label="Brand"
                            options={["All", ...brands.map((b) => b.name)]}
                            value={selectedBrand}
                            onChange={setSelectedBrand}
                        />
                        <FilterDropdown
                            label="Sort By"
                            options={["Price: Low to High", "Price: High to Low", "New Arrivals"]}
                            value={sortBy}
                            onChange={setSortBy}
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
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="focus:border-gold h-10 w-full rounded-sm border border-transparent bg-gray-50 px-4 text-[11px] font-bold text-gray-900 transition-colors outline-none dark:bg-white/5 dark:text-white"
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="focus:border-gold h-10 w-full rounded-sm border border-transparent bg-gray-50 px-4 text-[11px] font-bold text-gray-900 transition-colors outline-none dark:bg-white/5 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Reset & Availability */}
                        <div className="space-y-4 pt-8">
                            <button
                                onClick={() => setIsReadyOnly(!isReadyOnly)}
                                className={`flex w-full items-center justify-between rounded-xl px-5 py-4 text-[10px] font-bold tracking-widest uppercase transition-all ${isReadyOnly ? "bg-gold shadow-gold/20 text-white shadow-xl" : "bg-gray-50 text-gray-400 dark:bg-white/5"}`}
                            >
                                In Stock
                                <span className={`h-2 w-2 rounded-full ${isReadyOnly ? "bg-white" : "bg-gray-300"}`} />
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedBrand("All");
                                    setIsReadyOnly(false);
                                    setSearchQuery("");
                                    setMinPrice("");
                                    setMaxPrice("");
                                    setSortBy("New Arrivals");
                                }}
                                className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-100 py-4 text-[10px] font-bold tracking-widest text-gray-400 uppercase transition-all hover:bg-gray-50 hover:text-gray-900 dark:border-white/5 dark:hover:bg-white/5"
                            >
                                <RotateCcw size={14} /> Reset Filters
                            </button>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-grow">
                        <div className="mb-10 text-[9px] font-bold tracking-[0.3em] text-gray-300 uppercase dark:text-gray-500">
                            Presenting <span className="text-gray-900 dark:text-white">{filteredProducts.length}</span>{" "}
                            Exquisite Pieces
                        </div>
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
                                {filteredProducts.map((product) => (
                                    <Link key={product.sku} href={`/products/${product.slug}`} className="block">
                                        <ProductCard {...product} />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-40 text-center">
                                <Search size={64} className="mb-8 text-gray-100 dark:text-white/5" />
                                <h3 className="mb-3 font-serif text-3xl text-gray-900 dark:text-white">
                                    No Pieces Found
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Try adjusting your filters to find your masterpiece.
                                </p>
                            </div>
                        )}
                        {filteredProducts.length > 0 && (
                            <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
                        )}
                    </div>
                </div>
            </div>
            {/* Modularized Mobile Drawer */}
            <MobileFilterDrawer
                isOpen={mobileFiltersOpen}
                onClose={() => setMobileFiltersOpen(false)}
                resultsCount={filteredProducts.length}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            >
                {/* Same logic... */}
            </MobileFilterDrawer>
        </main>
    );
};

export default CollectionsPage;
