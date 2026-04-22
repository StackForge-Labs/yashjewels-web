"use client";

import { useEffect, useState } from "react";
import {
    ShoppingBag,
    Package,
    TrendingUp,
    AlertTriangle,
    ArrowRight,
    Clock,
    CheckCircle2,
    XCircle,
    LayoutDashboard,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { vendorService, VendorDashboardStats } from "@/services/vendor.service";
import toast from "react-hot-toast";

// ─── Skeleton Components ──────────────────────────────────────────
function CardSkeleton() {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm animate-pulse dark:border-gray-800/50 dark:bg-[#111]/70">
            <div className="flex items-start justify-between">
                <div className="space-y-3">
                    <div className="h-3 w-20 bg-gray-200 rounded dark:bg-gray-800" />
                    <div className="h-8 w-32 bg-gray-200 rounded dark:bg-gray-800" />
                </div>
                <div className="h-11 w-11 rounded-xl bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="h-3 w-24 bg-gray-100 rounded dark:bg-gray-800/50" />
        </div>
    );
}

function TableRowSkeleton() {
    return (
        <tr className="animate-pulse">
            <td className="px-8 py-4"><div className="h-4 w-24 bg-gray-100 rounded dark:bg-gray-800" /></td>
            <td className="px-8 py-4"><div className="h-4 w-32 bg-gray-100 rounded dark:bg-gray-800" /></td>
            <td className="px-8 py-4"><div className="h-4 w-40 bg-gray-100 rounded dark:bg-gray-800" /></td>
            <td className="px-8 py-4"><div className="h-6 w-20 rounded-full bg-gray-100 dark:bg-gray-800" /></td>
            <td className="px-8 py-4"><div className="h-4 w-20 bg-gray-100 rounded dark:bg-gray-800 ml-auto" /></td>
        </tr>
    );
}

// ─── Helpers ─────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
    CONFIRMED: { label: "Confirmed", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" },
    DEPOSIT_PAID: { label: "Deposit Paid", icon: Clock, className: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" },
    AWAITING_FULL_PAYMENT: { label: "Awaiting Full Payment", icon: Clock, className: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" },
    PREPARING: { label: "Preparing", icon: Package, className: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" },
    CANCELLED: { label: "Cancelled", icon: XCircle, className: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400" },
};

function StatusBadge({ status }: { status: string }) {
    const cfg = statusConfig[status] ?? { label: status, icon: Clock, className: "bg-gray-100 text-gray-600" };
    const Icon = cfg.icon || Clock;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-plus-jakarta text-[11px] font-bold ${cfg.className}`}>
            <Icon className="h-3 w-3" />
            {cfg.label}
        </span>
    );
}

function formatVnd(n: number) {
    return new Intl.NumberFormat("vi-VN").format(n) + " ₫";
}

// ─── Page ──────────────────────────────────────────────────────
export default function VendorDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<VendorDashboardStats | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await vendorService.getDashboardStats();
                if (res.success) {
                    setStats(res.data);
                }
            } catch (err) {
                toast.error("Failed to load dashboard statistics");
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const kpiCards = [
        {
            title: "Total Revenue",
            value: formatVnd(stats?.totalRevenue || 0),
            change: stats?.revenueTrend ? `${stats.revenueTrend > 0 ? "+" : ""}${stats.revenueTrend}%` : "0%",
            positive: (stats?.revenueTrend || 0) >= 0,
            icon: TrendingUp,
            color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400",
        },
        {
            title: "Orders Count",
            value: stats?.totalOrders || 0,
            change: stats?.ordersTrend ? `${stats.ordersTrend > 0 ? "+" : ""}${stats.ordersTrend}%` : "0%",
            positive: (stats?.ordersTrend || 0) >= 0,
            icon: ShoppingBag,
            color: "text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400",
        },
        {
            title: "Active Products",
            value: stats?.activeProducts || 0,
            change: stats?.productsTrend ? `${stats.productsTrend > 0 ? "+" : ""}${stats.productsTrend}% this month` : "Stable",
            positive: (stats?.productsTrend || 0) >= 0,
            icon: Package,
            color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400",
        },
        {
            title: "Avg Order Value",
            value: formatVnd(stats?.avgOrderValue || 0),
            change: stats?.aovTrend ? `${stats.aovTrend > 0 ? "+" : ""}${stats.aovTrend}%` : "0%",
            positive: (stats?.aovTrend || 0) >= 0,
            icon: LayoutDashboard,
            color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400",
        },
    ];

    return (
        <div className="flex flex-col gap-8">
            {/* Page Title */}
            <div>
                <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-gradient-amber">
                    Dashboard Overview
                </h1>
                <p className="mt-1 font-plus-jakarta text-sm text-gray-500 dark:text-gray-400">
                    Real-time performance analytics for your store
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {loading
                    ? Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)
                    : kpiCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={card.title}
                                className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur-md transition-all hover:shadow-md dark:border-gray-800/50 dark:bg-[#111]/70"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-plus-jakarta text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            {card.title}
                                        </p>
                                        <p className="mt-2 font-plus-jakarta text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                            {card.value}
                                        </p>
                                    </div>
                                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </div>
                                <span className={`font-plus-jakarta text-xs font-semibold ${card.positive ? "text-emerald-600" : "text-rose-500"}`}>
                                    {card.change} vs last month
                                </span>
                            </div>
                        );
                    })}
            </div>

            {/* Revenue Chart Placeholder (Mocked until chart endpoint ready) */}
            <div className="rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="font-plus-jakarta text-lg font-bold text-gray-900 dark:text-white">Sales Performance</h2>
                        <p className="font-plus-jakarta text-xs uppercase tracking-widest text-gray-400">
                            Revenue trend based on confirmed orders
                        </p>
                    </div>
                    <span className="rounded-lg bg-amber-50 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                        Monthly View
                    </span>
                </div>
                <div className="h-64">
                    {loading ? (
                        <div className="h-full w-full animate-pulse bg-gray-50 rounded-xl dark:bg-gray-800/30" />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="vendorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d97706" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-800" />
                                <XAxis dataKey="day" hide />
                                <YAxis hide />
                                <Tooltip />
                                <Area type="monotone" dataKey="revenue" stroke="#d97706" strokeWidth={2} fill="url(#vendorGradient)" />
                                <text x="50%" y="50%" textAnchor="middle" className="fill-gray-400 font-plus-jakarta text-sm">
                                    Chart data will be integrated soon
                                </text>
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Recent Orders Mini Table */}
            <div className="rounded-2xl border border-gray-100 bg-white/70 shadow-sm backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70 overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5 dark:border-gray-800/50">
                    <h2 className="font-plus-jakarta text-lg font-bold text-gray-900 dark:text-white">Recent Store Orders</h2>
                    <a href="/vendor/orders" className="flex items-center gap-1 font-plus-jakarta text-xs font-bold uppercase tracking-wider text-amber-600 hover:text-amber-700 dark:text-amber-400">
                        Manage All <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                {["Order ID", "Customer", "Date", "Status", "Value"].map((h) => (
                                    <th key={h} className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {loading ? (
                                Array(4).fill(0).map((_, i) => <TableRowSkeleton key={i} />)
                            ) : (
                                stats?.recentOrders?.map((order) => (
                                    <tr key={order.orderId} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-8 py-4 font-plus-jakarta text-sm font-bold text-amber-700 dark:text-amber-400">{order.orderNumber}</td>
                                        <td className="px-8 py-4 font-plus-jakarta text-sm font-medium text-gray-900 dark:text-white">{order.customerName}</td>
                                        <td className="px-8 py-4 font-plus-jakarta text-sm text-gray-500 dark:text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="px-8 py-4"><StatusBadge status={order.status} /></td>
                                        <td className="px-8 py-4 text-right font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{formatVnd(order.totalAmount)}</td>
                                    </tr>
                                ))
                            )}
                            {!loading && (!stats?.recentOrders || stats.recentOrders.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-gray-400 font-plus-jakarta">
                                        No recent orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
