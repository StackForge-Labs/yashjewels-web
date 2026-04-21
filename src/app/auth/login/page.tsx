"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SocialLogin } from "../_components/SocialLogin";
import { AuthAlert } from "../_components/AuthAlert";
import { useLogin } from "@/hooks/useAuth";
import { useRedirectIfAuthenticated } from "@/hooks/useAuthGuard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function resolveErrorMessage(raw: string | null | undefined): string | null {
    if (!raw) return null;
    const lower = raw.toLowerCase();
    
    // If the message already contains structured info from server (like "until [date]"), keep it.
    if (lower.includes("until")) return raw;

    if (lower.includes("permanently banned"))
        return "Your account has been permanently banned. Please contact support@yashjewels.com.";
    if (lower.includes("suspended"))
        return "Your account is temporarily suspended. Please try again later.";
        
    return raw;
}

const LoginContent = () => {
    useRedirectIfAuthenticated();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const returnUrl = searchParams.get("returnUrl");
    const login = useLogin();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { rememberMe: false },
    });

    React.useEffect(() => {
        const rememberedEmail = localStorage.getItem("remembered_email");
        if (rememberedEmail) {
            setValue("email", rememberedEmail);
            setValue("rememberMe", true);
        }
    }, [setValue]);

    const onSubmit = (data: LoginFormValues) => {
        if (data.rememberMe) {
            localStorage.setItem("remembered_email", data.email);
        } else {
            localStorage.removeItem("remembered_email");
        }
        setLoginError(null);
        login.mutate(data, {
            onSuccess: (res) => {
                if (res.requiresTwoFactor) {
                    router.push(`/auth/verify-2fa?email=${encodeURIComponent(data.email)}`);
                    return;
                }
                if (returnUrl) router.push(returnUrl);
            },
            onError: (err: any) => {
                console.log("[LOGIN ERROR]", err, "response:", err?.response, "data:", err?.response?.data);
                const res = err?.response?.data;
                if (res?.requiresTwoFactor) {
                    router.push(`/auth/verify-2fa?email=${encodeURIComponent(data.email)}`);
                    return;
                }
                const msg = res?.errors?.[0] ?? res?.message ?? err?.message ?? "An error occurred. Please try again.";
                console.log("[LOGIN ERROR] setting message:", msg);
                setLoginError(msg);
            },
        });
    };

    const errorMessage = resolveErrorMessage(loginError);

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
                            Yash Jewels
                        </h1>
                        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            The Maison of High Jewelry & Bespoke Diamonds
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#0a0a0a]">
                        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
                        <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
                            Please enter your details to sign in
                        </p>

                        {errorMessage && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
                                {errorMessage}
                            </div>
                        )}
                        <AuthAlert message={null} />

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Email Address</label>
                                <div className="relative flex items-center">
                                    <Mail className="absolute left-4 text-gray-400" size={18} />
                                    <input type="email" {...register("email")} placeholder="name@example.com"
                                        className={`focus:border-gold w-full rounded-xl border bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 outline-hidden transition-all focus:bg-white dark:bg-[#111] dark:text-white ${errors.email ? "border-red-500" : "border-gray-100 dark:border-white/5"}`}
                                        disabled={login.isPending} />
                                </div>
                                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Password</label>
                                <div className="relative flex items-center">
                                    <Lock className="absolute left-4 text-gray-400" size={18} />
                                    <input type={showPassword ? "text" : "password"} {...register("password")} placeholder="••••••••"
                                        className={`focus:border-gold w-full rounded-xl border bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 outline-hidden transition-all focus:bg-white dark:bg-[#111] dark:text-white ${errors.password ? "border-red-500" : "border-gray-100 dark:border-white/5"}`}
                                        disabled={login.isPending} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex cursor-pointer items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <input type="checkbox" {...register("rememberMe")} className="accent-gold h-4 w-4 rounded border-gray-200" />
                                    Remember me
                                </label>
                                <Link href="/auth/forgot-password" className="text-gold font-medium hover:underline">
                                    Forgot password?
                                </Link>
                            </div>

                            <button type="submit" disabled={login.isPending}
                                className="bg-gold flex w-full items-center justify-center rounded-xl py-4 text-sm font-bold tracking-widest text-white uppercase transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
                                {login.isPending ? <Loader2 size={18} className="animate-spin" /> : <>Sign In <ArrowRight size={18} className="ml-2" /></>}
                            </button>
                        </form>

                        <div className="my-8 flex items-center gap-4">
                            <div className="h-px flex-grow bg-gray-100 dark:bg-white/5"></div>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">or continue with</span>
                            <div className="h-px flex-grow bg-gray-100 dark:bg-white/5"></div>
                        </div>

                        <SocialLogin onError={(msg) => setLoginError(msg)} />
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/register" className="text-gold font-bold hover:underline">Request Membership</Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

const LoginPage = () => (
    <React.Suspense fallback={
        <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#050505]">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
    }>
        <LoginContent />
    </React.Suspense>
);

export default LoginPage;
