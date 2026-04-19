"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle2, Package, Truck, ChevronRight, Upload, AlertCircle, X, Loader2, XCircle } from "lucide-react";
import { vendorService } from "@/services/vendor.service";
import toast from "react-hot-toast";

// ─── Types ───────────────────────────────────────────────
type OrderStatus = "DEPOSIT_PAID" | "CONFIRMED" | "PREPARING" | "SHIPPED";

const columns: { status: OrderStatus; label: string; icon: typeof Clock; color: string; badgeColor: string }[] = [
    { status: "DEPOSIT_PAID", label: "Chờ Duyệt", icon: Clock, color: "border-amber-200 bg-amber-50/50 dark:border-amber-800/30 dark:bg-amber-900/10", badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300" },
    { status: "CONFIRMED", label: "Đã Xác Nhận", icon: CheckCircle2, color: "border-blue-200 bg-blue-50/50 dark:border-blue-800/30 dark:bg-blue-900/10", badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300" },
    { status: "PREPARING", label: "Đang Đóng Gói", icon: Package, color: "border-indigo-200 bg-indigo-50/50 dark:border-indigo-800/30 dark:bg-indigo-900/10", badgeColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300" },
    { status: "SHIPPED", label: "Đã Giao Shipper", icon: Truck, color: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/30 dark:bg-emerald-900/10", badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300" },
];

function formatVnd(n: number) {
    return new Intl.NumberFormat("vi-VN").format(n) + " ₫";
}

function getDaysLeft(deadline?: string): { text: string; urgent: boolean } {
    if (!deadline) return { text: "", urgent: false };
    const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
    if (diff < 0) return { text: "Quá hạn!", urgent: true };
    if (diff === 0) return { text: "Hết hạn hôm nay!", urgent: true };
    if (diff === 1) return { text: "Còn 1 ngày", urgent: true };
    return { text: `Còn ${diff} ngày`, urgent: false };
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
                    <h3 className="text-lg font-bold font-plus-jakarta text-gray-900 dark:text-white">Từ Chối Đơn Hàng</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Vui lòng nhập lý do từ chối. Hệ thống sẽ huỷ đơn và tự động hoàn trả thanh toán cho khách hàng (nếu có).
                </p>

                <textarea
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 text-sm focus:border-red-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white mb-6 resize-none"
                    rows={4}
                    placeholder="Lý do từ chối..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                ></textarea>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm tracking-wide hover:bg-gray-50 transition-colors dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800">
                        Hủy Bỏ
                    </button>
                    <button 
                        onClick={async () => {
                            if(!reason.trim()) {
                                toast.error("Vui lòng nhập lý do.");
                                return;
                            }
                            setIsSubmitting(true);
                            await onConfirm(reason);
                            setIsSubmitting(false);
                        }}
                        disabled={!reason.trim() || isSubmitting}
                        className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm tracking-wide hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Xác Nhận Từ Chối"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function DispatchPhotoModal({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: (photoUrls: string[]) => Promise<void> }) {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<{url: string, type: string}[]>([]);
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
        // Simulate upload to Cloudinary (progress bar effect)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500)); 
            
            // Generate distinct fake URLs based on file type
            const uploadedUrls = files.map(file => {
                if (file.type.startsWith('video/')) {
                    return `https://res.cloudinary.com/demo/video/upload/v1/${file.name.replace(/[^a-zA-Z0-9]/g, "")}.mp4`;
                }
                return `https://res.cloudinary.com/demo/image/upload/v1/${file.name.replace(/[^a-zA-Z0-9]/g, "")}.jpg`;
            });
            
            await onConfirm(uploadedUrls);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold font-plus-jakarta text-gray-900 dark:text-white">Bằng Chứng Xuất Kho</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Bắt buộc tải lên ảnh niêm phong sản phẩm và video đóng gói (nếu có). Có thể chọn nhiều tệp cùng lúc.
                </p>

                <div className="mb-6 max-h-[300px] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative rounded-xl overflow-hidden aspect-video border-2 border-indigo-100 dark:border-indigo-900/30">
                                {preview.type === 'video' ? (
                                    <video src={preview.url} className="w-full h-full object-cover" controls/>
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
                        
                        <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-xl cursor-pointer border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                <Upload className="w-8 h-8 mb-3 text-indigo-500" />
                                <p className="mb-1 text-xs font-semibold text-gray-700 dark:text-gray-300">Thêm Tệp Đính Kèm</p>
                            </div>
                            <input type="file" multiple className="hidden" accept="image/*,video/*" capture="environment" onChange={handleFileChange} />
                        </label>
                    </div>
                </div>

                <div className="flex gap-3 mt-4">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm tracking-wide hover:bg-gray-50 transition-colors dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800">
                        Hủy Bỏ
                    </button>
                    <button 
                        onClick={handleUpload}
                        disabled={files.length === 0 || isUploading}
                        className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm tracking-wide hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Xác Nhận Xuất Kho"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Order Card ────────────────────────────────────────────────
function OrderCard({ order, onConfirm, onPrepare, onReject }: { order: any; onConfirm: (id: string) => void; onPrepare: (id: string) => void; onReject: (id: string) => void }) {
    // Determine deadline from remainingDueAt if exists (awaiting full payment Phase 3)
    let deadlineStr = "";
    if (order.status === "AWAITING_FULL_PAYMENT" && order.remainingDueAt) {
        deadlineStr = order.remainingDueAt;
    }
    const days = getDaysLeft(deadlineStr);
    
    // Map backend status to Kanban column mapping if needed, else directly use
    const displayProduct = order.items && order.items.length > 0 ? order.items[0].productName + (order.items.length > 1 ? ` (+${order.items.length - 1} sp)` : "") : "Không có SP";

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
                <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{formatVnd(order.totalAmount)}</span>
                {days.text && (
                    <span className={`flex items-center gap-1 font-plus-jakarta text-[10px] font-bold ${days.urgent ? "text-rose-600 dark:text-rose-400" : "text-gray-400"}`}>
                        {days.urgent && <AlertCircle className="h-3 w-3" />}
                        {days.text}
                    </span>
                )}
            </div>

            {order.status === "DEPOSIT_PAID" && (
                <div className="flex w-full gap-2 mt-1">
                    <button
                        onClick={() => onReject(order.orderId)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 px-2 py-2 font-plus-jakarta text-xs font-bold transition-all hover:bg-red-100 active:scale-95 dark:bg-red-500/10 dark:border-red-900/50 dark:text-red-400"
                    >
                        <XCircle className="h-3.5 w-3.5" />
                        Từ Chối
                    </button>
                    <button
                        onClick={() => onConfirm(order.orderId)}
                        className="flex-[2] flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-3 py-2 font-plus-jakarta text-xs font-bold text-white transition-all hover:bg-amber-700 active:scale-95"
                    >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Xác Nhận
                    </button>
                </div>
            )}
            {["CONFIRMED", "AWAITING_FULL_PAYMENT", "FULLY_PAID"].includes(order.status) && (
                <div className="flex w-full items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 font-plus-jakarta text-xs font-bold text-blue-700 dark:border-blue-800/30 dark:bg-blue-500/10 dark:text-blue-300">
                    {order.status === "CONFIRMED" ? "Đã Xác Nhận (Chờ hệ thống định tuyến)" :
                     order.status === "AWAITING_FULL_PAYMENT" ? "Đang Chờ Khách Trả Nốt Gói" :
                     "Đã Thanh Toán Đủ"}
                </div>
            )}
            {order.status === "PREPARING" && (
                <button
                    onClick={() => onPrepare(order.orderId)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 font-plus-jakarta text-xs font-bold text-indigo-700 transition-all hover:bg-indigo-100 active:scale-95 dark:border-indigo-800/30 dark:bg-indigo-500/10 dark:text-indigo-300"
                >
                    <Upload className="h-3.5 w-3.5" />
                    Upload Ảnh Xuất Kho
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

    const loadOrders = async () => {
        try {
            setIsLoading(true);
            const res = await vendorService.getOrders();
            if (res.success && res.data) {
                setOrders(res.data);
            }
        } catch (error) {
            console.error("Failed to load orders", error);
            toast.error("Không thể tải đơn hàng");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleConfirm = async (id: string) => {
        try {
            const toastId = toast.loading("Đang xác nhận...");
            const res = await vendorService.makeDecision(id, true);
            if (res.success) {
                toast.success("Đã xác nhận đơn hàng!", { id: toastId });
                loadOrders(); // Refresh
            } else {
                toast.error(res.message || "Lỗi", { id: toastId });
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Lỗi ngoại lệ");
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
            const toastId = toast.loading("Đang từ chối đơn...");
            const res = await vendorService.makeDecision(rejectOrderId, false, reason);
            if (res.success) {
                toast.success("Đã từ chối đơn hàng!", { id: toastId });
                setRejectOrderId(null);
                loadOrders(); // Refresh
            } else {
                toast.error(res.message || "Lỗi", { id: toastId });
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Lỗi ngoại lệ");
        }
    };

    const handleDispatchConfirmed = async (photoUrls: string[]) => {
        if (!selectedOrderId) return;
        try {
            const res = await vendorService.dispatchOrder(selectedOrderId, photoUrls);
            if (res.success) {
                toast.success("Xuất kho thành công! Đã gửi QR cho khách.");
                loadOrders();
            } else {
                toast.error(res.message || "Lỗi upload");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Lỗi kết nối");
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
                <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Quản Lý Đơn Hàng
                </h1>
                <p className="mt-1 font-plus-jakarta text-sm text-gray-500 dark:text-gray-400">
                    Bảng điều khiển trạng thái tiến trình chuẩn bị hàng (Real-time).
                </p>
            </div>

            {/* Kanban Board */}
            {isLoading ? (
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-4 lg:grid-cols-2">
                    {columns.map((col) => {
                        const colOrders = orders.filter((o) => {
                            if (col.status === "CONFIRMED") {
                                return ["CONFIRMED", "AWAITING_FULL_PAYMENT", "FULLY_PAID"].includes(o.status);
                            }
                            return o.status === col.status;
                        });
                        const ColIcon = col.icon;
                        return (
                            <div key={col.status} className={`flex flex-col gap-3 rounded-2xl border p-4 ${col.color}`}>
                                {/* Column Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ColIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        <span className="font-plus-jakarta text-sm font-bold text-gray-700 dark:text-gray-300">
                                            {col.label}
                                        </span>
                                    </div>
                                    <span className={`rounded-full px-2 py-0.5 font-plus-jakarta text-xs font-bold ${col.badgeColor}`}>
                                        {colOrders.length}
                                    </span>
                                </div>

                                {/* Order Cards */}
                                <div className="flex flex-col gap-3 min-h-[120px]">
                                    {colOrders.length === 0 ? (
                                        <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-10 dark:border-gray-700 bg-white/40 dark:bg-black/20">
                                            <p className="font-plus-jakarta text-xs text-gray-400">Trống</p>
                                        </div>
                                    ) : (
                                        colOrders.map((order) => (
                                            <OrderCard
                                                key={order.orderId}
                                                order={order}
                                                onConfirm={handleConfirm}
                                                onPrepare={handlePrepareClick}
                                                onReject={handleRejectClick}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap gap-3">
                {columns.map((col) => {
                    const Icon = col.icon;
                    return (
                        <div key={col.status} className="flex items-center gap-1.5">
                            <Icon className="h-3.5 w-3.5 text-gray-400" />
                            <span className="font-plus-jakarta text-xs text-gray-500 dark:text-gray-400">
                                {col.label}
                            </span>
                            <ChevronRight className="h-3 w-3 text-gray-300" />
                        </div>
                    );
                })}
            </div>

            {/* Photo Upload Modal */}
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
        </div>
    );
}
