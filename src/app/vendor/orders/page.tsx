"use client";

import { useState } from "react";
import { Clock, CheckCircle2, Package, Truck, ChevronRight, Upload, AlertCircle } from "lucide-react";

// ─── Types & Mock Data ─────────────────────────────────────────
type OrderStatus = "DEPOSIT_PAID" | "CONFIRMED" | "PREPARING" | "SHIPPED";

interface VendorOrder {
    id: string;
    customer: string;
    product: string;
    amount: number;
    status: OrderStatus;
    deadline?: string;
    phone: string;
}

const mockOrders: VendorOrder[] = [
    { id: "YJ-001", customer: "Nguyễn Văn An", product: "Nhẫn Kim Cương D-VVS1 18K", amount: 45000000, status: "DEPOSIT_PAID", deadline: "2025-04-22", phone: "0901234567" },
    { id: "YJ-002", customer: "Trần Thị Bình", product: "Dây Chuyền Vàng 22K 5chỉ", amount: 12500000, status: "DEPOSIT_PAID", deadline: "2025-04-21", phone: "0912345678" },
    { id: "YJ-003", customer: "Lê Minh Châu", product: "Bông Tai Ngọc Trai Biển", amount: 8200000, status: "CONFIRMED", phone: "0923456789" },
    { id: "YJ-004", customer: "Phạm Thu Dung", product: "Vòng Tay Ruby Đỏ 14K", amount: 23000000, status: "CONFIRMED", phone: "0934567890" },
    { id: "YJ-005", customer: "Hoàng Văn Em", product: "Nhẫn Cưới Bạch Kim", amount: 67000000, status: "PREPARING", phone: "0945678901" },
    { id: "YJ-006", customer: "Vũ Thị Phương", product: "Lắc Tay Vàng 18K", amount: 15000000, status: "SHIPPED", phone: "0956789012" },
];

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

// ─── Order Card ────────────────────────────────────────────────
function OrderCard({ order, onConfirm, onPrepare }: { order: VendorOrder; onConfirm: (id: string) => void; onPrepare: (id: string) => void }) {
    const days = getDaysLeft(order.deadline);

    return (
        <div className="group flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-[#161616]">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <p className="font-plus-jakarta text-xs font-bold text-amber-700 dark:text-amber-400">{order.id}</p>
                    <p className="mt-0.5 font-plus-jakarta text-sm font-bold text-gray-900 truncate dark:text-white">{order.customer}</p>
                </div>
                <a href={`tel:${order.phone}`} className="shrink-0 rounded-lg bg-gray-50 p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600 dark:bg-gray-800 dark:hover:bg-amber-500/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.06 2.2 2 2 0 012 .06h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" /></svg>
                </a>
            </div>

            <p className="font-plus-jakarta text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{order.product}</p>

            <div className="flex items-center justify-between">
                <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{formatVnd(order.amount)}</span>
                {days.text && (
                    <span className={`flex items-center gap-1 font-plus-jakarta text-[10px] font-bold ${days.urgent ? "text-rose-600 dark:text-rose-400" : "text-gray-400"}`}>
                        {days.urgent && <AlertCircle className="h-3 w-3" />}
                        {days.text}
                    </span>
                )}
            </div>

            {order.status === "DEPOSIT_PAID" && (
                <button
                    onClick={() => onConfirm(order.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-3 py-2 font-plus-jakarta text-xs font-bold text-white transition-all hover:bg-amber-700 active:scale-95"
                >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Xác Nhận Đơn
                </button>
            )}
            {order.status === "CONFIRMED" && (
                <button
                    onClick={() => onPrepare(order.id)}
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
    const [orders, setOrders] = useState<VendorOrder[]>(mockOrders);

    const handleConfirm = (id: string) => {
        setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "CONFIRMED" } : o));
    };

    const handlePrepare = (id: string) => {
        // In real implementation: open file upload modal
        alert(`[Mock] Mở modal upload ảnh xuất kho cho đơn ${id}`);
        setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "PREPARING" } : o));
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
                <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Quản Lý Đơn Hàng
                </h1>
                <p className="mt-1 font-plus-jakarta text-sm text-gray-500 dark:text-gray-400">
                    Kéo đơn qua các cột để cập nhật trạng thái vận hành
                </p>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4 lg:grid-cols-2">
                {columns.map((col) => {
                    const colOrders = orders.filter((o) => o.status === col.status);
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
                                    <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-10 dark:border-gray-700">
                                        <p className="font-plus-jakarta text-xs text-gray-400">Không có đơn hàng</p>
                                    </div>
                                ) : (
                                    colOrders.map((order) => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                            onConfirm={handleConfirm}
                                            onPrepare={handlePrepare}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

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
        </div>
    );
}
