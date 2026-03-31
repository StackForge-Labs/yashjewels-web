import { PageHero } from "../_components/PageHero";
import { Gem, Users, Award, Clock, ArrowRight, Heart, Target, Sparkles, Globe } from "lucide-react";
import Link from "next/link";

const STATS = [
    { number: "20+", label: "Years of Excellence", icon: Clock },
    { number: "10K+", label: "Pieces Crafted", icon: Gem },
    { number: "5K+", label: "Happy Clients", icon: Users },
    { number: "50+", label: "Awards Won", icon: Award },
];

const PROCESS = [
    { step: "01", title: "Design", desc: "Our artisans sketch every piece by hand, ensuring each design is unique and tells a story." },
    { step: "02", title: "Source", desc: "We source only ethically mined, GIA-certified diamonds and precious stones from trusted global partners." },
    { step: "03", title: "Craft", desc: "Master jewelers with 20+ years of experience bring the design to life using traditional techniques." },
    { step: "04", title: "Polish", desc: "Multiple rounds of quality inspection and hand-polishing ensure every facet meets our exacting standards." },
    { step: "05", title: "Certify", desc: "Each piece receives a certificate of authenticity, hallmark verification, and detailed appraisal report." },
];

const VALUES = [
    { icon: Heart, title: "Passion", desc: "Every piece carries the dedication and love of our master artisans." },
    { icon: Target, title: "Precision", desc: "We measure in microns, not millimeters. Perfection is our baseline." },
    { icon: Sparkles, title: "Innovation", desc: "Blending ancient craftsmanship techniques with modern technology." },
    { icon: Globe, title: "Sustainability", desc: "Ethically sourced materials and responsible business practices." },
];

export default function AboutPage() {
    return (
        <>
            <PageHero
                title="Our Story"
                subtitle="Crafting timeless beauty since 2005. Every piece tells a story of passion and skill."
                breadcrumbs={[{ label: "About" }]}
            />

            <section className="bg-white py-12 md:py-24 transition-colors dark:bg-dark-bg">
                <div className="container mx-auto px-4 lg:px-12">
                    {/* Story */}
                    <div className="mb-24 grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
                        <div>
                            <span className="text-gold mb-4 block text-[10px] font-bold tracking-[0.3em] uppercase">Our Story</span>
                            <h2 className="mb-6 font-serif text-3xl md:text-4xl text-gray-900 dark:text-white">Where Brilliance Meets Artistry</h2>
                            <div className="space-y-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                <p>
                                    Founded in 2005 by Robert D&apos;Costa, Yash Jewels was born from a simple conviction: every diamond deserves to be set
                                    in a masterpiece, and every person deserves to wear one.
                                </p>
                                <p>
                                    What began as a small atelier in the heart of the diamond district has grown into a recognized name in high jewelry.
                                    Our team of 30+ master artisans, gemologists, and designers work together to create pieces that transcend trends.
                                </p>
                                <p>
                                    Each Yash Jewels creation undergoes 200+ hours of meticulous craftsmanship — from initial sketch to the final polish —
                                    ensuring that the piece you hold is truly one of a kind.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-4/5 overflow-hidden rounded-2xl shadow-2xl">
                                <img
                                    src="https://images.pexels.com/photos/3641056/pexels-photo-3641056.jpeg?auto=compress&cs=tinysrgb&w=800"
                                    alt="Yash Jewels Atelier"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 rounded-xl bg-gold p-5 text-white shadow-xl md:-bottom-8 md:-left-8">
                                <p className="text-3xl font-bold">20+</p>
                                <p className="text-[10px] font-bold tracking-widest uppercase">Years of Excellence</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mb-24 grid grid-cols-2 gap-6 md:grid-cols-4">
                        {STATS.map((stat) => (
                            <div key={stat.label} className="group rounded-2xl border border-gray-100 p-6 text-center transition-all hover:border-gold/20 hover:shadow-lg dark:border-white/5">
                                <stat.icon size={24} className="mx-auto mb-3 text-gold" />
                                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stat.number}</p>
                                <p className="mt-1 text-xs font-medium text-gray-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Values */}
                    <div className="mb-24">
                        <div className="mb-12 text-center">
                            <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.3em] uppercase">Philosophy</span>
                            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white">Our Values</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {VALUES.map((v) => (
                                <div key={v.title} className="group rounded-2xl border border-gray-100 p-8 text-center transition-all hover:border-gold/20 hover:shadow-xl dark:border-white/5">
                                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 transition-transform group-hover:scale-110">
                                        <v.icon size={24} className="text-gold" />
                                    </div>
                                    <h3 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">{v.title}</h3>
                                    <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Craftsmanship Process */}
                    <div className="mb-24">
                        <div className="mb-12 text-center">
                            <span className="text-gold mb-3 block text-[10px] font-bold tracking-[0.3em] uppercase">Behind the Scenes</span>
                            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white">Our Process</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                            {PROCESS.map((p) => (
                                <div key={p.step} className="group text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-200 transition-colors group-hover:border-gold dark:border-white/10">
                                        <span className="text-gold text-xl font-light italic">{p.step}</span>
                                    </div>
                                    <h4 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">{p.title}</h4>
                                    <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{p.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="rounded-2xl bg-gray-50 p-8 text-center md:p-16 dark:bg-white/2">
                        <h3 className="mb-4 font-serif text-2xl text-gray-900 dark:text-white">Visit Our Store</h3>
                        <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">Experience our high jewelry in person at our boutique.</p>
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                            <Link href="/contact" className="bg-gold group inline-flex items-center justify-center gap-3 rounded-xl px-10 py-4 text-[12px] font-bold tracking-[0.3em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-105">
                                Book an Appointment <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link href="/careers" className="inline-flex items-center justify-center gap-3 rounded-xl border border-gray-200 px-10 py-4 text-[12px] font-bold tracking-[0.3em] text-gray-700 uppercase transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5">
                                Join Our Team
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
