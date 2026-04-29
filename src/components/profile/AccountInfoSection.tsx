"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, Calendar, Save, Loader2, CheckCircle2 } from "lucide-react";
import { UserProfile } from "@/types/user.types";
import { useUpdateProfile } from "@/hooks/useUser";
import { Input } from "../ui/input";
import { InlineToast } from "./TwoFactorSection";

interface AccountInfoSectionProps {
    user: UserProfile;
}

export const AccountInfoSection = ({ user }: AccountInfoSectionProps) => {
    const [fullName, setFullName] = useState(user.fullName);
    const [phone, setPhone] = useState(user.phone || "");
    const [dateOfBirth, setDateOfBirth] = useState(
        user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : ""
    );
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const updateProfile = useUpdateProfile();

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await updateProfile.mutateAsync({
                fullName,
                phone,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : undefined,
            });

            if (res.success) {
                setToast({ message: "Personal information has been updated!", type: "success" });
            } else {
                setToast({ message: res.errors?.[0] || "Update failed", type: "error" });
            }
        } catch (err) {
            setToast({ message: "An error occurred. Please try again.", type: "error" });
        }
    };

    return (
        <section className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm shadow-gray-200/50 dark:shadow-none">
            <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-widest text-[14px]">
                    <User size={18} className="text-gold" /> Account Information
                </h3>
                <p className="text-xs text-gray-500 mt-1">Manage your personal identification details</p>
            </div>

            <div className="p-8">
                <form onSubmit={handleUpdate} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Full Name */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5 leading-none">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold transition-colors">
                                    <User size={16} />
                                </div>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:border-gold focus:ring-0 focus:bg-white transition-all dark:bg-black/20 dark:border-white/5 dark:text-white"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5 leading-none">
                                Phone Number
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold transition-colors">
                                    <Phone size={16} />
                                </div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:border-gold focus:ring-0 focus:bg-white transition-all dark:bg-black/20 dark:border-white/5 dark:text-white"
                                    placeholder="+84 000 000 000"
                                />
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5 leading-none">
                                Date of Birth
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold transition-colors">
                                    <Calendar size={16} />
                                </div>
                                <input
                                    type="date"
                                    value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                    className="w-full bg-gray-50 border-gray-100 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:border-gold focus:ring-0 focus:bg-white transition-all dark:bg-black/20 dark:border-white/5 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Email (Readonly) */}
                        <div className="space-y-3 opacity-60">
                            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5 leading-none">
                                Email Address (Primary)
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                </div>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full bg-gray-100 border-transparent rounded-xl py-3.5 pl-11 pr-4 text-sm text-gray-500 cursor-not-allowed dark:bg-white/5"
                                />
                            </div>
                        </div>
                    </div>

                    {toast && (
                        <div className="pt-2">
                             <InlineToast message={toast.message} type={toast.type} onBlur={() => setToast(null)} />
                        </div>
                    )}

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={updateProfile.isPending}
                            className="bg-gold text-white px-8 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-gold/20"
                        >
                            {updateProfile.isPending ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};
