"use client";

import { useState } from "react";
import { Settings2, KeySquare, HelpCircle, Save, Bell } from "lucide-react";
import { FormField, inputCls, selectCls } from "../_components/ui/FormField";

type Profile = { name: string; email: string; role: string; locale: string; currency: string };

export default function SettingsPage() {
    const [profile, setProfile] = useState<Profile>({ name: "Admin System", email: "admin@yashjewels.com", role: "System Director", locale: "en-US", currency: "USD" });
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<"general" | "security" | "notifications">("general");

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="font-plus-jakarta text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Settings</h1>
                <p className="font-plus-jakarta text-sm font-medium text-gray-400 dark:text-gray-500">Configure your ERP preferences, security, and notification rules.</p>
            </div>

            {/* Tab Nav */}
            <div className="flex gap-1 rounded-xl border border-gray-100 bg-gray-50/50 p-1 w-max dark:border-gray-800 dark:bg-[#1a1a1a]">
                {[
                    { key: "general", label: "General", icon: Settings2 },
                    { key: "security", label: "Security", icon: KeySquare },
                    { key: "notifications", label: "Notifications", icon: Bell },
                ].map(({ key, label, icon: Icon }) => (
                    <button key={key} onClick={() => setActiveTab(key as typeof activeTab)}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 font-plus-jakarta text-sm font-bold transition-colors ${activeTab === key ? "bg-white text-gray-900 shadow-sm dark:bg-[#111] dark:text-white" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}>
                        <Icon className="h-4 w-4" /> {label}
                    </button>
                ))}
            </div>

            {activeTab === "general" && (
                <div className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:border-gray-800/50 dark:bg-[#111]/70">
                    <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800"><h2 className="font-plus-jakarta text-base font-bold text-gray-900 dark:text-white">General Preferences</h2></div>
                    <div className="p-6 flex flex-col gap-5">
                        <div className="grid grid-cols-2 gap-5">
                            <FormField label="Display Name">
                                <input className={inputCls} value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                            </FormField>
                            <FormField label="Email Address">
                                <input type="email" className={inputCls} value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
                            </FormField>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <FormField label="Locale">
                                <select className={selectCls} value={profile.locale} onChange={e => setProfile({ ...profile, locale: e.target.value })}>
                                    <option value="en-US">English (US)</option>
                                    <option value="zh-CN">中文 (简体)</option>
                                </select>
                            </FormField>
                            <FormField label="Default Currency">
                                <select className={selectCls} value={profile.currency} onChange={e => setProfile({ ...profile, currency: e.target.value })}>
                                    <option value="USD">USD ($)</option>
                                    <option value="VND">VND (₫)</option>
                                    <option value="EUR">EUR (€)</option>
                                </select>
                            </FormField>
                        </div>
                        <div className="flex justify-end">
                            <button onClick={handleSave} className={`flex items-center gap-2 rounded-xl px-4 py-2 font-plus-jakarta text-sm font-bold text-white transition-all ${saved ? "bg-emerald-600" : "bg-blue-600 hover:bg-blue-700"}`}>
                                <Save className="h-4 w-4" /> {saved ? "Saved!" : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "security" && (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:border-gray-800/50 dark:bg-[#111]/70">
                        <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800"><h2 className="font-plus-jakarta text-base font-bold text-gray-900 dark:text-white">Change Password</h2></div>
                        <div className="p-6 flex flex-col gap-4">
                            <FormField label="Current Password"><input type="password" className={inputCls} placeholder="••••••••" /></FormField>
                            <FormField label="New Password"><input type="password" className={inputCls} placeholder="Minimum 12 characters" /></FormField>
                            <FormField label="Confirm New Password"><input type="password" className={inputCls} placeholder="Repeat new password" /></FormField>
                            <div className="flex justify-end"><button className="rounded-xl bg-blue-600 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-blue-700">Update Password</button></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:border-gray-800/50 dark:bg-[#111]/70">
                        <div>
                            <h3 className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                            <p className="font-plus-jakarta text-xs font-medium text-gray-400 mt-0.5">Secure your account with TOTP authentication.</p>
                        </div>
                        <span className="rounded-lg bg-emerald-50 px-3 py-1.5 font-plus-jakarta text-xs font-bold text-emerald-600 dark:bg-emerald-500/10">Enabled</span>
                    </div>
                </div>
            )}

            {activeTab === "notifications" && (
                <div className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:border-gray-800/50 dark:bg-[#111]/70">
                    <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800"><h2 className="font-plus-jakarta text-base font-bold text-gray-900 dark:text-white">Notification Preferences</h2></div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {[
                            { label: "New Order Placed", sub: "Get notified when a customer places an order", enabled: true },
                            { label: "KYC Submission", sub: "Alert when a customer submits identity documents", enabled: true },
                            { label: "Return Request", sub: "Alert for new return and refund requests", enabled: true },
                            { label: "Low Stock Alert", sub: "Notify when product inventory drops below 5 units", enabled: false },
                            { label: "Gold Rate Update", sub: "Daily summary of gold price changes", enabled: false },
                        ].map(({ label, sub, enabled }) => (
                            <div key={label} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                <div>
                                    <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{label}</p>
                                    <p className="font-plus-jakarta text-xs font-medium text-gray-400 mt-0.5">{sub}</p>
                                </div>
                                <div className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${enabled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`}>
                                    <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
