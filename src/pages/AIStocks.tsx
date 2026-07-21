import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage, type LangKey } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/hooks/useCredits";
import { Search, Star, Shield, Coins, Loader2, Mic, Speaker, Plus, X, Play, Pause, StopCircle, FileText, Upload, Link as LinkIcon } from "lucide-react";
import yearOfHorse from "@/assets/year-of-horse.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import InsufficientCreditsModal from "@/components/InsufficientCreditsModal";
import MarketIndices from "@/components/ai-stocks/MarketIndices";
import StockReport, { type ReportData } from "@/components/ai-stocks/StockReport";
import ReportActionBar from "@/components/ai-stocks/ReportActionBar";
import { useStockData, type LiveStockData } from "@/hooks/useStockData";

// Voice service imports
import { 
  isSpeechRecognitionSupported, 
  getSpeechRecognition, 
  speakText, 
  stopSpeaking,
  parseAnalysisForSpeech,
  cleanTextForSpeech
} from "@/services/voiceService";

/* ── Unified Language Map ────────────────────────── */
const UNIFIED_LANGUAGES = {
  en: { 
    ui: "en", 
    voice: "en-US", 
    stt: "en-US", 
    label: "English",
    uiLabel: "English"
  },
  hk: { 
    ui: "tc",
    voice: "zh-HK", 
    stt: "zh-HK", 
    label: "廣東話",
    uiLabel: "繁體中文"
  },
  cn: { 
    ui: "sc",
    voice: "zh-CN", 
    stt: "zh-CN", 
    label: "國語",
    uiLabel: "简体中文"
  },
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
    urlPlaceholder: "Enter URL for analysis...",
    loadUrl: "Load",
    uploadFile: "Upload file...",
    copy: "Copy",
    analysisResult: "Analysis Result",
    analyzing: "Analyzing...",
    speak: "Speak Analysis",
    pause: "Pause",
    resume: "Resume",
    stop: "Stop Speaking",
    recording: "Recording...",
    clickToRecord: "Click to record voice input",
    languageLabel: "Language",
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
    urlPlaceholder: "輸入網址進行分析...",
    loadUrl: "載入",
    uploadFile: "上傳文件...",
    copy: "複製",
    analysisResult: "分析結果",
    analyzing: "分析中...",
    speak: "語音朗讀",
    pause: "暫停",
    resume: "繼續",
    stop: "停止朗讀",
    recording: "錄音中...",
    clickToRecord: "點擊開始語音輸入",
    languageLabel: "語言",
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
    urlPlaceholder: "输入网址进行分析...",
    loadUrl: "加载",
    uploadFile: "上传文件...",
    copy: "复制",
    analysisResult: "分析结果",
    analyzing: "分析中...",
    speak: "语音朗读",
    pause: "暂停",
    resume: "继续",
    stop: "停止朗读",
    recording: "录音中...",
    clickToRecord: "点击开始语音输入",
    languageLabel: "语言",
  },
};

/* ── Language options ──── */
const UNIFIED_LANG_OPTIONS = [
  { key: "en", label: "English" },
  { key: "hk", label: "廣東話" },
  { key: "cn", label: "國語" },
];

/* ── Detect market from ticker ────────────────── */
const detectMarket = (ticker: string): string => {
  const upper = ticker.toUpperCase();
  if (upper.endsWith(".HK")) return "hk";
  if (upper.endsWith(".TW")) return "tw";
  return "us";
};

/* ── Parse analysis text from Edge Function ──── */
const parseAnalysisToReport = (analysisText: string, ticker: string, lang: LangKey): ReportData | null => {
  try {
    const lines = analysisText.split('\n');
    const report: any = {
      ticker: ticker,
      companyName: ticker,
      date: new Date().toISOString().split('T')[0],
      price: 'N/A',
      priceChange: 'N/A',
      priceUp: true,
      weekHigh: 'N/A',
      weekLow: 'N/A',
      volume: 'N/A',
      rsi: 50,
      rsiStatus: 'Neutral',
      macdLine: 'N/A',
      signalLine: 'N/A',
      histogram: 'N/A',
      macdStatus: 'Neutral',
      probability: 50,
      buyTarget: 'N/A',
      sellTarget: 'N/A',
      buyPct: 33,
      holdPct: 34,
      sellPct: 33,
      recommendation: 'Hold',
      bullPoints: [],
      bearPoints: [],
      dividendYield: 'N/A',
      volatility: 'Moderate',
      conservativeAdvice: lang === 'en' ? 'Maintain existing positions with tight risk management.' : 
                          lang === 'tc' ? '維持現有倉位，嚴格風險管理。' : 
                          '维持现有仓位，严格风险管理。',
      valueAdvice: lang === 'en' ? 'Wait for clearer value signals before making decisions.' : 
                   lang === 'tc' ? '等待更清晰的價值信號再做決策。' : 
                   '等待更清晰的价值信号再做决策。',
      sentimentScore: 50,
      trendStrength: 50,
      executiveThesis: '',
      sector: 'N/A',
      industry: 'N/A',
      marketCap: 'N/A',
      peRatio: 'N/A',
      roe: 'N/A',
      riskAssessment: {
        market: [
          lang === 'en' ? 'Broad market volatility and geopolitical risks.' : 
          lang === 'tc' ? '大盤波動及地緣政治風險。' : 
          '大盘波动及地缘政治风险。'
        ],
        company: [
          lang === 'en' ? 'Company-specific risks including competition and regulatory changes.' : 
          lang === 'tc' ? '包括競爭和監管變化在內的個股風險。' : 
          '包括竞争和监管变化在内的个股风险。'
        ],
        model: [
          lang === 'en' ? 'AI models rely on historical data and mathematical projections.' : 
          lang === 'tc' ? 'AI模型依賴歷史數據和數學推算。' : 
          'AI模型依赖历史数据和数学推算。'
        ]
      },
      financialHealthScore: 50,
      debtToEquity: 0.5,
      cashFlowTrend: 'stable',
      bid: 0,
      ask: 0,
      bidSize: 0,
      askSize: 0,
      dayRange: 'N/A',
      marketState: 'CLOSED',
      currencySymbol: '$',
      previousCloseVolume: 'N/A',
      companyDescription: '',
      news: [],
      upcomingDividend: null,
    };

    // Extract company name
    const nameMatch = analysisText.match(/^([^(]+)\s*\(/);
    if (nameMatch) {
      report.companyName = nameMatch[1].trim();
    }

    // Extract price
    const priceMatch = analysisText.match(/目前股價|Current Price[:\s]+([^\s,]+)/);
    if (priceMatch) {
      report.price = priceMatch[1];
    }

    // Extract price change
    const changeMatch = analysisText.match(/日漲跌幅|Daily Change[:\s]+([^\s]+)/);
    if (changeMatch) {
      report.priceChange = changeMatch[1];
      report.priceUp = !changeMatch[1].startsWith('-');
    }

    // Extract RSI
    const rsiMatch = analysisText.match(/RSI[:\s]+([\d.]+)/);
    if (rsiMatch) {
      report.rsi = parseFloat(rsiMatch[1]);
    }

    // Extract RSI status
    const rsiStatusMatch = analysisText.match(/RSI[:\s]+[\d.]+\s*\(([^)]+)\)/);
    if (rsiStatusMatch) {
      report.rsiStatus = rsiStatusMatch[1];
    }

    // Extract MACD
    const macdMatch = analysisText.match(/MACD[:\s]+(看好|看淡|Bullish|Bearish|Neutral|中性)/);
    if (macdMatch) {
      const macdVal = macdMatch[1];
      if (macdVal === '看好' || macdVal === 'Bullish') report.macdStatus = 'Bullish';
      else if (macdVal === '看淡' || macdVal === 'Bearish') report.macdStatus = 'Bearish';
      else report.macdStatus = 'Neutral';
    }

    // Extract trend
    const trendMatch = analysisText.match(/趨勢|Trend[:\s]+(上升通道|下降通道|區間震盪|Uptrend|Downtrend|Sideways)/);
    if (trendMatch) {
      const trend = trendMatch[1];
      if (trend === '上升通道' || trend === 'Uptrend') report.trend = 'Uptrend';
      else if (trend === '下降通道' || trend === 'Downtrend') report.trend = 'Downtrend';
      else report.trend = 'Sideways';
    }

    // Extract Market Cap
    const capMatch = analysisText.match(/市值|Market Cap[:\s]+([^\s|]+)/);
    if (capMatch) {
      report.marketCap = capMatch[1];
    }

    // Extract P/E Ratio
    const peMatch = analysisText.match(/市盈率|P\/E[:\s]+([^\s|]+)/);
    if (peMatch) {
      report.peRatio = peMatch[1];
    }

    // Extract ROE
    const roeMatch = analysisText.match(/ROE[:\s]+([^\s|]+)/);
    if (roeMatch) {
      report.roe = roeMatch[1];
    }

    // Extract Debt/Equity
    const debtMatch = analysisText.match(/負債權益比|Debt\/Equity[:\s]+([\d.]+)%?/);
    if (debtMatch) {
      report.debtToEquity = parseFloat(debtMatch[1]) / 100 || 0.5;
    }

    // Extract Dividend Yield
    const divMatch = analysisText.match(/股息率|Dividend Yield[:\s]+([^\s|]+)/);
    if (divMatch) {
      report.dividendYield = divMatch[1];
    }

    // Extract Buy Target
    const targetMatch = analysisText.match(/目標價|Target Price[:\s]+([^\s]+)/);
    if (targetMatch) {
      report.buyTarget = targetMatch[1];
    }

    // Extract Stop Loss
    const stopMatch = analysisText.match(/止蝕位|Stop Loss[:\s]+([^\s]+)/);
    if (stopMatch) {
      report.sellTarget = stopMatch[1];
    }

    // Extract Recommendation
    const recMatch = analysisText.match(/建議|Recommendation[:\s]+([^\n]+)/);
    if (recMatch) {
      report.recommendation = recMatch[1].trim();
    }

    // Extract Confidence Score
    const confMatch = analysisText.match(/信心評分|Confidence Score[:\s]+([\d.]+)%/);
    if (confMatch) {
      report.confidenceScore = parseFloat(confMatch[1]);
    }

    // Extract Bullish Factors
    const bullSection = analysisText.match(/看好因素|Bullish Factors([\s\S]*?)(?=看淡因素|Bearish Factors|$)/);
    if (bullSection) {
      const points = bullSection[1].split('•').filter(p => p.trim());
      report.bullPoints = points.map(p => p.trim());
    }

    // Extract Bearish Factors
    const bearSection = analysisText.match(/看淡因素|Bearish Factors([\s\S]*?)(?=買賣建議|Trading Advice|$)/);
    if (bearSection) {
      const points = bearSection[1].split('•').filter(p => p.trim());
      report.bearPoints = points.map(p => p.trim());
    }

    // Extract Executive Thesis
    const thesisMatch = analysisText.match(/執行投資點|Executive Thesis([\s\S]*?)(?=\d\.|$)/);
    if (thesisMatch) {
      report.executiveThesis = thesisMatch[1].trim();
    }

    // Extract Sector
    const sectorMatch = analysisText.match(/板塊|Sector[:\s]+([^\n]+)/);
    if (sectorMatch) {
      report.sector = sectorMatch[1].trim();
    }

    // Extract Industry
    const industryMatch = analysisText.match(/行業|Industry[:\s]+([^\n]+)/);
    if (industryMatch) {
      report.industry = industryMatch[1].trim();
    }

    // Extract Day Range
    const rangeMatch = analysisText.match(/日內波幅|Day Range[:\s]+([^\s]+)\s*-\s*([^\s]+)/);
    if (rangeMatch) {
      report.dayRange = `${rangeMatch[1]} - ${rangeMatch[2]}`;
    }

    // Extract volatility
    const volMatch = analysisText.match(/波動率|Volatility[:\s]+([\d.]+%)/);
    if (volMatch) {
      report.volatility = volMatch[1];
    }

    return report;
  } catch (error) {
    console.error('Error parsing analysis:', error);
    return null;
  }
};

const AIStocks = () => {
  const { lang: contextLang, setLang: setContextLang } = useLanguage();
  const { user, subscription } = useAuth();
  const { credits, loading: creditsLoading } = useCredits();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeMarket, setActiveMarket] = useState("us");
  const [symbol, setSymbol] = useState("");
  const [report, setReport] = useState<ReportData | null>(null);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [activeTicker, setActiveTicker] = useState<string | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const [unifiedLang, setUnifiedLang] = useState<"en" | "hk" | "cn">(() => {
    if (contextLang === "tc") return "hk";
    if (contextLang === "sc") return "cn";
    return "en";
  });

  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [speechText, setSpeechText] = useState<string>("");
  const [autoSpeakTriggered, setAutoSpeakTriggered] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getUILang = (): LangKey => {
    return UNIFIED_LANGUAGES[unifiedLang].ui as LangKey;
  };

  const getVoiceLang = () => {
    return UNIFIED_LANGUAGES[unifiedLang].voice;
  };

  const getSTTLang = () => {
    return UNIFIED_LANGUAGES[unifiedLang].stt;
  };

  const currentUILang = getUILang();
  const t = labels[currentUILang];

  const hasAccess = subscription.subscribed || credits > 0 || creditsLoading;

  // Initialize speech recognition
  useEffect(() => {
    if (isSpeechRecognitionSupported()) {
      const SpeechRecognition = getSpeechRecognition();
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = getSTTLang();
      
      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setSymbol(transcript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
    
    window.speechSynthesis?.getVoices();
    window.speechSynthesis?.addEventListener('voiceschanged', () => {
      window.speechSynthesis.getVoices();
    });
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopSpeaking();
    };
  }, [unifiedLang]);

  // Auto-speak when report is generated
  useEffect(() => {
    if (report && speechText && !autoSpeakTriggered && !isSpeaking) {
      setAutoSpeakTriggered(true);
      setTimeout(() => {
        handleSpeak();
      }, 500);
    }
  }, [report, speechText]);

  // Auto-load report from ?symbol= query param
  useEffect(() => {
    const sym = searchParams.get("symbol");
    if (sym && user && hasAccess && !creditsLoading && !activeTicker) {
      const ticker = sym.toUpperCase();
      setSymbol(ticker);
      setActiveMarket(detectMarket(ticker));
      handleDirectAnalysis(ticker);
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

  const toggleRecording = () => {
    if (!isSpeechRecognitionSupported()) {
      toast({ 
        title: currentUILang === "en" ? "Not Supported" : currentUILang === "tc" ? "不支援" : "不支持",
        description: currentUILang === "en" ? "Speech recognition is not supported in this browser." : 
                    currentUILang === "tc" ? "此瀏覽器不支援語音識別。" : 
                    "此浏览器不支持语音识别。",
        variant: "destructive"
      });
      return;
    }
    
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.lang = getSTTLang();
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSpeak = () => {
    if (!speechText) return;
    
    if (isSpeaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
      return;
    }
    
    setIsSpeaking(true);
    const voiceLang = getVoiceLang();
    
    const sections = parseAnalysisForSpeech(speechText);
    const cleanedSections = sections.map(s => cleanTextForSpeech(s));
    const fullText = cleanedSections.join('. ');
    
    speakText(fullText, voiceLang as 'en-US' | 'zh-HK' | 'zh-CN');
    
    const checkSpeechEnd = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        setIsSpeaking(false);
        setIsPaused(false);
        clearInterval(checkSpeechEnd);
      }
    }, 500);
  };
  
  const handleStopSpeaking = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileInput(file);
      const filename = file.name.replace(/\.[^/.]+$/, '');
      setSymbol(filename);
    }
  };

  // Format report for speech
  const formatReportForSpeech = (reportData: ReportData, lang: LangKey): string => {
    const sections = [];
    const companyName = reportData.companyName || reportData.ticker;
    
    sections.push(`${companyName} (${reportData.ticker}) ${lang === 'en' ? 'Investment Analysis' : lang === 'tc' ? '投資分析' : '投资分析'}`);
    sections.push('');
    sections.push(`1. ${lang === 'en' ? 'Summary' : lang === 'tc' ? '摘要' : '摘要'}`);
    sections.push(`${lang === 'en' ? 'Current Price' : lang === 'tc' ? '目前股價' : '目前股价'}: ${reportData.price}, ${lang === 'en' ? 'Daily Change' : lang === 'tc' ? '日漲跌幅' : '日涨跌幅'}: ${reportData.priceChange}`);
    if (reportData.dayRange && reportData.dayRange !== 'N/A') {
      sections.push(`${lang === 'en' ? 'Day Range' : lang === 'tc' ? '日內波幅' : '日内波幅'}: ${reportData.dayRange}`);
    }
    sections.push(`RSI: ${reportData.rsi} (${reportData.rsiStatus})`);
    sections.push('');
    sections.push(`2. ${lang === 'en' ? 'Technical Analysis' : lang === 'tc' ? '技術分析' : '技术分析'}`);
    sections.push(`RSI(14): ${reportData.rsi} - ${reportData.rsiStatus}`);
    sections.push(`MACD: ${reportData.macdStatus}`);
    if (reportData.volatility && reportData.volatility !== 'N/A') {
      sections.push(`${lang === 'en' ? 'Volatility' : lang === 'tc' ? '波動率' : '波动率'}: ${reportData.volatility}`);
    }
    sections.push('');
    sections.push(`3. ${lang === 'en' ? 'Fundamental Analysis' : lang === 'tc' ? '基本面分析' : '基本面分析'}`);
    if (reportData.marketCap && reportData.marketCap !== 'N/A') sections.push(`${lang === 'en' ? 'Market Cap' : lang === 'tc' ? '市值' : '市值'}: ${reportData.marketCap}`);
    if (reportData.peRatio && reportData.peRatio !== 'N/A') sections.push(`${lang === 'en' ? 'P/E Ratio' : lang === 'tc' ? '市盈率' : '市盈率'}: ${reportData.peRatio}`);
    if (reportData.roe && reportData.roe !== 'N/A') sections.push(`ROE: ${reportData.roe}`);
    if (reportData.dividendYield && reportData.dividendYield !== 'N/A') sections.push(`${lang === 'en' ? 'Dividend Yield' : lang === 'tc' ? '股息率' : '股息率'}: ${reportData.dividendYield}`);
    sections.push('');
    sections.push(`4. ${lang === 'en' ? 'News & Risk Analysis' : lang === 'tc' ? '新聞與風險分析' : '新闻与风险分析'}`);
    sections.push(lang === 'en' ? 'No significant recent news available.' : lang === 'tc' ? '近期暫無重大相關新聞。' : '近期暂无重大相关新闻。');
    sections.push('');
    sections.push(`5. ${lang === 'en' ? 'Bullish Factors' : lang === 'tc' ? '看好因素' : '看好因素'}`);
    if (reportData.bullPoints && reportData.bullPoints.length > 0) {
      reportData.bullPoints.forEach(point => sections.push(`• ${point}`));
    } else {
      sections.push(lang === 'en' ? 'No significant bullish factors identified' : lang === 'tc' ? '暫無明顯看好因素' : '暂无明显看好因素');
    }
    sections.push('');
    sections.push(`6. ${lang === 'en' ? 'Bearish Factors' : lang === 'tc' ? '看淡因素' : '看淡因素'}`);
    if (reportData.bearPoints && reportData.bearPoints.length > 0) {
      reportData.bearPoints.forEach(point => sections.push(`• ${point}`));
    } else {
      sections.push(lang === 'en' ? 'No significant bearish factors identified' : lang === 'tc' ? '暫無明顯看淡因素' : '暂无明显看淡因素');
    }
    sections.push('');
    sections.push(`7. ${lang === 'en' ? 'Trading Advice' : lang === 'tc' ? '買賣建議' : '买卖建议'}`);
    sections.push(`${lang === 'en' ? 'Target Price' : lang === 'tc' ? '目標價' : '目标价'}: ${reportData.buyTarget}`);
    sections.push(`${lang === 'en' ? 'Stop Loss' : lang === 'tc' ? '止蝕位' : '止损位'}: ${reportData.sellTarget}`);
    sections.push('');
    sections.push(`8. ${lang === 'en' ? 'Final Recommendation & Risk Rating' : lang === 'tc' ? '最終建議及風險評級' : '最终建议及风险评级'}`);
    sections.push(`${lang === 'en' ? 'Recommendation' : lang === 'tc' ? '建議' : '建议'}: ${reportData.recommendation}`);
    sections.push(`${lang === 'en' ? 'Confidence Score' : lang === 'tc' ? '信心評分' : '信心评分'}: ${reportData.confidenceScore || 55}%`);
    sections.push('');
    sections.push(`⚠️ ${lang === 'en' ? 'This analysis is for reference only and does not constitute investment advice.' : lang === 'tc' ? '以上分析僅供參考，不構成投資建議。' : '以上分析仅供参考，不构成投资建议。'}`);
    
    return sections.join('\n');
  };

  const handleDirectAnalysis = async (ticker: string) => {
    setActiveTicker(ticker);
    setIsLoadingQuote(true);
    setAutoSpeakTriggered(false);

    try {
      let apiLanguage = 'English';
      if (currentUILang === 'tc') apiLanguage = 'Traditional Chinese';
      else if (currentUILang === 'sc') apiLanguage = 'Simplified Chinese';

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const response = await fetch(`${supabaseUrl}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          message: ticker,
          language: apiLanguage,
          userContent: urlInput || (fileInput ? await readFileContent(fileInput) : null),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.summary || 'Analysis failed');
      }

      setAnalysisResult(data.text);

      // Parse the analysis text
      const parsedReport = parseAnalysisToReport(data.text, ticker, currentUILang);
      
      if (parsedReport) {
        // Add additional data from the response
        if (data.price) {
          parsedReport.price = `${data.currency || '$'}${data.price.toFixed(2)}`;
        }
        if (data.changePercent !== undefined) {
          parsedReport.priceChange = `${data.changePercent > 0 ? '+' : ''}${data.changePercent.toFixed(2)}%`;
          parsedReport.priceUp = data.changePercent >= 0;
        }
        if (data.rsi) parsedReport.rsi = data.rsi;
        if (data.macd) parsedReport.macdStatus = data.macd;
        if (data.trend) parsedReport.trend = data.trend;
        
        // Add fundamentals from the response
        if (data.fundamentals) {
          const f = data.fundamentals;
          if (f.marketCap && f.marketCap !== 'N/A') parsedReport.marketCap = f.marketCap;
          if (f.peRatio) parsedReport.peRatio = `${f.peRatio.toFixed(2)}x`;
          if (f.roe) parsedReport.roe = `${f.roe.toFixed(2)}%`;
          if (f.debtRatio) parsedReport.debtToEquity = f.debtRatio / 100;
          if (f.dividendYield) parsedReport.dividendYield = `${f.dividendYield.toFixed(2)}%`;
          if (f.sector && f.sector !== 'N/A') parsedReport.sector = f.sector;
          if (f.industry && f.industry !== 'N/A') parsedReport.industry = f.industry;
          if (f.longName) parsedReport.companyName = f.longName;
        }

        // Add specific analysis data
        if (data.specificAnalysis) {
          const sa = data.specificAnalysis;
          if (sa.specificRecommendation) parsedReport.recommendation = sa.specificRecommendation;
          if (sa.targetPrice) parsedReport.buyTarget = `${data.currency || '$'}${sa.targetPrice.toFixed(2)}`;
          if (sa.stopLoss) parsedReport.sellTarget = `${data.currency || '$'}${sa.stopLoss.toFixed(2)}`;
          if (sa.confidenceScore) parsedReport.confidenceScore = sa.confidenceScore;
          
          if (sa.specificBullishFactors && sa.specificBullishFactors.length > 0) {
            parsedReport.bullPoints = sa.specificBullishFactors;
          }
          if (sa.specificBearishFactors && sa.specificBearishFactors.length > 0) {
            parsedReport.bearPoints = sa.specificBearishFactors;
          }
        }

        setReport(parsedReport as ReportData);
        const formattedText = formatReportForSpeech(parsedReport as ReportData, currentUILang);
        setSpeechText(formattedText);
      } else {
        // If parsing fails, create a basic report
        const basicReport: ReportData = {
          ticker: ticker,
          companyName: ticker,
          date: new Date().toISOString().split('T')[0],
          price: data.price ? `${data.currency || '$'}${data.price.toFixed(2)}` : 'N/A',
          priceChange: data.changePercent !== undefined ? `${data.changePercent > 0 ? '+' : ''}${data.changePercent.toFixed(2)}%` : 'N/A',
          priceUp: data.changePercent ? data.changePercent >= 0 : true,
          weekHigh: 'N/A',
          weekLow: 'N/A',
          volume: 'N/A',
          rsi: data.rsi || 50,
          rsiStatus: 'Neutral',
          macdLine: 'N/A',
          signalLine: 'N/A',
          histogram: 'N/A',
          macdStatus: data.macd || 'Neutral',
          probability: 50,
          buyTarget: data.specificAnalysis?.targetPrice ? `${data.currency || '$'}${data.specificAnalysis.targetPrice.toFixed(2)}` : 'N/A',
          sellTarget: data.specificAnalysis?.stopLoss ? `${data.currency || '$'}${data.specificAnalysis.stopLoss.toFixed(2)}` : 'N/A',
          buyPct: 33,
          holdPct: 34,
          sellPct: 33,
          recommendation: data.specificAnalysis?.specificRecommendation || 'Hold',
          bullPoints: data.specificAnalysis?.specificBullishFactors || [],
          bearPoints: data.specificAnalysis?.specificBearishFactors || [],
          dividendYield: data.fundamentals?.dividendYield ? `${data.fundamentals.dividendYield.toFixed(2)}%` : 'N/A',
          volatility: 'Moderate',
          conservativeAdvice: currentUILang === 'en' ? 'Maintain existing positions with tight risk management.' : 
                              currentUILang === 'tc' ? '維持現有倉位，嚴格風險管理。' : 
                              '维持现有仓位，严格风险管理。',
          valueAdvice: currentUILang === 'en' ? 'Wait for clearer value signals before making decisions.' : 
                       currentUILang === 'tc' ? '等待更清晰的價值信號再做決策。' : 
                       '等待更清晰的价值信号再做决策。',
          sentimentScore: 50,
          trendStrength: 50,
          executiveThesis: data.text ? data.text.substring(0, 500) : '',
          sector: data.fundamentals?.sector || 'N/A',
          industry: data.fundamentals?.industry || 'N/A',
          marketCap: data.fundamentals?.marketCap || 'N/A',
          peRatio: data.fundamentals?.peRatio ? `${data.fundamentals.peRatio.toFixed(2)}x` : 'N/A',
          roe: data.fundamentals?.roe ? `${data.fundamentals.roe.toFixed(2)}%` : 'N/A',
          riskAssessment: {
            market: [currentUILang === 'en' ? 'Broad market volatility and geopolitical risks.' : 
                     currentUILang === 'tc' ? '大盤波動及地緣政治風險。' : 
                     '大盘波动及地缘政治风险。'],
            company: [currentUILang === 'en' ? 'Company-specific risks including competition and regulatory changes.' : 
                      currentUILang === 'tc' ? '包括競爭和監管變化在內的個股風險。' : 
                      '包括竞争和监管变化在内的个股风险。'],
            model: [currentUILang === 'en' ? 'AI models rely on historical data and mathematical projections.' : 
                    currentUILang === 'tc' ? 'AI模型依賴歷史數據和數學推算。' : 
                    'AI模型依赖历史数据和数学推算。']
          },
          financialHealthScore: 50,
          debtToEquity: data.fundamentals?.debtRatio ? data.fundamentals.debtRatio / 100 : 0.5,
          cashFlowTrend: 'stable',
          bid: 0,
          ask: 0,
          bidSize: 0,
          askSize: 0,
          dayRange: 'N/A',
          marketState: 'CLOSED',
          currencySymbol: data.currency || '$',
          previousCloseVolume: 'N/A',
          companyDescription: '',
          news: [],
          upcomingDividend: null,
        };
        setReport(basicReport);
        const formattedText = formatReportForSpeech(basicReport, currentUILang);
        setSpeechText(formattedText);
      }

      setSearchParams({ symbol: ticker }, { replace: true });

      if (user) {
        await supabase.from("analysis_history").insert({
          user_id: user.id,
          report_type: "stock",
          model_used: "AI Stock Engine",
          symbol: ticker,
          status: "completed",
          report_data: { analysis: data.text } as any,
        });
      }

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: currentUILang === 'en' ? 'Analysis Failed' : currentUILang === 'tc' ? '分析失敗' : '分析失败',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const handleAnalyze = () => {
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
    
    if (!hasAccess) { 
      setShowCreditsModal(true); 
      return; 
    }
    
    handleDirectAnalysis(ticker);
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
    setSpeechText("");
    setAnalysisResult(null);
    setAutoSpeakTriggered(false);
    stopSpeaking();
    setIsSpeaking(false);
    setIsPaused(false);
    setSearchParams({}, { replace: true }); 
  };

  const handleLanguageChange = (newLang: "en" | "hk" | "cn") => {
    setUnifiedLang(newLang);
    const uiLang = UNIFIED_LANGUAGES[newLang].ui as LangKey;
    setContextLang(uiLang);
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
                    <Link to="/pricing" className="inline-flex items-center gap-1.5 rounded-full btn-gold px-5 py-2 text-sm transition-colors shadow-sm">
                      ⚡ {t.topUp}
                    </Link>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t.languageLabel}:</span>
                  {UNIFIED_LANG_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => handleLanguageChange(opt.key as "en" | "hk" | "cn")}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        unifiedLang === opt.key
                          ? "bg-gold text-navy shadow-md"
                          : "text-muted-foreground hover:text-navy hover:bg-gold-light"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
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
                      {m.label[currentUILang]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {!report && (
          <section className="max-w-3xl w-full mx-auto px-6 mb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="p-2.5 rounded-lg bg-white/80 hover:bg-white border border-gold/30 transition-colors"
                title={currentUILang === "en" ? "Add URL or File" : currentUILang === "tc" ? "加入網址或檔案" : "加入网址或文件"}
              >
                <Plus size={18} className="text-gold" />
              </button>

              <div className="flex-1 flex items-center rounded-xl px-3 py-2 transition-all border-2 border-[#D4AF37] bg-white focus-within:shadow-[0_0_12px_rgba(212,175,55,0.35)] focus-within:bg-[#FFFDF5]">
                <button
                  onClick={toggleRecording}
                  className={`p-1.5 rounded-full transition-colors mr-2 ${
                    isRecording ? 'bg-red-500 animate-pulse' : 'hover:bg-gold-light'
                  }`}
                  title={isRecording ? t.recording : t.clickToRecord}
                >
                  <Mic size={18} className={isRecording ? "text-white" : "text-gold"} />
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  placeholder={t.placeholder}
                  className="flex-1 bg-transparent text-base text-navy placeholder:text-muted-foreground outline-none"
                />

                <button
                  onClick={() => {
                    if (report) {
                      handleSpeak();
                    } else {
                      handleAnalyze();
                    }
                  }}
                  className="p-1.5 rounded-full hover:bg-gold-light transition-colors ml-2"
                  title={t.speak}
                >
                  <Speaker size={18} className="text-gold" />
                </button>

                {isSpeaking && (
                  <button
                    onClick={handleStopSpeaking}
                    className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors ml-1"
                    title={t.stop}
                  >
                    <StopCircle size={18} className="text-red-500" />
                  </button>
                )}
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isLoadingQuote || !symbol.trim()}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isLoadingQuote || !symbol.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'btn-gold shadow-md hover:shadow-lg'
                }`}
              >
                {isLoadingQuote ? t.analyzing : t.analyze}
              </button>
            </div>

            {showUrlInput && (
              <div className="flex items-center gap-2 mt-3 p-3 bg-white/80 rounded-xl border border-gold/30">
                <LinkIcon size={16} className="text-gold" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={t.urlPlaceholder}
                  className="flex-1 bg-transparent text-sm text-navy placeholder:text-muted-foreground outline-none"
                />
                <button
                  onClick={() => setUrlInput('')}
                  className="p-1 hover:bg-gold-light rounded-lg"
                >
                  <X size={14} className="text-muted-foreground" />
                </button>
                <button
                  onClick={() => {
                    if (urlInput.trim()) {
                      setSymbol(urlInput);
                      handleAnalyze();
                    }
                  }}
                  className="px-3 py-1 bg-gold/30 hover:bg-gold/50 rounded-lg text-navy text-sm font-medium transition-colors"
                >
                  {t.loadUrl}
                </button>
              </div>
            )}

            <div className="mt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-muted-foreground hover:text-navy text-sm transition-colors"
              >
                <Upload size={14} />
                {t.uploadFile}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              {fileInput && (
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <FileText size={14} />
                  <span>{fileInput.name}</span>
                  <button
                    onClick={() => setFileInput(null)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <p className="text-muted-foreground text-sm mt-2">
              <span className="font-semibold text-foreground">{t.examples}</span> {t.exampleTickers}
            </p>
          </section>
        )}

        {!report && !isLoadingQuote && (
          <section className="max-w-3xl w-full mx-auto px-6 mb-10">
            <div className="text-center space-y-4 pt-4">
              <Link
                to="/watchlist"
                className="inline-flex items-center gap-2 text-gold-dark hover:text-gold transition-colors text-sm border border-gold/30 rounded-full px-5 py-2"
              >
                <Star size={16} className="fill-gold text-gold" /> {t.watchlist}
              </Link>
            </div>
          </section>
        )}

        {isLoadingQuote && !report && (
          <section className="max-w-3xl w-full mx-auto px-6 mb-12 flex flex-col items-center gap-4 py-20">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p className="text-muted-foreground text-sm">Fetching live market data...</p>
          </section>
        )}

        {report && (
          <section className="max-w-3xl w-full mx-auto px-6 mb-12 space-y-6">
            <StockReport
              report={report}
              lang={currentUILang}
              inWatchlist={inWatchlist}
              onAddWatchlist={handleAddWatchlist}
            />
            
            <div className="bg-white/80 rounded-xl p-6 border border-gold/30 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-navy">
                  {currentUILang === 'en' ? '📢 Text-to-Voice Report' : currentUILang === 'tc' ? '📢 語音報告' : '📢 语音报告'}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleSpeak}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      isSpeaking
                        ? isPaused
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gold text-navy hover:bg-gold-dark'
                    }`}
                  >
                    {isSpeaking ? (
                      isPaused ? <Play size={16} /> : <Pause size={16} />
                    ) : (
                      <Speaker size={16} />
                    )}
                    {isSpeaking ? (isPaused ? t.resume : t.pause) : t.speak}
                  </button>
                  {isSpeaking && (
                    <button
                      onClick={handleStopSpeaking}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all flex items-center gap-2"
                    >
                      <StopCircle size={16} />
                      {t.stop}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-mono text-sm text-navy leading-relaxed">
                  {speechText || formatReportForSpeech(report, currentUILang)}
                </pre>
              </div>
              
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-gold/20 rounded-full">
                  {currentUILang === 'en' ? 'Language' : currentUILang === 'tc' ? '語言' : '语言'}: {UNIFIED_LANG_OPTIONS.find(o => o.key === unifiedLang)?.label}
                </span>
                <span className="px-2 py-1 bg-gold/20 rounded-full">
                  {currentUILang === 'en' ? 'Status' : currentUILang === 'tc' ? '狀態' : '状态'}: {isSpeaking ? (isPaused ? '⏸️ Paused' : '🔊 Speaking') : '🔇 Idle'}
                </span>
              </div>
            </div>
            
            <ReportActionBar lang={currentUILang} ticker={report.ticker} market={activeMarket} onReset={handleReset} inWatchlist={inWatchlist} onAddWatchlist={handleAddWatchlist} />
          </section>
        )}

        <div className="max-w-3xl mx-auto px-6 mb-8">
          <div className="rounded-xl gold-card p-3 flex items-start gap-2">
            <Shield className="text-gold shrink-0 mt-0.5" size={16} />
            <p className="text-[11px] text-muted-foreground leading-relaxed">{t.disclaimer}</p>
          </div>
        </div>

        {!report && <MarketIndices lang={currentUILang} />}
      </main>

      <Footer />
    </div>
  );
};

export default AIStocks;