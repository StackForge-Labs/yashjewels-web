"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { ArrowRight, MapPin, Clock, Flame } from "lucide-react";

const GOLD_PRICE = { "18K": "$55.70/g", "22K": "$69.23/g", "24K": "$75.10/g", PT950: "$42.30/g" };

interface DiamondData {
    sku: string;
    name: string;
    original: string;
    sale: string;
    discount: string;
}

export const HomeViews = ({ diamonds }: { diamonds: DiamondData[] }) => {
    // Countdown Timer Logic
    const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { hours, minutes, seconds } = prev;
                if (seconds > 0) seconds--;
                else {
                    seconds = 59;
                    if (minutes > 0) minutes--;
                    else {
                        minutes = 59;
                        if (hours > 0) hours--;
                    }
                }
                return { hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <style jsx global>{`
                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(2deg);
                    }
                }
                @keyframes float-slow {
                    0%,
                    100% {
                        transform: translate(0, 0) rotate(-2deg);
                    }
                    50% {
                        transform: translate(-10px, -30px) rotate(4deg);
                    }
                }
                @keyframes float-fast {
                    0%,
                    100% {
                        transform: translateY(0px) scale(1);
                    }
                    50% {
                        transform: translateY(-15px) scale(1.05);
                    }
                }
                @keyframes float-diagonal {
                    0%,
                    100% {
                        transform: translate(0, 0) rotate(5deg);
                    }
                    50% {
                        transform: translate(15px, -25px) rotate(-5deg);
                    }
                }
                @keyframes heartbeat-glow {
                    0%,
                    100% {
                        filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.4));
                        transform: scale(1);
                    }
                    50% {
                        filter: drop-shadow(0 0 30px rgba(212, 175, 55, 0.8));
                        transform: scale(1.03);
                    }
                }
                @keyframes pulse-glow {
                    0% {
                        box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4);
                    }
                    70% {
                        box-shadow: 0 0 0 20px rgba(212, 175, 55, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(212, 175, 55, 0);
                    }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }
                .animate-float-fast {
                    animation: float-fast 4s ease-in-out infinite;
                }
                .animate-float-diagonal {
                    animation: float-diagonal 7s ease-in-out infinite;
                }
                .animate-pulse-glow {
                    animation: pulse-glow 2s infinite;
                }
            `}</style>

            {/* SECTION 1: HERO / BANNER */}
            <section className="relative flex h-[90vh] min-h-[750px] w-full items-center overflow-hidden bg-black">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 z-10 bg-linear-to-r" />
                    <img
                        src="https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg?auto=compress&cs=tinysrgb&w=1600"
                        alt="Hero Jewelry"
                        className="h-full w-full object-cover object-center opacity-70 transition-transform duration-[15s] ease-out hover:scale-105"
                    />
                </div>

                <div className="relative z-20 container mx-auto flex h-full w-full flex-col items-center px-4 pt-20 lg:flex-row lg:px-12">
                    {/* Hero Left Content */}
                    <div
                        className="flex w-full flex-col justify-center lg:w-1/2"
                        data-aos="fade-up"
                        data-aos-duration="1200"
                    >
                        <div className="text-gold mb-6 flex items-center gap-4">
                            <span className="bg-gold h-px w-12"></span>
                            <span className="text-xs font-bold tracking-[0.4em] text-white uppercase">
                                The 2026 Edition
                            </span>
                        </div>
                        <h2 className="mb-6 font-serif text-5xl leading-[1.15] text-white drop-shadow-md md:text-7xl">
                            Brilliance <span className="text-gold font-light italic">Defined</span>
                        </h2>
                        <p className="mb-10 max-w-lg text-base leading-relaxed font-light text-gray-300">
                            Discover our exquisite selection of high jewelry. Unparalleled craftsmanship meeting
                            extraordinary earth-mined diamonds.
                        </p>

                        {/* Scarcity / Sales Widget */}
                        <div className="group relative mb-10 inline-block overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-md">
                            <div className="from-gold/10 absolute inset-0 bg-linear-to-r to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                            <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row">
                                <div className="flex flex-col gap-2">
                                    <span className="text-gold flex items-center gap-2 text-sm font-bold tracking-widest uppercase">
                                        <Flame size={16} className="animate-pulse text-red-500" /> Flash Event
                                    </span>
                                    <span className="font-serif text-lg text-white">Exclusive VIP Sale - 20% Off</span>
                                </div>
                                <div className="hidden h-12 w-px bg-white/20 sm:block"></div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black text-xl font-bold text-white shadow-inner">
                                            {String(timeLeft.hours).padStart(2, "0")}
                                        </span>
                                        <span className="mt-1 text-[10px] tracking-widest text-gray-400 uppercase">
                                            Hrs
                                        </span>
                                    </div>
                                    <span className="mt-1 text-xl font-bold text-white">:</span>
                                    <div className="flex flex-col items-center">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black text-xl font-bold text-white shadow-inner">
                                            {String(timeLeft.minutes).padStart(2, "0")}
                                        </span>
                                        <span className="mt-1 text-[10px] tracking-widest text-gray-400 uppercase">
                                            Min
                                        </span>
                                    </div>
                                    <span className="mt-1 text-xl font-bold text-white">:</span>
                                    <div className="flex flex-col items-center">
                                        <span className="text-gold border-gold/30 animate-pulse-glow flex h-10 w-10 items-center justify-center rounded-lg border bg-black text-xl font-bold shadow-inner">
                                            {String(timeLeft.seconds).padStart(2, "0")}
                                        </span>
                                        <span className="text-gold mt-1 text-[10px] tracking-widest uppercase">
                                            Sec
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="h-2 w-2 animate-ping rounded-full bg-red-500"></span>
                                    Only <strong className="px-1 tracking-widest text-white">2 SLOTS</strong> remaining
                                </div>
                                <span className="text-gold cursor-pointer text-[10px] font-bold tracking-widest uppercase hover:underline">
                                    Claim Yours &rarr;
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 sm:flex-row">
                            <button className="hover:bg-gold bg-white px-10 py-5 text-xs font-bold tracking-[0.2em] text-black uppercase transition-all duration-300 hover:text-white">
                                Shop Collection
                            </button>
                            <button className="hover:border-gold hover:text-gold flex items-center justify-center gap-3 border border-white/30 px-10 py-5 text-xs font-bold tracking-[0.2em] text-white uppercase backdrop-blur-md transition-all duration-300">
                                View Lookbook
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Hero Right Content - Floating Fancy Constellation */}
                    <div
                        className="relative mt-20 flex h-[500px] w-full items-center justify-center lg:mt-0 lg:h-full lg:w-1/2"
                        data-aos="zoom-in"
                        data-aos-delay="300"
                        data-aos-duration="1500"
                    >
                        <div className="relative flex h-full w-full max-w-lg items-center justify-center">
                            {/* Decorative Core Glow */}
                            <div className="bg-gold/20 absolute inset-0 m-auto h-64 w-64 animate-pulse rounded-full opacity-70 blur-[80px]"></div>

                            {/* Centerpiece Image - Large Diamond */}
                            <div className="absolute z-30 m-auto w-[65%] animate-[heartbeat-glow_5s_ease-in-out_infinite] sm:w-[55%]">
                                <img
                                    src="https://cdn.hstatic.net/products/1000381168/upload_f1abf23f3d2d4abe8249e0881ae040c4_grande.jpg"
                                    alt="Centerpiece Diamond"
                                    className="h-auto w-full rounded-full object-cover mix-blend-lighten shadow-2xl"
                                />
                                {/* Price Tag */}
                                <div className="border-gold/30 absolute -right-8 bottom-4 z-40 animate-bounce rounded-xl border bg-white/10 p-3 shadow-[0_10px_30px_rgba(212,175,55,0.2)] backdrop-blur-md delay-100">
                                    <span className="mb-1 block text-[8px] font-bold tracking-widest text-gray-300 uppercase">
                                        GIA Certified 4.5mm
                                    </span>
                                    <span className="font-serif text-lg text-white">$14,500</span>
                                </div>
                            </div>

                            {/* Floating Item 1: Diamond Render (Top Right) */}
                            <div className="animate-float-slow absolute top-[10%] right-[5%] z-20 w-32">
                                <img
                                    src="https://tahigems.vn/wp-content/uploads/2021/07/tahigems-round.webp"
                                    alt="Floating Diamond"
                                    className="h-auto w-full animate-[spin_40s_linear_infinite] drop-shadow-[0_10px_20px_rgba(255,255,255,0.3)]"
                                />
                                <div className="absolute -top-2 -right-2 h-2 w-2 animate-pulse rounded-full bg-white shadow-[0_0_15px_5px_rgba(255,255,255,0.8)]"></div>
                            </div>

                            {/* Floating Item 2: Sancy Diamond (Bottom Left) */}
                            <div className="animate-float-fast absolute bottom-[15%] left-[5%] z-40 w-40">
                                <img
                                    src="https://sancydiamond.vn/wp-content/uploads/2025/05/4.png"
                                    alt="Sancy Diamond"
                                    className="h-auto w-full animate-[spin_60s_linear_infinite_reverse] drop-shadow-[0_15px_30px_rgba(212,175,55,0.4)]"
                                />
                            </div>

                            {/* Floating Item 3: Ody Diamond (Top Left) */}
                            <div className="animate-float-diagonal absolute top-[20%] left-[8%] z-10 w-24 opacity-80">
                                <img
                                    src="https://odydiamond.vn/wp-content/uploads/2024/10/kim-cuong-4ly5-nuoc-g.png"
                                    alt="Ody Diamond"
                                    className="h-auto w-full mix-blend-screen drop-shadow-[0_5px_15px_rgba(255,255,255,0.2)]"
                                />
                            </div>

                            {/* Decorative Orbit Rings */}
                            <div className="border-gold/20 pointer-events-none absolute inset-0 m-auto h-full max-h-[400px] w-full max-w-[400px] animate-[spin_20s_linear_infinite] rounded-full border border-dashed"></div>
                            <div className="pointer-events-none absolute inset-0 m-auto h-[110%] max-h-[450px] w-[110%] max-w-[450px] animate-[spin_35s_linear_infinite_reverse] rounded-full border-[0.5px] border-white/10"></div>
                        </div>
                    </div>
                </div>

                {/* Live Gold Price Ticker */}
                <div
                    className="absolute bottom-0 z-30 w-full border-t border-white/10 bg-black/70 p-3 backdrop-blur-lg"
                    data-aos="fade-in"
                    data-aos-delay="1000"
                >
                    <div className="container mx-auto flex items-center justify-center gap-8 overflow-hidden text-[11px] font-bold tracking-widest text-white uppercase">
                        <span className="text-gold flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                            </span>
                            Live Market Prices:
                        </span>
                        {Object.entries(GOLD_PRICE).map(([k, v]) => (
                            <span key={k} className="hidden sm:inline">
                                {k}: <span className="ml-1 text-gray-300">{v}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 2: SHOP BY CATEGORY (Bento Grid) */}
            <section className="bg-white py-24 transition-colors duration-500 dark:bg-[#030303]">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="mb-16 text-center" data-aos="fade-up">
                        <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.3em] uppercase">
                            Infinite Choices
                        </span>
                        <h2 className="font-serif text-3xl text-gray-900 lg:text-4xl dark:text-white">
                            Shop By Category
                        </h2>
                    </div>
                    {/* Bento Grid */}
                    <div className="grid h-auto grid-cols-1 gap-4 md:h-[600px] md:grid-cols-4">
                        <div
                            className="group relative col-span-1 h-[300px] cursor-pointer overflow-hidden rounded-xl bg-gray-100 md:col-span-2 md:row-span-2 md:h-full dark:bg-zinc-900"
                            data-aos="fade-right"
                        >
                            <img
                                src="https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=800"
                                className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                                alt="Engagement Rings"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/20 to-transparent p-8 opacity-90 transition-opacity">
                                <span className="mb-2 font-serif text-2xl text-white lg:text-3xl">
                                    Engagement Rings
                                </span>
                                <span className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase transition-transform group-hover:translate-x-2">
                                    Discover Tokens of Love &rarr;
                                </span>
                            </div>
                        </div>
                        <div
                            className="group relative col-span-1 h-[250px] cursor-pointer overflow-hidden rounded-xl bg-gray-100 md:col-span-2 md:h-[292px] dark:bg-zinc-900"
                            data-aos="fade-left"
                            data-aos-delay="100"
                        >
                            <img
                                src="https://images.pexels.com/photos/1733604/pexels-photo-1733604.jpeg?auto=compress&cs=tinysrgb&w=800"
                                className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                                alt="Necklaces"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/20 to-transparent p-8 opacity-90">
                                <span className="mb-2 font-serif text-2xl text-white lg:text-3xl">
                                    Necklaces & Masterpieces
                                </span>
                            </div>
                        </div>
                        <div
                            className="group relative col-span-1 h-[250px] cursor-pointer overflow-hidden rounded-xl bg-gray-100 md:h-[292px] dark:bg-zinc-900"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            <img
                                src="https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400"
                                className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                                alt="Earrings"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/20 to-transparent p-6 opacity-90">
                                <span className="mb-1 font-serif text-xl text-white">Diamond Earrings</span>
                            </div>
                        </div>
                        <div
                            className="group relative col-span-1 h-[250px] cursor-pointer overflow-hidden rounded-xl bg-gray-100 md:h-[292px] dark:bg-zinc-900"
                            data-aos="fade-up"
                            data-aos-delay="300"
                        >
                            <img
                                src="https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400"
                                className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                                alt="Bracelets"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/20 to-transparent p-6 opacity-90">
                                <span className="mb-1 font-serif text-xl text-white">Luxury Bracelets</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: FEATURED COLLECTION */}
            <section className="overflow-hidden bg-gray-50 py-24 transition-colors duration-500 dark:bg-[#0a0a0a]">
                <div className="container mx-auto flex flex-col items-center gap-16 px-4 lg:flex-row lg:px-12">
                    <div className="w-full lg:w-5/12" data-aos="fade-right">
                        <span className="text-gold mb-6 block text-[10px] font-bold tracking-[0.4em] uppercase">
                            High Jewelry
                        </span>
                        <h2 className="mb-8 font-serif text-4xl leading-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                            The Imperial <br />
                            <span className="font-light text-gray-500 italic">Collection</span>
                        </h2>
                        <p className="mb-10 text-base leading-relaxed font-light text-gray-600 dark:text-gray-400">
                            A perfect intersection between centuries-old craftsmanship and the raw beauty of the world's
                            most scarce diamonds. Every masterpiece is an impeccable statement of class.
                        </p>
                        <button className="hover:bg-gold dark:hover:bg-gold bg-gray-900 px-10 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase transition-colors duration-300 dark:bg-white dark:text-black dark:hover:text-white">
                            View Details
                        </button>
                    </div>
                    <div
                        className="relative h-[500px] w-full overflow-hidden rounded-2xl shadow-2xl lg:h-[650px] lg:w-7/12"
                        data-aos="fade-left"
                        data-aos-delay="200"
                    >
                        <div className="absolute inset-0 z-10 bg-linear-to-t from-black/60 to-transparent" />
                        <img
                            src="https://images.pexels.com/photos/2253818/pexels-photo-2253818.jpeg?auto=compress&cs=tinysrgb&w=1200"
                            alt="Featured Collection"
                            className="h-full w-full object-cover transition-transform duration-[3s] hover:scale-110"
                        />
                        <div className="custom-scrollbar absolute right-8 bottom-8 left-8 z-20 flex gap-6 overflow-x-auto pb-4">
                            <div className="flex min-w-[250px] cursor-pointer items-center gap-4 rounded-xl border border-white/20 bg-white/90 p-4 shadow-lg backdrop-blur-md transition-transform hover:-translate-y-2 dark:border-white/10 dark:bg-black/90">
                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                                    <img
                                        src="https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=100"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="mb-1 text-sm font-bold text-gray-900 dark:text-white">
                                        VVS1 Diamond
                                    </h4>
                                    <p className="text-gold text-xs font-bold">$12,000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: NEW ARRIVALS */}
            <section className="bg-white py-24 transition-colors duration-500 dark:bg-[#030303]">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="mb-16 flex flex-col items-end justify-between gap-4 sm:flex-row" data-aos="fade-up">
                        <div>
                            <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.3em] uppercase">
                                The Modern Essentials
                            </span>
                            <h2 className="font-serif text-3xl text-gray-900 lg:text-4xl dark:text-white">
                                Latest Arrivals
                            </h2>
                        </div>
                        <button className="hover:text-gold hover:border-gold items-center gap-2 border-b border-gray-900 pb-1 text-xs font-bold tracking-[0.2em] text-gray-900 uppercase transition-colors dark:border-white dark:text-white">
                            View Entire Collection &rarr;
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {diamonds.slice(0, 4).map((d, i) => (
                            <div data-aos="fade-up" data-aos-delay={i * 100} key={d.sku}>
                                <ProductCard
                                    sku={d.sku}
                                    name={d.name}
                                    category="New Collection"
                                    original={d.original}
                                    sale={d.sale}
                                    discount={d.discount}
                                    image1={
                                        "https://tamluxury.vn/wp-content/uploads/2026/01/Thiet-ke-nam-2026-Nhan-nu-kim-cuong-Organ-Ma-SP-NNU1618-scaled.jpg"
                                    }
                                    image2={
                                        "https://tamluxury.vn/wp-content/uploads/2025/12/Nhan-nu-kim-cuong-thien-nhien-Mia-Ma-SP-NNU1544-scaled.jpg"
                                    }
                                    badge="NEW"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 5: BEST SELLERS */}
            <section className="bg-gray-50 py-24 transition-colors duration-500 dark:bg-[#080808]">
                <div className="container mx-auto mb-16 px-4 text-center lg:px-12" data-aos="fade-up">
                    <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.3em] uppercase">
                        Signature Selection
                    </span>
                    <h2 className="font-serif text-3xl text-gray-900 lg:text-4xl dark:text-white">Best Sellers</h2>
                </div>
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {diamonds.slice(4, 8).map((d, i) => (
                            <div data-aos="fade-up" data-aos-delay={i * 100} key={d.sku}>
                                <ProductCard
                                    sku={d.sku}
                                    name={d.name.replace("Diamond", "Pendant")}
                                    category="Signature"
                                    original={d.original}
                                    sale={d.sale}
                                    discount={d.discount}
                                    image1={
                                        "https://tamluxury.vn/wp-content/uploads/2026/03/Thiet-ke-mat-day-chuyen-Halo-tron-dac-biet-Melody-Ma-MD878-1-scaled.jpg"
                                    }
                                    image2={
                                        "https://tamluxury.vn/wp-content/uploads/2026/03/Mat-day-chuyen-kim-cuong-thien-nhien-Milkway-Ma-MD773-1-scaled.jpg"
                                    }
                                    badge="HOT"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 6 & 7: HIS & HERS (Women's & Men's Split Layout) */}
            <section className="bg-white transition-colors duration-500 dark:bg-[#030303]">
                {/* Women's Component */}
                <div className="flex flex-col xl:flex-row">
                    <div className="group relative min-h-[500px] overflow-hidden xl:w-1/2">
                        <img
                            src="https://images.pexels.com/photos/1733604/pexels-photo-1733604.jpeg?auto=compress&cs=tinysrgb&w=1200"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                            alt="Women Jewelry"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-8 text-center">
                            <span
                                className="text-gold mb-4 text-[10px] font-bold tracking-[0.4em] uppercase"
                                data-aos="fade-down"
                            >
                                Radiant Elegance
                            </span>
                            <h2 className="mb-8 font-serif text-4xl text-white lg:text-6xl" data-aos="fade-up">
                                Women's Jewelry
                            </h2>
                            <button
                                className="hover:bg-gold bg-white px-8 py-3 text-xs font-bold tracking-[0.2em] text-black uppercase transition-colors hover:text-white"
                                data-aos="zoom-in"
                                data-aos-delay="200"
                            >
                                Discover
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-center bg-gray-50 p-8 lg:p-16 xl:w-1/2 dark:bg-[#0a0a0a]">
                        <div className="grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
                            {diamonds.slice(0, 2).map((d) => (
                                <ProductCard
                                    key={d.sku}
                                    sku={d.sku}
                                    name={"Premium Women's Ring " + d.sku}
                                    category="Women's Line"
                                    original={d.original}
                                    sale={d.sale}
                                    discount={d.discount}
                                    image1="https://tamluxury.vn/wp-content/uploads/2025/11/Xu-huong-2025-Nhan-nu-kim-cuong-Dia-NNU1480-scaled.jpg"
                                    image2="https://tamluxury.vn/wp-content/uploads/2025/11/Nhan-nu-kim-cuong-xuat-sac-Queenie-Ma-NNU1533-scaled.jpg"
                                />
                            ))}
                        </div>
                    </div>
                </div>
                {/* Men's Component */}
                <div className="flex flex-col-reverse xl:flex-row">
                    <div className="flex items-center justify-center bg-gray-50 p-8 lg:p-16 xl:w-1/2 dark:bg-[#0a0a0a]">
                        <div className="grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
                            {diamonds.slice(2, 4).map((d) => (
                                <ProductCard
                                    key={d.sku}
                                    sku={d.sku}
                                    name={"Majestic Men's Ring " + d.sku}
                                    category="Men's Line"
                                    original={d.original}
                                    sale={d.sale}
                                    discount={d.discount}
                                    image1="https://tamluxury.vn/wp-content/uploads/2025/11/3.NHAN-NAM-POST-WEB-UP-LAI-SIZE-NHO.jpg"
                                    image2="https://tamluxury.vn/wp-content/uploads/2025/11/3.NHAN-NAM-POST-WEB-UP-LAI-SIZE-NHO.jpg"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="group relative min-h-[500px] overflow-hidden xl:w-1/2">
                        <img
                            src="https://images.pexels.com/photos/298859/pexels-photo-298859.jpeg?auto=compress&cs=tinysrgb&w=1200"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                            alt="Men Jewelry"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-8 text-center">
                            <span
                                className="text-gold mb-4 text-[10px] font-bold tracking-[0.4em] uppercase"
                                data-aos="fade-down"
                            >
                                Sophisticated Power
                            </span>
                            <h2 className="mb-8 font-serif text-4xl text-white lg:text-6xl" data-aos="fade-up">
                                Men's Jewelry
                            </h2>
                            <button
                                className="hover:bg-gold bg-white px-8 py-3 text-xs font-bold tracking-[0.2em] text-black uppercase transition-colors hover:text-white"
                                data-aos="zoom-in"
                                data-aos-delay="200"
                            >
                                Discover
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 8: BRIDAL PARALLAX */}
            <section className="relative overflow-hidden bg-black/80 py-40">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.pexels.com/photos/2253818/pexels-photo-2253818.jpeg?auto=compress&cs=tinysrgb&w=1600"
                        className="fixed-bg h-full w-full object-cover opacity-60"
                        alt="Bridal"
                    />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                </div>
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <span
                        className="text-gold mb-4 inline-block text-[10px] font-bold tracking-[0.4em] uppercase"
                        data-aos="fade-down"
                    >
                        The Wedding Sanctuary
                    </span>
                    <h2 className="mb-6 font-serif text-5xl text-white lg:text-7xl" data-aos="fade-up">
                        Bridal Collection
                    </h2>
                    <p
                        className="mx-auto mb-12 max-w-xl text-lg font-light text-gray-300"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        The beginning of eternal happiness. Meticulously crafted wedding rings exclusively for your
                        grand momentous day.
                    </p>
                    <button
                        className="hover:bg-gold hover:shadow-gold/50 bg-white px-12 py-4 text-xs font-bold tracking-[0.2em] text-black uppercase shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 hover:text-white"
                        data-aos="zoom-in"
                        data-aos-delay="200"
                    >
                        Enter Pavilion
                    </button>
                </div>
            </section>

            {/* SECTION 9: JOURNAL & EDUCATION */}
            <section className="bg-white py-24 transition-colors duration-500 dark:bg-[#030303]">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="mb-16 flex flex-col items-end justify-between gap-4 sm:flex-row" data-aos="fade-up">
                        <div>
                            <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.3em] uppercase">
                                Magazine & Education
                            </span>
                            <h2 className="font-serif text-3xl text-gray-900 lg:text-4xl dark:text-white">
                                Journal Spotlight
                            </h2>
                        </div>
                        <button className="hover:text-gold hover:border-gold items-center gap-2 border-b border-gray-900 pb-1 text-xs font-bold tracking-[0.2em] text-gray-900 uppercase transition-colors dark:border-white dark:text-white">
                            Read All Articles &rarr;
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                        {[
                            {
                                title: "The First-Time Diamond Buyer's Guide (The 4Cs)",
                                img: "https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg",
                            },
                            {
                                title: "How to maintain your 18K Gold Jewelry brilliantly",
                                img: "https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg",
                            },
                            {
                                title: "Platinum Wedding Band Trends for Fall 2026",
                                img: "https://images.pexels.com/photos/3266700/pexels-photo-3266700.jpeg",
                            },
                        ].map((post, i) => (
                            <div key={i} className="group cursor-pointer" data-aos="fade-up" data-aos-delay={i * 150}>
                                <div className="mb-6 h-64 overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-900">
                                    <img
                                        src={post.img + "?auto=compress&cs=tinysrgb&w=600"}
                                        className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                                        alt="Blog"
                                        loading="lazy"
                                    />
                                </div>
                                <span className="mb-3 block text-[10px] font-bold tracking-widest text-gray-400 uppercase dark:text-gray-500">
                                    Diamond Knowledge
                                </span>
                                <h3 className="group-hover:text-gold font-serif text-xl tracking-wide text-gray-900 transition-colors dark:text-gray-100">
                                    {post.title}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 10: STORES (Luxurious Floating Cards) */}
            <section className="relative bg-gray-50 py-32 transition-colors duration-500 dark:bg-dark-bg">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="mb-16 text-center" data-aos="fade-up">
                        <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.4em] uppercase">
                            Global Presence
                        </span>
                        <h2 className="font-serif text-4xl text-gray-900 lg:text-5xl dark:text-white">
                            Discover <span className="font-light text-gray-500 italic">Our Boutiques</span>
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl font-light text-gray-500">
                            Step into a world of ultimate luxury. Experience world-class personalized service provided
                            by our expert jewelry consultants in our flagship sanctuaries.
                        </p>
                    </div>

                    <div className="group relative h-[850px] overflow-hidden rounded-3xl shadow-2xl md:h-[600px]">
                        {/* Background Image with Parallax effect */}
                        <div className="absolute inset-0">
                            <img
                                src="https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=1600"
                                className="h-full w-full object-cover transition-transform duration-[10s] group-hover:scale-110"
                                alt="Flagship Boutique"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/10 dark:from-black dark:via-black/70 dark:to-black/30" />
                        </div>

                        {/* Store Cards Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-12">
                            <div className="relative z-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {/* Vietnam Flagship */}
                                <div
                                    className="hover:border-gold/50 transform cursor-pointer rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/20 dark:bg-black/40"
                                    data-aos="fade-up"
                                    data-aos-delay="100"
                                >
                                    <div className="mb-6 flex items-start justify-between">
                                        <div>
                                            <span className="text-gold mb-1 block text-[9px] font-bold tracking-widest uppercase">
                                                Flagship Store
                                            </span>
                                            <h3 className="font-serif text-2xl text-white">Ho Chi Minh</h3>
                                        </div>
                                        <div className="bg-gold/20 rounded-full p-2">
                                            <MapPin className="text-gold h-5 w-5" />
                                        </div>
                                    </div>
                                    <ul className="mb-8 space-y-4 text-sm font-light text-gray-300">
                                        <li className="flex items-start gap-3">
                                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                            <span>
                                                Unit L1-01, Saigon Centre,
                                                <br />
                                                65 Le Loi, District 1
                                            </span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <Clock className="h-4 w-4 shrink-0 text-gray-400" />
                                            <span>Mon - Sun: 09:30 - 22:00</span>
                                        </li>
                                    </ul>
                                    <button className="w-full border border-white/30 py-3 text-xs tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-black">
                                        Book Appointment
                                    </button>
                                </div>

                                {/* Hanoi Boutique */}
                                <div
                                    className="hover:border-gold/50 transform cursor-pointer rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/20 dark:bg-black/40"
                                    data-aos="fade-up"
                                    data-aos-delay="200"
                                >
                                    <div className="mb-6 flex items-start justify-between">
                                        <div>
                                            <span className="text-gold mb-1 block text-[9px] font-bold tracking-widest uppercase">
                                                Grand Boutique
                                            </span>
                                            <h3 className="font-serif text-2xl text-white">Hanoi</h3>
                                        </div>
                                        <div className="bg-gold/20 rounded-full p-2">
                                            <MapPin className="text-gold h-5 w-5" />
                                        </div>
                                    </div>
                                    <ul className="mb-8 space-y-4 text-sm font-light text-gray-300">
                                        <li className="flex items-start gap-3">
                                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                            <span>
                                                Lotte Center Hanoi,
                                                <br />
                                                54 Lieu Giai, Ba Dinh
                                            </span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <Clock className="h-4 w-4 shrink-0 text-gray-400" />
                                            <span>Mon - Sun: 10:00 - 21:00</span>
                                        </li>
                                    </ul>
                                    <button className="w-full border border-white/30 py-3 text-xs tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-black">
                                        Book Appointment
                                    </button>
                                </div>

                                {/* Singapore Concept */}
                                <div
                                    className="hover:border-gold/50 group/box hidden cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-transparent p-8 text-center transition-colors duration-300 lg:flex"
                                    data-aos="fade-up"
                                    data-aos-delay="300"
                                >
                                    <div className="border-gold/50 group-hover/box:bg-gold/10 mb-6 flex h-16 w-16 items-center justify-center rounded-full border transition-colors">
                                        <ArrowRight className="text-gold h-6 w-6 animate-pulse" />
                                    </div>
                                    <h3 className="mb-2 font-serif text-xl text-white">Singapore Pavilion</h3>
                                    <p className="mb-6 text-sm font-light text-gray-400">
                                        Opening Winter 2026 at Marina Bay Sands.
                                    </p>
                                    <span className="text-gold group-hover/box:border-gold border-b border-transparent text-[10px] tracking-widest uppercase transition-colors">
                                        Join Waiting List
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
