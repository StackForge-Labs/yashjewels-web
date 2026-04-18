"use client";

import { useState } from "react";
import { MessageSquare, Eye, Check, Tag, ChevronRight, X, Search } from "lucide-react";

// ─── Types & Mock Data ─────────────────────────────────────────
type InquiryStatus = "OPEN" | "RESOLVED";

interface Inquiry {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    status: InquiryStatus;
    submittedAt: string;
    couponAssigned?: string;
}

const mockInquiries: Inquiry[] = [
    { id: "INQ-001", name: "Nguyễn Mai Anh", email: "maianh@gmail.com", phone: "0901234567", subject: "Tư vấn nhẫn cầu hôn", message: "Chào shop, mình muốn tư vấn về nhẫn kim cương tự nhiên cho lễ cầu hôn. Budget khoảng 50-80 triệu. Shop có thể tư vấn không ạ?", status: "OPEN", submittedAt: "2025-04-19 08:30" },
    { id: "INQ-002", name: "Trần Văn Bình", email: "vanbinh@yahoo.com", phone: "0912345678", subject: "Hỏi về chính sách bảo hành", message: "Sản phẩm của shop có bảo hành không? Và bảo hành được bao lâu? Chế độ đổi trả như thế nào ạ?", status: "OPEN", submittedAt: "2025-04-18 15:45" },
    { id: "INQ-003", name: "Lê Thị Cẩm", email: "cample@example.com", subject: "Đặt hàng số lượng lớn", message: "Mình đang cần đặt 10 lắc tay vàng làm quà tặng công ty. Hỏi về giá sỉ được không ạ?", status: "RESOLVED", submittedAt: "2025-04-17 10:00", couponAssigned: "BULK10" },
    { id: "INQ-004", name: "Hoàng Đức Phú", email: "phu.hd@gmail.com", phone: "0934567890", subject: "Sản phẩm bị lỗi", message: "Mình mua bông tai hôm qua nhưng thấy một bên có vết xước nhỏ. Shop xử lý như nào giúp mình với?", status: "RESOLVED", submittedAt: "2025-04-16 09:15", couponAssigned: "SORRY20" },
];

function DetailDrawer({ inquiry, onClose, onResolve }: { inquiry: Inquiry; onClose: () => void; onResolve: (id: string, coupon?: string) => void }) {
    const [coupon, setCoupon] = useState("");

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
            <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-[#161616] animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
                    <div>
                        <h2 className="font-plus-jakarta text-lg font-bold text-gray-900 dark:text-white">Chi Tiết Inquiry</h2>
                        <p className="font-plus-jakarta text-xs text-gray-400">{inquiry.id}</p>
                    </div>
                    <button onClick={onClose} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex flex-col gap-5 overflow-y-auto p-6">
                    <div className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/10">
                                <span className="font-plus-jakarta text-sm font-bold text-amber-700 dark:text-amber-400">
                                    {inquiry.name[0]}
                                </span>
                            </div>
                            <div>
                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{inquiry.name}</p>
                                <p className="font-plus-jakarta text-xs text-gray-400">{inquiry.email}</p>
                            </div>
                        </div>
                        {inquiry.phone && (
                            <a href={`tel:${inquiry.phone}`} className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 font-plus-jakarta text-xs font-semibold text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300">
                                📞 {inquiry.phone}
                            </a>
                        )}
                    </div>

                    <div>
                        <p className="font-plus-jakarta text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Chủ Đề</p>
                        <p className="font-plus-jakarta text-sm font-semibold text-gray-900 dark:text-white">{inquiry.subject}</p>
                    </div>

                    <div>
                        <p className="font-plus-jakarta text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Nội Dung</p>
                        <p className="font-plus-jakarta text-sm leading-relaxed text-gray-600 dark:text-gray-300">{inquiry.message}</p>
                    </div>

                    {inquiry.status === "OPEN" && (
                        <div className="flex flex-col gap-3 rounded-xl border border-dashed border-amber-300 p-4 dark:border-amber-700/40">
                            <p className="font-plus-jakarta text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                                Gán Coupon Đền Bù (Tuỳ Chọn)
                            </p>
                            <div className="flex gap-2">
                                <input
                                    value={coupon}
                                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                                    placeholder="VD: SORRY20"
                                    className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-sm uppercase focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
                                />
                                <button className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 font-plus-jakarta text-xs font-bold text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400">
                                    <Tag className="h-3.5 w-3.5" /> Gán
                                </button>
                            </div>
                        </div>
                    )}

                    {inquiry.couponAssigned && (
                        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-500/10">
                            <Tag className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-plus-jakarta text-sm font-bold text-emerald-700 dark:text-emerald-400">Coupon đã gán: {inquiry.couponAssigned}</span>
                        </div>
                    )}
                </div>

                {inquiry.status === "OPEN" && (
                    <div className="border-t border-gray-100 p-6 dark:border-gray-800">
                        <button
                            onClick={() => { onResolve(inquiry.id, coupon || undefined); onClose(); }}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 font-plus-jakarta text-sm font-bold text-white hover:bg-amber-700"
                        >
                            <Check className="h-4 w-4" /> Đánh Dấu Đã Xử Lý
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────────
export default function VendorInquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries);
    const [selected, setSelected] = useState<Inquiry | null>(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"ALL" | "OPEN" | "RESOLVED">("ALL");

    const filtered = inquiries.filter((i) => {
        const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.subject.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "ALL" || i.status === filter;
        return matchSearch && matchFilter;
    });

    const handleResolve = (id: string, coupon?: string) => {
        setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, status: "RESOLVED", couponAssigned: coupon ?? i.couponAssigned } : i));
    };

    const openCount = inquiries.filter((i) => i.status === "OPEN").length;

    return (
        <div className="flex flex-col gap-6">
            {selected && <DetailDrawer inquiry={selected} onClose={() => setSelected(null)} onResolve={handleResolve} />}

            <div className="flex items-start justify-between">
                <div>
                    <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Hòm Thư CSKH</h1>
                    <p className="mt-1 font-plus-jakarta text-sm text-gray-500 dark:text-gray-400">Phản hồi yêu cầu tư vấn và khiếu nại từ khách hàng</p>
                </div>
                {openCount > 0 && (
                    <span className="rounded-xl bg-amber-50 px-4 py-2 font-plus-jakarta text-sm font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                        {openCount} chưa xử lý
                    </span>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo tên hoặc chủ đề..." className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-2.5 font-plus-jakarta text-sm focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900" />
                </div>
                <div className="flex gap-2">
                    {(["ALL", "OPEN", "RESOLVED"] as const).map((f) => (
                        <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-4 py-2 font-plus-jakarta text-xs font-bold transition-colors ${filter === f ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-700 dark:bg-gray-800 dark:text-gray-400"}`}>
                            {f === "ALL" ? "Tất Cả" : f === "OPEN" ? "Chưa Xử Lý" : "Đã Xử Lý"}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
                {filtered.map((inq) => (
                    <div
                        key={inq.id}
                        onClick={() => setSelected(inq)}
                        className={`flex cursor-pointer items-center gap-4 rounded-2xl border bg-white/70 p-5 backdrop-blur-md transition-all hover:shadow-md dark:bg-[#111]/70 ${inq.status === "OPEN" ? "border-amber-200 dark:border-amber-800/30" : "border-gray-100 dark:border-gray-800/50"}`}
                    >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-plus-jakarta text-sm font-bold ${inq.status === "OPEN" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}`}>
                            <MessageSquare className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{inq.name}</p>
                                {inq.status === "OPEN" && <span className="rounded-full bg-amber-100 px-2 py-0.5 font-plus-jakarta text-[10px] font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">Mới</span>}
                            </div>
                            <p className="font-plus-jakarta text-xs font-semibold text-gray-600 dark:text-gray-300 mt-0.5">{inq.subject}</p>
                            <p className="font-plus-jakarta text-xs text-gray-400 truncate mt-0.5">{inq.message}</p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-2">
                            <span className="font-plus-jakarta text-[10px] text-gray-400">{inq.submittedAt}</span>
                            {inq.status === "RESOLVED" ? (
                                <span className="flex items-center gap-1 font-plus-jakarta text-[11px] font-bold text-emerald-600"><Check className="h-3 w-3" /> Đã xử lý</span>
                            ) : (
                                <div className="flex items-center gap-1 font-plus-jakarta text-[11px] font-bold text-amber-600">
                                    <Eye className="h-3 w-3" /> Xem & Phản hồi <ChevronRight className="h-3 w-3" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="py-20 text-center font-plus-jakarta text-sm text-gray-400">Không có inquiry nào</div>
                )}
            </div>
        </div>
    );
}
