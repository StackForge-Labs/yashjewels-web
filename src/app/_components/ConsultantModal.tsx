"use client";

import { useState, useEffect } from "react";
import { X, Send, User, Mail, MessageSquare, ShieldCheck, Globe, Loader2 } from "lucide-react";
import { vendorService } from "@/services/vendor.service";
import { toast } from "sonner";
import { isValidPhoneNumber } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";

const COUNTRIES: { code: CountryCode; dial: string; flag: string; name: string }[] = [
    { code: "VN", dial: "+84", flag: "🇻🇳", name: "Vietnam" },
    { code: "US", dial: "+1",  flag: "🇺🇸", name: "United States" },
    { code: "GB", dial: "+44", flag: "🇬🇧", name: "United Kingdom" },
    { code: "AU", dial: "+61", flag: "🇦🇺", name: "Australia" },
    { code: "JP", dial: "+81", flag: "🇯🇵", name: "Japan" },
    { code: "KR", dial: "+82", flag: "🇰🇷", name: "South Korea" },
    { code: "CN", dial: "+86", flag: "🇨🇳", name: "China" },
    { code: "SG", dial: "+65", flag: "🇸🇬", name: "Singapore" },
    { code: "TH", dial: "+66", flag: "🇹🇭", name: "Thailand" },
    { code: "MY", dial: "+60", flag: "🇲🇾", name: "Malaysia" },
    { code: "ID", dial: "+62", flag: "🇮🇩", name: "Indonesia" },
    { code: "PH", dial: "+63", flag: "🇵🇭", name: "Philippines" },
    { code: "IN", dial: "+91", flag: "🇮🇳", name: "India" },
    { code: "DE", dial: "+49", flag: "🇩🇪", name: "Germany" },
    { code: "FR", dial: "+33", flag: "🇫🇷", name: "France" },
    { code: "CA", dial: "+1",  flag: "🇨🇦", name: "Canada" },
];

export const ConsultantModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        dialCode: "VN" as CountryCode,
        phone: "",
    });
    const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
    const [delay, setDelay] = useState(30000);

    useEffect(() => {
        requestAnimationFrame(() => {
            setMounted(true);
        });

        const checkAndSchedule = () => {
            const lastSubmitted = localStorage.getItem("consultant_last_submitted");
            const now = Date.now();

            if (lastSubmitted && now - parseInt(lastSubmitted) < 24 * 60 * 60 * 1000) {
                return;
            }

            const timer = setTimeout(() => {
                setIsOpen(true);
            }, delay);

            return timer;
        };

        const timer = checkAndSchedule();
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [delay]);

    const handleClose = () => {
        setIsOpen(false);
        setDelay((prev) => prev + 10000);
    };

    const validate = (): boolean => {
        const errs: typeof errors = {};

        if (!formData.name.trim())
            errs.name = "Full name is required.";

        if (!formData.email.trim())
            errs.email = "Email address is required.";
        else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email.trim()))
            errs.email = "Please enter a valid email address.";

        if (!formData.phone.trim()) {
            errs.phone = "Phone number is required.";
        } else {
            const country = COUNTRIES.find(c => c.code === formData.dialCode)!;
            const fullNumber = country.dial + formData.phone.trim();
            try {
                if (!isValidPhoneNumber(fullNumber, formData.dialCode))
                    errs.phone = `Invalid phone number for ${country.name}.`;
            } catch {
                errs.phone = "Invalid phone number.";
            }
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const country = COUNTRIES.find(c => c.code === formData.dialCode)!;
        const fullPhone = country.dial + formData.phone.trim();

        try {
            setFormStatus("submitting");
            const res = await vendorService.submitInquiry({
                name: formData.name,
                email: formData.email,
                phone: fullPhone,
                subject: "Luxury Consultation Request",
                message: `Consultation request from ${country.name}`
            });

            if (res.success) {
                setFormStatus("success");
                localStorage.setItem("consultant_last_submitted", Date.now().toString());
            } else {
                setFormStatus("idle");
                toast.error(res.message || "Something went wrong. Please try again.");
            }
        } catch {
            setFormStatus("idle");
            toast.error("An error occurred.");
        }
    };

    if (!mounted || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={handleClose} />

            {/* Modal Content */}
            <div className="bg-dark-bg dark:bg-dark-bg relative w-full max-w-[900px] overflow-hidden rounded-4xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                <div className="flex flex-col md:flex-row">
                    {/* Left Side: Brand & Benefits */}
                    <div className="relative hidden w-full overflow-hidden bg-zinc-900 md:block md:w-5/12">
                        <img
                            src="https://cdn.brvn.vn/news/1280px/2022/23073_trang-suc-cover_1662383618.jpg"
                            className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale transition-transform duration-[10s] hover:scale-110"
                            alt="Luxury Consultant"
                        />
                        <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black via-black/40 to-transparent p-10">
                            <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.4em] uppercase">
                                Private Salon
                            </span>
                            <h2 className="mb-6 font-serif text-3xl text-white">Expert Diamond Consultation</h2>
                            <ul className="space-y-4">
                                {[
                                    { icon: <ShieldCheck size={16} />, text: "GIA Certified Gemologists" },
                                    { icon: <Globe size={16} />, text: "International Currencies & Shipping" },
                                    { icon: <MessageSquare size={16} />, text: "Bespoke Design Planning" },
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                        <span className="text-gold">{item.icon}</span>
                                        {item.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Side: The Form */}
                    <div className="w-full bg-white p-8 md:w-7/12 md:p-12 dark:bg-[#080808]">
                        <button
                            onClick={handleClose}
                            className="absolute top-6 right-6 text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        {formStatus === "success" ? (
                            <div className="animate-in fade-in zoom-in flex h-full flex-col items-center justify-center py-10 text-center duration-500">
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500 dark:bg-green-900/20">
                                    <Send size={40} />
                                </div>
                                <h3 className="mb-3 font-serif text-2xl text-gray-900 dark:text-white">
                                    Inquiry Received
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Our master consultant will contact you via WhatsApp or Email within 24 hours.
                                </p>
                                <button
                                    onClick={handleClose}
                                    className="mt-8 border-b-2 border-gray-900 pb-1 text-xs font-bold tracking-widest text-gray-900 uppercase dark:border-white dark:text-white"
                                >
                                    Return to Gallery
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-10">
                                    <h3 className="mb-2 font-serif text-3xl text-gray-900 dark:text-white">
                                        Personal Concierge
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Tailored advice for your next luxury masterpiece.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                            Full Name
                                        </label>
                                        <div className="group relative">
                                            <User
                                                className="group-focus-within:text-gold absolute top-1/2 left-4 -translate-y-1/2 text-gray-300 transition-colors"
                                                size={18}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Alex Sterling"
                                                className={`w-full rounded-xl border py-4 pr-4 pl-12 text-sm text-gray-900 transition-all outline-none dark:text-white ${errors.name ? "border-rose-400 bg-rose-50/50" : "border-gray-100 bg-gray-50 focus:border-gold focus:ring-1 focus:ring-gold/20 dark:border-white/5 dark:bg-[#111]"}`}
                                                value={formData.name}
                                                onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors(p => ({ ...p, name: undefined })); }}
                                            />
                                        </div>
                                        {errors.name && <p className="text-[11px] font-medium text-rose-500">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                            Email Address
                                        </label>
                                        <div className="group relative">
                                            <Mail
                                                className="group-focus-within:text-gold absolute top-1/2 left-4 -translate-y-1/2 text-gray-300 transition-colors"
                                                size={18}
                                            />
                                            <input
                                                type="text"
                                                placeholder="alex@luxury.com"
                                                className={`w-full rounded-xl border py-4 pr-4 pl-12 text-sm text-gray-900 transition-all outline-none dark:text-white ${errors.email ? "border-rose-400 bg-rose-50/50" : "border-gray-100 bg-gray-50 focus:border-gold focus:ring-1 focus:ring-gold/20 dark:border-white/5 dark:bg-[#111]"}`}
                                                value={formData.email}
                                                onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors(p => ({ ...p, email: undefined })); }}
                                            />
                                        </div>
                                        {errors.email && <p className="text-[11px] font-medium text-rose-500">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                            Phone Number
                                        </label>
                                        <div className={`flex overflow-hidden rounded-xl border transition-colors ${errors.phone ? "border-rose-400 bg-rose-50/50" : "border-gray-100 bg-gray-50 focus-within:border-gold dark:border-white/5 dark:bg-[#111]"}`}>
                                            <select
                                                value={formData.dialCode}
                                                onChange={e => { setFormData({ ...formData, dialCode: e.target.value as CountryCode }); setErrors(p => ({ ...p, phone: undefined })); }}
                                                className="shrink-0 border-r border-gray-100 bg-transparent px-3 py-4 text-sm text-gray-700 focus:outline-none dark:border-white/5 dark:text-gray-300"
                                            >
                                                {COUNTRIES.map(c => (
                                                    <option key={c.code} value={c.code}>{c.flag} {c.dial}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={e => { setFormData({ ...formData, phone: e.target.value }); setErrors(p => ({ ...p, phone: undefined })); }}
                                                className="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm focus:outline-none dark:text-white"
                                                placeholder="912 345 678"
                                            />
                                        </div>
                                        {errors.phone && <p className="text-[11px] font-medium text-rose-500">{errors.phone}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={formStatus === "submitting"}
                                        className="group relative w-full overflow-hidden rounded-xl bg-gray-900 py-5 font-bold tracking-[0.2em] text-white uppercase transition-all hover:bg-black disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                    >
                                        <span className={formStatus === "submitting" ? "opacity-0" : "opacity-100"}>
                                            Request Private Consultation
                                        </span>
                                        {formStatus === "submitting" && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            </div>
                                        )}
                                    </button>

                                    <p className="text-center text-[10px] text-gray-400">
                                        By submitting, you agree to our{" "}
                                        <a href="#" className="hover:text-gold underline">
                                            Privacy Policy
                                        </a>{" "}
                                        regarding your luxury data.
                                    </p>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
