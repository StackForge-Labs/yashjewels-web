"use client";

import { Download, ArrowUpRight, TrendingUp, DollarSign } from "lucide-react";

const mockPayments = [
    { id: "1", order_id: "ORD-9281", amount: "$4,500.00", method: "Credit Card", gateway: "Stripe", status: "Success", date: "2026-04-08" },
    { id: "2", order_id: "ORD-9282", amount: "$12,300.00", method: "Bank Transfer", gateway: "Manual", status: "Pending", date: "2026-04-08" },
    { id: "3", order_id: "ORD-9283", amount: "$850.00", method: "Paypal", gateway: "Paypal Check", status: "Success", date: "2026-04-07" },
    { id: "4", order_id: "ORD-9284", amount: "$1,200.00", method: "Credit Card", gateway: "Stripe", status: "Refunded", date: "2026-04-06" },
];

export default function FinancePage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Financial Hub</h1>
                    <p className="mt-1 font-plus-jakarta text-sm font-medium text-gray-400 dark:text-gray-500">Monitor payments, commissions, and revenue flows.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300">
                        <Download className="h-4 w-4" /> Export Report
                    </button>
                    <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)] transition-all hover:bg-blue-700">
                        <TrendingUp className="h-4 w-4" /> Gold Rates Setup
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:border-gray-800/50 dark:bg-[#111]/70">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10"><DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" /></div>
                        <h3 className="font-plus-jakarta text-sm font-bold text-gray-500 uppercase tracking-widest">Total Revenue</h3>
                    </div>
                    <p className="mt-4 font-plus-jakarta text-3xl font-bold text-gray-900 dark:text-white">$248,500.00</p>
                </div>
                <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:border-gray-800/50 dark:bg-[#111]/70">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10"><TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" /></div>
                        <h3 className="font-plus-jakarta text-sm font-bold text-gray-500 uppercase tracking-widest">Pending Payouts</h3>
                    </div>
                    <p className="mt-4 font-plus-jakarta text-3xl font-bold text-gray-900 dark:text-white">$12,300.00</p>
                </div>
            </div>

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="border-b border-gray-100 p-6 dark:border-gray-800/50">
                    <h2 className="font-plus-jakarta text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 text-gray-400 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Transaction / Order</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Amount</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Method</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Gateway</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {mockPayments.map((payment) => (
                                <tr key={payment.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{payment.order_id}</span>
                                                <span className="font-plus-jakarta text-xs font-medium text-gray-500">{payment.date}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{payment.amount}</td>
                                    <td className="px-8 py-5 font-plus-jakarta text-sm font-medium text-gray-600 dark:text-gray-400">{payment.method}</td>
                                    <td className="px-8 py-5 font-plus-jakarta text-sm font-medium text-gray-500">{payment.gateway}</td>
                                    <td className="px-8 py-5">
                                        {payment.status === "Success" && <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:bg-emerald-500/10">Completed</span>}
                                        {payment.status === "Pending" && <span className="inline-flex items-center rounded-lg bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:bg-amber-500/10">Pending</span>}
                                        {payment.status === "Refunded" && <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:bg-gray-800 dark:text-gray-400">Refunded</span>}
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
