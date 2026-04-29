"use client";

import { useEffect } from "react";
import { PageHero } from "../_components/PageHero";
import { Heart, ArrowRight, Share2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import ProductCard from "@/app/(home)/_components/ProductCard";

export default function WishlistPage() {
    const { items, isLoading, loadWishlist, toggle } = useWishlist();
    const { addToCart } = useCart();

    useEffect(() => {
        loadWishlist();
    }, []);

    const handleAddAllToCart = async () => {
        if (items.length === 0) return;
        let added = 0;
        for (const item of items) {
            const ok = await addToCart(item.productId);
            if (ok) added++;
        }
        if (added > 0) toast.success(`Added ${added} items to cart.`);
    };

    if (isLoading) {
        return (
            <>
                <PageHero title="My Wishlist" breadcrumbs={[{ label: "Wishlist" }]} />
                <section className="bg-white py-24 transition-colors dark:bg-dark-bg">
                    <div className="container mx-auto flex flex-col items-center px-4 py-16 text-center lg:px-12">
                        <Loader2 size={40} className="animate-spin text-gold" />
                    </div>
                </section>
            </>
        );
    }

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
                            <button
                                onClick={handleAddAllToCart}
                                className="bg-gold flex items-center gap-2 rounded-lg px-5 py-2.5 text-[11px] font-bold tracking-wider text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-105"
                            >
                                Add All to Cart
                            </button>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
                        {items.map((item) => (
                            <Link key={item.wishlistItemId} href={`/products/${item.slug}`}>
                                <ProductCard
                                    sku={item.productId}
                                    productId={item.productId}
                                    name={item.productName}
                                    category={item.categoryName ?? ""}
                                    image1={item.primaryImageUrl ?? "/placeholder.jpg"}
                                    image2={item.primaryImageUrl ?? "/placeholder.jpg"}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
