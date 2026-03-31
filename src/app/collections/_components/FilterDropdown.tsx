"use client";

import { ChevronDown } from "lucide-react";

interface FilterDropdownProps {
    label: string;
    options: string[];
    value: string;
    onChange: (val: string) => void;
}

export default function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">{label}</h3>
            <div className="relative group">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-10 w-full appearance-none border-b border-gray-100 bg-transparent pr-8 text-[11px] font-bold tracking-widest text-gray-900 uppercase outline-none focus:border-gold dark:border-white/5 dark:text-white"
                >
                    <option value="All">All {label}s</option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={12}
                    className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-gray-300 group-hover:text-gold transition-colors"
                />
            </div>
        </div>
    );
}
