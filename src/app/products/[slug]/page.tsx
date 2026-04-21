"use client";

import React, { useState, useEffect } from "react";
import {
    ChevronRight, Heart, ShieldCheck, Truck, RotateCcw, Star, Plus, Minus,
    Diamond, Award, Sparkles, Calendar, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProductCard from "@/app/(home)/_components/ProductCard";

import { productService } from "@/services/product.service";
import { Product } from "@/types/product.types";
import { catalogService, CatalogItem as RefItem } from "@/services/catalog.service";
import { categoryService } from "@/services/category.service";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

const ProductDetailPage = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Additional Refs
    const [brandName, setBrandName] = useState("Yash Jewels");
    const [categoryName, setCategoryName] = useState("Fine Jewelry");

    const [mainImage, setMainImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("specifications");
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    // Mock images because backend image handling isn't fully integrated into `Product` yet
    const fallbackImages = [
        "https://tamluxury.vn/wp-content/uploads/2025/12/Nhan-nu-kim-cuong-thien-nhien-Mia-Ma-SP-NNU1544-scaled.jpg",
        "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/1733604/pexels-photo-1733604.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ];

    useEffect(() => {
        const loadProduct = async () => {
            const found = await productService.getBySlug(slug as string);
            if (found) {
                setProduct(found);
                setMainImage(found.images?.[0]?.imageUrl || fallbackImages[0]);
                
                // Fetch references to show real names
                catalogService.brands.getAll().then(res => {
                    const b = res.data.find(x => x.id === found.brandId);
                    if(b) setBrandName(b.name);
                });
                categoryService.getAll().then(cats => {
                    const c = cats.find(x => x.id === found.categoryId);
                    if(c) setCategoryName(c.name);
                });
            }
            setLoading(false);
        };
        loadProduct();
    }, [slug]);

    if(loading) return <div className="text-center py-32 dark:text-gray-400">Loading masterpiece...</div>;
    if(!product) return <div className="text-center py-32 dark:text-gray-400">Masterpiece not found</div>;

    const basePrice = Number(product.estimatedFinalPrice) * 1.2; // Sample markup
    const finalPrice = Number(product.estimatedFinalPrice);

    return (
        <main className="dark:bg-dark-bg relative overflow-hidden bg-white pt-10 pb-32 transition-colors">
            {/* Background Texture/Patterns */}
            <div className="pointer-events-none absolute top-0 right-0 -z-10 opacity-5 dark:opacity-10">
                <svg width="600" height="600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 0L55 45H100L65 55L75 100L50 70L25 100L35 55L0 45H45L50 0Z" fill="currentColor" />
                </svg>
            </div>

            <div className="container mx-auto px-4 lg:px-12">
                {/* Breadcrumbs */}
                <nav className="mb-8 flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                    <Link href="/" className="hover:text-gold transition-colors">Home</Link>
                    <ChevronRight size={10} />
                    <Link href="/collections" className="hover:text-gold transition-colors">Collections</Link>
                    <ChevronRight size={10} />
                    <span className="line-clamp-1 tracking-widest text-gray-900 uppercase dark:text-white">
                        {product.name}
                    </span>
                </nav>

                <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
                    {/* Left: Enhanced Editorial Gallery Layout */}
                    <div className="lg:col-span-6">
                        <div className="group/gallery sticky top-32 flex gap-2">
                            {/* Vertically Stacked Thumbnails */}
                            <div className="flex h-full w-20 shrink-0 flex-col gap-3 md:w-24">
                                {(product.images && product.images.length > 0 ? product.images.map(i => i.imageUrl) : fallbackImages).map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setMainImage(img)}
                                        className={`aspect-square overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
                                            mainImage === img
                                                ? "border-gold ring-gold/10 shadow-gold/20 shadow-lg ring-4"
                                                : "border-transparent opacity-50 grayscale hover:border-gray-200 hover:opacity-100 hover:grayscale-0 dark:hover:border-white/20"
                                        }`}
                                    >
                                        <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
                                    </button>
                                ))}
                                <div className="mt-auto flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 text-gray-300 dark:border-white/5 dark:text-gray-800">
                                    <Diamond size={24} />
                                </div>
                            </div>

                            {/* Main Display */}
                            <div className="relative aspect-4/5 grow overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 text-gray-900 shadow-2xl shadow-black/5 dark:border-white/5 dark:bg-[#111] dark:text-white dark:shadow-black/40">
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition-transform duration-1000 group-hover/gallery:scale-110"
                                />
                                <div className="absolute top-6 left-6 z-10">
                                    <div className="bg-gold/90 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg backdrop-blur-md">
                                        <Sparkles size={12} /> {brandName}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="lg:col-span-6">
                        <div className="space-y-8">
                            <div className="relative">
                                <h1 className="mb-4 font-serif text-3xl leading-snug tracking-tight text-gray-900 uppercase md:text-4xl dark:text-white">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-4">
                                    <p className="text-[11px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                                        REF: <span className="text-gray-900 dark:text-white">{product.styleCode}</span>
                                    </p>
                                    <div className="h-4 w-px bg-gray-200 dark:bg-white/10" />
                                    <div className="text-gold flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                                        <Diamond size={12} fill="currentColor" className="opacity-50" /> Artisan Handcrafted
                                    </div>
                                </div>
                            </div>

                            <div className="from-gold/5 border-gold/10 group relative flex flex-col gap-2 overflow-hidden rounded-2xl border bg-linear-to-br to-transparent p-6">
                                <div className="pointer-events-none absolute -right-4 -bottom-4 opacity-5 transition-transform duration-700 group-hover:scale-110">
                                    <Diamond size={120} />
                                </div>
                                <div className="relative z-10 flex items-baseline gap-5">
                                    <span className="text-gold text-4xl font-light tracking-tight italic">
                                        {finalPrice.toLocaleString()} đ
                                    </span>
                                    <span className="text-lg font-medium text-gray-300 line-through decoration-gray-400 dark:text-gray-600">
                                        {basePrice.toLocaleString()} đ
                                    </span>
                                    <div className="rounded-sm bg-red-500 px-3 py-1 text-[10px] font-bold text-white shadow-lg shadow-red-500/20">
                                        -15% EXCLUSIVE
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 shadow-inner dark:border-white/5 dark:bg-white/2">
                                <div className="space-y-4">
                                    <h3 className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                                        <span className="bg-gold h-1.5 w-1.5 rounded-full" /> Status:
                                    </h3>
                                    <div className="flex gap-2">
                                        <span className={`px-4 py-2 rounded-full font-bold text-xs ${product.quantity > 0 ? "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20" : "bg-red-50 text-red-600 border border-red-200"}`}>
                                            {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                                        <span className="bg-gold h-1.5 w-1.5 rounded-full" /> Category:
                                    </h3>
                                    <div className="group hover:border-gold flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition-colors dark:border-white/10 dark:bg-black/40">
                                        <span className="text-[12px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-200">
                                            {categoryName}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 items-center rounded-xl border-2 border-gray-100 bg-white px-4 shadow-sm dark:border-white/10 dark:bg-transparent">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400" disabled={product.quantity === 0}>
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-12 text-center text-sm font-bold text-gray-900 dark:text-white">
                                            {product.quantity > 0 ? quantity : 0}
                                        </span>
                                        <button onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))} className="text-gray-400" disabled={product.quantity === 0 || quantity >= product.quantity}>
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button 
                                        disabled={product.quantity === 0 || isAdding} 
                                        onClick={async () => {
                                            const productId = (product as any).id || (product as any).Id;
                                            if (!productId) {
                                                toast.error("Invalid product ID. Please reload the page.");
                                                return;
                                            }
                                            setIsAdding(true);
                                            try {
                                                await addToCart(productId, quantity);
                                            } finally {
                                                setIsAdding(false);
                                            }
                                        }}
                                        className="bg-gold group flex h-14 grow items-center justify-center gap-3 rounded-xl text-[12px] font-bold tracking-[0.3em] text-white uppercase shadow-[0_20px_40px_rgba(202,162,71,0.25)] transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isAdding ? "Adding to Bag..." : product.quantity > 0 ? "Add to Treasure Bag" : "Out of Stock"}
                                        <ArrowRight size={16} className={isAdding ? "animate-pulse" : ""} />
                                    </button>
                                </div>
                            </div>

                            {/* Service Badges */}
                            <div className="grid grid-cols-3 gap-4 border-t border-gray-50 pt-8 dark:border-white/5">
                                {[
                                    { icon: Truck, label: "EXPRESS", sub: "Global White-Glove" },
                                    { icon: ShieldCheck, label: "LIFETIME", sub: "Artisan Quality" },
                                    { icon: RotateCcw, label: "7-DAY", sub: "Guaranteed Return" },
                                ].map((b, i) => (
                                    <div key={i} className="group flex flex-col items-center gap-2">
                                        <div className="bg-gold/10 text-gold flex h-10 w-10 items-center justify-center rounded-full transition-transform group-hover:scale-110">
                                            <b.icon size={18} />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-heavy mb-1 text-[10px] leading-none tracking-widest text-gray-900 uppercase dark:text-white">{b.label}</p>
                                            <p className="line-clamp-1 text-[8px] font-bold tracking-wider text-gray-400 uppercase">{b.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Condensed Tabs/Specifications */}
                            <div className="mt-8 space-y-6 border-t border-gray-50 pt-8 dark:border-white/5">
                                <div className="flex gap-10">
                                    {["specifications", "description", "delivery"].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`relative text-[12px] font-bold tracking-[0.4em] uppercase transition-all ${activeTab === tab ? "text-gray-900 dark:text-white" : "text-gray-300"}`}
                                        >
                                            {tab}
                                            {activeTab === tab && <div className="bg-gold absolute -bottom-3 left-0 h-1 w-full rounded-full shadow-[0_0_10px_gold]" />}
                                        </button>
                                    ))}
                                </div>
                                {activeTab === "specifications" && (
                                    <div className="grid grid-cols-2 gap-x-12 gap-y-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 dark:border-white/5 dark:bg-white/1">
                                        <div className="flex flex-col gap-1.5 border-b border-gray-100 pb-2 dark:border-white/5">
                                            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Product Code</span>
                                            <span className="text-[13px] font-bold text-gray-900 dark:text-white">{product.styleCode}</span>
                                        </div>
                                        <div className="flex flex-col gap-1.5 border-b border-gray-100 pb-2 dark:border-white/5">
                                            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Gold Weight</span>
                                            <span className="text-[13px] font-bold text-gray-900 dark:text-white">{product.netGoldGm} gm</span>
                                        </div>
                                        <div className="flex flex-col gap-1.5 border-b border-gray-100 pb-2 dark:border-white/5">
                                            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Total Weight</span>
                                            <span className="text-[13px] font-bold text-gray-900 dark:text-white">{product.totalGrossWeightGm} gm</span>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "description" && (
                                    <div className="from-gold/5 border-gold/10 space-y-4 rounded-2xl border bg-linear-to-r to-transparent p-6">
                                        <p className="text-[13px] leading-loose font-medium text-gray-500 italic dark:text-gray-400">
                                            {product.description || "No description provided."}
                                        </p>
                                    </div>
                                )}
                                {activeTab === "delivery" && (
                                    <div className="from-gold/5 border-gold/10 space-y-4 rounded-2xl border bg-linear-to-r to-transparent p-6">
                                        <div className="flex items-center gap-3">
                                            <Calendar size={18} className="text-gold" />
                                            <span className="text-[11px] font-bold tracking-widest text-gray-900 uppercase dark:text-white">
                                                Estimated Arrival: <span className="text-gold">Next 48 Hours</span>
                                            </span>
                                        </div>
                                        <p className="text-[12px] leading-loose font-medium text-gray-500 italic">
                                            Complimentary fully insured white-glove shipping on all maison orders. Discreet luxury packaging included.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Fine Bottom Texture */}
            <div className="via-gold/20 mt-20 h-1 bg-linear-to-r from-transparent to-transparent" />
        </main>
    );
};

export default ProductDetailPage;
