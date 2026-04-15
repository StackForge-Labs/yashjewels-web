"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setUser, clearUser, updateAvatar } from "@/store/userSlice";
import { setTokens, clearTokens, getRefreshToken, getAccessToken } from "@/lib/api-client";
import {
    loginApi,
    registerApi,
    verifyEmailApi,
    resendOtpApi,
    forgotPasswordApi,
    resetPasswordApi,
    verifyResetOtpApi,
    googleLoginApi,
    facebookLoginApi,
    logoutApi,
    getProfileApi,
    uploadKycApi,
    updateProfileApi,
    updateAvatarApi,
    initKycSessionApi,
    getKycSessionStatusApi,
    submitMobileKycApi,
} from "@/lib/auth";
import type { AuthResponse } from "@/types/user.types";


// ── Helper: save tokens + dispatch profile ─────────────────────
function useAuthSuccess() {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    return (authData: AuthResponse) => {
        setTokens(authData.accessToken, authData.refreshToken);
        if (authData.user) {
            dispatch(setUser(authData.user));
        }
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
                sessionStorage.setItem("verify_email", variables.email);
                router.push("/auth/verify-email");
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

export function useForgotPassword() {
    return useMutation({
        mutationFn: forgotPasswordApi,
        onSuccess: (res, variables) => {
            if (res.success) {
                // Optionally keep storing in session storage just in case, though the UI handles it
                sessionStorage.setItem("reset_email", variables.email);
            }
        },
    });
}

// ── Reset Password ─────────────────────────────────────────────
export function useResetPassword() {
    return useMutation({
        mutationFn: resetPasswordApi,
    });
}

export function useVerifyResetOtp() {
    return useMutation({
        mutationFn: verifyResetOtpApi,
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

// ── Update Profile ─────────────────────────────────────────────
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfileApi,
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ["profile"] });
            }
        },
    });
}

// ── Upload KYC ─────────────────────────────────────────────────
export function useUploadKyc() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => uploadKycApi(formData),
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ["profile"] });
            }
        },
    });
}

// ── Update Avatar ──────────────────────────────────────────────
export function useUpdateAvatar() {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: updateAvatarApi,
        onSuccess: (res) => {
            if (res.success && res.data) {
                // Update Redux state immediately with the new URL
                dispatch(updateAvatar(res.data));
                
                // Also invalidate query to keep everything in sync
                queryClient.invalidateQueries({ queryKey: ["profile"] });
            }
        },
    });
}

// ── KYC Session ──────────────────────────────────────────────
export function useInitKycSession() {
    return useMutation({
        mutationFn: initKycSessionApi,
    });
}

export function useKycSessionStatus(token: string, enabled = false) {
    return useQuery({
        queryKey: ["kyc-session", token],
        queryFn: () => getKycSessionStatusApi(token),
        enabled: enabled && !!token,
        refetchInterval: (query) => {
            if (query.state.data?.data === "Completed" || query.state.data?.data === "Failed") {
                return false;
            }
            return 3000; // Poll every 3 seconds
        },
    });
}

export function useSubmitMobileKyc() {
    return useMutation({
        mutationFn: submitMobileKycApi,
    });
}
