"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { orderService, OrderDto } from "@/services/order.service";
import { AlertTriangle, Clock, Truck, ShieldAlert, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function GlobalOrderWatcher() {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.user);
    const [urgentOrder, setUrgentOrder] = useState<OrderDto | null>(null);
    const [dismissedOrders, setDismissedOrders] = useState<string[]>([]);
    const pathname = usePathname();

    // Load dismissed alerts from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("yash_dismissed_alerts");
        if (saved) {
            try {
                setDismissedOrders(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse dismissed alerts", e);
            }
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;

        // Fetch orders periodically or on mount
        const fetchOrders = async () => {
            try {
                const response = await orderService.getOrders();
                if (response?.success && Array.isArray(response.data)) {
                    const sorted = [...response.data].sort((a, b) => 
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    
                    // Find the first actionable urgent order that hasn't been dismissed
                    const criticalOrder = sorted.find(
                        (o) =>
                            ["AWAITING_FULL_PAYMENT", "VENDOR_REJECTED", "DELIVERED", "REDELIVERED", "RETURN_APPROVED"].includes(o.status) &&
                            !dismissedOrders.includes(`${o.orderId}:${o.status}`)
                    );
                    if (criticalOrder) {
                        setUrgentOrder(criticalOrder);
                    }
                }
            } catch (err) { }
        };

        fetchOrders();
    }, [isAuthenticated, dismissedOrders, pathname]); // Re-check occasionally when navigating

    if (!urgentOrder) return null;

    // Build mapping for urgent statuses
    const getAlertContent = () => {
        switch (urgentOrder.status) {
            case "AWAITING_FULL_PAYMENT":
                return {
                    title: "Payment Required",
                    icon: Clock,
                    color: "text-amber-500",
                    bg: "bg-amber-500/10",
                    border: "border-amber-200 dark:border-amber-800/30",
                    desc: "Your order is ready. Please pay the remaining balance within 72 hours of order creation to avoid cancellation and loss of deposit.",
                    actionText: "Pay Now"
                };
            case "VENDOR_REJECTED":
                return {
                    title: "Order Rejected",
                    icon: ShieldAlert,
                    color: "text-red-500",
                    bg: "bg-red-500/10",
                    border: "border-red-200 dark:border-red-800/30",
                    desc: "The vendor has rejected your order. Your deposit is being refunded to your credit card. Please check order details.",
                    actionText: "View Details"
                };
            case "RETURN_APPROVED":
                return {
                    title: "Return Request Approved",
                    icon: ShieldAlert,
                    color: "text-emerald-500",
                    bg: "bg-emerald-500/10",
                    border: "border-emerald-200 dark:border-emerald-800/30",
                    desc: "Your return and refund request has been approved by the Yash Jewels expert team. Click below to receive your refund immediately.",
                    actionText: "Get Refund Now"
                };
            case "DELIVERED":
                return {
                    title: "Order Delivered",
                    icon: Truck,
                    color: "text-emerald-500",
                    bg: "bg-emerald-500/10",
                    border: "border-emerald-200 dark:border-emerald-800/30",
                    desc: "Please inspect your items. You have 7 days to 'Confirm Receipt' or 'Request Return'. After 7 days, the order will be automatically completed.",
                    actionText: "Check Now"
                };
            case "REDELIVERED":
                return {
                    title: "Item Returned to You",
                    icon: Truck,
                    color: "text-blue-500",
                    bg: "bg-blue-500/10",
                    border: "border-blue-200 dark:border-blue-800/30",
                    desc: "Your jewelry has been returned to you after the return inspection was not approved. The order is now officially closed.",
                    actionText: "View Details"
                };
            default:
                return {
                    title: "Order Updated",
                    icon: AlertTriangle,
                    color: "text-blue-500",
                    bg: "bg-blue-500/10",
                    border: "border-blue-200 dark:border-blue-800/30",
                    desc: "There is an important update regarding your order.",
                    actionText: "View Details"
                };
        }
    };

    const content = getAlertContent();
    const ContentIcon = content.icon;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className={`relative w-full max-w-md rounded-3xl border bg-white p-8 shadow-2xl dark:bg-[#111] ${content.border}`}>
                <button
                    onClick={() => {
                        const newDismissed = [...dismissedOrders, `${urgentOrder.orderId}:${urgentOrder.status}`];
                        setDismissedOrders(newDismissed);
                        localStorage.setItem("yash_dismissed_alerts", JSON.stringify(newDismissed));
                        setUrgentOrder(null);
                    }}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                    <X size={20} />
                </button>

                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full mx-auto shadow-inner ${content.bg} ${content.color}`}>
                    <ContentIcon size={32} />
                </div>
                <h2 className="mb-2 text-center font-serif text-2xl text-gray-900 dark:text-white">{content.title}</h2>
                <div className="text-center mb-2 font-bold text-gray-900 dark:text-white">
                    {urgentOrder.orderNumber}
                </div>
                <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    {content.desc}
                </p>

                <div className="flex gap-4">
                    <Link
                        href={`/orders/${urgentOrder.orderId}/timeline`}
                        onClick={() => {
                            const newDismissed = [...dismissedOrders, `${urgentOrder.orderId}:${urgentOrder.status}`];
                            setDismissedOrders(newDismissed);
                            localStorage.setItem("yash_dismissed_alerts", JSON.stringify(newDismissed));
                            setUrgentOrder(null);
                        }}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-lg ${
                            urgentOrder.status === 'VENDOR_REJECTED' ? 'bg-red-600 text-white hover:bg-red-700' :
                            (urgentOrder.status === 'DELIVERED' || urgentOrder.status === 'RETURN_APPROVED') ? 'bg-emerald-600 text-white hover:bg-emerald-700' :
                            'bg-gold text-white hover:brightness-110 shadow-gold/20'
                        }`}
                    >
                        {content.actionText} <ChevronRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
