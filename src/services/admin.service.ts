import apiClient from "@/lib/api-client";
import { ApiResponse, PendingKycDto } from "@/types/user.types";

export const getPendingKycApi = () =>
    apiClient.get<ApiResponse<PendingKycDto[]>>("/admin/kyc/pending").then((r) => r.data);

export const approveKycApi = (userId: string) =>
    apiClient.put<ApiResponse<string>>(`/admin/kyc/${userId}/approve`).then((r) => r.data);

export const rejectKycApi = (userId: string) =>
    apiClient.put<ApiResponse<string>>(`/admin/kyc/${userId}/reject`).then((r) => r.data);

// Phase 4 - New Endpoints
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

export const getAdminCustomersApi = (page: number = 1, pageSize: number = 20) =>
    apiClient.get<ApiResponse<any[]>>(`/admin/customers?page=${page}&pageSize=${pageSize}`).then((r) => r.data);

export const getCustomersApi = getAdminCustomersApi;

export const getCustomerDetailApi = (id: string) =>
    apiClient.get<ApiResponse<any>>(`/admin/customers/${id}`).then((r) => r.data);

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

export const updateUserStatusApi = (userId: string, status: number) =>
    apiClient.put<ApiResponse<string>>(`/admin/customers/${userId}/status`, { userId, status }).then((r) => r.data);

export const adminService = {
    getPendingKycApi,
    approveKycApi,
    rejectKycApi,
    getDashboardStatsApi,
    getDashboardChartsApi,
    getAdminCustomersApi,
    getCustomersApi,
    getCustomerDetailApi,
    getFinanceOverviewApi,
    getFinanceOverview,
    getOrdersApi,
    confirmOrderApi,
    confirmOrderDecisionApi,
    recordOrderContactApi,
    updateUserStatusApi
};
