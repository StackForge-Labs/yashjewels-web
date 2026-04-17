import apiClient from "@/lib/api-client";

/** VND/gram rate returned by backend */
export interface GoldRateSnapshot {
  rate24kPerGram: number;  // VND per gram 24K
  rate18kPerGram: number;  // VND per gram 18K (= 24K × 0.75)
  rate24kPerChi: number;   // VND per chỉ (= gram × 3.75)
  usdToVnd: number;        // USD → VND exchange rate
  updatedAt: string;       // ISO timestamp
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
  /** Fetch current VND/gram rate and derive all display values */
  getSnapshot: async (): Promise<GoldRateSnapshot | null> => {
    try {
      const [rateRes, usdRes] = await Promise.all([
        apiClient.get<any>("/gold-rates/current-gold-rate"),
        apiClient.get<any>("/gold-rates/current-usd-rate"),
      ]);

      const rawRate = rateRes.data?.data;
      const rawUsd = usdRes.data?.data;

      const rate24k = typeof rawRate === 'number' ? rawRate : (rawRate?.currentGoldRateVnd || rawRate?.CurrentGoldRateVnd || 0);
      const usdRate = typeof rawUsd === 'number' ? rawUsd : (rawUsd?.currentUsdToVndRate || rawUsd?.CurrentUsdToVndRate || 25000);

      return {
        rate24kPerGram: rate24k,
        rate18kPerGram:  Math.round(rate24k * KARAT_18K_RATIO),
        rate24kPerChi: Math.round(rate24k * CHI_MULTIPLIER),
        usdToVnd: usdRate,
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
