"use client";

import { useState, useEffect } from "react";
import { Plus, Ticket, Calendar, TrendingDown, Check, X } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Drawer } from "../_components/ui/Drawer";
import { FormField, inputCls, selectCls } from "../_components/ui/FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";

const couponSchema = z.object({
    code: z.string().min(3, "Code must be at least 3 chars").toUpperCase(),
    description: z.string().optional(),
    discountType: z.string().min(1),
    discountValue: z.coerce.number().min(1),
    minOrderAmount: z.coerce.number().optional(),
    maxUsesTotal: z.coerce.number().optional(),
    validFrom: z.string().min(1, "Starting date is required"),
    validUntil: z.string().min(1, "Expiry date is required"),
});

type CouponFormData = z.infer<typeof couponSchema>;

type Coupon = {
    id: string;
    code: string;
    description: string;
    discountType: string;
    discountValue: number;
    minOrderAmount: number | null;
    maxUsesTotal: number | null;
    usedCount: number;
    validFrom: string;
    validUntil: string;
    isActive: boolean;
};

export default function MarketingPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<CouponFormData>({
        resolver: zodResolver(couponSchema) as any,
        defaultValues: {
            discountType: "PERCENTAGE",
            validFrom: new Date().toISOString().split("T")[0],
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
        }
    });

    const discountType = watch("discountType");

    const fetchCoupons = async () => {
        setIsLoading(true);
        try {
            const res = await adminService.getCouponsApi();
            if (res.success) setCoupons(res.data);
        } catch {
            toast.error("Failed to fetch coupons");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleCreate = async (data: any) => {
        try {
            const res = await adminService.createCouponApi(data);
            if (res.success) {
                toast.success("Coupon created successfully");
                setIsDrawerOpen(false);
                reset();
                fetchCoupons();
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("An error occurred");
        }
    };

    const handleToggle = async (id: string) => {
        try {
            const res = await adminService.toggleCouponApi(id);
            if (res.success) {
                toast.success("Status updated");
                fetchCoupons();
            }
        } catch {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Marketing Hub"
                description="Create and manage discount codes, promotional campaigns, and customer rewards."
                actions={
                    <button
                        onClick={() => { reset(); setIsDrawerOpen(true); }}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)] hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" /> Create Coupon
                    </button>
                }
            />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                {["Coupon Code", "Discount", "Validity", "Usage", "Status", ""].map(h => (
                                    <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {isLoading ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Loading coupons...</td></tr>
                            ) : coupons.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No active promotions found.</td></tr>
                            ) : coupons.map(c => (
                                <tr key={c.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
                                                <Ticket className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tighter">{c.code}</p>
                                                <p className="font-plus-jakarta text-[10px] text-gray-400 italic">{c.description || "No description"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <TrendingDown className="h-3.5 w-3.5 text-emerald-600" />
                                            <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">
                                                {c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : `${c.discountValue.toLocaleString()} VND`}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                                            <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {new Date(c.validFrom).toLocaleDateString()}</div>
                                            <div className="flex items-center gap-1.5"><X className="h-3 w-3" /> {new Date(c.validUntil).toLocaleDateString()}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-plus-jakarta text-xs font-bold text-gray-900 dark:text-white">{c.usedCount} used</span>
                                            {c.maxUsesTotal && <span className="text-[10px] text-gray-400">Limit: {c.maxUsesTotal}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={c.isActive ? "active" : "inactive"} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggle(c.id)}
                                            className={`rounded-lg p-1.5 transition-colors ${c.isActive ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"
                                                }`}
                                        >
                                            {c.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Coupon Drawer */}
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Create Coupon"
                subtitle="Define a new promotional discount for your customers."
                footer={
                    <div className="flex gap-3">
                        <button onClick={() => setIsDrawerOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button
                            onClick={handleSubmit(handleCreate)}
                            disabled={isSubmitting}
                            className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700"
                        >
                            {isSubmitting ? "Generating..." : "Save Coupon"}
                        </button>
                    </div>
                }
            >
                <form onSubmit={handleSubmit(handleCreate)} className="flex flex-col gap-4">
                    <FormField label="Coupon Code" required>
                        <input className={inputCls} placeholder="e.g. SUMMER2026" {...register("code")} />
                        {errors.code && <p className="text-rose-500 text-xs mt-1">{errors.code.message}</p>}
                    </FormField>
                    <FormField label="Description">
                        <input className={inputCls} placeholder="Special summer collection discount" {...register("description")} />
                    </FormField>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Discount Type">
                            <select className={selectCls} {...register("discountType")}>
                                <option value="PERCENTAGE">Percentage (%)</option>
                                <option value="FIXED_AMOUNT">Fixed Amount (VND)</option>
                                <option value="FREE_SHIPPING">Free Shipping</option>
                            </select>
                        </FormField>
                        <FormField label={discountType === "PERCENTAGE" ? "Discount (%)" : "Discount (VND)"} required>
                            <input type="number" className={inputCls} placeholder={discountType === "PERCENTAGE" ? "10" : "500000"} {...register("discountValue")} />
                        </FormField>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Min Order Amount (VND)">
                            <input type="number" className={inputCls} {...register("minOrderAmount")} />
                        </FormField>
                        <FormField label="Max Total Uses">
                            <input type="number" className={inputCls} {...register("maxUsesTotal")} />
                        </FormField>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Valid From" required>
                            <input type="date" className={inputCls} {...register("validFrom")} />
                        </FormField>
                        <FormField label="Valid Until" required>
                            <input type="date" className={inputCls} {...register("validUntil")} />
                        </FormField>
                    </div>
                </form>
            </Drawer>
        </div>
    );
}
