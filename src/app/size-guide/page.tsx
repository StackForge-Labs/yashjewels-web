"use client";

import { PageHero } from "../_components/PageHero";
import { Ruler, Sparkles, Scale, Info, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

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

export default function SizeGuidePage() {
    const [activeTab, setActiveTab] = useState("ring");

    return (
        <>
            <PageHero
                title="Size Guide"
                subtitle="Ensure the perfect fit for your precious jewelry with our comprehensive size guide and measurement tips."
                breadcrumbs={[{ label: "Size Guide" }]}
                backgroundImage="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2000"
            />

            <section className="bg-white py-12 md:py-24 transition-colors dark:bg-dark-bg">
                <div className="container mx-auto px-4 lg:px-12">
                    {/* Tabs */}
                    <div className="mx-auto mb-16 flex max-w-md justify-center gap-2 rounded-2xl border border-gray-100 p-1.5 dark:border-white/5 dark:bg-white/2">
                        {["ring", "necklace", "bracelet"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 rounded-xl py-3 text-xs font-bold tracking-widest uppercase transition-all ${
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
                        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
                            <div>
                                <h2 className="mb-8 font-serif text-3xl text-gray-900 dark:text-white">How to Measure Ring Size</h2>
                                <div className="space-y-8">
                                    {[
                                        { num: "01", title: "The Paper/String Method", desc: "Wrap a strip of paper or string around the base of your finger. Mark the point where the ends meet and measure the length in millimeters." },
                                        { num: "02", title: "Existing Ring Method", desc: "Select a ring that fits the desired finger. Measure the internal diameter of the ring using a millimeter ruler." },
                                        { num: "03", title: "Consider Knuckle Size", desc: "If your knuckle is significantly larger than the base of your finger, choose a size in between the two measurements." },
                                    ].map((step) => (
                                        <div key={step.num} className="flex gap-6">
                                            <span className="text-gold font-serif text-3xl font-light italic">{step.num}</span>
                                            <div>
                                                <h4 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">{step.title}</h4>
                                                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-12 rounded-2xl bg-amber-50 p-6 dark:bg-amber-900/10">
                                    <div className="flex gap-3 text-amber-700 dark:text-amber-400">
                                        <Info size={20} className="shrink-0" />
                                        <div>
                                            <p className="text-sm font-bold">Pro Tip</p>
                                            <p className="mt-1 text-xs leading-relaxed">Finger size changes based on temperature and time of day. For the most accurate result, measure at the end of the day when your fingers are warm.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-gray-50/50 p-8 dark:border-white/5 dark:bg-white/2">
                                <h3 className="mb-6 font-serif text-xl text-gray-900 dark:text-white">Ring Size Chart</h3>
                                <table className="w-full text-center">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-white/5">
                                            <th className="py-4 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Diameter (mm)</th>
                                            <th className="py-4 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Perimeter (mm)</th>
                                            <th className="py-4 text-[10px] font-bold tracking-widest text-gray-400 uppercase text-gold">US Size</th>
                                            <th className="py-4 text-[10px] font-bold tracking-widest text-gray-400 uppercase">VN Size</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {RING_SIZES.map((size) => (
                                            <tr key={size.us} className="border-b border-gray-50 dark:border-white/2">
                                                <td className="py-4 text-sm text-gray-600 dark:text-gray-400">{size.diameter}</td>
                                                <td className="py-4 text-sm text-gray-600 dark:text-gray-400">{size.perimeter}</td>
                                                <td className="py-4 text-sm font-bold text-gold">{size.us}</td>
                                                <td className="py-4 text-sm text-gray-600 dark:text-gray-400">{size.vn}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Necklace Section */}
                    {activeTab === "necklace" && (
                        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
                             <div>
                                <h2 className="mb-8 font-serif text-3xl text-gray-900 dark:text-white">Necklace Length Guide</h2>
                                <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">Choosing the right necklace length depends on your neck size, height, and the outfit you plan to wear.</p>
                                <div className="space-y-6">
                                    {NECKLACE_SIZES.map((n) => (
                                        <div key={n.name} className="group flex items-center gap-6 rounded-2xl border border-gray-50 p-6 transition-all hover:border-gold/20 hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/5">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                                                <Ruler size={18} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{n.name}</h4>
                                                    <span className="text-[10px] font-bold text-gold">{n.length}</span>
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{n.pos}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative aspect-4/5 overflow-hidden rounded-3xl">
                                <img
                                    src="https://images.unsplash.com/photo-1596944222042-498c56cc77b2?auto=format&fit=crop&q=80&w=800"
                                    className="h-full w-full object-cover grayscale brightness-90"
                                    alt="Necklace Guide Visual"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-8">
                                    <p className="text-white text-xs font-medium italic opacity-80">Reference guide for standard necklace lengths.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bracelet Section */}
                    {activeTab === "bracelet" && (
                         <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
                             <div className="order-2 lg:order-1">
                                <div className="rounded-3xl border border-gray-100 bg-gray-50/50 p-8 dark:border-white/5 dark:bg-white/2">
                                    <h3 className="mb-6 font-serif text-xl text-gray-900 dark:text-white">Bracelet Conversion</h3>
                                     <table className="w-full text-center">
                                        <thead>
                                            <tr className="border-b border-gray-100 dark:border-white/5">
                                                <th className="py-4 text-[10px] font-bold tracking-widest text-gray-400 uppercase text-left">Wrist Circumference</th>
                                                <th className="py-4 text-[10px] font-bold tracking-widest text-gray-400 uppercase text-right">Recommended Size</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { wrist: "14 - 15 cm", rec: "XS (16 cm)" },
                                                { wrist: "15 - 16 cm", rec: "S (17 cm)" },
                                                { wrist: "16 - 17 cm", rec: "M (18 cm)" },
                                                { wrist: "17 - 18 cm", rec: "L (19 cm)" },
                                                { wrist: "18 - 19 cm", rec: "XL (20 cm)" },
                                            ].map((r) => (
                                                <tr key={r.wrist} className="border-b border-gray-50 dark:border-white/2">
                                                    <td className="py-4 text-left text-gray-600 dark:text-gray-400">{r.wrist}</td>
                                                    <td className="py-4 text-right font-bold text-gold">{r.rec}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                             </div>
                             <div className="order-1 lg:order-2">
                                <h2 className="mb-8 font-serif text-3xl text-gray-900 dark:text-white">Bracelet Fit Guide</h2>
                                <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">Measure your wrist snugly using a tape measure just below the wrist bone, then add 1-2cm for a comfortable fit.</p>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <Scale className="text-gold shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Snug Fit</h4>
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Add 1cm to your wrist measurement. Ideal for delicate chains.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <Sparkles className="text-gold shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Comfort Fit</h4>
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Add 1.5 - 2cm to your wrist measurement. Most popular and recommended.</p>
                                        </div>
                                    </div>
                                </div>
                             </div>
                         </div>
                    )}

                    {/* Bottom Link */}
                    <div className="mt-24 rounded-3xl bg-gray-900 p-12 text-center md:p-20">
                        <h3 className="mb-4 font-serif text-3xl text-white">Still Unsure?</h3>
                        <p className="mb-8 text-gray-400">Book a private consultation at our boutique and our experts will help you find the perfect size.</p>
                        <Link href="/contact" className="bg-gold group inline-flex items-center gap-3 rounded-xl px-12 py-4 text-[12px] font-bold tracking-[0.3em] text-white uppercase transition-all hover:brightness-110">
                            Book a Consultation <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
