"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
    badge?: { label: string; count: number; color?: string };
}

export function PageHeader({ title, description, actions, badge }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {title}
                    </h1>
                    {badge && (
                        <span className={`rounded-lg px-2.5 py-0.5 font-plus-jakarta text-xs font-bold ${badge.color ?? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"}`}>
                            {badge.count} {badge.label}
                        </span>
                    )}
                </div>
                {description && (
                    <p className="mt-1.5 font-plus-jakarta text-sm font-medium text-gray-400 dark:text-gray-500">
                        {description}
                    </p>
                )}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
        </div>
    );
}
