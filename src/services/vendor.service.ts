/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/lib/api-client";
import { ApiResponse } from "@/types/user.types";
import { OrderDetailDto } from "./order.service";

export interface VendorDashboardStats {
    totalRevenue: number;
    revenueTrend: number;
    totalOrders: number;
    ordersTrend: number;
    activeProducts: number;
    productsTrend: number;
    avgOrderValue: number;
    aovTrend: number;
    recentOrders: OrderDetailDto[];
}

export interface InquiryDto {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    status: "OPEN" | "RESOLVED";
    submittedAt: string;
    couponAssigned?: string;
}

export const vendorService = {
    getDashboardStats: async (range: string = "month") => {
        const res = await apiClient.get<ApiResponse<VendorDashboardStats>>(`/vendor/stats?range=${range}`);
        return res.data;
    },

    getOrders: async () => {
        const res = await apiClient.get<ApiResponse<OrderDetailDto[]>>("/vendor/orders");
        return res.data;
    },

    makeDecision: async (orderId: string, isApproved: boolean, reason?: string) => {
        const res = await apiClient.put<ApiResponse<boolean>>(`/vendor/orders/${orderId}/decision`, {
            isApproved,
            reason
        });
        return res.data;
    },

    getInquiries: async () => {
        const res = await apiClient.get<ApiResponse<InquiryDto[]>>("/vendor/inquiries");
        return res.data;
    },

    resolveInquiry: async (id: string) => {
        const res = await apiClient.put<ApiResponse<boolean>>(`/vendor/inquiries/${id}/resolve`);
        return res.data;
    },

    assignCouponToInquiry: async (id: string, couponCode: string, discountValue: number, discountType: string) => {
        const res = await apiClient.post<ApiResponse<boolean>>(`/vendor/inquiries/${id}/coupon`, {
            couponCode,
            discountValue,
            discountType
        });
        return res.data;
    },

    submitInquiry: async (data: { name: string; email: string; phone?: string; subject: string; message: string }) => {
        const res = await apiClient.post<ApiResponse<string>>("/vendor/inquiries/submit", data);
        return res.data;
    },

    // Vendor Management APIs
    getCustomers: async (page: number = 1, pageSize: number = 20, search?: string, status?: string, kycStatus?: string, joinedFrom?: string, joinedTo?: string) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("pageSize", String(pageSize));
        if (search) params.set("search", search);
        if (status) params.set("status", status);
        if (kycStatus) params.set("kycStatus", kycStatus);
        if (joinedFrom) params.set("joinedFrom", joinedFrom);
        if (joinedTo) params.set("joinedTo", joinedTo);
        const res = await apiClient.get<ApiResponse<any[]>>(`/vendor/management/customers?${params.toString()}`);
        return res.data;
    },

    getCustomerDetail: async (id: string) => {
        const res = await apiClient.get<ApiResponse<any>>(`/vendor/management/customers/${id}`);
        return res.data;
    },

    dispatchOrder: async (orderId: string, evidenceUrls: string[]) => {
        const res = await apiClient.put<ApiResponse<boolean>>(`/vendor/orders/${orderId}/dispatch`, {
            evidenceUrls
        });
        return res.data;
    },

    checkEmailExists: async (email: string) => {
        const res = await apiClient.get<ApiResponse<boolean>>(`/vendor/management/customers/check-email?email=${encodeURIComponent(email)}`);
        return res.data;
    },

    createCustomer: async (data: { email: string; fullName: string; phone?: string; dateOfBirth?: string }) => {
        const res = await apiClient.post<ApiResponse<string>>("/vendor/management/customers", data);
        return res.data;
    },

    updateCustomer: async (id: string, data: { fullName: string; phone?: string; dateOfBirth?: string }) => {
        const res = await apiClient.put<ApiResponse<boolean>>(`/vendor/management/customers/${id}`, data);
        return res.data;
    },

};
