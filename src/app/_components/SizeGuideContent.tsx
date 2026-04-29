"use client";

import React, { useState } from "react";
import { Ruler, Sparkles, Scale, Info } from "lucide-react";

const RING_SIZES = [
    { diameter: "14.1", perimeter: "44.3", us: "3", vn: "4" },
    { diameter: "14.9", perimeter: "46.8", us: "4", vn: "7" },
    { diameter: "15.7", perimeter: "49.3", us: "5", vn: "10" },
    { diameter: "16.5", perimeter: "51.8", us: "6", vn: "13" },
    { diameter: "17.3", perimeter: "54.4", us: "7", vn: "16" },
    { diameter: "18.1", perimeter: "56.9", us: "8", vn: "19" },
    { diameter: "18.9", perimeter: "59.4", us: "9", vn: "22" },
    { diameter: "19.8", perimeter: "62.2", us: "10", vn: "25" },
];

const NECKLACE_SIZES = [
    { length: '14" (35cm)', name: "Collar", pos: "Sits tightly around the neck" },
    { length: '16" (40cm)', name: "Choker", pos: "Sits at the base of the neck" },
    { length: '18" (45cm)', name: "Princess", pos: "Sits on the collarbone (Most Popular)" },
    { length: '20" (50cm)', name: "Matinee", pos: "Sits between collarbone and bust" },
    { length: '24" (60cm)', name: "Opera", pos: "Sits at the bust" },
];

export const SizeGuideContent = () => {
    const [activeTab, setActiveTab] = useState("ring");

    return (
        <div className="w-full">
            {/* Tabs */}
            <div className="mx-auto mb-10 flex max-w-md justify-center gap-2 rounded-2xl border border-gray-100 p-1.5 dark:border-white/5 dark:bg-white/2">
                {["ring", "necklace", "bracelet"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 rounded-xl py-3 text-[10px] font-bold tracking-widest uppercase transition-all ${
                            activeTab === tab
                                ? "bg-gold text-white shadow-lg shadow-gold/20"
                                : "text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Ring Size Section */}
            {activeTab === "ring" && (
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    <div>
                        <h2 className="mb-6 font-serif text-2xl text-gray-900 dark:text-white">How to Measure</h2>
                        <div className="space-y-6">
                            {[
                                { num: "01", title: "The Paper Method", desc: "Wrap paper around your finger. Mark the meeting point and measure in mm." },
                                { num: "02", title: "Existing Ring", desc: "Measure the internal diameter of a ring that fits you perfectly." },
                                { num: "03", title: "Knuckle Factor", desc: "If your knuckle is large, choose a size between base and knuckle." },
                            ].map((step) => (
                                <div key={step.num} className="flex gap-4">
                                    <span className="text-gold font-serif text-2xl italic">{step.num}</span>
                                    <div>
                                        <h4 className="mb-1 text-[13px] font-bold text-gray-900 dark:text-white">{step.title}</h4>
                                        <p className="text-[12px] leading-relaxed text-gray-500 dark:text-gray-400">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 rounded-xl bg-amber-50 p-4 dark:bg-amber-900/10">
                            <div className="flex gap-3 text-amber-700 dark:text-amber-400">
                                <Info size={16} className="shrink-0" />
                                <p className="text-[11px] leading-relaxed">Measure at the end of the day when your fingers are warm for best accuracy.</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/50 dark:border-white/5 dark:bg-white/2">
                        <table className="w-full text-center">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-white/5">
                                    <th className="py-3 text-[9px] font-bold tracking-widest text-gray-400 uppercase">Dia (mm)</th>
                                    <th className="py-3 text-[9px] font-bold tracking-widest text-gold uppercase">US</th>
                                    <th className="py-3 text-[9px] font-bold tracking-widest text-gray-400 uppercase">VN</th>
                                </tr>
                            </thead>
                            <tbody className="text-[12px]">
                                {RING_SIZES.map((size) => (
                                    <tr key={size.us} className="border-b border-gray-50 dark:border-white/2">
                                        <td className="py-3 text-gray-600 dark:text-gray-400">{size.diameter}</td>
                                        <td className="py-3 font-bold text-gold">{size.us}</td>
                                        <td className="py-3 text-gray-600 dark:text-gray-400">{size.vn}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Necklace Section */}
            {activeTab === "necklace" && (
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                     <div>
                        <h2 className="mb-6 font-serif text-2xl text-gray-900 dark:text-white">Necklace Guide</h2>
                        <div className="space-y-4">
                            {NECKLACE_SIZES.map((n) => (
                                <div key={n.name} className="flex items-center gap-4 rounded-xl border border-gray-50 p-4 transition-all hover:border-gold/20 dark:border-white/5 dark:hover:bg-white/5">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                                        <Ruler size={16} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-[13px] font-bold text-gray-900 dark:text-white">{n.name}</h4>
                                            <span className="text-[10px] font-bold text-gold">{n.length}</span>
                                        </div>
                                        <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">{n.pos}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative aspect-square overflow-hidden rounded-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1596944222042-498c56cc77b2?auto=format&fit=crop&q=80&w=800"
                            className="h-full w-full object-cover grayscale brightness-90"
                            alt="Necklace Guide"
                        />
                    </div>
                </div>
            )}

            {/* Bracelet Section */}
            {activeTab === "bracelet" && (
                 <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                     <div>
                        <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 dark:border-white/5 dark:bg-white/2">
                             <table className="w-full text-center">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-white/5">
                                        <th className="py-3 text-[9px] font-bold tracking-widest text-gray-400 uppercase text-left">Wrist</th>
                                        <th className="py-3 text-[9px] font-bold tracking-widest text-gold uppercase text-right">Size</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[12px]">
                                    {[
                                        { wrist: "14 - 15 cm", rec: "XS (16 cm)" },
                                        { wrist: "15 - 16 cm", rec: "S (17 cm)" },
                                        { wrist: "16 - 17 cm", rec: "M (18 cm)" },
                                        { wrist: "17 - 18 cm", rec: "L (19 cm)" },
                                    ].map((r) => (
                                        <tr key={r.wrist} className="border-b border-gray-50 dark:border-white/2">
                                            <td className="py-3 text-left text-gray-600 dark:text-gray-400">{r.wrist}</td>
                                            <td className="py-3 text-right font-bold text-gold">{r.rec}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                     </div>
                     <div>
                        <h2 className="mb-6 font-serif text-2xl text-gray-900 dark:text-white">Fit Guide</h2>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <Scale className="text-gold shrink-0" size={20} />
                                <div>
                                    <h4 className="text-[13px] font-bold text-gray-900 dark:text-white">Snug Fit</h4>
                                    <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">Add 1cm to measurement.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Sparkles className="text-gold shrink-0" size={20} />
                                <div>
                                    <h4 className="text-[13px] font-bold text-gray-900 dark:text-white">Comfort Fit</h4>
                                    <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">Add 2cm for recommended fit.</p>
                                </div>
                            </div>
                        </div>
                     </div>
                 </div>
            )}
        </div>
    );
};
