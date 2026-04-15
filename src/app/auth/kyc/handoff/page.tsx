"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useInitKycSession, useKycSessionStatus } from "@/hooks/useAuth";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Smartphone, CheckCircle2, RotateCcw } from "lucide-react";

export default function KycHandoffPage() {
    const { profile: user, isLoading: isAuthLoading } = useAuthGuard();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [sessionToken, setSessionToken] = useState<string | null>(null);
    const [qrUrl, setQrUrl] = useState<string | null>(null);

    const initSession = useInitKycSession();
    const { data: statusRes, isLoading: isStatusLoading } = useKycSessionStatus(sessionToken || "", !!sessionToken);

    useEffect(() => {
        if (user && !sessionToken && !initSession.isPending) {
            handleInit();
        }
    }, [user, sessionToken]);

    const handleInit = async () => {
        try {
            const res = await initSession.mutateAsync();
            if (res.success && res.data) {
                setSessionToken(res.data.sessionToken);
                setQrUrl(res.data.qrUrl);
            }
        } catch (error) {
            console.error("Failed to init KYC session", error);
        }
    };

    const status = statusRes?.data;

    useEffect(() => {
        if (status === "Completed") {
            // Đánh dấu profile cần tải lại ngay
            queryClient.invalidateQueries({ queryKey: ["profile"] });

            // Success! Redirect to profile or a success page
            setTimeout(() => {
                router.push("/profile?kyc=success");
            }, 2000);
        }
    }, [status, queryClient]);

    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030303] flex items-center justify-center p-4">
            <Card className="max-w-md w-full shadow-xl border-none overflow-hidden">
                <div className="bg-primary h-2 w-full" />
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                        <Smartphone className="w-6 h-6 text-primary" />
                        Xác minh bảo mật
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-center pt-4">
                    {status === "Completed" ? (
                        <div className="py-8 animate-in zoom-in duration-300">
                            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Xác thực thành công!</h3>
                            <p className="text-slate-500">Đang quay trở lại trang cá nhân...</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-slate-600 dark:text-slate-400">
                                Để đảm bảo an toàn cho các giao dịch giá trị cao, vui lòng sử dụng điện thoại để thực hiện xác minh khuôn mặt.
                            </p>

                            <div className="relative group mx-auto w-[250px] h-[250px] bg-white p-2 rounded-2xl shadow-inner border border-slate-100 dark:border-white/5 flex items-center justify-center overflow-hidden">
                                {initSession.isPending ? (
                                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                ) : qrUrl ? (
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrUrl)}`}
                                        alt="KYC QR Code"
                                        className="w-full h-full rounded-xl transition-transform group-hover:scale-105 duration-300"
                                    />
                                ) : (
                                    <Button variant="ghost" onClick={handleInit}>
                                        <RotateCcw className="w-4 h-4 mr-2" /> Thử lại
                                    </Button>
                                )}
                            </div>

                            <div className="text-left bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                                <h4 className="font-semibold text-blue-900 dark:text-blue-400 mb-2 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full">1</span>
                                    Hướng dẫn:
                                </h4>
                                <ul className="text-sm text-blue-800 dark:text-blue-300/80 space-y-2 list-none ml-1">
                                    <li className="flex gap-2">
                                        <div className="mt-1 w-1 h-1 bg-blue-400 rounded-full flex-shrink-0" />
                                        Mở ứng dụng Camera trên điện thoại của bạn
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="mt-1 w-1 h-1 bg-blue-400 rounded-full flex-shrink-0" />
                                        Quét mã QR ở trên
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="mt-1 w-1 h-1 bg-blue-400 rounded-full flex-shrink-0" />
                                        Làm theo các bước trên điện thoại của bạn
                                    </li>
                                </ul>
                            </div>

                            <p className="text-[12px] text-slate-400 italic">
                                Trang này sẽ tự động cập nhật khi bạn xác minh thành công.
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
