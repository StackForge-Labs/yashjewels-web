"use client";

import React, { useState, useEffect } from "react";
import { 
    MapPin, Plus, Trash2, CheckCircle2, 
    Home, Briefcase, Landmark, Loader2, X, Edit2
} from "lucide-react";
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress, useSetDefaultAddress } from "@/hooks/useAddress";
import { UserAddressDto, CreateAddressRequest } from "@/types/user.types";

interface AddressSectionProps {
    onSelect: (address: UserAddressDto) => void;
    selectedId?: string;
}

export default function AddressSection({ onSelect, selectedId }: AddressSectionProps) {
    const { data: addresses, isLoading } = useAddresses();
    const createAddress = useCreateAddress();
    const updateAddress = useUpdateAddress();
    const deleteAddress = useDeleteAddress();
    const setDefault = useSetDefaultAddress();

    const [isFormMode, setIsFormMode] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newAddr, setNewAddr] = useState<CreateAddressRequest>({
        label: "Home",
        recipientName: "",
        recipientPhone: "",
        addressLine1: "",
        ward: "",
        district: "",
        province: "",
        isDefault: false
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingId) {
            const res = await updateAddress.mutateAsync({ id: editingId, data: newAddr });
            if (res.success) {
                setIsFormMode(false);
                setEditingId(null);
                onSelect(res.data!);
            }
        } else {
            const res = await createAddress.mutateAsync(newAddr);
            if (res.success) {
                setIsFormMode(false);
                onSelect(res.data!); // Auto-select new address
            }
        }
        
        // Reset form
        if (!editingId) {
            setNewAddr({
                label: "Home",
                recipientName: "",
                recipientPhone: "",
                addressLine1: "",
                ward: "",
                district: "",
                province: "",
                isDefault: false
            });
        }
    };

    const handleEditClick = (e: React.MouseEvent, addr: UserAddressDto) => {
        e.stopPropagation();
        setEditingId(addr.id);
        setNewAddr({
            label: addr.label || "Home",
            recipientName: addr.recipientName,
            recipientPhone: addr.recipientPhone,
            addressLine1: addr.addressLine1,
            ward: addr.ward,
            district: addr.district,
            province: addr.province,
            isDefault: addr.isDefault
        });
        setIsFormMode(true);
    };

    // GAP-05 FIX: Auto-select default address
    useEffect(() => {
        if (addresses && addresses.length > 0 && !selectedId) {
            const defaultAddr = addresses.find((a: UserAddressDto) => a.isDefault);
            if (defaultAddr) {
                onSelect(defaultAddr);
            }
        }
    }, [addresses, selectedId, onSelect]);

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gold" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <MapPin size={22} className="text-gold" />
                    <h2 className="font-serif text-xl text-gray-900 dark:text-white">Shipping Address</h2>
                </div>
                {!isFormMode && (
                    <button 
                        onClick={() => {
                            setEditingId(null);
                            setNewAddr({ label: "Home", recipientName: "", recipientPhone: "", addressLine1: "", ward: "", district: "", province: "", isDefault: false });
                            setIsFormMode(true);
                        }}
                        className="flex items-center gap-2 text-xs font-bold text-gold uppercase tracking-widest hover:brightness-110"
                    >
                        <Plus size={14} /> Add New
                    </button>
                )}
            </div>

            {isFormMode ? (
                <form onSubmit={handleSave} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300 dark:border-white/10 dark:bg-[#0a0a0a]">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4 dark:border-white/5">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">
                            {editingId ? "Edit Address Details" : "New Address Details"}
                        </h3>
                        <button type="button" onClick={() => { setIsFormMode(false); setEditingId(null); }} className="hover:text-red-500 transition-colors"><X size={18} className="text-gray-400" /></button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2 flex gap-3 mb-2">
                            {["Home", "Office", "Other"].map(l => (
                                <button 
                                    key={l}
                                    type="button"
                                    onClick={() => setNewAddr({...newAddr, label: l})}
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${newAddr.label === l ? "bg-gold text-white" : "bg-gray-100 text-gray-500 dark:bg-white/5"}`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                        <input 
                            required
                            placeholder="Receiver Name *" 
                            className="checkout-input" 
                            value={newAddr.recipientName}
                            onChange={e => setNewAddr({...newAddr, recipientName: e.target.value})}
                        />
                        <input 
                            required
                            placeholder="Phone Number *" 
                            className="checkout-input" 
                            value={newAddr.recipientPhone}
                            onChange={e => setNewAddr({...newAddr, recipientPhone: e.target.value})}
                        />
                        <input 
                            required
                            placeholder="Street Address *" 
                            className="checkout-input md:col-span-2" 
                            value={newAddr.addressLine1}
                            onChange={e => setNewAddr({...newAddr, addressLine1: e.target.value})}
                        />
                        <input 
                            required
                            placeholder="Ward *" 
                            className="checkout-input" 
                            value={newAddr.ward}
                            onChange={e => setNewAddr({...newAddr, ward: e.target.value})}
                        />
                        <input 
                            required
                            placeholder="District *" 
                            className="checkout-input" 
                            value={newAddr.district}
                            onChange={e => setNewAddr({...newAddr, district: e.target.value})}
                        />
                        <input 
                            required
                            placeholder="State / Province *" 
                            className="checkout-input md:col-span-2" 
                            value={newAddr.province}
                            onChange={e => setNewAddr({...newAddr, province: e.target.value})}
                        />
                    </div>

                    <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/5">
                        <button type="button" onClick={() => { setIsFormMode(false); setEditingId(null); }} className="rounded-xl px-6 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-widest border border-gray-200 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5 transition-colors">Cancel</button>
                        <button 
                            type="submit" 
                            disabled={createAddress.isPending || updateAddress.isPending}
                            className="bg-gold px-8 py-2.5 rounded-xl text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-colors"
                        >
                            {(createAddress.isPending || updateAddress.isPending) && <Loader2 size={14} className="animate-spin" />}
                            {editingId ? "Update Address" : "Save Address"}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {addresses.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 bg-gray-50 rounded-2xl dark:border-white/10 dark:bg-white/5">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No saved addresses found.</p>
                            <button onClick={() => setIsFormMode(true)} className="mt-4 text-gold font-bold text-xs uppercase tracking-widest hover:underline">Add your first address</button>
                        </div>
                    ) : (
                        addresses.map((addr) => (
                            <div 
                                key={addr.id}
                                onClick={() => onSelect(addr)}
                                className={`group relative cursor-pointer rounded-2xl border-2 p-5 transition-all ${selectedId === addr.id 
                                    ? "border-gold bg-gold/5 ring-1 ring-gold/20" 
                                    : "border-gray-100 hover:border-gray-200 dark:border-white/5 dark:hover:border-white/10"
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className={`mt-1 flex h-10 w-10 items-center justify-center rounded-full ${selectedId === addr.id ? "bg-gold text-white" : "bg-gray-100 text-gray-400 dark:bg-white/5"}`}>
                                            {addr.label?.toLowerCase() === 'home' ? <Home size={18} /> : addr.label?.toLowerCase() === 'office' ? <Briefcase size={18} /> : <MapPin size={18} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{addr.recipientName}</p>
                                                {addr.isDefault && <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Default</span>}
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{addr.recipientPhone}</p>
                                            <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                                {addr.addressLine1}, {addr.ward}, {addr.district}, {addr.province}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {selectedId === addr.id && <CheckCircle2 size={20} className="text-gold" />}
                                        <div className="hidden group-hover:flex gap-2">
                                            {!addr.isDefault && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setDefault.mutate(addr.id); }}
                                                    className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-full transition-colors"
                                                    title="Set as Default"
                                                >
                                                    <Landmark size={14} />
                                                </button>
                                            )}
                                            <button 
                                                onClick={(e) => handleEditClick(e, addr)}
                                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-full transition-colors"
                                                title="Edit Address"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); deleteAddress.mutate(addr.id); }}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
                                                title="Delete Address"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            <style jsx>{`
                .checkout-input {
                    @apply w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/10 dark:border-white/10 dark:bg-[#111] dark:text-white dark:hover:border-white/20 dark:focus:border-gold dark:focus:bg-[#1a1a1a];
                }
            `}</style>
        </div>
    );
}
