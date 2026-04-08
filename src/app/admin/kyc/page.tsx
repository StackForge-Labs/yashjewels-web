"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Eye, Search, Clock } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Modal } from "../_components/ui/Modal";
import { FormField, textareaCls } from "../_components/ui/FormField";

type KYCRecord = {
    id: string; customer: string; cccd_number: string; attempt: number;
    liveness: boolean; face_match: number; status: "pending" | "approved" | "rejected";
    reject_reason: string; date: string; cccd_image_url: string; selfie_url: string;
};

const mockKYC: KYCRecord[] = [
    { id: "1", customer: "Sophia Chen", cccd_number: "049281726312", attempt: 1, liveness: true, face_match: 98.5, status: "pending", reject_reason: "", date: "2026-04-08", cccd_image_url: "", selfie_url: "" },
    { id: "2", customer: "James Sterling", cccd_number: "031082716253", attempt: 1, liveness: true, face_match: 99.2, status: "approved", reject_reason: "", date: "2026-04-07", cccd_image_url: "", selfie_url: "" },
    { id: "3", customer: "Michael Ross", cccd_number: "062091827364", attempt: 2, liveness: false, face_match: 45.0, status: "rejected", reject_reason: "Face match score too low, liveness check failed.", date: "2026-04-06", cccd_image_url: "", selfie_url: "" },
    { id: "4", customer: "Eleanor Vance", cccd_number: "074012938475", attempt: 1, liveness: true, face_match: 97.1, status: "pending", reject_reason: "", date: "2026-04-05", cccd_image_url: "", selfie_url: "" },
];

export default function KYCVerificationsPage() {
    const [records, setRecords] = useState<KYCRecord[]>(mockKYC);
    const [selected, setSelected] = useState<KYCRecord | null>(null);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [search, setSearch] = useState("");

    const filtered = records.filter(r =>
        r.customer.toLowerCase().includes(search.toLowerCase()) ||
        r.cccd_number.includes(search)
    );

    const handleApprove = () => {
        if (!selected) return;
        setRecords(records.map(r => r.id === selected.id ? { ...r, status: "approved" } : r));
        setIsReviewOpen(false);
    };

    const handleReject = () => {
        if (!selected || !rejectReason.trim()) return;
        setRecords(records.map(r => r.id === selected.id ? { ...r, status: "rejected", reject_reason: rejectReason } : r));
        setIsReviewOpen(false);
        setRejectReason("");
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="KYC Verifications" description="Review customer identity documents and approve verification requests."
                badge={{ count: records.filter(r => r.status === "pending").length, label: "pending", color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" }} />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="border-b border-gray-100 p-6 dark:border-gray-800/50">
                    <input type="text" placeholder="Search by name or CCCD number..." value={search} onChange={e => setSearch(e.target.value)}
                        className="max-w-sm w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 font-plus-jakarta text-sm font-medium placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a]/50 dark:text-gray-100 dark:placeholder:text-gray-500" />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>{["Customer", "CCCD", "Attempt", "Liveness", "Face Match", "Submitted", "Status", "Actions"].map(h => <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {filtered.map(r => (
                                <tr key={r.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{r.customer}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-medium text-gray-500">{r.cccd_number}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">#{r.attempt}</td>
                                    <td className="px-6 py-4">{r.liveness ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <XCircle className="h-5 w-5 text-rose-500" />}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-plus-jakarta text-sm font-bold ${r.face_match >= 90 ? "text-emerald-600" : r.face_match >= 70 ? "text-amber-600" : "text-rose-600"}`}>{r.face_match}%</span>
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500">{r.date}</td>
                                    <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => { setSelected(r); setRejectReason(r.reject_reason); setIsReviewOpen(true); }} className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400">
                                            <Eye className="h-3.5 w-3.5" /> Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Review Modal */}
            <Modal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} title="KYC Review" subtitle={selected?.customer} size="lg"
                footer={
                    selected?.status === "pending" ? (
                        <>
                            <button onClick={handleReject} disabled={!rejectReason.trim()} className="rounded-xl bg-rose-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-40">Reject</button>
                            <button onClick={handleApprove} className="rounded-xl bg-emerald-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-emerald-700">Approve</button>
                        </>
                    ) : (
                        <button onClick={() => setIsReviewOpen(false)} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700">Close</button>
                    )
                }>
                {selected && (
                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800"><p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400">CCCD</p><p className="mt-1 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{selected.cccd_number}</p></div>
                            <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800"><p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400">Face Match</p><p className={`mt-1 font-plus-jakarta text-sm font-bold ${selected.face_match >= 90 ? "text-emerald-600" : "text-rose-600"}`}>{selected.face_match}%</p></div>
                            <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800"><p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400">Liveness</p><p className="mt-1 font-plus-jakarta text-sm font-bold">{selected.liveness ? <span className="text-emerald-600">Passed ✓</span> : <span className="text-rose-600">Failed ✗</span>}</p></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {["CCCD Front / Back", "Face Selfie"].map(label => (
                                <div key={label} className="flex flex-col gap-2">
                                    <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                                    <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                                        <span className="font-plus-jakarta text-xs font-medium text-gray-400">Image placeholder — connect API</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selected.status === "pending" && (
                            <FormField label="Reject Reason (required to reject)" hint="Explain clearly why this submission is being rejected">
                                <textarea rows={3} className={textareaCls} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="e.g. ID document is blurry, face match below threshold..." />
                            </FormField>
                        )}

                        {selected.status !== "pending" && selected.reject_reason && (
                            <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 dark:border-rose-800/30 dark:bg-rose-900/10">
                                <p className="font-plus-jakarta text-[10px] font-bold uppercase text-rose-500 mb-1">Rejection Reason</p>
                                <p className="font-plus-jakarta text-sm font-medium text-rose-600">{selected.reject_reason}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
