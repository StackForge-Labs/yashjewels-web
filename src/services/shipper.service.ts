import apiClient from "@/lib/api-client";
import { ApiResponse } from "@/types/user.types";
import { OrderDetailDto } from "./order.service";

export interface ShipperOrderDto extends OrderDetailDto {
    insuranceType: string;
    qrActive: boolean;
    qrExpiresAt?: string;
}

export const shipperService = {
    getAssignedDeliveries: async () => {
        const res = await apiClient.get<ApiResponse<ShipperOrderDto[]>>("/shipper/orders");
        return res.data;
    },
    
    confirmDeliveryWithQr: async (orderId: string, qrToken: string, recipientPhotoUrl: string) => {
        const res = await apiClient.put<ApiResponse<boolean>>(`/shipper/orders/${orderId}/deliver`, {
            qrToken,
            recipientPhotoUrl
        });
        return res.data;
    },
    
    resendQrCode: async (orderId: string) => {
        const res = await apiClient.post<ApiResponse<boolean>>(`/shipper/orders/${orderId}/resend-qr`);
        return res.data;
    }
};
