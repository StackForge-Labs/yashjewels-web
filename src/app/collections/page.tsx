"use client";

import { useState, useEffect } from "react";
import { PageHero } from "../_components/PageHero";
import { ArrowRight, Sparkles, Gem, Heart, Crown, Stars } from "lucide-react";
import Link from "next/link";
import { categoryService } from "@/services/category.service";
import { Category } from "@/types/category.types";

const ICONS = [Crown, Gem, Sparkles, Heart, Stars];

export default function CollectionsIndexPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await categoryService.getAll();
            // Filter out root/active categories or just show all
            setCategories(data.filter(c => c.isActive && !c.parentId));
            setLoading(false);
        };
        fetchCategories();
    }, []);

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
                        {loading && <span className="text-gray-500">Loading classifications...</span>}
                        {!loading && categories.map((cat) => (
                            <button
                                key={cat.id}
                                className="rounded-full border border-gray-100 px-6 py-2.5 text-xs font-bold tracking-widest uppercase transition-all hover:border-gold hover:text-gold dark:border-white/5 text-gray-400"
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-12 md:space-y-20">
                        {categories.map((c, i) => {
                            const Icon = ICONS[i % ICONS.length];
                            // Temporary fallback imagery as categories dont have hardcoded images in DB yet
                            const fallbackImages = [
                                "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=1200",
                                "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1200",
                                "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200",
                                "https://images.unsplash.com/photo-1599643478518-a7b4e5bb0508?auto=format&fit=crop&q=80&w=1200",
                                "https://images.unsplash.com/photo-1596944222042-498c56cc77b2?auto=format&fit=crop&q=80&w=1200"
                            ];
                            const image = c.iconUrl || fallbackImages[i % fallbackImages.length];

                            return (
                                <div
                                    key={c.id}
                                    className={`group flex flex-col gap-8 md:gap-16 ${
                                        i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                                    } items-center`}
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-video w-full overflow-hidden rounded-3xl md:w-1/2 lg:aspect-3/2">
                                        <img
                                            src={image}
                                            alt={c.name}
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
                                                <Icon size={22} />
                                            </div>
                                            <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                                                Explore Collection
                                            </span>
                                        </div>
                                        <h2 className="font-serif text-3xl md:text-5xl text-gray-900 dark:text-white">
                                            {c.name}
                                        </h2>
                                        <p className="text-sm leading-relaxed text-gray-500 md:text-base dark:text-gray-400">
                                            {/* DB currently doesn't store descriptions for categories, filling standard text */}
                                            Discover our exclusive range of {c.name.toLowerCase()} expertly crafted by our Master Artisans.
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
                            );
                        })}
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
