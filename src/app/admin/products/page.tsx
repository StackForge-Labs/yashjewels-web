"use client";

import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Eye, Package, AlertCircle, RefreshCw, Search } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Modal } from "../_components/ui/Modal";
import { Drawer } from "../_components/ui/Drawer";
import { ConfirmDialog } from "../_components/ui/ConfirmDialog";
import { FormField, inputCls, selectCls, textareaCls } from "../_components/ui/FormField";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product } from "@/types/product.types";
import { productService } from "@/services/product.service";
import { catalogService, RefItem } from "@/services/catalog.service";
import { categoryService } from "@/services/category.service";
import { Category } from "@/types/category.types";

const productSchema = z.object({
    productName: z.string().min(2, "Tên bắt buộc"),
    styleCode: z.string().min(2, "Mã bắt buộc"),
    slug: z.string().min(2),
    categoryId: z.string().min(1, "Danh mục bắt buộc"),
    brandId: z.string().min(1, "Thương hiệu bắt buộc"),
    productTypeId: z.string().min(1, "Loại bắt buộc"),
    jewelTypeId: z.string().min(1, "Đá quý bắt buộc"),
    goldKaratId: z.string().min(1, "Tuổi vàng bắt buộc"),
    certificationId: z.string().min(1, "Chứng chỉ bắt buộc"),
    vendorId: z.string().min(1, "Nhà cung cấp bắt buộc"),
    weightGrams: z.coerce.number().min(0, "Lớn hơn 0"),
    netGoldWeightGrams: z.coerce.number().min(0),
    stockQuantity: z.coerce.number().min(0),
    basePrice: z.coerce.number().min(0),
    makingCharge: z.coerce.number().min(0),
    unitOfMeasure: z.string().default("PIECE"),
    status: z.string().default("ACTIVE"),
    description: z.string().optional(),
});
type ProductFormData = z.infer<typeof productSchema>;

function toSlug(name: string) { return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""); }

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isRestoreOpen, setIsRestoreOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Reference data
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<RefItem[]>([]);
    const [productTypes, setProductTypes] = useState<RefItem[]>([]);
    const [jewelTypes, setJewelTypes] = useState<RefItem[]>([]);
    const [goldKarats, setGoldKarats] = useState<any[]>([]);
    const [certifications, setCertifications] = useState<any[]>([]);
    const [vendors, setVendors] = useState<any[]>([]);

    const filtered = products.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase()) ||
        p.styleCode?.toLowerCase().includes(search.toLowerCase())
    );

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await productService.getAll();
            setProducts(data);

            // Fetch refs if not loaded
            if (categories.length === 0) {
                const [cats, brds, ptypes, jtypes, gks, certs, vends] = await Promise.all([
                    categoryService.getAll(),
                    catalogService.getBrands(),
                    catalogService.getProductTypes(),
                    catalogService.getJewelTypes(),
                    catalogService.getGoldKarats(),
                    catalogService.getCertifications(),
                    catalogService.getVendors(),
                ]);
                setCategories(cats);
                setBrands(brds);
                setProductTypes(ptypes);
                setJewelTypes(jtypes);
                setGoldKarats(gks);
                setCertifications(certs);
                setVendors(vends);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const { register, handleSubmit, setValue, reset, watch, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            productName: "", styleCode: "", slug: "", categoryId: "", brandId: "",
            productTypeId: "", jewelTypeId: "", goldKaratId: "", certificationId: "", vendorId: "",
            weightGrams: 0, netGoldWeightGrams: 0, stockQuantity: 1, basePrice: 0, makingCharge: 0,
            unitOfMeasure: "PIECE", status: "ACTIVE", description: ""
        }
    });

    const watchedName = watch("productName");
    useEffect(() => {
        if (drawerMode === "create" && watchedName) {
            setValue("slug", toSlug(watchedName), { shouldValidate: true });
        }
    }, [watchedName, drawerMode, setValue]);

    const openCreate = () => {
        reset({
            productName: "", styleCode: "", slug: "", categoryId: "", brandId: "",
            productTypeId: "", jewelTypeId: "", goldKaratId: "", certificationId: "", vendorId: "",
            weightGrams: 0, netGoldWeightGrams: 0, stockQuantity: 1, basePrice: 0, makingCharge: 0,
            unitOfMeasure: "PIECE", status: "ACTIVE", description: ""
        });
        setErrorMsg(null);
        setDrawerMode("create");
        setIsDrawerOpen(true);
    };

    const openEdit = (p: Product) => {
        setSelectedProduct(p);
        reset({
            productName: p.productName || "",
            styleCode: p.styleCode || "",
            slug: p.slug || "",
            categoryId: p.categoryId,
            brandId: p.brandId,
            productTypeId: p.productTypeId,
            jewelTypeId: p.jewelTypeId,
            goldKaratId: p.goldKaratId,
            certificationId: p.certificationId,
            vendorId: p.vendorId,
            weightGrams: p.weightGrams,
            netGoldWeightGrams: p.netGoldWeightGrams,
            stockQuantity: p.stockQuantity,
            basePrice: p.basePrice,
            makingCharge: p.makingCharge,
            unitOfMeasure: p.unitOfMeasure,
            status: p.status,
            description: p.description
        });
        setErrorMsg(null);
        setDrawerMode("edit");
        setIsDrawerOpen(true);
    };

    const openDetail = (p: Product) => { setSelectedProduct(p); setIsDetailOpen(true); };
    const openDelete = (p: Product) => { setSelectedProduct(p); setIsDeleteOpen(true); };

    const onSubmit = async (data: ProductFormData) => {
        setErrorMsg(null);
        let res;
        if (drawerMode === "create") {
            res = await productService.create(data);
        } else if (selectedProduct) {
            res = await productService.update(selectedProduct.id, data);
        }

        if (res?.success) {
            fetchData();
            setIsDrawerOpen(false);
        } else {
            setErrorMsg(res?.message || "Đã xảy ra lỗi hệ thống.");
        }
    };

    const handleDelete = async () => {
        if (!selectedProduct) return;
        const res = await productService.delete(selectedProduct.id);
        if (res.success) {
            fetchData();
            setIsDeleteOpen(false);
        } else {
            alert(res.message);
        }
    };

    const handleRestore = async () => {
        if (!selectedProduct) return;
        const res = await productService.restore(selectedProduct.id);
        if (res.success) {
            fetchData();
            setIsRestoreOpen(false);
        } else {
            alert(res.message);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Sản phẩm"
                description="Quản lý kho trang sức, các biến thể và số lượng tồn kho."
                badge={{ count: products.filter(p => p.status === "ACTIVE").length, label: "active" }}
                actions={
                    <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)] hover:bg-blue-700">
                        <Plus className="h-4 w-4" /> Thêm sản phẩm
                    </button>
                }
            />

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="flex flex-col gap-4 border-b border-gray-100 p-6 md:flex-row md:items-center md:justify-between dark:border-gray-800/50">
                    <div className="flex max-w-md flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 dark:border-gray-800 dark:bg-[#1a1a1a]/50">
                        <Search className="h-4 w-4 shrink-0 text-gray-400" />
                        <input type="text" placeholder="Tìm theo tên hoặc mã SP..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-transparent font-plus-jakarta text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500" />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>
                                {["Thông tin", "Giá cơ bản", "Tồn kho", "Trọng lượng vàng", "Trạng thái", ""].map(h => (
                                    <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Đang tải dữ liệu...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Không tìm thấy sản phẩm nào.</td></tr>
                            ) : filtered.map((p) => (
                                <tr key={p.id} className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
                                                <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="font-plus-jakarta text-sm font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white">{p.productName}</p>
                                                <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">{p.styleCode}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-medium text-gray-600 dark:text-gray-300">
                                        {Number(p.basePrice).toLocaleString()} VND
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-plus-jakarta text-sm font-bold ${p.stockQuantity <= 5 ? "text-rose-600" : "text-gray-900 dark:text-white"}`}>{p.stockQuantity}</span>
                                        <span className="ml-1 font-plus-jakarta text-xs text-gray-400">units</span>
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-medium text-gray-600 dark:text-gray-300">{p.netGoldWeightGrams} gm</td>
                                    <td className="px-6 py-4"><StatusBadge status={p.status.toLowerCase() as any} /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            {p.status === "INACTIVE" || p.status === "DELETED" ? (
                                                <button onClick={() => { setSelectedProduct(p); setIsRestoreOpen(true); }} className="rounded-lg p-2 text-emerald-500 hover:bg-emerald-50"><RefreshCw className="h-4 w-4" /></button>
                                            ) : (
                                                <>
                                                    <button onClick={() => openDetail(p)} className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-800"><Eye className="h-4 w-4" /></button>
                                                    <button onClick={() => openEdit(p)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800"><Edit3 className="h-4 w-4" /></button>
                                                    <button onClick={() => openDelete(p)} className="rounded-lg p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-gray-800"><Trash2 className="h-4 w-4" /></button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 p-6 dark:border-gray-800/50">
                    <span className="font-plus-jakarta text-xs font-medium text-gray-500">Hiển thị {filtered.length} trên {products.length} sản phẩm</span>
                </div>
            </div>

            {/* Create / Edit Drawer */}
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title={drawerMode === "create" ? "Thêm Sản Phẩm Mới" : "Sửa Sản Phẩm"}
                subtitle={drawerMode === "edit" ? selectedProduct?.styleCode : "Điền các thông tin của trang sức"}
                footer={
                    <>
                        <button onClick={() => setIsDrawerOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300">Hủy</button>
                        <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50">
                            {isSubmitting ? "Đang xử lý..." : (drawerMode === "create" ? "Tạo Sản Phẩm" : "Lưu Thay Đổi")}
                        </button>
                    </>
                }
            >
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    {errorMsg && (
                        <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-800 dark:bg-rose-500/10 dark:text-rose-400">
                            <AlertCircle className="h-4 w-4" /> {errorMsg}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Tên sản phẩm" required>
                            <input className={inputCls} placeholder="VD: Nhẫn Kim Cương Vàng 18K" {...register("productName")} />
                            {errors.productName && <p className="text-rose-500 text-xs mt-1">{errors.productName.message}</p>}
                        </FormField>
                        <FormField label="Mã SP" required>
                            <input className={inputCls} placeholder="VD: RNK-001" {...register("styleCode")} />
                            {errors.styleCode && <p className="text-rose-500 text-xs mt-1">{errors.styleCode.message}</p>}
                        </FormField>
                    </div>

                    <FormField label="Đường dẫn (Slug)">
                        <input className={inputCls} placeholder="Tu dong tao" {...register("slug")} />
                        {errors.slug && <p className="text-rose-500 text-xs mt-1">{errors.slug.message}</p>}
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Danh Mục" required>
                            <select className={selectCls} {...register("categoryId")}>
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            {errors.categoryId && <p className="text-rose-500 text-xs mt-1">{errors.categoryId.message}</p>}
                        </FormField>
                        <FormField label="Thương Hiệu" required>
                            <select className={selectCls} {...register("brandId")}>
                                <option value="">-- Chọn thương hiệu --</option>
                                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                            {errors.brandId && <p className="text-rose-500 text-xs mt-1">{errors.brandId.message}</p>}
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Loại sản phẩm" required>
                            <select className={selectCls} {...register("productTypeId")}>
                                <option value="">-- Loại SP --</option>
                                {productTypes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </FormField>
                        <FormField label="Loại đá quý" required>
                            <select className={selectCls} {...register("jewelTypeId")}>
                                <option value="">-- Loại đá --</option>
                                {jewelTypes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Tuổi vàng" required>
                            <select className={selectCls} {...register("goldKaratId")}>
                                <option value="">-- Chọn tuổi vàng --</option>
                                {goldKarats.map(k => <option key={k.id} value={k.id}>{k.caratLabel || k.name}</option>)}
                            </select>
                        </FormField>
                        <FormField label="Chứng chỉ">
                            <select className={selectCls} {...register("certificationId")}>
                                <option value="">-- Chọn chứng chỉ --</option>
                                {certifications.map(c => <option key={c.id} value={c.id}>{c.certCode || c.name}</option>)}
                            </select>
                        </FormField>
                    </div>

                    <FormField label="Nhà cung cấp" required>
                        <select className={selectCls} {...register("vendorId")}>
                            <option value="">-- Chọn nhà cung cấp --</option>
                            {vendors.map(v => <option key={v.id} value={v.id}>{v.businessName || v.name}</option>)}
                        </select>
                        {errors.vendorId && <p className="text-rose-500 text-xs mt-1">{errors.vendorId.message}</p>}
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Tổng Trọng Lượng (g)" required>
                            <input type="number" step="0.01" className={inputCls} {...register("weightGrams")} />
                            {errors.weightGrams && <p className="text-rose-500 text-xs mt-1">{errors.weightGrams.message}</p>}
                        </FormField>
                        <FormField label="Trọng Lượng Vàng Tinh Khiết (g)">
                            <input type="number" step="0.01" className={inputCls} {...register("netGoldWeightGrams")} />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <FormField label="Giá Cơ Bản (VND)">
                            <input type="number" className={inputCls} {...register("basePrice")} />
                        </FormField>
                        <FormField label="Tiền Công (VND)">
                            <input type="number" className={inputCls} {...register("makingCharge")} />
                        </FormField>
                        <FormField label="Tồn kho" required>
                            <input type="number" className={inputCls} {...register("stockQuantity")} />
                        </FormField>
                    </div>

                    <FormField label="Trạng thái">
                        <select className={selectCls} {...register("status")}>
                            <option value="ACTIVE">Active</option>
                            <option value="DRAFT">Draft</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </FormField>

                    <FormField label="Mô tả">
                        <textarea rows={3} className={textareaCls} placeholder="Mô tả ngắn về sản phẩm..." {...register("description")} />
                    </FormField>
                </form>
            </Drawer>

            {/* Detail Modal */}
            <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Chi Tiết Sản Phẩm" size="lg"
                footer={
                    <>
                        <button onClick={() => { setIsDetailOpen(false); openEdit(selectedProduct!); }} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300">Sửa</button>
                        <button onClick={() => setIsDetailOpen(false)} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700">Đóng</button>
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
                                <h3 className="font-plus-jakarta text-xl font-bold text-gray-900 dark:text-white">{selectedProduct.productName}</h3>
                                <p className="font-plus-jakarta text-xs font-bold uppercase tracking-widest text-gray-400">{selectedProduct.styleCode}</p>
                            </div>
                            <div className="ml-auto"><StatusBadge status={selectedProduct.status.toLowerCase() as any} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Giá Cơ Bản", value: `${Number(selectedProduct.basePrice).toLocaleString()} VND` },
                                { label: "Tiền Công", value: `${Number(selectedProduct.makingCharge).toLocaleString()} VND` },
                                { label: "Tồn kho", value: `${selectedProduct.stockQuantity} units` },
                                { label: "Tổng Trọng Lượng", value: `${selectedProduct.weightGrams} gm` },
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
                title="Xóa Sản Phẩm"
                description={`Bạn có chắc chắn muốn xóa sản phẩm "${selectedProduct?.productName}" (${selectedProduct?.styleCode})? Hệ thống sẽ báo lỗi bên dưới nếu sản phẩm đã phát sinh giao dịch/order.`}
                confirmLabel="Xóa Sản Phẩm"
            />
        </div>
    );
}
