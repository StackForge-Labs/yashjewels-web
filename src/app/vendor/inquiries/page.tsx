"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Eye, Check, Tag, ChevronRight, X, Search, Loader2, Sparkles } from "lucide-react";
import { vendorService, InquiryDto } from "@/services/vendor.service";
import { toast } from "sonner";
import { format } from "date-fns";

// ─── Component: DetailDrawer ───────────────────────────────────
function DetailDrawer({ 
    inquiry, 
    onClose, 
    onUpdate 
}: { 
    inquiry: InquiryDto; 
    onClose: () => void; 
    onUpdate: () => void 
}) {
    const [coupon, setCoupon] = useState("");
    const [discountValue, setDiscountValue] = useState<number>(10);
    const [discountType, setDiscountType] = useState<"FIXED_AMOUNT" | "PERCENTAGE">("FIXED_AMOUNT");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleResolve = async () => {
        try {
            setIsSubmitting(true);
            const res = await vendorService.resolveInquiry(inquiry.id);
            if (res.success) {
                toast.success("Inquiry marked as resolved");
                onUpdate();
                onClose();
            } else {
                toast.error(res.message || "Failed to resolve inquiry");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAssignCoupon = async () => {
        if (!coupon.trim()) {
            toast.error("Please enter a coupon code");
            return;
        }
        if (discountValue <= 0) {
            toast.error("Please enter a valid discount value");
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await vendorService.assignCouponToInquiry(
                inquiry.id, 
                coupon, 
                discountValue, 
                discountType
            );
            if (res.success) {
                toast.success(res.message || `Coupon ${coupon} assigned successfully`);
                onUpdate();
                // We keep the drawer open but the parent will re-render with new data
                // To show the coupon immediately in the drawer, we could close and re-open 
                // but since the parent state 'selected' needs to be updated, 
                // it's better to just close it to force a fresh look next time
                onClose(); 
            } else {
                toast.error(res.message || "Failed to assign coupon");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
            <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-[#161616] animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
                    <div>
                        <h2 className="font-plus-jakarta text-lg font-bold text-gray-900 dark:text-white">Inquiry Detail</h2>
                        <p className="font-plus-jakarta text-xs text-gray-400">{inquiry.id}</p>
                    </div>
                    <button onClick={onClose} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex flex-col gap-6 overflow-y-auto p-6">
                    <div className="flex flex-col gap-3 rounded-2xl bg-gray-50/50 p-5 dark:bg-gray-900/50">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold">
                                {inquiry.name[0]}
                            </div>
                            <div>
                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{inquiry.name}</p>
                                <p className="font-plus-jakarta text-xs text-gray-400">{inquiry.email}</p>
                            </div>
                        </div>
                        {inquiry.phone && (
                            <a href={`tel:${inquiry.phone}`} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 font-plus-jakarta text-xs font-semibold text-gray-700 shadow-sm hover:bg-amber-50 dark:bg-gray-800 dark:text-gray-300">
                                📞 {inquiry.phone}
                            </a>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Subject</p>
                            <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{inquiry.subject}</p>
                            </div>
                        </div>

                        <div>
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Message</p>
                            <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
                                <p className="font-plus-jakarta text-sm leading-relaxed text-gray-600 dark:text-gray-300 italic">"{inquiry.message}"</p>
                            </div>
                        </div>
                    </div>

                    {inquiry.status === "OPEN" && (
                        <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-amber-300 p-5 dark:border-amber-700/40 bg-amber-50/30 dark:bg-amber-500/5">
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                                Send Compensation Coupon
                            </p>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[9px] font-bold text-gray-400 uppercase mb-1 block">Coupon Code</label>
                                    <input
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                                        placeholder="Ex: WELCOME10"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-mono text-sm uppercase focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase mb-1 block">Value</label>
                                        <input
                                            type="number"
                                            value={discountValue}
                                            onChange={(e) => setDiscountValue(Number(e.target.value))}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
                                        />
                                    </div>
                                    <div className="w-1/3">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase mb-1 block">Type</label>
                                        <select
                                            value={discountType}
                                            onChange={(e) => setDiscountType(e.target.value as any)}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-2 py-2.5 text-xs font-bold focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
                                        >
                                            <option value="FIXED_AMOUNT">USD</option>
                                            <option value="PERCENTAGE">%</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 mt-1">
                                    <p className="font-plus-jakarta text-[10px] leading-relaxed text-amber-700 dark:text-amber-400 font-medium italic">
                                        * Note: Every coupon issued must be approved by the Admin. The Vendor is fully responsible for all compensation rewards sent through this system.
                                    </p>
                                </div>

                                <button 
                                    onClick={handleAssignCoupon}
                                    disabled={isSubmitting}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 font-plus-jakarta text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-50 transition-all shadow-md shadow-amber-100 dark:shadow-none mt-1"
                                >
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Tag className="h-4 w-4" />}
                                    Generate & Send Reward
                                </button>
                            </div>
                        </div>
                    )}

                    {inquiry.couponAssigned && (
                        <div className="flex flex-col gap-2 rounded-2xl bg-emerald-50/50 p-5 border border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/20">
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-emerald-600">Reward Successfully Sent</p>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20">
                                    <Sparkles className="h-5 w-5 text-emerald-600" />
                                </div>
                                <span className="font-plus-jakarta text-base font-bold text-emerald-900 dark:text-emerald-400">{inquiry.couponAssigned}</span>
                            </div>
                        </div>
                    )}
                </div>

                {inquiry.status === "OPEN" && (
                    <div className="mt-auto border-t border-gray-100 p-6 dark:border-gray-800">
                        <button
                            onClick={handleResolve}
                            disabled={isSubmitting}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 py-4 font-plus-jakarta text-sm font-bold text-white shadow-lg transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-100"
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            Mark as Fully Resolved
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Page: VendorInquiriesPage ──────────────────────────────────
export default function VendorInquiriesPage() {
    const [inquiries, setInquiries] = useState<InquiryDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState<InquiryDto | null>(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"ALL" | "OPEN" | "RESOLVED">("ALL");

    const fetchInquiries = async () => {
        try {
            setIsLoading(true);
            const res = await vendorService.getInquiries();
            if (res.success) {
                setInquiries(res.data || []);
            }
        } catch (error) {
            toast.error("Failed to sync inquiries");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const filtered = inquiries.filter((i) => {
        const searchLower = search.toLowerCase();
        return (
            (i.name.toLowerCase().includes(searchLower) || 
             i.subject.toLowerCase().includes(searchLower) ||
             i.message.toLowerCase().includes(searchLower)) &&
            (filter === "ALL" || i.status === filter)
        );
    });

    const openCount = inquiries.filter((i) => i.status === "OPEN").length;

    return (
        <div className="flex flex-col gap-8 pb-10">
            {selected && (
                <DetailDrawer 
                    inquiry={selected} 
                    onClose={() => setSelected(null)} 
                    onUpdate={fetchInquiries} 
                />
            )}

            <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-plus-jakarta text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                            Assistance <span className="text-amber-600">Hub</span>
                        </h1>
                        <p className="font-plus-jakarta text-sm text-gray-500 dark:text-gray-400">
                            Professional consultation and inquiry management system
                        </p>
                    </div>
                    {openCount > 0 && (
                        <div className="flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                            <span className="font-plus-jakarta text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                                {openCount} Pending Tasks
                            </span>
                        </div>
                    )}
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            placeholder="Search client, subject or keywords..." 
                            className="w-full rounded-2xl border border-gray-100 bg-white/70 py-3.5 pl-12 pr-4 font-plus-jakarta text-sm backdrop-blur-md shadow-sm transition-all focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 focus:outline-none dark:border-gray-800/50 dark:bg-[#111]/70" 
                        />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-2xl border border-gray-100 bg-white/50 p-1.5 dark:border-gray-800/50 dark:bg-[#111]/50">
                        {(["ALL", "OPEN", "RESOLVED"] as const).map((f) => (
                            <button 
                                key={f} 
                                onClick={() => setFilter(f)} 
                                className={`rounded-xl px-5 py-2.5 font-plus-jakarta text-[11px] font-bold uppercase tracking-widest transition-all ${filter === f ? "bg-gray-900 text-white shadow-lg dark:bg-white dark:text-black" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                            >
                                {f === "ALL" ? "Show All" : f === "OPEN" ? "Pending" : "Resolved"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List Content */}
            {isLoading ? (
                <div className="flex flex-col gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-28 w-full animate-pulse rounded-3xl bg-gray-100/50 dark:bg-gray-800/20" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-gray-100 py-32 dark:border-gray-800/50">
                    <div className="mb-6 rounded-full bg-gray-50 p-8 dark:bg-gray-900">
                        <MessageSquare className="h-12 w-12 text-gray-200" />
                    </div>
                    <p className="font-plus-jakarta text-xl font-bold text-gray-900 dark:text-white tracking-tight">Zero Inquiries</p>
                    <p className="mt-2 font-plus-jakarta text-sm text-gray-400">Your customer inbox is currently empty.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filtered.map((inq) => (
                        <div
                            key={inq.id}
                            onClick={() => setSelected(inq)}
                            className={`group relative flex cursor-pointer items-center gap-6 overflow-hidden rounded-3xl border bg-white/70 p-6 backdrop-blur-md transition-all hover:shadow-xl hover:-translate-y-1 dark:bg-[#111]/70 ${inq.status === "OPEN" ? "border-amber-200/50 dark:border-amber-500/20 shadow-amber-500/5" : "border-gray-100 dark:border-gray-800/50"}`}
                        >
                            {inq.status === "OPEN" && (
                                <div className="absolute left-0 top-0 h-full w-1.5 bg-amber-500" />
                            )}

                            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-plus-jakarta text-sm font-bold shadow-sm transition-all group-hover:scale-110 group-hover:rotate-3 ${inq.status === "OPEN" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}`}>
                                <MessageSquare className="h-6 w-6" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3">
                                    <p className="font-plus-jakarta text-base font-bold text-gray-900 dark:text-white truncate">
                                        {inq.name}
                                    </p>
                                    {inq.status === "OPEN" && (
                                        <span className="flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 font-plus-jakarta text-[9px] font-bold text-white shadow-sm">
                                            NEW MESSAGE
                                        </span>
                                    )}
                                </div>
                                <p className="font-plus-jakarta text-sm font-semibold text-gray-700 dark:text-gray-200 mt-1">
                                    {inq.subject}
                                </p>
                                <p className="mt-2 line-clamp-1 font-plus-jakarta text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {inq.message}
                                </p>
                            </div>

                            <div className="flex shrink-0 flex-col items-end gap-4">
                                <span className="font-plus-jakarta text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                                    {inq.submittedAt ? format(new Date(inq.submittedAt), "MMM dd, HH:mm") : "Recently"}
                                </span>
                                
                                {inq.status === "RESOLVED" ? (
                                    <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 dark:bg-emerald-500/10">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        <span className="font-plus-jakarta text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Completed</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-white shadow-lg shadow-amber-200 transition-all group-hover:bg-amber-700 group-hover:scale-105 dark:shadow-none">
                                        <Eye className="h-3.5 w-3.5" />
                                        <span className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest">Details</span>
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
