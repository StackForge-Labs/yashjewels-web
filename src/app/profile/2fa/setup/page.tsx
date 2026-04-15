"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, ShieldCheck, Loader2, Copy, AlertCircle, CheckCircle2, ArrowLeft, Smartphone, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";
import { useSetup2Fa, useEnable2Fa } from "@/hooks/useAuth";
import Link from "next/link";
import { InlineToast } from "@/components/profile/TwoFactorSection";

export default function TwoFactorSetupPage() {
    const router = useRouter();
    const [otpCode, setOtpCode] = useState("");
    const [qrData, setQrData] = useState<{ sharedKey: string; authenticatorUri: string } | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const setup2Fa = useSetup2Fa();
    const enable2Fa = useEnable2Fa();

    useEffect(() => {
        const initSetup = async () => {
            try {
                const res = await setup2Fa.mutateAsync();
                if (res.success && res.data) {
                    setQrData(res.data);
                } else {
                    setToast({ message: res.message || "Failed to initialize 2FA", type: "error" });
                }
            } catch {
                setToast({ message: "Server connection failed. Please try again.", type: "error" });
            }
        };
        initSetup();
    }, []);

    const handleVerifyAndEnable = async () => {
        if (otpCode.length !== 6) {
            setToast({ message: "Please enter all 6 digits.", type: "error" });
            return;
        }

        try {
            const res = await enable2Fa.mutateAsync(otpCode);
            if (res.success) {
                setIsSuccess(true);
                setToast({ message: "Two-factor authentication enabled successfully!", type: "success" });
                setTimeout(() => {
                    router.push("/profile");
                }, 2000);
            } else {
                setToast({ message: res.message || "Incorrect verification code.", type: "error" });
            }
        } catch {
            setToast({ message: "Verification failed. Please try again.", type: "error" });
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setToast({ message: "Secret key copied to clipboard!", type: "success" });
    };

    if (setup2Fa.isPending && !qrData) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
                <div className="text-center space-y-4">
                    <Loader2 size={48} className="animate-spin text-gold mx-auto" />
                    <p className="text-gray-400 font-serif tracking-widest uppercase text-xs">Initializing Secure Setup...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50/50 dark:bg-[#050505] text-gray-900 dark:text-white py-12 md:py-20 px-4 transition-colors duration-500">
            <div className="max-w-5xl mx-auto">
                {/* Header Navigation */}
                <div className="mb-10 flex items-center justify-between">
                    <Link href="/profile" className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold tracking-widest uppercase">Back to Profile</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Shield className="text-gold" size={24} />
                        <h1 className="font-serif text-xl md:text-2xl tracking-wider uppercase">Secure 2FA Setup</h1>
                    </div>
                </div>

                {toast && <InlineToast message={toast.message} type={toast.type} onBlur={() => setToast(null)} />}

                <div className="mt-8 overflow-hidden rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#0a0a0a] shadow-2xl shadow-gray-200/50 dark:shadow-none">
                    <div className="grid grid-cols-1 lg:grid-cols-12">
                        {/* Left Column: QR Code Visual */}
                        <div className="lg:col-span-5 bg-gray-50/50 dark:bg-[#0d0d0d] p-10 md:p-16 flex flex-col items-center justify-center border-r border-gray-100 dark:border-white/5">
                            <div className="relative group">
                                {/* Decorative Outer Ring */}
                                <div className="absolute -inset-4 bg-gold/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                <div className="relative p-6 bg-white rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-[1.02]">
                                    {qrData && <QRCodeSVG value={qrData.authenticatorUri} size={220} level="H" bgColor="#FFFFFF" fgColor="#000000" />}
                                </div>
                            </div>

                            <div className="mt-10 text-center space-y-4">
                                <div className="flex items-center justify-center gap-3 text-gold">
                                    <Smartphone size={18} />
                                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Scan QR Code</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[240px] leading-relaxed">
                                    Use Authy, Google Authenticator, or any compatible 2FA app.
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Steps & Action */}
                        <div className="lg:col-span-7 p-10 md:p-16 space-y-12">
                            {/* Step 1 */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-gold text-xs font-bold border border-gold/20">1</div>
                                    <h2 className="font-serif text-lg tracking-wide uppercase">Register Application</h2>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                    Scan the QR code or manually enter the secret key into your authenticator app to establish the connection:
                                </p>
                                <div className="group relative">
                                    <div className="flex items-center gap-4 rounded-2xl bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/5 p-5 transition-all group-hover:border-gold/30">
                                        <Key className="text-gold/40 shrink-0" size={20} />
                                        <code className="flex-1 font-mono text-sm tracking-[0.15em] text-gold font-bold break-all uppercase">
                                            {qrData?.sharedKey || "Generating..."}
                                        </code>
                                        <button
                                            type="button"
                                            onClick={() => qrData && copyToClipboard(qrData.sharedKey)}
                                            className="shrink-0 p-2 text-gray-400 hover:text-gold transition-all active:scale-95"
                                        >
                                            <Copy size={20} />
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* Step 2 */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-gold text-xs font-bold border border-gold/20">2</div>
                                    <h2 className="font-serif text-lg tracking-wide uppercase">Confirm Activation</h2>
                                </div>
                                <div className="space-y-6">
                                    <div className="relative">
                                        <Input
                                            placeholder="· · ·  · · ·"
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                            className="text-center font-serif text-5xl! tracking-[0.6em] h-24 bg-gray-50 dark:bg-black border-gray-100 dark:border-white/5 focus:border-gold/50 rounded-2xl transition-all font-bold placeholder:text-gray-300 dark:placeholder:text-gray-800"
                                            maxLength={6}
                                            inputMode="numeric"
                                            disabled={isSuccess}
                                        />
                                        {isSuccess && (
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500 animate-in zoom-in duration-300">
                                                <CheckCircle2 size={40} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button
                                            onClick={handleVerifyAndEnable}
                                            disabled={enable2Fa.isPending || otpCode.length !== 6 || isSuccess}
                                            className="flex-1 h-14 bg-gold hover:bg-gold/90 text-[#050505] font-bold tracking-[0.2em] uppercase rounded-2xl shadow-lg shadow-gold/20 transition-all active:scale-95 disabled:opacity-30"
                                        >
                                            {enable2Fa.isPending ? <Loader2 size={24} className="animate-spin" /> : "Activate Security"}
                                        </Button>

                                        <Link href="/profile" className="flex-1">
                                            <Button variant="ghost" className="w-full h-14 text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold tracking-[0.2em] uppercase rounded-2xl">
                                                Cancel Setup
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Footer Security Note */}
                <div className="mt-12 flex items-center justify-center gap-4 text-gray-400 dark:text-gray-600">
                    <ShieldCheck size={16} />
                    <p className="text-[10px] font-bold tracking-widest uppercase">Military-grade 256-bit Encryption</p>
                </div>
            </div>
        </main>
    );
}
