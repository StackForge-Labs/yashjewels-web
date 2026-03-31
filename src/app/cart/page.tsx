"use client";

import { CartItem } from "./_components/CartItem";
import { CartSummary } from "./_components/CartSummary";
import { PageHero } from "../_components/PageHero";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const MOCK_CART = [
    {
        id: "1",
        name: "Mia Natural Diamond Heart Earrings in 14K White Gold",
        sku: "ERFNJ2504921",
        image: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=600",
        metal: "14K White Gold",
        stone: "Natural Diamond",
        price: "13,990,200 đ",
        originalPrice: "16,655,000 đ",
        quantity: 1,
        priceChanged: true,
    },
    {
        id: "2",
        name: "Classic Tennis Bracelet with Natural Diamonds",
        sku: "BRJ2504800",
        image: "https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=600",
        metal: "18K Yellow Gold",
        stone: "VVS Diamond",
        price: "75,650,000 đ",
        originalPrice: "89,000,000 đ",
        quantity: 1,
        priceChanged: false,
    },
    {
        id: "3",
        name: "Artisan Solitaire Diamond Necklace",
        sku: "NKJ2504555",
        image: "https://images.pexels.com/photos/1733604/pexels-photo-1733604.jpeg?auto=compress&cs=tinysrgb&w=600",
        metal: "Platinum 950",
        stone: "GIA Diamond",
        price: "38,250,000 đ",
        originalPrice: "45,000,000 đ",
        quantity: 1,
        priceChanged: false,
    },
];

export default function CartPage() {
    const [items, setItems] = useState(MOCK_CART);

    const handleRemove = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
    };

    if (items.length === 0) {
        return (
            <>
                <PageHero title="Shopping Cart" breadcrumbs={[{ label: "Cart" }]} />
                <section className="bg-white py-24 transition-colors dark:bg-dark-bg">
                    <div className="container mx-auto flex flex-col items-center px-4 py-16 text-center lg:px-12">
                        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
                            <ShoppingBag size={40} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <h2 className="mb-3 font-serif text-2xl text-gray-900 dark:text-white">Your Cart is Empty</h2>
                        <p className="mb-8 max-w-md text-sm text-gray-500 dark:text-gray-400">
                            Discover our exquisite collection of handcrafted jewelry and find the perfect piece for you.
                        </p>
                        <Link
                            href="/collections"
                            className="bg-gold group flex h-14 items-center gap-3 rounded-xl px-10 text-[12px] font-bold tracking-[0.3em] text-white uppercase shadow-[0_20px_40px_rgba(202,162,71,0.25)] transition-all hover:brightness-105"
                        >
                            Browse Collections
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <PageHero
                title="Shopping Cart"
                subtitle={`${items.length} item${items.length > 1 ? "s" : ""} in your treasure bag`}
                breadcrumbs={[{ label: "Cart" }]}
            />

            <section className="bg-white py-12 md:py-24 transition-colors dark:bg-dark-bg">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                        {/* Items List */}
                        <div className="lg:col-span-8">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-[11px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                                    Your Items
                                </h2>
                                <Link href="/collections" className="hover:text-gold flex items-center gap-2 text-[11px] font-bold tracking-wider text-gray-500 uppercase transition-colors">
                                    Continue Shopping <ArrowRight size={12} />
                                </Link>
                            </div>

                            <div>
                                {items.map((item) => (
                                    <CartItem key={item.id} {...item} onRemove={handleRemove} />
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-32">
                                <CartSummary
                                    subtotal="127,890,200 đ"
                                    shipping="Free"
                                    tax="12,789,020 đ"
                                    total="140,679,220 đ"
                                    itemCount={items.length}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
