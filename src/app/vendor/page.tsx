"use client";

import {
    ShoppingBag,
    Package,
    TrendingUp,
    AlertTriangle,
    ArrowRight,
    Clock,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ─── Mock Data ───────────────────────────────────────────────────
const revenueData = [
    { day: "T2", revenue: 12000000 },
    { day: "T3", revenue: 34000000 },
    { day: "T4", revenue: 18000000 },
    { day: "T5", revenue: 52000000 },
    { day: "T6", revenue: 44000000 },
    { day: "T7", revenue: 89000000 },
    { day: "CN", revenue: 61000000 },
];

const recentOrders = [
    { id: "YJ-20250419-001", customer: "Nguyễn Văn An", product: "Nhẫn Kim Cương 18K", amount: 45000000, status: "CONFIRMED" },
    { id: "YJ-20250419-002", customer: "Trần Thị Bình", product: "Dây Chuyền Vàng 22K", amount: 12500000, status: "AWAITING_FULL_PAYMENT" },
    { id: "YJ-20250418-009", customer: "Lê Minh Châu", product: "Bông Tai Ngọc Trai", amount: 8200000, status: "PREPARING" },
    { id: "YJ-20250418-007", customer: "Phạm Thu Dung", product: "Vòng Tay Ruby", amount: 23000000, status: "DEPOSIT_PAID" },
];

const kpiCards = [
    {
        title: "Doanh Thu Hôm Nay",
        value: "89.2M ₫",
        change: "+18.5%",
        positive: true,
        icon: TrendingUp,
        color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    {
        title: "Đơn Chờ Duyệt",
        value: "7",
        change: "Cần xử lý ngay",
        positive: false,
        icon: ShoppingBag,
        color: "text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400",
        urgent: true,
    },
    {
        title: "Sản Phẩm Đang Bán",
        value: "142",
        change: "+3 tháng này",
        positive: true,
        icon: Package,
        color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400",
    },
    {
        title: "Hết Hàng",
        value: "5",
        change: "Cần nhập thêm",
        positive: false,
        icon: AlertTriangle,
        color: "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400",
        urgent: true,
    },
];

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle2; className: string }> = {
    CONFIRMED: { label: "Đã Xác Nhận", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" },
    DEPOSIT_PAID: { label: "Đã Cọc", icon: Clock, className: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" },
    AWAITING_FULL_PAYMENT: { label: "Chờ Tất Toán", icon: Clock, className: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" },
    PREPARING: { label: "Đang Đóng Gói", icon: Package, className: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" },
    CANCELLED: { label: "Đã Huỷ", icon: XCircle, className: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400" },
};

function StatusBadge({ status }: { status: string }) {
    const cfg = statusConfig[status] ?? { label: status, icon: Clock, className: "bg-gray-100 text-gray-600" };
    const Icon = cfg.icon;
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
    return (
        <div className="flex flex-col gap-8">
            {/* Page Title */}
            <div>
                <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Dashboard
                </h1>
                <p className="mt-1 font-plus-jakarta text-sm text-gray-500 dark:text-gray-400">
                    Tổng quan hoạt động gian hàng hôm nay
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {kpiCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.title}
                            className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-plus-jakarta text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
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
                            <span className={`font-plus-jakarta text-xs font-semibold ${card.positive ? "text-emerald-600" : card.urgent ? "text-rose-500" : "text-gray-400"}`}>
                                {card.change}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Revenue Chart */}
            <div className="rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="font-plus-jakarta text-lg font-bold text-gray-900 dark:text-white">Doanh Thu 7 Ngày</h2>
                        <p className="font-plus-jakarta text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500">
                            Tổng doanh số theo ngày
                        </p>
                    </div>
                    <span className="rounded-lg bg-amber-50 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                        Tuần Này
                    </span>
                </div>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="vendorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-800" />
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000000}M`} />
                            <Tooltip
                                formatter={(value: number) => [formatVnd(value), "Doanh Thu"]}
                                contentStyle={{ borderRadius: "12px", border: "1px solid #f3f4f6", fontSize: "12px" }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#d97706" strokeWidth={2} fill="url(#vendorGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Orders Mini Table */}
            <div className="rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5 dark:border-gray-800/50">
                    <h2 className="font-plus-jakarta text-lg font-bold text-gray-900 dark:text-white">Đơn Hàng Gần Đây</h2>
                    <a href="/vendor/orders" className="flex items-center gap-1 font-plus-jakarta text-xs font-bold uppercase tracking-wider text-amber-600 hover:text-amber-700 dark:text-amber-400">
                        Xem Tất Cả <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                {["Mã Đơn", "Khách Hàng", "Sản Phẩm", "Trạng Thái", "Giá Trị"].map((h) => (
                                    <th key={h} className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-8 py-4 font-plus-jakarta text-sm font-bold text-amber-700 dark:text-amber-400">{order.id}</td>
                                    <td className="px-8 py-4 font-plus-jakarta text-sm font-medium text-gray-900 dark:text-white">{order.customer}</td>
                                    <td className="px-8 py-4 font-plus-jakarta text-sm text-gray-500 dark:text-gray-400">{order.product}</td>
                                    <td className="px-8 py-4"><StatusBadge status={order.status} /></td>
                                    <td className="px-8 py-4 text-right font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{formatVnd(order.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
