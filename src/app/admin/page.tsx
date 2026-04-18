"use client";

import { useEffect, useState } from "react";
import { DollarSign, ArrowUpRight, Users, CreditCard, Bell, Package, TrendingUp, ChevronRight, Calendar, Star, Store, Crown, RefreshCw } from "lucide-react";
import Link from "next/link";
import StatCard from "./_components/StatCard";
import RecentOrders from "./_components/RecentOrders";
import dynamic from "next/dynamic";
import { getDashboardStatsApi } from "@/services/admin.service";
import { goldRateService, GoldRateSnapshot } from "@/services/gold-rate.service";
import { formatCurrency } from "@/lib/utils";

const RevenueChart = dynamic(() => import("./_components/charts/RevenueChart"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full animate-pulse rounded-3xl bg-gray-100/50 dark:bg-[#1a1a1a]" />,
});
const SalesByCategoryChart = dynamic(() => import("./_components/charts/SalesByCategoryChart"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full animate-pulse rounded-3xl bg-gray-100/50 dark:bg-[#1a1a1a]" />,
});

type TimeRange = "today" | "week" | "month" | "year";

interface InventoryAlert {
    productName: string;
    styleCode: string;
    stockQuantity: number;
    status: string;
}

interface DashboardStats {
    totalRevenue: number;
    revenueTrend: number;
    newUsers: number;
    usersTrend: number;
    totalOrders: number;
    ordersTrend: number;
    avgOrderValue: number;
    aovTrend: number;
    recentOrders: any[];
    inventoryAlerts: InventoryAlert[];
}

export default function AdminDashboardPage() {
    const [range, setRange] = useState<TimeRange>("month");
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [goldRate, setGoldRate] = useState<GoldRateSnapshot | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsRes, goldRes] = await Promise.all([
                getDashboardStatsApi(range),
                goldRateService.getSnapshot()
            ]);
            if (statsRes.success) setStats(statsRes.data);
            setGoldRate(goldRes);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [range]);

    if (loading && !stats) {
        return <div className="flex h-96 items-center justify-center font-plus-jakarta text-gray-500 animate-pulse">Loading dashboard metrics...</div>;
    }

    const s = stats || {
        totalRevenue: 0, revenueTrend: 0,
        newUsers: 0, usersTrend: 0,
        totalOrders: 0, ordersTrend: 0,
        avgOrderValue: 0, aovTrend: 0,
        recentOrders: [], inventoryAlerts: []
    };

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="font-plus-jakarta text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Overview</h1>
                    <p className="mt-2 font-plus-jakarta text-sm font-medium text-gray-400 dark:text-gray-500">Real-time metrics and performance insights for Maison de Yash.</p>
                </div>
                
                <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-1.5 shadow-sm border border-gray-100 dark:border-gray-800 dark:bg-[#111]">
                    <Calendar className="ml-2 h-4 w-4 text-gray-400" />
                    {(["today", "week", "month", "year"] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setRange(t)}
                            className={`rounded-lg px-4 py-1.5 font-plus-jakarta text-xs font-bold capitalize transition-all ${
                                range === t ? "bg-white text-gray-900 shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-[#252525] dark:text-white" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Core Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={formatCurrency(s.totalRevenue)} icon={DollarSign} trend={{ value: s.revenueTrend, isPositive: s.revenueTrend > 0 }} />
                <StatCard title="New Signups" value={s.newUsers} icon={Users} trend={{ value: s.usersTrend, isPositive: s.usersTrend > 0 }} />
                <StatCard title="Orders Placed" value={s.totalOrders} icon={CreditCard} trend={{ value: s.ordersTrend, isPositive: s.ordersTrend > 0 }} />
                <StatCard title="Avg. Order Value" value={formatCurrency(s.avgOrderValue)} icon={ArrowUpRight} trend={{ value: s.aovTrend, isPositive: s.aovTrend > 0 }} />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                    <RevenueChart range={range} />
                </div>
                <div className="xl:col-span-1 flex flex-col gap-6">
                    <SalesByCategoryChart range={range} />
                    
                    {/* Live Gold Rate Focus */}
                    <div className="flex flex-col gap-2 rounded-2xl border border-amber-200/60 bg-gradient-to-bl from-amber-50 to-yellow-50 p-5 dark:border-amber-800/30 dark:from-amber-900/20 dark:to-yellow-900/10 h-full justify-between">
                        <div className="flex items-center justify-between">
                            <h3 className="font-plus-jakarta text-xs font-bold text-amber-900 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-amber-500" /> Live Gold Rate</h3>
                            <button onClick={loadData} className="flex items-center gap-1.5 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 hover:scale-105 transition-transform">
                                <RefreshCw className={`h-2.5 w-2.5 ${loading ? "animate-spin" : ""}`} /> Refresh
                            </button>
                        </div>
                        <div>
                            <p className="font-plus-jakarta text-3xl font-bold text-amber-700 dark:text-amber-500 mt-2">
                                {goldRate ? goldRate.rate24kPerGram.toLocaleString() : "---"} 
                                <span className="ml-1 text-lg text-amber-600/60">VND</span>
                            </p>
                            <p className="font-plus-jakarta text-xs font-medium text-amber-600/80">per gram (24K SJC)</p>
                        </div>
                        <Link href="/admin/gold-rates" className="mt-2 text-[10px] font-bold text-amber-600 hover:text-amber-700 dark:text-amber-500 flex items-center gap-1 group uppercase tracking-widest">
                            Update rate <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Operations Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                    <RecentOrders orders={s.recentOrders} />
                </div>
                
                {/* Operations & Alerts Pane */}
                <div className="xl:col-span-1 flex flex-col gap-6">
                    {/* Action Center */}
                    <div className="flex flex-col gap-2 rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 to-orange-50 p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:border-rose-900/30 dark:from-rose-900/20 dark:to-orange-900/10">
                        <h3 className="font-plus-jakarta text-xs font-bold text-rose-900 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Bell className="h-4 w-4 text-rose-500" /> Action Center</h3>
                        
                        <Link href="/admin/kyc" className="group flex items-center justify-between rounded-xl bg-white/60 p-3 transition hover:bg-white dark:bg-black/20 dark:hover:bg-black/40">
                            <div>
                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-gray-100">KYC Verifications</p>
                                <p className="font-plus-jakarta text-[10px] font-semibold text-rose-600">Pending documents</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-rose-500" />
                        </Link>
                        <Link href="/admin/returns" className="group flex items-center justify-between rounded-xl bg-white/60 p-3 transition hover:bg-white dark:bg-black/20 dark:hover:bg-black/40">
                            <div>
                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-gray-100">Return Requests</p>
                                <p className="font-plus-jakarta text-[10px] font-semibold text-amber-600">Review required</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-amber-500" />
                        </Link>
                        <Link href="/admin/invoices" className="group flex items-center justify-between rounded-xl bg-white/60 p-3 transition hover:bg-white dark:bg-black/20 dark:hover:bg-black/40">
                            <div>
                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-gray-100">Invoices</p>
                                <p className="font-plus-jakarta text-[10px] font-semibold text-blue-600">Financial oversight</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                        </Link>
                    </div>

                    {/* Inventory Status */}
                    <div className="flex flex-col rounded-3xl border border-gray-100 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:border-gray-800/50 dark:bg-[#111]/70">
                        <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800/50">
                            <h2 className="font-plus-jakarta text-sm font-bold tracking-tight text-gray-900 dark:text-white">Inventory Alerts</h2>
                            <Link href="/admin/products" className="font-plus-jakarta text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider">Catalog</Link>
                        </div>
                        <div className="flex flex-col p-2">
                            {s.inventoryAlerts.length > 0 ? s.inventoryAlerts.map((item: InventoryAlert, i: number) => (
                                <div key={i} className="flex items-center justify-between rounded-xl p-3 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 ${item.status === 'Out' ? 'opacity-50' : ''}`}><Package className="h-4 w-4 text-gray-500" /></div>
                                        <div>
                                            <p className={`font-plus-jakarta text-xs font-bold ${item.status === 'Out' ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>{item.productName}</p>
                                            <p className="font-plus-jakarta text-[9px] font-bold uppercase tracking-widest text-gray-400">{item.styleCode}</p>
                                        </div>
                                    </div>
                                    <span className={`font-plus-jakarta text-sm font-bold mr-1 ${item.status === 'Out' ? 'text-gray-400' : 'text-amber-500'}`}>{item.stockQuantity}</span>
                                </div>
                            )) : (
                                <p className="p-4 text-center font-plus-jakarta text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Stock optimal</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Row (New Info) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Top Selling Products */}
                <div className="flex flex-col rounded-3xl border border-gray-100 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:border-gray-800/50 dark:bg-[#111]/70">
                    <div className="flex items-center gap-2 border-b border-gray-100 p-5 dark:border-gray-800/50">
                        <Star className="h-4 w-4 text-amber-500" />
                        <h2 className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">Top Sellers (30 Days)</h2>
                    </div>
                    <div className="flex flex-col p-2 divide-y divide-gray-50 dark:divide-gray-800/50">
                        {[
                            { name: "Classic Solitaire", sales: 45, rev: "$45,200", trend: "+12%" },
                            { name: "Tennis Bracelet", sales: 28, rev: "$28,000", trend: "+5%" },
                            { name: "Pearl Necklace", sales: 22, rev: "$11,500", trend: "-2%" },
                        ].map((p, i) => (
                            <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800/20 rounded-xl transition">
                                <div>
                                    <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{p.name}</p>
                                    <p className="font-plus-jakarta text-[10px] font-semibold text-gray-400 mt-0.5">{p.sales} units sold</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{p.rev}</p>
                                    <p className={`font-plus-jakarta text-[10px] font-bold ${p.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{p.trend}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* VIP Customers */}
                <div className="flex flex-col rounded-3xl border border-gray-100 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:border-gray-800/50 dark:bg-[#111]/70">
                    <div className="flex items-center gap-2 border-b border-gray-100 p-5 dark:border-gray-800/50">
                        <Crown className="h-4 w-4 text-purple-500" />
                        <h2 className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">VIP Customers</h2>
                    </div>
                    <div className="flex flex-col p-2 divide-y divide-gray-50 dark:divide-gray-800/50">
                        {[
                            { name: "James Sterling", email: "j.sterling@email.com", spent: "$32,300", orders: 12 },
                            { name: "Eleanor Vance", email: "e.vance@email.com", spent: "$14,500", orders: 4 },
                            { name: "Sophia Chen", email: "sophia.c@email.com", spent: "$4,850", orders: 2 },
                        ].map((c, i) => (
                            <Link key={i} href="/admin/customers" className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800/20 rounded-xl transition">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 font-plus-jakarta text-[10px] font-bold text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">{c.name.charAt(0)}</div>
                                    <div>
                                        <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{c.name}</p>
                                        <p className="font-plus-jakarta text-[10px] font-medium text-gray-400 mt-0.5">{c.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{c.spent}</p>
                                    <p className="font-plus-jakarta text-[10px] font-semibold text-gray-400">{c.orders} orders</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Vendor Performance */}
                <div className="flex flex-col rounded-3xl border border-gray-100 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:border-gray-800/50 dark:bg-[#111]/70">
                    <div className="flex items-center gap-2 border-b border-gray-100 p-5 dark:border-gray-800/50">
                        <Store className="h-4 w-4 text-blue-500" />
                        <h2 className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">Top Vendors</h2>
                    </div>
                    <div className="flex flex-col p-2 divide-y divide-gray-50 dark:divide-gray-800/50">
                        {[
                            { name: "Premium Gems Ltd", fulfill: "98%", status: "Level 1" },
                            { name: "Aurum Mines", fulfill: "95%", status: "Level 2" },
                            { name: "Jade Dynasty", fulfill: "88%", status: "Pending KYC" },
                        ].map((v, i) => (
                            <Link key={i} href="/admin/vendors" className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800/20 rounded-xl transition">
                                <div>
                                    <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{v.name}</p>
                                    <p className={`font-plus-jakarta text-[10px] font-bold mt-0.5 ${v.status.includes('Pending') ? 'text-amber-500' : 'text-blue-500'}`}>{v.status}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{v.fulfill}</p>
                                    <p className="font-plus-jakarta text-[10px] font-semibold text-gray-400">fulfillment</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            
        </div>
    );
}
