"use client";

import { useState } from "react";
import { Eye, Download, TrendingUp, DollarSign, Clock } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Modal } from "../_components/ui/Modal";

type Payment = {
    id: string; order_id: string; amount: number; currency: string;
    payment_method: "credit_card" | "bank_transfer" | "paypal";
    gateway: string; gateway_transaction_id: string; status: "paid" | "pending" | "refunded" | "failed";
    refunded_amount: number; date: string;
    gateway_response: { message: string; code: string };
};

const mockPayments: Payment[] = [
    { id: "1", order_id: "ORD-9281", amount: 4500, currency: "USD", payment_method: "credit_card", gateway: "Stripe", gateway_transaction_id: "txn_3P2Bw2CXZ9GYT7aQ0PH8wZ", status: "paid", refunded_amount: 0, date: "2026-04-08 10:24", gateway_response: { message: "Charge succeeded", code: "SUCCESS" } },
    { id: "2", order_id: "ORD-9282", amount: 12300, currency: "USD", payment_method: "bank_transfer", gateway: "Manual", gateway_transaction_id: "WIRE-20260407-001", status: "pending", refunded_amount: 0, date: "2026-04-07 14:00", gateway_response: { message: "Awaiting confirmation", code: "PENDING" } },
    { id: "3", order_id: "ORD-9283", amount: 850, currency: "USD", payment_method: "paypal", gateway: "PayPal", gateway_transaction_id: "7X824752G3174714R", status: "paid", refunded_amount: 0, date: "2026-04-06 09:17", gateway_response: { message: "Payment completed", code: "COMPLETED" } },
    { id: "4", order_id: "ORD-9284", amount: 1200, currency: "USD", payment_method: "credit_card", gateway: "Stripe", gateway_transaction_id: "ch_3P1Ca7CXZ9GYT7aQ0TH9wQ", status: "refunded", refunded_amount: 1200, date: "2026-04-05 11:45", gateway_response: { message: "Refund issued", code: "REFUNDED" } },
];

export default function FinancePage() {
    const [payments] = useState<Payment[]>(mockPayments);
    const [selected, setSelected] = useState<Payment | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const totalRevenue = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
    const pending = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Financial Hub" description="Monitor payments, gateway transactions, and revenue flows."
                actions={
                    <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300">
                        <Download className="h-4 w-4" /> Export Report
                    </button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400", sub: "from paid orders" },
                    { label: "Pending Payouts", value: `$${pending.toLocaleString()}`, icon: Clock, color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400", sub: "awaiting confirmation" },
                    { label: "Total Refunds", value: `$${payments.filter(p => p.status === "refunded").reduce((s, p) => s + p.refunded_amount, 0).toLocaleString()}`, icon: TrendingUp, color: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400", sub: "issued to customers" },
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
                <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800/50">
                    <h2 className="font-plus-jakarta text-base font-bold text-gray-900 dark:text-white">All Transactions</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>{["Order", "Amount", "Method", "Gateway", "Transaction ID", "Date", "Status", ""].map(h => <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {payments.map(p => (
                                <tr key={p.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{p.order_id}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">${p.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500 capitalize">{p.payment_method.replace("_", " ")}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-600 dark:text-gray-400">{p.gateway}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-400 max-w-[140px] truncate">{p.gateway_transaction_id}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-xs text-gray-500">{p.date}</td>
                                    <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => { setSelected(p); setIsDetailOpen(true); }} className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-800"><Eye className="h-4 w-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transaction Detail Modal */}
            <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Transaction Details" size="md">
                {selected && (
                    <div className="flex flex-col gap-4">
                        <StatusBadge status={selected.status} />
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Order", value: selected.order_id },
                                { label: "Amount", value: `$${selected.amount.toLocaleString()} ${selected.currency}` },
                                { label: "Gateway", value: selected.gateway },
                                { label: "Method", value: selected.payment_method.replace("_", " ") },
                                { label: "Refunded", value: selected.refunded_amount > 0 ? `$${selected.refunded_amount.toLocaleString()}` : "None" },
                                { label: "Date", value: selected.date },
                            ].map(({ label, value }) => (
                                <div key={label} className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                                    <p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400">{label}</p>
                                    <p className="mt-1 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white capitalize">{value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400 mb-2">Gateway Transaction ID</p>
                            <code className="font-mono text-xs text-gray-600 dark:text-gray-400 break-all">{selected.gateway_transaction_id}</code>
                        </div>
                        <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400 mb-2">Gateway Response</p>
                            <p className="font-plus-jakarta text-sm font-medium text-gray-700 dark:text-gray-300">{selected.gateway_response.message}</p>
                            <code className="font-mono text-xs text-gray-400">{selected.gateway_response.code}</code>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
