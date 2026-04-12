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
      return { success: data.success, message: data.message || "Sản phẩm đã được tạo", data: data.data };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "Đã xảy ra lỗi" };
    }
  },

  update: async (id: string, payload: ProductUpdateRequest): Promise<{ success: boolean; message: string; data?: Product }> => {
    try {
      const { data } = await apiClient.put(`/products/${id}`, payload);
      return { success: data.success, message: data.message || "Cập nhật thành công", data: data.data };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "Đã xảy ra lỗi" };
    }
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await apiClient.delete(`/products/${id}`);
      return { success: data.success, message: data.message || "Xóa thành công" };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "Đã xảy ra lỗi" };
    }
  },

  restore: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await apiClient.patch(`/products/${id}/restore`);
      return { success: data.success, message: data.message || "Khôi phục thành công" };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "Đã xảy ra lỗi" };
    }
  }
};
