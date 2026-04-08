"use client";

import { CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react";

interface Order {
    id: string;
    order_number: string;
    customer_name: string;
    created_at: string;
    total_amount: string;
    status: "delivered" | "pending" | "canceled";
}

const mockOrders: Order[] = [
    { id: "1", order_number: "ORD-9432", customer_name: "Eleanor Vance", created_at: "2026-04-07", total_amount: "$3,450.00", status: "delivered" },
    { id: "2", order_number: "ORD-9433", customer_name: "James Sterling", created_at: "2026-04-07", total_amount: "$12,300.00", status: "pending" },
    { id: "3", order_number: "ORD-9434", customer_name: "Sophia Chen", created_at: "2026-04-06", total_amount: "$850.00", status: "delivered" },
    { id: "4", order_number: "ORD-9435", customer_name: "Michael Ross", created_at: "2026-04-05", total_amount: "$5,200.00", status: "canceled" },
    { id: "5", order_number: "ORD-9436", customer_name: "Isabella Rossi", created_at: "2026-04-04", total_amount: "$15,000.00", status: "delivered" },
];

const StatusBadge = ({ status }: { status: Order["status"] }) => {
    switch (status) {
        case "delivered":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Delivered
                </span>
            );
        case "pending":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-500/10 dark:text-amber-400">
                    <Clock className="h-3.5 w-3.5" /> Pending
                </span>
            );
        case "canceled":
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-800 dark:bg-rose-500/10 dark:text-rose-400">
                    <XCircle className="h-3.5 w-3.5" /> Canceled
                </span>
            );
    }
};

export default function RecentOrders() {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
            <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6 dark:border-gray-800/50">
                <div>
                    <h3 className="font-plus-jakarta text-lg font-bold tracking-tight text-gray-900 dark:text-white">Recent Orders</h3>
                    <p className="mt-1 font-plus-jakarta text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">Latest Global Transactions</p>
                </div>
                <button className="flex items-center gap-1.5 font-plus-jakarta text-xs font-bold uppercase tracking-widest text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400">
                    View All <ArrowRight className="h-3.5 w-3.5" />
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap text-left text-sm">
                    <thead className="border-b border-gray-100 bg-gray-50/50 text-gray-400 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50 dark:text-gray-500">
                        <tr>
                            <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Order #</th>
                            <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Client Name</th>
                            <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Date</th>
                            <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Status</th>
                            <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-right">Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                        {mockOrders.map((order) => (
                            <tr key={order.id} className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                <td className="px-8 py-5 font-plus-jakarta text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{order.order_number}</td>
                                <td className="px-8 py-5 font-plus-jakarta text-sm font-medium text-gray-600 dark:text-gray-300">{order.customer_name}</td>
                                <td className="px-8 py-5 font-plus-jakarta text-xs text-gray-400 dark:text-gray-500">{order.created_at}</td>
                                <td className="px-8 py-5">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="px-8 py-5 text-right font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{order.total_amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
