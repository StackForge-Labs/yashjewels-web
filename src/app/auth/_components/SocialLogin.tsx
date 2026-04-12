"use client";

import { Facebook } from "@/app/_components/icon/Facebook";
import { Google } from "@/app/_components/icon/Google";
import { useGoogleLogin, useFacebookLogin } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import React from "react";

export const SocialLogin = () => {
    const google = useGoogleLogin();
    const facebook = useFacebookLogin();

    const handleGoogleLogin = async () => {
        // Google Identity Services (GIS) — popup flow
        if (typeof window === "undefined") return;

        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) {
            console.warn("NEXT_PUBLIC_GOOGLE_CLIENT_ID not configured");
            return;
        }

        try {
            // Dynamically load Google Identity Services script
            if (!document.getElementById("google-gis-script")) {
                await new Promise<void>((resolve, reject) => {
                    const script = document.createElement("script");
                    script.id = "google-gis-script";
                    script.src = "https://accounts.google.com/gsi/client";
                    script.async = true;
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error("Failed to load Google SDK"));
                    document.head.appendChild(script);
                });
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const googleClient = (window as any).google;
            if (!googleClient) return;

            googleClient.accounts.id.initialize({
                client_id: clientId,
                callback: (response: { credential: string }) => {
                    if (response.credential) {
                        google.mutate(response.credential);
                    }
                },
            });

            googleClient.accounts.id.prompt();
        } catch (err) {
            console.error("Google login error:", err);
        }
    };

    const handleFacebookLogin = async () => {
        if (typeof window === "undefined") return;

        const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
        if (!appId) {
            console.warn("NEXT_PUBLIC_FACEBOOK_APP_ID not configured");
            return;
        }

        try {
            // Dynamically load Facebook SDK
            if (!document.getElementById("facebook-jssdk")) {
                await new Promise<void>((resolve) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (window as any).fbAsyncInit = function () {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const FB = (window as any).FB;
            if (!FB) return;

            FB.login(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (response: any) => {
                    if (response.authResponse?.accessToken) {
                        facebook.mutate(response.authResponse.accessToken);
                    }
                },
                { scope: "email,public_profile" },
            );
        } catch (err) {
            console.error("Facebook login error:", err);
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4 text-center">
            <button
                onClick={handleGoogleLogin}
                disabled={google.isPending}
                className="flex items-center justify-center gap-3 rounded-xl border border-gray-100 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-white/5 dark:text-gray-300 dark:hover:bg-white/5"
            >
                {google.isPending ? <Loader2 size={18} className="animate-spin" /> : <Google size={18} />}
                Google
            </button>
            <button
                onClick={handleFacebookLogin}
                disabled={facebook.isPending}
                className="flex items-center justify-center gap-3 rounded-xl border border-gray-100 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-white/5 dark:text-gray-300 dark:hover:bg-white/5"
            >
                {facebook.isPending ? <Loader2 size={18} className="animate-spin" /> : <Facebook size={18} />}
                Facebook
            </button>
        </div>
    );
};
