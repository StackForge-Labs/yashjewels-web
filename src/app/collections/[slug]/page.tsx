"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import ProductCard from "../../(home)/_components/ProductCard";
import MobileFilterDrawer from "../_components/MobileFilterDrawer";
import CollectionSidebar from "../_components/CollectionSidebar";
import Pagination from "../_components/Pagination";

import { productService } from "@/services/product.service";
import { catalogService, CatalogItem as RefItem } from "@/services/catalog.service";
import { categoryService } from "@/services/category.service";
import { Product } from "@/types/product.types";
import { Category } from "@/types/category.types";

const CollectionsPage = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params.slug as string;

    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    // Filters
    const [brands, setBrands] = useState<RefItem[]>([]);

    // Search & Filter State — initialized from URL searchParams (from SearchModal)
    const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") ?? "");
    const [selectedBrand, setSelectedBrand] = useState("All");
    const [selectedGoldKarat, _setSelectedGoldKarat] = useState(() => searchParams.get("goldKaratId") ?? "");
    const [isReadyOnly, setIsReadyOnly] = useState(false);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [minPrice, setMinPrice] = useState(() => searchParams.get("minPrice") ?? "");
    const [maxPrice, setMaxPrice] = useState(() => searchParams.get("maxPrice") ?? "");
    const [sortBy, setSortBy] = useState("New Arrivals");

    // Load category and brands once
    useEffect(() => {
        const loadInitialData = async () => {
            const [allCats, allBrands] = await Promise.all([
                categoryService.getAll(),
                catalogService.brands.getAll(),
            ]);

            const cat = allCats.find((c) => c.slug === slug);
            if (cat) {
                setCurrentCategory(cat);
            } else if (slug === "all") {
                setCurrentCategory({
                    id: "all",
                    name: "All Collections",
                    slug: "all",
                    sortOrder: 0,
                    isActive: true,
                    createdAt: "",
                });
            }
            setBrands(allBrands.data);
        };
        loadInitialData();
    }, [slug]);

    // Fetch products whenever filters or page change
    useEffect(() => {
        const fetchProducts = async () => {
            if (!currentCategory) return;
            setLoading(true);

            // Mapping Sort By UI to API values
            const sortMap: Record<string, string> = {
                "Price: Low to High": "price_asc",
                "Price: High to Low": "price_desc",
                "New Arrivals": "newest",
            };

            const brandId = selectedBrand === "All" ? undefined : brands.find(b => b.name === selectedBrand)?.id;

            const result = await productService.getAll({
                page: currentPage,
                pageSize: 12,
                categoryId: currentCategory.id === "all" ? undefined : currentCategory.id,
                brandId: brandId,
                searchQuery: searchQuery || undefined,
                sortBy: sortMap[sortBy],
                inStock: isReadyOnly || undefined,
                goldKaratId: selectedGoldKarat || undefined,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
            });

            if (result && result.success) {
                setProducts(result.data);
                setTotalCount(result.totalCount);
                setTotalPages(result.totalPages);
            } else {
                setProducts([]);
                setTotalCount(0);
                setTotalPages(1);
            }
            setLoading(false);
        };

        fetchProducts();
    }, [currentCategory, currentPage, selectedBrand, searchQuery, sortBy, isReadyOnly, brands, selectedGoldKarat, minPrice, maxPrice]);

    // Reset page to 1 on filter change
    const handleFilterChange = () => {
        setCurrentPage(1);
    };

    // Derived UI list for ProductCard
    const displayProducts = useMemo(() => {
        return products.map((p) => ({
            sku: p.styleCode,
            name: p.name,
            category: currentCategory?.name || "Jewelry",
            original: Number(p.estimatedFinalPrice * 1.2).toLocaleString() + " USD",
            sale: Number(p.estimatedFinalPrice).toLocaleString() + " USD",
            discount: "15%",
            image1: p.images?.find(i => i.isPrimary)?.imageUrl || p.images?.[0]?.imageUrl || "https://tamluxury.vn/wp-content/uploads/2025/12/Nhan-nu-kim-cuong-thien-nhien-Mia-Ma-SP-NNU1544-scaled.jpg",
            image2: p.images?.[1]?.imageUrl || p.images?.[0]?.imageUrl || "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=600",
            badge: "New",
            brand: brands.find((b) => b.id === p.brandId)?.name || "Yash Jewels",
            metal: "Gold",
            carat: "18K",
            stone: "Diamond",
            readyToShip: p.quantity > 0,
            slug: p.slug,
            productId: p.id,
            quantity: p.quantity,
            status: p.status,
        }));
    }, [products, brands, currentCategory]);

    if (!currentCategory) return <div className="py-32 text-center dark:text-gray-400">Loading collection...</div>;

    return (
        <main className="bg-white pt-10 pb-32 transition-colors dark:bg-[#050505]">
            <div className="container mx-auto px-4 lg:px-12">
                {/* Header Section */}
                <div className="mb-16 flex flex-col items-center text-center">
                    <nav className="mb-6 flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
                        <ChevronRight size={10} />
                        <Link href="/collections" className="hover:text-gold transition-colors">Collections</Link>
                        <ChevronRight size={10} />
                        <span className="text-gray-900 dark:text-white">{currentCategory.name}</span>
                    </nav>
                    <h1 className="mb-6 font-serif text-5xl text-gray-900 lg:text-7xl dark:text-white">
                        {currentCategory.name}
                    </h1>
                </div>

                {/* Filter & Content */}
                <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
                    {/* Desktop Sidebar */}
                    <CollectionSidebar
                        brands={brands}
                        selectedBrand={selectedBrand}
                        onBrandChange={(b) => { setSelectedBrand(b); handleFilterChange(); }}
                        sortBy={sortBy}
                        onSortChange={(s) => { setSortBy(s); handleFilterChange(); }}
                        minPrice={minPrice}
                        onMinPriceChange={setMinPrice} // Price filtering still partially client side or add to API
                        maxPrice={maxPrice}
                        onMaxPriceChange={setMaxPrice}
                        isReadyOnly={isReadyOnly}
                        onReadyOnlyChange={(v) => { setIsReadyOnly(v); handleFilterChange(); }}
                        onReset={() => {
                            setSelectedBrand("All");
                            setIsReadyOnly(false);
                            setSearchQuery("");
                            setSortBy("New Arrivals");
                            setCurrentPage(1);
                        }}
                    />

                    {/* Main Content Area */}
                    <div className="flex-grow">
                        {/* Search & Stats */}
                        <div className="mb-10 flex flex-col gap-4 border-b border-gray-50 pb-8 dark:border-white/5">
                            <div className="relative w-full max-w-xl">
                                <Search className="absolute top-1/2 left-0 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="text"
                                    placeholder="Find your masterpiece..."
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); handleFilterChange(); }}
                                    className="focus:border-gold w-full border-b border-gray-100 bg-transparent py-3 pr-6 pl-8 text-sm font-medium text-gray-900 transition-all outline-none dark:border-white/5 dark:text-white"
                                />
                            </div>
                            <div className="text-[9px] font-bold tracking-[0.3em] text-gray-300 uppercase dark:text-gray-500">
                                {loading ? "Finding gems..." : (
                                    <>Presenting <span className="text-gray-900 dark:text-white">{totalCount}</span> Exquisite Pieces</>
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="aspect-[4/5] w-full animate-pulse rounded-2xl bg-gray-50 dark:bg-white/5" />
                                ))}
                            </div>
                        ) : displayProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
                                    {displayProducts.map((product) => (
                                        <Link key={product.sku} href={`/products/${product.slug}`} className="block">
                                            <ProductCard {...product} />
                                        </Link>
                                    ))}
                                </div>
                                <div className="mt-20 border-t border-gray-50 pt-10 dark:border-white/5">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-40 text-center">
                                <Search size={64} className="mb-8 text-gray-100 dark:text-white/5" />
                                <h3 className="mb-3 font-serif text-3xl text-gray-900 dark:text-white">Empty Vault</h3>
                                <p className="text-sm text-gray-400">Try adjusting your filters to find your masterpiece.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filters Trigger */}
            <button
                onClick={() => setMobileFiltersOpen(true)}
                className="fixed bottom-8 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black px-8 py-4 text-[10px] font-bold tracking-widest text-white shadow-2xl transition-transform hover:scale-105 active:scale-95 lg:hidden dark:bg-white dark:text-black"
            >
                <SlidersHorizontal size={14} /> FILTERS
            </button>

            <MobileFilterDrawer
                isOpen={mobileFiltersOpen}
                onClose={() => setMobileFiltersOpen(false)}
                resultsCount={totalCount}
                searchQuery={searchQuery}
                onSearchChange={(v) => { setSearchQuery(v); handleFilterChange(); }}
            >
                {/* Mobile specific drawer logic could go here or inside MobileFilterDrawer */}
            </MobileFilterDrawer>
        </main>
    );
};

export default CollectionsPage;
