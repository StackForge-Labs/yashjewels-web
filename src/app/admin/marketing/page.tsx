"use client";

import { Plus, Search, Tag, Percent, ArrowUpRight } from "lucide-react";

const mockCoupons = [
    { id: "1", code: "WELCOME20", discount: "20%", min_order: "$500", uses: 145, max_uses: 500, expires: "2026-12-31", status: "Active" },
    { id: "2", code: "VIPGOLD", discount: "$150", min_order: "$1000", uses: 32, max_uses: 100, expires: "2026-05-01", status: "Active" },
    { id: "3", code: "FLASH50", discount: "50%", min_order: "$0", uses: 500, max_uses: 500, expires: "2026-04-01", status: "Expired" },
];

export default function MarketingPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Marketing & Promotions</h1>
                    <p className="mt-1 font-plus-jakarta text-sm font-medium text-gray-400 dark:text-gray-500">Manage coupons, discounts, and spin wheel games.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)] transition-all hover:bg-blue-700">
                        <Plus className="h-4 w-4" /> Create Coupon
                    </button>
                </div>
            </div>

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="flex flex-col gap-4 border-b border-gray-100 p-6 md:flex-row md:items-center md:justify-between dark:border-gray-800/50">
                    <div className="flex items-center gap-6">
                        <h2 className="font-plus-jakarta text-lg font-bold text-gray-900 dark:text-white">Discount Codes</h2>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 text-gray-400 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Code</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Discount</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Min Order</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Usage</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {mockCoupons.map((coupon) => (
                                <tr key={coupon.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-8 py-5">
                                        <span className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-1 font-mono text-sm font-bold text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                                            <Tag className="h-3 w-3 text-gray-400" />
                                            {coupon.code}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{coupon.discount}</td>
                                    <td className="px-8 py-5 font-plus-jakarta text-sm font-medium text-gray-500">{coupon.min_order}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col gap-1 w-32">
                                            <div className="flex justify-between font-plus-jakarta text-xs font-bold text-gray-900 dark:text-white">
                                                <span>{coupon.uses}</span>
                                                <span className="text-gray-400">/ {coupon.max_uses}</span>
                                            </div>
                                            <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                                                <div className="h-full rounded-full bg-blue-600" style={{ width: `${(coupon.uses / coupon.max_uses) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        {coupon.status === "Active" ? (
                                            <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:bg-emerald-500/10">Active</span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:bg-gray-800">Expired</span>
                                        )}
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
