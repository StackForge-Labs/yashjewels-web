"use client";

import { useState } from "react";
import { Plus, Edit3, Trash2, Search } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Modal } from "../_components/ui/Modal";
import { ConfirmDialog } from "../_components/ui/ConfirmDialog";
import { FormField, inputCls, selectCls } from "../_components/ui/FormField";

type Category = { id: string; name: string; slug: string; parent_id: string | null; parent_name: string; sort_order: number; is_active: boolean };
const initialCategories: Category[] = [
    { id: "1", name: "Rings", slug: "rings", parent_id: null, parent_name: "—", sort_order: 1, is_active: true },
    { id: "2", name: "Engagement Rings", slug: "engagement-rings", parent_id: "1", parent_name: "Rings", sort_order: 2, is_active: true },
    { id: "3", name: "Necklaces", slug: "necklaces", parent_id: null, parent_name: "—", sort_order: 3, is_active: true },
    { id: "4", name: "Pendants", slug: "pendants", parent_id: "3", parent_name: "Necklaces", sort_order: 4, is_active: true },
    { id: "5", name: "Bracelets", slug: "bracelets", parent_id: null, parent_name: "—", sort_order: 5, is_active: true },
    { id: "6", name: "Earrings", slug: "earrings", parent_id: null, parent_name: "—", sort_order: 6, is_active: true },
    { id: "7", name: "Custom Collections", slug: "custom-collections", parent_id: null, parent_name: "—", sort_order: 7, is_active: false },
];
type FormData = { name: string; slug: string; parent_id: string; sort_order: number; is_active: boolean };
const emptyForm: FormData = { name: "", slug: "", parent_id: "", sort_order: 1, is_active: true };
function toSlug(name: string) { return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""); }

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Category | null>(null);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [form, setForm] = useState<FormData>(emptyForm);

    const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    const openCreate = () => { setForm(emptyForm); setMode("create"); setIsModalOpen(true); };
    const openEdit = (c: Category) => {
        setSelected(c);
        setForm({ name: c.name, slug: c.slug, parent_id: c.parent_id ?? "", sort_order: c.sort_order, is_active: c.is_active });
        setMode("edit"); setIsModalOpen(true);
    };
    const handleSave = () => {
        const parent = categories.find(c => c.id === form.parent_id);
        if (mode === "create") {
            setCategories([...categories, { id: Date.now().toString(), ...form, parent_name: parent?.name ?? "—", parent_id: form.parent_id || null }]);
        } else if (selected) {
            setCategories(categories.map(c => c.id === selected.id ? { ...c, ...form, parent_name: parent?.name ?? "—", parent_id: form.parent_id || null } : c));
        }
        setIsModalOpen(false);
    };
    const handleDelete = () => { if (selected) setCategories(categories.filter(c => c.id !== selected.id)); setIsDeleteOpen(false); };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Categories & Brands" description="Manage your product taxonomy and navigation hierarchy."
                actions={
                    <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)] hover:bg-blue-700">
                        <Plus className="h-4 w-4" /> Add Category
                    </button>
                }
            />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="border-b border-gray-100 p-6 dark:border-gray-800/50">
                    <div className="flex max-w-sm items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 dark:border-gray-800 dark:bg-[#1a1a1a]/50">
                        <Search className="h-4 w-4 shrink-0 text-gray-400" />
                        <input type="text" placeholder="Find category..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-transparent font-plus-jakarta text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>{["Name", "Slug", "Parent", "Sort", "Status", ""].map(h => <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {filtered.map(cat => (
                                <tr key={cat.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{cat.name}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500">/{cat.slug}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500">{cat.parent_name}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{cat.sort_order}</td>
                                    <td className="px-6 py-4"><StatusBadge status={cat.is_active ? "active" : "inactive"} /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => openEdit(cat)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600"><Edit3 className="h-4 w-4" /></button>
                                            <button onClick={() => { setSelected(cat); setIsDeleteOpen(true); }} className="rounded-lg p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={mode === "create" ? "Add Category" : "Edit Category"} size="md"
                footer={<>
                    <button onClick={() => setIsModalOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300">Cancel</button>
                    <button onClick={handleSave} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700">{mode === "create" ? "Create" : "Save"}</button>
                </>}>
                <div className="flex flex-col gap-4">
                    <FormField label="Category Name" required>
                        <input className={inputCls} placeholder="e.g. Engagement Rings" value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: toSlug(e.target.value) })} />
                    </FormField>
                    <FormField label="Slug" hint="Auto-generated from name">
                        <input className={inputCls} value={form.slug} onChange={e => setForm({ ...form, slug: toSlug(e.target.value) })} />
                    </FormField>
                    <FormField label="Parent Category">
                        <select className={selectCls} value={form.parent_id} onChange={e => setForm({ ...form, parent_id: e.target.value })}>
                            <option value="">None (root)</option>
                            {categories.filter(c => !c.parent_id && c.id !== selected?.id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </FormField>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Sort Order">
                            <input type="number" className={inputCls} value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} />
                        </FormField>
                        <FormField label="Status">
                            <select className={selectCls} value={form.is_active ? "active" : "inactive"} onChange={e => setForm({ ...form, is_active: e.target.value === "active" })}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </FormField>
                    </div>
                </div>
            </Modal>

            <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete} title="Delete Category"
                description={`Delete "${selected?.name}"? Sub-categories must be re-assigned first.`} confirmLabel="Delete" />
        </div>
    );
}
