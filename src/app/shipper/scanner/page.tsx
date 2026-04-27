"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Mail, Loader2, RotateCcw, CheckCircle2, AlertCircle, ShieldCheck, QrCode } from "lucide-react";
import { shipperService } from "@/services/shipper.service";
import toast from "react-hot-toast";
import { Html5Qrcode } from "html5-qrcode";

type ScanState = "idle" | "scanning" | "success" | "error";

function ShipperScannerContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId") ?? "";
    const mode = searchParams.get("mode") ?? "delivery";

    const [scanState, setScanState] = useState<ScanState>("idle");
    const [hasCamera, setHasCamera] = useState(true);
    const [resendCount, setResendCount] = useState(3);
    const [isResending, setIsResending] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const isHandlingSuccess = useRef(false);

    // Hàm dừng quét an toàn
    const cleanupScanner = async () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            try {
                await scannerRef.current.stop();
            } catch (e) {
                console.warn("Scanner stop warning:", e);
            }
        }
    };

    const startScanner = async () => {
        try {
            await cleanupScanner();
            setHasCamera(true);
            setScanState("scanning");
            isHandlingSuccess.current = false;

            // Đảm bảo element "reader" đã tồn tại
            const html5QrCode = new Html5Qrcode("reader");
            scannerRef.current = html5QrCode;

            const config = {
                fps: 20, // Tăng fps để quét cực nhạy
                qrbox: { width: 250, height: 250 },
            };

            await html5QrCode.start(
                { facingMode: "environment" },
                config,
                (decodedText) => {
                    if (isHandlingSuccess.current) return;
                    isHandlingSuccess.current = true;
                    onScanSuccess(decodedText);
                },
                () => { /* Duy trì quét liên tục */ }
            );
        } catch (err) {
            console.error("Scanner Start Failed:", err);
            setHasCamera(false);
            setScanState("error");
            setErrorMsg("Không thể khởi động camera. Vui lòng cấp quyền và thử lại.");
        }
    };

    const onScanSuccess = async (decodedText: string) => {
        if (!orderId) {
            toast.error("Thiếu thông tin đơn hàng!");
            isHandlingSuccess.current = false;
            return;
        }

        // Thông báo ngay lập tức cho người dùng biết là đã "ăn"
        setScanState("success");
        toast.success("Mã QR hợp lệ!");

        // Dọn dẹp scanner sau khi thành công
        await cleanupScanner();

        setTimeout(() => {
            router.push(`/shipper/pod?orderId=${orderId}&qrToken=${decodedText}&mode=${mode}`);
        }, 1000);
    };

    useEffect(() => {
        // Delay nhẹ để đảm bảo DOM đã render xong hoàn toàn
        const timer = setTimeout(startScanner, 500);
        return () => {
            clearTimeout(timer);
            cleanupScanner();
        };
    }, []);

    const handleResendEmail = async () => {
        if (resendCount <= 0 || !orderId) return;
        setIsResending(true);
        try {
            const res = await shipperService.resendQrCode(orderId);
            if (res.success) {
                toast.success("Mã QR mới đã được gửi!");
                setResendCount((c) => c - 1);
            } else {
                toast.error(res.message || "Gửi thất bại.");
            }
        } catch (error: any) {
            toast.error("Lỗi kết nối máy chủ.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-black font-plus-jakarta">
            
            {/* ── Camera Engine (Full Viewport Background) ── */}
            <div id="reader" className="absolute inset-0 z-0 h-full w-full bg-black" />

            {/* ── UI Viewfinder (Z-10) ── */}
            {scanState === "scanning" && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                    {/* Darker Vignette */}
                    <div className="absolute inset-0 bg-black/40" />

                    {/* Scan Target Area */}
                    <div className="relative z-20 flex flex-col items-center">
                        <p className="mb-6 text-[10px] font-black text-white/90 tracking-[0.3em] uppercase drop-shadow-md">
                            Xác thực đơn hàng
                        </p>

                        <div className="relative h-64 w-64">
                            {/* Brackets */}
                            <div className="absolute -left-1 -top-1 h-12 w-12 border-l-[5px] border-t-[5px] border-teal-400 rounded-tl-3xl" />
                            <div className="absolute -right-1 -top-1 h-12 w-12 border-r-[5px] border-t-[5px] border-teal-400 rounded-tr-3xl" />
                            <div className="absolute -bottom-1 -left-1 h-12 w-12 border-b-[5px] border-l-[5px] border-teal-400 rounded-bl-3xl" />
                            <div className="absolute -bottom-1 -right-1 h-12 w-12 border-b-[5px] border-r-[5px] border-teal-400 rounded-br-3xl" />

                            {/* Laser Animation */}
                            <div className="absolute left-2 right-2 h-[2px] bg-teal-400 shadow-[0_0_15px_#2dd4bf] animate-laser-move" />
                            
                            <div className="absolute inset-0 flex items-center justify-center opacity-5">
                                <QrCode className="w-32 h-32 text-white" />
                            </div>
                        </div>

                        <div className="mt-12 flex items-center gap-3 rounded-full bg-black/60 px-6 py-3 border border-white/10 backdrop-blur-xl">
                            <div className="h-2 w-2 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_#2dd4bf]" />
                            <span className="text-[10px] font-bold text-white tracking-widest uppercase">Đang nhận diện...</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Top Bar ── */}
            <div className="absolute left-4 right-4 top-5 z-30 flex items-center justify-between">
                <button
                    onClick={() => { cleanupScanner(); router.back(); }}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-2xl border border-white/10 transition active:scale-90"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="flex items-center gap-2 rounded-full bg-teal-500/10 px-4 py-2 border border-teal-500/20 backdrop-blur-md">
                    <ShieldCheck className="h-4 w-4 text-teal-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400">Yash Jewels Secure</span>
                </div>
            </div>

            {/* ── Bottom Action ── */}
            {scanState === "scanning" && (
                <div className="absolute bottom-10 left-6 right-6 z-30">
                    <button
                        onClick={handleResendEmail}
                        disabled={resendCount <= 0 || isResending}
                        className="flex w-full items-center justify-center gap-3 rounded-[2rem] bg-white/10 py-5 font-bold text-white backdrop-blur-3xl border border-white/10 transition active:scale-95 disabled:opacity-30"
                    >
                        {isResending ? <Loader2 className="h-4 w-4 animate-spin text-teal-400" /> : <Mail className="h-4 w-4 text-teal-400" />}
                        Gửi lại mã QR cho khách ({resendCount})
                    </button>
                </div>
            )}

            {/* ── Overlays ── */}
            {scanState === "success" && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/95 backdrop-blur-sm">
                    <div className="h-24 w-24 rounded-full bg-teal-500/20 flex items-center justify-center animate-scale-in">
                        <CheckCircle2 className="h-12 w-12 text-teal-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Xác thực thành công</h2>
                </div>
            )}

            {!hasCamera && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black p-10 text-center">
                    <AlertCircle className="h-16 w-16 text-rose-500" />
                    <h2 className="text-xl font-bold text-white">Lỗi Camera</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">{errorMsg}</p>
                    <button onClick={startScanner} className="mt-4 rounded-2xl bg-teal-600 px-10 py-4 font-bold text-white active:scale-95 transition">
                        <RotateCcw className="w-4 h-4 inline mr-2" /> Thử Lại
                    </button>
                </div>
            )}

            {/* ── Global Fix Styles ── */}
            <style jsx global>{`
                /* Ép video chiếm toàn bộ không gian nhưng không object-fit cover quá đà để tránh lệch tọa độ quét */
                #reader video {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: contain !important;
                    background: black;
                }
                /* CHỈ ẨN các thành phần UI dư thừa của thư viện */
                #qr-shaded-region { display: none !important; }
                #reader__dashboard, #reader__header_message { display: none !important; }
                
                @keyframes laser-move {
                    0% { top: 5%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 95%; opacity: 0; }
                }
                .animate-laser-move {
                    animation: laser-move 2s linear infinite;
                }
                @keyframes scale-in {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
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
