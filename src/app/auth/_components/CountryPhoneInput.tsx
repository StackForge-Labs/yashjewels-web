"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { countries } from "../../../data/countries";

interface CountryPhoneInputProps {
    selectedCountryISO: string;
    phoneNumber: string;
    onCountryChange: (iso: string) => void;
    onPhoneChange: (phone: string) => void;
    error?: string;
    disabled?: boolean;
}

export const CountryPhoneInput = ({
    selectedCountryISO,
    phoneNumber,
    onCountryChange,
    onPhoneChange,
    error,
    disabled
}: CountryPhoneInputProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const activeCountry = countries.find(c => c.code === selectedCountryISO) || countries.find(c => c.code === "VN") || countries[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.dial_code.includes(searchQuery)
    );

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                {/* Country Selector */}
                <div className="relative w-[180px] sm:w-[220px]" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => !disabled && setIsOpen(!isOpen)}
                        className={`flex h-[50px] w-full items-center justify-between rounded-xl border bg-gray-50 px-3 text-sm transition-all focus:bg-white dark:bg-[#111] dark:text-white ${error ? "border-red-500" : "border-gray-100 dark:border-white/5"
                            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        disabled={disabled}
                    >
                        <div className="flex items-center gap-2 truncate pr-1">
                            <span className="text-lg flex-shrink-0">{activeCountry.emoji}</span>
                            <span className="font-bold flex-shrink-0">{activeCountry.dial_code}</span>
                            <span className="text-[10px] text-gray-400 truncate uppercase tracking-tighter ml-1">
                                {activeCountry.name}
                            </span>
                        </div>
                        <ChevronDown size={14} className={`text-gray-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isOpen && (
                        <div className="absolute left-0 z-50 mt-2 w-[280px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl dark:border-white/10 dark:bg-[#1a1a1a]">
                            <div className="p-2">
                                <div className="relative flex items-center">
                                    <Search className="absolute left-3 text-gray-400" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Search country or code..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-lg bg-gray-50 py-2 pr-4 pl-9 text-xs outline-hidden dark:bg-[#111] dark:text-white"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="max-h-[250px] overflow-y-auto overflow-x-hidden">
                                {filteredCountries.map((country) => (
                                    <button
                                        key={`${country.code}-${country.dial_code}`}
                                        type="button"
                                        onClick={() => {
                                            onCountryChange(country.code);
                                            setIsOpen(false);
                                            setSearchQuery("");
                                        }}
                                        className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-white/5"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{country.emoji}</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{country.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400">{country.dial_code}</span>
                                            {activeCountry.code === country.code && <Check size={14} className="text-gold" />}
                                        </div>
                                    </button>
                                ))}
                                {filteredCountries.length === 0 && (
                                    <div className="px-4 py-6 text-center text-xs text-gray-500 uppercase tracking-widest">
                                        No results found
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Number Input */}
                <div className="flex-1">
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            onPhoneChange(val);
                        }}
                        placeholder="0912345678"
                        className={`h-[50px] w-full rounded-xl border bg-gray-50 px-4 text-sm text-gray-900 outline-hidden transition-all focus:bg-white dark:bg-[#111] dark:text-white ${error ? "border-red-500" : "border-gray-100 dark:border-white/5"
                            } disabled:opacity-50`}
                        disabled={disabled}
                    />
                </div>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};
