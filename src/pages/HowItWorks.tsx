import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Search, Wifi, Brain, Download, CheckCircle, XCircle, ArrowRight, FileText, Sparkles, Zap, Shield, Clock,
  Gamepad2, BarChart3, Dice5, Target, TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

/* ───────── i18n ───────── */
const t = {
  en: {
    tabStock: "Stock AI",
    tabMark6: "Mark6 AI",

    heroTitle: "How It Works",
    heroSub: "From ticker to full AI report in 4 simple steps",

    step1Title: "Enter Stock Code",
    step1Desc: "Type any HK, TW, or US stock code in the search box (e.g. 0001.HK, 2330.TW, NVDA).",
    step2Title: "Get Real-Time Data",
    step2Desc: "Our system connects to Yahoo Finance to fetch the most accurate live quotes and company names.",
    step3Title: "Generate AI Report",
    step3Desc: "Click 'Generate Report' and let our AI perform technical indicators and probability analysis.",
    step4Title: "Download & Share",
    step4Desc: "Get a complete PDF report with AI ratings, target prices, and risk assessments.",

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
    m6Hero: "AI Game Methodology",
    m6Sub: "Statistics & probability theory — not random sampling",
    m6Step1Title: "Choose AI Partner",
    m6Step1Desc: "Select from 8 unique AI models, each with a distinct mathematical approach (e.g. Elon's Banker Strategy, Dragon Master's Neural Network).",
    m6Step2Title: "500K Simulations",
    m6Step2Desc: "AI analyses the last 100+ draws and runs 500,000 Monte Carlo simulations using statistical models and probability theory.",
    m6Step3Title: "Get 10 Number Sets",
    m6Step3Desc: "Receive your personalised prediction report with 10 sets of recommended numbers, frequency analysis, and confidence scores.",
    m6MethodTitle: "Our Mathematical Models",
    m6MethodSub: "Each AI partner uses a different statistical methodology",
    m6Models: [
      { name: "Dragon Master", method: "Neural Network + Bayesian Inference", desc: "Deep learning pattern recognition combined with probability updates." },
      { name: "Phoenix Trend", method: "Time Series + Momentum", desc: "Trend analysis using ARIMA models and momentum indicators." },
      { name: "Tiger Volatility", method: "Volatility Clustering + GARCH", desc: "Identifies hot/cold number clusters via volatility modelling." },
      { name: "Elon", method: "Banker Strategy (膽拖)", desc: "Selects anchor numbers and expands coverage with mathematical optimisation." },
      { name: "God of Gambling", method: "Markov Chain", desc: "Transition probability matrices to predict next-draw distributions." },
      { name: "Aladdin", method: "Geometric Probability", desc: "Spatial distribution models for balanced number selection." },
      { name: "Lucky Star", method: "Poisson Distribution", desc: "Frequency-based modelling for rare event prediction." },
      { name: "Achelois", method: "Fibonacci + Golden Ratio", desc: "Natural sequence patterns applied to number spacing analysis." },
    ],
    m6Disclaimer: "AI predictions are for entertainment purposes only. Past draws do not guarantee future results.",
    downloadM6Guide: "Download: AI Mark 6 Analysis Guide (PDF)",
  },
  tc: {
    tabStock: "股票 AI",
    tabMark6: "Mark6 AI",

    heroTitle: "運作方式",
    heroSub: "從輸入代碼到完整 AI 報告，只需 4 個簡單步驟",

    step1Title: "輸入股票代碼",
    step1Desc: "在搜尋框輸入港、台、美股代碼（例如：0001.HK、2330.TW、NVDA）。",
    step2Title: "獲取即時數據",
    step2Desc: "系統自動對接 Yahoo Finance，獲取最準確的即時報價與公司名稱。",
    step3Title: "生成 AI 報告",
    step3Desc: "點擊「Generate Report」按鈕，讓 AI 進行技術指標與概率分析。",
    step4Title: "下載與分享",
    step4Desc: "獲取完整 PDF 報告，包含 AI 評級、目標價與風險評估。",

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

    m6Hero: "AI 遊戲邏輯",
    m6Sub: "運用統計學與機率論 — 非純隨機抽樣",
    m6Step1Title: "選擇 AI 夥伴",
    m6Step1Desc: "從 8 個獨特 AI 模型中選擇，每個都有不同的數學方法（如 Elon 的膽拖策略、Dragon Master 的神經網絡）。",
    m6Step2Title: "50 萬次模擬",
    m6Step2Desc: "AI 分析近 100+ 期開獎記錄，運用統計模型與機率論進行 50 萬次蒙地卡羅模擬。",
    m6Step3Title: "獲取 10 組號碼",
    m6Step3Desc: "收到您的專屬預測報告，包含 10 組推薦號碼、頻率分析與信心指數。",
    m6MethodTitle: "我們的數學模型",
    m6MethodSub: "每位 AI 夥伴使用不同的統計方法論",
    m6Models: [
      { name: "Dragon Master 龍師傅", method: "神經網絡 + 貝葉斯推論", desc: "深度學習模式識別結合概率更新。" },
      { name: "Phoenix Trend 鳳凰趨勢", method: "時間序列 + 動量分析", desc: "使用 ARIMA 模型和動量指標進行趨勢分析。" },
      { name: "Tiger Volatility 虎王波動", method: "波動聚集 + GARCH", desc: "通過波動率建模識別冷熱號碼集群。" },
      { name: "Elon 伊隆", method: "膽拖策略", desc: "選擇錨定號碼並通過數學優化擴展覆蓋範圍。" },
      { name: "God of Gambling 賭神", method: "馬爾可夫鏈", desc: "轉移概率矩陣預測下一期分佈。" },
      { name: "Aladdin 阿拉丁", method: "幾何概率", desc: "空間分佈模型實現均衡號碼選擇。" },
      { name: "Lucky Star 幸運星", method: "泊松分佈", desc: "基於頻率的建模用於罕見事件預測。" },
      { name: "Achelois 月光女神", method: "斐波那契 + 黃金比例", desc: "自然序列模式應用於號碼間距分析。" },
    ],
    m6Disclaimer: "AI 預測僅供娛樂參考。過往開獎記錄不保證未來結果。",
    downloadM6Guide: "下載：AI 六合彩分析指南 (PDF)",
  },
  sc: {
    tabStock: "股票 AI",
    tabMark6: "Mark6 AI",

    heroTitle: "运作方式",
    heroSub: "从输入代码到完整 AI 报告，只需 4 个简单步骤",

    step1Title: "输入股票代码",
    step1Desc: "在搜索框输入港、台、美股代码（例如：0001.HK、2330.TW、NVDA）。",
    step2Title: "获取实时数据",
    step2Desc: "系统自动对接 Yahoo Finance，获取最准确的实时报价与公司名称。",
    step3Title: "生成 AI 报告",
    step3Desc: "点击「Generate Report」按钮，让 AI 进行技术指标与概率分析。",
    step4Title: "下载与分享",
    step4Desc: "获取完整 PDF 报告，包含 AI 评级、目标价与风险评估。",

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

    m6Hero: "AI 游戏逻辑",
    m6Sub: "运用统计学与概率论 — 非纯随机抽样",
    m6Step1Title: "选择 AI 伙伴",
    m6Step1Desc: "从 8 个独特 AI 模型中选择，每个都有不同的数学方法（如 Elon 的胆拖策略、Dragon Master 的神经网络）。",
    m6Step2Title: "50 万次模拟",
    m6Step2Desc: "AI 分析近 100+ 期开奖记录，运用统计模型与概率论进行 50 万次蒙特卡洛模拟。",
    m6Step3Title: "获取 10 组号码",
    m6Step3Desc: "收到您的专属预测报告，包含 10 组推荐号码、频率分析与信心指数。",
    m6MethodTitle: "我们的数学模型",
    m6MethodSub: "每位 AI 伙伴使用不同的统计方法论",
    m6Models: [
      { name: "Dragon Master 龙师傅", method: "神经网络 + 贝叶斯推论", desc: "深度学习模式识别结合概率更新。" },
      { name: "Phoenix Trend 凤凰趋势", method: "时间序列 + 动量分析", desc: "使用 ARIMA 模型和动量指标进行趋势分析。" },
      { name: "Tiger Volatility 虎王波动", method: "波动聚集 + GARCH", desc: "通过波动率建模识别冷热号码集群。" },
      { name: "Elon 伊隆", method: "胆拖策略", desc: "选择锚定号码并通过数学优化扩展覆盖范围。" },
      { name: "God of Gambling 赌神", method: "马尔可夫链", desc: "转移概率矩阵预测下一期分布。" },
      { name: "Aladdin 阿拉丁", method: "几何概率", desc: "空间分布模型实现均衡号码选择。" },
      { name: "Lucky Star 幸运星", method: "泊松分布", desc: "基于频率的建模用于罕见事件预测。" },
      { name: "Achelois 月光女神", method: "斐波那契 + 黄金比例", desc: "自然序列模式应用于号码间距分析。" },
    ],
    m6Disclaimer: "AI 预测仅供娱乐参考。过往开奖记录不保证未来结果。",
    downloadM6Guide: "下载：AI 六合彩分析指南 (PDF)",
  },
};

const stepIcons = [Search, Wifi, Brain, Download];
const stepColors = [
  "from-amber-500/20 to-yellow-500/10",
  "from-emerald-500/20 to-green-500/10",
  "from-violet-500/20 to-purple-500/10",
  "from-rose-500/20 to-red-500/10",
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-16">
        {/* ── Hero ── */}
        <section className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold italic text-accent">{c.heroTitle}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{c.heroSub}</p>
        </section>

        {/* ── Tab Toggle ── */}
        <section className="flex justify-center">
          <div className="inline-flex rounded-full border border-border bg-card/60 p-1 gap-1">
            <button
              onClick={() => setActiveTab("stock")}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "stock" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
            >
              <TrendingUp size={14} className="inline mr-1.5 -mt-0.5" />
              {c.tabStock}
            </button>
            <button
              onClick={() => setActiveTab("mark6")}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "mark6" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Dice5 size={14} className="inline mr-1.5 -mt-0.5" />
              {c.tabMark6}
            </button>
          </div>
        </section>

        {activeTab === "stock" ? (
          <>
            {/* ── 4 Steps ── */}
            <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {steps.map((step, i) => {
                const Icon = stepIcons[i];
                return (
                  <div key={i} className={`relative rounded-xl border border-border bg-gradient-to-b ${stepColors[i]} p-6 space-y-4 hover:border-primary/40 hover:shadow-[0_0_24px_-6px_hsl(var(--primary)/0.25)] transition-all duration-300`}>
                    <div className="absolute -top-3 -left-2 h-7 w-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-lg">{i + 1}</div>
                    <div className={`h-12 w-12 rounded-xl bg-card/80 flex items-center justify-center ${stepAccents[i]}`}><Icon size={24} /></div>
                    <h3 className="font-bold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    {i < 3 && <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-primary/40"><ArrowRight size={20} /></div>}
                  </div>
                );
              })}
            </section>

            {/* ── PDF Download ── */}
            <section className="flex justify-center">
              <a href="/AI_Stock_Report_Guidelines.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 px-8 py-4 text-primary font-semibold hover:bg-primary/20 hover:shadow-[0_0_30px_-6px_hsl(var(--primary)/0.3)] transition-all duration-300 group">
                <FileText size={22} className="group-hover:scale-110 transition-transform" />
                {c.downloadGuide}
                <Download size={18} />
              </a>
            </section>

            {/* ── Why DragonGP ── */}
            <section className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl md:text-3xl font-extrabold italic text-accent">{c.whyTitle}</h2>
                <p className="text-muted-foreground">{c.whySub}</p>
              </div>
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-2">
                  <div className="px-5 py-3 bg-destructive/10 border-b border-r border-border">
                    <div className="flex items-center gap-2 text-sm font-bold text-destructive"><XCircle size={16} />{c.problemTitle}</div>
                  </div>
                  <div className="px-5 py-3 bg-emerald-500/10 border-b border-border">
                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-400"><CheckCircle size={16} />{c.solutionTitle}</div>
                  </div>
                </div>
                {comparisons.map((row, i) => (
                  <div key={i} className={`grid grid-cols-2 ${i < comparisons.length - 1 ? "border-b border-border" : ""}`}>
                    <div className="px-5 py-3 border-r border-border text-sm text-muted-foreground flex items-center gap-2"><XCircle size={14} className="text-destructive/60 shrink-0" />{row.prob}</div>
                    <div className="px-5 py-3 text-sm text-foreground flex items-center gap-2"><CheckCircle size={14} className="text-emerald-400 shrink-0" />{row.sol}</div>
                  </div>
                ))}
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: <Zap size={20} />, label: lang === "en" ? "Instant Reports" : "即時報告", accent: "text-amber-400" },
                  { icon: <Shield size={20} />, label: lang === "en" ? "Accurate Data" : "準確數據", accent: "text-emerald-400" },
                  { icon: <Clock size={20} />, label: lang === "en" ? "Multi-Market" : "多市場覆蓋", accent: "text-violet-400" },
                ].map((feat) => (
                  <div key={feat.label} className="rounded-xl border border-border bg-card/40 p-4 flex items-center gap-3 hover:border-primary/30 transition-colors">
                    <div className={`h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center ${feat.accent}`}>{feat.icon}</div>
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
              <h2 className="text-2xl md:text-3xl font-extrabold italic text-accent">{c.m6Hero}</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">{c.m6Sub}</p>
            </section>

            {/* 3 Steps */}
            <section className="grid sm:grid-cols-3 gap-5">
              {m6Steps.map((step, i) => {
                const Icon = m6StepIcons[i];
                return (
                  <div key={i} className="relative rounded-xl border border-border bg-gradient-to-b from-primary/10 to-transparent p-6 space-y-4 hover:border-primary/40 transition-all duration-300">
                    <div className="absolute -top-3 -left-2 h-7 w-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-lg">{i + 1}</div>
                    <div className={`h-12 w-12 rounded-xl bg-card/80 flex items-center justify-center ${m6StepAccents[i]}`}><Icon size={24} /></div>
                    <h3 className="font-bold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    {i < 2 && <div className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-primary/40"><ArrowRight size={20} /></div>}
                  </div>
                );
              })}
            </section>

            {/* Models grid */}
            <section className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-extrabold text-accent">{c.m6MethodTitle}</h3>
                <p className="text-sm text-muted-foreground">{c.m6MethodSub}</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {c.m6Models.map((m) => (
                  <div key={m.name} className="rounded-xl border border-border bg-card/40 p-4 space-y-2 hover:border-primary/30 transition-colors">
                    <h4 className="text-sm font-bold text-foreground">{m.name}</h4>
                    <p className="text-xs font-semibold text-primary">{m.method}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* PDF Download */}
            <section className="flex justify-center">
              <a href="/AI_Mark6_Analysis_Guide.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 px-8 py-4 text-primary font-semibold hover:bg-primary/20 hover:shadow-[0_0_30px_-6px_hsl(var(--primary)/0.3)] transition-all duration-300 group">
                <FileText size={22} className="group-hover:scale-110 transition-transform" />
                {c.downloadM6Guide}
                <Download size={18} />
              </a>
            </section>

            {/* Disclaimer */}
            <section className="flex justify-center">
              <div className="rounded-xl border border-primary/30 bg-card/50 p-3 flex items-start gap-2 max-w-lg">
                <Shield className="text-primary shrink-0 mt-0.5" size={16} />
                <p className="text-[11px] text-muted-foreground leading-relaxed">{c.m6Disclaimer}</p>
              </div>
            </section>
          </>
        )}

        {/* ── CTA ── */}
        <section className="text-center space-y-4 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-10">
          <Sparkles className="mx-auto text-primary" size={32} />
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">{c.ctaTitle}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">{c.ctaSub}</p>
          <Link to={activeTab === "stock" ? "/ai-stocks" : "/ai-games"} className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground hover:bg-primary/90 shadow-[0_0_24px_-4px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_32px_-4px_hsl(var(--primary)/0.5)] transition-all duration-300">
            {c.ctaButton}
            <ArrowRight size={18} />
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
