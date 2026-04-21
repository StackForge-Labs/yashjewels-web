/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Edit3, Mail, MapPin, ShieldCheck, ShieldAlert, Download, Upload, Clock, Ban, Trash2 } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Drawer } from "../_components/ui/Drawer";
import { ConfirmDialog } from "../_components/ui/ConfirmDialog";
import { Modal } from "../_components/ui/Modal";
import { SearchFilterBar } from "../_components/ui/SearchFilterBar";
import { FormField, inputCls, selectCls, textareaCls } from "../_components/ui/FormField";
import {
    getCustomersApi,
    getCustomerDetailApi,
    createCustomerApi,
    updateCustomerApi,
    banCustomerApi,
    exportCustomersApi,
    importCustomersApi,
    deleteCustomerApi,
} from "@/services/admin.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
    lastLoginAt?: string;
    dateOfBirth?: string;
    orderCount?: number;
    totalItemsPurchased?: number;
    kycScore?: number;
    lastOrderAt?: string;
    recentOrders?: CustomerOrder[];
    addresses?: CustomerAddress[];
}

// ── Zod schemas ────────────────────────────────────────────────
const createSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    fullName: z.string().min(2, "Full name is required"),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(),
});
type CreateForm = z.infer<typeof createSchema>;

const editSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(),
});
type EditForm = z.infer<typeof editSchema>;

const banSchema = z.object({
    banType: z.enum(["2", "3"]), // 2=SUSPENDED, 3=BANNED
    durationValue: z.number().min(1).optional(),
    durationUnit: z.enum(["hours", "days"]).optional(),
    reason: z.string().min(10, "Reason must be at least 10 characters"),
}).refine(
    (d) => d.banType !== "2" || (d.durationValue !== undefined && d.durationValue > 0),
    { message: "Duration is required for suspension", path: ["durationValue"] }
);
type BanForm = z.infer<typeof banSchema>;

// ── Page ───────────────────────────────────────────────────────
export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("");
    const [filterKyc, setFilterKyc] = useState<string>("");

    const [selected, setSelected] = useState<Customer | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isBanOpen, setIsBanOpen] = useState(false);
    const [isActivateOpen, setIsActivateOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [importErrors, setImportErrors] = useState<string[]>([]);

    const importRef = useRef<HTMLInputElement>(null);

    const createForm = useForm<CreateForm>({ resolver: zodResolver(createSchema) });
    const editForm = useForm<EditForm>({ resolver: zodResolver(editSchema) });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const banForm = useForm<BanForm>({ resolver: zodResolver(banSchema) as any, defaultValues: { banType: "2", durationValue: 7, durationUnit: "days" } });
    const watchBanType = banForm.watch("banType");

    // ── Load ────────────────────────────────────────────────────
    const load = async () => {
        setLoading(true);
        try {
            const statusNum = filterStatus ? parseInt(filterStatus) : undefined;
            const res = await getCustomersApi(page, 20, search || undefined, statusNum, filterKyc || undefined);
            if (res.success) setCustomers(res.data);
        } catch {
            toast.error("Failed to load customers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [page, search, filterStatus, filterKyc]);

    // ── Profile ─────────────────────────────────────────────────
    const handleViewProfile = async (id: string) => {
        setIsProfileOpen(true);
        try {
            const res = await getCustomerDetailApi(id);
            if (res.success) setSelected(res.data);
        } catch {
            toast.error("Failed to load customer profile");
        }
    };

    // ── Create ──────────────────────────────────────────────────
    const handleCreate = async (data: CreateForm) => {
        try {
            const res = await createCustomerApi(data);
            if (res.success) {
                toast.success("Customer created. Magic link sent to email.");
                setIsCreateOpen(false);
                createForm.reset();
                load();
            } else {
                toast.error(res.errors?.[0] ?? "Failed to create customer");
            }
        } catch {
            toast.error("An error occurred");
        }
    };

    // ── Edit ────────────────────────────────────────────────────
    const openEdit = (c: Customer) => {
        setSelected(c);
        editForm.reset({
            fullName: c.fullName,
            phone: c.phoneNumber ?? "",
            dateOfBirth: c.dateOfBirth ? c.dateOfBirth.split("T")[0] : "",
        });
        setIsEditOpen(true);
    };

    const handleEdit = async (data: EditForm) => {
        if (!selected) return;
        try {
            const res = await updateCustomerApi(selected.id, data);
            if (res.success) {
                toast.success("Customer updated.");
                setIsEditOpen(false);
                load();
            } else {
                toast.error(res.errors?.[0] ?? "Failed to update");
            }
        } catch {
            toast.error("An error occurred");
        }
    };

    // ── Ban / Activate ──────────────────────────────────────────
    const openBan = (c: Customer) => {
        setSelected(c);
        banForm.reset({ banType: "2", durationValue: 7, durationUnit: "days", reason: "" });
        setIsBanOpen(true);
    };

    const handleBan = async (data: BanForm) => {
        if (!selected) return;
        const totalHours = data.banType === "2" && data.durationValue
            ? (data.durationUnit === "days" ? data.durationValue * 24 : data.durationValue)
            : undefined;
        try {
            const res = await banCustomerApi(selected.id, {
                status: parseInt(data.banType),
                reason: data.reason,
                suspendDurationHours: totalHours,
            });
            if (res.success) {
                toast.success("Account restricted successfully.");
                setIsBanOpen(false);
                load();
            } else {
                toast.error(res.errors?.[0] ?? "Failed to restrict account");
            }
        } catch {
            toast.error("An error occurred");
        }
    };

    const handleActivate = async () => {
        if (!selected) return;
        try {
            const res = await banCustomerApi(selected.id, { status: 1 });
            if (res.success) {
                toast.success("Account activated.");
                load();
            } else {
                toast.error(res.errors?.[0] ?? "Failed to activate");
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setIsActivateOpen(false);
        }
    };

    const handleDelete = async () => {
        if (!selected) return;
        try {
            const res = await deleteCustomerApi(selected.id);
            if (res.success) {
                toast.success("Customer deleted.");
                setIsDeleteOpen(false);
                load();
            } else {
                toast.error(res.errors?.[0] ?? "Failed to delete");
            }
        } catch {
            toast.error("An error occurred");
        }
    };

    // ── Export ──────────────────────────────────────────────────
    const handleExport = async () => {
        try {
            const statusNum = filterStatus ? parseInt(filterStatus) : undefined;
            const blob = await exportCustomersApi(search || undefined, statusNum, filterKyc || undefined);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `customers-${new Date().toISOString().slice(0, 10)}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            toast.error("Export failed");
        }
    };

    // ── Import ──────────────────────────────────────────────────
    const handleImportFile = async (file: File) => {
        try {
            const res = await importCustomersApi(file);
            if (res.success) {
                toast.success(res.message || `Imported ${res.data?.imported} customers.`);
                if (res.data?.errors?.length) {
                    setImportErrors(res.data.errors);
                    setIsImportOpen(true);
                }
                load();
            } else {
                toast.error(res.errors?.[0] ?? "Import failed");
            }
        } catch {
            toast.error("Import failed");
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Customer Directory"
                description="Manage client profiles, KYC status, and purchase history."
                badge={{ count: customers.filter(c => c.kycStatus === "Pending").length, label: "KYC pending", color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" }}
            />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                {/* Toolbar */}
                <SearchFilterBar
                    placeholder="Search by name, email or phone..."
                    value={search}
                    onChange={(v) => { setSearch(v); setPage(1); }}
                    extra={
                        <div className="flex items-center gap-2">
                            {/* Status filter */}
                            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
                                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 font-plus-jakarta text-sm font-bold text-gray-600 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300">
                                <option value="">All Status</option>
                                <option value="1">Active</option>
                                <option value="2">Suspended</option>
                                <option value="3">Banned</option>
                                <option value="0">Unverified</option>
                            </select>
                            {/* KYC filter */}
                            <select value={filterKyc} onChange={e => { setFilterKyc(e.target.value); setPage(1); }}
                                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 font-plus-jakarta text-sm font-bold text-gray-600 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300">
                                <option value="">All KYC</option>
                                <option value="NONE">None</option>
                                <option value="PENDING">Pending</option>
                                <option value="VERIFIED">Verified</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                            {/* Import */}
                            <input ref={importRef} type="file" accept=".xlsx" className="hidden"
                                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImportFile(f); e.target.value = ""; }} />
                            <button onClick={() => importRef.current?.click()}
                                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 font-plus-jakarta text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300">
                                <Upload className="h-4 w-4" /> Import
                            </button>
                            {/* Export */}
                            <button onClick={handleExport}
                                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 font-plus-jakarta text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300">
                                <Download className="h-4 w-4" /> Export
                            </button>
                            {/* New Customer */}
                            <button onClick={() => setIsCreateOpen(true)}
                                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700 transition-colors">
                                <Plus className="h-4 w-4" /> New Customer
                            </button>
                        </div>
                    }
                />

                {/* Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 text-center font-plus-jakarta text-gray-500 animate-pulse">Retrieving directory...</div>
                    ) : (
                        <table className="w-full whitespace-nowrap text-left text-sm">
                            <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                                <tr>{["Client", "Security", "KYC", "Joined", "Spent", "Actions"].map(h => (
                                    <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}</tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                                {customers.length > 0 ? customers.map(c => (
                                    <tr key={c.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-plus-jakarta text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                    {c.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-plus-jakarta text-sm font-bold text-gray-900 group-hover:text-blue-600 dark:text-white">{c.fullName}</p>
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
                                        <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{c.lifetimeValue?.toLocaleString() ?? 0} VND</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <button onClick={() => handleViewProfile(c.id)}
                                                    className="rounded-lg bg-gray-100 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-300">
                                                    Profile
                                                </button>
                                                <button onClick={() => openEdit(c)}
                                                    className="rounded-lg bg-gray-100 p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400">
                                                    <Edit3 className="h-3.5 w-3.5" />
                                                </button>
                                                {c.isActive ? (
                                                    <button onClick={() => { setSelected(c); openBan(c); }}
                                                        className="rounded-lg bg-rose-50 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-rose-600 hover:bg-rose-100">
                                                        Restrict
                                                    </button>
                                                ) : (
                                                    <button onClick={() => { setSelected(c); setIsActivateOpen(true); }}
                                                        className="rounded-lg bg-emerald-50 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-emerald-600 hover:bg-emerald-100">
                                                        Activate
                                                    </button>
                                                )}
                                                <button onClick={() => { setSelected(c); setIsDeleteOpen(true); }}
                                                    className="rounded-lg bg-gray-100 p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-500 dark:bg-gray-800">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={6} className="px-6 py-20 text-center font-plus-jakarta text-sm text-gray-400">No customers found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 dark:border-gray-800/50">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-gray-600 disabled:opacity-40 dark:border-gray-800 dark:text-gray-400">
                        ← Previous
                    </button>
                    <span className="font-plus-jakarta text-xs text-gray-400">Page {page}</span>
                    <button onClick={() => setPage(p => p + 1)} disabled={customers.length < 20}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-gray-600 disabled:opacity-40 dark:border-gray-800 dark:text-gray-400">
                        Next →
                    </button>
                </div>
            </div>

            {/* ── Profile Drawer ────────────────────────────────────── */}
            <Drawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)}
                title={selected?.fullName ?? "Loading..."} subtitle={selected?.email}
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
                            <p className="mb-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">Shopping Vitality</p>
                            <div className="grid grid-cols-3 gap-2">
                                {[{ label: "LTV", value: `${selected.lifetimeValue?.toLocaleString() ?? 0} VND` }, { label: "Orders", value: selected.orderCount }, { label: "Items", value: selected.totalItemsPurchased }].map(({ label, value }) => (
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
                            {selected.kycScore != null && selected.kycScore > 0 && (
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${selected.kycScore > 0.8 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                                    Score: {(selected.kycScore * 100).toFixed(0)}%
                                </span>
                            )}
                        </div>
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">Recent Activity</p>
                                <span className="text-[10px] font-bold text-blue-600">Last: {selected.lastOrderAt ? new Date(selected.lastOrderAt).toLocaleDateString() : "None"}</span>
                            </div>
                            {!selected.recentOrders?.length ? (
                                <p className="font-plus-jakarta text-xs text-gray-400">No recent orders.</p>
                            ) : selected.recentOrders.map((order: any) => (
                                <div key={order.orderNumber} className="mb-2 flex items-center justify-between rounded-xl border border-gray-100 p-3 dark:border-gray-800">
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
                        <div>
                            <p className="mb-3 font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">Stored Addresses</p>
                            {!selected.addresses?.length ? (
                                <p className="font-plus-jakarta text-xs text-gray-400">No addresses saved.</p>
                            ) : selected.addresses.map((addr: any, i: number) => (
                                <div key={i} className="mb-2 flex items-start gap-3 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-wider text-gray-500">{addr.label}</p>
                                            {addr.isDefault && <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[8px] font-bold text-blue-600 uppercase">Default</span>}
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

            {/* ── Create Customer Modal ─────────────────────────────── */}
            <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}
                title="New Customer" subtitle="An email with a set-password link will be sent."
                size="md"
                footer={
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setIsCreateOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                        <button onClick={createForm.handleSubmit(handleCreate)} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700">
                            Send Magic Link
                        </button>
                    </div>
                }>
                <form className="flex flex-col gap-4">
                    <FormField label="Email" required error={createForm.formState.errors.email?.message}>
                        <input {...createForm.register("email")} type="email" placeholder="customer@example.com" className={inputCls} />
                    </FormField>
                    <FormField label="Full Name" required error={createForm.formState.errors.fullName?.message}>
                        <input {...createForm.register("fullName")} placeholder="Nguyen Van A" className={inputCls} />
                    </FormField>
                    <FormField label="Phone" error={createForm.formState.errors.phone?.message}>
                        <input {...createForm.register("phone")} placeholder="0901234567" className={inputCls} />
                    </FormField>
                    <FormField label="Date of Birth" error={createForm.formState.errors.dateOfBirth?.message}>
                        <input {...createForm.register("dateOfBirth")} type="date" className={inputCls} />
                    </FormField>
                </form>
            </Modal>

            {/* ── Edit Customer Modal ───────────────────────────────── */}
            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}
                title="Edit Customer" subtitle={selected?.email} size="md"
                footer={
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setIsEditOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                        <button onClick={editForm.handleSubmit(handleEdit)} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700">
                            Save Changes
                        </button>
                    </div>
                }>
                <form className="flex flex-col gap-4">
                    <FormField label="Full Name" required error={editForm.formState.errors.fullName?.message}>
                        <input {...editForm.register("fullName")} placeholder="Nguyen Van A" className={inputCls} />
                    </FormField>
                    <FormField label="Phone" error={editForm.formState.errors.phone?.message}>
                        <input {...editForm.register("phone")} placeholder="0901234567" className={inputCls} />
                    </FormField>
                    <FormField label="Date of Birth" error={editForm.formState.errors.dateOfBirth?.message}>
                        <input {...editForm.register("dateOfBirth")} type="date" className={inputCls} />
                    </FormField>
                </form>
            </Modal>

            {/* ── Restrict Account Modal ────────────────────────────── */}
            <Modal isOpen={isBanOpen} onClose={() => setIsBanOpen(false)}
                title="Restrict Account" subtitle={selected?.email} size="md"
                footer={
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setIsBanOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                        <button onClick={banForm.handleSubmit(handleBan as any)} className="rounded-xl bg-rose-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-rose-700">Apply Restriction</button>
                    </div>
                }>
                <form className="flex flex-col gap-5">
                    {/* Restriction type — compact card selector */}
                    <FormField label="Restriction Type" required>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                {
                                    value: "2",
                                    icon: <Clock className="h-4 w-4 shrink-0" />,
                                    title: "Suspend",
                                    desc: "Temporary, auto-lifts after duration",
                                    color: "amber",
                                },
                                {
                                    value: "3",
                                    icon: <Ban className="h-4 w-4 shrink-0" />,
                                    title: "Ban",
                                    desc: "Permanent lock",
                                    color: "rose",
                                },
                            ].map(({ value, icon, title, desc, color }) => {
                                const active = banForm.watch("banType") === value;
                                return (
                                    <button key={value} type="button"
                                        onClick={() => banForm.setValue("banType", value as "2" | "3")}
                                        className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-all ${
                                            active
                                                ? color === "amber"
                                                    ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20"
                                                    : "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
                                                : "border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900/30"
                                        }`}>
                                        <span className={`${active ? (color === "amber" ? "text-amber-500" : "text-rose-500") : "text-gray-400"}`}>{icon}</span>
                                        <div>
                                            <p className={`font-plus-jakarta text-sm font-bold leading-tight ${active ? (color === "amber" ? "text-amber-700 dark:text-amber-400" : "text-rose-700 dark:text-rose-400") : "text-gray-700 dark:text-gray-300"}`}>{title}</p>
                                            <p className="font-plus-jakarta text-[10px] leading-snug text-gray-400">{desc}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </FormField>

                    {/* Duration — unit selector LEFT, number input RIGHT */}
                    {watchBanType === "2" && (
                        <FormField label="Duration" required error={banForm.formState.errors.durationValue?.message}>
                            <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50">
                                <select {...banForm.register("durationUnit")}
                                    className="shrink-0 border-r border-gray-200 bg-transparent px-3 py-2.5 font-plus-jakarta text-sm font-medium text-gray-900 focus:outline-none dark:border-gray-800 dark:text-gray-100">
                                    <option value="hours">Hours</option>
                                    <option value="days">Days</option>
                                </select>
                                <input
                                    {...banForm.register("durationValue", { valueAsNumber: true })}
                                    type="number" min={1} placeholder="7"
                                    className="min-w-0 flex-1 bg-transparent px-4 py-2.5 font-plus-jakarta text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100"
                                />
                            </div>
                        </FormField>
                    )}

                    {/* Reason */}
                    <FormField label="Reason" required error={banForm.formState.errors.reason?.message}>
                        <textarea {...banForm.register("reason")} rows={3}
                            placeholder="Describe the reason for restriction (min 10 chars)..."
                            className={textareaCls} />
                    </FormField>
                </form>
            </Modal>

            {/* ── Activate Confirm ──────────────────────────────────── */}
            <ConfirmDialog isOpen={isActivateOpen} onClose={() => setIsActivateOpen(false)} onConfirm={handleActivate}
                title="Activate Customer"
                description={`Are you sure you want to activate ${selected?.fullName}'s account?`}
                confirmLabel="Activate" isDestructive={false} />

            {/* ── Delete Confirm ────────────────────────────────────── */}
            <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete}
                title="Delete Customer"
                description={`This will permanently delete ${selected?.fullName} (${selected?.email}). This action cannot be undone.`}
                confirmLabel="Delete" isDestructive={true} />

            {/* ── Import Errors Modal ───────────────────────────────── */}
            <Modal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)}
                title="Import Completed with Errors" size="lg"
                footer={<button onClick={() => setIsImportOpen(false)} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white">Close</button>}>
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                    {importErrors.map((e, i) => (
                        <p key={i} className="font-plus-jakarta text-xs text-rose-600 bg-rose-50 rounded-lg px-3 py-2">{e}</p>
                    ))}
                </div>
            </Modal>
        </div>
    );
}
