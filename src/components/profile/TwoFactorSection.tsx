"use client";

import { useState, useEffect } from "react";
import { Shield, ShieldCheck, Loader2, Copy, AlertCircle, CheckCircle2, MapPin } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";
import { useSetup2Fa, useEnable2Fa, useDisable2Fa } from "@/hooks/useAuth";

interface TwoFactorSectionProps {
    isEnabled: boolean;
}

export function InlineToast({ message, type, onBlur }: { message: string, type: "success" | "error", onBlur?: () => void }) {
    useEffect(() => {
        if (onBlur) {
            const timer = setTimeout(onBlur, 4000);
            return () => clearTimeout(timer);
        }
    }, [onBlur]);

    return (
        <div className={`mt-4 flex items-center gap-3 rounded-xl p-4 text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-300 ${type === "success"
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
            : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
            }`}>
            {type === "success"
                ? <CheckCircle2 size={16} className="shrink-0" />
                : <AlertCircle size={16} className="shrink-0" />}
            {message}
        </div>
    );
}

export function TwoFactorSection({ isEnabled }: TwoFactorSectionProps) {
    const disable2Fa = useDisable2Fa();
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [isConfirmingDisable, setIsConfirmingDisable] = useState(false);
    const [disableCode, setDisableCode] = useState("");

    const handleDisable = async () => {
        if (disableCode.length !== 6) return;

        try {
            const res = await disable2Fa.mutateAsync(disableCode);
            if (res.success) {
                setToast({ message: "Two-factor authentication disabled successfully.", type: "success" });
                setIsConfirmingDisable(false);
                setDisableCode("");
            } else {
                setToast({ message: res.message || "Invalid or incorrect code.", type: "error" });
            }
        } catch {
            setToast({ message: "System error while disabling 2FA.", type: "error" });
        }
    };

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 dark:border-white/5 dark:bg-[#0a0a0a]">
            {/* Full-screen Modal Overlay for Disable Confirmation */}
            {isConfirmingDisable && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500"
                        onClick={() => setIsConfirmingDisable(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-8 dark:bg-[#0f0f0f] border border-white/5 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
                        <div className="text-center space-y-6">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                                <Shield size={32} />
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-serif text-2xl text-gray-900 dark:text-white uppercase tracking-wider">Disable 2FA</h4>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed px-4">
                                    For security reasons, please enter your verification code to continue.
                                </p>
                            </div>

                            <div className="relative">
                                <Input
                                    placeholder="0 0 0 0 0 0"
                                    value={disableCode}
                                    onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                    className="text-center font-serif text-4xl! tracking-[0.4em] h-20 bg-gray-50 dark:bg-black border-gray-100 dark:border-white/10 rounded-2xl focus:border-gold/50 font-bold placeholder:text-gray-200 dark:placeholder:text-gray-800"
                                    maxLength={6}
                                    autoFocus
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button 
                                    onClick={handleDisable}
                                    disabled={disable2Fa.isPending || disableCode.length !== 6}
                                    className="w-full bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold tracking-widest uppercase h-14 rounded-2xl shadow-xl shadow-red-900/20 transition-all active:scale-95"
                                >
                                    {disable2Fa.isPending ? <Loader2 size={18} className="animate-spin" /> : "Deactivate Now"}
                                </Button>
                                <button 
                                    onClick={() => {
                                        setIsConfirmingDisable(false);
                                        setDisableCode("");
                                    }}
                                    className="pt-2 text-[10px] font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 uppercase tracking-[0.2em] transition-colors"
                                >
                                    Cancel & Stay Protected
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isEnabled ? "bg-emerald-500/10 text-emerald-500" : "bg-gold/10 text-gold"}`}>
                        {isEnabled ? <ShieldCheck size={24} /> : <Shield size={24} />}
                    </div>
                    <div>
                        <h3 className="font-serif text-lg md:text-xl text-gray-900 dark:text-white uppercase tracking-wider">Two-Factor Authentication</h3>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                            {isEnabled
                                ? "Your account is currently protected by an extra layer of security."
                                : "Add an additional layer of security with OTP verification."}
                        </p>
                    </div>
                </div>

                {isEnabled ? (
                    <Button 
                        onClick={() => setIsConfirmingDisable(true)}
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 bg-red-50/50 dark:bg-red-500/10 text-[10px] font-bold tracking-[0.2em] uppercase transition-all px-6 border border-red-100/50 dark:border-red-500/20 hover:border-red-500 dark:hover:border-red-500/40 rounded-xl"
                        disabled={disable2Fa.isPending}
                    >
                        Disable
                    </Button>
                ) : (
                    <Link href="/profile/2fa/setup">
                        <Button className="bg-gold hover:bg-gold/90 text-white font-bold tracking-[0.2em] uppercase px-8 shadow-lg shadow-gold/20 rounded-xl transition-all active:scale-95">
                            Enable
                        </Button>
                    </Link>
                )}
            </div>

            {toast && <InlineToast message={toast.message} type={toast.type} onBlur={() => setToast(null)} />}
        </div>
    );
}
