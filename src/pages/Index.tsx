import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Clock, Brain, Shield, BarChart3, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FestiveBanner from "@/components/FestiveBanner";
import { useLanguage } from "@/contexts/LanguageContext";

const homeT = {
  en: {
    heroTitle: "Don't Just Retire.",
    heroAccent: "Rewire!",
    heroSub: "The 'Open Eye' Exercise for the AI Era.",
    stockPickLabel: "Stock Pick of the Day!",
    aiProb: "AI Prob:",
    buy: "Buy:",
    sell: "Sell:",
    whyJoin: "Why Join DragonGPAi.com?",
    saveTime: "Save Your Time",
    saveTimeDesc: "Heavy lifting & math done for you.",
    pureAI: "Pure AI Analysis",
    pureAIDesc: "No bias. Just RSI, MACD & raw data.",
    missionTitle: "Our Mission: Rewiring the Perspective",
    missionDesc: "Daily insights as a mental gym to keep the mind sharp and analytical.",
    zeroPressure: "Zero Pressure",
    selfDecision: "Principle of Self-Decision",
    selfDecisionDesc: "We provide info; you decide. No pressure.",
    standard: "The DragonGPAi.com Standard",
    standardDesc: "AI-driven math summaries. Raw data only.",
    watchlist: "My Watchlist",
    pricePlan: "Price Plan",
    explorerGift: "Explorer Gift",
    freeReports: "5 Free Reports",
    fullProb: "✓ Full AI probability",
    trial48: "✓ 48-hour trial",
    claimGift: "🎁 Claim Gift",
    noCard: "No credit card",
  },
  tc: {
    heroTitle: "不只退休。",
    heroAccent: "重新啟動！",
    heroSub: "AI 時代的「睜開眼」練習。",
    stockPickLabel: "今日精選股票！",
    aiProb: "AI 概率：",
    buy: "買入：",
    sell: "賣出：",
    whyJoin: "為什麼加入 DragonGPAi.com？",
    saveTime: "節省您的時間",
    saveTimeDesc: "繁重的計算由我們為您完成。",
    pureAI: "純 AI 分析",
    pureAIDesc: "無偏見。僅 RSI、MACD 和原始數據。",
    missionTitle: "我們的使命：重塑視角",
    missionDesc: "每日洞察如同腦力健身房，保持思維敏銳和分析力。",
    zeroPressure: "零壓力",
    selfDecision: "自主決策原則",
    selfDecisionDesc: "我們提供資訊；您自行決定。無壓力。",
    standard: "DragonGPAi.com 標準",
    standardDesc: "AI 驅動的數學摘要。僅限原始數據。",
    watchlist: "我的監察名單",
    pricePlan: "價格方案",
    explorerGift: "探索者禮物",
    freeReports: "5 份免費報告",
    fullProb: "✓ 完整 AI 概率",
    trial48: "✓ 48 小時試用",
    claimGift: "🎁 領取禮物",
    noCard: "無需信用卡",
  },
  sc: {
    heroTitle: "不只退休。",
    heroAccent: "重新启动！",
    heroSub: "AI 时代的「睁开眼」练习。",
    stockPickLabel: "今日精选股票！",
    aiProb: "AI 概率：",
    buy: "买入：",
    sell: "卖出：",
    whyJoin: "为什么加入 DragonGPAi.com？",
    saveTime: "节省您的时间",
    saveTimeDesc: "繁重的计算由我们为您完成。",
    pureAI: "纯 AI 分析",
    pureAIDesc: "无偏见。仅 RSI、MACD 和原始数据。",
    missionTitle: "我们的使命：重塑视角",
    missionDesc: "每日洞察如同脑力健身房，保持思维敏锐和分析力。",
    zeroPressure: "零压力",
    selfDecision: "自主决策原则",
    selfDecisionDesc: "我们提供信息；您自行决定。无压力。",
    standard: "DragonGPAi.com 标准",
    standardDesc: "AI 驱动的数学摘要。仅限原始数据。",
    watchlist: "我的监察名单",
    pricePlan: "价格方案",
    explorerGift: "探索者礼物",
    freeReports: "5 份免费报告",
    fullProb: "✓ 完整 AI 概率",
    trial48: "✓ 48 小时试用",
    claimGift: "🎁 领取礼物",
    noCard: "无需信用卡",
  },
};

const stockPicks = [
  { ticker: "NVDA", price: "$189.83", prob: "96%", buy: "$186.42", buyProb: "92%", sell: "$266.98", sellProb: "75%" },
  { ticker: "0700.HK", price: "HK$636.32", prob: "89%", buy: "HK$620.62", buyProb: "85%", sell: "HK$792.73", sellProb: "74%" },
];

const testimonialsEN = [
  { name: "S. Wang", stars: 5, tag: "AI Stock", quote: "Very friendly to get stock analysis! Thanks." },
  { name: "M. Chen", stars: 5, tag: "Daily Report", quote: "Clean data presentation. No bias detected." },
  { name: "K. Lee", stars: 4, tag: "HK Market", quote: "Useful for Hong Kong stock insights." },
  { name: "J. Wu", stars: 5, tag: "US Stocks", quote: "Great tool for tracking tech stocks." },
  { name: "T. Liu", stars: 5, tag: "AI Analysis", quote: "Mathematical approach I was looking for." },
];

const testimonialsCN = [
  { name: "陳先生", stars: 4, tag: "AI 概率分", quote: "數據非常準確，對我的資產配置很有幫助。" },
  { name: "L. 張小姐", stars: 4, tag: "港股研究", quote: "界面簡潔，AI 摘要節省了很多閱讀報表的時間。" },
  { name: "林工程師", stars: 4, tag: "認知強化", quote: "每日看這個「大腦健身房」，思維確實敏銳了。" },
  { name: "K. 鄭先生", stars: 4, tag: "美股趨勢", quote: "算法邏輯清晰，不再受市場情緒干擾。" },
  { name: "趙女士", stars: 4, tag: "自主決策", quote: "無壓力的環境讓我能冷靜分析數據，非常推薦。" },
  { name: "王先生", stars: 4, tag: "智能选股", quote: "AI 概率预测非常有参考价值，逻辑很硬。" },
  { name: "P. 李小姐", stars: 4, tag: "零压力体验", quote: "不推销、不误导，这就是我想要的纯净数据。" },
  { name: "刘博士", stars: 4, tag: "算法数学", quote: "看到 RSI 和 MACD 的深度整合，感觉背后数学模型很专业。" },
  { name: "H. 孙先生", stars: 4, tag: "效率工具", quote: "帮我做了最繁重的数学计算，省时省力。" },
  { name: "周女士", stars: 4, tag: "每日洞察", quote: "每天花五分钟看看，已经成了我的分析习惯。" },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < count ? "fill-blue-600 text-blue-600" : "text-gray-300"} />
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: { name: string; stars: number; tag: string; quote: string } }) {
  return (
    <div className="flex-shrink-0 w-64 rounded-xl glass shadow-md p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm text-gray-800">{t.name}</span>
        <Stars count={t.stars} />
      </div>
      <span className="text-xs font-medium text-blue-600">{t.tag}</span>
      <p className="text-sm text-gray-600 italic">"{t.quote}"</p>
    </div>
  );
}

function StockCard({ s, labels, className }: { s: typeof stockPicks[0]; labels: typeof homeT.en; className?: string }) {
  return (
    <div className={cn("rounded-xl glass shadow-md p-3 space-y-1 w-40 border-blue-200/50", className)}>
      <p className="text-[10px] font-semibold text-blue-600 tracking-wider uppercase">{labels.stockPickLabel}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-bold text-gray-800">{s.ticker}</span>
        <span className="text-blue-600 font-semibold text-xs">{s.price}</span>
      </div>
      <p className="text-[10px] text-gray-500">{labels.aiProb} <span className="text-blue-600 font-semibold">{s.prob}</span></p>
      <div className="flex gap-2 text-[10px]">
        <span className="text-blue-600">{labels.buy} {s.buy}</span>
        <span className="text-blue-400">{labels.sell} {s.sell}</span>
      </div>
    </div>
  );
}

const Index = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const c = homeT[lang];

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      navigate("/ai-stocks", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-page text-gray-800">
      {/* Fixed roaming stock cards - desktop only */}
      <div className="hidden md:block fixed z-[100] animate-roam-1 pointer-events-auto" style={{ top: 80, left: 16 }}>
        <StockCard s={stockPicks[0]} labels={c} className="cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all duration-300" />
      </div>
      <div className="hidden md:block fixed z-[100] animate-roam-2 pointer-events-auto" style={{ bottom: 24, left: 16 }}>
        <StockCard s={stockPicks[1]} labels={c} className="cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all duration-300" />
      </div>

      <Header />
      <FestiveBanner />

      {/* Hero */}
      <section className="pt-4 pb-2 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight italic text-gray-800">
            {c.heroTitle} <span className="text-blue-600">{c.heroAccent}</span>
          </h1>
          <p className="mt-1.5 text-sm text-blue-600 italic">
            {c.heroSub}
          </p>
        </div>
      </section>

      {/* Main content with floating sidebar */}
      <section id="about" className="max-w-7xl mx-auto px-6 pb-6 relative overflow-visible z-10">
        {/* Mobile stock cards - stacked under hero */}
        <div className="flex md:hidden gap-3 justify-center mb-4">
          <StockCard s={stockPicks[0]} labels={c} />
          <StockCard s={stockPicks[1]} labels={c} />
        </div>
        {/* Floating gift card - desktop only */}
        <div className="hidden xl:block absolute right-6 top-0 z-50">
          <div className="animate-float-gift rounded-xl glass shadow-lg p-3 w-52 space-y-1.5 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Gift size={12} />
              <span className="text-[10px] font-semibold uppercase tracking-wider">{c.explorerGift}</span>
            </div>
            <h3 className="text-sm font-bold text-gray-800">{c.freeReports}</h3>
            <ul className="text-[11px] text-gray-500 space-y-0.5">
              <li>{c.fullProb}</li>
              <li>{c.trial48}</li>
            </ul>
            <a href="/pricing" className="block w-full rounded-lg bg-blue-600 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition-colors">
              {c.claimGift}
            </a>
            <p className="text-[10px] text-gray-400">{c.noCard}</p>
          </div>
        </div>

        {/* 2x2 grid of content sections with bordered cards */}
        <div className="grid md:grid-cols-2 gap-4 xl:pr-60">
          {/* Why Join */}
          <div className="rounded-xl glass shadow-md p-4 space-y-3">
            <h2 className="text-base font-bold text-blue-600 italic">{c.whyJoin}</h2>
            <div className="flex items-start gap-2.5">
              <Clock className="text-blue-500 mt-0.5 shrink-0" size={16} />
              <div>
                <h3 className="font-semibold text-xs text-gray-700">{c.saveTime}</h3>
                <p className="text-xs text-gray-500">{c.saveTimeDesc}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <BarChart3 className="text-blue-500 mt-0.5 shrink-0" size={16} />
              <div>
                <h3 className="font-semibold text-xs text-gray-700">{c.pureAI}</h3>
                <p className="text-xs text-gray-500">{c.pureAIDesc}</p>
              </div>
            </div>
          </div>

          {/* Our Mission */}
          <div className="rounded-xl glass shadow-md p-4 space-y-3">
            <h2 className="text-base font-bold text-blue-600 italic">{c.missionTitle}</h2>
            <div className="flex items-start gap-2.5">
              <Brain className="text-blue-500 mt-0.5 shrink-0" size={16} />
              <p className="text-xs text-gray-500">{c.missionDesc}</p>
            </div>
          </div>

          {/* Zero Pressure */}
          <div className="rounded-xl glass shadow-md p-4 space-y-3">
            <h2 className="text-base font-bold text-blue-600 italic">{c.zeroPressure}</h2>
            <div className="flex items-start gap-2.5">
              <Shield className="text-blue-500 mt-0.5 shrink-0" size={16} />
              <div>
                <h3 className="font-semibold text-xs text-gray-700">{c.selfDecision}</h3>
                <p className="text-xs text-gray-500">{c.selfDecisionDesc}</p>
              </div>
            </div>
          </div>

          {/* The DragonGP Standard */}
          <div id="stocks" className="rounded-xl glass shadow-md p-4 space-y-3">
            <h2 className="text-base font-bold text-blue-600 italic">{c.standard}</h2>
            <p className="text-xs text-gray-500">{c.standardDesc}</p>
            <div className="flex gap-2.5 flex-wrap">
              <a href="https://dragongpai.com/watchlist" className="rounded-lg border border-blue-200 px-4 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors">{c.watchlist}</a>
              <a href="https://dragongpai.com/pricing" className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors">{c.pricePlan}</a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials EN */}
      <section className="py-6 overflow-hidden relative z-0 max-h-40">
        <div className="flex gap-6 animate-scroll-left" style={{ width: "max-content" }}>
          {[...testimonialsEN, ...testimonialsEN, ...testimonialsEN].map((t, i) => (
            <TestimonialCard key={`en-${i}`} t={t} />
          ))}
        </div>
      </section>

      {/* Testimonials CN */}
      <section className="pb-10 pt-4 overflow-hidden relative z-0 max-h-40">
        <div className="flex gap-6 animate-scroll-left-slow" style={{ width: "max-content" }}>
          {[...testimonialsCN, ...testimonialsCN, ...testimonialsCN].map((t, i) => (
            <TestimonialCard key={`cn-${i}`} t={t} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;