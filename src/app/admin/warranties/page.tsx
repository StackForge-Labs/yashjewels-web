"use client";

import { useState } from "react";
import { Shield, CheckCircle2, XCircle, Clock, Search, Eye, X, FileText } from "lucide-react";

// ─── Mock Data ─────────────────────────────────────────────
type WarrantyStatus = "OPEN" | "IN_REVIEW" | "APPROVED" | "REJECTED";

interface WarrantyClaim {
    id: string;
    customer: string;
    email: string;
    orderId: string;
    product: string;
    type: "WARRANTY" | "INSURANCE";
    issue: string;
    status: WarrantyStatus;
    submittedAt: string;
    claimAmount?: number;
}

const mockClaims: WarrantyClaim[] = [
    { id: "CLM-001", customer: "John Anderson", email: "john@example.com", orderId: "YJ-001", product: "Diamond Ring D-VVS1 18K", type: "INSURANCE", issue: "Item lost during transit, requesting full insurance payout.", status: "OPEN", submittedAt: "2025-04-19", claimAmount: 4500 },
    { id: "CLM-002", customer: "Sarah Miller", email: "sarah@example.com", orderId: "YJ-003", product: "Pearl Earrings", type: "WARRANTY", issue: "Earring post snapped after 2 weeks of normal use.", status: "IN_REVIEW", submittedAt: "2025-04-17" },
    { id: "CLM-003", customer: "David Smith", email: "david@example.com", orderId: "YJ-005", product: "Platinum Wedding Band", type: "WARRANTY", issue: "Rhodium plating chipping off, requires repolishing.", status: "APPROVED", submittedAt: "2025-04-15" },
    { id: "CLM-004", customer: "Emily Davis", email: "emily@example.com", orderId: "YJ-008", product: "22K Gold Bracelet", type: "INSURANCE", issue: "Product heavily scratched upon delivery arrival.", status: "REJECTED", submittedAt: "2025-04-14", claimAmount: 12000000 },
];

const statusConfig: Record<WarrantyStatus, { label: string; icon: typeof Clock; className: string }> = {
    OPEN: { label: "New Claim", icon: Clock, className: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" },
    IN_REVIEW: { label: "In Review", icon: Eye, className: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" },
    APPROVED: { label: "Approved", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" },
    REJECTED: { label: "Rejected", icon: XCircle, className: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400" },
};

function formatUsd(n: number) {
    return new Intl.NumberFormat("en-US").format(n) + " $";
}

function ClaimModal({ claim, onClose, onUpdate }: { claim: WarrantyClaim; onClose: () => void; onUpdate: (id: string, status: WarrantyStatus) => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-[#161616]">
                <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6 dark:border-gray-800">
                    <div>
                        <h2 className="font-plus-jakarta text-lg font-bold text-gray-900 dark:text-white">{claim.id}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`rounded-full px-2.5 py-0.5 font-plus-jakarta text-[11px] font-bold ${statusConfig[claim.status].className}`}>
                                {statusConfig[claim.status].label}
                            </span>
                            <span className={`rounded-full px-2.5 py-0.5 font-plus-jakarta text-[11px] font-bold ${claim.type === "INSURANCE" ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>
                                {claim.type === "INSURANCE" ? "Insurance" : "Warranty"}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"><X className="h-5 w-5" /></button>
                </div>

                <div className="flex flex-col gap-4 p-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                            <p className="font-plus-jakarta text-[10px] uppercase tracking-wider text-gray-400">Customer</p>
                            <p className="mt-1 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{claim.customer}</p>
                            <p className="font-plus-jakarta text-xs text-gray-400">{claim.email}</p>
                        </div>
                        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                            <p className="font-plus-jakarta text-[10px] uppercase tracking-wider text-gray-400">Order Information</p>
                            <p className="mt-1 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{claim.orderId}</p>
                            <p className="font-plus-jakarta text-xs text-gray-400">{claim.product}</p>
                        </div>
                    </div>
                    <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                        <p className="font-plus-jakarta text-[10px] uppercase tracking-wider text-gray-400 mb-2">Claim Description</p>
                        <p className="font-plus-jakarta text-sm text-gray-700 leading-relaxed dark:text-gray-300">{claim.issue}</p>
                    </div>
                    {claim.claimAmount && (
                        <div className="flex items-center justify-between rounded-xl bg-amber-50 px-5 py-4 dark:bg-amber-500/10">
                            <p className="font-plus-jakarta text-sm font-bold text-amber-800 dark:text-amber-300">Total Claim Value</p>
                            <p className="font-plus-jakarta text-lg font-black text-amber-800 dark:text-amber-300">{formatUsd(claim.claimAmount)}</p>
                        </div>
                    )}
                </div>

                {claim.status === "OPEN" || claim.status === "IN_REVIEW" ? (
                    <div className="flex gap-3 border-t border-gray-100 px-8 py-5 dark:border-gray-800">
                        {claim.status === "OPEN" && (
                            <button onClick={() => { onUpdate(claim.id, "IN_REVIEW"); onClose(); }} className="flex-1 rounded-xl border border-blue-200 bg-blue-50 py-2.5 font-plus-jakarta text-sm font-bold text-blue-700 hover:bg-blue-100 dark:border-blue-800/30 dark:bg-blue-500/10 dark:text-blue-400">
                                Start Investigation
                            </button>
                        )}
                        <button onClick={() => { onUpdate(claim.id, "REJECTED"); onClose(); }} className="flex-1 rounded-xl bg-rose-50 py-2.5 font-plus-jakarta text-sm font-bold text-rose-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400">
                            Reject
                        </button>
                        <button onClick={() => { onUpdate(claim.id, "APPROVED"); onClose(); }} className="flex-1 rounded-xl bg-emerald-600 py-2.5 font-plus-jakarta text-sm font-bold text-white hover:bg-emerald-700">
                            Approve Payout
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────
export default function AdminWarrantiesPage() {
    const [claims, setClaims] = useState<WarrantyClaim[]>(mockClaims);
    const [selected, setSelected] = useState<WarrantyClaim | null>(null);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<"ALL" | "WARRANTY" | "INSURANCE">("ALL");

    const filtered = claims.filter((c) => {
        const matchSearch = c.customer.toLowerCase().includes(search.toLowerCase()) || c.product.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === "ALL" || c.type === typeFilter;
        return matchSearch && matchType;
    });

    const handleUpdate = (id: string, status: WarrantyStatus) => {
        setClaims((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
    };

    return (
        <div className="flex flex-col gap-6">
            {selected && <ClaimModal claim={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} />}

            <div>
                <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Warranties & Insurance Claims</h1>
                <p className="mt-1 font-plus-jakarta text-sm text-gray-500 dark:text-gray-400">Manage warranty requests and insurance compensation claims from customers.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {(["OPEN", "IN_REVIEW", "APPROVED", "REJECTED"] as WarrantyStatus[]).map((s) => {
                    const cnt = claims.filter((c) => c.status === s).length;
                    const cfg = statusConfig[s];
                    const Icon = cfg.icon;
                    return (
                        <div key={s} className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white/70 p-5 backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${cfg.className}`}><Icon className="h-5 w-5" /></div>
                            <div>
                                <p className="font-plus-jakarta text-2xl font-bold text-gray-900 dark:text-white">{cnt}</p>
                                <p className="font-plus-jakarta text-xs font-semibold text-gray-400">{cfg.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by customer, or product..." className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-2.5 font-plus-jakarta text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900" />
                </div>
                <div className="flex gap-2">
                    {(["ALL", "WARRANTY", "INSURANCE"] as const).map((f) => (
                        <button key={f} onClick={() => setTypeFilter(f)} className={`rounded-lg px-4 py-2.5 font-plus-jakarta text-xs font-bold transition-colors ${typeFilter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"}`}>
                            {f === "ALL" ? "All Claims" : f === "WARRANTY" ? "Warranty" : "Insurance"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-gray-100 bg-white/70 shadow-sm backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                {["Claim ID", "Customer", "Product Info", "Category", "Date", "Status", ""].map((h) => (
                                    <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {filtered.map((c) => {
                                const cfg = statusConfig[c.status];
                                const Icon = cfg.icon;
                                return (
                                    <tr key={c.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-3.5 w-3.5 text-gray-400" />
                                                <span className="font-plus-jakarta text-xs font-bold text-gray-700 dark:text-gray-300">{c.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm font-medium text-gray-900 dark:text-white">{c.customer}</td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{c.product}</td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-2.5 py-1 font-plus-jakarta text-[11px] font-bold ${c.type === "INSURANCE" ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}>
                                                {c.type === "INSURANCE" ? "Insurance" : "Warranty"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-plus-jakarta text-xs text-gray-400">{c.submittedAt}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-plus-jakarta text-[11px] font-bold ${cfg.className}`}>
                                                <Icon className="h-3 w-3" />{cfg.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => setSelected(c)} className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-700 dark:bg-gray-800 dark:text-gray-400 transition-colors">
                                                <Eye className="h-3.5 w-3.5" /> Details
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
