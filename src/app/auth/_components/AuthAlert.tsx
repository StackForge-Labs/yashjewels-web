"use client";

import React from "react";

interface AuthAlertProps {
    message?: string | null;
    type?: "error" | "success";
}

export const AuthAlert: React.FC<AuthAlertProps> = ({ message, type = "error" }) => {
    if (!message) return null;

    if (type === "success") {
        return (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600 dark:border-emerald-900/30 dark:bg-emerald-950/30 dark:text-emerald-400">
                {message}
            </div>
        );
    }

    return (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
            {message}
        </div>
    );
};
