"use client";

import React, { useState, Suspense } from "react";
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Loader2, KeyRound } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useResetPassword } from "@/hooks/useAuth";

const ResetPasswordPage = () => {
    const searchParams = useSearchParams();
    const emailFromUrl = searchParams.get("email") || "";

    const [email, setEmail] = useState(emailFromUrl);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const reset = useResetPassword();

    const passwordsMatch = newPassword === confirmPassword;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordsMatch) return;
        reset.mutate({ email, otp, newPassword });
    };

    const errorMessage =
        reset.error?.message ||
        (reset.data && !reset.data.success ? reset.data.errors?.[0] || reset.data.message : null);

    const successMessage =
        reset.data?.success ? reset.data.message || reset.data.data || "Password reset successful!" : null;

    return (
        <section className="min-h-screen bg-white py-20 transition-colors dark:bg-[#050505]">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-[480px]">
                    {/* Header */}
                    <div className="mb-10 flex flex-col items-center">
                        <div className="text-gold mb-3">
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 2L2 9L12 22L22 9L12 2Z"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinejoin="round"
                                />
                                <path d="M2 9H22" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                <path d="M12 22V9" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                <path
                                    d="M12 2L7 9L12 22"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M12 2L17 9L12 22"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <h1 className="font-serif text-2xl tracking-[0.2em] text-gray-900 uppercase dark:text-white">
                            Secure Credentials
                        </h1>
                        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            Establish a new secure access key for your personal collection
                        </p>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#0a0a0a]">
                        <div className="mb-8 flex flex-col items-center text-center">
                            <div className="bg-gold/10 text-gold mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                                <ShieldCheck size={32} strokeWidth={1} />
                            </div>
                            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                Reset Password
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Enter the OTP sent to your email and choose a new password
                            </p>
                        </div>

                        {errorMessage && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
                                {errorMessage}
                            </div>
                        )}

                        {successMessage && (
                            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600 dark:border-emerald-900/30 dark:bg-emerald-950/30 dark:text-emerald-400">
                                {successMessage} Redirecting to login...
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email (pre-filled from URL, editable if needed) */}
                            {!emailFromUrl && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                        Email Address
                                    </label>
                                    <div className="relative flex items-center">
                                        <Lock className="absolute left-4 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 transition-all outline-hidden focus:border-gold focus:bg-white dark:border-white/5 dark:bg-[#111] dark:text-white"
                                            required
                                            disabled={reset.isPending}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* OTP Code */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                    OTP Code
                                </label>
                                <div className="relative flex items-center">
                                    <KeyRound className="absolute left-4 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                        placeholder="123456"
                                        className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3.5 pr-4 pl-12 text-sm tracking-[0.3em] text-gray-900 transition-all outline-hidden focus:border-gold focus:bg-white dark:border-white/5 dark:bg-[#111] dark:text-white"
                                        required
                                        disabled={reset.isPending}
                                    />
                                </div>
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                    New Password
                                </label>
                                <div className="relative flex items-center">
                                    <Lock className="absolute left-4 text-gray-400" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        minLength={8}
                                        className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 transition-all outline-hidden focus:border-gold focus:bg-white dark:border-white/5 dark:bg-[#111] dark:text-white"
                                        required
                                        disabled={reset.isPending}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                    Confirm New Password
                                </label>
                                <div className="relative flex items-center">
                                    <Lock className="absolute left-4 text-gray-400" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={`w-full rounded-xl border bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 transition-all outline-hidden focus:bg-white dark:bg-[#111] dark:text-white ${
                                            confirmPassword && !passwordsMatch
                                                ? "border-red-300 focus:border-red-400 dark:border-red-800"
                                                : "border-gray-100 focus:border-gold dark:border-white/5"
                                        }`}
                                        required
                                        disabled={reset.isPending}
                                    />
                                </div>
                                {confirmPassword && !passwordsMatch && (
                                    <p className="text-xs text-red-500">Passwords do not match</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={reset.isPending || !passwordsMatch || otp.length !== 6}
                                className="bg-gold flex w-full items-center justify-center rounded-xl py-4 text-sm font-bold tracking-widest text-white uppercase transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {reset.isPending ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        Reset Password <ArrowRight size={18} className="ml-2" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Back to forgot password */}
                        <div className="mt-6 text-center">
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                            >
                                Didn't receive OTP? Request again
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default function ResetPasswordPageWrapper() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="text-gold h-8 w-8 animate-spin" /></div>}>
            <ResetPasswordPage />
        </Suspense>
    );
}
