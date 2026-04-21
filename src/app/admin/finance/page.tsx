"use client";

import React, { useState, useEffect } from "react";
import { 
    DollarSign, TrendingUp, Download, PieChart, 
    ArrowUpRight, CreditCard, Activity, Calendar, 
    FileSpreadsheet, ShieldCheck, Filter
} from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { adminService } from "@/services/admin.service";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from "recharts";

export default function FinanceHubPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [exportLoading, setExportLoading] = useState(false);
    const [dateRange, setDateRange] = useState({ 
        from: format(new Date().setDate(new Date().getDate() - 30), "yyyy-MM-dd"), 
        to: format(new Date(), "yyyy-MM-dd") 
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await adminService.getFinanceStatsApi();
            if (res.success) setStats(res.data);
        } catch (error) {
            toast.error("Failed to fetch financial stats");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        setExportLoading(true);
        try {
            await adminService.exportInsuranceApi(dateRange.from, dateRange.to);
            toast.success("Insurance audit export started");
        } catch (error) {
            toast.error("Export failed");
        } finally {
            setExportLoading(false);
        }
    };

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <PageHeader 
                    title="Finance & Analytics Hub" 
                    description="Monitor Yash Jewels' fiscal health, B2B insurance compliance, and revenue performance."
                />
                
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 px-3 py-2 border-r border-slate-100 dark:border-slate-800">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <input 
                            type="date" 
                            value={dateRange.from}
                            onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                            className="bg-transparent border-none text-xs font-semibold focus:ring-0 outline-none" 
                        />
                        <span className="text-slate-300">→</span>
                        <input 
                            type="date" 
                            value={dateRange.to}
                            onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                            className="bg-transparent border-none text-xs font-semibold focus:ring-0 outline-none" 
                        />
                    </div>
                    <button 
                        disabled={exportLoading}
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
                    >
                        {exportLoading ? <Activity className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
                        Export B2B Insurance
                    </button>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Revenue", value: stats?.totalRevenue, icon: <TrendingUp />, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Pending Settlement", value: stats?.pendingSettlement, icon: <CreditCard />, color: "text-amber-500", bg: "bg-amber-50" },
                    { label: "Success Rate", value: `${stats?.successRate}%`, icon: <PieChart />, color: "text-indigo-500", bg: "bg-indigo-50" },
                    { label: "Insurance Claims", value: "0", icon: <ShieldCheck />, color: "text-rose-500", bg: "bg-rose-50" }
                ].map((m, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-indigo-500/30 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${m.bg} dark:bg-slate-800 ${m.color}`}>
                                {m.icon}
                            </div>
                            <div className="h-8 w-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                <ArrowUpRight className="h-4 w-4 text-slate-400" />
                            </div>
                        </div>
                        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">{m.label}</div>
                        <div className="text-2xl font-bold mt-1">
                            {typeof m.value === 'number' ? `${m.value.toLocaleString()} VND` : m.value}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-slate-900 dark:text-white">Revenue Performance</h3>
                        <div className="flex gap-2">
                             <button className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold">Month</button>
                             <button className="px-3 py-1 text-slate-400 text-xs font-bold">Year</button>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { name: 'Week 1', val: 4500000 },
                                { name: 'Week 2', val: 8200000 },
                                { name: 'Week 3', val: 6100000 },
                                { name: 'Week 4', val: 12500000 },
                            ]}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                <Tooltip />
                                <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6">Payment Distribution</h3>
                    <div className="space-y-6">
                        {stats?.paymentMethods?.map((pm: any, i: number) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-slate-600 dark:text-slate-400 capitalize">{pm.method}</span>
                                    <span className="font-bold">{pm.total.toLocaleString()} VND</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${(pm.total / stats.totalRevenue) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-600 rounded-xl text-white">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div className="text-xs">
                                <div className="font-bold text-indigo-900 dark:text-indigo-200">Gateway Health: Excellent</div>
                                <div className="text-indigo-600">Stripe production active.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                        <Filter className="h-4 w-4 text-slate-400" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Transaction / Date</th>
                                <th className="px-6 py-4">Order #</th>
                                <th className="px-6 py-4">Method</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {stats?.recentTransactions?.map((t: any) => (
                                <tr key={t.paymentId} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-xs font-mono text-slate-400 uppercase">{t.transactionRef?.substring(0, 15)}...</div>
                                        <div className="text-xs text-slate-500">{format(new Date(t.timestamp), "MMM dd, HH:mm")}</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-indigo-600">{t.orderNumber}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs font-semibold">
                                            <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                                                <CreditCard className="h-3 w-3" />
                                            </div>
                                            {t.paymentMethod}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold">{t.amount.toLocaleString()} VND</td>
                                    <td className="px-6 py-4">
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold w-fit uppercase ${
                                            t.status === 'SUCCEEDED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                        }`}>
                                            {t.status}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
