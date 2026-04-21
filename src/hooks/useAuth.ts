"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
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
    setup2FaApi,
    enable2FaApi,
    disable2FaApi,
    loginVerify2FaApi,
    acceptInviteApi
} from "@/lib/auth";
import type { AuthResponse } from "@/types/user.types";


// ── Helper: save tokens + dispatch profile ─────────────────────
function useAuthSuccess() {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    return (authData: AuthResponse) => {
        setTokens(authData.accessToken, authData.refreshToken, authData.user?.role);
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
                const role = res.data.user?.role?.toLowerCase();
                if (role === "admin") {
                    router.push("/admin");
                } else if (role === "vendor") {
                    router.push("/vendor");
                } else if (role === "shipper") {
                    router.push("/shipper");
                } else {
                    router.push("/");
                }
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
        onSuccess: (res, variables) => {
            if (res.success && res.data) {
                onSuccess(res.data);
                const role = res.data.user?.role?.toLowerCase();
                if (role === "admin") {
                    router.push("/admin");
                } else if (role === "vendor") {
                    router.push("/vendor");
                } else if (role === "shipper") {
                    router.push("/shipper");
                } else {
                    router.push("/");
                }
            } else if (res.requiresTwoFactor) {
                // Since googleLoginApi might not return email easily from result, we assume we might need to look inside potential decoded token or just rely on backend's response message if it contains email. 
                // However, the best way is for the backend to include email in the 2FA error response or for the hook to know it.
                // For now, redirect to verify-2fa. We'll ensure backend provides email.
                router.push(`/auth/verify-2fa?email=${encodeURIComponent(res.message || "")}`);
            }
        },
        onError: (err: any) => {
            const res = err?.response?.data;
            if (res?.requiresTwoFactor) {
                // Backend should ideally return the email in the message or a dedicated field
                // For social login, let's assume the message contains the email or we extract it.
                // I'll update social login handlers to include email in message for easy extraction.
                router.push(`/auth/verify-2fa?email=${encodeURIComponent(res.message || "")}`);
            }
        }
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
                const role = res.data.user?.role?.toLowerCase();
                if (role === "admin") {
                    router.push("/admin");
                } else if (role === "vendor") {
                    router.push("/vendor");
                } else if (role === "shipper") {
                    router.push("/shipper");
                } else {
                    router.push("/");
                }
            } else if (res.requiresTwoFactor) {
                router.push(`/auth/verify-2fa?email=${encodeURIComponent(res.message || "")}`);
            }
        },
        onError: (err: any) => {
            const res = err?.response?.data;
            if (res?.requiresTwoFactor) {
                router.push(`/auth/verify-2fa?email=${encodeURIComponent(res.message || "")}`);
            }
        }
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

// ── 2FA ────────────────────────────────────────────────────────
export function useSetup2Fa() {
    return useMutation({
        mutationFn: setup2FaApi,
    });
}

export function useEnable2Fa() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: enable2FaApi,
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ["profile"] });
            }
        },
    });
}

export function useDisable2Fa() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: disable2FaApi,
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ["profile"] });
            }
        },
    });
}

export function useLoginVerify2Fa() {
    const onSuccess = useAuthSuccess();
    const router = useRouter();

    return useMutation({
        mutationFn: loginVerify2FaApi,
        onSuccess: (res) => {
            if (res.success && res.data) {
                onSuccess(res.data);
                const role = res.data.user?.role?.toLowerCase();
                if (role === "admin") {
                    router.push("/admin");
                } else if (role === "vendor") {
                    router.push("/vendor");
                } else if (role === "shipper") {
                    router.push("/shipper");
                } else {
                    router.push("/");
                }
            }
        },
    });
}

// ── Accept Invite ──────────────────────────────────────────────
export function useAcceptInvite() {
    const router = useRouter();

    return useMutation({
        mutationFn: acceptInviteApi,
        onSuccess: (res) => {
            if (res.success) {
                router.push("/auth/login?msg=Account activated successfully. Please log in.");
            }
        },
    });
}

/**
 * Consolidated hook for components needing access to current auth state.
 */
export function useAuth() {
    const user = useSelector((state: any) => state.user.user);
    const isAuthenticated = useSelector((state: any) => state.user.isAuthenticated);
    const token = getAccessToken();

    return {
        user,
        isAuthenticated,
        token
    };
}
