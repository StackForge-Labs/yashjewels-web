"use client";

import { Search, Filter, MoreHorizontal, ArrowUpRight, Eye } from "lucide-react";

const mockOrders = [
    { id: "1", order_number: "ORD-9281", customer_name: "Eleanor Vance", date: "2026-04-08", total_amount: "$4,500.00", status: "Delivered", method: "Credit Card" },
    { id: "2", order_number: "ORD-9282", customer_name: "James Sterling", date: "2026-04-07", total_amount: "$12,300.00", status: "Processing", method: "Bank Transfer" },
    { id: "3", order_number: "ORD-9283", customer_name: "Sophia Chen", date: "2026-04-06", total_amount: "$850.00", status: "Delivered", method: "Paypal" },
    { id: "4", order_number: "ORD-9284", customer_name: "Michael Ross", date: "2026-04-05", total_amount: "$1,200.00", status: "Cancelled", method: "Credit Card" },
];

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case "Delivered":
            return <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">Delivered</span>;
        case "Processing":
            return <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">Processing</span>;
        case "Cancelled":
            return <span className="inline-flex items-center rounded-lg bg-rose-50 px-2.5 py-1 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">Cancelled</span>;
        default:
            return <span className="inline-flex items-center rounded-lg bg-gray-50 px-2.5 py-1 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:bg-gray-800 dark:text-gray-400">{status}</span>;
    }
};

export default function OrdersPage() {
    return (
        <div className="flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Order Management</h1>
                    <p className="mt-1 font-plus-jakarta text-sm font-medium text-gray-400 dark:text-gray-500">Track, process, and fulfill customer orders globally.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300 dark:hover:bg-gray-800/50">
                        Export CSV
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-sm transition-all hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100">
                        Create Order
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                {/* Search and Filters */}
                <div className="flex flex-col gap-4 border-b border-gray-100 p-6 md:flex-row md:items-center md:justify-between dark:border-gray-800/50">
                    <div className="flex max-w-md flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 dark:border-gray-800 dark:bg-[#1a1a1a]/50 dark:focus-within:border-blue-500">
                        <Search className="h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by order ID or customer..."
                            className="w-full bg-transparent font-plus-jakarta text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-plus-jakarta text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300 dark:hover:bg-gray-800/50">
                            <Filter className="h-4 w-4" />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 text-gray-400 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50 dark:text-gray-500">
                            <tr>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Order #</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Customer</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Date</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Payment</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Amount</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-4 text-right font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {mockOrders.map((order) => (
                                <tr key={order.id} className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-8 py-5">
                                        <span className="font-plus-jakarta text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors dark:text-white">{order.order_number}</span>
                                    </td>
                                    <td className="px-8 py-5 font-plus-jakarta text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        {order.customer_name}
                                    </td>
                                    <td className="px-8 py-5 font-plus-jakarta text-sm font-medium text-gray-500">{order.date}</td>
                                    <td className="px-8 py-5 font-plus-jakarta text-sm font-medium text-gray-500">{order.method}</td>
                                    <td className="px-8 py-5 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{order.total_amount}</td>
                                    <td className="px-8 py-5">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                                            <Eye className="h-3.5 w-3.5" />
                                            View
                                        </button>
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
