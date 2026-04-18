"use client";

import { useState } from "react";
import { Plus, Eye, Truck, UserCheck, ShieldClose, Search, Filter } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Drawer } from "../_components/ui/Drawer";
import { ConfirmDialog } from "../_components/ui/ConfirmDialog";
import { FormField, inputCls, selectCls } from "../_components/ui/FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const shipperSchema = z.object({
    full_name: z.string().min(2, "Full name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    vehicle_type: z.enum(["BIKE", "CAR", "VAN"]),
    license_plate: z.string().min(4, "License plate is required"),
    area: z.string().min(2, "Operating area is required"),
});
type ShipperFormData = z.infer<typeof shipperSchema>;

type Shipper = {
    id: string;
    full_name: string;
    phone: string;
    vehicle_type: "BIKE" | "CAR" | "VAN";
    license_plate: string;
    kyc_status: "verified" | "pending" | "rejected";
    status: "active" | "inactive";
    orders_completed: number;
    rating: number;
    joined: string;
};

const mockShippers: Shipper[] = [
    { id: "S-001", full_name: "Henry Nguyen", phone: "0901234567", vehicle_type: "BIKE", license_plate: "59-X3 123.45", kyc_status: "verified", status: "active", orders_completed: 1450, rating: 4.9, joined: "2025-12-20" },
    { id: "S-002", full_name: "Arthur Tran", phone: "0912233445", vehicle_type: "CAR", license_plate: "51-A 888.88", kyc_status: "verified", status: "active", orders_completed: 820, rating: 4.8, joined: "2026-01-15" },
    { id: "S-003", full_name: "Nam Hoang", phone: "0988776655", vehicle_type: "VAN", license_plate: "60-B 999.01", kyc_status: "pending", status: "inactive", orders_completed: 0, rating: 0, joined: "2026-04-10" },
];

export default function ShippersMasterPage() {
    const [shippers, setShippers] = useState<Shipper[]>(mockShippers);
    const [selected, setSelected] = useState<Shipper | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isToggleStatusOpen, setIsToggleStatusOpen] = useState(false);
    const [search, setSearch] = useState("");

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ShipperFormData>({
        resolver: zodResolver(shipperSchema),
        defaultValues: { full_name: "", phone: "", vehicle_type: "BIKE", license_plate: "", area: "New York, US" }
    });

    const handleCreate = (data: any) => {
        const newShipper: Shipper = {
            ...data,
            id: `S-00${shippers.length + 1}`,
            kyc_status: "pending",
            status: "inactive",
            orders_completed: 0,
            rating: 0,
            joined: new Date().toISOString().split("T")[0]
        };
        setShippers([newShipper, ...shippers]);
        setIsDrawerOpen(false);
        reset();
    };

    const handleToggleStatus = () => {
        if (!selected) return;
        setShippers(shippers.map(s => s.id === selected.id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s));
        setIsToggleStatusOpen(false);
    };

    const filtered = shippers.filter(s => s.full_name.toLowerCase().includes(search.toLowerCase()) || s.phone.includes(search));

    return (
        <div className="flex flex-col gap-8">
            <PageHeader 
                title="Delivery Team Leaders" 
                description="Manage delivery leads and internal security units. Directly responsible for high-value jewelry logistics safety."
                actions={
                    <button onClick={() => { reset(); setIsDrawerOpen(true); }} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-sm hover:bg-blue-700">
                        <Plus className="h-4 w-4" /> Activate New Lead
                    </button>
                }
            />

            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or phone..."
                        className="w-full rounded-xl border border-gray-100 bg-white/50 py-2.5 pl-11 pr-4 font-plus-jakarta text-sm focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#111]/50"
                    />
                </div>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white/50 px-4 py-2.5 font-plus-jakarta text-sm font-bold text-gray-700 dark:border-gray-801 dark:bg-[#111]/50 dark:text-gray-300">
                    <Filter className="h-4 w-4" /> Fleet Filter
                </button>
            </div>

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-sm backdrop-blur-md dark:border-gray-800/50 dark:bg-[#0a0a0a]/70">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#111]/50">
                            <tr>
                                {["Delivery Lead", "Primary Vehicle", "Completed", "Rating", "KYC", "Status", ""].map(h => (
                                    <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {filtered.map(s => (
                                <tr key={s.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                                <UserCheck className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{s.full_name}</p>
                                                <p className="font-plus-jakarta text-xs text-gray-400">{s.phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 font-plus-jakarta">
                                            <Truck className="h-3.5 w-3.5 text-gray-400" />
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{s.vehicle_type}</span>
                                            <span className="text-[10px] text-gray-400">({s.license_plate})</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">
                                        {s.orders_completed} orders
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-amber-500">
                                        ⭐ {s.rating === 0 ? "N/A" : s.rating}
                                    </td>
                                    <td className="px-6 py-4"><StatusBadge status={s.kyc_status} /></td>
                                    <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => { setSelected(s); setIsDetailOpen(true); }} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800"><Eye className="h-4 w-4" /></button>
                                            <button onClick={() => { setSelected(s); setIsToggleStatusOpen(true); }} className={`rounded-xl px-3 py-1 font-plus-jakarta text-xs font-bold ${s.status === "active" ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>
                                                {s.status === "active" ? "Suspend" : "Activate"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Shipper Drawer */}
            <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="New Delivery Lead Profile" subtitle="Assign internal logistics management roles"
                footer={<>
                    <button onClick={() => setIsDrawerOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 dark:border-gray-800 dark:text-gray-300">Cancel</button>
                    <button onClick={handleSubmit(handleCreate)} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700">Confirm Profile</button>
                </>}>
                <div className="flex flex-col gap-4">
                    <FormField label="Lead Full Name" required>
                        <input className={inputCls} placeholder="John Doe" {...register("full_name")} />
                        {errors.full_name && <p className="text-rose-500 text-xs mt-1">{errors.full_name.message}</p>}
                    </FormField>
                    <FormField label="Contact Phone Number" required>
                        <input className={inputCls} placeholder="+1 234 567 890" {...register("phone")} />
                    </FormField>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Primary Vehicle Type">
                            <select className={selectCls} {...register("vehicle_type")}>
                                <option value="BIKE">Motorbike (Bike)</option>
                                <option value="CAR">Car (Escort)</option>
                                <option value="VAN">Van (Armored)</option>
                            </select>
                        </FormField>
                        <FormField label="License Plate" required>
                            <input className={inputCls} placeholder="ABC-1234" {...register("license_plate")} />
                        </FormField>
                    </div>
                    <FormField label="Responsible Area">
                        <input className={inputCls} placeholder="e.g. Manhattan, New York" {...register("area")} />
                    </FormField>
                </div>
            </Drawer>

            {/* Shipper Details Modal */}
            {selected && (
                <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 ${isDetailOpen ? "" : "hidden"}`}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDetailOpen(false)} />
                    <div className="relative w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-[#111]">
                        <h2 className="font-plus-jakarta text-lg font-bold text-gray-900 dark:text-white mb-4">{selected.full_name}</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Employee ID", value: selected.id },
                                { label: "Contact Phone", value: selected.phone },
                                { label: "Vehicle Type", value: selected.vehicle_type },
                                { label: "License Plate", value: selected.license_plate },
                                { label: "Total Deliveries", value: String(selected.orders_completed) },
                                { label: "Joined Date", value: selected.joined },
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

            <ConfirmDialog 
                isOpen={isToggleStatusOpen} 
                onClose={() => setIsToggleStatusOpen(false)} 
                onConfirm={handleToggleStatus}
                title={selected?.status === "active" ? "Suspend Delivery Lead" : "Activate Delivery Lead"}
                description={`Are you sure you want to ${selected?.status === "active" ? "remove delivery permissions" : "restore delivery permissions"} for "${selected?.full_name}"?`}
                confirmLabel={selected?.status === "active" ? "Confirm Suspension" : "Confirm Activation"}
                isDestructive={selected?.status === "active"} 
            />
        </div>
    );
}
