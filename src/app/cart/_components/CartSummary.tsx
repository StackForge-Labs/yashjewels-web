import { ShieldCheck, Truck, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CartSummaryProps {
    subtotal: string;
    shipping: string;
    tax: string;
    total: string;
    itemCount: number;
    checkoutBlocked?: boolean;
}

export const CartSummary = ({ subtotal, shipping, tax, total, itemCount, checkoutBlocked }: CartSummaryProps) => {
    return (
        <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 md:p-8 dark:border-white/5 dark:bg-white/2">
            <h3 className="mb-6 font-serif text-lg text-gray-900 dark:text-white">Order Summary</h3>

            {/* Coupon Input */}
            <div className="mb-6 flex gap-2">
                <div className="relative flex-1">
                    <Tag size={14} className="text-gold absolute top-1/2 left-3 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Coupon code"
                        className="w-full rounded-lg border border-gray-200 bg-white py-3 pr-4 pl-9 text-sm outline-none transition-colors focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                </div>
                <button className="rounded-lg bg-gray-900 px-5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200">
                    Apply
                </button>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4 border-t border-gray-100 pt-6 dark:border-white/5">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-medium text-gray-900 dark:text-white">{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Shipping Estimate</span>
                    <span className="font-medium text-gray-900 dark:text-white">{shipping}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Tax (VAT 10%)</span>
                    <span className="font-medium text-gray-900 dark:text-white">{tax}</span>
                </div>
            </div>

            {/* Total */}
            <div className="mt-6 flex justify-between border-t border-gray-100 pt-6 dark:border-white/5">
                <span className="text-sm font-bold tracking-wider text-gray-900 uppercase dark:text-white">Total</span>
                <span className="text-gold text-xl font-bold">{total}</span>
            </div>

            {/* CTA */}
            {checkoutBlocked ? (
                <button
                    disabled
                    className="bg-gray-400 mt-6 flex h-14 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl text-[12px] font-bold tracking-[0.3em] text-white uppercase"
                >
                    Checkout Disabled
                </button>
            ) : (
                <Link
                    href="/checkout"
                    className="bg-gold group mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-xl text-[12px] font-bold tracking-[0.3em] text-white uppercase shadow-[0_20px_40px_rgba(202,162,71,0.25)] transition-all hover:brightness-105 active:scale-[0.98]"
                >
                    Proceed to Checkout
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
            )}

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2.5 dark:border-white/5">
                    <ShieldCheck size={16} className="text-gold shrink-0" />
                    <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2.5 dark:border-white/5">
                    <Truck size={16} className="text-gold shrink-0" />
                    <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">Insured Shipping</span>
                </div>
            </div>
        </div>
    );
};
