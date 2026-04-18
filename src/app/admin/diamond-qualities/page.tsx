"use client";

import { useState } from "react";
import { Search, Plus, Filter, Edit2, Trash2, Tag, ArrowRight } from "lucide-react";

interface DiamondQualityData {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    productCount: number;
}

const mockData: DiamondQualityData[] = [
    { id: "IDX-001", name: "D / Flawless", description: "Kim cương trắng nước D, không có tạp chất.", isActive: true, productCount: 42 },
    { id: "IDX-002", name: "F / VVS1", description: "Nước F, rạn nứt rất rất nhỏ nhìn bằng kính lúp.", isActive: true, productCount: 15 },
];

export default function AdminDiamondQualitiesPage() {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Modal & Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<"CREATE" | "EDIT">("CREATE");
    const [selectedItem, setSelectedItem] = useState<DiamondQualityData | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const filtered = mockData.filter(d => {
        const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "ALL" ? true : filterStatus === "ACTIVE" ? d.isActive : !d.isActive;
        return matchSearch && matchStatus;
    });

    const openCreate = () => {
        setDrawerMode("CREATE");
        setSelectedItem(null);
        setIsDrawerOpen(true);
    };

    const openEdit = (item: DiamondQualityData) => {
        setDrawerMode("EDIT");
        setSelectedItem(item);
        setIsDrawerOpen(true);
    };

    const openDelete = (item: DiamondQualityData) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    };

    return (
        <div className="flex flex-col gap-8 p-2 lg:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="font-serif text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Chất Lượng Cương (Diamond Qualities)
                    </h1>
                    <p className="mt-1 font-plus-jakarta text-sm text-gray-500 dark:text-gray-400">
                        Thuộc tính 4C (Color, Clarity...) cho Diamonds.
                    </p>
                </div>
                <button 
                    onClick={openCreate}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-plus-jakarta text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-blue-500/20 active:scale-95">
                    <Plus className="h-4 w-4" /> Thêm Dữ Liệu
                </button>
            </div>

            {/* Generic Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm kiếm..."
                        className="w-full rounded-xl border border-gray-200 bg-white/50 py-2.5 pl-11 pr-4 font-plus-jakarta text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-[#111]/50 dark:focus:bg-[#111]"
                    />
                </div>
                <div className="relative">
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 font-plus-jakarta text-sm font-bold transition-all ${
                            filterStatus !== "ALL" 
                            ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400" 
                            : "border-gray-200 bg-white/50 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111]/50 dark:text-gray-300 dark:hover:bg-gray-800"
                        }`}
                    >
                        <Filter className="h-4 w-4" /> 
                        {filterStatus === "ALL" ? "Bộ Lọc" : filterStatus === "ACTIVE" ? "Đang Hoạt Động" : "Đã Ẩn"}
                    </button>
                    {isFilterOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 z-10 rounded-xl border border-gray-100 bg-white p-2 shadow-xl dark:border-gray-800 dark:bg-[#1a1a1a]">
                            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Trạng Thái</p>
                            <div className="flex flex-col gap-1">
                                {["ALL", "ACTIVE", "INACTIVE"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => { setFilterStatus(status as any); setIsFilterOpen(false); }}
                                        className={`flex items-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                                            filterStatus === status 
                                            ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" 
                                            : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                                        }`}
                                    >
                                        {status === "ALL" ? "Tất Cả" : status === "ACTIVE" ? "Đang Hoạt Động" : "Đã Ẩn"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Data Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800/50 dark:bg-[#0a0a0a]">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#111]/50">
                            <tr>
                                <th className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Tên Thuộc Tính</th>
                                <th className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 max-w-[200px]">Mô Tả / Giá Trị</th>
                                <th className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Trạng Thái</th>
                                <th className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 text-right">Tổng Mẫu Tham Chiếu</th>
                                <th className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 text-right">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {filtered.map((item) => (
                                <tr key={item.id} className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                                <Tag className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{item.name}</p>
                                                <p className="font-mono text-[10px] text-gray-400">{item.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td className="px-6 py-4">
                                        <p className="max-w-[280px] overflow-hidden text-ellipsis whitespace-nowrap font-plus-jakarta text-xs text-gray-500 dark:text-gray-400">
                                            {item.description}
                                        </p>
                                    </td>

                                    <td className="px-6 py-4">
                                        {item.isActive ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                                <span className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-500" />
                                                Inactive
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="inline-flex items-center gap-2">
                                            <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{item.productCount}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                            <button 
                                                onClick={() => openEdit(item)}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-blue-500/20 dark:hover:text-blue-400">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => openDelete(item)}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-rose-500/20 dark:hover:text-rose-400">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Slide-over Drawer --- */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)} />
                    <div className="relative w-full max-w-md bg-white shadow-2xl dark:bg-[#111] flex flex-col h-full border-l border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
                            <div>
                                <h2 className="font-serif text-xl font-bold dark:text-white">
                                    {drawerMode === "CREATE" ? "Tạo Thông Số Mới" : "Cập Nhật Thông Số"}
                                </h2>
                                <p className="font-plus-jakarta text-xs text-gray-500 mt-1">Thuộc tính 4C (Color, Clarity...) cho Diamonds.</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-6 font-plus-jakarta">
                            <div className="flex flex-col gap-5">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">
                                        Tên Thuộc Tính <span className="text-rose-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        defaultValue={selectedItem?.name || ""}
                                        placeholder="Nhập tên..."
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a] dark:text-white dark:focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">Giá Trị Cụ Thể</label>
                                    <textarea 
                                        rows={3}
                                        defaultValue={selectedItem?.description || ""}
                                        placeholder="Mô tả kỹ thuật..."
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#1a1a1a] dark:text-white dark:focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Trạng Thái Kích Hoạt</p>
                                        <p className="text-xs text-gray-500">Khách hàng sẽ nhìn thấy lựa chọn này.</p>
                                    </div>
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input type="checkbox" defaultChecked={selectedItem ? selectedItem.isActive : true} className="peer sr-only" />
                                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700 dark:border-gray-600" />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-[#1a1a1a]/50">
                            <div className="flex gap-3">
                                <button onClick={() => setIsDrawerOpen(false)} className="flex-1 rounded-xl border border-gray-200 bg-white py-3 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#111] dark:text-gray-300 dark:hover:bg-gray-800">
                                    Hủy
                                </button>
                                <button className="flex-1 rounded-xl bg-blue-600 py-3 font-plus-jakarta text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95">
                                    {drawerMode === "CREATE" ? "Tạo Dữ Liệu" : "Lưu Thay Đổi"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Modal Confirmation for Delete --- */}
            {isDeleteModalOpen && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
                    <div className="relative w-full max-w-md scale-100 rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#161616] border border-gray-100 dark:border-gray-800">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/20">
                            <Trash2 className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                        </div>
                        <div className="mt-5 text-center">
                            <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">Xóa {selectedItem.name}?</h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Hành động này cực kỳ nguy hiểm. Hệ thống có <strong className="text-rose-500">{selectedItem.productCount} mục</strong> phụ thuộc.
                            </p>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 rounded-xl border border-gray-200 bg-white py-3 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#111] dark:text-gray-300 dark:hover:bg-gray-800">Hủy</button>
                            <button className="flex-1 rounded-xl bg-rose-600 py-3 font-plus-jakarta text-sm font-bold text-white shadow-sm hover:bg-rose-700 active:scale-95 shadow-rose-500/20">Vẫn Xóa</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
