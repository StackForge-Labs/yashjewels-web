"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
    RotateCcw, Eye, CheckCircle2, XCircle, 
    AlertCircle, FileVideo, Calendar, Search, 
    ArrowRight, DollarSign, ShieldAlert,
    TrendingUp, Clock, Ban, BarChart3
} from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Drawer } from "../_components/ui/Drawer";
import { adminService } from "@/services/admin.service";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

export default function ReturnsManagementPage() {
    const [returns, setReturns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [decisionNote, setDecisionNote] = useState("");
    const [deductInsurance, setDeductInsurance] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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

    const stats = useMemo(() => {
        const total = returns.length;
        const pending = returns.filter(r => r.status === "SUBMITTED").length;
        const refunded = returns.filter(r => r.status === "COMPLETED" || r.status === "REFUNDED").length;
        const rejected = returns.filter(r => r.status === "REJECTED").length;
        
        const totalValue = returns
            .filter(r => r.status === "COMPLETED" || r.status === "REFUNDED")
            .reduce((sum, r) => sum + (r.totalAmount || 0), 0);

        return [
            { label: "Total Requests", value: total, icon: BarChart3, color: "blue" },
            { label: "Awaiting Action", value: pending, icon: Clock, color: "amber" },
            { label: "Refunded Value", value: `${(totalValue / 1_000_000).toFixed(1)}M`, icon: DollarSign, color: "emerald" },
            { label: "Rejection Rate", value: total > 0 ? `${Math.round((rejected / total) * 100)}%` : "0%", icon: Ban, color: "rose" }
        ];
    }, [returns]);

    const filteredReturns = returns.filter(r => 
        r.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleViewDetail = (req: any) => {
        setSelectedRequest(req);
        setIsDrawerOpen(true);
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
                setIsDrawerOpen(false);
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
                setIsDrawerOpen(false);
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
        <div className="flex flex-col gap-8 animate-in fade-in duration-700">
            <PageHeader 
                title="Returns & Claims Hub" 
                description="Oversee jewelry return lifecycles and authenticity inspection workflows."
                actions={
                    <button onClick={fetchReturns} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300 transition-all">
                        <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Sync Data
                    </button>
                }
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </div>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tight mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
                    <h3 className="font-plus-jakarta font-bold text-gray-900 dark:text-white">Active Rejection Threads</h3>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Filter by Order or Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                            <tr>
                                <th className="px-6 py-5">Identity</th>
                                <th className="px-6 py-5">Context</th>
                                <th className="px-6 py-5">Reasoning</th>
                                <th className="px-6 py-5">Phase</th>
                                <th className="px-6 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-8 h-20">
                                            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-gray-50 dark:bg-gray-900 rounded w-1/2"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredReturns.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-medium">
                                        No active return requests in queue.
                                    </td>
                                </tr>
                            ) : filteredReturns.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="font-bold text-gray-900 dark:text-white">#{req.id.substring(0, 8)}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase">{format(new Date(req.submittedAt), "MMM dd, yyyy")}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-bold text-gray-700 dark:text-gray-300">{req.customerName}</div>
                                        <div className="text-[10px] text-blue-500 font-black tracking-tighter">ORDER: {req.orderNumber}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm text-gray-500 italic line-clamp-1 max-w-[200px]" title={req.reason}>
                                            "{req.reason}"
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <StatusBadge status={req.status} />
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button 
                                            onClick={() => handleViewDetail(req)}
                                            className="px-4 py-2 bg-gray-900 dark:bg-white dark:text-black text-white text-xs font-bold rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-all shadow-sm"
                                        >
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title={selectedRequest ? `Claim #${selectedRequest.id.substring(0, 8)}` : "Return Request"}
                subtitle={selectedRequest ? `Customer: ${selectedRequest.customerName}` : ""}
                footer={
                    selectedRequest?.status === "SUBMITTED" ? (
                        <div className="grid grid-cols-2 gap-3 w-full">
                            <button 
                                disabled={actionLoading}
                                onClick={() => handleInitialProcess(selectedRequest.id, false)}
                                className="py-3 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-100 border border-rose-100 transition-all"
                            >
                                Reject Claim
                            </button>
                            <button 
                                disabled={actionLoading}
                                onClick={() => handleInitialProcess(selectedRequest.id, true)}
                                className="py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
                            >
                                Authorize Return
                            </button>
                        </div>
                    ) : selectedRequest?.status === "AUTHORIZED" ? (
                        <div className="grid grid-cols-2 gap-3 w-full">
                            <button 
                                disabled={actionLoading}
                                onClick={() => handleFinalProcess(selectedRequest.id, false)}
                                className="py-3 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-100 border border-rose-100 transition-all"
                            >
                                Inspection Failed
                            </button>
                            <button 
                                disabled={actionLoading}
                                onClick={() => handleFinalProcess(selectedRequest.id, true)}
                                className="py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <DollarSign className="h-4 w-4" /> Issue Refund
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsDrawerOpen(false)} className="w-full py-3 bg-gray-50 text-gray-500 rounded-xl font-bold text-sm">Close Detail</button>
                    )
                }
            >
                {selectedRequest && (
                    <div className="flex flex-col gap-8 pb-10">
                        {/* Summary Block */}
                        <div className="p-5 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Financial Context</span>
                                <span className="p-1 px-2 rounded-md bg-blue-50 text-blue-600 text-[10px] font-black tracking-tighter uppercase">{selectedRequest.orderNumber}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-2xl font-black text-gray-900 dark:text-white">{selectedRequest.totalAmount?.toLocaleString()} VND</p>
                                    <p className="text-[10px] font-bold text-gray-400">Total transaction value at risk</p>
                                </div>
                            </div>
                        </div>

                        {/* Evidence Media */}
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Customer Unboxing Evidence</p>
                            <div className="rounded-2xl overflow-hidden border border-gray-100 bg-black aspect-video flex items-center justify-center relative group">
                                {selectedRequest.evidenceUrls ? (
                                    <video 
                                        src={selectedRequest.evidenceUrls} 
                                        controls 
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="text-gray-500 text-xs flex flex-col items-center gap-2">
                                        <AlertCircle className="h-8 w-8 text-gray-300" />
                                        No unboxing video attached
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Inspection Notes */}
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Official Inspection Record</label>
                            <textarea 
                                value={decisionNote}
                                onChange={(e) => setDecisionNote(e.target.value)}
                                placeholder="Detail the results of physical inspection or reasoning for rejection..."
                                className="w-full h-32 px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none font-plus-jakarta"
                            />
                        </div>

                        {selectedRequest.status === "AUTHORIZED" && (
                            <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/50 rounded-2xl p-4">
                                <div className="flex items-start gap-3">
                                    <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-amber-700 dark:text-amber-400">Physical Integrity Required</p>
                                        <p className="text-[10px] text-amber-600/80 mt-1 leading-relaxed">Ensure the jewel is returned in original condition with GIA certificates. Refund should only proceed after a clean assessment.</p>
                                    </div>
                                </div>
                                <label className="flex items-center gap-3 mt-4 p-3 bg-white/50 dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-white transition-all ring-1 ring-amber-100">
                                    <input 
                                        type="checkbox" 
                                        checked={deductInsurance} 
                                        onChange={(e) => setDeductInsurance(e.target.checked)}
                                        className="h-5 w-5 rounded-md border-gray-200 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Apply Restocking Surcharge (2%)</p>
                                        <p className="text-[9px] text-gray-400 font-medium">Standard for non-defect returns.</p>
                                    </div>
                                </label>
                            </div>
                        )}
                    </div>
                )}
            </Drawer>
        </div>
    );
}

