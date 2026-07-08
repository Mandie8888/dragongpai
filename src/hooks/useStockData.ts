import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface StockNewsItem {
  title: string;
  publisher: string;
  link: string;
  publishedAt: string | null;
}

export interface LiveStockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  yearHigh: number;
  yearLow: number;
  volume: string;
  volumeRaw: number;
  marketCap: string;
  pe: number | null;
  sector: string;
  industry: string;
  currency: string;
  roe: number | null;
  debtToEquity: number | null;
  dividendYield: number;
  forwardDividendRate: number | null;
  exDividendDate: string | null;
  operatingCashFlowPerShare: number | null;
  // Market depth
  bid: number;
  ask: number;
  bidSize: number;
  askSize: number;
  dayRange: string;
  // Market status
  marketState: string; // "REGULAR" | "PRE" | "POST" | "CLOSED" | "PREPRE" | "POSTPOST"
  // Company info
  companyDescription: string;
  // News
  news: StockNewsItem[];
}

// Simple in-memory cache (ticker → data + timestamp)
const cache: Record<string, { data: LiveStockData; ts: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useStockData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStockData = useCallback(async (symbol: string): Promise<LiveStockData | null> => {
    const ticker = symbol.toUpperCase();

    // Check cache
    const cached = cache[ticker];
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return cached.data;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("fetch-stock-quote", {
        body: { symbol: ticker },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Provide defaults for new fields to handle backward compatibility
      const liveData: LiveStockData = {
        symbol: data.symbol ?? ticker,
        name: data.name ?? ticker,
        price: data.price ?? 0,
        change: data.change ?? 0,
        previousClose: data.previousClose ?? data.price ?? 0,
        dayHigh: data.dayHigh ?? 0,
        dayLow: data.dayLow ?? 0,
        yearHigh: data.yearHigh ?? 0,
        yearLow: data.yearLow ?? 0,
        volume: data.volume ?? "N/A",
        volumeRaw: data.volumeRaw ?? 0,
        marketCap: data.marketCap ?? "N/A",
        pe: data.pe ?? null,
        sector: data.sector ?? "",
        industry: data.industry ?? "",
        currency: data.currency ?? "USD",
        roe: data.roe ?? null,
        debtToEquity: data.debtToEquity ?? null,
        dividendYield: data.dividendYield ?? 0,
        forwardDividendRate: data.forwardDividendRate ?? null,
        exDividendDate: data.exDividendDate ?? null,
        operatingCashFlowPerShare: data.operatingCashFlowPerShare ?? null,
        bid: data.bid ?? 0,
        ask: data.ask ?? 0,
        bidSize: data.bidSize ?? 0,
        askSize: data.askSize ?? 0,
        dayRange: data.dayRange ?? "N/A",
        marketState: data.marketState ?? "CLOSED",
        companyDescription: data.companyDescription ?? "",
        news: data.news ?? [],
      };

      cache[ticker] = { data: liveData, ts: Date.now() };
      return liveData;
    } catch (err: any) {
      console.error("useStockData error:", err);
      setError(err.message || "Failed to fetch stock data");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchStockData, loading, error };
};
