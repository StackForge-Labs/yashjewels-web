"use client";

import { PageHero } from "../_components/PageHero";
import ProductCard from "../(home)/_components/ProductCard";
import { Heart, ArrowRight, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const MOCK_WISHLIST = [
    {
        sku: "NNU1544",
        productId: "NNU1544",
        name: "Mia Natural Diamond Ring in 14K White Gold",
        category: "Rings",
        original: "25,500,000 VND",
        sale: "21,675,000 VND",
        discount: "-15%",
        image1: "https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=600",
        image2: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=600",
        badge: "NEW ARRIVAL",
    },
    {
        sku: "NNU1545",
        productId: "NNU1545",
        name: "Artisan Solitaire Diamond Necklace",
        category: "Necklaces",
        original: "45,000,000 VND",
        sale: "38,250,000 VND",
        discount: "-15%",
        image1: "https://images.pexels.com/photos/1733604/pexels-photo-1733604.jpeg?auto=compress&cs=tinysrgb&w=600",
        image2: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        sku: "NNU1546",
        productId: "NNU1546",
        name: "Classic Tennis Bracelet with Natural Diamonds",
        category: "Bracelets",
        original: "89,000,000 VND",
        sale: "75,650,000 VND",
        discount: "-15%",
        image1: "https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=600",
        image2: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=600",
        badge: "BESTSELLER",
    },
    {
        sku: "NNU1547",
        productId: "NNU1547",
        name: "Floral Halo Diamond Earrings",
        category: "Earrings",
        original: "18,000,000 VND",
        sale: "15,300,000 VND",
        discount: "-15%",
        image1: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=600",
        image2: "https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
];

export default function WishlistPage() {
    const [items] = useState(MOCK_WISHLIST);

    if (items.length === 0) {
        return (
            <>
                <PageHero title="Wishlist" breadcrumbs={[{ label: "Wishlist" }]} />
                <section className="bg-white py-24 transition-colors dark:bg-dark-bg">
                    <div className="container mx-auto flex flex-col items-center px-4 py-16 text-center lg:px-12">
                        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
                            <Heart size={40} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <h2 className="mb-3 font-serif text-2xl text-gray-900 dark:text-white">Your Wishlist is Empty</h2>
                        <p className="mb-8 max-w-md text-sm text-gray-500 dark:text-gray-400">
                            Save your favorite pieces here and never miss out on the jewelry you love.
                        </p>
                        <Link
                            href="/collections"
                            className="bg-gold group flex items-center gap-3 rounded-xl px-10 py-4 text-[12px] font-bold tracking-[0.3em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-105"
                        >
                            Explore Collections <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <PageHero
                title="My Wishlist"
                subtitle={`${items.length} saved piece${items.length > 1 ? "s" : ""}`}
                breadcrumbs={[{ label: "Wishlist" }]}
            />

            <section className="bg-white py-12 md:py-24 transition-colors dark:bg-dark-bg">
                <div className="container mx-auto px-4 lg:px-12">
                    {/* Actions Bar */}
                    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <p className="text-[11px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                            {items.length} Items Saved
                        </p>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2.5 text-[11px] font-bold tracking-wider text-gray-600 uppercase transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5">
                                <Share2 size={14} /> Share List
                            </button>
                            <button className="bg-gold flex items-center gap-2 rounded-lg px-5 py-2.5 text-[11px] font-bold tracking-wider text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-105">
                                Add All to Cart
                            </button>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
                        {items.map((product) => (
                            <ProductCard key={product.sku} {...product} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
