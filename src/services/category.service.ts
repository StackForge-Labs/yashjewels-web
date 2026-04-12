import apiClient, { getErrorMessage } from "@/lib/api-client";
import { Category, CategoryCreateRequest, CategoryUpdateRequest } from "@/types/category.types";

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    try {
      const { data } = await apiClient.get("/categories");
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Failed to fetch categories", getErrorMessage(error));
      return [];
    }
  },

  create: async (payload: CategoryCreateRequest): Promise<{ success: boolean; message: string; data?: Category }> => {
    try {
      const { data } = await apiClient.post("/categories", payload);
      return { success: data.success, message: data.message || "Danh mục đã được tạo", data: data.data };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "Đã xảy ra lỗi" };
    }
  },

  update: async (id: string, payload: CategoryUpdateRequest): Promise<{ success: boolean; message: string; data?: Category }> => {
    try {
      const { data } = await apiClient.put(`/categories/${id}`, payload);
      return { success: data.success, message: data.message || "Cập nhật thành công", data: data.data };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "Đã xảy ra lỗi" };
    }
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await apiClient.delete(`/categories/${id}`);
      return { success: data.success, message: data.message || "Xóa thành công" };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "Đã xảy ra lỗi" };
    }
  },

  restore: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await apiClient.patch(`/categories/${id}/restore`);
      return { success: data.success, message: data.message || "Khôi phục thành công" };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "Đã xảy ra lỗi" };
    }
  }
};
