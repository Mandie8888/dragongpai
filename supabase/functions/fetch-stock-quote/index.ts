// supabase/functions/fetch-stock-quote/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ALPHA_VANTAGE_API_KEY = Deno.env.get("ALPHA_VANTAGE_API_KEY") || "";

console.log("Hello from fetch-stock-quote!");
console.log(`Alpha Vantage API Key set: ${ALPHA_VANTAGE_API_KEY ? "✅ Yes" : "❌ No"}`);

// Fallback data for common stocks - UPDATED with trailingPE field
const FALLBACK_DATA: Record<string, any> = {
  "NBIS": {
    marketCap: 47674466000,
    trailingPE: 85.35,  // Changed from peRatio to trailingPE
    roe: 0.141,
    sector: "COMMUNICATION SERVICES",
    industry: "INTERNET CONTENT & INFORMATION",
    description: "Nebius Group N.V. (Ticker: NBIS) is an innovative technology firm that specializes in advanced digital solutions to enhance client engagement and operational efficiency across diverse sectors.",
    beta: 1.402,
  },
  "0700.HK": {
    marketCap: 5120000000000,
    trailingPE: 22.8,  // Changed from peRatio to trailingPE
    roe: 0.185,
    sector: "TECHNOLOGY",
    industry: "INTERNET SERVICES",
    description: "Tencent Holdings Limited provides value-added services and online advertising services.",
    beta: 0.8,
  },
  "TSLA": {
    marketCap: 1170000000000,
    trailingPE: 75.8,
    roe: 0.224,
    sector: "CONSUMER CYCLICAL",
    industry: "AUTOMOBILES",
    description: "Tesla, Inc. designs, develops, manufactures, and sells electric vehicles.",
    beta: 2.1,
  },
  "NVDA": {
    marketCap: 1020000000000,
    trailingPE: 62.5,
    roe: 0.448,
    sector: "TECHNOLOGY",
    industry: "SEMICONDUCTORS",
    description: "NVIDIA Corporation provides graphics and compute solutions.",
    beta: 1.6,
  },
  "AAPL": {
    marketCap: 3580000000000,
    trailingPE: 30.2,
    roe: 1.609,
    sector: "TECHNOLOGY",
    industry: "CONSUMER ELECTRONICS",
    description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.",
    beta: 1.2,
  },
  "MSFT": {
    marketCap: 3260000000000,
    trailingPE: 35.8,
    roe: 0.385,
    sector: "TECHNOLOGY",
    industry: "SOFTWARE",
    description: "Microsoft Corporation develops and supports software, services, devices, and solutions.",
    beta: 0.9,
  },
  "GOOGL": {
    marketCap: 2380000000000,
    trailingPE: 25.4,
    roe: 0.276,
    sector: "COMMUNICATION SERVICES",
    industry: "INTERNET SERVICES",
    description: "Alphabet Inc. offers various products and platforms including Google Search, YouTube, Android, and Google Cloud.",
    beta: 1.0,
  },
  "AMZN": {
    marketCap: 2340000000000,
    trailingPE: 58.3,
    roe: 0.182,
    sector: "CONSUMER CYCLICAL",
    industry: "E-COMMERCE",
    description: "Amazon.com, Inc. engages in the retail sale of consumer products and provides AWS cloud computing services.",
    beta: 1.2,
  },
  "META": {
    marketCap: 1750000000000,
    trailingPE: 28.1,
    roe: 0.287,
    sector: "COMMUNICATION SERVICES",
    industry: "SOCIAL MEDIA",
    description: "Meta Platforms, Inc. develops products that enable people to connect and share through mobile devices, PCs, virtual reality headsets, and wearables.",
    beta: 1.3,
  },
  "SPCX": {
    marketCap: 50000000000,
    trailingPE: 85.35,
    roe: 0.141,
    sector: "AEROSPACE & DEFENSE",
    industry: "SPACE EXPLORATION",
    description: "Space Exploration Technologies Corp. (SpaceX) designs, manufactures, and launches advanced rockets and spacecraft.",
    beta: 1.8,
  },
  "2330.TW": {
    marketCap: 49600000000000,
    trailingPE: 28.4,
    roe: 0.268,
    sector: "TECHNOLOGY",
    industry: "SEMICONDUCTORS",
    description: "Taiwan Semiconductor Manufacturing Company Limited manufactures and sells integrated circuits and semiconductors.",
    beta: 1.1,
  },
};

// Calculate RSI from price data
function calculateRSI(closes: number[], period: number = 14): number | null {
  if (closes.length < period + 1) return null;
  
  const prices = closes.slice(-period - 1);
  let gains = 0, losses = 0;
  
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    if (change >= 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

// Calculate MACD from price data with normalization
function calculateMACD(closes: number[]): { macd: number; signal: number; histogram: number } | null {
  if (closes.length < 26) return null;
  
  const prices = closes.slice(-26);
  const currentPrice = prices[prices.length - 1] || 1;
  
  const ema12 = prices.slice(-12).reduce((a, b) => a + b, 0) / 12;
  const ema26 = prices.slice(-26).reduce((a, b) => a + b, 0) / 26;
  
  const rawMacd = ema12 - ema26;
  
  const signalPeriod = 9;
  const signalPrices = prices.slice(-signalPeriod);
  const rawSignal = signalPrices.reduce((a, b) => a + b, 0) / signalPeriod;
  
  const rawHistogram = rawMacd - rawSignal;
  
  const normalizationFactor = currentPrice / 100;
  
  return { 
    macd: parseFloat((rawMacd / normalizationFactor).toFixed(2)),
    signal: parseFloat((rawSignal / normalizationFactor).toFixed(2)),
    histogram: parseFloat((rawHistogram / normalizationFactor).toFixed(2))
  };
}

// Function to fetch fundamental data from Alpha Vantage with fallback
async function fetchAlphaVantageData(symbol: string) {
  const upperSymbol = symbol.toUpperCase();
  
  if (FALLBACK_DATA[upperSymbol]) {
    console.log(`📦 Using fallback data for ${upperSymbol}`);
    return FALLBACK_DATA[upperSymbol];
  }

  if (!ALPHA_VANTAGE_API_KEY || ALPHA_VANTAGE_API_KEY === "") {
    console.log("⚠️ Alpha Vantage API key not set.");
    return null;
  }

  try {
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    console.log(`Fetching fundamentals from Alpha Vantage for ${symbol}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Alpha Vantage API returned ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.Note || data.Information) {
      console.log("Alpha Vantage rate limit:", data.Note || data.Information);
      if (FALLBACK_DATA[upperSymbol]) {
        console.log(`📦 Using fallback data for ${upperSymbol} due to rate limit`);
        return FALLBACK_DATA[upperSymbol];
      }
      return null;
    }
    
    if (!data.Symbol) {
      console.log("No data returned from Alpha Vantage for symbol:", symbol);
      return null;
    }
    
    console.log(`✅ Alpha Vantage data received for ${symbol}`);
    
    return {
      marketCap: data.MarketCapitalization ? parseFloat(data.MarketCapitalization) : null,
      trailingPE: data.TrailingPE ? parseFloat(data.TrailingPE) : null,
      roe: data.ReturnOnEquityTTM ? parseFloat(data.ReturnOnEquityTTM) : null,
      sector: data.Sector || "",
      industry: data.Industry || "",
      description: data.Description || "",
      beta: data.Beta ? parseFloat(data.Beta) : null,
      fiftyTwoWeekHigh: data["52WeekHigh"] ? parseFloat(data["52WeekHigh"]) : null,
      fiftyTwoWeekLow: data["52WeekLow"] ? parseFloat(data["52WeekLow"]) : null,
    };
  } catch (err) {
    console.error("Error fetching Alpha Vantage data:", err);
    if (FALLBACK_DATA[upperSymbol]) {
      console.log(`📦 Using fallback data for ${upperSymbol} due to error`);
      return FALLBACK_DATA[upperSymbol];
    }
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { symbol } = body;
    
    console.log(`Fetching quote data for ${symbol}`);

    if (!symbol) {
      throw new Error("Symbol is required");
    }

    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=3mo`;
    console.log(`Fetching from Yahoo: ${yahooUrl}`);
    
    const response = await fetch(yahooUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      console.error(`Yahoo API returned ${response.status}`);
      throw new Error(`Failed to fetch data from Yahoo Finance: ${response.status}`);
    }

    const data = await response.json();
    console.log("Yahoo API response received");

    const chart = data.chart;
    if (!chart || !chart.result || chart.result.length === 0) {
      throw new Error(`No data found for symbol: ${symbol}`);
    }

    const result = chart.result[0];
    const meta = result.meta;
    
    if (!meta) {
      throw new Error("No metadata found");
    }

    const quotes = result.indicators?.quote?.[0];
    const closes = quotes?.close || [];
    const validCloses = closes.filter((c: number) => c !== null && c > 0);
    
    let price = meta.regularMarketPrice || 0;
    let previousClose = meta.previousClose || 0;
    
    if (validCloses.length >= 2) {
      const latestClose = validCloses[validCloses.length - 1];
      const prevClosePrice = validCloses[validCloses.length - 2];
      
      if (prevClosePrice > 0 && latestClose > 0) {
        price = latestClose;
        previousClose = prevClosePrice;
      }
    }
    
    const change = price - previousClose;
    const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

    console.log(`📊 ${symbol} - Price: ${price}, Prev Close: ${previousClose}, Change: ${changePercent.toFixed(2)}%`);

    const rsi = calculateRSI(validCloses, 14);
    console.log(`📊 ${symbol} - RSI(14): ${rsi !== null ? rsi.toFixed(1) : 'N/A'}`);

    const macdData = calculateMACD(validCloses);
    if (macdData) {
      console.log(`📊 ${symbol} - MACD: ${macdData.macd.toFixed(2)}, Signal: ${macdData.signal.toFixed(2)}, Histogram: ${macdData.histogram.toFixed(2)}`);
    }

    // Define dayHigh and dayLow
    const allHighs = quotes?.high || [];
    const allLows = quotes?.low || [];
    const validHighs = allHighs.filter((h: number) => h !== null && h > 0);
    const validLows = allLows.filter((l: number) => l !== null && l > 0);
    
    const dayHigh = validHighs.length > 0 ? Math.max(...validHighs.slice(-5)) : price;
    const dayLow = validLows.length > 0 ? Math.min(...validLows.slice(-5)) : price;

    const volumeNum = meta.regularMarketVolume || (quotes?.volume?.[quotes.volume.length - 1] || 0);
    let volumeDisplay = volumeNum.toString();
    if (volumeNum >= 1000000) {
      volumeDisplay = (volumeNum / 1000000).toFixed(2) + 'M';
    } else if (volumeNum >= 1000) {
      volumeDisplay = (volumeNum / 1000).toFixed(2) + 'K';
    }

    const companyName = meta.longName || meta.shortName || symbol;
    const currency = meta.currency || "USD";
    const marketState = meta.marketState || "CLOSED";

    console.log(`🔍 Fetching fundamental data for ${symbol}...`);
    const avData = await fetchAlphaVantageData(symbol);
    
    let sector = meta.sector || "";
    let industry = meta.industry || "";
    let companyDescription = meta.longBusinessSummary || "";
    let marketCap: number | null = meta.marketCap || null;
    let trailingPE: number | null = meta.trailingPE || null;
    let dividendYield: number | null = meta.trailingAnnualDividendYield ? meta.trailingAnnualDividendYield * 100 : null;
    let roe: number | null = null;
    let beta: number | null = null;
    let fiftyTwoWeekHigh: number | null = null;
    let fiftyTwoWeekLow: number | null = null;
    
    if (avData) {
      console.log("✅ Using Alpha Vantage/fallback data for fundamentals");
      if (avData.sector) sector = avData.sector;
      if (avData.industry) industry = avData.industry;
      if (avData.description) companyDescription = avData.description;
      if (avData.marketCap) marketCap = avData.marketCap;
      if (avData.trailingPE !== null && avData.trailingPE !== undefined) {
        trailingPE = avData.trailingPE;
        console.log(`📊 PE Ratio from fallback: ${trailingPE}`);
      }
      if (avData.roe !== null && avData.roe !== undefined) roe = avData.roe;
      if (avData.beta) beta = avData.beta;
      if (avData.fiftyTwoWeekHigh) fiftyTwoWeekHigh = avData.fiftyTwoWeekHigh;
      if (avData.fiftyTwoWeekLow) fiftyTwoWeekLow = avData.fiftyTwoWeekLow;
    }

    console.log(`📊 Final PE Ratio: ${trailingPE}, ROE: ${roe}, Market Cap: ${marketCap}`);

    const yearHigh = fiftyTwoWeekHigh || meta.fiftyTwoWeekHigh || price * 1.35;
    const yearLow = fiftyTwoWeekLow || meta.fiftyTwoWeekLow || price * 0.65;

    const responseData = {
      symbol: meta.symbol || symbol,
      name: companyName,
      price: price,
      change: parseFloat(changePercent.toFixed(2)),
      previousClose: previousClose,
      dayHigh: dayHigh,
      dayLow: dayLow,
      yearHigh: yearHigh,
      yearLow: yearLow,
      volume: volumeDisplay,
      volumeRaw: volumeNum,
      marketCap: marketCap,
      pe: trailingPE,
      sector: sector || "N/A",
      industry: industry || "N/A",
      currency: currency,
      roe: roe,
      debtToEquity: null,
      dividendYield: dividendYield || 0,
      forwardDividendRate: meta.forwardDividendRate || null,
      exDividendDate: meta.exDividendDate || null,
      operatingCashFlowPerShare: null,
      bid: meta.bid || price * 0.999,
      ask: meta.ask || price * 1.001,
      bidSize: meta.bidSize || 100,
      askSize: meta.askSize || 100,
      dayRange: `${dayLow.toFixed(2)} - ${dayHigh.toFixed(2)}`,
      marketState: marketState,
      companyDescription: companyDescription || "Company description not available.",
      news: [],
      beta: beta,
      rsi: rsi,
      macd: macdData?.macd || 0,
      macdSignal: macdData?.signal || 0,
      macdHistogram: macdData?.histogram || 0,
    };

    console.log("📤 Returning PE:", responseData.pe);

    return new Response(
      JSON.stringify(responseData),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack || "No stack trace available"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});