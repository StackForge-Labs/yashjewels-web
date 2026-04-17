"use client";

import { useState, useEffect } from "react";
import { Plus, Tag, Search, Edit3, Trash2, RefreshCw } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Modal } from "../_components/ui/Modal";
import { ConfirmDialog } from "../_components/ui/ConfirmDialog";
import { FormField, inputCls, selectCls } from "../_components/ui/FormField";
import { couponService } from "@/services/coupon.service";
import { Coupon, DiscountType } from "@/types/coupon.types";
import { toast } from "sonner";
import { format } from "date-fns";

type FormData = {
    code: string;
    description: string;
    discountType: string;
    discountValue: number;
    minOrderAmount: number;
    maxUsesTotal: number;
    validFrom: string;
    validUntil: string;
    isActive: boolean;
};

const emptyForm: FormData = {
    code: "",
    description: "",
    discountType: "0", // Percentage
    discountValue: 10,
    minOrderAmount: 0,
    maxUsesTotal: 100,
    validFrom: format(new Date(), "yyyy-MM-dd"),
    validUntil: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), "yyyy-MM-dd"),
    isActive: true
};

export default function MarketingPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Coupon | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [form, setForm] = useState<FormData>(emptyForm);

    const fetchCoupons = async () => {
        setLoading(true);
        const res = await couponService.getAll();
        if (res.success) {
            setCoupons(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const filtered = coupons.filter(c => 
        c.code.toLowerCase().includes(search.toLowerCase()) || 
        c.description?.toLowerCase().includes(search.toLowerCase())
    );

    const handleOpenCreate = () => {
        setForm(emptyForm);
        setModalMode("create");
        setIsModalOpen(true);
    };

    const handleOpenEdit = (coupon: Coupon) => {
        setForm({
            code: coupon.code,
            description: coupon.description || "",
            discountType: coupon.discountType.toString(),
            discountValue: coupon.discountValue,
            minOrderAmount: coupon.minOrderAmount || 0,
            maxUsesTotal: coupon.maxUsesTotal || 0,
            validFrom: format(new Date(coupon.validFrom), "yyyy-MM-dd"),
            validUntil: format(new Date(coupon.validUntil), "yyyy-MM-dd"),
            isActive: coupon.isActive
        });
        setSelected(coupon);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        const payload = {
            ...form,
            discountType: parseInt(form.discountType),
            validFrom: new Date(form.validFrom).toISOString(),
            validUntil: new Date(form.validUntil).toISOString(),
        };

        if (modalMode === "create") {
            const res = await couponService.create(payload);
            if (res.success) {
                toast.success("Coupon created successfully");
                fetchCoupons();
                setIsModalOpen(false);
            } else {
                toast.error(res.message);
            }
        } else if (selected) {
            const res = await couponService.update(selected.id, payload);
            if (res.success) {
                toast.success("Coupon updated successfully");
                fetchCoupons();
                setIsModalOpen(false);
            } else {
                toast.error(res.message);
            }
        }
    };

    const handleDelete = async () => {
        if (!selected) return;
        const res = await couponService.delete(selected.id);
        if (res.success) {
            toast.success("Coupon deleted successfully");
            fetchCoupons();
            setIsDeleteOpen(false);
        } else {
            toast.error(res.message);
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader 
                title="Marketing & Promotions" 
                description="Manage coupons, discount codes, and promotional campaigns."
                actions={
                    <button 
                        onClick={handleOpenCreate} 
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)] hover:bg-blue-700 transition-all active:scale-95"
                    >
                        <Plus className="h-4 w-4" /> Create Coupon
                    </button>
                }
            />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70 overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-gray-800/50">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search coupon code or description..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 font-plus-jakarta text-sm font-medium placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a]/50 dark:text-gray-100 dark:placeholder:text-gray-500 transition-all" 
                        />
                    </div>
                    <button 
                        onClick={fetchCoupons}
                        className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                        title="Refresh data"
                    >
                        <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                {["Code", "Discount", "Min Order", "Usage", "Validity", "Status", "Actions"].map(h => (
                                    <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={7} className="px-6 py-8 h-16 bg-gray-50/30 dark:bg-gray-900/10"></td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-plus-jakarta">
                                        No coupons found.
                                    </td>
                                </tr>
                            ) : filtered.map(coupon => (
                                <tr key={coupon.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                                <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">{coupon.code}</span>
                                                <p className="font-plus-jakarta text-xs text-gray-400 line-clamp-1">{coupon.description || "No description"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-plus-jakarta text-sm font-bold text-blue-600 dark:text-blue-400">
                                            {coupon.discountType === DiscountType.PERCENTAGE 
                                                ? `${coupon.discountValue}%` 
                                                : formatCurrency(coupon.discountValue)}
                                        </span>
                                        {coupon.discountType === DiscountType.FREE_SHIPPING && (
                                            <span className="ml-2 px-2 py-0.5 rounded-md bg-green-50 text-green-600 text-[10px] font-bold">FREE SHIPPING</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500">
                                        {coupon.minOrderAmount ? formatCurrency(coupon.minOrderAmount) : "None"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 w-32">
                                            <div className="flex justify-between font-plus-jakarta text-[10px] font-bold text-gray-900 dark:text-white">
                                                <span>{coupon.usedCount} used</span>
                                                <span className="text-gray-400">/ {coupon.maxUsesTotal || '∞'}</span>
                                            </div>
                                            <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                                                <div 
                                                    className="h-full rounded-full bg-blue-600 transition-all duration-500" 
                                                    style={{ width: `${coupon.maxUsesTotal ? Math.min(100, (coupon.usedCount / coupon.maxUsesTotal) * 100) : 0}%` }} 
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        <div className="flex flex-col">
                                            <span>{format(new Date(coupon.validFrom), "MMM dd, yyyy")}</span>
                                            <span className="text-gray-400">→ {format(new Date(coupon.validUntil), "MMM dd, yyyy")}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={coupon.isActive ? "active" : "expired"} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                                            <button 
                                                onClick={() => handleOpenEdit(coupon)}
                                                className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-blue-900/20 transition-all"
                                                title="Edit coupon"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => { setSelected(coupon); setIsDeleteOpen(true); }}
                                                className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:bg-gray-800 dark:hover:bg-rose-900/20 transition-all"
                                                title="Delete coupon"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Coupon Modal */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={modalMode === "create" ? "Create New Coupon" : "Edit Coupon"} 
                size="md"
                footer={<>
                    <button 
                        onClick={() => setIsModalOpen(false)} 
                        className="rounded-xl border border-gray-200 px-6 py-2.5 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all dark:border-gray-800 dark:text-gray-300"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={!form.code || !form.validUntil} 
                        className="rounded-xl bg-blue-600 px-8 py-2.5 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)] hover:bg-blue-700 disabled:opacity-40 transition-all active:scale-95"
                    >
                        {modalMode === "create" ? "Create Coupon" : "Save Changes"}
                    </button>
                </>}
            >
                <div className="flex flex-col gap-5 p-2">
                    <FormField label="Coupon Code" required hint="Uppercase, no spaces (e.g., SUMMER2024)">
                        <input 
                            className={inputCls} 
                            placeholder="SUMMER25" 
                            value={form.code} 
                            onChange={e => setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s/g, "") })} 
                        />
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Discount Type">
                            <select 
                                className={selectCls} 
                                value={form.discountType}
                                onChange={e => setForm({ ...form, discountType: e.target.value })}
                            >
                                <option value="0">Percentage (%)</option>
                                <option value="1">Fixed Amount (VND)</option>
                                <option value="2">Free Shipping</option>
                            </select>
                        </FormField>
                        <FormField label="Discount Value" required>
                            <input 
                                type="number" 
                                className={inputCls} 
                                placeholder={form.discountType === "0" ? "10" : "500000"} 
                                value={form.discountValue}
                                onChange={e => setForm({ ...form, discountValue: Number(e.target.value) })}
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Min Order Amount (VND)">
                            <input 
                                type="number" 
                                className={inputCls} 
                                placeholder="0" 
                                value={form.minOrderAmount}
                                onChange={e => setForm({ ...form, minOrderAmount: Number(e.target.value) })}
                            />
                        </FormField>
                        <FormField label="Max Redemptions">
                            <input 
                                type="number" 
                                className={inputCls} 
                                placeholder="100" 
                                value={form.maxUsesTotal}
                                onChange={e => setForm({ ...form, maxUsesTotal: Number(e.target.value) })}
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Valid From" required>
                            <input 
                                type="date" 
                                className={inputCls} 
                                value={form.validFrom}
                                onChange={e => setForm({ ...form, validFrom: e.target.value })}
                            />
                        </FormField>
                        <FormField label="Valid Until" required>
                            <input 
                                type="date" 
                                className={inputCls} 
                                value={form.validUntil}
                                onChange={e => setForm({ ...form, validUntil: e.target.value })}
                            />
                        </FormField>
                    </div>

                    <FormField label="Description">
                        <textarea 
                            className={`${inputCls} h-20 resize-none`} 
                            placeholder="Describe how this coupon works..."
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                        />
                    </FormField>

                    {modalMode === "edit" && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                            <input 
                                type="checkbox" 
                                id="is_active" 
                                checked={form.isActive} 
                                onChange={e => setForm({ ...form, isActive: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="is_active" className="font-plus-jakarta text-sm font-bold text-gray-700 dark:text-gray-300 select-none">
                                Coupon is active and usable
                            </label>
                        </div>
                    )}
                </div>
            </Modal>

            <ConfirmDialog 
                isOpen={isDeleteOpen} 
                onClose={() => setIsDeleteOpen(false)} 
                onConfirm={handleDelete}
                title="Delete Coupon" 
                description={`Are you sure you want to permanently delete coupon "${selected?.code}"? This action cannot be undone and may affect order history reporting.`} 
                confirmLabel="Delete Coupon"
                isDestructive
            />
        </div>
    );
}
