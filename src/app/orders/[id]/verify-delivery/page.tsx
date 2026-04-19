"use client";

import React, { useState, useEffect } from "react";
import { use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ShieldCheck, 
    ChevronLeft, 
    CheckCircle2,
    Loader2,
    AlertCircle,
    QrCode,
    Download,
    Eye
} from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { BiometricCapture } from "../../../auth/kyc/_components/BiometricCapture";
import { PageHero } from "@/app/_components/PageHero";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/order.service";
import { toast } from "sonner";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

export default function VerifyDeliveryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: orderId } = use(params);
    const { profile, isLoading: isProfileLoading } = useAuthGuard();
    const [isVerifying, setIsVerifying] = useState(false);
    const [status, setStatus] = useState<"idle" | "capturing" | "verifying" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [qrToken, setQrToken] = useState<string | null>(null);
    const router = useRouter();

    const handleCapture = async (file: File) => {
        setIsVerifying(true);
        setStatus("verifying");
        
        // Convert file to base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64Image = reader.result as string;
            
            try {
                const res = await orderService.verifyDelivery(orderId, base64Image);

                if (res.success) {
                    setStatus("success");
                    setQrToken(res.data);
                    toast.success("Identity Verified! Your QR delivery token is ready.");
                } else {
                    setStatus("error");
                    setErrorMessage(res.message || "Face matching failed. Please try again.");
                }
            } catch (err: any) {
                setStatus("error");
                setErrorMessage(err.response?.data?.message || "An error occurred during verification.");
            } finally {
                setIsVerifying(false);
            }
        };
    };

    if (isProfileLoading || !profile) return null;

    return (
        <main className="min-h-screen bg-white dark:bg-[#050505]">
            <PageHero 
                title="Delivery Authorization" 
                subtitle="Biometric Step-up Verification for High-Value Acquisition."
                breadcrumbs={[{ label: "Order", href: `/orders/${orderId}` }, { label: "Verify Delivery" }]}
            />

            <div className="container mx-auto px-4 py-20 lg:px-12">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-12 flex items-center justify-between">
                        <Link href={`/orders/${orderId}`} className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 uppercase transition-all hover:text-gray-900 dark:hover:text-white">
                            <ChevronLeft size={16} /> Back to Order
                        </Link>
                        <div className="flex items-center gap-3 rounded-full bg-amber-500/10 px-4 py-2 text-[10px] font-bold tracking-widest text-amber-600 uppercase">
                            <ShieldCheck size={14} /> High Security Required
                        </div>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl md:p-12 dark:border-white/5 dark:bg-[#0a0a0a]">
                        <AnimatePresence mode="wait">
                            {status === "success" && qrToken ? (
                                <motion.div 
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-6 text-center"
                                >
                                    <div className="mb-8 text-emerald-500">
                                        <CheckCircle2 size={64} strokeWidth={1.5} />
                                    </div>
                                    <h2 className="font-serif text-3xl text-gray-900 dark:text-white">Verification Complete</h2>
                                    <p className="mt-4 max-w-md text-gray-500 dark:text-gray-400">
                                        Your identity has been verified. Present this single-use QR code to our secure courier upon arrival.
                                    </p>

                                    <div className="mt-10 mb-10 p-8 bg-white rounded-3xl shadow-lg border border-gray-100">
                                        <QRCodeSVG 
                                            value={qrToken} 
                                            size={200}
                                            level="H"
                                            includeMargin={true}
                                        />
                                        <p className="mt-6 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase italic">
                                            Expiry: 2 Hours from issuance
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                                        <button 
                                            onClick={() => window.print()} 
                                            className="flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-800 text-white rounded-xl px-8 py-4 text-xs font-bold tracking-widest uppercase transition-all hover:brightness-110"
                                        >
                                            <Download size={16} /> Save QR Code
                                        </button>
                                        <Link 
                                            href={`/orders/${orderId}`}
                                            className="flex items-center justify-center gap-2 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white rounded-xl px-8 py-4 text-xs font-bold tracking-widest uppercase transition-all hover:bg-gray-50 dark:hover:bg-zinc-900"
                                        >
                                            <Eye size={16} /> Order Timeline
                                        </Link>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="space-y-10">
                                    <div className="text-center">
                                        <h2 className="font-serif text-3xl text-gray-900 dark:text-white">Secure Delivery Handover</h2>
                                        <p className="mt-4 text-gray-500 dark:text-gray-400">Our courier requires a unique QR token to release your high-value order. Please confirm your identity to generate your secure token.</p>
                                    </div>

                                    {status === "verifying" && (
                                        <div className="flex flex-col items-center justify-center py-20 space-y-6">
                                            <Loader2 className="animate-spin text-amber-600" size={48} />
                                            <p className="text-sm font-bold tracking-[0.2em] text-gray-950 dark:text-white uppercase font-plus-jakarta">Securing acquisition...</p>
                                        </div>
                                    )}

                                    {(status === "idle" || status === "error") && (
                                        <div className="mx-auto max-w-2xl">
                                            {status === "error" && (
                                                <div className="mb-8 flex items-center gap-4 rounded-2xl bg-rose-50 p-6 border border-rose-100 dark:bg-rose-500/5 dark:border-rose-500/10">
                                                    <AlertCircle className="shrink-0 text-rose-500" size={24} />
                                                    <div className="text-xs text-rose-800 dark:text-rose-400 leading-relaxed font-medium">
                                                        <p className="font-bold mb-1 uppercase tracking-widest font-plus-jakarta">Verification Failed</p>
                                                        <p>{errorMessage}</p>
                                                    </div>
                                                </div>
                                            )}

                                            <BiometricCapture onCapture={handleCapture} />
                                            
                                            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="rounded-2xl bg-gray-50 p-6 dark:bg-white/2 border border-gray-100 dark:border-white/5">
                                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 font-plus-jakarta">Zero-OTP Protocol</h4>
                                                    <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                                                        By using biometric verification, you don't need to wait for SMS or share private phone numbers with couriers.
                                                    </p>
                                                </div>
                                                <div className="rounded-2xl bg-amber-500/5 p-6 border border-amber-500/10">
                                                    <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-3 font-plus-jakarta">Single-Use Token</h4>
                                                    <p className="text-[11px] text-amber-600/70 leading-relaxed">
                                                        The generated QR is valid for 2 hours and burned immediately after the first successful scan for maximum safety.
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
