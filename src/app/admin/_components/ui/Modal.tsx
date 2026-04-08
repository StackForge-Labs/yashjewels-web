"use client";

import { X } from "lucide-react";
import { useEffect, ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    size?: "sm" | "md" | "lg" | "xl";
    children: ReactNode;
    footer?: ReactNode;
}

const sizeMap = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
};

export function Modal({ isOpen, onClose, title, subtitle, size = "md", children, footer }: ModalProps) {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full ${sizeMap[size]} animate-in fade-in zoom-in-95 rounded-2xl border border-gray-100 bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] dark:border-gray-800/70 dark:bg-[#111]`}>
                <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
                    <div>
                        <h2 className="font-plus-jakarta text-base font-bold text-gray-900 dark:text-white">{title}</h2>
                        {subtitle && <p className="mt-0.5 font-plus-jakarta text-xs font-medium text-gray-400">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="max-h-[75vh] overflow-y-auto p-6">{children}</div>
                {footer && (
                    <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
