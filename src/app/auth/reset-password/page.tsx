"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Loader2, KeyRound, MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useResetPassword } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getErrorMessage } from "@/lib/api-client";
import { AuthAlert } from "../_components/AuthAlert";

const resetPasswordSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    otp: z.string().length(6, "OTP code must be 6 digits"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const reset = useResetPassword();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
    });

    useEffect(() => {
        const stored = sessionStorage.getItem("reset_email");
        if (stored) {
            setEmail(stored);
            setValue("email", stored);
        }
    }, [setValue]);

    const onSubmit = (data: ResetPasswordFormValues) => {
        reset.mutate(
            {
                email: data.email,
                otp: data.otp,
                newPassword: data.newPassword,
            },
            {
                onSuccess: (res) => {
                    if (res.success) {
                        sessionStorage.removeItem("reset_email");
                    }
                },
            },
        );
    };

    const errorMessage = getErrorMessage(reset.error) || (reset.data && !reset.data.success ? reset.data.errors?.[0] : null);
    const successMessage = reset.data?.success ? reset.data.message || "Password reset successful!" : null;

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

                        <AuthAlert message={errorMessage} type="error" />
                        <AuthAlert message={successMessage} type="success" />

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                    Email Address
                                </label>
                                <div className="relative flex items-center">
                                    <MailCheck className="absolute left-4 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        {...register("email")}
                                        placeholder="your@email.com"
                                        readOnly={!!email}
                                        className={`w-full rounded-xl border bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 transition-all outline-hidden focus:border-gold focus:bg-white dark:bg-[#111] dark:text-white ${
                                            errors.email ? "border-red-500" : "border-gray-100 dark:border-white/5"
                                        } ${email ? "cursor-not-allowed opacity-70" : ""}`}
                                        disabled={reset.isPending}
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                            </div>

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
                                        {...register("otp")}
                                        placeholder="123456"
                                        className={`w-full rounded-xl border bg-gray-50 py-3.5 pr-4 pl-12 text-sm tracking-[0.3em] text-gray-900 transition-all outline-hidden focus:border-gold focus:bg-white dark:bg-[#111] dark:text-white ${
                                            errors.otp ? "border-red-500" : "border-gray-100 dark:border-white/5"
                                        }`}
                                        disabled={reset.isPending}
                                    />
                                </div>
                                {errors.otp && <p className="text-xs text-red-500">{errors.otp.message}</p>}
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
                                        {...register("newPassword")}
                                        placeholder="••••••••"
                                        className={`w-full rounded-xl border bg-gray-50 py-3.5 pr-10 pl-12 text-sm text-gray-900 transition-all outline-hidden focus:border-gold focus:bg-white dark:bg-[#111] dark:text-white ${
                                            errors.newPassword ? "border-red-500" : "border-gray-100 dark:border-white/5"
                                        }`}
                                        disabled={reset.isPending}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword.message}</p>}
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
                                        {...register("confirmPassword")}
                                        placeholder="••••••••"
                                        className={`w-full rounded-xl border bg-gray-50 py-3.5 pr-10 pl-12 text-sm text-gray-900 transition-all outline-hidden focus:border-gold focus:bg-white dark:bg-[#111] dark:text-white ${
                                            errors.confirmPassword ? "border-red-500" : "border-gray-100 dark:border-white/5"
                                        }`}
                                        disabled={reset.isPending}
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={reset.isPending}
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

                        <div className="mt-6 text-center">
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                            >
                                Didn&apos;t receive OTP? Request again
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResetPasswordPage;
