"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSubmitMobileKyc } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { KycCamera } from "@/components/kyc/KycCamera";

function KycMobileContent() {
    const searchParams = useSearchParams();
    const sessionToken = searchParams.get("session");
    const [step, setStep] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const submitKyc = useSubmitMobileKyc();

    useEffect(() => {
        if (!sessionToken) {
            setError("Invalid authentication session. Please scan the QR code again.");
        }
    }, [sessionToken]);

    const handleCapture = async (capturedImages: { front: string; back: string; face: string }) => {
        if (!sessionToken) return;

        try {
            const res = await submitKyc.mutateAsync({
                sessionToken: sessionToken,
                request: {
                    idCardFrontBase64: capturedImages.front,
                    idCardBackBase64: capturedImages.back,
                    faceBase64: capturedImages.face
                }
            });

            if (res.success) {
                setStep(3);
            } else {
                setError(res.message || "Profile submission failed. Try again later.");
                setStep(1);
            }
        } catch (err: any) {
            setError("Server connection error. Please check your network.");
            setStep(1);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <Card className="w-full max-w-sm border-white/10 bg-white/5">
                    <CardContent className="pt-10 text-center space-y-4">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                        <h2 className="text-xl font-bold text-white">System Error</h2>
                        <p className="text-slate-400 text-sm">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-6 py-2 rounded-full bg-yellow-500 text-black font-bold"
                        >
                            Try again
                        </button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col text-white">
            {step === 1 && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                            <ShieldCheck className="w-14 h-14 text-yellow-500" />
                        </div>
                    </div>

                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-yellow-400">Identity Verification</h1>
                        <p className="text-slate-400 text-sm">Please prepare your ID/Passport</p>
                    </div>

                    <div className="w-full space-y-4 text-sm text-slate-400">
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-[10px]">1</div>
                            <span>Capture front & back of ID/Passport</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-[10px]">2</div>
                            <span>Capture portrait of yourself</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-[10px]">3</div>
                            <span>AI comparison & profile completion</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setStep(2)}
                        className="w-full max-w-xs h-14 rounded-full font-bold bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                    >
                        Start
                    </button>
                </div>
            )}

            {step === 2 && (
                <KycCamera 
                    onCapture={handleCapture}
                    onCancel={() => setStep(1)}
                />
            )}

            {step === 3 && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                        <ShieldCheck className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white font-serif">Profile Submitted!</h2>
                    <p className="text-slate-400 text-sm">The system is performing face matching. Results will be updated on your computer shortly.</p>
                </div>
            )}
        </div>
    );
}

export default function KycMobilePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <KycMobileContent />
        </Suspense>
    );
}
