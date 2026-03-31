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
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(2deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                @keyframes pulse-glow {
                    0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
                    70% { box-shadow: 0 0 0 20px rgba(212, 175, 55, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-pulse-glow {
                    animation: pulse-glow 2s infinite;
                }
            `}</style>

            {/* SECTION 1: HERO / BANNER */}
            <section className="relative h-[90vh] min-h-[750px] w-full bg-black overflow-hidden flex items-center">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 z-10 bg-linear-to-r from-black/95 via-black/80 to-black/30 dark:from-black/95 dark:via-black/80 dark:to-black/40" />
                    <img
                        src="https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg?auto=compress&cs=tinysrgb&w=1600"
                        alt="Hero Jewelry"
                        className="h-full w-full object-cover object-center opacity-70 transition-transform duration-[15s] ease-out hover:scale-105"
                    />
                </div>
                
                <div className="relative z-20 flex flex-col lg:flex-row h-full w-full items-center container mx-auto px-4 lg:px-12 pt-20">
                    {/* Hero Left Content */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center" data-aos="fade-up" data-aos-duration="1200">
                        <div className="text-gold mb-6 flex items-center gap-4">
                            <span className="bg-gold h-px w-12"></span>
                            <span className="text-xs font-bold tracking-[0.4em] text-white uppercase">The 2026 Edition</span>
                        </div>
                        <h2 className="mb-6 font-serif text-5xl leading-[1.15] text-white md:text-7xl drop-shadow-md">
                            Brilliance <span className="text-gold italic font-light">Defined</span>
                        </h2>
                        <p className="mb-10 max-w-lg text-base leading-relaxed font-light text-gray-300">
                            Discover our exquisite selection of high jewelry. Unparalleled craftsmanship meeting extraordinary earth-mined diamonds.
                        </p>
                        
                        {/* Scarcity / Sales Widget */}
                        <div className="mb-10 inline-block bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-linear-to-r from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="flex flex-col sm:flex-row gap-6 items-center relative z-10">
                                <div className="flex flex-col gap-2">
                                    <span className="flex items-center gap-2 text-gold font-bold text-sm tracking-widest uppercase">
                                        <Flame size={16} className="text-red-500 animate-pulse" /> Flash Event
                                    </span>
                                    <span className="text-white text-lg font-serif">Exclusive VIP Sale - 20% Off</span>
                                </div>
                                <div className="hidden sm:block w-px h-12 bg-white/20"></div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <span className="bg-black text-white text-xl font-bold rounded-lg w-10 h-10 flex items-center justify-center border border-white/10 shadow-inner">{String(timeLeft.hours).padStart(2, '0')}</span>
                                        <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Hrs</span>
                                    </div>
                                    <span className="text-white font-bold text-xl mt-1">:</span>
                                    <div className="flex flex-col items-center">
                                        <span className="bg-black text-white text-xl font-bold rounded-lg w-10 h-10 flex items-center justify-center border border-white/10 shadow-inner">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                        <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Min</span>
                                    </div>
                                    <span className="text-white font-bold text-xl mt-1">:</span>
                                    <div className="flex flex-col items-center">
                                        <span className="bg-black text-gold text-xl font-bold rounded-lg w-10 h-10 flex items-center justify-center border border-gold/30 shadow-inner animate-pulse-glow">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                        <span className="text-[10px] text-gold mt-1 uppercase tracking-widest">Sec</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                                    Only <strong className="text-white tracking-widest px-1">2 SLOTS</strong> remaining
                                </div>
                                <span className="text-gold tracking-widest uppercase font-bold text-[10px] cursor-pointer hover:underline cursor-pointer">Claim Yours &rarr;</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <button className="bg-white hover:bg-gold hover:text-white px-10 py-5 text-xs font-bold tracking-[0.2em] text-black uppercase transition-all duration-300">
                                Shop Collection
                            </button>
                            <button className="border-white/30 text-white hover:border-gold hover:text-gold border px-10 py-5 text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-3">
                                View Lookbook
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Hero Right Content - Floating Fancy Image */}
                    <div className="w-full lg:w-1/2 h-full flex items-center justify-center mt-12 lg:mt-0 relative" data-aos="zoom-in" data-aos-delay="300" data-aos-duration="1500">
                        <div className="relative animate-float w-full max-w-md">
                            {/* Decorative Elements */}
                            <div className="absolute -inset-10 bg-linear-to-br from-gold/20 to-transparent rounded-full blur-3xl opacity-50"></div>
                            <div className="absolute -inset-4 border border-gold/30 rounded-full animate-[spin_20s_linear_infinite] border-dashed"></div>
                            <div className="absolute -inset-8 border border-white/10 rounded-full animate-[spin_30s_linear_infinite_reverse]"></div>
                            
                            {/* The Floating Image from Reference */}
                            <img 
                                src="https://cashion.vn/wp-content/uploads/2024/01/kim-cuong-6-51-6-54-vvs1-f-bch2335747-1-768x768.jpg" 
                                alt="Exquisite Diamond Ring" 
                                className="relative z-10 w-full h-auto rounded-full object-cover shadow-[0_30px_60px_rgba(0,0,0,0.6)] mix-blend-lighten border-4 border-white/5"
                            />
                            
                            {/* Price Tag Floating attached to image */}
                            <div className="absolute -right-4 top-1/4 bg-white dark:bg-black p-3 rounded-xl shadow-2xl z-20 animate-bounce delay-100 border border-gold/30">
                                <span className="block text-[9px] text-gray-500 tracking-widest uppercase font-bold mb-1">GIA Certified</span>
                                <span className="text-gray-900 dark:text-white font-serif text-lg">$9,270</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Gold Price Ticker */}
                <div className="absolute bottom-0 w-full bg-black/70 backdrop-blur-lg border-t border-white/10 p-3 z-30" data-aos="fade-in" data-aos-delay="1000">
                    <div className="container mx-auto flex items-center justify-center gap-8 text-[11px] font-bold tracking-widest text-white uppercase overflow-hidden">
                        <span className="text-gold flex items-center gap-2">
                             <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            Live Market Prices:
                        </span>
                        {Object.entries(GOLD_PRICE).map(([k, v]) => (
                            <span key={k} className="hidden sm:inline">
                                {k}: <span className="text-gray-300 ml-1">{v}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 2: SHOP BY CATEGORY (Bento Grid) */}
            <section className="bg-white py-24 dark:bg-[#030303] transition-colors duration-500">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.3em] uppercase">Infinite Choices</span>
                        <h2 className="font-serif text-3xl text-gray-900 dark:text-white lg:text-4xl">Shop By Category</h2>
                    </div>
                    {/* Bento Grid */}
                    <div className="grid h-auto md:h-[600px] grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="group relative col-span-1 md:col-span-2 md:row-span-2 h-[300px] md:h-full cursor-pointer overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-900" data-aos="fade-right">
                            <img src="https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=800" className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" alt="Engagement Rings" loading="lazy" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end opacity-90 transition-opacity">
                                <span className="text-white font-serif text-2xl lg:text-3xl mb-2">Engagement Rings</span>
                                <span className="text-gold text-[10px] uppercase tracking-[0.2em] font-bold group-hover:translate-x-2 transition-transform">Discover Tokens of Love &rarr;</span>
                            </div>
                        </div>
                        <div className="group relative col-span-1 md:col-span-2 h-[250px] md:h-[292px] cursor-pointer overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-900" data-aos="fade-left" data-aos-delay="100">
                            <img src="https://images.pexels.com/photos/1733604/pexels-photo-1733604.jpeg?auto=compress&cs=tinysrgb&w=800" className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" alt="Necklaces" loading="lazy" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end opacity-90">
                                <span className="text-white font-serif text-2xl lg:text-3xl mb-2">Necklaces & Masterpieces</span>
                            </div>
                        </div>
                        <div className="group relative col-span-1 h-[250px] md:h-[292px] cursor-pointer overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-900" data-aos="fade-up" data-aos-delay="200">
                            <img src="https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400" className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" alt="Earrings" loading="lazy" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end opacity-90">
                                <span className="text-white font-serif text-xl mb-1">Diamond Earrings</span>
                            </div>
                        </div>
                        <div className="group relative col-span-1 h-[250px] md:h-[292px] cursor-pointer overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-900" data-aos="fade-up" data-aos-delay="300">
                            <img src="https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400" className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" alt="Bracelets" loading="lazy" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end opacity-90">
                                <span className="text-white font-serif text-xl mb-1">Luxury Bracelets</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: FEATURED COLLECTION */}
            <section className="bg-gray-50 py-24 dark:bg-[#0a0a0a] transition-colors duration-500 overflow-hidden">
                <div className="container mx-auto px-4 lg:px-12 flex flex-col lg:flex-row items-center gap-16">
                    <div className="w-full lg:w-5/12" data-aos="fade-right">
                        <span className="text-gold mb-6 block text-[10px] font-bold tracking-[0.4em] uppercase">High Jewelry</span>
                        <h2 className="mb-8 font-serif text-4xl leading-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                            The Imperial <br/><span className="italic font-light text-gray-500">Collection</span>
                        </h2>
                        <p className="mb-10 text-base leading-relaxed font-light text-gray-600 dark:text-gray-400">
                            A perfect intersection between centuries-old craftsmanship and the raw beauty of the world's most scarce diamonds. Every masterpiece is an impeccable statement of class.
                        </p>
                        <button className="bg-gray-900 text-white dark:bg-white dark:text-black px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gold dark:hover:bg-gold dark:hover:text-white transition-colors duration-300">
                            View Details 
                        </button>
                    </div>
                    <div className="w-full lg:w-7/12 relative h-[500px] lg:h-[650px] rounded-2xl overflow-hidden shadow-2xl" data-aos="fade-left" data-aos-delay="200">
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />
                        <img src="https://images.pexels.com/photos/2253818/pexels-photo-2253818.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Featured Collection" className="h-full w-full object-cover transition-transform duration-[3s] hover:scale-110" />
                        <div className="absolute bottom-8 left-8 right-8 z-20 flex gap-6 overflow-x-auto custom-scrollbar pb-4">
                            <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-xl p-4 flex gap-4 min-w-[250px] items-center cursor-pointer hover:-translate-y-2 transition-transform shadow-lg border border-white/20 dark:border-white/10">
                                <div className="h-14 w-14 rounded-lg overflow-hidden shrink-0"><img src="https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=100" className="h-full w-full object-cover"/></div>
                                <div><h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">VVS1 Diamond</h4><p className="text-xs text-gold font-bold">$12,000</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: NEW ARRIVALS */}
            <section className="bg-white py-24 dark:bg-[#030303] transition-colors duration-500">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-4" data-aos="fade-up">
                        <div>
                            <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.3em] uppercase">The Modern Essentials</span>
                            <h2 className="font-serif text-3xl text-gray-900 dark:text-white lg:text-4xl">Latest Arrivals</h2>
                        </div>
                        <button className="border-b border-gray-900 dark:border-white pb-1 text-xs font-bold tracking-[0.2em] uppercase transition-colors hover:text-gold hover:border-gold items-center gap-2 text-gray-900 dark:text-white">View Entire Collection &rarr;</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {diamonds.slice(0, 4).map((d, i) => (
                            <div data-aos="fade-up" data-aos-delay={i * 100} key={d.sku}>
                            <ProductCard
                                sku={d.sku}
                                name={d.name}
                                category="New Collection"
                                original={d.original}
                                sale={d.sale}
                                discount={d.discount}
                                image1={"https://tamluxury.vn/wp-content/uploads/2026/01/Thiet-ke-nam-2026-Nhan-nu-kim-cuong-Organ-Ma-SP-NNU1618-scaled.jpg"}
                                image2={"https://tamluxury.vn/wp-content/uploads/2025/12/Nhan-nu-kim-cuong-thien-nhien-Mia-Ma-SP-NNU1544-scaled.jpg"}
                                badge="NEW"
                            />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 5: BEST SELLERS */}
            <section className="bg-gray-50 py-24 dark:bg-[#080808] transition-colors duration-500">
                <div className="container mx-auto px-4 lg:px-12 text-center mb-16" data-aos="fade-up">
                    <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.3em] uppercase">Signature Selection</span>
                    <h2 className="font-serif text-3xl text-gray-900 dark:text-white lg:text-4xl">Best Sellers</h2>
                </div>
                <div className="container mx-auto px-4 lg:px-12">
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {diamonds.slice(4, 8).map((d, i) => (
                            <div data-aos="fade-up" data-aos-delay={i * 100} key={d.sku}>
                            <ProductCard
                                sku={d.sku}
                                name={d.name.replace("Diamond", "Pendant")}
                                category="Signature"
                                original={d.original}
                                sale={d.sale}
                                discount={d.discount}
                                image1={"https://tamluxury.vn/wp-content/uploads/2026/03/Thiet-ke-mat-day-chuyen-Halo-tron-dac-biet-Melody-Ma-MD878-1-scaled.jpg"}
                                image2={"https://tamluxury.vn/wp-content/uploads/2026/03/Mat-day-chuyen-kim-cuong-thien-nhien-Milkway-Ma-MD773-1-scaled.jpg"}
                                badge="HOT"
                            />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 6 & 7: HIS & HERS (Women's & Men's Split Layout) */}
            <section className="bg-white dark:bg-[#030303] transition-colors duration-500">
                {/* Women's Component */}
                <div className="flex flex-col xl:flex-row">
                    <div className="xl:w-1/2 relative min-h-[500px] overflow-hidden group">
                        <img src="https://images.pexels.com/photos/1733604/pexels-photo-1733604.jpeg?auto=compress&cs=tinysrgb&w=1200" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" alt="Women Jewelry" />
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-8">
                            <span className="text-gold text-[10px] font-bold tracking-[0.4em] uppercase mb-4" data-aos="fade-down">Radiant Elegance</span>
                            <h2 className="text-white font-serif text-4xl lg:text-6xl mb-8" data-aos="fade-up">Women's Jewelry</h2>
                            <button className="bg-white text-black px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-white transition-colors" data-aos="zoom-in" data-aos-delay="200">Discover</button>
                        </div>
                    </div>
                    <div className="xl:w-1/2 p-8 lg:p-16 flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
                             {diamonds.slice(0, 2).map((d) => (
                                <ProductCard key={d.sku} sku={d.sku} name={"Premium Women's Ring " + d.sku} category="Women's Line" original={d.original} sale={d.sale} discount={d.discount} image1="https://tamluxury.vn/wp-content/uploads/2025/11/Xu-huong-2025-Nhan-nu-kim-cuong-Dia-NNU1480-scaled.jpg" image2="https://tamluxury.vn/wp-content/uploads/2025/11/Nhan-nu-kim-cuong-xuat-sac-Queenie-Ma-NNU1533-scaled.jpg" />
                             ))}
                        </div>
                    </div>
                </div>
                {/* Men's Component */}
                <div className="flex flex-col-reverse xl:flex-row">
                     <div className="xl:w-1/2 p-8 lg:p-16 flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
                             {diamonds.slice(2, 4).map((d) => (
                                <ProductCard key={d.sku} sku={d.sku} name={"Majestic Men's Ring " + d.sku} category="Men's Line" original={d.original} sale={d.sale} discount={d.discount} image1="https://tamluxury.vn/wp-content/uploads/2025/11/3.NHAN-NAM-POST-WEB-UP-LAI-SIZE-NHO.jpg" image2="https://tamluxury.vn/wp-content/uploads/2025/11/3.NHAN-NAM-POST-WEB-UP-LAI-SIZE-NHO.jpg" />
                             ))}
                        </div>
                    </div>
                    <div className="xl:w-1/2 relative min-h-[500px] overflow-hidden group">
                        <img src="https://images.pexels.com/photos/298859/pexels-photo-298859.jpeg?auto=compress&cs=tinysrgb&w=1200" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" alt="Men Jewelry" />
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-8">
                            <span className="text-gold text-[10px] font-bold tracking-[0.4em] uppercase mb-4" data-aos="fade-down">Sophisticated Power</span>
                            <h2 className="text-white font-serif text-4xl lg:text-6xl mb-8" data-aos="fade-up">Men's Jewelry</h2>
                            <button className="bg-white text-black px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-white transition-colors" data-aos="zoom-in" data-aos-delay="200">Discover</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 8: BRIDAL PARALLAX */}
            <section className="relative py-40 overflow-hidden bg-black/80">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.pexels.com/photos/2253818/pexels-photo-2253818.jpeg?auto=compress&cs=tinysrgb&w=1600" className="w-full h-full object-cover opacity-60 fixed-bg" alt="Bridal" />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                </div>
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <span className="text-gold mb-4 inline-block text-[10px] font-bold tracking-[0.4em] uppercase" data-aos="fade-down">The Wedding Sanctuary</span>
                    <h2 className="mb-6 font-serif text-5xl lg:text-7xl text-white" data-aos="fade-up">Bridal Collection</h2>
                    <p className="max-w-xl mx-auto text-gray-300 font-light mb-12 text-lg" data-aos="fade-up" data-aos-delay="100">The beginning of eternal happiness. Meticulously crafted wedding rings exclusively for your grand momentous day.</p>
                    <button className="bg-white text-black px-12 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-gold/50" data-aos="zoom-in" data-aos-delay="200">
                        Enter Pavilion
                    </button>
                </div>
            </section>

            {/* SECTION 9: JOURNAL & EDUCATION */}
            <section className="bg-white py-24 dark:bg-[#030303] transition-colors duration-500">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-4" data-aos="fade-up">
                        <div>
                            <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.3em] uppercase">Magazine & Education</span>
                            <h2 className="font-serif text-3xl text-gray-900 dark:text-white lg:text-4xl">Journal Spotlight</h2>
                        </div>
                        <button className="border-b border-gray-900 dark:border-white pb-1 text-xs font-bold tracking-[0.2em] uppercase transition-colors hover:text-gold hover:border-gold items-center gap-2 text-gray-900 dark:text-white">Read All Articles &rarr;</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[{title: "The First-Time Diamond Buyer's Guide (The 4Cs)", img: "https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg"}, {title: "How to maintain your 18K Gold Jewelry brilliantly", img: "https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg"}, {title: "Platinum Wedding Band Trends for Fall 2026", img: "https://images.pexels.com/photos/3266700/pexels-photo-3266700.jpeg"}].map((post, i) => (
                            <div key={i} className="group cursor-pointer" data-aos="fade-up" data-aos-delay={i * 150}>
                                <div className="overflow-hidden rounded-xl h-64 mb-6 bg-gray-100 dark:bg-zinc-900">
                                    <img src={post.img + "?auto=compress&cs=tinysrgb&w=600"} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" alt="Blog" loading="lazy" />
                                </div>
                                <span className="text-gray-400 dark:text-gray-500 text-[10px] tracking-widest uppercase font-bold mb-3 block">Diamond Knowledge</span>
                                <h3 className="font-serif text-xl tracking-wide text-gray-900 dark:text-gray-100 group-hover:text-gold transition-colors">{post.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 10: STORES (Luxurious Floating Cards) */}
            <section className="relative py-32 bg-gray-50 dark:bg-[#050505] transition-colors duration-500">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.4em] uppercase">Global Presence</span>
                        <h2 className="font-serif text-4xl text-gray-900 dark:text-white lg:text-5xl">
                            Discover <span className="italic font-light text-gray-500">Our Boutiques</span>
                        </h2>
                        <p className="mt-4 text-gray-500 font-light max-w-2xl mx-auto">
                            Step into a world of ultimate luxury. Experience world-class personalized service provided by our expert jewelry consultants in our flagship sanctuaries.
                        </p>
                    </div>

                    <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[850px] md:h-[600px] group">
                        {/* Background Image with Parallax effect */}
                        <div className="absolute inset-0">
                            <img src="https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=1600" className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" alt="Flagship Boutique" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/10 dark:from-black dark:via-black/70 dark:to-black/30" />
                        </div>

                        {/* Store Cards Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 w-full">
                                
                                {/* Vietnam Flagship */}
                                <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 p-8 rounded-2xl hover:bg-white/20 hover:border-gold/50 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer" data-aos="fade-up" data-aos-delay="100">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <span className="text-gold text-[9px] tracking-widest uppercase font-bold mb-1 block">Flagship Store</span>
                                            <h3 className="text-2xl font-serif text-white">Ho Chi Minh</h3>
                                        </div>
                                        <div className="bg-gold/20 p-2 rounded-full">
                                            <MapPin className="text-gold w-5 h-5" />
                                        </div>
                                    </div>
                                    <ul className="space-y-4 mb-8 text-sm text-gray-300 font-light">
                                        <li className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                                            <span>Unit L1-01, Saigon Centre,<br/>65 Le Loi, District 1</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                                            <span>Mon - Sun: 09:30 - 22:00</span>
                                        </li>
                                    </ul>
                                    <button className="w-full border border-white/30 py-3 text-xs tracking-widest text-white uppercase hover:bg-white hover:text-black transition-colors">Book Appointment</button>
                                </div>

                                {/* Hanoi Boutique */}
                                <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 p-8 rounded-2xl hover:bg-white/20 hover:border-gold/50 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer" data-aos="fade-up" data-aos-delay="200">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <span className="text-gold text-[9px] tracking-widest uppercase font-bold mb-1 block">Grand Boutique</span>
                                            <h3 className="text-2xl font-serif text-white">Hanoi</h3>
                                        </div>
                                        <div className="bg-gold/20 p-2 rounded-full">
                                            <MapPin className="text-gold w-5 h-5" />
                                        </div>
                                    </div>
                                    <ul className="space-y-4 mb-8 text-sm text-gray-300 font-light">
                                        <li className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                                            <span>Lotte Center Hanoi,<br/>54 Lieu Giai, Ba Dinh</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                                            <span>Mon - Sun: 10:00 - 21:00</span>
                                        </li>
                                    </ul>
                                    <button className="w-full border border-white/30 py-3 text-xs tracking-widest text-white uppercase hover:bg-white hover:text-black transition-colors">Book Appointment</button>
                                </div>

                                {/* Singapore Concept */}
                                <div className="hidden lg:flex flex-col justify-center items-center text-center bg-transparent border-2 border-dashed border-white/20 p-8 rounded-2xl hover:border-gold/50 transition-colors duration-300 cursor-pointer group/box" data-aos="fade-up" data-aos-delay="300">
                                    <div className="w-16 h-16 rounded-full border border-gold/50 flex items-center justify-center mb-6 group-hover/box:bg-gold/10 transition-colors">
                                        <ArrowRight className="text-gold w-6 h-6 animate-pulse" />
                                    </div>
                                    <h3 className="text-xl font-serif text-white mb-2">Singapore Pavilion</h3>
                                    <p className="text-sm text-gray-400 font-light mb-6">Opening Winter 2026 at Marina Bay Sands.</p>
                                    <span className="text-[10px] text-gold tracking-widest uppercase border-b border-transparent group-hover/box:border-gold transition-colors">Join Waiting List</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
