"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, Check, AlertCircle, Loader2, X } from "lucide-react";

interface KycCameraProps {
    onCapture: (images: { front: string; back: string; face: string }) => void;
    onCancel: () => void;
}

type KycStep = "front" | "back" | "face" | "review";

export const KycCamera: React.FC<KycCameraProps> = ({ onCapture, onCancel }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const [step, setStep] = useState<KycStep>("front");
    const [images, setImages] = useState({ front: "", back: "", face: "" });
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startCamera = async () => {
        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            const constraints = {
                video: {
                    facingMode: step === "face" ? "user" : "environment",
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
        } catch (err) {
            setError("Không thể truy cập Camera. Vui lòng cấp quyền.");
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
    }, [step]);

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL("image/jpeg", 0.8);

        if (step === "front") {
            setImages(prev => ({ ...prev, front: base64 }));
            setStep("back");
        } else if (step === "back") {
            setImages(prev => ({ ...prev, back: base64 }));
            setStep("face");
        } else if (step === "face") {
            setImages(prev => ({ ...prev, face: base64 }));
            setStep("review");
        }
    };

    const handleFinish = () => {
        setIsLoading(true);
        onCapture(images);
    };

    const getInstruction = () => {
        switch (step) {
            case "front": return "Chụp mặt TRƯỚC CMND/CCCD";
            case "back": return "Chụp mặt SAU CMND/CCCD";
            case "face": return "Chụp khuôn mặt của bạn";
            case "review": return "Kiểm tra lại hình ảnh";
        }
    };

    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col text-white">
            {/* Header */}
            <div className="p-4 flex justify-between items-center bg-black/50">
                <span className="text-sm font-medium">{getInstruction()}</span>
                <button onClick={onCancel} className="p-2 bg-white/10 rounded-full">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Camera View */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                {step !== "review" ? (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        
                        {/* Overlay Guider */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            {step === "face" ? (
                                <div className="w-64 h-80 border-2 border-yellow-500 rounded-[100px] shadow-[0_0_0_1000px_rgba(0,0,0,0.5)]"></div>
                            ) : (
                                <div className="w-[85%] aspect-[1.6/1] border-2 border-yellow-500 rounded-xl shadow-[0_0_0_1000px_rgba(0,0,0,0.5)]"></div>
                            )}
                            <p className="mt-8 text-yellow-400 font-bold bg-black/60 px-4 py-2 rounded-full">
                                Căn chỉnh vừa khung hình
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="grid grid-cols-1 gap-4 p-6 overflow-y-auto h-full w-full">
                        <div className="space-y-2">
                             <p className="text-xs text-slate-400">Mặt trước</p>
                             <img src={images.front} className="rounded-lg w-full" />
                        </div>
                        <div className="space-y-2">
                             <p className="text-xs text-slate-400">Mặt sau</p>
                             <img src={images.back} className="rounded-lg w-full" />
                        </div>
                        <div className="space-y-2">
                             <p className="text-xs text-slate-400">Chân dung</p>
                             <img src={images.face} className="rounded-lg w-full" />
                        </div>
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Footer Actions */}
            <div className="p-10 flex justify-center items-center bg-black/50">
                {step !== "review" ? (
                    <button
                        onClick={captureImage}
                        className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                    >
                        <div className="w-16 h-16 border-4 border-black rounded-full" />
                    </button>
                ) : (
                    <div className="flex space-x-4 w-full px-4">
                        <button
                            onClick={() => setStep("front")}
                            className="flex-1 h-14 rounded-full border border-white/20 font-bold"
                        >
                            Chụp lại
                        </button>
                        <button
                            disabled={isLoading}
                            onClick={handleFinish}
                            className="flex-1 h-14 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : "Gửi hồ sơ"}
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="absolute inset-x-4 top-20 bg-red-500 p-4 rounded-xl flex items-center space-x-3">
                    <AlertCircle />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};
