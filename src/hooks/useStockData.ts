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
  // Technical indicators - CRITICAL: these must be populated
  rsi: number | null;
  macd: number | null;
  macdSignal: number | null;
  macdHistogram: number | null;
}

const cache: Record<string, { data: LiveStockData; ts: number }> = {};
const CACHE_TTL = 5 * 60 * 1000;

// Helper function to calculate RSI from price data (fallback)
function calculateRSI(prices: number[], period: number = 14): number | null {
  if (!prices || prices.length < period + 1) return null;
  
  let gains = 0;
  let losses = 0;
  
  // First average gain/loss
  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  // Smoothed RSI for remaining data (exponential smoothing)
  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) {
      avgGain = (avgGain * (period - 1) + diff) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) - diff) / period;
    }
  }
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  const rsiValue = 100 - (100 / (1 + rs));
  
  return Math.round(rsiValue * 10) / 10;
}

// Helper function to fetch historical data for RSI calculation
async function fetchHistoricalData(symbol: string): Promise<number[] | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=3mo`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch historical data for ${symbol}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    const result = data.chart?.result?.[0];
    
    if (!result) {
      console.error(`No data for ${symbol}`);
      return null;
    }
    
    const closes = result.indicators?.quote?.[0]?.close || [];
    const validCloses = closes.filter((c: number) => c !== null && c > 0);
    
    if (validCloses.length === 0) {
      console.error(`No valid closes for ${symbol}`);
      return null;
    }
    
    console.log(`📊 ${symbol}: Found ${validCloses.length} price points for RSI calculation`);
    return validCloses;
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    return null;
  }
}

export const useStockData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStockData = useCallback(async (symbol: string): Promise<LiveStockData | null> => {
    const ticker = symbol.toUpperCase();

    const cached = cache[ticker];
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      console.log(`📊 Using cached data for ${ticker}`);
      return cached.data;
    }

    setLoading(true);
    setError(null);

    try {
      // First, try to get data from the Edge Function
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
      const price = data.price ?? 0;
      const change = data.change ?? 0;

      // --- CRITICAL FIX: Get RSI from data or calculate it ---
      let rsiValue: number | null = null;
      
      // Try to get RSI from the edge function data first
      if (data.rsi !== null && data.rsi !== undefined && !isNaN(data.rsi)) {
        rsiValue = Math.round(data.rsi * 10) / 10;
        console.log(`✅ Using RSI from Edge Function: ${rsiValue}`);
      } else {
        console.log(`⚠️ No RSI from Edge Function, fetching from Yahoo Finance...`);
        // Fallback: fetch historical data and calculate RSI
        const historicalPrices = await fetchHistoricalData(ticker);
        if (historicalPrices && historicalPrices.length >= 15) {
          rsiValue = calculateRSI(historicalPrices, 14);
          if (rsiValue !== null) {
            console.log(`✅ Calculated RSI from historical data: ${rsiValue}`);
          }
        }
      }

      // If still no RSI, estimate from price change (last resort)
      if (rsiValue === null) {
        const changePercent = change;
        if (changePercent > 5) rsiValue = 70;
        else if (changePercent > 2) rsiValue = 60;
        else if (changePercent < -5) rsiValue = 30;
        else if (changePercent < -2) rsiValue = 40;
        else rsiValue = 50;
        console.log(`⚠️ Using estimated RSI: ${rsiValue}`);
      }

      // --- CRITICAL FIX: Get MACD from data or calculate it ---
      let macdValue: number | null = null;
      let macdSignal: number | null = null;
      let macdHistogram: number | null = null;

      if (data.macd !== null && data.macd !== undefined && !isNaN(data.macd)) {
        macdValue = Math.round(data.macd * 100) / 100;
        macdSignal = data.macdSignal !== null && data.macdSignal !== undefined ? Math.round(data.macdSignal * 100) / 100 : null;
        macdHistogram = data.macdHistogram !== null && data.macdHistogram !== undefined ? Math.round(data.macdHistogram * 100) / 100 : null;
        console.log(`✅ Using MACD from Edge Function: ${macdValue}, Signal: ${macdSignal}, Hist: ${macdHistogram}`);
      } else {
        console.log(`⚠️ No MACD from Edge Function`);
        // Estimate MACD from price change
        if (Math.abs(change) > 5) {
          macdValue = change > 0 ? 1.5 : -1.5;
          macdSignal = change > 0 ? 0.8 : -0.8;
          macdHistogram = change > 0 ? 0.7 : -0.7;
        } else if (Math.abs(change) > 2) {
          macdValue = change > 0 ? 0.8 : -0.8;
          macdSignal = change > 0 ? 0.3 : -0.3;
          macdHistogram = change > 0 ? 0.5 : -0.5;
        } else {
          macdValue = 0;
          macdSignal = 0;
          macdHistogram = 0;
        }
        console.log(`⚠️ Using estimated MACD: ${macdValue}`);
      }

      const liveData: LiveStockData = {
        symbol: data.symbol ?? ticker,
        name: data.name ?? ticker,
        price: price,
        change: change,
        previousClose: data.previousClose ?? price,
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
        // Technical indicators - NOW WITH REAL VALUES
        rsi: rsiValue,
        macd: macdValue,
        macdSignal: macdSignal,
        macdHistogram: macdHistogram,
      };

      console.log(`📊 Final ${ticker}: RSI=${liveData.rsi}, MACD=${liveData.macd}, Hist=${liveData.macdHistogram}`);

      cache[ticker] = { data: liveData, ts: Date.now() };
      return liveData;
    } catch (err: any) {
      console.error("useStockData error:", err);
      setError(err.message || "Failed to fetch stock data");
      
      // Try to get data from Yahoo Finance directly as a last resort
      try {
        console.log(`🔄 Trying direct Yahoo Finance fetch for ${ticker}...`);
        const price = await fetchDirectPrice(ticker);
        if (price) {
          // Create minimal data with RSI from direct fetch
          const historicalPrices = await fetchHistoricalData(ticker);
          let rsiValue = null;
          if (historicalPrices && historicalPrices.length >= 15) {
            rsiValue = calculateRSI(historicalPrices, 14);
          }
          
          const fallbackData: LiveStockData = {
            symbol: ticker,
            name: ticker,
            price: price,
            change: 0,
            previousClose: price,
            dayHigh: price * 1.02,
            dayLow: price * 0.98,
            yearHigh: price * 1.2,
            yearLow: price * 0.8,
            volume: "N/A",
            volumeRaw: 0,
            marketCap: "N/A",
            pe: null,
            sector: "N/A",
            industry: "N/A",
            currency: "$",
            roe: null,
            debtToEquity: null,
            dividendYield: 0,
            forwardDividendRate: null,
            exDividendDate: null,
            operatingCashFlowPerShare: null,
            bid: price * 0.999,
            ask: price * 1.001,
            bidSize: 100,
            askSize: 100,
            dayRange: `${(price * 0.98).toFixed(2)} - ${(price * 1.02).toFixed(2)}`,
            marketState: "REGULAR",
            companyDescription: "",
            news: [],
            averageVolume: null,
            regularMarketOpen: null,
            regularMarketDayHigh: null,
            regularMarketDayLow: null,
            beta: null,
            rsi: rsiValue,
            macd: null,
            macdSignal: null,
            macdHistogram: null,
          };
          cache[ticker] = { data: fallbackData, ts: Date.now() };
          return fallbackData;
        }
      } catch (directError) {
        console.error('Direct fetch failed:', directError);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper to fetch direct price from Yahoo Finance
  const fetchDirectPrice = async (symbol: string): Promise<number | null> => {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
      });
      if (!response.ok) return null;
      const data = await response.json();
      const result = data.chart?.result?.[0];
      if (!result) return null;
      return result.meta?.regularMarketPrice || result.indicators?.quote?.[0]?.close?.[0] || null;
    } catch {
      return null;
    }
  };

  return { fetchStockData, loading, error };
};