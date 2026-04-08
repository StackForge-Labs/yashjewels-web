"use client";

import { useState } from "react";
import { Eye, ChevronDown } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Drawer } from "../_components/ui/Drawer";

type Order = {
    id: string;
    order_number: string;
    customer_name: string;
    customer_email: string;
    date: string;
    total_amount: string;
    gold_rate: string;
    status: "processing" | "shipped" | "delivered" | "cancelled";
    payment_method: string;
    shipping_addr: string;
    items: { name: string; style_code: string; qty: number; price: string }[];
};

const mockOrders: Order[] = [
    {
        id: "1", order_number: "ORD-9281", customer_name: "Eleanor Vance", customer_email: "e.vance@email.com",
        date: "2026-04-08", total_amount: "$4,500.00", gold_rate: "$82,000/gm", status: "delivered",
        payment_method: "Credit Card (Stripe)", shipping_addr: "88 Nguyễn Huệ, Q.1, TP.HCM",
        items: [{ name: "Classic Solitaire Ring", style_code: "RNK-001", qty: 1, price: "$4,500.00" }],
    },
    {
        id: "2", order_number: "ORD-9282", customer_name: "James Sterling", customer_email: "j.sterling@email.com",
        date: "2026-04-07", total_amount: "$12,300.00", gold_rate: "$81,800/gm", status: "processing",
        payment_method: "Bank Transfer", shipping_addr: "12 Lê Lợi, Q.1, TP.HCM",
        items: [
            { name: "Diamond Tennis Necklace", style_code: "NCK-002", qty: 1, price: "$10,000.00" },
            { name: "Emerald Cut Bracelet", style_code: "BRC-003", qty: 1, price: "$2,300.00" },
        ],
    },
    {
        id: "3", order_number: "ORD-9283", customer_name: "Sophia Chen", customer_email: "sophia.c@email.com",
        date: "2026-04-06", total_amount: "$850.00", gold_rate: "$81,500/gm", status: "shipped",
        payment_method: "Paypal", shipping_addr: "45 Trần Hưng Đạo, Q.5, TP.HCM",
        items: [{ name: "Sapphire Drop Earrings", style_code: "ERR-004", qty: 1, price: "$850.00" }],
    },
    {
        id: "4", order_number: "ORD-9284", customer_name: "Michael Ross", customer_email: "m.ross@email.com",
        date: "2026-04-05", total_amount: "$1,200.00", gold_rate: "$81,000/gm", status: "cancelled",
        payment_method: "Credit Card (Stripe)", shipping_addr: "7 Đinh Tiên Hoàng, Q.1, TP.HCM",
        items: [{ name: "Vintage Halo Ring", style_code: "RNK-005", qty: 1, price: "$1,200.00" }],
    },
];

const STATUSES: Order["status"][] = ["processing", "shipped", "delivered", "cancelled"];

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [search, setSearch] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const filtered = orders.filter(o =>
        o.order_number.toLowerCase().includes(search.toLowerCase()) ||
        o.customer_name.toLowerCase().includes(search.toLowerCase())
    );

    const updateStatus = (id: string, status: Order["status"]) => {
        setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Order Management"
                description="Track, process, and fulfill customer orders globally."
                badge={{ count: orders.filter(o => o.status === "processing").length, label: "processing", color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" }}
                actions={
                    <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300">
                        Export CSV
                    </button>
                }
            />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="flex flex-col gap-4 border-b border-gray-100 p-6 md:flex-row md:items-center md:justify-between dark:border-gray-800/50">
                    <input type="text" placeholder="Search by order # or customer..." value={search} onChange={e => setSearch(e.target.value)}
                        className="max-w-sm flex-1 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 font-plus-jakarta text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a]/50 dark:text-gray-100 dark:placeholder:text-gray-500" />
                    <select className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-plus-jakarta text-sm font-bold text-gray-700 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300">
                        <option>All Statuses</option>
                        {STATUSES.map(s => <option key={s} className="capitalize">{s}</option>)}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                {["Order #", "Customer", "Date", "Gold Rate", "Amount", "Status", "Actions"].map(h => (
                                    <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {filtered.map((order) => (
                                <tr key={order.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{order.order_number}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{order.customer_name}</p>
                                            <p className="font-plus-jakarta text-xs font-medium text-gray-400">{order.customer_email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-medium text-gray-500">{order.date}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-xs font-bold text-gray-500">{order.gold_rate}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{order.total_amount}</td>
                                    <td className="px-6 py-4">
                                        <div className="relative">
                                            <select
                                                value={order.status}
                                                onChange={e => updateStatus(order.id, e.target.value as Order["status"])}
                                                className="appearance-none rounded-lg border border-gray-200 bg-white py-1 pl-2.5 pr-7 font-plus-jakarta text-[11px] font-bold capitalize text-gray-700 transition-colors hover:border-blue-500 focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a] dark:text-gray-300"
                                            >
                                                {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => { setSelectedOrder(order); setIsDetailOpen(true); }}
                                            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-300"
                                        >
                                            <Eye className="h-3.5 w-3.5" /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Detail Drawer */}
            <Drawer
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                title={`Order ${selectedOrder?.order_number}`}
                subtitle={`Placed on ${selectedOrder?.date}`}
                footer={<button onClick={() => setIsDetailOpen(false)} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700">Close</button>}
            >
                {selectedOrder && (
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <StatusBadge status={selectedOrder.status} />
                            <span className="font-plus-jakarta text-xs text-gray-400">{selectedOrder.payment_method}</span>
                        </div>

                        <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Customer & Shipping</p>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <span className="font-plus-jakarta text-sm font-semibold text-gray-500">Name</span>
                                    <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{selectedOrder.customer_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-plus-jakarta text-sm font-semibold text-gray-500">Email</span>
                                    <span className="font-plus-jakarta text-sm font-medium text-gray-700 dark:text-gray-300">{selectedOrder.customer_email}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="font-plus-jakarta text-sm font-semibold text-gray-500">Address</span>
                                    <span className="font-plus-jakarta text-sm font-medium text-gray-700 text-right dark:text-gray-300">{selectedOrder.shipping_addr}</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Order Items</p>
                            <div className="flex flex-col gap-3">
                                {selectedOrder.items.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{item.name}</p>
                                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.style_code} × {item.qty}</p>
                                        </div>
                                        <span className="shrink-0 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{item.price}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                                <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">Total</span>
                                <span className="font-plus-jakarta text-lg font-bold text-blue-600 dark:text-blue-400">{selectedOrder.total_amount}</span>
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800 flex justify-between">
                            <span className="font-plus-jakarta text-xs font-bold uppercase tracking-widest text-gray-400">Gold Rate Snapshot</span>
                            <span className="font-plus-jakarta text-sm font-bold text-amber-600 dark:text-amber-400">{selectedOrder.gold_rate}</span>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    );
}
