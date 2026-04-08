"use client";

import { useState } from "react";
import { Plus, Edit3, Trash2, Eye, Package } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Modal } from "../_components/ui/Modal";
import { Drawer } from "../_components/ui/Drawer";
import { ConfirmDialog } from "../_components/ui/ConfirmDialog";
import { FormField, inputCls, selectCls, textareaCls } from "../_components/ui/FormField";

type Product = {
    id: string;
    style_code: string;
    name: string;
    category: string;
    brand: string;
    gold_karat: string;
    quantity: number;
    gold_weight: number;
    net_gold: number;
    making_charge: number;
    description: string;
    status: "active" | "draft" | "inactive";
    sold_count: number;
    view_count: number;
    created_at: string;
};

const initialProducts: Product[] = [
    { id: "1", style_code: "RNK-001", name: "Classic Solitaire Ring", category: "Rings", brand: "Yash", gold_karat: "18K", quantity: 15, gold_weight: 4.5, net_gold: 4.0, making_charge: 1200, description: "Timeless solitaire design in 18K yellow gold.", status: "active", sold_count: 32, view_count: 1201, created_at: "2026-01-10" },
    { id: "2", style_code: "NCK-002", name: "Diamond Tennis Necklace", category: "Necklaces", brand: "Yash", gold_karat: "24K", quantity: 5, gold_weight: 15.2, net_gold: 14.8, making_charge: 4500, description: "Stunning diamond tennis necklace set in 24K gold.", status: "active", sold_count: 18, view_count: 845, created_at: "2026-02-14" },
    { id: "3", style_code: "BRC-003", name: "Emerald Cut Bracelet", category: "Bracelets", brand: "Aurum", gold_karat: "18K", quantity: 8, gold_weight: 12.0, net_gold: 11.5, making_charge: 2800, description: "Emerald cut stones set in interlocking links.", status: "active", sold_count: 9, view_count: 430, created_at: "2026-02-28" },
    { id: "4", style_code: "ERR-004", name: "Sapphire Drop Earrings", category: "Earrings", brand: "Yash", gold_karat: "18K", quantity: 20, gold_weight: 6.5, net_gold: 5.8, making_charge: 1100, description: "Deep blue sapphire cluster drop earrings.", status: "draft", sold_count: 0, view_count: 215, created_at: "2026-03-20" },
    { id: "5", style_code: "RNK-005", name: "Vintage Halo Ring", category: "Rings", brand: "Yash", gold_karat: "24K", quantity: 3, gold_weight: 5.0, net_gold: 4.6, making_charge: 1800, description: "Victorian halo setting with brilliant center stone.", status: "inactive", sold_count: 7, view_count: 302, created_at: "2026-04-01" },
];

const emptyProduct: Omit<Product, "id" | "sold_count" | "view_count" | "created_at"> = {
    style_code: "", name: "", category: "Rings", brand: "Yash", gold_karat: "18K",
    quantity: 1, gold_weight: 0, net_gold: 0, making_charge: 0, description: "", status: "draft",
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [search, setSearch] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [form, setForm] = useState<typeof emptyProduct>(emptyProduct);

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.style_code.toLowerCase().includes(search.toLowerCase())
    );

    const openCreate = () => {
        setForm(emptyProduct);
        setDrawerMode("create");
        setIsDrawerOpen(true);
    };

    const openEdit = (p: Product) => {
        setSelectedProduct(p);
        const { id, sold_count, view_count, created_at, ...rest } = p;
        setForm(rest);
        setDrawerMode("edit");
        setIsDrawerOpen(true);
    };

    const openDetail = (p: Product) => { setSelectedProduct(p); setIsDetailOpen(true); };
    const openDelete = (p: Product) => { setSelectedProduct(p); setIsDeleteOpen(true); };

    const handleSave = () => {
        if (drawerMode === "create") {
            const newProduct: Product = {
                ...form, id: Date.now().toString(),
                sold_count: 0, view_count: 0, created_at: new Date().toISOString().split("T")[0],
            };
            setProducts([newProduct, ...products]);
        } else if (selectedProduct) {
            setProducts(products.map((p) => p.id === selectedProduct.id ? { ...selectedProduct, ...form } : p));
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = () => {
        if (selectedProduct) setProducts(products.filter((p) => p.id !== selectedProduct.id));
        setIsDeleteOpen(false);
    };

    const field = (key: keyof typeof form) => ({
        value: form[key] as string,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
            setForm({ ...form, [key]: e.target.value }),
    });

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Products Catalog"
                description="Manage your jewelry inventory, variations, and stock levels."
                badge={{ count: products.filter(p => p.status === "active").length, label: "active" }}
                actions={
                    <>
                        <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)] transition-all hover:bg-blue-700">
                            <Plus className="h-4 w-4" /> Add Product
                        </button>
                    </>
                }
            />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="flex flex-col gap-4 border-b border-gray-100 p-6 md:flex-row md:items-center md:justify-between dark:border-gray-800/50">
                    <div className="flex max-w-md flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 dark:border-gray-800 dark:bg-[#1a1a1a]/50">
                        <Package className="h-4 w-4 shrink-0 text-gray-400" />
                        <input type="text" placeholder="Search by name or style code..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-transparent font-plus-jakarta text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500" />
                    </div>
                    <select className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-plus-jakarta text-sm font-bold text-gray-700 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300">
                        <option>All Statuses</option>
                        <option>Active</option>
                        <option>Draft</option>
                        <option>Inactive</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                {["Product Info", "Category", "Stock", "Net Gold", "Views / Sold", "Status", ""].map(h => (
                                    <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {filtered.map((p) => (
                                <tr key={p.id} className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
                                                <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white">{p.name}</p>
                                                <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">{p.style_code}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-semibold text-gray-600 dark:text-gray-300">{p.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-plus-jakarta text-sm font-bold ${p.quantity <= 5 ? "text-rose-600" : "text-gray-900 dark:text-white"}`}>{p.quantity}</span>
                                        <span className="ml-1 font-plus-jakarta text-xs text-gray-400">units</span>
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-medium text-gray-600 dark:text-gray-300">{p.net_gold} gm</td>
                                    <td className="px-6 py-4">
                                        <span className="font-plus-jakarta text-xs font-bold text-gray-500">{p.view_count.toLocaleString()} / {p.sold_count}</span>
                                    </td>
                                    <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => openDetail(p)} className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-800"><Eye className="h-4 w-4" /></button>
                                            <button onClick={() => openEdit(p)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800"><Edit3 className="h-4 w-4" /></button>
                                            <button onClick={() => openDelete(p)} className="rounded-lg p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-gray-800"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 p-6 dark:border-gray-800/50">
                    <span className="font-plus-jakarta text-xs font-medium text-gray-500">Showing {filtered.length} of {products.length} products</span>
                </div>
            </div>

            {/* Create / Edit Drawer */}
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title={drawerMode === "create" ? "Add New Product" : "Edit Product"}
                subtitle={drawerMode === "edit" ? selectedProduct?.style_code : "Fill in the jewelry details below"}
                footer={
                    <>
                        <button onClick={() => setIsDrawerOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300">Cancel</button>
                        <button onClick={handleSave} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700">
                            {drawerMode === "create" ? "Create Product" : "Save Changes"}
                        </button>
                    </>
                }
            >
                <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Product Name" required>
                            <input className={inputCls} placeholder="e.g. Classic Solitaire Ring" {...field("name")} />
                        </FormField>
                        <FormField label="Style Code" required>
                            <input className={inputCls} placeholder="e.g. RNK-001" {...field("style_code")} />
                        </FormField>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Category">
                            <select className={selectCls} {...field("category")}>
                                {["Rings", "Necklaces", "Bracelets", "Earrings", "Pendants"].map(c => <option key={c}>{c}</option>)}
                            </select>
                        </FormField>
                        <FormField label="Brand">
                            <select className={selectCls} {...field("brand")}>
                                {["Yash", "Aurum", "Custom"].map(b => <option key={b}>{b}</option>)}
                            </select>
                        </FormField>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Gold Karat">
                            <select className={selectCls} {...field("gold_karat")}>
                                {["18K", "22K", "24K"].map(k => <option key={k}>{k}</option>)}
                            </select>
                        </FormField>
                        <FormField label="Quantity" required>
                            <input type="number" className={inputCls} placeholder="0" {...field("quantity")} />
                        </FormField>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Gold Weight (gm)">
                            <input type="number" step="0.01" className={inputCls} placeholder="4.50" {...field("gold_weight")} />
                        </FormField>
                        <FormField label="Net Gold (gm)">
                            <input type="number" step="0.01" className={inputCls} placeholder="4.00" {...field("net_gold")} />
                        </FormField>
                    </div>
                    <FormField label="Making Charge (VND)">
                        <input type="number" className={inputCls} placeholder="1200000" {...field("making_charge")} />
                    </FormField>
                    <FormField label="Status">
                        <select className={selectCls} {...field("status")}>
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </FormField>
                    <FormField label="Description">
                        <textarea rows={3} className={textareaCls} placeholder="Brief product description..." {...field("description")} />
                    </FormField>
                </div>
            </Drawer>

            {/* Detail Modal */}
            <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Product Details" size="lg"
                footer={
                    <>
                        <button onClick={() => { setIsDetailOpen(false); openEdit(selectedProduct!); }} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300">Edit</button>
                        <button onClick={() => setIsDetailOpen(false)} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700">Close</button>
                    </>
                }
            >
                {selectedProduct && (
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
                                <Package className="h-8 w-8 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-plus-jakarta text-xl font-bold text-gray-900 dark:text-white">{selectedProduct.name}</h3>
                                <p className="font-plus-jakarta text-xs font-bold uppercase tracking-widest text-gray-400">{selectedProduct.style_code}</p>
                            </div>
                            <div className="ml-auto"><StatusBadge status={selectedProduct.status} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Category", value: selectedProduct.category },
                                { label: "Brand", value: selectedProduct.brand },
                                { label: "Gold Karat", value: selectedProduct.gold_karat },
                                { label: "Quantity", value: `${selectedProduct.quantity} units` },
                                { label: "Gold Weight", value: `${selectedProduct.gold_weight} gm` },
                                { label: "Net Gold", value: `${selectedProduct.net_gold} gm` },
                                { label: "Making Charge", value: `${Number(selectedProduct.making_charge).toLocaleString()} VND` },
                                { label: "Views / Sold", value: `${selectedProduct.view_count} / ${selectedProduct.sold_count}` },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex flex-col gap-1 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                                    <span className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
                                    <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{value}</span>
                                </div>
                            ))}
                        </div>
                        {selectedProduct.description && (
                            <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                                <span className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</span>
                                <p className="mt-2 font-plus-jakarta text-sm font-medium text-gray-600 dark:text-gray-300">{selectedProduct.description}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Delete Confirm */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Product"
                description={`Are you sure you want to permanently delete "${selectedProduct?.name}" (${selectedProduct?.style_code})? This action cannot be undone.`}
                confirmLabel="Delete Product"
            />
        </div>
    );
}
