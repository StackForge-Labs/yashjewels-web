"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setUser, clearUser } from "@/store/userSlice";
import { setTokens, clearTokens, getRefreshToken, getAccessToken } from "@/lib/api-client";
import {
    loginApi,
    registerApi,
    verifyEmailApi,
    resendOtpApi,
    forgotPasswordApi,
    resetPasswordApi,
    googleLoginApi,
    facebookLoginApi,
    logoutApi,
    getProfileApi,
} from "@/lib/auth";
import type { AuthResponse } from "@/types/user.types";

// ── Helper: save tokens + dispatch profile ─────────────────────
function useAuthSuccess() {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    return (authData: AuthResponse) => {
        setTokens(authData.accessToken, authData.refreshToken);
        queryClient.invalidateQueries({ queryKey: ["profile"] });
    };
}

// ── Login ──────────────────────────────────────────────────────
export function useLogin() {
    const onSuccess = useAuthSuccess();
    const router = useRouter();

    return useMutation({
        mutationFn: loginApi,
        onSuccess: (res) => {
            if (res.success && res.data) {
                onSuccess(res.data);
                router.push("/");
            }
        },
    });
}

// ── Register ───────────────────────────────────────────────────
export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: registerApi,
        onSuccess: (res, variables) => {
            if (res.success) {
                router.push(`/auth/verify-email?email=${encodeURIComponent(variables.email)}`);
            }
        },
    });
}

// ── Verify Email ───────────────────────────────────────────────
export function useVerifyEmail() {
    const onSuccess = useAuthSuccess();
    const router = useRouter();

    return useMutation({
        mutationFn: verifyEmailApi,
        onSuccess: (res) => {
            if (res.success && res.data) {
                onSuccess(res.data);
                router.push("/");
            }
        },
    });
}

// ── Resend OTP ─────────────────────────────────────────────────
export function useResendOtp() {
    return useMutation({
        mutationFn: resendOtpApi,
    });
}

// ── Forgot Password ────────────────────────────────────────────
export function useForgotPassword() {
    const router = useRouter();

    return useMutation({
        mutationFn: forgotPasswordApi,
        onSuccess: (res, variables) => {
            if (res.success) {
                router.push(`/auth/reset-password?email=${encodeURIComponent(variables.email)}`);
            }
        },
    });
}

// ── Reset Password ─────────────────────────────────────────────
export function useResetPassword() {
    const router = useRouter();

    return useMutation({
        mutationFn: resetPasswordApi,
        onSuccess: (res) => {
            if (res.success) {
                router.push("/auth/login");
            }
        },
    });
}

// ── Google Login ───────────────────────────────────────────────
export function useGoogleLogin() {
    const onSuccess = useAuthSuccess();
    const router = useRouter();

    return useMutation({
        mutationFn: googleLoginApi,
        onSuccess: (res) => {
            if (res.success && res.data) {
                onSuccess(res.data);
                router.push("/");
            }
        },
    });
}

// ── Facebook Login ─────────────────────────────────────────────
export function useFacebookLogin() {
    const onSuccess = useAuthSuccess();
    const router = useRouter();

    return useMutation({
        mutationFn: facebookLoginApi,
        onSuccess: (res) => {
            if (res.success && res.data) {
                onSuccess(res.data);
                router.push("/");
            }
        },
    });
}

// ── Logout ─────────────────────────────────────────────────────
export function useLogout() {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: () => {
            const rt = getRefreshToken();
            return rt ? logoutApi(rt) : Promise.resolve(null);
        },
        onSettled: () => {
            clearTokens();
            dispatch(clearUser());
            queryClient.clear();
            router.push("/auth/login");
        },
    });
}

// ── Profile Query ──────────────────────────────────────────────
export function useProfile() {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const res = await getProfileApi();
            if (res.success && res.data) {
                dispatch(setUser(res.data));
                return res.data;
            }
            throw new Error(res.errors?.[0] || "Failed to fetch profile");
        },
        enabled: typeof window !== "undefined" && !!getAccessToken(),
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
