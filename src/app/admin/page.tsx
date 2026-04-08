"use client";

import { DollarSign, ArrowUpRight, Users, CreditCard } from "lucide-react";
import StatCard from "./_components/StatCard";
import RecentOrders from "./_components/RecentOrders";
import dynamic from "next/dynamic";

// Dynamically import charts to avoid SSR hydration issues with recharts
const RevenueChart = dynamic(() => import("./_components/charts/RevenueChart"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full animate-pulse rounded-xl bg-slate-100 dark:bg-[#1a1a1a]" />,
});
const SalesByCategoryChart = dynamic(() => import("./_components/charts/SalesByCategoryChart"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full animate-pulse rounded-xl bg-slate-100 dark:bg-[#1a1a1a]" />,
});

export default function AdminDashboardPage() {
    return (
        <div className="flex flex-col gap-10">
            <div>
                <h1 className="font-plus-jakarta text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Overview</h1>
                <p className="mt-2 font-plus-jakarta text-sm font-medium text-gray-400 dark:text-gray-500">Real-time metrics and performance insights for Maison de Yash.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Revenue"
                    value="$248,500"
                    icon={DollarSign}
                    trend={{ value: 12.5, isPositive: true }}
                />
                <StatCard
                    title="Registered Users"
                    value="4,230"
                    icon={Users}
                    trend={{ value: 5.2, isPositive: true }}
                />
                <StatCard
                    title="Orders Placed"
                    value="1,234"
                    icon={CreditCard}
                    trend={{ value: 2.1, isPositive: false }}
                />
                <StatCard
                    title="Avg. Order Value"
                    value="$8,450"
                    icon={ArrowUpRight}
                    trend={{ value: 0.8, isPositive: true }}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <RevenueChart />
                </div>
                <div className="lg:col-span-1">
                    <SalesByCategoryChart />
                </div>
            </div>

            {/* Recent Orders */}
            <div>
                <RecentOrders />
            </div>
        </div>
    );
}
