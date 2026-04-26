"use client";

import { useState, useEffect } from "react";
import { Plus, UserCog, Mail, Phone, Calendar } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Drawer } from "../_components/ui/Drawer";
import { ConfirmDialog } from "../_components/ui/ConfirmDialog";
import { FormField, inputCls } from "../_components/ui/FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";

const vendorSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Valid email is required"),
    phoneNumber: z.string().min(10, "Valid phone number is required"),
});

type VendorFormData = z.infer<typeof vendorSchema>;

type Vendor = {
    userId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    status: number; // 0=Unverified, 1=Active, 2=Suspended, 3=Banned
    createdAt: string;
};

export default function VendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState<Vendor | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<VendorFormData>({
        resolver: zodResolver(vendorSchema),
        defaultValues: { fullName: "", email: "", phoneNumber: "" }
    });

    const fetchVendors = async () => {
        setIsLoading(true);
        try {
            const res = await adminService.vendors.getAll();
            if (res.success) setVendors(res.data);
        } catch {
            toast.error("Failed to load vendors");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleCreate = async (data: VendorFormData) => {
        try {
            const res = await adminService.vendors.create(data);
            if (res.success) {
                toast.success("Vendor created and invitation sent via email!");
                setIsDrawerOpen(false);
                reset();
                fetchVendors();
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("An error occurred during vendor creation");
        }
    };

    const handleToggleStatus = async () => {
        if (!selected) return;
        const newStatus = selected.status === 1 ? 2 : 1; // 1=Active, 2=Suspended
        try {
            const res = await adminService.vendors.updateStatus(selected.userId, newStatus);
            if (res.success) {
                toast.success(`Vendor status updated successfully`);
                setIsStatusConfirmOpen(false);
                fetchVendors();
            }
        } catch {
            toast.error("Failed to update status");
        }
    };

    const getStatusStr = (status: number) => {
        switch (status) {
            case 0: return "unverified";
            case 1: return "active";
            case 2: return "suspended";
            case 3: return "banned";
            default: return "inactive";
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader 
                title="Staff Management" 
                description="Manage your internal store staff and vendors. Invite new members via email invitation."
                actions={
                    <button 
                        onClick={() => { reset(); setIsDrawerOpen(true); }} 
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)] hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" /> Invite Staff
                    </button>
                }
            />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                {["Full Name", "Contact info", "Date Joined", "Status", ""].map(h => (
                                    <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {isLoading ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading vendors...</td></tr>
                            ) : vendors.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No staff members found.</td></tr>
                            ) : vendors.map(v => (
                                <tr key={v.userId} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
                                                <UserCog className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{v.fullName}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <Mail className="h-3 w-3" /> {v.email}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <Phone className="h-3 w-3" /> {v.phoneNumber}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        <div className="flex items-center gap-1.5 font-plus-jakarta text-xs">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "-"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={getStatusStr(v.status)} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end">
                                            <button 
                                                onClick={() => { setSelected(v); setIsStatusConfirmOpen(true); }}
                                                className={`rounded-lg px-3 py-1.5 font-plus-jakarta text-xs font-bold transition-colors ${
                                                    v.status === 1 
                                                        ? "bg-rose-50 text-rose-600 hover:bg-rose-100" 
                                                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                                }`}
                                            >
                                                {v.status === 1 ? "Suspend" : "Activate"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Staff Drawer */}
            <Drawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
                title="Invite New Staff" 
                subtitle="They will receive an invitation link to set their secure password."
                footer={
                    <div className="flex gap-3">
                        <button onClick={() => setIsDrawerOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300">Cancel</button>
                        <button 
                            onClick={handleSubmit(handleCreate)} 
                            disabled={isSubmitting}
                            className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-40"
                        >
                            {isSubmitting ? "Sending..." : "Send Invitation"}
                        </button>
                    </div>
                }
            >
                <form onSubmit={handleSubmit(handleCreate)} className="flex flex-col gap-5">
                    <FormField label="Full Name" required>
                        <input className={inputCls} placeholder="e.g. John Doe" {...register("fullName")} />
                        {errors.fullName && <p className="text-rose-500 text-xs mt-1">{errors.fullName.message}</p>}
                    </FormField>
                    <FormField label="Email Address" required>
                        <input className={inputCls} type="email" placeholder="staff@yashjewels.com" {...register("email")} />
                        {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>}
                    </FormField>
                    <FormField label="Phone Number" required>
                        <input className={inputCls} placeholder="+84 123 456 789" {...register("phoneNumber")} />
                        {errors.phoneNumber && <p className="text-rose-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
                    </FormField>
                </form>
            </Drawer>

            <ConfirmDialog 
                isOpen={isStatusConfirmOpen} 
                onClose={() => setIsStatusConfirmOpen(false)} 
                onConfirm={handleToggleStatus}
                title={selected?.status === 1 ? "Suspend Account" : "Activate Account"}
                description={`Are you sure you want to ${selected?.status === 1 ? "suspend" : "activate"} user "${selected?.fullName}"?`}
                confirmLabel={selected?.status === 1 ? "Suspend" : "Activate"}
                isDestructive={selected?.status === 1} 
            />
        </div>
    );
}
