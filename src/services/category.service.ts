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
      return { success: data.success, message: data.message || "Category created successfully", data: data.data };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "An error occurred" };
    }
  },

  update: async (id: string, payload: CategoryUpdateRequest): Promise<{ success: boolean; message: string; data?: Category }> => {
    try {
      const { data } = await apiClient.put(`/categories/${id}`, payload);
      return { success: data.success, message: data.message || "Updated successfully", data: data.data };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "An error occurred" };
    }
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await apiClient.delete(`/categories/${id}`);
      return { success: data.success, message: data.message || "Deleted successfully" };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "An error occurred" };
    }
  },

  restore: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await apiClient.patch(`/categories/${id}/restore`);
      return { success: data.success, message: data.message || "Restored successfully" };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "An error occurred" };
    }
  }
};
