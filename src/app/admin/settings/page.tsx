"use client";

import { useState, useEffect } from "react";
import { Settings, Save, RefreshCw, BarChart3, Info, Lock, Globe } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { FormField, inputCls } from "../_components/ui/FormField";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        vatRate: 10,
        goldRate_IsManual: false,
        goldRate_ManualValue: 0,
        goldRate_PollingIntervalMinutes: 30,
        currency: "VND"
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const res = await adminService.getSettingsApi();
            if (res.success) setSettings(res.data);
        } catch (error) {
            toast.error("Failed to fetch system settings");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await adminService.updateSettingsApi(settings);
            if (res.success) {
                toast.success("System configurations saved successfully");
                fetchSettings();
            }
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-4xl">
            <PageHeader 
                title="System Configuration" 
                description="Global governance for Yash Jewels. Configure tax rates, logistics polling, and financial automation."
            />

            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-20 text-gray-400 gap-4">
                    <RefreshCw className="h-8 w-8 animate-spin" />
                    <p className="font-plus-jakarta font-bold">Synchronizing system nodes...</p>
                </div>
            ) : (
                <form onSubmit={handleSave} className="flex flex-col gap-6">
                    {/* Financial Settings */}
                    <div className="rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm dark:border-gray-800/50 dark:bg-[#111]/70">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-plus-jakarta text-base font-bold text-gray-900 dark:text-white">Taxation & Finance</h3>
                                <p className="text-xs text-gray-400">Manage value-added tax and default currencies.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <FormField label="VAT Rate (%)" required>
                                <input 
                                    type="number" 
                                    className={inputCls} 
                                    value={settings.vatRate} 
                                    onChange={e => setSettings({ ...settings, vatRate: Number(e.target.value) })}
                                />
                                <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                                    <Info className="h-3 w-3" /> This rate is applied globally to all checkout totals.
                                </p>
                            </FormField>
                            <FormField label="Base Currency">
                                <input className={inputCls} value={settings.currency} disabled />
                                <p className="text-[10px] text-rose-500 mt-2 flex items-center gap-1">
                                    <Lock className="h-3 w-3" /> Fixed to VND for current region.
                                </p>
                            </FormField>
                        </div>
                    </div>

                    {/* Gold Rate Automation */}
                    <div className="rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm dark:border-gray-800/50 dark:bg-[#111]/70">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                                <RefreshCw className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-plus-jakarta text-base font-bold text-gray-900 dark:text-white">Gold Rate Architecture</h3>
                                <p className="text-xs text-gray-400">Control real-time price synchronization across the store.</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800">
                                <div>
                                    <h4 className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">Manual Override Mode</h4>
                                    <p className="text-xs text-gray-400 mt-1">Disconnect from external APIs and set gold prices manually.</p>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => setSettings({ ...settings, goldRate_IsManual: !settings.goldRate_IsManual })}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.goldRate_IsManual ? "bg-amber-500" : "bg-gray-200 dark:bg-gray-700"}`}
                                >
                                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.goldRate_IsManual ? "translate-x-5" : "translate-x-0"}`} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <FormField label="Manual Rate (VND per Gram)" required={settings.goldRate_IsManual}>
                                    <input 
                                        type="number" 
                                        className={inputCls} 
                                        disabled={!settings.goldRate_IsManual}
                                        value={settings.goldRate_ManualValue}
                                        onChange={e => setSettings({ ...settings, goldRate_ManualValue: Number(e.target.value) })}
                                    />
                                </FormField>
                                <FormField label="API Polling Interval (Minutes)" required={!settings.goldRate_IsManual}>
                                    <input 
                                        type="number" 
                                        className={inputCls} 
                                        disabled={settings.goldRate_IsManual}
                                        value={settings.goldRate_PollingIntervalMinutes}
                                        onChange={e => setSettings({ ...settings, goldRate_PollingIntervalMinutes: Number(e.target.value) })}
                                    />
                                    <p className="text-[10px] text-gray-400 mt-2">Recommended: 15-60 mins for API quota safety.</p>
                                </FormField>
                            </div>
                        </div>
                    </div>

                    {/* Backend Infrastructure */}
                    <div className="rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm dark:border-gray-800/50 dark:bg-[#111]/70">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                                <Globe className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-plus-jakarta text-base font-bold text-gray-900 dark:text-white">API Integration Endpoints</h3>
                                <p className="text-xs text-gray-400">External services status and health checks.</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                                <span className="text-gray-500">Stripe Webhook Gateway</span>
                                <span className="flex items-center gap-1.5 font-bold text-emerald-600"><div className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" /> Operational</span>
                            </div>
                            <div className="flex items-center justify-between text-xs p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                                <span className="text-gray-500">GoldPriceAPI.io Connector</span>
                                <span className="flex items-center gap-1.5 font-bold text-emerald-600"><div className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" /> Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end p-4">
                        <button 
                            disabled={isSaving}
                            className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-plus-jakarta text-sm font-bold text-white shadow-lg hover:bg-black transition-all dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {isSaving ? "Persisting Changes..." : "Commit System Changes"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
