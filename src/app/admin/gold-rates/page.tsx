"use client";

import { useEffect, useState } from "react";
import { Plus, TrendingUp, Edit3, Search, RefreshCw, ShieldAlert, ShieldCheck } from "lucide-react";
import { PageHeader } from "../_components/ui/PageHeader";
import { Modal } from "../_components/ui/Modal";
import { FormField, inputCls, selectCls } from "../_components/ui/FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { goldRateService } from "@/services/gold-rate.service";
import toast from "react-hot-toast";

const rateSchema = z.object({
    manualRate: z.coerce.number().min(0, "Price must be positive"),
    isManual: z.boolean(),
});
type RateFormData = z.infer<typeof rateSchema>;

export default function GoldRatesPage() {
    const [rates, setRates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(rateSchema),
        defaultValues: { manualRate: 0, isManual: false }
    });

    const isManualMode = watch("isManual");

    const loadData = async () => {
        setIsLoading(true);
        try {
            const res = await goldRateService.getHistory(20);
            if (res.success) {
                setRates(res.data);
                // Set form defaults from current active rate if it's manual
                const current = res.data[0];
                if (current) {
                    setValue("manualRate", current.rateVnd);
                }
            }
        } catch (error) {
            toast.error("Failed to load rate history");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleManualOverride = async (data: RateFormData) => {
        try {
            await goldRateService.manualOverride(data.manualRate, data.isManual);
            toast.success(data.isManual ? "Manual Override Active" : "Switched to Auto Live Rates");
            setIsModalOpen(false);
            loadData();
        } catch (error) {
            toast.error("Failed to update override settings");
        }
    };

    const handleTriggerFetch = async () => {
        setIsRefreshing(true);
        try {
            await goldRateService.triggerFetch();
            toast.success("Fetched latest global rates");
            loadData();
        } catch (error) {
            toast.error("External fetch failed");
        } finally {
            setIsRefreshing(false);
        }
    };

    const current = rates[0];
    const previous = rates[1];
    const change = current && previous ? ((current.rateVnd - previous.rateVnd) / previous.rateVnd * 100).toFixed(2) : null;

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Gold Rate History" description="Track and update the daily gold price used for product pricing calculations."
                actions={
                    <div className="flex items-center gap-3">
                        <button onClick={handleTriggerFetch} disabled={isRefreshing} className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-200 transition-all disabled:opacity-50">
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} /> Fetch Latest
                        </button>
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 font-plus-jakarta text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(245,158,11,0.3)] hover:bg-amber-600">
                            <TrendingUp className="h-4 w-4" /> Manual Override
                        </button>
                    </div>
                }
            />

            {/* Live Rate Card */}
            {current && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`col-span-2 rounded-2xl border p-6 transition-all ${current.source === "Manual" ? "border-rose-200 bg-rose-50/50 dark:border-rose-900/30 dark:from-rose-900/10" : "border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50 dark:border-amber-800/30 dark:from-amber-900/20"}`}>
                        <div className="flex items-center justify-between">
                            <p className={`font-plus-jakarta text-[10px] font-bold uppercase tracking-widest ${current.source === "Manual" ? "text-rose-600" : "text-amber-600"}`}>
                                {current.source === "Manual" ? "Force Overridden Rate" : "Global Market Rate"}
                            </p>
                            {current.source === "Manual" ? <ShieldAlert className="h-4 w-4 text-rose-500" /> : <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                        </div>
                        <p className={`mt-2 font-plus-jakarta text-4xl font-bold ${current.source === "Manual" ? "text-rose-700 dark:text-rose-400" : "text-amber-700 dark:text-amber-400"}`}>
                            {current.rateVnd.toLocaleString()} VND
                        </p>
                        <p className={`mt-1 font-plus-jakarta text-sm font-medium ${current.source === "Manual" ? "text-rose-600/70" : "text-amber-600/70"}`}>
                            per gram · {current.source} Mode
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800/50 dark:bg-[#111]/70">
                        <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">Previous Rate</p>
                        {previous ? (
                            <>
                                <p className="mt-2 font-plus-jakarta text-2xl font-bold text-gray-900 dark:text-white">{previous.rateVnd.toLocaleString()} VND</p>
                                <p className="mt-1 font-plus-jakarta text-xs text-gray-400">{new Date(previous.recordedAt).toLocaleString()}</p>
                            </>
                        ) : <p className="mt-2 text-gray-400 text-sm">No previous rate</p>}
                    </div>
                </div>
            )}

            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white/70 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800/50 dark:bg-[#111]/70">
                <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800/50">
                    <h2 className="font-plus-jakarta text-base font-bold text-gray-900 dark:text-white">Rate History Log</h2>
                </div>
                {isLoading ? (
                    <div className="p-20 text-center font-plus-jakarta text-gray-500 animate-pulse">Loading logs...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full whitespace-nowrap text-left text-sm">
                            <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-[#1a1a1a]/50">
                                <tr>{["Rate (VND/gm)", "Source", "Status", "Recorded At"].map(h => <th key={h} className="px-6 py-4 font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{h}</th>)}</tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                                {rates.map((rate, i) => (
                                    <tr key={rate.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                        <td className="px-6 py-4">
                                            <span className={`font-plus-jakarta text-base font-bold ${i === 0 ? "text-amber-600" : "text-gray-700 dark:text-gray-200"}`}>{rate.rateVnd.toLocaleString()}</span>
                                            {i === 0 && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 font-plus-jakarta text-[10px] font-bold text-amber-600">ACTIVE</span>}
                                        </td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{rate.source}</td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${rate.source === "Manual" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                                                {rate.source === "Manual" ? "Override" : "Auto"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-plus-jakarta text-sm text-gray-500">{new Date(rate.recordedAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="System Pricing Control" subtitle="Force a manual gold rate override or switch back to automated live pricing" size="md"
                footer={<>
                    <button onClick={() => setIsModalOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-plus-jakarta text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300">Cancel</button>
                    <button onClick={handleSubmit(handleManualOverride)} className="rounded-xl bg-amber-500 px-4 py-2 font-plus-jakarta text-sm font-bold text-white hover:bg-amber-600">Apply Pricing Policy</button>
                </>}>
                <form className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2 p-4 rounded-xl bg-blue-50/50 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-800/30">
                        <div className="flex items-center justify-between">
                            <label className="font-plus-jakarta text-sm font-bold text-blue-900 dark:text-blue-400">Manual Override Mode</label>
                            <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-blue-600" {...register("isManual")} />
                        </div>
                        <p className="text-[11px] text-blue-700/70 font-medium">When active, the system will ignore external live prices and use your manual rate for all product calculations.</p>
                    </div>

                    <FormField label="Manual Rate (VND per gram)" required={isManualMode}>
                        <div className="relative">
                            <input type="number" disabled={!isManualMode} className={`${inputCls} ${!isManualMode ? "opacity-50" : ""}`} placeholder="8500000" {...register("manualRate")} />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">VND</span>
                        </div>
                        {errors.manualRate && <p className="text-rose-500 text-xs mt-1">{errors.manualRate.message}</p>}
                    </FormField>

                    {!isManualMode && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/30">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            <p className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider">Automated Live Pricing Active</p>
                        </div>
                    )}
                </form>
            </Modal>
        </div>
    );
}
