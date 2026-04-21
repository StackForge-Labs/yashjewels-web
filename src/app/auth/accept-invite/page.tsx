"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAcceptInvite } from "@/hooks/useAuth";
import { toast } from "sonner";

const acceptInviteSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type AcceptInviteValues = z.infer<typeof acceptInviteSchema>;

const AcceptInviteContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    
    const [showPassword, setShowPassword] = useState(false);
    const acceptInvite = useAcceptInvite();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AcceptInviteValues>({
        resolver: zodResolver(acceptInviteSchema),
    });

    if (!token) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
                <div className="rounded-2xl border border-rose-100 bg-rose-50 p-8 dark:border-rose-900/30 dark:bg-rose-950/20">
                    <h1 className="text-xl font-bold text-rose-600 dark:text-rose-400">Invalid Link</h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">The invitation token is missing or malformed.</p>
                    <button onClick={() => router.push("/auth/login")} className="mt-6 font-bold text-gray-900 hover:underline dark:text-white">Return to Login</button>
                </div>
            </div>
        );
    }

    const onSubmit = (data: AcceptInviteValues) => {
        acceptInvite.mutate({ token, password: data.password }, {
            onSuccess: (res) => {
                if (res.success) {
                    toast.success("Account activated! You can now log in.");
                } else {
                    toast.error(res.message);
                }
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || "Activation failed. The link might be expired.");
            }
        });
    };

    return (
        <section className="min-h-screen bg-white py-20 transition-colors dark:bg-[#050505]">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-[480px]">
                    <div className="mb-10 flex flex-col items-center">
                        <div className="text-emerald-600 mb-3">
                            <CheckCircle size={48} strokeWidth={1} />
                        </div>
                        <h1 className="font-serif text-2xl tracking-[0.2em] text-gray-900 uppercase dark:text-white">
                            Activate Account
                        </h1>
                        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            Welcome to the Yash Jewels Team. <br/>
                            <span className="font-bold text-gray-900 dark:text-white">{email}</span>
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#0a0a0a]">
                        <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Secure Your Account</h2>
                        <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
                            Please set a secure password to activate your access.
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">New Password</label>
                                <div className="relative flex items-center">
                                    <Lock className="absolute left-4 text-gray-400" size={18} />
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        {...register("password")} 
                                        placeholder="••••••••"
                                        className={`focus:border-blue-500 w-full rounded-xl border bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 outline-hidden transition-all focus:bg-white dark:bg-[#111] dark:text-white ${errors.password ? "border-red-500" : "border-gray-100 dark:border-white/5"}`}
                                        disabled={acceptInvite.isPending} 
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Confirm Password</label>
                                <div className="relative flex items-center">
                                    <Lock className="absolute left-4 text-gray-400" size={18} />
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        {...register("confirmPassword")} 
                                        placeholder="••••••••"
                                        className={`focus:border-blue-500 w-full rounded-xl border bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 outline-hidden transition-all focus:bg-white dark:bg-[#111] dark:text-white ${errors.confirmPassword ? "border-red-500" : "border-gray-100 dark:border-white/5"}`}
                                        disabled={acceptInvite.isPending} 
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={acceptInvite.isPending}
                                className="bg-emerald-600 flex w-full items-center justify-center rounded-xl py-4 text-sm font-bold tracking-widest text-white uppercase transition-all hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {acceptInvite.isPending ? <Loader2 size={18} className="animate-spin" /> : <>Activate Account <ArrowRight size={18} className="ml-2" /></>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

const AcceptInvitePage = () => (
    <React.Suspense fallback={
        <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#050505]">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
    }>
        <AcceptInviteContent />
    </React.Suspense>
);

export default AcceptInvitePage;
