"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, CheckCircle2, Package, MapPin, User, ChevronLeft, RotateCcw, Upload, Loader2, AlertCircle } from "lucide-react";
import { shipperService, ShipperOrderDto } from "@/services/shipper.service";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/api-client";

type PodState = "loading" | "error" | "review" | "capture" | "confirm" | "done";

function formatUsd(n: number) {
    return new Intl.NumberFormat("en-US").format(n) + " $";
}

// ─── Swipe Slider ─────────────────────────────────────────
function SwipeConfirmSlider({ onConfirm, isSubmitting, isReturn }: { onConfirm: () => void; isSubmitting: boolean; isReturn: boolean }) {
    const [position, setPosition] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const confirmed = position > 250;

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || isSubmitting) return;
        const rect = sliderRef.current?.getBoundingClientRect();
        if (!rect) return;
        const newPos = Math.min(Math.max(0, e.clientX - rect.left - 28), rect.width - 56);
        setPosition(newPos);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (confirmed && !isSubmitting) {
            onConfirm();
        } else {
            setPosition(0);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isSubmitting) return;
        const rect = sliderRef.current?.getBoundingClientRect();
        if (!rect) return;
        const touch = e.touches[0];
        const newPos = Math.min(Math.max(0, touch.clientX - rect.left - 28), rect.width - 56);
        setPosition(newPos);
    };

    const handleTouchEnd = () => {
        if (confirmed && !isSubmitting) {
            onConfirm();
        } else {
            setPosition(0);
        }
    };

    return (
        <div
            ref={sliderRef}
            className="relative flex h-14 w-full items-center rounded-2xl bg-teal-50 px-1 select-none overflow-hidden dark:bg-teal-900/20"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="absolute left-1 h-12 rounded-xl bg-teal-600/10 transition-none" style={{ width: position + 56 }} />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-plus-jakarta text-sm font-bold tracking-wide text-teal-700/60 dark:text-teal-400/50">
                {isSubmitting ? "Processing..." : confirmed ? "Release to confirm →" : `← Swipe to Confirm ${isReturn ? "Return" : "Delivery"}`}
                </span>
            </div>
            <div
                className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 shadow-lg ${isSubmitting ? "cursor-not-allowed opacity-80" : "cursor-grab active:cursor-grabbing"} transition-none`}
                style={{ transform: `translateX(${position}px)` }}
                onMouseDown={() => !isSubmitting && setIsDragging(true)}
                onTouchStart={() => !isSubmitting && setIsDragging(true)}
            >
                {isSubmitting ? <Loader2 className="h-5 w-5 text-white animate-spin" /> : <ChevronLeft className="h-5 w-5 rotate-180 text-white" />}
            </div>
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────
function ShipperPodContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const qrToken = searchParams.get("qrToken");
    const mode = searchParams.get("mode") ?? "delivery";

    const [podState, setPodState] = useState<PodState>("loading");
    const [orderInfo, setOrderInfo] = useState<ShipperOrderDto | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!orderId || !qrToken) {
            setPodState("error");
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                const res = await shipperService.getAssignedDeliveries();
                if (res.success && res.data) {
                    const matched = res.data.find(o => o.orderId === orderId);
                    if (matched) {
                        setOrderInfo(matched);
                        setPodState("review");
                    } else {
                        setPodState("error");
                    }
                } else {
                    setPodState("error");
                }
            } catch (error) {
                console.error(error);
                setPodState("error");
            }
        };
        fetchOrderDetails();
    }, [orderId, qrToken]);

    const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhotoFile(file);
        const url = URL.createObjectURL(file);
        setPhoto(url);
        setPodState("confirm");
    };

    const isReturn = mode === "return" || (orderInfo?.status?.startsWith("RETURN_") ?? false);

    const handleConfirmAction = async () => {
        if (!orderId || !qrToken || !photoFile) return;
        setIsSubmitting(true);
        
        const loadingToast = toast.loading(
            isReturn 
                ? "Uploading return proof and finalizing..." 
                : "Uploading delivery proof and finalizing..."
        );

        try {
            const CLOUD_NAME = "dilzxumho";
            const UPLOAD_PRESET = "yash_unsigned";

            const formData = new FormData();
            formData.append("file", photoFile);
            formData.append("upload_preset", UPLOAD_PRESET);

            const uploadResponse = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                { method: "POST", body: formData }
            );

            if (!uploadResponse.ok) throw new Error("Failed to upload image to storage.");

            const uploadData = await uploadResponse.json();
            const photoUrl = uploadData.secure_url;

            let res;
            if (isReturn) {
                res = await shipperService.pickupReturn(orderId, qrToken, photoUrl);
            } else {
                res = await shipperService.confirmDeliveryWithQr(orderId, qrToken, photoUrl);
            }

            if (res.success) {
                toast.success(
                    isReturn ? "Return confirmed successfully!" : "Delivery confirmed successfully!", 
                    { id: loadingToast }
                );
                setPodState("done");
            } else {
                // If the API provides specific errors (like QR expired), show them. Otherwise use the message field.
                const specificError = res.errors && res.errors.length > 0 ? res.errors[0] : res.message;
                toast.error(specificError || "Verification failed.", { id: loadingToast });
            }
        } catch (error: any) {
            const msg = getErrorMessage(error);
            toast.error(msg || "System error uploading POD.", { id: loadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (podState === "loading") {
        return (
            <div className="flex min-h-[calc(100vh-3.5rem-6rem)] items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
        );
    }

    if (podState === "error" || !orderInfo) {
        return (
            <div className="flex min-h-[calc(100vh-3.5rem-6rem)] flex-col items-center justify-center gap-4 bg-gray-50 p-8 text-center dark:bg-[#0a0a0a]">
                <AlertCircle className="h-12 w-12 text-rose-500" />
                <div>
                    <h2 className="font-plus-jakarta text-xl font-bold text-gray-900 dark:text-white">Invalid Data</h2>
                    <p className="text-sm text-gray-500 mt-1">Order code not found or session expired.</p>
                </div>
                <button onClick={() => router.push("/shipper")} className="mt-4 rounded-xl bg-teal-600 px-6 py-3 font-bold text-white hover:bg-teal-700">
                    Back to Home
                </button>
            </div>
        );
    }

    const displayProduct = orderInfo.items && orderInfo.items.length > 0 ? orderInfo.items[0].productName : "Jewelry product";

    if (podState === "done") {
        return (
            <div className="flex min-h-[calc(100vh-3.5rem-6rem)] flex-col items-center justify-center gap-6 bg-white p-8 text-center dark:bg-[#0a0a0a]">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-900/20">
                    <CheckCircle2 className="h-14 w-14 text-teal-600" />
                </div>
                <div>
                    <h2 className="font-plus-jakarta text-2xl font-black text-gray-900 dark:text-white">
                        {isReturn ? "RETURN SUCCESSFUL!" : "DELIVERY SUCCESSFUL!"}
                    </h2>
                    <p className="mt-2 font-plus-jakarta text-sm text-gray-500">
                        Order {orderInfo.orderNumber} has been successfully {isReturn ? "picked up" : "handed over"}
                    </p>
                </div>
                <div className="flex flex-col gap-3 w-full">
                    <button
                        onClick={() => router.push("/shipper")}
                        className="w-full rounded-2xl bg-teal-600 py-4 font-plus-jakarta text-sm font-black uppercase tracking-widest text-white hover:bg-teal-700 active:scale-95"
                    >
                        Back to Orders
                    </button>
                    <button
                        onClick={() => router.push("/shipper")}
                        className="w-full rounded-2xl border border-gray-200 py-4 font-plus-jakarta text-sm font-bold text-gray-600 dark:border-gray-700 dark:text-gray-300 active:scale-95 hover:bg-gray-50 dark:hover:bg-[#111]"
                    >
                        Next Delivery
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-0 bg-gray-50 dark:bg-[#0a0a0a]">
            {/* Order Info Banner */}
            <div className="bg-white px-4 py-5 shadow-sm dark:bg-[#111]">
                <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => !isSubmitting && router.back()} className="text-gray-400 disabled:opacity-50" disabled={isSubmitting}>
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h1 className="font-plus-jakarta text-base font-bold text-gray-900 dark:text-white">
                        {isReturn ? "Confirm Return (Pickup)" : "Confirm Delivery"}
                    </h1>
                </div>

                <div className="rounded-xl bg-teal-50 p-4 dark:bg-teal-900/10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-teal-600" />
                            <span className="font-mono text-xs font-bold text-teal-600">{orderInfo.orderNumber}</span>
                        </div>
                        {orderInfo.isCod && (
                            <span className="rounded-xl bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 flex items-center justify-center">
                                COD: {formatUsd(orderInfo.remainingAmount || 0)}
                            </span>
                        )}
                    </div>
                    <div className="flex items-start gap-2 mb-2">
                        <User className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                        <div>
                            <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{orderInfo.shippingName}</p>
                            <p className="font-plus-jakarta text-xs text-gray-500">{displayProduct}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                        <p className="font-plus-jakarta text-xs text-gray-600 dark:text-gray-300">{orderInfo.shippingAddress}</p>
                    </div>
                </div>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-4 p-4">
                {/* Step 1: Identity Verified badge */}
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800/30 dark:bg-emerald-900/10">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    <div>
                        <p className="font-plus-jakarta text-sm font-bold text-emerald-800 dark:text-emerald-400">Valid Customer QR</p>
                        <p className="font-plus-jakarta text-xs text-emerald-600/80">OTP token security code matched — {orderInfo.shippingName}</p>
                    </div>
                </div>

                {/* Step 2: Photo Proof */}
                <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-[#111]">
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full font-plus-jakarta text-xs font-black ${photo ? "bg-emerald-600 text-white" : "bg-teal-600 text-white"}`}>
                            {photo ? <CheckCircle2 className="h-4 w-4" /> : "2"}
                        </div>
                        <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">
                            {isReturn ? "Take Return Photo" : "Take Co-check Photo"}
                        </p>
                    </div>

                    {photo ? (
                        <div className="relative">
                            <img src={photo} alt="POD photo" className="w-full rounded-xl object-cover h-48" />
                            {!isSubmitting && (
                                <button
                                    onClick={() => { setPhoto(null); setPhotoFile(null); setPodState("review"); }}
                                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                className="hidden"
                                onChange={handlePhotoCapture}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed border-teal-200 bg-teal-50/50 py-8 transition-all active:scale-95 hover:bg-teal-100/50 dark:border-teal-800/30 dark:bg-teal-900/5"
                            >
                                <Camera className="h-8 w-8 text-teal-400" />
                                <span className="font-plus-jakarta text-sm font-bold text-teal-700 dark:text-teal-400">
                                    {isReturn ? "Tap to Take Return Photo" : "Tap to Take Delivery Photo"}
                                </span>
                                <span className="font-plus-jakarta text-xs text-teal-500/70">
                                    {isReturn ? "Pack carefully, check seal" : "Open seal, customer holds item"}
                                </span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Step 3: Confirm Slider */}
                {podState === "confirm" && photo && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-[#111]">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 font-plus-jakarta text-xs font-black text-white">3</div>
                            <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">
                                {isReturn ? "Confirm Return" : "Confirm Delivery"}
                            </p>
                        </div>
                        <SwipeConfirmSlider onConfirm={handleConfirmAction} isSubmitting={isSubmitting} isReturn={isReturn} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ShipperPodPage() {
    return (
        <Suspense fallback={
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
        }>
            <ShipperPodContent />
        </Suspense>
    );
}
