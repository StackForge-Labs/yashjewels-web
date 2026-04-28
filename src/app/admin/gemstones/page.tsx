"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Filter, Edit2, Trash2, Tag, Loader2, Layers, Diamond } from "lucide-react";
import { specService, JewelrySpecItem } from "@/services/spec.service";
import { toast } from "react-hot-toast";

type TabType = "CATEGORIES" | "GRADING";

export default function AdminGemstonesPage() {
    const [activeTab, setActiveTab] = useState<TabType>("CATEGORIES");
    
    // Data states
    const [categories, setCategories] = useState<JewelrySpecItem[]>([]);
    const [gradingList, setGradingList] = useState<JewelrySpecItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Filter states
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Modal & Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<"CREATE" | "EDIT">("CREATE");
    const [selectedItem, setSelectedItem] = useState<JewelrySpecItem | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [catRes, gradRes] = await Promise.all([
                specService.stoneTypes.getAll(),
                specService.stoneQualities.getAll()
            ]);
            setCategories(catRes.data);
            setGradingList(gradRes.data);
        } catch (error) {
            toast.error("Failed to fetch gemstone data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = (activeTab === "CATEGORIES" ? categories : gradingList).filter(item => {
        const nameText = activeTab === "CATEGORIES" 
            ? (item.name || "").toLowerCase()
            : `${item.stoneType} ${item.grade}`.toLowerCase();
        
        const matchSearch = nameText.includes(search.toLowerCase());
        const matchStatus = filterStatus === "ALL" ? true : filterStatus === "ACTIVE" ? item.isActive : !item.isActive;
        return matchSearch && matchStatus;
    });

    const openCreate = () => {
        setDrawerMode("CREATE");
        setSelectedItem(null);
        setIsDrawerOpen(true);
    };

    const openEdit = (item: JewelrySpecItem) => {
        setDrawerMode("EDIT");
        setSelectedItem(item);
        setIsDrawerOpen(true);
    };

    const openDelete = (item: JewelrySpecItem) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        const form = e.currentTarget;
        const formData = new FormData(form);
        
        let res;
        if (activeTab === "CATEGORIES") {
            const payload = {
                name: formData.get("name") as string,
                description: formData.get("description") as string,
                isActive: drawerMode === "EDIT" ? formData.get("isActive") === "on" : true,
            };
            res = drawerMode === "CREATE" 
                ? await specService.stoneTypes.create(payload)
                : await specService.stoneTypes.update(selectedItem!.id, payload);
        } else {
            const payload = {
                stoneType: formData.get("stoneType") as string,
                grade: formData.get("grade") as string,
                description: formData.get("description") as string,
                isActive: drawerMode === "EDIT" ? formData.get("isActive") === "on" : true,
            };
            res = drawerMode === "CREATE"
                ? await specService.stoneQualities.create(payload)
                : await specService.stoneQualities.update(selectedItem!.id, payload);
        }

        setIsSaving(false);
        if (res?.success) {
            toast.success(res.message);
            setIsDrawerOpen(false);
            fetchData();
        } else {
            toast.error(res?.message || "Failed to save data");
        }
    };

    const handleDelete = async () => {
        if (!selectedItem) return;
        setIsSaving(true);
        const res = activeTab === "CATEGORIES"
            ? await specService.stoneTypes.delete(selectedItem.id)
            : await specService.stoneQualities.delete(selectedItem.id);
        
        setIsSaving(false);
        if (res.success) {
            toast.success(res.message);
            setIsDeleteModalOpen(false);
            fetchData();
        } else {
            toast.error(res.message || "Failed to delete item");
        }
    };

    return (
        <div className="flex flex-col gap-8 p-2 lg:p-6">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                    <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Gemstones & Other Stones
                    </h1>
                    <p className="mt-1 font-plus-jakarta text-sm text-gray-500 dark:text-gray-400">
                        Unified hub for managing stone categories and their respective quality grades.
                    </p>
                </div>
                <button 
                    onClick={openCreate}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-plus-jakarta text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95">
                    <Plus className="h-4 w-4" /> Add {activeTab === "CATEGORIES" ? "Stone Category" : "Quality Grade"}
                </button>
            </div>

            {/* Tabs Interface */}
            <div className="flex items-center gap-1 border-b border-gray-100 dark:border-gray-800">
                <button
                    onClick={() => { setActiveTab("CATEGORIES"); setSearch(""); }}
                    className={`flex items-center gap-2 px-6 py-4 font-plus-jakarta text-sm font-bold transition-all relative ${
                        activeTab === "CATEGORIES" ? "text-blue-600" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    }`}
                >
                    <Layers className="h-4 w-4" />
                    Stone Categories
                    {activeTab === "CATEGORIES" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                </button>
                <button
                    onClick={() => { setActiveTab("GRADING"); setSearch(""); }}
                    className={`flex items-center gap-2 px-6 py-4 font-plus-jakarta text-sm font-bold transition-all relative ${
                        activeTab === "GRADING" ? "text-blue-600" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    }`}
                >
                    <Diamond className="h-4 w-4" />
                    Quality Grading
                    {activeTab === "GRADING" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={activeTab === "CATEGORIES" ? "Search stone categories (Ruby, Emerald...)" : "Search stone or grade (AAA, VS...)"}
                        className="w-full rounded-2xl border border-gray-100 bg-white px-11 py-3 font-plus-jakarta text-sm transition-all focus:border-blue-500 focus:outline-none dark:border-gray-800 dark:bg-[#111]"
                    />
                </div>
                <div className="relative">
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 font-plus-jakarta text-sm font-bold transition-all ${
                            filterStatus !== "ALL" 
                            ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400" 
                            : "border-gray-100 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111] dark:text-gray-400 dark:hover:bg-gray-800"
                        }`}
                    >
                        <Filter className="h-4 w-4" /> 
                        {filterStatus === "ALL" ? "All Status" : filterStatus === "ACTIVE" ? "Active" : "Inactive"}
                    </button>
                    {isFilterOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 z-20 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl dark:border-gray-800 dark:bg-[#1a1a1a]">
                            <div className="flex flex-col gap-1">
                                {(["ALL", "ACTIVE", "INACTIVE"] as const).map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => { setFilterStatus(status); setIsFilterOpen(false); }}
                                        className={`flex items-center rounded-xl px-4 py-2.5 text-xs font-bold transition-colors ${
                                            filterStatus === status 
                                            ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" 
                                            : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                                        }`}
                                    >
                                        {status === "ALL" ? "View All" : status === "ACTIVE" ? "Active Only" : "Inactive Only"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800/50 dark:bg-[#0a0a0a]">
                <div className="overflow-x-auto min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                            <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-600" />
                            <p className="font-plus-jakarta text-sm font-medium italic">Synchronizing catalog assets...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#111]/50">
                                <tr>
                                    <th className="px-8 py-5 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                        {activeTab === "CATEGORIES" ? "Stone Identity" : "Stone & Grade Matrix"}
                                    </th>
                                    <th className="px-8 py-5 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Specification Details</th>
                                    <th className="px-8 py-5 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Status</th>
                                    <th className="px-8 py-5 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-200 dark:bg-gray-800/50">
                                                <Layers className="h-8 w-8" />
                                            </div>
                                            <p className="mt-4 font-plus-jakarta text-sm font-bold text-gray-400">No matching entries found in this sector.</p>
                                        </td>
                                    </tr>
                                ) : filteredData.map((item) => (
                                    <tr key={item.id} className="group transition-colors hover:bg-gray-50/30 dark:hover:bg-gray-800/10">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                                    {activeTab === "CATEGORIES" ? <Layers className="h-5 w-5" /> : <Tag className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">
                                                        {activeTab === "CATEGORIES" ? item.name : `${item.stoneType} - ${item.grade}`}
                                                    </p>
                                                    <p className="font-mono text-[9px] uppercase tracking-wider text-gray-400 mt-0.5">UID: {item.id.substring(0, 12)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="px-8 py-5">
                                            <p className="max-w-[400px] font-plus-jakarta text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                                {item.description || "No technical description provided for this specification."}
                                            </p>
                                        </td>

                                        <td className="px-8 py-5">
                                            {item.isActive ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-plus-jakarta text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 font-plus-jakarta text-[9px] font-bold uppercase tracking-wider text-gray-500 dark:bg-gray-800 dark:text-gray-500">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => openEdit(item)}
                                                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 transition-all hover:border-blue-100 hover:text-blue-600 shadow-sm dark:bg-[#111] dark:border-gray-800 dark:hover:border-blue-900">
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => openDelete(item)}
                                                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 transition-all hover:border-rose-100 hover:text-rose-600 shadow-sm dark:bg-[#111] dark:border-gray-800 dark:hover:border-rose-900">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* --- Slide-over Drawer --- */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)} />
                    <form onSubmit={handleSave} className="relative w-full max-w-lg bg-white shadow-2xl dark:bg-[#0a0a0a] flex flex-col h-full border-l border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6 dark:border-gray-800">
                            <div>
                                <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                                    {drawerMode === "CREATE" ? `New ${activeTab === "CATEGORIES" ? "Category" : "Grading"}` : `Update ${activeTab === "CATEGORIES" ? "Category" : "Grading"}`}
                                </h2>
                                <p className="font-plus-jakarta text-xs text-gray-500 mt-1">Refining global jewelry inventory specifications.</p>
                            </div>
                            <button type="button" onClick={() => setIsDrawerOpen(false)} className="rounded-xl bg-gray-50 p-2 text-gray-400 hover:text-gray-600 dark:bg-gray-800/50">
                                <Plus className="h-5 w-5 rotate-45" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-8 py-8 font-plus-jakarta">
                            <div className="flex flex-col gap-6">
                                {activeTab === "CATEGORIES" ? (
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
                                            Stone Identity Name <span className="text-rose-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            required
                                            defaultValue={selectedItem?.name || ""}
                                            placeholder="e.g. Ruby, Emerald, Blue Sapphire..."
                                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#111] dark:text-white"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
                                                Stone Category Selection <span className="text-rose-500">*</span>
                                            </label>
                                            <select 
                                                name="stoneType"
                                                required
                                                defaultValue={selectedItem?.stoneType || ""}
                                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#111] dark:text-white"
                                            >
                                                <option value="">Select Primary Category</option>
                                                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
                                                Quality Grade Descriptor <span className="text-rose-500">*</span>
                                            </label>
                                            <input 
                                                type="text" 
                                                name="grade"
                                                required
                                                defaultValue={selectedItem?.grade || ""}
                                                placeholder="e.g. AAA, Natural VS1, Heated..."
                                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#111] dark:text-white"
                                            />
                                        </div>
                                    </>
                                )}
                                
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Technical Documentation / Description</label>
                                    <textarea 
                                        name="description"
                                        rows={5}
                                        defaultValue={selectedItem?.description || ""}
                                        placeholder="Add specialized details about cut, origin, treatment, or rarity..."
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-[#111] dark:text-white"
                                    />
                                </div>

                                <div className="flex items-center justify-between rounded-3xl border border-gray-100 bg-gray-50/30 p-6 dark:border-gray-800">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Active Operational Status</p>
                                        <p className="text-xs text-gray-500 mt-1">Controls availability within the Master Catalog builder.</p>
                                    </div>
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input type="checkbox" name="isActive" defaultChecked={selectedItem ? selectedItem.isActive : true} className="peer sr-only" />
                                        <div className="peer h-6 w-11 rounded-full bg-gray-200 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-800" />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 bg-gray-50/50 p-8 dark:border-gray-800 dark:bg-[#0d0d0d]/50">
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1 rounded-2xl border border-gray-100 bg-white py-4 font-plus-jakarta text-sm font-bold text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111] dark:text-gray-400">
                                    Discard Changes
                                </button>
                                <button disabled={isSaving} type="submit" className="flex-1 rounded-2xl bg-blue-600 py-4 font-plus-jakarta text-sm font-bold text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 disabled:opacity-50 flex justify-center items-center">
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (drawerMode === "CREATE" ? "Deploy Specification" : "Update Entry")}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* --- Modal Confirmation for Delete --- */}
            {isDeleteModalOpen && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)} />
                    <div className="relative w-full max-w-md scale-100 rounded-[40px] bg-white p-10 shadow-2xl dark:bg-[#111] border border-gray-100 dark:border-gray-800">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[30px] bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                            <Trash2 className="h-8 w-8" />
                        </div>
                        <div className="mt-8 text-center">
                            <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Delete Entry?</h3>
                            <p className="mt-3 font-plus-jakarta text-sm text-gray-500 leading-relaxed">
                                You are about to remove <span className="font-bold text-gray-900 dark:text-white">{activeTab === "CATEGORIES" ? selectedItem.name : `${selectedItem.stoneType} ${selectedItem.grade}`}</span>. 
                                This might affect catalog integrity for existing products.
                            </p>
                        </div>
                        <div className="mt-10 flex gap-4">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 rounded-2xl border border-gray-100 bg-white py-4 font-plus-jakarta text-sm font-bold text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#111]">Cancel</button>
                            <button onClick={handleDelete} disabled={isSaving} className="flex-1 rounded-2xl bg-rose-600 py-4 font-plus-jakarta text-sm font-bold text-white shadow-xl shadow-rose-600/20 hover:bg-rose-700 active:scale-95 flex justify-center items-center">
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Deletion"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
