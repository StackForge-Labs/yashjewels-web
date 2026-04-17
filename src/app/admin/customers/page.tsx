"use client";

import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, Mail, MapPin, ShieldCheck, ShieldAlert, RefreshCw } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Drawer } from "../_components/ui/Drawer";
import { ConfirmDialog } from "../_components/ui/ConfirmDialog";
import { getCustomersApi, getCustomerDetailApi, updateUserStatusApi } from "@/services/admin.service";
import toast from "react-hot-toast";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<any | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

    const loadCustomers = async () => {
        setLoading(true);
        try {
            const res = await getCustomersApi(page, 20);
            if (res.success) setCustomers(res.data);
        } catch (error) {
            toast.error("Failed to load customers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, [page]);

    const handleViewProfile = async (id: string) => {
        setIsProfileOpen(true);
        try {
            const res = await getCustomerDetailApi(id);
            if (res.success) setSelected(res.data);
        } catch (error) {
            toast.error("Failed to load customer profile");
        }
    };

    const filtered = customers.filter(c =>
        c.fullName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    const toggleStatus = async () => {
        if (!selected) return;
        const newStatus = selected.isActive ? 2 : 1; // 1: ACTIVE, 2: INACTIVE
        try {
            const res = await updateUserStatusApi(selected.id, newStatus);
            if (res.success) {
                toast.success(res.message || "Status updated successfully");
                loadCustomers();
            } else {
                toast.error(res.message || "Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred while updating status");
        } finally {
            setIsDeactivateOpen(false);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Customer Directory" description="Manage client profiles, KYC status, and purchase history."
                badge={{ count: customers.filter(c => c.kycStatus === "Pending").length, label: "KYC pending", color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" }} />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="border-b border-gray-100 p-6 dark:border-gray-800/50">
                    <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
                        className="max-w-sm w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 font-plus-jakarta text-sm font-medium placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a]/50 dark:text-gray-100 dark:placeholder:text-gray-500" />
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 text-center font-plus-jakarta text-gray-500 animate-pulse">Retrieving directory...</div>
                    ) : (
                        <table className="w-full whitespace-nowrap text-left text-sm">
                            <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                                <tr>{["Client", "Security", "KYC", "Joined", "Spent", "Actions"].map(h => <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>)}</tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                                {filtered.length > 0 ? filtered.map(c => (
                                    <tr key={c.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-plus-jakarta text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{c.fullName.charAt(0)}</div>
                                                <div>
                                                    <p className="font-plus-jakarta text-sm font-bold text-gray-900 group-hover:text-blue-600 dark:text-white">{c.fullName}</p>
                                                    <div className="flex items-center gap-1"><Mail className="h-3 w-3 text-gray-400" /><span className="font-plus-jakarta text-xs text-gray-500">{c.email}</span></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <StatusBadge status={c.isEmailVerified ? "active" : "inactive"} label={c.isEmailVerified ? "Verified" : "Unverified"} />
                                                {c.hasTwoFactorEnabled ? (
                                                    <span className="inline-flex items-center gap-1 font-plus-jakarta text-[10px] font-bold uppercase text-emerald-600"><ShieldCheck className="h-3 w-3" /> 2FA On</span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 font-plus-jakarta text-[10px] font-bold uppercase text-amber-500"><ShieldAlert className="h-3 w-3" /> No 2FA</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><StatusBadge status={c.kycStatus.toLowerCase()} label={c.kycStatus} /></td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{c.lifetimeValue?.toLocaleString() ?? 0} VND</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleViewProfile(c.id)} className="rounded-lg bg-gray-100 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-300">Profile</button>
                                                <button onClick={() => { setSelected(c); setIsDeactivateOpen(true); }} className={`rounded-lg px-3 py-1.5 font-plus-jakarta text-xs font-bold transition-colors ${c.isActive ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}>
                                                    {c.isActive ? "Deactivate" : "Activate"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center font-plus-jakarta text-sm text-gray-400">No customers found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Profile Drawer */}
            <Drawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} title={selected?.fullName ?? "Loading..."} subtitle={selected?.email}
                footer={<button onClick={() => setIsProfileOpen(false)} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700">Close</button>}>
                {selected && (
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "UID", value: selected.id.substring(0, 8) },
                                { label: "Joined", value: new Date(selected.createdAt).toLocaleDateString() },
                                { label: "Last Login", value: selected.lastLoginAt ? new Date(selected.lastLoginAt).toLocaleString() : "Never" },
                                { label: "Birthday", value: selected.dateOfBirth ? new Date(selected.dateOfBirth).toLocaleDateString() : "N/A" },
                            ].map(({ label, value }) => (
                                <div key={label} className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                                    <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                                    <p className="mt-1 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white capitalize">{value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-2xl bg-gray-50/50 p-4 dark:bg-gray-800/20">
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Shopping Vitality</p>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: "LTV", value: `${selected.lifetimeValue?.toLocaleString() ?? 0} VND` },
                                    { label: "Orders", value: selected.orderCount },
                                    { label: "Items", value: selected.totalItemsPurchased },
                                ].map(({ label, value }) => (
                                    <div key={label} className="text-center">
                                        <p className="font-plus-jakarta text-lg font-black text-gray-900 dark:text-white">{value}</p>
                                        <p className="text-[9px] font-bold uppercase text-gray-400">{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <StatusBadge status={selected.isEmailVerified ? "active" : "inactive"} label={selected.isEmailVerified ? "Email Verified" : "Email Unverified"} />
                            <StatusBadge status={selected.kycStatus.toLowerCase()} label={`KYC ${selected.kycStatus}`} />
                            {selected.kycScore > 0 && (
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${selected.kycScore > 0.8 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                                    Score: {(selected.kycScore * 100).toFixed(0)}%
                                </span>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">Recent Activity</p>
                                <span className="text-[10px] font-bold text-blue-600">Last: {selected.lastOrderAt ? new Date(selected.lastOrderAt).toLocaleDateString() : "None"}</span>
                            </div>
                            {(!selected.recentOrders || selected.recentOrders.length === 0) ? (
                                <p className="font-plus-jakarta text-xs text-gray-400">No recent orders.</p>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {selected.recentOrders.map((order: any) => (
                                        <div key={order.orderNumber} className="flex items-center justify-between rounded-xl border border-gray-100 p-3 dark:border-gray-800 hover:bg-gray-50/50 transition-colors">
                                            <div>
                                                <p className="font-plus-jakarta text-xs font-bold text-gray-900 dark:text-white">{order.orderNumber}</p>
                                                <p className="text-[10px] text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-plus-jakarta text-xs font-bold text-gray-900 dark:text-white">{order.totalAmount.toLocaleString()} VND</p>
                                                <span className="text-[9px] font-bold uppercase text-gray-400">{order.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Stored Addresses</p>
                            {!selected.addresses || selected.addresses.length === 0 ? (
                                <p className="font-plus-jakarta text-xs text-gray-400">No addresses saved.</p>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {selected.addresses.map((addr: any, i: number) => (
                                        <div key={i} className="flex items-start gap-3 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                                            <MapPin className="h-4 w-4 shrink-0 text-gray-400 mt-0.5" />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-wider text-gray-500">{addr.label}</p>
                                                    {addr.isDefault && <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[8px] font-bold text-blue-600 uppercase">Default</span>}
                                                </div>
                                                <p className="mt-1 font-plus-jakarta text-xs font-medium text-gray-700 dark:text-gray-300">
                                                    {addr.addressLine1}, {addr.ward || addr.district}, {addr.province || addr.city}
                                                </p>
                                                <p className="text-[10px] text-gray-400 mt-1">{addr.recipientName} • {addr.recipientPhone}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Drawer>

            <ConfirmDialog isOpen={isDeactivateOpen} onClose={() => setIsDeactivateOpen(false)} onConfirm={toggleStatus}
                title={selected?.isActive ? "Deactivate Customer" : "Activate Customer"}
                description={`Are you sure you want to ${selected?.isActive ? "deactivate" : "activate"} ${selected?.fullName}'s account?`}
                confirmLabel={selected?.isActive ? "Deactivate" : "Activate"}
                isDestructive={selected?.isActive} />
        </div>
    );
}
