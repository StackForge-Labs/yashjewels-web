"use client";

import { Facebook } from "@/app/_components/icon/Facebook";
import { Google } from "@/app/_components/icon/Google";
import { useGoogleLogin as useSocialGoogle } from "@react-oauth/google";
import { useGoogleLogin as useAuthGoogle, useFacebookLogin } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import React from "react";

interface SocialLoginProps {
    onError?: (message: string) => void;
}

export const SocialLogin = ({ onError }: SocialLoginProps) => {
    const google = useAuthGoogle();
    const facebook = useFacebookLogin();

    const extractError = (err: any) => {
        const res = err?.response?.data;
        return res?.errors?.[0] ?? res?.message ?? err?.message ?? "Social login failed.";
    };

    // 100% Custom Google UI logic
    const handleGoogleLogin = useSocialGoogle({
        onSuccess: (tokenResponse) => {
            if (tokenResponse.access_token) {
                google.mutate(tokenResponse.access_token, {
                    onError: (err) => onError?.(extractError(err)),
                });
            }
        },
        onError: () => onError?.("Google Login Failed"),
    });

    const handleFacebookLogin = async () => {
        if (typeof window === "undefined") return;

        const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
        if (!appId) {
            console.warn("NEXT_PUBLIC_FACEBOOK_APP_ID not configured");
            return;
        }

        try {
            if (!document.getElementById("facebook-jssdk")) {
                await new Promise<void>((resolve) => {
                    (window as any).fbAsyncInit = function () {
                        (window as any).FB.init({
                            appId,
                            cookie: true,
                            xfbml: false,
                            version: "v18.0",
                        });
                        resolve();
                    };

                    const script = document.createElement("script");
                    script.id = "facebook-jssdk";
                    script.src = "https://connect.facebook.net/en_US/sdk.js";
                    script.async = true;
                    document.head.appendChild(script);
                });
            }

            const FB = (window as any).FB;
            if (!FB) return;

            FB.login(
                (response: any) => {
                    if (response.authResponse?.accessToken) {
                        facebook.mutate(response.authResponse.accessToken, {
                            onError: (err) => onError?.(extractError(err)),
                        });
                    }
                },
                { scope: "email,public_profile" },
            );
        } catch (err) {
            console.error("Facebook login error:", err);
            onError?.("Facebook login error");
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Custom Google Button */}
            <button
                type="button"
                onClick={() => handleGoogleLogin()}
                disabled={google.isPending}
                className="flex h-[48px] items-center justify-center gap-3 rounded-xl border border-gray-100 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-white/5 dark:text-gray-300 dark:hover:bg-white/5 active:scale-[0.98]"
            >
                {google.isPending ? (
                    <Loader2 size={18} className="animate-spin text-gold" />
                ) : (
                    <>
                        <Google size={18} />
                        Google
                    </>
                )}
            </button>

            {/* Facebook Button */}
            <button
                type="button"
                onClick={handleFacebookLogin}
                disabled={facebook.isPending}
                className="flex h-[48px] items-center justify-center gap-3 rounded-xl border border-gray-100 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-white/5 dark:text-gray-300 dark:hover:bg-white/5 active:scale-[0.98]"
            >
                {facebook.isPending ? (
                    <Loader2 size={18} className="animate-spin text-gold" />
                ) : (
                    <>
                        <Facebook size={18} />
                        Facebook
                    </>
                )}
            </button>
        </div>
    );
};
