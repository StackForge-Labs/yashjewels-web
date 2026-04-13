"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ShieldCheck, 
    Upload, 
    Camera, 
    ChevronRight, 
    ChevronLeft, 
    Check, 
    AlertCircle, 
    Image as ImageIcon,
    FileText,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useUploadKyc } from "@/hooks/useAuth";
import { PageHero } from "@/app/_components/PageHero";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/api-client";

// Steps: 0: Welcome/Prepare, 1: ID Upload, 2: Selfie, 3: Review/Submit
const STEPS = ["Preparation", "ID Document", "Selfie Photo", "Verification"];

export default function KycPage() {
    const { profile, isLoading: isProfileLoading } = useAuthGuard();
    const [currentStep, setCurrentStep] = useState(0);
    const [idFront, setIdFront] = useState<File | null>(null);
    const [idBack, setIdBack] = useState<File | null>(null);
    const [selfie, setSelfie] = useState<File | null>(null);
    const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null);
    const [idBackPreview, setIdBackPreview] = useState<string | null>(null);
    const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
    
    const uploadKyc = useUploadKyc();
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "front" | "back" | "selfie") => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        if (type === "front") {
            setIdFront(file);
            setIdFrontPreview(previewUrl);
        } else if (type === "back") {
            setIdBack(file);
            setIdBackPreview(previewUrl);
        } else {
            setSelfie(file);
            setSelfiePreview(previewUrl);
        }
    };

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleSubmit = async () => {
        if (!idFront || !idBack || !selfie) return;

        const formData = new FormData();
        formData.append("IdCardFront", idFront);
        formData.append("IdCardBack", idBack);
        formData.append("FacePhoto", selfie);

        uploadKyc.mutate(formData, {
            onSuccess: (res) => {
                if (res.success) {
                    // Success handled by hook invalidation, but we can redirect or show success step
                    setCurrentStep(3);
                }
            }
        });
    };

    if (isProfileLoading || !profile) return null;

    // Check if already pending or approved
    const kycStatus = profile.kycStatus?.toLowerCase();
    if (kycStatus === "verified" || kycStatus === "approved") {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
                <div className="mb-6 rounded-full bg-emerald-50 p-6 dark:bg-emerald-500/10">
                    <ShieldCheck size={64} className="text-emerald-500" />
                </div>
                <h1 className="font-serif text-3xl text-gray-900 dark:text-white">Already Verified</h1>
                <p className="mt-4 max-w-md text-gray-500 dark:text-gray-400">Your identity has been successfully verified. You have full access to our Maison.</p>
                <button onClick={() => router.push("/profile")} className="bg-gold mt-8 rounded-xl px-10 py-4 text-xs font-bold tracking-widest text-white uppercase transition-all hover:brightness-105">
                    Back to Profile
                </button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white dark:bg-[#050505]">
            <PageHero 
                title="Identity Verification" 
                subtitle="Secure your account and unlock bespoke services with our eKYC system."
                breadcrumbs={[{ label: "Profile", href: "/profile" }, { label: "Verification" }]}
            />

            <div className="container mx-auto px-4 py-12 md:py-20 lg:px-12">
                <div className="mx-auto max-w-4xl">
                    {/* Progress Steps */}
                    <div className="mb-12 flex items-center justify-between">
                        {STEPS.map((step, idx) => (
                            <div key={step} className="flex flex-col items-center flex-1">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                                    idx < currentStep ? "border-gold bg-gold text-white" : 
                                    idx === currentStep ? "border-gold bg-white text-gold dark:bg-[#111]" : "border-gray-200 text-gray-300 dark:border-white/5"
                                }`}>
                                    {idx < currentStep ? <Check size={18} /> : <span>{idx + 1}</span>}
                                </div>
                                <span className={`mt-3 hidden text-[10px] font-bold tracking-widest uppercase md:block ${idx <= currentStep ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
                                    {step}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Step Content */}
                    <div className="min-h-[500px] rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl md:p-12 dark:border-white/5 dark:bg-[#0a0a0a]">
                        <AnimatePresence mode="wait">
                            {/* STEP 0: PREPARATION */}
                            {currentStep === 0 && (
                                <motion.div 
                                    key="step0"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center">
                                        <h2 className="font-serif text-3xl text-gray-900 dark:text-white">Before You Start</h2>
                                        <p className="mt-4 text-gray-500 dark:text-gray-400">Please prepare your identification documents for the best verification experience.</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 pt-6">
                                        {[
                                            { icon: FileText, title: "Valid ID", desc: "Citizen ID Card, Passport, or National Card." },
                                            { icon: Camera, title: "Good Lighting", desc: "Ensure your documents are clearly visible." },
                                            { icon: ShieldCheck, title: "Legibility", desc: "Information on the card must be readable." }
                                        ].map((item, i) => (
                                            <div key={i} className="rounded-2xl border border-gray-50 bg-gray-50/50 p-6 text-center dark:border-white/5 dark:bg-white/2">
                                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-gold shadow-sm dark:bg-[#111]">
                                                    <item.icon size={24} />
                                                </div>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{item.title}</h4>
                                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="rounded-2xl bg-amber-50 p-6 border border-amber-100 dark:bg-amber-500/5 dark:border-amber-500/10">
                                        <div className="flex gap-4">
                                            <AlertCircle className="shrink-0 text-amber-500" size={24} />
                                            <div className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
                                                <p className="font-bold mb-1 uppercase tracking-widest">Privacy Note</p>
                                                <p>Your data is encrypted and used solely for identity verification required by financial regulations. We never share your documents with third parties.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center pt-8">
                                        <button onClick={handleNext} className="bg-gold group flex items-center justify-center gap-3 rounded-xl px-12 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-105 active:scale-95">
                                            Start Verification <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 1: ID UPLOAD */}
                            {currentStep === 1 && (
                                <motion.div 
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-10"
                                >
                                    <div className="text-center">
                                        <h2 className="font-serif text-3xl text-gray-900 dark:text-white">Upload National ID Card</h2>
                                        <p className="mt-4 text-gray-500 dark:text-gray-400">Please upload clear photos of both sides of your ID card.</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                        {/* Front Side */}
                                        <div className="space-y-4">
                                            <p className="text-center text-[10px] font-bold tracking-widest text-gray-400 uppercase">Front Side</p>
                                            <div className="relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:border-gold dark:border-white/10 dark:bg-white/2">
                                                {idFrontPreview ? (
                                                    <div className="relative aspect-[3/2] w-full">
                                                        <img src={idFrontPreview} alt="Front" className="h-full w-full object-cover" />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                                            <button onClick={() => setIdFrontPreview(null)} className="rounded-full bg-white p-2 text-rose-500"><AlertCircle size={20} /></button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <label className="flex aspect-[3/2] w-full cursor-pointer flex-col items-center justify-center p-6 text-center">
                                                        <Upload className="mb-4 text-gray-300 group-hover:text-gold" size={40} />
                                                        <span className="text-xs font-bold text-gray-900 dark:text-white">Browse Front Image</span>
                                                        <span className="mt-2 text-[10px] text-gray-400">JPG, PNG up to 5MB</span>
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "front")} />
                                                    </label>
                                                )}
                                            </div>
                                        </div>

                                        {/* Back Side */}
                                        <div className="space-y-4">
                                            <p className="text-center text-[10px] font-bold tracking-widest text-gray-400 uppercase">Back Side</p>
                                            <div className="relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:border-gold dark:border-white/10 dark:bg-white/2">
                                                {idBackPreview ? (
                                                    <div className="relative aspect-[3/2] w-full">
                                                        <img src={idBackPreview} alt="Back" className="h-full w-full object-cover" />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                                            <button onClick={() => setIdBackPreview(null)} className="rounded-full bg-white p-2 text-rose-500"><AlertCircle size={20} /></button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <label className="flex aspect-[3/2] w-full cursor-pointer flex-col items-center justify-center p-6 text-center">
                                                        <Upload className="mb-4 text-gray-300 group-hover:text-gold" size={40} />
                                                        <span className="text-xs font-bold text-gray-900 dark:text-white">Browse Back Image</span>
                                                        <span className="mt-2 text-[10px] text-gray-400">JPG, PNG up to 5MB</span>
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "back")} />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-10">
                                        <button onClick={handlePrev} className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 uppercase transition-all hover:text-gray-900 dark:hover:text-white">
                                            <ChevronLeft size={18} /> Back
                                        </button>
                                        <button 
                                            onClick={handleNext} 
                                            disabled={!idFront || !idBack}
                                            className="bg-gold group flex items-center justify-center gap-3 rounded-xl px-12 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-105 active:scale-95 disabled:opacity-50 disabled:grayscale"
                                        >
                                            Next Step <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: SELFIE */}
                            {currentStep === 2 && (
                                <motion.div 
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-10"
                                >
                                    <div className="text-center">
                                        <h2 className="font-serif text-3xl text-gray-900 dark:text-white">Facescan Selfie</h2>
                                        <p className="mt-4 text-gray-500 dark:text-gray-400">Take a photo of your face to match with your ID card.</p>
                                    </div>

                                    <div className="mx-auto max-w-sm">
                                        <div className="relative group cursor-pointer overflow-hidden rounded-full border-4 border-dashed border-gray-100 bg-gray-50 transition-all hover:border-gold dark:border-white/10 dark:bg-white/2 aspect-square">
                                            {selfiePreview ? (
                                                <div className="h-full w-full">
                                                    <img src={selfiePreview} alt="Selfie" className="h-full w-full object-cover" />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                                        <button onClick={() => setSelfiePreview(null)} className="rounded-full bg-white p-3 text-rose-500"><AlertCircle size={24} /></button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center p-8 text-center">
                                                    <div className="mb-6 h-32 w-32 rounded-full border border-gray-100 bg-white flex items-center justify-center dark:bg-[#111] dark:border-white/5 shadow-inner">
                                                        <Camera className="text-gold" size={48} />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">Take / Upload Selfie</span>
                                                    <span className="mt-2 text-xs text-gray-400 leading-relaxed">Ensure your face is centered and fully visible within the circle.</span>
                                                    <input type="file" className="hidden" accept="image/*" capture="user" onChange={(e) => handleFileChange(e, "selfie")} />
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-10">
                                        <button onClick={handlePrev} className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 uppercase transition-all hover:text-gray-900 dark:hover:text-white">
                                            <ChevronLeft size={18} /> Back
                                        </button>
                                        <button 
                                            onClick={handleSubmit} 
                                            disabled={!selfie || uploadKyc.isPending}
                                            className="bg-gold group flex min-w-[200px] items-center justify-center gap-3 rounded-xl px-12 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-105 active:scale-95 disabled:opacity-50"
                                        >
                                            {uploadKyc.isPending ? <Loader2 size={18} className="animate-spin" /> : "Submit Records"}
                                        </button>
                                    </div>

                                    {uploadKyc.isError && (
                                        <p className="text-center text-xs font-medium text-rose-500">{getErrorMessage(uploadKyc.error)}</p>
                                    )}
                                </motion.div>
                            )}

                            {/* STEP 3: SUCCESS */}
                            {currentStep === 3 && (
                                <motion.div 
                                    key="step3"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-10 text-center"
                                >
                                    <div className="mb-10 text-emerald-500">
                                        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.2)] dark:bg-emerald-500/5">
                                            <CheckCircle2 size={72} strokeWidth={1} />
                                        </div>
                                    </div>
                                    <h2 className="font-serif text-4xl text-gray-900 dark:text-white">Records Submitted</h2>
                                    <p className="mt-6 max-w-lg text-lg text-gray-500 dark:text-gray-400">
                                        We have received your verification documents. Our team will review them and update your status within 24 hours.
                                    </p>
                                    
                                    <div className="mt-12 space-y-4">
                                        <button onClick={() => router.push("/profile")} className="bg-gold w-full min-w-[250px] rounded-xl px-10 py-5 text-sm font-bold tracking-widest text-white uppercase transition-all hover:brightness-110 shadow-lg shadow-gold/30">
                                            Back to Dashboard
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Guide Icons */}
                    {currentStep < 3 && (
                         <div className="mt-12 flex items-center justify-center gap-8 opacity-40 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                            {[
                                { name: "Bank Grade Security", icon: ShieldCheck },
                                { name: "AI Verification", icon: CheckCircle2 },
                                { name: "Privacy Compliant", icon: AlertCircle }
                            ].map(brand => (
                                <div key={brand.name} className="flex items-center gap-2">
                                    <brand.icon size={16} />
                                    <span className="text-[10px] font-bold tracking-widest uppercase">{brand.name}</span>
                                </div>
                            ))}
                         </div>
                    )}
                </div>
            </div>
        </main>
    );
}
