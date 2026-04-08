"use client";

import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface Order {
    id: string;
    customer: string;
    date: string;
    amount: string;
    status: "delivered" | "pending" | "canceled";
}

const mockOrders: Order[] = [
    { id: "ORD-9432", customer: "Eleanor Vance", date: "Jan 12, 2026", amount: "$3,450.00", status: "delivered" },
    { id: "ORD-9433", customer: "James Sterling", date: "Jan 12, 2026", amount: "$12,300.00", status: "pending" },
    { id: "ORD-9434", customer: "Sophia Chen", date: "Jan 11, 2026", amount: "$850.00", status: "delivered" },
    { id: "ORD-9435", customer: "Michael Ross", date: "Jan 10, 2026", amount: "$5,200.00", status: "canceled" },
    { id: "ORD-9436", customer: "Isabella Rossi", date: "Jan 09, 2026", amount: "$15,000.00", status: "delivered" },
];

const StatusBadge = ({ status }: { status: Order["status"] }) => {
    switch (status) {
        case "delivered":
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> Delivered
                </span>
            );
        case "pending":
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                    <Clock className="h-3 w-3" /> Pending
                </span>
            );
        case "canceled":
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
                    <XCircle className="h-3 w-3" /> Canceled
                </span>
            );
    }
};

export default function RecentOrders() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-[#222] dark:bg-[#111]">
            <div className="border-b border-slate-200 px-6 py-5 dark:border-[#222]">
                <h3 className="font-semibold text-slate-900 dark:text-white">Recent Orders</h3>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600 dark:bg-[#1a1a1a] dark:text-slate-400">
                        <tr>
                            <th className="px-6 py-4 font-medium">Order ID</th>
                            <th className="px-6 py-4 font-medium">Customer</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">Amount</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 text-right font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-[#222]">
                        {mockOrders.map((order) => (
                            <tr key={order.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#1a1a1a]">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{order.id}</td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{order.customer}</td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{order.date}</td>
                                <td className="px-6 py-4 text-slate-900 dark:text-white">{order.amount}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-stone-600 hover:text-slate-900 hover:underline dark:text-stone-400 dark:hover:text-white">
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
