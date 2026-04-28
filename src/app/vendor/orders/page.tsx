"use client";

import { useState, useEffect } from "react";
import {
    Clock,
    CheckCircle2,
    Package,
    Truck,
    ChevronRight,
    Upload,
    AlertCircle,
    X,
    Loader2,
    XCircle,
    LayoutGrid,
    List,
    Search,
    Filter,
    ArrowUpRight,
    ShoppingBag,
    Coins
} from "lucide-react";
import { vendorService } from "@/services/vendor.service";
import { adminService } from "@/services/admin.service";
import toast from "react-hot-toast";

// ─── Types ───────────────────────────────────────────────
type OrderStatus = "DEPOSIT_PAID" | "CONFIRMED" | "PREPARING" | "SHIP_PENDING";

const columns: { status: OrderStatus; label: string; icon: typeof Clock; color: string; badgeColor: string }[] = [
    { status: "DEPOSIT_PAID", label: "Awaiting Approval", icon: Clock, color: "border-amber-200 bg-amber-50/50 dark:border-amber-800/30 dark:bg-amber-900/10", badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300" },
    { status: "CONFIRMED", label: "Confirmed", icon: CheckCircle2, color: "border-blue-200 bg-blue-50/50 dark:border-blue-800/30 dark:bg-blue-900/10", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300" },
    { status: "PREPARING", label: "Preparing", icon: Package, color: "border-indigo-200 bg-indigo-50/50 dark:border-indigo-800/30 dark:bg-indigo-900/10", badgeColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300" },
    { status: "SHIP_PENDING", label: "Awaiting Pickup", icon: Truck, color: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/30 dark:bg-emerald-900/10", badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300" },
];

function formatUsd(n: number) {
    return new Intl.NumberFormat("en-US").format(n) + " $";
}

function getDaysLeft(deadline?: string): { text: string; urgent: boolean } {
    if (!deadline) return { text: "", urgent: false };
    const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
    if (diff < 0) return { text: "Overdue!", urgent: true };
    if (diff === 0) return { text: "Due today!", urgent: true };
    if (diff === 1) return { text: "1 day left", urgent: true };
    return { text: `${diff} days left`, urgent: false };
}

// ─── Modals ───────────────────────────────────────────────

function RejectModal({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: (reason: string) => Promise<void> }) {
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setReason("");
            setIsSubmitting(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold font-plus-jakarta text-gray-900 dark:text-white">Reject Order</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Please enter the rejection reason. The system will cancel the order and automatically refund the customer (if applicable).
                </p>

                <textarea
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 text-sm focus:border-red-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white mb-6 resize-none"
                    rows={4}
                    placeholder="Rejection reason..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                ></textarea>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm tracking-wide hover:bg-gray-50 transition-colors dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800">
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            if (!reason.trim()) {
                                toast.error("Please enter a reason.");
                                return;
                            }
                            setIsSubmitting(true);
                            await onConfirm(reason);
                            setIsSubmitting(false);
                        }}
                        disabled={!reason.trim() || isSubmitting}
                        className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm tracking-wide hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Rejection"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function DispatchPhotoModal({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: (photoUrls: string[]) => Promise<void> }) {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<{ url: string, type: string }[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // Reset when closed
    useEffect(() => {
        if (!isOpen) {
            setFiles([]);
            setPreviews([]);
            setIsUploading(false);
        }
    }, [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files || []);
        if (selected.length > 0) {
            setFiles(prev => [...prev, ...selected]);
            const newPreviews = selected.map(file => ({
                url: URL.createObjectURL(file),
                type: file.type.startsWith('video/') ? 'video' : 'image'
            }));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setIsUploading(true);
        const CLOUD_NAME = "dilzxumho";
        const UPLOAD_PRESET = "yash_unsigned";

        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", UPLOAD_PRESET);

                const resourceType = file.type.startsWith("video/") ? "video" : "image";
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to upload ${file.name}`);
                }

                const data = await response.json();
                return data.secure_url as string;
            });

            const uploadedUrls = await Promise.all(uploadPromises);

            await onConfirm(uploadedUrls);
            onClose();
        } catch (err: any) {
            console.error("Cloudinary upload error:", err);
            toast.error(err.message || "Error uploading files to Cloudinary");
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold font-plus-jakarta text-gray-900 dark:text-white">Dispatch Evidence</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Uploading product seal photos and packing videos (if any) is required. Multiple files can be selected.
                </p>

                <div className="mb-6 max-h-[300px] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative rounded-xl overflow-hidden aspect-video border-2 border-indigo-100 dark:border-indigo-900/30">
                                {preview.type === 'video' ? (
                                    <video src={preview.url} className="w-full h-full object-cover" controls />
                                ) : (
                                    <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
                                )}
                                <button
                                    onClick={() => removeFile(index)}
                                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-lg text-white backdrop-blur-sm transition-colors z-10"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        <label className={`flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-xl cursor-pointer border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 transition-colors ${previews.length === 0 ? "col-span-2" : ""}`}>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                <Upload className="w-8 h-8 mb-3 text-indigo-500" />
                                <p className="mb-1 text-xs font-semibold text-gray-700 dark:text-gray-300">Add Attachment</p>
                            </div>
                            <input type="file" multiple className="hidden" accept="image/*,video/*" capture="environment" onChange={handleFileChange} />
                        </label>
                    </div>
                </div>

                <div className="flex gap-3 mt-4">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm tracking-wide hover:bg-gray-50 transition-colors dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800">
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={files.length === 0 || isUploading}
                        className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm tracking-wide hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Upload"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function AssignShipperModal({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: (shipperId: string) => Promise<void> }) {
    const [shippers, setShippers] = useState<any[]>([]);
    const [selectedShipperId, setSelectedShipperId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            adminService.shippers.getAll()
                .then(res => {
                    if (res.success) {
                        // Filter active shippers only
                        setShippers(res.data.filter((s: any) => s.status === 1 || s.status === "ACTIVE" || s.isActive));
                    }
                })
                .catch(err => toast.error("Failed to load shippers"))
                .finally(() => setIsLoading(false));
        } else {
            setSelectedShipperId("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold font-plus-jakarta text-gray-900 dark:text-white">Assign Shipper</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Select an active courier to assign to this delivery. They will be notified immediately.
                </p>

                {isLoading ? (
                    <div className="flex justify-center p-4">
                        <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                    </div>
                ) : (
                    <select
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 text-sm focus:border-amber-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white mb-6"
                        value={selectedShipperId}
                        onChange={(e) => setSelectedShipperId(e.target.value)}
                    >
                        <option value="">-- Select a courier --</option>
                        {shippers.map(shipper => (
                            <option key={shipper.shipperId} value={shipper.shipperId}>
                                {shipper.fullName} ({shipper.email})
                            </option>
                        ))}
                    </select>
                )}

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm tracking-wide hover:bg-gray-50 transition-colors dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800">
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            if (!selectedShipperId) return;
                            setIsSubmitting(true);
                            await onConfirm(selectedShipperId);
                            setIsSubmitting(false);
                        }}
                        disabled={!selectedShipperId || isSubmitting}
                        className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-amber-600 text-white font-bold text-sm tracking-wide hover:bg-amber-700 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Assignment"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Order Card ────────────────────────────────────────────────
function OrderCard({
    order,
    onConfirm,
    onPrepare,
    onReject,
    onAssignShipper,
    isConfirming = false,
    isRejecting = false
}: {
    order: any;
    onConfirm: (id: string) => void;
    onPrepare: (id: string) => void;
    onReject: (id: string) => void;
    onAssignShipper?: (id: string) => void;
    isConfirming?: boolean;
    isRejecting?: boolean;
}) {
    // Determine deadline from remainingDueAt if exists (awaiting full payment Phase 3)
    let deadlineStr = "";
    if (order.status === "AWAITING_FULL_PAYMENT" && order.remainingDueAt) {
        deadlineStr = order.remainingDueAt;
    }
    const days = getDaysLeft(deadlineStr);

    // Map backend status to Kanban column mapping if needed, else directly use
    const displayProduct = order.items && order.items.length > 0 ? order.items[0].productName + (order.items.length > 1 ? ` (+${order.items.length - 1} items)` : "") : "No products";

    return (
        <div className="group flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-[#161616]">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <p className="font-plus-jakarta text-xs font-bold text-amber-700 dark:text-amber-400">{order.orderNumber}</p>
                    <p className="mt-0.5 font-plus-jakarta text-sm font-bold text-gray-900 truncate dark:text-white">{order.customerName}</p>
                </div>
                <a href={`tel:${order.shippingPhone}`} className="shrink-0 rounded-lg bg-gray-50 p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600 dark:bg-gray-800 dark:hover:bg-amber-500/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.06 2.2 2 2 0 012 .06h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" /></svg>
                </a>
            </div>

            <p className="font-plus-jakarta text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{displayProduct}</p>

            <div className="flex items-center justify-between">
                <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{formatUsd(order.totalAmount)}</span>
                {days.text && (
                    <span className={`flex items-center gap-1 font-plus-jakarta text-[10px] font-bold ${days.urgent ? "text-rose-600 dark:text-rose-400" : "text-gray-400"}`}>
                        {days.urgent && <AlertCircle className="h-3 w-3" />}
                        {days.text}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-1.5 rounded-lg bg-gray-50/50 p-2.5 dark:bg-white/5">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Deposit Paid</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{formatUsd(order.depositAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Remaining</span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{formatUsd(order.remainingAmount)}</span>
                </div>
            </div>

            {order.status === "DEPOSIT_PAID" && (
                <div className="flex w-full gap-2 mt-1">
                    <button
                        onClick={() => onReject(order.orderId)}
                        disabled={isConfirming || isRejecting}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 px-2 py-2 font-plus-jakarta text-xs font-bold transition-all hover:bg-red-100 active:scale-95 dark:bg-red-500/10 dark:border-red-900/50 dark:text-red-400 disabled:opacity-50"
                    >
                        {isRejecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                        Reject
                    </button>
                    <button
                        onClick={() => onConfirm(order.orderId)}
                        disabled={isConfirming || isRejecting}
                        className="flex-[2] flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-3 py-2 font-plus-jakarta text-xs font-bold text-white transition-all hover:bg-amber-700 active:scale-95 disabled:opacity-50"
                    >
                        {isConfirming ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                        Confirm
                    </button>
                </div>
            )}
            {["CONFIRMED", "AWAITING_FULL_PAYMENT", "FULLY_PAID"].includes(order.status) && (
                <div className="flex w-full items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 font-plus-jakarta text-xs font-bold text-blue-700 dark:border-blue-800/30 dark:bg-blue-500/10 dark:text-blue-300">
                    {order.status === "CONFIRMED" ? "Confirmed (Awaiting system routing)" :
                        order.status === "AWAITING_FULL_PAYMENT" ? "Awaiting Customer Final Payment" :
                            "Fully Paid"}
                </div>
            )}
            {order.status === "PREPARING" && (
                <button
                    onClick={() => onPrepare(order.orderId)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 font-plus-jakarta text-xs font-bold text-indigo-700 transition-all hover:bg-indigo-100 active:scale-95 dark:border-indigo-800/30 dark:bg-indigo-500/10 dark:text-indigo-300"
                >
                    <Upload className="h-3.5 w-3.5" />
                    Upload Photo
                </button>
            )}
            {order.status === "SHIP_PENDING" && onAssignShipper && (
                <button
                    onClick={() => onAssignShipper(order.orderId)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 font-plus-jakarta text-xs font-bold text-white transition-all hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-500/20"
                >
                    <Truck className="h-3.5 w-3.5" />
                    Assign Courier
                </button>
            )}
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────────
export default function VendorOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
    const [assignOrderId, setAssignOrderId] = useState<string | null>(null);
    const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
    const [processingAction, setProcessingAction] = useState<"confirm" | "reject" | null>(null);
    const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
    const [searchQuery, setSearchQuery] = useState("");

    const loadOrders = async () => {
        try {
            setIsLoading(true);
            const res = await vendorService.getOrders();
            if (res.success && res.data) {
                setOrders(res.data);
            }
        } catch (error) {
            console.error("Failed to load orders", error);
            toast.error("Failed to load orders");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleConfirm = async (id: string) => {
        try {
            setProcessingOrderId(id);
            setProcessingAction("confirm");
            const toastId = toast.loading("Confirming...");
            const res = await vendorService.makeDecision(id, true);
            if (res.success) {
                toast.success("Order confirmed!", { id: toastId });
                loadOrders(); // Refresh
            } else {
                toast.error(res.message || "Error", { id: toastId });
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Unexpected error");
        } finally {
            setProcessingOrderId(null);
            setProcessingAction(null);
        }
    };

    const handlePrepareClick = (id: string) => {
        setSelectedOrderId(id);
    };

    const handleRejectClick = (id: string) => {
        setRejectOrderId(id);
    };

    const handleRejectSubmit = async (reason: string) => {
        if (!rejectOrderId) return;
        try {
            setProcessingOrderId(rejectOrderId);
            setProcessingAction("reject");
            const toastId = toast.loading("Rejecting order...");
            const res = await vendorService.makeDecision(rejectOrderId, false, reason);
            if (res.success) {
                toast.success("Order rejected!", { id: toastId });
                setRejectOrderId(null);
                loadOrders(); // Refresh
            } else {
                toast.error(res.message || "Error", { id: toastId });
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Unexpected error");
        } finally {
            setProcessingOrderId(null);
            setProcessingAction(null);
        }
    };

    const handleDispatchConfirmed = async (photoUrls: string[]) => {
        if (!selectedOrderId) return;
        try {
            const res = await vendorService.dispatchOrder(selectedOrderId, photoUrls);
            if (res.success) {
                toast.success("Dispatch successful! QR code sent to customer.");
                loadOrders();
            } else {
                toast.error(res.message || "Upload error");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Connection error");
        }
    };

    const handleAssignShipperSubmit = async (shipperId: string) => {
        if (!assignOrderId) return;
        try {
            const toastId = toast.loading("Assigning courier...");
            const res = await vendorService.assignShipper(assignOrderId, shipperId);
            if (res.success) {
                toast.success("Courier assigned successfully!", { id: toastId });
                setAssignOrderId(null);
                loadOrders();
            } else {
                toast.error(res.message || "Assignment failed", { id: toastId });
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Unexpected error");
        }
    };

    // Calculate Stats
    const stats = {
        pendingApproval: orders.filter(o => o.status === "DEPOSIT_PAID").length,
        processing: orders.filter(o => ["CONFIRMED", "PREPARING"].includes(o.status)).length,
        readyToShip: orders.filter(o => o.status === "SHIP_PENDING").length,
        totalValue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    };

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header & Stats Section */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-gradient-amber">
                        Order Management Center
                    </h1>
                    <p className="font-plus-jakarta text-sm text-gray-500 dark:text-gray-400">
                        Monitor, approve and track your store's fulfillment process
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: "Pending Approval", value: stats.pendingApproval, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                        { label: "In Preparation", value: stats.processing, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "Ready to Ship", value: stats.readyToShip, icon: Truck, color: "text-emerald-600", bg: "bg-emerald-50" },
                        { label: "Total Volume", value: formatUsd(stats.totalValue), icon: Coins, color: "text-indigo-600", bg: "bg-indigo-50" }
                    ].map((card, i) => (
                        <div key={i} className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white/70 p-5 shadow-sm backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70 transition-all hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} dark:bg-opacity-10`}>
                                    <card.icon className={`h-5 w-5 ${card.color}`} />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-gray-300" />
                            </div>
                            <div>
                                <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                                    {card.label}
                                </p>
                                <p className="mt-1 font-plus-jakarta text-2xl font-bold text-gray-900 dark:text-white">
                                    {card.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search order ID, customer name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-gray-100 bg-white/70 py-2.5 pl-11 pr-4 font-plus-jakarta text-sm backdrop-blur-md focus:border-amber-500 focus:outline-none dark:border-gray-800/50 dark:bg-[#111]/70"
                    />
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white/50 p-1 dark:border-gray-800/50 dark:bg-[#111]/50">
                    <button
                        onClick={() => setViewMode("kanban")}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 font-plus-jakarta text-xs font-bold transition-all ${viewMode === "kanban" ? "bg-amber-600 text-white shadow-md shadow-amber-200" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                    >
                        <LayoutGrid className="h-3.5 w-3.5" />
                        Kanban
                    </button>
                    <button
                        onClick={() => setViewMode("table")}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 font-plus-jakarta text-xs font-bold transition-all ${viewMode === "table" ? "bg-amber-600 text-white shadow-md shadow-amber-200" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                    >
                        <List className="h-3.5 w-3.5" />
                        Table
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
                        <p className="font-plus-jakarta text-sm font-medium text-gray-500 animate-pulse">Synchronizing order data...</p>
                    </div>
                </div>
            ) : (
                <div className="transition-all duration-300">
                    {viewMode === "kanban" ? (
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4 lg:grid-cols-2">
                            {columns.map((col) => {
                                const colOrders = orders.filter((o) => {
                                    const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
                                    if (!matchesSearch) return false;

                                    if (col.status === "CONFIRMED") {
                                        return ["CONFIRMED", "AWAITING_FULL_PAYMENT", "FULLY_PAID"].includes(o.status);
                                    }
                                    if (col.status === "SHIP_PENDING") {
                                        return ["SHIP_PENDING", "SHIPPED"].includes(o.status);
                                    }
                                    return o.status === col.status;
                                });
                                const ColIcon = col.icon;
                                return (
                                    <div key={col.status} className={`flex flex-col gap-4 rounded-2xl border p-5 bg-opacity-40 backdrop-blur-sm ${col.color}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded-lg bg-white shadow-sm dark:bg-gray-900`}>
                                                    <ColIcon className="h-4 w-4 text-amber-600" />
                                                </div>
                                                <span className="font-plus-jakarta text-sm font-bold text-gray-800 dark:text-gray-200">
                                                    {col.label}
                                                </span>
                                            </div>
                                            <span className={`rounded-full px-2.5 py-0.5 font-plus-jakarta text-[10px] font-bold ${col.badgeColor}`}>
                                                {colOrders.length}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-4 min-h-[200px]">
                                            {colOrders.length === 0 ? (
                                                <div className="flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200/50 py-12 dark:border-gray-800/50">
                                                    <ShoppingBag className="h-8 w-8 text-gray-200 mb-2" />
                                                    <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-300">No active orders</p>
                                                </div>
                                            ) : (
                                                colOrders.map((order) => (
                                                    <OrderCard
                                                        key={order.orderId}
                                                        order={order}
                                                        onConfirm={handleConfirm}
                                                        onPrepare={handlePrepareClick}
                                                        onReject={handleRejectClick}
                                                        onAssignShipper={(id) => setAssignOrderId(id)}
                                                        isConfirming={processingOrderId === order.orderId && processingAction === "confirm"}
                                                        isRejecting={processingOrderId === order.orderId && processingAction === "reject"}
                                                    />
                                                ))
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Table View Implementation */
                        <div className="rounded-2xl border border-gray-100 bg-white/70 shadow-sm backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full whitespace-nowrap text-left text-sm">
                                    <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                                        <tr>
                                            {["Order Details", "Client", "Fulfillment Status", "Financials", "Created At", ""].map((h) => (
                                                <th key={h} className="px-8 py-5 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                                        {orders.filter(o =>
                                            o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            o.customerName.toLowerCase().includes(searchQuery.toLowerCase())
                                        ).map((order) => (
                                            <tr key={order.orderId} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                                <td className="px-8 py-5">
                                                    <p className="font-plus-jakarta text-sm font-bold text-amber-600">{order.orderNumber}</p>
                                                    <p className="mt-1 font-plus-jakarta text-xs text-gray-400">
                                                        {order.items?.length || 0} items in order
                                                    </p>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{order.customerName}</p>
                                                    <p className="mt-1 font-plus-jakarta text-xs text-gray-500">{order.shippingPhone}</p>
                                                </td>
                                                <td className="px-8 py-5">
                                                    {/* Using the same status logic as Kanban but in table format */}
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-2 w-2 rounded-full ${order.status === "DEPOSIT_PAID" ? "bg-amber-500" :
                                                            order.status === "SHIP_PENDING" ? "bg-emerald-500" : "bg-blue-500"
                                                            } animate-pulse`} />
                                                        <span className="font-plus-jakarta text-xs font-bold text-gray-700 dark:text-gray-300">{order.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{formatUsd(order.totalAmount)}</p>
                                                    <p className="mt-1 font-plus-jakarta text-[10px] text-gray-400 uppercase tracking-wider">Total Value</p>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="font-plus-jakarta text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                    <p className="mt-1 font-plus-jakarta text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button
                                                        onClick={() => { /* Detail view link */ }}
                                                        className="rounded-lg p-2 text-gray-400 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 transition-all"
                                                    >
                                                        <ChevronRight className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Legend & Modals */}
            <div className="flex flex-wrap gap-4 mt-4 px-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-100 bg-white/50 dark:border-gray-800/50">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                    <span className="font-plus-jakarta text-[10px] font-bold text-gray-500 uppercase tracking-widest">Process Flow:</span>
                </div>
                {columns.map((col) => {
                    const Icon = col.icon;
                    return (
                        <div key={col.status} className="flex items-center gap-1.5">
                            <Icon className="h-3.5 w-3.5 text-gray-300" />
                            <span className="font-plus-jakarta text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                {col.label}
                            </span>
                            <ChevronRight className="h-3 w-3 text-gray-200" />
                        </div>
                    );
                })}
            </div>

            <DispatchPhotoModal
                isOpen={!!selectedOrderId}
                onClose={() => setSelectedOrderId(null)}
                onConfirm={handleDispatchConfirmed}
            />

            <RejectModal
                isOpen={!!rejectOrderId}
                onClose={() => setRejectOrderId(null)}
                onConfirm={handleRejectSubmit}
            />

            <AssignShipperModal
                isOpen={!!assignOrderId}
                onClose={() => setAssignOrderId(null)}
                onConfirm={handleAssignShipperSubmit}
            />
        </div>
    );
}
