"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/api-client";
import { useProfile } from "./useAuth";

export const getHomeUrl = (role?: string) => {
    const r = role?.toLowerCase();
    if (r === "admin") return "/admin";
    if (r === "vendor") return "/vendor";
    if (r === "shipper") return "/shipper";
    return "/";
};

/**
 * Redirect to login if user is not authenticated.
 * Use in pages that require auth.
 */
export function useAuthGuard() {
    const router = useRouter();
    const { data: profile, isLoading, isError } = useProfile();

    useEffect(() => {
        const token = getAccessToken();
        if (!token) {
            const currentPath = window.location.pathname;
            const returnUrlParam = currentPath !== "/" ? `?returnUrl=${encodeURIComponent(currentPath)}` : "";
            router.replace(`/auth/login${returnUrlParam}`);
            return;
        }

        if (isError) {
            router.replace("/auth/login");
        }
    }, [isError, router]);

    return { profile, isLoading, isError, isAuthenticated: !!profile };
}

/**
 * Redirect to home if user IS already authenticated.
 * Use in auth pages (login, register) to prevent re-login.
 */
export function useRedirectIfAuthenticated() {
    const router = useRouter();

    useEffect(() => {
        const token = getAccessToken();
        if (token) {
            const redirectUrl = sessionStorage.getItem("redirect_after_login");
            if (redirectUrl) {
                sessionStorage.removeItem("redirect_after_login");
                router.replace(redirectUrl);
            } else {
                // Get role from cookie to determine correct dashboard
                const role = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('user_role='))
                    ?.split('=')[1];
                router.replace(getHomeUrl(role));
            }
        }
    }, [router]);
}

/**
 * Redirect to home if user IS NOT admin or vendor.
 * Use in admin pages to prevent unauthorized access.
 */
export function useAdminGuard() {
    const router = useRouter();
    const { profile, isLoading, isError } = useAuthGuard();

    useEffect(() => {
        if (!isLoading && profile) {
            const role = profile.role?.toLowerCase();
            if (role !== "admin") {
                router.replace(getHomeUrl(role));
            }
        }
    }, [profile, isLoading, router]);

    return { profile, isLoading, isError };
}

/**
 * Redirect to home if user IS NOT vendor (or admin with elevated access).
 * Use in vendor portal pages.
 */
export function useVendorGuard() {
    const router = useRouter();
    const { profile, isLoading, isError } = useAuthGuard();

    useEffect(() => {
        if (!isLoading && profile) {
            const role = profile.role?.toLowerCase();
            if (role !== "vendor" && role !== "admin") {
                router.replace(getHomeUrl(role));
            }
        }
    }, [profile, isLoading, router]);

    return { profile, isLoading, isError };
}

/**
 * Redirect to home if user IS NOT a shipper.
 * Use in shipper portal pages.
 */
export function useShipperGuard() {
    const router = useRouter();
    const { profile, isLoading, isError } = useAuthGuard();

    useEffect(() => {
        if (!isLoading && profile) {
            const role = profile.role?.toLowerCase();
            if (role !== "shipper" && role !== "admin") {
                router.replace(getHomeUrl(role));
            }
        }
    }, [profile, isLoading, router]);

    return { profile, isLoading, isError };
}
