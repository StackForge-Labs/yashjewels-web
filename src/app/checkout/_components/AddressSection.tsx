"use client";

import React, { useState, useEffect } from "react";
import {
    MapPin, Plus, Trash2, CheckCircle2,
    Home, Briefcase, Landmark, Loader2, X, Edit2, Map, Zap, Gift
} from "lucide-react";
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress, useSetDefaultAddress } from "@/hooks/useAddress";
import { UserAddressDto, CreateAddressRequest } from "@/types/user.types";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import MapGL, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const SHOP_COORDS = { lat: 10.762622, lng: 106.660172 }; // YashJewels HCM Store
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1IjoiaW5maW5pdHJpIiwiYSI6ImNtb2cyN3dmZzA1dGkyb29wY3hlYzF4bHUifQ.Rx8vWkvrvvp7KZbWNsBfHQ";

const addressSchema = z.object({
    label: z.string().optional(),
    recipientName: z.string().min(2, "Receiver name must be at least 2 characters"),
    recipientPhone: z.string().min(10, "Please enter a valid phone number"),
    recipientEmail: z.string().email("Invalid email format").optional().or(z.literal('')),
    addressLine1: z.string().min(5, "Street address is required"),
    country: z.string().min(2, "Country is required"),
    province: z.string().min(2, "State/Province is required"),
    district: z.string().optional(),
    ward: z.string().optional(),
    postalCode: z.string().optional(),
    isGift: z.boolean().optional(),
    giftMessage: z.string().max(500, "Message must be under 500 characters").optional(),
    isDefault: z.boolean().optional()
}).superRefine((data, ctx) => {
    if (data.isGift && (!data.recipientEmail || data.recipientEmail.trim() === '')) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Recipient email is required for gifting",
            path: ["recipientEmail"]
        });
    }
    if (data.country === 'VN') {
        if (!data.district) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "District is required in Vietnam", path: ["district"] });
        if (!data.ward) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Ward is required in Vietnam", path: ["ward"] });
    } else {
        if (!data.postalCode) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "ZIP/Postal Code is required for International", path: ["postalCode"] });
    }
});

type AddressFormValues = z.infer<typeof addressSchema>;

// Floating Input Component
const FloatingInput = React.forwardRef<HTMLInputElement, any>(({ label, error, ...props }, ref) => (
    <div className="relative z-0 w-full group">
        <input
            ref={ref}
            className={`block px-4 pb-2.5 pt-6 w-full text-sm text-gray-900 bg-transparent rounded-[8px] border appearance-none focus:outline-none focus:ring-0 peer transition-colors
                ${error ? 'border-red-500 focus:border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-gold dark:focus:border-gold'}
                dark:text-white`}
            placeholder=" "
            {...props}
        />
        <label
            className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-4.5 z-10 origin-[0] start-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 pointer-events-none
                ${error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 peer-focus:text-gold'}`}
        >
            {label}
        </label>
        {error && <p className="mt-1.5 text-[11px] font-medium text-red-500 px-1">{error}</p>}
    </div>
));
FloatingInput.displayName = 'FloatingInput';

const FloatingSelect = React.forwardRef<HTMLSelectElement, any>(({ label, error, children, ...props }, ref) => (
    <div className="relative z-0 w-full group">
        <select
            ref={ref}
            className={`block px-4 pb-2.5 pt-6 w-full text-sm text-gray-900 bg-transparent rounded-[8px] border appearance-none focus:outline-none focus:ring-0 peer transition-colors
                ${error ? 'border-red-500 focus:border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-gold dark:focus:border-gold'}
                dark:text-white`}
            {...props}
        >
            {children}
        </select>
        <label
            className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-4.5 z-10 origin-[0] start-4 pointer-events-none
                ${error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 peer-focus:text-gold'}`}
        >
            {label}
        </label>
        {error && <p className="mt-1.5 text-[11px] font-medium text-red-500 px-1">{error}</p>}
    </div>
));
FloatingSelect.displayName = 'FloatingSelect';

interface AddressSectionProps {
    onSelect: (address: UserAddressDto) => void;
    selectedId?: string;
    onFormToggle?: (isOpen: boolean) => void;
}

export default function AddressSection({ onSelect, selectedId, onFormToggle }: AddressSectionProps) {
    const { data: addresses, isLoading } = useAddresses();
    const createAddress = useCreateAddress();
    const updateAddress = useUpdateAddress();
    const deleteAddress = useDeleteAddress();
    const setDefault = useSetDefaultAddress();

    const [isFormMode, setIsFormMode] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [shippingEstimate, setShippingEstimate] = useState<{cost: number, method: string, description: string, eta: string, distance: number | null, isPriority: boolean} | null>(null);
    const [isPriority, setIsPriority] = useState(false);
    const [currentDistance, setCurrentDistance] = useState<number | null>(null);

    const [countries, setCountries] = useState<{ cca2: string, name: string }[]>([]);
    const [vnProvinces, setVnProvinces] = useState<any[]>([]);

    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            label: "HOME",
            country: "VN",
            isDefault: false
        }
    });

    const watchCountry = watch("country");
    const watchIsGift = watch("isGift");

    useEffect(() => {
        if (currentDistance !== null) {
            calculateEstimate(currentDistance, isPriority);
        }
    }, [currentDistance, isPriority, watchCountry]);

    const calculateEstimate = (km: number, priority: boolean) => {
        if (watchCountry !== "VN") {
            setShippingEstimate({
                cost: 5000000 + (priority ? 1000000 : 0),
                method: priority ? "Priority Global Express" : "International VIP Transport",
                description: priority ? "Next-flight-out Secure Air Transport" : "FedEx/DHL Secure Transport with Insurance",
                eta: priority ? "3 - 5 Business Days" : "7 - 10 Business Days",
                distance: km,
                isPriority: priority
            });
            return;
        }

        if (km <= 15) {
            setShippingEstimate({
                cost: 0 + (priority ? 200000 : 0),
                method: priority ? "Priority Urban Express" : "Urban VIP Delivery",
                description: priority ? "Dedicated Instant Dispatch" : "Complimentary White-glove Service",
                eta: priority ? "2 - 4 Hours" : "12 - 24 Hours",
                distance: km,
                isPriority: priority
            });
        } else if (km <= 50) {
            setShippingEstimate({
                cost: 500000 + (priority ? 200000 : 0),
                method: priority ? "Priority Suburban Express" : "Suburban Secure Delivery",
                description: priority ? "Direct Dedicated Armored Car" : "In-house Armored Fleet Delivery",
                eta: priority ? "6 - 12 Hours" : "1 - 2 Days",
                distance: km,
                isPriority: priority
            });
        } else if (km <= 150) {
            setShippingEstimate({
                cost: 1500000 + (priority ? 200000 : 0),
                method: priority ? "Priority Regional Express" : "Inter-provincial VIP Transport",
                description: priority ? "Dedicated Security Team" : "Dedicated Security Escort",
                eta: priority ? "24 Hours" : "2 - 3 Days",
                distance: km,
                isPriority: priority
            });
        } else {
            setShippingEstimate({
                cost: 2500000 + (priority ? 500000 : 0),
                method: priority ? "Priority Airline Express" : "Airline Secure Courier",
                description: priority ? "Hand-carried Security Staff" : "3rd Party Insured Airline Transport",
                eta: priority ? "2 Days" : "3 - 5 Days",
                distance: km,
                isPriority: priority
            });
        }
    };

    const [placeValue, setPlaceValue] = useState("");
    const [placeSuggestions, setPlaceSuggestions] = useState<any[]>([]);
    const [suggestionStatus, setSuggestionStatus] = useState("IDLE");
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lon: number } | null>(null);

    let searchTimeout: NodeJS.Timeout;

    const handleAddressInput = (val: string) => {
        setPlaceValue(val);
        setValue("addressLine1", val);

        if (val.length < 3) {
            setPlaceSuggestions([]);
            setSuggestionStatus("IDLE");
            return;
        }

        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            try {
                // Dynamically scope search to selected country and proximity to shop
                const countryCode = watchCountry ? watchCountry.toLowerCase() : 'vn';
                const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(val)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5&country=${countryCode}&proximity=${SHOP_COORDS.lng},${SHOP_COORDS.lat}`);
                const data = await res.json();
                setPlaceSuggestions(data.features || []);
                setSuggestionStatus(data.features?.length > 0 ? "OK" : "ZERO_RESULTS");
            } catch (error) {
                console.error("Mapbox API error:", error);
                setSuggestionStatus("ERROR");
            }
        }, 500);
    };

    const watchStreet = watch("addressLine1");
    const watchProvince = watch("province");
    const watchDistrict = watch("district");

    const currentProvince = vnProvinces.find(p => p.name === watchProvince);
    const availableDistricts = currentProvince?.districts || [];
    const currentDistrict = availableDistricts.find((d: any) => d.name === watchDistrict);
    const availableWards = currentDistrict?.wards || [];

    useEffect(() => {
        // Fetch Countries
        fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
            .then(res => res.json())
            .then(data => {
                const formatted = data.map((c: any) => ({ cca2: c.cca2, name: c.name.common })).sort((a: any, b: any) => a.name.localeCompare(b.name));
                setCountries(formatted);
            }).catch(console.error);

        // Fetch VN Provinces
        fetch('https://provinces.open-api.vn/api/?depth=3')
            .then(res => res.json())
            .then(data => setVnProvinces(data))
            .catch(console.error);
    }, []);

    const calculateShippingCost = async (lat: number, lon: number) => {
        try {
            const res = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${SHOP_COORDS.lng},${SHOP_COORDS.lat};${lon},${lat}?access_token=${MAPBOX_TOKEN}`);
            const data = await res.json();

            if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                const distanceValue = data.routes[0].distance; // in meters
                const km = distanceValue / 1000;
                setCurrentDistance(km);
            } else {
                setShippingEstimate(null);
                setCurrentDistance(null);
            }
        } catch (error) {
            console.error("Mapbox Routing Error:", error);
            setShippingEstimate(null);
            setCurrentDistance(null);
        }
    };

    const handleSelectSuggestion = async (address: string, lat: number, lon: number) => {
        setValue("addressLine1", address);
        setPlaceValue(address);
        
        // Auto-detect country if possible from the address string
        if (address.toLowerCase().includes("vietnam") || address.toLowerCase().includes("việt nam")) {
            setValue("country", "VN");
        }
        
        setPlaceSuggestions([]);
        setSuggestionStatus("IDLE");
        setSelectedLocation({ lat, lon });
        calculateShippingCost(lat, lon);
    };

    const handleSave = async (data: AddressFormValues) => {
        const payload: CreateAddressRequest = {
            ...data,
            country: data.country,
            postalCode: data.postalCode,
            district: data.district || "",
            ward: data.ward || "",
            isGift: data.isGift ?? false,
            recipientEmail: data.isGift ? data.recipientEmail : undefined,
            giftMessage: data.isGift ? data.giftMessage : undefined,
            isDefault: data.isDefault ?? false,
        };

        if (editingId) {
            const res = await updateAddress.mutateAsync({ id: editingId, data: payload });
            if (res.success) {
                setIsFormMode(false);
                setEditingId(null);
                onFormToggle?.(false);
                onSelect(res.data!);
            }
        } else {
            const res = await createAddress.mutateAsync(payload);
            if (res.success) {
                setIsFormMode(false);
                onFormToggle?.(false);
                onSelect(res.data!);
            }
        }
        reset();
    };

    const openEditForm = async (e: React.MouseEvent, addr: UserAddressDto) => {
        e.stopPropagation();
        setEditingId(addr.id);
        setPlaceValue(addr.addressLine1);
        
        // Try to restore map location via geocoding
        try {
            const query = encodeURIComponent(addr.addressLine1);
            const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_TOKEN}&limit=1`);
            const data = await res.json();
            if (data.features && data.features.length > 0) {
                const [lon, lat] = data.features[0].center;
                setSelectedLocation({ lat, lon });
                calculateShippingCost(lat, lon);
            }
        } catch (err) {
            console.error("Geocoding failed on edit", err);
        }

        reset({
            label: addr.label || "HOME",
            recipientName: addr.recipientName,
            recipientPhone: addr.recipientPhone,
            addressLine1: addr.addressLine1,
            country: addr.country || "VN",
            ward: addr.ward,
            district: addr.district,
            province: addr.province,
            postalCode: addr.postalCode,
            isGift: addr.isGift || false,
            recipientEmail: addr.recipientEmail || "",
            giftMessage: addr.giftMessage || "",
            isDefault: addr.isDefault || false
        });
        setIsFormMode(true);
        onFormToggle?.(true);
    };

    useEffect(() => {
        if (addresses && addresses.length > 0 && !selectedId) {
            const defaultAddr = addresses.find((a: UserAddressDto) => a.isDefault);
            if (defaultAddr) onSelect(defaultAddr);
        }
    }, [addresses, selectedId, onSelect]);

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gold" /></div>;

    const fullAddressString = `${watchStreet || ''} ${watchProvince || ''} ${watchCountry || ''}`.trim();

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
                            setSelectedLocation(null);
                            setShippingEstimate(null);
                            setCurrentDistance(null);
                            setIsPriority(false);
                            setPlaceValue("");
                            reset({ label: "HOME", country: "VN", isDefault: false, isGift: false, recipientEmail: "" });
                            setIsFormMode(true);
                            onFormToggle?.(true);
                        }}
                        className="flex items-center gap-2 text-xs font-bold text-gold uppercase tracking-widest hover:brightness-110"
                    >
                        <Plus size={14} /> Add New
                    </button>
                )}
            </div>

            {isFormMode ? (
                <form onSubmit={handleSubmit(handleSave)} className="rounded-[16px] border border-gray-200 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in slide-in-from-top-4 duration-300 dark:border-white/10 dark:bg-[#0a0a0a]">
                    <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4 dark:border-white/5">
                        <h3 className="text-[13px] font-bold text-gray-900 dark:text-white uppercase tracking-widest">
                            {editingId ? "Edit Address Details" : "New Address Details"}
                        </h3>
                        <button type="button" onClick={() => { setIsFormMode(false); setEditingId(null); }} className="hover:text-red-500 transition-colors"><X size={18} className="text-gray-400" /></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
                        <div className="md:col-span-2 flex gap-3 mb-2">
                            {["HOME", "OFFICE", "OTHER"].map(l => (
                                <button
                                    key={l}
                                    type="button"
                                    onClick={() => setValue("label", l)}
                                    className={`px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${watch("label") === l ? "bg-[#d4af37] text-white shadow-md shadow-gold/20" : "bg-gray-100 text-gray-500 dark:bg-white/5"}`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>

                        <FloatingInput
                            label="Receiver Name *"
                            error={errors.recipientName?.message}
                            {...register("recipientName")}
                        />
                        <FloatingInput
                            label="Phone Number *"
                            error={errors.recipientPhone?.message}
                            {...register("recipientPhone")}
                        />

                        {/* Country Selection */}
                        <div className="md:col-span-2">
                            <FloatingSelect label="Country *" error={errors.country?.message} {...register("country")}>
                                <option value="VN">Vietnam</option>
                                <option value="US">United States</option>
                                <option value="UK">United Kingdom</option>
                                <option value="AU">Australia</option>
                                <option value="SG">Singapore</option>
                                {countries.filter(c => !["VN", "US", "UK", "AU", "SG"].includes(c.cca2)).map(c => <option key={c.cca2} value={c.cca2}>{c.name}</option>)}
                            </FloatingSelect>
                        </div>

                        {/* Strategy Pattern based on Country */}
                        {watchCountry === "VN" ? (
                            <>
                                <FloatingSelect label="State / Province *" error={errors.province?.message} {...register("province")}>
                                    <option value="">Select Province</option>
                                    {vnProvinces.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
                                </FloatingSelect>
                                <FloatingSelect label="District *" error={errors.district?.message} {...register("district")}>
                                    <option value="">Select District</option>
                                    {availableDistricts.map((d: any) => <option key={d.code} value={d.name}>{d.name}</option>)}
                                </FloatingSelect>
                                <FloatingSelect label="Ward *" error={errors.ward?.message} {...register("ward")}>
                                    <option value="">Select Ward</option>
                                    {availableWards.map((w: any) => <option key={w.code} value={w.name}>{w.name}</option>)}
                                </FloatingSelect>
                                <FloatingInput
                                    label="ZIP / Postal Code (Optional)"
                                    error={errors.postalCode?.message}
                                    {...register("postalCode")}
                                />
                            </>
                        ) : (
                            <>
                                <FloatingInput
                                    label="State / Province *"
                                    error={errors.province?.message}
                                    {...register("province")}
                                />
                                <FloatingInput
                                    label="District / Region"
                                    error={errors.district?.message}
                                    {...register("district")}
                                />
                                <FloatingInput
                                    label="Ward / Suburb"
                                    error={errors.ward?.message}
                                    {...register("ward")}
                                />
                                <FloatingInput
                                    label="ZIP / Postal Code *"
                                    error={errors.postalCode?.message}
                                    {...register("postalCode")}
                                />
                            </>
                        )}

                        {/* Street Address with API suggestion simulation */}
                        <div className="md:col-span-2 relative">
                            <FloatingInput
                                label="Street Address *"
                                error={errors.addressLine1?.message}
                                value={placeValue || watchStreet || ""}
                                onChange={(e: any) => handleAddressInput(e.target.value)}
                            />
                            {suggestionStatus === "OK" && placeSuggestions.length > 0 && (
                                <ul className="absolute z-50 w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                                    {placeSuggestions.map((place) => (
                                        <li
                                            key={place.id}
                                            onClick={() => handleSelectSuggestion(place.place_name, place.geometry.coordinates[1], place.geometry.coordinates[0])}
                                            className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer text-sm text-gray-700 dark:text-gray-300 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0"
                                        >
                                            <div className="flex items-start gap-2">
                                                <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
                                                <span>{place.place_name}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <p className="mt-2 text-[11px] text-gray-400 flex items-center gap-1">
                                <Map size={12} /> Powered by Mapbox
                            </p>
                            {selectedLocation && (
                                <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm relative h-[250px] w-full animate-in fade-in zoom-in-95">
                                    <MapGL
                                        mapboxAccessToken={MAPBOX_TOKEN}
                                        initialViewState={{
                                            longitude: selectedLocation.lon,
                                            latitude: selectedLocation.lat,
                                            zoom: 14
                                        }}
                                        style={{width: '100%', height: '100%'}}
                                        mapStyle="mapbox://styles/mapbox/streets-v12"
                                    >
                                        <Marker longitude={selectedLocation.lon} latitude={selectedLocation.lat} color="red" />
                                    </MapGL>
                                </div>
                            )}

                            {/* Priority Shipping Toggle */}
                            {currentDistance !== null && (
                                <div className="mt-6 p-4 rounded-xl border border-gold/20 bg-gold/5 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${isPriority ? 'bg-gold text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-500'} transition-colors`}>
                                                <Zap size={18} fill={isPriority ? "currentColor" : "none"} />
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-bold text-gray-900 dark:text-white">Priority Express Delivery</h5>
                                                <p className="text-[11px] text-gray-500">Premium security & faster dispatch</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsPriority(!isPriority)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isPriority ? 'bg-gold' : 'bg-gray-300 dark:bg-white/10'}`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPriority ? 'translate-x-6' : 'translate-x-1'}`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* VIP Delivery Estimate Card */}
                    {shippingEstimate && (
                        <div className={`mt-8 rounded-xl border p-5 flex flex-col md:flex-row gap-5 items-start md:items-center animate-in fade-in slide-in-from-bottom-4 shadow-sm transition-all duration-300 ${shippingEstimate.isPriority ? 'bg-red-50/50 border-red-200 dark:bg-red-500/5 dark:border-red-500/20' : 'bg-gray-50 border-gold/30 dark:bg-gold/5 dark:border-gold/20'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border transition-all ${shippingEstimate.isPriority ? 'bg-red-100 border-red-200 text-red-600' : 'bg-gold/10 border-gold/20 text-gold'}`}>
                                {shippingEstimate.isPriority ? <Zap size={22} fill="currentColor" /> : <Briefcase size={22} />}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-[13px] font-bold text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                                    {shippingEstimate.method}
                                    {shippingEstimate.isPriority && (
                                        <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-sm tracking-wider font-semibold animate-pulse">PRIORITY</span>
                                    )}
                                    {shippingEstimate.cost === 0 && !shippingEstimate.isPriority && (
                                        <span className="text-[10px] bg-gold text-white px-2 py-0.5 rounded-sm tracking-wider font-semibold">COMPLIMENTARY</span>
                                    )}
                                </h4>
                                <p className="text-[13px] text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{shippingEstimate.description}</p>
                                <div className="flex items-center gap-4 mt-2.5 text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                                    <div className="flex items-center gap-1.5"><MapPin size={13} className="text-gray-400"/> Distance: {shippingEstimate.distance ? shippingEstimate.distance.toFixed(1) : "--"} km</div>
                                    <div className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-green-500"/> ETA: {shippingEstimate.eta}</div>
                                </div>
                            </div>
                            <div className="text-left md:text-right shrink-0 mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-200 dark:border-white/10 w-full md:w-auto">
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Shipping Fee</div>
                                <div className="text-xl font-light text-gray-900 dark:text-white">
                                    {shippingEstimate.cost === 0 ? "FREE" : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(shippingEstimate.cost)}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 space-y-4">
                        <div className="flex flex-col gap-4">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        {...register("isGift")}
                                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:ring-0 checked:bg-gold checked:border-gold dark:border-gray-600 transition-all cursor-pointer"
                                    />
                                    <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                                <span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-gold transition-colors flex items-center gap-2">
                                    <Gift size={16} className="text-gold" /> This is a gift for a loved one
                                </span>
                            </label>

                            {watchIsGift && (
                                <div className="ml-7 animate-in fade-in slide-in-from-left-4">
                                    <FloatingInput
                                        label="Recipient Email (for verification)"
                                        type="email"
                                        {...register("recipientEmail")}
                                        error={errors.recipientEmail?.message}
                                    />
                                    <div className="relative mt-3">
                                        <textarea
                                            {...register("giftMessage")}
                                            rows={3}
                                            maxLength={500}
                                            placeholder=" "
                                            className="block px-4 pb-3 pt-5 w-full text-sm text-gray-900 bg-transparent rounded-[8px] border border-gray-200 dark:border-gray-700 focus:border-gold dark:focus:border-gold focus:outline-none resize-none transition-colors dark:text-white peer"
                                        />
                                        <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4.5 z-10 origin-[0] start-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 pointer-events-none peer-focus:text-gold">
                                            Gift Message (optional)
                                        </label>
                                        {errors.giftMessage && <p className="mt-1.5 text-[11px] font-medium text-red-500 px-1">{errors.giftMessage.message}</p>}
                                    </div>
                                    <p className="mt-2 text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed italic">
                                        * A verification QR code and delivery tracking will be sent to this email.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:ring-0 checked:bg-gold checked:border-gold dark:border-gray-600 transition-all cursor-pointer"
                                        {...register("isDefault")}
                                    />
                                    <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Set as default address</span>
                            </label>

                        <div className="flex gap-3 w-full md:w-auto">
                            <button type="button" onClick={() => { setIsFormMode(false); setEditingId(null); onFormToggle?.(false); }} className="flex-1 md:flex-none rounded-xl px-6 py-3 text-[11px] font-bold text-gray-600 uppercase tracking-widest border border-gray-200 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5 transition-colors">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createAddress.isPending || updateAddress.isPending}
                                className="flex-1 md:flex-none bg-[#d4af37] px-8 py-3 rounded-xl text-[11px] font-bold text-white uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#c4a030] shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {(createAddress.isPending || updateAddress.isPending) && <Loader2 size={14} className="animate-spin" />}
                                {editingId ? "Update Address" : "Save Address"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            ) : (
                <div className="grid grid-cols-1 gap-5">
                    {addresses.length === 0 ? (
                        <div className="text-center py-16 border border-dashed border-gray-300 bg-gray-50/50 rounded-2xl dark:border-white/10 dark:bg-white/5">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm mb-4">
                                <MapPin className="text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No saved addresses found.</p>
                            <button onClick={() => setIsFormMode(true)} className="mt-4 text-gold font-bold text-[11px] uppercase tracking-widest hover:text-[#b8952d] transition-colors">Add your first address</button>
                        </div>
                    ) : (
                        addresses.map((addr) => (
                            <div
                                key={addr.id}
                                onClick={() => onSelect(addr)}
                                className={`group relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 ${selectedId === addr.id
                                    ? "border-[#d4af37] bg-[#d4af37]/[0.02] shadow-[0_0_0_1px_rgba(212,175,55,1)]"
                                    : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-md dark:border-white/5 dark:bg-[#0a0a0a] dark:hover:border-white/20"
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-5">
                                        <div className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${selectedId === addr.id ? "bg-[#d4af37] text-white shadow-lg shadow-gold/20" : "bg-gray-100 text-gray-500 dark:bg-white/5"}`}>
                                            {addr.label?.toLowerCase() === 'home' ? <Home size={20} /> : addr.label?.toLowerCase() === 'office' ? <Briefcase size={20} /> : <MapPin size={20} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <p className="text-[15px] font-bold text-gray-900 dark:text-white">{addr.recipientName}</p>
                                                {addr.isDefault && <span className="text-[9px] bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Default</span>}
                                                {addr.isGift && (
                                                    <span className="text-[9px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest flex items-center gap-1">
                                                        <Gift size={8} fill="currentColor" /> Gift
                                                    </span>
                                                )}
                                                {addr.label && <span className="text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest dark:bg-white/10 dark:text-gray-300">{addr.label}</span>}
                                            </div>
                                            <p className="mt-1 text-[13px] font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2 flex-wrap">
                                                <span>{addr.recipientPhone}</span>
                                                {addr.isGift && addr.recipientEmail && (
                                                    <>
                                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                        <span className="text-gray-400 font-normal italic truncate max-w-[150px]">{addr.recipientEmail}</span>
                                                    </>
                                                )}
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                <span className="text-gold font-semibold">
                                                    {(addr.country === 'VN' || addr.addressLine1.toLowerCase().includes('vietnam') || addr.addressLine1.toLowerCase().includes('việt nam')) ? 'Vietnam' : addr.country || 'International'}
                                                </span>
                                            </p>
                                            <p className="mt-3 text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed border-l-2 border-gold/30 pl-3">
                                                {/* If addressLine1 already looks like a full address (contains commas), just show it. 
                                                    Otherwise, build the full string. */}
                                                {addr.addressLine1.includes(',') && addr.addressLine1.length > 20 ? (
                                                    addr.addressLine1
                                                ) : (
                                                    <>
                                                        {addr.addressLine1}
                                                        {addr.ward && `, ${addr.ward}`}
                                                        {addr.district && `, ${addr.district}`}
                                                        {addr.province && `, ${addr.province}`}
                                                    </>
                                                )}
                                                {addr.postalCode ? ` - ${addr.postalCode}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        <div className={`transition-transform duration-300 ${selectedId === addr.id ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                                            <CheckCircle2 size={24} className="text-[#d4af37] drop-shadow-sm" />
                                        </div>
                                        <div className="hidden group-hover:flex gap-1 bg-white dark:bg-[#111] p-1 rounded-full border border-gray-100 dark:border-white/10 shadow-sm">
                                            {!addr.isDefault && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setDefault.mutate(addr.id); }}
                                                    className="p-2 text-gray-400 hover:text-[#d4af37] hover:bg-gold/10 rounded-full transition-colors"
                                                    title="Set as Default"
                                                >
                                                    <Landmark size={14} />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => openEditForm(e, addr)}
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
        </div>
    );
}
