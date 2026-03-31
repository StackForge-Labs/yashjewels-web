"use client";

import React, { useState, useMemo } from "react";
import { ChevronRight, Search, RotateCcw, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import ProductCard from "../(home)/_components/ProductCard";
import FilterDropdown from "./_components/FilterDropdown";
import MobileFilterDrawer from "./_components/MobileFilterDrawer";
import Pagination from "./_components/Pagination";

// Mock Data targeting high-fidelity imagery and doc requirements
const MOCK_PRODUCTS = [
    {
        sku: "NNU1544",
        name: "Mia Natural Diamond Ring in 18K White Gold",
        category: "Engagement Rings",
        original: "$3,450",
        sale: "$2,850",
        discount: "18%",
        image1: "https://tamluxury.vn/wp-content/uploads/2025/12/Nhan-nu-kim-cuong-thien-nhien-Mia-Ma-SP-NNU1544-scaled.jpg",
        image2: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=600",
        badge: "New",
        brand: "Asmi",
        metal: "White Gold",
        carat: "18K",
        stone: "Diamond",
        readyToShip: true,
    },
    ...Array(11)
        .fill(null)
        .map((_, i) => ({
            sku: i % 2 === 0 ? "NNU1544-X" : `RIFYJ-${i + 2400}`,
            name: i % 2 === 0 ? "Mia Natural Diamond Ring" : `Maison Masterpiece Collection ${i + 5}`,
            category: i % 2 === 0 ? "Engagement Rings" : "Jewellery",
            original: "$4,500",
            sale: "$3,600",
            discount: "20%",
            image1:
                i % 2 === 0
                    ? "https://tamluxury.vn/wp-content/uploads/2025/12/Nhan-nu-kim-cuong-thien-nhien-Mia-Ma-SP-NNU1544-scaled.jpg"
                    : "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=600",
            image2: "https://images.pexels.com/photos/1733604/pexels-photo-1733604.jpeg?auto=compress&cs=tinysrgb&w=600",
            brand: i % 3 === 0 ? "Asmi" : "Nakshatra",
            metal: i % 2 === 0 ? "White Gold" : "Rose Gold",
            carat: "18K",
            stone: i % 2 === 0 ? "Diamond" : "Stone",
            readyToShip: i % 2 === 0,
        })),
];

const METALS = [
    { name: "White Gold", color: "#E5E7EB" },
    { name: "Yellow Gold", color: "#FDE68A" },
    { name: "Rose Gold", color: "#FECACA" },
    { name: "Platinum", color: "#CBD5E1" },
];

const CollectionsPage = () => {
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

    // Derived filtered list
    const filteredProducts = useMemo(() => {
        let result = MOCK_PRODUCTS.filter((p) => {
            const matchesSearch =
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.sku.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesBrand = selectedBrand === "All" || p.brand === selectedBrand;
            const matchesCarat = selectedCarat === "All" || p.carat === selectedCarat;
            const matchesMetal = selectedMetal === "All" || p.metal === selectedMetal;
            const matchesType = selectedType === "All" || p.category === selectedType;
            const matchesReady = !isReadyOnly || p.readyToShip;

            const price = Number(p.sale.replace(/[^0-9.-]+/g, ""));
            const min = minPrice ? Number(minPrice) : 0;
            const max = maxPrice ? Number(maxPrice) : Infinity;
            const matchesPrice = price >= min && price <= max;

            return matchesSearch && matchesBrand && matchesCarat && matchesMetal && matchesType && matchesReady && matchesPrice;
        });

        if (sortBy === "Price: Low to High") {
            result.sort((a, b) => Number(a.sale.replace(/[^0-9.-]+/g, "")) - Number(b.sale.replace(/[^0-9.-]+/g, "")));
        } else if (sortBy === "Price: High to Low") {
            result.sort((a, b) => Number(b.sale.replace(/[^0-9.-]+/g, "")) - Number(a.sale.replace(/[^0-9.-]+/g, "")));
        }

        return result;
    }, [searchQuery, selectedBrand, selectedCarat, selectedMetal, selectedType, isReadyOnly, minPrice, maxPrice, sortBy]);

    return (
        <main className="bg-white pt-28 pb-32 transition-colors dark:bg-[#050505]">
            <div className="container mx-auto px-4 lg:px-12">

                {/* Header Section */}
                <div className="mb-16 flex flex-col items-center text-center">
                    <nav className="mb-6 flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
                        <ChevronRight size={10} />
                        <span className="text-gray-900 dark:text-white">Fine Collections</span>
                    </nav>
                    <h1 className="mb-6 font-serif text-5xl text-gray-900 lg:text-7xl dark:text-white">
                        The <span className="text-gold font-light italic">Art</span> of Brilliance
                    </h1>
                    <p className="max-w-2xl text-[14px] leading-relaxed text-gray-400 dark:text-gray-500">
                        Explore our heritage of handcrafted excellence. From solitaire engagement rings to
                        high-jewelry masterpieces, each piece is a celebration of eternal elegance.
                    </p>
                </div>

                {/* Search & Layout Toggle */}
                <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-gray-50 pb-10 dark:border-white/5">
                    <div className="relative w-full max-w-xl">
                        <Search className="absolute top-1/2 left-0 -translate-y-1/2 text-gray-300" size={18} />
                        <input
                            type="text"
                            placeholder="Find your masterpiece..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border-b border-gray-100 bg-transparent py-3 pr-6 pl-8 text-sm font-medium tracking-wide text-gray-900 transition-all outline-none focus:border-gold dark:border-white/5 dark:text-white"
                        />
                    </div>
                    <div className="flex items-center gap-6 self-end">
                        <div className="flex items-center gap-2 border-r border-gray-100 pr-6 dark:border-white/5">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-1.5 transition-colors ${viewMode === "grid" ? "text-gold" : "text-gray-300"}`}
                            >
                                <LayoutGrid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-1.5 transition-colors ${viewMode === "list" ? "text-gold" : "text-gray-300"}`}
                            >
                                <List size={20} />
                            </button>
                        </div>
                        <button
                            onClick={() => setMobileFiltersOpen(true)}
                            className="flex items-center gap-3 rounded-full border border-gray-100 px-6 py-2.5 text-[10px] font-bold tracking-[0.2em] text-gray-900 uppercase transition-all hover:bg-gray-50 lg:hidden dark:border-white/5 dark:text-white dark:hover:bg-white/5"
                        >
                            <SlidersHorizontal size={14} /> Filter
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">

                    {/* Desktop Sidebar Filters */}
                    <aside className="hidden w-64 shrink-0 lg:block space-y-12">
                        {/* Metal Filter */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Metal Tone</h3>
                            <div className="flex gap-3">
                                {METALS.map((m) => (
                                    <button
                                        key={m.name}
                                        title={m.name}
                                        onClick={() => setSelectedMetal(selectedMetal === m.name ? "All" : m.name)}
                                        style={{ backgroundColor: m.color }}
                                        className={`h-8 w-8 rounded-full border transition-all hover:scale-110 ${
                                            selectedMetal === m.name ? "ring-gold ring-2 ring-offset-4 scale-110" : "border-gray-200 dark:border-white/10"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Modularized Dropdowns */}
                        <FilterDropdown label="Brand" options={["Asmi", "D'damas", "Nakshatra"]} value={selectedBrand} onChange={setSelectedBrand} />
                        <FilterDropdown label="Carat" options={["18K", "22K", "24K"]} value={selectedCarat} onChange={setSelectedCarat} />
                        <FilterDropdown label="Category" options={["Engagement Rings", "Wedding Bands", "Jewellery"]} value={selectedType} onChange={setSelectedType} />
                        <FilterDropdown label="Sort By" options={["Price: Low to High", "Price: High to Low", "New Arrivals"]} value={sortBy} onChange={setSortBy} />

                        {/* Price Range */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Price Range ($)</h3>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    placeholder="Min" 
                                    value={minPrice} 
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full h-10 bg-gray-50 border border-transparent focus:border-gold outline-none px-4 text-[11px] font-bold text-gray-900 rounded-sm transition-colors dark:bg-white/5 dark:text-white"
                                />
                                <span className="text-gray-400">-</span>
                                <input 
                                    type="number" 
                                    placeholder="Max" 
                                    value={maxPrice} 
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full h-10 bg-gray-50 border border-transparent focus:border-gold outline-none px-4 text-[11px] font-bold text-gray-900 rounded-sm transition-colors dark:bg-white/5 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Reset & Availability */}
                        <div className="pt-8 space-y-4">
                            <button
                                onClick={() => setIsReadyOnly(!isReadyOnly)}
                                className={`flex w-full items-center justify-between rounded-xl px-5 py-4 text-[10px] font-bold tracking-widest uppercase transition-all ${
                                    isReadyOnly ? "bg-gold text-white shadow-xl shadow-gold/20" : "bg-gray-50 text-gray-400 dark:bg-white/5"
                                }`}
                            >
                                Ready to Ship
                                <span className={`h-2 w-2 rounded-full ${isReadyOnly ? "bg-white" : "bg-gray-300"}`} />
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedBrand("All"); setSelectedCarat("All");
                                    setSelectedMetal("All"); setSelectedType("All");
                                    setIsReadyOnly(false); setSearchQuery("");
                                    setMinPrice(""); setMaxPrice(""); setSortBy("New Arrivals");
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
                            Presenting <span className="text-gray-900 dark:text-white">{filteredProducts.length}</span> Exquisite Pieces
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className={`grid gap-x-8 gap-y-16 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.sku} {...product} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-40 text-center">
                                <Search size={64} className="mb-8 text-gray-100 dark:text-white/5" />
                                <h3 className="mb-3 font-serif text-3xl text-gray-900 dark:text-white">No Pieces Found</h3>
                                <p className="text-sm text-gray-400">Try adjusting your filters to find your masterpiece.</p>
                            </div>
                        )}

                        <Pagination currentPage={1} totalPages={12} onPageChange={() => {}} />
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
                <div className="space-y-12 pb-10">
                    {/* Replicated and Enhanced Filters for Mobile */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Metal Tone</h3>
                        <div className="flex gap-4">
                            {METALS.map((m) => (
                                <button
                                    key={m.name}
                                    onClick={() => setSelectedMetal(selectedMetal === m.name ? "All" : m.name)}
                                    style={{ backgroundColor: m.color }}
                                    className={`h-10 w-10 rounded-full border transition-all ${
                                        selectedMetal === m.name ? "ring-gold ring-2 ring-offset-4 scale-110" : "border-gray-100 dark:border-white/10"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Price Range ($)</h3>
                        <div className="flex items-center gap-2">
                            <input 
                                type="number" 
                                placeholder="Min" 
                                value={minPrice} 
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full h-12 bg-gray-50 border border-transparent focus:border-gold outline-none px-4 text-[11px] font-bold text-gray-900 rounded-sm transition-colors dark:bg-white/5 dark:text-white"
                            />
                            <span className="text-gray-400">-</span>
                            <input 
                                type="number" 
                                placeholder="Max" 
                                value={maxPrice} 
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full h-12 bg-gray-50 border border-transparent focus:border-gold outline-none px-4 text-[11px] font-bold text-gray-900 rounded-sm transition-colors dark:bg-white/5 dark:text-white"
                            />
                        </div>
                    </div>

                    {[
                        { label: "Sort By", value: sortBy, setter: setSortBy, options: ["Price: Low to High", "Price: High to Low", "New Arrivals"] },
                        { label: "Brand", value: selectedBrand, setter: setSelectedBrand, options: ["Asmi", "D'damas", "Nakshatra"] },
                        { label: "Carat", value: selectedCarat, setter: setSelectedCarat, options: ["18K", "22K"] },
                        { label: "Category", value: selectedType, setter: setSelectedType, options: ["Engagement Rings", "Jewellery"] }
                    ].map((f) => (
                        <div key={f.label} className="space-y-4">
                            <h3 className="text-[9px] font-bold tracking-[0.3em] text-gray-400/80 uppercase">{f.label}</h3>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => f.setter("All")}
                                    className={`py-3 text-[9px] font-bold tracking-widest uppercase transition-all rounded-sm ${
                                        f.value === "All" ? "bg-gold text-white shadow-lg shadow-gold/20" : "bg-gray-50 text-gray-400 dark:bg-white/5"
                                    }`}
                                >
                                    All
                                </button>
                                {f.options.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => f.setter(opt)}
                                        className={`py-3 text-[9px] font-bold tracking-widest uppercase transition-all rounded-sm ${
                                            f.value === opt ? "bg-gold text-white shadow-lg shadow-gold/20" : "bg-gray-50 text-gray-400 dark:bg-white/5"
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </MobileFilterDrawer>
        </main>
    );
};

export default CollectionsPage;
