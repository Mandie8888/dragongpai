// src/hooks/useStockData.ts
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
  bid: number;
  ask: number;
  bidSize: number;
  askSize: number;
  dayRange: string;
  marketState: string;
  companyDescription: string;
  news: StockNewsItem[];
  averageVolume?: number | null;
  regularMarketOpen?: number | null;
  regularMarketDayHigh?: number | null;
  regularMarketDayLow?: number | null;
  beta?: number | null;
  // Technical indicators
  rsi?: number | null;
  macd?: number | null;
  macdSignal?: number | null;
  macdHistogram?: number | null;
}

const cache: Record<string, { data: LiveStockData; ts: number }> = {};
const CACHE_TTL = 5 * 60 * 1000;

export const useStockData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStockData = useCallback(async (symbol: string): Promise<LiveStockData | null> => {
    const ticker = symbol.toUpperCase();

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
        console.error('Edge Function error:', fnError);
        throw new Error(fnError.message);
      }

      if (data?.error) {
        console.error('Data error:', data.error);
        throw new Error(data.error);
      }

      console.log(`📊 ${ticker} data received:`, data);

      // Format market cap
      let marketCapStr = data.marketCap || "N/A";
      if (data.marketCap && typeof data.marketCap === 'number') {
        const num = data.marketCap;
        if (num >= 1e12) {
          marketCapStr = `$${(num / 1e12).toFixed(1)}T`;
        } else if (num >= 1e9) {
          marketCapStr = `$${(num / 1e9).toFixed(1)}B`;
        } else if (num >= 1e6) {
          marketCapStr = `$${(num / 1e6).toFixed(1)}M`;
        } else {
          marketCapStr = `$${num.toFixed(0)}`;
        }
      }

      // Format PE
      let peValue: number | null = null;
      if (data.pe !== null && data.pe !== undefined && data.pe !== 'N/A') {
        peValue = typeof data.pe === 'number' ? data.pe : parseFloat(data.pe);
        if (isNaN(peValue)) peValue = null;
      }

      // Format ROE
      let roeValue: number | null = null;
      if (data.roe !== null && data.roe !== undefined && data.roe !== 'N/A') {
        roeValue = typeof data.roe === 'number' ? data.roe : parseFloat(data.roe);
        if (isNaN(roeValue)) roeValue = null;
      }

      // Format dividend yield
      let dividendYieldValue = 0;
      if (data.dividendYield !== null && data.dividendYield !== undefined && data.dividendYield !== 'N/A') {
        dividendYieldValue = typeof data.dividendYield === 'number' ? data.dividendYield : parseFloat(data.dividendYield);
        if (isNaN(dividendYieldValue)) dividendYieldValue = 0;
      }

      const currency = data.currency || "USD";

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
        marketCap: marketCapStr,
        pe: peValue,
        sector: data.sector ?? "N/A",
        industry: data.industry ?? "N/A",
        currency: currency,
        roe: roeValue,
        debtToEquity: data.debtToEquity ?? null,
        dividendYield: dividendYieldValue,
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
        averageVolume: data.averageVolume ?? null,
        regularMarketOpen: data.regularMarketOpen ?? null,
        regularMarketDayHigh: data.regularMarketDayHigh ?? null,
        regularMarketDayLow: data.regularMarketDayLow ?? null,
        beta: data.beta ?? null,
        // Technical indicators from Yahoo Finance
        rsi: data.rsi ?? null,
        macd: data.macd ?? null,
        macdSignal: data.macdSignal ?? null,
        macdHistogram: data.macdHistogram ?? null,
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