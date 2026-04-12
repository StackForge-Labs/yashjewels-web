import apiClient, { getErrorMessage } from "@/lib/api-client";
import { Product, ProductCreateRequest, ProductUpdateRequest } from "@/types/product.types";

export const productService = {
  getAll: async (): Promise<Product[]> => {
    try {
      const { data } = await apiClient.get("/products");
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Failed to fetch products", getErrorMessage(error));
      return [];
    }
  },

  create: async (payload: ProductCreateRequest): Promise<{ success: boolean; message: string; data?: Product }> => {
    try {
      const { data } = await apiClient.post("/products", payload);
      return { success: data.success, message: data.message || "Product created successfully", data: data.data };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "An error occurred" };
    }
  },

  update: async (id: string, payload: ProductUpdateRequest): Promise<{ success: boolean; message: string; data?: Product }> => {
    try {
      const { data } = await apiClient.put(`/products/${id}`, payload);
      return { success: data.success, message: data.message || "Updated successfully", data: data.data };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "An error occurred" };
    }
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await apiClient.delete(`/products/${id}`);
      return { success: data.success, message: data.message || "Deleted successfully" };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "An error occurred" };
    }
  },

  restore: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await apiClient.patch(`/products/${id}/restore`);
      return { success: data.success, message: data.message || "Restored successfully" };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "An error occurred" };
    }
  }
};
