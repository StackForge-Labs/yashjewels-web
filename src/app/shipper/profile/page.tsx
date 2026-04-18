"use client";

import { useProfile } from "@/hooks/useAuth";
import { clearTokens } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { User, LogOut, Phone, Mail, ShieldCheck, Truck, Star } from "lucide-react";

export default function ShipperProfilePage() {
    const router = useRouter();
    const { data: profile } = useProfile();

    const handleLogout = () => {
        clearTokens();
        router.replace("/auth/login");
    };

    const stats = [
        { label: "Đã Giao", value: "142", icon: Truck, color: "text-teal-600 bg-teal-50 dark:bg-teal-500/10" },
        { label: "Đánh Giá", value: "4.9⭐", icon: Star, color: "text-amber-600 bg-amber-50 dark:bg-amber-500/10" },
        { label: "Tỷ Lệ", value: "98%", icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" },
    ];

    return (
        <div className="flex flex-col gap-4 p-4">
            {/* Profile Card */}
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-8 text-white shadow-lg">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                    <User className="h-10 w-10 text-white" />
                </div>
                <div className="text-center">
                    <h2 className="font-plus-jakarta text-xl font-black">{profile?.fullName ?? "Shipper"}</h2>
                    <p className="font-plus-jakarta text-sm text-white/70">Nhân Viên Giao Hàng</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                {stats.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-[#111]">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <p className="font-plus-jakarta text-lg font-black text-gray-900 dark:text-white">{s.value}</p>
                            <p className="font-plus-jakarta text-[10px] uppercase tracking-wider text-gray-400">{s.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-[#111]">
                <p className="font-plus-jakarta text-[10px] font-bold uppercase tracking-widest text-gray-400">Thông Tin Liên Hệ</p>
                <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="font-plus-jakarta text-sm text-gray-700 dark:text-gray-300">{profile?.email ?? "—"}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="font-plus-jakarta text-sm text-gray-700 dark:text-gray-300">{profile?.phone ?? "—"}</span>
                </div>
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 py-4 font-plus-jakarta text-sm font-bold text-rose-700 transition-all active:scale-95 dark:border-rose-900/30 dark:bg-rose-500/10 dark:text-rose-400"
            >
                <LogOut className="h-4 w-4" /> Đăng Xuất
            </button>
        </div>
    );
}
