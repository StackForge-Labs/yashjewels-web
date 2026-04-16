"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ShieldCheck, 
    Camera, 
    ChevronLeft, 
    CheckCircle2,
    Loader2,
    AlertCircle,
    ArrowRight
} from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { BiometricCapture } from "../_components/BiometricCapture";
import { PageHero } from "@/app/_components/PageHero";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import Link from "next/link";

export default function KycLivenessPage() {
    const { profile, isLoading: isProfileLoading } = useAuthGuard();
    const [isVerifying, setIsVerifying] = useState(false);
    const [status, setStatus] = useState<"idle" | "capturing" | "verifying" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleCapture = async (file: File) => {
        setIsVerifying(true);
        setStatus("verifying");
        
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await apiClient.post("/user/kyc/verify-liveness", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data.success) {
                setStatus("success");
                toast.success("Identity Verified Successfully!");
            } else {
                setStatus("error");
                setErrorMessage(res.data.message || "Face matching failed. Please try again.");
            }
        } catch (err: any) {
            setStatus("error");
            setErrorMessage(err.response?.data?.message || "An error occurred during verification.");
        } finally {
            setIsVerifying(false);
        }
    };

    if (isProfileLoading || !profile) return null;

    return (
        <main className="min-h-screen bg-white dark:bg-[#050505]">
            <PageHero 
                title="Souverain Verification" 
                subtitle="Biometric Liveness Detection for Level 2 Access."
                breadcrumbs={[{ label: "Profile", href: "/profile" }, { label: "Liveness" }]}
            />

            <div className="container mx-auto px-4 py-20 lg:px-12">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-12 flex items-center justify-between">
                        <Link href="/profile" className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 uppercase transition-all hover:text-gray-900 dark:hover:text-white">
                            <ChevronLeft size={16} /> Back to Maison
                        </Link>
                        <div className="flex items-center gap-3 rounded-full bg-gold/10 px-4 py-2 text-[10px] font-bold tracking-widest text-gold uppercase">
                            <ShieldCheck size={14} /> Level 2 Mandatory
                        </div>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl md:p-12 dark:border-white/5 dark:bg-[#0a0a0a]">
                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <motion.div 
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-10 text-center"
                                >
                                    <div className="mb-10 text-emerald-500">
                                        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.2)] dark:bg-emerald-500/5">
                                            <CheckCircle2 size={72} strokeWidth={1} />
                                        </div>
                                    </div>
                                    <h2 className="font-serif text-4xl text-gray-900 dark:text-white">Identity Confirmed</h2>
                                    <p className="mt-6 max-w-lg text-lg text-gray-500 dark:text-gray-400">
                                        Your live biometric scan matches our records perfectly. You now have full sovereign access to all Yash Jewels services.
                                    </p>
                                    <button 
                                        onClick={() => router.push("/profile")} 
                                        className="bg-gold mt-12 min-w-[250px] rounded-xl px-10 py-5 text-sm font-bold tracking-widest text-white uppercase transition-all hover:brightness-110"
                                    >
                                        Return to Dashboard
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="space-y-10">
                                    <div className="text-center">
                                        <h2 className="font-serif text-3xl text-gray-900 dark:text-white">Real-time Liveness Scan</h2>
                                        <p className="mt-4 text-gray-500 dark:text-gray-400">To ensure security, please follow the movements guided by our AI assistant.</p>
                                    </div>

                                    {status === "verifying" && (
                                        <div className="flex flex-col items-center justify-center py-20 space-y-6">
                                            <Loader2 className="animate-spin text-gold" size={48} />
                                            <p className="text-sm font-bold tracking-[0.2em] text-gray-950 dark:text-white uppercase">Matching with records...</p>
                                        </div>
                                    )}

                                    {(status === "idle" || status === "error") && (
                                        <div className="mx-auto max-w-2xl">
                                            {status === "error" && (
                                                <div className="mb-8 flex items-center gap-4 rounded-2xl bg-rose-50 p-6 border border-rose-100 dark:bg-rose-500/5 dark:border-rose-500/10">
                                                    <AlertCircle className="shrink-0 text-rose-500" size={24} />
                                                    <div className="text-xs text-rose-800 dark:text-rose-400 leading-relaxed font-medium">
                                                        <p className="font-bold mb-1 uppercase tracking-widest">Verification Failed</p>
                                                        <p>{errorMessage}</p>
                                                    </div>
                                                </div>
                                            )}

                                            <BiometricCapture onCapture={handleCapture} />
                                            
                                            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="rounded-2xl bg-gray-50 p-6 dark:bg-white/2 border border-gray-100 dark:border-white/5">
                                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Requirements</h4>
                                                    <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-400">
                                                        <li className="flex items-center gap-2 italic">No glasses or hats</li>
                                                        <li className="flex items-center gap-2 italic">Centered, stable lighting</li>
                                                        <li className="flex items-center gap-2 italic">Follow the sequence exactly</li>
                                                    </ul>
                                                </div>
                                                <div className="rounded-2xl bg-gold/5 p-6 border border-gold/10">
                                                    <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-3">AI Security</h4>
                                                    <p className="text-xs text-gold/70 leading-relaxed italic">
                                                        Powered by FPT.AI Biometric Match. Your data remains encrypted and sovereign.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}
