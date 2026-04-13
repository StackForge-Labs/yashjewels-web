"use client";
import React from "react";
import { Heart, ShoppingCart, ShoppingBag } from "lucide-react";

interface ProductCardProps {
    sku: string;
    name: string;
    category: string;
    original: string;
    sale: string;
    discount: string;
    image1: string;
    image2: string;
    badge?: string;
    className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
    sku,
    name,
    category,
    original,
    sale,
    discount,
    image1,
    image2,
    badge,
    className = "",
}) => {
    return (
        <div className={`group flex cursor-pointer flex-col ${className}`}>
            {/* Image Wrapper */}
            <div className="relative mb-5 aspect-4/5 w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 transition-shadow duration-500 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:border-white/5 dark:bg-[#111] dark:group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                {/* Default Image */}
                <img
                    src={image1}
                    alt={name}
                    className="absolute inset-0 h-full w-full scale-100 object-cover opacity-100 transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:opacity-0"
                    loading="lazy"
                />
                {/* Hover Image */}
                <img
                    src={image2}
                    alt={`${name} alternate`}
                    className="absolute inset-0 h-full w-full scale-110 object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:scale-100 group-hover:opacity-100"
                    loading="lazy"
                />

                {/* Badges */}
                {badge && (
                    <div className="absolute top-4 left-4 flex items-center gap-1 rounded-[4px] bg-black/80 px-3 py-1.5 text-white shadow-sm backdrop-blur-md dark:bg-white/90 dark:text-black">
                        <span className="text-gold text-[10px] font-bold tracking-widest uppercase">{badge}</span>
                    </div>
                )}

                {/* Wishlist Icon */}
                <div 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); console.log("Added to wishlist"); }}
                    className="absolute top-4 right-4 z-30 transform rounded-full bg-white/90 p-2 text-gray-400 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:scale-110 hover:text-red-500 dark:bg-black/80 dark:text-gray-500 dark:hover:text-red-500"
                >
                    <Heart size={16} />
                </div>

                {/* Quick Action Overlay on Hover */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="absolute bottom-6 left-1/2 z-30 flex w-full -translate-x-1/2 translate-y-4 justify-center gap-3 px-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); console.log("Added to cart"); }}
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

                <div className="mb-1.5 flex items-center justify-center gap-3">
                    <span className="text-[13px] text-gray-400 line-through decoration-gray-300 dark:text-gray-500 dark:decoration-gray-600">
                        {original}
                    </span>
                    <span className="text-gold-dark dark:text-gold-light text-[18px] font-bold">{sale}</span>
                </div>
                <p className="border-gold text-gold mx-auto mt-3 w-max border-b border-dashed pb-0.5 text-[10px] font-bold tracking-widest uppercase">
                    VIP Price {discount} Off
                </p>
            </div>
        </div>
    );
};

export default ProductCard;
