import apiClient, { getErrorMessage } from "@/lib/api-client";
import { Coupon, CreateCouponRequest, UpdateCouponRequest } from "@/types/coupon.types";

export const couponService = {
  getAll: async (onlyActive: boolean = false): Promise<{ success: boolean; data: Coupon[] }> => {
    try {
      const { data } = await apiClient.get("/coupons", { params: { onlyActive } });
      return { success: data.success, data: data.data || [] };
    } catch (error) {
      console.error("Failed to fetch coupons", getErrorMessage(error));
      return { success: false, data: [] };
    }
  },

  getById: async (id: string): Promise<Coupon | null> => {
    try {
      const { data } = await apiClient.get(`/coupons/${id}`);
      return data.success ? data.data : null;
    } catch (error) {
      console.error(`Failed to fetch coupon with id: ${id}`, getErrorMessage(error));
      return null;
    }
  },

  create: async (payload: CreateCouponRequest): Promise<{ success: boolean; message: string; data?: string }> => {
    try {
      const { data } = await apiClient.post("/coupons", payload);
      return { success: data.success, message: data.message || "Coupon created successfully", data: data.data };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "An error occurred" };
    }
  },

  update: async (id: string, payload: UpdateCouponRequest): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await apiClient.put(`/coupons/${id}`, payload);
      return { success: data.success, message: data.message || "Updated successfully" };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "An error occurred" };
    }
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await apiClient.delete(`/coupons/${id}`);
      return { success: data.success, message: data.message || "Deleted successfully" };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "An error occurred" };
    }
  },

  validate: async (code: string, cartTotal: number): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      const { data } = await apiClient.post("/coupons/validate", { code, cartTotal });
      return { success: data.success, message: data.message, data: data.data };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "Invalid coupon" };
    }
  }
};
