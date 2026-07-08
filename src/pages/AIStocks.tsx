import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage, type LangKey } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/hooks/useCredits";
import { Search, Star, Shield, Coins, Loader2 } from "lucide-react";
import yearOfHorse from "@/assets/year-of-horse.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import StockDisclaimerModal from "@/components/StockDisclaimerModal";
import InsufficientCreditsModal from "@/components/InsufficientCreditsModal";
import MarketIndices from "@/components/ai-stocks/MarketIndices";
import StockReport, { type ReportData } from "@/components/ai-stocks/StockReport";
import ReportActionBar from "@/components/ai-stocks/ReportActionBar";
import { useStockData, type LiveStockData } from "@/hooks/useStockData";

/* ── Markets ─────────────────────────────────── */
const markets = [
  { key: "us", flag: "🇺🇸", label: { en: "US Market", tc: "美國市場", sc: "美国市场" } },
  { key: "hk", flag: "🇭🇰", label: { en: "HK Market", tc: "香港市場", sc: "香港市场" } },
  { key: "tw", flag: "🇹🇼", label: { en: "Taiwan Market", tc: "台灣市場", sc: "台湾市场" } },
];

/* ── Trilingual labels ───────────────────────── */
const labels = {
  en: {
    title: "AI Stock Analysis",
    langTabs: ["English", "繁體中文", "简体中文"],
    placeholder: "Enter Stock Symbol...",
    prompt: "Enter a stock symbol above and click Analyze to view AI predictions",
    examples: "Examples:",
    exampleTickers: "NVDA, 0700.HK, 2330.TW",
    analyze: "Analyze",
    watchlist: "Go to My Watchlist",
    disclaimer: "Principle of Self-Decision: This is a mathematical AI model for cognitive engagement. It is NOT financial advice.",
    loginRequired: "Please log in to use AI analysis",
    credits: "Credits",
    topUp: "Top Up",
  },
  tc: {
    title: "AI 股票分析",
    langTabs: ["English", "繁體中文", "简体中文"],
    placeholder: "輸入股票代碼...",
    prompt: "在上方輸入股票代碼並點擊「分析」查看 AI 預測",
    examples: "範例：",
    exampleTickers: "NVDA, 0700.HK, 2330.TW",
    analyze: "分析",
    watchlist: "前往我的監察名單",
    disclaimer: "自主決策原則：本網站為數學 AI 模型，用於認知參與，並非財務建議。",
    loginRequired: "請登入以使用 AI 分析",
    credits: "積分",
    topUp: "充值",
  },
  sc: {
    title: "AI 股票分析",
    langTabs: ["English", "繁體中文", "简体中文"],
    placeholder: "输入股票代码...",
    prompt: "在上方输入股票代码并点击「分析」查看 AI 预测",
    examples: "范例：",
    exampleTickers: "NVDA, 0700.HK, 2330.TW",
    analyze: "分析",
    watchlist: "前往我的监察名单",
    disclaimer: "自主决策原则：本网站为数学 AI 模型，用于认知参与，并非财务建议。",
    loginRequired: "请登入以使用 AI 分析",
    credits: "积分",
    topUp: "充值",
  },
};

const langKeys: LangKey[] = ["en", "tc", "sc"];

/* ── Detect market from ticker ────────────────── */
const detectMarket = (ticker: string): string => {
  const upper = ticker.toUpperCase();
  if (upper.endsWith(".HK")) return "hk";
  if (upper.endsWith(".TW")) return "tw";
  return "us";
};

const currencySymbol = (market: string): string => {
  if (market === "hk") return "HK$";
  if (market === "tw") return "NT$";
  return "$";
};

/* ── Per-ticker mock pricing lookup ──────────── */
type TickerInfo = { name: string; price: number; change: number; high: number; low: number; volume: string; buyTarget: number; sellTarget: number; dividend: string; sector?: string; industry?: string; marketCap?: string; peRatio?: string; roe?: string; debtToEquity?: number; cashFlowTrend?: "up" | "stable" | "down"; upcomingDividend?: { amount: string; exDate: string }; description?: string };

const tickerPricing: Record<string, TickerInfo> = {
  // HK stocks
  "0700.HK": { name: "Tencent Holdings", price: 532.00, change: -1.48, high: 618.00, low: 385.50, volume: "18.32M", buyTarget: 580.00, sellTarget: 495.00, dividend: "0.32%", sector: "Technology", industry: "Internet Services", marketCap: "HK$5.12T", peRatio: "22.8x", roe: "18.5%", debtToEquity: 0.45, cashFlowTrend: "up", description: "Tencent Holdings Limited provides value-added services (VAS) and online advertising services in Mainland China, Hong Kong, and internationally. It operates through VAS, Online Advertising, FinTech and Business Services, and Others segments. The company offers online games, social networks, music and video streaming, and literature services; and messaging and social media platforms including WeChat and QQ." },
  "0001.HK": { name: "CK Hutchison Holdings", price: 63.50, change: -0.63, high: 72.80, low: 52.30, volume: "10.25M", buyTarget: 68.00, sellTarget: 58.00, dividend: "5.20%", sector: "Industrials", industry: "Conglomerates", marketCap: "HK$244.1B", peRatio: "6.2x", roe: "4.8%", debtToEquity: 0.82, cashFlowTrend: "stable", description: "CK Hutchison Holdings Limited operates as a multinational conglomerate. The company operates through Ports, Retail, Infrastructure, Energy, Telecommunications, and Finance & Investments segments across over 50 countries." },
  "0200.HK": { name: "Melco International", price: 4.71, change: -0.84, high: 6.38, low: 3.92, volume: "2.15M", buyTarget: 5.20, sellTarget: 4.30, dividend: "0.00%", sector: "Consumer Discretionary", industry: "Casinos & Gaming", marketCap: "HK$7.2B", peRatio: "15.4x", roe: "8.2%", debtToEquity: 2.15, cashFlowTrend: "down", description: "Melco International Development Limited, an investment holding company, engages in the development, ownership, and operation of casino gaming and entertainment casino resort facilities in Asia and Europe." },
  "9988.HK": { name: "Alibaba Group", price: 118.50, change: 1.12, high: 138.00, low: 72.15, volume: "52.67M", buyTarget: 130.00, sellTarget: 108.00, dividend: "0.00%", sector: "Technology", industry: "E-Commerce", marketCap: "HK$2.41T", peRatio: "18.3x", roe: "12.6%", debtToEquity: 0.25, cashFlowTrend: "up", description: "Alibaba Group Holding Limited provides technology infrastructure and marketing reach to help merchants, brands, retailers, and other businesses engage with users and customers. It operates China commerce, international commerce, local consumer services, Cainiao logistics, cloud, digital media and entertainment, and innovation initiatives." },
  "1810.HK": { name: "Xiaomi Corporation", price: 20.85, change: -0.95, high: 28.70, low: 14.68, volume: "38.41M", buyTarget: 23.50, sellTarget: 18.80, dividend: "0.00%", sector: "Technology", industry: "Consumer Electronics", marketCap: "HK$521.3B", peRatio: "28.5x", roe: "14.2%", debtToEquity: 0.55, cashFlowTrend: "up", description: "Xiaomi Corporation engages in the research, development, and sale of smartphones, IoT and lifestyle products, electric vehicles, and internet services. It operates in Mainland China and internationally." },
  "0005.HK": { name: "HSBC Holdings plc", price: 135.70, change: 0.56, high: 148.50, low: 95.20, volume: "12.88M", buyTarget: 145.00, sellTarget: 125.00, dividend: "5.82%", sector: "Financials", industry: "Diversified Banks", marketCap: "HK$2.68T", peRatio: "8.1x", roe: "12.3%", debtToEquity: 1.20, cashFlowTrend: "stable", description: "HSBC Holdings plc provides banking and financial services worldwide. The company operates through Wealth and Personal Banking, Commercial Banking, and Global Banking and Markets segments." },
  "2318.HK": { name: "Ping An Insurance", price: 48.65, change: -0.62, high: 56.80, low: 35.10, volume: "28.33M", buyTarget: 53.00, sellTarget: 44.00, dividend: "4.15%", sector: "Financials", industry: "Insurance", marketCap: "HK$887.5B", peRatio: "7.5x", roe: "15.8%", debtToEquity: 0.90, cashFlowTrend: "up", description: "Ping An Insurance (Group) Company of China, Ltd. provides financial services including insurance, banking, securities, and financial technology services in the People's Republic of China and internationally." },
  "0388.HK": { name: "HKEX", price: 328.40, change: 0.73, high: 385.00, low: 248.60, volume: "5.62M", buyTarget: 360.00, sellTarget: 305.00, dividend: "2.10%", sector: "Financials", industry: "Financial Exchanges", marketCap: "HK$415.6B", peRatio: "35.2x", roe: "22.1%", debtToEquity: 0.15, cashFlowTrend: "up", description: "Hong Kong Exchanges and Clearing Limited (HKEX) operates stock exchanges and futures exchanges and their related clearing houses in Hong Kong. It operates the Stock Exchange of Hong Kong, the Hong Kong Futures Exchange, and the London Metal Exchange." },
  "1928.HK": { name: "Sands China Ltd.", price: 22.35, change: -1.10, high: 28.50, low: 16.80, volume: "15.82M", buyTarget: 25.50, sellTarget: 19.80, dividend: "2.24%", sector: "Consumer Discretionary", industry: "Casinos & Gaming", marketCap: "HK$180.5B", peRatio: "18.7x", roe: "12.8%", debtToEquity: 3.20, cashFlowTrend: "up", upcomingDividend: { amount: "HK$0.50", exDate: "2026-05-20" }, description: "Sands China Ltd. develops, owns, and operates integrated resorts and casinos in Macao. It owns and operates The Venetian Macao, The Londoner Macao, The Parisian Macao resort, The Plaza Macao, and The Sands Macao casino; the Cotai Expo, a convention and exhibition hall; and the Cotai Arena and the Londoner Arena entertainment venues, as well as Cotai Water Jet ferry for leisure and business travelers. It offers ferry transportation and leasing services, and pontoon leasing; gaming and other related activities; travel and tourism agency services; security services; human resources administration services; and mall management services, as well as outsourcing services, including information technology, accounting, hotel management, and marketing. The company was incorporated in 2009 and is headquartered in Taipa, Macau. Sands China Ltd. operates as a subsidiary of Las Vegas Sands Corp." },
  // TW stocks
  "2330.TW": { name: "TSMC", price: 1915.00, change: 0.93, high: 2120.00, low: 1450.00, volume: "32.15M", buyTarget: 2050.00, sellTarget: 1780.00, dividend: "1.52%", sector: "Technology", industry: "Semiconductors", marketCap: "NT$49.6T", peRatio: "28.4x", roe: "26.8%", debtToEquity: 0.30, cashFlowTrend: "up", description: "Taiwan Semiconductor Manufacturing Company Limited manufactures and sells integrated circuits and semiconductors. It is the world's largest dedicated independent semiconductor foundry." },
  "2317.TW": { name: "Hon Hai Precision (Foxconn)", price: 118.50, change: -0.42, high: 142.00, low: 98.00, volume: "18.90M", buyTarget: 128.00, sellTarget: 108.00, dividend: "6.35%", sector: "Technology", industry: "Electronic Manufacturing", marketCap: "NT$1.64T", peRatio: "10.2x", roe: "9.5%", debtToEquity: 0.65, cashFlowTrend: "stable", description: "Hon Hai Precision Industry Co., Ltd. (Foxconn) provides electronics manufacturing services. It manufactures consumer electronics, computing products, and components for major technology companies worldwide." },
  "2454.TW": { name: "MediaTek Inc.", price: 2680.00, change: 1.35, high: 3050.00, low: 1850.00, volume: "8.42M", buyTarget: 2900.00, sellTarget: 2450.00, dividend: "0.85%", sector: "Technology", industry: "Semiconductors", marketCap: "NT$4.27T", peRatio: "24.6x", roe: "21.3%", debtToEquity: 0.20, cashFlowTrend: "up", description: "MediaTek Inc. designs and sells semiconductor products for wireless communications, digital multimedia, and high-definition TV applications. It provides chipsets for smartphones, tablets, smart TVs, and IoT devices." },
  // US stocks
  "IONQ": { name: "IonQ, Inc.", price: 34.11, change: -2.52, high: 84.64, low: 17.88, volume: "21.50M", buyTarget: 42.00, sellTarget: 28.00, dividend: "0.00%", sector: "Technology", industry: "Quantum Computing", marketCap: "$7.85B", peRatio: "N/A", roe: "-15.2%", debtToEquity: 0.12, cashFlowTrend: "down", description: "IonQ, Inc. engages in the development of general-purpose quantum computing systems. The company uses trapped-ion technology to build quantum computers and sells access to its systems through cloud platforms." },
  "NVDA": { name: "NVIDIA Corporation", price: 415.71, change: -3.01, high: 561.21, low: 270.21, volume: "45.08M", buyTarget: 478.07, sellTarget: 365.82, dividend: "0.03%", sector: "Technology", industry: "Semiconductors", marketCap: "$1.02T", peRatio: "62.5x", roe: "44.8%", debtToEquity: 0.41, cashFlowTrend: "up", description: "NVIDIA Corporation provides graphics and compute solutions. It operates through Graphics and Compute & Networking segments, offering GPUs, AI platforms, data center solutions, and automotive computing products." },
  "AAPL": { name: "Apple Inc.", price: 232.50, change: 0.45, high: 260.10, low: 185.30, volume: "58.32M", buyTarget: 250.00, sellTarget: 218.00, dividend: "0.52%", sector: "Technology", industry: "Consumer Electronics", marketCap: "$3.58T", peRatio: "30.2x", roe: "160.9%", debtToEquity: 1.80, cashFlowTrend: "up", description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories. It offers iPhone, Mac, iPad, Apple Watch, AirPods, Apple TV, and related services including the App Store, Apple Music, iCloud, and Apple Pay." },
  "TSLA": { name: "Tesla Inc.", price: 368.20, change: -2.15, high: 488.50, low: 215.60, volume: "72.15M", buyTarget: 420.00, sellTarget: 330.00, dividend: "0.00%", sector: "Consumer Discretionary", industry: "Automobiles", marketCap: "$1.17T", peRatio: "75.8x", roe: "22.4%", debtToEquity: 0.35, cashFlowTrend: "stable", description: "Tesla, Inc. designs, develops, manufactures, and sells electric vehicles, energy generation and storage systems. It operates through Automotive and Energy Generation and Storage segments." },
  "AMZN": { name: "Amazon.com Inc.", price: 225.80, change: 0.82, high: 258.00, low: 178.50, volume: "42.18M", buyTarget: 245.00, sellTarget: 210.00, dividend: "0.00%", sector: "Consumer Discretionary", industry: "E-Commerce", marketCap: "$2.34T", peRatio: "58.3x", roe: "18.2%", debtToEquity: 0.60, cashFlowTrend: "up", description: "Amazon.com, Inc. engages in the retail sale of consumer products, advertising, and subscription services through online and physical stores. It also provides AWS cloud computing, database, and other services." },
  "MSFT": { name: "Microsoft Corporation", price: 438.50, change: -0.38, high: 475.20, low: 365.80, volume: "22.45M", buyTarget: 465.00, sellTarget: 410.00, dividend: "0.72%", sector: "Technology", industry: "Software", marketCap: "$3.26T", peRatio: "35.8x", roe: "38.5%", debtToEquity: 0.35, cashFlowTrend: "up", description: "Microsoft Corporation develops and supports software, services, devices, and solutions. Its products include Office, Windows, Azure cloud platform, LinkedIn, GitHub, Xbox gaming, and AI services including Copilot." },
  "META": { name: "Meta Platforms Inc.", price: 685.30, change: 1.05, high: 740.00, low: 480.50, volume: "15.62M", buyTarget: 720.00, sellTarget: 640.00, dividend: "0.35%", sector: "Communication Services", industry: "Social Media", marketCap: "$1.75T", peRatio: "28.1x", roe: "28.7%", debtToEquity: 0.28, cashFlowTrend: "up", description: "Meta Platforms, Inc. develops products that enable people to connect and share through mobile devices, PCs, virtual reality headsets, and wearables. It operates Facebook, Instagram, Messenger, WhatsApp, and Meta Quest." },
  "GOOGL": { name: "Alphabet Inc.", price: 192.40, change: -0.55, high: 218.00, low: 155.80, volume: "25.30M", buyTarget: 210.00, sellTarget: 178.00, dividend: "0.00%", sector: "Communication Services", industry: "Internet Services", marketCap: "$2.38T", peRatio: "25.4x", roe: "27.6%", debtToEquity: 0.10, cashFlowTrend: "up", description: "Alphabet Inc. offers various products and platforms including Google Search, YouTube, Android, Chrome, Google Cloud, and Waymo autonomous driving technology." },
  "PLTR": { name: "Palantir Technologies", price: 95.50, change: 1.82, high: 125.00, low: 42.00, volume: "35.20M", buyTarget: 110.00, sellTarget: 82.00, dividend: "0.00%", sector: "Technology", industry: "Software — Infrastructure", marketCap: "$220.5B", peRatio: "185.0x", roe: "8.5%", debtToEquity: 0.05, cashFlowTrend: "up", description: "Palantir Technologies Inc. builds and deploys software platforms for the intelligence community, government agencies, and commercial enterprises. Its platforms include Gotham, Foundry, and Apollo." },
  "AMD": { name: "Advanced Micro Devices", price: 118.30, change: -1.45, high: 187.00, low: 95.00, volume: "42.80M", buyTarget: 140.00, sellTarget: 105.00, dividend: "0.00%", sector: "Technology", industry: "Semiconductors", marketCap: "$191.2B", peRatio: "42.1x", roe: "3.2%", debtToEquity: 0.04, cashFlowTrend: "up", description: "Advanced Micro Devices, Inc. designs and sells semiconductors. It offers x86 microprocessors, GPUs, data center and embedded processors, and adaptive SoC products for computing, graphics, and visualization platforms." },
};

/* ── Fallback default pricing per market ─────── */
const defaultMarketPricing: Record<string, TickerInfo> = {
  hk: { name: "", price: 25.60, change: -0.78, high: 32.40, low: 18.50, volume: "8.50M", buyTarget: 28.00, sellTarget: 22.00, dividend: "0.00%" },
  tw: { name: "", price: 350.00, change: 0.45, high: 420.00, low: 280.00, volume: "12.00M", buyTarget: 380.00, sellTarget: 320.00, dividend: "0.00%" },
  us: { name: "", price: 150.00, change: -1.20, high: 195.00, low: 120.00, volume: "30.00M", buyTarget: 170.00, sellTarget: 135.00, dividend: "0.00%" },
};

/* ── Dynamic Executive Thesis generator ──────── */
const generateExecutiveThesis = (
  ticker: string,
  lang: LangKey,
  d: {
    probability: number;
    rsi: number;
    macdStatus: string;
    dividendYield: string;
    buyTarget: string;
    sellTarget: string;
    price: string;
    peRatio: string;
    roe: string;
    sector: string;
  }
): string => {
  const { probability, rsi, macdStatus, dividendYield, buyTarget, sellTarget, price, peRatio, roe, sector } = d;
  const bullish = probability >= 55;
  const bearish = probability <= 40;
  const rsiOversold = rsi < 35;
  const rsiOverbought = rsi > 70;
  const macdBull = macdStatus.toLowerCase().includes("bull") || macdStatus.includes("看漲") || macdStatus.includes("看涨");
  const divNum = parseFloat(dividendYield.replace("%", ""));
  const highDiv = divNum > 4;

  if (lang === "en") {
    const driver = macdBull
      ? `Bullish momentum is underpinned by a favorable MACD crossover, with the signal line confirming upward directional bias.`
      : bearish
        ? `Defensive positioning is warranted as MACD signals suggest weakening momentum and potential trend reversal.`
        : `The current consolidation phase reflects mixed MACD signals, with the histogram narrowing toward the zero line.`;
    const context = rsiOversold
      ? `The RSI reading of ${rsi} places ${ticker} in oversold territory, historically a precursor to mean-reversion rallies in the ${sector} sector.`
      : rsiOverbought
        ? `With RSI at ${rsi}, ${ticker} is approaching overbought conditions; near-term pullbacks would be consistent with profit-taking at elevated valuations (P/E: ${peRatio}).`
        : highDiv
          ? `RSI at ${rsi} suggests neutral technical positioning, while the ${dividendYield} dividend yield provides a meaningful income cushion that enhances risk-adjusted total returns (ROE: ${roe}).`
          : `RSI at ${rsi} indicates a neutral technical stance, with the current P/E of ${peRatio} and ROE of ${roe} reflecting the stock's position within the broader ${sector} valuation matrix.`;
    const outlook = bullish
      ? `Our probability model assigns a ${probability}% upside conviction, with a 12-month target of ${buyTarget}. Sustained capital appreciation requires continued volume confirmation above the ${price} support level and favorable macroeconomic tailwinds.`
      : bearish
        ? `Our model assigns a ${probability}% probability rating, suggesting limited upside to the ${buyTarget} target. Investors should maintain protective stops near ${sellTarget} and await clearer trend confirmation before deploying fresh capital.`
        : `The ${probability}% probability score suggests a balanced risk-reward profile, with upside to ${buyTarget} contingent on sector rotation dynamics and broader market liquidity conditions maintaining support above ${sellTarget}.`;
    return `${driver} ${context} ${outlook}`;
  }
  if (lang === "tc") {
    const driver = macdBull
      ? `看漲動能受到有利的 MACD 交叉支撐，信號線確認了上行方向偏差。`
      : bearish
        ? `MACD 信號顯示動能減弱及潛在趨勢反轉，防禦性持倉配置是合理之舉。`
        : `當前盤整階段反映了混合的 MACD 信號，柱狀圖正在向零線收窄。`;
    const context = rsiOversold
      ? `RSI 讀數為 ${rsi}，${ticker} 處於超賣區域，歷史上這是 ${sector} 板塊均值回歸反彈的前兆。`
      : rsiOverbought
        ? `RSI 達到 ${rsi}，${ticker} 正接近超買狀態；短期回調符合在高估值（市盈率：${peRatio}）水平獲利了結的預期。`
        : highDiv
          ? `RSI 位於 ${rsi} 顯示中性技術定位，而 ${dividendYield} 的股息收益率為風險調整後的總回報提供了有意義的收入緩衝（股本回報率：${roe}）。`
          : `RSI 位於 ${rsi} 表示中性技術立場，目前的市盈率 ${peRatio} 和股本回報率 ${roe} 反映了該股在 ${sector} 板塊估值矩陣中的定位。`;
    const outlook = bullish
      ? `我們的概率模型給出 ${probability}% 的上行信念度，12 個月目標價為 ${buyTarget}。持續的資本增值需要成交量確認高於 ${price} 支撐位，並依賴有利的宏觀經濟順風。`
      : bearish
        ? `模型給出 ${probability}% 的概率評級，暗示上行空間有限至 ${buyTarget} 目標。投資者應在 ${sellTarget} 附近設置保護性止損，並等待更清晰的趨勢確認後再部署新資金。`
        : `${probability}% 的概率評分顯示均衡的風險回報比，上行至 ${buyTarget} 取決於板塊輪動動態及更廣泛的市場流動性條件能否維持在 ${sellTarget} 上方的支撐。`;
    return `${driver} ${context} ${outlook}`;
  }
  // sc
  const driver = macdBull
    ? `看涨动能受到有利的 MACD 交叉支撑，信号线确认了上行方向偏差。`
    : bearish
      ? `MACD 信号显示动能减弱及潜在趋势反转，防御性持仓配置是合理之举。`
      : `当前盘整阶段反映了混合的 MACD 信号，柱状图正在向零线收窄。`;
  const context = rsiOversold
    ? `RSI 读数为 ${rsi}，${ticker} 处于超卖区域，历史上这是 ${sector} 板块均值回归反弹的前兆。`
    : rsiOverbought
      ? `RSI 达到 ${rsi}，${ticker} 正接近超买状态；短期回调符合在高估值（市盈率：${peRatio}）水平获利了结的预期。`
      : highDiv
        ? `RSI 位于 ${rsi} 显示中性技术定位，而 ${dividendYield} 的股息收益率为风险调整后的总回报提供了有意义的收入缓冲（股本回报率：${roe}）。`
        : `RSI 位于 ${rsi} 表示中性技术立场，目前的市盈率 ${peRatio} 和股本回报率 ${roe} 反映了该股在 ${sector} 板块估值矩阵中的定位。`;
  const outlook = bullish
    ? `我们的概率模型给出 ${probability}% 的上行信念度，12 个月目标价为 ${buyTarget}。持续的资本增值需要成交量确认高于 ${price} 支撑位，并依赖有利的宏观经济顺风。`
    : bearish
      ? `模型给出 ${probability}% 的概率评级，暗示上行空间有限至 ${buyTarget} 目标。投资者应在 ${sellTarget} 附近设置保护性止损，并等待更清晰的趋势确认后再部署新资金。`
      : `${probability}% 的概率评分显示均衡的风险回报比，上行至 ${buyTarget} 取决于板块轮动动态及更广泛的市场流动性条件能否维持在 ${sellTarget} 上方的支撑。`;
  return `${driver} ${context} ${outlook}`;
};

/* ── Ticker-specific company risk generator ──── */
const companyRiskDb: Record<string, Record<LangKey, string[]>> = {
  NVDA: {
    en: [
      "AI chip export restrictions — government bans on selling advanced GPUs to certain countries could significantly reduce revenue.",
      "Supply chain disruption — NVIDIA depends on TSMC for chip manufacturing; any production delays would impact delivery timelines.",
      "Semiconductor cyclicality — the chip industry goes through boom-and-bust cycles, meaning demand can drop sharply after periods of high growth.",
    ],
    tc: [
      "AI 晶片出口限制——政府禁止向特定國家出售先進 GPU 可能大幅削減收入。",
      "供應鏈中斷——NVIDIA 依賴台積電製造晶片；任何生產延誤都會影響交付時間。",
      "半導體週期性波動——晶片行業經歷繁榮與衰退的循環，意味著需求可能在高速增長後急劇下降。",
    ],
    sc: [
      "AI 芯片出口限制——政府禁止向特定国家出售先进 GPU 可能大幅削减收入。",
      "供应链中断——NVIDIA 依赖台积电制造芯片；任何生产延误都会影响交付时间。",
      "半导体周期性波动——芯片行业经历繁荣与衰退的循环，意味着需求可能在高速增长后急剧下降。",
    ],
  },
  "0005.HK": {
    en: [
      "Interest rate sensitivity — HSBC's net interest margin (NIM, the difference between what the bank earns on loans and pays on deposits) is highly sensitive to rate changes.",
      "Global geopolitical exposure — operating across Asia, Europe, and the Americas means HSBC faces regulatory and political risks in multiple jurisdictions.",
      "Credit risk in commercial lending — economic downturns could increase loan defaults, especially in emerging markets where HSBC has significant exposure.",
    ],
    tc: [
      "利率敏感性——匯豐的淨利息收益率（NIM，即銀行從貸款中賺取與存款支付的差額）對利率變化高度敏感。",
      "全球地緣政治風險——業務遍佈亞洲、歐洲和美洲意味著匯豐面臨多個司法管轄區的監管和政治風險。",
      "商業貸款信用風險——經濟衰退可能增加貸款違約，尤其是在匯豐有重大曝險的新興市場。",
    ],
    sc: [
      "利率敏感性——汇丰的净利息收益率（NIM，即银行从贷款中赚取与存款支付的差额）对利率变化高度敏感。",
      "全球地缘政治风险——业务遍布亚洲、欧洲和美洲意味着汇丰面临多个司法管辖区的监管和政治风险。",
      "商业贷款信用风险——经济衰退可能增加贷款违约，尤其是在汇丰有重大曝险的新兴市场。",
    ],
  },
  "0700.HK": {
    en: [
      "Regulatory crackdowns — Chinese tech companies face ongoing regulatory scrutiny including antitrust actions and content restrictions.",
      "Gaming revenue dependency — government limits on gaming hours for minors directly impact a major revenue stream.",
      "Geopolitical tensions — US-China relations could lead to investment restrictions or forced divestiture of international assets.",
    ],
    tc: [
      "監管打壓——中國科技公司面臨持續的監管審查，包括反壟斷行動和內容限制。",
      "遊戲收入依賴——政府對未成年人遊戲時間的限制直接影響主要收入來源。",
      "地緣政治緊張——中美關係可能導致投資限制或被迫剝離國際資產。",
    ],
    sc: [
      "监管打压——中国科技公司面临持续的监管审查，包括反垄断行动和内容限制。",
      "游戏收入依赖——政府对未成年人游戏时间的限制直接影响主要收入来源。",
      "地缘政治紧张——中美关系可能导致投资限制或被迫剥离国际资产。",
    ],
  },
  TSLA: {
    en: [
      "Intense EV competition — legacy automakers and Chinese EV brands are rapidly gaining market share, compressing margins.",
      "CEO concentration risk — Tesla's valuation is closely tied to Elon Musk's leadership; any departure or distraction could impact stock price.",
      "Regulatory and recall risks — autonomous driving technology faces evolving regulations and potential liability from accidents.",
    ],
    tc: [
      "電動車競爭激烈——傳統車廠和中國電動車品牌正快速搶佔市場份額，壓縮利潤空間。",
      "CEO 集中風險——特斯拉的估值與馬斯克的領導密切相關；任何離職或分心都可能影響股價。",
      "監管與召回風險——自動駕駛技術面臨不斷變化的法規和事故潛在責任。",
    ],
    sc: [
      "电动车竞争激烈——传统车厂和中国电动车品牌正快速抢占市场份额，压缩利润空间。",
      "CEO 集中风险——特斯拉的估值与马斯克的领导密切相关；任何离职或分心都可能影响股价。",
      "监管与召回风险——自动驾驶技术面临不断变化的法规和事故潜在责任。",
    ],
  },
  "2330.TW": {
    en: [
      "Geopolitical risk — Taiwan's political situation creates uncertainty for the world's largest chipmaker.",
      "Customer concentration — heavy reliance on a few major clients (Apple, NVIDIA) means losing one could significantly impact revenue.",
      "Capital expenditure burden — building cutting-edge fabs requires massive ongoing investment that may not always yield expected returns.",
    ],
    tc: [
      "地緣政治風險——台灣的政治局勢為全球最大晶片製造商帶來不確定性。",
      "客戶集中度——高度依賴少數主要客戶（蘋果、NVIDIA）意味著失去一個客戶可能顯著影響收入。",
      "資本支出壓力——建造尖端晶圓廠需要持續的巨額投資，回報不一定符合預期。",
    ],
    sc: [
      "地缘政治风险——台湾的政治局势为全球最大芯片制造商带来不确定性。",
      "客户集中度——高度依赖少数主要客户（苹果、NVIDIA）意味着失去一个客户可能显著影响收入。",
      "资本支出压力——建造尖端晶圆厂需要持续的巨额投资，回报不一定符合预期。",
    ],
  },
};

const generateCompanyRisks = (ticker: string, lang: LangKey, sector: string, industry: string): string[] => {
  const specific = companyRiskDb[ticker];
  if (specific) return specific[lang];
  // Fallback: generate generic sector/industry risks
  const fallback: Record<LangKey, string[]> = {
    en: [
      `${sector} sector volatility — companies in ${industry} may face rapid changes in demand or technology disruption.`,
      `Competitive pressure — new entrants or existing rivals could erode market share and compress profit margins.`,
      `Regulatory changes — evolving industry regulations could increase compliance costs or restrict business operations.`,
    ],
    tc: [
      `${sector} 板塊波動——${industry} 行業的公司可能面臨需求急變或技術顛覆。`,
      `競爭壓力——新進入者或現有競爭對手可能侵蝕市場份額並壓縮利潤空間。`,
      `監管變化——不斷演變的行業法規可能增加合規成本或限制業務運營。`,
    ],
    sc: [
      `${sector} 板块波动——${industry} 行业的公司可能面临需求急变或技术颠覆。`,
      `竞争压力——新进入者或现有竞争对手可能侵蚀市场份额并压缩利润空间。`,
      `监管变化——不断演变的行业法规可能增加合规成本或限制业务运营。`,
    ],
  };
  return fallback[lang];
};

/* ── Mock report data ────────────────────────── */
const mockReport = (ticker: string, lang: LangKey, liveData?: LiveStockData | null): ReportData => {
  const texts = {
    en: {
      rsiStatus: "Neutral",
      macdStatus: "Bullish",
      recommendation: "Neutral trend observed; caution advised.",
      bullPoints: [
        "Current valuation presents entry opportunity as RSI approaches oversold territory.",
        "Market sentiment improving with early signs of momentum reversal on technical charts.",
        "Volume patterns indicate potential accumulation phase by institutional investors.",
      ],
      bearPoints: [
        "Mixed technical signals warrant caution; wait for clearer directional confirmation.",
        "Sector rotation dynamics could impact relative performance in current market environment.",
        "Economic headwinds including interest rate sensitivity may create volatility.",
      ],
      volatility: "Moderate",
      conservativeAdvice: "Maintain existing positions with tight risk management. Avoid adding new exposure until trend clarifies.",
      valueAdvice: "Wait for clearer value signals. Current price action suggests patience may be rewarded.",
      riskAssessment: {
        market: [
          "Broad market volatility — unexpected events (sometimes called 'black swan events,' meaning rare, unpredictable extreme market shocks) can cause sudden drops across all stocks.",
          "Interest rate changes by central banks can shift investor appetite away from stocks and into bonds.",
          "Global geopolitical tensions (trade wars, sanctions, conflicts) may disrupt markets regardless of individual company performance.",
        ],
        company: [] as string[],
        model: [
          "This model relies on historical price patterns — past trends do not guarantee future outcomes.",
          "Data may be delayed (lagging) — the model cannot account for breaking news or events that haven't been priced in yet.",
          "AI probability scores are mathematical projections, not certainties — actual results may differ significantly from predictions.",
        ],
      },
    },
    tc: {
      rsiStatus: "中性",
      macdStatus: "看漲",
      recommendation: "觀察到中性趨勢；建議謹慎。",
      bullPoints: [
        "RSI 接近超賣區域，當前估值呈現入場機會。",
        "市場情緒改善，技術圖表顯示動能反轉的早期信號。",
        "成交量模式顯示機構投資者可能正在累積倉位。",
      ],
      bearPoints: [
        "技術信號混雜，建議等待更明確的方向確認。",
        "板塊輪動動態可能影響當前市場環境下的相對表現。",
        "包括利率敏感性在內的經濟逆風可能造成波動。",
      ],
      volatility: "中等",
      conservativeAdvice: "維持現有倉位，嚴格風險管理。趨勢明朗前避免新增曝險。",
      valueAdvice: "等待更清晰的價值信號。當前價格走勢顯示耐心可能獲得回報。",
      riskAssessment: {
        market: [
          "大盤波動——無法預測的極端市場意外（俗稱「黑天鵝事件」）可能導致所有股票突然下跌。",
          "央行利率調整可能使投資者將資金從股票轉向債券。",
          "全球地緣政治緊張（貿易戰、制裁、衝突）可能在不論個別公司表現如何的情況下擾亂市場。",
        ],
        company: [] as string[],
        model: [
          "本模型依賴歷史價格模式——過去的趨勢不能保證未來的結果。",
          "數據可能存在滯後——模型無法即時反映尚未被市場消化的突發新聞或事件。",
          "AI 概率評分是數學推算，並非確定結果——實際表現可能與預測存在重大差異。",
        ],
      },
    },
    sc: {
      rsiStatus: "中性",
      macdStatus: "看涨",
      recommendation: "观察到中性趋势；建议谨慎。",
      bullPoints: [
        "RSI 接近超卖区域，当前估值呈现入场机会。",
        "市场情绪改善，技术图表显示动能反转的早期信号。",
        "成交量模式显示机构投资者可能正在累积仓位。",
      ],
      bearPoints: [
        "技术信号混杂，建议等待更明确的方向确认。",
        "板块轮动动态可能影响当前市场环境下的相对表现。",
        "包括利率敏感性在内的经济逆风可能造成波动。",
      ],
      volatility: "中等",
      conservativeAdvice: "维持现有仓位，严格风险管理。趋势明朗前避免新增曝险。",
      valueAdvice: "等待更清晰的价值信号。当前价格走势显示耐心可能获得回报。",
      riskAssessment: {
        market: [
          "大盘波动——无法预测的极端市场意外（俗称\u201C黑天鹅事件\u201D）可能导致所有股票突然下跌。",
          "央行利率调整可能使投资者将资金从股票转向债券。",
          "全球地缘政治紧张（贸易战、制裁、冲突）可能在不论个别公司表现如何的情况下扰乱市场。",
        ],
        company: [] as string[],
        model: [
          "本模型依赖历史价格模式——过去的趋势不能保证未来的结果。",
          "数据可能存在滞后——模型无法即时反映尚未被市场消化的突发新闻或事件。",
          "AI 概率评分是数学推算，并非确定结果——实际表现可能与预测存在重大差异。",
        ],
      },
    },
  };
  const l = texts[lang];
  const market = detectMarket(ticker);
  const upperTicker = ticker.toUpperCase();

  // Merge live data into ticker info, falling back to hardcoded then defaults
  const hardcoded = tickerPricing[upperTicker];
  const fallback = defaultMarketPricing[market] ?? defaultMarketPricing.us;

  let mp: TickerInfo;
  if (liveData && liveData.price > 0) {
    // Build TickerInfo from live FMP data
    const cs = currencySymbol(market);
    const priceVal = liveData.price;
    mp = {
      name: liveData.name || hardcoded?.name || "",
      price: priceVal,
      change: liveData.change ?? hardcoded?.change ?? fallback.change,
      high: liveData.yearHigh ?? hardcoded?.high ?? priceVal * 1.2,
      low: liveData.yearLow ?? hardcoded?.low ?? priceVal * 0.8,
      volume: liveData.volume || hardcoded?.volume || fallback.volume,
      buyTarget: hardcoded?.buyTarget ?? Math.round(priceVal * 1.1 * 100) / 100,
      sellTarget: hardcoded?.sellTarget ?? Math.round(priceVal * 0.9 * 100) / 100,
      dividend: (() => {
        // 1) Use trailing yield if > 0
        if (liveData.dividendYield != null && liveData.dividendYield > 0) {
          return `${liveData.dividendYield.toFixed(2)}%`;
        }
        // 2) Calculate forward yield from declared dividend / current price
        if (liveData.forwardDividendRate && liveData.forwardDividendRate > 0 && liveData.price > 0) {
          const fwdYield = (liveData.forwardDividendRate / liveData.price) * 100;
          return `${fwdYield.toFixed(2)}%`;
        }
        // 3) Check hardcoded forward yield from upcoming dividend
        if (hardcoded?.upcomingDividend && liveData.price > 0) {
          const amt = parseFloat(hardcoded.upcomingDividend.amount.replace(/[^0-9.]/g, ""));
          if (amt > 0) {
            const fwdYield = (amt / liveData.price) * 100;
            return `${fwdYield.toFixed(2)}%`;
          }
        }
        // 4) Hardcoded trailing yield or 0
        return hardcoded?.dividend ?? "0.00%";
      })(),
      sector: liveData.sector || hardcoded?.sector,
      industry: liveData.industry || hardcoded?.industry,
      marketCap: liveData.marketCap || hardcoded?.marketCap,
      peRatio: liveData.pe != null ? `${liveData.pe.toFixed(1)}x` : hardcoded?.peRatio,
      roe: liveData.roe != null ? `${(liveData.roe * 100).toFixed(1)}%` : hardcoded?.roe,
      debtToEquity: liveData.debtToEquity ?? hardcoded?.debtToEquity,
      cashFlowTrend: hardcoded?.cashFlowTrend ?? "stable",
    };
  } else {
    mp = hardcoded ?? fallback;
  }

  const cs = currencySymbol(market);
  const changeUp = mp.change >= 0;
  const probability = 55;
  const rsi = 57;
  const buyTargetStr = `${cs}${mp.buyTarget.toFixed(2)}`;
  const sellTargetStr = `${cs}${mp.sellTarget.toFixed(2)}`;
  const priceStr = `${cs}${mp.price.toFixed(2)}`;

  const executiveThesis = generateExecutiveThesis(ticker, lang, {
    probability,
    rsi,
    macdStatus: l.macdStatus,
    dividendYield: mp.dividend,
    buyTarget: buyTargetStr,
    sellTarget: sellTargetStr,
    price: priceStr,
    peRatio: mp.peRatio ?? "N/A",
    roe: mp.roe ?? "N/A",
    sector: mp.sector ?? "N/A",
  });

  // Generate ticker-specific company risks
  const companyRisks = generateCompanyRisks(upperTicker, lang, mp.sector ?? "", mp.industry ?? "");
  const riskAssessment = {
    ...l.riskAssessment,
    company: companyRisks,
  };

  // Compute Financial Health Score (0-100)
  const debtToEquity = mp.debtToEquity ?? 0.5;
  const cashFlowTrend = mp.cashFlowTrend ?? "stable";
  const peNum = parseFloat((mp.peRatio ?? "20x").replace("x", ""));
  const roeNum = parseFloat((mp.roe ?? "10%").replace("%", ""));
  const isTech = (mp.sector ?? "").includes("Tech") || (mp.sector ?? "").includes("Communication");
  const isFinancial = (mp.sector ?? "").includes("Financial");

  // P/E score (0-25): lower is better, sector-adjusted
  const peThreshold = isTech ? 40 : isFinancial ? 15 : 25;
  const peScore = Math.max(0, Math.min(25, Math.round(25 * (1 - Math.min(peNum / (peThreshold * 2), 1)))));

  // ROE score (0-25): higher is better, capped at 50%
  const roeScore = Math.max(0, Math.min(25, Math.round(25 * Math.min(roeNum / 30, 1))));

  // Debt score (0-25): lower D/E is better
  const debtScore = Math.max(0, Math.min(25, Math.round(25 * (1 - Math.min(debtToEquity / 2, 1)))));

  // Cash flow score (0-25)
  const cfScore = cashFlowTrend === "up" ? 25 : cashFlowTrend === "stable" ? 15 : 5;

  const financialHealthScore = peScore + roeScore + debtScore + cfScore;

  return {
    ticker,
    companyName: mp.name || ticker,
    date: new Date().toISOString().split("T")[0],
    price: priceStr,
    priceChange: `${changeUp ? "+" : ""}${mp.change.toFixed(2)}%`,
    priceUp: changeUp,
    weekHigh: `${cs}${mp.high.toFixed(2)}`,
    weekLow: `${cs}${mp.low.toFixed(2)}`,
    volume: mp.volume,
    rsi,
    rsiStatus: l.rsiStatus,
    macdLine: "1.36",
    signalLine: "1.09",
    histogram: "0.27",
    macdStatus: l.macdStatus,
    probability,
    buyTarget: buyTargetStr,
    sellTarget: sellTargetStr,
    buyPct: 53,
    holdPct: 12,
    sellPct: 35,
    recommendation: l.recommendation,
    bullPoints: l.bullPoints,
    bearPoints: l.bearPoints,
    dividendYield: (() => {
      const divStr = mp.dividend;
      const divNum = parseFloat(divStr.replace("%", ""));
      if (divNum < 0.01) {
        return lang === "en" ? "No Dividends" : lang === "tc" ? "不派息" : "不派息";
      }
      return divStr;
    })(),
    volatility: l.volatility,
    conservativeAdvice: l.conservativeAdvice,
    valueAdvice: l.valueAdvice,
    sentimentScore: 62,
    trendStrength: 58,
    executiveThesis,
    sector: mp.sector ?? "N/A",
    industry: mp.industry ?? "N/A",
    marketCap: mp.marketCap ?? "N/A",
    peRatio: mp.peRatio ?? "N/A",
    roe: mp.roe ?? "N/A",
    riskAssessment,
    financialHealthScore,
    debtToEquity,
    cashFlowTrend,
    // New fields
    bid: liveData?.bid ?? mp.price * 0.9997,
    ask: liveData?.ask ?? mp.price * 1.0003,
    bidSize: liveData?.bidSize ?? 300,
    askSize: liveData?.askSize ?? 400,
    dayRange: liveData?.dayRange ?? `${(mp.price * 0.98).toFixed(2)} - ${(mp.price * 1.02).toFixed(2)}`,
    marketState: liveData?.marketState ?? "CLOSED",
    currencySymbol: cs,
    previousCloseVolume: liveData?.volume ?? mp.volume,
    companyDescription: liveData?.companyDescription || hardcoded?.description || "",
    news: liveData?.news ?? [],
    upcomingDividend: (() => {
      // Check hardcoded first, then live API data
      if (hardcoded?.upcomingDividend) return hardcoded.upcomingDividend;
      if (liveData?.forwardDividendRate && liveData.forwardDividendRate > 0 && liveData?.exDividendDate) {
        const curr = currencySymbol(market);
        return { amount: `${curr}${liveData.forwardDividendRate.toFixed(2)}`, exDate: liveData.exDividendDate };
      }
      return null;
    })(),
  };
};

const AIStocks = () => {
  const { lang, setLang } = useLanguage();
  const t = labels[lang];
  const { user, subscription } = useAuth();
  const { credits, loading: creditsLoading } = useCredits();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeMarket, setActiveMarket] = useState("us");
  const [symbol, setSymbol] = useState("");
  const [report, setReport] = useState<ReportData | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [pendingTicker, setPendingTicker] = useState("");
  const [inWatchlist, setInWatchlist] = useState(false);
  const [activeTicker, setActiveTicker] = useState<string | null>(null);
  const [cachedLiveData, setCachedLiveData] = useState<LiveStockData | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const { fetchStockData } = useStockData();

  const hasAccess = subscription.subscribed || credits > 0 || creditsLoading;

  // Re-generate report when language changes so content stays fully translated
  useEffect(() => {
    if (activeTicker) {
      setReport(mockReport(activeTicker, lang, cachedLiveData));
    }
  }, [lang, activeTicker]);

  // Auto-load report from ?symbol= query param (for shared links)
  useEffect(() => {
    const sym = searchParams.get("symbol");
    if (sym && user && hasAccess && !creditsLoading && !activeTicker) {
      const ticker = sym.toUpperCase();
      setSymbol(ticker);
      setPendingTicker(ticker);
      setActiveMarket(detectMarket(ticker));
      setShowDisclaimer(true);
    }
  }, [searchParams, user, hasAccess, creditsLoading]);

  useEffect(() => {
    if (!report || !user) { setInWatchlist(false); return; }
    supabase
      .from("user_watchlists")
      .select("id")
      .eq("user_id", user.id)
      .eq("symbol", report.ticker)
      .maybeSingle()
      .then(({ data }) => setInWatchlist(!!data));
  }, [report, user]);

  const handleAnalyze = () => {
    if (!symbol.trim()) return;
    let ticker = symbol.trim().toUpperCase();

    // Auto-append market suffix for numeric-only tickers based on active market
    if (/^\d+$/.test(ticker)) {
      if (activeMarket === "hk") ticker = ticker.padStart(4, "0") + ".HK";
      else if (activeMarket === "tw") ticker = ticker + ".TW";
    }

    // Auto-detect market from ticker suffix
    const detectedMkt = detectMarket(ticker);
    if (detectedMkt !== activeMarket) setActiveMarket(detectedMkt);
    setSymbol(ticker);
    if (!user) {
      toast({ title: t.loginRequired, variant: "destructive" });
      navigate(`/auth?returnTo=/ai-stocks?symbol=${encodeURIComponent(ticker)}`);
      return;
    }
    if (!hasAccess) { setShowCreditsModal(true); return; }
    setPendingTicker(ticker);
    setShowDisclaimer(true);
  };

  const handleDisclaimerConfirm = async () => {
    setShowDisclaimer(false);
    setActiveTicker(pendingTicker);
    setIsLoadingQuote(true);

    // Fetch live data from FMP
    let liveData: LiveStockData | null = null;
    try {
      liveData = await fetchStockData(pendingTicker);
      setCachedLiveData(liveData);
    } catch (err) {
      console.warn("Live data fetch failed, using fallback:", err);
    }

    const reportData = mockReport(pendingTicker, lang, liveData);
    setReport(reportData);
    setIsLoadingQuote(false);
    // Update URL with symbol for shareable links
    setSearchParams({ symbol: pendingTicker }, { replace: true });

    // Save to analysis_history for dashboard
    if (user) {
      await supabase.from("analysis_history").insert({
        user_id: user.id,
        report_type: "stock",
        model_used: "AI Stock Engine",
        symbol: pendingTicker,
        status: "completed",
        report_data: reportData as any,
      });
    }
  };

  const handleAddWatchlist = async () => {
    if (!user || !report) return;
    const { error } = await supabase.from("user_watchlists").insert({
      user_id: user.id,
      symbol: report.ticker,
      market: activeMarket,
    });
    if (!error) setInWatchlist(true);
  };

  const handleReset = () => { setReport(null); setSymbol(""); setActiveTicker(null); setSearchParams({}, { replace: true }); };

  return (
    <div className="min-h-screen flex flex-col text-navy" style={{ background: 'linear-gradient(180deg, hsl(42 100% 97%) 0%, hsl(42 60% 95%) 40%, hsl(42 100% 97%) 100%)' }}>
      <Header />

      <StockDisclaimerModal
        open={showDisclaimer}
        onConfirm={handleDisclaimerConfirm}
        onCancel={() => setShowDisclaimer(false)}
      />
      <InsufficientCreditsModal
        open={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
      />

      <main className="flex-1 flex flex-col">
        {/* ── Hero area ──── */}
        <section className="pt-10 pb-6 px-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-navy text-center">{t.title}</h1>

            {/* Horse image + controls side by side */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 justify-center">
              {/* Horse graphic */}
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-2 border-gold/30 shadow-lg shrink-0" style={{ background: 'linear-gradient(135deg, #FFFDF5, #FFF8E1)' }}>
                <img src={yearOfHorse} alt="Year of Horse — Fortune" className="w-full h-full object-cover" />
              </div>

              {/* Right: credits, languages, markets stacked */}
              <div className="flex flex-col items-center sm:items-start gap-4">
                {/* Credits pill + Top Up */}
                {user && (
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm border border-gold/40" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(247,239,138,0.15))' }}>
                      <Coins size={16} className="text-gold" />
                      <span className="font-bold text-navy">{credits}</span>
                      <span className="text-muted-foreground font-semibold">{t.credits}</span>
                    </div>
                    <Link
                      to="/pricing"
                      className="inline-flex items-center gap-1.5 rounded-full btn-gold px-5 py-2 text-sm transition-colors shadow-sm"
                    >
                      ⚡ {t.topUp}
                    </Link>
                  </div>
                )}

                {/* Language toggle */}
                <div className="flex items-center gap-1 text-sm">
                  {langKeys.map((lk, i) => (
                    <span key={lk} className="flex items-center gap-1">
                      {i > 0 && <span className="text-muted-foreground mx-1">|</span>}
                      <button
                        onClick={() => setLang(lk)}
                        className={`transition-colors ${lang === lk ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        {t.langTabs[i]}
                      </button>
                    </span>
                  ))}
                </div>

                {/* Market tabs — single row */}
                <div className="flex gap-2">
                  {markets.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setActiveMarket(m.key)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        activeMarket === m.key
                          ? "bg-gold text-navy shadow-md"
                          : "glass-gold text-muted-foreground hover:text-navy hover:bg-gold-light"
                      }`}
                    >
                      <span className="text-lg">{m.flag}</span>
                      {m.label[lang]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Search bar ────────────────────── */}
        {!report && (
          <section className="max-w-3xl w-full mx-auto px-6 mb-2">
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all border-2 border-[#D4AF37] bg-white focus-within:shadow-[0_0_12px_rgba(212,175,55,0.35)] focus-within:bg-[#FFFDF5]">
              <Search className="text-[#D4AF37] shrink-0" size={22} />
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                placeholder={t.placeholder}
                className="flex-1 bg-transparent text-lg text-navy placeholder:text-muted-foreground outline-none"
              />
            </div>
            <p className="text-muted-foreground text-sm mt-2">
              <span className="font-semibold text-foreground">{t.examples}</span> {t.exampleTickers}
            </p>
          </section>
        )}

        {/* ── Analyze + Watchlist ──────────────── */}
        {!report && (
          <section className="max-w-3xl w-full mx-auto px-6 mb-10">
            <div className="text-center space-y-4 pt-4">
              <button
                onClick={handleAnalyze}
                className="w-full max-w-sm mx-auto block rounded-xl btn-gold py-4 text-lg shadow-lg"
              >
                {t.analyze}
              </button>
              <Link
                to="/watchlist"
                className="inline-flex items-center gap-2 text-gold-dark hover:text-gold transition-colors text-sm border border-gold/30 rounded-full px-5 py-2"
              >
                <Star size={16} className="fill-gold text-gold" /> {t.watchlist}
              </Link>
            </div>
          </section>
        )}

        {/* ── Loading state ──────────────── */}
        {isLoadingQuote && !report && (
          <section className="max-w-3xl w-full mx-auto px-6 mb-12 flex flex-col items-center gap-4 py-20">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p className="text-muted-foreground text-sm">Fetching live market data...</p>
          </section>
        )}

        {/* ── Report ────────────────────────── */}
        {report && (
          <section className="max-w-3xl w-full mx-auto px-6 mb-12 space-y-6">
            <StockReport
              report={report}
              lang={lang}
              inWatchlist={inWatchlist}
              onAddWatchlist={handleAddWatchlist}
            />
            <ReportActionBar lang={lang} ticker={report.ticker} market={activeMarket} onReset={handleReset} inWatchlist={inWatchlist} onAddWatchlist={handleAddWatchlist} />
          </section>
        )}

        {/* ── Disclaimer bar ───────────────── */}
        <div className="max-w-3xl mx-auto px-6 mb-8">
          <div className="rounded-xl gold-card p-3 flex items-start gap-2">
            <Shield className="text-gold shrink-0 mt-0.5" size={16} />
            <p className="text-[11px] text-muted-foreground leading-relaxed">{t.disclaimer}</p>
          </div>
        </div>

        {/* ── Market Indices Dashboard ──────── */}
        {!report && <MarketIndices lang={lang} />}

        
      </main>

      <Footer />
    </div>
  );
};

export default AIStocks;
