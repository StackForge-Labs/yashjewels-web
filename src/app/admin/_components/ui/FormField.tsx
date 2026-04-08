"use client";

import { ReactNode } from "react";

interface FormFieldProps {
    label: string;
    required?: boolean;
    hint?: string;
    error?: string;
    children: ReactNode;
}

export function FormField({ label, required, hint, error, children }: FormFieldProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
                {label}
                {required && <span className="ml-1 text-rose-500">*</span>}
            </label>
            {children}
            {hint && !error && <p className="font-plus-jakarta text-[11px] font-medium text-gray-400">{hint}</p>}
            {error && <p className="font-plus-jakarta text-[11px] font-medium text-rose-500">{error}</p>}
        </div>
    );
}

// Shared input class used across all forms
export const inputCls =
    "w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 font-plus-jakarta text-sm font-medium text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/5 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-100 dark:placeholder:text-gray-600 dark:focus:border-blue-500 dark:focus:bg-gray-900/80";

export const selectCls =
    "w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 font-plus-jakarta text-sm font-medium text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/5 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:bg-gray-900/80 appearance-none";

export const textareaCls =
    "w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 font-plus-jakarta text-sm font-medium text-gray-900 transition-all placeholder:text-gray-400 resize-none focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/5 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-100 dark:placeholder:text-gray-600 dark:focus:border-blue-500";
