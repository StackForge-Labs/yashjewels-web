"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { postSalesService } from "@/services/post-sales.service";
import { PageHero } from "@/app/_components/PageHero";
import { Modal } from "@/app/admin/_components/ui/Modal";
import { FormField, textareaCls } from "@/app/admin/_components/ui/FormField";
import { toast } from "sonner";
import {
    Package,
    CheckCircle2,
    Clock,
    Truck,
    AlertCircle,
    ArrowLeft,
    ShieldCheck,
    User,
    Store,
    Settings,
    ChevronRight,
    MapPin,
    Calendar,
    Receipt,
    Wallet,
    RotateCcw,
    Camera,
    Star,
    Upload,
    Video,
    FileText,
    FileCheck2,
    ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import Link from "next/link";

// Make the icon selection dynamic based on the actual status
const StatusIcon = ({ status }: { status: string }) => {
    const s = status.toLowerCase();
    if (s.includes("paid") || s.includes("confirmed") || s.includes("completed")) return <CheckCircle2 className="text-emerald-500" size={18} />;
    if (s.includes("fail") || s.includes("reject") || s.includes("cancel")) return <AlertCircle className="text-rose-500" size={18} />;
    if (s.includes("ship") || s.includes("transit") || s.includes("deliver")) return <Truck className="text-blue-500" size={18} />;
    if (s.includes("return") || s.includes("refund")) return <RotateCcw className="text-amber-500" size={18} />;
    if (s.includes("deposit") || s.includes("payment")) return <Wallet className="text-gold" size={18} />;
    return <Clock className="text-gold" size={18} />;
};

const ActorBadge = ({ type }: { type: string }) => {
    const icon = type === "CUSTOMER" ? <User size={10} /> : type === "VENDOR" ? <Store size={10} /> : <Settings size={10} />;
    const color = type === "CUSTOMER" ? "bg-amber-100/50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500" 
        : type === "VENDOR" ? "bg-gold/10 text-gold" 
        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

    return (
        <span className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest backdrop-blur-md ${color}`}>
            {icon} {type}
        </span>
    );
};

export default function OrderTimelinePage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;
    
    // Return States
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [returnReason, setReturnReason] = useState("");
    const [unboxingVideo, setUnboxingVideo] = useState<File | null>(null);
    const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);
    
    // Review States
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [rating, setProjectRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewImage, setReviewImage] = useState<File | null>(null);
    const [reviewImagePreview, setReviewImagePreview] = useState<string | null>(null);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const [isCompleting, setIsCompleting] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);

    const { data: orderResponse, isLoading, error, refetch } = useQuery({
        queryKey: ["order", orderId],
        queryFn: () => orderService.getOrderById(orderId),
        enabled: !!orderId,
    });

    const order = orderResponse?.data;

    const orderSteps = useMemo(() => {
        return [
            { label: "Order Placed", icon: <Package size={20} />, statuses: ["CHECKOUT_INITIATED", "PAYMENT_PENDING", "PAYMENT_FAILED", "DEPOSIT_PENDING", "DEPOSIT_PAID", "CONFIRMED", "AWAITING_FULL_PAYMENT", "PREPARING", "SHIP_PENDING", "SHIPPED", "DELIVERED", "COMPLETED"] },
            { label: "Deposit Secured", icon: <Wallet size={20} />, statuses: ["DEPOSIT_PAID", "CONFIRMED", "AWAITING_FULL_PAYMENT", "PREPARING", "SHIP_PENDING", "SHIPPED", "DELIVERED", "COMPLETED"] },
            { label: "Preparing", icon: <Store size={20} />, statuses: ["PREPARING", "SHIP_PENDING", "SHIPPED", "DELIVERED", "COMPLETED"] },
            { label: "Packaged", icon: <Package size={20} />, statuses: ["SHIP_PENDING", "SHIPPED", "DELIVERED", "COMPLETED"] },
            { label: "In Transit", icon: <Truck size={20} />, statuses: ["SHIPPED", "DELIVERED", "COMPLETED"] },
            { label: "Completed", icon: <CheckCircle2 size={20} />, statuses: ["DELIVERED", "COMPLETED"] }
        ];
    }, []);

    if (isLoading) return <div className="flex min-h-screen items-center justify-center font-serif text-lg tracking-widest text-gold animate-pulse">Opening the archives...</div>;
    if (error || !order) return <div className="py-40 text-center font-serif text-lg text-rose-500">Order not found.</div>;

    const currentStatusIdx = orderSteps.map(s => s.statuses.includes(order.status)).lastIndexOf(true);
    const isCancelled = ["CANCELLED", "REFUNDING", "REFUNDED", "VENDOR_REJECTED"].includes(order.status);
    
    // Return & Review Logic
    const deliveredAt = order.timeline?.find(t => t.status === "DELIVERED")?.changedAt;
    const daysSinceDelivery = deliveredAt ? differenceInDays(new Date(), new Date(deliveredAt)) : 0;
    const isWithinReturnWindow = daysSinceDelivery <= 7;
    
    // Status Logic
    const isReturnable = order.status === "DELIVERED" && isWithinReturnWindow && !order.returnRequestId;
    const isReviewable = order.status === "COMPLETED" && !order.isReviewed;
    const hasReturnRequest = !!order.returnRequestId;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error("Image size must be less than 10MB");
                return;
            }
            setReviewImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setReviewImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Allow videos up to 5GB
            if (file.size > 5 * 1024 * 1024 * 1024) {
                toast.error("Video size must be less than 5GB");
                return;
            }
            setUnboxingVideo(file);
            toast.success("Ready to transmit unboxing evidence.");
        }
    };

    const handleSubmitReturn = async () => {
        if (!returnReason.trim()) return toast.error("Please provide a reason.");
        if (!unboxingVideo) return toast.error("Unboxing video is required.");

        setIsSubmittingReturn(true);
        const loadingToast = toast.loading("Transmitting unboxing evidence to our high-security vault...");

        try {
            // Frontend upload to Cloudinary (Bypass backend for large files)
            const CLOUD_NAME = "dilzxumho";
            const UPLOAD_PRESET = "yash_unsigned";
            
            const formData = new FormData();
            formData.append("file", unboxingVideo);
            formData.append("upload_preset", UPLOAD_PRESET);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) throw new Error("Failed to upload evidence to Cloudinary.");
            
            const uploadData = await response.json();
            const evidenceUrl = uploadData.secure_url;

            // Submit URL to our API
            const res = await postSalesService.submitReturnRequest({ 
                orderId, 
                reason: returnReason, 
                evidenceUrl 
            });

            if (res.success) {
                toast.success("Return request submitted with evidence.", { id: loadingToast });
                setIsReturnModalOpen(false);
                setUnboxingVideo(null);
                setReturnReason("");
                refetch();
            } else {
                toast.error(res.message, { id: loadingToast });
            }
        } catch (err: any) {
            console.error("Return submission error:", err);
            toast.error(err.message || "An error occurred during transmission.", { id: loadingToast });
        } finally {
            setIsSubmittingReturn(false);
        }
    };

    const handleSubmitReview = async () => {
        if (rating < 1) return toast.error("Please provide a rating.");
        setIsSubmittingReview(true);
        const res = await postSalesService.submitReview({ orderId, rating, comment: reviewComment, image: reviewImage || undefined });

        if (res.success) {
            toast.success("Review posted! Check email for rewards.");
            setIsReviewModalOpen(false);
            setReviewComment("");
            setReviewImage(null);
            setReviewImagePreview(null);
            refetch();
        } else toast.error(res.message);
        setIsSubmittingReview(false);
    };

    const handleCompleteOrder = async () => {
        setIsCompleting(true);
        try {
            const res = await orderService.completeOrder(orderId);
            if (res.success) { 
                toast.success("Order complete!"); 
                refetch(); 
            } else {
                toast.error(res.message || "Failed.");
            }
        } catch (err) { 
            toast.error("Network error."); 
        } finally { 
            setIsCompleting(false); 
        }
    };

    const handleClaimRefund = async () => {
        setIsClaiming(true);
        try {
            const res = await postSalesService.claimRefund(orderId);
            if (res.success) {
                toast.success(res.message || "Refund processed successfully!");
                refetch();
            } else {
                toast.error(res.message || "Failed to process refund.");
            }
        } catch (error) {
            toast.error("An error occurred while claiming refund.");
        } finally {
            setIsClaiming(false);
        }
    };

    const isClaimable = order?.status === "RETURN_APPROVED";

    return (
        <main className="min-h-screen bg-[#FAFAF9] pb-32 dark:bg-[#050505]">
            <PageHero
                title={`Order #${order.orderNumber.split('-').pop()}`}
                subtitle="Timeline of your jewelry's journey from our Maison to your hands."
                breadcrumbs={[{ label: "Account", href: "/profile" }, { label: "Orders", href: "/profile" }, { label: "Tracking" }]}
            />

            <div className="container mx-auto px-4 lg:px-12">
                <div className="mx-auto max-w-5xl">
                    <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase transition-all hover:text-gray-950 dark:hover:text-white">
                        <ArrowLeft size={14} /> Back to Maison
                    </button>

                    {isClaimable && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-8 shadow-lg shadow-emerald-500/10 dark:border-emerald-900/30 dark:bg-emerald-950/20"
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg">
                                        <Wallet size={28} />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-xl text-emerald-900 dark:text-emerald-400">Return Approved!</h3>
                                        <p className="text-sm text-emerald-700/80">Your physical return has been verified. You can now claim your refund.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleClaimRefund}
                                    disabled={isClaiming}
                                    className="flex w-full md:w-auto items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-10 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-500/30 transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                                >
                                    {isClaiming ? "Processing..." : "Claim Refund Now"} <ChevronRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    <div className="mb-8 rounded-3xl border border-gray-100 bg-white/60 p-8 shadow-sm backdrop-blur-xl dark:border-white/5 dark:bg-[#0C0A09]/60">
                        {isCancelled ? (
                            <div className="flex items-center justify-center py-6 text-rose-500">
                                <AlertCircle size={40} className="mr-4" /><h3 className="font-serif text-2xl">Order Cancelled</h3>
                            </div>
                        ) : (
                            <div className="relative flex justify-between">
                                <div className="absolute left-[10%] right-[10%] top-6 h-0.5 bg-gray-100 dark:bg-white/10" />
                                <div className="absolute left-[10%] top-6 h-0.5 bg-gold transition-all duration-1000 ease-in-out" style={{ width: `${Math.max(0, (currentStatusIdx / (orderSteps.length - 1)) * 80)}%` }} />
                                {orderSteps.map((step, idx) => (
                                    <div key={idx} className="relative z-10 flex flex-col items-center">
                                        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full border-4 transition-all duration-500 shadow-sm ${currentStatusIdx >= idx ? 'border-white bg-gold text-white dark:border-[#0C0A09]' : 'border-white bg-gray-50 text-gray-300 dark:border-[#0C0A09] dark:bg-white/5 dark:text-gray-600'} ${currentStatusIdx === idx ? 'ring-4 ring-gold/20 scale-110' : ''}`}>
                                            {step.icon}
                                        </div>
                                        <span className={`text-center text-[10px] font-bold tracking-widest uppercase ${currentStatusIdx >= idx ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>{step.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        <div className="lg:col-span-4 space-y-6">
                            <div className="rounded-3xl border border-gray-100 bg-white/60 p-6 shadow-sm dark:border-white/5 dark:bg-[#0C0A09]/60">
                                <h3 className="mb-6 font-serif text-xl flex items-center gap-3"><MapPin className="text-gold" size={20} /> Delivery Details</h3>
                                <div className="space-y-4 text-sm">
                                    <p className="font-medium text-gray-900 dark:text-white">{order.shippingName}</p>
                                    <p className="text-gray-500">{order.shippingPhone}</p>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{order.shippingAddress || "N/A"}</p>
                                </div>
                            </div>
                            <div className="rounded-3xl border border-gray-100 bg-white/60 p-6 shadow-sm dark:border-white/5 dark:bg-[#0C0A09]/60">
                                <h3 className="mb-6 font-serif text-xl flex items-center gap-3"><Receipt className="text-gold" size={20} /> Summary</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between"><span>Deposit:</span><span className="font-bold text-emerald-600">{(order.depositAmount || 0).toLocaleString()} VND</span></div>

                                    {order.status !== "DEPOSIT_PAID" && order.status !== "AWAITING_FULL_PAYMENT" && order.status !== "CANCELLED" && (
                                        <div className="space-y-3 pt-3">
                                            <div className="flex justify-between border-t border-gray-100 pt-3 dark:border-white/5">
                                                <span className="text-gray-500">Balance Paid:</span>
                                                <span className="font-bold text-emerald-600">{(order.totalAmount - order.depositAmount).toLocaleString()} VND</span>
                                            </div>
                                            {order.timeline?.find(t => t.status === "PREPARING" || t.status === "FULLY_PAID") && (
                                                <p className="text-[10px] text-gray-400 text-right italic">
                                                    Settled on {new Date(order.timeline.find(t => t.status === "PREPARING" || t.status === "FULLY_PAID")?.changedAt!).toLocaleDateString()} at {new Date(order.timeline.find(t => t.status === "PREPARING" || t.status === "FULLY_PAID")?.changedAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            )}
                                            <div className="flex justify-between bg-gold/5 p-2 rounded-lg border border-gold/10">
                                                <span className="font-serif text-teal-900 dark:text-gold">Total Paid:</span>
                                                <span className="font-bold text-teal-600 dark:text-teal-400">{order.totalAmount.toLocaleString()} VND</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {order.status === "AWAITING_FULL_PAYMENT" && (
                                        <div className="mt-6 border-t border-gray-100 pt-6 dark:border-white/5 text-center">
                                            <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest font-bold">Remaining Balance</p>
                                            <p className="text-xl font-bold text-gold mb-4">{(order.remainingAmount || 0).toLocaleString()} VND</p>
                                            <Link href={`/orders/${orderId}/payment`} className="inline-flex w-full justify-center items-center gap-2 rounded-xl bg-gold px-4 py-3 text-xs font-bold text-white uppercase hover:bg-gold/90 transition-all shadow-lg shadow-gold/20">
                                                Pay Remaining Balance <ChevronRight size={14} />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ── DIGITAL DOCUMENT VAULT ────────────────────── */}
                            <div className="rounded-3xl border border-gray-100 bg-white/60 p-6 shadow-sm dark:border-white/5 dark:bg-[#0C0A09]/60 relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 text-gold/10 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-700">
                                    <ShieldCheck size={120} />
                                </div>
                                
                                <h3 className="mb-6 font-serif text-xl flex items-center gap-3 relative z-10">
                                    <ShieldCheck className="text-gold" size={20} /> 
                                    The Jewel Vault
                                </h3>
                                
                                <div className="space-y-3 relative z-10">
                                    {/* Base Documents */}
                                    {order.invoiceUrl && (
                                        <a href={order.invoiceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 hover:bg-gold/5 border border-transparent hover:border-gold/20 transition-all group/item">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    <FileText size={16} />
                                                </div>
                                                <span className="text-xs font-bold tracking-wide text-gray-700 dark:text-gray-300">Official Invoice</span>
                                            </div>
                                            <ExternalLink size={14} className="text-gray-400 group-hover/item:text-gold" />
                                        </a>
                                    )}

                                    {order.insuranceUrl && (
                                        <a href={order.insuranceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 hover:bg-gold/5 border border-transparent hover:border-gold/20 transition-all group/item">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                                    <ShieldCheck size={16} />
                                                </div>
                                                <span className="text-xs font-bold tracking-wide text-gray-700 dark:text-gray-300">Insurance Policy</span>
                                            </div>
                                            <ExternalLink size={14} className="text-gray-400 group-hover/item:text-gold" />
                                        </a>
                                    )}

                                    {/* Certification Documents (Only when COMPLETED) */}
                                    {order.status === "COMPLETED" ? (
                                        <div className="pt-4 border-t border-gray-100 dark:border-white/5 space-y-3">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-2">Certifications</p>
                                            {order.items.map((item, idx) => (
                                                item.certificationUrl && (
                                                    <a key={idx} href={item.certificationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-gold/5 hover:bg-gold/10 border border-gold/10 transition-all group/item">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg bg-gold text-white shadow-sm shadow-gold/20">
                                                                <FileCheck2 size={16} />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-bold text-gray-950 dark:text-white uppercase truncate max-w-[120px]">{item.productName}</span>
                                                                <span className="text-[8px] font-medium text-gray-500 uppercase tracking-tighter">Certificate of Authenticity</span>
                                                            </div>
                                                        </div>
                                                        <ExternalLink size={14} className="text-gold" />
                                                    </a>
                                                )
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/20 mt-4">
                                            <p className="text-[9px] font-bold text-amber-700/80 dark:text-amber-500/80 uppercase leading-relaxed text-center tracking-widest italic">
                                                Certifications will be unlocked upon completion.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8">
                            {order.status === "DELIVERED" && !hasReturnRequest && (
                                <motion.div className="mb-8 rounded-3xl border border-teal-200 bg-teal-50/50 p-8 dark:border-teal-900/30 dark:bg-teal-900/10">
                                    <h3 className="mb-2 font-serif text-xl text-teal-900 dark:text-teal-400">Order Delivered</h3>
                                    <p className="mb-6 text-sm text-teal-700/80 leading-relaxed">Please confirm receipt of your luxury acquisition.</p>
                                    <button onClick={handleCompleteOrder} disabled={isCompleting} className="inline-flex items-center gap-3 rounded-2xl bg-teal-600 px-8 py-3.5 text-xs font-bold text-white uppercase transition-all hover:bg-teal-700 disabled:opacity-50">
                                        {isCompleting ? "Confirming..." : "Confirm Receipt"} <CheckCircle2 size={16} />
                                    </button>
                                </motion.div>
                            )}

                            {order.status === "COMPLETED" && !order.isReviewed && (
                                <motion.div className="mb-8 rounded-3xl border border-gold/30 bg-gold/5 p-8 shadow-inner shadow-gold/5">
                                    <div className="flex items-start gap-6">
                                        <div className="p-4 rounded-2xl bg-gold text-white shadow-lg shadow-gold/20"><Star size={24} /></div>
                                        <div>
                                            <h3 className="mb-2 font-serif text-xl">Share Your Experience</h3>
                                            <p className="mb-6 text-sm text-gray-500">Rate and upload a photo to receive a <strong>10% OFF reward coupon</strong>.</p>
                                            <button onClick={() => setIsReviewModalOpen(true)} className="inline-flex items-center gap-3 rounded-xl bg-gold px-8 py-3.5 text-xs font-bold text-white uppercase hover:bg-gold/90 transition-all">
                                                Rate & Review <Star size={16} fill="currentColor" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {order.isReviewed && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8 rounded-3xl border border-emerald-100 bg-emerald-50/50 p-8 text-center"
                                >
                                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h3 className="font-serif text-2xl text-emerald-900 dark:text-emerald-400">Thank You for Your Feedback!</h3>
                                    <p className="mt-3 text-sm text-emerald-700/80 leading-relaxed max-w-md mx-auto">
                                        Sharing your acquisition helps our artisans maintain the highest standard of excellence. 
                                        <br />
                                        <span className="font-bold">Please check your email for your exclusive reward coupon!</span>
                                    </p>
                                    <div className="mt-8 flex justify-center gap-3">
                                        <div className="rounded-full bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 border border-emerald-100 shadow-sm">
                                            Reward Dispatched
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {isReturnable && !hasReturnRequest && (
                                <motion.div className="mb-8 rounded-3xl border border-gray-200 bg-white/60 p-8 dark:border-white/5 dark:bg-[#0C0A09]/60">
                                    <h3 className="mb-2 font-serif text-xl">Assurance & Returns</h3>
                                    <p className="mb-6 text-sm text-gray-500 italic">Unboxing video evidence is mandatory for return processing.</p>
                                    <div className="flex items-center justify-between">
                                        <button onClick={() => setIsReturnModalOpen(true)} className="flex items-center gap-3 rounded-xl bg-gray-950 px-6 py-3.5 text-[10px] font-bold text-white uppercase dark:bg-white dark:text-gray-950">
                                            <RotateCcw size={16} /> Request Return
                                        </button>
                                        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{7 - daysSinceDelivery} days remaining</span>
                                    </div>
                                </motion.div>
                            )}

                            <div className="rounded-3xl border border-gray-100 bg-white/60 p-8 dark:border-white/5 dark:bg-[#0C0A09]/60">
                                <h3 className="mb-8 font-serif text-xl border-b border-gray-100 pb-4 dark:border-white/5 uppercase tracking-widest">Tracking Logistics</h3>
                                <div className="space-y-10 pl-8 relative">
                                    <div className="absolute top-2 bottom-2 left-[15px] w-[2px] bg-gray-100 dark:bg-white/10" />
                                    {[...(order.timeline || [])].sort((a,b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()).map((item, idx) => {
                                        // Parse evidenceUrl: could be JSON array ["url1","url2"] or legacy single URL
                                        let evidenceList: string[] = [];
                                        if (item.evidenceUrl) {
                                            try {
                                                const parsed = JSON.parse(item.evidenceUrl);
                                                evidenceList = Array.isArray(parsed) ? parsed : [item.evidenceUrl];
                                            } catch {
                                                evidenceList = [item.evidenceUrl];
                                            }
                                        }

                                        return (
                                        <div key={item.id} className="relative ml-2">
                                            <div className={`absolute -left-[35px] top-1 h-[22px] w-[22px] rounded-full border-4 border-white dark:border-[#0C0A09] ${idx === 0 ? "bg-gold" : "bg-gray-200"}`} />
                                            <h4 className={`text-sm font-bold uppercase ${idx === 0 ? 'text-gold' : ''}`}>{item.status.replace(/_/g, " ")}</h4>
                                            <ActorBadge type={item.actorType} />
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.note}</p>
                                            <p className="mt-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">{format(new Date(item.changedAt), "dd MMM yyyy, HH:mm")}</p>
                                            
                                            {/* Shipment Evidence Gallery */}
                                            {evidenceList.length > 0 && (
                                                <div className="mt-4 grid grid-cols-2 gap-3">
                                                    {evidenceList.map((url, i) => (
                                                        url.match(/\.(mp4|mov|webm|avi)/i) ? (
                                                            <video key={i} src={url} controls className="w-full rounded-xl border border-gray-100 dark:border-white/10 aspect-video object-cover" />
                                                        ) : (
                                                            <img key={i} src={url} alt={`Dispatch Evidence ${i + 1}`} className="w-full rounded-xl border border-gray-100 dark:border-white/10 aspect-video object-cover" />
                                                        )
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isReturnModalOpen} onClose={() => setIsReturnModalOpen(false)} title="Initiate Return" size="md" footer={
                <div className="flex gap-4 w-full">
                    <button onClick={() => setIsReturnModalOpen(false)} className="flex-1 rounded-xl border py-3 text-xs font-bold uppercase">Cancel</button>
                    <button onClick={handleSubmitReturn} disabled={isSubmittingReturn} className="flex-2 rounded-xl bg-gray-950 py-3 px-8 text-xs font-bold text-white uppercase disabled:opacity-50">
                        {isSubmittingReturn ? "Transmitting..." : "Submit Request"}
                    </button>
                </div>
            }>
                <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3 dark:bg-amber-950/20 dark:border-amber-900/30">
                        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                        <p className="text-xs text-amber-800 leading-relaxed dark:text-amber-400">
                            <strong>Note:</strong> If the reason for return is not due to a store error (e.g., incorrect item sent, product defect...), an insurance and handling fee equivalent to <strong>2% of the order total</strong> will be deducted from your refund.
                        </p>
                    </div>
                    <FormField label="Reason" required><textarea className={`${textareaCls} h-24`} value={returnReason} onChange={(e) => setReturnReason(e.target.value)} /></FormField>
                    <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50">
                        {unboxingVideo ? <div className="text-center"><Video size={32} className="text-emerald-500 mx-auto" /><p className="text-xs mt-1">{unboxingVideo.name}</p></div> : <div className="text-center"><Upload size={32} className="text-gray-400 mx-auto" /><p className="text-[10px] font-bold uppercase text-gray-400">Upload Unboxing Video (Max 50MB)</p></div>}
                        <input type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
                    </label>
                </div>
            </Modal>

            <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title="Acquisition Review" size="md" footer={
                <div className="flex gap-4 w-full">
                    <button onClick={() => setIsReviewModalOpen(false)} className="flex-1 rounded-xl border py-3 text-xs font-bold uppercase transition-all">Later</button>
                    <button onClick={handleSubmitReview} disabled={isSubmittingReview} className="flex-2 rounded-xl bg-gold py-3 px-8 text-xs font-bold text-white uppercase shadow-lg shadow-gold/20 disabled:opacity-50 font-sans tracking-widest">
                        {isSubmittingReview ? "Archiving..." : "Post Review"}
                    </button>
                </div>
            }>
                <div className="space-y-6">
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button key={s} onClick={() => setProjectRating(s)} className={`p-2 transition-transform hover:scale-110 ${rating >= s ? 'text-gold' : 'text-gray-200'}`}><Star size={32} fill={rating >= s ? "currentColor" : "none"} /></button>
                        ))}
                    </div>
                    <FormField label="Reflection"><textarea className={`${textareaCls} h-24`} value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} /></FormField>
                    <label className="flex h-40 w-full cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50">
                        {reviewImagePreview ? <img src={reviewImagePreview} className="h-full w-full object-cover" /> : <div className="m-auto text-center"><Camera size={32} className="text-gray-300 mx-auto" /><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Upload Acquisition Photo (Max 10MB)</p></div>}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                </div>
            </Modal>
        </main>
    );
}
