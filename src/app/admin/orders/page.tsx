"use client";

import { useState, useEffect, useCallback } from "react";
import { 
    Eye, CheckCircle2, XCircle, 
    RefreshCw, AlertTriangle, FileText, 
    Truck, ShieldCheck, ExternalLink,
    Search, Filter, Download, FileBox
} from "lucide-react";

import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Drawer } from "../_components/ui/Drawer";
import { Modal } from "../_components/ui/Modal";
import { format } from "date-fns";
import { adminService } from "@/services/admin.service";
import { orderService, OrderDetailDto, OrderTimelineDto } from "@/services/order.service";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api-client";

// --- Visual Components ---

function OrderTimeline({ timeline }: { timeline: OrderTimelineDto[] }) {
    if (!timeline?.length) return null;

    return (
        <div className="flex flex-col gap-4 py-2">
            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">Fulfillment Timeline</p>
            <div className="relative flex flex-col gap-6 pl-4 border-l-2 border-gray-100 dark:border-gray-800 ml-2">
                {timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                        <div className={`absolute -left-[25px] top-1 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-sm dark:border-[#111]`} title={step.status} />
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between gap-4">
                                <span className="font-plus-jakarta text-xs font-bold text-gray-900 dark:text-gray-100">{step.status.replace(/_/g, ' ')}</span>
                                <span className="font-plus-jakarta text-[10px] text-gray-400">{format(new Date(step.changedAt), "MMM dd, HH:mm")}</span>
                            </div>
                            {step.note && <p className="mt-1 font-plus-jakarta text-[11px] text-gray-500 italic">"{step.note}"</p>}
                            <p className="font-plus-jakarta text-[9px] font-bold text-gray-400 uppercase tracking-tighter">— {step.actorType}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AssignShipperModal({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: (shipperId: string) => Promise<void> }) {
    const [shippers, setShippers] = useState<any[]>([]);
    const [selectedShipperId, setSelectedShipperId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            adminService.shippers.getAll()
                .then(res => {
                    if (res.success) {
                        // Filter active shippers only
                        setShippers(res.data.filter((s: any) => s.status === 1 || s.status === "ACTIVE" || s.isActive));
                    }
                })
                .catch(err => toast.error("Failed to load shippers"))
                .finally(() => setIsLoading(false));
        } else {
            setSelectedShipperId("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold font-plus-jakarta text-gray-900 dark:text-white">Assign Shipper</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Select an active courier to assign to this delivery. They will be notified immediately.
                </p>

                {isLoading ? (
                    <div className="flex justify-center p-4">
                        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <select
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white mb-6"
                        value={selectedShipperId}
                        onChange={(e) => setSelectedShipperId(e.target.value)}
                    >
                        <option value="">-- Select a courier --</option>
                        {shippers.map(shipper => (
                            <option key={shipper.shipperId} value={shipper.shipperId}>
                                {shipper.fullName} ({shipper.email})
                            </option>
                        ))}
                    </select>
                )}

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm tracking-wide hover:bg-gray-50 transition-colors dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800">
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            if (!selectedShipperId) return;
                            setIsSubmitting(true);
                            await onConfirm(selectedShipperId);
                            setIsSubmitting(false);
                        }}
                        disabled={!selectedShipperId || isSubmitting}
                        className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm tracking-wide hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Confirm Assignment"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    
    // Selection state
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [detail, setDetail] = useState<OrderDetailDto | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    
    // UI Modals
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewTitle, setPreviewTitle] = useState("");
    const [assignOrderId, setAssignOrderId] = useState<string | null>(null);

    
    const [actionLoading, setActionLoading] = useState(false);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminService.getOrdersApi();
            if (res.success) setOrders(res.data);
        } catch (error) {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleViewDetail = async (id: string) => {
        setSelectedId(id);
        setIsDetailOpen(true);
        setDetailLoading(true);
        try {
            const res = await adminService.getOrderDetailApi(id);
            if (res.success) setDetail(res.data);
        } catch (error) {
            toast.error("Could not fetch order details");
        } finally {
            setDetailLoading(false);
        }
    };

    const handleDecision = async (approve: boolean) => {
        if (!detail) return;
        if (!confirm(`Are you sure you want to ${approve ? 'APPROVE' : 'REJECT'} this order?`)) return;

        setActionLoading(true);
        try {
            const reason = approve ? "Admin cleared for processing" : "Rejected during manual review";
            const res = await adminService.confirmOrderApi(detail.orderId, approve, reason);
            if (res.success) {
                toast.success(approve ? "Order approved" : "Order rejected");
                fetchOrders();
                setIsDetailOpen(false);
            }
        } catch (error) {
            toast.error("Process failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleAssignShipperSubmit = async (shipperId: string) => {
        if (!assignOrderId) return;
        setActionLoading(true);
        try {
            const res = await adminService.assignShipperApi(assignOrderId, shipperId);
            if (res.success) {
                toast.success("Courier assigned successfully!");
                setAssignOrderId(null);
                fetchOrders();
                if (detail && detail.orderId === assignOrderId) {
                    handleViewDetail(assignOrderId); // refresh detail
                }
            } else {
                toast.error(res.message || "Assignment failed");
            }
        } catch (error) {
            toast.error("Unexpected error assigning shipper");
        } finally {
            setActionLoading(false);
        }
    };

    const filtered = orders.filter(o => {
        const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
                             o.customerName.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !filterStatus || o.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Grand Order Master"
                description="Consolidated overview of all jewelry transactions, fulfillment controls and document management."
                badge={{ 
                    count: orders.filter(o => o.status === "DEPOSIT_PAID").length, 
                    label: "Action Required", 
                    color: "bg-amber-50 text-amber-600 border border-amber-100" 
                }}
                actions={
                    <button onClick={fetchOrders} className="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300">
                        <RefreshCw className={`h-4 w-4 transition-transform group-hover:rotate-180 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                }
            />

            {/* Filter Toolbar */}
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md p-6 dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by Order # or Customer..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-4 font-plus-jakarta text-sm font-medium focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a]/50 dark:text-gray-100" 
                        />
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                            <select 
                                value={filterStatus}
                                onChange={e => setFilterStatus(e.target.value)}
                                className="appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-8 font-plus-jakarta text-xs font-bold text-gray-600 hover:bg-gray-50 focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a]/50 dark:text-gray-300"
                            >
                                <option value="">All Statuses</option>
                                <option value="DEPOSIT_PAID">Paid (Deposit)</option>
                                <option value="FULLY_PAID">Paid (Full)</option>
                                <option value="SHIPPED">In Transit</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                {["Order Identity", "Customer", "Financials", "Status", "Docs", "Actions"].map(h => (
                                    <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-20 text-center font-plus-jakarta text-gray-400 animate-pulse">Syncing with blockchain registry...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-20 text-center font-plus-jakarta text-gray-400">No matching orders found.</td></tr>
                            ) : filtered.map((order) => (
                                <tr key={order.orderId} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">#{order.orderNumber}</span>
                                            <span className="font-plus-jakarta text-[10px] text-gray-400 uppercase tracking-widest">{format(new Date(order.createdAt), "MMM dd, yyyy")}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center font-black text-blue-600 text-xs dark:bg-blue-900/20">
                                                {order.customerName.charAt(0)}
                                            </div>
                                            <span className="font-plus-jakarta text-sm font-semibold text-gray-700 dark:text-gray-300">{order.customerName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{order.totalAmount?.toLocaleString()} VND</span>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="font-plus-jakarta text-[10px] font-bold text-blue-500 uppercase">{order.depositPct}% Dep.</span>
                                                {order.isCod && <span className="bg-amber-50 text-amber-600 text-[8px] font-bold uppercase border border-amber-100 rounded px-1">COD</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={order.status.toLowerCase()} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            {order.invoiceUrl && <span title="Invoice Attached"><FileText className="h-3.5 w-3.5 text-emerald-500" /></span>}
                                            {order.items?.some((i: any) => i.certificationUrl) && <span title="Certs Attached"><ShieldCheck className="h-3.5 w-3.5 text-blue-500" /></span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => handleViewDetail(order.orderId)}
                                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-plus-jakarta text-xs font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
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

            {/* Selection Drawer */}
            <Drawer
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                title={detail ? `Order #${detail.orderNumber}` : "Loading Order..."}
                subtitle={detail ? `Control Hub for ${detail.customerName}` : ""}
                footer={
                    <div className="flex gap-3 w-full">
                        <button onClick={() => setIsDetailOpen(false)} className="flex-1 rounded-xl border border-gray-200 py-3 font-plus-jakarta text-sm font-bold text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400">Cancel</button>
                        {detail?.status === "DEPOSIT_PAID" && (
                            <button disabled={actionLoading} onClick={() => handleDecision(true)} className="flex-[2] rounded-xl bg-blue-600 py-3 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20">Approve & Start Processing</button>
                        )}
                        {(detail?.status === "SHIP_PENDING" || detail?.status === "RETURN_AUTHORIZED") && (
                            <button disabled={actionLoading} onClick={() => setAssignOrderId(detail.orderId)} className="flex-[2] rounded-xl bg-emerald-600 py-3 font-plus-jakarta text-sm font-bold text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
                                <Truck className="inline-block w-4 h-4 mr-2" />
                                {detail.status === "RETURN_AUTHORIZED" ? "Assign Courier for Return" : "Assign Courier"}
                            </button>
                        )}
                    </div>
                }
            >
                {detailLoading ? (
                    <div className="flex flex-col gap-4 animate-pulse p-4">
                        {[1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl" />)}
                    </div>
                ) : detail && (
                    <div className="flex flex-col gap-8 pb-10">
                        {/* Highlights Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-gray-100 p-4 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/30">
                                <p className="text-[10px] font-bold uppercase text-gray-400">Settlement Status</p>
                                <p className="mt-1 font-plus-jakarta text-lg font-bold text-gray-900 dark:text-white">{detail.depositPct}% Paid</p>
                                <p className="text-[10px] font-semibold text-blue-500">{(detail.totalAmount - detail.depositAmount).toLocaleString()} VND Remaining</p>
                            </div>
                            <div className="rounded-2xl border border-gray-100 p-4 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/30">
                                <p className="text-[10px] font-bold uppercase text-gray-400">Shipping Mode</p>
                                <p className="mt-1 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white capitalize">{detail.isCod ? "Cash on Delivery" : "Pre-paid Fulfillment"}</p>
                            </div>
                        </div>

                        {/* Order Timeline */}
                        <OrderTimeline timeline={detail.timeline} />

                        {/* Order Items & Docs Integration */}
                        <div className="flex flex-col gap-4">
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">Items & Certifications</p>
                            {detail.items.map((item) => (
                                <div key={item.orderItemId} className="group relative flex flex-col gap-3 rounded-2xl border border-gray-100 p-4 transition-all hover:border-blue-100 dark:border-gray-800">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <p className="font-plus-jakarta text-sm font-black text-gray-900 dark:text-white">{item.productName}</p>
                                            <p className="font-plus-jakarta text-[11px] text-gray-400 uppercase tracking-widest leading-none mt-1">{item.styleCode} x {item.quantity}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{item.unitPrice.toLocaleString()} VND</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 pt-3 border-t border-gray-50 dark:border-gray-800/50">
                                        {item.certificationUrl ? (
                                            <div className="flex items-center gap-3 w-full">
                                                <div 
                                                    onClick={() => { setPreviewUrl(item.certificationUrl!); setPreviewTitle("Jewel Certification"); setIsPreviewModalOpen(true); }}
                                                    className="relative h-16 w-12 rounded-lg border border-gray-100 bg-white overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all dark:bg-gray-800 dark:border-gray-700"
                                                >
                                                    {item.certificationThumbnailUrl ? (
                                                        <img src={item.certificationThumbnailUrl} className="h-full w-full object-cover" alt="Cert" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-gray-50 dark:bg-gray-800">
                                                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                        <Eye className="h-3 w-3 text-white" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Certification</span>
                                                    <button 
                                                        onClick={() => { setPreviewUrl(item.certificationUrl!); setPreviewTitle("Jewel Certification"); setIsPreviewModalOpen(true); }}
                                                        className="text-[11px] font-bold text-blue-600 hover:underline text-left"
                                                    >
                                                        Click to View GIA/IGI
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                                <AlertTriangle className="h-3 w-3 text-amber-500" />
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">Awaiting Gen</span>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            ))}
                        </div>

                        {/* Order-Level Docs */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">Final Documentation</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border aspect-square overflow-hidden transition-all ${detail.invoiceUrl ? 'border-emerald-100 bg-white shadow-sm ring-1 ring-emerald-50' : 'border-dashed border-gray-200 bg-gray-50/30'}`}>
                                    {detail.invoiceUrl ? (
                                        <>
                                            <div onClick={() => { setPreviewUrl(detail.invoiceUrl!); setPreviewTitle("Sales Invoice"); setIsPreviewModalOpen(true); }} className="relative w-full h-full cursor-pointer group">
                                                {detail.invoiceThumbnailUrl ? (
                                                    <img src={detail.invoiceThumbnailUrl} className="h-full w-full object-cover" alt="Invoice" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-emerald-50/50">
                                                        <FileText className="h-8 w-8 text-emerald-500" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Eye className="h-6 w-6 text-white mb-1" />
                                                    <span className="text-[10px] font-bold text-white uppercase">Preview</span>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-2 flex items-center justify-between border-t border-gray-100">
                                                <span className="text-[10px] font-bold text-gray-500 truncate">Invoice.pdf</span>
                                                <a href={detail.invoiceUrl} download target="_blank" rel="noreferrer" className="p-1 px-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"><Download className="h-3 w-3" /></a>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="h-8 w-8 text-gray-200" />
                                            <span className="text-[10px] font-bold uppercase text-gray-400">No Invoice</span>
                                        </>
                                    )}
                                </div>

                                <div className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border aspect-square overflow-hidden transition-all ${detail.insuranceUrl ? 'border-blue-100 bg-white shadow-sm ring-1 ring-blue-50' : 'border-dashed border-gray-200 bg-gray-50/30'}`}>
                                    {detail.insuranceUrl ? (
                                        <>
                                            <div onClick={() => { setPreviewUrl(detail.insuranceUrl!); setPreviewTitle("Insurance Policy"); setIsPreviewModalOpen(true); }} className="relative w-full h-full cursor-pointer group">
                                                {detail.insuranceThumbnailUrl ? (
                                                    <img src={detail.insuranceThumbnailUrl} className="h-full w-full object-cover" alt="Insurance" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-blue-50/50">
                                                        <ShieldCheck className="h-8 w-8 text-blue-500" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Eye className="h-6 w-6 text-white mb-1" />
                                                    <span className="text-[10px] font-bold text-white uppercase">Preview</span>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-2 flex items-center justify-between border-t border-gray-100">
                                                <span className="text-[10px] font-bold text-gray-500 truncate">Insurance.pdf</span>
                                                <a href={detail.insuranceUrl} download target="_blank" rel="noreferrer" className="p-1 px-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"><Download className="h-3 w-3" /></a>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 opacity-50">
                                            <ShieldCheck className="h-8 w-8 text-gray-200" />
                                            <span className="text-[10px] font-bold uppercase text-gray-400">Pending Policy</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Customer & Shipping */}
                        <div className="flex flex-col gap-4">
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">Logistics Detail</p>
                            <div className="rounded-2xl border border-gray-100 p-5 dark:border-gray-800">
                                <div className="flex items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600"><Truck className="h-5 w-5" /></div>
                                        <div>
                                            <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{detail.shippingName}</p>
                                            <p className="font-plus-jakarta text-xs text-gray-500">{detail.shippingPhone}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/60">
                                    <p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400 mb-1">Destiny Address</p>
                                    <p className="font-plus-jakarta text-xs font-semibold text-gray-700 dark:text-gray-300 leading-relaxed">{detail.shippingAddress}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>



            {/* PDF Preview Modal */}
            <Modal
                isOpen={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                title={previewTitle}
                size="lg"
                footer={
                    <div className="flex gap-3 w-full">
                        <button onClick={() => setIsPreviewModalOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50">Close Preview</button>
                        {previewUrl && (
                            <a 
                                href={previewUrl} 
                                download 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                            >
                                <Download className="h-4 w-4" /> Download Official PDF
                            </a>
                        )}
                    </div>
                }
            >
                <div className="w-full aspect-[1/1.4] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                    {previewUrl ? (
                        <iframe 
                            src={`${previewUrl}#toolbar=0`} 
                            className="w-full h-full border-none"
                            title="PDF Preview"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <FileBox className="h-12 w-12 text-gray-300 animate-bounce" />
                            <p className="font-plus-jakarta text-sm font-bold text-gray-400">Loading document vault...</p>
                        </div>
                    )}
                </div>
            </Modal>

            <AssignShipperModal
                isOpen={!!assignOrderId}
                onClose={() => setAssignOrderId(null)}
                onConfirm={handleAssignShipperSubmit}
            />
        </div>

    );
}


