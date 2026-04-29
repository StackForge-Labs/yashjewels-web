import { ShieldCheck, Truck, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CartSummaryProps {
    total: string;
    itemCount: number;
    checkoutBlocked?: boolean;
    onCheckout?: () => void;
}

export const CartSummary = ({ total, itemCount, checkoutBlocked, onCheckout }: CartSummaryProps) => {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-white/5 dark:bg-white/2">
            <h3 className="mb-8 font-serif text-xl text-gray-900 dark:text-white">Order Summary</h3>

            <div className="space-y-6">
                <div className="flex items-baseline justify-between">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Estimated Total</span>
                        <span className="mt-1 text-xs text-gray-400 font-normal">For {itemCount} {itemCount > 1 ? 'items' : 'item'}</span>
                    </div>
                    <span className="text-2xl font-bold text-gold">{total}</span>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 dark:bg-white/5">
                    <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                        Shipping fees and taxes are not included yet. They will be calculated precisely during the checkout process based on your delivery address.
                    </p>
                </div>
            </div>

            {/* CTA */}
            {checkoutBlocked ? (
                <div className="mt-8 space-y-3">
                    <button
                        disabled
                        className="bg-gray-200 flex h-14 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase"
                    >
                        Checkout Temporarily Disabled
                    </button>
                </div>
            ) : (
                <button
                    onClick={onCheckout}
                    className="bg-gold group mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-xl text-[11px] font-bold tracking-[0.2em] text-white uppercase shadow-[0_15px_30px_rgba(202,162,71,0.2)] transition-all hover:brightness-105 active:scale-[0.98]"
                >
                    Proceed to Checkout
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
            )}

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-2 gap-3 border-t border-gray-100 pt-8 dark:border-white/5">
                <div className="flex flex-col items-center gap-2 text-center">
                    <ShieldCheck size={20} className="text-gold/80" />
                    <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">Secure Checkout</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                    <Truck size={20} className="text-gold/80" />
                    <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">Insured Delivery</span>
                </div>
            </div>
        </div>
    );
};
