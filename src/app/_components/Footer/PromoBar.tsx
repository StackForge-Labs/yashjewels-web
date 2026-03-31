"use client";

import { ChevronDown, Send, Sparkles } from "lucide-react";
import { useState } from "react";

export const PromoBar = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        region: "",
        interest: "",
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    return (
        <div className="pb-safe dark:bg-dark-bg/95 fixed bottom-0 left-0 z-60 hidden w-full border-t border-gray-100 bg-white/95 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-all lg:block dark:border-white/5">
            <div className="container mx-auto px-4 py-2 lg:px-12 lg:py-3">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between lg:gap-6"
                >
                    {/* Brand/Label Section */}
                    <div className="flex shrink-0 items-center justify-center gap-3 lg:justify-start lg:gap-4">
                        <div className="bg-gold/10 text-gold flex h-9 w-9 items-center justify-center rounded-full">
                            <Sparkles size={18} className="animate-pulse" />
                        </div>
                        <div className="hidden xl:block">
                            <span className="text-gold block text-[9px] font-bold tracking-[0.4em] uppercase">
                                Special Promotions
                            </span>
                            <h4 className="font-serif text-[12px] font-bold tracking-[0.15em] whitespace-nowrap text-gray-900 uppercase dark:text-white">
                                Consult Now
                            </h4>
                        </div>
                    </div>

                    {/* Inputs Section */}
                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:max-w-4xl lg:flex-1 lg:gap-3">
                        <input
                            required
                            type="text"
                            placeholder="Full Name"
                            className="focus:border-gold w-full rounded-lg border border-gray-100 bg-white px-4 py-2 text-xs text-gray-900 transition-all outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                        <input
                            required
                            type="tel"
                            placeholder="Phone Number"
                            className="focus:border-gold w-full rounded-lg border border-gray-100 bg-white px-4 py-2 text-xs text-gray-900 transition-all outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />

                        <div className="relative w-full lg:min-w-[140px] lg:flex-1">
                            <select
                                required
                                className={`focus:border-gold w-full appearance-none rounded-lg border border-gray-100 bg-white px-4 py-2 text-xs transition-all outline-none dark:border-white/10 dark:bg-white/5 ${formData.region ? "text-gray-900 dark:text-white" : "text-gray-400"}`}
                                value={formData.region}
                                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                            >
                                <option value="">Select Region</option>
                                <option value="US">North America</option>
                                <option value="UK">United Kingdom</option>
                                <option value="EU">Europe</option>
                                <option value="AS">Asia Pacific</option>
                            </select>
                            <ChevronDown
                                size={12}
                                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                            />
                        </div>

                        <div className="relative w-full lg:min-w-[140px] lg:flex-1">
                            <select
                                required
                                className={`focus:border-gold w-full appearance-none rounded-lg border border-gray-100 bg-white px-4 py-2 text-xs transition-all outline-none dark:border-white/10 dark:bg-white/5 ${formData.interest ? "text-gray-900 dark:text-white" : "text-gray-400"}`}
                                value={formData.interest}
                                onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                            >
                                <option value="">Interest</option>
                                <option value="bridal">Bridal</option>
                                <option value="bespoke">Bespoke</option>
                                <option value="collection">Fine Jewelry</option>
                            </select>
                            <ChevronDown
                                size={12}
                                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                            />
                        </div>
                    </div>

                    {/* CTA Section */}
                    <button
                        type="submit"
                        className={`bg-gold shadow-gold/20 flex shrink-0 items-center justify-center gap-2 rounded-lg px-6 py-2 text-[10px] font-bold tracking-[0.2em] text-white uppercase shadow-lg transition-all active:scale-[0.98] ${isSubmitted ? "bg-green-600 shadow-green-600/20" : "hover:brightness-110"}`}
                    >
                        {isSubmitted ? "Sent" : "Submit"}
                        <Send size={12} />
                    </button>
                </form>
            </div>
        </div>
    );
};
