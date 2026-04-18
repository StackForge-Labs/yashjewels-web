"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/api-client";
import { useProfile } from "./useAuth";

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
            router.replace("/auth/login");
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
                router.replace("/");
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
            if (role !== "admin" && role !== "vendor") {
                router.replace("/");
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
                router.replace("/");
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
                router.replace("/");
            }
        }
    }, [profile, isLoading, router]);

    return { profile, isLoading, isError };
}
