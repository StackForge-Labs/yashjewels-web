"use client";

import React, { useState, Suspense } from "react";
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import apiClient, { getErrorMessage } from "@/lib/api-client";
import { AuthAlert } from "../_components/AuthAlert";
import type { ApiResponse } from "@/types/user.types";

const schema = z.object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
type FormValues = z.infer<typeof schema>;

function SetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";

    const [showPassword, setShowPassword] = useState(false);

    const mutation = useMutation({
        mutationFn: (data: { token: string; newPassword: string }) =>
            apiClient.post<ApiResponse<string>>("/auth/set-password", data).then((r) => r.data),
        onSuccess: (res) => {
            if (res.success) {
                setTimeout(() => router.push("/auth/login"), 1800);
            }
        },
    });

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormValues) => {
        if (!token) return;
        mutation.mutate({ token, newPassword: data.newPassword });
    };

    const errorMessage = getErrorMessage(mutation.error) ||
        (mutation.data && !mutation.data.success ? mutation.data.errors?.[0] : null);
    const successMessage = mutation.data?.success
        ? "Password set! Redirecting to login..."
        : null;

    if (!token) {
        return (
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center dark:border-red-900/30 dark:bg-[#0a0a0a]">
                <p className="font-medium text-rose-600">Invalid or missing magic link token. Please request a new invitation.</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#0a0a0a]">
            <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500 dark:bg-amber-900/20">
                    <ShieldCheck size={32} strokeWidth={1} />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Set Your Password</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Choose a secure password to activate your Yash Jewels account.
                </p>
            </div>

            <AuthAlert message={errorMessage} type="error" />
            <AuthAlert message={successMessage} type="success" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">New Password</label>
                    <div className="relative flex items-center">
                        <Lock className="absolute left-4 text-gray-400" size={18} />
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("newPassword")}
                            placeholder="••••••••"
                            className={`w-full rounded-xl border bg-gray-50 py-3.5 pr-10 pl-12 text-sm text-gray-900 outline-hidden transition-all focus:border-amber-400 focus:bg-white dark:bg-[#111] dark:text-white ${errors.newPassword ? "border-red-500" : "border-gray-100 dark:border-white/5"}`}
                            disabled={mutation.isPending}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-400">
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Confirm Password</label>
                    <div className="relative flex items-center">
                        <Lock className="absolute left-4 text-gray-400" size={18} />
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("confirmPassword")}
                            placeholder="••••••••"
                            className={`w-full rounded-xl border bg-gray-50 py-3.5 pr-10 pl-12 text-sm text-gray-900 outline-hidden transition-all focus:border-amber-400 focus:bg-white dark:bg-[#111] dark:text-white ${errors.confirmPassword ? "border-red-500" : "border-gray-100 dark:border-white/5"}`}
                            disabled={mutation.isPending}
                        />
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending || mutation.data?.success}
                    className="flex w-full items-center justify-center rounded-xl bg-amber-500 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-amber-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {mutation.isPending ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <>Activate Account <ArrowRight size={18} className="ml-2" /></>
                    )}
                </button>
            </form>
        </div>
    );
}

export default function SetPasswordPage() {
    return (
        <section className="min-h-screen bg-white py-20 transition-colors dark:bg-[#050505]">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-[480px]">
                    <div className="mb-10 flex flex-col items-center">
                        <div className="mb-3 text-amber-500">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 9L12 22L22 9L12 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                <path d="M2 9H22" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                <path d="M12 22V9" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                <path d="M12 2L7 9L12 22" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                <path d="M12 2L17 9L12 22" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h1 className="font-serif text-2xl uppercase tracking-[0.2em] text-gray-900 dark:text-white">Yash Jewels</h1>
                        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            Welcome — set a password to activate your account
                        </p>
                    </div>
                    <Suspense fallback={<div className="text-center text-sm text-gray-400 py-8">Loading...</div>}>
                        <SetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </section>
    );
}
