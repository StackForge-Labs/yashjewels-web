"use client";
import { useState, useEffect } from "react";
import { goldRateService, PriceBreakdown } from "@/services/gold-rate.service";

interface UseMrpPriceReturn {
  breakdown: PriceBreakdown | null;
  isLoading: boolean;
  mrpFormatted: string | null;
}

const formatVnd = (n: number) =>
  n.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " ₫";

export function useMrpPrice(productId: string | undefined): UseMrpPriceReturn {
  const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    // Handle Mock ID for demonstration purposes
    if (productId.startsWith("MOCK-LIVE")) {
      setIsLoading(true);
      // Simulate API latency
      const timer = setTimeout(() => {
        setBreakdown({
          productId: productId,
          styleCode: "DEMO-STYLE",
          breakdown: {
            goldRatePerGram: 4070000,
            goldRatePerChi: 15262500,
            goldMaterialAmt: 8140000,
            wastageAmt: 407000,
            goldMakingCharge: 500000,
            stoneMakingCharge: 0,
            otherMakingCharge: 0,
            stoneCharges: 10000000,
            subtotal: 19047000,
            vatAmt: 1904700,
            mrp: 20951700,
            rateValidUntil: new Date().toISOString(),
            rateSource: "Real-time Gold Market"
          },
          insuranceFee: 0,
          finalPrice: 20951700,
          calculatedAt: new Date().toISOString()
        });
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }

    setIsLoading(true);
    goldRateService.getPriceBreakdown(productId).then((data) => {
      setBreakdown(data);
      setIsLoading(false);
    });
  }, [productId]);

  return {
    breakdown,
    isLoading,
    mrpFormatted: breakdown ? formatVnd(breakdown.finalPrice) : null,
  };
}
