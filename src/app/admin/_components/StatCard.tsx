"use client";

import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    icon: LucideIcon;
    children?: ReactNode;
}

export default function StatCard({ title, value, trend, icon: Icon, children }: StatCardProps) {
    return (
        <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)] dark:border-gray-800/50 dark:bg-[#111]/70">
            <div className="flex justify-between pb-5">
                <div className="flex flex-col gap-1.5">
                    <span className="font-plus-jakarta text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{title}</span>
                    <h3 className="font-plus-jakarta text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{value}</h3>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-400 shadow-inner dark:bg-gray-800/50 dark:text-gray-500">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            
            <div className="mt-auto flex items-center gap-2.5">
                {trend && (
                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 font-plus-jakarta text-xs font-bold leading-none ${
                        trend.isPositive ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                    }`}>
                        {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                    </span>
                )}
                {trend && <span className="font-plus-jakarta text-[11px] font-medium text-gray-400 dark:text-gray-500">vs last month</span>}
            </div>
            
            {children && (
                <div className="mt-5 flex-1">
                    {children}
                </div>
            )}
        </div>
    );
}
