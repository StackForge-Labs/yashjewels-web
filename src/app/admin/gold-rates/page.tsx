"use client";

import { useState } from "react";
import { Plus, TrendingUp, Edit3, Search } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { Modal } from "../_components/ui/Modal";
import { FormField, inputCls, selectCls } from "../_components/ui/FormField";

type GoldRate = { id: string; gold_rate_vnd: number; gold_rate_per_gm: number; source: string; recorded_at: string };

const initialRates: GoldRate[] = [
    { id: "1", gold_rate_vnd: 8500000, gold_rate_per_gm: 82, source: "SJC Global", recorded_at: "2026-04-08 09:00" },
    { id: "2", gold_rate_vnd: 8480000, gold_rate_per_gm: 81.8, source: "SJC Global", recorded_at: "2026-04-07 09:00" },
    { id: "3", gold_rate_vnd: 8450000, gold_rate_per_gm: 81.5, source: "Doji Exchange", recorded_at: "2026-04-06 09:00" },
];

type FormData = { gold_rate_vnd: number; gold_rate_per_gm: number; source: string };

export default function GoldRatesPage() {
    const [rates, setRates] = useState<GoldRate[]>(initialRates);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState<FormData>({ gold_rate_vnd: 0, gold_rate_per_gm: 0, source: "SJC Global" });

    const handleSave = () => {
        const now = new Date().toISOString().replace("T", " ").substring(0, 16);
        setRates([{ id: Date.now().toString(), ...form, recorded_at: now }, ...rates]);
        setIsModalOpen(false);
    };

    const current = rates[0];
    const previous = rates[1];
    const change = current && previous ? ((current.gold_rate_vnd - previous.gold_rate_vnd) / previous.gold_rate_vnd * 100).toFixed(2) : null;

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Gold Rate History" description="Track and update the daily gold price used for product pricing calculations."
                actions={
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(245,158,11,0.3)] hover:bg-amber-600">
                        <TrendingUp className="h-4 w-4" /> Update Rate
                    </button>
                }
            />

            {/* Live Rate Card */}
            {current && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50 p-6 dark:border-amber-800/30 dark:from-amber-900/20 dark:to-orange-900/10">
                        <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-amber-600">Live Gold Rate</p>
                        <p className="mt-2 font-plus-jakarta text-4xl font-bold text-amber-700 dark:text-amber-400">{current.gold_rate_vnd.toLocaleString()} VND</p>
                        <p className="mt-1 font-plus-jakarta text-sm font-medium text-amber-600/70">per gram · ${current.gold_rate_per_gm}/gm</p>
                        <div className="mt-3 flex items-center gap-3">
                            <span className="font-plus-jakarta text-xs font-medium text-amber-600/70">Source: {current.source}</span>
                            {change && (
                                <span className={`font-plus-jakarta text-xs font-bold ${Number(change) >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                                    {Number(change) >= 0 ? "▲" : "▼"} {Math.abs(Number(change))}%
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800/50 dark:bg-[#111]/70">
                        <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">Previous Rate</p>
                        {previous ? (
                            <>
                                <p className="mt-2 font-plus-jakarta text-2xl font-bold text-gray-900 dark:text-white">{previous.gold_rate_vnd.toLocaleString()} VND</p>
                                <p className="mt-1 font-plus-jakarta text-xs text-gray-400">{previous.recorded_at}</p>
                            </>
                        ) : <p className="mt-2 text-gray-400 text-sm">No previous rate</p>}
                    </div>
                </div>
            )}

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800/50">
                    <h2 className="font-plus-jakarta text-base font-bold text-gray-900 dark:text-white">Rate History Log</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                            <tr>{["Rate (VND/gm)", "USD/gm", "Source", "Recorded At"].map(h => <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                            {rates.map((rate, i) => (
                                <tr key={rate.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4">
                                        <span className={`font-plus-jakarta text-base font-bold ${i === 0 ? "text-amber-600" : "text-gray-700 dark:text-gray-200"}`}>{rate.gold_rate_vnd.toLocaleString()}</span>
                                        {i === 0 && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 font-plus-jakarta text-[10px] font-bold text-amber-600">CURRENT</span>}
                                    </td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">${rate.gold_rate_per_gm}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500">{rate.source}</td>
                                    <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500">{rate.recorded_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Gold Rate" subtitle="This rate will be used for all product price calculations" size="md"
                footer={<>
                    <button onClick={() => setIsModalOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300">Cancel</button>
                    <button onClick={handleSave} disabled={!form.gold_rate_vnd || !form.gold_rate_per_gm} className="rounded-xl bg-amber-500 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-40">Save Rate</button>
                </>}>
                <div className="flex flex-col gap-4">
                    <FormField label="Rate (VND per gram)" required>
                        <input type="number" className={inputCls} placeholder="8500000" value={form.gold_rate_vnd || ""}
                            onChange={e => setForm({ ...form, gold_rate_vnd: Number(e.target.value) })} />
                    </FormField>
                    <FormField label="Rate (USD per gram)" required>
                        <input type="number" step="0.01" className={inputCls} placeholder="82.00" value={form.gold_rate_per_gm || ""}
                            onChange={e => setForm({ ...form, gold_rate_per_gm: Number(e.target.value) })} />
                    </FormField>
                    <FormField label="Source">
                        <select className={selectCls} value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
                            {["SJC Global", "Doji Exchange", "WGC Data", "Manual Entry"].map(s => <option key={s}>{s}</option>)}
                        </select>
                    </FormField>
                </div>
            </Modal>
        </div>
    );
}
