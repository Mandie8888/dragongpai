// src/pages/AIStocks.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage, type LangKey } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/hooks/useCredits";
import { Search, Star, Shield, Coins, Loader2, Volume2, VolumeX, Mic, Play, Pause, Square } from "lucide-react";
import yearOfHorse from "@/assets/year-of-horse.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import InsufficientCreditsModal from "@/components/InsufficientCreditsModal";
import MarketIndices from "@/components/ai-stocks/MarketIndices";
import StockReport, { type ReportData } from "@/components/ai-stocks/StockReport";
import ReportActionBar from "@/components/ai-stocks/ReportActionBar";
import { useStockData, type LiveStockData } from "@/hooks/useStockData";
import { speakText, stopSpeaking } from "@/services/voiceService";
import { detectStock } from "@/lib/stockDetector";
// ── Stock Score Display Component ──
const StockScoreDisplay = ({ score, lang }: { score: any; lang: LangKey }) => {
  if (!score) return null;
  
  const isChinese = lang === 'tc' || lang === 'zh-TW' || lang === 'zh-CN';
  const isTraditional = lang === 'tc' || lang === 'zh-TW';
  
  const getChinese = (traditional: string, simplified: string) => {
    return isTraditional ? traditional : simplified;
  };
  
  const categories = [
    { key: 'trend', label: isChinese ? getChinese('趨勢', '趋势') : 'Trend', weight: 20 },
    { key: 'momentum', label: isChinese ? getChinese('動量', '动量') : 'Momentum', weight: 15 },
    { key: 'volume', label: 'Volume', weight: 15 },
    { key: 'valuation', label: isChinese ? getChinese('估值', '估值') : 'Valuation', weight: 15 },
    { key: 'fundamentals', label: isChinese ? getChinese('基本面', '基本面') : 'Fundamentals', weight: 20 },
    { key: 'risk', label: isChinese ? getChinese('風險', '风险') : 'Risk', weight: 5 },
    { key: 'market', label: isChinese ? getChinese('市場/板塊', '市场/板块') : 'Market/Sector', weight: 10 },
  ];

  const getRecommendationColor = (rec: string) => {
    if (rec.includes('BUY')) return '#16A34A';
    if (rec.includes('HOLD')) return '#F59E0B';
    return '#DC2626';
  };

  const getRecommendationBg = (rec: string) => {
    if (rec.includes('BUY')) return '#DCFCE7';
    if (rec.includes('HOLD')) return '#FEF3C7';
    return '#FEE2E2';
  };

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '12px', 
      padding: '20px', 
      marginBottom: '16px', 
      border: '1px solid #E5E7EB',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>📊</span>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
              {isChinese ? getChinese('DragonGpAi 評分引擎', 'DragonGpAi 评分引擎') : 'DragonGpAi Score Engine'}
            </h3>
          </div>
          <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
            {isChinese ? getChinese('綜合評分', '综合评分') : 'Overall Score'}: 
            <span style={{ fontWeight: 'bold', fontSize: '22px', color: '#2563EB', marginLeft: '6px' }}>
              {score.totalScore}
            </span>
            <span style={{ color: '#9CA3AF' }}>/100</span>
          </div>
        </div>
        <div style={{ 
          padding: '6px 16px', 
          borderRadius: '20px', 
          backgroundColor: getRecommendationBg(score.recommendation),
          color: getRecommendationColor(score.recommendation),
          fontWeight: 'bold',
          fontSize: '14px',
          border: `1px solid ${getRecommendationColor(score.recommendation)}`,
        }}>
          {score.recommendation}
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {categories.map(({ key, label, weight }) => {
          const data = score.scores[key];
          if (!data) return null;
          const percentage = Math.min((data.score / weight) * 100, 100);
          
          const barColor = percentage >= 80 ? '#22C55E' : percentage >= 60 ? '#F59E0B' : '#EF4444';
          
          return (
            <div key={key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>
                  <span style={{ marginRight: '4px' }}>{data.emoji}</span>
                  {label}
                  <span style={{ color: '#9CA3AF', fontSize: '11px', marginLeft: '4px' }}>({weight}%)</span>
                </span>
                <span style={{ fontWeight: 'bold' }}>{data.score.toFixed(1)}/{weight}</span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                backgroundColor: '#F3F4F6', 
                borderRadius: '4px', 
                overflow: 'hidden',
                marginTop: '2px'
              }}>
                <div style={{ 
                  width: `${percentage}%`, 
                  height: '100%', 
                  backgroundColor: barColor,
                  borderRadius: '4px',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Level */}
      <div style={{ 
        marginTop: '12px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        backgroundColor: '#F8FAFC',
        borderRadius: '8px',
        fontSize: '12px'
      }}>
        <span style={{ color: '#6B7280' }}>
          {isChinese ? getChinese('⚠️ 風險評級', '⚠️ 风险评级') : '⚠️ Risk Rating'}:
        </span>
        <span style={{ 
          fontWeight: 'bold',
          color: score.riskLevel === 'Low' || score.riskLevel === 'Low-Moderate' ? '#16A34A' :
                 score.riskLevel === 'Moderate' ? '#F59E0B' : '#EF4444'
        }}>
          {score.riskLevel}
        </span>
      </div>

      {/* Explanation */}
      <div style={{ 
        marginTop: '12px', 
        padding: '12px 14px', 
        backgroundColor: '#F0F9FF', 
        borderRadius: '8px',
        border: '1px solid #BAE6FD'
      }}>
        <p style={{ fontSize: '13px', color: '#1E293B', margin: 0, lineHeight: 1.5 }}>
          <strong>{isChinese ? getChinese('💡 分析摘要', '💡 分析摘要') : '💡 Analysis Summary'}:</strong><br />
          {score.explanation}
        </p>
      </div>
    </div>
  );
};
// ── Fallback score generator (when Edge Function fails) ──
const generateFallbackScore = (symbol: string, stockData: any) => {
  const rsi = stockData.rsi || 50;
  const trend = stockData.trend || 'Sideways';
  const macd = stockData.macd || 'Neutral';
  const change = stockData.change || 0;
  const pe = stockData.pe || null;
  const roe = stockData.roe || null;
  
  // Calculate scores based on available data
  let trendScore = trend === 'Uptrend' ? 16 : trend === 'Sideways' ? 10 : 5;
  
  let momentumScore = 0;
  if (rsi >= 30 && rsi <= 50) momentumScore = 12;
  else if (rsi > 50 && rsi <= 70) momentumScore = 9;
  else if (rsi < 30) momentumScore = 10;
  else if (rsi > 70) momentumScore = 3;
  
  if (macd === 'Bullish') momentumScore += 3;
  else if (macd === 'Bearish') momentumScore -= 3;
  momentumScore = Math.max(0, Math.min(15, momentumScore));
  
  const volumeScore = Math.abs(change) > 3 ? 10 : Math.abs(change) > 1 ? 7 : 5;
  
  let valuationScore = 7;
  if (pe && pe > 0) {
    if (pe < 15) valuationScore = 12;
    else if (pe < 30) valuationScore = 8;
    else valuationScore = 4;
  }
  
  let fundamentalScore = 10;
  if (roe && roe > 0) {
    if (roe > 20) fundamentalScore = 16;
    else if (roe > 10) fundamentalScore = 12;
    else fundamentalScore = 6;
  }
  
  const volatility = stockData.volatility || 0.3;
  const riskScore = volatility < 0.25 ? 4.5 : volatility < 0.4 ? 3 : 1.5;
  const marketScore = trend === 'Uptrend' ? 8 : trend === 'Sideways' ? 5 : 3;
  
  const totalScore = Math.round(
    trendScore + momentumScore + volumeScore + valuationScore + fundamentalScore + riskScore + marketScore
  );
  const finalScore = Math.min(100, Math.max(0, totalScore));
  
  let recommendation: 'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG SELL';
  let riskLevel: 'Low' | 'Low-Moderate' | 'Moderate' | 'High' | 'Very High';
  
  if (finalScore >= 80) { recommendation = 'STRONG BUY'; riskLevel = 'Low'; }
  else if (finalScore >= 65) { recommendation = 'BUY'; riskLevel = 'Low-Moderate'; }
  else if (finalScore >= 50) { recommendation = 'HOLD'; riskLevel = 'Moderate'; }
  else if (finalScore >= 35) { recommendation = 'SELL'; riskLevel = 'High'; }
  else { recommendation = 'STRONG SELL'; riskLevel = 'Very High'; }
  
  const getEmoji = (score: number, max: number): '🟢' | '🟡' | '🔴' => {
    const pct = score / max;
    if (pct >= 0.7) return '🟢';
    if (pct >= 0.45) return '🟡';
    return '🔴';
  };
  
  return {
    totalScore: finalScore,
    recommendation,
    riskLevel,
    scores: {
      trend: { score: Math.min(trendScore, 20), maxScore: 20, emoji: getEmoji(trendScore, 20), details: [`Trend: ${trend}`] },
      momentum: { score: Math.min(momentumScore, 15), maxScore: 15, emoji: getEmoji(momentumScore, 15), details: [`RSI: ${rsi.toFixed(1)}, MACD: ${macd}`] },
      volume: { score: Math.min(volumeScore, 15), maxScore: 15, emoji: getEmoji(volumeScore, 15), details: [`Volume: ${Math.abs(change) > 3 ? 'High' : 'Moderate'}`] },
      valuation: { score: Math.min(valuationScore, 15), maxScore: 15, emoji: getEmoji(valuationScore, 15), details: [`PE: ${pe ? pe.toFixed(1) + 'x' : 'N/A'}`] },
      fundamentals: { score: Math.min(fundamentalScore, 20), maxScore: 20, emoji: getEmoji(fundamentalScore, 20), details: [`ROE: ${roe ? (roe * 100).toFixed(1) + '%' : 'N/A'}`] },
      risk: { score: Math.min(riskScore, 5), maxScore: 5, emoji: getEmoji(riskScore, 5), details: [`Risk: ${riskScore >= 3.5 ? 'Low' : 'Moderate'}`] },
      market: { score: Math.min(marketScore, 10), maxScore: 10, emoji: getEmoji(marketScore, 10), details: [`Market: ${trend === 'Uptrend' ? 'Strong' : 'Neutral'}`] }
    },
    explanation: `Score based on RSI ${rsi.toFixed(1)}, Trend ${trend}, MACD ${macd}. ${finalScore >= 65 ? 'Positive outlook with strong signals.' : finalScore >= 50 ? 'Mixed signals, wait for confirmation.' : 'Cautious outlook with weak signals.'}`
  };
};
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
    langTabs: ["English", "廣東話", "國語"],
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
    speakWelcome: "Welcome to DragonGP AI Stock Analysis. Please enter a stock symbol to begin.",
    readAnalysis: "Read Analysis",
    speaking: "Speaking...",
    stop: "Stop",
    play: "Play",
    pause: "Pause",
  },
  tc: {
    title: "AI 股票分析",
    langTabs: ["English", "廣東話", "國語"],
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
    speakWelcome: "歡迎來到 DragonGP AI 股票分析。請輸入股票代碼開始。",
    readAnalysis: "朗讀分析",
    speaking: "朗讀中...",
    stop: "停止",
    play: "播放",
    pause: "暫停",
  },
  sc: {
    title: "AI 股票分析",
    langTabs: ["English", "廣東話", "國語"],
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
    speakWelcome: "欢迎来到 DragonGP AI 股票分析。请输入股票代码开始。",
    readAnalysis: "朗读分析",
    speaking: "朗读中...",
    stop: "停止",
    play: "播放",
    pause: "暂停",
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

/* ── Generate Report from Live Data ──────────── */
const generateReportFromLiveData = (
  ticker: string, 
  lang: LangKey, 
  liveData: LiveStockData
): ReportData => {
  const market = detectMarket(ticker);
  const cs = currencySymbol(market);
  const price = liveData.price;
  const change = liveData.change;
  const changeUp = change >= 0;

  // ============================================================
  // USE REAL RSI FROM THE API
  // ============================================================
  let rsi = 50;
  let rsiStatus = "Neutral";
  
  if (liveData.rsi !== null && liveData.rsi !== undefined && !isNaN(liveData.rsi)) {
    rsi = Math.round(liveData.rsi * 10) / 10;
    console.log(`✅ Using real RSI(14) from API: ${rsi}`);
  } else {
    // Fallback: estimate from price change
    rsi = 50 + (change > 0 ? Math.min(change * 2, 45) : Math.max(change * 2, -45));
    rsi = Math.max(0, Math.min(100, Math.round(rsi * 10) / 10));
    console.log(`⚠️ Using estimated RSI(14): ${rsi}`);
  }

  if (rsi > 70) rsiStatus = lang === "en" ? "Overbought" : lang === "tc" ? "超買" : "超买";
  else if (rsi < 30) rsiStatus = lang === "en" ? "Oversold" : lang === "tc" ? "超賣" : "超卖";
  else rsiStatus = lang === "en" ? "Neutral" : lang === "tc" ? "中性" : "中性";

  // ============================================================
  // USE REAL MACD FROM THE API - FIXED NORMALIZATION
  // ============================================================
  let macdLine = 0;
  let signalLine = 0;
  let histogram = 0;
  let macdStatus = "Neutral";

  if (liveData.macd !== null && liveData.macd !== undefined && 
      liveData.macdSignal !== null && liveData.macdSignal !== undefined &&
      liveData.macdHistogram !== null && liveData.macdHistogram !== undefined) {
    
    // Normalize MACD by dividing by price/100 to get percentage-based values
    const normalizationFactor = price > 0 ? price / 100 : 100;
    
    macdLine = Math.round((liveData.macd / normalizationFactor) * 100) / 100;
    signalLine = Math.round((liveData.macdSignal / normalizationFactor) * 100) / 100;
    histogram = Math.round((liveData.macdHistogram / normalizationFactor) * 100) / 100;
    
    console.log(`✅ Using real MACD from API: ${macdLine}, Signal: ${signalLine}, Histogram: ${histogram}`);
    
    if (histogram > 0.3) {
      macdStatus = lang === "en" ? "Bullish" : lang === "tc" ? "看漲" : "看涨";
    } else if (histogram < -0.3) {
      macdStatus = lang === "en" ? "Bearish" : lang === "tc" ? "看淡" : "看淡";
    } else {
      macdStatus = lang === "en" ? "Neutral" : lang === "tc" ? "中性" : "中性";
    }
  } else {
    // Fallback: estimate from price change
    if (Math.abs(change) > 5) {
      macdStatus = change > 0 ? (lang === "en" ? "Bullish" : lang === "tc" ? "看漲" : "看涨") : (lang === "en" ? "Bearish" : lang === "tc" ? "看淡" : "看淡");
      macdLine = change > 0 ? 1.5 : -1.5;
      signalLine = change > 0 ? 0.8 : -0.8;
      histogram = change > 0 ? 0.7 : -0.7;
    } else if (Math.abs(change) > 2) {
      macdStatus = change > 0 ? (lang === "en" ? "Bullish" : lang === "tc" ? "看漲" : "看涨") : (lang === "en" ? "Bearish" : lang === "tc" ? "看淡" : "看淡");
      macdLine = change > 0 ? 0.8 : -0.8;
      signalLine = change > 0 ? 0.3 : -0.3;
      histogram = change > 0 ? 0.5 : -0.5;
    } else {
      macdStatus = lang === "en" ? "Neutral" : lang === "tc" ? "中性" : "中性";
      macdLine = 0;
      signalLine = 0;
      histogram = 0;
    }
    console.log(`⚠️ Using estimated MACD`);
  }

  // ============================================================
  // FORMAT PE RATIO - FIXED
  // ============================================================
  let peStr = "N/A";
  if (liveData.pe !== null && liveData.pe !== undefined && !isNaN(liveData.pe) && liveData.pe > 0) {
    peStr = `${liveData.pe.toFixed(1)}x`;
    console.log(`✅ Using real PE from API: ${peStr}`);
  } else {
    console.log(`⚠️ PE not available from API, value: ${liveData.pe}`);
  }

  // ============================================================
  // FORMAT ROE - FIXED
  // ============================================================
  let roeStr = "N/A";
  if (liveData.roe !== null && liveData.roe !== undefined && !isNaN(liveData.roe)) {
    roeStr = `${(liveData.roe * 100).toFixed(1)}%`;
    console.log(`✅ Using real ROE from API: ${roeStr}`);
  }

  // ============================================================
  // FORMAT MARKET CAP - FIXED
  // ============================================================
  let marketCapStr = liveData.marketCap || "N/A";

  // Determine volatility
  let volatility = "Moderate";
  if (Math.abs(change) > 8) volatility = lang === "en" ? "High" : lang === "tc" ? "高" : "高";
  else if (Math.abs(change) < 1) volatility = lang === "en" ? "Low" : lang === "tc" ? "低" : "低";

  // Determine recommendation based on RSI
  let recommendation = "Hold";
  if (rsi < 30) {
    recommendation = lang === "en" ? "Buy" : lang === "tc" ? "買入" : "买入";
  } else if (rsi > 70) {
    recommendation = lang === "en" ? "Sell" : lang === "tc" ? "賣出" : "卖出";
  } else if (rsi < 40 && change > 0) {
    recommendation = lang === "en" ? "Buy" : lang === "tc" ? "買入" : "买入";
  } else if (rsi > 60 && change < 0) {
    recommendation = lang === "en" ? "Sell" : lang === "tc" ? "賣出" : "卖出";
  } else {
    recommendation = lang === "en" ? "Hold" : lang === "tc" ? "持有" : "持有";
  }

  // Generate bull/bear points
  const bullPoints = [];
  const bearPoints = [];

  if (change > 0) {
    bullPoints.push(lang === "en" ? `Price up ${change.toFixed(2)}% today, showing positive momentum.` : lang === "tc" ? `價格今日上升 ${change.toFixed(2)}%，顯示正面動能。` : `价格今日上升 ${change.toFixed(2)}%，显示正面动能。`);
  } else if (change < 0) {
    bearPoints.push(lang === "en" ? `Price down ${Math.abs(change).toFixed(2)}% today, showing negative momentum.` : lang === "tc" ? `價格今日下跌 ${Math.abs(change).toFixed(2)}%，顯示負面動能。` : `价格今日下跌 ${Math.abs(change).toFixed(2)}%，显示负面动能。`);
  }

  if (rsi < 30) {
    bullPoints.push(lang === "en" ? `RSI(14) at ${rsi.toFixed(1)} - oversold territory, potential rebound.` : lang === "tc" ? `RSI(14) 處於 ${rsi.toFixed(1)} - 超賣區間，可能反彈。` : `RSI(14) 处于 ${rsi.toFixed(1)} - 超卖区间，可能反弹。`);
  } else if (rsi > 70) {
    bearPoints.push(lang === "en" ? `RSI(14) at ${rsi.toFixed(1)} - overbought territory, potential pullback.` : lang === "tc" ? `RSI(14) 處於 ${rsi.toFixed(1)} - 超買區間，可能回調。` : `RSI(14) 处于 ${rsi.toFixed(1)} - 超买区间，可能回调。`);
  }

  if (bullPoints.length === 0) {
    bullPoints.push(lang === "en" ? "Current market conditions show balanced momentum." : lang === "tc" ? "當前市場條件顯示均衡動能。" : "当前市场条件显示均衡动能。");
  }
  if (bearPoints.length === 0) {
    bearPoints.push(lang === "en" ? "Market conditions warrant cautious monitoring." : lang === "tc" ? "市場條件需要謹慎監測。" : "市场条件需要谨慎监测。");
  }

  // Generate executive thesis
  const executiveThesis = lang === "en"
    ? `Technical Momentum: RSI(14) at ${rsi.toFixed(1)}, ${rsiStatus} territory. Valuation Context: Balanced risk from both sides of the market. Action Signal: ${recommendation}.`
    : lang === "tc"
      ? `技術動能：RSI(14) 處於 ${rsi.toFixed(1)}，${rsiStatus}水平。估值背景：市場兩邊風險均衡。行動信號：${recommendation}。`
      : `技术动能：RSI(14) 处于 ${rsi.toFixed(1)}，${rsiStatus}水平。估值背景：市场两边风险均衡。行动信号：${recommendation}。`;

  // Format dividend yield
  let divStr = "N/A";
  if (liveData.dividendYield !== null && liveData.dividendYield !== undefined && liveData.dividendYield > 0) {
    divStr = `${liveData.dividendYield.toFixed(2)}%`;
  } else {
    divStr = lang === "en" ? "No Dividends" : lang === "tc" ? "不派息" : "不派息";
  }

  // Format volume
  let volumeDisplay = liveData.volume || "N/A";

  // Calculate probability based on RSI
  const probability = Math.min(95, Math.max(5, 50 + (50 - rsi) * 0.8));

  return {
    ticker: ticker,
    companyName: liveData.name || ticker,
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    price: `${cs}${price.toFixed(2)}`,
    priceChange: `${changeUp ? "+" : ""}${change.toFixed(2)}%`,
    priceUp: changeUp,
    weekHigh: `${cs}${(liveData.yearHigh || price * 1.2).toFixed(2)}`,
    weekLow: `${cs}${(liveData.yearLow || price * 0.8).toFixed(2)}`,
    volume: volumeDisplay,
    rsi: rsi,
    rsiStatus: rsiStatus,
    macdLine: macdLine.toFixed(2),
    signalLine: signalLine.toFixed(2),
    histogram: histogram.toFixed(2),
    macdStatus: macdStatus,
    probability: Math.round(probability),
    buyTarget: `${cs}${(price * 1.1).toFixed(2)}`,
    sellTarget: `${cs}${(price * 0.9).toFixed(2)}`,
    buyPct: Math.round(Math.max(0, Math.min(80, 30 + (50 - rsi) * 0.7))),
    holdPct: Math.round(Math.max(0, 20 + Math.abs(50 - rsi) * 0.3)),
    sellPct: Math.round(Math.max(0, Math.min(80, 30 + (rsi - 50) * 0.7))),
    recommendation: recommendation,
    bullPoints: bullPoints,
    bearPoints: bearPoints,
    dividendYield: divStr,
    volatility: volatility,
    conservativeAdvice: lang === "en" ? "Maintain existing positions with tight risk management." : lang === "tc" ? "維持現有倉位，嚴格風險管理。" : "维持现有仓位，严格风险管理。",
    valueAdvice: lang === "en" ? "Wait for clearer value signals before making decisions." : lang === "tc" ? "等待更清晰的價值信號再做決策。" : "等待更清晰的价值信号再做决策。",
    sentimentScore: Math.round(Math.min(95, Math.max(5, 50 + (50 - rsi) * 0.7))),
    trendStrength: Math.round(Math.min(95, Math.max(5, 50 + Math.abs(50 - rsi) * 0.6))),
    executiveThesis: executiveThesis,
    sector: liveData.sector || "N/A",
    industry: liveData.industry || "N/A",
    marketCap: marketCapStr,
    peRatio: peStr,
    roe: roeStr,
    riskAssessment: {
      market: [
        lang === "en" ? "Broad market volatility and geopolitical risks." : lang === "tc" ? "大盤波動及地緣政治風險。" : "大盘波动及地缘政治风险。"
      ],
      company: [
        lang === "en" ? "Company-specific risks including competition and regulatory changes." : lang === "tc" ? "包括競爭和監管變化在內的個股風險。" : "包括竞争和监管变化在内的个股风险。"
      ],
      model: [
        lang === "en" ? "AI models rely on historical data and mathematical projections." : lang === "tc" ? "AI模型依賴歷史數據和數學推算。" : "AI模型依赖历史数据和数学推算。"
      ]
    },
    financialHealthScore: Math.round(Math.min(95, Math.max(5, 50 + (rsi > 50 ? 10 : -10) + (liveData.dividendYield && liveData.dividendYield > 2 ? 10 : 0)))),
    debtToEquity: 0.5,
    cashFlowTrend: "stable" as "up" | "stable" | "down",
    bid: liveData.bid || price * 0.999,
    ask: liveData.ask || price * 1.001,
    bidSize: liveData.bidSize || 100,
    askSize: liveData.askSize || 100,
    dayRange: `${cs}${(liveData.dayLow || price * 0.98).toFixed(2)} — ${cs}${(liveData.dayHigh || price * 1.02).toFixed(2)}`,
    marketState: liveData.marketState || "CLOSED",
    currencySymbol: cs,
    previousCloseVolume: volumeDisplay,
    companyDescription: liveData.companyDescription || "",
    news: liveData.news || [],
    confidenceScore: Math.round(Math.min(95, Math.max(5, 50 + (50 - rsi) * 0.5))),
    trend: macdStatus,
  };
};

// ── Generate Voice Text for Share ──
const generateVoiceTextForShare = (reportData: ReportData, lang: LangKey): string => {
  const isChinese = lang === 'tc' || lang === 'sc';
  const isTraditional = lang === 'tc';
  
  const getChineseTextLocal = (traditional: string, simplified: string) => {
    return isTraditional ? traditional : simplified;
  };

  const getRsiStatusTranslation = (status: string): string => {
    if (!isChinese) return status;
    const chineseStatuses = ['超買', '超买', '超賣', '超卖', '中性'];
    if (chineseStatuses.some(s => status === s || status.includes(s))) {
      return status;
    }
    const statusMap: Record<string, string> = {
      'Overbought': getChineseTextLocal('超買', '超买'),
      'Oversold': getChineseTextLocal('超賣', '超卖'),
      'Neutral': getChineseTextLocal('中性', '中性'),
    };
    return statusMap[status] || status;
  };

  const getMacdStatusTranslation = (status: string): string => {
    if (!isChinese) return status;
    const chineseStatuses = ['看好', '看淡', '中性'];
    if (chineseStatuses.some(s => status === s || status.includes(s))) {
      return status;
    }
    const statusMap: Record<string, string> = {
      'Bullish': getChineseTextLocal('看好', '看好'),
      'Bearish': getChineseTextLocal('看淡', '看淡'),
      'Neutral': getChineseTextLocal('中性', '中性'),
    };
    return statusMap[status] || status;
  };

  const getRecommendationTranslation = (rec: string): string => {
    if (!isChinese) return rec;
    const chineseRecs = ['買入', '买入', '持有', '賣出', '卖出', '強烈買入', '强烈买入', '強烈賣出', '强烈卖出'];
    if (chineseRecs.some(s => rec === s || rec.includes(s))) {
      return rec;
    }
    const recMap: Record<string, string> = {
      'Buy': getChineseTextLocal('買入', '买入'),
      'Hold': getChineseTextLocal('持有', '持有'),
      'Sell': getChineseTextLocal('賣出', '卖出'),
    };
    return recMap[rec] || rec;
  };

  const getSentimentTranslation = (sentiment: string): string => {
    if (!isChinese) return sentiment;
    const sentimentMap: Record<string, string> = {
      'positive': getChineseTextLocal('正面', '正面'),
      'neutral': getChineseTextLocal('中性', '中性'),
      'negative': getChineseTextLocal('負面', '负面'),
    };
    return sentimentMap[sentiment] || sentiment;
  };

  const rsiStatusTranslated = getRsiStatusTranslation(reportData.rsiStatus);
  const macdStatusTranslated = getMacdStatusTranslation(reportData.macdStatus);
  const recommendationTranslated = getRecommendationTranslation(reportData.recommendation);
  
  const sentimentText = reportData.sentimentScore > 60 
    ? getSentimentTranslation('positive')
    : reportData.sentimentScore > 40 
      ? getSentimentTranslation('neutral')
      : getSentimentTranslation('negative');

  const riskLevel = reportData.volatility.includes('High') 
    ? (isChinese ? getChineseTextLocal('高', '高') : 'High')
    : reportData.volatility.includes('Moderate') 
      ? (isChinese ? getChineseTextLocal('中等', '中等') : 'Moderate')
      : (isChinese ? getChineseTextLocal('低', '低') : 'Low');
  
  const riskTier = isChinese 
    ? getChineseTextLocal(reportData.riskTierLabel || '中等', reportData.riskTierLabel || '中等')
    : (reportData.riskTierLabel || 'Moderate');

  const bullText = reportData.bullPoints?.slice(0, 2).join(isChinese ? '；' : '; ') 
    || (isChinese 
      ? getChineseTextLocal('看好因素包括技術面改善和市場情緒向好', '看好因素包括技术面改善和市场情绪向好') 
      : 'Bullish factors include improving technicals and positive market sentiment.');

  const bearText = reportData.bearPoints?.slice(0, 2).join(isChinese ? '；' : '; ') 
    || (isChinese 
      ? getChineseTextLocal('看淡因素包括宏觀不確定性和行業競爭加劇', '看淡因素包括宏观不确定性和行业竞争加剧') 
      : 'Bearish factors include macro uncertainty and increasing competition.');

  const selfDecisionText = isChinese
    ? getChineseTextLocal('自主決策原則', '自主决策原则')
    : 'Principle of Self-Decision';

  const parts: string[] = [];

  // 1. Summary
  parts.push(isChinese
    ? `摘要：${reportData.companyName || reportData.ticker} 目前價格 ${reportData.price}，${reportData.priceUp ? '上漲' : '下跌'} ${reportData.priceChange}。AI 預測概率 ${reportData.probability}%，建議 ${recommendationTranslated}。`
    : `Summary: ${reportData.companyName || reportData.ticker} is currently trading at ${reportData.price}, ${reportData.priceUp ? 'up' : 'down'} ${reportData.priceChange}. AI probability is ${reportData.probability}% with a ${reportData.recommendation} recommendation.`
  );

  // 2. Technical Analysis
  parts.push(isChinese
    ? `技術分析：RSI 指標為 ${reportData.rsi.toFixed(1)}，${rsiStatusTranslated}。MACD 顯示 ${macdStatusTranslated} 信號。`
    : `Technical Analysis: RSI is ${reportData.rsi.toFixed(1)}, indicating ${reportData.rsiStatus}. MACD shows a ${reportData.macdStatus} signal.`
  );

  // 3. Fundamental Analysis
  parts.push(isChinese
    ? `基本面分析：市值 ${reportData.marketCap}，市盈率 ${reportData.peRatio}，股本回報率 ${reportData.roe}%。`
    : `Fundamental Analysis: Market cap is ${reportData.marketCap} with a P/E ratio of ${reportData.peRatio} and ROE of ${reportData.roe}%.`
  );

  // 4. News Sentiment
  parts.push(isChinese
    ? `新聞情緒：整體情緒為 ${sentimentText}，信心指數 ${reportData.sentimentScore}%。`
    : `News Sentiment: Overall sentiment is ${sentimentText} with a confidence score of ${reportData.sentimentScore}%.`
  );

  // 5. Risk Analysis
  parts.push(isChinese
    ? `風險分析：波動率 ${riskLevel}，風險等級 ${riskTier}。`
    : `Risk Analysis: Volatility is ${riskLevel} with a ${riskTier} risk tier.`
  );

  // 6. Bull Case
  parts.push(isChinese
    ? `看好因素：${bullText}`
    : `Bull Case: ${bullText}`
  );

  // 7. Bear Case
  parts.push(isChinese
    ? `看淡因素：${bearText}`
    : `Bear Case: ${bearText}`
  );

  // 8. Final Recommendation
  parts.push(isChinese
    ? `最終建議：${recommendationTranslated}。目標價 ${reportData.buyTarget}，止蝕位 ${reportData.sellTarget}。${selfDecisionText}`
    : `Final Recommendation: ${reportData.recommendation}. Target price is ${reportData.buyTarget} with stop loss at ${reportData.sellTarget}. ${selfDecisionText}`
  );

  // Disclaimer
  const disclaimer = isChinese
    ? '免責聲明：此分析由 DragonGPAI.com 生成，僅供參考。股票選擇遵循自主決策原則。'
    : 'Disclaimer: This analysis is generated by DragonGPAI.com for reference only. Stock selection follows the principle of self-decision.';

  return parts.join(isChinese ? '。 ' : '. ') + (isChinese ? '。 ' : '. ') + disclaimer;
};

// === MAIN COMPONENT ===
const AIStocks = () => {
  const { lang, setLang } = useLanguage();
  const t = labels[lang];
  const { user, subscription } = useAuth();
  const { credits, loading: creditsLoading, deductCredits, refresh: refreshCredits } = useCredits();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeMarket, setActiveMarket] = useState("us");
  const [symbol, setSymbol] = useState("");
  const [report, setReport] = useState<ReportData | null>(null);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [pendingTicker, setPendingTicker] = useState("");
  const [inWatchlist, setInWatchlist] = useState(false);
  const [activeTicker, setActiveTicker] = useState<string | null>(null);
  const [cachedLiveData, setCachedLiveData] = useState<LiveStockData | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { fetchStockData } = useStockData();

  const hasAccess = subscription.subscribed || credits > 0 || creditsLoading;

  // Get voice language based on UI language
  const getVoiceLang = (): 'en-US' | 'zh-HK' | 'zh-CN' => {
    if (lang === 'tc') return 'zh-HK';
    if (lang === 'sc') return 'zh-CN';
    return 'en-US';
  };

  // Generate analysis text for voice
  const generateAnalysisText = (reportData: ReportData): string => {
    const isChinese = lang === 'tc' || lang === 'sc';
    const companyName = reportData.companyName || reportData.ticker;
    
    let text = '';
    if (isChinese) {
      text = `${companyName} (${reportData.ticker}) 投資分析\n\n`;
      text += `1. 摘要\n目前股價: ${reportData.price}, 日漲跌幅: ${reportData.priceChange}\n`;
      text += `日內波幅: ${reportData.weekLow} - ${reportData.weekHigh}\n`;
      text += `RSI(14): ${reportData.rsi} (${reportData.rsiStatus}). 整體趨勢: ${reportData.macdStatus}\n\n`;
      text += `2. 技術分析\nRSI(14): ${reportData.rsi} - ${reportData.rsiStatus === '超賣' ? '超賣區間，可能出現反彈' : reportData.rsiStatus === '超買' ? '超買區間，短期可能回調' : '中性區間，動能平衡'}\n`;
      text += `MACD: ${reportData.macdStatus}\n`;
      text += `趨勢: ${reportData.macdStatus === '看漲' ? '上升通道' : '下降通道'}\n`;
      text += `波動率: ${reportData.volatility === 'High' ? '高' : reportData.volatility === 'Low' ? '低' : '中等'}\n\n`;
      text += `3. 基本面分析\n市值: ${reportData.marketCap} | 市盈率: ${reportData.peRatio} | 股本回報率: ${reportData.roe}\n\n`;
      text += `4. 看好因素\n`;
      reportData.bullPoints.forEach(point => {
        text += `• ${point}\n`;
      });
      text += `\n5. 看淡因素\n`;
      reportData.bearPoints.forEach(point => {
        text += `• ${point}\n`;
      });
      text += `\n6. 買賣建議\n目標價: ${reportData.buyTarget}\n止蝕位: ${reportData.sellTarget}\n\n`;
      text += `7. 最終建議\n${reportData.recommendation}\n`;
      text += `風險評級: ${reportData.volatility === 'High' ? '高風險' : reportData.volatility === 'Low' ? '低風險' : '中等風險'}\n`;
      text += `信心評分: ${reportData.confidenceScore || 50}%\n\n`;
      text += `⚠️ 以上分析僅供參考，不構成投資建議。`;
    } else {
      text = `${companyName} (${reportData.ticker}) Investment Analysis\n\n`;
      text += `1. Summary\nCurrent Price: ${reportData.price}, Daily Change: ${reportData.priceChange}\n`;
      text += `Day Range: ${reportData.weekLow} - ${reportData.weekHigh}\n`;
      text += `RSI(14): ${reportData.rsi} (${reportData.rsiStatus}). Overall Trend: ${reportData.macdStatus}\n\n`;
      text += `2. Technical Analysis\nRSI(14): ${reportData.rsi} - ${reportData.rsiStatus}\n`;
      text += `MACD: ${reportData.macdStatus}\n`;
      text += `Trend: ${reportData.macdStatus === 'Bullish' ? 'Uptrend' : 'Downtrend'}\n`;
      text += `Volatility: ${reportData.volatility}\n\n`;
      text += `3. Fundamental Analysis\nMarket Cap: ${reportData.marketCap} | P/E: ${reportData.peRatio} | ROE: ${reportData.roe}\n\n`;
      text += `4. Bullish Factors\n`;
      reportData.bullPoints.forEach(point => {
        text += `• ${point}\n`;
      });
      text += `\n5. Bearish Factors\n`;
      reportData.bearPoints.forEach(point => {
        text += `• ${point}\n`;
      });
      text += `\n6. Trading Advice\nTarget Price: ${reportData.buyTarget}\nStop Loss: ${reportData.sellTarget}\n\n`;
      text += `7. Final Recommendation\n${reportData.recommendation}\n`;
      text += `Risk Rating: ${reportData.volatility}\n`;
      text += `Confidence Score: ${reportData.confidenceScore || 50}%\n\n`;
      text += `⚠️ This analysis is for reference only and does not constitute investment advice.`;
    }
    return text;
  };

  // Speak analysis
  const speakAnalysis = () => {
    if (!report) return;
    
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      setIsPaused(false);
      return;
    }
    
    const text = generateAnalysisText(report);
    setIsSpeaking(true);
    setIsPaused(false);
    speakText(text, getVoiceLang());
    
    const checkSpeechEnd = setInterval(() => {
      if (!window.speechSynthesis || !window.speechSynthesis.speaking) {
        setIsSpeaking(false);
        setIsPaused(false);
        clearInterval(checkSpeechEnd);
      }
    }, 500);
  };

  // Speak welcome message
  const speakWelcome = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      setIsPaused(false);
      return;
    }

    setIsSpeaking(true);
    speakText(t.speakWelcome, getVoiceLang());
    
    const checkSpeechEnd = setInterval(() => {
      if (!window.speechSynthesis || !window.speechSynthesis.speaking) {
        setIsSpeaking(false);
        clearInterval(checkSpeechEnd);
      }
    }, 500);
  };

  // Auto-speak welcome when page loads (only once)
  useEffect(() => {
    const hasSpoken = sessionStorage.getItem('welcomeSpoken');
    if (!hasSpoken && !report) {
      setTimeout(() => {
        speakWelcome();
        sessionStorage.setItem('welcomeSpoken', 'true');
      }, 1000);
    }
  }, []);

  // Pause/resume speech
  const togglePause = () => {
    if (!isSpeaking) return;
    
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  // Re-generate report when language changes
  useEffect(() => {
    if (activeTicker && cachedLiveData) {
      setReport(generateReportFromLiveData(activeTicker, lang, cachedLiveData));
    }
  }, [lang, activeTicker, cachedLiveData]);

  // Auto-load report from ?symbol= query param
  useEffect(() => {
    const sym = searchParams.get("symbol");
    if (sym && user && hasAccess && !creditsLoading && !activeTicker) {
      const ticker = sym.toUpperCase();
      setSymbol(ticker);
      setPendingTicker(ticker);
      setActiveMarket(detectMarket(ticker));
      handleLoadReport(ticker);
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

  // Voice input handling
  const handleVoiceInput = (text: string) => {
    const detectedSymbol = detectStock(text);
    if (detectedSymbol) {
      setSymbol(detectedSymbol);
      setTimeout(() => {
        const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
        handleAnalyze(fakeEvent);
      }, 500);
    } else {
      setSymbol(text.trim());
    }
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) return;
    let ticker = symbol.trim().toUpperCase();

    if (/^\d+$/.test(ticker)) {
      if (activeMarket === "hk") ticker = ticker.padStart(4, "0") + ".HK";
      else if (activeMarket === "tw") ticker = ticker + ".TW";
    }

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
    handleLoadReport(ticker);
  };

 // Replace the handleLoadReport function (around line 680-720)
const handleLoadReport = async (ticker: string) => {
  setActiveTicker(ticker);
  setIsLoadingQuote(true);

  // 1. Deduct credits using the same method as AIGames
  if (!subscription.subscribed && user) {
    const { error } = await supabase.rpc("deduct_credit", { p_report_type: "stock" });
    if (error) {
      console.error("Credit deduction failed:", error.message);
      toast({ 
        title: "Error", 
        description: "Failed to deduct credit. Please try again.", 
        variant: "destructive" 
      });
      setIsLoadingQuote(false);
      return;
    }
  }

  // 2. Fetch live data & build report
  try {
    const liveData = await fetchStockData(ticker);
    if (liveData) {
      setCachedLiveData(liveData);
      const reportData = generateReportFromLiveData(ticker, lang, liveData);
      // ⭐ Fetch stock score using direct fetch with anon key
      try {
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const response = await fetch('https://htksnwkjvnpdyhjdadgw.supabase.co/functions/v1/stock-score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`,
          },
          body: JSON.stringify({ 
            symbol: ticker,
            stockData: liveData,
            language: lang
          }),
        });
        
        if (response.ok) {
          const scoreData = await response.json();
          if (scoreData.success && scoreData.stockScore) {
            reportData.stockScore = scoreData.stockScore;
            console.log('✅ Stock score loaded from Edge Function:', scoreData.stockScore.totalScore);
          }
        } else {
          console.warn('Stock score API returned status:', response.status);
          // Use fallback score
          const fallbackScore = generateFallbackScore(ticker, liveData);
          reportData.stockScore = fallbackScore;
          console.log('📊 Using fallback score:', fallbackScore.totalScore);
        }
      } catch (scoreError) {
        console.warn('Stock score not available, using fallback:', scoreError);
        // Use fallback score
        const fallbackScore = generateFallbackScore(ticker, liveData);
        reportData.stockScore = fallbackScore;
        console.log('📊 Using fallback score:', fallbackScore.totalScore);
      }
      
      setReport(reportData);
      setSearchParams({ symbol: ticker }, { replace: true });

      if (user) {
        await supabase.from("analysis_history").insert({
          user_id: user.id,
          report_type: "stock",
          model_used: "AI Stock Engine",
          symbol: ticker,
          status: "completed",
          report_data: reportData as any,
        });
      }
    } else {
      toast({ title: "Failed to fetch stock data", variant: "destructive" });
    }
  } catch (err) {
    console.warn("Live data fetch failed:", err);
    toast({ title: "Failed to fetch stock data", variant: "destructive" });
  } finally {
    setIsLoadingQuote(false);
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

  const handleReset = () => { 
    setReport(null); 
    setSymbol(""); 
    setActiveTicker(null); 
    setCachedLiveData(null);
    setSearchParams({}, { replace: true });
    stopSpeaking();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <div className="min-h-screen flex flex-col text-navy" style={{ background: 'linear-gradient(180deg, hsl(42 100% 97%) 0%, hsl(42 60% 95%) 40%, hsl(42 100% 97%) 100%)' }}>
      <Header />

      <InsufficientCreditsModal
        open={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
      />

      <main className="flex-1 flex flex-col">
        {/* ── Hero area ──── */}
        <section className="pt-10 pb-6 px-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-navy text-center">{t.title}</h1>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 justify-center">
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-2 border-gold/30 shadow-lg shrink-0" style={{ background: 'linear-gradient(135deg, #FFFDF5, #FFF8E1)' }}>
                <img src={yearOfHorse} alt="Year of Horse — Fortune" className="w-full h-full object-cover" />
              </div>

              <div className="flex flex-col items-center sm:items-start gap-4">
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

                <div className="flex items-center gap-2 text-sm">
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
                  
                  <button
                    onClick={speakWelcome}
                    className="ml-2 p-1.5 rounded-full hover:bg-gold/20 transition-colors border border-gold/20"
                    title={isSpeaking ? "Stop speaking" : "Read welcome message"}
                  >
                    {isSpeaking ? (
                      <VolumeX className="h-4 w-4 text-red-500" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-gold" />
                    )}
                  </button>
                </div>

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
            <form onSubmit={handleAnalyze} className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all border-2 border-[#D4AF37] bg-white focus-within:shadow-[0_0_12px_rgba(212,175,55,0.35)] focus-within:bg-[#FFFDF5]">
              <Search className="text-[#D4AF37] shrink-0" size={22} />
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze(e)}
                placeholder={t.placeholder}
                className="flex-1 bg-transparent text-lg text-navy placeholder:text-muted-foreground outline-none"
              />
            </form>
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
    <div className="flex flex-wrap items-center gap-2 p-3 bg-gold/10 rounded-lg border border-gold/20">
      <span className="text-xs text-muted-foreground mr-1">🔊 {t.readAnalysis}:</span>
      
      <button
        onClick={() => {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (!SpeechRecognition) {
            toast({ title: "Speech recognition not supported in this browser", variant: "destructive" });
            return;
          }
          const recognition = new SpeechRecognition();
          recognition.lang = getVoiceLang();
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
              .map((result: any) => result[0])
              .map((result: any) => result.transcript)
              .join("");
            if (event.results[0].isFinal) {
              handleVoiceInput(transcript);
            }
          };
          recognition.start();
          toast({ title: "Listening... Speak the stock symbol", duration: 3000 });
        }}
        className="h-8 w-8 flex items-center justify-center rounded-md border border-gold/30 hover:bg-gold/20 transition-colors"
        title="Voice input"
      >
        <Mic className="h-3.5 w-3.5" />
      </button>
      
      <button
        onClick={speakAnalysis}
        className="h-8 w-8 flex items-center justify-center rounded-md border border-gold/30 hover:bg-gold/20 transition-colors"
        title={isSpeaking ? "Stop speaking" : "Read analysis"}
      >
        {isSpeaking ? <VolumeX className="h-3.5 w-3.5 text-red-500" /> : <Volume2 className="h-3.5 w-3.5" />}
      </button>
      
      <button
        onClick={togglePause}
        disabled={!isSpeaking}
        className="h-8 w-8 flex items-center justify-center rounded-md border border-gold/30 hover:bg-gold/20 transition-colors disabled:opacity-50"
        title={isPaused ? "Resume" : "Pause"}
      >
        {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
      </button>
      
      <button
        onClick={() => {
          stopSpeaking();
          setIsSpeaking(false);
          setIsPaused(false);
        }}
        disabled={!isSpeaking}
        className="h-8 w-8 flex items-center justify-center rounded-md border border-gold/30 hover:bg-gold/20 transition-colors disabled:opacity-50"
        title="Stop"
      >
        <Square className="h-3.5 w-3.5" />
      </button>
      
      <span className="text-xs text-muted-foreground ml-1">
        {isSpeaking ? (isPaused ? `⏸ ${t.pause}` : `🔊 ${t.speaking}`) : `🔇 ${t.readAnalysis}`}
      </span>
      <span className="text-xs text-muted-foreground ml-2 border-l border-muted pl-2">
        {lang === 'tc' ? '廣東話' : lang === 'sc' ? '國語' : 'English'}
      </span>
    </div>

    {/* ⭐ STOCK SCORE DISPLAY - ADD THIS HERE */}
    {report.stockScore && (
      <StockScoreDisplay score={report.stockScore} lang={lang} />
    )}

    <StockReport
      report={report}
      lang={lang}
      inWatchlist={inWatchlist}
      onAddWatchlist={handleAddWatchlist}
      onSpeakAnalysis={speakAnalysis}
      isSpeaking={isSpeaking}
    />
    
    <ReportActionBar 
      lang={lang} 
      ticker={report.ticker} 
      market={activeMarket} 
      onReset={handleReset} 
      inWatchlist={inWatchlist} 
      onAddWatchlist={handleAddWatchlist}
      voiceText={generateVoiceTextForShare(report, lang)}
      companyName={report.companyName || ''}
      price={report.price || ''}
      priceChange={report.priceChange || ''}
      probability={report.probability || 0}
      recommendation={report.recommendation || ''}
      rsi={report.rsi || 0}
      rsiStatus={report.rsiStatus || ''}
    />
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