/**
 * Market API Service
 * 
 * Fetches and normalizes data for international gold, forex, and diamond markets.
 * Enhanced for high-fidelity "Yash Jewels" dashboard.
 */

export interface GoldPrice {
  name: string;
  buy: number;
  sell: number;
  dayChange: number;
  dayChangePercent: number;
  time: string;
}

export interface ChartData {
  date: string;
  buy: number;
  sell: number;
}

export interface ForexRate {
  code: string;
  name: string;
  rate: number;
  flag: string;
}

export interface DiamondBenchmark {
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  price: number;
  change: number;
  trend: "up" | "down" | "stable";
}

export interface BrandPrice {
  id: string;
  name: string;
  logo: string;
  buy: number;
  sell: number;
  change: number;
  changePercent: number;
  status: "Open" | "Closed" | "Live";
}

const WORLD_GOLD_API = "https://www.vang.today/api/prices?type=XAUUSD&days=7";
const FOREX_API = "https://api.exchangerate-api.com/v4/latest/USD";

// --- Mock Data ---

const MOCK_GOLD_HISTORY: ChartData[] = [
  { date: "25/03", buy: 2165.40, sell: 2170.40 },
  { date: "26/03", buy: 2172.10, sell: 2177.10 },
  { date: "27/03", buy: 2168.50, sell: 2173.50 },
  { date: "28/03", buy: 2175.20, sell: 2180.20 },
  { date: "29/03", buy: 2182.80, sell: 2187.80 },
  { date: "30/03", buy: 2195.40, sell: 2200.40 },
  { date: "31/03", buy: 2210.20, sell: 2215.20 },
];

const DIAMOND_BENCHMARKS: DiamondBenchmark[] = [
  { shape: "Round", carat: 1.0, color: "D", clarity: "IF", cut: "Excellent", price: 12500, change: 150, trend: "up" },
  { shape: "Round", carat: 1.0, color: "G", clarity: "VS1", cut: "Excellent", price: 8200, change: -45, trend: "down" },
  { shape: "Round", carat: 0.5, color: "E", clarity: "VVS2", cut: "Ideal", price: 3400, change: 20, trend: "up" },
  { shape: "Princess", carat: 1.0, color: "F", clarity: "VS2", cut: "Excellent", price: 6800, change: 10, trend: "stable" },
  { shape: "Oval", carat: 1.5, color: "H", clarity: "SI1", cut: "Very Good", price: 9500, change: -120, trend: "down" },
  { shape: "Emerald", carat: 2.0, color: "G", clarity: "VVS1", cut: "Excellent", price: 24000, change: 500, trend: "up" },
];

const CURRENCY_LIST = [
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "VND", name: "Vietnamese Dong", flag: "🇻🇳" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" }
];

// --- API Functions ---

export async function fetchGoldPrice(): Promise<{ current: GoldPrice; variations: GoldPrice[]; history: ChartData[] }> {
  try {
    const res = await fetch(WORLD_GOLD_API, { next: { revalidate: 300 } });
    const data = await res.json();
    
    if (data.success && data.history?.length > 0) {
      const latest = data.history[0].prices.XAUUSD;
      const history = data.history.slice(0, 7).reverse().map((h: any) => ({
        date: h.date.split("-").slice(1).reverse().join("/"),
        buy: h.prices.XAUUSD.buy,
        sell: h.prices.XAUUSD.buy + 5.0
      }));

      const current = {
        name: "World Gold (Spot)",
        buy: latest.buy,
        sell: latest.buy + 5.0,
        dayChange: latest.day_change_buy,
        dayChangePercent: Number(((latest.day_change_buy / latest.buy) * 100).toFixed(2)),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      // Variations (18K, 14K, 10K benchmarks based on purity)
      const variations = [
        { ...current, name: "Gold 24K (Pure)", buy: current.buy, sell: current.sell },
        { ...current, name: "Gold 18K", buy: current.buy * 0.75, sell: current.sell * 0.75, dayChange: current.dayChange * 0.75 },
        { ...current, name: "Gold 14K", buy: current.buy * 0.583, sell: current.sell * 0.583, dayChange: current.dayChange * 0.583 },
        { ...current, name: "Gold 10K", buy: current.buy * 0.417, sell: current.sell * 0.417, dayChange: current.dayChange * 0.417 },
      ];

      return { current, variations, history };
    }
  } catch (error) {
    console.error("Gold API Error:", error);
  }
  
  // Fallback
  const fallbackCurrent = { name: "World Gold", buy: 2285.40, sell: 2290.40, dayChange: 15.2, dayChangePercent: 0.67, time: "Live" };
  return {
    current: fallbackCurrent,
    variations: [
      { ...fallbackCurrent, name: "Gold 24K" },
      { ...fallbackCurrent, name: "Gold 18K", buy: 1714.05, sell: 1717.80 },
      { ...fallbackCurrent, name: "Gold 14K", buy: 1332.38, sell: 1335.30 },
    ],
    history: MOCK_GOLD_HISTORY
  };
}

export async function fetchForexRates(): Promise<ForexRate[]> {
  try {
    const res = await fetch(FOREX_API, { next: { revalidate: 3600 } });
    const data = await res.json();
    
    if (data.rates) {
      return CURRENCY_LIST.map(c => ({
        ...c,
        rate: data.rates[c.code]
      }));
    }
  } catch (error) {
    console.error("Forex API Error:", error);
  }
  return [];
}

export async function getDiamondBenchmarks(): Promise<DiamondBenchmark[]> {
  return DIAMOND_BENCHMARKS.map(d => ({
    ...d,
    price: d.price + (Math.random() * 20 - 10)
  }));
}

export async function getBrandPrices(): Promise<BrandPrice[]> {
  const world = 2285.40;
  return [
    { id: "yash", name: "Yash Jewels Signature", logo: "Star", buy: world * 1.08, sell: world * 1.15, change: 150, changePercent: 0.85, status: "Live" },
    { id: "world", name: "International Spot", logo: "Globe", buy: world, sell: world + 5, change: 15, changePercent: 0.67, status: "Live" },
    { id: "sjc", name: "SJC Gold Bar", logo: "Coins", buy: world * 1.05, sell: world * 1.10, change: 110, changePercent: 0.64, status: "Open" },
    { id: "pnj", name: "PNJ Fine Gold", logo: "Coins", buy: world * 1.02, sell: world * 1.08, change: 120, changePercent: 0.67, status: "Open" },
  ];
}
