"use client";

import React, { useRef } from "react";
import { Camera, Mail, ShieldCheck, Shield, Loader2 } from "lucide-react";
import { UserProfile } from "@/types/user.types";
import { useUpdateAvatar } from "@/hooks/useUser";

interface ProfileHeaderProps {
    user: UserProfile;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const updateAvatar = useUpdateAvatar();

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            await updateAvatar.mutateAsync(file);
        } catch (err) {
            console.error("Avatar upload failed", err);
        }
    };

    return (
        <div className="relative h-64 md:h-80 bg-black overflow-hidden">
            {/* Elegant Background Pattern/Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold/20 via-black to-black"></div>
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            
            <div className="container mx-auto px-4 h-full flex items-end pb-12 relative z-10">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left w-full">
                    {/* Avatar with Upload Trigger */}
                    <div className="relative group">
                        <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white/10 overflow-hidden bg-gray-900 shadow-2xl relative">
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-gold/20">
                                    <UserIcon size={64} />
                                </div>
                            )}
                            
                            {updateAvatar.isPending && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <Loader2 className="animate-spin text-gold" size={32} />
                                </div>
                            )}
                        </div>
                        
                        <button 
                            onClick={handleAvatarClick}
                            className="absolute bottom-2 right-2 h-10 w-10 bg-gold rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
                        >
                            <Camera size={18} />
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                    </div>

                    <div className="flex-1 pb-2">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                            <h1 className="text-3xl md:text-4xl font-serif text-white uppercase tracking-[0.2em]">{user.fullName}</h1>
                            {user.kycStatus === "VERIFIED" && (
                                <div className="text-emerald-500" title="Verified Identity">
                                    <ShieldCheck size={24} />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-400 text-sm font-medium tracking-widest uppercase">
                            <span className="flex items-center gap-2"><Mail size={14} className="text-gold" /> {user.email}</span>
                            <span className="h-1 w-1 rounded-full bg-gray-600 hidden md:block"></span>
                            <span className="flex items-center gap-2">
                                {user.twoFaEnabled ? (
                                    <><ShieldCheck size={14} className="text-emerald-500" /> 2FA Active</>
                                ) : (
                                    <><Shield size={14} className="text-gold/50" /> 2FA Inactive</>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper internal component
const UserIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);
