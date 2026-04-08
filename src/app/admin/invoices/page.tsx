"use client";

import { useState } from "react";
import { Plus, Download, Eye } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Modal } from "../_components/ui/Modal";
import { FormField, inputCls, selectCls, textareaCls } from "../_components/ui/FormField";

type Invoice = {
    id: string; invoice_number: string; order_id: string; buyer_name: string;
    buyer_address: string; total_amount: number; status: "paid" | "pending";
    issued_at: string; version: number; items: { name: string; qty: number; price: number }[];
};

const mockInvoices: Invoice[] = [
    { id: "1", invoice_number: "INV-2026-001", order_id: "ORD-9281", buyer_name: "Eleanor Vance", buyer_address: "88 Nguyen Hue, Q1, HCMC", total_amount: 4500, status: "paid", issued_at: "2026-04-08", version: 1, items: [{ name: "Classic Solitaire Ring", qty: 1, price: 4500 }] },
    { id: "2", invoice_number: "INV-2026-002", order_id: "ORD-9282", buyer_name: "James Sterling", buyer_address: "12 Le Loi, Q1, HCMC", total_amount: 12300, status: "pending", issued_at: "2026-04-07", version: 1, items: [{ name: "Diamond Tennis Necklace", qty: 1, price: 10000 }, { name: "Emerald Bracelet", qty: 1, price: 2300 }] },
    { id: "3", invoice_number: "INV-2026-003", order_id: "ORD-9283", buyer_name: "Sophia Chen", buyer_address: "45 Tran Hung Dao, Q5, HCMC", total_amount: 850, status: "paid", issued_at: "2026-04-06", version: 2, items: [{ name: "Sapphire Drop Earrings", qty: 1, price: 850 }] },
];

export default function InvoicesPage() {
    const [invoices] = useState<Invoice[]>(mockInvoices);
    const [selected, setSelected] = useState<Invoice | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isReissueOpen, setIsReissueOpen] = useState(false);
    const [reissueReason, setReissueReason] = useState("");
    const [search, setSearch] = useState("");

    const filtered = invoices.filter(i =>
        i.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
        i.buyer_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Invoices" description="Manage billing documents and handle reissue requests."
                actions={
                    <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300">
                        <Download className="h-4 w-4" /> Export All
                    </button>
                }
            />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="border-b border-gray-100 p-6 dark:border-gray-800/50">
                    <input type="text" placeholder="Search invoice or buyer..." value={search} onChange={e => setSearch(e.target.value)}
                        className="max-w-sm w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 font-plus-jakarta text-sm font-medium placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a]/50 dark:text-gray-100 dark:placeholder:text-gray-500" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>{["Invoice #", "Order", "Buyer", "Amount", "Version", "Status", "Actions"].map(h => <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {filtered.map(inv => (
                                <tr key={inv.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{inv.invoice_number}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500">{inv.order_id}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-semibold text-gray-700 dark:text-gray-300">{inv.buyer_name}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">${inv.total_amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-xs font-bold text-gray-500">v{inv.version}</td>
                                    <td className="px-6 py-4"><StatusBadge status={inv.status} /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => { setSelected(inv); setIsDetailOpen(true); }} className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-800"><Eye className="h-4 w-4" /></button>
                                            <button onClick={() => { setSelected(inv); setIsReissueOpen(true); }} className="rounded-lg px-2.5 py-1.5 font-plus-jakarta text-xs font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400">Reissue</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invoice Detail Modal */}
            <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title={selected?.invoice_number ?? ""} subtitle={`Issued: ${selected?.issued_at}`} size="lg">
                {selected && (
                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800"><p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400">Buyer</p><p className="mt-1 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{selected.buyer_name}</p></div>
                            <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800"><p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400">Order Ref</p><p className="mt-1 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{selected.order_id}</p></div>
                            <div className="col-span-2 rounded-xl border border-gray-100 p-3 dark:border-gray-800"><p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400">Shipping Address</p><p className="mt-1 font-plus-jakarta text-sm font-medium text-gray-700 dark:text-gray-300">{selected.buyer_address}</p></div>
                        </div>
                        <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400 mb-3">Line Items</p>
                            {selected.items.map((item, i) => (
                                <div key={i} className="flex justify-between py-2 border-b border-gray-50 last:border-0 dark:border-gray-800/50">
                                    <span className="font-plus-jakarta text-sm text-gray-700 dark:text-gray-300">{item.name} × {item.qty}</span>
                                    <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">${item.price.toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="flex justify-between pt-3 mt-1">
                                <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">Total</span>
                                <span className="font-plus-jakarta text-lg font-bold text-blue-600">${selected.total_amount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Reissue Modal */}
            <Modal isOpen={isReissueOpen} onClose={() => setIsReissueOpen(false)} title="Request Invoice Reissue" subtitle={selected?.invoice_number} size="md"
                footer={<>
                    <button onClick={() => setIsReissueOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300">Cancel</button>
                    <button onClick={() => setIsReissueOpen(false)} disabled={!reissueReason.trim()} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-40">Submit Request</button>
                </>}>
                <div className="flex flex-col gap-4">
                    <FormField label="Reason for Reissue" required>
                        <select className={selectCls}>
                            <option>Buyer name correction</option>
                            <option>Address update</option>
                            <option>Tax code change</option>
                            <option>Other</option>
                        </select>
                    </FormField>
                    <FormField label="Additional Notes">
                        <textarea rows={3} className={textareaCls} value={reissueReason} onChange={e => setReissueReason(e.target.value)} placeholder="Describe the required changes..." />
                    </FormField>
                </div>
            </Modal>
        </div>
    );
}
