import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5066/api/v1";

// ── Cookie Helpers ──────────────────────────────────────────────
const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
};

const setCookie = (name: string, value: string, days: number = 7) => {
    if (typeof document === "undefined") return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    // SameSite=Lax is safer for social logins, Secure for production
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax; Secure`;
};

const deleteCookie = (name: string) => {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// ── Token helpers ──────────────────────────────────────────────
export const getAccessToken = () => getCookie("access_token");
export const getRefreshToken = () => getCookie("refresh_token");

export const setTokens = (accessToken: string, refreshToken: string, role?: string) => {
    setCookie("access_token", accessToken, 1); // 1 day for access token
    setCookie("refresh_token", refreshToken, 7); // 7 days for refresh token
    if (role) {
        setCookie("user_role", role, 7);
    }
};

export const clearTokens = () => {
    deleteCookie("access_token");
    deleteCookie("refresh_token");
    deleteCookie("user_role");
};

// ── Axios instance ─────────────────────────────────────────────
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 60000,
});

// Request interceptor — attach Bearer token
apiClient.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Response interceptor — auto-refresh on 401
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token);
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // If refresh is already in progress, queue this request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return apiClient(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            clearTokens();
            isRefreshing = false;
            return Promise.reject(error);
        }

        try {
            const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                refreshToken,
            });

            if (data.success && data.data) {
                setTokens(data.data.accessToken, data.data.refreshToken);
                processQueue(null, data.data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
                return apiClient(originalRequest);
            }

            throw new Error("Refresh failed");
        } catch (refreshError) {
            processQueue(refreshError, null);
            clearTokens();
            if (typeof window !== "undefined") {
                // To avoid infinite loops or confusing UX, only redirect on hard failures
                window.location.href = "/auth/login";
            }
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);

export const getErrorMessage = (error: any): string | null => {
    if (!error) return null;

    const apiResponse = error?.response?.data;
    if (apiResponse) {
        if (apiResponse.errors && apiResponse.errors.length > 0) {
            return apiResponse.errors[0];
        }
        if (apiResponse.message) {
            return apiResponse.message;
        }
    }

    if (error.message) return error.message;

    return "An error occurred. Please try again.";
};

export default apiClient;
