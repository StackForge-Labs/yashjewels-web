"use client";

import { useState, useEffect } from "react";
import { Plus, Bike, Truck, MapPin, CheckCircle, ShieldAlert } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Drawer } from "../_components/ui/Drawer";
import { ConfirmDialog } from "../_components/ui/ConfirmDialog";
import { FormField, inputCls, selectCls } from "../_components/ui/FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";

const shipperSchema = z.object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email is required"),
    phoneNumber: z.string().min(10, "Valid phone name is required"),
    vehicleType: z.string().min(1),
    licensePlate: z.string().min(4, "License plate is required"),
    operatingArea: z.string().min(2, "Operating area is required"),
});

type ShipperFormData = z.infer<typeof shipperSchema>;

type Shipper = {
    userId: string;
    shipperId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    status: number; // UserStatus
    vehicleType: string;
    licensePlate: string;
    operatingArea: string;
    rating: number;
    shipperStatus: string; // PENDING, ACTIVE, etc.
};

export default function ShippersPage() {
    const [shippers, setShippers] = useState<Shipper[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState<Shipper | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ShipperFormData>({
        resolver: zodResolver(shipperSchema),
        defaultValues: { fullName: "", email: "", phoneNumber: "", vehicleType: "BIKE", licensePlate: "", operatingArea: "" }
    });

    const fetchShippers = async () => {
        setIsLoading(true);
        try {
            const res = await adminService.shippers.getAll();
            if (res.success) setShippers(res.data);
        } catch (error) {
            toast.error("Failed to load shippers");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchShippers();
    }, []);

    const handleCreate = async (data: ShipperFormData) => {
        try {
            const res = await adminService.shippers.create(data);
            if (res.success) {
                toast.success("Shipper created and invitation sent!");
                setIsDrawerOpen(false);
                reset();
                fetchShippers();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const handleApprove = async () => {
        if (!selected) return;
        try {
            const res = await adminService.shippers.approve(selected.shipperId);
            if (res.success) {
                toast.success("Shipper approved and verified!");
                setIsApproveOpen(false);
                fetchShippers();
            }
        } catch (error) {
            toast.error("Failed to approve");
        }
    };

    const handleToggleStatus = async () => {
        if (!selected) return;
        const newStatus = selected.status === 1 ? 2 : 1;
        try {
            const res = await adminService.shippers.updateStatus(selected.userId, newStatus);
            if (res.success) {
                toast.success(`Account status updated`);
                setIsStatusConfirmOpen(false);
                fetchShippers();
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getStatusStr = (status: number) => {
        switch (status) {
            case 0: return "unverified";
            case 1: return "active";
            case 2: return "suspended";
            default: return "inactive";
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader 
                title="Shipper Fleet" 
                description="Manage your dedicated delivery team. Verify credentials and authorize shippers for high-value logistics."
                actions={
                    <button 
                        onClick={() => { reset(); setIsDrawerOpen(true); }} 
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)] hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" /> Add Shipper
                    </button>
                }
            />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                {["Shipper", "Vehicle & Plate", "Operating Area", "Rating", "KYC", "Status", ""].map(h => (
                                    <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {isLoading ? (
                                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">Loading fleet...</td></tr>
                            ) : shippers.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No shippers found.</td></tr>
                            ) : shippers.map(s => (
                                <tr key={s.userId} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
                                                {s.vehicleType === "TRUCK" || s.vehicleType === "VAN" ? <Truck className="h-4 w-4 text-blue-600" /> : <Bike className="h-4 w-4 text-blue-600" />}
                                            </div>
                                            <div>
                                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{s.fullName}</p>
                                                <p className="font-plus-jakarta text-[10px] text-gray-400">{s.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{s.vehicleType}</span>
                                            <span className="font-plus-jakarta text-xs text-blue-600">{s.licensePlate}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <MapPin className="h-3.5 w-3.5" /> {s.operatingArea}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-emerald-600">
                                        {s.rating > 0 ? `${s.rating} ★` : "New"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={s.shipperStatus.toLowerCase()} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={getStatusStr(s.status)} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 justify-end">
                                            {s.shipperStatus === "PENDING" && (
                                                <button 
                                                    onClick={() => { setSelected(s); setIsApproveOpen(true); }}
                                                    className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-emerald-700"
                                                >
                                                    <CheckCircle className="h-3 w-3" /> Approve
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => { setSelected(s); setIsStatusConfirmOpen(true); }}
                                                className={`rounded-lg p-1.5 transition-colors ${
                                                    s.status === 1 ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"
                                                }`}
                                            >
                                                <ShieldAlert className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Shipper Drawer */}
            <Drawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
                title="Register New Shipper" 
                subtitle="Add a new member to your delivery fleet."
                footer={
                    <div className="flex gap-3">
                        <button onClick={() => setIsDrawerOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button 
                            onClick={handleSubmit(handleCreate)} 
                            disabled={isSubmitting}
                            className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-40"
                        >
                            {isSubmitting ? "Processing..." : "Add Shipper"}
                        </button>
                    </div>
                }
            >
                <form onSubmit={handleSubmit(handleCreate)} className="flex flex-col gap-4">
                    <FormField label="Full Name" required>
                        <input className={inputCls} placeholder="e.g. Michael Scofield" {...register("fullName")} />
                    </FormField>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Email" required>
                            <input className={inputCls} type="email" placeholder="mike@shipper.com" {...register("email")} />
                        </FormField>
                        <FormField label="Phone" required>
                            <input className={inputCls} placeholder="+84 ..." {...register("phoneNumber")} />
                        </FormField>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Vehicle Type">
                            <select className={selectCls} {...register("vehicleType")}>
                                <option value="BIKE">Motorbike (Bike)</option>
                                <option value="VAN">Delivery Van</option>
                                <option value="TRUCK">Armored Truck</option>
                            </select>
                        </FormField>
                        <FormField label="License Plate" required>
                            <input className={inputCls} placeholder="60-B1 12345" {...register("licensePlate")} />
                        </FormField>
                    </div>
                    <FormField label="Operating Area" required>
                        <input className={inputCls} placeholder="e.g. Dist 1, HCMC" {...register("operatingArea")} />
                    </FormField>
                </form>
            </Drawer>

            <ConfirmDialog 
                isOpen={isApproveOpen} 
                onClose={() => setIsApproveOpen(false)} 
                onConfirm={handleApprove}
                title="Approve Shipper"
                description={`Authorize "${selected?.fullName}" to begin processing high-value deliveries?`}
                confirmLabel="Authorize"
            />

            <ConfirmDialog 
                isOpen={isStatusConfirmOpen} 
                onClose={() => setIsStatusConfirmOpen(false)} 
                onConfirm={handleToggleStatus}
                title={selected?.status === 1 ? "Suspend" : "Activate"}
                description={`Change account status for "${selected?.fullName}"?`}
                confirmLabel={selected?.status === 1 ? "Suspend" : "Activate"}
                isDestructive={selected?.status === 1} 
            />
        </div>
    );
}
