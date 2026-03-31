"use client";

import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Facebook } from "../../_components/icon/Facebook";
import { Instagram } from "../../_components/icon/Instagram";
import { Youtube } from "../../_components/icon/Youtube";
import Link from "next/link";

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <section className="min-h-screen bg-white py-20 transition-colors dark:bg-[#050505]">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-[480px]">
                    {/* Header */}
                    <div className="mb-10 flex flex-col items-center">
                        <div className="text-gold mb-3">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 2L2 9L12 22L22 9L12 2Z"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinejoin="round"
                                />
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
                        <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">Enter your official details to become a member</p>

                        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                    Full Name
                                </label>
                                <div className="relative flex items-center">
                                    <User className="absolute left-4 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Johnathan Doe"
                                        className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 transition-all outline-hidden focus:border-gold focus:bg-white dark:border-white/5 dark:bg-[#111] dark:text-white"
                                        required
                                    />
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
                                        placeholder="name@example.com"
                                        className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 transition-all outline-hidden focus:border-gold focus:bg-white dark:border-white/5 dark:bg-[#111] dark:text-white"
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
                                        className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 transition-all outline-hidden focus:border-gold focus:bg-white dark:border-white/5 dark:bg-[#111] dark:text-white"
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

                            <div className="space-y-4 pt-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                                <p>
                                    By creating an account, you agree to our{" "}
                                    <Link href="/privacy" className="text-gold font-bold hover:underline">
                                        Privacy Policy
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/terms" className="text-gold font-bold hover:underline">
                                        Terms & Conditions
                                    </Link>.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="bg-gold mt-4 flex w-full items-center justify-center rounded-xl py-4 text-sm font-bold tracking-widest text-white uppercase transition-all hover:brightness-110 active:scale-[0.98]"
                            >
                                Create Account <ArrowRight size={18} className="ml-2" />
                            </button>
                        </form>

                        <div className="my-8 flex items-center gap-4">
                            <div className="h-px flex-grow bg-gray-100 dark:bg-white/5"></div>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                                or sign up with
                            </span>
                            <div className="h-px flex-grow bg-gray-100 dark:bg-white/5"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center">
                            <button className="flex items-center justify-center gap-3 rounded-xl border border-gray-100 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-white/5 dark:text-gray-300 dark:hover:bg-white/5">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-3 rounded-xl border border-gray-100 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-white/5 dark:text-gray-300 dark:hover:bg-white/5">
                                <Facebook size={18} />
                                Facebook
                            </button>
                        </div>
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
