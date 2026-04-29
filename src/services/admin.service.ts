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

export const getOrderDetailApi = (id: string) =>
    apiClient.get<ApiResponse<any>>(`/admin/orders/${id}`).then((r) => r.data);

export const confirmOrderApi = (orderId: string, approve: boolean, reason?: string) =>
    apiClient.put<ApiResponse<boolean>>(`/admin/orders/${orderId}/override`, { orderId, approve, reason }).then((r) => r.data);

export const confirmOrderDecisionApi = (orderId: string, approve: boolean, reason?: string) =>
    apiClient.put<ApiResponse<boolean>>(`/vendor/orders/${orderId}/decision`, { isApproved: approve, reason }).then((r) => r.data);

export const recordOrderContactApi = (data: { orderId: string, attemptNumber: number, isSuccess: boolean, note: string }) =>
    apiClient.post<ApiResponse<boolean>>("/admin/orders/contact-log", data).then((r) => r.data);

export const updateOrderDocumentsApi = (orderId: string, data: any) =>
    apiClient.put<ApiResponse<boolean>>(`/admin/orders/${orderId}/documents`, data).then((r) => r.data);

export const assignShipperApi = (orderId: string, shipperId: string) =>
    apiClient.put<ApiResponse<boolean>>(`/admin/orders/${orderId}/assign-shipper`, { shipperId }).then((r) => r.data);

// --- Phase 4: Finance & Returns ---
export const getReturnsApi = () =>
    apiClient.get<ApiResponse<any[]>>("/admin/returns/all").then((r) => r.data);

export const processReturnApi = (id: string, data: { requestId: string, approve: boolean, note?: string }) =>
    apiClient.put<ApiResponse<boolean>>(`/admin/returns/${id}/process`, data).then((r) => r.data);

export const finalizeReturnApi = (id: string, data: { requestId: string, approve: boolean, deductInsurance: boolean, note?: string }) =>
    apiClient.put<ApiResponse<boolean>>(`/admin/returns/${id}/finalize`, data).then((r) => r.data);

export const getFinanceStatsApi = (range: string = "month") =>
    apiClient.get<ApiResponse<any>>(`/admin/finance/stats?range=${range}`).then((r) => r.data);

export const exportInsuranceApi = (from?: string, to?: string) =>
    apiClient.get(`/admin/finance/insurance-export`, { 
        params: { from, to },
        responseType: 'blob' 
    }).then((r) => {
        const url = window.URL.createObjectURL(new Blob([r.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `insurance-audit-${new Date().toISOString().split('T')[0]}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    });

// ── Inquiry Audit Logs ────────────────────────────────────────
export interface InquiryAuditLogDto {
    id: string;
    actorId?: string;
    actorName?: string;
    actorEmail?: string;
    actorRole?: string;
    action: string;
    createdAt: string;
    ipAddress?: string;
    details?: string;
    inquiryId: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    inquirySubject?: string;
    inquiryMessage?: string;
    inquiryStatus?: string;
    inquiryCreatedAt?: string;
    couponCode?: string;
    replyMessage?: string;
    discountValue?: number;
    vendorName?: string;
}

export const getInquiryLogsApi = (params?: { vendorId?: string; action?: string; from?: string; to?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.vendorId) searchParams.set("vendorId", params.vendorId);
    if (params?.action) searchParams.set("action", params.action);
    if (params?.from) searchParams.set("from", params.from);
    if (params?.to) searchParams.set("to", params.to);
    const qs = searchParams.toString();
    return apiClient.get<ApiResponse<InquiryAuditLogDto[]>>(`/admin/inquiries/logs${qs ? `?${qs}` : ""}`).then(r => r.data);
};

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
    getOrderDetailApi,
    confirmOrderApi,
    confirmOrderDecisionApi,
    recordOrderContactApi,
    updateOrderDocumentsApi,
    assignShipperApi,
    getReturnsApi,
    processReturnApi,
    finalizeReturnApi,
    getFinanceStatsApi,
    exportInsuranceApi,
    getInquiryLogsApi,

    // Phase 5 Structured
    vendors: {
        getAll: () => apiClient.get<ApiResponse<any[]>>("/admin/vendors").then(r => r.data),
        create: (data: any) => apiClient.post<ApiResponse<string>>("/admin/vendors", data).then(r => r.data),
        updateStatus: (userId: string, status: number) => apiClient.put<ApiResponse<boolean>>(`/admin/vendors/${userId}/status`, status, { headers: { "Content-Type": "application/json" } }).then(r => r.data),
    },
    
    shippers: {
        getAll: () => apiClient.get<ApiResponse<any[]>>("/admin/shippers").then(r => r.data),
        create: (data: any) => apiClient.post<ApiResponse<string>>("/admin/shippers", data).then(r => r.data),
        approve: (id: string) => apiClient.put<ApiResponse<boolean>>(`/admin/shippers/${id}/approve`).then(r => r.data),
        updateStatus: (userId: string, status: number) => apiClient.put<ApiResponse<boolean>>(`/admin/shippers/${userId}/status`, status, { headers: { "Content-Type": "application/json" } }).then(r => r.data),
    },

    settings: {
        get: () => apiClient.get<ApiResponse<any>>("/admin/settings").then(r => r.data),
        update: (data: any) => apiClient.put<ApiResponse<boolean>>("/admin/settings", data).then(r => r.data),
    },

    coupons: {
        getAll: () => apiClient.get<ApiResponse<any[]>>("/coupons").then(r => r.data),
        create: (data: any) => apiClient.post<ApiResponse<string>>("/coupons", data).then(r => r.data),
        toggle: (id: string) => apiClient.put<ApiResponse<boolean>>(`/coupons/${id}/toggle`).then(r => r.data),
        delete: (id: string) => apiClient.delete<ApiResponse<boolean>>(`/coupons/${id}`).then(r => r.data)
    },

    campaigns: {
        getAll: () => apiClient.get<ApiResponse<any[]>>("/marketing-campaigns").then(r => r.data),
        create: (data: any) => apiClient.post<ApiResponse<string>>("/marketing-campaigns", data).then(r => r.data),
        update: (id: string, data: any) => apiClient.put<ApiResponse<boolean>>(`/marketing-campaigns/${id}`, data).then(r => r.data),
        delete: (id: string) => apiClient.delete<ApiResponse<boolean>>(`/marketing-campaigns/${id}`).then(r => r.data),
        distribute: (id: string) => apiClient.post<ApiResponse<boolean>>(`/marketing-campaigns/${id}/distribute`).then(r => r.data),
        revoke: (id: string) => apiClient.post<ApiResponse<boolean>>(`/marketing-campaigns/${id}/revoke`).then(r => r.data),
    },

    inquiryLogs: {
        getAll: (params?: { vendorId?: string; action?: string; from?: string; to?: string }) => getInquiryLogsApi(params),
    }
};

