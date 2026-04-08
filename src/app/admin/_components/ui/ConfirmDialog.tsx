"use client";

import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    isDestructive?: boolean;
    isLoading?: boolean;
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = "Confirm",
    isDestructive = true,
    isLoading = false,
}: ConfirmDialogProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`rounded-xl px-4 py-2 font-plus-jakarta text-sm font-bold text-white transition-colors disabled:opacity-50 ${
                            isDestructive
                                ? "bg-rose-600 hover:bg-rose-700"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {isLoading ? "Processing..." : confirmLabel}
                    </button>
                </>
            }
        >
            <div className="flex items-start gap-4">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isDestructive ? "bg-rose-50 dark:bg-rose-500/10" : "bg-blue-50 dark:bg-blue-500/10"
                    }`}
                >
                    <AlertTriangle
                        className={`h-5 w-5 ${isDestructive ? "text-rose-600" : "text-blue-600"}`}
                    />
                </div>
                <p className="font-plus-jakarta text-sm font-medium leading-relaxed text-gray-600 dark:text-gray-300">
                    {description}
                </p>
            </div>
        </Modal>
    );
}
