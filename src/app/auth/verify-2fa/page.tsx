"use client";

import React, { useState, useEffect, Suspense } from "react";
import { ShieldCheck, Loader2, Smartphone, ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoginVerify2Fa } from "@/hooks/useAuth";
import { AuthAlert } from "../_components/AuthAlert";
import { getErrorMessage } from "@/lib/api-client";

const Verify2FaContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [otpCode, setOtpCode] = useState("");
    const [isVerifyingSuccess, setIsVerifyingSuccess] = useState(false);
    
    const loginVerify = useLoginVerify2Fa();

    // Redirect if no email
    useEffect(() => {
        if (!email) {
            router.push("/auth/login");
        }
    }, [email, router]);

    const handle2FaVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otpCode.length !== 6 || !email) return;
        
        loginVerify.mutate({ email, otp: otpCode }, {
            onSuccess: (res) => {
                if (res.success) {
                    setIsVerifyingSuccess(true);
                    // Artificial delay to show smooth transition
                    setTimeout(() => {
                        router.push("/");
                    }, 1200);
                }
            }
        });
    };

    const errorMessage = getErrorMessage(loginVerify.error);

    return (
        <section className="min-h-screen bg-white py-20 transition-colors dark:bg-[#050505] flex items-center justify-center">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-[480px]">
                    {/* Header */}
                    <div className="mb-10 flex flex-col items-center">
                        <div className="text-gold mb-6 relative">
                           <div className={`absolute inset-0 blur-2xl rounded-full transition-all duration-700 ${isVerifyingSuccess ? 'bg-emerald-500/30' : 'bg-gold/20'}`}></div>
                           {isVerifyingSuccess ? (
                               <CheckCircle2 size={64} className="relative z-10 text-emerald-500 animate-in zoom-in duration-500" strokeWidth={1.5} />
                           ) : (
                               <ShieldCheck size={64} className="relative z-10" strokeWidth={1} />
                           )}
                        </div>
                        <h1 className="font-serif text-2xl tracking-[0.2em] text-gray-900 uppercase dark:text-white">
                            {isVerifyingSuccess ? "Verified" : "Security Verification"}
                        </h1>
                        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            {isVerifyingSuccess 
                                ? "Identity confirmed. Redirecting to your dashboard..." 
                                : `Two-factor authentication is enabled for ${email}`}
                        </p>
                    </div>

                    {/* Verification Card */}
                    <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-2xl dark:border-white/5 dark:bg-[#0a0a0a]">
                        <div className="flex flex-col items-center mb-8">
                            <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl rotate-3 transition-colors duration-500 ${isVerifyingSuccess ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gold/10 text-gold'}`}>
                                {isVerifyingSuccess ? <CheckCircle2 size={32} /> : <Smartphone size={32} />}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {isVerifyingSuccess ? "Success!" : "Authenticator App"}
                            </h2>
                            <p className="text-xs text-gray-400 text-center px-4 uppercase tracking-widest font-medium">
                                {isVerifyingSuccess ? "Access granted" : "Enter the 6-digit code provided by your app"}
                            </p>
                        </div>

                        <AuthAlert message={errorMessage} />

                        <form onSubmit={handle2FaVerify} className="space-y-8">
                            <div className="relative group">
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="000 000"
                                    disabled={isVerifyingSuccess}
                                    className={`w-full text-center font-serif text-5xl tracking-[0.4em] h-24 rounded-2xl focus:ring-0 outline-hidden transition-all placeholder:text-gray-200 placeholder:tracking-normal ${
                                        isVerifyingSuccess 
                                        ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-500/5 dark:border-emerald-500/20" 
                                        : "bg-gray-50 border-gray-100 focus:border-gold dark:bg-black/40 dark:border-white/5 dark:text-white"
                                    }`}
                                    autoFocus
                                    autoComplete="one-time-code"
                                    inputMode="numeric"
                                />
                                {!isVerifyingSuccess && (
                                    <div className="absolute inset-0 rounded-2xl border-2 border-gold/0 group-focus-within:border-gold/30 pointer-events-none transition-all"></div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loginVerify.isPending || otpCode.length !== 6 || isVerifyingSuccess}
                                className={`flex h-16 w-full items-center justify-center rounded-2xl text-sm font-bold tracking-[0.2em] text-white uppercase transition-all shadow-xl ${
                                    isVerifyingSuccess 
                                    ? "bg-emerald-500 shadow-emerald-500/20 cursor-default" 
                                    : "bg-gold hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 shadow-gold/20"
                                }`}
                            >
                                {loginVerify.isPending || isVerifyingSuccess ? (
                                    <Loader2 size={24} className="animate-spin" />
                                ) : (
                                    <>
                                        Verify & Sign In <Lock size={18} className="ml-2" />
                                    </>
                                )}
                            </button>

                            <div className="pt-6 border-t border-gray-100 dark:border-white/5 text-center">
                                {!isVerifyingSuccess ? (
                                    <Link 
                                        href="/auth/login"
                                        className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-gray-400 uppercase hover:text-gold transition-colors"
                                    >
                                        <ArrowLeft size={14} /> Back to login
                                    </Link>
                                ) : (
                                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest animate-pulse">
                                        Redirecting to your jewelry collection...
                                    </span>
                                )}
                            </div>
                        </form>
                    </div>

                    <p className="mt-12 text-center text-[10px] text-gray-400 uppercase tracking-[0.25em] font-medium opacity-50">
                        Yash Jewels Maison Security Protocols
                    </p>
                </div>
            </div>
        </section>
    );
};

const Verify2FaPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
                <Loader2 className="animate-spin text-gold" size={40} />
            </div>
        }>
            <Verify2FaContent />
        </Suspense>
    );
};

export default Verify2FaPage;
