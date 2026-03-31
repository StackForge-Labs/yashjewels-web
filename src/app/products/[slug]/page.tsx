"use client";

import React, { useState, useEffect } from "react";
import {
    ChevronRight,
    Heart,
    ShieldCheck,
    Truck,
    RotateCcw,
    Star,
    Plus,
    Minus,
    Info,
    Store,
    PhoneCall,
    ChevronDown,
    ChevronUp,
    Diamond,
    Award,
    Sparkles,
    Calendar,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProductCard from "@/app/(home)/_components/ProductCard";

// Mock Data for the selected product
const MOCK_PRODUCT = {
    sku: "ERFNJ2504921",
    name: "Mia Natural Diamond Heart Earrings in 14K White Gold",
    category: "Earrings",
    original: "16.655.000 đ",
    sale: "13.990.200 đ",
    discount: "-16%",
    images: [
        "https://tamluxury.vn/wp-content/uploads/2025/12/Nhan-nu-kim-cuong-thien-nhien-Mia-Ma-SP-NNU1544-scaled.jpg",
        "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/1733604/pexels-photo-1733604.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    brand: "Yash Jewels",
    metal: "White Gold",
    carat: "14K",
    stone: "Natural Diamond",
    weight: "0.364 chỉ",
    gender: "Female",
    watermark: "diamond-star",
    specifications: [
        { label: "Product Code", value: "ERFNJ2504921" },
        { label: "Material", value: "14K White Gold" },
        { label: "Main Stone", value: "Natural Diamond" },
        { label: "Gold Weight", value: "0.364 chỉ" },
        { label: "Diamond Clarity", value: "VS1-VS2" },
        { label: "Diamond Color", value: "F-G" },
    ],
    faqs: [
        {
            q: "Why choose Yash Jewels?",
            a: "We provide GIA-certified diamonds and handcrafted excellence with over 20 years of heritage.",
        },
        {
            q: "What if the product is not as described?",
            a: "We offer a 100% money-back guarantee and hassle-free returns within 7 days.",
        },
        {
            q: "How to find my ring size?",
            a: "Please refer to our comprehensive Ring Size Guide or book a virtual appointment.",
        },
    ],
};

// Mock Data for related products
const RELATED_PRODUCTS = [
    {
        sku: "NNU1544",
        name: "Mia Natural Diamond Ring in 14K White Gold",
        category: "Rings",
        original: "25.500.000 đ",
        sale: "21.675.000 đ",
        discount: "-15%",
        image1: "https://tamluxury.vn/wp-content/uploads/2025/12/Nhan-nu-kim-cuong-thien-nhien-Mia-Ma-SP-NNU1544-scaled.jpg",
        image2: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1200",
        badge: "NEW ARRIVAL",
    },
    {
        sku: "NNU1545",
        name: "Artisan Solitaire Diamond Necklace",
        category: "Necklaces",
        original: "45.000.000 đ",
        sale: "38.250.000 đ",
        discount: "-15%",
        image1: "https://images.pexels.com/photos/1733604/pexels-photo-1733604.jpeg?auto=compress&cs=tinysrgb&w=1200",
        image2: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
        sku: "NNU1546",
        name: "Classic Tennis Bracelet with Natural Diamonds",
        category: "Bracelets",
        original: "89.000.000 đ",
        sale: "75.650.000 đ",
        discount: "-15%",
        image1: "https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=1200",
        image2: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1200",
        badge: "MAISON BEST",
    },
    {
        sku: "NNU1547",
        name: "Floral Halo Diamond Earrings",
        category: "Earrings",
        original: "18.000.000 đ",
        sale: "15.300.000 đ",
        discount: "-15%",
        image1: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1200",
        image2: "https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
];

const ProductDetailPage = () => {
    const { slug } = useParams();
    const [mainImage, setMainImage] = useState(MOCK_PRODUCT.images[0]);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("specifications");
    const [openFaq, setOpenFaq] = useState<number | null>(0);

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
                    <Link href="/" className="hover:text-gold transition-colors">
                        Home
                    </Link>
                    <ChevronRight size={10} />
                    <Link href="/collections" className="hover:text-gold transition-colors">
                        Collections
                    </Link>
                    <ChevronRight size={10} />
                    <span className="line-clamp-1 tracking-widest text-gray-900 uppercase dark:text-white">
                        {MOCK_PRODUCT.name}
                    </span>
                </nav>

                <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
                    {/* Left: Enhanced Editorial Gallery Layout */}
                    <div className="lg:col-span-6">
                        <div className="group/gallery sticky top-32 flex gap-2">
                            {/* Vertically Stacked Thumbnails - Left */}
                            <div className="flex h-full w-20 shrink-0 flex-col gap-3 md:w-24">
                                {MOCK_PRODUCT.images.map((img, i) => (
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

                                {/* Extra Visual Element to fill space if needed */}
                                <div className="mt-auto flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 text-gray-300 dark:border-white/5 dark:text-gray-800">
                                    <Diamond size={24} />
                                </div>
                            </div>

                            {/* Main Display - Right */}
                            <div className="relative aspect-4/5 grow overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 text-gray-900 shadow-2xl shadow-black/5 dark:border-white/5 dark:bg-[#111] dark:text-white dark:shadow-black/40">
                                <img
                                    src={mainImage}
                                    alt={MOCK_PRODUCT.name}
                                    className="h-full w-full object-cover transition-transform duration-1000 group-hover/gallery:scale-110"
                                />

                                {/* Overlay Badges */}
                                <div className="absolute top-6 left-6 z-10">
                                    <div className="bg-gold/90 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg backdrop-blur-md">
                                        <Sparkles size={12} /> Maison Edition
                                    </div>
                                </div>
                                <button className="absolute top-6 right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-xl backdrop-blur-md transition-all hover:bg-white hover:text-red-500 dark:bg-black/60 dark:text-white dark:hover:text-red-500">
                                    <Heart size={20} />
                                </button>

                                {/* Aesthetic Corner Texture */}
                                <div className="text-gold pointer-events-none absolute right-0 bottom-0 h-32 w-32 stroke-current opacity-10 dark:text-white">
                                    <svg viewBox="0 0 100 100" className="h-full w-full">
                                        <path d="M100 100 L100 0 L0 100 Z" fill="currentColor" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="lg:col-span-6">
                        <div className="space-y-8">
                            <div className="relative">
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="text-gold flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill="currentColor" />
                                        ))}
                                    </div>
                                    <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                                        (24 Verified Reviews)
                                    </span>
                                </div>
                                <h1 className="mb-4 font-serif text-3xl leading-snug tracking-tight text-gray-900 uppercase md:text-4xl dark:text-white">
                                    {MOCK_PRODUCT.name}
                                </h1>
                                <div className="flex items-center gap-4">
                                    <p className="text-[11px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                                        REF: <span className="text-gray-900 dark:text-white">{MOCK_PRODUCT.sku}</span>
                                    </p>
                                    <div className="h-4 w-px bg-gray-200 dark:bg-white/10" />
                                    <div className="text-gold flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                                        <Diamond size={12} fill="currentColor" className="opacity-50" /> Artisan
                                        Handcrafted
                                    </div>
                                </div>
                            </div>

                            <div className="from-gold/5 border-gold/10 group relative flex flex-col gap-2 overflow-hidden rounded-2xl border bg-linear-to-br to-transparent p-6">
                                <div className="pointer-events-none absolute -right-4 -bottom-4 opacity-5 transition-transform duration-700 group-hover:scale-110">
                                    <Diamond size={120} />
                                </div>
                                <div className="relative z-10 flex items-baseline gap-5">
                                    <span className="text-gold text-4xl font-light tracking-tight italic">
                                        {MOCK_PRODUCT.sale}
                                    </span>
                                    <span className="text-lg font-medium text-gray-300 line-through decoration-gray-400 dark:text-gray-600">
                                        {MOCK_PRODUCT.original}
                                    </span>
                                    <div className="rounded-sm bg-red-500 px-3 py-1 text-[10px] font-bold text-white shadow-lg shadow-red-500/20">
                                        {MOCK_PRODUCT.discount} EXCLUSIVE
                                    </div>
                                </div>
                                <p className="text-gold-dark relative z-10 flex items-center gap-2 text-[11px] font-bold tracking-wider">
                                    <Award size={14} /> VIP Silver Membership: Get extra 5% off
                                </p>
                            </div>

                            {/* Options Selection HUD */}
                            <div className="grid grid-cols-2 gap-6 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 shadow-inner dark:border-white/5 dark:bg-white/2">
                                <div className="space-y-4">
                                    <h3 className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                                        <span className="bg-gold h-1.5 w-1.5 rounded-full" /> Metal Purity:
                                    </h3>
                                    <div className="flex gap-2">
                                        {["14K", "18K", "PT"].map((k) => (
                                            <button
                                                key={k}
                                                className={`h-10 w-10 rounded-full border-2 text-[11px] font-bold transition-all duration-300 md:h-12 md:w-12 ${k === "14K" ? "border-gold bg-gold shadow-gold/20 text-white shadow-xl" : "hover:border-gold border-gray-200 bg-white hover:scale-105 dark:border-white/10 dark:bg-transparent dark:text-gray-400"}`}
                                            >
                                                {k}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                                        <span className="bg-gold h-1.5 w-1.5 rounded-full" /> Stone Type:
                                    </h3>
                                    <div className="group hover:border-gold flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition-colors dark:border-white/10 dark:bg-black/40">
                                        <Diamond
                                            size={16}
                                            className="text-gold transition-transform group-hover:rotate-12"
                                        />
                                        <span className="text-[12px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-200">
                                            {MOCK_PRODUCT.stone}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 items-center rounded-xl border-2 border-gray-100 bg-white px-4 shadow-sm dark:border-white/10 dark:bg-transparent">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="hover:text-gold transform text-gray-400 transition-colors duration-300 active:scale-75"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-12 text-center text-sm font-bold text-gray-900 dark:text-white">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="hover:text-gold transform text-gray-400 transition-colors duration-300 active:scale-75"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button className="bg-gold group flex h-14 grow items-center justify-center gap-3 rounded-xl text-[12px] font-bold tracking-[0.3em] text-white uppercase shadow-[0_20px_40px_rgba(202,162,71,0.25)] transition-all hover:brightness-105 active:scale-[0.98]">
                                        Add to Treasure Bag{" "}
                                        <ArrowRight
                                            size={16}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="flex h-14 items-center justify-center gap-3 rounded-xl border border-gray-100 text-[11px] font-bold tracking-widest text-gray-900 uppercase transition-all hover:bg-gray-50 active:scale-[0.98] dark:border-white/10 dark:text-white dark:hover:bg-white/5">
                                        <Store size={18} /> Reserve in Store
                                    </button>
                                    <button className="flex h-14 items-center justify-center gap-3 rounded-xl bg-gray-900 text-[11px] font-bold tracking-widest text-white uppercase transition-all hover:bg-black/90 active:scale-[0.98] dark:bg-white dark:text-black">
                                        <PhoneCall size={18} /> Concierge Consult
                                    </button>
                                </div>
                            </div>

                            {/* Service Badges */}
                            <div className="grid grid-cols-3 gap-4 border-t border-gray-50 pt-8 dark:border-white/5">
                                {[
                                    { icon: Truck, label: "EXPRESS", sub: "Global White-Glove" },
                                    { icon: ShieldCheck, label: "LIFETIME", sub: "Artisan Quality" },
                                    { icon: RotateCcw, label: "7-DAY", sub: "Guaranteed Return" },
                                ].map((badge, i) => (
                                    <div key={i} className="group flex cursor-default flex-col items-center gap-2">
                                        <div className="bg-gold/10 text-gold flex h-10 w-10 items-center justify-center rounded-full transition-transform group-hover:scale-110">
                                            <badge.icon size={18} />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-heavy mb-1 text-[10px] leading-none tracking-widest text-gray-900 uppercase dark:text-white">
                                                {badge.label}
                                            </p>
                                            <p className="line-clamp-1 text-[8px] font-bold tracking-wider text-gray-400 uppercase">
                                                {badge.sub}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Condensed Tabs/Specifications directly here */}
                            <div className="mt-8 space-y-6 border-t border-gray-50 pt-8 dark:border-white/5">
                                <div className="flex gap-10">
                                    {["specifications", "delivery"].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`relative text-[12px] font-bold tracking-[0.4em] uppercase transition-all ${
                                                activeTab === tab ? "text-gray-900 dark:text-white" : "text-gray-300"
                                            }`}
                                        >
                                            {tab}
                                            {activeTab === tab && (
                                                <div className="bg-gold absolute -bottom-3 left-0 h-1 w-full rounded-full shadow-[0_0_10px_gold]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                                {activeTab === "specifications" && (
                                    <div className="grid grid-cols-2 gap-x-12 gap-y-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 dark:border-white/5 dark:bg-white/1">
                                        {MOCK_PRODUCT.specifications.map((spec, i) => (
                                            <div
                                                key={i}
                                                className="hover:border-gold/30 flex flex-col gap-1.5 border-b border-gray-100 pb-2 transition-colors dark:border-white/5"
                                            >
                                                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                                    {spec.label}
                                                </span>
                                                <span className="text-[13px] font-bold text-gray-900 dark:text-white">
                                                    {spec.value}
                                                </span>
                                            </div>
                                        ))}
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
                                            Complimentary fully insured white-glove shipping on all maison orders.
                                            Discreet luxury packaging included.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Side-by-Side Section */}
                <div className="mt-32 border-t border-gray-100 pt-24 dark:border-white/5">
                    <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
                        {/* Left: Premium Image */}
                        <div className="lg:col-span-5">
                            <div className="group relative overflow-hidden rounded-3xl bg-gray-50 dark:bg-[#111]">
                                <img
                                    src="https://file.hstatic.net/200000355853/file/hop_jemmia.webp"
                                    alt="Luxury Presentation"
                                    className="w-full transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                            </div>
                        </div>

                        {/* Right: FAQ Accordion */}
                        <div className="space-y-10 lg:col-span-7">
                            <div className="space-y-4">
                                <h2 className="font-serif text-4xl tracking-tight text-gray-900 uppercase dark:text-white">
                                    Common <span className="text-gold italic">Questions</span>
                                </h2>
                                <p className="text-[12px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                                    Everything you need to know about our masterpiece
                                </p>
                            </div>

                            <div className="divide-y divide-gray-100 dark:divide-white/5">
                                {[
                                    {
                                        q: "Why should I choose Yash Jewels?",
                                        a: "We offer GIA-certified diamonds and handcrafted jewelry with over 20 years of experience in luxury excellence.",
                                    },
                                    {
                                        q: "What if the product quality is not as expected?",
                                        a: "We provide a 100% money-back guarantee and a hassle-free 7-day return policy for your peace of mind.",
                                    },
                                    {
                                        q: "How can I find my perfect ring size online?",
                                        a: "Check our simple Ring Size Guide or book a free virtual consultation with our experts.",
                                    },
                                    {
                                        q: "Is there proof of authenticity for my purchase?",
                                        a: "Every piece comes with a certificate of authenticity and a laser-engraved serial number for security.",
                                    },
                                    {
                                        q: "Do you offer custom design services?",
                                        a: "Yes, our master artisans can bring your unique vision to life through our bespoke design service.",
                                    },
                                ].map((faq, i) => (
                                    <div key={i} className="py-2">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="group flex w-full items-center justify-between py-5 text-left transition-all"
                                        >
                                            <span
                                                className={`text-[14px] font-bold tracking-tight transition-colors duration-300 ${openFaq === i ? "text-gold" : "group-hover:text-gold text-gray-900 dark:text-white"}`}
                                            >
                                                {faq.q}
                                            </span>
                                            <div
                                                className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300 ${openFaq === i ? "border-gold bg-gold text-white" : "group-hover:border-gold group-hover:text-gold border-gray-200 text-gray-400"}`}
                                            >
                                                {openFaq === i ? <Minus size={12} /> : <Plus size={12} />}
                                            </div>
                                        </button>
                                        <div
                                            className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                                        >
                                            <p className="pr-10 pb-6 text-[13px] leading-relaxed font-medium text-gray-500 italic dark:text-gray-400">
                                                {faq.a}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6 pt-20">
                        <div className="bg-gold/30 h-px w-20" />
                        <Link
                            href="/contact"
                            className="hover:text-gold group flex items-center gap-4 text-[11px] font-bold tracking-[0.5em] text-gray-400 uppercase transition-all"
                        >
                            Explore Our Maison Heritage{" "}
                            <ArrowRight size={14} className="transition-transform group-hover:translate-x-2" />
                        </Link>
                    </div>
                </div>

                {/* Similar Products Section */}
                <div className="mt-32 border-t border-gray-100 pt-24 dark:border-white/5">
                    <div className="mb-16 space-y-4">
                        <h2 className="font-serif text-4xl tracking-tight text-gray-900 uppercase dark:text-white">
                            <span className="text-gold italic">Related</span> products
                        </h2>
                        <div className="flex items-end justify-between gap-4">
                            <p className="text-[12px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                                Hand-selected suggestions by our master designers
                            </p>
                            <Link
                                href="/collections"
                                className="hover:text-gold group flex items-center gap-3 text-[11px] font-bold tracking-[0.4em] text-gray-900 uppercase transition-all dark:text-white"
                            >
                                Discover All{" "}
                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-10">
                        {RELATED_PRODUCTS.map((product, i) => (
                            <ProductCard key={i} {...product} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Fine Bottom Texture */}
            <div className="via-gold/20 mt-20 h-1 bg-linear-to-r from-transparent to-transparent" />
        </main>
    );
};

export default ProductDetailPage;
