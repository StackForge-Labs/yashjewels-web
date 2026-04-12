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
  getProductTypes: async (): Promise<RefItem[]> => {
    try {
      const { data } = await apiClient.get("/productTypes");
      return data.success ? data.data : [];
    } catch { return []; }
  },
  getJewelTypes: async (): Promise<RefItem[]> => {
    try {
      const { data } = await apiClient.get("/jewelTypes");
      return data.success ? data.data : [];
    } catch { return []; }
  },
  getGoldKarats: async (): Promise<any[]> => {
    try {
      // Gold karats usually have CaratLabel instead of Name
      const { data } = await apiClient.get("/goldKarats");
      return data.success ? data.data : [];
    } catch { return []; }
  },
  getCertifications: async (): Promise<any[]> => {
    try {
      const { data } = await apiClient.get("/certifications");
      return data.success ? data.data : [];
    } catch { return []; }
  },
  getVendors: async (): Promise<any[]> => {
    try {
      // Vendors have businessName
      const { data } = await apiClient.get("/vendors");
      return data.success ? data.data : [];
    } catch { return []; }
  }
};
