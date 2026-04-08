"use client";

import { X } from "lucide-react";
import { useEffect, ReactNode } from "react";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: ReactNode;
    footer?: ReactNode;
    width?: string;
}

export function Drawer({ isOpen, onClose, title, subtitle, children, footer, width = "max-w-lg" }: DrawerProps) {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />
            {/* Panel */}
            <div
                className={`fixed inset-y-0 right-0 z-[201] flex w-full ${width} flex-col border-l border-gray-100 bg-white shadow-[0_0_80px_-20px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-[#111] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex shrink-0 items-start justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
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
                <div className="flex-1 overflow-y-auto p-6">{children}</div>
                {footer && (
                    <div className="flex shrink-0 justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
                        {footer}
                    </div>
                )}
            </div>
        </>
    );
}
