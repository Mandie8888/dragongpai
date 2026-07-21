import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Search, Wifi, Brain, Download, CheckCircle, XCircle, ArrowRight, FileText, Sparkles, Zap, Shield, Clock,
  Gamepad2, BarChart3, Dice5, Target, TrendingUp, Mic, Speaker, Volume2, VolumeX, Globe, Languages,
  Star, Crown, Rocket, Award, Flame, Gem, Compass, Lightbulb
} from "lucide-react";
import { Link } from "react-router-dom";

/* ───────── i18n ───────── */
const t = {
  en: {
    tabStock: "Stock AI",
    tabMark6: "Lotto AI",

    heroTitle: "How It Works",
    heroSub: "From ticker to full AI report — now with voice!",

    step1Title: "Enter Stock Code",
    step1Desc: "Type any HK, TW, or US stock code in the search box (e.g. 0001.HK, 2330.TW, NVDA).",
    step2Title: "Get Real-Time Data",
    step2Desc: "Our system connects to Yahoo Finance to fetch the most accurate live quotes and company names.",
    step3Title: "Generate AI Report",
    step3Desc: "Click 'Generate Report' and let our AI perform technical indicators and probability analysis.",
    step4Title: "Download & Share",
    step4Desc: "Get a complete PDF report with AI ratings, target prices, and risk assessments.",

    voiceFeatureTitle: "🎙️ Voice-Powered Analysis",
    voiceFeatureDesc: "Speak naturally in English, Cantonese, or Mandarin — our AI understands and responds in your language.",
    voiceFeatureItems: [
      "🎤 Voice Input — Just speak the stock symbol",
      "🔊 Voice Output — Listen to your AI report",
      "🌍 Multi-Language — English, 廣東話, 國語",
      "⚡ Instant Response — Real-time voice interaction"
    ],

    downloadGuide: "Download Full AI Stocks User Guide (PDF)",

    whyTitle: "Why DragonGPAi.com?",
    whySub: "We solved the most common problems in the market",
    problemTitle: "Common Issues",
    solutionTitle: "DragonGPAi.com Solution",
    prob1: "Delayed or inaccurate stock data",
    sol1: "Real-time Yahoo Finance integration",
    prob2: "Wrong company names for HK/TW stocks",
    sol2: "Accurate names via official data sources",
    prob3: "Reports take hours to compile",
    sol3: "Full AI report generated in seconds",
    prob4: "No multi-market coverage",
    sol4: "HK, TW & US stocks in one platform",

    ctaTitle: "Ready to Try?",
    ctaSub: "Start your 10-day free trial now — no credit card required.",
    ctaButton: "Start 10-Day Free Trial",

    // Mark6 section
    m6Hero: "AI Lotto Methodology",
    m6Sub: "Statistics & probability theory — now with voice-powered predictions!",
    m6Step1Title: "Choose AI Partner",
    m6Step1Desc: "Select from 8 unique AI models, each with a distinct mathematical approach (e.g. Elon's Banker Strategy, Dragon Master's Neural Network).",
    m6Step2Title: "500K Simulations",
    m6Step2Desc: "AI analyses the last 100+ draws and runs 500,000 Monte Carlo simulations using statistical models and probability theory.",
    m6Step3Title: "Get 10 Number Sets",
    m6Step3Desc: "Receive your personalised prediction report with 10 sets of recommended numbers, frequency analysis, and confidence scores.",
    m6MethodTitle: "Our Mathematical Models",
    m6MethodSub: "Each AI partner uses a different statistical methodology",
    m6Models: [
      { name: "Dragon Master", method: "Neural Network + Bayesian", desc: "Deep learning pattern recognition with probability updates.", icon: "🐉" },
      { name: "Phoenix Trend", method: "Time Series + Momentum", desc: "ARIMA models and momentum indicators for trend analysis.", icon: "🔥" },
      { name: "Tiger Volatility", method: "Volatility Clustering", desc: "GARCH modelling to identify hot/cold number clusters.", icon: "🐯" },
      { name: "Elon", method: "Banker Strategy (膽拖)", desc: "Anchor numbers with mathematical coverage optimization.", icon: "🚀" },
      { name: "God of Gambling", method: "Markov Chain", desc: "Transition probability matrices for next-draw predictions.", icon: "🎲" },
      { name: "Aladdin", method: "Geometric Probability", desc: "Spatial distribution models for balanced number selection.", icon: "🧞" },
      { name: "Lucky Star", method: "Poisson Distribution", desc: "Frequency-based modelling for rare event prediction.", icon: "⭐" },
      { name: "Achelois", method: "Fibonacci + Golden Ratio", desc: "Natural sequence patterns applied to number spacing.", icon: "🌙" },
    ],
    m6Disclaimer: "AI predictions are for entertainment purposes only. Past draws do not guarantee future results.",
    downloadM6Guide: "Download: AI Mark 6 Analysis Guide (PDF)",
    m6VoiceTitle: "🎙️ Voice-Enabled Lotto Analysis",
    m6VoiceDesc: "Ask questions about your numbers in English, Cantonese, or Mandarin — get instant voice responses.",
    m6VoiceItems: [
      "🎤 Speak your lucky numbers",
      "🔊 Hear your prediction results",
      "🌍 Multi-language support",
      "⚡ Real-time AI responses"
    ],
  },
  tc: {
    tabStock: "股票 AI",
    tabMark6: "樂透 AI",

    heroTitle: "運作方式",
    heroSub: "從輸入代碼到完整 AI 報告 — 現在支援語音！",

    step1Title: "輸入股票代碼",
    step1Desc: "在搜尋框輸入港、台、美股代碼（例如：0001.HK、2330.TW、NVDA）。",
    step2Title: "獲取即時數據",
    step2Desc: "系統自動對接 Yahoo Finance，獲取最準確的即時報價與公司名稱。",
    step3Title: "生成 AI 報告",
    step3Desc: "點擊「Generate Report」按鈕，讓 AI 進行技術指標與概率分析。",
    step4Title: "下載與分享",
    step4Desc: "獲取完整 PDF 報告，包含 AI 評級、目標價與風險評估。",

    voiceFeatureTitle: "🎙️ 語音驅動分析",
    voiceFeatureDesc: "用英語、廣東話或國語自然說話 — 我們的 AI 能理解並以您的語言回應。",
    voiceFeatureItems: [
      "🎤 語音輸入 — 直接說出股票代碼",
      "🔊 語音輸出 — 聆聽您的 AI 報告",
      "🌍 多語言支援 — English, 廣東話, 國語",
      "⚡ 即時回應 — 即時語音互動"
    ],

    downloadGuide: "下載完整 AI 股票操作指南 (PDF)",

    whyTitle: "為什麼選擇 DragonGPAi.com？",
    whySub: "我們解決了市場上最常見的問題",
    problemTitle: "常見問題",
    solutionTitle: "DragonGPAi.com 方案",
    prob1: "數據延遲或不準確",
    sol1: "Yahoo Finance 即時數據串接",
    prob2: "港股/台股公司名稱錯誤",
    sol2: "透過官方數據源獲取準確名稱",
    prob3: "報告需要數小時整理",
    sol3: "AI 報告數秒內生成",
    prob4: "沒有多市場覆蓋",
    sol4: "港股、台股、美股一站搞定",

    ctaTitle: "準備好了嗎？",
    ctaSub: "立即開始 10 天免費體驗 — 無需信用卡。",
    ctaButton: "立即開始 10 天免費體驗",

    m6Hero: "AI 樂透邏輯",
    m6Sub: "運用統計學與機率論 — 現在支援語音預測！",
    m6Step1Title: "選擇 AI 夥伴",
    m6Step1Desc: "從 8 個獨特 AI 模型中選擇，每個都有不同的數學方法（如 Elon 的膽拖策略、Dragon Master 的神經網絡）。",
    m6Step2Title: "50 萬次模擬",
    m6Step2Desc: "AI 分析近 100+ 期開獎記錄，運用統計模型與機率論進行 50 萬次蒙地卡羅模擬。",
    m6Step3Title: "獲取 10 組號碼",
    m6Step3Desc: "收到您的專屬預測報告，包含 10 組推薦號碼、頻率分析與信心指數。",
    m6MethodTitle: "我們的數學模型",
    m6MethodSub: "每位 AI 夥伴使用不同的統計方法論",
    m6Models: [
      { name: "Dragon Master 龍師傅", method: "神經網絡 + 貝葉斯", desc: "深度學習模式識別結合概率更新。", icon: "🐉" },
      { name: "Phoenix Trend 鳳凰趨勢", method: "時間序列 + 動量", desc: "ARIMA 模型和動量指標進行趨勢分析。", icon: "🔥" },
      { name: "Tiger Volatility 虎王波動", method: "波動聚集", desc: "GARCH 建模識別冷熱號碼集群。", icon: "🐯" },
      { name: "Elon 伊隆", method: "膽拖策略", desc: "選擇錨定號碼並通過數學優化擴展覆蓋。", icon: "🚀" },
      { name: "God of Gambling 賭神", method: "馬爾可夫鏈", desc: "轉移概率矩陣預測下一期分佈。", icon: "🎲" },
      { name: "Aladdin 阿拉丁", method: "幾何概率", desc: "空間分佈模型實現均衡號碼選擇。", icon: "🧞" },
      { name: "Lucky Star 幸運星", method: "泊松分佈", desc: "基於頻率的建模用於罕見事件預測。", icon: "⭐" },
      { name: "Achelois 月光女神", method: "斐波那契 + 黃金比例", desc: "自然序列模式應用於號碼間距分析。", icon: "🌙" },
    ],
    m6Disclaimer: "AI 預測僅供娛樂參考。過往開獎記錄不保證未來結果。",
    downloadM6Guide: "下載：AI 六合彩分析指南 (PDF)",
    m6VoiceTitle: "🎙️ 語音樂透分析",
    m6VoiceDesc: "用英語、廣東話或國語詢問您的號碼問題 — 獲得即時語音回應。",
    m6VoiceItems: [
      "🎤 說出您的幸運號碼",
      "🔊 聆聽預測結果",
      "🌍 多語言支援",
      "⚡ 即時 AI 回應"
    ],
  },
  sc: {
    tabStock: "股票 AI",
    tabMark6: "乐透 AI",

    heroTitle: "运作方式",
    heroSub: "从输入代码到完整 AI 报告 — 现在支援语音！",

    step1Title: "输入股票代码",
    step1Desc: "在搜索框输入港、台、美股代码（例如：0001.HK、2330.TW、NVDA）。",
    step2Title: "获取实时数据",
    step2Desc: "系统自动对接 Yahoo Finance，获取最准确的实时报价与公司名称。",
    step3Title: "生成 AI 报告",
    step3Desc: "点击「Generate Report」按钮，让 AI 进行技术指标与概率分析。",
    step4Title: "下载与分享",
    step4Desc: "获取完整 PDF 报告，包含 AI 评级、目标价与风险评估。",

    voiceFeatureTitle: "🎙️ 语音驱动分析",
    voiceFeatureDesc: "用英语、广东话或国语自然说话 — 我们的 AI 能理解并以您的语言回应。",
    voiceFeatureItems: [
      "🎤 语音输入 — 直接说出股票代码",
      "🔊 语音输出 — 聆听您的 AI 报告",
      "🌍 多语言支援 — English, 廣東話, 國語",
      "⚡ 即时回应 — 即时语音互动"
    ],

    downloadGuide: "下载完整 AI 股票操作指南 (PDF)",

    whyTitle: "为什么选择 DragonGPAi.com？",
    whySub: "我们解决了市场上最常见的问题",
    problemTitle: "常见问题",
    solutionTitle: "DragonGPAi.com 方案",
    prob1: "数据延迟或不准确",
    sol1: "Yahoo Finance 实时数据串接",
    prob2: "港股/台股公司名称错误",
    sol2: "通过官方数据源获取准确名称",
    prob3: "报告需要数小时整理",
    sol3: "AI 报告数秒内生成",
    prob4: "没有多市场覆盖",
    sol4: "港股、台股、美股一站搞定",

    ctaTitle: "准备好了吗？",
    ctaSub: "立即开始 10 天免费体验 — 无需信用卡。",
    ctaButton: "立即开始 10 天免费体验",

    m6Hero: "AI 乐透逻辑",
    m6Sub: "运用统计学与概率论 — 现在支援语音预测！",
    m6Step1Title: "选择 AI 伙伴",
    m6Step1Desc: "从 8 个独特 AI 模型中选择，每个都有不同的数学方法（如 Elon 的胆拖策略、Dragon Master 的神经网络）。",
    m6Step2Title: "50 万次模拟",
    m6Step2Desc: "AI 分析近 100+ 期开奖记录，运用统计模型与概率论进行 50 万次蒙特卡洛模拟。",
    m6Step3Title: "获取 10 组号码",
    m6Step3Desc: "收到您的专属预测报告，包含 10 组推荐号码、频率分析与信心指数。",
    m6MethodTitle: "我们的数学模型",
    m6MethodSub: "每位 AI 伙伴使用不同的统计方法论",
    m6Models: [
      { name: "Dragon Master 龙师傅", method: "神经网络 + 贝叶斯", desc: "深度学习模式识别结合概率更新。", icon: "🐉" },
      { name: "Phoenix Trend 凤凰趋势", method: "时间序列 + 动量", desc: "ARIMA 模型和动量指标进行趋势分析。", icon: "🔥" },
      { name: "Tiger Volatility 虎王波动", method: "波动聚集", desc: "GARCH 建模识别冷热号码集群。", icon: "🐯" },
      { name: "Elon 伊隆", method: "胆拖策略", desc: "选择锚定号码并通过数学优化扩展覆盖。", icon: "🚀" },
      { name: "God of Gambling 赌神", method: "马尔可夫链", desc: "转移概率矩阵预测下一期分布。", icon: "🎲" },
      { name: "Aladdin 阿拉丁", method: "几何概率", desc: "空间分布模型实现均衡号码选择。", icon: "🧞" },
      { name: "Lucky Star 幸运星", method: "泊松分布", desc: "基于频率的建模用于罕见事件预测。", icon: "⭐" },
      { name: "Achelois 月光女神", method: "斐波那契 + 黄金比例", desc: "自然序列模式应用于号码间距分析。", icon: "🌙" },
    ],
    m6Disclaimer: "AI 预测仅供娱乐参考。过往开奖记录不保证未来结果。",
    downloadM6Guide: "下载：AI 六合彩分析指南 (PDF)",
    m6VoiceTitle: "🎙️ 语音乐透分析",
    m6VoiceDesc: "用英语、广东话或国语询问您的号码问题 — 获得即时语音回应。",
    m6VoiceItems: [
      "🎤 说出您的幸运号码",
      "🔊 聆听预测结果",
      "🌍 多语言支援",
      "⚡ 即时 AI 回应"
    ],
  },
};

const stepIcons = [Search, Wifi, Brain, Download];
const stepColors = [
  "from-amber-500/20 via-amber-500/5 to-transparent",
  "from-emerald-500/20 via-emerald-500/5 to-transparent",
  "from-violet-500/20 via-violet-500/5 to-transparent",
  "from-rose-500/20 via-rose-500/5 to-transparent",
];
const stepAccents = ["text-amber-400", "text-emerald-400", "text-violet-400", "text-rose-400"];

const m6StepIcons = [Gamepad2, BarChart3, Sparkles];
const m6StepAccents = ["text-amber-400", "text-emerald-400", "text-violet-400"];

/* ───────── Page ───────── */
const HowItWorks = () => {
  const { lang } = useLanguage();
  const c = t[lang];
  const [activeTab, setActiveTab] = useState<"stock" | "mark6">("stock");

  const steps = [
    { title: c.step1Title, desc: c.step1Desc },
    { title: c.step2Title, desc: c.step2Desc },
    { title: c.step3Title, desc: c.step3Desc },
    { title: c.step4Title, desc: c.step4Desc },
  ];
  const m6Steps = [
    { title: c.m6Step1Title, desc: c.m6Step1Desc },
    { title: c.m6Step2Title, desc: c.m6Step2Desc },
    { title: c.m6Step3Title, desc: c.m6Step3Desc },
  ];

  const comparisons = [
    { prob: c.prob1, sol: c.sol1 },
    { prob: c.prob2, sol: c.sol2 },
    { prob: c.prob3, sol: c.sol3 },
    { prob: c.prob4, sol: c.sol4 },
  ];

  // Voice features for Stock tab
  const voiceFeatures = c.voiceFeatureItems || [];
  const m6VoiceFeatures = c.m6VoiceItems || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950/80">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-16">
        {/* ── Hero ── */}
        <section className="text-center space-y-4 relative">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-r from-amber-200/30 to-amber-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-r from-violet-200/30 to-violet-400/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-violet-500/20 border border-amber-500/20 text-sm font-medium text-amber-600 dark:text-amber-400 mb-4">
              <Rocket size={14} />
              <span>v2.0 — Voice Powered</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-600 via-primary to-violet-600 bg-clip-text text-transparent">
              {c.heroTitle}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mt-2 text-lg">
              {c.heroSub}
            </p>
          </div>
        </section>

        {/* ── Tab Toggle ── */}
        <section className="flex justify-center">
          <div className="inline-flex rounded-full border border-border bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-1 gap-1 shadow-lg">
            <button
              onClick={() => setActiveTab("stock")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === "stock" 
                  ? "bg-gradient-to-r from-primary to-violet-500 text-white shadow-lg shadow-primary/30" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingUp size={14} className="inline mr-1.5 -mt-0.5" />
              {c.tabStock}
            </button>
            <button
              onClick={() => setActiveTab("mark6")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === "mark6" 
                  ? "bg-gradient-to-r from-primary to-violet-500 text-white shadow-lg shadow-primary/30" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Dice5 size={14} className="inline mr-1.5 -mt-0.5" />
              {c.tabMark6}
            </button>
          </div>
        </section>

        {activeTab === "stock" ? (
          <>
            {/* ── Voice Feature Highlight ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-violet-50 to-emerald-50 dark:from-amber-950/30 dark:via-violet-950/30 dark:to-emerald-950/30 border border-amber-200/30 dark:border-amber-800/30 p-8">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-400/20 to-violet-400/20 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-400/20 to-amber-400/20 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Volume2 size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{c.voiceFeatureTitle}</h2>
                    <p className="text-sm text-muted-foreground">{c.voiceFeatureDesc}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {voiceFeatures.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/50 dark:border-slate-700/50">
                      <span className="text-lg">{item.split(' ')[0]}</span>
                      <span className="text-sm text-foreground">{item.split(' ').slice(1).join(' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── 4 Steps ── */}
            <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {steps.map((step, i) => {
                const Icon = stepIcons[i];
                return (
                  <div 
                    key={i} 
                    className={`group relative rounded-2xl border border-border bg-gradient-to-b ${stepColors[i]} p-6 space-y-4 hover:scale-[1.02] hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-gradient-to-r from-primary to-violet-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-primary/30">
                      {i + 1}
                    </div>
                    <div className={`h-14 w-14 rounded-xl bg-white/80 dark:bg-slate-800/80 flex items-center justify-center ${stepAccents[i]} shadow-sm`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="font-bold text-foreground text-base">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    {i < 3 && (
                      <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-primary/40 group-hover:text-primary/60 transition-colors">
                        <ArrowRight size={20} />
                      </div>
                    )}
                  </div>
                );
              })}
            </section>

            {/* ── PDF Download ── */}
            <section className="flex justify-center">
              <a 
                href="/AI_Stock_Report_Guidelines.pdf" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group inline-flex items-center gap-3 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 to-violet-500/10 px-8 py-4 text-primary font-semibold hover:shadow-[0_0_40px_-8px_hsl(var(--primary)/0.3)] hover:scale-[1.02] transition-all duration-300"
              >
                <FileText size={22} className="group-hover:scale-110 transition-transform" />
                {c.downloadGuide}
                <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
              </a>
            </section>

            {/* ── Why DragonGP ── */}
            <section className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-violet-500/20 border border-amber-500/20 text-sm font-medium text-amber-600 dark:text-amber-400">
                  <Gem size={14} />
                  <span>Why Choose Us</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-amber-600 via-primary to-violet-600 bg-clip-text text-transparent">
                  {c.whyTitle}
                </h2>
                <p className="text-muted-foreground">{c.whySub}</p>
              </div>
              <div className="rounded-2xl border border-border overflow-hidden shadow-lg">
                <div className="grid grid-cols-2">
                  <div className="px-5 py-3 bg-gradient-to-r from-rose-500/10 to-rose-500/5 border-b border-r border-border">
                    <div className="flex items-center gap-2 text-sm font-bold text-rose-500">
                      <XCircle size={16} />
                      {c.problemTitle}
                    </div>
                  </div>
                  <div className="px-5 py-3 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-b border-border">
                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-500">
                      <CheckCircle size={16} />
                      {c.solutionTitle}
                    </div>
                  </div>
                </div>
                {comparisons.map((row, i) => (
                  <div key={i} className={`grid grid-cols-2 ${i < comparisons.length - 1 ? "border-b border-border" : ""}`}>
                    <div className="px-5 py-3 border-r border-border text-sm text-muted-foreground flex items-center gap-2 bg-rose-50/30 dark:bg-rose-950/10">
                      <XCircle size={14} className="text-rose-400/60 shrink-0" />
                      {row.prob}
                    </div>
                    <div className="px-5 py-3 text-sm text-foreground flex items-center gap-2 bg-emerald-50/30 dark:bg-emerald-950/10">
                      <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                      {row.sol}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: <Zap size={20} />, label: lang === "en" ? "Instant Reports" : "即時報告", accent: "text-amber-400", bg: "bg-amber-500/10" },
                  { icon: <Shield size={20} />, label: lang === "en" ? "Accurate Data" : "準確數據", accent: "text-emerald-400", bg: "bg-emerald-500/10" },
                  { icon: <Languages size={20} />, label: lang === "en" ? "Voice + Multi-Lang" : "語音 + 多語言", accent: "text-violet-400", bg: "bg-violet-500/10" },
                ].map((feat) => (
                  <div key={feat.label} className="rounded-xl border border-border bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-4 flex items-center gap-3 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                    <div className={`h-10 w-10 rounded-lg ${feat.bg} flex items-center justify-center ${feat.accent}`}>
                      {feat.icon}
                    </div>
                    <span className="font-semibold text-foreground text-sm">{feat.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* ── Mark6 AI Section ── */}
            <section className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-amber-600 via-primary to-violet-600 bg-clip-text text-transparent">
                {c.m6Hero}
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">{c.m6Sub}</p>
            </section>

            {/* ── Voice Feature for Lotto ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 via-amber-50 to-emerald-50 dark:from-violet-950/30 dark:via-amber-950/30 dark:to-emerald-950/30 border border-violet-200/30 dark:border-violet-800/30 p-8">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-violet-400/20 to-amber-400/20 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-400 to-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <Volume2 size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{c.m6VoiceTitle}</h2>
                    <p className="text-sm text-muted-foreground">{c.m6VoiceDesc}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {m6VoiceFeatures.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/50 dark:border-slate-700/50">
                      <span className="text-lg">{item.split(' ')[0]}</span>
                      <span className="text-sm text-foreground">{item.split(' ').slice(1).join(' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 3 Steps */}
            <section className="grid sm:grid-cols-3 gap-5">
              {m6Steps.map((step, i) => {
                const Icon = m6StepIcons[i];
                return (
                  <div 
                    key={i} 
                    className="group relative rounded-2xl border border-border bg-gradient-to-b from-primary/10 to-transparent p-6 space-y-4 hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
                  >
                    <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-gradient-to-r from-primary to-violet-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-primary/30">
                      {i + 1}
                    </div>
                    <div className={`h-14 w-14 rounded-xl bg-white/80 dark:bg-slate-800/80 flex items-center justify-center ${m6StepAccents[i]} shadow-sm`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="font-bold text-foreground text-base">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    {i < 2 && (
                      <div className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-primary/40 group-hover:text-primary/60 transition-colors">
                        <ArrowRight size={20} />
                      </div>
                    )}
                  </div>
                );
              })}
            </section>

            {/* Models grid */}
            <section className="space-y-4">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-violet-500/20 border border-amber-500/20 text-sm font-medium text-amber-600 dark:text-amber-400">
                  <Crown size={14} />
                  <span>8 AI Geniuses</span>
                </div>
                <h3 className="text-xl font-extrabold bg-gradient-to-r from-amber-600 via-primary to-violet-600 bg-clip-text text-transparent">
                  {c.m6MethodTitle}
                </h3>
                <p className="text-sm text-muted-foreground">{c.m6MethodSub}</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {c.m6Models.map((m) => (
                  <div 
                    key={m.name} 
                    className="group rounded-xl border border-border bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-4 space-y-2 hover:border-primary/40 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{m.icon}</span>
                      <h4 className="text-sm font-bold text-foreground">{m.name}</h4>
                    </div>
                    <p className="text-xs font-semibold text-primary">{m.method}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* PDF Download */}
            <section className="flex justify-center">
              <a 
                href="/AI_Mark6_Analysis_Guide.pdf" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group inline-flex items-center gap-3 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 to-violet-500/10 px-8 py-4 text-primary font-semibold hover:shadow-[0_0_40px_-8px_hsl(var(--primary)/0.3)] hover:scale-[1.02] transition-all duration-300"
              >
                <FileText size={22} className="group-hover:scale-110 transition-transform" />
                {c.downloadM6Guide}
                <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
              </a>
            </section>

            {/* Disclaimer */}
            <section className="flex justify-center">
              <div className="rounded-xl border border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/30 p-4 flex items-start gap-2 max-w-lg">
                <Shield className="text-amber-500 shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-muted-foreground leading-relaxed">{c.m6Disclaimer}</p>
              </div>
            </section>
          </>
        )}

        {/* ── CTA ── */}
        <section className="relative overflow-hidden text-center space-y-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-primary/10 to-violet-500/10 border border-primary/30 p-10 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-violet-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-400/20 to-amber-400/20 rounded-full blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/30 to-violet-500/30 border border-amber-500/30 text-sm font-medium text-amber-600 dark:text-amber-400 mb-4">
              <Flame size={14} />
              <span>{lang === "en" ? "Limited Time Offer" : "限時優惠"}</span>
            </div>
            <Sparkles className="mx-auto text-primary" size={32} />
            <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-amber-600 via-primary to-violet-600 bg-clip-text text-transparent">
              {c.ctaTitle}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">{c.ctaSub}</p>
            <Link 
              to={activeTab === "stock" ? "/ai-stocks" : "/ai-games"} 
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-violet-500 px-8 py-3 font-bold text-white shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/50 hover:scale-[1.02] transition-all duration-300"
            >
              {c.ctaButton}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;