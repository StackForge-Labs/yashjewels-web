"use client";

import { CartItem } from "./_components/CartItem";
import { CartSummary } from "./_components/CartSummary";
import { PageHero } from "../_components/PageHero";
import { ShoppingBag, ArrowRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/hooks/useCart";

export default function CartPage() {
    const { cart, fetchCart, updateQuantity, removeItem } = useCart();

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    if (cart.isLoading && cart.items.length === 0) {
        return (
            <>
                <PageHero title="Shopping Cart" breadcrumbs={[{ label: "Cart" }]} />
                <section className="bg-white py-24 transition-colors dark:bg-dark-bg">
                    <div className="container mx-auto flex items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gold mx-auto"></div>
                    </div>
                </section>
            </>
        );
    }

    if (cart.items.length === 0) {
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
                subtitle={`${cart.itemCount} item${cart.itemCount > 1 ? "s" : ""} in your treasure bag`}
                breadcrumbs={[{ label: "Cart" }]}
            />

            <section className="bg-white py-12 md:py-24 transition-colors dark:bg-dark-bg">
                <div className="container mx-auto px-4 lg:px-12">
                    {/* Global Price Warning Banner if any item drifted > 3% */}
                    {cart.hasPriceWarning && (
                        <div className="mb-8 flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200">
                            <AlertTriangle className="shrink-0 text-amber-500 mt-1" size={24} />
                            <div>
                                <h4 className="font-bold">Gold Price Fluctuation Alert</h4>
                                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                                    The global gold rate has changed since you added items to your cart.
                                    Prices have been automatically updated based on the real-time market value.
                                    {cart.checkoutBlocked && (
                                        <span className="block mt-2 font-bold text-red-600 dark:text-red-400">
                                            Some items have drifted by more than 10%. Please review the new prices before checkout.
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}

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
                                {cart.items.map((item) => (
                                    <CartItem
                                        key={item.cartItemId}
                                        id={item.cartItemId}
                                        name={item.productName}
                                        sku={item.styleCode}
                                        image={item.primaryImageUrl || "/images/placeholder-jewelry.png"}
                                        metal="Custom"
                                        stone="Diamond"
                                        price={formatCurrency(item.currentLiveMrp)}
                                        originalPrice={item.priceDriftPct > 0 ? formatCurrency(item.mrpAtAdd) : ""}
                                        quantity={item.quantity}
                                        maxQuantity={item.maxStockQuantity}
                                        priceChanged={Math.abs(item.priceDriftPct) > 3}
                                        onRemove={removeItem}
                                        onQuantityChange={updateQuantity}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-32">
                                <CartSummary
                                    subtotal={formatCurrency(cart.totalLiveMrp)}
                                    shipping="Free"
                                    tax={formatCurrency(cart.totalLiveMrp * 0.1)} // 10% VAT display mock (backend will calc actual)
                                    total={formatCurrency(cart.totalLiveMrp * 1.1)}
                                    itemCount={cart.itemCount}
                                    checkoutBlocked={cart.checkoutBlocked}
                                />
                                {cart.checkoutBlocked && (
                                    <p className="mt-4 text-center text-xs text-red-500 font-bold">
                                        Checkout is temporarily disabled due to extreme market fluctuation ({'>'}10%).
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
