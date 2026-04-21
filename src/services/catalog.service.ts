/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient, { getErrorMessage } from "@/lib/api-client";
import { ApiResponse } from "@/types/user.types";

export interface CatalogItem {
  id: string;
  name: string;
  isActive: boolean;
  logoUrl?: string; // used by brands
  description?: string;
}

export interface CatalogItemCreate {
  name: string;
  logoUrl?: string;
  description?: string;
}

export interface CatalogItemUpdate {
  name?: string;
  logoUrl?: string;
  description?: string;
  isActive?: boolean;
}

const createCrudService = (endpoint: string) => ({
  getAll: async (): Promise<{ success: boolean; data: CatalogItem[] }> => {
    try {
      const { data } = await apiClient.get<ApiResponse<CatalogItem[]>>(endpoint);
      return { success: data.success, data: data.success ? data.data : [] };
    } catch {
      return { success: false, data: [] };
    }
  },

  create: async (payload: CatalogItemCreate): Promise<{ success: boolean; message: string; data?: CatalogItem }> => {
    try {
      const { data } = await apiClient.post<ApiResponse<CatalogItem>>(endpoint, payload);
      return { success: data.success, message: data.message || "Created successfully", data: data.data };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "An error occurred" };
    }
  },

  update: async (id: string, payload: CatalogItemUpdate): Promise<{ success: boolean; message: string; data?: CatalogItem }> => {
    try {
      const { data } = await apiClient.put<ApiResponse<CatalogItem>>(`${endpoint}/${id}`, payload);
      return { success: data.success, message: data.message || "Updated successfully", data: data.data };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "An error occurred" };
    }
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await apiClient.delete<ApiResponse<any>>(`${endpoint}/${id}`);
      return { success: data.success, message: data.message || "Deleted successfully" };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "An error occurred" };
    }
  },
});

export const catalogService = {
  brands: createCrudService("/brands"),
  productTypes: createCrudService("/product-types"),
  jewelTypes: createCrudService("/jewel-types"),
};
