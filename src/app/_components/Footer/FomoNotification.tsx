"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, X } from "lucide-react";

const ORDERS = [
    {
        name: "Emily R.",
        location: "New York, USA",
        product: "Aura Solitaire Ring",
        time: "2 mins ago",
        image: "https://tamluxury.vn/wp-content/uploads/2026/01/Thiet-ke-nam-2026-Nhan-nu-kim-cuong-Organ-Ma-SP-NNU1618-scaled.jpg",
    },
    {
        name: "John D.",
        location: "London, UK",
        product: "Men's Classic Band",
        time: "5 mins ago",
        image: "https://tamluxury.vn/wp-content/uploads/2025/11/3.NHAN-NAM-POST-WEB-UP-LAI-SIZE-NHO.jpg",
    },
    {
        name: "Sophia L.",
        location: "Paris, FR",
        product: "Imperial Necklace",
        time: "12 mins ago",
        image: "https://tamluxury.vn/wp-content/uploads/2026/03/Thiet-ke-mat-day-chuyen-Halo-tron-dac-biet-Melody-Ma-MD878-1-scaled.jpg",
    },
    {
        name: "Michael T.",
        location: "Singapore",
        product: "Diamond Earrings",
        time: "18 mins ago",
        image: "https://tamluxury.vn/wp-content/uploads/2025/12/Nhan-nu-kim-cuong-thien-nhien-Mia-Ma-SP-NNU1544-scaled.jpg",
    },
];

export const FomoNotification = () => {
    const [currentOrder, setCurrentOrder] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const showInitial = setTimeout(() => {
            setIsVisible(true);
        }, 5000);

        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentOrder((prev) => (prev + 1) % ORDERS.length);
                setIsVisible(true);
            }, 1000);
        }, 15000);

        return () => {
            clearTimeout(showInitial);
            clearInterval(interval);
        };
    }, []);

    const order = ORDERS[currentOrder];

    return (
        <div
            className={`fixed bottom-8 right-8 z-100 hidden max-w-[360px] overflow-hidden rounded-2xl border border-gray-100 bg-white/95 p-0 shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-700 select-none lg:flex dark:border-white/10 dark:bg-zinc-900/95 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
                }`}
        >
            <div className="flex w-full items-center p-3">
                {/* Product Image */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-white/5 dark:bg-black">
                    <img src={order.image} alt={order.product} className="h-full w-full object-cover" />
                </div>

                {/* Content */}
                <div className="ml-4 flex grow flex-col pr-8">
                    <div className="flex items-center gap-1.5">
                        <p className="text-[11px] font-bold text-gray-900 dark:text-white">{order.name}</p>
                        <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                        <p className="text-[10px] text-gray-500">{order.location}</p>
                    </div>

                    <p className="mt-0.5 line-clamp-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                        Purchased <span className="text-gold font-serif italic">{order.product}</span>
                    </p>

                    <div className="mt-1.5 flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[9px] font-bold tracking-tighter text-green-500 uppercase">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            Verified Order
                        </span>
                        <span className="text-[9px] text-gray-400">{order.time}</span>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-2 right-2 text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white"
                >
                    <X size={14} />
                </button>
            </div>

            {/* Progress bar for timer */}
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gray-50 dark:bg-black/20">
                <div
                    className={`bg-gold h-full transition-all duration-15000 linear ${isVisible ? "w-full" : "w-0"
                        }`}
                ></div>
            </div>
        </div>
    );
};
