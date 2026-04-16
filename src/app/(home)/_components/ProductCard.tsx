"use client";
import React from "react";
import { Heart, ShoppingCart, ShoppingBag, Zap } from "lucide-react";
import { useMrpPrice } from "@/hooks/useMrpPrice";

interface ProductCardProps {
    /** Static display data — always required */
    sku: string;
    name: string;
    category: string;
    image1: string;
    image2: string;
    badge?: string;
    className?: string;

    /**
     * If productId is provided, the card will fetch the live MRP from PricingService
     * and display it instead of static price props.
     */
    productId?: string;

    /** Static price fallback — shown when productId is not provided */
    original?: string;
    sale?: string;
    discount?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
    sku,
    name,
    category,
    image1,
    image2,
    badge,
    className = "",
    productId,
    original,
    sale,
    discount,
}) => {
    const { mrpFormatted, isLoading, breakdown } = useMrpPrice(productId);

    const isDynamic = Boolean(productId);
    const displayPrice = isDynamic ? mrpFormatted : sale;
    const displayOriginal = isDynamic ? null : original; // hide crossed-out when dynamic

    return (
        <div className={`group flex cursor-pointer flex-col ${className}`}>
            {/* Image Wrapper */}
            <div className="relative mb-5 aspect-4/5 w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 transition-shadow duration-500 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:border-white/5 dark:bg-[#111] dark:group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                {/* Images */}
                <img
                    src={image1}
                    alt={name}
                    className="absolute inset-0 h-full w-full scale-100 object-cover opacity-100 transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:opacity-0"
                    loading="lazy"
                />
                <img
                    src={image2}
                    alt={`${name} alternate`}
                    className="absolute inset-0 h-full w-full scale-110 object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:scale-100 group-hover:opacity-100"
                    loading="lazy"
                />

                {/* Badge */}
                {badge && (
                    <div className="absolute top-4 left-4 flex items-center gap-1 rounded-[4px] bg-black/80 px-3 py-1.5 text-white shadow-sm backdrop-blur-md dark:bg-white/90 dark:text-black">
                        <span className="text-gold text-[10px] font-bold tracking-widest uppercase">{badge}</span>
                    </div>
                )}

                {/* Live MRP badge — only when dynamic pricing is active */}
                {isDynamic && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 rounded-[4px] bg-white/90 px-2 py-1 backdrop-blur-md dark:bg-black/80">
                        <Zap
                            size={9}
                            className={`stroke-[2.5] transition-colors ${
                                isLoading ? "text-gray-300" : "text-emerald-500"
                            }`}
                        />
                        <span className="text-[8px] font-bold tracking-[0.15em] text-gray-500 uppercase dark:text-gray-400">
                            Live Price
                        </span>
                    </div>
                )}

                {/* Wishlist (if no productId badge at top-right) */}
                {!isDynamic && (
                    <div
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="absolute top-4 right-4 z-30 transform rounded-full bg-white/90 p-2 text-gray-400 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:scale-110 hover:text-red-500 dark:bg-black/80 dark:text-gray-500 dark:hover:text-red-500"
                    >
                        <Heart size={16} />
                    </div>
                )}

                {/* Quick Action Overlay */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-6 left-1/2 z-30 flex w-full -translate-x-1/2 translate-y-4 justify-center gap-3 px-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="hover:bg-gold flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-white text-xs font-bold tracking-widest text-gray-900 uppercase shadow-lg transition-colors hover:text-white dark:bg-[#222] dark:text-white"
                    >
                        <ShoppingCart size={14} /> Add to Cart
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg transition-colors hover:bg-gray-100 dark:bg-[#222] dark:text-white dark:hover:bg-gray-800"
                    >
                        <ShoppingBag size={14} />
                    </button>
                </div>
            </div>

            {/* Info Area */}
            <div className="relative px-2 text-center transition-transform duration-300 group-hover:-translate-y-1">
                <h3 className="group-hover:text-gold mb-1.5 line-clamp-2 text-[14px] font-medium text-gray-800 transition-colors duration-300 md:text-base dark:text-gray-200">
                    {name}
                </h3>
                <p className="mb-3 text-[11px] font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                    {category}
                </p>

                {/* Price Display */}
                <div className="mb-1.5 flex items-center justify-center gap-3">
                    {displayOriginal && (
                        <span className="text-[13px] text-gray-400 line-through decoration-gray-300 dark:text-gray-500 dark:decoration-gray-600">
                            {displayOriginal}
                        </span>
                    )}

                    {isLoading && isDynamic ? (
                        /* Skeleton while fetching */
                        <span className="inline-block h-5 w-28 animate-pulse rounded-sm bg-gold/20" />
                    ) : (
                        <span className="text-gold-dark dark:text-gold-light text-[18px] font-bold">
                            {displayPrice ?? "—"}
                        </span>
                    )}
                </div>

                {/* Sub-line: VIP discount OR live gold rate note */}
                {isDynamic ? (
                    breakdown && (
                        <p className="text-[9px] font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                            Gold {(breakdown.breakdown.goldRatePerGram / 1000).toFixed(0)}K ₫/g · VAT incl.
                        </p>
                    )
                ) : (
                    discount && (
                        <p className="border-gold text-gold mx-auto mt-3 w-max border-b border-dashed pb-0.5 text-[10px] font-bold tracking-widest uppercase">
                            VIP Price {discount} Off
                        </p>
                    )
                )}
            </div>
        </div>
    );
};

export default ProductCard;
