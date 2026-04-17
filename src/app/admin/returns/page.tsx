"use client";

import { useState, useEffect } from "react";
import { Eye, RefreshCw, AlertCircle, CheckCircle2, XCircle, Search } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Drawer } from "../_components/ui/Drawer";
import { FormField, inputCls, selectCls, textareaCls } from "../_components/ui/FormField";
import { returnRequestService } from "@/services/return-request.service";
import { ReturnRequest, ReturnRequestStatus } from "@/types/return-request.types";
import { toast } from "sonner";
import { format } from "date-fns";

export default function ReturnsPage() {
    const [returns, setReturns] = useState<ReturnRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<ReturnRequest | null>(null);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [adminNote, setAdminNote] = useState("");
    const [refundAmt, setRefundAmt] = useState(0);
    const [search, setSearch] = useState("");

    const fetchReturns = async () => {
        setLoading(true);
        const res = await returnRequestService.getAll();
        if (res.success) {
            setReturns(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReturns();
    }, []);

    const filtered = returns.filter(r => 
        r.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
        r.customerName.toLowerCase().includes(search.toLowerCase())
    );

    const pendingCount = returns.filter(r => 
        r.status === ReturnRequestStatus.SUBMITTED || 
        r.status === ReturnRequestStatus.ADMIN_ARBITRATING
    ).length;

    const openReview = (r: ReturnRequest) => {
        setSelected(r);
        setAdminNote(r.adminNote || "");
        setRefundAmt(r.refundAmount || 0);
        setIsReviewOpen(true);
    };

    const handleAction = async (status: ReturnRequestStatus) => {
        if (!selected) return;
        
        const res = await returnRequestService.review(selected.id, {
            status,
            refundAmount: refundAmt,
            note: adminNote
        });

        if (res.success) {
            toast.success("Return request updated");
            fetchReturns();
            setIsReviewOpen(false);
        } else {
            toast.error(res.message);
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };

    const getStatusLabel = (status: ReturnRequestStatus) => {
        return ReturnRequestStatus[status].replace(/_/g, " ");
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader 
                title="Returns & Incidents" 
                description="Handle customer return requests, refunds, and delivery incidents."
                badge={{ 
                    count: pendingCount, 
                    label: "pending review", 
                    color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" 
                }}
            />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70 overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-gray-800/50">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search order or customer..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 font-plus-jakarta text-sm font-medium focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a]/50 dark:text-gray-100" 
                        />
                    </div>
                    <button 
                        onClick={fetchReturns}
                        className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                    >
                        <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                {["Order", "Customer", "Reason", "Refund Amount", "Requested Date", "Status", "Actions"].map(h => (
                                    <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={7} className="px-6 py-8 h-16"></td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-plus-jakarta">No return requests found.</td>
                                </tr>
                            ) : filtered.map(r => (
                                <tr key={r.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">
                                        {r.orderNumber.split('-').pop()}
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-medium text-gray-600 dark:text-gray-300">
                                        {r.customerName}
                                    </td>
                                    <td className="max-w-[200px] truncate px-6 py-4 font-plus-jakarta text-sm text-gray-500">
                                        {r.reason}
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">
                                        {r.refundAmount ? formatCurrency(r.refundAmount) : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500">
                                        {format(new Date(r.createdAt), "dd MMM yyyy")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${r.status === ReturnRequestStatus.SUBMITTED ? 'bg-amber-400' : r.status === ReturnRequestStatus.APPROVED ? 'bg-emerald-400' : 'bg-gray-400'}`} />
                                            <span className="font-plus-jakarta text-xs font-bold uppercase tracking-wider opacity-70">
                                                {getStatusLabel(r.status)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => openReview(r)} 
                                            className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 transition-all active:scale-95"
                                        >
                                            <Eye className="h-3.5 w-3.5" /> Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Review Drawer */}
            <Drawer 
                isOpen={isReviewOpen} 
                onClose={() => setIsReviewOpen(false)} 
                title={`Return: #${selected?.orderNumber?.split('-').pop()}`} 
                subtitle={selected?.customerName}
                footer={
                    selected?.status === ReturnRequestStatus.SUBMITTED || selected?.status === ReturnRequestStatus.ADMIN_ARBITRATING ? (
                        <div className="flex gap-4 w-full">
                            <button 
                                onClick={() => handleAction(ReturnRequestStatus.REJECTED)} 
                                className="flex-1 rounded-xl bg-rose-50 px-4 py-3 font-plus-jakarta text-sm font-bold text-rose-600 hover:bg-rose-100 transition-all"
                            >
                                Reject Request
                            </button>
                            <button 
                                onClick={() => handleAction(ReturnRequestStatus.APPROVED)} 
                                className="flex-2 rounded-xl bg-emerald-600 px-8 py-3 font-plus-jakarta text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
                            >
                                Approve Refund
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsReviewOpen(false)} 
                            className="w-full rounded-xl bg-gray-100 px-4 py-3 font-plus-jakarta text-sm font-bold text-gray-600 hover:bg-gray-200 transition-all dark:bg-gray-800 dark:text-gray-300"
                        >
                            Close Details
                        </button>
                    )
                }
            >
                {selected && (
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <StatusBadge status={ReturnRequestStatus[selected.status].toLowerCase()} />
                            <span className="text-xs text-gray-400 font-plus-jakarta">Requested {format(new Date(selected.createdAt), "PPP")}</span>
                        </div>

                        <div className="rounded-2xl bg-gray-50/50 p-6 dark:bg-white/5 space-y-4">
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Customer Reason</h4>
                                <p className="text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300 italic">"{selected.reason}"</p>
                            </div>

                            {selected.evidenceUrls && selected.evidenceUrls.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Submitted Evidence</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {selected.evidenceUrls.map((url, i) => (
                                            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="group relative aspect-square rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 hover:ring-2 ring-blue-500 transition-all">
                                                <img src={url} alt={`Evidence ${i+1}`} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <Eye className="text-white h-5 w-5" />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {(selected.status === ReturnRequestStatus.SUBMITTED || selected.status === ReturnRequestStatus.ADMIN_ARBITRATING) ? (
                            <div className="space-y-4 pt-4">
                                <FormField label="Refund Amount (VND)" hint="Maximum value of the original items">
                                    <input 
                                        type="number" 
                                        className={inputCls} 
                                        value={refundAmt} 
                                        onChange={e => setRefundAmt(Number(e.target.value))} 
                                        placeholder="Enter amount..."
                                    />
                                </FormField>
                                <FormField label="Internal Admin Note" hint="Visible to other staff members">
                                    <textarea 
                                        rows={4} 
                                        className={`${textareaCls} resize-none`} 
                                        value={adminNote} 
                                        onChange={e => setAdminNote(e.target.value)} 
                                        placeholder="Reason for approval/rejection..." 
                                    />
                                </FormField>
                            </div>
                        ) : (
                            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                {selected.refundAmount && (
                                    <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-blue-50/50 dark:bg-blue-500/5">
                                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Refund Amount</span>
                                        <span className="text-sm font-bold text-blue-700 dark:text-blue-400 font-mono">{formatCurrency(selected.refundAmount)}</span>
                                    </div>
                                )}
                                {selected.adminNote && (
                                    <div className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5">
                                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Admin Decision Note</h5>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{selected.adminNote}</p>
                                    </div>
                                )}
                                {selected.resolvedAt && (
                                    <p className="text-center text-[10px] text-gray-400 font-medium">Resolved on {format(new Date(selected.resolvedAt), "PPP")}</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </Drawer>
        </div>
    );
}
