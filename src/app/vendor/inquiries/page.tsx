/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Eye, Check, Tag, ChevronRight, X, Search, Loader2, Sparkles, Send, PhoneOff, Clock, AlertTriangle } from "lucide-react";
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Unified response state
    const [replyMessage, setReplyMessage] = useState("");
    const [includeReply, setIncludeReply] = useState(false);
    const [includeCoupon, setIncludeCoupon] = useState(false);
    const [coupon, setCoupon] = useState("");
    const [discountValue, setDiscountValue] = useState<number>(10);
    const [discountType, setDiscountType] = useState<"FIXED_AMOUNT" | "PERCENTAGE">("FIXED_AMOUNT");
    const [contactFailedMode, setContactFailedMode] = useState(false);
    const [activities, setActivities] = useState<any[]>([]);
    const [loadingActivity, setLoadingActivity] = useState(false);

    const loadActivity = useCallback(async () => {
        try {
            setLoadingActivity(true);
            const res = await vendorService.getInquiryActivity(inquiry.id);
            if (res.success) setActivities(res.data || []);
        } catch { /* silent */ }
        finally { setLoadingActivity(false); }
    }, [inquiry.id]);

    useEffect(() => {
        loadActivity();
    }, [loadActivity]);

    const handleResolve = async () => {
        try {
            setIsSubmitting(true);
            const res = await vendorService.resolveInquiry(inquiry.id);
            if (res.success) { toast.success("Inquiry marked as resolved"); onUpdate(); onClose(); }
            else toast.error(res.message || "Failed to resolve inquiry");
        } catch { toast.error("An error occurred"); }
        finally { setIsSubmitting(false); }
    };

    const handleSendResponse = async () => {
        if (!includeReply && !includeCoupon) { toast.error("Enable at least one option: Reply or Coupon"); return; }
        if (includeReply && !replyMessage.trim()) { toast.error("Please enter a reply message"); return; }
        if (includeCoupon && !coupon.trim()) { toast.error("Please enter a coupon code"); return; }
        if (includeCoupon && discountValue <= 0) { toast.error("Please enter a valid discount value"); return; }

        try {
            setIsSubmitting(true);
            const res = await vendorService.respondToInquiry(inquiry.id, {
                message: includeReply ? replyMessage : undefined,
                couponCode: includeCoupon ? coupon : undefined,
                discountValue: includeCoupon ? discountValue : undefined,
                discountType: includeCoupon ? discountType : undefined,
            });
            if (res.success) { toast.success(res.message || "Response sent"); onUpdate(); onClose(); }
            else toast.error(res.message || "Failed to send response");
        } catch { toast.error("An error occurred"); }
        finally { setIsSubmitting(false); }
    };

    const handleContactFailed = async () => {
        try {
            setIsSubmitting(true);
            const res = await vendorService.contactFailed(inquiry.id);
            if (res.success) { toast.success(res.message || "Customer notified"); onUpdate(); onClose(); }
            else toast.error(res.message || "Failed");
        } catch { toast.error("An error occurred"); }
        finally { setIsSubmitting(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-8" onClick={onClose}>
            <div className="flex w-full max-w-5xl max-h-[90vh] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#161616] animate-in fade-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5 dark:border-gray-800 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-lg">
                            {inquiry.name[0]}
                        </div>
                        <div>
                            <h2 className="font-plus-jakarta text-lg font-bold text-gray-900 dark:text-white">{inquiry.name}</h2>
                            <p className="font-plus-jakarta text-xs text-gray-400">{inquiry.email} {inquiry.phone && `• ${inquiry.phone}`}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-plus-jakarta text-[10px] font-bold uppercase tracking-widest ${inquiry.status === "OPEN" ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${inquiry.status === "OPEN" ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                            {inquiry.status === "OPEN" ? "Open" : "Resolved"}
                        </span>
                        <button onClick={onClose} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Body: 2-column grid */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-0 lg:gap-0 min-h-0">
                        {/* LEFT: Inquiry Info */}
                        <div className="flex flex-col gap-6 p-8 lg:border-r border-gray-100 dark:border-gray-800">
                            <div>
                                <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Subject / City</p>
                                <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                                    <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{inquiry.subject}</p>
                                </div>
                            </div>

                            <div>
                                <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Customer Message</p>
                                <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 min-h-[120px]">
                                    <p className="font-plus-jakarta text-sm leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{inquiry.message}</p>
                                </div>
                            </div>

                            {inquiry.phone && (
                                <div>
                                    <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Phone Number</p>
                                    <a href={`tel:${inquiry.phone}`} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-plus-jakarta text-sm font-semibold text-gray-700 shadow-sm border border-gray-100 hover:bg-amber-50 hover:border-amber-200 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                                        📞 {inquiry.phone}
                                    </a>
                                </div>
                            )}

                            {inquiry.submittedAt && (
                                <div className="flex items-center gap-2 text-gray-400">
                                    <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest">Submitted:</p>
                                    <p className="font-plus-jakarta text-xs">{format(new Date(inquiry.submittedAt), "MMM dd, yyyy 'at' HH:mm")}</p>
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

                        {/* RIGHT: Response Builder */}
                        <div className="flex flex-col gap-0 p-8">
                            {inquiry.status === "OPEN" && (
                                <>
                                    <div className="mb-6">
                                        <h3 className="font-plus-jakarta text-base font-bold text-gray-900 dark:text-white">Compose Response</h3>
                                        <p className="font-plus-jakarta text-xs text-gray-400 mt-1">Select the actions to include. Everything will be sent as a single email to {inquiry.email}.</p>
                                    </div>

                                    {contactFailedMode ? (
                                        /* Contact Failed Mode */
                                        <div className="flex flex-col gap-5">
                                            <div className="flex flex-col gap-3 rounded-2xl border-2 border-rose-300 p-6 bg-rose-50/50 dark:bg-rose-500/5 dark:border-rose-500/30">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-500/20">
                                                        <PhoneOff className="h-5 w-5 text-rose-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-plus-jakarta text-sm font-bold text-rose-800 dark:text-rose-300">Unable to Contact Customer</p>
                                                        <p className="font-plus-jakarta text-[10px] text-rose-600/70">Phone: {inquiry.phone}</p>
                                                    </div>
                                                </div>
                                                <p className="font-plus-jakarta text-xs text-gray-500 leading-relaxed mt-1">
                                                    An email will be sent to notify the customer that their phone number is unreachable and ask them to resubmit a new inquiry with correct contact information.
                                                </p>
                                            </div>

                                            <div className="flex gap-3">
                                                <button onClick={() => setContactFailedMode(false)}
                                                    className="flex-1 rounded-xl border border-gray-200 py-3 font-plus-jakarta text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all dark:border-gray-700 dark:text-gray-400">
                                                    Cancel
                                                </button>
                                                <button onClick={handleContactFailed} disabled={isSubmitting}
                                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 font-plus-jakarta text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50 transition-all">
                                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                                    Send Notification
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Normal Response Builder */
                                        <div className="flex flex-col gap-4">
                                            {/* Toggle: Reply Message */}
                                            <div className={`rounded-2xl border-2 transition-all ${includeReply ? "border-blue-300 bg-blue-50/30 dark:border-blue-500/30 dark:bg-blue-500/5" : "border-gray-100 bg-gray-50/30 dark:border-gray-800 dark:bg-gray-900/20"}`}>
                                                <button onClick={() => setIncludeReply(!includeReply)}
                                                    className="flex items-center gap-3 w-full p-4">
                                                    <div className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${includeReply ? "border-blue-500 bg-blue-500" : "border-gray-300 dark:border-gray-600"}`}>
                                                        {includeReply && <Check className="h-3 w-3 text-white" />}
                                                    </div>
                                                    <MessageSquare className={`h-4 w-4 ${includeReply ? "text-blue-600" : "text-gray-400"}`} />
                                                    <span className={`font-plus-jakarta text-sm font-bold ${includeReply ? "text-blue-700 dark:text-blue-400" : "text-gray-500"}`}>Include Reply Message</span>
                                                </button>
                                                {includeReply && (
                                                    <div className="px-4 pb-4">
                                                        <textarea value={replyMessage} onChange={e => setReplyMessage(e.target.value)} rows={3}
                                                            placeholder="Type your response to the customer..."
                                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-plus-jakarta text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 resize-none" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Toggle: Coupon */}
                                            <div className={`rounded-2xl border-2 transition-all ${includeCoupon ? "border-amber-300 bg-amber-50/30 dark:border-amber-500/30 dark:bg-amber-500/5" : "border-gray-100 bg-gray-50/30 dark:border-gray-800 dark:bg-gray-900/20"}`}>
                                                <button onClick={() => setIncludeCoupon(!includeCoupon)}
                                                    className="flex items-center gap-3 w-full p-4">
                                                    <div className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${includeCoupon ? "border-amber-500 bg-amber-500" : "border-gray-300 dark:border-gray-600"}`}>
                                                        {includeCoupon && <Check className="h-3 w-3 text-white" />}
                                                    </div>
                                                    <Tag className={`h-4 w-4 ${includeCoupon ? "text-amber-600" : "text-gray-400"}`} />
                                                    <span className={`font-plus-jakarta text-sm font-bold ${includeCoupon ? "text-amber-700 dark:text-amber-400" : "text-gray-500"}`}>Attach Compensation Coupon</span>
                                                </button>
                                                {includeCoupon && (
                                                    <div className="px-4 pb-4 space-y-3">
                                                        <div>
                                                            <label className="text-[9px] font-bold text-gray-400 uppercase mb-1 block">Coupon Code</label>
                                                            <input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="Ex: WELCOME10"
                                                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-mono text-sm uppercase focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900" />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <div className="flex-1">
                                                                <label className="text-[9px] font-bold text-gray-400 uppercase mb-1 block">Value</label>
                                                                <input type="number" value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))}
                                                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900" />
                                                            </div>
                                                            <div className="w-1/3">
                                                                <label className="text-[9px] font-bold text-gray-400 uppercase mb-1 block">Type</label>
                                                                <select value={discountType} onChange={(e) => setDiscountType(e.target.value as any)}
                                                                    className="w-full rounded-xl border border-gray-200 bg-white px-2 py-2.5 text-xs font-bold focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900">
                                                                    <option value="FIXED_AMOUNT">USD</option>
                                                                    <option value="PERCENTAGE">%</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Summary + Send */}
                                            {(includeReply || includeCoupon) && (
                                                <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 dark:bg-gray-900/50 dark:border-gray-800">
                                                    <p className="font-plus-jakarta text-[10px] text-gray-400 italic leading-relaxed">
                                                        📧 A single email will be sent to <strong>{inquiry.email}</strong> containing:
                                                        {includeReply && " your reply message"}
                                                        {includeReply && includeCoupon && " +"}
                                                        {includeCoupon && ` coupon ${coupon || "___"}`}.
                                                    </p>
                                                </div>
                                            )}

                                            <button onClick={handleSendResponse} disabled={isSubmitting || (!includeReply && !includeCoupon)}
                                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-plus-jakarta text-sm font-bold text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-40 dark:shadow-none">
                                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                                Send Response
                                            </button>

                                            {/* Divider */}
                                            <div className="flex items-center gap-3 my-1">
                                                <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                                                <span className="font-plus-jakarta text-[9px] font-bold text-gray-300 uppercase tracking-widest">or</span>
                                                <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                                            </div>

                                            {/* Contact Failed + Resolve */}
                                            <div className="flex gap-3">
                                                {inquiry.phone && (
                                                    <button onClick={() => setContactFailedMode(true)}
                                                        className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-rose-200 py-3 font-plus-jakarta text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all dark:border-rose-500/30 dark:hover:bg-rose-500/10">
                                                        <PhoneOff className="h-3.5 w-3.5" /> Can&apos;t Reach
                                                    </button>
                                                )}
                                                <button onClick={handleResolve} disabled={isSubmitting}
                                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 font-plus-jakarta text-xs font-bold text-white hover:bg-black disabled:opacity-50 transition-all dark:bg-white dark:text-black dark:hover:bg-gray-100">
                                                    <Check className="h-3.5 w-3.5" /> Resolve
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {inquiry.status === "RESOLVED" && (
                                <div className="flex flex-col gap-5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10">
                                            <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">Inquiry Resolved</p>
                                            <p className="font-plus-jakarta text-[10px] text-gray-400">All actions completed</p>
                                        </div>
                                    </div>

                                    {/* Activity Timeline */}
                                    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-gray-900/30">
                                        <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Activity History</p>
                                        {loadingActivity ? (
                                            <div className="flex items-center justify-center py-6">
                                                <Loader2 className="h-5 w-5 animate-spin text-gray-300" />
                                            </div>
                                        ) : activities.length === 0 ? (
                                            <p className="font-plus-jakarta text-xs text-gray-400 text-center py-4">No activity recorded.</p>
                                        ) : (
                                            <div className="space-y-0">
                                                {activities.filter(a => a.action !== "RESOLVE_INQUIRY").map((act, idx) => {
                                                    let parsed: any = {};
                                                    try { parsed = typeof act.details === "string" ? JSON.parse(act.details) : act.details || {}; } catch {}
                                                    
                                                    const actionConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
                                                        REPLY_INQUIRY: { label: "Replied", color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10", icon: <Send className="h-3 w-3" /> },
                                                        ASSIGN_COUPON: { label: "Coupon Sent", color: "text-amber-600 bg-amber-50 dark:bg-amber-500/10", icon: <Tag className="h-3 w-3" /> },
                                                        RESPOND_WITH_COUPON: { label: "Reply + Coupon", color: "text-violet-600 bg-violet-50 dark:bg-violet-500/10", icon: <Tag className="h-3 w-3" /> },
                                                        CONTACT_FAILED: { label: "Contact Failed", color: "text-rose-600 bg-rose-50 dark:bg-rose-500/10", icon: <PhoneOff className="h-3 w-3" /> },
                                                    };
                                                    const config = actionConfig[act.action] || { label: act.action, color: "text-gray-500 bg-gray-50", icon: <Clock className="h-3 w-3" /> };

                                                    return (
                                                        <div key={act.id || idx} className="flex gap-3 py-3 border-b border-gray-100 last:border-0 dark:border-gray-800">
                                                            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${config.color}`}>
                                                                {config.icon}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className={`font-plus-jakarta text-xs font-bold ${config.color.split(" ")[0]}`}>{config.label}</span>
                                                                    <span className="font-plus-jakarta text-[9px] text-gray-300">•</span>
                                                                    <span className="font-plus-jakarta text-[9px] text-gray-400">{act.actorName}</span>
                                                                </div>
                                                                {parsed?.replyMessage && (
                                                                    <p className="font-plus-jakarta text-xs text-gray-500 leading-relaxed truncate">
                                                                        &ldquo;{parsed.replyMessage}&rdquo;
                                                                    </p>
                                                                )}
                                                                {parsed?.couponCode && (
                                                                    <p className="font-plus-jakarta text-xs text-amber-600 font-mono font-bold">
                                                                        {parsed.couponCode} {parsed.discountValue ? `(${parsed.discountValue})` : ""}
                                                                    </p>
                                                                )}
                                                                {parsed?.reason && (
                                                                    <p className="font-plus-jakarta text-xs text-rose-500">
                                                                        {parsed.reason}
                                                                    </p>
                                                                )}
                                                                <p className="font-plus-jakarta text-[9px] text-gray-300 mt-1">
                                                                    {act.createdAt ? format(new Date(act.createdAt), "MMM dd, yyyy 'at' HH:mm") : ""}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
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
