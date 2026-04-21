/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/lib/api-client";
import { ApiResponse, PendingKycDto } from "@/types/user.types";

export const getPendingKycApi = () =>
    apiClient.get<ApiResponse<PendingKycDto[]>>("/admin/kyc/pending").then((r) => r.data);

export const approveKycApi = (userId: string) =>
    apiClient.put<ApiResponse<string>>(`/admin/kyc/${userId}/approve`).then((r) => r.data);

export const rejectKycApi = (userId: string) =>
    apiClient.put<ApiResponse<string>>(`/admin/kyc/${userId}/reject`).then((r) => r.data);

// Phase 4 - New Endpoints
export interface AdminDashboardStats {
    totalRevenue: number;
    revenueTrend: number;
    newUsers: number;
    usersTrend: number;
    totalOrders: number;
    ordersTrend: number;
    avgOrderValue: number;
    aovTrend: number;
    recentOrders: any[];
    inventoryAlerts: any[];
}

export const getDashboardStatsApi = (range: string = "month") =>
    apiClient.get<ApiResponse<AdminDashboardStats>>(`/admin/stats?range=${range}`).then((r) => r.data);

export const getDashboardChartsApi = (days: number = 30) =>
    apiClient.get<ApiResponse<any>>(`/admin/charts?days=${days}`).then((r) => r.data);

// ── Customer DTOs ──────────────────────────────────────────────
export interface CreateCustomerDto {
    email: string;
    fullName: string;
    phone?: string;
    dateOfBirth?: string;
}

export interface UpdateCustomerDto {
    userId: string;
    fullName: string;
    phone?: string;
    dateOfBirth?: string;
}

export interface BanCustomerDto {
    userId: string;
    status: number;           // 2 = SUSPENDED, 3 = BANNED, 1 = ACTIVE
    reason?: string;
    suspendDurationHours?: number;  // total hours (FE converts days/hours → total hours)
}

export interface ImportResultDto {
    totalRows: number;
    imported: number;
    skipped: number;
    errors: string[];
}

// ── Customer APIs ──────────────────────────────────────────────
export const getAdminCustomersApi = (
    page: number = 1,
    pageSize: number = 20,
    search?: string,
    status?: number,
    kycStatus?: string,
    joinedFrom?: string,
    joinedTo?: string
) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    if (search) params.set("search", search);
    if (status !== undefined) params.set("status", String(status));
    if (kycStatus) params.set("kycStatus", kycStatus);
    if (joinedFrom) params.set("joinedFrom", joinedFrom);
    if (joinedTo) params.set("joinedTo", joinedTo);
    return apiClient.get<ApiResponse<any[]>>(`/admin/customers?${params.toString()}`).then((r) => r.data);
};

export const getCustomersApi = getAdminCustomersApi;

export const getCustomerDetailApi = (id: string) =>
    apiClient.get<ApiResponse<any>>(`/admin/customers/${id}`).then((r) => r.data);

export const createCustomerApi = (data: CreateCustomerDto) =>
    apiClient.post<ApiResponse<string>>("/admin/customers", data).then((r) => r.data);

export const updateCustomerApi = (id: string, data: Omit<UpdateCustomerDto, "userId">) =>
    apiClient.put<ApiResponse<string>>(`/admin/customers/${id}`, { userId: id, ...data }).then((r) => r.data);

/** Ban / Suspend / Activate a customer. status: 1=ACTIVE, 2=SUSPENDED, 3=BANNED */
export const banCustomerApi = (id: string, data: Omit<BanCustomerDto, "userId">) =>
    apiClient.put<ApiResponse<string>>(`/admin/customers/${id}/status`, { userId: id, ...data }).then((r) => r.data);

/** Keep alias for legacy callers */
export const updateUserStatusApi = (userId: string, status: number) =>
    banCustomerApi(userId, { status });

export const exportCustomersApi = async (search?: string, status?: number, kycStatus?: string, joinedFrom?: string, joinedTo?: string) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status !== undefined) params.set("status", String(status));
    if (kycStatus) params.set("kycStatus", kycStatus);
    if (joinedFrom) params.set("joinedFrom", joinedFrom);
    if (joinedTo) params.set("joinedTo", joinedTo);
    const res = await apiClient.get(`/admin/customers/export?${params.toString()}`, { responseType: "blob" });
    return res.data as Blob;
};

export const importCustomersApi = (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiClient.post<ApiResponse<ImportResultDto>>("/admin/customers/import", form, {
        headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data);
};

export const deleteCustomerApi = (id: string) =>
    apiClient.delete<ApiResponse<string>>(`/admin/customers/${id}`).then((r) => r.data);

// ── Finance / Orders ───────────────────────────────────────────
export const getFinanceOverviewApi = () =>
    apiClient.get<ApiResponse<any>>("/admin/finance-overview").then((r) => r.data);

export const getFinanceOverview = getFinanceOverviewApi;

export const getOrdersApi = () =>
    apiClient.get<ApiResponse<any[]>>("/admin/orders/all").then((r) => r.data);

export const confirmOrderApi = (orderId: string, approve: boolean, reason?: string) =>
    apiClient.put<ApiResponse<boolean>>(`/admin/orders/${orderId}/override`, { orderId, approve, reason }).then((r) => r.data);

export const confirmOrderDecisionApi = (orderId: string, approve: boolean, reason?: string) =>
    apiClient.put<ApiResponse<boolean>>(`/vendor/orders/${orderId}/decision`, { isApproved: approve, reason }).then((r) => r.data);

export const recordOrderContactApi = (data: { orderId: string, method: number, result: number, notes?: string }) =>
    apiClient.post<ApiResponse<boolean>>("/admin/orders/contact-log", data).then((r) => r.data);

export const adminService = {
    getPendingKycApi,
    approveKycApi,
    rejectKycApi,
    getDashboardStatsApi,
    getDashboardChartsApi,
    getAdminCustomersApi,
    getCustomersApi,
    getCustomerDetailApi,
    createCustomerApi,
    updateCustomerApi,
    banCustomerApi,
    updateUserStatusApi,
    exportCustomersApi,
    importCustomersApi,
    deleteCustomerApi,
    getFinanceOverviewApi,
    getFinanceOverview,
    getOrdersApi,
    confirmOrderApi,
    confirmOrderDecisionApi,
    recordOrderContactApi,
};
