"use client";

import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, Gem, Sparkles, Layers, RefreshCw } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Modal } from "../_components/ui/Modal";
import { ConfirmDialog } from "../_components/ui/ConfirmDialog";
import { FormField, inputCls, selectCls } from "../_components/ui/FormField";
import { specService, JewelrySpecItem } from "@/services/spec.service";
import toast from "react-hot-toast";

type SpecType = "Gold Karat" | "Diamond Quality" | "Jewel Type";
interface UnifiedAttribute { id: string; type: SpecType; value: string; is_active: boolean };

const typeIcons: Record<SpecType, typeof Gem> = { "Gold Karat": Sparkles, "Diamond Quality": Gem, "Jewel Type": Layers };
const typeColors: Record<SpecType, string> = {
    "Gold Karat": "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    "Diamond Quality": "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    "Jewel Type": "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
};

export default function AttributesPage() {
    const [attributes, setAttributes] = useState<UnifiedAttribute[]>([]);
    const [selected, setSelected] = useState<UnifiedAttribute | null>(null);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    
    const [form, setForm] = useState({ type: "Gold Karat" as SpecType, value: "", is_active: true });
    const [filterType, setFilterType] = useState<string>("All");

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [karats, qualities, types] = await Promise.all([
                specService.getGoldKarats(),
                specService.getDiamondQualities(),
                specService.getJewelTypes()
            ]);

            const unified: UnifiedAttribute[] = [
                ...(karats.data || []).map(k => ({ id: k.id, type: "Gold Karat" as SpecType, value: k.caratLabel || "Unknown", is_active: k.isActive })),
                ...(qualities.data || []).map(q => ({ id: q.id, type: "Diamond Quality" as SpecType, value: q.gradeName || "Unknown", is_active: q.isActive })),
                ...(types.data || []).map(t => ({ id: t.id, type: "Jewel Type" as SpecType, value: t.name || "Unknown", is_active: t.isActive }))
            ];
            setAttributes(unified);
        } catch (error) {
            toast.error("Could not fetch specifications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const openCreate = () => { setForm({ type: "Gold Karat", value: "", is_active: true }); setMode("create"); setIsModalOpen(true); };
    const openEdit = (a: UnifiedAttribute) => { setSelected(a); setForm({ type: a.type, value: a.value, is_active: a.is_active }); setMode("edit"); setIsModalOpen(true); };

    const handleSave = async () => {
        setActionLoading(true);
        try {
            let res;
            if (form.type === "Gold Karat") {
                const payload = { caratLabel: form.value, isActive: form.is_active };
                res = mode === "create" ? await specService.createGoldKarat(payload) : await specService.updateGoldKarat(selected!.id, payload);
            } else if (form.type === "Diamond Quality") {
                const payload = { gradeName: form.value, isActive: form.is_active };
                res = mode === "create" ? await specService.createDiamondQuality(payload) : await specService.updateDiamondQuality(selected!.id, payload);
            }

            if (res?.success) {
                toast.success("Specification saved.");
                setIsModalOpen(false);
                fetchAll();
            }
        } catch(e) {
            toast.error("Failed to save.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selected) return;
        setActionLoading(true);
        try {
            let res;
            if (selected.type === "Gold Karat") res = await specService.deleteGoldKarat(selected.id);
            if (selected.type === "Diamond Quality") res = await specService.deleteDiamondQuality(selected.id);
            
            if (res?.success) {
                toast.success("Deleted successfully.");
                setIsDeleteOpen(false);
                fetchAll();
            }
        } catch(e) {
            toast.error("Operation failed.");
        } finally {
            setActionLoading(false);
        }
    };

    const filtered = attributes.filter(a => filterType === "All" || a.type === filterType);

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Jewelry Specifications" description="Manage gold karats, diamond quality grades, and jewel types used across products."
                actions={
                    <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)] hover:bg-blue-700 font-bold">
                        <Plus className="h-4 w-4" /> Add Specification
                    </button>
                }
            />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="border-b border-gray-100 p-6 dark:border-gray-800/50">
                    <div className="flex gap-2">
                        {["All", "Gold Karat", "Diamond Quality", "Jewel Type"].map(t => (
                            <button key={t} onClick={() => setFilterType(t)}
                                className={`rounded-lg px-3 py-1.5 font-plus-jakarta text-xs font-bold transition-colors ${filterType === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"}`}>{t}</button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>{["Type", "Display Value", "Status", ""].map(h => <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {loading ? (
                                <tr><td colSpan={4} className="text-center py-20 text-gray-400 font-plus-jakarta animate-pulse">Scanning specifications pool...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-20 text-gray-400 font-plus-jakarta">No specifications found matching filters.</td></tr>
                            ) : filtered.map(attr => {
                                const Icon = typeIcons[attr.type] || Layers;
                                return (
                                    <tr key={attr.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 font-plus-jakarta text-xs font-bold ${typeColors[attr.type]}`}>
                                                <Icon className="h-3.5 w-3.5" /> {attr.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm font-semibold text-gray-900 dark:text-white">{attr.value}</td>
                                        <td className="px-6 py-4"><StatusBadge status={attr.is_active ? "active" : "inactive"} /></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openEdit(attr)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"><Edit3 className="h-4 w-4" /></button>
                                                <button onClick={() => { setSelected(attr); setIsDeleteOpen(true); }} className="rounded-lg p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={mode === "create" ? "Add Specification" : "Edit Specification"} size="sm"
                footer={<>
                    <button onClick={() => setIsModalOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300">Cancel</button>
                    <button onClick={handleSave} disabled={actionLoading || !form.value} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-40">{actionLoading ? "Saving..." : (mode === "create" ? "Create" : "Save")}</button>
                </>}>
                <div className="flex flex-col gap-4">
                    <FormField label="Specification Type" required>
                        <select className={selectCls} value={form.type} onChange={e => setForm({ ...form, type: e.target.value as SpecType })}>
                            <option value="Gold Karat">Gold Karat</option>
                            <option value="Diamond Quality">Diamond Quality</option>
                            <option value="Jewel Type">Jewel Type</option>
                        </select>
                    </FormField>
                    <FormField label="Display Value" required hint={form.type === "Gold Karat" ? "e.g. 18K (75%)" : "e.g. VVS1 or Emerald"}>
                        <input className={inputCls} placeholder="Enter value..." value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
                    </FormField>
                    <FormField label="Availability Status">
                        <select className={selectCls} value={form.is_active ? "active" : "inactive"} onChange={e => setForm({ ...form, is_active: e.target.value === "active" })}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </FormField>
                </div>
            </Modal>

            <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete}
                title="Remove Specification" description={`Are you sure you want to remove "${selected?.value}"? This may affect existing products linked to this specification.`} confirmLabel="Remove" />
        </div>
    );
}
