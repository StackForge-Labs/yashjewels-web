"use client";

import { useState } from "react";
import { Plus, ShieldCheck, Eye } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Drawer } from "../_components/ui/Drawer";
import { Modal } from "../_components/ui/Modal";
import { FormField, inputCls, selectCls, textareaCls } from "../_components/ui/FormField";

type Service = {
    id: string; order_id: string; customer: string; type: "Warranty" | "Insurance" | "Repair";
    coverage_detail: string; start_date: string; end_date: string;
    status: "active" | "expired" | "in_review";
};

const mockServices: Service[] = [
    { id: "1", order_id: "ORD-9281", customer: "Eleanor Vance", type: "Warranty", coverage_detail: "12-month manufacturing defect warranty. Covers gold breakage, clasp failure, and stone loss due to setting defect.", start_date: "2026-04-08", end_date: "2027-04-08", status: "active" },
    { id: "2", order_id: "ORD-8442", customer: "Sophia Chen", type: "Insurance", coverage_detail: "Full replacement insurance against theft, loss, and accidental damage up to original purchase price.", start_date: "2026-03-01", end_date: "2027-03-01", status: "in_review" },
    { id: "3", order_id: "ORD-7201", customer: "James Sterling", type: "Repair", coverage_detail: "Complimentary repolishing and prong re-tipping service within 6 months of purchase.", start_date: "2025-10-01", end_date: "2026-04-01", status: "expired" },
];

type FormData = { order_id: string; customer: string; type: "Warranty" | "Insurance" | "Repair"; coverage_detail: string; start_date: string; end_date: string };
const emptyForm: FormData = { order_id: "", customer: "", type: "Warranty", coverage_detail: "", start_date: "", end_date: "" };

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>(mockServices);
    const [selected, setSelected] = useState<Service | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [form, setForm] = useState<FormData>(emptyForm);

    const handleCreate = () => {
        setServices([{ id: Date.now().toString(), ...form, status: "active" }, ...services]);
        setIsDrawerOpen(false);
        setForm(emptyForm);
    };

    const typeColors: Record<Service["type"], string> = {
        Warranty: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
        Insurance: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
        Repair: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Services & Warranties" description="Manage product warranties, insurance policies, and repair programs."
                actions={
                    <button onClick={() => { setForm(emptyForm); setIsDrawerOpen(true); }} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)] hover:bg-blue-700">
                        <Plus className="h-4 w-4" /> Add Policy
                    </button>
                }
            />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>{["Order", "Customer", "Type", "Valid Until", "Status", ""].map(h => <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {services.map(svc => (
                                <tr key={svc.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{svc.order_id}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-600 dark:text-gray-300">{svc.customer}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-plus-jakarta text-[10px] font-bold uppercase ${typeColors[svc.type]}`}>
                                            <ShieldCheck className="h-3 w-3" /> {svc.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500">{svc.end_date}</td>
                                    <td className="px-6 py-4"><StatusBadge status={svc.status} /></td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => { setSelected(svc); setIsDetailOpen(true); }} className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400">
                                            <Eye className="h-3.5 w-3.5" /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Policy Drawer */}
            <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Add Service Policy" subtitle="Register a new warranty, insurance, or repair plan"
                footer={<>
                    <button onClick={() => setIsDrawerOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300">Cancel</button>
                    <button onClick={handleCreate} disabled={!form.order_id || !form.customer} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-40">Add Policy</button>
                </>}>
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Order ID" required>
                            <input className={inputCls} placeholder="ORD-9281" value={form.order_id} onChange={e => setForm({ ...form, order_id: e.target.value })} />
                        </FormField>
                        <FormField label="Customer Name" required>
                            <input className={inputCls} placeholder="Full name" value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })} />
                        </FormField>
                    </div>
                    <FormField label="Service Type">
                        <select className={selectCls} value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Service["type"] })}>
                            <option>Warranty</option>
                            <option>Insurance</option>
                            <option>Repair</option>
                        </select>
                    </FormField>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Start Date">
                            <input type="date" className={inputCls} value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
                        </FormField>
                        <FormField label="End Date">
                            <input type="date" className={inputCls} value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
                        </FormField>
                    </div>
                    <FormField label="Coverage Details">
                        <textarea rows={4} className={textareaCls} placeholder="Describe what this policy covers..." value={form.coverage_detail} onChange={e => setForm({ ...form, coverage_detail: e.target.value })} />
                    </FormField>
                </div>
            </Drawer>

            {/* Detail Modal */}
            <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Policy Details" size="md">
                {selected && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-plus-jakarta text-[10px] font-bold uppercase ${typeColors[selected.type]}`}><ShieldCheck className="h-3 w-3" /> {selected.type}</span>
                            <StatusBadge status={selected.status} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Order", value: selected.order_id },
                                { label: "Customer", value: selected.customer },
                                { label: "Start Date", value: selected.start_date },
                                { label: "End Date", value: selected.end_date },
                            ].map(({ label, value }) => (
                                <div key={label} className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                                    <p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400">{label}</p>
                                    <p className="mt-1 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400 mb-2">Coverage Details</p>
                            <p className="font-plus-jakarta text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300">{selected.coverage_detail}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
