/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { Mail, MapPin, ShieldCheck, ShieldAlert, Clock, CheckCircle2, UserX, HelpCircle, Search, Filter, Eye, RotateCcw, ChevronLeft, ChevronRight, Calendar, Plus, Pencil, Trash2, X } from "lucide-react";
import { vendorService } from "@/services/vendor.service";
import { StatusBadge } from "../../admin/_components/ui/StatusBadge";
import { Drawer } from "../../admin/_components/ui/Drawer";
import toast from "react-hot-toast";

// ── Types ──────────────────────────────────────────────────────
interface CustomerAddress {
    label: string;
    isDefault: boolean;
    addressLine1: string;
    ward?: string;
    district?: string;
    province?: string;
    city?: string;
    recipientName: string;
    recipientPhone: string;
}
interface CustomerOrder {
    orderNumber: string;
    createdAt: string;
    totalAmount: number;
    status: string;
}
interface Customer {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    isEmailVerified: boolean;
    hasTwoFactorEnabled: boolean;
    kycStatus: string;
    createdAt: string;
    lifetimeValue: number;
    isActive: boolean;
    userStatus: string;
    suspendedUntil?: string;
    lastLoginAt?: string;
    dateOfBirth?: string;
    orderCount?: number;
    totalItemsPurchased?: number;
    kycScore?: number;
    lastOrderAt?: string;
    recentOrders?: CustomerOrder[];
    addresses?: CustomerAddress[];
}

// ── Helpers ────────────────────────────────────────────────────
function getStatusConfig(userStatus: any, suspendedUntil?: string) {
    const s = String(userStatus || "").toUpperCase();
    switch (s) {
        case "1":
        case "ACTIVE":
            return { 
                label: "Active", 
                icon: <CheckCircle2 className="h-3 w-3" />,
                classes: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
            };
        case "2":
        case "SUSPENDED": {
            const until = suspendedUntil ? ` • ${new Date(suspendedUntil).toLocaleDateString()}` : "";
            return { 
                label: `Suspended${until}`, 
                icon: <Clock className="h-3 w-3" />,
                classes: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" 
            };
        }
        case "3":
        case "BANNED":
            return { 
                label: "Banned", 
                icon: <BanIcon className="h-3 w-3" />,
                classes: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" 
            };
        case "0":
        case "UNVERIFIED":
            return { 
                label: "Unverified", 
                icon: <UserX className="h-3 w-3" />,
                classes: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" 
            };
        default:
            return { 
                label: s || "Unknown", 
                icon: <HelpCircle className="h-3 w-3" />,
                classes: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" 
            };
    }
}

function BanIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
    );
}

function UserStatusBadge({ userStatus, suspendedUntil }: { userStatus: string | any; suspendedUntil?: string }) {
    const cfg = getStatusConfig(userStatus, suspendedUntil);
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-plus-jakarta text-[10px] font-bold uppercase tracking-wide ${cfg.classes}`}>
            {cfg.icon}
            {cfg.label}
        </span>
    );
}

export default function VendorCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("");
    const [filterKyc, setFilterKyc] = useState<string>("");
    const [joinedFrom, setJoinedFrom] = useState<string>("");
    const [joinedTo, setJoinedTo] = useState<string>("");

    const [selected, setSelected] = useState<Customer | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // CRUD States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        phone: "",
        dateOfBirth: ""
    });

    const load = useCallback(async () => {
        setLoading(true);
        try {
            // Note: Vendor uses its own management API (Fixed 403)
            const res = await vendorService.getCustomers(page, 20, search || undefined);
            if (res.success) setCustomers(res.data);
        } catch {
            toast.error("Failed to load customer list");
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        const timer = setTimeout(() => load(), 300);
        return () => clearTimeout(timer);
    }, [load]);

    const handleResetFilters = () => {
        setSearch("");
        setFilterStatus("");
        setFilterKyc("");
        setJoinedFrom("");
        setJoinedTo("");
        setPage(1);
    };

    const handleViewProfile = async (id: string) => {
        setIsProfileOpen(true);
        try {
            const res = await vendorService.getCustomers(1, 1, id); 
            if (res.success && res.data.length > 0) setSelected(res.data[0]);
        } catch {
            toast.error("Failed to load profile details");
        }
    };

    const handleOpenCreate = () => {
        setModalMode("create");
        setFormData({ email: "", fullName: "", phone: "", dateOfBirth: "" });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (c: Customer) => {
        setModalMode("edit");
        setSelected(c);
        setFormData({
            email: c.email,
            fullName: c.fullName,
            phone: c.phoneNumber || "",
            dateOfBirth: c.dateOfBirth ? c.dateOfBirth.split("T")[0] : ""
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            let res;
            if (modalMode === "create") {
                res = await vendorService.createCustomer(formData);
            } else {
                res = await vendorService.updateCustomer(selected!.id, {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    dateOfBirth: formData.dateOfBirth
                });
            }

            if (res.success) {
                toast.success(modalMode === "create" ? "Customer created successfully!" : "Customer updated successfully!");
                setIsModalOpen(false);
                load();
            } else {
                toast.error(res.message || "Failed to save customer");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "An error occurred");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this customer? This action cannot be undone.")) return;
        
        try {
            const res = await vendorService.deleteCustomer(id);
            if (res.success) {
                toast.success("Customer deleted successfully");
                load();
            } else {
                toast.error(res.message || "Failed to delete customer");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Cannot delete customer with order history");
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-gradient-amber">
                        Customer CRM
                    </h1>
                    <p className="font-plus-jakarta text-sm text-gray-500 dark:text-gray-400">
                        Manage your client database and purchase history.
                    </p>
                </div>
                <button 
                    onClick={handleOpenCreate}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 font-plus-jakarta text-sm font-bold text-white hover:bg-black dark:bg-amber-600 dark:hover:bg-amber-500 transition-all shadow-lg shadow-gray-200 dark:shadow-none"
                >
                    <Plus className="h-4 w-4" /> Add Customer
                </button>
            </div>

            {/* Toolbar - Synced with Admin but simpler */}
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70 md:flex-row md:items-center">
                <div className="relative flex flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 transition-all focus-within:border-amber-500 focus-within:bg-white dark:border-gray-800 dark:bg-[#1a1a1a]/50">
                    <Search className="h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full bg-transparent font-plus-jakarta text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100"
                    />
                </div>

                <div className="flex items-center gap-2">
                     <select value={filterKyc} onChange={e => { setFilterKyc(e.target.value); setPage(1); }}
                        className="rounded-xl border border-gray-200 bg-white px-3 py-2 font-plus-jakarta text-xs font-bold text-gray-600 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300">
                        <option value="">All KYC</option>
                        <option value="PENDING">Pending</option>
                        <option value="VERIFIED">Verified</option>
                    </select>

                    <button onClick={handleResetFilters}
                        className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-gray-400 hover:text-amber-600 transition-colors">
                        <RotateCcw className="h-3.5 w-3.5" /> Reset
                    </button>
                </div>
            </div>

            {/* Table - Fully Synced UI with Admin */}
            <div className="rounded-2xl border border-gray-100 bg-white/70 shadow-sm backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                {["Client", "Security", "KYC", "Account Status", "Spent", "Actions"].map(h => (
                                    <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-4"><div className="h-12 bg-gray-50 dark:bg-white/5 rounded-xl" /></td>
                                    </tr>
                                ))
                            ) : customers.length > 0 ? (
                                customers.map(c => (
                                    <tr key={c.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 font-plus-jakarta text-sm font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                    {c.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-plus-jakarta text-sm font-bold text-gray-900 group-hover:text-amber-600 dark:text-white transition-colors">{c.fullName}</p>
                                                    <div className="flex items-center gap-1"><Mail className="h-3 w-3 text-gray-400" /><span className="font-plus-jakarta text-xs text-gray-500">{c.email}</span></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <StatusBadge status={c.isEmailVerified ? "active" : "inactive"} label={c.isEmailVerified ? "Verified" : "Unverified"} />
                                                {c.hasTwoFactorEnabled
                                                    ? <span className="inline-flex items-center gap-1 font-plus-jakarta text-[10px] font-bold uppercase text-emerald-600"><ShieldCheck className="h-3 w-3" /> 2FA On</span>
                                                    : <span className="inline-flex items-center gap-1 font-plus-jakarta text-[10px] font-bold uppercase text-amber-500"><ShieldAlert className="h-3 w-3" /> No 2FA</span>
                                                }
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><StatusBadge status={c.kycStatus.toLowerCase()} label={c.kycStatus} /></td>
                                        <td className="px-6 py-4">
                                            <UserStatusBadge userStatus={c.userStatus} suspendedUntil={c.suspendedUntil} />
                                        </td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">
                                            {c.lifetimeValue?.toLocaleString() ?? 0} VND
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => handleViewProfile(c.id)}
                                                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 transition-all"
                                                    title="View Profile"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleOpenEdit(c)}
                                                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 transition-all"
                                                    title="Edit Customer"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(c.id)}
                                                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 transition-all"
                                                    title="Delete Customer"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center font-plus-jakarta text-sm text-gray-400">
                                        No customers found in your directory.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 dark:border-gray-800/50">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-xs font-bold text-gray-600 disabled:opacity-40 dark:border-gray-800 dark:text-gray-400">
                        <ChevronLeft className="mr-1 h-3.5 w-3.5 inline" /> Previous
                    </button>
                    <span className="font-plus-jakarta text-xs font-bold text-gray-400">Page {page}</span>
                    <button onClick={() => setPage(p => p + 1)} disabled={customers.length < 20}
                        className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-xs font-bold text-gray-600 disabled:opacity-40 dark:border-gray-800 dark:text-gray-400">
                        Next <ChevronRight className="ml-1 h-3.5 w-3.5 inline" />
                    </button>
                </div>
            </div>

            {/* Profile Drawer - Reused from Admin */}
            <Drawer 
                isOpen={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)}
                title={selected?.fullName ?? "Customer Profile"} 
                subtitle={selected?.email}
                footer={
                    <button 
                        onClick={() => setIsProfileOpen(false)} 
                        className="w-full rounded-xl bg-gray-900 py-3 font-plus-jakarta text-sm font-bold text-white hover:bg-black dark:bg-amber-600 dark:hover:bg-amber-500 transition-all"
                    >
                        Close Profile
                    </button>
                }
            >
                {selected && (
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "UID", value: selected.id.substring(0, 8) },
                                { label: "Joined", value: new Date(selected.createdAt).toLocaleDateString() },
                                { label: "Last Login", value: selected.lastLoginAt ? new Date(selected.lastLoginAt).toLocaleString() : "Never" },
                                { label: "Birthday", value: selected.dateOfBirth ? new Date(selected.dateOfBirth).toLocaleDateString() : "N/A" },
                            ].map(({ label, value }) => (
                                <div key={label} className="rounded-xl border border-gray-100 p-3 dark:border-gray-800 bg-gray-50/50 dark:bg-white/2">
                                    <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                                    <p className="mt-1 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white capitalize">{value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-2xl bg-amber-50/50 p-4 dark:bg-amber-900/10 border border-amber-100/50 dark:border-amber-900/20">
                            <p className="mb-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-amber-600/60">Purchase Statistics</p>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: "Revenue", value: `${selected.lifetimeValue?.toLocaleString() ?? 0} ₫` }, 
                                    { label: "Orders", value: selected.orderCount ?? 0 }, 
                                    { label: "Items", value: selected.totalItemsPurchased ?? 0 }
                                ].map(({ label, value }) => (
                                    <div key={label} className="text-center">
                                        <p className="font-plus-jakarta text-lg font-black text-gray-900 dark:text-white">{value}</p>
                                        <p className="text-[9px] font-bold uppercase text-gray-400">{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">Stored Addresses</p>
                            {!selected.addresses?.length ? (
                                <p className="font-plus-jakarta text-xs text-gray-400 bg-gray-50 dark:bg-white/2 p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">No addresses saved.</p>
                            ) : selected.addresses.map((addr, i) => (
                                <div key={i} className="flex items-start gap-3 rounded-xl border border-gray-100 p-4 dark:border-gray-800 bg-white/50 dark:bg-black/20">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-wider text-gray-500">{addr.label}</p>
                                            {addr.isDefault && <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[8px] font-bold text-amber-700 uppercase">Default</span>}
                                        </div>
                                        <p className="mt-1 font-plus-jakarta text-xs font-medium text-gray-700 dark:text-gray-300">{addr.addressLine1}, {addr.ward || addr.district}, {addr.province || addr.city}</p>
                                        <p className="mt-1 text-[10px] text-gray-400">{addr.recipientName} • {addr.recipientPhone}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Drawer>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !formLoading && setIsModalOpen(false)} />
                    <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-200 rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl dark:border-gray-800 dark:bg-[#111]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="font-plus-jakarta text-xl font-bold text-gray-900 dark:text-white">
                                    {modalMode === "create" ? "Add New Customer" : "Edit Customer Info"}
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    {modalMode === "create" ? "Fill in details to create a new client account." : "Update profile details for this client."}
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    disabled={modalMode === "edit"}
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 font-plus-jakarta text-sm focus:border-amber-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a]/50 disabled:opacity-50"
                                    placeholder="customer@example.com"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 font-plus-jakarta text-sm focus:border-amber-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a]/50"
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 font-plus-jakarta text-sm focus:border-amber-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a]/50"
                                        placeholder="09xxx..."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 font-plus-jakarta text-sm focus:border-amber-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a]/50"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={formLoading}
                                    className="flex-1 rounded-2xl border border-gray-200 py-3.5 font-plus-jakarta text-sm font-bold text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-[2] rounded-2xl bg-gray-900 py-3.5 font-plus-jakarta text-sm font-bold text-white hover:bg-black dark:bg-amber-600 dark:hover:bg-amber-500 transition-all disabled:opacity-50"
                                >
                                    {formLoading ? "Processing..." : modalMode === "create" ? "Create Account" : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
