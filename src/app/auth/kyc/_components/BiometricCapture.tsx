"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Camera, RefreshCw, CheckCircle2, Loader2, AlertCircle, Check } from "lucide-react";
import { motion } from "framer-motion";

// Polyfill TextEncoder if missing
if (typeof window !== "undefined" && !window.TextEncoder) {
    // @ts-ignore
    window.TextEncoder = class { encode(s) { return new Uint8Array([...s].map(c => c.charCodeAt(0))); } };
}

interface BiometricCaptureProps {
    onCapture: (file: File) => void;
}

export const BiometricCapture: React.FC<BiometricCaptureProps> = ({ onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [faceApi, setFaceApi] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const [livenessStatus, setLivenessStatus] = useState({
        turnedLeft: false,
        turnedRight: false,
        isCenter: false,
    });
    
    const [photo, setPhoto] = useState<string | null>(null);
    const [centerDuration, setCenterDuration] = useState(0);

    // Initial Model Loading
    useEffect(() => {
        const loadModels = async () => {
            try {
                const faceapi = await import("@vladmandic/face-api");
                setFaceApi(faceapi);
                const MODEL_URL = "https://cdn.jsdelivr.net/gh/vladmandic/face-api/model/";
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                ]);
                setIsModelsLoaded(true);
                startVideo();
            } catch (err) {
                console.error(err);
                setError("Failed to initialize AI Models.");
            }
        };
        loadModels();
    }, []);

    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" } 
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsDetecting(true);
            }
        } catch (err) {
            setError("Camera access denied.");
        }
    };

    // Detection Interval (User's Logic)
    useEffect(() => {
        let interval: any;
        if (isDetecting && isModelsLoaded && !photo && faceApi) {
            interval = setInterval(async () => {
                if (videoRef.current && videoRef.current.readyState === 4) {
                    const video = videoRef.current;
                    const displaySize = { width: video.videoWidth, height: video.videoHeight };
                    
                    if (canvasRef.current && canvasRef.current.width !== displaySize.width) {
                        faceApi.matchDimensions(canvasRef.current, displaySize);
                    }

                    const detections = await faceApi.detectSingleFace(video, new faceApi.TinyFaceDetectorOptions()).withFaceLandmarks();

                    if (detections) {
                        const landmarks = detections.landmarks;
                        const nose = landmarks.getNose()[0];
                        const leftEye = landmarks.getLeftEye()[0];
                        const rightEye = landmarks.getRightEye()[3]; // Outer edge

                        const distLeft = nose.x - leftEye.x;
                        const distRight = rightEye.x - nose.x;
                        const ratio = distLeft / (distRight || 1);

                        setLivenessStatus(prev => {
                            const nextStatus = { ...prev };
                            
                            // Step 1: Must turn left first
                            if (!prev.turnedLeft && ratio > 1.8) {
                                nextStatus.turnedLeft = true;
                            }
                            // Step 2: Only after left is done, turn right
                            else if (prev.turnedLeft && !prev.turnedRight && ratio < 0.55) {
                                nextStatus.turnedRight = true;
                            }
                            
                            // isCenter should always reflect the *current* state
                            nextStatus.isCenter = (ratio >= 0.8 && ratio <= 1.2); 
                            return nextStatus;
                        });
                    } else {
                        // Reset center if no face is detected
                        setLivenessStatus(prev => ({ ...prev, isCenter: false }));
                    }
                }
            }, 300);
        }
        return () => clearInterval(interval);
    }, [isDetecting, isModelsLoaded, photo, faceApi]);

    // 2-Second Center Counter Logic
    useEffect(() => {
        let timer: any;
        if (livenessStatus.turnedLeft && livenessStatus.turnedRight && !photo) {
            if (livenessStatus.isCenter) {
                // If it's center, increase progress every 100ms
                timer = setInterval(() => {
                    setCenterDuration(prev => {
                        const next = prev + 100;
                        if (next >= 2000) {
                            clearInterval(timer);
                            capturePhoto();
                        }
                        return next;
                    });
                }, 100);
            } else {
                // If not center, reset the progress
                setCenterDuration(0);
            }
        }
        return () => clearInterval(timer);
    }, [livenessStatus, photo]);

    const capturePhoto = useCallback(() => {
        if (!videoRef.current) return;
        
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            // Apply scaleX(-1) transformation to mirror the UI display
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(videoRef.current, 0, 0);
            const imageSrc = canvas.toDataURL("image/jpeg", 0.95);
            setPhoto(imageSrc);

            fetch(imageSrc).then(res => res.blob()).then(blob => {
                const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
                onCapture(file);
            });
        }
        
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
    }, [onCapture]);


    const reset = () => {
        setPhoto(null);
        setLivenessStatus({ turnedLeft: false, turnedRight: false, isCenter: false });
        setCenterDuration(0);
        setError(null);
        startVideo();
    };

    // Derived State for UX
    const currentStep = !livenessStatus.turnedLeft ? 1 : (!livenessStatus.turnedRight ? 2 : 3);
    const centerProgressPercentage = Math.min(100, (centerDuration / 2000) * 100);

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gray-50 dark:bg-black/20 border-2 border-gray-100 dark:border-white/5">
            <div className="relative aspect-square md:aspect-video w-full overflow-hidden bg-black">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    playsInline 
                    className={`h-full w-full object-cover transition-opacity duration-500 -scale-x-100 ${photo ? "opacity-50" : "opacity-100"}`}
                />
                <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    {/* Face Guide Frame */}
                    <div className={`h-64 w-64 md:h-80 md:w-80 rounded-full border-4 border-dashed transition-all duration-500 scale-110 ${
                        photo ? "border-emerald-500 bg-emerald-500/10" : 
                        currentStep === 3 && livenessStatus.isCenter ? "border-gold animate-pulse" : "border-white/30"
                    }`}>
                        {(photo) && (
                            <div className="flex h-full w-full items-center justify-center">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="rounded-full bg-emerald-500 p-6 text-white shadow-xl">
                                    <Check size={48} strokeWidth={3} />
                                </motion.div>
                            </div>
                        )}
                    </div>

                    {/* Instructions Overlay */}
                    <div className="absolute bottom-10 left-0 right-0 p-6 flex justify-center">
                        <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl px-8 py-5 text-center shadow-2xl min-w-[300px]">
                            {!isModelsLoaded ? (
                                <div className="flex flex-col items-center gap-3 text-white">
                                    <Loader2 className="animate-spin text-gold" size={24} />
                                    <span className="text-sm font-bold tracking-[0.2em] uppercase">Initializing AI Maison...</span>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center gap-3 text-rose-400">
                                    <AlertCircle size={28} />
                                    <p className="text-xs font-medium leading-relaxed">{error}</p>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); reset(); }} 
                                        className="mt-2 bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-xl text-xs font-bold text-white uppercase tracking-widest transition-all pointer-events-auto"
                                    >
                                        Retry Session
                                    </button>
                                </div>
                            ) : photo ? (
                                <div className="flex items-center justify-center gap-3 text-emerald-400">
                                    <CheckCircle2 size={20} />
                                    <span className="text-sm font-bold tracking-[0.2em] uppercase">Identity Captured</span>
                                </div>
                            ) : (
                                <>
                                    {currentStep === 1 && (
                                        <div className="space-y-1">
                                            <p className="text-base font-serif text-white italic">Step 1</p>
                                            <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase animate-pulse">← Turn face to the LEFT</p>
                                        </div>
                                    )}
                                    {currentStep === 2 && (
                                        <div className="space-y-1">
                                            <p className="text-base font-serif text-white italic">Step 2</p>
                                            <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase animate-pulse">Now Turn to the RIGHT →</p>
                                        </div>
                                    )}
                                    {currentStep === 3 && (
                                        <div className="space-y-3">
                                            <p className="text-base font-serif text-white italic">Final Step</p>
                                            <p className="text-xs font-bold tracking-[0.2em] text-white uppercase">Look straight and hold still</p>
                                            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden flex items-end">
                                               <div className="h-full bg-gold transition-all duration-100 shadow-[0_0_10px_#D4AF37]" style={{ width: `${centerProgressPercentage}%` }}></div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Actions if Captured */}
            {photo && (
                <div className="p-4 flex justify-center bg-white dark:bg-[#0a0a0a]">
                    <button 
                        onClick={reset}
                        className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 hover:text-gold uppercase transition-all"
                    >
                        <RefreshCw size={14} /> Retake Biometric Scan
                    </button>
                </div>
            )}
        </div>
    );
};
