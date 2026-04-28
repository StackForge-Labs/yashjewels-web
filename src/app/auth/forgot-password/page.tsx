"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Mail, ArrowRight, ArrowLeft, Loader2, Lock, Eye, EyeOff, RotateCcw, CheckCircle2, ShieldCheck, MailCheck, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForgotPassword, useResetPassword, useResendOtp, useVerifyResetOtp } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getErrorMessage } from "@/lib/api-client";
import { AuthAlert } from "../_components/AuthAlert";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

// ── Step 1 Schema ──────────────────────────────────────────────
const step1Schema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
});

// ── Step 3 Schema ──────────────────────────────────────────────
const step3Schema = z.object({
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must not exceed 50 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type Step1Values = z.infer<typeof step1Schema>;
type Step3Values = z.infer<typeof step3Schema>;

const maskEmail = (email: string) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    if (name.length <= 3) return `***@${domain}`;
    return `${name.substring(0, 2)}***${name.substring(name.length - 2)}@${domain}`;
};

const ForgotPasswordPage = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [cooldown, setCooldown] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccessRedirect, setIsSuccessRedirect] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    
    const forgot = useForgotPassword();
    const reset = useResetPassword();
    const resend = useResendOtp();
    const verifyResetOtp = useVerifyResetOtp();

    // ── Forms ──────────────────────────────────────────────────────
    const formStep1 = useForm<Step1Values>({
        resolver: zodResolver(step1Schema),
    });

    const formStep3 = useForm<Step3Values>({
        resolver: zodResolver(step3Schema),
    });

    // ── Resend Timer ───────────────────────────────────────────────
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    // ── Step 1: Request OTP ────────────────────────────────────────
    const onStep1Submit = (data: Step1Values) => {
        forgot.mutate(data, {
            onSuccess: (res) => {
                if (res.success) {
                    setEmail(data.email);
                    setStep(2);
                    setCooldown(RESEND_COOLDOWN);
                }
            }
        });
    };

    // ── Step 2: OTP Handlers ───────────────────────────────────────
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (pasted.length === 0) return;
        const newOtp = [...otp];
        pasted.split("").forEach((char, i) => { newOtp[i] = char; });
        setOtp(newOtp);
        const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
        inputRefs.current[focusIdx]?.focus();
    };

    const onOtpVerify = (e?: React.FormEvent) => {
        e?.preventDefault();
        const code = otp.join("");
        if (code.length === OTP_LENGTH) {
            verifyResetOtp.mutate({ email, otp: code }, {
                onSuccess: (res) => {
                    if (res.success) {
                        setStep(3);
                    } else {
                        setOtp(Array(OTP_LENGTH).fill(""));
                        inputRefs.current[0]?.focus();
                    }
                },
                onError: () => {
                    setOtp(Array(OTP_LENGTH).fill(""));
                    inputRefs.current[0]?.focus();
                }
            });
        }
    };

    // Auto-submit Step 2 when 6 digits are entered
    useEffect(() => {
        if (step === 2 && otp.every(d => d !== "") && otp.join("").length === OTP_LENGTH) {
            onOtpVerify();
        }
    }, [otp, step]);

    const handleResend = () => {
        if (cooldown > 0 || !email) return;
        resend.mutate({ email }, {
            onSuccess: (res) => {
                if (res.success) setCooldown(RESEND_COOLDOWN);
            }
        });
    };

    // ── Step 3: Change Password ────────────────────────────────────
    const onStep3Submit = (data: Step3Values) => {
        reset.mutate({
            email,
            otp: otp.join(""),
            newPassword: data.password
        }, {
            onSuccess: (res) => {
                if (res.success) {
                    setIsSuccessRedirect(true);
                    setTimeout(() => {
                        router.push("/auth/login");
                    }, 2000);
                }
            }
        });
    };

    const errorMessage = getErrorMessage(forgot.error || reset.error || resend.error || verifyResetOtp.error) || 
        ([forgot.data, reset.data, resend.data, verifyResetOtp.data].find(d => d && !d.success)?.errors?.[0]);

    return (
        <section className="min-h-screen bg-white py-20 transition-colors dark:bg-[#050505]">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-[480px]">
                    
                    {/* View Wrapper */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* ── VIEW 1: FORGOT PASSWORD EMAIL ── */}
                        {step === 1 && (
                            <>
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
                                    <h1 className="font-serif text-2xl tracking-[0.2em] text-gray-900 uppercase dark:text-white">Recover Access</h1>
                                    <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        We&apos;ll help you reset your credentials and regain access to the Maison
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#0a0a0a]">
                                    <div className="mb-8 flex flex-col items-center text-center">
                                        <div className="bg-gold/10 text-gold mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                                            <Mail size={32} strokeWidth={1} />
                                        </div>
                                        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Enter your email to receive a recovery OTP code</p>
                                    </div>

                                    <AuthAlert message={errorMessage} type="error" />

                                    <form onSubmit={formStep1.handleSubmit(onStep1Submit)} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Email Address</label>
                                            <div className="relative flex items-center">
                                                <Mail className="absolute left-4 text-gray-400" size={18} />
                                                <input
                                                    type="email"
                                                    {...formStep1.register("email")}
                                                    placeholder="your@email.com"
                                                    className={`w-full rounded-xl border bg-gray-50 py-3.5 pr-4 pl-12 text-sm text-gray-900 transition-all outline-hidden focus:border-gold focus:bg-white dark:bg-[#111] dark:text-white ${
                                                        formStep1.formState.errors.email ? "border-red-500" : "border-gray-100 dark:border-white/5"
                                                    }`}
                                                />
                                            </div>
                                            {formStep1.formState.errors.email && <p className="text-xs text-red-500">{formStep1.formState.errors.email.message}</p>}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={forgot.isPending}
                                            className="bg-gold flex w-full items-center justify-center rounded-xl py-4 text-sm font-bold tracking-widest text-white uppercase transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                                        >
                                            {forgot.isPending ? <Loader2 size={18} className="animate-spin" /> : <>Send Recovery Code <ArrowRight size={18} className="ml-2" /></>}
                                        </button>
                                        <div className="mt-8 text-center">
                                            <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
                                                <ArrowLeft size={16} /> Back to Log In
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </>
                        )}

                        {/* ── VIEW 2: OTP VERIFICATION (Same as /auth/verify-email) ── */}
                        {step === 2 && (
                            <>
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
                                    <h1 className="font-serif text-2xl tracking-[0.2em] text-gray-900 uppercase dark:text-white">Verify Recovery</h1>
                                    <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">One last step to access the Maison</p>
                                </div>

                                <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#0a0a0a]">
                                    <div className="mb-8 flex flex-col items-center text-center">
                                        <div className="bg-gold/10 text-gold mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                                            <MailCheck size={32} strokeWidth={1} />
                                        </div>
                                        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Enter OTP Code</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            We&apos;ve sent a 6-digit code to <span className="font-semibold text-gold">{maskEmail(email)}</span>
                                        </p>
                                    </div>

                                    <AuthAlert message={errorMessage} type="error" />

                                    <form onSubmit={onOtpVerify} className="space-y-6">
                                        <div className="flex justify-center gap-3">
                                            {otp.map((digit, idx) => (
                                                <input
                                                    key={idx}
                                                    ref={(el) => { inputRefs.current[idx] = el; }}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                                    onPaste={idx === 0 ? handleOtpPaste : undefined}
                                                    className="focus:border-gold h-14 w-12 rounded-xl border border-gray-100 bg-gray-50 text-center text-xl font-bold text-gray-900 outline-hidden transition-all focus:bg-white dark:border-white/5 dark:bg-[#111] dark:text-white"
                                                />
                                            ))}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={otp.join("").length !== OTP_LENGTH || verifyResetOtp.isPending}
                                            className="bg-gold flex w-full items-center justify-center rounded-xl py-4 text-sm font-bold tracking-widest text-white uppercase transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                                        >
                                            {verifyResetOtp.isPending ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <>Verify Code <ArrowRight size={18} className="ml-2" /></>
                                            )}
                                        </button>
                                        <div className="mt-6 text-center">
                                            <button
                                                type="button"
                                                onClick={handleResend}
                                                disabled={cooldown > 0 || resend.isPending}
                                                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 disabled:opacity-40 dark:text-gray-400 dark:hover:text-white"
                                            >
                                                <RotateCcw size={14} />
                                                {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </>
                        )}

                        {/* ── VIEW 3: NEW PASSWORD (Same as /auth/reset-password but no OTP field) ── */}
                        {step === 3 && (
                            <>
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
                                    <h1 className="font-serif text-2xl tracking-[0.2em] text-gray-900 uppercase dark:text-white">Secure Credentials</h1>
                                    <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">Establish a new secure access key for your personal collection</p>
                                </div>

                                <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#0a0a0a]">
                                    {isSuccessRedirect ? (
                                        <div className="flex flex-col items-center text-center animate-in zoom-in duration-300">
                                            <div className="bg-emerald-500/10 text-emerald-500 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                                                <CheckCircle2 size={40} />
                                            </div>
                                            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Password Updated!</h2>
                                            <p className="text-sm text-gray-500">Your security credentials have been successfully reset. Redirecting you to the login page...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-8 flex flex-col items-center text-center">
                                                <div className="bg-gold/10 text-gold mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                                                    <ShieldCheck size={32} strokeWidth={1} />
                                                </div>
                                                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Please choose a strong new password for your account</p>
                                            </div>

                                            <AuthAlert message={errorMessage} type="error" />

                                            <form onSubmit={formStep3.handleSubmit(onStep3Submit)} className="space-y-6">
                                                <div className="space-y-5">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">New Password</label>
                                                        <div className="relative flex items-center">
                                                            <Lock className="absolute left-4 text-gray-400" size={18} />
                                                            <input
                                                                type={showPassword ? "text" : "password"}
                                                                {...formStep3.register("password")}
                                                                placeholder="••••••••"
                                                                className={`w-full rounded-xl border bg-gray-50 py-3.5 pr-10 pl-12 text-sm text-gray-900 transition-all outline-hidden focus:border-gold focus:bg-white dark:bg-[#111] dark:text-white ${
                                                                    formStep3.formState.errors.password ? "border-red-500" : "border-gray-100 dark:border-white/5"
                                                                }`}
                                                            />
                                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-400 hover:text-gray-600">
                                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                            </button>
                                                        </div>
                                                        {formStep3.formState.errors.password && <p className="text-xs text-red-500">{formStep3.formState.errors.password.message}</p>}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Confirm Password</label>
                                                        <div className="relative flex items-center">
                                                            <Lock className="absolute left-4 text-gray-400" size={18} />
                                                            <input
                                                                type={showConfirmPassword ? "text" : "password"}
                                                                {...formStep3.register("confirmPassword")}
                                                                onPaste={(e) => e.preventDefault()}
                                                                placeholder="••••••••"
                                                                className={`w-full rounded-xl border bg-gray-50 py-3.5 pr-10 pl-12 text-sm text-gray-900 transition-all outline-hidden focus:border-gold focus:bg-white dark:bg-[#111] dark:text-white ${
                                                                    formStep3.formState.errors.confirmPassword ? "border-red-500" : "border-gray-100 dark:border-white/5"
                                                                }`}
                                                            />
                                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 text-gray-400 hover:text-gray-600">
                                                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                            </button>
                                                        </div>
                                                        {formStep3.formState.errors.confirmPassword && <p className="text-xs text-red-500">{formStep3.formState.errors.confirmPassword.message}</p>}
                                                    </div>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={reset.isPending}
                                                    className="bg-gold flex w-full items-center justify-center rounded-xl py-4 text-sm font-bold tracking-widest text-white uppercase transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                                                >
                                                    {reset.isPending ? <Loader2 size={18} className="animate-spin" /> : "Save New Password"}
                                                </button>
                                            </form>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                        
                    </div> {/* End View Wrapper */}
                </div>
            </div>
        </section>
    );
};

export default ForgotPasswordPage;
