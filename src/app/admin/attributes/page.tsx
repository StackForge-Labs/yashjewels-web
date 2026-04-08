"use client";

import { useState } from "react";
import { Plus, Edit3, Trash2, Gem, Sparkles, Layers } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Modal } from "../_components/ui/Modal";
import { ConfirmDialog } from "../_components/ui/ConfirmDialog";
import { FormField, inputCls, selectCls } from "../_components/ui/FormField";

type Attribute = { id: string; type: "Gold Karat" | "Diamond Quality" | "Stone Type"; value: string; is_active: boolean };

const initialAttributes: Attribute[] = [
    { id: "1", type: "Gold Karat", value: "18K (75%)", is_active: true },
    { id: "2", type: "Gold Karat", value: "22K (91.6%)", is_active: true },
    { id: "3", type: "Gold Karat", value: "24K (99.9%)", is_active: true },
    { id: "4", type: "Diamond Quality", value: "VVS1 — Colorless", is_active: true },
    { id: "5", type: "Diamond Quality", value: "VS2 — Near Colorless", is_active: true },
    { id: "6", type: "Stone Type", value: "Sapphire", is_active: true },
    { id: "7", type: "Stone Type", value: "Emerald", is_active: true },
    { id: "8", type: "Stone Type", value: "Ruby", is_active: false },
];

const typeIcons: Record<Attribute["type"], typeof Gem> = { "Gold Karat": Sparkles, "Diamond Quality": Gem, "Stone Type": Layers };
const typeColors: Record<Attribute["type"], string> = {
    "Gold Karat": "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    "Diamond Quality": "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    "Stone Type": "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
};

type FormData = { type: Attribute["type"]; value: string; is_active: boolean };
const emptyForm: FormData = { type: "Gold Karat", value: "", is_active: true };

export default function AttributesPage() {
    const [attributes, setAttributes] = useState<Attribute[]>(initialAttributes);
    const [selected, setSelected] = useState<Attribute | null>(null);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [form, setForm] = useState<FormData>(emptyForm);
    const [filterType, setFilterType] = useState<string>("All");

    const filtered = attributes.filter(a => filterType === "All" || a.type === filterType);

    const openCreate = () => { setForm(emptyForm); setMode("create"); setIsModalOpen(true); };
    const openEdit = (a: Attribute) => { setSelected(a); setForm({ type: a.type, value: a.value, is_active: a.is_active }); setMode("edit"); setIsModalOpen(true); };

    const handleSave = () => {
        if (mode === "create") {
            setAttributes([...attributes, { id: Date.now().toString(), ...form }]);
        } else if (selected) {
            setAttributes(attributes.map(a => a.id === selected.id ? { ...a, ...form } : a));
        }
        setIsModalOpen(false);
    };

    const handleDelete = () => {
        if (selected) setAttributes(attributes.filter(a => a.id !== selected.id));
        setIsDeleteOpen(false);
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Jewelry Attributes" description="Manage gold karats, diamond quality grades, and gemstone types."
                actions={
                    <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)] hover:bg-blue-700">
                        <Plus className="h-4 w-4" /> Add Attribute
                    </button>
                }
            />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="border-b border-gray-100 p-6 dark:border-gray-800/50">
                    <div className="flex gap-2">
                        {["All", "Gold Karat", "Diamond Quality", "Stone Type"].map(t => (
                            <button key={t} onClick={() => setFilterType(t)}
                                className={`rounded-lg px-3 py-1.5 font-plus-jakarta text-xs font-bold transition-colors ${filterType === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"}`}>{t}</button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>{["Type", "Value", "Status", ""].map(h => <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {filtered.map(attr => {
                                const Icon = typeIcons[attr.type];
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
                                                <button onClick={() => openEdit(attr)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600"><Edit3 className="h-4 w-4" /></button>
                                                <button onClick={() => { setSelected(attr); setIsDeleteOpen(true); }} className="rounded-lg p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={mode === "create" ? "Add Attribute" : "Edit Attribute"} size="sm"
                footer={<>
                    <button onClick={() => setIsModalOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300">Cancel</button>
                    <button onClick={handleSave} disabled={!form.value} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-40">{mode === "create" ? "Create" : "Save"}</button>
                </>}>
                <div className="flex flex-col gap-4">
                    <FormField label="Attribute Type" required>
                        <select className={selectCls} value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Attribute["type"] })}>
                            <option>Gold Karat</option>
                            <option>Diamond Quality</option>
                            <option>Stone Type</option>
                        </select>
                    </FormField>
                    <FormField label="Value" required hint="e.g. 18K (75%), VVS1 — Colorless, Sapphire">
                        <input className={inputCls} placeholder="Enter attribute value..." value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
                    </FormField>
                    <FormField label="Status">
                        <select className={selectCls} value={form.is_active ? "active" : "inactive"} onChange={e => setForm({ ...form, is_active: e.target.value === "active" })}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </FormField>
                </div>
            </Modal>

            <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete}
                title="Delete Attribute" description={`Delete "${selected?.value}"? Products using this attribute must be updated.`} confirmLabel="Delete" />
        </div>
    );
}
