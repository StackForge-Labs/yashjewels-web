"use client";

import { PageHero } from "../_components/PageHero";
import { useState } from "react";
import { Gem, Sparkles, Eye, Scale, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

const CRITERIA = [
    {
        id: "cut",
        icon: Sparkles,
        title: "Cut",
        subtitle: "The most important factor",
        description: "Cut determines how brilliantly a diamond reflects light. A well-cut diamond captures and returns light to the eye with maximum fire and scintillation.",
        grades: ["Ideal", "Excellent", "Very Good", "Good", "Fair"],
        tip: "We recommend Excellent or Ideal cut for maximum brilliance. This has the greatest impact on a diamond's appearance.",
    },
    {
        id: "color",
        icon: Eye,
        title: "Color",
        subtitle: "From colorless to light yellow",
        description: "Diamond color is graded from D (completely colorless) to Z (light yellow). Colorless diamonds allow more light to pass through, creating more sparkle.",
        grades: ["D-F Colorless", "G-H Near Colorless", "I-J Faint", "K-M Light", "N-Z Very Light"],
        tip: "G-H diamonds offer the best value — they appear colorless to the naked eye but cost significantly less than D-F.",
    },
    {
        id: "clarity",
        icon: Gem,
        title: "Clarity",
        subtitle: "Internal perfection",
        description: "Clarity measures the presence of inclusions (internal) and blemishes (external). Most imperfections are microscopic and don't affect beauty.",
        grades: ["FL/IF Flawless", "VVS1/VVS2", "VS1/VS2", "SI1/SI2", "I1/I2/I3"],
        tip: "VS2 and SI1 are the sweet spot — inclusions are invisible to the naked eye, offering excellent value.",
    },
    {
        id: "carat",
        icon: Scale,
        title: "Carat",
        subtitle: "Weight, not size",
        description: "Carat refers to the weight of a diamond, not its size. Two diamonds of equal carat weight can appear different sizes depending on how they're cut.",
        grades: ["0.3-0.5ct", "0.5-1.0ct", "1.0-1.5ct", "1.5-2.0ct", "2.0ct+"],
        tip: "Consider 0.9ct or 1.9ct instead of round numbers — they look nearly identical but can be 15-20% less expensive.",
    },
];

const SHAPES = [
    { name: "Round Brilliant", desc: "Maximum sparkle, most popular", popularity: "75%" },
    { name: "Princess", desc: "Modern square with brilliant fire", popularity: "12%" },
    { name: "Emerald", desc: "Elegant step-cut, hall of mirrors effect", popularity: "5%" },
    { name: "Oval", desc: "Elongated brilliance, appears larger", popularity: "4%" },
    { name: "Pear", desc: "Teardrop shape, unique and feminine", popularity: "2%" },
    { name: "Cushion", desc: "Soft rounded corners, vintage charm", popularity: "2%" },
];

export default function DiamondGuidePage() {
    const [active, setActive] = useState("cut");
    const activeCriteria = CRITERIA.find((c) => c.id === active)!;

    return (
        <>
            <PageHero
                title="Diamond Guide"
                subtitle="Learn the 4C's of diamond quality and make an informed purchase with confidence."
                breadcrumbs={[{ label: "Diamond Guide" }]}
            />

            <section className="bg-white py-12 md:py-24 transition-colors dark:bg-dark-bg">
                <div className="container mx-auto px-4 lg:px-12">
                    {/* The 4C's */}
                    <div className="mb-20">
                        <div className="mb-10 text-center">
                            <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.3em] uppercase">Education</span>
                            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white">The 4C&apos;s of Diamonds</h2>
                        </div>

                        {/* Tabs */}
                        <div className="mx-auto mb-10 flex max-w-2xl flex-wrap justify-center gap-2 md:gap-4">
                            {CRITERIA.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => setActive(c.id)}
                                    className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold tracking-wider uppercase transition-all ${
                                        active === c.id
                                            ? "bg-gold text-white shadow-lg shadow-gold/20"
                                            : "border border-gray-200 text-gray-600 hover:border-gold/30 dark:border-white/10 dark:text-gray-400"
                                    }`}
                                >
                                    <c.icon size={16} /> {c.title}
                                </button>
                            ))}
                        </div>

                        {/* Active Content */}
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div>
                                <h3 className="mb-2 font-serif text-2xl text-gray-900 dark:text-white">{activeCriteria.title}</h3>
                                <p className="text-gold mb-4 text-[11px] font-bold tracking-widest uppercase">{activeCriteria.subtitle}</p>
                                <p className="mb-6 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{activeCriteria.description}</p>

                                {/* Grades Scale */}
                                <div className="space-y-3">
                                    {activeCriteria.grades.map((grade, i) => (
                                        <div key={grade} className="flex items-center gap-3">
                                            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
                                                <div className="h-full rounded-full bg-gradient-to-r from-gold to-amber-300" style={{ width: `${100 - i * 20}%` }} />
                                            </div>
                                            <span className="w-32 text-right text-xs font-medium text-gray-700 dark:text-gray-300">{grade}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col justify-center">
                                <div className="rounded-2xl border border-gold/10 bg-gold/5 p-6 md:p-8">
                                    <div className="mb-3 flex items-center gap-2">
                                        <Award size={18} className="text-gold" />
                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">Expert Tip</h4>
                                    </div>
                                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{activeCriteria.tip}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Diamond Shapes */}
                    <div className="mb-20">
                        <div className="mb-10 text-center">
                            <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.3em] uppercase">Shapes</span>
                            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white">Diamond Shapes</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                            {SHAPES.map((shape) => (
                                <div key={shape.name} className="group cursor-pointer rounded-2xl border border-gray-100 p-5 text-center transition-all hover:border-gold/20 hover:shadow-lg dark:border-white/5">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gold/10 dark:bg-white/5">
                                        <Gem size={24} className="text-gray-400 transition-colors group-hover:text-gold" />
                                    </div>
                                    <h4 className="mb-1 text-xs font-bold text-gray-900 dark:text-white">{shape.name}</h4>
                                    <p className="text-[10px] text-gray-400">{shape.desc}</p>
                                    <p className="text-gold mt-2 text-sm font-bold">{shape.popularity}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Certifications */}
                    <div className="mb-16">
                        <div className="mb-10 text-center">
                            <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.3em] uppercase">Trust</span>
                            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white">Certifications</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {[
                                { name: "GIA", full: "Gemological Institute of America", desc: "The world's most trusted diamond grading laboratory. All GIA reports include a unique identification number, 4C assessment, and a plot diagram of inclusions." },
                                { name: "IGI", full: "International Gemological Institute", desc: "Another globally recognized gemological laboratory. IGI provides detailed reports on natural and lab-grown diamonds with comparable accuracy." },
                            ].map((cert) => (
                                <div key={cert.name} className="rounded-2xl border border-gray-100 p-8 dark:border-white/5">
                                    <div className="mb-4 flex items-center gap-4">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                                            <span className="text-gold text-lg font-bold">{cert.name}</span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">{cert.name}</h4>
                                            <p className="text-xs text-gray-400">{cert.full}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{cert.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <Link href="/collections" className="bg-gold group inline-flex items-center gap-3 rounded-xl px-10 py-4 text-[12px] font-bold tracking-[0.3em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-105">
                            Explore Our Diamonds <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
