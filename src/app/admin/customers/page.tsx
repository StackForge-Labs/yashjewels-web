"use client";

import { useState } from "react";
import { Plus, Edit3, Trash2, Mail, MapPin, ShieldCheck, ShieldAlert } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Drawer } from "../_components/ui/Drawer";
import { ConfirmDialog } from "../_components/ui/ConfirmDialog";

type Customer = {
    id: string; name: string; email: string; phone: string;
    status: "active" | "inactive"; two_fa: boolean; joined: string;
    total_spent: string; kyc_status: "verified" | "pending" | "rejected";
    addresses: { label: string; line1: string; district: string; province: string; is_default: boolean }[];
};

const mockCustomers: Customer[] = [
    { id: "1", name: "Eleanor Vance", email: "e.vance@email.com", phone: "+1 (555) 123-4567", status: "active", two_fa: true, joined: "2026-01-15", total_spent: "$14,500.00", kyc_status: "verified", addresses: [{ label: "Home", line1: "88 Nguyen Hue", district: "District 1", province: "Ho Chi Minh City", is_default: true }] },
    { id: "2", name: "James Sterling", email: "j.sterling@email.com", phone: "+44 20 7123 4567", status: "active", two_fa: false, joined: "2026-02-28", total_spent: "$32,300.00", kyc_status: "verified", addresses: [{ label: "Office", line1: "12 Le Loi", district: "District 1", province: "Ho Chi Minh City", is_default: true }] },
    { id: "3", name: "Sophia Chen", email: "sophia.c@email.com", phone: "+65 8123 4567", status: "active", two_fa: true, joined: "2026-03-10", total_spent: "$4,850.00", kyc_status: "pending", addresses: [] },
    { id: "4", name: "Michael Ross", email: "m.ross@email.com", phone: "+1 (555) 987-6543", status: "inactive", two_fa: false, joined: "2026-04-01", total_spent: "$0.00", kyc_status: "rejected", addresses: [] },
];

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Customer | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    const toggleStatus = () => {
        if (selected) {
            setCustomers(customers.map(c => c.id === selected.id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c));
        }
        setIsDeactivateOpen(false);
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Customer Directory" description="Manage client profiles, KYC status, and purchase history."
                badge={{ count: customers.filter(c => c.kyc_status === "pending").length, label: "KYC pending", color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" }} />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="border-b border-gray-100 p-6 dark:border-gray-800/50">
                    <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
                        className="max-w-sm w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 font-plus-jakarta text-sm font-medium placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a]/50 dark:text-gray-100 dark:placeholder:text-gray-500" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>{["Client", "Security", "KYC", "Joined", "Spent", "Actions"].map(h => <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {filtered.map(c => (
                                <tr key={c.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-plus-jakarta text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{c.name.charAt(0)}</div>
                                            <div>
                                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 group-hover:text-blue-600 dark:text-white">{c.name}</p>
                                                <div className="flex items-center gap-1"><Mail className="h-3 w-3 text-gray-400" /><span className="font-plus-jakarta text-xs text-gray-500">{c.email}</span></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5">
                                            <StatusBadge status={c.status} />
                                            {c.two_fa ? (
                                                <span className="inline-flex items-center gap-1 font-plus-jakarta text-[10px] font-bold uppercase text-emerald-600"><ShieldCheck className="h-3 w-3" /> 2FA On</span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 font-plus-jakarta text-[10px] font-bold uppercase text-amber-500"><ShieldAlert className="h-3 w-3" /> No 2FA</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><StatusBadge status={c.kyc_status} label={c.kyc_status} /></td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500">{c.joined}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{c.total_spent}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => { setSelected(c); setIsProfileOpen(true); }} className="rounded-lg bg-gray-100 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-300">Profile</button>
                                            <button onClick={() => { setSelected(c); setIsDeactivateOpen(true); }} className={`rounded-lg px-3 py-1.5 font-plus-jakarta text-xs font-bold transition-colors ${c.status === "active" ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}>
                                                {c.status === "active" ? "Deactivate" : "Activate"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Profile Drawer */}
            <Drawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} title={selected?.name ?? ""} subtitle={selected?.email}
                footer={<button onClick={() => setIsProfileOpen(false)} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700">Close</button>}>
                {selected && (
                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Phone", value: selected.phone },
                                { label: "Joined", value: selected.joined },
                                { label: "Total Spent", value: selected.total_spent },
                                { label: "2FA", value: selected.two_fa ? "Enabled" : "Disabled" },
                            ].map(({ label, value }) => (
                                <div key={label} className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                                    <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                                    <p className="mt-1 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <StatusBadge status={selected.status} />
                            <StatusBadge status={selected.kyc_status} label={`KYC: ${selected.kyc_status}`} />
                        </div>
                        <div>
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Saved Addresses</p>
                            {selected.addresses.length === 0 ? (
                                <p className="font-plus-jakarta text-sm text-gray-400">No addresses saved.</p>
                            ) : selected.addresses.map((addr, i) => (
                                <div key={i} className="flex items-start gap-3 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                                    <MapPin className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
                                    <div>
                                        <p className="font-plus-jakarta text-xs font-bold uppercase tracking-wider text-gray-500">{addr.label} {addr.is_default && <span className="text-blue-600">(Default)</span>}</p>
                                        <p className="font-plus-jakarta text-sm font-medium text-gray-900 dark:text-white">{addr.line1}, {addr.district}, {addr.province}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Drawer>

            <ConfirmDialog isOpen={isDeactivateOpen} onClose={() => setIsDeactivateOpen(false)} onConfirm={toggleStatus}
                title={selected?.status === "active" ? "Deactivate Customer" : "Activate Customer"}
                description={`Are you sure you want to ${selected?.status === "active" ? "deactivate" : "activate"} ${selected?.name}'s account?`}
                confirmLabel={selected?.status === "active" ? "Deactivate" : "Activate"}
                isDestructive={selected?.status === "active"} />
        </div>
    );
}
