"use client";

import React, { useState, useEffect, Suspense } from "react";
import { ShieldCheck, Loader2, Smartphone, ArrowLeft, Lock } from "lucide-react";
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
        
        loginVerify.mutate({ email, otp: otpCode });
    };

    const errorMessage = getErrorMessage(loginVerify.error);

    return (
        <section className="min-h-screen bg-white py-20 transition-colors dark:bg-[#050505] flex items-center justify-center">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-[480px]">
                    {/* Header */}
                    <div className="mb-10 flex flex-col items-center">
                        <div className="text-gold mb-6 relative">
                           <div className="absolute inset-0 bg-gold/20 blur-2xl rounded-full"></div>
                           <ShieldCheck size={64} className="relative z-10" strokeWidth={1} />
                        </div>
                        <h1 className="font-serif text-2xl tracking-[0.2em] text-gray-900 uppercase dark:text-white">
                            Security Verification
                        </h1>
                        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            Two-factor authentication is enabled for <strong>{email}</strong>
                        </p>
                    </div>

                    {/* Verification Card */}
                    <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-2xl dark:border-white/5 dark:bg-[#0a0a0a]">
                        <div className="flex flex-col items-center mb-8">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 text-gold rotate-3">
                                <Smartphone size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Authenticator App</h2>
                            <p className="text-xs text-gray-400 text-center px-4 uppercase tracking-widest font-medium">
                                Enter the 6-digit code provided by your app
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
                                    className="w-full text-center font-serif text-5xl tracking-[0.4em] h-24 bg-gray-50 border-gray-100 rounded-2xl focus:border-gold focus:ring-0 dark:bg-black/40 dark:border-white/5 dark:text-white outline-hidden transition-all placeholder:text-gray-200 placeholder:tracking-normal"
                                    autoFocus
                                    autoComplete="one-time-code"
                                    inputMode="numeric"
                                />
                                <div className="absolute inset-0 rounded-2xl border-2 border-gold/0 group-focus-within:border-gold/30 pointer-events-none transition-all"></div>
                            </div>

                            <button
                                type="submit"
                                disabled={loginVerify.isPending || otpCode.length !== 6}
                                className="bg-gold flex h-16 w-full items-center justify-center rounded-2xl text-sm font-bold tracking-[0.2em] text-white uppercase transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 shadow-xl shadow-gold/20"
                            >
                                {loginVerify.isPending ? (
                                    <Loader2 size={24} className="animate-spin" />
                                ) : (
                                    <>
                                        Verify & Sign In <Lock size={18} className="ml-2" />
                                    </>
                                )}
                            </button>

                            <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                                <Link 
                                    href="/auth/login"
                                    className="flex items-center justify-center gap-2 text-xs font-bold tracking-[0.2em] text-gray-400 uppercase hover:text-gold transition-colors"
                                >
                                    <ArrowLeft size={14} /> Back to login
                                </Link>
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
