// ── API Generic Response ───────────────────────────────────────
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    errors: string[];
}

// ── Auth DTOs ──────────────────────────────────────────────────
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    phone: string;
    dateOfBirth: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    otp: string;
    newPassword: string;
}

export interface VerifyEmailRequest {
    email: string;
    code: string;
}

export interface ResendOtpRequest {
    email: string;
}

// ── User Profile ───────────────────────────────────────────────
export interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    kycStatus: string;
    facePhotoUrl: string | null;
    kycSimilarityScore: number;
    avatarUrl: string | null;
    dateOfBirth: string | null;
    createdAt: string;
}

// Keep backward compat alias
export type UserType = UserProfile;
