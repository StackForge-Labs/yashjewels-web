"use client";

import { useState } from "react";
import { Plus, Search, Package, Edit3, ToggleLeft, ToggleRight, X, Gem } from "lucide-react";

// ─── Types & Mock Data ─────────────────────────────────────────
interface Product {
    id: string;
    name: string;
    sku: string;
    category: string;
    karat: string;
    diamondGirdleId?: string;
    price: number;
    stock: number;
    imageUrl?: string;
    inStock: boolean;
}

const mockProducts: Product[] = [
    { id: "P001", name: "Nhẫn Kim Cương Solitaire", sku: "NKD-18K-001", category: "Nhẫn", karat: "18K", diamondGirdleId: "GIA-2456789012", price: 45000000, stock: 3, inStock: true },
    { id: "P002", name: "Dây Chuyền Vàng 22K", sku: "DCv-22K-002", category: "Dây Chuyền", karat: "22K", price: 12500000, stock: 8, inStock: true },
    { id: "P003", name: "Bông Tai Ngọc Trai", sku: "BT-NPT-003", category: "Bông Tai", karat: "14K", price: 8200000, stock: 0, inStock: false },
    { id: "P004", name: "Vòng Tay Ruby Đỏ", sku: "VT-RBD-004", category: "Vòng Tay", karat: "18K", diamondGirdleId: "IGI-3001234567", price: 23000000, stock: 2, inStock: true },
    { id: "P005", name: "Lắc Tay Kim Cương Full 18K", sku: "LT-KCD-005", category: "Lắc Tay", karat: "18K", diamondGirdleId: "GIA-9987654321", price: 89000000, stock: 1, inStock: true },
];

const categories = ["Tất Cả", "Nhẫn", "Dây Chuyền", "Bông Tai", "Vòng Tay", "Lắc Tay"];

function formatVnd(n: number) {
    return new Intl.NumberFormat("vi-VN").format(n) + " ₫";
}

// ─── Add/Edit Modal ────────────────────────────────────────────
function ProductModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-[#161616]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6 dark:border-gray-800">
                    <div>
                        <h2 className="font-plus-jakarta text-lg font-bold text-gray-900 dark:text-white">Thêm Sản Phẩm Mới</h2>
                        <p className="font-plus-jakarta text-xs text-gray-500 mt-0.5">Điền đầy đủ thông tin sản phẩm kim hoàn</p>
                    </div>
                    <button onClick={onClose} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="flex flex-col gap-5 overflow-y-auto p-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="font-plus-jakarta text-xs font-bold uppercase tracking-wider text-gray-500">Tên Sản Phẩm *</label>
                            <input className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-plus-jakarta text-sm focus:border-amber-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900" placeholder="VD: Nhẫn Kim Cương 18K..." />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="font-plus-jakarta text-xs font-bold uppercase tracking-wider text-gray-500">Danh Mục *</label>
                            <select className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-plus-jakarta text-sm focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900">
                                {categories.slice(1).map((c) => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="font-plus-jakarta text-xs font-bold uppercase tracking-wider text-gray-500">Karat Vàng *</label>
                            <select className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-plus-jakarta text-sm focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900">
                                {["10K", "14K", "18K", "22K", "24K"].map((k) => <option key={k}>{k}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="font-plus-jakarta text-xs font-bold uppercase tracking-wider text-gray-500">Giá Bán (VNĐ) *</label>
                            <input type="number" className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-plus-jakarta text-sm focus:border-amber-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900" placeholder="0" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="font-plus-jakarta text-xs font-bold uppercase tracking-wider text-gray-500">Tồn Kho *</label>
                            <input type="number" className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-plus-jakarta text-sm focus:border-amber-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900" placeholder="0" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="font-plus-jakarta text-xs font-bold uppercase tracking-wider text-gray-500">Mã Girdle ID (GIA/IGI)</label>
                            <input className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-plus-jakarta text-sm focus:border-amber-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900" placeholder="GIA-XXXXXXXXXX" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-plus-jakarta text-xs font-bold uppercase tracking-wider text-gray-500">Ảnh Sản Phẩm</label>
                        <div className="flex h-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:border-amber-400 hover:bg-amber-50/50 dark:border-gray-700 dark:bg-gray-900">
                            <div className="text-center">
                                <Gem className="mx-auto h-6 w-6 text-gray-300 dark:text-gray-600" />
                                <p className="mt-2 font-plus-jakarta text-xs text-gray-400">Kéo thả hoặc nhấn để upload</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 border-t border-gray-100 px-8 py-5 dark:border-gray-800">
                    <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 font-plus-jakarta text-sm font-bold text-gray-600 hover:bg-gray-50 dark:border-gray-700">
                        Huỷ
                    </button>
                    <button className="flex-1 rounded-xl bg-amber-600 py-2.5 font-plus-jakarta text-sm font-bold text-white hover:bg-amber-700">
                        Lưu Sản Phẩm
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────────
export default function AdminProductsPage() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("Tất Cả");
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [showModal, setShowModal] = useState(false);

    const filtered = products.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
        const matchCat = activeCategory === "Tất Cả" || p.category === activeCategory;
        return matchSearch && matchCat;
    });

    const toggleStock = (id: string) => {
        setProducts((prev) => prev.map((p) => p.id === id ? { ...p, inStock: !p.inStock } : p));
    };

    return (
        <div className="flex flex-col gap-6">
            {showModal && <ProductModal onClose={() => setShowModal(false)} />}

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quản Lý Sản Phẩm</h1>
                    <p className="mt-1 font-plus-jakarta text-sm text-gray-500 dark:text-gray-400">{products.length} sản phẩm trong gian hàng</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 font-plus-jakarta text-sm font-bold text-white shadow-sm transition-all hover:bg-amber-700 active:scale-95"
                >
                    <Plus className="h-4 w-4" /> Thêm Sản Phẩm
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white/70 p-4 backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm theo tên hoặc SKU..."
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-11 pr-4 font-plus-jakarta text-sm focus:border-amber-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`rounded-lg px-3 py-1.5 font-plus-jakarta text-xs font-semibold transition-all ${activeCategory === cat ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-700 dark:bg-gray-800 dark:text-gray-400"}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-gray-100 bg-white/70 shadow-sm backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                {["Sản Phẩm", "SKU", "Danh Mục", "Giá Bán", "Tồn Kho", "Girdle ID", "Trạng Thái", ""].map((h) => (
                                    <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {filtered.length === 0 ? (
                                <tr><td colSpan={8} className="py-20 text-center font-plus-jakarta text-sm text-gray-400">Không tìm thấy sản phẩm nào</td></tr>
                            ) : filtered.map((p) => (
                                <tr key={p.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10">
                                                <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">{p.sku}</td>
                                    <td className="px-6 py-4">
                                        <span className="rounded-full bg-gray-100 px-2.5 py-1 font-plus-jakarta text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">{p.category}</span>
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{formatVnd(p.price)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-plus-jakarta text-sm font-bold ${p.stock === 0 ? "text-rose-600 dark:text-rose-400" : p.stock <= 2 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                                            {p.stock} chiếc
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {p.diamondGirdleId ? (
                                            <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400">{p.diamondGirdleId}</span>
                                        ) : (
                                            <span className="text-gray-300 dark:text-gray-600">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => toggleStock(p.id)} className="flex items-center gap-1.5">
                                            {p.inStock ? (
                                                <><ToggleRight className="h-5 w-5 text-emerald-600" /><span className="font-plus-jakarta text-xs font-semibold text-emerald-600">Còn Hàng</span></>
                                            ) : (
                                                <><ToggleLeft className="h-5 w-5 text-rose-400" /><span className="font-plus-jakarta text-xs font-semibold text-rose-400">Hết Hàng</span></>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 font-plus-jakarta text-xs font-semibold text-gray-600 hover:bg-amber-50 hover:text-amber-700 dark:bg-gray-800 dark:text-gray-400 transition-colors">
                                            <Edit3 className="h-3.5 w-3.5" /> Sửa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
