"use client";

import { Minus, Plus, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface CartItemProps {
    id: string;
    name: string;
    sku: string;
    image: string;
    metal: string;
    stone: string;
    price: string;
    originalPrice: string;
    quantity: number;
    priceChanged?: boolean;
    onRemove?: (id: string) => void;
    onQuantityChange?: (id: string, qty: number) => void;
}

export const CartItem = ({
    id,
    name,
    sku,
    image,
    metal,
    stone,
    price,
    originalPrice,
    quantity: initialQty,
    priceChanged,
    onRemove,
    onQuantityChange,
}: CartItemProps) => {
    const [qty, setQty] = useState(initialQty);

    const handleQtyChange = (newQty: number) => {
        if (newQty < 1) return;
        setQty(newQty);
        onQuantityChange?.(id, newQty);
    };

    return (
        <div className="group relative flex gap-4 md:gap-6 border-b border-gray-100 py-6 transition-colors dark:border-white/5">
            {/* Price change warning */}
            {priceChanged && (
                <div className="absolute -top-0.5 left-0 right-0 flex items-center gap-2 rounded-t-lg bg-amber-50 px-4 py-2 text-[11px] font-bold text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                    <AlertTriangle size={12} />
                    Gold price has changed since you added this item. Price updated.
                </div>
            )}

            {/* Image */}
            <Link href={`/product/${sku}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 md:h-32 md:w-32 dark:border-white/5 dark:bg-[#111]">
                <img src={image} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </Link>

            {/* Details */}
            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <Link href={`/product/${sku}`} className="group-hover:text-gold mb-1 block text-sm md:text-base font-medium text-gray-900 transition-colors dark:text-white">
                        {name}
                    </Link>
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                        REF: {sku}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold tracking-wider text-gray-600 dark:bg-white/5 dark:text-gray-400">
                            {metal}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold tracking-wider text-gray-600 dark:bg-white/5 dark:text-gray-400">
                            {stone}
                        </span>
                    </div>
                </div>

                <div className="mt-3 flex items-end justify-between">
                    {/* Quantity */}
                    <div className="flex items-center rounded-lg border border-gray-200 dark:border-white/10">
                        <button onClick={() => handleQtyChange(qty - 1)} className="hover:text-gold px-3 py-2 text-gray-400 transition-colors">
                            <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-gray-900 dark:text-white">{qty}</span>
                        <button onClick={() => handleQtyChange(qty + 1)} className="hover:text-gold px-3 py-2 text-gray-400 transition-colors">
                            <Plus size={14} />
                        </button>
                    </div>

                    {/* Price + Remove */}
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-gold text-base md:text-lg font-bold">{price}</p>
                            <p className="text-[11px] text-gray-400 line-through">{originalPrice}</p>
                        </div>
                        <button
                            onClick={() => onRemove?.(id)}
                            className="rounded-full p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
