"use client";

import { useState } from "react";
import { Plus, Eye, Store, ChevronDown } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Drawer } from "../_components/ui/Drawer";
import { ConfirmDialog } from "../_components/ui/ConfirmDialog";
import { FormField, inputCls, selectCls } from "../_components/ui/FormField";

type Vendor = {
    id: string; business_name: string; tax_code: string; commission_rate: number;
    vendor_level: number; max_sub_vendors: number; kyc_status: "verified" | "pending" | "rejected";
    status: "active" | "inactive"; sla_violations: number; joined: string;
};

const initialVendors: Vendor[] = [
    { id: "1", business_name: "Premium Gems Ltd", tax_code: "MST-0123456789", commission_rate: 12, vendor_level: 1, max_sub_vendors: 10, kyc_status: "verified", status: "active", sla_violations: 0, joined: "2026-01-10" },
    { id: "2", business_name: "Aurum Mines Corp", tax_code: "MST-9876543210", commission_rate: 8, vendor_level: 2, max_sub_vendors: 5, kyc_status: "verified", status: "active", sla_violations: 1, joined: "2026-03-22" },
    { id: "3", business_name: "Jade Dynasty Trade", tax_code: "MST-1122334455", commission_rate: 10, vendor_level: 1, max_sub_vendors: 8, kyc_status: "pending", status: "inactive", sla_violations: 0, joined: "2026-04-01" },
];

type FormData = { business_name: string; tax_code: string; commission_rate: number; vendor_level: number; max_sub_vendors: number };
const emptyForm: FormData = { business_name: "", tax_code: "", commission_rate: 10, vendor_level: 1, max_sub_vendors: 5 };

export default function VendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
    const [selected, setSelected] = useState<Vendor | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isSuspendOpen, setIsSuspendOpen] = useState(false);
    const [form, setForm] = useState<FormData>(emptyForm);

    const handleCreate = () => {
        setVendors([{ ...form, id: Date.now().toString(), kyc_status: "pending", status: "inactive", sla_violations: 0, joined: new Date().toISOString().split("T")[0] }, ...vendors]);
        setIsDrawerOpen(false);
        setForm(emptyForm);
    };

    const handleToggle = () => {
        if (!selected) return;
        setVendors(vendors.map(v => v.id === selected.id ? { ...v, status: v.status === "active" ? "inactive" : "active" } : v));
        setIsSuspendOpen(false);
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Vendor Management" description="Manage B2B partners, supplier commissions, and business KYC."
                actions={
                    <button onClick={() => { setForm(emptyForm); setIsDrawerOpen(true); }} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)] hover:bg-blue-700">
                        <Plus className="h-4 w-4" /> Add Vendor
                    </button>
                }
            />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>{["Business", "Level & Rate", "Sub-Vendors", "KYC", "SLA Violations", "Status", ""].map(h => <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {vendors.map(v => (
                                <tr key={v.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20"><Store className="h-4 w-4 text-blue-600 dark:text-blue-400" /></div>
                                            <div>
                                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{v.business_name}</p>
                                                <p className="font-plus-jakarta text-xs text-gray-400">{v.tax_code}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">Level {v.vendor_level}</span>
                                        <span className="ml-2 font-plus-jakarta text-sm font-bold text-blue-600">{v.commission_rate}%</span>
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500">{v.max_sub_vendors} max</td>
                                    <td className="px-6 py-4"><StatusBadge status={v.kyc_status} /></td>
                                    <td className="px-6 py-4">
                                        <span className={`font-plus-jakarta text-sm font-bold ${v.sla_violations > 0 ? "text-rose-600" : "text-emerald-600"}`}>{v.sla_violations}</span>
                                    </td>
                                    <td className="px-6 py-4"><StatusBadge status={v.status} /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => { setSelected(v); setIsDetailOpen(true); }} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800"><Eye className="h-4 w-4" /></button>
                                            <button onClick={() => { setSelected(v); setIsSuspendOpen(true); }} className={`rounded-lg px-2.5 py-1 font-plus-jakarta text-xs font-bold ${v.status === "active" ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}>
                                                {v.status === "active" ? "Suspend" : "Activate"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Vendor Drawer */}
            <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Add New Vendor" subtitle="Register a new B2B business partner"
                footer={<>
                    <button onClick={() => setIsDrawerOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300">Cancel</button>
                    <button onClick={handleCreate} disabled={!form.business_name} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-40">Add Vendor</button>
                </>}>
                <div className="flex flex-col gap-4">
                    <FormField label="Business Name" required>
                        <input className={inputCls} placeholder="e.g. Premium Gems Ltd" value={form.business_name} onChange={e => setForm({ ...form, business_name: e.target.value })} />
                    </FormField>
                    <FormField label="Tax Code (MST)">
                        <input className={inputCls} placeholder="MST-0123456789" value={form.tax_code} onChange={e => setForm({ ...form, tax_code: e.target.value })} />
                    </FormField>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Vendor Level">
                            <select className={selectCls} value={form.vendor_level} onChange={e => setForm({ ...form, vendor_level: Number(e.target.value) })}>
                                <option value={1}>Level 1 (Primary)</option>
                                <option value={2}>Level 2 (Sub)</option>
                                <option value={3}>Level 3 (Sub-sub)</option>
                            </select>
                        </FormField>
                        <FormField label="Commission Rate (%)">
                            <input type="number" step="0.5" className={inputCls} placeholder="10" value={form.commission_rate} onChange={e => setForm({ ...form, commission_rate: Number(e.target.value) })} />
                        </FormField>
                    </div>
                    <FormField label="Max Sub-Vendors">
                        <input type="number" className={inputCls} placeholder="5" value={form.max_sub_vendors} onChange={e => setForm({ ...form, max_sub_vendors: Number(e.target.value) })} />
                    </FormField>
                </div>
            </Drawer>

            {/* Detail Modal */}
            {selected && (
                <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 ${isDetailOpen ? "" : "hidden"}`}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDetailOpen(false)} />
                    <div className="relative w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-[#111]">
                        <h2 className="font-plus-jakarta text-lg font-bold text-gray-900 dark:text-white mb-4">{selected.business_name}</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Tax Code", value: selected.tax_code },
                                { label: "Level", value: `Level ${selected.vendor_level}` },
                                { label: "Commission", value: `${selected.commission_rate}%` },
                                { label: "Max Sub-Vendors", value: String(selected.max_sub_vendors) },
                                { label: "SLA Violations", value: String(selected.sla_violations) },
                                { label: "Joined", value: selected.joined },
                            ].map(({ label, value }) => (
                                <div key={label} className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                                    <p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400">{label}</p>
                                    <p className="mt-1 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex gap-3"><StatusBadge status={selected.status} /><StatusBadge status={selected.kyc_status} /></div>
                        <button onClick={() => setIsDetailOpen(false)} className="mt-5 w-full rounded-xl bg-blue-600 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700">Close</button>
                    </div>
                </div>
            )}

            <ConfirmDialog isOpen={isSuspendOpen} onClose={() => setIsSuspendOpen(false)} onConfirm={handleToggle}
                title={selected?.status === "active" ? "Suspend Vendor" : "Activate Vendor"}
                description={`${selected?.status === "active" ? "Suspend" : "Activate"} "${selected?.business_name}"?`}
                confirmLabel={selected?.status === "active" ? "Suspend" : "Activate"}
                isDestructive={selected?.status === "active"} />
        </div>
    );
}
