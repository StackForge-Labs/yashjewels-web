"use client";

import { Minus, Plus, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ConfirmDialog } from "@/app/admin/_components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";

interface CartItemProps {
    id: string;
    name: string;
    sku: string;
    slug: string;
    image: string;
    metal: string;
    stone: string;
    price: string;
    originalPrice: string;
    quantity: number;
    maxQuantity: number; 
    priceChanged?: boolean;
    priceDrift?: number;
    isSelected?: boolean;
    onRemove?: (id: string) => void;
    onQuantityChange?: (id: string, qty: number) => void;
    onToggleSelect?: (id: string, selected: boolean) => void;
}

export const CartItem = ({
    id,
    name,
    sku,
    slug,
    image,
    metal,
    stone,
    price,
    originalPrice,
    quantity: initialQty,
    maxQuantity,
    priceChanged,
    priceDrift = 0,
    isSelected = false,
    onRemove,
    onQuantityChange,
    onToggleSelect,
}: CartItemProps) => {
    const [qty, setQty] = useState(initialQty);
    const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);

    const handleQtyChange = (newQty: number) => {
        if (newQty < 1) {
            setIsRemoveConfirmOpen(true);
            return;
        }
        if (newQty > maxQuantity) return;
        setQty(newQty);
        onQuantityChange?.(id, newQty);
    };

    return (
        <div className="group relative flex gap-4 border-b border-gray-100 py-6 transition-colors md:gap-6 dark:border-white/5 items-center">
            {/* Checkbox for selection */}
            <div className="shrink-0 flex items-center pr-2">
                <input 
                    type="checkbox" 
                    checked={isSelected && maxQuantity > 0}
                    disabled={maxQuantity <= 0}
                    onChange={(e) => onToggleSelect?.(id, e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-gold focus:ring-gold bg-white dark:bg-black dark:border-gray-600 transition-colors disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                />
            </div>

            {/* Price change warning */}
            {priceChanged && (
                <div className={cn(
                    "absolute -top-2 right-0 left-0 flex items-center gap-2 rounded-t-lg px-4 py-2 text-[11px] font-bold z-10",
                    Math.abs(priceDrift) >= 10 
                        ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400" 
                        : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                )}>
                    <AlertTriangle size={12} className={Math.abs(priceDrift) >= 10 ? "text-red-500" : "text-amber-500"} />
                    {Math.abs(priceDrift) >= 10 
                        ? `Critical price change: ${priceDrift > 0 ? "+" : ""}${priceDrift}%! Checkout for this item is blocked due to extreme market volatility.`
                        : `Gold price changed by ${priceDrift > 0 ? "+" : ""}${priceDrift}% since added.`
                    }
                </div>
            )}

            {/* Image */}
            <Link
                href={`/products/${slug}`}
                className={cn(
                    "relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 md:h-32 md:w-32 dark:border-white/5 dark:bg-[#111]",
                    maxQuantity <= 0 && "opacity-60"
                )}
            >
                <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {maxQuantity <= 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-white bg-red-600 px-2 py-1 rounded">Out of Stock</span>
                    </div>
                )}
            </Link>

            {/* Details */}
            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link
                            href={`/products/${slug}`}
                            className={cn(
                                "group-hover:text-gold block text-sm font-medium text-gray-900 transition-colors md:text-base dark:text-white",
                                maxQuantity <= 0 && "text-gray-400 group-hover:text-gray-400"
                            )}
                        >
                            {name}
                        </Link>
                        {maxQuantity <= 0 && (
                            <span className="text-[9px] font-bold uppercase text-red-500 border border-red-500/30 px-1.5 py-0.5 rounded leading-none">Sold Out</span>
                        )}
                    </div>
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">REF: {sku}</p>
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
                        <button
                            onClick={() => handleQtyChange(qty - 1)}
                            disabled={maxQuantity <= 0}
                            className="hover:text-gold px-3 py-2 text-gray-400 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-gray-900 dark:text-white">{maxQuantity <= 0 ? 0 : qty}</span>
                        <button
                            onClick={() => handleQtyChange(qty + 1)}
                            disabled={qty >= maxQuantity || maxQuantity <= 0}
                            className="hover:text-gold px-3 py-2 text-gray-400 transition-colors disabled:opacity-30 disabled:hover:text-gray-400 disabled:cursor-not-allowed"
                            title={maxQuantity <= 0 ? "Out of stock" : (qty >= maxQuantity ? "Max stock reached" : "")}
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    {/* Price + Remove */}
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-gold text-base font-bold md:text-lg">{price}</p>
                            <p className="text-[11px] text-gray-400 line-through">{originalPrice}</p>
                        </div>
                        <button
                            onClick={() => setIsRemoveConfirmOpen(true)}
                            className="rounded-full p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmDialog 
                isOpen={isRemoveConfirmOpen} 
                onClose={() => setIsRemoveConfirmOpen(false)} 
                onConfirm={() => {
                    setIsRemoveConfirmOpen(false);
                    onRemove?.(id);
                }} 
                title="Xác nhận bỏ sản phẩm"
                description={`Bạn có chắc chắn muốn bỏ "${name}" khỏi giỏ hàng không?`}
                confirmLabel="Bỏ sản phẩm"
                isDestructive={true}
            />
        </div>
    );
};
