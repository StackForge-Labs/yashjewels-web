"use client";
import { TrendingUp } from "lucide-react";
import { useGoldRate } from "@/hooks/useGoldRate";

/** Format USD with 2 decimals */
const formatUsd = (n: number) =>
  n.toLocaleString("en-US", { 
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2 
  });

/** Skeleton shimmer span */
const Shimmer = () => (
  <span className="inline-block h-3 w-20 animate-pulse rounded-sm bg-current opacity-20" />
);

export function GoldTicker() {
  const { snapshot, isLoading, isLive } = useGoldRate();

  return (
    <div
      aria-label="Live gold market rates"
      className="border-b border-gray-100 bg-white py-2 transition-colors dark:border-white/[0.04] dark:bg-[#080808]"
    >
      <div className="container mx-auto flex items-center justify-between gap-4 px-4">
        {/* Left — Live indicator + rates */}
        <div className="flex items-center gap-5 overflow-x-auto scrollbar-none">
          {/* Live dot */}
          <span className="flex shrink-0 items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isLive ? "bg-emerald-500 animate-pulse" : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
            <span className="text-[9px] font-bold tracking-[0.18em] text-gray-400 uppercase dark:text-gray-500">
              Live Market
            </span>
          </span>

          <span className="h-3 w-px shrink-0 bg-gray-200 dark:bg-white/10" />

          {/* 24K */}
          <RateCell
            label="Gold 24K / gram"
            isLoading={isLoading}
            value={snapshot ? formatUsd(snapshot.currentGoldRateUsd) : null}
          />

          <span className="hidden h-3 w-px shrink-0 bg-gray-200 sm:block dark:bg-white/10" />

          {/* 18K (Estimate) */}
          <RateCell
            label="Gold 18K / gram"
            isLoading={isLoading}
            value={snapshot ? formatUsd(snapshot.currentGoldRateUsd * 0.75) : null}
            className="hidden sm:flex"
          />
        </div>

        {/* Right — link to gold price page */}
        <a
          href="/gold-price"
          className="group hidden shrink-0 items-center gap-1.5 transition-opacity hover:opacity-70 sm:flex"
        >
          <TrendingUp
            size={11}
            className="text-gold stroke-[2.5] transition-transform group-hover:-rotate-12"
          />
          <span className="text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase dark:text-gray-500">
            Full History
          </span>
        </a>
      </div>
    </div>
  );
}

// ─── Sub-component ────────────────────────────────────────────────────────────

interface RateCellProps {
  label: string;
  value: string | null;
  isLoading: boolean;
  className?: string;
}

function RateCell({ label, value, isLoading, className = "flex" }: RateCellProps) {
  return (
    <span className={`${className} items-baseline gap-2`}>
      <span className="text-[9px] font-semibold tracking-[0.12em] text-gray-400 uppercase dark:text-gray-500">
        {label}
      </span>
      <span
        className={`font-mono text-[11px] font-bold tracking-tight transition-opacity duration-300 ${
          isLoading ? "opacity-40" : "opacity-100"
        } text-gray-900 dark:text-white`}
      >
        {isLoading ? <Shimmer /> : value}
      </span>
    </span>
  );
}
