"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { Package, ChevronRight, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const StatusBadge = ({ status }: { status: string }) => {
    const s = status.toUpperCase();
    let config = { color: "text-amber-500", bg: "bg-amber-500/10", icon: Clock };

    if (s.includes("PAID") || s.includes("CONFIRMED") || s.includes("DELIVERED") || s.includes("COMPLETED")) {
        config = { color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2 };
    } else if (s.includes("FAILED") || s.includes("CANCELLED") || s.includes("REJECTED")) {
        config = { color: "text-rose-500", bg: "bg-rose-500/10", icon: AlertCircle };
    }

    const Icon = config.icon;

    return (
        <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${config.color} ${config.bg}`}>
            <Icon size={12} /> {status.replace(/_/g, " ")}
        </span>
    );
};

export const OrdersView = () => {
    const { data: ordersResponse, isLoading, error } = useQuery({
        queryKey: ["user-orders"],
        queryFn: () => orderService.getOrders(),
    });

    const orders = ordersResponse?.data || [];

    if (isLoading) return <div className="py-20 text-center text-gray-400 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">Retrieving your archives...</div>;
    
    if (error) return (
        <div className="py-20 text-center">
            <AlertCircle className="mx-auto mb-4 text-rose-500" size={32} />
            <p className="text-sm text-gray-500">Could not retrieve your orders. Please try again later.</p>
        </div>
    );

    if (orders.length === 0) return (
        <div className="rounded-2xl border border-dashed border-gray-200 p-20 text-center dark:border-white/10">
            <Package className="mx-auto mb-4 text-gray-300" size={48} />
            <h3 className="mb-2 font-serif text-xl text-gray-900 dark:text-white">No Orders Yet</h3>
            <p className="mb-8 text-sm text-gray-500">Your future treasures will appear here as soon as you start your journey.</p>
            <Link href="/products" className="text-xs font-bold tracking-widest text-gold uppercase hover:underline">Browse Collections</Link>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-serif text-2xl text-gray-900 dark:text-white">Order History</h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{orders.length} TOTAL PIECES</span>
            </div>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.orderId} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:border-gold/30 hover:shadow-xl dark:border-white/5 dark:bg-[#0a0a0a]">
                        <div className="flex flex-col md:flex-row md:items-center">
                            {/* Order Info */}
                            <div className="flex-1 p-6">
                                <div className="mb-4 flex flex-wrap items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gold dark:bg-white/5">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">#{order.orderNumber}</p>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest">{format(new Date(order.createdAt), "MMMM dd, yyyy")}</p>
                                    </div>
                                    <div className="md:ml-auto">
                                        <StatusBadge status={order.status} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-8 border-t border-gray-50 pt-4 dark:border-white/5">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Investment</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{order.totalAmount.toLocaleString()} VND</p>
                                    </div>
                                    <div className="text-right">
                                        {order.status === "AWAITING_FULL_PAYMENT" ? (
                                             <Link 
                                                href={`/orders/${order.orderId}/payment`}
                                                className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-[10px] font-bold tracking-widest text-white uppercase transition-all hover:brightness-105"
                                            >
                                                Pay Balance <ChevronRight size={12} />
                                            </Link>
                                        ) : (
                                            <Link 
                                                href={`/orders/${order.orderId}/timeline`}
                                                className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase hover:text-gold transition-all"
                                            >
                                                View Journey <ChevronRight size={12} />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
