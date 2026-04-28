"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Shield, Tag, CheckCircle2, Clock, User, Mail, Phone, ChevronDown, RefreshCcw, FileText, Activity, X, MessageSquare, Globe, Ticket, Eye, Send, PhoneOff } from "lucide-react";
import { adminService, InquiryAuditLogDto } from "@/services/admin.service";
import { toast } from "sonner";
import { format } from "date-fns";

/* ── Action badge ─────────────────────────────────────────────── */
const ACT: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    RESOLVE_INQUIRY: { label: "Resolved", cls: "text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    ASSIGN_COUPON: { label: "Coupon Sent", cls: "text-amber-700 bg-amber-50 border-amber-100 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20", icon: <Tag className="h-3.5 w-3.5" /> },
    REPLY_INQUIRY: { label: "Replied", cls: "text-blue-700 bg-blue-50 border-blue-100 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20", icon: <Send className="h-3.5 w-3.5" /> },
    CONTACT_FAILED: { label: "Contact Failed", cls: "text-rose-700 bg-rose-50 border-rose-100 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20", icon: <PhoneOff className="h-3.5 w-3.5" /> },
    RESPOND_WITH_COUPON: { label: "Reply + Coupon", cls: "text-violet-700 bg-violet-50 border-violet-100 dark:text-violet-400 dark:bg-violet-500/10 dark:border-violet-500/20", icon: <Tag className="h-3.5 w-3.5" /> },
};
function Badge({ action }: { action: string }) {
    const c = ACT[action] || { label: action, cls: "text-gray-600 bg-gray-50 border-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700", icon: <Activity className="h-3.5 w-3.5" /> };
    return <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${c.cls}`}>{c.icon}{c.label}</span>;
}

/* ── Detail Drawer ────────────────────────────────────────────── */
function DetailDrawer({ log, onClose }: { log: InquiryAuditLogDto; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm" onClick={onClose}>
            <div className="flex h-full w-full max-w-lg flex-col bg-white shadow-2xl dark:bg-[#161616] animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
                    <div>
                        <h2 className="font-plus-jakarta text-lg font-bold text-gray-900 dark:text-white">Action Detail</h2>
                        <p className="font-plus-jakarta text-[10px] text-gray-400 mt-0.5">ID: {log.id.substring(0, 8)}…</p>
                    </div>
                    <button onClick={onClose} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"><X className="h-5 w-5" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Section: Vendor */}
                    <Section title="Vendor (Staff)">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 font-plus-jakarta text-sm font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                {log.actorName?.[0] || "?"}
                            </div>
                            <div>
                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{log.actorName || "Unknown"}</p>
                                <p className="font-plus-jakarta text-xs text-gray-400">{log.actorEmail}</p>
                            </div>
                        </div>
                        <InfoRow icon={<Clock className="h-3.5 w-3.5" />} label="Action Time" value={format(new Date(log.createdAt), "dd MMM yyyy, HH:mm:ss")} />
                        <InfoRow icon={<Globe className="h-3.5 w-3.5" />} label="IP Address" value={log.ipAddress || "—"} />
                        <div className="pt-1"><Badge action={log.action} /></div>
                    </Section>

                    {/* Section: Customer Contact */}
                    <Section title="Customer Contact">
                        <InfoRow icon={<User className="h-3.5 w-3.5" />} label="Name" value={log.customerName || "—"} />
                        <InfoRow icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={log.customerEmail || "—"} />
                        <InfoRow icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={log.customerPhone || "—"} />
                    </Section>

                    {/* Section: Inquiry */}
                    <Section title="Inquiry Details">
                        <InfoRow icon={<MessageSquare className="h-3.5 w-3.5" />} label="Subject" value={log.inquirySubject || "General Inquiry"} />
                        {log.inquiryCreatedAt && (
                            <InfoRow icon={<Clock className="h-3.5 w-3.5" />} label="Submitted At" value={format(new Date(log.inquiryCreatedAt), "dd MMM yyyy, HH:mm")} />
                        )}
                        <div>
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Customer Message</p>
                            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
                                <p className="font-plus-jakarta text-sm leading-relaxed text-gray-600 dark:text-gray-300 italic">
                                    &ldquo;{log.inquiryMessage || "No message"}&rdquo;
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">Status:</span>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${log.inquiryStatus === "RESOLVED" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"}`}>
                                {log.inquiryStatus === "RESOLVED" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                {log.inquiryStatus || "OPEN"}
                            </span>
                        </div>
                    </Section>

                    {/* Section: Vendor Response — placeholder */}
                    <Section title="Vendor Response">
                        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/30 p-4 dark:border-gray-700 dark:bg-gray-900/30">
                            <p className="font-plus-jakarta text-xs text-gray-400 italic">Response feature coming soon — will be updated on vendor side.</p>
                        </div>
                    </Section>

                    {/* Section: Coupon */}
                    {log.couponCode ? (
                        <Section title="Coupon Issued">
                            <div className="flex items-center gap-3 rounded-2xl bg-amber-50/50 border border-amber-100 p-4 dark:bg-amber-500/5 dark:border-amber-500/20">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/20">
                                    <Ticket className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <p className="font-mono text-lg font-extrabold text-amber-700 dark:text-amber-400 tracking-wider">{log.couponCode}</p>
                                    <p className="font-plus-jakarta text-[10px] text-gray-400">Sent to {log.customerEmail}</p>
                                </div>
                            </div>
                        </Section>
                    ) : log.action === "RESOLVE_INQUIRY" ? (
                        <Section title="Coupon">
                            <p className="font-plus-jakarta text-xs text-gray-400">No coupon was issued for this inquiry.</p>
                        </Section>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{title}</p>
            <div className="space-y-2.5 rounded-2xl border border-gray-100 bg-white/50 p-4 dark:border-gray-800/50 dark:bg-[#111]/50">{children}</div>
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-gray-300 dark:text-gray-600">{icon}</span>
            <span className="font-plus-jakarta text-[10px] font-bold text-gray-400 w-20 shrink-0 uppercase tracking-wider">{label}</span>
            <span className="font-plus-jakarta text-sm text-gray-700 dark:text-gray-200 truncate">{value}</span>
        </div>
    );
}

/* ── Main Page ────────────────────────────────────────────────── */
export default function AdminInquiryLogsPage() {
    const [logs, setLogs] = useState<InquiryAuditLogDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [actionFilter, setActionFilter] = useState("ALL");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selected, setSelected] = useState<InquiryAuditLogDto | null>(null);

    const fetchLogs = async () => {
        try {
            setIsLoading(true);
            const params: Record<string, string> = {};
            if (actionFilter !== "ALL") params.action = actionFilter;
            const res = await adminService.inquiryLogs.getAll(params);
            if (res.success) setLogs(res.data || []);
            else toast.error(res.message || "Failed to fetch logs");
        } catch { toast.error("Failed to fetch inquiry logs"); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchLogs(); }, [actionFilter]); // eslint-disable-line react-hooks/exhaustive-deps

    const filtered = useMemo(() => {
        if (!search.trim()) return logs;
        const s = search.toLowerCase();
        return logs.filter(l =>
            l.actorName?.toLowerCase().includes(s) || l.actorEmail?.toLowerCase().includes(s) ||
            l.customerName?.toLowerCase().includes(s) || l.customerEmail?.toLowerCase().includes(s) ||
            l.customerPhone?.toLowerCase().includes(s) || l.couponCode?.toLowerCase().includes(s)
        );
    }, [logs, search]);

    const resolveCount = logs.filter(l => l.action === "RESOLVE_INQUIRY").length;
    const couponCount = logs.filter(l => l.action === "ASSIGN_COUPON").length;
    const uniqueVendors = new Set(logs.map(l => l.actorId).filter(Boolean)).size;

    return (
        <div className="flex flex-col gap-8 pb-10">
            {selected && <DetailDrawer log={selected} onClose={() => setSelected(null)} />}

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h1 className="font-plus-jakarta text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        Inquiry <span className="text-blue-600 dark:text-blue-400">Audit Trail</span>
                    </h1>
                    <p className="font-plus-jakarta text-xs text-gray-500 dark:text-gray-400">Track every vendor action on customer inquiries</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard icon={<User className="h-5 w-5 text-blue-600 dark:text-blue-400" />} value={uniqueVendors} label="Active Vendors" borderCls="border-gray-100 dark:border-gray-800/50" bgCls="bg-white/70 dark:bg-[#111]/70" iconBg="bg-blue-50 dark:bg-blue-500/10" valCls="text-gray-900 dark:text-white" />
                <StatCard icon={<CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />} value={resolveCount} label="Resolved" borderCls="border-emerald-100 dark:border-emerald-500/20" bgCls="bg-emerald-50/30 dark:bg-emerald-500/5" iconBg="bg-emerald-50 dark:bg-emerald-500/10" valCls="text-emerald-700 dark:text-emerald-400" />
                <StatCard icon={<Tag className="h-5 w-5 text-amber-600 dark:text-amber-400" />} value={couponCount} label="Coupons Issued" borderCls="border-amber-100 dark:border-amber-500/20" bgCls="bg-amber-50/30 dark:bg-amber-500/5" iconBg="bg-amber-50 dark:bg-amber-500/10" valCls="text-amber-700 dark:text-amber-400" />
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendor, customer, phone, coupon…"
                        className="w-full rounded-2xl border border-gray-100 bg-white/70 py-3.5 pl-12 pr-4 font-plus-jakarta text-sm backdrop-blur-md shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none dark:border-gray-800/50 dark:bg-[#111]/70" />
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2.5 font-plus-jakarta text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-[#161616] dark:text-gray-300">
                            {actionFilter === "ALL" ? "All Actions" : ACT[actionFilter]?.label || actionFilter}
                            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
                        </button>
                        {filterOpen && (
                            <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl dark:border-gray-800 dark:bg-[#161616]">
                                {["ALL", "RESOLVE_INQUIRY", "ASSIGN_COUPON", "REPLY_INQUIRY", "RESPOND_WITH_COUPON", "CONTACT_FAILED"].map(a => (
                                    <button key={a} onClick={() => { setActionFilter(a); setFilterOpen(false); }}
                                        className={`flex w-full rounded-xl px-3 py-2 text-left font-plus-jakarta text-xs font-semibold transition-all ${actionFilter === a ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"}`}>
                                        {a === "ALL" ? "All Actions" : ACT[a]?.label || a}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={fetchLogs} disabled={isLoading} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2.5 font-plus-jakarta text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:bg-[#161616] dark:text-gray-300">
                        <RefreshCcw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} /> Refresh
                    </button>
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="flex flex-col gap-3">{[1,2,3,4].map(i => <div key={i} className="h-24 w-full animate-pulse rounded-2xl bg-gray-100/50 dark:bg-gray-800/20" />)}</div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-gray-100 py-24 dark:border-gray-800/50">
                    <div className="mb-6 rounded-full bg-gray-50 p-8 dark:bg-gray-900"><FileText className="h-12 w-12 text-gray-200 dark:text-gray-700" /></div>
                    <p className="font-plus-jakarta text-xl font-bold text-gray-900 dark:text-white">No Audit Records</p>
                    <p className="mt-2 font-plus-jakarta text-sm text-gray-400">Vendor actions on inquiries will appear here.</p>
                </div>
            ) : (
                <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                    <div className="overflow-x-auto">
                        <table className="w-full whitespace-nowrap text-left text-sm">
                            <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                                <tr>
                                    {["Vendor", "Time", "Customer Contact", "Action", "Coupon", ""].map(h => (
                                        <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                                {filtered.length > 0 ? filtered.map(log => {
                                    const hasCoupon = !!log.couponCode;
                                    return (
                                        <tr key={log.id} className={`group transition-colors ${hasCoupon ? "bg-amber-50/40 hover:bg-amber-50/70 dark:bg-amber-500/5 dark:hover:bg-amber-500/10" : "hover:bg-gray-50/50 dark:hover:bg-gray-800/30"}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-plus-jakarta text-sm font-bold ${hasCoupon ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                                                        {log.actorName?.[0] || "?"}
                                                    </div>
                                                    <div>
                                                        <p className="font-plus-jakarta text-sm font-bold text-gray-900 group-hover:text-blue-600 dark:text-white">{log.actorName || "Unknown"}</p>
                                                        <p className="font-plus-jakarta text-[10px] text-gray-400">{log.actorEmail}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3 w-3 text-gray-300 dark:text-gray-600" />
                                                    <span className="font-plus-jakarta text-xs font-medium text-gray-600 dark:text-gray-300">{format(new Date(log.createdAt), "dd MMM yyyy")}</span>
                                                </div>
                                                <p className="font-plus-jakarta text-[10px] text-gray-400 mt-0.5 ml-[18px]">{format(new Date(log.createdAt), "HH:mm:ss")}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail className="h-3 w-3 shrink-0 text-gray-400" />
                                                        <span className="font-plus-jakarta text-xs text-gray-700 dark:text-gray-300">{log.customerEmail || "—"}</span>
                                                    </div>
                                                    {log.customerPhone && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Phone className="h-3 w-3 shrink-0 text-gray-400" />
                                                            <span className="font-plus-jakarta text-xs text-gray-500 dark:text-gray-400">{log.customerPhone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"><Badge action={log.action} /></td>
                                            <td className="px-6 py-4">
                                                {hasCoupon ? (
                                                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 border border-amber-200 px-3 py-1.5 dark:bg-amber-500/15 dark:border-amber-500/25">
                                                        <Ticket className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                                        <span className="font-mono text-xs font-extrabold text-amber-700 dark:text-amber-400 tracking-wider">{log.couponCode}</span>
                                                    </div>
                                                ) : (
                                                    <span className="font-plus-jakarta text-xs text-gray-300 dark:text-gray-600">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => setSelected(log)}
                                                    className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400">
                                                    <Eye className="h-3.5 w-3.5" />Detail
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr><td colSpan={6} className="px-6 py-20 text-center font-plus-jakarta text-sm text-gray-400">No audit records found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-800/50">
                        <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">Showing {filtered.length} of {logs.length} records</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ icon, value, label, borderCls, bgCls, iconBg, valCls }: { icon: React.ReactNode; value: number; label: string; borderCls: string; bgCls: string; iconBg: string; valCls: string }) {
    return (
        <div className={`flex items-center gap-4 rounded-2xl border p-5 ${borderCls} ${bgCls}`}>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}>{icon}</div>
            <div>
                <p className={`font-plus-jakarta text-2xl font-extrabold ${valCls}`}>{value}</p>
                <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
            </div>
        </div>
    );
}
