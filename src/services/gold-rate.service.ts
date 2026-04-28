import apiClient from "@/lib/api-client";

export interface GoldRateSnapshot {
  currentGoldRateUsd: number; // USD per gram 24K
  updatedAt: string;          // ISO timestamp
}

export interface PriceBreakdown {
  productId: string;
  styleCode: string;
  breakdown: {
    goldRatePerGram: number;
    goldRatePerChi: number;
    goldMaterialAmt: number;
    wastageAmt: number;
    goldMakingCharge: number;
    stoneMakingCharge: number;
    otherMakingCharge: number;
    stoneCharges: number;
    subtotal: number;
    vatAmt: number;
    mrp: number;
    rateValidUntil: string;
    rateSource: string;
  };
  insuranceFee: number | null;
  finalPrice: number;
  calculatedAt: string;
}

const CHI_MULTIPLIER = 3.75;
const KARAT_18K_RATIO = 0.75;

export const goldRateService = {
  /** Fetch current USD/gram rate */
  getSnapshot: async (): Promise<GoldRateSnapshot | null> => {
    try {
      const { data: res } = await apiClient.get<any>("/gold-rates/current-gold-rate");
      const rawRate = res?.data;

      // The backend returns a decimal directly or wrapped in an object
      const rateUsd = typeof rawRate === "number" ? rawRate : (rawRate?.rateUsd || rawRate?.RateUsd || 0);

      return {
        currentGoldRateUsd: rateUsd,
        updatedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.error("Gold rate snapshot error:", err);
      return null;
    }
  },

  /** Calculate dynamic MRP for a specific product */
  getPriceBreakdown: async (productId: string, insuranceRatePct?: number): Promise<PriceBreakdown | null> => {
    try {
      const params = insuranceRatePct ? { insuranceRatePct } : {};
      const { data } = await apiClient.get(`/products/${productId}/price`, { params });
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  getHistory: async (limit: number = 5) => {
    return apiClient.get(`/gold-rates/history?limit=${limit}`).then((r) => r.data);
  },

  triggerFetch: async () => {
    return apiClient.post("/gold-rates/trigger-fetch").then((r) => r.data);
  },

  manualOverride: async (manualRate: number, isManual: boolean) => {
    return apiClient.post("/gold-rates/manual-override", { manualRate, isManual }).then((r) => r.data);
  },
};
