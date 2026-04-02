"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Facebook } from "../../_components/icon/Facebook";
import { Instagram } from "../../_components/icon/Instagram";
import { Youtube } from "../../_components/icon/Youtube";
import Link from "next/link";
import { SocicalLogin } from "../_components/SocicalLogin";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

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

                        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                    Email Address
                                </label>
                                <div className="relative flex items-center">
                                    <Mail className="absolute left-4 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        className="focus:border-gold w-full rounded-xl border border-gray-100 bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 outline-hidden transition-all focus:bg-white dark:border-white/5 dark:bg-[#111] dark:text-white"
                                        required
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
                                        placeholder="••••••••"
                                        className="focus:border-gold w-full rounded-xl border border-gray-100 bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 outline-hidden transition-all focus:bg-white dark:border-white/5 dark:bg-[#111] dark:text-white"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex cursor-pointer items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <input type="checkbox" className="accent-gold h-4 w-4 rounded border-gray-200" />
                                    Remember me
                                </label>
                                <Link href="/auth/forgot-password" className="text-gold font-medium hover:underline">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="bg-gold flex w-full items-center justify-center rounded-xl py-4 text-sm font-bold tracking-widest text-white uppercase transition-all hover:brightness-110 active:scale-[0.98]"
                            >
                                Sign In <ArrowRight size={18} className="ml-2" />
                            </button>
                        </form>

                        <div className="my-8 flex items-center gap-4">
                            <div className="h-px flex-grow bg-gray-100 dark:bg-white/5"></div>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                                or continue with
                            </span>
                            <div className="h-px flex-grow bg-gray-100 dark:bg-white/5"></div>
                        </div>

                        <SocicalLogin />
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        Don't have an account?{" "}
                        <Link href="/auth/register" className="text-gold font-bold hover:underline">
                            Request Membership
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
