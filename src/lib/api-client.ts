import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5066/api/v1";

// ── Token helpers ──────────────────────────────────────────────
export const getAccessToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
};

export const getRefreshToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refresh_token");
};

export const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
};

export const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};

// ── Axios instance ─────────────────────────────────────────────
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 15000,
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
            const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
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
                window.location.href = "/auth/login";
            }
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);

export default apiClient;
