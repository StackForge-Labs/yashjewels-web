import apiClient, { getErrorMessage } from "@/lib/api-client";
import { ReturnRequest, SubmitReturnRequestRequest, ReviewReturnRequestRequest } from "@/types/return-request.types";

export const returnRequestService = {
  getAll: async (): Promise<{ success: boolean; data: ReturnRequest[] }> => {
    try {
      const { data } = await apiClient.get("/returns");
      return { success: data.success, data: data.data || [] };
    } catch (error) {
      console.error("Failed to fetch return requests", getErrorMessage(error));
      return { success: false, data: [] };
    }
  },

  getMyReturns: async (): Promise<{ success: boolean; data: ReturnRequest[] }> => {
    try {
      const { data } = await apiClient.get("/returns/my");
      return { success: data.success, data: data.data || [] };
    } catch (error) {
      console.error("Failed to fetch my returns", getErrorMessage(error));
      return { success: false, data: [] };
    }
  },

  getById: async (id: string): Promise<ReturnRequest | null> => {
    try {
      const { data } = await apiClient.get(`/returns/${id}`);
      return data.success ? data.data : null;
    } catch (error) {
      console.error(`Failed to fetch return request with id: ${id}`, getErrorMessage(error));
      return null;
    }
  },

  submit: async (payload: SubmitReturnRequestRequest): Promise<{ success: boolean; message: string; data?: string }> => {
    try {
      const { data } = await apiClient.post("/returns", payload);
      return { success: data.success, message: data.message || "Return requested successfully", data: data.data };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "An error occurred" };
    }
  },

  review: async (id: string, payload: ReviewReturnRequestRequest): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await apiClient.put(`/returns/${id}/review`, payload);
      return { success: data.success, message: data.message || "Return reviewed successfully" };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "An error occurred" };
    }
  }
};
