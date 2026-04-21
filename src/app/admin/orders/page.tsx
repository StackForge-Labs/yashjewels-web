"use client";

import { useState, useEffect, useCallback } from "react";
import { 
    Eye, CheckCircle2, XCircle, PhoneCall, 
    RefreshCw, AlertTriangle, FileText, Upload, 
    Truck, ShieldCheck, ExternalLink,
    Search, Filter, Plus
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
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    
    // Action states
    const [contactForm, setContactForm] = useState({ note: "", isSuccess: true });
    const [actionLoading, setActionLoading] = useState(false);

    // Document state (Simplified: in a real app, use a Cloudinary widget or service)
    const [docType, setDocType] = useState<"invoice" | "insurance" | "certification">("invoice");
    const [selectedItemId, setSelectedItemId] = useState<string | "">("");

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

    const handleLogContact = async () => {
        if (!detail) return;
        setActionLoading(true);
        try {
            // Determine attempt number based on existing timeline entries for contact
            const attempts = detail.timeline.filter(t => t.note?.includes("Contact attempt")).length;
            const res = await adminService.recordOrderContactApi({
                orderId: detail.orderId,
                attemptNumber: attempts + 1,
                isSuccess: contactForm.isSuccess,
                note: contactForm.note
            });
            if (res.success) {
                toast.success("Contact logged");
                setIsContactModalOpen(false);
                setContactForm({ note: "", isSuccess: true });
                handleViewDetail(detail.orderId); // Refresh detail
            }
        } catch(error) {
            toast.error("Failed to log contact");
        } finally {
            setActionLoading(false);
        }
    };

    const handleUploadDoc = async (url: string, publicId: string) => {
        if (!detail) return;
        setActionLoading(true);
        try {
            const payload: any = {};
            if (docType === "invoice") {
                payload.invoiceUrl = url;
                payload.invoicePublicId = publicId;
            } else if (docType === "insurance") {
                payload.insuranceUrl = url;
                payload.insurancePublicId = publicId;
            } else {
                payload.itemCertifications = [{
                    orderItemId: selectedItemId,
                    certificationUrl: url,
                    certificationPublicId: publicId
                }];
            }

            const res = await adminService.updateOrderDocumentsApi(detail.orderId, payload);
            if (res.success) {
                toast.success("Document updated successfully");
                setIsDocModalOpen(false);
                handleViewDetail(detail.orderId); // Refresh
            }
        } catch (error) {
            toast.error("Upload failed");
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
                                            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 font-plus-jakarta text-xs font-bold text-white transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 dark:bg-white dark:text-black dark:hover:bg-blue-500 dark:hover:text-white"
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
                            <button disabled={actionLoading} onClick={() => handleDecision(true)} className="flex-[2] rounded-xl bg-blue-600 py-3 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20">Clear for Fulfillment</button>
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
                                    
                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-50 dark:border-gray-800/50">
                                        {item.certificationUrl ? (
                                            <a href={item.certificationUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                <ShieldCheck className="h-3 w-3" /> GIA/IGI Certificated
                                            </a>
                                        ) : (
                                            <button 
                                                onClick={() => { setDocType("certification"); setSelectedItemId(item.orderItemId); setIsDocModalOpen(true); }}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800"
                                            >
                                                <Plus className="h-3 w-3" /> Add Certificate
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order-Level Docs */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">Final Documentation</p>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => { setDocType("invoice"); setIsDocModalOpen(true); }} className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-blue-600 dark:bg-gray-800"><Upload className="h-4 w-4" /></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border aspect-square ${detail.invoiceUrl ? 'border-emerald-100 bg-emerald-50/20' : 'border-dashed border-gray-200'}`}>
                                    <FileText className={`h-8 w-8 ${detail.invoiceUrl ? 'text-emerald-500' : 'text-gray-200'}`} />
                                    <span className="text-[10px] font-bold uppercase text-gray-500">Sales Invoice</span>
                                    {detail.invoiceUrl && <a href={detail.invoiceUrl} target="_blank" rel="noreferrer" className="absolute top-2 right-2 p-1.5 rounded-lg bg-white shadow-sm text-gray-400 hover:text-blue-500"><ExternalLink className="h-3 w-3" /></a>}
                                </div>
                                <div className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border aspect-square ${detail.insuranceUrl ? 'border-blue-100 bg-blue-50/20' : 'border-dashed border-gray-200'}`} 
                                     onClick={() => { if(!detail.insuranceUrl) { setDocType("insurance"); setIsDocModalOpen(true); } }}>
                                    <ShieldCheck className={`h-8 w-8 ${detail.insuranceUrl ? 'text-blue-500' : 'text-gray-200'}`} />
                                    <span className="text-[10px] font-bold uppercase text-gray-500">Insurance</span>
                                    {detail.insuranceUrl && <a href={detail.insuranceUrl} target="_blank" rel="noreferrer" className="absolute top-2 right-2 p-1.5 rounded-lg bg-white shadow-sm text-gray-400 hover:text-blue-500"><ExternalLink className="h-3 w-3" /></a>}
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
                                    <button onClick={() => setIsContactModalOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 text-[10px] font-bold text-amber-600 hover:bg-amber-100">
                                        <PhoneCall className="h-3 w-3" /> Call Customer
                                    </button>
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

            {/* Document Upload Simulation Modal */}
            <Modal
                isOpen={isDocModalOpen}
                onClose={() => setIsDocModalOpen(false)}
                title="Update Fulfillment Document"
                subtitle={`Securely attach a PDF for the ${docType === 'certification' ? 'Jewel Certification' : docType}`}
                size="sm"
                footer={<button onClick={() => setIsDocModalOpen(false)} className="w-full py-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-50">Cancel</button>}
            >
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center justify-center gap-4 py-8 border-2 border-dashed border-gray-100 rounded-3xl group hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer"
                         onClick={() => {
                             // Mocking a Cloudinary upload result
                             const mockUrl = "https://res.cloudinary.com/demo/image/upload/sample.pdf";
                             const mockId = `doc_${Math.random().toString(36).substr(2, 9)}`;
                             handleUploadDoc(mockUrl, mockId);
                         }}>
                        <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Upload className="h-8 w-8" />
                        </div>
                        <div className="text-center">
                            <p className="font-plus-jakarta text-sm font-bold text-gray-900">Click to upload PDF</p>
                            <p className="text-[10px] text-gray-400 font-medium">Cloudinary Secure Storage</p>
                        </div>
                        <input type="file" className="hidden" accept="application/pdf" />
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <p className="font-plus-jakarta text-[10px] font-bold text-gray-400 leading-tight">Documents must be in PDF format. Once saved, they will be visible to the customer in their Jewel Vault.</p>
                    </div>
                </div>
            </Modal>

            {/* Contact Attempt Modal */}
            <Modal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                title="Log Customer Outreach"
                subtitle="Document your communication for other staff members"
                size="md"
                footer={<button 
                    disabled={actionLoading || !contactForm.note.trim()} 
                    onClick={handleLogContact} 
                    className="w-full py-3 rounded-xl bg-black text-white font-bold text-sm hover:bg-gray-800 disabled:opacity-40 transition-colors"
                >Document Official Attempt</button>}
            >
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setContactForm({ ...contactForm, isSuccess: true })} className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${contactForm.isSuccess ? 'border-blue-500 bg-blue-50/50 text-blue-700' : 'border-gray-50 text-gray-400 hover:border-gray-100'}`}>
                            <CheckCircle2 className="h-6 w-6" />
                            <span className="text-[11px] font-black uppercase">Confirmed</span>
                        </button>
                        <button onClick={() => setContactForm({ ...contactForm, isSuccess: false })} className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${!contactForm.isSuccess ? 'border-rose-500 bg-rose-50/50 text-rose-700' : 'border-gray-50 text-gray-400 hover:border-gray-100'}`}>
                            <XCircle className="h-6 w-6" />
                            <span className="text-[11px] font-black uppercase">No Response</span>
                        </button>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Communication Insight</label>
                        <textarea 
                            rows={4} 
                            value={contactForm.note} 
                            onChange={e => setContactForm({ ...contactForm, note: e.target.value })}
                            className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 p-4 font-plus-jakarta text-sm focus:border-blue-500 focus:bg-white focus:outline-none"
                            placeholder="Detail what happened during the call..."
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}


