"use client";

import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { SocialLogin } from "../_components/SocialLogin";
import { AuthAlert } from "../_components/AuthAlert";
import { useRegister } from "@/hooks/useAuth";
import { useRedirectIfAuthenticated } from "@/hooks/useAuthGuard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getErrorMessage } from "@/lib/api-client";

const registerSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
    useRedirectIfAuthenticated();
    const [showPassword, setShowPassword] = useState(false);
    const registerMutation = useRegister();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data: RegisterFormValues) => {
        registerMutation.mutate(data);
    };

    const errorMessage = getErrorMessage(registerMutation.error) || (registerMutation.data && !registerMutation.data.success ? registerMutation.data.errors?.[0] : null);

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
                            Join the Maison
                        </h1>
                        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            Create an account to discover exclusive jewelry and bespoke services
                        </p>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#0a0a0a]">
                        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Register</h2>
                        <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
                            Enter your official details to become a member
                        </p>

                        <AuthAlert message={errorMessage} />

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                        First Name
                                    </label>
                                    <div className="relative flex items-center">
                                        <User className="absolute left-4 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            {...register("firstName")}
                                            placeholder="John"
                                            className={`focus:border-gold w-full rounded-xl border bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 outline-hidden transition-all focus:bg-white dark:bg-[#111] dark:text-white ${
                                                errors.firstName ? "border-red-500" : "border-gray-100 dark:border-white/5"
                                            }`}
                                            disabled={registerMutation.isPending}
                                        />
                                    </div>
                                    {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                        Last Name
                                    </label>
                                    <div className="relative flex items-center">
                                        <User className="absolute left-4 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            {...register("lastName")}
                                            placeholder="Doe"
                                            className={`focus:border-gold w-full rounded-xl border bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 outline-hidden transition-all focus:bg-white dark:bg-[#111] dark:text-white ${
                                                errors.lastName ? "border-red-500" : "border-gray-100 dark:border-white/5"
                                            }`}
                                            disabled={registerMutation.isPending}
                                        />
                                    </div>
                                    {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                    Email Address
                                </label>
                                <div className="relative flex items-center">
                                    <Mail className="absolute left-4 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        {...register("email")}
                                        placeholder="name@example.com"
                                        className={`focus:border-gold w-full rounded-xl border bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 outline-hidden transition-all focus:bg-white dark:bg-[#111] dark:text-white ${
                                            errors.email ? "border-red-500" : "border-gray-100 dark:border-white/5"
                                        }`}
                                        disabled={registerMutation.isPending}
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                    Password
                                </label>
                                <div className="relative flex items-center">
                                    <Lock className="absolute left-4 text-gray-400" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        {...register("password")}
                                        placeholder="••••••••"
                                        className={`focus:border-gold w-full rounded-xl border bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 outline-hidden transition-all focus:bg-white dark:bg-[#111] dark:text-white ${
                                            errors.password ? "border-red-500" : "border-gray-100 dark:border-white/5"
                                        }`}
                                        disabled={registerMutation.isPending}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                                <p className="text-xs text-gray-400">Minimum 8 characters</p>
                            </div>

                            <div className="space-y-4 pt-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                                <p>
                                    By creating an account, you agree to our{" "}
                                    <Link href="/policies/privacy" className="text-gold font-bold hover:underline">
                                        Privacy Policy
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/policies/terms" className="text-gold font-bold hover:underline">
                                        Terms & Conditions
                                    </Link>
                                    .
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={registerMutation.isPending}
                                className="bg-gold mt-4 flex w-full items-center justify-center rounded-xl py-4 text-sm font-bold tracking-widest text-white uppercase transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {registerMutation.isPending ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        Create Account <ArrowRight size={18} className="ml-2" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="my-8 flex items-center gap-4">
                            <div className="h-px flex-grow bg-gray-100 dark:bg-white/5"></div>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                                or sign up with
                            </span>
                            <div className="h-px flex-grow bg-gray-100 dark:bg-white/5"></div>
                        </div>

                        <SocialLogin />
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-gold font-bold hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default RegisterPage;
