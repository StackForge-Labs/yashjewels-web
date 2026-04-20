import apiClient, { getErrorMessage } from "@/lib/api-client";
import { ApiResponse } from "@/types/user.types";

export interface SubmitReviewRequest {
    orderId: string;
    rating: number;
    comment?: string;
    image?: File;
}

export interface SubmitReturnRequest {
    orderId: string;
    reason: string;
    evidenceUrl: string;
}

export const postSalesService = {
    submitReview: async (payload: SubmitReviewRequest) => {
        try {
            const formData = new FormData();
            formData.append("rating", payload.rating.toString());
            if (payload.comment) formData.append("comment", payload.comment);
            if (payload.image) formData.append("image", payload.image);

            const { data } = await apiClient.post<ApiResponse<string>>(
                `/post-sales/order/${payload.orderId}/review`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return data;
        } catch (error) {
            return {
                success: false,
                message: getErrorMessage(error) || "Failed to submit review",
            } as ApiResponse<string>;
        }
    },
    submitReturnRequest: async (payload: SubmitReturnRequest) => {
        try {
            const formData = new FormData();
            formData.append("reason", payload.reason);
            formData.append("evidenceUrl", payload.evidenceUrl);

            const { data } = await apiClient.post<ApiResponse<string>>(
                `/post-sales/order/${payload.orderId}/return`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return data;
        } catch (error) {
            return {
                success: false,
                message: getErrorMessage(error) || "Failed to submit return request",
            } as ApiResponse<string>;
        }
    },

    getAdminReturns: async () => {
        try {
            const { data } = await apiClient.get<ApiResponse<any[]>>("/post-sales/admin/returns");
            return data;
        } catch (error) {
            return {
                success: false,
                message: getErrorMessage(error) || "Failed to fetch return requests",
            } as ApiResponse<any[]>;
        }
    },

    processReturn: async (requestId: string, approve: boolean, note?: string) => {
        try {
            const { data } = await apiClient.post<ApiResponse<boolean>>(
                `/post-sales/admin/returns/${requestId}/process`,
                { approve, note }
            );
            return data;
        } catch (error) {
            return {
                success: false,
                message: getErrorMessage(error) || "Failed to process return request",
            } as ApiResponse<boolean>;
        }
    },

    finalProcessReturn: async (requestId: string, approve: boolean, deductInsurance: boolean, note?: string) => {
        try {
            const { data } = await apiClient.post<ApiResponse<boolean>>(
                `/post-sales/admin/returns/${requestId}/final-process`,
                { approve, deductInsurance, note }
            );
            return data;
        } catch (error) {
            return {
                success: false,
                message: getErrorMessage(error) || "Failed to finalize return request",
            } as ApiResponse<boolean>;
        }
    },

    claimRefund: async (orderId: string) => {
        try {
            const { data } = await apiClient.post<ApiResponse<boolean>>(
                `/post-sales/order/${orderId}/claim-refund`
            );
            return data;
        } catch (error) {
            return {
                success: false,
                message: getErrorMessage(error) || "Failed to claim refund",
            } as ApiResponse<boolean>;
        }
    }
};
