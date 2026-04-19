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
    unboxingVideo: File;
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
            formData.append("unboxingVideo", payload.unboxingVideo);

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
    }
};
