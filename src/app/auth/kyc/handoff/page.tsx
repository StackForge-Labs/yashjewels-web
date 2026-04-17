"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useInitKycSession, useKycSessionStatus } from "@/hooks/useAuth";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Loader2, CheckCircle2, RotateCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function KycHandoffPage() {
    const { profile: user, isLoading: isAuthLoading } = useAuthGuard();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [sessionToken, setSessionToken] = useState<string | null>(null);
    const [qrUrl, setQrUrl] = useState<string | null>(null);

    const initSession = useInitKycSession();
    const { data: statusRes, isLoading: isStatusLoading } = useKycSessionStatus(sessionToken || "", !!sessionToken);

    useEffect(() => {
        if (user && !sessionToken && !initSession.isPending) {
            handleInit();
        }
    }, [user, sessionToken]);

    const handleInit = async () => {
        try {
            const res = await initSession.mutateAsync();
            if (res.success && res.data) {
                setSessionToken(res.data.sessionToken);
                setQrUrl(res.data.qrUrl);
            }
        } catch (error) {
            console.error("Failed to init KYC session", error);
        }
    };

    const status = statusRes?.data;

    useEffect(() => {
        if (status === "Completed") {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            setTimeout(() => {
                router.push("/profile?kyc=success");
            }, 2000);
        }
    }, [status, queryClient]);

    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-[#f3f2ef] dark:bg-black flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f3f2ef] dark:bg-[#030303] flex items-center justify-center p-4">
            <div className="w-full max-w-[620px] bg-white dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 p-6 md:p-10 relative">

                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-semibold mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>

                {status === "Completed" ? (
                    <div className="py-12 text-center animate-in zoom-in duration-300">
                        <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Verification Successful!</h3>
                        <p className="text-gray-500">Redirecting to your profile...</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 w-12 h-16 bg-[#5f6b80] rounded-lg relative overflow-hidden flex flex-col pt-2 items-center shrink-0">
                            <div className="w-4 h-4 bg-emerald-700/80 rounded-full border-2 border-white/80 self-start ml-2 mb-1 z-10 shrink-0"></div>
                            <div className="w-8 h-0.5 bg-white/40 mb-1 rounded-full shrink-0"></div>
                            <div className="w-8 h-0.5 bg-white/40 mb-1 rounded-full shrink-0"></div>
                            <div className="w-8 h-0.5 bg-white/40 mb-1 rounded-full shrink-0"></div>
                            <div className="w-8 h-0.5 bg-white/40 mb-3 rounded-full shrink-0"></div>
                            <div className="w-1.5 h-1.5 bg-white/50 rounded-full mx-auto shrink-0 mt-auto mb-1.5"></div>
                        </div>

                        <h1 className="text-[28px] leading-[1.2] font-semibold text-gray-900 dark:text-white mb-3 tracking-tight">
                            Use your mobile device to verify
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-5 text-[15px] leading-relaxed">
                            Follow the instructions below to verify your identity using our secure mobile platform.
                        </p>

                        <p className="font-bold text-gray-900 dark:text-white mb-6 text-[15px]">
                            Camera app is required. <span className="text-[#0a66c2] dark:text-blue-400 cursor-pointer hover:underline">Using a smartphone</span>
                        </p>

                        <div className="flex flex-col md:flex-row gap-5 mb-6">
                            <div className="shrink-0 self-start">
                                <div className="w-[180px] h-[180px] border border-gray-300 dark:border-white/20 rounded-xl p-3.5 flex items-center justify-center bg-white shrink-0">
                                    {initSession.isPending ? (
                                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                                    ) : qrUrl ? (
                                        <div className="flex flex-col items-center">
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrUrl)}`}
                                                alt="KYC QR Code"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <button onClick={handleInit} className="flex flex-col items-center text-gray-500 hover:text-gray-800">
                                            <RotateCcw className="w-6 h-6 mb-2" />
                                            <span className="text-sm">Retry</span>
                                        </button>
                                    )}
                                </div>
                                {qrUrl && (
                                    <div className="mt-3 text-center">
                                        <a
                                            href={qrUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 underline truncate block max-w-[180px]"
                                        >
                                            [TEST ONLY: CLICK HERE]
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 bg-[#f9fafb] dark:bg-white/5 rounded-xl p-5 md:min-h-[180px] self-start">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-[15px]">Instructions:</h3>
                                <ul className="space-y-3.5 text-[15px] text-gray-800 dark:text-gray-200 leading-snug">
                                    <li>1. Open the camera app on your phone</li>
                                    <li>2. Scan the QR code on the left</li>
                                    <li>3. Follow the steps on your phone</li>
                                </ul>
                            </div>
                        </div>

                        <p className="font-bold text-[16px] text-gray-900 dark:text-white">
                            This page will refresh automatically once you've successfully verified.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
