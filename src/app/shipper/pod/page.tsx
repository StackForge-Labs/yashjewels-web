"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, CheckCircle2, Package, MapPin, User, ChevronLeft, RotateCcw, Upload } from "lucide-react";

type PodState = "review" | "capture" | "confirm" | "done";

// Mock order data — real impl would fetch from API
const mockOrderData = {
    orderId: "YJ-20250419-001",
    customer: "Nguyễn Văn An",
    address: "45 Nguyễn Huệ, P. Bến Nghé, Q.1, TP.HCM",
    product: "Nhẫn Kim Cương D-VVS1 18K",
    amount: 45000000,
};

function formatVnd(n: number) {
    return new Intl.NumberFormat("vi-VN").format(n) + " ₫";
}

// ─── Swipe Slider ─────────────────────────────────────────
function SwipeConfirmSlider({ onConfirm }: { onConfirm: () => void }) {
    const [position, setPosition] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const confirmed = position > 250;

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const rect = sliderRef.current?.getBoundingClientRect();
        if (!rect) return;
        const newPos = Math.min(Math.max(0, e.clientX - rect.left - 28), rect.width - 56);
        setPosition(newPos);
    };
    const handleMouseUp = () => {
        setIsDragging(false);
        if (confirmed) {
            onConfirm();
        } else {
            setPosition(0);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const rect = sliderRef.current?.getBoundingClientRect();
        if (!rect) return;
        const touch = e.touches[0];
        const newPos = Math.min(Math.max(0, touch.clientX - rect.left - 28), rect.width - 56);
        setPosition(newPos);
    };
    const handleTouchEnd = () => {
        if (confirmed) {
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
            {/* Track fill */}
            <div
                className="absolute left-1 h-12 rounded-xl bg-teal-600/10 transition-none"
                style={{ width: position + 56 }}
            />
            {/* Label */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-plus-jakarta text-sm font-bold tracking-wide text-teal-700/60 dark:text-teal-400/50">
                    {confirmed ? "Thả để xác nhận →" : "← Vuốt để Xác Nhận Giao Hàng"}
                </span>
            </div>
            {/* Handle */}
            <div
                className="relative z-10 flex h-12 w-12 cursor-grab items-center justify-center rounded-xl bg-teal-600 shadow-lg transition-none active:cursor-grabbing"
                style={{ transform: `translateX(${position}px)` }}
                onMouseDown={handleMouseDown}
                onTouchStart={() => setIsDragging(true)}
            >
                <ChevronLeft className="h-5 w-5 rotate-180 text-white" />
            </div>
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────
export default function ShipperPodPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId") ?? mockOrderData.orderId;

    const [podState, setPodState] = useState<PodState>("review");
    const [photo, setPhoto] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPhoto(url);
        setPodState("confirm");
    };

    const handleConfirmDelivery = () => {
        // TODO: call API to update order status to DELIVERED with POD photo
        setPodState("done");
    };

    if (podState === "done") {
        return (
            <div className="flex min-h-[calc(100vh-3.5rem-6rem)] flex-col items-center justify-center gap-6 bg-white p-8 text-center dark:bg-[#0a0a0a]">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-900/20">
                    <CheckCircle2 className="h-14 w-14 text-teal-600" />
                </div>
                <div>
                    <h2 className="font-plus-jakarta text-2xl font-black text-gray-900 dark:text-white">ĐÃ GIAO THÀNH CÔNG!</h2>
                    <p className="mt-2 font-plus-jakarta text-sm text-gray-500">Đơn hàng {orderId} đã được xác nhận giao đến tay khách hàng</p>
                </div>
                <div className="flex flex-col gap-3 w-full">
                    <button
                        onClick={() => router.push("/shipper")}
                        className="w-full rounded-2xl bg-teal-600 py-4 font-plus-jakarta text-sm font-black uppercase tracking-widest text-white"
                    >
                        Về Danh Sách Đơn
                    </button>
                    <button
                        onClick={() => router.push("/shipper/scanner")}
                        className="w-full rounded-2xl border border-gray-200 py-4 font-plus-jakarta text-sm font-bold text-gray-600 dark:border-gray-700"
                    >
                        Giao Đơn Tiếp Theo
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
                    <button onClick={() => router.back()} className="text-gray-400">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h1 className="font-plus-jakarta text-base font-bold text-gray-900 dark:text-white">Xác Nhận Giao Hàng</h1>
                </div>

                <div className="rounded-xl bg-teal-50 p-4 dark:bg-teal-900/10">
                    <div className="flex items-center gap-2 mb-3">
                        <Package className="h-4 w-4 text-teal-600" />
                        <span className="font-mono text-xs font-bold text-teal-600">{orderId}</span>
                    </div>
                    <div className="flex items-start gap-2 mb-2">
                        <User className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                        <div>
                            <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">{mockOrderData.customer}</p>
                            <p className="font-plus-jakarta text-xs text-gray-500">{mockOrderData.product}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                        <p className="font-plus-jakarta text-xs text-gray-600 dark:text-gray-300">{mockOrderData.address}</p>
                    </div>
                </div>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-4 p-4">
                {/* Step 1: Identity Verified badge */}
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800/30 dark:bg-emerald-900/10">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    <div>
                        <p className="font-plus-jakarta text-sm font-bold text-emerald-800 dark:text-emerald-400">Danh Tính Đã Xác Thực</p>
                        <p className="font-plus-jakarta text-xs text-emerald-600/80">QR FaceMatch thành công — {mockOrderData.customer}</p>
                    </div>
                </div>

                {/* Step 2: Photo Proof */}
                <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-[#111]">
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full font-plus-jakarta text-xs font-black ${photo ? "bg-emerald-600 text-white" : "bg-teal-600 text-white"}`}>
                            {photo ? <CheckCircle2 className="h-4 w-4" /> : "2"}
                        </div>
                        <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">Chụp Ảnh Đồng Kiểm</p>
                    </div>

                    {photo ? (
                        <div className="relative">
                            <img src={photo} alt="POD photo" className="w-full rounded-xl object-cover h-48" />
                            <button
                                onClick={() => { setPhoto(null); setPodState("review"); }}
                                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </button>
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
                                className="flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed border-teal-200 bg-teal-50/50 py-8 transition-all active:scale-95 dark:border-teal-800/30 dark:bg-teal-900/5"
                            >
                                <Camera className="h-8 w-8 text-teal-400" />
                                <span className="font-plus-jakarta text-sm font-bold text-teal-700 dark:text-teal-400">Nhấn để Chụp Ảnh</span>
                                <span className="font-plus-jakarta text-xs text-teal-500/70">Chụp ảnh sản phẩm đã mở hộp cùng khách</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Step 3: Confirm Slider */}
                {podState === "confirm" && photo && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-[#111]">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 font-plus-jakarta text-xs font-black text-white">3</div>
                            <p className="font-plus-jakarta text-sm font-bold text-gray-900 dark:text-white">Xác Nhận Giao Hàng</p>
                        </div>
                        <SwipeConfirmSlider onConfirm={handleConfirmDelivery} />
                    </div>
                )}

                {/* Upload another proof option */}
                <div className="rounded-2xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <Upload className="h-5 w-5 text-gray-300" />
                        <div>
                            <p className="font-plus-jakarta text-sm font-bold text-gray-400">Video Unboxing (Tuỳ Chọn)</p>
                            <p className="font-plus-jakarta text-xs text-gray-300">Khách có thể upload video xem hàng sau khi nhận</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
