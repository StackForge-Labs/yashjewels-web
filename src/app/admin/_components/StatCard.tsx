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
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#222] dark:bg-[#111]">
            <div className="flex items-center justify-between pb-3">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span>
                <div className="rounded-md bg-stone-100 p-2 dark:bg-stone-900/50">
                    <Icon className="h-4 w-4 text-stone-600 dark:text-stone-400" />
                </div>
            </div>
            
            <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</h3>
                {trend && (
                    <span className={`text-xs font-medium ${trend.isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                        {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                    </span>
                )}
            </div>
            
            {children && (
                <div className="mt-4 flex-1">
                    {children}
                </div>
            )}
        </div>
    );
}
