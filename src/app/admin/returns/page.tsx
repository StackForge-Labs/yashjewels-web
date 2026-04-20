"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight, Eye, CheckCircle2, XCircle, X, AlertCircle, Search, Loader2 } from "lucide-react";
import { postSalesService } from "@/services/post-sales.service";
import { toast } from "react-hot-toast";

// ─── Types ─────────────────────────────────────────────────────
// ─── Types ─────────────────────────────────────────────────────
type ReturnStatus = "SUBMITTED" | "AUTHORIZED" | "IN_TRANSIT" | "RECEIVED_AT_STORE" | "APPROVED" | "REJECTED" | "REFUNDING" | "COMPLETED";

interface ReturnRequest {
    id: string;
    orderId: string;
    orderNumber: string;
    customerName: string;
    reason: string;
    status: ReturnStatus;
    submittedAt: string;
    totalAmount: number;
    evidenceUrls: string; // From backend is String (URL)
    originalGirdleId?: string;
    timeline: OrderStatusTimeline[];
}

interface OrderStatusTimeline {
    id: string;
    status: string;
    note: string;
    actorType: string;
    evidenceUrl?: string;
    changedAt: string;
}

const statusCfg: Record<ReturnStatus, { label: string; className: string }> = {
    SUBMITTED: { label: "Pending Audit", className: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" },
    AUTHORIZED: { label: "Authorized (Wait Shipper)", className: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" },
    IN_TRANSIT: { label: "In Transit", className: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" },
    RECEIVED_AT_STORE: { label: "Received (Audit Req)", className: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400" },
    APPROVED: { label: "Approved (Wait Claim)", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" },
    REJECTED: { label: "Rejected", className: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400" },
    REFUNDING: { label: "Refunding", className: "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400" },
    COMPLETED: { label: "Completed", className: "bg-gray-50 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400" },
};

function formatVnd(n: number) {
    return new Intl.NumberFormat("vi-VN").format(n) + " ₫";
}

// ─── Review Modal ──────────────────────────────────────────────
function ReviewModal({ 
    req, 
    onClose, 
    onDecide,
    onFinalDecide
}: { 
    req: ReturnRequest; 
    onClose: () => void; 
    onDecide: (id: string, approved: boolean, note: string) => void;
    onFinalDecide: (id: string, approved: boolean, deductInsurance: boolean, note: string) => void;
}) {
    const [note, setNote] = useState("");
    const [deductInsurance, setDeductInsurance] = useState(true);
    
    // Check if it's the first stage (Online video audit) or second stage (Physical item audit)
    const isOnlineAudit = req.status === "SUBMITTED";
    const isPhysicalAudit = req.status === "RECEIVED_AT_STORE";

    const evidenceList = req.evidenceUrls ? [req.evidenceUrls] : [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl dark:bg-[#161616] max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/80 px-8 py-6 backdrop-blur-md dark:border-gray-800 dark:bg-[#161616]/80">
                    <div>
                        <h2 className="font-plus-jakarta text-lg font-bold text-gray-900 dark:text-white">
                            {isOnlineAudit ? "Online Evidence Audit" : isPhysicalAudit ? "Final Physical Inspection" : "Return Request Details"}
                        </h2>
                        <p className="font-plus-jakarta text-xs text-gray-500 mt-0.5">RMA: {req.id.substring(0, 8)}... · Order: {req.orderNumber}</p>
                    </div>
                    <button onClick={onClose} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex flex-col gap-5 p-8">
                    <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                        <p className="font-plus-jakarta text-xs font-bold uppercase tracking-wider text-gray-400">Return Rationale</p>
                        <p className="mt-2 font-plus-jakarta text-sm text-gray-700 dark:text-gray-300">{req.reason}</p>
                    </div>

                    {evidenceList.length > 0 && (
                        <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800 bg-gray-50 dark:bg-black/50">
                            <p className="font-plus-jakarta text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Unboxing Video / Media Evidence</p>
                            <div className="grid grid-cols-1 gap-3">
                                {evidenceList.map((url, idx) => (
                                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-black">
                                        {url.toLowerCase().includes('.mp4') || url.toLowerCase().includes('.mov') || url.includes('video/upload') ? (
                                            <video src={url} controls className="w-full h-full object-contain" />
                                        ) : (
                                            <img src={url} alt="Evidence" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {isPhysicalAudit && (
                        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-900/30 dark:bg-amber-500/5">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600" />
                                <div>
                                    <p className="font-plus-jakarta text-sm font-bold text-amber-900 dark:text-amber-400">Physical Girdle Verification Required</p>
                                    <p className="mt-1 font-plus-jakarta text-xs text-amber-700 dark:text-amber-500/70">Please visually inspect the jewelry piece and verify the Girdle ID matches the original certificate: <span className="font-mono font-bold tracking-wider">{req.originalGirdleId || "GIA-MATCH-PREVIEW"}</span></p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                        <p className="font-plus-jakarta text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Internal Audit Note</p>
                        <textarea 
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add reason for approval or rejection..."
                            className="w-full rounded-lg border border-gray-200 bg-transparent p-3 text-sm focus:border-amber-500 focus:outline-none dark:border-gray-800"
                            rows={3}
                        />
                    </div>

                    {isPhysicalAudit && (
                        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                            <div>
                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">Insurance Fee Deduction</p>
                                <p className="font-plus-jakarta text-xs text-gray-500 mt-1">Deduct 2% insurance fee from the total refund amount?</p>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={deductInsurance} 
                                onChange={(e) => setDeductInsurance(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                            <p className="font-plus-jakarta text-[10px] uppercase tracking-wider text-gray-400">Customer Name</p>
                            <p className="mt-1 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{req.customerName}</p>
                        </div>
                        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                            <p className="font-plus-jakarta text-[10px] uppercase tracking-wider text-gray-400">Total Paid</p>
                            <p className="mt-1 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{formatVnd(req.totalAmount)}</p>
                        </div>
                    </div>

                    {/* ─── NEW: Order Timeline Section ─── */}
                    <div className="mt-2 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-black/20">
                        <p className="font-plus-jakarta text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Order History & Status Path</p>
                        <div className="flex flex-col gap-6">
                            {req.timeline && req.timeline.length > 0 ? (
                                req.timeline.map((t, idx) => (
                                    <div key={t.id} className="relative flex gap-4">
                                        {/* Connector Line */}
                                        {idx !== req.timeline.length - 1 && (
                                            <div className="absolute left-2.5 top-5 h-full w-px bg-gray-200 dark:bg-gray-800" />
                                        )}
                                        
                                        {/* Dot */}
                                        <div className={`z-10 mt-1 h-5 w-5 shrink-0 rounded-full border-4 border-white dark:border-[#161616] ${idx === 0 ? "bg-amber-500 ring-2 ring-amber-500/20" : "bg-gray-300 dark:bg-gray-700"}`} />
                                        
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-plus-jakarta text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter">{t.status.replace(/_/g, " ")}</span>
                                                <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[9px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-400">{t.actorType}</span>
                                            </div>
                                            {t.note && <p className="font-plus-jakarta text-xs text-gray-500 italic">"{t.note}"</p>}
                                            <p className="font-plus-jakarta text-[10px] text-gray-400">{new Date(t.changedAt).toLocaleString("vi-VN")}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 italic">No history available for this order.</p>
                            )}
                        </div>
                    </div>
                </div>

                {(isOnlineAudit || isPhysicalAudit) && (
                    <div className="flex gap-3 border-t border-gray-100 px-8 py-5 dark:border-gray-800">
                        <button 
                            onClick={() => { 
                                if (!note.trim()) {
                                    toast.error("Please provide a rejection reason in the audit note.");
                                    return;
                                }
                                if (isOnlineAudit) onDecide(req.id, false, note); 
                                else onFinalDecide(req.id, false, false, note);
                                onClose(); 
                            }} 
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gray-100 py-2.5 font-plus-jakarta text-sm font-bold text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                        >
                            <XCircle className="h-4 w-4" /> {isOnlineAudit ? "Reject Online" : "Reject Physical"}
                        </button>
                        <button 
                            onClick={() => { 
                                if (isOnlineAudit) onDecide(req.id, true, note); 
                                else onFinalDecide(req.id, true, deductInsurance, note);
                                onClose(); 
                            }} 
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 font-plus-jakarta text-sm font-bold text-white hover:bg-emerald-700"
                        >
                            <CheckCircle2 className="h-4 w-4" /> {isOnlineAudit ? "Authorize Return" : "Final Approve"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────────
export default function AdminReturnsPage() {
    const [returns, setReturns] = useState<ReturnRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isActioning, setIsActioning] = useState(false);
    const [selected, setSelected] = useState<ReturnRequest | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchReturns();
    }, []);

    const fetchReturns = async () => {
        setLoading(true);
        const res = await postSalesService.getAdminReturns();
        if (res.success) {
            setReturns(res.data || []);
        } else {
            toast.error(res.message || "Failed to load returns");
        }
        setLoading(false);
    };

    const handleDecide = async (id: string, approved: boolean, note: string) => {
        setIsActioning(true);
        const res = await postSalesService.processReturn(id, approved, note);
        if (res.success) {
            toast.success(res.message || "Authorize action processed");
            fetchReturns(); // Reload
        } else {
            toast.error(res.message || "Failed to process");
        }
        setIsActioning(false);
    };

    const handleFinalDecide = async (id: string, approved: boolean, deductInsurance: boolean, note: string) => {
        setIsActioning(true);
        const res = await postSalesService.finalProcessReturn(id, approved, deductInsurance, note);
        if (res.success) {
            toast.success(res.message || "Final audit processed");
            fetchReturns(); // Reload
        } else {
            toast.error(res.message || "Failed to finalize");
        }
        setIsActioning(false);
    };

    const filtered = (returns || []).filter((r) => 
        r.customerName.toLowerCase().includes(search.toLowerCase()) || 
        r.orderNumber.toLowerCase().includes(search.toLowerCase())
    );

    const pendingCount = (returns || []).filter((r) => r.status === "SUBMITTED" || r.status === "RECEIVED_AT_STORE").length;

    if (loading) return (
        <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            {selected && (
                <ReviewModal 
                    req={selected} 
                    onClose={() => setSelected(null)} 
                    onDecide={handleDecide} 
                    onFinalDecide={handleFinalDecide}
                />
            )}

            <div className="flex items-start justify-between">
                <div>
                    <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white">RMA & Returns</h1>
                    <p className="mt-1 font-plus-jakarta text-sm text-gray-500 dark:text-gray-400">Audit return requests and verify unboxing evidence for security compliance.</p>
                </div>
                {pendingCount > 0 && (
                    <span className="rounded-xl bg-rose-50 px-4 py-2 font-plus-jakarta text-sm font-bold text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
                        {pendingCount} pending audit
                    </span>
                )}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by customer or order #..." className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-2.5 font-plus-jakarta text-sm focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900" />
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-gray-100 bg-white/70 shadow-sm backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                {["Order #", "Customer", "Date Filed", "Status", ""].map((h) => (
                                    <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {filtered.map((r) => {
                                const cfg = statusCfg[r.status] || statusCfg["SUBMITTED"];
                                return (
                                    <tr key={r.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                        <td className="px-6 py-4"><div className="flex items-center gap-2"><ArrowLeftRight className="h-3.5 w-3.5 text-gray-400" /><span className="font-plus-jakarta text-xs font-bold text-gray-700 dark:text-gray-300">{r.orderNumber}</span></div></td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm font-medium text-gray-900 dark:text-white">{r.customerName}</td>
                                        <td className="px-6 py-4 font-plus-jakarta text-xs text-gray-400">{new Date(r.submittedAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 font-plus-jakarta text-[11px] font-bold ${cfg.className}`}>{cfg.label}</span></td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => setSelected(r)} className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-gray-600 hover:bg-amber-50 hover:text-amber-700 dark:bg-gray-800 transition-colors">
                                                <Eye className="h-3.5 w-3.5" /> Review & Audit
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-plus-jakarta text-sm">No return requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
