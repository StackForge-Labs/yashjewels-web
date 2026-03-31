"use client";

import React from "react";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

const ForgotPasswordPage = () => {
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
                            Recover Access
                        </h1>
                        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            We'll help you reset your credentials and regain access to the Maison
                        </p>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#0a0a0a]">
                        <div className="mb-8 flex flex-col items-center text-center">
                            <div className="bg-gold/10 text-gold mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                                <Mail size={32} strokeWidth={1} />
                            </div>
                            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Enter your official email to receive a recovery link</p>
                        </div>

                        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                    Email Address
                                </label>
                                <div className="relative flex items-center">
                                    <Mail className="absolute left-4 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 transition-all outline-hidden focus:border-gold focus:bg-white dark:border-white/5 dark:bg-[#111] dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="bg-gold flex w-full items-center justify-center rounded-xl py-4 text-sm font-bold tracking-widest text-white uppercase transition-all hover:brightness-110 active:scale-[0.98]"
                            >
                                Send Link <ArrowRight size={18} className="ml-2" />
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <Link 
                                href="/auth/login" 
                                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                            >
                                <ArrowLeft size={16} /> Back to Log In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ForgotPasswordPage;
