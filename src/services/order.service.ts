import apiClient from "@/lib/api-client";
import { ApiResponse } from "@/types/user.types";

export interface OrderTimelineDto {
    id: string;
    status: string;
    note: string;
    actorType: string;
    changedAt: string;
    evidenceUrl?: string;
}

export interface OrderDetailDto {
    orderId: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    returnRequestId?: string;
    remainingDueAt?: string;
    timeline: OrderTimelineDto[];
    items: any[];
}

export const orderService = {
    getOrders: async () => {
        const res = await apiClient.get<ApiResponse<any[]>>("/user-orders");
        return res.data;
    },
    getOrderById: async (id: string) => {
        const res = await apiClient.get<ApiResponse<OrderDetailDto>>(`/user-orders/${id}`);
        return res.data;
    },
    confirmDeposit: async (orderId: string) => {
        const res = await apiClient.post<ApiResponse<boolean>>(`/user-orders/${orderId}/confirm-deposit`);
        return res.data;
    },
    completeOrder: async (orderId: string) => {
        const res = await apiClient.put<ApiResponse<boolean>>(`/user-orders/${orderId}/complete`);
        return res.data;
    }
};
