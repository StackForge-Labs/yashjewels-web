"use client";

import React, { useState } from "react";
import { MapPin, Plus, Trash2, Home, Briefcase, Star, Loader2, X, Check } from "lucide-react";
import { UserAddressDto, CreateAddressRequest } from "@/types/user.types";
import { useAddresses, useCreateAddress, useDeleteAddress, useSetDefaultAddress } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { InlineToast } from "./TwoFactorSection";

export const AddressSection = () => {
    const { data: addresses, isLoading } = useAddresses();
    const createAddress = useCreateAddress();
    const deleteAddress = useDeleteAddress();
    const setDefault = useSetDefaultAddress();

    const [isAdding, setIsAdding] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Form state
    const [formData, setFormData] = useState<CreateAddressRequest>({
        label: "Home",
        recipientName: "",
        recipientPhone: "",
        addressLine1: "",
        ward: "",
        district: "",
        province: "",
        isDefault: false,
    });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await createAddress.mutateAsync(formData);
            if (res.success) {
                setToast({ message: "Địa chỉ mới đã được thêm!", type: "success" });
                setIsAdding(false);
                setFormData({
                    label: "Home",
                    recipientName: "",
                    recipientPhone: "",
                    addressLine1: "",
                    ward: "",
                    district: "",
                    province: "",
                    isDefault: false,
                });
            }
        } catch (err) {
            setToast({ message: "Không thể thêm địa chỉ. Vui lòng kiểm tra lại.", type: "error" });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
        try {
            const res = await deleteAddress.mutateAsync(id);
            if (res.success) {
                setToast({ message: "Đã xóa địa chỉ thành công.", type: "success" });
            }
        } catch (err) {
            setToast({ message: "Lỗi khi xóa địa chỉ.", type: "error" });
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            const res = await setDefault.mutateAsync(id);
            if (res.success) {
                setToast({ message: "Đã cập nhật địa chỉ mặc định.", type: "success" });
            }
        } catch (err) {
            setToast({ message: "Lỗi khi cập nhật.", type: "error" });
        }
    };

    return (
        <section className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm shadow-gray-200/50 dark:shadow-none">
            <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-widest text-[14px]">
                        <MapPin size={18} className="text-gold" /> Address Information
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Manage your delivery destinations</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-gold/10 text-gold hover:bg-gold hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                    >
                        <Plus size={14} /> Add Address
                    </button>
                )}
            </div>

            <div className="p-8">
                {toast && (
                    <div className="mb-6">
                        <InlineToast message={toast.message} type={toast.type} onBlur={() => setToast(null)} />
                    </div>
                )}

                {isAdding && (
                    <form onSubmit={handleCreate} className="mb-10 p-6 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5 space-y-6 animate-in slide-in-from-top duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">New Address Details</h4>
                            <button type="button" onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Address Label</label>
                                <div className="flex gap-2">
                                    {["Home", "Work", "Other"].map((l) => (
                                        <button
                                            key={l}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, label: l })}
                                            className={cn(
                                                "px-4 py-2 rounded-lg text-xs font-medium transition-all",
                                                formData.label === l 
                                                    ? "bg-gold text-white" 
                                                    : "bg-white border border-gray-100 text-gray-500 hover:border-gold/30 dark:bg-black/20 dark:border-white/5"
                                            )}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recipient Name</label>
                                <input
                                    type="text"
                                    value={formData.recipientName}
                                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                                    className="w-full bg-white border-gray-100 rounded-xl py-3 px-4 text-sm focus:border-gold focus:ring-0 dark:bg-black/40 dark:border-white/5 dark:text-white"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.recipientPhone}
                                    onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                                    className="w-full bg-white border-gray-100 rounded-xl py-3 px-4 text-sm focus:border-gold focus:ring-0 dark:bg-black/40 dark:border-white/5 dark:text-white"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Street Address</label>
                                <input
                                    type="text"
                                    value={formData.addressLine1}
                                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                    className="w-full bg-white border-gray-100 rounded-xl py-3 px-4 text-sm focus:border-gold focus:ring-0 dark:bg-black/40 dark:border-white/5 dark:text-white"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ward / Commune</label>
                                <input
                                    type="text"
                                    value={formData.ward}
                                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                                    className="w-full bg-white border-gray-100 rounded-xl py-3 px-4 text-sm focus:border-gold focus:ring-0 dark:bg-black/40 dark:border-white/5 dark:text-white"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">District</label>
                                <input
                                    type="text"
                                    value={formData.district}
                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                    className="w-full bg-white border-gray-100 rounded-xl py-3 px-4 text-sm focus:border-gold focus:ring-0 dark:bg-black/40 dark:border-white/5 dark:text-white"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Province / City</label>
                                <input
                                    type="text"
                                    value={formData.province}
                                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                                    className="w-full bg-white border-gray-100 rounded-xl py-3 px-4 text-sm focus:border-gold focus:ring-0 dark:bg-black/40 dark:border-white/5 dark:text-white"
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-6">
                                <label className="relative flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isDefault}
                                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                        className="accent-gold h-5 w-5 rounded border-gray-200"
                                    />
                                    <span className="ml-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Set as default address</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/5">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-6 py-3 rounded-xl text-xs font-bold text-gray-400 uppercase hover:text-gray-600 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createAddress.isPending}
                                className="bg-gold text-white px-8 py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {createAddress.isPending && <Loader2 size={14} className="animate-spin" />}
                                Add Address
                            </button>
                        </div>
                    </form>
                )}

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 size={32} className="animate-spin text-gold/40" />
                    </div>
                ) : addresses && addresses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {addresses.map((addr) => (
                            <div 
                                key={addr.id} 
                                className={cn(
                                    "p-6 rounded-2xl border transition-all group relative",
                                    addr.isDefault 
                                        ? "border-gold/30 bg-gold/[0.02] dark:bg-gold/[0.03]" 
                                        : "border-gray-100 bg-white hover:border-gold/20 dark:bg-black/20 dark:border-white/5"
                                )}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "h-10 w-10 rounded-xl flex items-center justify-center",
                                            addr.label === "Home" ? "bg-blue-50 text-blue-500" :
                                            addr.label === "Work" ? "bg-emerald-50 text-emerald-500" : "bg-gold/10 text-gold"
                                        )}>
                                            {addr.label === "Home" ? <Home size={20} /> : 
                                             addr.label === "Work" ? <Briefcase size={20} /> : <MapPin size={20} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">{addr.label || "Address"}</h4>
                                                {addr.isDefault && (
                                                    <span className="bg-gold text-white text-[8px] font-black px-1.5 py-0.5 rounded leading-none uppercase tracking-tighter">Default</span>
                                                )}
                                            </div>
                                            <p className="text-sm font-semibold mt-0.5 text-gray-700 dark:text-gray-300">{addr.recipientName} • {addr.recipientPhone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!addr.isDefault && (
                                            <button 
                                                onClick={() => handleSetDefault(addr.id)}
                                                className="p-2 text-gray-400 hover:text-gold transition-colors"
                                                title="Set as Default"
                                            >
                                                <Star size={16} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleDelete(addr.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Delete Address"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="pl-13">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        {addr.addressLine1}, {addr.ward}, {addr.district}, {addr.province}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50/50 dark:bg-white/[0.01] rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                        <MapPin size={48} className="mx-auto text-gray-200 mb-4" />
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">No Addresses Found</h4>
                        <p className="text-xs text-gray-400 mt-2">Add your first delivery address to continue</p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="mt-6 text-gold font-bold text-xs uppercase tracking-widest hover:underline"
                        >
                            + Create New Address
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};
