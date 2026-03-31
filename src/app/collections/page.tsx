"use client";

import { PageHero } from "../_components/PageHero";
import { ArrowRight, Sparkles, Gem, Heart, Crown, Stars } from "lucide-react";
import Link from "next/link";

const COLLECTIONS = [
    {
        title: "The Imperial",
        description: "Regal designs inspired by royal heritage, featuring large-carat GIA certified diamonds.",
        image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=1200",
        slug: "the-imperial",
        count: "24 Pieces",
        icon: Crown
    },
    {
        title: "Aura Solitaire",
        description: "Classic elegance distilled. Single-stone masterpieces that let the diamond's fire shine brightest.",
        image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1200",
        slug: "aura-solitaire",
        count: "18 Pieces",
        icon: Gem
    },
    {
        title: "Modern Essentials",
        description: "Contemporary lines and geometric shapes for the modern woman's everyday luxury.",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200",
        slug: "modern-essentials",
        count: "32 Pieces",
        icon: Sparkles
    },
    {
        title: "Bridal Edit",
        description: "A curation of tokens of love, from engagement rings to necklaces for your special day.",
        image: "https://images.unsplash.com/photo-1599643478518-a7b4e5bb0508?auto=format&fit=crop&q=80&w=1200",
        slug: "bridal-edit",
        count: "45 Pieces",
        icon: Heart
    },
    {
        title: "Everyday Elegance",
        description: "Subtle brilliance for every moment, featuring micro-set diamonds in 18K gold variants.",
        image: "https://images.unsplash.com/photo-1596944222042-498c56cc77b2?auto=format&fit=crop&q=80&w=1200",
        slug: "everyday-elegance",
        count: "50+ Pieces",
        icon: Stars
    }
];

export default function CollectionsIndexPage() {
    return (
        <>
            <PageHero
                title="Our Collections"
                subtitle="Explore our curated collections of high jewelry, each designed with a unique character and soul."
                breadcrumbs={[{ label: "Collections" }]}
                backgroundImage="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2000"
            />

            <section className="bg-white py-12 md:py-24 transition-colors dark:bg-dark-bg">
                <div className="container mx-auto px-4 lg:px-12">
                    {/* Filter/Tags Header */}
                    <div className="mb-16 flex flex-wrap justify-center gap-4">
                        {["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Bespoke"].map((tag) => (
                            <button
                                key={tag}
                                className={`rounded-full border border-gray-100 px-6 py-2.5 text-xs font-bold tracking-widest uppercase transition-all hover:border-gold hover:text-gold dark:border-white/5 ${
                                    tag === "All" ? "border-gold bg-gold text-white" : "text-gray-400"
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-12 md:space-y-20">
                        {COLLECTIONS.map((c, i) => (
                            <div
                                key={c.slug}
                                className={`group flex flex-col gap-8 md:gap-16 ${
                                    i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                                } items-center`}
                            >
                                {/* Image Container */}
                                <div className="relative aspect-video w-full overflow-hidden rounded-3xl md:w-1/2 lg:aspect-3/2">
                                    <img
                                        src={c.image}
                                        alt={c.title}
                                        className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                                    <Link
                                        href={`/collections/${c.slug}`}
                                        className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                                    />
                                </div>

                                {/* Content Container */}
                                <div className="space-y-6 md:w-1/2 md:pr-12 md:group-odd:pr-0 md:group-odd:pl-12">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                                            <c.icon size={22} />
                                        </div>
                                        <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                                            {c.count} Available
                                        </span>
                                    </div>
                                    <h2 className="font-serif text-3xl md:text-5xl text-gray-900 dark:text-white">
                                        {c.title}
                                    </h2>
                                    <p className="text-sm leading-relaxed text-gray-500 md:text-base dark:text-gray-400">
                                        {c.description}
                                    </p>
                                    <div className="pt-4">
                                        <Link
                                            href={`/collections/${c.slug}`}
                                            className="bg-gold group inline-flex items-center gap-3 rounded-xl px-10 py-4 text-[12px] font-bold tracking-[0.3em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-110 active:scale-[0.98]"
                                        >
                                            View Collection
                                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom CTA for Bespoke Service */}
                    <div className="mt-24 rounded-3xl border border-gray-100 bg-gray-50/50 p-12 text-center md:mt-32 md:p-24 dark:border-white/5 dark:bg-white/2">
                        <span className="text-gold mb-4 block text-[10px] font-bold tracking-[0.4em] uppercase">
                            Unique Pieces
                        </span>
                        <h3 className="mb-6 font-serif text-3xl md:text-5xl text-gray-900 dark:text-white">
                            Cannot find what you are looking for?
                        </h3>
                        <p className="mx-auto mb-10 max-w-2xl text-sm leading-relaxed text-gray-500 md:text-base dark:text-gray-400">
                            Our master artisans can bring your vision to life. From initial sketch to the final polish, our bespoke service ensures your dream piece becomes a reality.
                        </p>
                        <Link
                            href="/contact"
                            className="bg-gold group inline-flex items-center gap-3 rounded-xl px-12 py-4 text-[12px] font-bold tracking-[0.3em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-110"
                        >
                            Explore Bespoke Design
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
