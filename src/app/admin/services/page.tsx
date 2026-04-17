"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Eye, CheckCircle2, XCircle, RefreshCw, FileText, UserCheck } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Modal } from "../_components/ui/Modal";
import { getPendingKycApi, approveKycApi, rejectKycApi } from "@/services/admin.service";
import toast from "react-hot-toast";
import { PendingKycDto } from "@/types/user.types";

export default function ServicesPage() {
    const [kycRequests, setKycRequests] = useState<PendingKycDto[]>([]);
    const [selected, setSelected] = useState<PendingKycDto | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const loadKyc = async () => {
        setLoading(true);
        try {
            const res = await getPendingKycApi();
            if (res.success) setKycRequests(res.data || []);
        } catch (error) {
            toast.error("Failed to load KYC requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadKyc();
    }, []);

    const handleDecision = async (userId: string, approve: boolean) => {
        if (!userId) return;
        setActionLoading(true);
        try {
            const res = approve ? await approveKycApi(userId) : await rejectKycApi(userId);
            if (res.success) {
                toast.success(approve ? "KYC approved" : "KYC rejected");
                setIsDetailOpen(false);
                loadKyc();
            } else {
                toast.error(res.message || "Operation failed");
            }
        } catch (error) {
            toast.error("Operation failed");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader 
                title="Trust & Safety Hub" 
                description="Review pending identity verifications and manage buyer trust scores."
                badge={{ count: kycRequests.length, label: "pending", color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" }}
                actions={
                    <button onClick={loadKyc} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    </button>
                }
            />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 text-center font-plus-jakarta text-gray-500 animate-pulse">Scanning identity pool...</div>
                    ) : (
                        <table className="w-full whitespace-nowrap text-left text-sm">
                            <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                                <tr>{["User", "Email", "Document", "Confidence", "Status", ""].map(h => <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>)}</tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                                {kycRequests.length > 0 ? kycRequests.map(req => (
                                    <tr key={req.userId} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                                                    {req.facePhotoUrl ? (
                                                        <img src={req.facePhotoUrl} alt="Selfie" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-gray-400"><UserCheck className="h-5 w-5" /></div>
                                                    )}
                                                </div>
                                                <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{req.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500">{req.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 font-plus-jakarta text-xs font-bold text-gray-600 dark:text-gray-400">
                                                <FileText className="h-3.5 w-3.5" /> Identity Card
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                             <div className="flex items-center gap-2">
                                                 <div className="h-1.5 w-12 rounded-full bg-gray-100 overflow-hidden">
                                                     <div className="h-full bg-emerald-500" style={{ width: `${(req.kycSimilarityScore || 0) * 100}%` }}></div>
                                                 </div>
                                                 <span className="font-mono text-[10px] font-bold text-emerald-600">
                                                     {Math.round((req.kycSimilarityScore || 0) * 100)}% Match
                                                 </span>
                                             </div>
                                        </td>
                                        <td className="px-6 py-4"><StatusBadge status={req.kycStatus?.toLowerCase() || "pending"} /></td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => { setSelected(req); setIsDetailOpen(true); }} className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400">
                                                <Eye className="h-3.5 w-3.5" /> Review
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center font-plus-jakarta text-sm text-gray-400">All identity verifications are caught up.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Identity Verification Review" size="lg"
                footer={<div className="flex gap-3 w-full">
                    <button disabled={actionLoading} onClick={() => handleDecision(selected?.userId!, false)} className="flex-1 rounded-xl bg-rose-50 px-4 py-2 font-plus-jakarta text-sm font-bold text-rose-600 hover:bg-rose-100"><XCircle className="h-4 w-4 inline mr-2" /> Reject</button>
                    <button disabled={actionLoading} onClick={() => handleDecision(selected?.userId!, true)} className="flex-1 rounded-xl bg-emerald-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-emerald-700"><CheckCircle2 className="h-4 w-4 inline mr-2" /> Approve</button>
                </div>}>
                {selected && (
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">Selfie Evidence</label>
                                <div className="aspect-square w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 dark:border-gray-800">
                                    {selected.facePhotoUrl ? (
                                        <img src={selected.facePhotoUrl} alt="Selfie" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-gray-300"><UserCheck className="h-10 w-10" /></div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">Identity Document</label>
                                <div className="aspect-square w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 dark:border-gray-800">
                                    {selected.idCardFrontUrl ? (
                                        <img src={selected.idCardFrontUrl} alt="ID Front" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-gray-300"><FileText className="h-10 w-10" /></div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                             <div className="flex items-center gap-2 mb-3">
                                 <UserCheck className="h-4 w-4 text-blue-500" />
                                 <p className="font-plus-jakarta text-xs font-bold uppercase tracking-widest text-gray-400">User Summary</p>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                 {[
                                     { label: "Full Name", value: selected.fullName },
                                     { label: "Email Address", value: selected.email },
                                     { label: "Similarity Score", value: `${Math.round((selected.kycSimilarityScore || 0) * 100)}%` },
                                     { label: "System ID", value: selected.userId.substring(0, 8) },
                                 ].map(({ label, value }) => (
                                     <div key={label}>
                                         <p className="font-plus-jakarta text-[10px] font-bold text-gray-500">{label}</p>
                                         <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{value}</p>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
