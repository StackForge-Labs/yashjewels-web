"use client";
import React from "react";
import { Heart, ShoppingCart, ShoppingBag, Zap, Loader2 } from "lucide-react";
import { useMrpPrice } from "@/hooks/useMrpPrice";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

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

    /** Availability state */
    quantity?: number;
    status?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
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
    quantity,
    status
}) => {
    const { mrpFormatted, isLoading, breakdown } = useMrpPrice(productId);
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    // Get real-time overrides from Redux
    const realtimeData = useSelector((state: RootState) => 
        productId ? state.productRealtime.overrides[productId] : null
    );

    // Use override if available, otherwise fallback to props
    const effectiveQuantity = realtimeData?.quantity !== undefined ? realtimeData.quantity : quantity;
    const effectiveStatus = realtimeData?.status !== undefined ? realtimeData.status : status;
    // isLocked = đang bị người khác giữ chỗ trong checkout (khác với qty=1 nhưng sẵn sàng bán)
    const effectiveIsLocked = realtimeData?.isLocked === true;

    const isOutOfStock = effectiveQuantity === 0 || effectiveStatus === "SOLD_OUT";
    const isReserved = effectiveIsLocked; // Chỉ hiện 'Giữ chỗ' khi có lock thực sự, không dựa vào quantity

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!productId || isAdding || isOutOfStock) return;
        
        setIsAdding(true);
        await addToCart(productId);
        setIsAdding(false);
    };

    const isDynamic = Boolean(productId);
    const displayPrice = isDynamic ? mrpFormatted : sale;
    const displayOriginal = isDynamic ? null : original; // hide crossed-out when dynamic

    return (
        <div className={`group flex cursor-pointer flex-col ${className} ${isOutOfStock ? "pointer-events-none opacity-80" : ""}`}>
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

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                    {badge && !isOutOfStock && !isReserved && (
                        <div className="flex items-center gap-1 rounded-[4px] bg-black/80 px-3 py-1.5 text-white shadow-sm backdrop-blur-md dark:bg-white/90 dark:text-black">
                            <span className="text-gold text-[10px] font-bold tracking-widest uppercase">{badge}</span>
                        </div>
                    )}

                    {isReserved && !isOutOfStock && (
                        <div className="flex items-center gap-1 rounded-[4px] bg-rose-600 px-3 py-1.5 text-white shadow-md backdrop-blur-md animate-pulse">
                            <span className="text-[10px] font-bold tracking-widest uppercase">Giữ chỗ</span>
                        </div>
                    )}

                    {isOutOfStock && (
                        <div className="flex items-center gap-1 rounded-[4px] bg-gray-900 px-3 py-1.5 text-white shadow-md backdrop-blur-md dark:bg-zinc-800">
                            <span className="text-[10px] font-bold tracking-widest uppercase">Hết hàng</span>
                        </div>
                    )}
                </div>

                {/* Sold Out Overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                        <span className="border-2 border-white/30 px-6 py-2 text-xs font-bold tracking-[0.3em] text-white uppercase transform -rotate-12">
                            Sold Out
                        </span>
                    </div>
                )}

                {/* Live MRP badge — only when dynamic pricing is active */}
                {isDynamic && !isOutOfStock && (
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

                {/* Wishlist */}
                {!isDynamic && !isOutOfStock && (
                    <div
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="absolute top-4 right-4 z-30 transform rounded-full bg-white/90 p-2 text-gray-400 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:scale-110 hover:text-red-500 dark:bg-black/80 dark:text-gray-500 dark:hover:text-red-500"
                    >
                        <Heart size={16} />
                    </div>
                )}

                {/* Quick Action Overlay */}
                {!isOutOfStock && (
                    <>
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="absolute bottom-6 left-1/2 z-30 flex w-full -translate-x-1/2 translate-y-4 justify-center gap-3 px-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding || !productId}
                                className="hover:bg-gold flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-white text-xs font-bold tracking-widest text-gray-900 uppercase shadow-lg transition-colors hover:text-white disabled:opacity-50 dark:bg-[#222] dark:text-white"
                            >
                                {isAdding ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />} 
                                Add to Cart
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg transition-colors hover:bg-gray-100 dark:bg-[#222] dark:text-white dark:hover:bg-gray-800"
                            >
                                <ShoppingBag size={14} />
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Info Area */}
            <div className={`relative px-2 text-center transition-transform duration-300 ${!isOutOfStock ? "group-hover:-translate-y-1" : ""}`}>
                <h3 className={`mb-1.5 line-clamp-2 text-[14px] font-medium transition-colors duration-300 md:text-base ${isOutOfStock ? "text-gray-400 dark:text-gray-600" : "group-hover:text-gold text-gray-800 dark:text-gray-200"}`}>
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
                        <span className={`text-[18px] font-bold ${isOutOfStock ? "text-gray-400 dark:text-gray-600" : "text-gold-dark dark:text-gold-light"}`}>
                            {displayPrice ?? "—"}
                        </span>
                    )}
                </div>

                {/* Sub-line: VIP discount OR live gold rate note */}
                {!isOutOfStock && (
                    isDynamic ? (
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
                    )
                )}
            </div>
        </div>
    );
};

export default ProductCard;
