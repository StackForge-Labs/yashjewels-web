"use client";

import { useEffect, useState } from "react";
import { Download, Eye, RefreshCw } from "lucide-react";
import { PageHeader } from "../../admin/_components/ui/PageHeader";
import { StatusBadge } from "../../admin/_components/ui/StatusBadge";
import { Modal } from "../../admin/_components/ui/Modal";
import { listInvoicesApi, getInvoiceApi, InvoiceDto } from "@/services/invoice.service";
import toast from "react-hot-toast";

export default function VendorInvoicesPage() {
    const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
    const [selected, setSelected] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const loadInvoices = async () => {
        setLoading(true);
        try {
            const res = await listInvoicesApi(page, 20);
            if (res.success) setInvoices(res.data);
        } catch (error) {
            toast.error("Failed to load invoices");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInvoices();
    }, [page]);

    const handleViewDetail = async (id: string) => {
        setIsDetailOpen(true);
        setIsDetailLoading(true);
        try {
            const res = await getInvoiceApi(id);
            if (res.success) setSelected(res.data);
        } catch (error) {
            toast.error("Failed to load invoice details");
        } finally {
            setIsDetailLoading(false);
        }
    };

    const filtered = invoices.filter(i =>
        i.invoiceNumber.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Invoices" description="Manage and view customer billing documents."
                actions={
                    <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300">
                        <Download className="h-4 w-4" /> Export All
                    </button>
                }
            />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="border-b border-gray-100 p-6 dark:border-gray-800/50 flex items-center justify-between">
                    <input type="text" placeholder="Search invoice..." value={search} onChange={e => setSearch(e.target.value)}
                        className="max-w-sm w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 font-plus-jakarta text-sm font-medium placeholder:text-gray-400 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a]/50 dark:text-gray-100 dark:placeholder:text-gray-500" />
                    <button onClick={loadInvoices} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 text-center font-plus-jakarta text-gray-500 animate-pulse">Loading invoices...</div>
                    ) : (
                        <table className="w-full whitespace-nowrap text-left text-sm">
                            <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                                <tr>{["Invoice #", "Order", "Buyer", "Amount", "Status", "Actions"].map(h => <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>)}</tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                                {filtered.length > 0 ? filtered.map(inv => (
                                    <tr key={inv.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                        <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{inv.invoiceNumber}</td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500">{inv.orderId.substring(0, 8)}...</td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm font-semibold text-gray-700 dark:text-gray-300">{inv.buyerName}</td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{inv.totalAmount.toLocaleString()} VND</td>
                                        <td className="px-6 py-4"><StatusBadge status={inv.status.toLowerCase() as any} /></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleViewDetail(inv.id)} className="rounded-lg p-2 text-gray-400 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-gray-800"><Eye className="h-4 w-4" /></button>
                                                {inv.pdfUrl && <a href={inv.pdfUrl} target="_blank" className="rounded-lg p-2 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-gray-800"><Download className="h-4 w-4" /></a>}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center font-plus-jakarta text-sm text-gray-400">No invoices found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Invoice Detail Modal */}
            <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title={selected?.invoiceNumber ?? "Loading..."} subtitle={`Issued: ${selected?.issuedAt ? new Date(selected.issuedAt).toLocaleString() : "..."}`} size="lg">
                {isDetailLoading ? (
                    <div className="p-10 text-center font-plus-jakarta text-gray-400 animate-pulse">Retrieving full invoice record...</div>
                ) : selected && (
                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800"><p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400">Buyer</p><p className="mt-1 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{selected.buyerName}</p></div>
                            <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800"><p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400">Order ID</p><p className="mt-1 font-plus-jakarta text-xs font-bold text-gray-900 dark:text-white">{selected.orderId}</p></div>
                            <div className="col-span-2 rounded-xl border border-gray-100 p-3 dark:border-gray-800"><p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400">Sub Total</p><p className="mt-1 font-plus-jakarta text-sm font-medium text-gray-700 dark:text-gray-300">{selected.subTotal?.toLocaleString()} VND</p></div>
                        </div>
                        <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400 mb-3">Finance Summary</p>
                            <div className="flex justify-between py-2 border-b border-gray-50 last:border-0 dark:border-gray-800/50">
                                <span className="font-plus-jakarta text-sm text-gray-700 dark:text-gray-300">Sub Total</span>
                                <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{selected.subTotal?.toLocaleString()} VND</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-50 last:border-0 dark:border-gray-800/50">
                                <span className="font-plus-jakarta text-sm text-gray-700 dark:text-gray-300">VAT (10%)</span>
                                <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{selected.taxAmount?.toLocaleString()} VND</span>
                            </div>
                            <div className="flex justify-between pt-3 mt-1 border-t border-gray-100 dark:border-gray-800">
                                <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">Final Total</span>
                                <span className="font-plus-jakarta text-lg font-bold text-amber-600">{selected.totalAmount?.toLocaleString()} VND</span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
