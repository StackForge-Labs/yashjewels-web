"use client";

import { useEffect, useState } from "react";
import { PageHero } from "../_components/PageHero";
import {
    TrendingUp,
    TrendingDown,
    Clock,
    ArrowRight,
    Gem,
    Coins,
    Globe,
    RefreshCcw,
    Activity,
    History,
    Star,
    Zap,
    GemIcon,
    MapPin,
    Search,
    ChevronDown,
    Award,
    Info,
    LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
    fetchGoldPrice,
    fetchForexRates,
    getDiamondBenchmarks,
    getBrandPrices,
    type GoldPrice,
    type ChartData,
    type ForexRate,
    type DiamondBenchmark,
    type BrandPrice,
} from "@/data/market-api";

// --- REFINED COMPONENTS ---

const SectionHeader = ({ label, title, center = true }: { label: string; title: string; center?: boolean }) => (
    <div className={`mb-12 ${center ? "text-center" : ""}`} data-aos="fade-up">
        <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.4em] uppercase">{label}</span>
        <h2 className="font-serif text-3xl text-gray-900 md:text-4xl dark:text-white">{title}</h2>
    </div>
);

const PriceCard = ({ gold }: { gold: GoldPrice }) => (
    <div className="hover:border-gold/30 dark:bg-dark-card group rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:shadow-xl dark:border-white/5">
        <div className="mb-4 flex items-center justify-between">
            <span className="text-gold text-[10px] font-bold tracking-widest uppercase opacity-80">{gold.name}</span>
            <div className="group-hover:bg-gold/10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 transition-colors dark:bg-white/5">
                <Zap size={14} className="text-gray-400 group-hover:text-gold" />
            </div>
        </div>
        <div className="mb-4">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Live Spot</p>
            <h4 className="text-2xl font-bold tracking-tighter text-gray-900 transition-colors group-hover:text-gold dark:text-white">
                ${gold.buy.toLocaleString()}
            </h4>
        </div>
        <div className="flex items-center justify-between border-t border-gray-50 pt-4 dark:border-white/5">
            <div className={`flex items-center gap-1 text-[11px] font-bold ${gold.dayChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                {gold.dayChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {gold.dayChange >= 0 ? "+" : ""}{gold.dayChangePercent}%
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase opacity-60">Verified</span>
        </div>
    </div>
);

// --- MAIN PAGE ---

export default function MarketInsightsPage() {
    const [activeTab, setActiveTab] = useState<"gold" | "forex" | "diamonds">("gold");
    const [goldData, setGoldData] = useState<{ current: GoldPrice; variations: GoldPrice[]; history: ChartData[] } | null>(null);
    const [forexData, setForexData] = useState<ForexRate[]>([]);
    const [diamondData, setDiamondData] = useState<DiamondBenchmark[]>([]);
    const [brandPrices, setBrandPrices] = useState<BrandPrice[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());

    const refreshData = async () => {
        setLoading(true);
        const [gold, forex, diamonds, brands] = await Promise.all([
            fetchGoldPrice(),
            fetchForexRates(),
            getDiamondBenchmarks(),
            getBrandPrices(),
        ]);
        setGoldData(gold);
        setForexData(forex);
        setDiamondData(diamonds);
        setBrandPrices(brands);
        setLastRefresh(new Date().toLocaleTimeString());
        setLoading(false);
    };

    useEffect(() => {
        refreshData();
        const interval = setInterval(refreshData, 300000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dark:bg-dark-bg font-sans transition-colors">
            <PageHero
                title="Market Insights"
                subtitle="Professional real-time tracking for international gold, exchange rates, and diamond benchmarks."
                breadcrumbs={[{ label: "Market Insights" }]}
            />

            <section className="bg-white py-12 md:py-24 transition-colors dark:bg-[#030303]">
                <div className="container mx-auto px-4 lg:px-12">
                    
                    {/* Category Selector (Refined Tabs) */}
                    <div className="mx-auto mb-20 flex max-w-2xl flex-wrap justify-center gap-2 md:gap-4" data-aos="fade-up">
                        {[
                            { id: "gold", label: "Gold Market", icon: Coins },
                            { id: "forex", label: "Forex Rates", icon: Globe },
                            { id: "diamonds", label: "Diamond Indices", icon: Gem },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 rounded-xl px-6 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all ${
                                    activeTab === tab.id
                                        ? "bg-gold shadow-gold/20 text-white shadow-lg scale-105"
                                        : "border border-gray-100 text-gray-500 hover:border-gold/30 dark:border-white/10 dark:text-gray-400"
                                }`}
                            >
                                <tab.icon size={16} /> {tab.label}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === "gold" && (
                            <motion.div
                                key="gold"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-24"
                            >
                                {/* SECTION 1: LIVE GOLD RATES */}
                                <div>
                                    <SectionHeader label="Live Pulse" title="Real-time Gold Spot Rates" />
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                        {goldData?.variations.map((v, i) => (
                                            <div data-aos="fade-up" data-aos-delay={i * 100} key={v.name}>
                                                <PriceCard gold={v} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 flex items-center justify-center gap-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                        <Clock size={14} className="text-gold" />
                                        Updated: {lastRefresh}
                                        <button onClick={refreshData} className="ml-2 hover:text-gold transition-colors">
                                            <RefreshCcw size={12} className={loading ? "animate-spin" : ""} />
                                        </button>
                                    </div>
                                </div>

                                {/* SECTION 2: ANALYTICS & TRENDS */}
                                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                                    <div className="lg:col-span-2" data-aos="fade-right">
                                        <SectionHeader label="Analysis" title="Gold Market Trends" center={false} />
                                        <div className="hover:border-gold/20 dark:bg-dark-card rounded-2xl border border-gray-100 bg-white p-8 transition-all dark:border-white/5">
                                            <div className="mb-10 flex items-center justify-between">
                                                <div className="flex items-center gap-6">
                                                   <div className="flex items-center gap-2">
                                                       <div className="h-3 w-3 rounded-full bg-gold" />
                                                       <span className="text-[10px] font-bold text-gray-400 uppercase">Buying</span>
                                                   </div>
                                                   <div className="flex items-center gap-2">
                                                       <div className="h-3 w-3 rounded-full bg-gray-200 dark:bg-white/10" />
                                                       <span className="text-[10px] font-bold text-gray-400 uppercase">Selling</span>
                                                   </div>
                                                </div>
                                                <div className="text-[10px] font-bold text-gold uppercase tracking-widest">Global Terminal</div>
                                            </div>
                                            <div className="h-[350px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={goldData?.history || []}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888810" />
                                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#999" }} dy={10} />
                                                        <YAxis domain={["dataMin - 10", "dataMax + 10"]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#999" }} dx={-10} />
                                                        <Tooltip contentStyle={{ borderRadius: "12px", border: "none", background: "#111", color: "#fff", fontSize: "11px" }} />
                                                        <Line type="monotone" dataKey="buy" stroke="#d4af37" strokeWidth={3} dot={{ r: 5, fill: "#d4af37", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 7 }} />
                                                        <Line type="monotone" dataKey="sell" stroke="#e5e7eb" strokeWidth={2} strokeDasharray="5 5" opacity={0.5} dot={false} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center" data-aos="fade-left">
                                        <div className="bg-gold/5 dark:bg-white/2 rounded-2xl border border-gold/10 p-10">
                                            <Award size={32} className="text-gold mb-6" />
                                            <h3 className="mb-4 font-serif text-2xl text-gray-900 dark:text-white">Expert Advisory</h3>
                                            <p className="mb-8 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                                The market shows high resilience. International spot rates suggest a strong accumulation zone. We recommend prioritizing 24K pure gold for direct wealth preservation.
                                            </p>
                                            <Link href="/contact" className="text-gold inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase transition-transform hover:translate-x-2">
                                                Consult an Expert &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION 3: TRUSTED ENTITY COMPARISON */}
                                <div>
                                    <SectionHeader label="Partnerships" title="Trusted Institutional Benchmarks" />
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                        {brandPrices.map((brand, i) => (
                                            <div 
                                                key={brand.id} 
                                                data-aos="fade-up" 
                                                data-aos-delay={i * 100}
                                                className={`hover:border-gold/30 dark:bg-dark-card group rounded-2xl border p-8 transition-all hover:shadow-xl dark:border-white/5 ${brand.id === 'yash' ? 'border-gold/20 bg-gold/5' : 'bg-white border-gray-100'}`}
                                            >
                                                <div className="mb-8 flex items-center justify-between">
                                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all group-hover:scale-110 ${brand.id === 'yash' ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'bg-gray-50 dark:bg-white/5 text-gray-400'}`}>
                                                        {brand.logo === "Star" ? <Star size={20} /> : brand.logo === "Globe" ? <Globe size={20} /> : <Coins size={20} />}
                                                    </div>
                                                    <span className={`text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${brand.status === 'Live' ? 'bg-green-500/10 text-green-500' : 'bg-gray-400/10 text-gray-400'}`}>
                                                        {brand.status}
                                                    </span>
                                                </div>
                                                <h4 className="text-gold mb-1 text-[11px] font-bold tracking-widest uppercase">{brand.name}</h4>
                                                <div className="mb-6 flex flex-col gap-1">
                                                    <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${brand.buy.toLocaleString()}</span>
                                                    <p className="text-[10px] font-bold text-gray-400 opacity-60 uppercase tracking-tighter">Premium Collection Access</p>
                                                </div>
                                                <div className="flex border-t border-gray-50 pt-4 dark:border-white/5">
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Spread: ${(brand.sell - brand.buy).toFixed(1)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "forex" && (
                            <motion.div
                                key="forex"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                            >
                                <SectionHeader label="Currencies" title="Global Exchange Terminals" />
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {forexData.map((fx, i) => (
                                        <div 
                                            key={fx.code} 
                                            data-aos="fade-up" 
                                            data-aos-delay={i * 50}
                                            className="hover:border-gold/30 dark:bg-dark-card group flex items-center justify-between rounded-xl border border-gray-100 bg-white p-6 transition-all dark:border-white/5"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-2xl">{fx.flag}</span>
                                                <div>
                                                    <h4 className="text-gold text-xs font-bold tracking-widest uppercase">{fx.code}</h4>
                                                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{fx.name}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {fx.rate >= 100 ? Math.round(fx.rate).toLocaleString() : fx.rate.toFixed(4)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "diamonds" && (
                            <motion.div
                                key="diamonds"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-20"
                            >
                                <div>
                                    <SectionHeader label="Benchmarks" title="High Jewelry Diamond Indices" />
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {diamondData.map((d, i) => (
                                            <div 
                                                key={i} 
                                                data-aos="fade-up" 
                                                data-aos-delay={i * 100}
                                                className="hover:border-gold/30 dark:bg-dark-card group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 transition-all hover:shadow-xl dark:border-white/5"
                                            >
                                                <div className="mb-6 flex items-center justify-between">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold transition-transform group-hover:scale-110">
                                                        <GemIcon size={24} />
                                                    </div>
                                                    <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${d.trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                        {d.trend === 'up' ? 'Appreciating' : 'Adjusting'}
                                                    </span>
                                                </div>
                                                <h4 className="text-gold mb-1 text-xs font-bold tracking-[0.2em] uppercase">{d.shape} Diamond</h4>
                                                <p className="mb-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-60">
                                                    {d.carat}CT • {d.color} • {d.clarity} • {d.cut}
                                                </p>
                                                <div className="flex items-end justify-between border-t border-gray-50 pt-6 dark:border-white/5">
                                                    <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">${d.price.toLocaleString()}</span>
                                                    <span className={`text-[10px] font-bold ${d.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                                                        {d.change >= 0 ? "+" : ""}{d.change} USD
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* EDUCATIONAL CTA */}
                                <div className="bg-dark-bg group relative overflow-hidden rounded-[2.5rem] p-12 text-white shadow-2xl" data-aos="fade-up">
                                    <div className="pointer-events-none absolute right-0 top-0 opacity-10 transition-transform duration-1000 group-hover:scale-110 translate-x-1/4 -translate-y-1/4">
                                        <GemIcon size={400} />
                                    </div>
                                    <div className="relative z-10 max-w-xl">
                                        <span className="text-gold mb-6 block text-[10px] font-bold tracking-[0.4em] uppercase">Collector's Guidance</span>
                                        <h3 className="mb-6 font-serif text-3xl md:text-4xl text-white uppercase sm:leading-tight">The Art of <br /> Investing in Diamonds</h3>
                                        <p className="mb-10 text-base font-light leading-relaxed text-gray-400">
                                            A diamond is more than jewelry; it is a portable legacy. Our benchmarks are aggregated from GIA and IGI certified global portfolios to ensure you are informed on the market's pulse before your next selection.
                                        </p>
                                        <Link href="/diamond-guide" className="hover:bg-gold inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 text-[12px] font-bold tracking-[0.3em] text-black uppercase transition-all hover:text-white">
                                            Read Our Buyer's Guide <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* FINAL CTA */}
                    <div className="mt-32 text-center" data-aos="fade-up">
                         <span className="text-gold mb-6 block text-[10px] font-bold tracking-[0.4em] uppercase">Luxury Destination</span>
                         <h2 className="mb-10 font-serif text-3xl text-gray-900 dark:text-white">Curate Your Personal <span className="font-light text-gray-500 italic">Portfolio</span></h2>
                         <Link href="/collections" className="group dark:hover:bg-gold bg-gray-900 px-12 py-5 text-xs font-bold tracking-[0.3em] text-white uppercase transition-all hover:shadow-2xl dark:bg-white dark:text-black dark:hover:text-white">
                            Explore Collections <ArrowRight size={20} className="inline ml-3 transition-transform group-hover:translate-x-2" />
                         </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
