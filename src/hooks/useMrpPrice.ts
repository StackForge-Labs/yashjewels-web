"use client";
import { useState, useEffect } from "react";
import { goldRateService, PriceBreakdown } from "@/services/gold-rate.service";

interface UseMrpPriceReturn {
  breakdown: PriceBreakdown | null;
  isLoading: boolean;
  mrpFormatted: string | null;
}

const formatUsd = (val: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: val % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    }).format(val);

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
            goldRatePerGram: 75,
            goldRatePerChi: 280,
            goldMaterialAmt: 300,
            wastageAmt: 30,
            goldMakingCharge: 50,
            stoneMakingCharge: 0,
            otherMakingCharge: 0,
            stoneCharges: 800,
            subtotal: 1180,
            vatAmt: 118,
            mrp: 1298,
            rateValidUntil: new Date().toISOString(),
            rateSource: "Real-time Gold Market (USD)"
          },
          insuranceFee: 0,
          finalPrice: 1298,
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
    mrpFormatted: breakdown ? formatUsd(breakdown.finalPrice) : null,
  };
}
