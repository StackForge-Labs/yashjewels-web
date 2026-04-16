import apiClient, { getErrorMessage } from "@/lib/api-client";
import { Product, ProductCreateRequest, ProductUpdateRequest } from "@/types/product.types";

export interface GetProductsParams {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  brandId?: string;
  searchQuery?: string;
  sortBy?: string;
  inStock?: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const productService = {
  getAll: async (params?: GetProductsParams): Promise<PaginatedResponse<Product> | null> => {
    try {
      const { data } = await apiClient.get("/products", { params });
      return data.success ? data : null;
    } catch (error) {
      console.error("Failed to fetch products", getErrorMessage(error));
      return null;
    }
  },

  getBySlug: async (slug: string): Promise<Product | null> => {
    try {
      const { data } = await apiClient.get(`/products/slug/${slug}`);
      return data.success ? data.data : null;
    } catch (error) {
      console.error(`Failed to fetch product with slug: ${slug}`, getErrorMessage(error));
      return null;
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
  },

  /** Get dynamic MRP for a product based on current gold rate (via PricingService) */
  getPrice: async (id: string, insuranceRatePct?: number): Promise<{ success: boolean; data?: unknown; message: string }> => {
    try {
      const params = insuranceRatePct ? { insuranceRatePct } : {};
      const { data } = await apiClient.get(`/products/${id}/price`, { params });
      return { success: data.success, data: data.data, message: data.message || "OK" };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) ?? "An error occurred" };
    }
  },
};
