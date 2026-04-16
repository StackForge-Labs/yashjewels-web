"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { PageHero } from "@/app/_components/PageHero";
import {
    Package,
    CheckCircle2,
    Clock,
    Truck,
    AlertCircle,
    ArrowLeft,
    ShieldCheck,
    CreditCard,
    User,
    Store,
    Settings,
    ChevronRight,
    MapPin,
    Calendar,
    Receipt,
    Wallet
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Link from "next/link";

// Make the icon selection dynamic based on the actual status
const StatusIcon = ({ status }: { status: string }) => {
    const s = status.toLowerCase();
    if (s.includes("paid") || s.includes("confirmed") || s.includes("completed")) return <CheckCircle2 className="text-emerald-500" size={18} />;
    if (s.includes("fail") || s.includes("reject") || s.includes("cancel")) return <AlertCircle className="text-rose-500" size={18} />;
    if (s.includes("ship") || s.includes("transit") || s.includes("deliver")) return <Truck className="text-blue-500" size={18} />;
    if (s.includes("deposit") || s.includes("payment")) return <Wallet className="text-gold" size={18} />;
    return <Clock className="text-gold" size={18} />;
};

const ActorBadge = ({ type }: { type: string }) => {
    const icon = type === "CUSTOMER" ? <User size={10} /> : type === "VENDOR" ? <Store size={10} /> : <Settings size={10} />;
    const color = type === "CUSTOMER" ? "bg-amber-100/50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500" 
        : type === "VENDOR" ? "bg-gold/10 text-gold" 
        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

    return (
        <span className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest backdrop-blur-md ${color}`}>
            {icon} {type}
        </span>
    );
};

export default function OrderTimelinePage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const { data: orderResponse, isLoading, error } = useQuery({
        queryKey: ["order", orderId],
        queryFn: () => orderService.getOrderById(orderId),
        enabled: !!orderId,
    });

    const order = orderResponse?.data;

    // Ordered stepper configuration ensuring tracking sequence logic
    const orderSteps = useMemo(() => {
        return [
            { 
                label: "Order Placed", 
                icon: <Package size={20} />, 
                statuses: ["CHECKOUT_INITIATED", "PAYMENT_PENDING", "PAYMENT_FAILED", "DEPOSIT_PENDING", "DEPOSIT_PAID", "CONFIRMED", "AWAITING_FULL_PAYMENT", "PREPARING", "SHIPPED", "DELIVERED", "COMPLETED"] 
            },
            { 
                label: "Deposit Secured", 
                icon: <Wallet size={20} />, 
                statuses: ["DEPOSIT_PAID", "CONFIRMED", "AWAITING_FULL_PAYMENT", "PREPARING", "SHIPPED", "DELIVERED", "COMPLETED"] 
            },
            { 
                label: "Preparing", 
                icon: <Store size={20} />, 
                statuses: ["PREPARING", "SHIPPED", "DELIVERED", "COMPLETED"] 
            },
            { 
                label: "In Transit", 
                icon: <Truck size={20} />, 
                statuses: ["SHIPPED", "DELIVERED", "COMPLETED"] 
            },
            { 
                label: "Completed", 
                icon: <CheckCircle2 size={20} />, 
                statuses: ["DELIVERED", "COMPLETED"] 
            }
        ];
    }, []);

    if (isLoading) return <div className="flex min-h-screen items-center justify-center font-serif text-lg tracking-widest text-gold animate-pulse">Opening the archives...</div>;
    if (error || !order) return <div className="py-40 text-center font-serif text-lg text-rose-500">Order not found.</div>;

    const currentStatusIdx = orderSteps.map(s => s.statuses.includes(order.status)).lastIndexOf(true);
    const isCancelled = ["CANCELLED", "REFUNDING", "REFUNDED", "VENDOR_REJECTED"].includes(order.status);

    return (
        <main className="min-h-screen bg-[#FAFAF9] pb-32 dark:bg-[#050505]">
            <PageHero
                title={`Order #${order.orderNumber.split('-').pop()}`}
                subtitle="Timeline of your jewelry's journey from our Maison to your hands."
                breadcrumbs={[{ label: "Account", href: "/profile" }, { label: "Orders", href: "/profile" }, { label: "Tracking" }]}
            />

            <div className="container mx-auto px-4 lg:px-12">
                <div className="mx-auto max-w-5xl">
                    <button
                        onClick={() => router.back()}
                        className="mb-8 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase transition-all hover:text-gray-950 dark:hover:text-white"
                    >
                        <ArrowLeft size={14} /> Back to Maison
                    </button>

                    {/* Progress Stepper - Top Section */}
                    <div className="mb-8 rounded-3xl border border-gray-100 bg-white/60 p-8 shadow-sm backdrop-blur-xl dark:border-white/5 dark:bg-[#0C0A09]/60">
                        {isCancelled ? (
                            <div className="flex items-center justify-center py-6 text-rose-500">
                                <AlertCircle size={40} className="mr-4" />
                                <div>
                                    <h3 className="font-serif text-2xl">Order Cancelled</h3>
                                    <p className="text-sm opacity-80">This order has been cancelled and is undergoing refund process if applicable.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative flex justify-between">
                                {/* Connecting Background Lines */}
                                <div className="absolute left-[10%] right-[10%] top-6 h-0.5 bg-gray-100 dark:bg-white/10" />
                                <div 
                                    className="absolute left-[10%] top-6 h-0.5 bg-gold transition-all duration-1000 ease-in-out" 
                                    style={{ width: `${Math.max(0, (currentStatusIdx / (orderSteps.length - 1)) * 80)}%` }}
                                />

                                {orderSteps.map((step, idx) => {
                                    const isActive = currentStatusIdx >= idx;
                                    const isCurrent = currentStatusIdx === idx;
                                    
                                    return (
                                        <div key={idx} className="relative z-10 flex flex-col items-center">
                                            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full border-4 transition-all duration-500 shadow-sm ${isActive ? 'border-white bg-gold text-white dark:border-[#0C0A09]' : 'border-white bg-gray-50 text-gray-300 dark:border-[#0C0A09] dark:bg-white/5 dark:text-gray-600'} ${isCurrent ? 'ring-4 ring-gold/20 scale-110' : ''}`}>
                                                {step.icon}
                                            </div>
                                            <span className={`text-center text-[10px] font-bold tracking-widest uppercase transition-colors duration-500 ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* Delivery & Summary Column (Left) */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Delivery Info */}
                            <div className="rounded-3xl border border-gray-100 bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-white/5 dark:bg-[#0C0A09]/60">
                                <h3 className="mb-6 font-serif text-xl flex items-center gap-3 text-gray-900 dark:text-white">
                                    <MapPin className="text-gold" size={20} /> Delivery Details
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Recipient</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{order.shippingName}</p>
                                        <p className="text-sm text-gray-500 mt-0.5">{order.shippingPhone}</p>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Delivery Address</p>
                                        <p className="text-sm text-gray-700 leading-relaxed dark:text-gray-300">
                                            {order.shippingAddress || "Standard delivery address provided at checkout."}
                                        </p>
                                    </div>
                                    <div className="pt-2 border-t border-gray-100 dark:border-white/5">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Logistics / Courier</p>
                                        <p className="flex items-center gap-2 text-sm text-gray-900 dark:text-white mt-1">
                                            <Truck size={16} className="text-gold" /> GHN Express 
                                            <span className="bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-xs ml-auto">Tracker ID: {order.orderNumber.slice(-8)}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="rounded-3xl border border-gray-100 bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-white/5 dark:bg-[#0C0A09]/60">
                                <h3 className="mb-6 font-serif text-xl flex items-center gap-3 text-gray-900 dark:text-white">
                                    <Receipt className="text-gold" size={20} /> Order Summary
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">Order ID:</span>
                                        <span className="font-mono text-xs font-medium dark:text-white uppercase">{order.orderNumber}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">Placed On:</span>
                                        <span className="font-medium dark:text-white text-xs">{format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")}</span>
                                    </div>
                                    
                                    <div className="my-4 border-t border-dashed border-gray-200 dark:border-white/10"></div>
                                    
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">Total Value:</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{order.totalAmount.toLocaleString()} VND</span>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="rounded-2xl bg-gold/5 p-5 border border-gold/10">
                                <div className="flex gap-4">
                                    <ShieldCheck className="shrink-0 text-gold" size={24} />
                                    <div className="text-xs text-gold/80 leading-relaxed">
                                        <p className="font-bold mb-1 uppercase tracking-widest text-gold text-[10px]">Maison Guarantee</p>
                                        <p className="italic">Every step of your order is cryptographically logged, ensuring 100% transparency and security for your luxury acquisition.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Logistics (Right) */}
                        <div className="lg:col-span-8">
                            {order.status === "AWAITING_FULL_PAYMENT" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8 rounded-3xl border border-gold bg-gradient-to-r from-gold/10 to-transparent p-8"
                                >
                                    <h3 className="mb-2 font-serif text-2xl text-gray-900 dark:text-white">Ready for Acquisition</h3>
                                    <p className="mb-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Your jewelry is prepared and awaiting your final confirmation. Please complete the remaining balance to initiate priority shipping via secured transit.</p>
                                    <Link
                                        href={`/orders/${orderId}/payment`}
                                        className="group inline-flex items-center gap-3 rounded-2xl bg-gold px-8 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:scale-[1.02] active:scale-95"
                                    >
                                        Complete Acquisition <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </motion.div>
                            )}

                            <div className="relative rounded-3xl border border-gray-100 bg-white/60 p-8 shadow-sm backdrop-blur-xl dark:border-white/5 dark:bg-[#0C0A09]/60">
                                <h3 className="mb-8 font-serif text-xl border-b border-gray-100 pb-4 dark:border-white/5 text-gray-900 dark:text-white">
                                    Tracking Logistics
                                </h3>
                                
                                <div className="relative pl-8">
                                    {/* Vertical Line via absolute positioning */}
                                    <div className="absolute top-2 bottom-2 left-[15px] w-[2px] bg-gray-100 dark:bg-white/10 rounded-full"></div>

                                    <div className="space-y-10">
                                        {/* Sort timeline items descending */}
                                        {order.timeline?.sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()).map((item, idx) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="relative group"
                                            >
                                                {/* Left Timeline Dot */}
                                                <div className={`absolute -left-[35px] top-1 flex h-[22px] w-[22px] items-center justify-center rounded-full border-4 border-white dark:border-[#0C0A09] bg-gray-200 dark:bg-gray-700 transition-all z-10 ${idx === 0 ? "scale-125 bg-gold shadow-[0_0_15px_rgba(202,138,4,0.4)]" : "group-hover:bg-gray-400 dark:group-hover:bg-gray-500"}`}>
                                                    {idx === 0 && <div className="h-1.5 w-1.5 bg-white rounded-full"></div>}
                                                </div>

                                                <div className="ml-2 transition-all group-hover:translate-x-1">
                                                    <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className={`text-sm font-bold tracking-[0.05em] uppercase ${idx === 0 ? 'text-gold' : 'text-gray-900 dark:text-white'}`}>
                                                                {item.status.replace(/_/g, " ")}
                                                            </h4>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <ActorBadge type={item.actorType} />
                                                        </div>
                                                    </div>
                                                    
                                                    <p className="mb-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400 border-l-2 border-transparent group-hover:border-gold/30 pl-2 -ml-2 transition-all">
                                                        {item.note || "System update processed."}
                                                    </p>
                                                    
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                                                        <Calendar size={12} className="opacity-70" />
                                                        {format(new Date(item.changedAt), "dd MMMM yyyy, HH:mm")}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

