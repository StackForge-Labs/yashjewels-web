import apiClient from "./api-client";
import type {
    ApiResponse,
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
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
    apiClient.post<ApiResponse<AuthResponse>>("/auth/refresh", { refreshToken }).then((r) => r.data);

export const logoutApi = (refreshToken: string) =>
    apiClient.post<ApiResponse<string>>("/auth/logout", { refreshToken }).then((r) => r.data);

// ── Password Recovery ──────────────────────────────────────────
export const forgotPasswordApi = (data: ForgotPasswordRequest) =>
    apiClient.post<ApiResponse<string>>("/auth/forgot-password", data).then((r) => r.data);

export const resetPasswordApi = (data: ResetPasswordRequest) =>
    apiClient.post<ApiResponse<string>>("/auth/reset-password", data).then((r) => r.data);

// ── OAuth Social Login ─────────────────────────────────────────
export const googleLoginApi = (idToken: string) =>
    apiClient.post<ApiResponse<AuthResponse>>("/auth/google", { idToken }).then((r) => r.data);

export const facebookLoginApi = (accessToken: string) =>
    apiClient.post<ApiResponse<AuthResponse>>("/auth/facebook", { accessToken }).then((r) => r.data);

// ── User Profile ───────────────────────────────────────────────
export const getProfileApi = () =>
    apiClient.get<ApiResponse<UserProfile>>("/auth/profile").then((r) => r.data);
