"use client";

import { useState } from "react";
import { Eye, Activity, Shield } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { Modal } from "../_components/ui/Modal";

type AuditLog = {
    id: string; actor_id: string; actor_role: string; action: string;
    entity_type: string; entity_id: string; old_value: string | null;
    new_value: string | null; ip_address: string; created_at: string;
};

const mockLogs: AuditLog[] = [
    { id: "1", actor_id: "admin-001", actor_role: "Admin", action: "UPDATE", entity_type: "Order", entity_id: "ORD-9281", old_value: '{"status":"processing"}', new_value: '{"status":"delivered"}', ip_address: "192.168.1.10", created_at: "2026-04-08 10:42" },
    { id: "2", actor_id: "admin-001", actor_role: "Admin", action: "CREATE", entity_type: "Coupon", entity_id: "WELCOME20", old_value: null, new_value: '{"code":"WELCOME20","value":20}', ip_address: "192.168.1.10", created_at: "2026-04-08 09:15" },
    { id: "3", actor_id: "admin-002", actor_role: "Manager", action: "APPROVE", entity_type: "KYC", entity_id: "kyc-004", old_value: '{"status":"pending"}', new_value: '{"status":"approved"}', ip_address: "10.0.0.5", created_at: "2026-04-07 14:30" },
    { id: "4", actor_id: "admin-001", actor_role: "Admin", action: "REJECT", entity_type: "ReturnRequest", entity_id: "RET-012", old_value: '{"status":"pending"}', new_value: '{"status":"rejected"}', ip_address: "192.168.1.10", created_at: "2026-04-07 11:20" },
];

const actionColors: Record<string, string> = {
    CREATE: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    UPDATE: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    DELETE: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    APPROVE: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    REJECT: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
};

export default function SystemPage() {
    const [selected, setSelected] = useState<AuditLog | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filtered = mockLogs.filter(l =>
        l.action.toLowerCase().includes(search.toLowerCase()) ||
        l.entity_type.toLowerCase().includes(search.toLowerCase()) ||
        l.actor_role.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Audit & System" description="System health overview, API partner status, and security audit logs." />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50 p-6 dark:border-emerald-800/30 dark:from-emerald-900/20 dark:to-green-900/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/20"><Activity className="h-5 w-5 text-emerald-600" /></div>
                        <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-emerald-600">API Status</p>
                    </div>
                    <p className="font-plus-jakarta text-2xl font-bold text-emerald-700 dark:text-emerald-400">100% Uptime</p>
                    <p className="mt-1 font-plus-jakarta text-xs text-emerald-600/60">All webhooks responding</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800/50 dark:bg-[#111]/70">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10"><Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" /></div>
                        <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">Audit Events (24h)</p>
                    </div>
                    <p className="font-plus-jakarta text-2xl font-bold text-gray-900 dark:text-white">{mockLogs.length}</p>
                    <p className="mt-1 font-plus-jakarta text-xs text-gray-400">No unauthorized access</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800/50 dark:bg-[#111]/70">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10"><Activity className="h-5 w-5 text-amber-600" /></div>
                        <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">API Partners</p>
                    </div>
                    <p className="font-plus-jakarta text-2xl font-bold text-gray-900 dark:text-white">3 Active</p>
                    <p className="mt-1 font-plus-jakarta text-xs text-gray-400">2 webhook enabled</p>
                </div>
            </div>

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-gray-800/50">
                    <h2 className="font-plus-jakarta text-base font-bold text-gray-900 dark:text-white">Security Audit Log</h2>
                    <input type="text" placeholder="Filter logs..." value={search} onChange={e => setSearch(e.target.value)}
                        className="max-w-xs rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 font-plus-jakarta text-sm font-medium placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a]/50 dark:text-gray-100 dark:placeholder:text-gray-500" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>{["Action", "Entity", "Actor", "IP Address", "Timestamp", ""].map(h => <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {filtered.map(log => (
                                <tr key={log.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4">
                                        <span className={`rounded-lg px-2.5 py-1 font-plus-jakarta text-[10px] font-bold uppercase ${actionColors[log.action] ?? "bg-gray-100 text-gray-600"}`}>{log.action}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{log.entity_type}</span>
                                        <span className="ml-2 font-plus-jakarta text-xs text-gray-400">#{log.entity_id.slice(-6)}</span>
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-600 dark:text-gray-300">{log.actor_role}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{log.ip_address}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-xs text-gray-500">{log.created_at}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => { setSelected(log); setIsDetailOpen(true); }} className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600"><Eye className="h-4 w-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Audit Log Detail" size="lg">
                {selected && (
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Action", value: selected.action },
                                { label: "Entity Type", value: selected.entity_type },
                                { label: "Entity ID", value: selected.entity_id },
                                { label: "Actor Role", value: selected.actor_role },
                                { label: "IP Address", value: selected.ip_address },
                                { label: "Timestamp", value: selected.created_at },
                            ].map(({ label, value }) => (
                                <div key={label} className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                                    <p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400">{label}</p>
                                    <p className="mt-1 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{value}</p>
                                </div>
                            ))}
                        </div>
                        {selected.old_value && (
                            <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                                <p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400 mb-2">Before (Old Value)</p>
                                <pre className="font-mono text-xs text-rose-600 dark:text-rose-400 whitespace-pre-wrap">{JSON.stringify(JSON.parse(selected.old_value), null, 2)}</pre>
                            </div>
                        )}
                        {selected.new_value && (
                            <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                                <p className="font-plus-jakarta text-[10px] font-bold uppercase text-gray-400 mb-2">After (New Value)</p>
                                <pre className="font-mono text-xs text-emerald-600 dark:text-emerald-400 whitespace-pre-wrap">{JSON.stringify(JSON.parse(selected.new_value), null, 2)}</pre>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
