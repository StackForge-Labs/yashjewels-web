"use client";

import { useState } from "react";
import { Plus, Tag, Search } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Modal } from "../_components/ui/Modal";
import { ConfirmDialog } from "../_components/ui/ConfirmDialog";
import { FormField, inputCls, selectCls } from "../_components/ui/FormField";

type Coupon = {
    id: string; code: string; discount_type: "percent" | "fixed"; discount_value: number;
    min_order: number; max_uses: number; used_count: number; valid_from: string; valid_until: string;
    is_active: boolean; description: string;
};

const initialCoupons: Coupon[] = [
    { id: "1", code: "WELCOME20", discount_type: "percent", discount_value: 20, min_order: 500, max_uses: 500, used_count: 145, valid_from: "2026-01-01", valid_until: "2026-12-31", is_active: true, description: "Welcome discount for new customers" },
    { id: "2", code: "VIPGOLD", discount_type: "fixed", discount_value: 150, min_order: 1000, max_uses: 100, used_count: 32, valid_from: "2026-03-01", valid_until: "2026-05-01", is_active: true, description: "VIP exclusive fixed amount discount" },
    { id: "3", code: "FLASH50", discount_type: "percent", discount_value: 50, min_order: 0, max_uses: 500, used_count: 500, valid_from: "2026-04-01", valid_until: "2026-04-01", is_active: false, description: "Flash sale - expired" },
];

type FormData = { code: string; discount_type: "percent" | "fixed"; discount_value: number; min_order: number; max_uses: number; valid_from: string; valid_until: string; description: string };
const emptyForm: FormData = { code: "", discount_type: "percent", discount_value: 10, min_order: 0, max_uses: 100, valid_from: "", valid_until: "", description: "" };

export default function MarketingPage() {
    const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Coupon | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
    const [form, setForm] = useState<FormData>(emptyForm);

    const filtered = coupons.filter(c => c.code.toLowerCase().includes(search.toLowerCase()));

    const handleCreate = () => {
        setCoupons([{ ...form, id: Date.now().toString(), used_count: 0, is_active: true }, ...coupons]);
        setIsCreateOpen(false);
        setForm(emptyForm);
    };

    const handleDeactivate = () => {
        if (selected) setCoupons(coupons.map(c => c.id === selected.id ? { ...c, is_active: false } : c));
        setIsDeactivateOpen(false);
    };

    const field = (key: keyof FormData) => ({
        value: String(form[key]),
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
            setForm({ ...form, [key]: key === "discount_value" || key === "min_order" || key === "max_uses" ? Number(e.target.value) : e.target.value }),
    });

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Marketing & Promotions" description="Manage coupons, discount codes, and promotional campaigns."
                actions={
                    <button onClick={() => { setForm(emptyForm); setIsCreateOpen(true); }} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)] hover:bg-blue-700">
                        <Plus className="h-4 w-4" /> Create Coupon
                    </button>
                }
            />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="border-b border-gray-100 p-6 dark:border-gray-800/50">
                    <input type="text" placeholder="Search coupon code..." value={search} onChange={e => setSearch(e.target.value)}
                        className="max-w-sm w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 font-plus-jakarta text-sm font-medium placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a]/50 dark:text-gray-100 dark:placeholder:text-gray-500" />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>{["Code", "Discount", "Min Order", "Usage", "Validity", "Status", ""].map(h => <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {filtered.map(coupon => (
                                <tr key={coupon.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Tag className="h-3.5 w-3.5 text-gray-400" />
                                            <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">{coupon.code}</span>
                                        </div>
                                        <p className="mt-0.5 font-plus-jakarta text-xs text-gray-400 pl-5">{coupon.description}</p>
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-blue-600 dark:text-blue-400">
                                        {coupon.discount_type === "percent" ? `${coupon.discount_value}%` : `$${coupon.discount_value}`}
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500">{coupon.min_order ? `$${coupon.min_order}` : "None"}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 w-28">
                                            <div className="flex justify-between font-plus-jakarta text-xs font-bold text-gray-900 dark:text-white">
                                                <span>{coupon.used_count}</span><span className="text-gray-400">/ {coupon.max_uses}</span>
                                            </div>
                                            <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                                                <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(100, (coupon.used_count / coupon.max_uses) * 100)}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500"><span>{coupon.valid_from}</span><br /><span className="text-gray-400">→ {coupon.valid_until}</span></td>
                                    <td className="px-6 py-4"><StatusBadge status={coupon.is_active ? "active" : "expired"} /></td>
                                    <td className="px-6 py-4">
                                        {coupon.is_active && (
                                            <button onClick={() => { setSelected(coupon); setIsDeactivateOpen(true); }} className="rounded-lg bg-rose-50 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-rose-600 hover:bg-rose-100">Deactivate</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Coupon Modal */}
            <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Coupon" size="md"
                footer={<>
                    <button onClick={() => setIsCreateOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300">Cancel</button>
                    <button onClick={handleCreate} disabled={!form.code || !form.valid_until} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-40">Create Coupon</button>
                </>}>
                <div className="flex flex-col gap-4">
                    <FormField label="Coupon Code" required hint="Uppercase, no spaces">
                        <input className={inputCls} placeholder="SUMMER25" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s/g, "") })} />
                    </FormField>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Discount Type">
                            <select className={selectCls} {...field("discount_type")} onChange={e => setForm({ ...form, discount_type: e.target.value as "percent" | "fixed" })}>
                                <option value="percent">Percentage (%)</option>
                                <option value="fixed">Fixed Amount ($)</option>
                            </select>
                        </FormField>
                        <FormField label="Discount Value" required>
                            <input type="number" className={inputCls} placeholder="20" {...field("discount_value")} />
                        </FormField>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Min Order ($)">
                            <input type="number" className={inputCls} placeholder="0" {...field("min_order")} />
                        </FormField>
                        <FormField label="Max Uses">
                            <input type="number" className={inputCls} placeholder="100" {...field("max_uses")} />
                        </FormField>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Valid From" required>
                            <input type="date" className={inputCls} {...field("valid_from")} />
                        </FormField>
                        <FormField label="Valid Until" required>
                            <input type="date" className={inputCls} {...field("valid_until")} />
                        </FormField>
                    </div>
                    <FormField label="Description">
                        <input className={inputCls} placeholder="e.g. Summer sale discount" {...field("description")} />
                    </FormField>
                </div>
            </Modal>

            <ConfirmDialog isOpen={isDeactivateOpen} onClose={() => setIsDeactivateOpen(false)} onConfirm={handleDeactivate}
                title="Deactivate Coupon" description={`Deactivate coupon "${selected?.code}"? It will no longer be usable by customers.`} confirmLabel="Deactivate" />
        </div>
    );
}
