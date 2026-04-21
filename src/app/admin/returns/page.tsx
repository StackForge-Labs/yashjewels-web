"use client";

import React, { useState, useEffect } from "react";
import { 
    RotateCcw, Eye, CheckCircle2, XCircle, 
    AlertCircle, FileVideo, Calendar, Search, 
    ArrowRight, DollarSign, ShieldAlert
} from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { adminService } from "@/services/admin.service";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

export default function ReturnsManagementPage() {
    const [returns, setReturns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [decisionNote, setDecisionNote] = useState("");
    const [deductInsurance, setDeductInsurance] = useState(false);

    useEffect(() => {
        fetchReturns();
    }, []);

    const fetchReturns = async () => {
        setLoading(true);
        try {
            const res = await adminService.getReturnsApi();
            if (res.success) setReturns(res.data || []);
        } catch (error) {
            toast.error("Failed to fetch return requests");
        } finally {
            setLoading(false);
        }
    };

    const handleInitialProcess = async (requestId: string, approve: boolean) => {
        if (!decisionNote && !approve) {
            toast.error("Please provide a reason for rejection");
            return;
        }

        setActionLoading(true);
        try {
            const res = await adminService.processReturnApi(requestId, {
                requestId,
                approve,
                note: decisionNote
            });
            if (res.success) {
                toast.success(approve ? "Return authorized" : "Return rejected");
                setSelectedRequest(null);
                setDecisionNote("");
                fetchReturns();
            }
        } catch (error) {
            toast.error("Action failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleFinalProcess = async (requestId: string, approve: boolean) => {
        if (!decisionNote && !approve) {
            toast.error("Please provide a reason for rejection");
            return;
        }

        setActionLoading(true);
        try {
            const res = await adminService.finalizeReturnApi(requestId, {
                requestId,
                approve,
                deductInsurance,
                note: decisionNote
            });
            if (res.success) {
                toast.success(approve ? "Refund approved & completed" : "Return rejected after inspection");
                setSelectedRequest(null);
                setDecisionNote("");
                fetchReturns();
            }
        } catch (error) {
            toast.error("Action failed");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <PageHeader 
                title="Returns & Claims Hub" 
                description="Oversee jewelry return lifecycles and authenticity inspection workflows."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List Side */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900 dark:text-white">Active Requests</h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search order number..."
                                    className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Request / Date</th>
                                        <th className="px-6 py-4">Customer / Order</th>
                                        <th className="px-6 py-4">Reason</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {loading ? (
                                        [...Array(5)].map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan={5} className="px-6 py-8 h-12 bg-slate-50/50 dark:bg-slate-800/20"></td>
                                            </tr>
                                        ))
                                    ) : returns.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                                No return requests found.
                                            </td>
                                        </tr>
                                    ) : returns.map((req) => (
                                        <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-900 dark:text-white">#{req.id.substring(0, 8)}</div>
                                                <div className="text-xs text-slate-500">{format(new Date(req.submittedAt), "MMM dd, yyyy")}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium">{req.customerName}</div>
                                                <div className="text-xs text-indigo-500 font-mono">{req.orderNumber}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1 max-w-[200px]" title={req.reason}>
                                                    {req.reason}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={req.status} />
                                            </td>
                                            <td className="px-6 py-4 font-body">
                                                <button 
                                                    onClick={() => setSelectedRequest(req)}
                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-indigo-600 transition-all"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Detail Side */}
                <div className="lg:col-span-1">
                    {selectedRequest ? (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl sticky top-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold">Request Detail</h3>
                                <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-slate-600">
                                    <XCircle className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <div className="text-xs text-slate-400 uppercase font-bold mb-2">Claim Background</div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Order:</span>
                                            <span className="font-mono font-bold text-indigo-500">{selectedRequest.orderNumber}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Total Value:</span>
                                            <span className="font-bold">{selectedRequest.totalAmount?.toLocaleString()} VND</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-slate-400 uppercase font-bold mb-3">Customer Evidence</div>
                                    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black aspect-video flex items-center justify-center">
                                        {selectedRequest.evidenceUrls ? (
                                            <video 
                                                src={selectedRequest.evidenceUrls} 
                                                controls 
                                                className="w-full h-full object-contain"
                                                poster="/placeholder-video.png"
                                            />
                                        ) : (
                                            <div className="text-slate-500 text-xs flex flex-col items-center gap-2">
                                                <AlertCircle className="h-6 w-6" />
                                                No video evidence provided
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Verification Evidence</span>
                                        <a href={selectedRequest.evidenceUrls} target="_blank" className="text-[10px] font-bold text-indigo-500 hover:underline flex items-center gap-1">
                                            <FileVideo className="h-2.5 w-2.5" /> High-Res Source
                                        </a>
                                    </div>
                                </div>


                                <div>
                                    <div className="text-xs text-slate-400 uppercase font-bold mb-2">Internal Note / Reason</div>
                                    <textarea 
                                        value={decisionNote}
                                        onChange={(e) => setDecisionNote(e.target.value)}
                                        placeholder="Enter rejection reason or internal inspection notes..."
                                        className="w-full h-32 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    />
                                </div>

                                {selectedRequest.status === "SUBMITTED" && (
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <button 
                                            disabled={actionLoading}
                                            onClick={() => handleInitialProcess(selectedRequest.id, false)}
                                            className="flex items-center justify-center gap-2 py-3 bg-rose-50 text-rose-600 rounded-2xl font-bold hover:bg-rose-100 transition-all border border-rose-100"
                                        >
                                            <XCircle className="h-5 w-5" /> Reject
                                        </button>
                                        <button 
                                            disabled={actionLoading}
                                            onClick={() => handleInitialProcess(selectedRequest.id, true)}
                                            className="flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                                        >
                                            <CheckCircle2 className="h-5 w-5" /> Authorize
                                        </button>
                                    </div>
                                )}

                                {selectedRequest.status === "AUTHORIZED" && (
                                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2 mb-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl text-amber-700 text-xs font-semibold">
                                            <ShieldAlert className="h-4 w-4" />
                                            Physical inspection required before refunding.
                                        </div>
                                        
                                        <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                                            <input 
                                                type="checkbox" 
                                                checked={deductInsurance} 
                                                onChange={(e) => setDeductInsurance(e.target.checked)}
                                                className="h-5 w-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <div className="text-xs">
                                                <div className="font-bold">Deduct Restocking Fee (2%)</div>
                                                <div className="text-slate-500 text-[10px]">Applied for non-damaged returns.</div>
                                            </div>
                                        </label>

                                        <div className="grid grid-cols-2 gap-4">
                                            <button 
                                                disabled={actionLoading}
                                                onClick={() => handleFinalProcess(selectedRequest.id, false)}
                                                className="flex items-center justify-center gap-2 py-3 bg-rose-50 text-rose-600 rounded-2xl font-bold hover:bg-rose-100 transition-all border border-rose-100"
                                            >
                                                Fail Inspect
                                            </button>
                                            <button 
                                                disabled={actionLoading}
                                                onClick={() => handleFinalProcess(selectedRequest.id, true)}
                                                className="flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                                            >
                                                <DollarSign className="h-5 w-5" /> Full Refund
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <RotateCcw className="h-12 w-12 text-slate-300 mb-4" />
                            <h4 className="font-bold text-slate-400">Select a request to process</h4>
                            <p className="text-xs text-slate-400 mt-2">Verified authenticity is required for all jewelry refunds.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
