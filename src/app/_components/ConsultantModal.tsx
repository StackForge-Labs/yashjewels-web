"use client";

import { useState, useEffect } from "react";
import { X, Send, Phone, User, Mail, MessageSquare, ShieldCheck, Globe } from "lucide-react";

export const ConsultantModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");
    const [delay, setDelay] = useState(30000); // Initial 30s

    useEffect(() => {
        setMounted(true);

        const checkAndSchedule = () => {
            const lastSubmitted = localStorage.getItem("consultant_last_submitted");
            const now = Date.now();

            // If submitted in last 24h, don't show
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
        // Increase delay by 10s for next time (40s, 50s...)
        setDelay((prev) => prev + 10000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus("submitting");
        setTimeout(() => {
            setFormStatus("success");
            localStorage.setItem("consultant_last_submitted", Date.now().toString());
        }, 1500);
    };

    if (!mounted || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
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
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                                                    required
                                                    type="text"
                                                    placeholder="Alex Sterling"
                                                    className="focus:border-gold focus:ring-gold/20 w-full rounded-xl border border-gray-100 bg-gray-50 py-4 pr-4 pl-12 text-sm text-gray-900 transition-all outline-none focus:ring-1 dark:border-white/5 dark:bg-[#111] dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                                Country
                                            </label>
                                            <div className="group relative">
                                                <Globe
                                                    className="group-focus-within:text-gold absolute top-1/2 left-4 -translate-y-1/2 text-gray-300 transition-colors"
                                                    size={18}
                                                />
                                                <select
                                                    required
                                                    className="focus:border-gold focus:ring-gold/20 w-full appearance-none rounded-xl border border-gray-100 bg-gray-50 py-4 pr-4 pl-12 text-sm text-gray-900 transition-all outline-none focus:ring-1 dark:border-white/5 dark:bg-[#111] dark:text-white"
                                                >
                                                    <option value="US">United States</option>
                                                    <option value="UK">United Kingdom</option>
                                                    <option value="VN">Vietnam</option>
                                                    <option value="SG">Singapore</option>
                                                    <option value="FR">France</option>
                                                </select>
                                            </div>
                                        </div>
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
                                                required
                                                type="email"
                                                placeholder="alex@luxury.com"
                                                className="focus:border-gold focus:ring-gold/20 w-full rounded-xl border border-gray-100 bg-gray-50 py-4 pr-4 pl-12 text-sm text-gray-900 transition-all outline-none focus:ring-1 dark:border-white/5 dark:bg-[#111] dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                            Phone Number (inc. area code)
                                        </label>
                                        <div className="group relative">
                                            <Phone
                                                className="group-focus-within:text-gold absolute top-1/2 left-4 -translate-y-1/2 text-gray-300 transition-colors"
                                                size={18}
                                            />
                                            <input
                                                required
                                                type="tel"
                                                placeholder="+1 234 567 890"
                                                className="focus:border-gold focus:ring-gold/20 w-full rounded-xl border border-gray-100 bg-gray-50 py-4 pr-4 pl-12 text-sm text-gray-900 transition-all outline-none focus:ring-1 dark:border-white/5 dark:bg-[#111] dark:text-white"
                                            />
                                        </div>
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
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black"></div>
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
