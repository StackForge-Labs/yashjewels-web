/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Plus, Ticket, Calendar, TrendingDown, Check, X, Megaphone, Send, Users, Edit, Trash2 } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { StatusBadge } from "../_components/ui/StatusBadge";
import { Drawer } from "../_components/ui/Drawer";
import { ConfirmModal } from "../_components/ui/ConfirmModal";
import { FormField, inputCls, selectCls } from "../_components/ui/FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";

/* ─────────── Zod schemas ─────────── */
const couponSchema = z.object({
    code: z.string().min(3, "Code must be at least 3 chars").toUpperCase().regex(/^[A-Z0-9]+$/, "Code only allows letters and numbers"),
    description: z.string().optional(),
    discountType: z.string().min(1),
    discountValue: z.coerce.number().min(1),
    minOrderAmount: z.coerce.number().optional(),
    maxUsesTotal: z.coerce.number().optional(),
    validFrom: z.string().min(1, "Starting date is required"),
    validUntil: z.string().min(1, "Expiry date is required"),
}).refine(data => new Date(data.validUntil) >= new Date(data.validFrom), { message: "Expiry date cannot be before starting date", path: ["validUntil"] });

const campaignSchema = z.object({
    id: z.string().optional(),
    campaignName: z.string().min(3, "Campaign name must be at least 3 chars"),
    description: z.string().optional(),
    discountType: z.string().min(1),
    discountValue: z.coerce.number().min(0, "Discount must be at least 0"),
    minOrderAmount: z.coerce.number().optional(),
    targetAudienceType: z.string().min(1),
    validFrom: z.string().min(1, "Starting date is required"),
    validUntil: z.string().min(1, "Expiry date is required"),
    targetAudienceConfig: z.string().optional(), // Used for birthday duration
}).refine(data => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(data.validFrom) >= today;
}, { message: "Starting date cannot be in the past", path: ["validFrom"] })
.refine(data => new Date(data.validUntil) > new Date(data.validFrom), { message: "Expiry date must be after starting date", path: ["validUntil"] })
.refine(data => {
    // If type is not Free Shipping (2), value must be > 0
    if (data.discountType !== "2" && data.discountValue <= 0) return false;
    return true;
}, { message: "Discount value must be greater than 0", path: ["discountValue"] });

type CouponFormData = z.infer<typeof couponSchema>;
type CampaignFormData = z.infer<typeof campaignSchema>;

type Coupon = { id: string; code: string; description: string; discountType: string; discountValue: number; minOrderAmount: number | null; maxUsesTotal: number | null; usedCount: number; validFrom: string; validUntil: string; isActive: boolean; isUsed: boolean; campaignId: string | null; };
type Campaign = { id: string; campaignName: string; description: string; discountType: string; discountValue: number; minOrderAmount: number | null; targetAudienceType: any; targetAudienceConfig?: string; validFrom: string; validUntil: string; status: any; createdAt: string; };

const TARGET_LABELS: Record<string, string> = {
    "0": "🏆 VIP (High Spend)",
    "1": "🔒 KYC Verified",
    "2": "🎁 Gift Buyers",
    "3": "🎂 Birthday Month",
    "4": "👥 All Active Customers",
    VIP_SPEND: "🏆 VIP (High Spend)",
    KYC_VERIFIED: "🔒 KYC Verified",
    GIFT_BUYERS: "🎁 Gift Buyers",
    BIRTHDAY: "🎂 Birthday Month",
    ALL: "👥 All Active Customers",
};

const CAMPAIGN_STATUS_MAP: Record<string, string> = {
    "0": "pending",   // DRAFT
    "1": "pending",   // SCHEDULED
    "2": "active",    // ACTIVE
    "3": "inactive",  // PAUSED (Revoked)
    "4": "completed", // COMPLETED
    DRAFT: "pending", SCHEDULED: "pending", ACTIVE: "active", PAUSED: "inactive", COMPLETED: "completed",
};

/* ─────────── Tab type ─────────── */
type TabKey = "campaigns" | "coupons";

/* ─────────── Main Component ─────────── */
export default function MarketingPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("campaigns");

    /* Campaign state */
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isCampaignLoading, setIsCampaignLoading] = useState(true);
    const [isCampaignDrawerOpen, setIsCampaignDrawerOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [distributeId, setDistributeId] = useState<string | null>(null);
    const [revokeId, setRevokeId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    /* Coupon state (vendor coupons) */
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isCouponLoading, setIsCouponLoading] = useState(true);
    const [isCouponDrawerOpen, setIsCouponDrawerOpen] = useState(false);

    /* Forms */
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const couponForm = useForm<CouponFormData>({ resolver: zodResolver(couponSchema) as any, defaultValues: { discountType: "0", validFrom: new Date().toISOString().split("T")[0], validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0] } });
    const campaignForm = useForm<CampaignFormData>({ resolver: zodResolver(campaignSchema) as any, defaultValues: { discountType: "0", targetAudienceType: "ALL", validFrom: new Date().toISOString().split("T")[0], validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0], targetAudienceConfig: "30" } });

    /* ─── Fetchers ─── */
    const fetchCoupons = async () => { setIsCouponLoading(true); try { const res = await adminService.coupons.getAll(); if (res.success) setCoupons(res.data.filter((c: any) => !c.campaignId)); } catch { toast.error("Failed to fetch coupons"); } finally { setIsCouponLoading(false); } };
    const fetchCampaigns = async () => { setIsCampaignLoading(true); try { const res = await adminService.campaigns.getAll(); if (res.success) setCampaigns(res.data); } catch { toast.error("Failed to fetch campaigns"); } finally { setIsCampaignLoading(false); } };

    useEffect(() => { fetchCampaigns(); fetchCoupons(); }, []);

    /* ─── Handlers ─── */
    const handleCreateCoupon = async (data: CouponFormData) => {
        if (coupons.some(c => c.code.toUpperCase() === data.code.toUpperCase())) { toast.error("This coupon code already exists"); return; }
        try {
            const payload = { ...data, discountType: parseInt(data.discountType), createdBy: "00000000-0000-0000-0000-000000000000" };
            const res = await adminService.coupons.create(payload);
            if (res.success) { toast.success("Coupon created"); setIsCouponDrawerOpen(false); couponForm.reset(); fetchCoupons(); }
            else toast.error(res.message || "Failed");
        } catch (err: any) { toast.error(err.response?.data?.message || "An error occurred"); }
    };

    const handleDeleteCoupon = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;
        try { const res = await adminService.coupons.delete(id); if (res.success) { toast.success("Coupon deleted"); fetchCoupons(); } } catch { toast.error("Failed to delete coupon"); }
    };

    const handleCreateCampaign = async (data: CampaignFormData) => {
        try {
            const targetAudienceMap: Record<string, number> = {
                "VIP_SPEND": 0,
                "KYC_VERIFIED": 1,
                "GIFT_BUYERS": 2,
                "BIRTHDAY": 3,
                "ALL": 4
            };
            const payload = { 
                campaignName: data.campaignName,
                description: data.description,
                discountType: parseInt(data.discountType),
                discountValue: data.discountValue,
                minOrderAmount: data.minOrderAmount,
                validFrom: data.validFrom,
                validUntil: data.validUntil,
                targetAudienceType: targetAudienceMap[data.targetAudienceType] ?? 0,
                targetAudienceConfig: data.targetAudienceConfig
            };
            
            let res;
            if (isEditMode && data.id) {
                res = await adminService.campaigns.update(data.id, payload);
            } else {
                res = await adminService.campaigns.create(payload);
            }

            if (res.success) { 
                toast.success(isEditMode ? "Campaign updated" : "Campaign created"); 
                setIsCampaignDrawerOpen(false); 
                campaignForm.reset(); 
                fetchCampaigns(); 
            }
            else toast.error(res.message || "Failed");
        } catch (err: any) { toast.error(err.response?.data?.message || "An error occurred"); }
    };

    const handleDistribute = async () => {
        if (!distributeId) return;
        setIsActionLoading(true);
        try {
            const res = await adminService.campaigns.distribute(distributeId);
            if (res.success) { toast.success("Coupons distributed successfully!"); fetchCampaigns(); }
            else toast.error(res.message || "Distribution failed");
        } catch (err: any) { toast.error(err.response?.data?.message || "An error occurred"); }
        finally { setIsActionLoading(false); setDistributeId(null); }
    };

    const [campaignSearch, setCampaignSearch] = useState("");
    const [campaignStatusFilter, setCampaignStatusFilter] = useState("ALL");

    const [couponSearch, setCouponSearch] = useState("");

    const handleRevoke = async () => {
        if (!revokeId) return;
        setIsActionLoading(true);
        try {
            const res = await adminService.campaigns.revoke(revokeId);
            if (res.success) { toast.success("Campaign revoked successfully!"); fetchCampaigns(); }
            else toast.error(res.message || "Revoke failed");
        } catch (err: any) { toast.error(err.response?.data?.message || "An error occurred"); }
        finally { setIsActionLoading(false); setRevokeId(null); }
    };

    const handleDeleteCampaign = async () => {
        if (!deleteId) return;
        setIsActionLoading(true);
        try {
            const res = await adminService.campaigns.delete(deleteId);
            if (res.success) { toast.success("Campaign deleted successfully!"); fetchCampaigns(); }
            else toast.error(res.message || "Delete failed");
        } catch (err: any) { toast.error(err.response?.data?.message || "An error occurred"); }
        finally { setIsActionLoading(false); setDeleteId(null); }
    };

    const openEditCampaign = (campaign: Campaign) => {
        const targetAudienceMapRev: Record<number, string> = {
            0: "VIP_SPEND",
            1: "KYC_VERIFIED",
            2: "GIFT_BUYERS",
            3: "BIRTHDAY",
            4: "ALL"
        };
        campaignForm.reset({
            id: campaign.id,
            campaignName: campaign.campaignName,
            description: campaign.description || "",
            discountType: String(campaign.discountType === "PERCENTAGE" ? 0 : campaign.discountType === "FIXED" ? 1 : 2),
            discountValue: campaign.discountValue,
            minOrderAmount: campaign.minOrderAmount || 0,
            targetAudienceType: targetAudienceMapRev[campaign.targetAudienceType] || "ALL",
            validFrom: campaign.validFrom.split("T")[0],
            validUntil: campaign.validUntil.split("T")[0],
            targetAudienceConfig: campaign.targetAudienceConfig || "30"
        });
        setIsEditMode(true);
        setIsCampaignDrawerOpen(true);
    };

    /* ─── Tab styling ─── */
    const tabCls = (key: TabKey) => `flex items-center gap-2 px-5 py-2.5 rounded-xl font-plus-jakarta text-sm font-bold transition-all cursor-pointer ${activeTab === key ? "bg-blue-600 text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)]" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/50"}`;

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Marketing Hub"
                description="Manage marketing campaigns and coupon distribution."
                actions={
                    <button
                        onClick={() => { 
                            setIsEditMode(false);
                            if (activeTab === "campaigns") {
                                campaignForm.reset({
                                    id: undefined,
                                    campaignName: "",
                                    description: "",
                                    discountType: "0",
                                    discountValue: 0,
                                    minOrderAmount: 0,
                                    targetAudienceType: "ALL",
                                    validFrom: new Date().toISOString().split("T")[0],
                                    validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
                                    targetAudienceConfig: "30"
                                });
                                setIsCampaignDrawerOpen(true);
                            } else {
                                couponForm.reset();
                                setIsCouponDrawerOpen(true);
                            }
                        }}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(37,99,235,0.3)] hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" /> {activeTab === "campaigns" ? "New Campaign" : "Create Coupon"}
                    </button>
                }
            />

            {/* ─── Tab Switcher ─── */}
            <div className="flex gap-2 p-1 rounded-2xl bg-gray-50/80 dark:bg-[#1a1a1a]/80 w-fit">
                <button className={tabCls("campaigns")} onClick={() => setActiveTab("campaigns")}><Megaphone className="h-4 w-4" /> Marketing Campaigns</button>
                <button className={tabCls("coupons")} onClick={() => setActiveTab("coupons")}><Ticket className="h-4 w-4" /> Vendor Coupons</button>
            </div>

            {/* ═══════════════════════ TAB 1: Campaigns ═══════════════════════ */}
            {activeTab === "campaigns" && (
                <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                    <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between border-b border-gray-100 dark:border-gray-800/50">
                        <div className="flex w-full md:w-96 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800/50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
                            <input 
                                value={campaignSearch} 
                                onChange={e => setCampaignSearch(e.target.value)}
                                placeholder="Search campaigns..." 
                                className="w-full bg-transparent outline-none text-gray-900 dark:text-white"
                            />
                        </div>
                        <select 
                            value={campaignStatusFilter} 
                            onChange={e => setCampaignStatusFilter(e.target.value)}
                            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300"
                        >
                            <option value="ALL">All Status</option>
                            <option value="0">Draft</option>
                            <option value="1">Scheduled</option>
                            <option value="2">Active</option>
                            <option value="3">Revoked</option>
                            <option value="4">Completed</option>
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full whitespace-nowrap text-left text-sm">
                            <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                                <tr>
                                    {["Campaign", "Discount", "Target Audience", "Validity", "Status", ""].map(h => (
                                        <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                                {isCampaignLoading ? (
                                    <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Loading campaigns...</td></tr>
                                ) : campaigns.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No campaigns yet. Create your first one!</td></tr>
                                ) : campaigns
                                    .filter(c => (campaignStatusFilter === "ALL" || String(c.status) === campaignStatusFilter) && c.campaignName.toLowerCase().includes(campaignSearch.toLowerCase()))
                                    .map(c => (
                                    <tr key={c.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-900/20">
                                                    <Megaphone className="h-4 w-4 text-violet-600" />
                                                </div>
                                                <div>
                                                    <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{c.campaignName}</p>
                                                    <p className="font-plus-jakarta text-[10px] text-gray-400 italic">{c.description || "No description"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <TrendingDown className="h-3.5 w-3.5 text-emerald-600" />
                                                <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">
                                                    {String(c.discountType) === "0" || c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : String(c.discountType) === "2" || c.discountType === "FREE_SHIPPING" ? "Free Ship" : `${c.discountValue.toLocaleString()} VND`}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                                <Users className="h-3 w-3" />
                                                {TARGET_LABELS[String(c.targetAudienceType)] || c.targetAudienceType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                                                <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {new Date(c.validFrom).toLocaleDateString()}</div>
                                                <div className="flex items-center gap-1.5"><X className="h-3 w-3" /> {new Date(c.validUntil).toLocaleDateString()}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={CAMPAIGN_STATUS_MAP[String(c.status)] || "pending"} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {(String(c.status) === "0" || String(c.status) === "1" || c.status === "DRAFT" || c.status === "SCHEDULED") && (
                                                    <>
                                                        <button onClick={() => setDistributeId(c.id)} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors" title="Distribute coupons">
                                                            <Send className="h-3 w-3" /> Send
                                                        </button>
                                                        <button onClick={() => openEditCampaign(c)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/20" title="Edit">
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {(String(c.status) === "2" || c.status === "ACTIVE") && (
                                                    <button onClick={() => setRevokeId(c.id)} className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors" title="Revoke campaign">
                                                        <X className="h-3 w-3" /> Revoke
                                                    </button>
                                                )}
                                                {(String(c.status) !== "2" && c.status !== "ACTIVE") && (
                                                    <button onClick={() => setDeleteId(c.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors dark:hover:bg-rose-900/20" title="Delete">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button onClick={() => setSelectedCampaign(c)} className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700" title="View details">
                                                    Detail
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ═══════════════════════ TAB 2: Vendor Coupons ═══════════════════════ */}
            {activeTab === "coupons" && (
                <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                    <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between border-b border-gray-100 dark:border-gray-800/50">
                        <div className="flex w-full md:w-96 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800/50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
                            <input 
                                value={couponSearch} 
                                onChange={e => setCouponSearch(e.target.value)}
                                placeholder="Search by coupon code..." 
                                className="w-full bg-transparent outline-none text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full whitespace-nowrap text-left text-sm">
                            <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                                <tr>
                                    {["Coupon Code", "Discount", "Validity", "Usage", "Status", ""].map(h => (
                                        <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                                {isCouponLoading ? (
                                    <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Loading coupons...</td></tr>
                                ) : coupons.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No vendor coupons found.</td></tr>
                                ) : coupons.filter(c => c.code.toLowerCase().includes(couponSearch.toLowerCase())).map(c => (
                                    <tr key={c.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
                                                    <Ticket className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tighter">{c.code}</p>
                                                    <p className="font-plus-jakarta text-[10px] text-gray-400 italic">{c.description || "No description"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <TrendingDown className="h-3.5 w-3.5 text-emerald-600" />
                                                <span className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">
                                                    {c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : c.discountType === "FREE_SHIPPING" ? "Free Ship" : `${c.discountValue.toLocaleString()} VND`}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                                                <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {new Date(c.validFrom).toLocaleDateString()}</div>
                                                <div className="flex items-center gap-1.5"><X className="h-3 w-3" /> {new Date(c.validUntil).toLocaleDateString()}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-plus-jakarta text-xs font-bold text-gray-900 dark:text-white">{c.usedCount} used</span>
                                                {c.maxUsesTotal && <span className="text-[10px] text-gray-400">Limit: {c.maxUsesTotal}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><StatusBadge status={c.isActive ? "active" : "inactive"} /></td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleDeleteCoupon(c.id)} className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 transition-colors" title="Delete Coupon"><X className="h-4 w-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ═══════════ Campaign Detail Drawer ═══════════ */}
            <Drawer
                isOpen={!!selectedCampaign}
                onClose={() => setSelectedCampaign(null)}
                title="Campaign Details"
                subtitle="Detailed information about this marketing campaign."
                footer={<button onClick={() => setSelectedCampaign(null)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50">Close</button>}
            >
                {selectedCampaign && (
                    <div className="flex flex-col gap-6">
                        <div>
                            <p className="text-sm text-gray-500">Campaign Name</p>
                            <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedCampaign.campaignName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Description</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{selectedCampaign.description || "N/A"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <div className="mt-1"><StatusBadge status={CAMPAIGN_STATUS_MAP[String(selectedCampaign.status)] || "pending"} /></div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Target Audience</p>
                                <p className="font-bold text-gray-900 dark:text-white mt-1 text-sm">{TARGET_LABELS[String(selectedCampaign.targetAudienceType)] || selectedCampaign.targetAudienceType}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Discount</p>
                                <p className="font-bold text-emerald-600 mt-1">{String(selectedCampaign.discountType) === "0" || selectedCampaign.discountType === "PERCENTAGE" ? `${selectedCampaign.discountValue}%` : String(selectedCampaign.discountType) === "2" || selectedCampaign.discountType === "FREE_SHIPPING" ? "Free Ship" : `${selectedCampaign.discountValue.toLocaleString()} VND`}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Min Order Amount</p>
                                <p className="font-bold text-gray-900 dark:text-white mt-1">{selectedCampaign.minOrderAmount ? `${selectedCampaign.minOrderAmount.toLocaleString()} VND` : "No minimum"}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Valid From</p>
                                <p className="font-bold text-gray-900 dark:text-white mt-1 text-sm">{new Date(selectedCampaign.validFrom).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Valid Until</p>
                                <p className="font-bold text-gray-900 dark:text-white mt-1 text-sm">{new Date(selectedCampaign.validUntil).toLocaleDateString()}</p>
                            </div>
                        </div>
                        {selectedCampaign.targetAudienceConfig && (
                            <div>
                                <p className="text-sm text-gray-500">Audience Config (Duration)</p>
                                <p className="font-bold text-gray-900 dark:text-white mt-1 text-sm">{selectedCampaign.targetAudienceConfig} days</p>
                            </div>
                        )}
                    </div>
                )}
            </Drawer>

            {/* ═══════════ Campaign Drawer ═══════════ */}
            <Drawer
                isOpen={isCampaignDrawerOpen}
                onClose={() => setIsCampaignDrawerOpen(false)}
                title={isEditMode ? "Edit Marketing Campaign" : "Create Marketing Campaign"}
                subtitle="Define a new campaign to auto-generate unique coupon codes for target customers."
                footer={
                    <div className="flex gap-3">
                        <button onClick={() => setIsCampaignDrawerOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button onClick={campaignForm.handleSubmit(handleCreateCampaign)} disabled={campaignForm.formState.isSubmitting} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700">
                            {campaignForm.formState.isSubmitting ? "Processing..." : isEditMode ? "Update Campaign" : "Create Campaign"}
                        </button>
                    </div>
                }
            >
                <form onSubmit={campaignForm.handleSubmit(handleCreateCampaign)} className="flex flex-col gap-4">
                    <FormField label="Campaign Name" required>
                        <input className={inputCls} placeholder="e.g. VIP Customer Appreciation" {...campaignForm.register("campaignName")} />
                        {campaignForm.formState.errors.campaignName && <p className="text-rose-500 text-xs mt-1">{campaignForm.formState.errors.campaignName.message}</p>}
                    </FormField>
                    <FormField label="Description">
                        <input className={inputCls} placeholder="Brief description of the campaign" {...campaignForm.register("description")} />
                    </FormField>
                    <FormField label="Target Audience" required>
                        <select className={selectCls} {...campaignForm.register("targetAudienceType")}>
                            <option value="ALL">👥 All Active Customers</option>
                            <option value="VIP_SPEND">🏆 VIP (High Spend &gt; 50M VND)</option>
                            <option value="KYC_VERIFIED">🔒 KYC Verified Customers</option>
                            <option value="GIFT_BUYERS">🎁 Gift Buyers</option>
                            <option value="BIRTHDAY">🎂 Birthday Reward</option>
                        </select>
                    </FormField>
                    {campaignForm.watch("targetAudienceType") === "BIRTHDAY" && (
                        <FormField label="Coupon Duration (Days)" required>
                            <input type="number" className={inputCls} placeholder="30" {...campaignForm.register("targetAudienceConfig")} />
                            <p className="text-[10px] text-gray-400 mt-1 italic">The gift code will expire after this many days from the customer's birthday.</p>
                        </FormField>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Discount Type">
                            <select className={selectCls} {...campaignForm.register("discountType")}>
                                <option value="0">Percentage (%)</option>
                                <option value="1">Fixed Amount (USD)</option>
                                <option value="2">Free Shipping</option>
                            </select>
                        </FormField>
                        <FormField label="Discount Value" required>
                            <input type="number" className={inputCls} placeholder="10" {...campaignForm.register("discountValue")} />
                            {campaignForm.formState.errors.discountValue && <p className="text-rose-500 text-xs mt-1">{campaignForm.formState.errors.discountValue.message}</p>}
                        </FormField>
                    </div>
                    <FormField label="Min Order Amount (VND)">
                        <input type="number" className={inputCls} {...campaignForm.register("minOrderAmount")} />
                    </FormField>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label={campaignForm.watch("targetAudienceType") === "BIRTHDAY" ? "Program Start Date" : "Valid From"} required>
                            <input type="date" className={inputCls} {...campaignForm.register("validFrom")} />
                            {campaignForm.formState.errors.validFrom && <p className="text-rose-500 text-xs mt-1">{campaignForm.formState.errors.validFrom.message}</p>}
                        </FormField>
                        <FormField label={campaignForm.watch("targetAudienceType") === "BIRTHDAY" ? "Program End Date" : "Valid Until"} required>
                            <input type="date" className={inputCls} {...campaignForm.register("validUntil")} />
                            {campaignForm.formState.errors.validUntil && <p className="text-rose-500 text-xs mt-1">{campaignForm.formState.errors.validUntil.message}</p>}
                        </FormField>
                    </div>
                    {campaignForm.watch("targetAudienceType") === "BIRTHDAY" && (
                        <p className="text-[10px] text-blue-500 italic mt-1">
                            * For birthday campaigns, Start/End is the program duration. Codes are sent daily to customers with birthdays during this period.
                        </p>
                    )}
                </form>
            </Drawer>

            {/* ═══════════ Coupon Drawer ═══════════ */}
            <Drawer
                isOpen={isCouponDrawerOpen}
                onClose={() => setIsCouponDrawerOpen(false)}
                title="Create Coupon"
                subtitle="Define a new promotional discount for your customers."
                footer={
                    <div className="flex gap-3">
                        <button onClick={() => setIsCouponDrawerOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button onClick={couponForm.handleSubmit(handleCreateCoupon)} disabled={couponForm.formState.isSubmitting} className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700">
                            {couponForm.formState.isSubmitting ? "Generating..." : "Save Coupon"}
                        </button>
                    </div>
                }
            >
                <form onSubmit={couponForm.handleSubmit(handleCreateCoupon)} className="flex flex-col gap-4">
                    <FormField label="Coupon Code" required>
                        <input className={inputCls} placeholder="e.g. SUMMER2026" {...couponForm.register("code")} />
                        {couponForm.formState.errors.code && <p className="text-rose-500 text-xs mt-1">{couponForm.formState.errors.code.message}</p>}
                    </FormField>
                    <FormField label="Description">
                        <input className={inputCls} placeholder="Special summer collection discount" {...couponForm.register("description")} />
                    </FormField>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Discount Type">
                            <select className={selectCls} {...couponForm.register("discountType")}>
                                <option value="0">Percentage (%)</option>
                                <option value="1">Fixed Amount (VND)</option>
                                <option value="2">Free Shipping</option>
                            </select>
                        </FormField>
                        <FormField label="Discount Value" required>
                            <input type="number" className={inputCls} placeholder="10" {...couponForm.register("discountValue")} />
                        </FormField>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Min Order Amount (VND)">
                            <input type="number" className={inputCls} {...couponForm.register("minOrderAmount")} />
                        </FormField>
                        <FormField label="Max Total Uses">
                            <input type="number" className={inputCls} {...couponForm.register("maxUsesTotal")} />
                        </FormField>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Valid From" required>
                            <input type="date" className={inputCls} {...couponForm.register("validFrom")} />
                        </FormField>
                        <FormField label="Valid Until" required>
                            <input type="date" className={inputCls} {...couponForm.register("validUntil")} />
                            {couponForm.formState.errors.validUntil && <p className="text-rose-500 text-xs mt-1">{couponForm.formState.errors.validUntil.message}</p>}
                        </FormField>
                    </div>
                </form>
            </Drawer>

            <ConfirmModal
                isOpen={!!distributeId}
                onClose={() => setDistributeId(null)}
                onConfirm={handleDistribute}
                title="Distribute Campaign"
                description="Activate this campaign and distribute coupon codes to all target customers? This action cannot be undone."
                confirmText="Distribute"
                type="success"
                loading={isActionLoading}
            />

            <ConfirmModal
                isOpen={!!revokeId}
                onClose={() => setRevokeId(null)}
                onConfirm={handleRevoke}
                title="Revoke Campaign"
                description="Are you sure you want to revoke this campaign? All unused coupons will be permanently disabled."
                confirmText="Revoke"
                type="danger"
                loading={isActionLoading}
            />

            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDeleteCampaign}
                title="Delete Campaign"
                description="Are you sure you want to delete this campaign? This action cannot be undone."
                confirmText="Delete"
                type="danger"
                loading={isActionLoading}
            />
        </div>
    );
}
