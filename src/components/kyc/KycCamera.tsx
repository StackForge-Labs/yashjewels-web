"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { AlertCircle, Loader2, X, Check } from "lucide-react";
import { motion } from "framer-motion";

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

    // Liveness detection state (active only during step === "face")
    const [faceApi, setFaceApi] = useState<any>(null);
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [livenessStatus, setLivenessStatus] = useState({
        turnedLeft: false,
        turnedRight: false,
        isCenter: false,
    });
    const [centerDuration, setCenterDuration] = useState(0);
    const isCapturing = useRef(false);
    const faceCaptured = useRef(false);

    const startCamera = async (forStep?: KycStep) => {
        const targetStep = forStep ?? step;
        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            const constraints = {
                video: {
                    facingMode: targetStep === "face" ? "user" : "environment",
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
        } catch {
            setError("Không thể truy cập Camera. Vui lòng cấp quyền.");
        }
    };

    useEffect(() => {
        startCamera(step);
        return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
    }, [step]);

    // Load face-api models when entering face step
    useEffect(() => {
        if (step !== "face") return;

        let cancelled = false;
        const loadModels = async () => {
            try {
                const faceapi = await import("@vladmandic/face-api");
                if (cancelled) return;
                const MODEL_URL = "https://cdn.jsdelivr.net/gh/vladmandic/face-api/model/";
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                ]);
                if (cancelled) return;
                setFaceApi(faceapi);
                setIsModelsLoaded(true);
            } catch {
                if (!cancelled) setError("Không thể khởi động AI. Vui lòng thử lại.");
            }
        };

        setIsModelsLoaded(false);
        setFaceApi(null);
        setLivenessStatus({ turnedLeft: false, turnedRight: false, isCenter: false });
        setCenterDuration(0);
        isCapturing.current = false;
        faceCaptured.current = false;

        loadModels();
        return () => { cancelled = true; };
    }, [step]);

    // Detection interval for liveness
    useEffect(() => {
        if (step !== "face" || !isModelsLoaded || !faceApi || faceCaptured.current) return;

        const interval = setInterval(async () => {
            const video = videoRef.current;
            if (!video || video.readyState !== 4) return;

            const detections = await faceApi
                .detectSingleFace(video, new faceApi.TinyFaceDetectorOptions())
                .withFaceLandmarks();

            if (detections) {
                const landmarks = detections.landmarks;
                const nose = landmarks.getNose()[0];
                const leftEye = landmarks.getLeftEye();
                const rightEye = landmarks.getRightEye();

                const distLeft = nose.x - leftEye[0].x;
                const distRight = rightEye[3].x - nose.x;
                const ratio = distLeft / (distRight || 1);

                setLivenessStatus(prev => {
                    let { turnedLeft, turnedRight } = prev;
                    let changed = false;

                    if (!turnedLeft && ratio > 1.8) {
                        turnedLeft = true;
                        changed = true;
                    } else if (turnedLeft && !turnedRight && ratio < 0.55) {
                        turnedRight = true;
                        changed = true;
                    }

                    const newIsCenter = ratio >= 0.8 && ratio <= 1.25;
                    if (prev.isCenter !== newIsCenter) changed = true;

                    if (!changed) return prev;
                    return { turnedLeft, turnedRight, isCenter: newIsCenter };
                });
            } else {
                setLivenessStatus(prev => prev.isCenter ? { ...prev, isCenter: false } : prev);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [step, isModelsLoaded, faceApi]);

    // Center hold counter → auto capture after 3s
    useEffect(() => {
        if (step !== "face" || !livenessStatus.turnedLeft || !livenessStatus.turnedRight || faceCaptured.current) return;

        let timer: any;
        if (livenessStatus.isCenter) {
            timer = setInterval(() => {
                setCenterDuration(prev => {
                    const next = prev + 100;
                    if (next >= 3000) {
                        clearInterval(timer);
                        captureFace();
                    }
                    return next;
                });
            }, 100);
        } else {
            setCenterDuration(0);
        }
        return () => clearInterval(timer);
    }, [livenessStatus, step]);

    const captureFace = useCallback(() => {
        if (!videoRef.current || isCapturing.current || faceCaptured.current) return;
        isCapturing.current = true;
        faceCaptured.current = true;

        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Mirror the selfie frame
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0);
        const base64 = canvas.toDataURL("image/jpeg", 0.9);

        setImages(prev => ({ ...prev, face: base64 }));
        setStep("review");
    }, []);

    const captureIdCard = () => {
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
        }
    };

    const handleFinish = () => {
        setIsLoading(true);
        onCapture(images);
    };

    const handleRetake = () => {
        isCapturing.current = false;
        faceCaptured.current = false;
        setImages({ front: "", back: "", face: "" });
        setStep("front");
    };

    const getInstruction = () => {
        switch (step) {
            case "front": return "Chụp mặt TRƯỚC CMND/CCCD";
            case "back": return "Chụp mặt SAU CMND/CCCD";
            case "face": return "Chụp khuôn mặt của bạn";
            case "review": return "Kiểm tra lại hình ảnh";
        }
    };

    const livenessStep = !livenessStatus.turnedLeft ? 1 : (!livenessStatus.turnedRight ? 2 : 3);
    const centerProgressPct = Math.min(100, (centerDuration / 3000) * 100);

    return (
        <div className="fixed inset-0 bg-black z-100 flex flex-col text-white">
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
                            className={`absolute inset-0 w-full h-full object-cover ${step === "face" ? "-scale-x-100" : ""}`}
                        />

                        {/* Overlay Guide */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            {step === "face" ? (
                                <div className={`w-64 h-80 border-2 rounded-[100px] shadow-[0_0_0_1000px_rgba(0,0,0,0.5)] transition-colors duration-300 ${livenessStep === 3 && livenessStatus.isCenter ? "border-yellow-400 animate-pulse" : "border-yellow-500"}`} />
                            ) : (
                                <div className="w-[85%] aspect-[1.6/1] border-2 border-yellow-500 rounded-xl shadow-[0_0_0_1000px_rgba(0,0,0,0.5)]" />
                            )}

                            {/* Liveness instruction panel */}
                            {step === "face" && (
                                <div className="absolute bottom-10 left-4 right-4 flex justify-center">
                                    <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 text-center min-w-70">
                                        {!isModelsLoaded ? (
                                            <div className="flex flex-col items-center gap-2 text-white">
                                                <Loader2 className="animate-spin text-yellow-400" size={22} />
                                                <span className="text-xs font-bold tracking-widest uppercase">Đang khởi động AI...</span>
                                            </div>
                                        ) : error ? (
                                            <div className="flex flex-col items-center gap-2 text-red-400">
                                                <AlertCircle size={22} />
                                                <p className="text-xs">{error}</p>
                                            </div>
                                        ) : livenessStep === 1 ? (
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold tracking-widest text-white/50 uppercase">Bước 1 / 3</p>
                                                <p className="text-sm font-bold text-yellow-400 uppercase animate-pulse">← Quay mặt sang TRÁI</p>
                                            </div>
                                        ) : livenessStep === 2 ? (
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold tracking-widest text-white/50 uppercase">Bước 2 / 3</p>
                                                <p className="text-sm font-bold text-yellow-400 uppercase animate-pulse">Quay mặt sang PHẢI →</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <p className="text-[10px] font-bold tracking-widest text-white/50 uppercase">Bước cuối</p>
                                                <p className="text-sm font-bold text-white uppercase">Nhìn thẳng vào camera</p>
                                                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-yellow-400 transition-all duration-100 shadow-[0_0_8px_#facc15]"
                                                        style={{ width: `${centerProgressPct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {step !== "face" && (
                                <p className="mt-8 text-yellow-400 font-bold bg-black/60 px-4 py-2 rounded-full">
                                    Căn chỉnh vừa khung hình
                                </p>
                            )}
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
                {step === "review" ? (
                    <div className="flex space-x-4 w-full px-4">
                        <button
                            onClick={handleRetake}
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
                ) : step !== "face" ? (
                    <button
                        onClick={captureIdCard}
                        className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                    >
                        <div className="w-16 h-16 border-4 border-black rounded-full" />
                    </button>
                ) : (
                    // Placeholder to maintain footer height during face liveness step
                    <div className="h-20" />
                )}
            </div>

            {error && step !== "face" && (
                <div className="absolute inset-x-4 top-20 bg-red-500 p-4 rounded-xl flex items-center space-x-3">
                    <AlertCircle />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};
