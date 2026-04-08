"use client";

import { useState } from "react";
import { DollarSign, ArrowUpRight, Users, CreditCard, Bell, Package, TrendingUp, ChevronRight, Calendar, Star, Store, Crown } from "lucide-react";
import Link from "next/link";
import StatCard from "./_components/StatCard";
import RecentOrders from "./_components/RecentOrders";
import dynamic from "next/dynamic";

const RevenueChart = dynamic(() => import("./_components/charts/RevenueChart"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full animate-pulse rounded-3xl bg-gray-100/50 dark:bg-[#1a1a1a]" />,
});
const SalesByCategoryChart = dynamic(() => import("./_components/charts/SalesByCategoryChart"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full animate-pulse rounded-3xl bg-gray-100/50 dark:bg-[#1a1a1a]" />,
});

const mockStats = {
    today: { rev: "$3,250", users: "12", orders: "8", aov: "$406", revTrend: 5.2, userTrend: 2.1, orderTrend: 1.5, aovTrend: 3.2 },
    week: { rev: "$15,400", users: "85", orders: "42", aov: "$366", revTrend: -1.2, userTrend: 4.5, orderTrend: -2.1, aovTrend: 1.1 },
    month: { rev: "$64,500", users: "340", orders: "215", aov: "$300", revTrend: 12.5, userTrend: 8.2, orderTrend: 4.5, aovTrend: -1.5 },
    year: { rev: "$248,500", users: "4,230", orders: "1,234", aov: "$8,450", revTrend: 24.5, userTrend: 15.2, orderTrend: 12.1, aovTrend: 5.4 },
};

type TimeRange = "today" | "week" | "month" | "year";

export default function AdminDashboardPage() {
    const [range, setRange] = useState<TimeRange>("month");
    const stats = mockStats[range];

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
                <StatCard title="Total Revenue" value={stats.rev} icon={DollarSign} trend={{ value: stats.revTrend, isPositive: stats.revTrend > 0 }} />
                <StatCard title="New Signups" value={stats.users} icon={Users} trend={{ value: stats.userTrend, isPositive: stats.userTrend > 0 }} />
                <StatCard title="Orders Placed" value={stats.orders} icon={CreditCard} trend={{ value: stats.orderTrend, isPositive: stats.orderTrend > 0 }} />
                <StatCard title="Avg. Order Value" value={stats.aov} icon={ArrowUpRight} trend={{ value: stats.aovTrend, isPositive: stats.aovTrend > 0 }} />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                    <RevenueChart />
                </div>
                <div className="xl:col-span-1 flex flex-col gap-6">
                    <SalesByCategoryChart />
                    
                    {/* Live Gold Rate Focus */}
                    <div className="flex flex-col gap-2 rounded-2xl border border-amber-200/60 bg-gradient-to-bl from-amber-50 to-yellow-50 p-5 dark:border-amber-800/30 dark:from-amber-900/20 dark:to-yellow-900/10 h-full justify-between">
                        <div className="flex items-center justify-between">
                            <h3 className="font-plus-jakarta text-xs font-bold text-amber-900 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-amber-500" /> Live Gold Rate</h3>
                            <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                                <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-500" /> Live
                            </span>
                        </div>
                        <div>
                            <p className="font-plus-jakarta text-3xl font-bold text-amber-700 dark:text-amber-500 mt-2">8,500,000 <span className="text-lg text-amber-600/60">VND</span></p>
                            <p className="font-plus-jakarta text-xs font-medium text-amber-600/80">per gram (SJC Global)</p>
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
                    <RecentOrders />
                </div>
                
                {/* Operations & Alerts Pane */}
                <div className="xl:col-span-1 flex flex-col gap-6">
                    {/* Action Center */}
                    <div className="flex flex-col gap-2 rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 to-orange-50 p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:border-rose-900/30 dark:from-rose-900/20 dark:to-orange-900/10">
                        <h3 className="font-plus-jakarta text-xs font-bold text-rose-900 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Bell className="h-4 w-4 text-rose-500" /> Action Center</h3>
                        
                        <Link href="/admin/kyc" className="group flex items-center justify-between rounded-xl bg-white/60 p-3 transition hover:bg-white dark:bg-black/20 dark:hover:bg-black/40">
                            <div>
                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-gray-100">KYC Verifications</p>
                                <p className="font-plus-jakarta text-[10px] font-semibold text-rose-600">4 pending documents</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-rose-500" />
                        </Link>
                        <Link href="/admin/returns" className="group flex items-center justify-between rounded-xl bg-white/60 p-3 transition hover:bg-white dark:bg-black/20 dark:hover:bg-black/40">
                            <div>
                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-gray-100">Return Requests</p>
                                <p className="font-plus-jakarta text-[10px] font-semibold text-amber-600">2 pending review</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-amber-500" />
                        </Link>
                        <Link href="/admin/invoices" className="group flex items-center justify-between rounded-xl bg-white/60 p-3 transition hover:bg-white dark:bg-black/20 dark:hover:bg-black/40">
                            <div>
                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-gray-100">Invoice Reissues</p>
                                <p className="font-plus-jakarta text-[10px] font-semibold text-blue-600">1 outstanding request</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-amber-500" />
                        </Link>
                    </div>

                    {/* Inventory Status */}
                    <div className="flex flex-col rounded-3xl border border-gray-100 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:border-gray-800/50 dark:bg-[#111]/70">
                        <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800/50">
                            <h2 className="font-plus-jakarta text-sm font-bold tracking-tight text-gray-900 dark:text-white">Inventory Alerts</h2>
                            <Link href="/admin/products" className="font-plus-jakarta text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider">Catalog</Link>
                        </div>
                        <div className="flex flex-col p-2">
                            {[
                                { name: "Vintage Halo Ring", sku: "RNK-005", stock: 3, status: "low" },
                                { name: "Sapphire Earrings", sku: "ERR-004", stock: 0, status: "out" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between rounded-xl p-3 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 ${item.status === 'out' ? 'opacity-50' : ''}`}><Package className="h-4 w-4 text-gray-500" /></div>
                                        <div>
                                            <p className={`font-plus-jakarta text-xs font-bold ${item.status === 'out' ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>{item.name}</p>
                                            <p className="font-plus-jakarta text-[9px] font-bold uppercase tracking-widest text-gray-400">{item.sku}</p>
                                        </div>
                                    </div>
                                    <span className={`font-plus-jakarta text-sm font-bold mr-1 ${item.status === 'out' ? 'text-gray-400' : 'text-amber-500'}`}>{item.stock}</span>
                                </div>
                            ))}
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
