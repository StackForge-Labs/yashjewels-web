"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { 
    Plus, Search, Package, Edit3, X, Gem, TrendingUp, Filter, 
    Trash2, CheckCircle2, AlertCircle, Loader2, Save, Image as ImageIcon, 
    LayoutGrid, List, ChevronLeft, ChevronRight, Settings2, Trash, Star, Upload, Info
} from "lucide-react";
import { toast } from "react-hot-toast";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { catalogService } from "@/services/catalog.service";
import { specService } from "@/services/spec.service";
import { 
    Product, ProductCreateRequest, ProductUpdateRequest, 
    ProductStone, ProductDiamond, StoneCreateRequest, DiamondCreateRequest 
} from "@/types/product.types";
import { Category } from "@/types/category.types";
import { ConfirmModal } from "../_components/ui/ConfirmModal";


// ─── Constants ──────────────────────────────────────────────────
const STATUS_OPTIONS = [
    { value: "ACTIVE", label: "Active", color: "emerald" },
    { value: "INACTIVE", label: "Inactive", color: "gray" },
    { value: "SOLD_OUT", label: "Sold Out", color: "rose" },
    { value: "COMING_SOON", label: "Coming Soon", color: "amber" },
];

// ─── Form Components ───────────────────────────────────────────

interface FormLabelProps { children: React.ReactNode; required?: boolean }
const FormLabel = ({ children, required }: FormLabelProps) => (
    <label className="mb-1.5 block font-plus-jakarta text-[10px] font-bold uppercase tracking-wider text-gray-500">
        {children} {required && <span className="text-rose-500">*</span>}
    </label>
);

const FormInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input 
        {...props}
        className={`w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 font-plus-jakarta text-sm transition-all focus:border-amber-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 ${props.className || ""}`}
    />
);

const FormSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select 
        {...props}
        className={`w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 font-plus-jakarta text-sm transition-all focus:border-amber-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 ${props.className || ""}`}
    />
);

// ─── Modal Implementation ──────────────────────────────────────

interface ProductDrawerProps {
    productId?: string;
    onClose: () => void;
    onSuccess: () => void;
}

function ProductDrawer({ productId, onClose, onSuccess }: ProductDrawerProps) {
    const isEdit = !!productId;
    const [activeTab, setActiveTab] = useState<"general" | "specs" | "components" | "gallery">("general");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    // UI Options State
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [productTypes, setProductTypes] = useState<any[]>([]);
    const [jewelTypes, setJewelTypes] = useState<any[]>([]);
    const [karats, setKarats] = useState<any[]>([]);
    const [certs, setCerts] = useState<any[]>([]);
    const [diamondQualities, setDiamondQualities] = useState<any[]>([]);
    const [diamondCuts, setDiamondCuts] = useState<any[]>([]);
    const [stoneQualities, setStoneQualities] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState<ProductCreateRequest & { status?: string }>({
        styleCode: "", name: "", slug: "", description: "", prodQuality: "High Premium",
        vendorId: "00000000-0000-0000-0000-000000000000", brandId: "", categoryId: "",
        productTypeId: "", jewelTypeId: "", goldKaratId: "", certificationId: "",
        goldWeightGm: 0, stoneWeightGm: 0, netGoldGm: 0, wastagePct: 5, wastageGm: 0, totalGrossWeightGm: 0,
        goldMakingCharge: 0, stoneMakingCharge: 0, otherMakingCharge: 0, vatRate: 10,
        quantity: 1, status: "ACTIVE",
        stones: [], diamonds: []
    });

    const [productImages, setProductImages] = useState<any[]>([]);

    // Load Metadata
    useEffect(() => {
        const loadMetadata = async () => {
            const [cats, brs, pts, jts, kts, crs, dq, dc, sq] = await Promise.all([
                categoryService.getAll(),
                catalogService.brands.getAll(),
                catalogService.productTypes.getAll(),
                catalogService.jewelTypes.getAll(),
                specService.goldKarats.getAll(),
                specService.certifications.getAll(),
                specService.diamondQualities.getAll(),
                specService.diamondSubTypes.getAll(),
                specService.stoneQualities.getAll(),
            ]);
            setCategories(cats);
            setBrands(brs.data);
            setProductTypes(pts.data);
            setJewelTypes(jts.data);
            setKarats(kts.data);
            setCerts(crs.data);
            setDiamondQualities(dq.data);
            setDiamondCuts(dc.data);
            setStoneQualities(sq.data);
        };
        loadMetadata();
    }, []);

    // Load Existing Product
    useEffect(() => {
        if (isEdit) {
            const loadProduct = async () => {
                setLoading(true);
                try {
                    const data = await productService.getById(productId!);
                    if (data) {
                        setFormData({
                            ...data,
                            brandId: data.brandId || "",
                            categoryId: data.categoryId || "",
                            productTypeId: data.productTypeId || "",
                            jewelTypeId: data.jewelTypeId || "",
                            goldKaratId: data.goldKaratId || "",
                            certificationId: data.certificationId || "",
                            status: data.status,
                            stones: data.stones.map(s => ({ ...s })),
                            diamonds: data.diamonds.map(d => ({ ...d }))
                        } as any);
                        setProductImages(data.images || []);
                    }
                } catch (e) {
                    toast.error("Failed to load product details");
                } finally {
                    setLoading(false);
                }
            };
            loadProduct();
        }
    }, [isEdit, productId]);

    const refreshImages = async () => {
        if (!productId) return;
        const data = await productService.getById(productId);
        if (data) setProductImages(data.images || []);
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === "number" ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleComponentAction = (type: "stone" | "diamond", action: "add" | "remove", index?: number) => {
        if (action === "add") {
            if (type === "stone") setFormData(p => ({ ...p, stones: [...(p.stones || []), { name: "New Stone", stoneQuality: "", quantity: 1, weightGm: 0, ratePerGm: 0 }] }));
            else setFormData(p => ({ ...p, diamonds: [...(p.diamonds || []), { diamondQuality: "", diamondCut: "", quantity: 1, weightCts: 0, ratePerCt: 0 }] }));
        } else if (index !== undefined) {
            if (type === "stone") setFormData(p => ({ ...p, stones: p.stones?.filter((_, i) => i !== index) }));
            else setFormData(p => ({ ...p, diamonds: p.diamonds?.filter((_, i) => i !== index) }));
        }
    };

    const handleComponentChange = (type: "stone" | "diamond", index: number, field: string, value: any) => {
        if (type === "stone") {
            const newStones = [...(formData.stones || [])];
            (newStones[index] as any)[field] = field === "name" || field === "stoneQuality" ? value : parseFloat(value) || 0;
            setFormData(p => ({ ...p, stones: newStones }));
        } else {
            const newDiamonds = [...(formData.diamonds || [])];
            (newDiamonds[index] as any)[field] = field === "diamondQuality" || field === "diamondCut" ? value : parseFloat(value) || 0;
            setFormData(p => ({ ...p, diamonds: newDiamonds }));
        }
    };

    const handleSubmit = async () => {
        // Validation logic
        if (!formData.name) return toast.error("Product name is required");
        if (!formData.styleCode) return toast.error("Style code is required");
        if (!formData.categoryId) return toast.error("Category is required");
        if (!formData.productTypeId) return toast.error("Product type is required");
        if (formData.goldWeightGm <= 0) return toast.error("Gold weight must be greater than 0");

        setSubmitting(true);
        try {
            if (isEdit) {
                const res = await productService.update(productId!, formData as ProductUpdateRequest);
                if (res.success) {
                    toast.success("Product updated successfully");
                    onSuccess();
                    onClose();
                } else toast.error(res.message);
            } else {
                const res = await productService.create(formData);
                if (res.success) {
                    toast.success("Product created! Now you can upload images.");
                    onSuccess();
                    onClose();
                } else toast.error(res.message);
            }
        } catch (e) {
            toast.error("Operation failed");
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm transition-opacity">
            <div className="h-full w-full max-w-4xl animate-in slide-in-from-right bg-white shadow-2xl dark:bg-[#0a0a0a]">
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6 dark:border-gray-800">
                        <div>
                            <h2 className="font-plus-jakarta text-xl font-bold text-gray-900 dark:text-white">
                                {isEdit ? "Edit Product Master" : "Create New Master Item"}
                            </h2>
                            <p className="font-plus-jakarta text-xs text-gray-400">Configure technical specifications and catalog data</p>
                        </div>
                        <button onClick={onClose} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-8 border-b border-gray-100 px-8 dark:border-gray-800">
                        {[
                            { id: "general", label: "General Information", icon: LayoutGrid },
                            { id: "specs", label: "Technical Specs", icon: Settings2 },
                            { id: "components", label: "Stones & Diamonds", icon: Gem },
                            { id: "gallery", label: "Image Gallery", icon: ImageIcon },
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id as any)}
                                className={`flex items-center gap-2 border-b-2 py-4 font-plus-jakarta text-xs font-bold uppercase tracking-widest transition-all ${activeTab === t.id ? "border-amber-600 text-amber-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}
                            >
                                <t.icon className="h-3.5 w-3.5" /> {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-10">
                        {loading ? (
                            <div className="flex h-full flex-col items-center justify-center text-gray-400">
                                <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
                                <p className="mt-4 font-plus-jakarta text-sm">Synchronizing master data...</p>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                {activeTab === "general" && (
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2 flex flex-col gap-1.5">
                                            <FormLabel required>Full Product Name</FormLabel>
                                            <FormInput name="name" value={formData.name} onChange={handleChange} placeholder="e.g. 18K Yellow Gold Solitaire Diamond Ring" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <FormLabel required>Style Code (SKU)</FormLabel>
                                            <FormInput name="styleCode" value={formData.styleCode} onChange={handleChange} placeholder="YJ-DR-18K-001" disabled={isEdit} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <FormLabel required>Slug (URL Identifier)</FormLabel>
                                            <FormInput name="slug" value={formData.slug} onChange={handleChange} placeholder="yellow-gold-solitaire-ring" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <FormLabel required>Category</FormLabel>
                                            <FormSelect name="categoryId" value={formData.categoryId} onChange={handleChange}>
                                                <option value="">Select Categories</option>
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </FormSelect>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <FormLabel required>Brand</FormLabel>
                                            <FormSelect name="brandId" value={formData.brandId} onChange={handleChange}>
                                                <option value="">Select Brand</option>
                                                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                            </FormSelect>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <FormLabel required>Product Type</FormLabel>
                                            <FormSelect name="productTypeId" value={formData.productTypeId} onChange={handleChange}>
                                                <option value="">Select Type</option>
                                                {productTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                            </FormSelect>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <FormLabel required>Jewel Type</FormLabel>
                                            <FormSelect name="jewelTypeId" value={formData.jewelTypeId} onChange={handleChange}>
                                                <option value="">Select Jewel Type</option>
                                                {jewelTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                            </FormSelect>
                                        </div>
                                        <div className="col-span-2 flex flex-col gap-1.5">
                                            <FormLabel>Professional Description</FormLabel>
                                            <textarea 
                                                name="description" value={formData.description || ""} onChange={handleChange} 
                                                rows={4} className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 font-plus-jakarta text-sm focus:border-amber-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900"
                                                placeholder="Enter technical details, craftsmanship notes, or story..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeTab === "specs" && (
                                    <div className="space-y-10">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="flex flex-col gap-1.5">
                                                <FormLabel required>Gold Karat</FormLabel>
                                                <FormSelect name="goldKaratId" value={formData.goldKaratId} onChange={handleChange}>
                                                    <option value="">Select Karat</option>
                                                    {karats.map(k => <option key={k.id} value={k.id}>{k.karatLabel} ({k.karatValue}K)</option>)}
                                                </FormSelect>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <FormLabel required>Certification</FormLabel>
                                                <FormSelect name="certificationId" value={formData.certificationId} onChange={handleChange}>
                                                    <option value="">Select Certification</option>
                                                    {certs.map(c => <option key={c.id} value={c.id}>{c.name} ({c.certCode})</option>)}
                                                </FormSelect>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 dark:border-gray-800/50">
                                            <h3 className="mb-6 font-plus-jakarta text-xs font-bold uppercase tracking-widest text-amber-600">Weight & Mass (Grams)</h3>
                                            <div className="grid grid-cols-3 gap-6">
                                                <div className="flex flex-col gap-1.5">
                                                    <FormLabel required>Gold Weight</FormLabel>
                                                    <FormInput type="number" name="goldWeightGm" value={formData.goldWeightGm} onChange={handleChange} step="0.01" />
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <FormLabel required>Stone Weight</FormLabel>
                                                    <FormInput type="number" name="stoneWeightGm" value={formData.stoneWeightGm} onChange={handleChange} step="0.01" />
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <FormLabel required>Total Gross Weight</FormLabel>
                                                    <FormInput type="number" name="totalGrossWeightGm" value={formData.totalGrossWeightGm} onChange={handleChange} step="0.01" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-6 dark:border-gray-800/50">
                                            <h3 className="mb-6 font-plus-jakarta text-xs font-bold uppercase tracking-widest text-amber-600">Pricing & Commercials (VND)</h3>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="flex flex-col gap-1.5">
                                                    <FormLabel required>Gold Making Charge</FormLabel>
                                                    <FormInput type="number" name="goldMakingCharge" value={formData.goldMakingCharge} onChange={handleChange} />
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <FormLabel required>Stone Making Charge</FormLabel>
                                                    <FormInput type="number" name="stoneMakingCharge" value={formData.stoneMakingCharge} onChange={handleChange} />
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <FormLabel required>Wastage (%)</FormLabel>
                                                    <FormInput type="number" name="wastagePct" value={formData.wastagePct} onChange={handleChange} />
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <FormLabel required>VAT Rate (%)</FormLabel>
                                                    <FormInput type="number" name="vatRate" value={formData.vatRate} onChange={handleChange} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="flex flex-col gap-1.5">
                                                <FormLabel required>Inventory Quantity</FormLabel>
                                                <FormInput type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <FormLabel required>Product Status</FormLabel>
                                                <FormSelect name="status" value={formData.status} onChange={handleChange}>
                                                    {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                                </FormSelect>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "components" && (
                                    <div className="space-y-12">
                                        {/* Stones */}
                                        <div className="flex flex-col gap-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">Additional Stones</h3>
                                                    <p className="font-plus-jakarta text-xs text-gray-400">Manage non-diamond precious or semi-precious stones</p>
                                                </div>
                                                <button onClick={() => handleComponentAction("stone", "add")} className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/10">
                                                    <Plus className="h-3.5 w-3.5" /> Add Stone
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                {formData.stones?.length === 0 && <p className="py-4 text-center text-xs italic text-gray-400">No additional stones configured.</p>}
                                                {formData.stones?.map((s, i) => (
                                                    <div key={i} className="group relative grid grid-cols-5 gap-3 rounded-xl border border-gray-100 bg-gray-50/30 p-4 transition-all hover:border-amber-200 dark:border-gray-800 dark:bg-gray-900/40">
                                                        <div className="col-span-2">
                                                            <FormLabel>Stone Name</FormLabel>
                                                            <FormInput value={s.name} onChange={(e) => handleComponentChange("stone", i, "name", e.target.value)} />
                                                        </div>
                                                        <div>
                                                            <FormLabel>Quality</FormLabel>
                                                            <FormSelect value={s.stoneQuality} onChange={(e) => handleComponentChange("stone", i, "stoneQuality", e.target.value)}>
                                                                <option value="">Select</option>
                                                                {stoneQualities.map(q => <option key={q.id} value={q.name}>{q.name}</option>)}
                                                            </FormSelect>
                                                        </div>
                                                        <div>
                                                            <FormLabel>Qty</FormLabel>
                                                            <FormInput type="number" value={s.quantity} onChange={(e) => handleComponentChange("stone", i, "quantity", e.target.value)} />
                                                        </div>
                                                        <div className="flex items-end justify-between">
                                                            <div className="flex-1">
                                                                <FormLabel>Weight (G)</FormLabel>
                                                                <FormInput type="number" value={s.weightGm} onChange={(e) => handleComponentChange("stone", i, "weightGm", e.target.value)} />
                                                            </div>
                                                            <button onClick={() => handleComponentAction("stone", "remove", i)} className="ml-3 rounded-lg p-2 text-rose-400 transition-colors hover:bg-rose-50 dark:hover:bg-rose-500/10">
                                                                <Trash className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="h-px w-full bg-gray-100 dark:bg-gray-800/50" />

                                        {/* Diamonds */}
                                        <div className="flex flex-col gap-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">Diamond Components</h3>
                                                    <p className="font-plus-jakarta text-xs text-gray-400">Configure carat weight, quality and cut specifications</p>
                                                </div>
                                                <button onClick={() => handleComponentAction("diamond", "add")} className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-500/10">
                                                    <Plus className="h-3.5 w-3.5" /> Add Diamond
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                {formData.diamonds?.length === 0 && <p className="py-4 text-center text-xs italic text-gray-400">No diamonds configured for this master entry.</p>}
                                                {formData.diamonds?.map((d, i) => (
                                                    <div key={i} className="group relative grid grid-cols-4 gap-3 rounded-xl border border-gray-100 bg-gray-50/30 p-4 transition-all hover:border-amber-200 dark:border-gray-800 dark:bg-gray-900/40">
                                                        <div>
                                                            <FormLabel>Quality</FormLabel>
                                                            <FormSelect value={d.diamondQuality} onChange={(e) => handleComponentChange("diamond", i, "diamondQuality", e.target.value)}>
                                                                <option value="">Select</option>
                                                                {diamondQualities.map(q => <option key={q.id} value={q.gradeName}>{q.gradeName}</option>)}
                                                            </FormSelect>
                                                        </div>
                                                        <div>
                                                            <FormLabel>Cut</FormLabel>
                                                            <FormSelect value={d.diamondCut} onChange={(e) => handleComponentChange("diamond", i, "diamondCut", e.target.value)}>
                                                                <option value="">Select</option>
                                                                {diamondCuts.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                                            </FormSelect>
                                                        </div>
                                                        <div>
                                                            <FormLabel>Qty</FormLabel>
                                                            <FormInput type="number" value={d.quantity} onChange={(e) => handleComponentChange("diamond", i, "quantity", e.target.value)} />
                                                        </div>
                                                        <div className="flex items-end justify-between">
                                                            <div className="flex-1">
                                                                <FormLabel>Cts (Carats)</FormLabel>
                                                                <FormInput type="number" value={d.weightCts} onChange={(e) => handleComponentChange("diamond", i, "weightCts", e.target.value)} />
                                                            </div>
                                                            <button onClick={() => handleComponentAction("diamond", "remove", i)} className="ml-3 rounded-lg p-2 text-rose-400 transition-colors hover:bg-rose-50 dark:hover:bg-rose-500/10">
                                                                <Trash className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "gallery" && (
                                    <div className="flex flex-col gap-8">
                                        {!isEdit ? (
                                            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 dark:border-gray-800">
                                                <ImageIcon className="h-12 w-12 text-gray-200" />
                                                <p className="mt-4 font-plus-jakarta text-sm font-bold text-gray-400 text-center">Save product first to enable image orchestration.</p>
                                                <p className="mt-1 font-plus-jakarta text-xs text-gray-400 px-12 text-center text-gray-300">Authentication and ID anchoring required before file system linkage.</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/30 p-12 transition-all hover:border-amber-400 hover:bg-amber-50/30 dark:border-gray-800">
                                                    <Upload className="h-8 w-8 text-amber-600" />
                                                    <p className="mt-4 font-plus-jakarta text-sm font-bold text-gray-600 dark:text-gray-300">Master Photography Upload</p>
                                                    <p className="font-plus-jakarta text-xs text-gray-400 mt-1">Accepts high-res PNG, JPG (Max 5MB/file)</p>
                                                    <input type="file" multiple className="absolute inset-0 cursor-pointer opacity-0" onChange={async (e) => {
                                                        if (e.target.files?.length) {
                                                            const res = await productService.uploadImages(productId!, e.target.files);
                                                            if (res.success) {
                                                                toast.success(res.message);
                                                                refreshImages();
                                                            } else toast.error(res.message);
                                                        }
                                                    }} />
                                                </div>

                                                <div className="grid grid-cols-4 gap-4">
                                                    {productImages.map((img, i) => (
                                                        <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-800">
                                                            <img src={img.imageUrl} className="h-full w-full object-cover transition-transform group-hover:scale-110" alt="Product" />
                                                            <div className="absolute inset-x-0 bottom-0 flex h-10 translate-y-full items-center justify-between bg-black/60 px-3 transition-all group-hover:translate-y-0">
                                                                <button onClick={async () => { await productService.setPrimaryImage(productId!, img.id); refreshImages(); }} className={`text-white transition-colors ${img.isPrimary ? 'text-amber-400' : 'hover:text-amber-400'}`}>
                                                                    <Star className={`h-4 w-4 ${img.isPrimary ? 'fill-current' : ''}`} />
                                                                </button>
                                                                <button onClick={async () => { await productService.deleteImage(productId!, img.id); refreshImages(); }} className="text-white hover:text-rose-400">
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                            {img.isPrimary && (
                                                                <div className="absolute left-2 top-2 rounded-lg bg-amber-600 px-2 py-0.5 font-plus-jakarta text-[8px] font-bold uppercase text-white shadow-xl">Thumbnail</div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </>

                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex gap-4 border-t border-gray-100 px-8 py-6 dark:border-gray-800">
                        <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-3 font-plus-jakarta text-xs font-bold uppercase tracking-widest text-gray-500 transition-all hover:bg-gray-50 dark:border-gray-700">
                            Close
                        </button>
                        <button 
                            onClick={handleSubmit} 
                            disabled={submitting}
                            className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 font-plus-jakarta text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-amber-700 active:scale-95 disabled:opacity-50"
                        >
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {isEdit ? "Update Master Records" : "Establish New Entry"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ──────────────────────────────────────────────────

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string>();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);


    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const params = {
            page,
            pageSize: 10,
            searchQuery: searchQuery || undefined,
            categoryId: categoryId || undefined
        };
        const res = await productService.getAll(params);
        if (res) {
            setProducts(res.data);
            setTotalCount(res.totalCount);
        }
        setLoading(false);
    }, [page, searchQuery, categoryId]);

    useEffect(() => {
        fetchProducts();
        categoryService.getAll().then(setCategories);
    }, [fetchProducts]);

    const handleDelete = async () => {
        if (!selectedProductId) return;
        setDeleteLoading(true);
        try {
            const res = await productService.delete(selectedProductId);
            if (res.success) {
                toast.success("Design permanently removed from vault.");
                setIsDeleteModalOpen(false);
                setSelectedProductId(undefined);
                fetchProducts();
            } else toast.error(res.message);
        } catch (e) {
            toast.error("Deletion failed");
        } finally {
            setDeleteLoading(false);
        }
    };


    const formatVnd = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

    return (
        <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-full">
            {isDrawerOpen && (
                <ProductDrawer 
                    productId={selectedProductId} 
                    onClose={() => { setIsDrawerOpen(false); setSelectedProductId(undefined); }} 
                    onSuccess={fetchProducts} 
                />
            )}

            {/* Header Area */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-amber-600 mb-1">
                        <Package className="h-4 w-4" />
                        <span className="font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em]">Inventory Infrastructure</span>
                    </div>
                    <h1 className="font-plus-jakarta text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Master Catalog</h1>
                    <p className="mt-1 font-plus-jakarta text-sm text-gray-500">Orchestrating {totalCount} high-end jewelry specifications across storefront systems.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => { setSelectedProductId(undefined); setIsDrawerOpen(true); }}
                        className="flex items-center gap-2 rounded-2xl bg-amber-600 px-6 py-3 font-plus-jakarta text-xs font-bold uppercase tracking-widest text-white shadow-xl shadow-amber-600/20 transition-all hover:bg-amber-700 hover:shadow-amber-700/30 active:scale-95"
                    >
                        <Plus className="h-4 w-4" /> Establish New Entry
                    </button>
                </div>
            </div>

            {/* Metrics Quick Look */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Active Designs", value: totalCount, icon: LayoutGrid, color: "blue" },
                    { label: "Low Stock Alert", value: products.filter(p => p.quantity <= 2).length, icon: AlertCircle, color: "amber" },
                    { label: "Catalog Value", value: "TBA", icon: TrendingUp, color: "emerald" },
                    { label: "Sold Count", value: products.reduce((acc, p) => acc + p.soldCount, 0), icon: CheckCircle2, color: "purple" },
                ].map(m => (
                    <div key={m.label} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-[#111]">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${m.color}-50 text-${m.color}-600 dark:bg-${m.color}-500/10 dark:text-${m.color}-400`}>
                            <m.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-wider text-gray-400">{m.label}</p>
                            <h4 className="font-plus-jakarta text-lg font-bold text-gray-900 dark:text-white">{m.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filtering & Toolbar */}
            <div className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white/50 p-4 backdrop-blur-xl dark:border-gray-800/50 dark:bg-[#0a0a0a]/50 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by Product Name, Style Code, or SKU..." 
                        className="w-full rounded-2xl border border-gray-100 bg-white px-11 py-3 font-plus-jakarta text-sm transition-all focus:border-amber-500 focus:outline-none dark:border-gray-800 dark:bg-[#111]"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <select 
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="rounded-2xl border border-gray-100 bg-white px-4 py-3 font-plus-jakarta text-xs font-bold text-gray-600 outline-none dark:border-gray-800 dark:bg-[#111] dark:text-gray-400"
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button className="flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-3 font-plus-jakarta text-xs font-bold text-gray-600 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400">
                        <Filter className="h-4 w-4" /> Advance Filters
                    </button>
                    <button onClick={fetchProducts} className="rounded-2xl bg-amber-50 p-3 text-amber-600 transition-all hover:bg-amber-100 dark:bg-amber-500/10">
                        <TrendingUp className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white/50 backdrop-blur-xl dark:border-gray-800/50 dark:bg-[#0a0a0a]/50 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-fixed min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/30 dark:border-gray-800/50 dark:bg-[#111]/30 text-gray-400">
                                <th className="px-3 py-5 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider w-[35%]">Product Visual / Identity</th>
                                <th className="px-3 py-5 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider w-[15%]">Catalog Meta</th>
                                <th className="px-3 py-5 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider w-[15%]">Technical Specs</th>
                                <th className="px-3 py-5 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider w-[15%]">Pricing</th>
                                <th className="px-3 py-5 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider w-[10%]">Vault</th>
                                <th className="px-3 py-5 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider w-[10%]">Status</th>
                                <th className="px-3 py-5 font-plus-jakarta text-[10px] font-bold uppercase tracking-wider w-[80px]"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={7} className="px-8 py-6"><div className="h-10 w-full rounded-2xl bg-gray-100 dark:bg-gray-800" /></td>
                                    </tr>
                                ))
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-16 text-center">
                                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-50 text-gray-200 dark:bg-gray-800/50">
                                            <Package className="h-10 w-10" />
                                        </div>
                                        <p className="mt-4 font-plus-jakarta text-sm font-bold text-gray-400">No matching master entries found.</p>
                                    </td>
                                </tr>
                            ) : products.map(p => (
                                <tr key={p.id} className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/10">
                                    <td className="px-3 py-5">
                                        <div className="flex items-center gap-4 overflow-hidden">
                                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                                                {p.images?.find(i => i.isPrimary)?.imageUrl ? (
                                                    <img src={p.images.find(i => i.isPrimary)!.imageUrl} className="h-full w-full object-cover" alt="" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-gray-300"><ImageIcon className="h-6 w-6" /></div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h5 className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors truncate" title={p.name}>{p.name}</h5>
                                                <p className="font-mono text-[10px] text-gray-400 mt-0.5 truncate">{p.styleCode}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-2 py-5">
                                        <div className="flex flex-col gap-1 overflow-hidden">
                                            <span className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-gray-100 px-2 py-0.5 font-plus-jakarta text-[9px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-400 truncate max-w-full">
                                                <LayoutGrid className="h-2.5 w-2.5" /> {p.categoryName || "Uncat."}
                                            </span>
                                            <span className="font-plus-jakarta text-[9px] text-gray-400 flex items-center gap-1 truncate">
                                                <CheckCircle2 className="h-2.5 w-2.5 text-amber-500" /> {p.brandName || "Generic"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-2 py-5">
                                        <div className="flex flex-col gap-1 font-plus-jakarta text-[11px] text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-900 dark:text-white">{(p.goldWeightGm || 0).toFixed(2)}g</span>
                                                <span className="text-[9px] uppercase tracking-tighter opacity-70">Gold</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-blue-600">{p.diamonds?.length || 0}</span>
                                                <span className="text-[9px] uppercase tracking-tighter opacity-70">Diam.</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-2 py-5">
                                        <div className="font-plus-jakarta min-w-0">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{formatVnd(p.estimatedFinalPrice)}</p>
                                            <p className="text-[9px] text-gray-400 flex items-center gap-1"><TrendingUp className="h-2.5 w-2.5 text-emerald-500" /> MSRP</p>
                                        </div>
                                    </td>
                                    <td className="px-2 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full flex-shrink-0 ${p.quantity === 0 ? 'bg-rose-500' : p.quantity <= 2 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                            <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">{p.quantity} U</span>
                                        </div>
                                    </td>
                                    <td className="px-2 py-5">
                                        {(() => {
                                            const status = STATUS_OPTIONS.find(s => s.value === p.status);
                                            return (
                                                <span className={`inline-flex items-center gap-1.5 rounded-full bg-${status?.color}-50 px-2 py-0.5 font-plus-jakarta text-[9px] font-bold text-${status?.color}-600 dark:bg-${status?.color}-500/10 dark:text-${status?.color}-400`}>
                                                    {status?.label}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-3 py-5 text-right w-[80px]">
                                        <div className="flex items-center justify-end gap-1.5 overflow-visible">
                                            <button 
                                                onClick={() => { setSelectedProductId(p.id); setIsDrawerOpen(true); }}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-400 transition-all hover:border-amber-200 hover:text-amber-600 dark:border-gray-800 dark:bg-[#111]"
                                                title="Edit Master"
                                            >
                                                <Settings2 className="h-3.5 w-3.5" />
                                            </button>
                                            <button 
                                                onClick={() => { setSelectedProductId(p.id); setIsDeleteModalOpen(true); }}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-400 transition-all hover:border-rose-100 hover:text-rose-600 dark:border-gray-800 dark:bg-[#111]"
                                                title="Delete Master"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-100 px-8 py-5 dark:border-gray-800">
                    <p className="font-plus-jakarta text-xs text-gray-400">Displaying {products.length} of {totalCount} master entries</p>
                    <div className="flex items-center gap-2">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-400 transition-all hover:bg-gray-50 disabled:opacity-30 dark:border-gray-800 dark:bg-[#111]"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 font-plus-jakarta text-xs font-bold text-white">{page}</span>
                        <button 
                            disabled={page * 10 >= totalCount}
                            onClick={() => setPage(p => p + 1)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-400 transition-all hover:bg-gray-50 disabled:opacity-30 dark:border-gray-800 dark:bg-[#111]"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setSelectedProductId(undefined); }}
                onConfirm={handleDelete}
                loading={deleteLoading}
                title="De-catalog Master Item?"
                description="This action will permanently withdraw this design from all storefronts and catalog indexes. Historical order data will remain preserved."
                confirmText="Permanently Delete"
                type="danger"
            />
        </div>

    );
}

