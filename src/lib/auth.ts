import apiClient from "./api-client";
import type {
    ApiResponse,
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyResetOtpRequest,
    VerifyEmailRequest,
    ResendOtpRequest,
    UserProfile,
} from "@/types/user.types";

// ── Registration & Verification ────────────────────────────────
export const registerApi = (data: RegisterRequest) =>
    apiClient.post<ApiResponse<string>>("/auth/register", data).then((r) => r.data);

export const verifyEmailApi = (data: VerifyEmailRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>("/auth/verify-email", data).then((r) => r.data);

export const resendOtpApi = (data: ResendOtpRequest) =>
    apiClient.post<ApiResponse<string>>("/auth/resend-otp", data).then((r) => r.data);

// ── Login & Token ──────────────────────────────────────────────
export const loginApi = (data: LoginRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>("/auth/login", data).then((r) => r.data);

export const refreshTokenApi = (refreshToken: string) =>
    apiClient.post<ApiResponse<AuthResponse>>("/auth/refresh-token", { refreshToken }).then((r) => r.data);

export const logoutApi = (refreshToken: string) =>
    apiClient.post<ApiResponse<string>>("/auth/logout", { refreshToken }).then((r) => r.data);

// ── Password Recovery ──────────────────────────────────────────
export const forgotPasswordApi = (data: ForgotPasswordRequest) =>
    apiClient.post<ApiResponse<string>>("/auth/forgot-password", data).then((r) => r.data);

export const resetPasswordApi = (data: ResetPasswordRequest) =>
    apiClient.post<ApiResponse<string>>("/auth/reset-password", data).then((r) => r.data);

export const verifyResetOtpApi = (data: VerifyResetOtpRequest) =>
    apiClient.post<ApiResponse<string>>("/auth/verify-reset-otp", data).then((r) => r.data);

// ── OAuth Social Login ─────────────────────────────────────────
export const googleLoginApi = (token: string) =>
    apiClient.post<ApiResponse<AuthResponse>>("/auth/google-login", { token }).then((r) => r.data);

export const facebookLoginApi = (accessToken: string) =>
    apiClient.post<ApiResponse<AuthResponse>>("/auth/facebook-login", { accessToken }).then((r) => r.data);

// ── User Profile & KYC ──────────────────────────────────────────
export const getProfileApi = () =>
    apiClient.get<ApiResponse<UserProfile>>("/user/profile").then((r) => r.data);

export const updateProfileApi = (data: any) =>
    apiClient.put<ApiResponse<UserProfile>>("/user/profile", data).then((r) => r.data);

export const uploadKycApi = (formData: FormData) =>
    apiClient.post<ApiResponse<string>>("/user/kyc", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }).then((r) => r.data);
export const updateAvatarApi = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post<ApiResponse<string>>("/user/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }).then((r) => r.data);
};

// ── KYC Session ──────────────────────────────────────────────
export const initKycSessionApi = () => 
    apiClient.post<ApiResponse<{ sessionToken: string, qrUrl: string }>>("/user/kyc/init-session").then(r => r.data);

export const getKycSessionStatusApi = (token: string) =>
    apiClient.get<ApiResponse<string>>(`/user/kyc/session-status/${token}`).then(r => r.data);

export const submitMobileKycApi = (data: { sessionToken: string, request: any }) =>
    apiClient.post<ApiResponse<boolean>>("/user/kyc/submit-mobile", data).then(r => r.data);
