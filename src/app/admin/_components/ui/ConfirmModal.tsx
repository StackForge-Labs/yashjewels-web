"use client";

import { LucideIcon, AlertCircle, CheckCircle2, X } from "lucide-react";
import { Modal } from "./Modal";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    type?: "success" | "danger" | "warning";
    loading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "warning",
    loading = false
}: ConfirmModalProps) {
    
    const colors = {
        success: {
            bg: "bg-emerald-50 text-emerald-600",
            button: "bg-emerald-600 hover:bg-emerald-700 text-white",
            icon: CheckCircle2
        },
        danger: {
            bg: "bg-rose-50 text-rose-600",
            button: "bg-rose-600 hover:bg-rose-700 text-white",
            icon: X
        },
        warning: {
            bg: "bg-amber-50 text-amber-600",
            button: "bg-blue-600 hover:bg-blue-700 text-white",
            icon: AlertCircle
        }
    };

    const config = colors[type];
    const Icon = config.icon;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title=""
            size="sm"
        >
            <div className="flex flex-col items-center text-center py-4">
                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${config.bg} shadow-sm ring-8 ring-white dark:ring-[#111]`}>
                    <Icon className="h-8 w-8" />
                </div>
                
                <h3 className="font-plus-jakarta text-xl font-bold text-gray-900 dark:text-white">
                    {title}
                </h3>
                
                <p className="mt-3 font-plus-jakarta text-sm font-medium text-gray-400 leading-relaxed px-4">
                    {description}
                </p>

                <div className="mt-10 flex w-full flex-col gap-3">
                    <button
                        disabled={loading}
                        onClick={onConfirm}
                        className={`flex w-full items-center justify-center rounded-xl py-3.5 font-plus-jakarta text-sm font-bold transition-all active:scale-95 disabled:opacity-50 ${config.button}`}
                    >
                        {loading ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                            confirmText
                        )}
                    </button>
                    <button
                        disabled={loading}
                        onClick={onClose}
                        className="flex w-full items-center justify-center rounded-xl bg-gray-50 py-3.5 font-plus-jakarta text-sm font-bold text-gray-500 transition-all hover:bg-gray-100 dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
