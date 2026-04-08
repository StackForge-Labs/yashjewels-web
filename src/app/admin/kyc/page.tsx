"use client";

import { Search, Filter, CheckCircle2, XCircle, AlertCircle, Eye } from "lucide-react";

const mockKYC = [
    { id: "1", customer: "Sophia Chen", cccd_number: "049281726312", liveness: true, face_match: "98.5%", status: "Pending", date: "2026-04-08" },
    { id: "2", customer: "James Sterling", cccd_number: "031082716253", liveness: true, face_match: "99.2%", status: "Approved", date: "2026-04-07" },
    { id: "3", customer: "Michael Ross", cccd_number: "062091827364", liveness: false, face_match: "45.0%", status: "Rejected", date: "2026-04-06" },
];

export default function KYCVerificationsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white">KYC Verifications</h1>
                    <p className="mt-1 font-plus-jakarta text-sm font-medium text-gray-400 dark:text-gray-500">Review and approve customer identity verification requests.</p>
                </div>
            </div>

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="flex gap-4 border-b border-gray-100 p-6 dark:border-gray-800/50">
                    <div className="flex max-w-sm flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 transition-all focus-within:border-blue-500 dark:border-gray-800 dark:bg-[#1a1a1a]/50">
                        <Search className="h-4 w-4 text-gray-400" />
                        <input type="text" placeholder="Search by CCCD or Name..." className="w-full bg-transparent font-plus-jakarta text-sm focus:outline-none dark:text-white" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 text-gray-400 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Customer Info</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">CCCD Number</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Liveness</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Face Match</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {mockKYC.map((kyc) => (
                                <tr key={kyc.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-8 py-5 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{kyc.customer}</td>
                                    <td className="px-8 py-5 font-plus-jakarta text-sm font-medium text-gray-500">{kyc.cccd_number}</td>
                                    <td className="px-8 py-5">
                                        {kyc.liveness ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <XCircle className="h-5 w-5 text-rose-500" />}
                                    </td>
                                    <td className="px-8 py-5 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{kyc.face_match}</td>
                                    <td className="px-8 py-5">
                                        {kyc.status === "Pending" && <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-600 dark:bg-amber-500/10"><AlertCircle className="h-3 w-3" /> Pending Review</span>}
                                        {kyc.status === "Approved" && <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-600 dark:bg-emerald-500/10">Approved</span>}
                                        {kyc.status === "Rejected" && <span className="inline-flex items-center rounded-lg bg-rose-50 px-2.5 py-1 text-[10px] font-bold uppercase text-rose-600 dark:bg-rose-500/10">Rejected</span>}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400">
                                            <Eye className="h-4 w-4" /> Review Images
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
