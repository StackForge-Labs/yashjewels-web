"use client";

import { useState, useEffect } from "react";
import { Eye, ChevronDown, CheckCircle2, XCircle, PhoneCall, RefreshCw, AlertTriangle } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Drawer } from "../_components/ui/Drawer";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import axiosInstance from "@/lib/api-client";
import { toast } from "sonner";

type OrderItem = {
    productId: string;
    productName: string;
    styleCode: string;
    quantity: number;
    unitPrice: number;
};

type Order = {
    orderId: string;
    orderNumber: string;
    customerName: string;
    customerEmail?: string;
    createdAt: string;
    totalAmount: number;
    goldRateSnapshot: number;
    status: string;
    depositAmount: number;
    depositPct: number;
    remainingAmount: number;
    items: OrderItem[];
};

export default function OrdersPage() {
    const { token } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchOrders = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const { data } = await axiosInstance.get("/admin/orders/all");
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            toast.error("Could not load orders. Please check your permissions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

    const handleDecision = async (orderId: string, approve: boolean) => {
        if (!confirm(`Are you sure you want to ${approve ? 'APPROVE' : 'REJECT'} this order?`)) return;

        setActionLoading(true);
        try {
            const { data } = await axiosInstance.put(`/vendor/orders/${orderId}/decision`, {
                isApproved: approve,
                reason: approve ? "Approved by Admin" : "Inventory unavailable / Policy rejection"
            });
            
            if (data.success) {
                toast.success(approve ? "Order approved successfully!" : "Order rejected and refund initiated.");
                fetchOrders();
                setIsDetailOpen(false);
            } else {
                toast.error(data.message);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Action failed.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleContact = async (orderId: string) => {
        const note = prompt("Enter contact attempt note:");
        if (note === null) return;

        setActionLoading(true);
        try {
            const { data } = await axiosInstance.post(`/vendor/orders/${orderId}/contact`, {
                attemptNumber: 1,
                isSuccess: false,
                note
            });
            
            if (data.success) {
                toast.success("Contact attempt logged.");
                fetchOrders();
            }
        } catch(error: any) {
            toast.error(error.response?.data?.message || "Failed to log contact.");
        } finally {
            setActionLoading(false);
        }
    };

    const filtered = orders.filter(o =>
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Order Management"
                description="Manage real-time jewelry orders, perform manual confirmation, and handle refunds."
                badge={{ count: orders.filter(o => o.status === "DEPOSIT_PAID").length, label: "awaiting approval", color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" }}
                actions={
                    <button onClick={fetchOrders} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                }
            />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="flex flex-col gap-4 border-b border-gray-100 p-6 md:flex-row md:items-center md:justify-between dark:border-gray-800/50">
                    <input type="text" placeholder="Search by order # or customer..." value={search} onChange={e => setSearch(e.target.value)}
                        className="max-w-sm flex-1 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 font-plus-jakarta text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a]/50 dark:text-gray-100 dark:placeholder:text-gray-500" />
                </div>

                <div className="overflow-x-auto text-black dark:text-white">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                {["Order #", "Customer", "Date", "Amount", "Deposit", "Status", "Actions"].map(h => (
                                    <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50 text-black dark:text-white">
                            {loading ? (
                                <tr><td colSpan={7} className="px-6 py-10 text-center text-gray-400 font-plus-jakarta">Fetching real-time orders...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-10 text-center text-gray-400 font-plus-jakarta">No orders found.</td></tr>
                            ) : filtered.map((order) => (
                                <tr key={order.orderId} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{order.orderNumber}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{order.customerName}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-xs font-medium text-gray-500">{format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{order.totalAmount.toLocaleString()} VND</td>
                                    <td className="px-6 py-4">
                                        <p className="font-plus-jakarta text-xs font-bold text-gray-600 dark:text-gray-400">{order.depositAmount.toLocaleString()} VND</p>
                                        <p className="font-plus-jakarta text-[10px] font-bold text-blue-500 uppercase">{order.depositPct}% Paid</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={order.status.toLowerCase()} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => { setSelectedOrder(order); setIsDetailOpen(true); }}
                                            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-300"
                                        >
                                            <Eye className="h-3.5 w-3.5" /> Manage
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
                title={`Manage Order ${selectedOrder?.orderNumber}`}
                subtitle={`Placed via ${selectedOrder?.customerName} (${selectedOrder?.customerEmail || 'No email'})`}
                footer={
                    <div className="flex gap-3 w-full">
                        <button onClick={() => setIsDetailOpen(false)} className="flex-1 rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300">Close</button>
                        {(selectedOrder?.status === "DEPOSIT_PAID" || selectedOrder?.status === "CONTACT_FAILED") && (
                            <>
                                <button disabled={actionLoading} onClick={() => handleDecision(selectedOrder.orderId, false)} className="flex-1 rounded-xl bg-red-50 px-4 py-2 font-plus-jakarta text-sm font-bold text-red-600 hover:bg-red-100 disabled:opacity-50">Reject & Refund</button>
                                <button disabled={actionLoading} onClick={() => handleDecision(selectedOrder.orderId, true)} className="flex-1 rounded-xl bg-green-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50">Approve Order</button>
                            </>
                        )}
                    </div>
                }
            >
                {selectedOrder && (
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between gap-3">
                            <StatusBadge status={selectedOrder.status.toLowerCase()} />
                            <button onClick={() => handleContact(selectedOrder.orderId)} className="inline-flex items-center gap-2 text-blue-600 font-bold text-xs hover:underline">
                                <PhoneCall className="h-3.5 w-3.5" /> Log Contact
                            </button>
                        </div>

                        {selectedOrder.status === "CONTACT_FAILED" && (
                            <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 flex gap-3 dark:bg-amber-500/10 dark:border-amber-500/20">
                                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                                <div>
                                    <p className="font-plus-jakarta text-sm font-bold text-amber-900 dark:text-amber-400">Escalated Order</p>
                                    <p className="font-plus-jakarta text-xs text-amber-700 dark:text-amber-500/80">Vendor could not reach customer. Admin review required.</p>
                                </div>
                            </div>
                        )}

                        <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Financials</p>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <span className="font-plus-jakarta text-sm font-semibold text-gray-500">Total MRP</span>
                                    <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{selectedOrder.totalAmount.toLocaleString()} VND</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-plus-jakarta text-sm font-semibold text-gray-500">Deposit Paid</span>
                                    <span className="font-plus-jakarta text-sm font-bold text-blue-600">{selectedOrder.depositAmount.toLocaleString()} VND ({selectedOrder.depositPct}%)</span>
                                </div>
                                {selectedOrder.remainingAmount > 0 && (
                                    <div className="flex justify-between border-t border-gray-50 pt-2 mt-1 dark:border-gray-800">
                                        <span className="font-plus-jakarta text-sm font-semibold text-gray-500">Remaining Bal.</span>
                                        <span className="font-plus-jakarta text-sm font-bold text-amber-600">{selectedOrder.remainingAmount.toLocaleString()} VND</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Order Items</p>
                            <div className="flex flex-col gap-3">
                                {selectedOrder.items.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{item.productName}</p>
                                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.styleCode} × {item.quantity}</p>
                                        </div>
                                        <span className="shrink-0 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{item.unitPrice.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    );
}
