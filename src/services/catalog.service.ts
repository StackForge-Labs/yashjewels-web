import apiClient, { getErrorMessage } from "@/lib/api-client";

export interface RefItem {
  id: string;
  name: string;
  isActive?: boolean;
}

export const catalogService = {
  getBrands: async (): Promise<RefItem[]> => {
    try {
      const { data } = await apiClient.get("/brands");
      return data.success ? data.data : [];
    } catch { return []; }
  },

  // ✅ backend route: api/v1/product-types
  getProductTypes: async (): Promise<RefItem[]> => {
    try {
      const { data } = await apiClient.get("/product-types");
      return data.success ? data.data : [];
    } catch { return []; }
  },

  // ✅ backend route: api/v1/jewel-types
  getJewelTypes: async (): Promise<RefItem[]> => {
    try {
      const { data } = await apiClient.get("/jewel-types");
      return data.success ? data.data : [];
    } catch { return []; }
  },

  // ✅ backend route: api/v1/jewelry-specs/gold-karats
  getGoldKarats: async (): Promise<any[]> => {
    try {
      const { data } = await apiClient.get("/jewelry-specs/gold-karats");
      return data.success ? data.data : [];
    } catch { return []; }
  },

  // ✅ backend route: api/v1/jewelry-specs/certifications
  getCertifications: async (): Promise<any[]> => {
    try {
      const { data } = await apiClient.get("/jewelry-specs/certifications");
      return data.success ? data.data : [];
    } catch { return []; }
  },

  // ✅ backend route: api/v1/vendors (new CRUD controller)
  getVendors: async (): Promise<any[]> => {
    try {
      const { data } = await apiClient.get("/vendors");
      return data.success ? data.data : [];
    } catch { return []; }
  },
};
