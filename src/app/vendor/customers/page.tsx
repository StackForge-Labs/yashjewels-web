"use client";

import { useState } from "react";
import { Search, User, Filter, Mail, Phone, ShoppingBag, Star, MoreVertical } from "lucide-react";

// ─── Mock Data ─────────────────────────────────────────────
interface CustomerCrm {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
    tier: "VIP" | "REGULAR" | "NEW";
}

const mockCustomers: CustomerCrm[] = [
    { id: "CUST-001", name: "Nguyễn Văn An", email: "an.nguyen@gmail.com", phone: "0901234567", totalOrders: 5, totalSpent: 125000000, lastOrderDate: "2025-04-10", tier: "VIP" },
    { id: "CUST-002", name: "Trần Thị Bình", email: "binh.tran@gmail.com", phone: "0912345678", totalOrders: 1, totalSpent: 8500000, lastOrderDate: "2025-04-18", tier: "NEW" },
    { id: "CUST-003", name: "Lê Minh Châu", email: "chau.le@yahoo.com", phone: "0923456789", totalOrders: 3, totalSpent: 45000000, lastOrderDate: "2025-03-25", tier: "REGULAR" },
    { id: "CUST-004", name: "Phạm Thu Dung", email: "dung.pham@gmail.com", phone: "0934567890", totalOrders: 12, totalSpent: 450000000, lastOrderDate: "2025-04-19", tier: "VIP" },
];

function formatVnd(n: number) {
    return new Intl.NumberFormat("vi-VN").format(n) + " ₫";
}

const tierConfig = {
    VIP: { label: "K.Hàng VIP", color: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400", icon: Star },
    REGULAR: { label: "Thành Viên", color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400", icon: User },
    NEW: { label: "Mới", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400", icon: User },
};

export default function VendorCustomersPage() {
    const [search, setSearch] = useState("");

    const filtered = mockCustomers.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.phone.includes(search)
    );

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Danh Sách Khách Hàng (CRM)</h1>
                <p className="mt-1 font-plus-jakarta text-sm text-gray-500 dark:text-gray-400">
                    Quản lý khách quen và lịch sử mua hàng của cửa hàng
                </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm kiếm theo tên hoặc SĐT..."
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 font-plus-jakarta text-sm focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-[#111]"
                    />
                </div>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#111] dark:text-gray-300 dark:hover:bg-gray-800">
                    <Filter className="h-4 w-4" /> Bọ Lọc
                </button>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-gray-100 bg-white/70 shadow-sm backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                {["Khách Hàng", "Liên Hệ", "Phân Hạng", "Số Đơn", "Tổng Mua", ""].map((h) => (
                                    <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {filtered.map((c) => {
                                const cfg = tierConfig[c.tier];
                                const TierIcon = cfg.icon;
                                return (
                                    <tr key={c.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                                                    {c.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{c.name}</p>
                                                    <p className="font-plus-jakarta text-xs text-gray-400">{c.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                    <Phone className="h-3.5 w-3.5" /> {c.phone}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                    <Mail className="h-3.5 w-3.5" /> {c.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider ${cfg.color}`}>
                                                <TierIcon className="h-3 w-3" /> {cfg.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <ShoppingBag className="h-4 w-4 text-gray-400" />
                                                <span className="font-plus-jakarta font-bold text-gray-700 dark:text-gray-300">{c.totalOrders}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">
                                            {formatVnd(c.totalSpent)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-amber-600 dark:hover:bg-gray-800 transition-colors">
                                                <MoreVertical className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
