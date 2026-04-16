"use client";
import { useState, useEffect, useCallback } from "react";
import { goldRateService, GoldRateSnapshot } from "@/services/gold-rate.service";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes — mirrors backend GoldWorker cadence

interface UseGoldRateReturn {
  snapshot: GoldRateSnapshot | null;
  isLoading: boolean;
  isLive: boolean;          // true after first successful fetch
  lastRefreshed: Date | null;
}

export function useGoldRate(): UseGoldRateReturn {
  const [snapshot, setSnapshot] = useState<GoldRateSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetch = useCallback(async () => {
    const data = await goldRateService.getSnapshot();
    if (data) {
      setSnapshot(data);
      setIsLive(true);
      setLastRefreshed(new Date());
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetch();
    const timer = setInterval(fetch, REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [fetch]);

  return { snapshot, isLoading, isLive, lastRefreshed };
}
