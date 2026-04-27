"use client";

import React from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { PageHero } from "../_components/PageHero";
import { User, Mail, Phone, Calendar, Shield, Clock, ArrowRight, Settings, ShoppingBag, Heart, LogOut, Camera, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { useLogout, useUpdateAvatar } from "@/hooks/useAuth";
import { useRef } from "react";
import { TwoFactorSection } from "../../components/profile/TwoFactorSection";
import { AddressSection } from "../../components/profile/AddressSection";
import { useUpdateProfile } from "../../hooks/useUser";
import { useSearchParams } from "next/navigation";
import { OrdersView } from "../../components/profile/OrdersView";

function ProfileContent() {
    const searchParams = useSearchParams();
    const queryView = searchParams.get("view");
    const { profile, isLoading } = useAuthGuard();
    const logout = useLogout();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const updateAvatar = useUpdateAvatar();
    const updateProfile = useUpdateProfile();

    const [isEditing, setIsEditing] = React.useState(false);
    const [view, setView] = React.useState<"overview" | "orders">("overview");
    const [editData, setEditData] = React.useState({
        fullName: "",
        phone: "",
        dateOfBirth: ""
    });

    // Update editData when profile changes
    React.useEffect(() => {
        if (profile) {
            setEditData({
                fullName: profile.fullName,
                phone: profile.phone || "",
                dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : ""
            });
        }
    }, [profile]);

    React.useEffect(() => {
        if (queryView === "orders") {
            setView("orders");
        }
    }, [queryView]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            updateAvatar.mutate(file);
        }
    };

    if (isLoading || !profile) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50/30 dark:bg-[#050505]">
                <Loader2 size={40} className="animate-spin text-gold" />
                <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">Verifying Identity...</p>
            </div>
        );
    }

    const formatDate = (date: string | null | undefined) => {
        if (!date) return "Not provided";
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getKycConfig = (status: string | null | undefined) => {
        const s = status?.toLowerCase();
        if (s === "verified" || s === "approved") {
            return {
                label: "Verified Identity",
                color: "text-emerald-500",
                bgColor: "bg-emerald-500/10",
                icon: Shield,
                description: "Your account is fully verified. You have access to all premium features and high-value transactions."
            };
        }
        if (s === "pending") {
            return {
                label: "Verification Pending",
                color: "text-amber-500",
                bgColor: "bg-amber-500/10",
                icon: Clock,
                description: "We are currently reviewing your documents. This process usually takes 24-48 hours."
            };
        }
        return {
            label: "Unverified Account",
            color: "text-rose-500",
            bgColor: "bg-rose-500/10",
            icon: Shield,
            description: "Please complete your identity verification to enable all features and secure your account."
        };
    };

    const kycConfig = getKycConfig(profile.kycStatus);
    const StatusIcon = kycConfig.icon;

    const handleSave = async () => {
        try {
            await updateProfile.mutateAsync({
                fullName: editData.fullName,
                phone: editData.phone,
                dateOfBirth: editData.dateOfBirth || undefined
            });
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancel = () => {
        setEditData({
            fullName: profile.fullName,
            phone: profile.phone || "",
            dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : ""
        });
        setIsEditing(false);
    };

    return (
        <>
            <PageHero
                title="Your Profile"
                subtitle="Manage your account preferences and security"
                breadcrumbs={[{ label: "Profile" }]}
            />

            <section className="relative bg-gray-50/30 py-2 transition-colors dark:bg-[#050505]">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                        {/* Sidebar */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-28 space-y-8">
                                <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center dark:border-white/5 dark:bg-[#0a0a0a]">
                                    <div className="relative group mx-auto mb-6 h-32 w-32 md:h-40 md:w-40">
                                        <div className="h-full w-full overflow-hidden rounded-full border-4 border-gray-50 bg-gray-100 shadow-xl dark:border-white/5 dark:bg-white/5">
                                            {profile.avatarUrl ? (
                                                <img src={profile.avatarUrl} alt={profile.fullName} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gold/10 text-gold">
                                                    <User size={64} />
                                                </div>
                                            )}

                                            {updateAvatar.isPending && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                    <Loader2 className="animate-spin text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-gold text-white shadow-lg transition-all hover:scale-110 active:scale-95"
                                        >
                                            <Camera size={18} />
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>

                                    <h2 className="font-serif text-2xl text-gray-900 dark:text-white">{profile.fullName}</h2>
                                    <p className="mt-1 text-xs font-bold tracking-widest text-gold uppercase">{profile.email}</p>

                                    <div className="mt-8 flex items-center justify-center gap-6 border-t border-gray-50 pt-8 dark:border-white/5">
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Level</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">Gold Tier</p>
                                        </div>
                                        <div className="h-8 w-px bg-gray-100 dark:bg-white/5"></div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Points</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">1,250</p>
                                        </div>
                                    </div>
                                </div>

                                <nav className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-white/5 dark:bg-[#0a0a0a]">
                                    <ul className="space-y-2">
                                        <li>
                                            <button
                                                onClick={() => setView("overview")}
                                                className={`flex w-full items-center gap-4 rounded-xl px-6 py-4 text-xs font-bold tracking-widest uppercase transition-all ${view === "overview" ? "bg-gray-50 text-gold dark:bg-white/5" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"}`}>
                                                <User size={18} /> Account Overview
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => setView("orders")}
                                                className={`flex w-full items-center gap-4 rounded-xl px-6 py-4 text-xs font-bold tracking-widest uppercase transition-all ${view === "orders" ? "bg-gray-50 text-gold dark:bg-white/5" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"}`}>
                                                <ShoppingBag size={18} /> Order History
                                            </button>
                                        </li>
                                        <li>
                                            <Link href="/wishlist" className="flex w-full items-center gap-4 rounded-xl px-6 py-4 text-xs font-bold tracking-widest text-gray-500 uppercase transition-all hover:bg-gray-50 dark:hover:bg-white/5">
                                                <Heart size={18} /> My Wishlist
                                            </Link>
                                        </li>
                                        <li>
                                            <button className="flex w-full items-center gap-4 rounded-xl px-6 py-4 text-xs font-bold tracking-widest text-gray-500 uppercase transition-all hover:bg-gray-50 dark:hover:bg-white/5">
                                                <Settings size={18} /> Preferences
                                            </button>
                                        </li>
                                        <li className="pt-2">
                                            <button
                                                onClick={() => logout.mutate()}
                                                className="flex w-full items-center gap-4 rounded-xl px-6 py-4 text-xs font-bold tracking-widest text-rose-500 uppercase transition-all hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                            >
                                                <LogOut size={18} /> Sign Out
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="lg:col-span-8">
                            <div className="space-y-8">
                                {/* KYC Status Card */}
                                <div className={`relative overflow-hidden rounded-2xl border ${kycConfig.bgColor.replace('10', '20')} p-8 ${kycConfig.bgColor} transition-all`}>
                                    <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center">
                                        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-lg dark:bg-[#111]`}>
                                            <StatusIcon className={kycConfig.color} size={32} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {kycConfig.label}
                                                </h3>
                                                {(profile.kycStatus?.toLowerCase() === "verified" || profile.kycStatus?.toLowerCase() === "approved") && (
                                                    <span className="bg-emerald-500/20 text-emerald-500 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                                                        Premium Member
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {kycConfig.description}
                                            </p>
                                        </div>
                                        {(profile.kycStatus?.toLowerCase() !== "verified" && profile.kycStatus?.toLowerCase() !== "approved") && profile.kycStatus?.toLowerCase() !== "pending" && (
                                            <Link href="/auth/kyc/handoff" className="bg-gold group flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-105 active:scale-95">
                                                Verify Identity <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        )}
                                    </div>
                                    {/* Decor */}
                                    <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 translate-y-[-8px] opacity-10">
                                        <StatusIcon size={120} />
                                    </div>
                                </div>

                                {view === "overview" ? (
                                    <>
                                        {/* Personal Data */}
                                        <div className="rounded-2xl border border-gray-100 bg-white p-8 md:p-10 dark:border-white/5 dark:bg-[#0a0a0a]">
                                            <div className="mb-10 flex items-center justify-between">
                                                <h3 className="font-serif text-2xl text-gray-900 dark:text-white">Account Information</h3>
                                                {!isEditing ? (
                                                    <button
                                                        onClick={() => setIsEditing(true)}
                                                        className="text-gold text-xs font-bold tracking-widest uppercase hover:underline"
                                                    >
                                                        Edit Details
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={handleCancel}
                                                            className="text-gray-400 text-[10px] font-bold tracking-widest uppercase hover:text-gray-600 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={handleSave}
                                                            disabled={updateProfile.isPending}
                                                            className="bg-gold text-white px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase hover:brightness-105 transition-all disabled:opacity-50"
                                                        >
                                                            {updateProfile.isPending ? "Saving..." : "Save Changes"}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Full Name</p>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            value={editData.fullName}
                                                            onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                                                            <User size={16} className="text-gold" />
                                                            <span className="text-sm font-medium">{profile.fullName}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Email Address</p>
                                                    <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500">
                                                        <Mail size={16} className="" />
                                                        <span className="text-sm font-medium">{profile.email}</span>
                                                        <span className="text-[9px] border border-gray-200 dark:border-white/10 px-1.5 py-0.5 rounded uppercase">ReadOnly</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Phone Number</p>
                                                    {isEditing ? (
                                                        <input
                                                            type="tel"
                                                            value={editData.phone}
                                                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                                                            <Phone size={16} className="text-gold" />
                                                            <span className="text-sm font-medium">{profile.phone || "Not provided"}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Date of Birth</p>
                                                    {isEditing ? (
                                                        <input
                                                            type="date"
                                                            value={editData.dateOfBirth}
                                                            onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                                                            <Calendar size={16} className="text-gold" />
                                                            <span className="text-sm font-medium">{formatDate(profile.dateOfBirth)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Member Since</p>
                                                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                                        <span className="text-xs font-medium italic">{new Date(profile.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Address Section */}
                                        <AddressSection />

                                        {/* 2FA Section */}
                                        <TwoFactorSection isEnabled={profile.twoFaEnabled} />
                                    </>
                                ) : (
                                    <OrdersView />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default function ProfilePage() {
    return (
        <React.Suspense fallback={
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50/30 dark:bg-[#050505]">
                <Loader2 size={40} className="animate-spin text-gold" />
                <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">Initialising Profile...</p>
            </div>
        }>
            <ProfileContent />
        </React.Suspense>
    );
}
