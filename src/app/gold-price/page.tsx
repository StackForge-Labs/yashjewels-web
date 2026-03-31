"use client";

import { PageHero } from "../_components/PageHero";
import { TrendingUp, TrendingDown, Clock, ArrowRight, Info } from "lucide-react";
import Link from "next/link";

const GOLD_PRICES = [
    { karat: "24K", name: "Pure Gold (999)", buy: "93,250,000", sell: "92,900,000", change: "+150,000", up: true },
    { karat: "22K", name: "Gold 916", buy: "85,530,000", sell: "85,200,000", change: "+120,000", up: true },
    { karat: "18K", name: "Gold 750", buy: "70,600,000", sell: "70,300,000", change: "-80,000", up: false },
    { karat: "14K", name: "Gold 585", buy: "54,500,000", sell: "54,250,000", change: "+50,000", up: true },
];

const HISTORY = [
    { date: "Mar 31", price: 93.2 },
    { date: "Mar 30", price: 93.0 },
    { date: "Mar 29", price: 92.5 },
    { date: "Mar 28", price: 92.8 },
    { date: "Mar 27", price: 91.5 },
    { date: "Mar 26", price: 91.8 },
    { date: "Mar 25", price: 91.0 },
    { date: "Mar 24", price: 90.5 },
    { date: "Mar 23", price: 90.8 },
    { date: "Mar 22", price: 91.2 },
];

export default function GoldPricePage() {
    const maxPrice = Math.max(...HISTORY.map((h) => h.price));
    const minPrice = Math.min(...HISTORY.map((h) => h.price));
    const range = maxPrice - minPrice;

    return (
        <>
            <PageHero
                title="Gold Price"
                subtitle="Daily gold rates for jewelry pricing. Prices are updated hourly from global markets."
                breadcrumbs={[{ label: "Gold Price" }]}
            />

            <section className="bg-white py-12 md:py-24 transition-colors dark:bg-dark-bg">
                <div className="container mx-auto px-4 lg:px-12">
                    {/* Last Updated */}
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 dark:bg-green-900/10">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                            <span className="text-xs font-bold text-green-700 dark:text-green-400">LIVE</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock size={14} />
                            Last updated: March 31, 2026 at 10:30 AM (GMT+7)
                        </div>
                    </div>

                    {/* Price Table */}
                    <div className="mb-16 overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-white/5">
                                    <th className="py-5 text-left text-[10px] font-bold tracking-widest text-gray-400 uppercase">Karat</th>
                                    <th className="py-5 text-left text-[10px] font-bold tracking-widest text-gray-400 uppercase">Type</th>
                                    <th className="py-5 text-right text-[10px] font-bold tracking-widest text-gray-400 uppercase">Buy Price (đ/tael)</th>
                                    <th className="py-5 text-right text-[10px] font-bold tracking-widest text-gray-400 uppercase">Sell Price (đ/tael)</th>
                                    <th className="py-5 text-right text-[10px] font-bold tracking-widest text-gray-400 uppercase">Change</th>
                                </tr>
                            </thead>
                            <tbody>
                                {GOLD_PRICES.map((row) => (
                                    <tr key={row.karat} className="border-b border-gray-50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/2">
                                        <td className="py-5">
                                            <span className="rounded-lg bg-gold/10 px-3 py-1.5 text-sm font-bold text-gold">{row.karat}</span>
                                        </td>
                                        <td className="py-5 text-sm font-medium text-gray-900 dark:text-white">{row.name}</td>
                                        <td className="py-5 text-right text-sm font-bold text-gray-900 dark:text-white">{row.buy}</td>
                                        <td className="py-5 text-right text-sm font-bold text-gray-900 dark:text-white">{row.sell}</td>
                                        <td className="py-5 text-right">
                                            <span className={`inline-flex items-center gap-1 text-sm font-bold ${row.up ? "text-green-500" : "text-red-500"}`}>
                                                {row.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                {row.change}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Simple Chart */}
                    <div className="mb-16">
                        <h2 className="mb-8 font-serif text-2xl text-gray-900 dark:text-white">10-Day Price Trend (24K)</h2>
                        <div className="rounded-2xl border border-gray-100 p-6 dark:border-white/5">
                            <div className="flex h-48 items-end gap-2 md:gap-4">
                                {HISTORY.map((h, i) => (
                                    <div key={i} className="flex flex-1 flex-col items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-500">{h.price}M</span>
                                        <div
                                            className="w-full rounded-t-lg bg-linear-to-t from-gold to-amber-300 transition-all hover:brightness-110"
                                            style={{ height: `${((h.price - minPrice) / range) * 100 + 20}%` }}
                                        />
                                        <span className="text-[9px] font-bold text-gray-400">{h.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* How pricing works */}
                    <div className="mb-16 rounded-2xl border border-gold/10 bg-gold/5 p-8 md:p-12">
                        <div className="flex items-start gap-4">
                            <Info size={24} className="text-gold mt-1 shrink-0" />
                            <div>
                                <h3 className="mb-4 font-serif text-xl text-gray-900 dark:text-white">How Jewelry Pricing Works</h3>
                                <div className="space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                    <p><strong className="text-gray-900 dark:text-white">Final Price</strong> = Gold Weight × Daily Gold Price + Gemstone Value + Craftsmanship Fee</p>
                                    <p>Gold price is determined each morning based on global market rates. When you add an item to your cart, the price is locked for <strong className="text-gray-900 dark:text-white">2 hours</strong>. If the gold price changes after that window, your cart will reflect the updated price.</p>
                                    <p>Our system automatically notifies you via a banner in your cart if any price has been adjusted, ensuring full transparency.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link href="/collections" className="bg-gold group inline-flex items-center gap-3 rounded-xl px-10 py-4 text-[12px] font-bold tracking-[0.3em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-105">
                            Shop With Current Prices <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
