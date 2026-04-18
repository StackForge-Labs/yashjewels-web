"use client";

import { useState } from "react";
import { ArrowLeftRight, Eye, CheckCircle2, XCircle, X, AlertCircle, Search } from "lucide-react";

// ─── Types & Mock Data ─────────────────────────────────────────
type ReturnStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED";

interface ReturnRequest {
    id: string;
    orderId: string;
    customer: string;
    product: string;
    submittedGirdleId?: string;
    originalGirdleId?: string;
    reason: string;
    status: ReturnStatus;
    submittedAt: string;
    amount: number;
}

const mockReturns: ReturnRequest[] = [
    { id: "RET-001", orderId: "YJ-003", customer: "Lê Minh Châu", product: "Bông Tai Ngọc Trai", reason: "Sản phẩm không đúng mô tả, màu sắc khác xa ảnh", status: "PENDING_REVIEW", submittedAt: "2025-04-18", amount: 8200000, submittedGirdleId: "NGP-BNTT-003", originalGirdleId: "NGP-BNTT-003" },
    { id: "RET-002", orderId: "YJ-001", customer: "Nguyễn Văn An", product: "Nhẫn Kim Cương D-VVS1", reason: "Size nhẫn không vừa, cần đổi size 15 sang 16", status: "PENDING_REVIEW", submittedAt: "2025-04-17", amount: 45000000, submittedGirdleId: "GIA-2456789012", originalGirdleId: "GIA-2456789012" },
    { id: "RET-003", orderId: "YJ-000", customer: "Hoàng Diệu Linh", product: "Vòng Tay Ruby 18K", reason: "Đá bị nứt sau 2 ngày sử dụng", status: "APPROVED", submittedAt: "2025-04-15", amount: 23000000 },
    { id: "RET-004", orderId: "YJ-000", customer: "Trần Quốc Bảo", product: "Lắc Tay Kim Cương", reason: "Đổi sang sản phẩm khác loại", status: "REJECTED", submittedAt: "2025-04-14", amount: 89000000 },
];

const statusCfg: Record<ReturnStatus, { label: string; className: string }> = {
    PENDING_REVIEW: { label: "Chờ Duyệt", className: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" },
    APPROVED: { label: "Đã Duyệt", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" },
    REJECTED: { label: "Từ Chối", className: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400" },
};

function formatVnd(n: number) {
    return new Intl.NumberFormat("vi-VN").format(n) + " ₫";
}

// ─── Review Modal ──────────────────────────────────────────────
function ReviewModal({ req, onClose, onDecide }: { req: ReturnRequest; onClose: () => void; onDecide: (id: string, approved: boolean) => void }) {
    const match = req.submittedGirdleId && req.originalGirdleId && req.submittedGirdleId === req.originalGirdleId;
    const hasGirdle = !!req.submittedGirdleId;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl dark:bg-[#161616]">
                <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6 dark:border-gray-800">
                    <div>
                        <h2 className="font-plus-jakarta text-lg font-bold text-gray-900 dark:text-white">Xét Duyệt Hoàn Trả</h2>
                        <p className="font-plus-jakarta text-xs text-gray-500 mt-0.5">{req.id} · {req.orderId}</p>
                    </div>
                    <button onClick={onClose} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex flex-col gap-5 p-8">
                    <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                        <p className="font-plus-jakarta text-xs font-bold uppercase tracking-wider text-gray-400">Lý Do Hoàn Trả</p>
                        <p className="mt-2 font-plus-jakarta text-sm text-gray-700 dark:text-gray-300">{req.reason}</p>
                    </div>

                    {hasGirdle && (
                        <div className={`rounded-xl border p-5 ${match ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800/30 dark:bg-emerald-900/10" : "border-rose-200 bg-rose-50 dark:border-rose-800/30 dark:bg-rose-900/10"}`}>
                            <div className="flex items-center gap-2 mb-3">
                                {match ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-rose-600" />}
                                <p className="font-plus-jakarta text-xs font-bold uppercase tracking-wider">
                                    {match ? "Girdle ID Khớp — Sản phẩm gốc" : "Girdle ID KHÔNG Khớp — Nghi ngờ tráo hàng!"}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="font-plus-jakarta text-[10px] text-gray-400 uppercase tracking-wider">Mã Hệ Thống (Gốc)</p>
                                    <p className="mt-1 font-mono text-sm font-bold text-gray-900 dark:text-white">{req.originalGirdleId}</p>
                                </div>
                                <div>
                                    <p className="font-plus-jakarta text-[10px] text-gray-400 uppercase tracking-wider">Mã Khách Gửi</p>
                                    <p className={`mt-1 font-mono text-sm font-bold ${match ? "text-emerald-700" : "text-rose-700"}`}>{req.submittedGirdleId}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                            <p className="font-plus-jakarta text-[10px] uppercase tracking-wider text-gray-400">Khách Hàng</p>
                            <p className="mt-1 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{req.customer}</p>
                        </div>
                        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                            <p className="font-plus-jakarta text-[10px] uppercase tracking-wider text-gray-400">Giá Trị Hoàn</p>
                            <p className="mt-1 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{formatVnd(req.amount)}</p>
                        </div>
                    </div>
                </div>

                {req.status === "PENDING_REVIEW" && (
                    <div className="flex gap-3 border-t border-gray-100 px-8 py-5 dark:border-gray-800">
                        <button onClick={() => { onDecide(req.id, false); onClose(); }} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-rose-50 py-2.5 font-plus-jakarta text-sm font-bold text-rose-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400">
                            <XCircle className="h-4 w-4" /> Từ Chối
                        </button>
                        <button onClick={() => { onDecide(req.id, true); onClose(); }} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 font-plus-jakarta text-sm font-bold text-white hover:bg-emerald-700">
                            <CheckCircle2 className="h-4 w-4" /> Chấp Nhận
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────────
export default function AdminReturnsPage() {
    const [returns, setReturns] = useState<ReturnRequest[]>(mockReturns);
    const [selected, setSelected] = useState<ReturnRequest | null>(null);
    const [search, setSearch] = useState("");

    const filtered = returns.filter((r) => r.customer.toLowerCase().includes(search.toLowerCase()) || r.product.toLowerCase().includes(search.toLowerCase()));

    const handleDecide = (id: string, approved: boolean) => {
        setReturns((prev) => prev.map((r) => r.id === id ? { ...r, status: approved ? "APPROVED" : "REJECTED" } : r));
    };

    const pending = returns.filter((r) => r.status === "PENDING_REVIEW").length;

    return (
        <div className="flex flex-col gap-6">
            {selected && <ReviewModal req={selected} onClose={() => setSelected(null)} onDecide={handleDecide} />}

            <div className="flex items-start justify-between">
                <div>
                    <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Xử Lý Hoàn Trả</h1>
                    <p className="mt-1 font-plus-jakarta text-sm text-gray-500 dark:text-gray-400">Xét duyệt và soi mã Girdle ID cho từng yêu cầu</p>
                </div>
                {pending > 0 && (
                    <span className="rounded-xl bg-rose-50 px-4 py-2 font-plus-jakarta text-sm font-bold text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
                        {pending} chờ duyệt
                    </span>
                )}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm khách hàng, sản phẩm..." className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-2.5 font-plus-jakarta text-sm focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900" />
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-gray-100 bg-white/70 shadow-sm backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                {["Mã YC", "Khách Hàng", "Sản Phẩm", "Ngày Nộp", "Giá Trị", "Trạng Thái", ""].map((h) => (
                                    <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {filtered.map((r) => {
                                const cfg = statusCfg[r.status];
                                return (
                                    <tr key={r.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                        <td className="px-6 py-4"><div className="flex items-center gap-2"><ArrowLeftRight className="h-3.5 w-3.5 text-gray-400" /><span className="font-plus-jakarta text-xs font-bold text-gray-700 dark:text-gray-300">{r.id}</span></div></td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm font-medium text-gray-900 dark:text-white">{r.customer}</td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500 dark:text-gray-400">{r.product}</td>
                                        <td className="px-6 py-4 font-plus-jakarta text-xs text-gray-400">{r.submittedAt}</td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{formatVnd(r.amount)}</td>
                                        <td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 font-plus-jakarta text-[11px] font-bold ${cfg.className}`}>{cfg.label}</span></td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => setSelected(r)} className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-gray-600 hover:bg-amber-50 hover:text-amber-700 dark:bg-gray-800 transition-colors">
                                                <Eye className="h-3.5 w-3.5" /> Xem & Duyệt
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
