"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Eye, Search, Clock, Loader2, AlertCircle } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Modal } from "../_components/ui/Modal";
import { usePendingKyc, useApproveKyc, useRejectKyc } from "@/hooks/useAdmin";
import { PendingKycDto } from "@/types/user.types";
import { getErrorMessage } from "@/lib/api-client";

export default function KYCVerificationsPage() {
    const { data: res, isLoading, isError, error } = usePendingKyc();
    const approveKyc = useApproveKyc();
    const rejectKyc = useRejectKyc();

    const [selected, setSelected] = useState<PendingKycDto | null>(null);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [search, setSearch] = useState("");

    const records = res?.data || [];
    const filtered = records.filter(r =>
        r.fullName.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleApprove = () => {
        if (!selected) return;
        approveKyc.mutate(selected.userId, {
            onSuccess: (res) => {
                if (res.success) {
                    setIsReviewOpen(false);
                    setSelected(null);
                }
            }
        });
    };

    const handleReject = () => {
        if (!selected) return;
        rejectKyc.mutate(selected.userId, {
            onSuccess: (res) => {
                if (res.success) {
                    setIsReviewOpen(false);
                    setSelected(null);
                }
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-gold" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-10 text-center dark:border-rose-950/20 dark:bg-rose-950/10">
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-rose-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Failed to load KYC records</h3>
                <p className="mt-2 text-sm text-gray-500">{getErrorMessage(error)}</p>
                <button onClick={() => window.location.reload()} className="bg-rose-600 mt-6 rounded-xl px-8 py-3 text-xs font-bold tracking-widest text-white uppercase transition-all">Retry</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <PageHeader 
                title="KYC Verifications" 
                description="Review customer identity documents and approve verification requests."
                badge={{ count: records.length, label: "pending", color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" }} 
            />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-sm backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="border-b border-gray-100 p-6 dark:border-gray-800/50">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-11 pr-4 py-2.5 font-plus-jakarta text-sm font-medium placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a]/50 dark:text-gray-100" 
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                {["Customer", "Email", "Face Match", "Status", "Actions"].map(h => (
                                    <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center font-plus-jakarta text-sm text-gray-400">No pending verification requests.</td>
                                </tr>
                            ) : (
                                filtered.map(r => (
                                    <tr key={r.userId} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                        <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{r.fullName}</td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm font-medium text-gray-500">{r.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`font-plus-jakarta text-sm font-bold ${r.kycSimilarityScore >= 90 ? "text-emerald-600" : r.kycSimilarityScore >= 70 ? "text-amber-600" : "text-rose-600"}`}>
                                                {r.kycSimilarityScore.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4"><StatusBadge status={r.kycStatus.toLowerCase() as any} /></td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => { setSelected(r); setIsReviewOpen(true); }} 
                                                className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400"
                                            >
                                                <Eye className="h-3.5 w-3.5" /> Review
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Review Modal */}
            <Modal 
                isOpen={isReviewOpen} 
                onClose={() => setIsReviewOpen(false)} 
                title="KYC Review" 
                subtitle={selected?.fullName} 
                size="lg"
                footer={
                    <div className="flex gap-3">
                        <button 
                            onClick={handleReject} 
                            disabled={rejectKyc.isPending || approveKyc.isPending}
                            className="rounded-xl bg-gray-100 px-6 py-2.5 font-plus-jakarta text-sm font-bold text-gray-600 transition-all hover:bg-rose-50 hover:text-rose-500 dark:bg-white/5 dark:text-gray-400"
                        >
                            {rejectKyc.isPending ? <Loader2 size={18} className="animate-spin" /> : "Reject Request"}
                        </button>
                        <button 
                            onClick={handleApprove} 
                            disabled={rejectKyc.isPending || approveKyc.isPending}
                            className="rounded-xl bg-gray-900 px-8 py-2.5 font-plus-jakarta text-sm font-bold text-white transition-all hover:bg-emerald-600 dark:bg-white dark:text-black dark:hover:bg-emerald-500"
                        >
                            {approveKyc.isPending ? <Loader2 size={18} className="animate-spin" /> : "Approve Customer"}
                        </button>
                    </div>
                }
            >
                {selected && (
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-white/2">
                                <p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400">Similarity Score</p>
                                <p className={`mt-1 font-plus-jakarta text-xl font-bold ${selected.kycSimilarityScore >= 80 ? "text-emerald-500" : "text-amber-500"}`}>
                                    {selected.kycSimilarityScore.toFixed(1)}%
                                </p>
                                <p className="text-[10px] text-gray-400 mt-1">Verified by FPT.AI Biometric Match</p>
                            </div>
                            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-white/2">
                                <p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400">Submission Date</p>
                                <p className="mt-1 font-plus-jakarta text-lg font-bold text-gray-900 dark:text-white">Today</p>
                                <p className="text-[10px] text-gray-400 mt-1">Priority: High</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                             <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">ID Document Images</p>
                             <div className="grid grid-cols-2 gap-3">
                                <div className="group relative aspect-[3/2] overflow-hidden rounded-xl bg-gray-100 dark:bg-[#1a1a1a]">
                                    {selected.idCardFrontUrl ? (
                                        <img src={selected.idCardFrontUrl} alt="Front" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-gray-400 text-xs">No Front Image</div>
                                    )}
                                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Front Side</span>
                                    </div>
                                </div>
                                <div className="group relative aspect-[3/2] overflow-hidden rounded-xl bg-gray-100 dark:bg-[#1a1a1a]">
                                    {selected.idCardBackUrl ? (
                                        <img src={selected.idCardBackUrl} alt="Back" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-gray-400 text-xs">No Back Image</div>
                                    )}
                                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Back Side</span>
                                    </div>
                                </div>
                             </div>
                        </div>

                        <div className="space-y-4">
                             <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">Verification Selfie</p>
                             <div className="mx-auto h-48 w-48 overflow-hidden rounded-3xl bg-gray-100 dark:bg-[#1a1a1a] shadow-inner">
                                 {selected.facePhotoUrl ? (
                                     <img src={selected.facePhotoUrl} alt="Selfie" className="h-full w-full object-cover" />
                                 ) : (
                                     <div className="flex h-full items-center justify-center text-gray-400 text-xs">No Selfie</div>
                                 )}
                             </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
