"use client";

import { useState } from "react";
import { Shield, ShieldCheck, Loader2, Copy, AlertCircle, CheckCircle2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";
import { useSetup2Fa, useEnable2Fa, useDisable2Fa } from "@/hooks/useAuth";

interface TwoFactorSectionProps {
    isEnabled: boolean;
}

type ToastType = { message: string; type: "success" | "error" } | null;

function InlineToast({ toast }: { toast: ToastType }) {
    if (!toast) return null;
    return (
        <div className={`mt-4 flex items-center gap-3 rounded-xl p-4 text-sm font-medium ${toast.type === "success"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
            }`}>
            {toast.type === "success"
                ? <CheckCircle2 size={16} className="shrink-0" />
                : <AlertCircle size={16} className="shrink-0" />}
            {toast.message}
        </div>
    );
}

export function TwoFactorSection({ isEnabled }: TwoFactorSectionProps) {
    const [isSettingUp, setIsSettingUp] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [qrData, setQrData] = useState<{ sharedKey: string; authenticatorUri: string } | null>(null);
    const [toast, setToast] = useState<ToastType>(null);

    const setup2Fa = useSetup2Fa();
    const enable2Fa = useEnable2Fa();
    const disable2Fa = useDisable2Fa();

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleToggle = async (checked: boolean) => {
        if (checked) {
            try {
                const res = await setup2Fa.mutateAsync();
                if (res.success && res.data) {
                    setQrData(res.data);
                    setIsSettingUp(true);
                    setToast(null);
                } else {
                    showToast(res.message || "Không thể khởi tạo 2FA", "error");
                }
            } catch {
                showToast("Lỗi kết nối server. Vui lòng thử lại.", "error");
            }
        } else {
            const code = prompt("Nhập mã OTP 6 số để tắt 2FA:");
            if (code) {
                try {
                    const res = await disable2Fa.mutateAsync(code);
                    if (res.success) {
                        showToast("Đã tắt xác thực 2 lớp thành công.", "success");
                    } else {
                        showToast(res.message || "Mã không đúng.", "error");
                    }
                } catch {
                    showToast("Lỗi hệ thống khi tắt 2FA.", "error");
                }
            }
        }
    };

    const handleVerifyAndEnable = async () => {
        if (otpCode.length !== 6) {
            showToast("Vui lòng nhập đủ 6 chữ số.", "error");
            return;
        }

        try {
            const res = await enable2Fa.mutateAsync(otpCode);
            if (res.success) {
                showToast("Xác thực 2 lớp đã được bật thành công!", "success");
                setIsSettingUp(false);
                setQrData(null);
                setOtpCode("");
            } else {
                showToast(res.message || "Mã không chính xác.", "error");
            }
        } catch {
            showToast("Xác thực thất bại. Vui lòng thử lại.", "error");
        }
    };

    const handleCancelSetup = () => {
        setIsSettingUp(false);
        setQrData(null);
        setOtpCode("");
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast("Đã sao chép mã bí mật!", "success");
    };

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 dark:border-white/5 dark:bg-[#0a0a0a]">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isEnabled ? "bg-emerald-500/10 text-emerald-500" : "bg-gold/10 text-gold"
                        }`}>
                        {isEnabled ? <ShieldCheck size={24} /> : <Shield size={24} />}
                    </div>
                    <div>
                        <h3 className="font-serif text-lg md:text-xl text-gray-900 dark:text-white uppercase tracking-wider">Two-Factor Authentication</h3>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                            {isEnabled
                                ? "Tài khoản của bạn đang được bảo vệ bởi lớp xác thực thứ hai."
                                : "Thêm lớp bảo mật bằng mã OTP khi đăng nhập."}
                        </p>
                    </div>
                </div>
                {!isSettingUp && (
                    <Switch
                        checked={isEnabled}
                        onCheckedChange={handleToggle}
                        disabled={setup2Fa.isPending || enable2Fa.isPending || disable2Fa.isPending}
                    />
                )}
            </div>

            <InlineToast toast={toast} />

            {/* QR Setup Panel */}
            {isSettingUp && qrData && (
                <div className="mt-8 rounded-2xl bg-slate-50 p-6 md:p-8 dark:bg-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* QR Code */}
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 bg-white rounded-2xl shadow-xl dark:bg-white inline-block">
                                <QRCodeSVG value={qrData.authenticatorUri} size={180} />
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                                Quét bằng Google Authenticator hoặc Authy
                            </p>
                        </div>

                        {/* Instructions */}
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Bước 1: Đăng ký ứng dụng</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
                                    Mở ứng dụng xác thực trên điện thoại và quét mã QR. Nếu không quét được, nhập mã bí mật này theo cách thủ công:
                                </p>
                                <div className="flex items-center gap-2 rounded-xl bg-white p-3 border border-gray-100 dark:bg-black dark:border-white/10 shadow-sm">
                                    <code className="flex-1 font-mono text-xs tracking-widest text-gold break-all uppercase font-bold">
                                        {qrData.sharedKey}
                                    </code>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(qrData.sharedKey)}
                                        className="ml-2 shrink-0 text-gray-400 hover:text-gold transition-all active:scale-95"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-bold text-gray-900 dark:text-white font-serif">Bước 2: Xác nhận kích hoạt</h4>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Input
                                        placeholder="000000"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        className="text-center font-serif text-3xl tracking-[0.4em] h-14 bg-white dark:bg-black"
                                        maxLength={6}
                                        inputMode="numeric"
                                    />
                                    <Button
                                        onClick={handleVerifyAndEnable}
                                        disabled={enable2Fa.isPending || otpCode.length !== 6}
                                        className="h-14 bg-gold hover:bg-gold/90 text-white font-bold tracking-widest uppercase px-8 shadow-lg shadow-gold/20"
                                    >
                                        {enable2Fa.isPending ? <Loader2 size={18} className="animate-spin" /> : "Kích hoạt"}
                                    </Button>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-gray-100 dark:border-white/5">
                                <button
                                    onClick={handleCancelSetup}
                                    className="text-xs font-bold text-gray-400 hover:text-red-500 tracking-widest uppercase transition-colors"
                                >
                                    Hủy thiết lập
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
