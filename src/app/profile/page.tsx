"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { PageHero } from "../_components/PageHero";
import { User, Mail, Phone, Calendar, Shield, Clock, CheckCircle2, XCircle, ArrowRight, Settings, ShoppingBag, Heart, LogOut, Camera, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLogout, useUpdateAvatar } from "@/hooks/useAuth";
import { useRef } from "react";

export default function ProfilePage() {
    const { profile, isLoading } = useAuthGuard();
    const logout = useLogout();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const updateAvatar = useUpdateAvatar();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            updateAvatar.mutate(file);
        }
    };

    if (isLoading || !profile) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent"></div>
            </div>
        );
    }

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "Not provided";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getKycStatusConfig = (status: string) => {
        switch (status?.toLowerCase()) {
            case "approved":
            case "verified":
                return {
                    label: "Verified Premium Member",
                    icon: CheckCircle2,
                    color: "text-emerald-500",
                    bgColor: "bg-emerald-500/10",
                    description: "Your identity is verified. You now have full access to our private salon and high-value bespoke collections.",
                };
            case "pending":
                return {
                    label: "Verification Pending",
                    icon: Clock,
                    color: "text-amber-500",
                    bgColor: "bg-amber-500/10",
                    description: "Our experts are currently reviewing your documents. This usually takes 24-48 hours.",
                };
            case "rejected":
                return {
                    label: "Verification Rejected",
                    icon: XCircle,
                    color: "text-rose-500",
                    bgColor: "bg-rose-500/10",
                    description: "Your verification request was rejected. Please review our guide and try again.",
                };
            default:
                return {
                    label: "Unverified",
                    icon: Shield,
                    color: "text-gray-400",
                    bgColor: "bg-gray-400/10",
                    description: "Verify your identity to unlock high-value purchases and private salon access.",
                };
        }
    };

    const kycConfig = getKycStatusConfig(profile.kycStatus);
    const StatusIcon = kycConfig.icon;

    return (
        <>
            <PageHero
                title="Private Salon"
                subtitle="Manage your account, preferences, and luxury collection access."
                breadcrumbs={[{ label: "My Account" }]}
            />

            <section className="bg-white py-12 md:py-24 transition-colors dark:bg-[#030303]">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                        {/* Sidebar */}
                        <aside className="lg:col-span-4 translate-y-[-80px] md:translate-y-0">
                            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl dark:border-white/5 dark:bg-[#0a0a0a]">
                                <div className="bg-gold/10 p-8 text-center dark:bg-white/5">
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="group relative mx-auto mb-4 h-24 w-24 cursor-pointer overflow-hidden rounded-full border-2 border-gold bg-white transition-all hover:border-gold/50 dark:bg-[#111]"
                                    >
                                        {updateAvatar.isPending ? (
                                            <div className="flex h-full w-full items-center justify-center bg-black/10">
                                                <Loader2 size={24} className="animate-spin text-gold" />
                                            </div>
                                        ) : profile.avatarUrl ? (
                                            <img 
                                                src={profile.avatarUrl} 
                                                alt={profile.fullName} 
                                                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center font-serif text-3xl font-bold text-gold uppercase">
                                                {profile.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                                            </div>
                                        )}
                                        
                                        {!updateAvatar.isPending && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                                <Camera size={20} className="text-white" />
                                                <span className="mt-1 text-[8px] font-bold text-white uppercase tracking-widest">Update</span>
                                            </div>
                                        )}

                                        <input 
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <h2 className="font-serif text-2xl text-gray-900 dark:text-white">{profile.fullName}</h2>
                                    <p className="mt-1 text-xs font-bold tracking-widest text-gold uppercase">{profile.email}</p>
                                </div>

                                <nav className="p-4">
                                    <ul className="space-y-1">
                                        <li>
                                            <button className="flex w-full items-center gap-4 rounded-xl bg-gold/5 px-6 py-4 text-xs font-bold tracking-widest text-gold uppercase transition-all">
                                                <User size={18} /> My Profile
                                            </button>
                                        </li>
                                        <li>
                                            <Link href="/wishlist" className="flex w-full items-center gap-4 rounded-xl px-6 py-4 text-xs font-bold tracking-widest text-gray-500 uppercase transition-all hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5">
                                                <Heart size={18} /> Wishlist
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/orders" className="flex w-full items-center gap-4 rounded-xl px-6 py-4 text-xs font-bold tracking-widest text-gray-500 uppercase transition-all hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5">
                                                <ShoppingBag size={18} /> Order History
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/settings" className="flex w-full items-center gap-4 rounded-xl px-6 py-4 text-xs font-bold tracking-widest text-gray-500 uppercase transition-all hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5">
                                                <Settings size={18} /> Security
                                            </Link>
                                        </li>
                                        <div className="my-4 border-t border-gray-100 dark:border-white/5"></div>
                                        <li>
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

                                {/* Personal Data */}
                                <div className="rounded-2xl border border-gray-100 bg-white p-8 md:p-10 dark:border-white/5 dark:bg-[#0a0a0a]">
                                    <div className="mb-10 flex items-center justify-between">
                                        <h3 className="font-serif text-2xl text-gray-900 dark:text-white">Account Information</h3>
                                        <button className="text-gold text-xs font-bold tracking-widest uppercase hover:underline">Edit Details</button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Full Name</p>
                                            <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                                                <User size={16} className="text-gold" />
                                                <span className="text-sm font-medium">{profile.fullName}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Email Address</p>
                                            <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                                                <Mail size={16} className="text-gold" />
                                                <span className="text-sm font-medium">{profile.email}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Phone Number</p>
                                            <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                                                <Phone size={16} className="text-gold" />
                                                <span className="text-sm font-medium">{profile.phone || "Not provided"}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Date of Birth</p>
                                            <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                                                <Calendar size={16} className="text-gold" />
                                                <span className="text-sm font-medium">{formatDate(profile.dateOfBirth)}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Member Since</p>
                                            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                                <span className="text-xs font-medium italic">{new Date(profile.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="rounded-2xl border border-gray-100 bg-white p-8 dark:border-white/5 dark:bg-[#0a0a0a]">
                                    <h3 className="mb-6 font-serif text-xl text-gray-900 dark:text-white">Account Security</h3>
                                    <div className="flex items-center justify-between rounded-xl border border-gray-50 bg-gray-50/50 p-6 dark:border-white/5 dark:bg-white/2">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                                                <Shield size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">Two-Factor Authentication</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Add an extra layer of security to your account.</p>
                                            </div>
                                        </div>
                                        <button className="rounded-lg bg-gray-900 px-4 py-2 text-[10px] font-bold tracking-widest text-white uppercase transition-all hover:bg-black dark:bg-white dark:text-black">Enable</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
