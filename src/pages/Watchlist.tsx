import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useStockData } from "@/hooks/useStockData";
import { useToast } from "@/hooks/use-toast";
import { 
  Star, Trash2, Loader2, Circle, 
  ChevronRight, Zap, ArrowRight, Plus 
} from "lucide-react";

const labels = {
  en: {
    title: "My Watchlist",
    empty: "Your watchlist is empty. Analyze a stock and add it!",
    loginRequired: "Please log in to view your watchlist.",
    login: "Log In",
    goAnalyze: "Go to AI Stocks",
    usd: "USD",
    twd: "TWD",
    rsiOversold: "RSI <30 (Oversold) → Buy",
    rsiOverbought: "RSI >70 (Overbought) → Sell",
    rsiNeutral: "RSI 30-70 (Neutral) → Hold",
    macdBullish: "MACD ↑ Bullish",
    macdBearish: "MACD ↓ Bearish",
    analyze: "Analyze",
    strongBuy: "Strong Buy",
    buy: "Buy",
    strongSell: "Strong Sell",
    sell: "Sell",
    caution: "Caution",
    neutral: "Neutral",
    oversold: "Oversold",
    overbought: "Overbought",
    remove: "Remove",
    loadingData: "Loading stock data...",
    failedToFetch: "Failed to fetch stock data",
    pleaseTryAgain: "Please try again later",
  },
  tc: {
    title: "我的自選清單",
    empty: "您的自選清單為空。分析股票後可添加！",
    loginRequired: "請登入以查看您的自選清單。",
    login: "登入",
    goAnalyze: "前往 AI 股票",
    usd: "美元",
    twd: "台幣",
    rsiOversold: "RSI <30（超賣）→ 買入",
    rsiOverbought: "RSI >70（超買）→ 賣出",
    rsiNeutral: "RSI 30-70（中性）→ 持有",
    macdBullish: "MACD ↑ 看好",
    macdBearish: "MACD ↓ 看淡",
    analyze: "分析",
    strongBuy: "強烈買入",
    buy: "買入",
    strongSell: "強烈賣出",
    sell: "賣出",
    caution: "謹慎",
    neutral: "中性",
    oversold: "超賣",
    overbought: "超買",
    remove: "移除",
    loadingData: "載入股票數據中...",
    failedToFetch: "獲取股票數據失敗",
    pleaseTryAgain: "請稍後再試",
  },
  sc: {
    title: "我的自选清单",
    empty: "您的自选清单为空。分析股票后可添加！",
    loginRequired: "请登入以查看您的自选清单。",
    login: "登入",
    goAnalyze: "前往 AI 股票",
    usd: "美元",
    twd: "台币",
    rsiOversold: "RSI <30（超卖）→ 买入",
    rsiOverbought: "RSI >70（超买）→ 卖出",
    rsiNeutral: "RSI 30-70（中性）→ 持有",
    macdBullish: "MACD ↑ 看好",
    macdBearish: "MACD ↓ 看淡",
    analyze: "分析",
    strongBuy: "强烈买入",
    buy: "买入",
    strongSell: "强烈卖出",
    sell: "卖出",
    caution: "谨慎",
    neutral: "中性",
    oversold: "超卖",
    overbought: "超买",
    remove: "移除",
    loadingData: "载入股票数据中...",
    failedToFetch: "获取股票数据失败",
    pleaseTryAgain: "请稍后再试",
  },
};

interface WatchlistItem {
  id: string;
  symbol: string;
  market: string;
  added_at: string;
}

interface EnhancedStockData {
  symbol: string;
  name: string;
  price: number;
  priceChange: string;
  priceUp: boolean;
  rsi: number;
  rsiStatus: string;
  macdStatus: string;
  probability: number;
  recommendation: string;
  market: string;
  loading: boolean;
  error?: string;
}

const Watchlist = () => {
  const { lang } = useLanguage();
  const t = labels[lang];
  const { user } = useAuth();
  const { toast } = useToast();
  const { fetchStockData } = useStockData();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [enhancedData, setEnhancedData] = useState<Record<string, EnhancedStockData>>({});
  const [loading, setLoading] = useState(true);
  const [fetchingData, setFetchingData] = useState(false);

  const fetchWatchlist = async () => {
    if (!user) { 
      setLoading(false); 
      return; 
    }
    
    try {
      const { data, error } = await supabase
        .from("user_watchlists")
        .select("*")
        .order("added_at", { ascending: false });
      
      if (error) throw error;
      
      const watchlistData = (data as WatchlistItem[]) || [];
      setItems(watchlistData);
      setLoading(false);
      
      if (watchlistData.length > 0) {
        setFetchingData(true);
        const results: Record<string, EnhancedStockData> = {};
        
        for (const item of watchlistData) {
          try {
            const liveData = await fetchStockData(item.symbol);
            
            if (liveData) {
              let rsi = 50;
              let rsiStatus = "Neutral";
              
              if (liveData.rsi !== null && liveData.rsi !== undefined && !isNaN(liveData.rsi)) {
                rsi = Math.round(liveData.rsi * 10) / 10;
              } else {
                const change = liveData.change || 0;
                rsi = 50 + (change > 0 ? Math.min(change * 2, 45) : Math.max(change * 2, -45));
                rsi = Math.max(0, Math.min(100, Math.round(rsi * 10) / 10));
              }

              if (rsi > 70) rsiStatus = "Overbought";
              else if (rsi < 30) rsiStatus = "Oversold";
              else rsiStatus = "Neutral";

              let macdStatus = "Neutral";
              if (liveData.macdHistogram !== null && liveData.macdHistogram !== undefined) {
                const hist = liveData.macdHistogram;
                if (hist > 0.3) macdStatus = "Bullish";
                else if (hist < -0.3) macdStatus = "Bearish";
                else macdStatus = "Neutral";
              } else {
                const change = liveData.change || 0;
                if (Math.abs(change) > 3) {
                  macdStatus = change > 0 ? "Bullish" : "Bearish";
                }
              }

              const probability = Math.min(95, Math.max(5, 50 + (50 - rsi) * 0.8));

              let recommendation = "Hold";
              if (rsi < 30) recommendation = "Buy";
              else if (rsi > 70) recommendation = "Sell";
              else if (rsi < 40 && (liveData.change || 0) > 0) recommendation = "Buy";
              else if (rsi > 60 && (liveData.change || 0) < 0) recommendation = "Sell";

              results[item.symbol] = {
                symbol: liveData.symbol,
                name: liveData.name || item.symbol,
                price: liveData.price || 0,
                priceChange: `${((liveData.change || 0) >= 0 ? '+' : '')}${(liveData.change || 0).toFixed(2)}%`,
                priceUp: (liveData.change || 0) >= 0,
                rsi,
                rsiStatus,
                macdStatus,
                probability: Math.round(probability),
                recommendation,
                market: item.market || 'US',
                loading: false,
              };
            } else {
              results[item.symbol] = {
                symbol: item.symbol,
                name: item.symbol,
                price: 0,
                priceChange: '0.00%',
                priceUp: false,
                rsi: 50,
                rsiStatus: 'Neutral',
                macdStatus: 'Neutral',
                probability: 50,
                recommendation: 'Hold',
                market: item.market || 'US',
                loading: false,
                error: 'No data available',
              };
            }
          } catch (error) {
            console.error(`Error fetching ${item.symbol}:`, error);
            results[item.symbol] = {
              symbol: item.symbol,
              name: item.symbol,
              price: 0,
              priceChange: '0.00%',
              priceUp: false,
              rsi: 50,
              rsiStatus: 'Neutral',
              macdStatus: 'Neutral',
              probability: 50,
              recommendation: 'Hold',
              market: item.market || 'US',
              loading: false,
              error: 'Failed to fetch',
            };
          }
        }
        
        setEnhancedData(results);
        setFetchingData(false);
      }
    } catch (error) {
      console.error('Watchlist fetch error:', error);
      toast({ 
        title: t.failedToFetch, 
        description: t.pleaseTryAgain,
        variant: "destructive" 
      });
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchWatchlist(); 
  }, [user]);

  const handleRemove = async (id: string) => {
    try {
      await supabase.from("user_watchlists").delete().eq("id", id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      const itemToRemove = items.find(i => i.id === id);
      if (itemToRemove) {
        const newData = { ...enhancedData };
        delete newData[itemToRemove.symbol];
        setEnhancedData(newData);
      }
    } catch (error) {
      console.error('Remove error:', error);
      toast({ 
        title: "Failed to remove", 
        description: "Please try again",
        variant: "destructive" 
      });
    }
  };

  const getRSIStatus = (rsi: number) => {
    if (rsi < 30) return { 
      color: "text-emerald-400", 
      bg: "bg-emerald-400/20", 
      border: "border-emerald-400/30",
      label: t.oversold, 
      action: t.buy,
    };
    if (rsi > 70) return { 
      color: "text-red-400", 
      bg: "bg-red-400/20", 
      border: "border-red-400/30",
      label: t.overbought, 
      action: t.sell,
    };
    return { 
      color: "text-gray-400", 
      bg: "bg-gray-400/10", 
      border: "border-gray-400/20",
      label: t.neutral, 
      action: t.neutral,
    };
  };

  const getMACDStatus = (macdStatus: string) => {
    if (macdStatus === "Bullish") return { color: "text-emerald-400", label: t.macdBullish, icon: "↑" };
    if (macdStatus === "Bearish") return { color: "text-red-400", label: t.macdBearish, icon: "↓" };
    return { color: "text-gray-400", label: t.neutral, icon: "—" };
  };

  const getOverallSignal = (rsi: number, macdStatus: string) => {
    const rsiStatus = getRSIStatus(rsi || 50);
    const macd = getMACDStatus(macdStatus || "Neutral");

    if ((rsiStatus.action === t.buy || rsiStatus.action === "Buy") && macd.label.includes("Bullish")) {
      return { label: t.strongBuy, color: "text-emerald-400", bg: "bg-emerald-400/30" };
    }
    if (rsiStatus.action === t.buy || rsiStatus.action === "Buy") {
      return { label: t.buy, color: "text-emerald-300", bg: "bg-emerald-300/20" };
    }
    if ((rsiStatus.action === t.sell || rsiStatus.action === "Sell") && macd.label.includes("Bearish")) {
      return { label: t.strongSell, color: "text-red-400", bg: "bg-red-400/30" };
    }
    if (rsiStatus.action === t.sell || rsiStatus.action === "Sell") {
      return { label: t.sell, color: "text-red-300", bg: "bg-red-300/20" };
    }
    if ((rsiStatus.action === t.buy || rsiStatus.action === "Buy") && macd.label.includes("Bearish")) {
      return { label: t.caution, color: "text-yellow-400", bg: "bg-yellow-400/20" };
    }
    if ((rsiStatus.action === t.sell || rsiStatus.action === "Sell") && macd.label.includes("Bullish")) {
      return { label: t.caution, color: "text-yellow-400", bg: "bg-yellow-400/20" };
    }
    return { label: t.neutral, color: "text-gray-400", bg: "bg-gray-400/10" };
  };

  const isUSStock = (market: string) => {
    return market === "NASDAQ" || market === "NYSE" || market === "AMEX" || market === "US";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/10">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl blur-3xl -z-10" />
          <div className="flex items-center justify-between">
            <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-3">
              <Star className="h-10 w-10 text-primary fill-primary/20" />
              {t.title}
              {user && (
                <span className="text-base font-normal text-muted-foreground bg-secondary/50 px-4 py-1.5 rounded-full">
                  {items.length}/10
                </span>
              )}
            </h1>
            {user && items.length > 0 && (
              <Link
                to="/ai-stocks"
                className="text-sm sm:text-base text-primary hover:text-primary/80 font-medium flex items-center gap-2 bg-primary/10 px-4 py-2.5 rounded-full hover:bg-primary/20 transition-all"
              >
                <Zap className="h-4 w-4" />
                {t.goAnalyze}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {!user ? (
          <div className="text-center space-y-6 py-16 bg-card/30 rounded-2xl border border-border/50">
            <p className="text-lg text-muted-foreground">{t.loginRequired}</p>
            <Link to="/auth" className="rounded-full bg-primary px-10 py-4 text-base font-bold text-primary-foreground inline-block hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              {t.login}
            </Link>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-primary" size={48} />
              <p className="text-base text-muted-foreground">Loading your watchlist...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center space-y-6 py-16 bg-card/30 rounded-2xl border border-border/50">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center">
                <Star className="h-12 w-12 text-muted-foreground/30" />
              </div>
            </div>
            <p className="text-lg text-muted-foreground">{t.empty}</p>
            <Link to="/ai-stocks" className="rounded-full bg-primary px-10 py-4 text-base font-bold text-primary-foreground inline-block hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              {t.goAnalyze} →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Legend - Larger text with fixed translations */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-muted-foreground bg-card/50 backdrop-blur-sm px-5 py-4 rounded-xl border border-border/50">
              <div className="flex items-center gap-2">
                <Circle size={12} className="text-emerald-400 fill-current" />
                <span className="text-emerald-400 font-medium">{t.rsiOversold}</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle size={12} className="text-red-400 fill-current" />
                <span className="text-red-400 font-medium">{t.rsiOverbought}</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle size={12} className="text-gray-400 fill-current" />
                <span className="font-medium">{t.rsiNeutral}</span>
              </div>
              <div className="flex items-center gap-2 ml-2 text-primary">
                <ChevronRight size={16} />
                <span className="text-emerald-400 font-medium">{t.macdBullish}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-red-400 font-medium">{t.macdBearish}</span>
              </div>
            </div>

            {/* Compact 1-row cards - Larger fonts with enhanced hover */}
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {items.map((item) => {
                const stockData = enhancedData[item.symbol];
                const isLoading = fetchingData && !stockData;
                
                // Loading skeleton with shimmer
                if (isLoading) {
                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-border/50 bg-card p-4 sm:p-5 flex items-center justify-between animate-pulse"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-32 bg-gradient-to-r from-secondary/50 via-secondary/30 to-secondary/50 rounded-full animate-shimmer"></div>
                        <div className="h-6 w-48 bg-gradient-to-r from-secondary/50 via-secondary/30 to-secondary/50 rounded animate-shimmer"></div>
                      </div>
                      <div className="h-6 w-28 bg-gradient-to-r from-secondary/50 via-secondary/30 to-secondary/50 rounded animate-shimmer"></div>
                    </div>
                  );
                }

                if (!stockData) {
                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-border/50 bg-card p-4 sm:p-5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold">{item.symbol}</span>
                        <span className="text-sm text-muted-foreground uppercase">{item.market}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Loading...</span>
                    </div>
                  );
                }

                const rsiStatus = getRSIStatus(stockData.rsi || 50);
                const macdStatus = getMACDStatus(stockData.macdStatus || "Neutral");
                const signal = getOverallSignal(stockData.rsi || 50, stockData.macdStatus || "Neutral");
                const isUS = isUSStock(item.market || 'US');

                return (
                  <div
                    key={item.id}
                    className={`relative group rounded-xl border bg-gradient-to-br from-card to-secondary/20 hover:from-card/80 hover:to-secondary/30 transition-all duration-300 p-4 sm:p-5 ${rsiStatus.border} border hover:shadow-lg hover:scale-[1.01]`}
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="absolute top-3 right-3 text-muted-foreground/40 hover:text-red-400 transition-colors z-10 opacity-0 group-hover:opacity-100"
                      title={t.remove}
                    >
                      <Trash2 size={18} />
                    </button>

                    {/* Single Row - Larger text with added date tooltip */}
                    <div className="flex items-center justify-between gap-3 pr-7 flex-wrap lg:flex-nowrap">
                      {/* Symbol + Market + Name */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${rsiStatus.bg}`}>
                          <span 
                            className="text-base sm:text-lg font-bold truncate"
                            title={`Added: ${new Date(item.added_at).toLocaleDateString()}`}
                          >
                            {stockData.symbol}
                          </span>
                          <span className="text-xs text-muted-foreground uppercase">{item.market || 'US'}</span>
                        </div>
                        <span className="text-sm text-muted-foreground truncate hidden md:inline max-w-[150px]">
                          {stockData.name}
                        </span>
                      </div>

                      {/* Price + Change */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-base sm:text-lg font-bold">
                          {isUS ? `$${stockData.price.toFixed(2)}` : `NT$${stockData.price.toFixed(2)}`}
                        </span>
                        <span className={`text-sm font-semibold ${stockData.priceUp ? 'text-emerald-400' : 'text-red-400'}`}>
                          {stockData.priceChange}
                        </span>
                      </div>

                      {/* RSI */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs uppercase text-muted-foreground font-medium hidden sm:inline">RSI</span>
                        <span className={`text-base font-bold ${rsiStatus.color} ${rsiStatus.color.includes('emerald') ? 'animate-pulse' : ''}`}>
                          {stockData.rsi.toFixed(0)}
                        </span>
                        <span className={`text-sm font-medium ${rsiStatus.color} hidden sm:inline`}>
                          {rsiStatus.label}
                        </span>
                      </div>

                      {/* MACD */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs uppercase text-muted-foreground font-medium hidden sm:inline">MACD</span>
                        <span className={`text-base font-bold ${macdStatus.color}`}>
                          {macdStatus.icon}
                        </span>
                        <span className={`text-sm font-medium ${macdStatus.color} hidden sm:inline`}>
                          {macdStatus.label.replace('MACD ', '')}
                        </span>
                      </div>

                      {/* Signal Badge */}
                      <div className={`px-3 py-1.5 rounded-full ${signal.bg} shrink-0`}>
                        <span className={`text-sm font-bold ${signal.color}`}>
                          {signal.label}
                        </span>
                      </div>

                      {/* Analyze Button */}
                      <Link
                        to={`/ai-stocks?symbol=${stockData.symbol}&market=${item.market || 'us'}`}
                        className="text-sm font-medium px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/10 hover:border-primary/20 transition-all text-primary/80 hover:text-primary whitespace-nowrap shrink-0"
                      >
                        {t.analyze} →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Watchlist;