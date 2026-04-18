"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Phone, MapPin, CheckCircle2, Package,
    Clock, ChevronRight, Search, Filter,
} from "lucide-react";

// ─── Mock Data ─────────────────────────────────────────────
type TripStatus = "PENDING" | "IN_TRANSIT" | "DELIVERED" | "FAILED";

interface DeliveryTrip {
    id: string;
    orderId: string;
    customer: string;
    phone: string;
    address: string;
    district: string;
    amount: number;
    status: TripStatus;
    scheduledTime: string;
    isCod: boolean;
}

const mockTrips: DeliveryTrip[] = [
    { id: "T001", orderId: "YJ-20250419-001", customer: "Nguyễn Văn An", phone: "0901234567", address: "45 Nguyễn Huệ, P. Bến Nghé", district: "Q.1, TP.HCM", amount: 45000000, status: "PENDING", scheduledTime: "09:00", isCod: false },
    { id: "T002", orderId: "YJ-20250419-002", customer: "Trần Thị Bình", phone: "0912345678", address: "128 Lê Văn Sỹ, P. 11", district: "Q.3, TP.HCM", amount: 12500000, status: "PENDING", scheduledTime: "10:30", isCod: false },
    { id: "T003", orderId: "YJ-20250419-003", customer: "Lê Minh Châu", phone: "0923456789", address: "22 Cách Mạng Tháng 8, P.6", district: "Q. Bình Thạnh", amount: 1800000, status: "IN_TRANSIT", scheduledTime: "11:45", isCod: true },
    { id: "T004", orderId: "YJ-20250418-009", customer: "Phạm Thu Dung", phone: "0934567890", address: "90 Đinh Tiên Hoàng, P. Đa Kao", district: "Q.1, TP.HCM", amount: 8200000, status: "DELIVERED", scheduledTime: "08:15", isCod: false },
    { id: "T005", orderId: "YJ-20250418-007", customer: "Hoàng Văn Em", phone: "0945678901", address: "55 Nguyễn Đình Chiểu, P.2", district: "Q.3, TP.HCM", amount: 23000000, status: "DELIVERED", scheduledTime: "07:30", isCod: false },
];

const statusConfig: Record<TripStatus, { label: string; className: string; dot: string }> = {
    PENDING: { label: "Chờ Giao", className: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300", dot: "bg-amber-500" },
    IN_TRANSIT: { label: "Đang Giao", className: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300", dot: "bg-blue-500 animate-pulse" },
    DELIVERED: { label: "Đã Giao", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300", dot: "bg-emerald-500" },
    FAILED: { label: "Thất Bại", className: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300", dot: "bg-rose-500" },
};

function formatVnd(n: number) {
    return new Intl.NumberFormat("vi-VN").format(n) + " ₫";
}

function TripCard({ trip }: { trip: DeliveryTrip }) {
    const cfg = statusConfig[trip.status];
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.address + ", " + trip.district)}`;

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
                        {trip.isCod && (
                            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                                COD
                            </span>
                        )}
                    </div>
                    <p className="font-plus-jakarta text-base font-bold text-gray-900 dark:text-white">{trip.customer}</p>
                </div>
                <div className="text-right">
                    <p className="font-plus-jakarta text-[10px] font-semibold uppercase tracking-wider text-gray-400">Dự kiến</p>
                    <p className="font-plus-jakarta text-lg font-black text-teal-700 dark:text-teal-400">{trip.scheduledTime}</p>
                </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-2 rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-900">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                <div>
                    <p className="font-plus-jakarta text-sm text-gray-700 dark:text-gray-300">{trip.address}</p>
                    <p className="font-plus-jakarta text-xs text-gray-400">{trip.district}</p>
                </div>
            </div>

            {/* Amount + actions */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-plus-jakarta text-[10px] uppercase tracking-wider text-gray-400">Giá Trị</p>
                    <p className="font-plus-jakarta text-base font-black text-gray-900 dark:text-white">{formatVnd(trip.amount)}</p>
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href={`tel:${trip.phone}`}
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
                    {trip.status === "PENDING" && (
                        <Link
                            href={`/shipper/scanner?orderId=${trip.orderId}`}
                            className="flex h-10 items-center gap-1.5 rounded-xl bg-teal-600 px-4 font-plus-jakarta text-xs font-bold text-white transition-all active:scale-95 hover:bg-teal-700"
                        >
                            Giao hàng <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                    )}
                    {trip.status === "DELIVERED" && (
                        <span className="flex h-10 items-center gap-1.5 rounded-xl bg-emerald-50 px-4 font-plus-jakarta text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" /> Hoàn Thành
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────
export default function ShipperHomePage() {
    const [activeFilter, setActiveFilter] = useState<"ALL" | TripStatus>("ALL");
    const [search, setSearch] = useState("");

    const pendingCount = mockTrips.filter((t) => t.status === "PENDING" || t.status === "IN_TRANSIT").length;
    const deliveredCount = mockTrips.filter((t) => t.status === "DELIVERED").length;

    const filtered = mockTrips.filter((t) => {
        const matchFilter = activeFilter === "ALL" || t.status === activeFilter;
        const matchSearch = t.customer.toLowerCase().includes(search.toLowerCase()) || t.address.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    return (
        <div className="flex flex-col gap-4 p-4">
            {/* Hero Stats */}
            <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-5 text-white shadow-lg">
                <p className="font-plus-jakarta text-xs font-bold uppercase tracking-widest opacity-70">Hôm Nay</p>
                <div className="mt-2 flex items-end gap-3">
                    <span className="font-plus-jakarta text-6xl font-black leading-none">{pendingCount}</span>
                    <span className="mb-2 font-plus-jakarta text-sm font-semibold opacity-80">đơn cần giao</span>
                </div>
                <div className="mt-4 flex items-center gap-4 border-t border-white/20 pt-4">
                    <div>
                        <p className="font-plus-jakarta text-2xl font-black">{deliveredCount}</p>
                        <p className="font-plus-jakarta text-[10px] uppercase tracking-wider opacity-70">Đã Giao</p>
                    </div>
                    <div className="h-8 w-px bg-white/20" />
                    <div>
                        <p className="font-plus-jakarta text-2xl font-black">{mockTrips.length}</p>
                        <p className="font-plus-jakarta text-[10px] uppercase tracking-wider opacity-70">Tổng</p>
                    </div>
                    <div className="h-8 w-px bg-white/20" />
                    <div>
                        <p className="font-plus-jakarta text-2xl font-black">{Math.round((deliveredCount / mockTrips.length) * 100)}%</p>
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
                    placeholder="Tìm khách hàng, địa chỉ..."
                    className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 font-plus-jakarta text-sm dark:border-gray-700 dark:bg-[#111]"
                />
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {([["ALL", "Tất Cả"], ["PENDING", "Chờ Giao"], ["IN_TRANSIT", "Đang Giao"], ["DELIVERED", "Đã Giao"]] as const).map(([val, label]) => (
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
                {filtered.length === 0 ? (
                    <div className="py-16 text-center font-plus-jakarta text-sm text-gray-400">
                        <Package className="mx-auto h-12 w-12 text-gray-200 mb-3" />
                        Không có đơn hàng nào
                    </div>
                ) : (
                    filtered.map((trip) => <TripCard key={trip.id} trip={trip} />)
                )}
            </div>
        </div>
    );
}
