"use client";

import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { SocialLogin } from "../_components/SocialLogin";
import { useRegister } from "@/hooks/useAuth";
import { useRedirectIfAuthenticated } from "@/hooks/useAuthGuard";

const RegisterPage = () => {
    useRedirectIfAuthenticated();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const register = useRegister();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        register.mutate({ email, password, firstName, lastName });
    };

    const errorMessage =
        register.error?.message ||
        (register.data && !register.data.success
            ? register.data.errors?.[0] || register.data.message
            : null);

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

                        {errorMessage && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
                                {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                        First Name
                                    </label>
                                    <div className="relative flex items-center">
                                        <User className="absolute left-4 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="John"
                                            className="focus:border-gold w-full rounded-xl border border-gray-100 bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 outline-hidden transition-all focus:bg-white dark:border-white/5 dark:bg-[#111] dark:text-white"
                                            required
                                            disabled={register.isPending}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                        Last Name
                                    </label>
                                    <div className="relative flex items-center">
                                        <User className="absolute left-4 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Doe"
                                            className="focus:border-gold w-full rounded-xl border border-gray-100 bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 outline-hidden transition-all focus:bg-white dark:border-white/5 dark:bg-[#111] dark:text-white"
                                            required
                                            disabled={register.isPending}
                                        />
                                    </div>
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="focus:border-gold w-full rounded-xl border border-gray-100 bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 outline-hidden transition-all focus:bg-white dark:border-white/5 dark:bg-[#111] dark:text-white"
                                        required
                                        disabled={register.isPending}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                    Password
                                </label>
                                <div className="relative flex items-center">
                                    <Lock className="absolute left-4 text-gray-400" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        minLength={8}
                                        className="focus:border-gold w-full rounded-xl border border-gray-100 bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 outline-hidden transition-all focus:bg-white dark:border-white/5 dark:bg-[#111] dark:text-white"
                                        required
                                        disabled={register.isPending}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
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
                                disabled={register.isPending}
                                className="bg-gold mt-4 flex w-full items-center justify-center rounded-xl py-4 text-sm font-bold tracking-widest text-white uppercase transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {register.isPending ? (
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
