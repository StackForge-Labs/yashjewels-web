"use client";

import { useEffect, useState } from "react";
import { Eye, Download, TrendingUp, DollarSign, Clock, RefreshCw } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Modal } from "../_components/ui/Modal";
import { getFinanceOverviewApi } from "@/services/admin.service";
import toast from "react-hot-toast";

interface FinanceTransaction {
    paymentId: string;
    id: string; // Used in modal
    orderNumber: string;
    amount: number;
    paymentMethod: string;
    gateway: string;
    transactionRef: string | null;
    timestamp: string;
    status: string;
}

interface FinanceOverview {
    totalRevenue: number;
    pendingSettlement: number;
    successRate: number;
    recentTransactions: FinanceTransaction[];
    paymentMethodDistribution: any[]; // Keep as any[] for now as its structure isn't fully used in UI
}

export default function FinancePage() {
    const [financeData, setFinanceData] = useState<FinanceOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<FinanceTransaction | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const loadFinance = async () => {
        setLoading(true);
        try {
            const res = await getFinanceOverviewApi();
            if (res.success) setFinanceData(res.data);
        } catch (error) {
            toast.error("Failed to load financial data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFinance();
    }, []);

    const payments = financeData?.recentTransactions || [];
    const stats = financeData?.paymentMethodDistribution || [];

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Financial Hub" description="Monitor payments, gateway transactions, and revenue flows."
                actions={
                    <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md">
                        <Download className="h-4 w-4" /> Export Master Ledger
                    </button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Total Revenue", value: `${(financeData?.totalRevenue ?? 0).toLocaleString()} VND`, icon: DollarSign, color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400", sub: "lifetime gross volume" },
                    { label: "Pending Settlements", value: `${(financeData?.pendingSettlement ?? 0).toLocaleString()} VND`, icon: Clock, color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400", sub: "awaiting gateway finality" },
                    { label: "Processing Success", value: `${financeData?.successRate}%`, icon: TrendingUp, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400", sub: "gateway health score" },
                ].map(({ label, value, icon: Icon, color, sub }) => (
                    <div key={label} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:border-gray-800/50 dark:bg-[#111]/70">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5" /></div>
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                        </div>
                        <p className="font-plus-jakarta text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                        <p className="mt-1 font-plus-jakarta text-xs font-medium text-gray-400">{sub}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800/50 flex items-center justify-between">
                    <h2 className="font-plus-jakarta text-base font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
                    <button onClick={loadFinance} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 text-center font-plus-jakarta text-gray-500 animate-pulse">Auditing ledgers...</div>
                    ) : (
                        <table className="w-full whitespace-nowrap text-left text-sm">
                            <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                                <tr>{["Order ID", "Amount", "Method", "Gateway", "Ref #", "Date", "Status", ""].map(h => <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>)}</tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                                {payments.length > 0 ? payments.map((p: FinanceTransaction) => (
                                    <tr key={p.paymentId} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                        <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{p.orderNumber}</td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{p.amount.toLocaleString()} VND</td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500 capitalize">{p.paymentMethod.toLowerCase()}</td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-600 dark:text-gray-400">{p.gateway}</td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-400 max-w-[140px] truncate">{p.transactionRef || "N/A"}</td>
                                        <td className="px-6 py-4 font-plus-jakarta text-xs text-gray-500">{new Date(p.timestamp).toLocaleString()}</td>
                                        <td className="px-6 py-4"><StatusBadge status={p.status.toLowerCase() === "succeeded" ? "paid" : "pending"} label={p.status} /></td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => { setSelected(p); setIsDetailOpen(true); }} className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-800"><Eye className="h-4 w-4" /></button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-20 text-center font-plus-jakarta text-sm text-gray-400">No transactions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                {/* Insurance Report Panel */}
                <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70 p-6">
                    <h2 className="font-plus-jakarta text-base font-bold text-gray-900 dark:text-white mb-1">Insurance Underwriting Report</h2>
                    <p className="font-plus-jakarta text-xs text-gray-500 mb-6">Generate and export transit and full-coverage insurance ledgers for internal audit.</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="font-plus-jakarta text-[10px] uppercase font-bold text-gray-400 mb-1 block">Start Date</label>
                            <input type="date" className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 font-plus-jakarta text-sm dark:border-gray-700 dark:bg-gray-900" />
                        </div>
                        <div>
                            <label className="font-plus-jakarta text-[10px] uppercase font-bold text-gray-400 mb-1 block">End Date</label>
                            <input type="date" className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 font-plus-jakarta text-sm dark:border-gray-700 dark:bg-gray-900" />
                        </div>
                    </div>
                    
                    <button onClick={() => toast.success("Insurance Report CSV downloaded.")} className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 font-plus-jakarta text-sm font-bold text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-black">
                        <Download className="h-4 w-4" /> Export Insurance CSV
                    </button>
                </div>

                {/* Cancellation Configuration Panel */}
                <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70 p-6">
                    <h2 className="font-plus-jakarta text-base font-bold text-gray-900 dark:text-white mb-1">Cancellation Penalty Configuration</h2>
                    <p className="font-plus-jakarta text-xs text-gray-500 mb-6">Manage automated penalty fees triggered upon customer cancellation post-deposit.</p>
                    
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                            <div>
                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">Tier 1 (&lt; 20M VND)</p>
                                <p className="font-plus-jakarta text-[10px] text-gray-400">Standard orders</p>
                            </div>
                            <div className="relative w-24">
                                <input type="number" defaultValue={5} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-right font-mono text-sm font-bold dark:border-gray-700 dark:bg-black" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-plus-jakarta text-xs text-gray-400">%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                            <div>
                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">Tier 2 (&ge; 20M VND)</p>
                                <p className="font-plus-jakarta text-[10px] text-gray-400">High-value acquisitions</p>
                            </div>
                            <div className="relative w-24">
                                <input type="number" defaultValue={10} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-right font-mono text-sm font-bold dark:border-gray-700 dark:bg-black" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-plus-jakarta text-xs text-gray-400">%</span>
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={() => toast.success("Cancellation policies updated globally.")} className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 font-plus-jakarta text-sm font-bold text-gray-600 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                        Save Policy Configuration
                    </button>
                </div>
            </div>

            {/* Transaction Detail Modal */}
            <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Audit Summary" size="md">
                {selected && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                             <StatusBadge status={selected.transactionRef ? "paid" : "pending"} />
                             <span className="font-mono text-xs text-gray-400">{selected.id}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Order Number", value: selected.orderNumber },
                                { label: "Amount Received", value: `${selected.amount.toLocaleString()} VND` },
                                { label: "Gateway", value: selected.gateway },
                                { label: "Method", value: selected.paymentMethod },
                                { label: "Timestamp", value: new Date(selected.timestamp).toLocaleString() },
                                { label: "Status", value: selected.status },
                            ].map(({ label, value }) => (
                                <div key={label} className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                                    <p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400">{label}</p>
                                    <p className="mt-1 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white capitalize">{value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400 mb-2">Gateway Reference</p>
                            <code className="font-mono text-xs text-gray-600 dark:text-gray-400 break-all">{selected.transactionRef || "N/A"}</code>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
