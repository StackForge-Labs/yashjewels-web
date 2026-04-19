import apiClient from "@/lib/api-client";
import { ApiResponse } from "@/types/user.types";
import { OrderDetailDto } from "./order.service"; // Reuse from order.service

export const vendorService = {
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
    
    dispatchOrder: async (orderId: string, photoUrl: string) => {
        const res = await apiClient.put<ApiResponse<boolean>>(`/vendor/orders/${orderId}/dispatch`, {
            dispatchPhotoUrl: photoUrl
        });
        return res.data;
    }
};
