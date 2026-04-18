"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QrCode, X, Flashlight, RotateCcw, CheckCircle2, AlertCircle, Mail } from "lucide-react";

type ScanState = "idle" | "scanning" | "success" | "error";

export default function ShipperScannerPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId") ?? "";

    const videoRef = useRef<HTMLVideoElement>(null);
    const [scanState, setScanState] = useState<ScanState>("idle");
    const [scannedOrderId, setScannedOrderId] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [hasCamera, setHasCamera] = useState(true);
    const [resendCount, setResendCount] = useState(3);
    const streamRef = useRef<MediaStream | null>(null);

    // Start camera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setScanState("scanning");
        } catch {
            setHasCamera(false);
        }
    };

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
    };

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    // Mock QR Scan (real implementation would use jsQR or zxing)
    const handleMockScan = () => {
        const mockOrderId = orderId || "YJ-20250419-001";
        setScanState("success");
        setScannedOrderId(mockOrderId);
        stopCamera();
        // Auto redirect to POD after 1.5s
        setTimeout(() => {
            router.push(`/shipper/pod?orderId=${mockOrderId}`);
        }, 1500);
    };

    const handleResendEmail = () => {
        if (resendCount <= 0) return;
        setResendCount((c) => c - 1);
        // TODO: call API to resend QR email
    };

    return (
        <div className="relative flex min-h-[calc(100vh-3.5rem-6rem)] flex-col bg-black">
            {/* Camera View */}
            {scanState === "scanning" && hasCamera && (
                <div className="relative flex-1">
                    <video
                        ref={videoRef}
                        className="h-full w-full object-cover"
                        playsInline
                        muted
                        autoPlay
                    />

                    {/* Dark overlay with hole (pseudo via box-shadow) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {/* Scanning frame */}
                        <div className="relative h-64 w-64">
                            {/* Corner borders */}
                            <div className="absolute left-0 top-0 h-8 w-8 border-l-4 border-t-4 border-teal-400 rounded-tl-lg" />
                            <div className="absolute right-0 top-0 h-8 w-8 border-r-4 border-t-4 border-teal-400 rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-teal-400 rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-teal-400 rounded-br-lg" />
                            {/* Scanning line animation */}
                            <div className="animate-scan absolute left-0 right-0 h-0.5 bg-teal-400/80 shadow-[0_0_8px_2px_rgba(20,184,166,0.5)]" />
                        </div>

                        <div className="mt-6 rounded-full bg-black/60 px-6 py-3 backdrop-blur-md">
                            <p className="font-plus-jakarta text-sm font-bold text-white text-center tracking-wide">
                                Hướng camera vào mã QR của khách
                            </p>
                        </div>
                    </div>

                    {/* Top controls */}
                    <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                        <button
                            onClick={() => router.back()}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <p className="font-plus-jakarta text-xs font-bold uppercase tracking-widest text-white/80">
                            QR Scanner
                        </p>
                        <div className="h-10 w-10" />
                    </div>

                    {/* Bottom mock button (dev only) */}
                    <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-3">
                        <button
                            onClick={handleMockScan}
                            className="w-full rounded-2xl bg-teal-600 py-4 font-plus-jakarta text-sm font-black uppercase tracking-widest text-white shadow-xl active:scale-95"
                        >
                            [DEV] Mô Phỏng Quét Thành Công
                        </button>
                        <button
                            onClick={handleResendEmail}
                            disabled={resendCount <= 0}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black/50 py-3 font-plus-jakarta text-xs font-bold text-white/80 backdrop-blur-md disabled:opacity-40"
                        >
                            <Mail className="h-4 w-4" />
                            Gửi Lại Email QR ({resendCount} lần còn lại)
                        </button>
                    </div>
                </div>
            )}

            {/* No Camera Fallback */}
            {!hasCamera && (
                <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-800">
                        <QrCode className="h-10 w-10 text-gray-400" />
                    </div>
                    <div>
                        <h2 className="font-plus-jakarta text-xl font-black text-white">Không Thể Mở Camera</h2>
                        <p className="mt-2 font-plus-jakarta text-sm text-gray-400">
                            Vui lòng cấp quyền truy cập camera trong cài đặt trình duyệt
                        </p>
                    </div>
                    <button
                        onClick={() => { setHasCamera(true); startCamera(); }}
                        className="flex items-center gap-2 rounded-2xl bg-teal-600 px-6 py-3 font-plus-jakarta text-sm font-bold text-white"
                    >
                        <RotateCcw className="h-4 w-4" /> Thử Lại
                    </button>
                </div>
            )}

            {/* Success State */}
            {scanState === "success" && (
                <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-500/20 animate-pulse">
                        <CheckCircle2 className="h-12 w-12 text-teal-400" />
                    </div>
                    <div>
                        <h2 className="font-plus-jakarta text-2xl font-black text-white">Xác Thực Thành Công!</h2>
                        <p className="mt-2 font-plus-jakarta text-sm text-gray-400">Danh tính khách đã được xác nhận</p>
                        <p className="mt-1 font-mono text-xs text-teal-400">{scannedOrderId}</p>
                    </div>
                    <p className="font-plus-jakarta text-xs text-gray-500">Đang chuyển sang màn hình giao hàng...</p>
                </div>
            )}

            {/* Error State */}
            {scanState === "error" && (
                <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-rose-500/20">
                        <AlertCircle className="h-12 w-12 text-rose-400" />
                    </div>
                    <div>
                        <h2 className="font-plus-jakarta text-2xl font-black text-white">Mã QR Không Hợp Lệ</h2>
                        <p className="mt-2 font-plus-jakarta text-sm text-gray-400">{errorMsg}</p>
                    </div>
                    <button
                        onClick={() => { setScanState("idle"); startCamera(); }}
                        className="flex items-center gap-2 rounded-2xl bg-teal-600 px-6 py-3 font-plus-jakarta text-sm font-bold text-white"
                    >
                        <RotateCcw className="h-4 w-4" /> Quét Lại
                    </button>
                </div>
            )}

            {/* Idle State */}
            {scanState === "idle" && hasCamera && (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-600/20">
                        <QrCode className="h-10 w-10 text-teal-400" />
                    </div>
                    <p className="font-plus-jakarta text-lg font-bold text-white">Khởi Động Camera...</p>
                </div>
            )}

            <style jsx>{`
                @keyframes scan {
                    0% { top: 0; }
                    50% { top: calc(100% - 2px); }
                    100% { top: 0; }
                }
                .animate-scan {
                    animation: scan 2s linear infinite;
                }
            `}</style>
        </div>
    );
}
