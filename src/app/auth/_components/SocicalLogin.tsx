import { Facebook } from "@/app/_components/icon/Facebook";
import { Google } from "@/app/_components/icon/Google";
import React from "react";

export const SocicalLogin = () => {
    return (
        <div className="grid grid-cols-2 gap-4 text-center">
            <button className="flex items-center justify-center gap-3 rounded-xl border border-gray-100 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-white/5 dark:text-gray-300 dark:hover:bg-white/5">
                <Google size={18} />
                Google
            </button>
            <button className="flex items-center justify-center gap-3 rounded-xl border border-gray-100 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-white/5 dark:text-gray-300 dark:hover:bg-white/5">
                <Facebook size={18} />
                Facebook
            </button>
        </div>
    );
};
