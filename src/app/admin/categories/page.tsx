"use client";

import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Search, AlertCircle, RefreshCw } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Modal } from "../_components/ui/Modal";
import { ConfirmDialog } from "../_components/ui/ConfirmDialog";
import { FormField, inputCls, selectCls } from "../_components/ui/FormField";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Category } from "@/types/category.types";
import { categoryService } from "@/services/category.service";

const categorySchema = z.object({
    name: z.string().min(2, "Tên danh mục ít nhất 2 ký tự"),
    slug: z.string().min(2, "Slug ít nhất 2 ký tự"),
    parentId: z.string().optional().nullable(),
    sortOrder: z.coerce.number().min(0, "Thứ tự không được nhỏ hơn 0"),
    isActive: z.boolean().default(true),
});
type CategoryFormData = z.infer<typeof categorySchema>;

function toSlug(name: string) { return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""); }

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Category | null>(null);
    const [mode, setMode] = useState<"create" | "edit">("create");
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isRestoreOpen, setIsRestoreOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    const fetchCategories = async () => {
        setLoading(true);
        const data = await categoryService.getAll();
        setCategories(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const { register, handleSubmit, setValue, reset, watch, formState: { errors, isSubmitting } } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: { name: "", slug: "", parentId: "", sortOrder: 1, isActive: true }
    });

    // Auto-generate slug when name changes for create mode
    const watchedName = watch("name");
    useEffect(() => {
        if (mode === "create" && watchedName) {
            setValue("slug", toSlug(watchedName), { shouldValidate: true });
        }
    }, [watchedName, mode, setValue]);

    const openCreate = () => {
        reset({ name: "", slug: "", parentId: "", sortOrder: 1, isActive: true });
        setErrorMsg(null);
        setMode("create");
        setIsModalOpen(true);
    };

    const openEdit = (c: Category) => {
        setSelected(c);
        reset({ 
            name: c.name, 
            slug: c.slug, 
            parentId: c.parentId ?? "", 
            sortOrder: c.sortOrder, 
            isActive: c.isActive 
        });
        setErrorMsg(null);
        setMode("edit");
        setIsModalOpen(true);
    };

    const onSubmit = async (data: CategoryFormData) => {
        setErrorMsg(null);
        const payload = {
            ...data,
            parentId: data.parentId === "" ? null : data.parentId
        };

        let res;
        if (mode === "create") {
            res = await categoryService.create(payload);
        } else if (selected) {
            res = await categoryService.update(selected.id, payload);
        }

        if (res?.success) {
            fetchCategories();
            setIsModalOpen(false);
        } else {
            setErrorMsg(res?.message || "Đã xảy ra lỗi hệ thống.");
        }
    };

    const handleDelete = async () => {
        if (!selected) return;
        const res = await categoryService.delete(selected.id);
        if (res.success) {
            fetchCategories();
            setIsDeleteOpen(false);
        } else {
            alert(res.message);
        }
    };

    const handleRestore = async () => {
        if (!selected) return;
        const res = await categoryService.restore(selected.id);
        if (res.success) {
            fetchCategories();
            setIsRestoreOpen(false);
        } else {
            alert(res.message);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Categories Dashboard" description="Quản lý cấu trúc danh mục sản phẩm (sửa, xóa ẩn, phòng chống đứt gãy DB)."
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
                        <input type="text" placeholder="Tìm danh mục..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-transparent font-plus-jakarta text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500" />
                    </div>
                </div>
                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>{["Tên", "Slug", "Danh Mục Cha", "Thứ tự", "Trạng thái", ""].map(h => <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Đang tải dữ liệu...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Không tìm thấy danh mục nào.</td></tr>
                            ) : filtered.map(cat => (
                                <tr key={cat.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">
                                        <div className="flex items-center gap-2">
                                            {cat.name}
                                            {/* {cat.deletedAt && <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">DELETED</span>} */}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500">/{cat.slug}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500">
                                        {cat.parentId ? categories.find(c => c.id === cat.parentId)?.name || cat.parentId : "—"}
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{cat.sortOrder}</td>
                                    <td className="px-6 py-4"><StatusBadge status={cat.isActive ? "active" : "inactive"} /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            {/* Restore button if deleted, but our global query filter hides deleted ones by default unless fetched directly */}
                                            {cat.isActive ? (
                                                <>
                                                    <button onClick={() => openEdit(cat)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600"><Edit3 className="h-4 w-4" /></button>
                                                    <button onClick={() => { setSelected(cat); setIsDeleteOpen(true); }} className="rounded-lg p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                                                </>
                                            ) : (
                                                <button onClick={() => { setSelected(cat); setIsRestoreOpen(true); }} className="rounded-lg p-2 text-emerald-500 hover:bg-emerald-50"><RefreshCw className="h-4 w-4" /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={mode === "create" ? "Tạo danh mục mới" : "Sửa danh mục"} size="md"
                footer={<>
                    <button onClick={() => setIsModalOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300">Hủy</button>
                    <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50">
                        {isSubmitting ? "Đang xử lý..." : mode === "create" ? "Tạo mới" : "Lưu thay đổi"}
                    </button>
                </>}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {errorMsg && (
                        <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-800 dark:bg-rose-500/10 dark:text-rose-400">
                            <AlertCircle className="h-4 w-4" /> {errorMsg}
                        </div>
                    )}
                    <FormField label="Tên danh mục" required>
                        <input className={inputCls} placeholder="VD: Trang sức cưới" {...register("name")} />
                        {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>}
                    </FormField>
                    
                    <FormField label="Đường dẫn (Slug)" hint="Tự động tạo từ tên nhưng có thể sửa">
                        <input className={inputCls} {...register("slug")} />
                        {errors.slug && <p className="text-rose-500 text-xs mt-1">{errors.slug.message}</p>}
                    </FormField>

                    <FormField label="Danh mục cha">
                        <select className={selectCls} {...register("parentId")}>
                            <option value="">Không có (Gốc)</option>
                            {categories.filter(c => c.id !== selected?.id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Thứ tự hiển thị">
                            <input type="number" className={inputCls} {...register("sortOrder")} />
                            {errors.sortOrder && <p className="text-rose-500 text-xs mt-1">{errors.sortOrder.message}</p>}
                        </FormField>
                        <FormField label="Trạng thái hiển thị">
                            <select className={selectCls} {...register("isActive", {
                                setValueAs: (v) => v === "true" || v === true
                            })}>
                                <option value="true">Hiển thị</option>
                                <option value="false">Ẩn</option>
                            </select>
                        </FormField>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete} title="Xóa danh mục"
                description={`Bạn có chắc chắn muốn xóa danh mục "${selected?.name}"? Hệ thống sẽ chặn nếu có sản phẩm bên trong.`} confirmLabel="Xóa" />
                
            <ConfirmDialog isOpen={isRestoreOpen} onClose={() => setIsRestoreOpen(false)} onConfirm={handleRestore} title="Khôi phục danh mục"
                description={`Khôi phục hiển thị cho "${selected?.name}"?`} confirmLabel="Khôi phục" />
        </div>
    );
}
