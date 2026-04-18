"use client";

import React, { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { ArrowRight, Loader2, MailCheck, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useVerifyEmail, useResendOtp } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/api-client";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30; // seconds

const maskEmail = (email: string) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    if (name.length <= 3) return `***@${domain}`;
    return `${name.substring(0, 2)}***${name.substring(name.length - 2)}@${domain}`;
};

const VerifyEmailPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const verify = useVerifyEmail();
    const resend = useResendOtp();

    // Init: Check session storage for email
    useEffect(() => {
        const stored = sessionStorage.getItem("verify_email");
        if (!stored) {
            router.push("/auth/register");
            return;
        }
        setEmail(stored);
    }, [router]);

    // Countdown timer
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    // Auto-focus first input
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-advance to next
        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (pasted.length === 0) return;

        const newOtp = [...otp];
        pasted.split("").forEach((char, i) => {
            newOtp[i] = char;
        });
        setOtp(newOtp);

        const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
        inputRefs.current[focusIdx]?.focus();
    };

    const handleSubmit = useCallback(
        (e?: React.FormEvent) => {
            e?.preventDefault();
            const code = otp.join("");
            if (code.length !== OTP_LENGTH || !email) return;

            verify.mutate(
                { email, code },
                {
                    onSuccess: (res) => {
                        if (res.success) {
                            setIsRedirecting(true);
                            sessionStorage.removeItem("verify_email");
                            // Add a small delay for better UX and to allow Redux state to propagate
                            setTimeout(() => {
                                router.push("/");
                            }, 1500);
                        }
                    },
                    onError: () => {
                        // Auto-clear OTP on error
                        setOtp(Array(OTP_LENGTH).fill(""));
                        inputRefs.current[0]?.focus();
                    },
                },
            );
        },
        [otp, email, verify],
    );

    // Auto-submit when all digits entered
    useEffect(() => {
        if (otp.every((d) => d !== "") && otp.join("").length === OTP_LENGTH) {
            handleSubmit();
        }
    }, [otp]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleResend = () => {
        if (cooldown > 0 || !email) return;
        resend.mutate({ email });
        setCooldown(RESEND_COOLDOWN);
    };

    const errorMessage = getErrorMessage(verify.error) || (verify.data && !verify.data.success ? verify.data.errors?.[0] : null);

    if (!email) return null;

    return (
        <section className="min-h-screen bg-white py-20 transition-colors dark:bg-[#050505]">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-[480px]">
                    {/* Header */}
                    <div className="mb-10 flex flex-col items-center">
                        <div className="text-gold mb-3">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 9L12 22L22 9L12 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                <path d="M2 9H22" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                <path d="M12 22V9" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                <path d="M12 2L7 9L12 22" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                <path d="M12 2L17 9L12 22" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h1 className="font-serif text-2xl tracking-[0.2em] text-gray-900 uppercase dark:text-white">
                            Verify Email
                        </h1>
                        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            One last step to access the Maison
                        </p>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#0a0a0a]">
                        <div className="mb-8 flex flex-col items-center text-center">
                            <div className="bg-gold/10 text-gold mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                                <MailCheck size={32} strokeWidth={1} />
                            </div>
                            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Enter OTP Code</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                We&apos;ve sent a 6-digit code to <span className="font-semibold text-gold">{maskEmail(email)}</span>
                            </p>
                        </div>

                        {errorMessage && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
                                {errorMessage}
                            </div>
                        )}

                        {verify.data?.success && (
                            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600 dark:border-emerald-900/30 dark:bg-emerald-950/30 dark:text-emerald-400">
                                Email verified successfully! Redirecting...
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* OTP Inputs */}
                            <div className="flex justify-center gap-3">
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        ref={(el) => {
                                            inputRefs.current[idx] = el;
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(idx, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(idx, e)}
                                        onPaste={idx === 0 ? handlePaste : undefined}
                                        className="focus:border-gold h-14 w-12 rounded-xl border border-gray-100 bg-gray-50 text-center text-xl font-bold text-gray-900 outline-hidden transition-all focus:bg-white dark:border-white/5 dark:bg-[#111] dark:text-white"
                                        disabled={verify.isPending}
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={verify.isPending || isRedirecting || otp.join("").length !== OTP_LENGTH}
                                className="bg-gold flex w-full items-center justify-center rounded-xl py-4 text-sm font-bold tracking-widest text-white uppercase transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {verify.isPending || isRedirecting ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        Verify <ArrowRight size={18} className="ml-2" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Resend */}
                        <div className="mt-6 text-center">
                            <button
                                onClick={handleResend}
                                disabled={cooldown > 0 || resend.isPending}
                                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:text-white"
                            >
                                <RotateCcw size={14} />
                                {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                            </button>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        Wrong email?{" "}
                        <Link href="/auth/register" className="font-bold text-gold hover:underline">
                            Register again
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default VerifyEmailPage;
