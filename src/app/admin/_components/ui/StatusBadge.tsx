"use client";

type StatusKey =
    | "active" | "inactive" | "pending" | "approved" | "rejected"
    | "delivered" | "processing" | "cancelled" | "paid" | "expired"
    | "draft" | "refunded" | "in_review" | "shipped" | "verified" | "failed"
    | "checkout_initiated" | "payment_pending" | "payment_failed" | "deposit_pending"
    | "deposit_paid" | "awaiting_full_payment" | "confirmed" | "preparing"
    | "contact_failed" | "vendor_rejected" | "refunding" | "return_requested"
    | "return_approved" | "return_rejected" | "redelivering" | "redelivered";

const variants: Record<StatusKey, { cls: string; dot?: boolean }> = {
    active:      { cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400", dot: true },
    verified:    { cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
    approved:    { cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
    delivered:   { cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
    paid:        { cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
    pending:     { cls: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400", dot: true },
    in_review:   { cls: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
    processing:  { cls: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
    shipped:     { cls: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
    rejected:    { cls: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
    cancelled:   { cls: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
    failed:      { cls: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
    inactive:    { cls: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
    expired:     { cls: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" },
    draft:       { cls: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
    refunded:    { cls: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
    checkout_initiated: { cls: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" },
    payment_pending: { cls: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400", dot: true },
    payment_failed: { cls: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
    deposit_pending: { cls: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400", dot: true },
    deposit_paid: { cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
    awaiting_full_payment: { cls: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
    confirmed: { cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
    preparing: { cls: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
    contact_failed: { cls: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
    vendor_rejected: { cls: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
    refunding: { cls: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
    return_requested: { cls: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
    return_approved: { cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
    return_rejected: { cls: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
    redelivering: { cls: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
    redelivered: { cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
};

interface StatusBadgeProps {
    status: StatusKey | string;
    label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
    const variant = variants[status as StatusKey] ?? variants.inactive;
    const displayLabel = label ?? status.replace("_", " ");
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider ${variant.cls}`}>
            {variant.dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
            {displayLabel}
        </span>
    );
}
