"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QrCode, X, Mail, Loader2, RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";
import { shipperService } from "@/services/shipper.service";
import toast from "react-hot-toast";
import { Html5Qrcode } from "html5-qrcode";

type ScanState = "idle" | "scanning" | "success" | "error";

function ShipperScannerContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId") ?? "";
    const mode = searchParams.get("mode") ?? "delivery"; // "delivery" or "return"

    const [scanState, setScanState] = useState<ScanState>("idle");
    const [scannedQrToken, setScannedQrToken] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [hasCamera, setHasCamera] = useState(true);
    const [resendCount, setResendCount] = useState(3);
    const [isResending, setIsResending] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);

    const startScanner = async () => {
        try {
            if (scannerRef.current && scannerRef.current.isScanning) {
                await scannerRef.current.stop();
            }
            const html5QrCode = new Html5Qrcode("reader");
            scannerRef.current = html5QrCode;
            setScanState("scanning");
            setHasCamera(true);
            await html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                },
                (decodedText) => {
                    handleScanSuccess(decodedText);
                },
                () => { }
            );
        } catch (err) {
            console.error("Scanner Error:", err);
            setHasCamera(false);
            setScanState("error");
            setErrorMsg("Không thể mở camera. Vui lòng kiểm tra quyền truy cập.");
        }
    };

    useEffect(() => {
        startScanner();
        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(console.error);
            }
        };
    }, []);

    const handleScanSuccess = async (decodedText: string) => {
        if (!orderId) return;

        // Stop scanner immediately to prevent double execution
        if (scannerRef.current && scannerRef.current.isScanning) {
            try {
                await scannerRef.current.stop();
            } catch (e) {
                console.error("Stop failed", e);
            }
        }

        setScannedQrToken(decodedText);
        setScanState("success");
        toast.success("Mã QR hợp lệ!");

        // Auto redirect to POD
        setTimeout(() => {
            router.push(`/shipper/pod?orderId=${orderId}&qrToken=${decodedText}&mode=${mode}`);
        }, 1500);
    };

    const handleResendEmail = async () => {
        if (resendCount <= 0 || !orderId) return;
        setIsResending(true);
        try {
            const res = await shipperService.resendQrCode(orderId);
            if (res.success) {
                toast.success("Đã gửi mã QR mới cho khách hàng.");
                setResendCount((c) => c - 1);
            } else {
                toast.error(res.message || "Gửi thất bại.");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Lỗi kỹ thuật.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="relative flex h-screen w-full flex-col bg-black overflow-hidden">
            {/* Camera View Container */}
            <div id="reader" className="absolute inset-0 h-full w-full [&>video]:h-full [&>video]:w-full [&>video]:object-cover" />

            {/* Scanning Overlay (Always visible when scanning) */}
            {scanState === "scanning" && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                    {/* Dark Mask Overlays */}
                    <div className="absolute left-0 right-0 top-0 bg-black/60" style={{ height: 'calc(50% - 125px)' }} />
                    <div className="absolute left-0 right-0 bottom-0 bg-black/60" style={{ height: 'calc(50% - 125px)' }} />
                    <div className="absolute left-0 bg-black/60" style={{ top: 'calc(50% - 125px)', bottom: 'calc(50% - 125px)', width: 'calc(50% - 125px)' }} />
                    <div className="absolute right-0 bg-black/60" style={{ top: 'calc(50% - 125px)', bottom: 'calc(50% - 125px)', width: 'calc(50% - 125px)' }} />

                    {/* Scanning Frame Layout */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="relative h-[250px] w-[250px] overflow-hidden">
                            <div className="absolute inset-0 border border-white/20 rounded-3xl" />
                            <div className="absolute left-0 top-0 h-12 w-12 border-l-4 border-t-4 border-teal-400 rounded-tl-3xl" />
                            <div className="absolute right-0 top-0 h-12 w-12 border-r-4 border-t-4 border-teal-400 rounded-tr-3xl" />
                            <div className="absolute bottom-0 left-0 h-12 w-12 border-b-4 border-l-4 border-teal-400 rounded-bl-3xl" />
                            <div className="absolute bottom-0 right-0 h-12 w-12 border-b-4 border-r-4 border-teal-400 rounded-br-3xl" />
                            <div className="absolute left-2 right-2 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_20px_rgba(45,212,191,0.8)] animate-scan" style={{ top: '0%' }} />
                        </div>

                        <div className="mt-16 flex flex-col items-center gap-3">
                            <div className="rounded-full bg-black/60 px-8 py-3.5 backdrop-blur-xl border border-white/10 shadow-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 animate-pulse rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
                                    <p className="font-plus-jakarta text-[11px] font-bold text-white tracking-[0.2em] uppercase">
                                        Đang tìm mã QR...
                                    </p>
                                </div>
                            </div>
                            <p className="text-[10px] text-white/40 font-medium tracking-wide">Đặt mã QR vào giữa khung hình</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Bar */}
            <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/40 text-white backdrop-blur-xl border border-white/10 transition hover:bg-black/60"
                >
                    <X className="h-6 w-6" />
                </button>
                <div className="rounded-full bg-teal-600/20 px-4 py-2 border border-teal-500/20 backdrop-blur-md">
                    <p className="font-plus-jakarta text-[10px] font-black uppercase tracking-[0.2em] text-teal-400">
                        Secure Scanner v2
                    </p>
                </div>
                <div className="w-12 h-12" />
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-10 left-6 right-6 z-20 flex flex-col gap-4">
                <button
                    onClick={handleResendEmail}
                    disabled={resendCount <= 0 || isResending || !orderId}
                    className="flex w-full items-center justify-center gap-3 rounded-[2rem] bg-white/10 py-5 font-plus-jakarta text-xs font-bold text-white backdrop-blur-2xl border border-white/5 disabled:opacity-30 transition-all active:scale-95"
                >
                    {isResending ? <Loader2 className="h-4 w-4 animate-spin text-teal-400" /> : <Mail className="h-4 w-4 text-teal-400" />}
                    Gửi Lại Mã Cho Khách ({resendCount})
                </button>
            </div>

            {/* Status Overlays */}
            {!hasCamera && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-black/90 p-8 text-center">
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
                        onClick={startScanner}
                        className="flex items-center gap-2 rounded-2xl bg-teal-600 px-6 py-3 font-plus-jakarta text-sm font-bold text-white"
                    >
                        <RotateCcw className="h-4 w-4" /> Thử Lại
                    </button>
                </div>
            )}

            {scanState === "success" && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-black/90 p-8 text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-500/20 animate-pulse">
                        <CheckCircle2 className="h-12 w-12 text-teal-400" />
                    </div>
                    <div>
                        <h2 className="font-plus-jakarta text-2xl font-black text-white">
                            {mode === "return" ? "Mã QR Hợp Lệ!" : "Quét Bằng Chứng Thành Công!"}
                        </h2>
                        <p className="mt-2 font-plus-jakarta text-sm text-gray-400">
                            {mode === "return" ? "Đã xác thực yêu cầu thu hồi hàng" : "Chữ ký điện tử toàn vẹn"}
                        </p>
                    </div>
                    <p className="font-plus-jakarta text-xs font-bold text-teal-500">
                        Đang chuyển sang bước chụp ảnh POD...
                    </p>
                </div>
            )}

            {scanState === "error" && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-black/90 p-8 text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-rose-500/20">
                        <AlertCircle className="h-12 w-12 text-rose-400" />
                    </div>
                    <div>
                        <h2 className="font-plus-jakarta text-2xl font-black text-white">Lỗi Quét Mã</h2>
                        <p className="mt-2 font-plus-jakarta text-sm text-gray-400">{errorMsg}</p>
                    </div>
                    <button
                        onClick={startScanner}
                        className="flex items-center gap-2 rounded-2xl bg-teal-600 px-6 py-3 font-plus-jakarta text-sm font-bold text-white"
                    >
                        <RotateCcw className="h-4 w-4" /> Quét Lại
                    </button>
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

export default function ShipperScannerPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
            </div>
        }>
            <ShipperScannerContent />
        </Suspense>
    );
}
