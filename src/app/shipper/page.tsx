"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Phone, MapPin, CheckCircle2, Package,
    ChevronRight, Search, Loader2, RefreshCw, Truck
} from "lucide-react";
import { shipperService, ShipperOrderDto } from "@/services/shipper.service";
import toast from "react-hot-toast";

// ─── Status Config ─────────────────────────────────────────────
const statusConfig: Record<string, { label: string; className: string; dot: string }> = {
    SHIP_PENDING: { label: "Sẵn Sàng Giao", className: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300", dot: "bg-indigo-500 animate-pulse" },
    SHIPPED: { label: "Đang Giao", className: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300", dot: "bg-blue-500 animate-pulse" },
    DELIVERED: { label: "Đã Giao", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300", dot: "bg-emerald-500" },
    COMPLETED: { label: "Hoàn Thành", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300", dot: "bg-emerald-500" },
    RETURN_REQUESTED: { label: "Có Cố Cáo", className: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300", dot: "bg-rose-500" },
};

function formatVnd(n: number) {
    return new Intl.NumberFormat("vi-VN").format(n) + " ₫";
}

// ─── Trip Card ────────────────────────────────────────────────
function TripCard({ order, onAccept }: { order: ShipperOrderDto; onAccept: (id: string) => void }) {
    const cfg = statusConfig[order.status] || { label: order.status, className: "bg-gray-50 text-gray-700", dot: "bg-gray-500" };
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.shippingAddress)}`;

    // Fallback schedule display
    const scheduledTime = new Date(order.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#111]">
            {/* Header row */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${cfg.className}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                        </span>
                        {order.isCod && (
                            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                                COD
                            </span>
                        )}
                        {order.insuranceType === "Full" && (
                            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                                BẢO HIỂM 100%
                            </span>
                        )}
                    </div>
                    <p className="font-plus-jakarta text-base font-bold text-gray-900 dark:text-white">{order.shippingName || order.customerName}</p>
                </div>
                <div className="text-right">
                    <p className="font-plus-jakarta text-[10px] font-semibold uppercase tracking-wider text-gray-400">Order</p>
                    <p className="font-plus-jakarta text-sm font-black text-teal-700 dark:text-teal-400">{order.orderNumber}</p>
                </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-2 rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                <div>
                    <p className="font-plus-jakarta text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{order.shippingAddress || "Chưa cập nhật địa chỉ"}</p>
                </div>
            </div>

            {/* Amount + actions */}
            <div className="flex items-center justify-between mt-1">
                <div>
                    <p className="font-plus-jakarta text-[10px] uppercase tracking-wider text-gray-400">Tổng Thu</p>
                    {/* For COD, show remaining amount. Else 0 */}
                    <p className="font-plus-jakarta text-base font-black text-gray-900 dark:text-white">
                        {order.isCod ? formatVnd(order.remainingAmount) : "0 ₫"}
                    </p>
                </div>
                <div className="flex items-center flex-wrap justify-end gap-2 shrink-0">
                    <a
                        href={`tel:${order.shippingPhone}`}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-teal-700 transition-all active:scale-95 dark:border-teal-800/30 dark:bg-teal-500/10 dark:text-teal-400"
                    >
                        <Phone className="h-4 w-4" />
                    </a>
                    <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700 transition-all active:scale-95 dark:border-blue-800/30 dark:bg-blue-500/10 dark:text-blue-400"
                    >
                        <MapPin className="h-4 w-4" />
                    </a>
                    {order.status === "SHIP_PENDING" && (
                        <button
                            onClick={() => onAccept(order.orderId)}
                            className="flex h-10 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 font-plus-jakarta text-xs font-bold text-white transition-all active:scale-95 hover:bg-indigo-700 ml-1"
                        >
                            Nhận Đơn <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                    )}
                    {order.status === "SHIPPED" && (
                        <Link
                            href={`/shipper/scanner?orderId=${order.orderId}`}
                            className="flex h-10 items-center gap-1.5 rounded-xl bg-teal-600 px-4 font-plus-jakarta text-xs font-bold text-white transition-all active:scale-95 hover:bg-teal-700 ml-1"
                        >
                            Giao hàng <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                    )}
                    {order.status === "DELIVERED" || order.status === "COMPLETED" ? (
                        <span className="flex h-10 items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-100 px-4 font-plus-jakarta text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-900 dark:text-emerald-400 ml-1">
                            <CheckCircle2 className="h-4 w-4" /> Xong
                        </span>
                    ) : null}
                </div>
            </div>
            
            {/* Warning if QR is not active */}
            {order.status === "SHIPPED" && !order.qrActive && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-100 text-xs font-medium text-rose-700 dark:bg-rose-500/10 dark:border-rose-900 dark:text-rose-400 flex justify-between items-center">
                    Mã QR khách hàng đã hết hạn (2h).
                    <button 
                        onClick={() => {
                            toast.promise(shipperService.resendQrCode(order.orderId), {
                                loading: "Gửi lại...",
                                success: "Đã gửi mã mới cho khách!",
                                error: "Gửi thất bại. Rate limit 3 lần/giờ."
                            });
                        }}
                        className="text-[10px] bg-rose-600 hover:bg-rose-700 text-white px-2 py-1 flex items-center gap-1 rounded"
                    >
                        <RefreshCw className="w-3 h-3" /> Gửi lại
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────
export default function ShipperHomePage() {
    const [orders, setOrders] = useState<ShipperOrderDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<"ALL" | "SHIP_PENDING" | "SHIPPED" | "DELIVERED">("ALL");
    const [search, setSearch] = useState("");

    const handleAccept = async (orderId: string) => {
        try {
            const toastId = toast.loading("Đang nhận đơn...");
            const res = await shipperService.acceptOrder(orderId);
            if (res.success) {
                toast.success("Nhận đơn thành công! Khách hàng đã được thông báo.", { id: toastId });
                loadOrders();
            } else {
                toast.error(res.message || "Lỗi khi nhận", { id: toastId });
            }
        } catch (error) {
             toast.error("Lỗi ngoại lệ.");
        }
    };

    const loadOrders = async () => {
        try {
            setIsLoading(true);
            const res = await shipperService.getAssignedDeliveries();
            if (res.success && res.data) {
                setOrders(res.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi tải danh sách đơn hàng.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const pendingCount = orders.filter((o) => ["SHIP_PENDING", "SHIPPED"].includes(o.status)).length;
    const deliveredCount = orders.filter((o) => o.status === "DELIVERED" || o.status === "COMPLETED").length;
    const totalCount = orders.length;

    const filtered = orders.filter((o) => {
        const matchFilter = activeFilter === "ALL" || 
            (activeFilter === "DELIVERED" ? (o.status === "DELIVERED" || o.status === "COMPLETED") : o.status === activeFilter);
        const term = search.toLowerCase();
        const matchSearch = 
            (o.shippingName || o.customerName).toLowerCase().includes(term) || 
            (o.shippingAddress || "").toLowerCase().includes(term) ||
            o.orderNumber.toLowerCase().includes(term);
        return matchFilter && matchSearch;
    });

    return (
        <div className="flex flex-col gap-4 p-4">
            {/* Hero Stats */}
            <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 p-5 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20"><Truck className="w-24 h-24" /></div>
                
                <p className="font-plus-jakarta text-xs font-bold uppercase tracking-widest opacity-80 relative z-10">Ca Của Bạn</p>
                <div className="mt-2 flex items-end gap-3 relative z-10">
                    <span className="font-plus-jakarta text-6xl font-black leading-none">{pendingCount}</span>
                    <span className="mb-2 font-plus-jakarta text-sm font-semibold opacity-80">đơn cần giao</span>
                </div>
                <div className="mt-4 flex items-center gap-4 border-t border-white/20 pt-4 relative z-10">
                    <div>
                        <p className="font-plus-jakarta text-2xl font-black">{deliveredCount}</p>
                        <p className="font-plus-jakarta text-[10px] uppercase tracking-wider opacity-70">Đã Giao</p>
                    </div>
                    <div className="h-8 w-px bg-white/20" />
                    <div>
                        <p className="font-plus-jakarta text-2xl font-black">{totalCount}</p>
                        <p className="font-plus-jakarta text-[10px] uppercase tracking-wider opacity-70">Tổng</p>
                    </div>
                    <div className="h-8 w-px bg-white/20" />
                    <div>
                        <p className="font-plus-jakarta text-2xl font-black">
                            {totalCount > 0 ? Math.round((deliveredCount / totalCount) * 100) : 0}%
                        </p>
                        <p className="font-plus-jakarta text-[10px] uppercase tracking-wider opacity-70">Tỷ Lệ</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm tên KH, địa chỉ, mã đơn..."
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 font-plus-jakarta text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-gray-700 dark:bg-[#111]"
                />
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {([["ALL", "Tất Cả"], ["SHIP_PENDING", "Chờ Nhận"], ["SHIPPED", "Đang Giao"], ["DELIVERED", "Đã Giao"]] as const).map(([val, label]) => (
                    <button
                        key={val}
                        onClick={() => setActiveFilter(val)}
                        className={`shrink-0 rounded-full px-4 py-2 font-plus-jakarta text-xs font-bold transition-all ${activeFilter === val ? "bg-teal-600 text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200 dark:border-gray-700 dark:bg-[#111]"}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Trip List */}
            <div className="flex flex-col gap-3">
                {isLoading ? (
                    <div className="py-16 flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-16 text-center font-plus-jakarta text-sm text-gray-400 bg-white dark:bg-[#111] rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                        <Package className="mx-auto h-12 w-12 text-gray-200 dark:text-gray-700 mb-3" />
                        Không có đơn hàng nào
                    </div>
                ) : (
                    filtered.map((order) => <TripCard key={order.orderId} order={order} onAccept={handleAccept} />)
                )}
            </div>
        </div>
    );
}
