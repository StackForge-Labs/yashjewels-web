"use client";

import { useState } from "react";
import { Plus, Eye } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Drawer } from "../_components/ui/Drawer";
import { Modal } from "../_components/ui/Modal";
import { ConfirmDialog } from "../_components/ui/ConfirmDialog";
import { FormField, inputCls, selectCls, textareaCls } from "../_components/ui/FormField";

type ReturnRequest = {
    id: string; order_id: string; customer: string; reason: string;
    refund_amount: number; refund_method: string; status: "pending" | "approved" | "rejected";
    evidence_urls: string[]; vendor_note: string; admin_note: string; date: string;
};

const initialReturns: ReturnRequest[] = [
    { id: "1", order_id: "ORD-9281", customer: "Eleanor Vance", reason: "Item arrived damaged during shipping", refund_amount: 4500, refund_method: "original_payment", status: "pending", evidence_urls: [], vendor_note: "", admin_note: "", date: "2026-04-08" },
    { id: "2", order_id: "ORD-9102", customer: "James Sterling", reason: "Wrong size, does not fit", refund_amount: 1200, refund_method: "bank_transfer", status: "approved", evidence_urls: [], vendor_note: "Item received back in good condition", admin_note: "Refund approved", date: "2026-04-05" },
    { id: "3", order_id: "ORD-8844", customer: "Sophia Chen", reason: "Product quality does not match photos", refund_amount: 850, refund_method: "store_credit", status: "rejected", evidence_urls: [], vendor_note: "", admin_note: "Photos show exact product as listed", date: "2026-04-03" },
];

export default function ReturnsPage() {
    const [returns, setReturns] = useState<ReturnRequest[]>(initialReturns);
    const [selected, setSelected] = useState<ReturnRequest | null>(null);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [adminNote, setAdminNote] = useState("");
    const [refundAmt, setRefundAmt] = useState(0);

    const pending = returns.filter(r => r.status === "pending").length;

    const openReview = (r: ReturnRequest) => {
        setSelected(r);
        setAdminNote(r.admin_note);
        setRefundAmt(r.refund_amount);
        setIsReviewOpen(true);
    };

    const handleAction = (action: "approved" | "rejected") => {
        if (!selected) return;
        setReturns(returns.map(r => r.id === selected.id ? { ...r, status: action, admin_note: adminNote, refund_amount: refundAmt } : r));
        setIsReviewOpen(false);
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Returns & Incidents" description="Handle customer return requests, refunds, and delivery incidents."
                badge={{ count: pending, label: "pending review", color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" }} />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>{["Order", "Customer", "Reason", "Refund Amount", "Date", "Status", ""].map(h => <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {returns.map(r => (
                                <tr key={r.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{r.order_id}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-medium text-gray-600 dark:text-gray-300">{r.customer}</td>
                                    <td className="max-w-[200px] truncate px-6 py-4 font-plus-jakarta text-sm text-gray-500">{r.reason}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">${r.refund_amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500">{r.date}</td>
                                    <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => openReview(r)} className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400">
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
            <Drawer isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} title={`Return: ${selected?.order_id}`} subtitle={selected?.customer}
                footer={
                    selected?.status === "pending" ? (
                        <>
                            <button onClick={() => handleAction("rejected")} className="rounded-xl bg-rose-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-rose-700">Reject</button>
                            <button onClick={() => handleAction("approved")} className="rounded-xl bg-emerald-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-emerald-700">Approve Refund</button>
                        </>
                    ) : (
                        <button onClick={() => setIsReviewOpen(false)} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700">Close</button>
                    )
                }>
                {selected && (
                    <div className="flex flex-col gap-5">
                        <StatusBadge status={selected.status} />
                        <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400 mb-2">Customer Reason</p>
                            <p className="font-plus-jakarta text-sm font-medium text-gray-700 dark:text-gray-300">{selected.reason}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                                <p className="font-plus-jakarta text-xs text-gray-400 text-center px-2">Evidence Photo 1<br />Connect API</p>
                            </div>
                            <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                                <p className="font-plus-jakarta text-xs text-gray-400 text-center px-2">Evidence Photo 2<br />Connect API</p>
                            </div>
                        </div>
                        {selected.status === "pending" && (
                            <>
                                <FormField label="Refund Amount ($)">
                                    <input type="number" className={inputCls} value={refundAmt} onChange={e => setRefundAmt(Number(e.target.value))} />
                                </FormField>
                                <FormField label="Admin Note">
                                    <textarea rows={3} className={textareaCls} value={adminNote} onChange={e => setAdminNote(e.target.value)} placeholder="Internal note for this decision..." />
                                </FormField>
                            </>
                        )}
                        {selected.admin_note && selected.status !== "pending" && (
                            <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                                <p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400 mb-1">Admin Note</p>
                                <p className="font-plus-jakarta text-sm text-gray-600 dark:text-gray-300">{selected.admin_note}</p>
                            </div>
                        )}
                    </div>
                )}
            </Drawer>
        </div>
    );
}
