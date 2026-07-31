import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage, type LangKey } from "@/contexts/LanguageContext";
import type { CharacterModel, CharacterConfig } from "./mark6-data";
import { getBallColor } from "./mark6-data";
import { Printer, ArrowLeft, TrendingUp, MessageCircle, Shield, AlertTriangle, Settings2, Download, Facebook, Copy, Check, Share2, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts";
import { toast } from "sonner";

// ── Voice service imports ──
import { speakText, stopSpeaking } from "@/services/voiceService";

// ── IMPORT ALL IMAGES FIRST ──
import dragonImg from "@/assets/dragon-master.png";
import phoenixImg from "@/assets/phoenix-trend.png";
import tigerImg from "@/assets/tiger-volatility.png";
import elonImg from "@/assets/elon-v2.png";
import gamblingImg from "@/assets/gambling-v2.png";
import aladdinImg from "@/assets/aladdin-v2.png";
import luckyStarImg from "@/assets/lucky-star-v2.png";
import acheloisImg from "@/assets/achelois-v2.png";

// ── DEFINE avatarMap AFTER ALL IMPORTS ──
const avatarMap: Record<string, string> = {
  "dragon-master": dragonImg,
  "phoenix-trend": phoenixImg,
  "tiger-volatility": tigerImg,
  "elon-v2": elonImg,
  "gambling-v2": gamblingImg,
  "aladdin-v2": aladdinImg,
  "lucky-star-v2": luckyStarImg,
  "achelois-v2": acheloisImg,
};

const labels = {
  en: {
    prediction: "'s Strategic Prediction",
    methodology: "Methodology",
    description: "By running advanced mathematical models, this AI partner identifies number clusters with the highest statistical probability.",
    simPower: "Simulation Power",
    basedOn: "Based on the last 100 lucky draw results",
    freqTitle: "📊 Number Frequency Analysis",
    freqDesc: "Distribution of predicted numbers across all 10 sets",
    warning: "⚠️ Gambling is harmful to health. This is purely an AI mathematical exercise. Please do not take it seriously or become addicted. We are not responsible for any consequences.",
    print: "Print Report",
    share: "Share",
    shareWhatsApp: "Share",
    shareFacebook: "Share",
    shareLine: "Share",
    copyReport: "Copy Report",
    copied: "Copied!",
    copyText: "Copy Text",
    saveAsText: "Save as Text",
    returnGame: "Return to Game",
    goStocks: "Go to AI Stocks Probability",
    red: "Red (紅/红)",
    blue: "Blue (藍/蓝)",
    green: "Green (綠/绿)",
    langTabs: ["English", "廣東話", "國語"],
    configSummary: "⚙️ Configuration Summary",
    activeChar: "Active Character",
    selectedBankers: "Selected Bankers (膽)",
    mathModule: "Mathematical Module",
    selectedPattern: "Selected Pattern",
    selectedDist: "Distribution Mode",
    selectedColor: "Selected Color",
    configAuto: "Automatic — Monte Carlo Simulation",
    configNone: "No user config — AI autonomous analysis",
    hot: "Hot Number Momentum",
    cold: "Cold Number Breakout",
    bankerLabel: "Banker & Leg Strategy",
    constrainedLabel: "★ Banker",
    noCharacter: "No character selected",
    goBack: "Go Back",
    setLabel: "Set",
    saved: "Report saved as text file!",
    facebookShared: "Shared to Facebook!",
    whatsappShared: "Shared to WhatsApp!",
    lineShared: "Shared to Line!",
    copiedToClipboard: "Copied to clipboard!",
    shareTitle: "Share Report",
    voiceEnabled: "Voice enabled",
    voiceDisabled: "Voice disabled",
    speaking: "Speaking...",
  },
  tc: {
    prediction: " 的戰略預測",
    methodology: "方法論",
    description: "通過運行先進的數學模型，此 AI 夥伴識別具有最高統計概率的號碼組合。",
    simPower: "模擬強度",
    basedOn: "基於最近 100 期攪珠結果",
    freqTitle: "📊 號碼頻率分析",
    freqDesc: "所有 10 組預測號碼的分佈",
    warning: "⚠️ 賭博有害健康。本網站純粹為 AI 數學練習。請勿認真對待或沉迷。我們不對任何後果負責。",
    print: "列印報告",
    share: "分享",
    shareWhatsApp: "分享",
    shareFacebook: "分享",
    shareLine: "分享",
    copyReport: "複製報告",
    copied: "已複製！",
    copyText: "複製文字",
    saveAsText: "儲存為文字",
    returnGame: "返回遊戲",
    goStocks: "前往 AI 股票概率",
    red: "紅",
    blue: "藍",
    green: "綠",
    langTabs: ["English", "廣東話", "國語"],
    configSummary: "⚙️ 配置摘要",
    activeChar: "活躍角色",
    selectedBankers: "已選膽碼 (膽)",
    mathModule: "數學模組",
    selectedPattern: "已選模式",
    selectedDist: "分佈模式",
    selectedColor: "已選顏色",
    configAuto: "自動 — 蒙特卡羅模擬",
    configNone: "無用戶配置 — AI 自主分析",
    hot: "熱門號碼動量",
    cold: "冷門號碼突破",
    bankerLabel: "膽拖策略",
    constrainedLabel: "★ 膽",
    noCharacter: "未選擇角色",
    goBack: "返回",
    setLabel: "組",
    saved: "報告已儲存為文字檔案！",
    facebookShared: "已分享到 Facebook！",
    whatsappShared: "已分享到 WhatsApp！",
    lineShared: "已分享到 Line！",
    copiedToClipboard: "已複製到剪貼板！",
    shareTitle: "分享報告",
    voiceEnabled: "語音已啟用",
    voiceDisabled: "語音已關閉",
    speaking: "朗讀中...",
  },
  sc: {
    prediction: " 的战略预测",
    methodology: "方法论",
    description: "通过运行先进的数学模型，此 AI 伙伴识别具有最高统计概率的号码组合。",
    simPower: "模拟强度",
    basedOn: "基于最近 100 期搅珠结果",
    freqTitle: "📊 号码频率分析",
    freqDesc: "所有 10 组预测号码的分布",
    warning: "⚠️ 赌博有害健康。本网站纯粹为 AI 数学练习。请勿认真对待或沉迷。我们不对任何后果负责。",
    print: "打印报告",
    share: "分享",
    shareWhatsApp: "分享",
    shareFacebook: "分享",
    shareLine: "分享",
    copyReport: "复制报告",
    copied: "已复制！",
    copyText: "复制文字",
    saveAsText: "保存为文本",
    returnGame: "返回游戏",
    goStocks: "前往 AI 股票概率",
    red: "红",
    blue: "蓝",
    green: "绿",
    langTabs: ["English", "廣東話", "國語"],
    configSummary: "⚙️ 配置摘要",
    activeChar: "活跃角色",
    selectedBankers: "已选胆码 (胆)",
    mathModule: "数学模组",
    selectedPattern: "已选模式",
    selectedDist: "分布模式",
    selectedColor: "已选颜色",
    configAuto: "自动 — 蒙特卡罗模拟",
    configNone: "无用户配置 — AI 自主分析",
    hot: "热门号码动量",
    cold: "冷门号码突破",
    bankerLabel: "胆拖策略",
    constrainedLabel: "★ 胆",
    noCharacter: "未选择角色",
    goBack: "返回",
    setLabel: "组",
    saved: "报告已保存为文本文件！",
    facebookShared: "已分享到 Facebook！",
    whatsappShared: "已分享到 WhatsApp！",
    lineShared: "已分享到 Line！",
    copiedToClipboard: "已复制到剪贴板！",
    shareTitle: "分享报告",
    voiceEnabled: "语音已启用",
    voiceDisabled: "语音已关闭",
    speaking: "朗读中...",
  },
};

/* ── Constrained number generation ── */

const REDS = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46];
const BLUES = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48];
const GREENS = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49];

/** Generate exactly 6 numbers per set */
const generatePredictions = (config: CharacterConfig): number[][] => {
  const bankerNums = config.type === "banker" ? config.bankerNumbers : [];
  const sets: number[][] = [];

  const shuffle = <T,>(arr: T[]): T[] => {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  for (let i = 0; i < 10; i++) {
    let nums: number[] = [...bankerNums];
    
    if (nums.length >= 6) {
      nums = nums.slice(0, 6);
      sets.push([...nums].sort((a, b) => a - b));
      continue;
    }

    const pool: number[] = [];
    for (let n = 1; n <= 49; n++) {
      if (!nums.includes(n)) pool.push(n);
    }

    let candidates: number[] = [];
    
    if (config.type === "pattern") {
      const hotNums = [12, 18, 36, 44, 46, 31, 22, 3, 7, 14, 27, 35];
      const coldNums = [43, 32, 25, 48, 47, 17, 4, 15, 20, 26];
      const patternPool = config.pattern === "hot" ? hotNums : coldNums;
      candidates = pool.filter(n => patternPool.includes(n));
      if (candidates.length < (6 - nums.length)) {
        const remaining = pool.filter(n => !candidates.includes(n));
        const shuffled = shuffle(remaining);
        const extra = shuffled.slice(0, (6 - nums.length) - candidates.length);
        candidates = [...candidates, ...extra];
      }
    } else if (config.type === "distribution") {
      const [firstTarget, secondTarget] = config.ratio.split("/").map(Number);
      const total = firstTarget + secondTarget;
      const needed = 6 - nums.length;
      const firstCount = Math.round((firstTarget / total) * needed);
      const secondCount = needed - firstCount;

      const firstPool = config.mode === "odd-even" ? pool.filter(n => n % 2 !== 0) : pool.filter(n => n >= 25);
      const secondPool = config.mode === "odd-even" ? pool.filter(n => n % 2 === 0) : pool.filter(n => n < 25);
      
      const shuffledFirst = shuffle(firstPool);
      const shuffledSecond = shuffle(secondPool);
      
      const pickedFirst = shuffledFirst.slice(0, Math.min(firstCount, shuffledFirst.length));
      const pickedSecond = shuffledSecond.slice(0, Math.min(secondCount, shuffledSecond.length));
      
      candidates = [...pickedFirst, ...pickedSecond];
      
      if (candidates.length < needed) {
        const remaining = pool.filter(n => !candidates.includes(n));
        const shuffled = shuffle(remaining);
        const extra = shuffled.slice(0, needed - candidates.length);
        candidates = [...candidates, ...extra];
      }
    } else if (config.type === "color") {
      if (config.colorRatio) {
        const [rTarget, bTarget, gTarget] = config.colorRatio.split(":").map(Number);
        const total = rTarget + bTarget + gTarget;
        const needed = 6 - nums.length;
        const rCount = Math.round((rTarget / total) * needed);
        const bCount = Math.round((bTarget / total) * needed);
        const gCount = needed - rCount - bCount;
        
        const rPool = pool.filter(n => REDS.includes(n));
        const bPool = pool.filter(n => BLUES.includes(n));
        const gPool = pool.filter(n => GREENS.includes(n));
        
        const shuffledR = shuffle(rPool);
        const shuffledB = shuffle(bPool);
        const shuffledG = shuffle(gPool);
        
        const pickedR = shuffledR.slice(0, Math.min(rCount, shuffledR.length));
        const pickedB = shuffledB.slice(0, Math.min(bCount, shuffledB.length));
        const pickedG = shuffledG.slice(0, Math.min(gCount, shuffledG.length));
        
        candidates = [...pickedR, ...pickedB, ...pickedG];
      } else {
        const colorArr = config.color === "red" ? REDS : config.color === "blue" ? BLUES : GREENS;
        const available = pool.filter(n => colorArr.includes(n));
        const shuffled = shuffle(available);
        const needed = Math.min(3, 6 - nums.length);
        candidates = shuffled.slice(0, needed);
      }
      
      if (candidates.length < (6 - nums.length)) {
        const remaining = pool.filter(n => !candidates.includes(n));
        const shuffled = shuffle(remaining);
        const extra = shuffled.slice(0, (6 - nums.length) - candidates.length);
        candidates = [...candidates, ...extra];
      }
    } else {
      const shuffled = shuffle(pool);
      candidates = shuffled.slice(0, 6 - nums.length);
    }

    for (const n of candidates) {
      if (nums.length < 6 && !nums.includes(n)) {
        nums.push(n);
      }
    }

    while (nums.length < 6) {
      const allNums: number[] = [];
      for (let n = 1; n <= 49; n++) {
        if (!nums.includes(n)) allNums.push(n);
      }
      const shuffled = shuffle(allNums);
      nums.push(shuffled[0]);
    }

    for (const b of bankerNums) {
      if (!nums.includes(b)) {
        const nonBankers = nums.filter(n => !bankerNums.includes(n));
        if (nonBankers.length > 0) {
          const idx = nums.indexOf(nonBankers[Math.floor(Math.random() * nonBankers.length)]);
          nums[idx] = b;
        }
      }
    }

    while (nums.length > 6) {
      const nonBankers = nums.filter(n => !bankerNums.includes(n));
      if (nonBankers.length > 0) {
        const idx = nums.indexOf(nonBankers[Math.floor(Math.random() * nonBankers.length)]);
        nums.splice(idx, 1);
      } else {
        nums.pop();
      }
    }

    sets.push([...nums].sort((a, b) => a - b));
  }
  return sets;
};

/** Get the set of "constrained" numbers that should be highlighted */
const getConstrainedNumbers = (config: CharacterConfig): Set<number> => {
  if (config.type === "banker") return new Set(config.bankerNumbers);
  return new Set();
};

/** Compute frequency across all sets */
const computeFreqFromSets = (sets: number[][]) => {
  const freq = new Map<number, number>();
  sets.flat().forEach((n) => freq.set(n, (freq.get(n) || 0) + 1));
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([num, count]) => ({ num, count }));
};

const getColor = (n: number) => {
  if (REDS.includes(n)) return "#ef4444";
  if (BLUES.includes(n)) return "#3b82f6";
  return "#22c55e";
};

/** Get a human-readable config description */
const getConfigDescription = (config: CharacterConfig, lang: LangKey): string => {
  const t = labels[lang];
  switch (config.type) {
    case "banker":
      return `${t.bankerLabel} — ${t.selectedBankers}: ${config.bankerNumbers.join(", ")}`;
    case "pattern":
      return config.pattern === "hot" ? t.hot : t.cold;
    case "auto":
      return t.configAuto;
    case "distribution":
      return `${t.selectedDist}: ${config.mode} (${config.ratio})`;
    case "color":
      return `${t.selectedColor}: ${config.color === "red" ? "🔴" : config.color === "blue" ? "🔵" : "🟢"} ${config.color}${config.colorRatio ? ` — R:B:G = ${config.colorRatio}` : ""}`;
    case "none":
    default:
      return t.configNone;
  }
};

interface Props {
  character: CharacterModel;
  config: CharacterConfig;
  onReset: () => void;
  initialPredictions?: number[][];
}

const langKeys: LangKey[] = ["en", "tc", "sc"];

const Mark6FullReport = ({ character, config, onReset, initialPredictions }: Props) => {
  const { lang, setLang } = useLanguage();
  const t = labels[lang];
  const [isCopied, setIsCopied] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // SAFETY CHECK: If character or config is undefined, show error state
  if (!character || !config) {
    return (
      <div className="max-w-3xl w-full mx-auto px-4 py-20 text-center">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8">
          <AlertTriangle className="text-red-400 w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">{t.noCharacter}</h2>
          <p className="text-[#f5e6c8]/60 mt-2 max-w-md mx-auto">
            {lang === "en" 
              ? "Please go back and select an AI partner to generate your prediction report." 
              : lang === "tc" 
                ? "請返回並選擇一個 AI 夥伴來生成您的預測報告。" 
                : "请返回并选择一个 AI 伙伴来生成您的预测报告。"}
          </p>
          <button 
            onClick={onReset}
            className="mt-6 px-6 py-2.5 rounded-full bg-[#d4af37] text-[#1a3a2a] font-bold hover:bg-[#f5e6a0] transition-colors"
          >
            {t.goBack}
          </button>
        </div>
      </div>
    );
  }

  // Get voice language based on UI language
  const getVoiceLang = (): string => {
    if (lang === 'tc') return 'zh-HK';
    if (lang === 'sc') return 'zh-CN';
    return 'en-US';
  };

  // Use initialPredictions if provided, otherwise generate new ones
  const [predictions, setPredictions] = useState<number[][]>(() => {
    if (initialPredictions && initialPredictions.length > 0) {
      return initialPredictions;
    }
    return generatePredictions(config);
  });
  
  const freqData = computeFreqFromSets(predictions);
  const constrainedNums = getConstrainedNumbers(config);
  const [showDragon, setShowDragon] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowDragon(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  // ── Speak Prediction Report ──
  const speakPredictionReport = () => {
    if (!voiceEnabled) return;
    
    stopSpeaking();
    
    const voiceLang = getVoiceLang();
    const charName = character.name?.[lang] || character.name?.en || character.id;
    const methodName = character.method?.[lang] || character.method?.en || '';
    const firstSet = predictions[0] || [];
    
    let message = '';
    if (lang === 'en') {
      message = `${charName} prediction report. Using ${methodName}. The first set of predicted numbers are: ${firstSet.join(', ')}. Good luck to you!`;
    } else if (lang === 'tc') {
      message = `${charName} 預測報告。使用 ${methodName}。第一組預測號碼是：${firstSet.join('、')}。祝您好運！`;
    } else {
      message = `${charName} 预测报告。使用 ${methodName}。第一组预测号码是：${firstSet.join('、')}。祝您好运！`;
    }

    setIsSpeaking(true);
    speakText(message, voiceLang as 'en-US' | 'zh-HK' | 'zh-CN');
    
    const checkSpeechEnd = setInterval(() => {
      if (!window.speechSynthesis || !window.speechSynthesis.speaking) {
        setIsSpeaking(false);
        clearInterval(checkSpeechEnd);
      }
    }, 500);
  };

  // ── Speak when component mounts ──
  useEffect(() => {
    if (voiceEnabled) {
      setTimeout(() => {
        speakPredictionReport();
      }, 800);
    }
  }, []);

  // ── Re-speak when language changes ──
  useEffect(() => {
    if (voiceEnabled) {
      stopSpeaking();
      setIsSpeaking(false);
      setTimeout(() => {
        speakPredictionReport();
      }, 500);
    }
  }, [lang]);

  // ── Share Text Generation ──
  const getShareText = () => {
    const isChinese = lang === 'tc' || lang === 'sc';
    const partnerName = character.name?.[lang] || character.name?.en || character.id;
    const dateStr = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'tc' ? 'zh-HK' : 'zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Build the prediction list
    const predictionsStr = predictions.map((set, idx) => {
      return `${isChinese ? `第${idx + 1}組` : `Set ${idx + 1}`}: ${set.join(' · ')}`;
    }).join('\n');
    
    // Get the top prediction (first set)
    const topPrediction = predictions[0]?.join(' · ') || '';
    
    // Get method
    const method = character.method?.[lang] || character.method?.en || '';
    
    // Build the full share text
    const parts = [];
    
    // 1. Character name and prediction intro
    parts.push(isChinese 
      ? `🎰 ${partnerName} 預測下一期幸運號碼：`
      : `🎰 ${partnerName} is predicting the lucky numbers for the next draw:`
    );
    parts.push('');
    
    // 2. Date
    parts.push(`${isChinese ? '📅 報告日期' : '📅 Report Date'}: ${dateStr}`);
    parts.push('');
    
    // 3. Top prediction (highlighted)
    parts.push(isChinese ? '⭐ 精選號碼組合：' : '⭐ Top Prediction:');
    parts.push(`[ ${topPrediction} ]`);
    parts.push('');
    
    // 4. All predictions
    parts.push(isChinese ? '📊 完整預測 (10組)：' : '📊 Full Predictions (10 sets):');
    parts.push(predictionsStr);
    parts.push('');
    
    // 5. Methodology
    parts.push(`${isChinese ? '🔬 方法論' : '🔬 Methodology'}: ${method}`);
    parts.push('');
    
    // 6. Powered by
    parts.push(isChinese ? '⚡ 由 DragonGP.AI 提供 AI 預測' : '⚡ Powered by DragonGP.AI');
    parts.push('🔗 https://dragongp.ai');
    
    return parts.join('\n');
  };

  // ── Share Handlers ──
  const handleFacebookShare = () => {
    // Copy text to clipboard first
    const shareText = getShareText();
    navigator.clipboard.writeText(shareText).then(() => {
      toast.success(t.copiedToClipboard || 'Copied to clipboard!');
      
      // Then open Facebook in a new tab
      const encodedUrl = encodeURIComponent(window.location.href);
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      window.open(fbUrl, '_blank');
    }).catch(() => {
      // If clipboard fails, just open Facebook
      const encodedUrl = encodeURIComponent(window.location.href);
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      window.open(fbUrl, '_blank');
      toast.info('Please paste the copied text into your Facebook post (Ctrl+V / Cmd+V)');
    });
  };

  const handleWhatsAppShare = () => {
    const shareText = getShareText();
    const encodedText = encodeURIComponent(shareText);
    const url = `https://wa.me/?text=${encodedText}`;
    window.open(url, '_blank');
    
    toast.success(t.whatsappShared || 'Shared to WhatsApp!');
  };

  // ── Line Share Handler ──
  const handleLineShare = () => {
    const shareText = getShareText();
    const encodedText = encodeURIComponent(shareText);
    
    // Line supports both mobile app and web
    // For mobile: line://msg/text/{text}
    // For web: https://line.me/R/share?text={text}
    const lineUrl = `https://line.me/R/share?text=${encodedText}`;
    
    // Try to open the Line app first (mobile)
    const lineAppUrl = `line://msg/text/${encodedText}`;
    
    // Check if on mobile by checking if the user agent is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Try to open Line app first, fallback to web
      const lineAppWindow = window.open(lineAppUrl, '_blank');
      if (!lineAppWindow) {
        window.open(lineUrl, '_blank');
      }
    } else {
      // On desktop, use web version
      window.open(lineUrl, '_blank');
    }
    
    toast.success(t.lineShared || 'Shared to Line!');
  };

  const handleCopyText = () => {
    const text = getShareText();
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      toast.success(t.copiedToClipboard || 'Copied to clipboard!');
      setTimeout(() => setIsCopied(false), 3000);
    }).catch(() => {
      // Fallback: copy using textarea
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setIsCopied(true);
      toast.success(t.copiedToClipboard || 'Copied to clipboard!');
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  const handlePrint = () => window.print();
  
  const handleSaveAsText = () => {
    const el = document.getElementById("mark6-full-report");
    if (!el) return;
    
    // Build a formatted report
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const partnerLabel = character.name?.[lang] || character.name?.en || character.id;
    const charMethodLabel = character.method?.[lang] || character.method?.en || '';
    const allNumbers = predictions.map((set, i) => `${i + 1}. ${set.join(", ")}`).join("\n");
    
    // Get frequency data as text
    const freqText = freqData.map(d => `${d.num} (${d.count}x)`).join(", ");
    
    // Get config description
    const configDesc = getConfigDescription(config, lang);
    
    let reportText = "";
    if (lang === "en") {
      reportText = `AI MARK 6 PROBABILITY REPORT\n`;
      reportText += `==============================\n\n`;
      reportText += `AI Partner: ${partnerLabel}\n`;
      reportText += `Methodology: ${charMethodLabel}\n`;
      reportText += `Configuration: ${configDesc}\n`;
      reportText += `Generated: ${dateStr}\n\n`;
      reportText += `PREDICTED NUMBER SETS (10 sets):\n`;
      reportText += `${allNumbers}\n\n`;
      reportText += `📊 NUMBER FREQUENCY ANALYSIS (Top 15):\n`;
      reportText += `${freqText}\n\n`;
      reportText += `⚠️ Disclaimer: This report is generated by a mathematical AI model for educational and mental stimulation purposes only.\n`;
      reportText += `This does NOT predict lottery results. Please do not take it seriously or become addicted.\n\n`;
      reportText += `Report created by DragonGPAi.com, powered by Gemini — ${dateStr}`;
    } else if (lang === "tc") {
      reportText = `AI MARK 6 概率報告\n`;
      reportText += `==============================\n\n`;
      reportText += `AI 夥伴：${partnerLabel}\n`;
      reportText += `方法論：${charMethodLabel}\n`;
      reportText += `配置：${configDesc}\n`;
      reportText += `生成日期：${dateStr}\n\n`;
      reportText += `預測號碼組合 (10 組)：\n`;
      reportText += `${allNumbers}\n\n`;
      reportText += `📊 號碼頻率分析 (前 15 名)：\n`;
      reportText += `${freqText}\n\n`;
      reportText += `⚠️ 免責聲明：本報告由數學 AI 模型生成，僅供教育和認知刺激之用。\n`;
      reportText += `此報告不能預測彩票結果。請勿認真對待或沉迷。\n\n`;
      reportText += `報告由 DragonGPAi.com 製作，由 Gemini 提供支持 — ${dateStr}`;
    } else {
      reportText = `AI MARK 6 概率报告\n`;
      reportText += `==============================\n\n`;
      reportText += `AI 伙伴：${partnerLabel}\n`;
      reportText += `方法论：${charMethodLabel}\n`;
      reportText += `配置：${configDesc}\n`;
      reportText += `生成日期：${dateStr}\n\n`;
      reportText += `预测号码组合 (10 组)：\n`;
      reportText += `${allNumbers}\n\n`;
      reportText += `📊 号码频率分析 (前 15 名)：\n`;
      reportText += `${freqText}\n\n`;
      reportText += `⚠️ 免责声明：本报告由数学 AI 模型生成，仅供教育和认知刺激之用。\n`;
      reportText += `此报告不能预测彩票结果。请勿认真对待或沉迷。\n\n`;
      reportText += `报告由 DragonGPAi.com 制作，由 Gemini 提供支持 — ${dateStr}`;
    }

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `mark6-report-${dateStr.replace(/\s/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleReturn = () => {
    stopSpeaking();
    setIsSpeaking(false);
    onReset();
  };

  const toggleVoice = () => {
    if (voiceEnabled) {
      stopSpeaking();
      setIsSpeaking(false);
    }
    setVoiceEnabled(!voiceEnabled);
    
    // If enabling voice, speak the report
    if (!voiceEnabled) {
      setTimeout(() => {
        speakPredictionReport();
      }, 300);
    }
  };

  const stars = 3;
  
  // Safe access for character properties with fallbacks
  const charName = character.name?.[lang] || character.name?.en || character.id;
  const charSubtitle = character.subtitle?.[lang] || character.subtitle?.en || '';
  const charMethod = character.method?.[lang] || character.method?.en || '';
  const charBio = character.bio?.[lang] || character.bio?.en || '';
  const charAvatar = character.avatar || '';

  // Get avatar URL - safely access avatarMap
  const avatarUrl = avatarMap[charAvatar] || avatarMap["dragon-master"] || dragonImg;

  return (
    <div className="max-w-3xl w-full mx-auto px-4 py-6 space-y-5 animate-fade-in print-report" id="mark6-full-report">
      {/* Flying Dragon Animation */}
      <AnimatePresence>
        {showDragon && (
          <motion.div
            initial={{ x: "-15vw", y: "40vh", opacity: 0, scale: 0.7 }}
            animate={{ x: "110vw", y: "-5vh", opacity: [0, 1, 1, 1, 0], scale: [0.7, 1.1, 1.2, 1, 0.9] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="fixed top-0 left-0 z-[999] pointer-events-none"
          >
            <span className="text-6xl md:text-8xl drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]">🐲</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language toggle and Voice toggle — hidden in print */}
      <div className="flex items-center justify-center gap-2 text-sm print-lang-toggle">
        <div className="flex items-center gap-1">
          {langKeys.map((lk, i) => {
            let displayLabel = '';
            if (lk === 'en') displayLabel = 'English';
            else if (lk === 'tc') displayLabel = '廣東話';
            else if (lk === 'sc') displayLabel = '國語';
            return (
              <span key={lk} className="flex items-center gap-1">
                {i > 0 && <span className="text-white/30 mx-1">|</span>}
                <button
                  onClick={() => setLang(lk)}
                  className={`transition-colors ${lang === lk ? "text-amber-300 font-semibold [text-shadow:0_0_6px_rgba(245,158,11,0.4)]" : "text-white/50 hover:text-white/80"}`}
                >
                  {displayLabel}
                </button>
              </span>
            );
          })}
        </div>
        
        {/* Voice Toggle Button */}
        <button
          onClick={toggleVoice}
          className={`p-1.5 rounded-full transition-all ml-2 ${
            voiceEnabled 
              ? "bg-amber-500/20 border border-amber-400/30 text-amber-400 hover:bg-amber-500/30" 
              : "bg-white/5 border border-white/10 text-white/30 hover:bg-white/10"
          }`}
          title={voiceEnabled ? t.voiceEnabled : t.voiceDisabled}
        >
          {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
        
        {/* Speaking indicator */}
        {isSpeaking && (
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-medium">{t.speaking}</span>
          </div>
        )}
      </div>

      {/* Header Card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 print-header-card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/40 shadow-lg shrink-0">
            <img 
              src={avatarUrl} 
              alt={charName} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white [text-shadow:0_0_10px_rgba(255,255,255,0.3)]">
              {charName}{t.prediction}
            </h2>
            <div className="inline-flex items-center gap-2 mt-1 rounded-full border border-amber-400/40 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300 print-hide">
              📐 {t.methodology}: {charMethod}
            </div>
            <div className="hidden print-method-badge">
              {t.methodology}: {charMethod}
            </div>
          </div>
        </div>

        {/* Description — visible in print (compact) */}
        {charBio && (
          <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 print-hide-detail">
            <p className="text-sm text-white/80 leading-relaxed">
              ✨ {charBio}
            </p>
          </div>
        )}

        {/* Simulation Power — hidden in print */}
        <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 print-hide-simpower">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white">{t.simPower}:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={`text-xl ${s <= stars ? "text-amber-400" : "text-muted-foreground/30"}`}>★</span>
              ))}
            </div>
            <span className="rounded-full border border-amber-400/40 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300">500K Simulations</span>
          </div>
        </div>

        {/* Based on — hidden in print */}
        <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center print-hide-detail">
          <p className="text-xs text-white/60">⚡ {t.basedOn}</p>
        </div>
      </div>

      {/* ── Configuration Summary with Date ── */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 backdrop-blur-md p-5 print-config-summary">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Settings2 size={18} className="text-amber-400" />
            <h3 className="text-base font-bold text-amber-400">{t.configSummary}</h3>
          </div>
          <span className="text-xs text-[#f5e6c8]/50">
            {new Date().toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'tc' ? 'zh-HK' : 'zh-CN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-amber-300 font-bold min-w-[130px]">{t.activeChar}:</span>
            <span className="font-bold text-white">{charName} — {charSubtitle}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-300 font-bold min-w-[130px]">{t.mathModule}:</span>
            <span className="font-semibold text-white">{charMethod}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-300 font-bold min-w-[130px]">
              {config.type === "banker" ? t.selectedBankers : lang === "en" ? "Config" : "配置"}:
            </span>
            <span className="font-semibold text-white">
              {config.type === "banker" ? (
                <span className="flex items-center gap-1.5 flex-wrap">
                  {config.bankerNumbers.map((n) => (
                    <span key={n} className={`w-7 h-7 rounded-full ${getBallColor(n)} text-white text-xs font-bold flex items-center justify-center ring-2 ring-amber-400 shadow-md`}>{n}</span>
                  ))}
                </span>
              ) : (
                getConfigDescription(config, lang)
              )}
            </span>
          </div>
        </div>
      </div>

      {/* 10 Prediction Sets - Each set has EXACTLY 6 numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {predictions.map((set, i) => (
          <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md p-4 print-prediction-set">
            <div className="flex items-center gap-2">
              {/* Set number indicator - plain text with circle border, NO background color */}
              <span className="w-7 h-7 rounded-full border border-white/30 text-white/60 text-[10px] font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {set.map((n) => {
                  const isBanker = constrainedNums.has(n);
                  return (
                    <span
                      key={n}
                      className={`w-9 h-9 rounded-full ${getBallColor(n)} text-white text-sm font-bold flex items-center justify-center shadow-md ${
                        isBanker ? "ring-2 ring-amber-400 ring-offset-1 ring-offset-black scale-110" : ""
                      }`}
                      title={isBanker ? (lang === "en" ? "Banker" : "膽") : ""}
                    >
                      {n}
                    </span>
                  );
                })}
              </div>
            </div>
            {/* Show banker indicator below the set */}
            {constrainedNums.size > 0 && (
              <div className="mt-1.5 ml-9 flex items-center gap-1 flex-wrap">
                {set.filter((n) => constrainedNums.has(n)).map((n) => (
                  <span key={n} className="text-[9px] text-amber-400 font-bold">
                    {t.constrainedLabel} {n}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Frequency Analysis Chart — screen only */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 print-hide">
        <h3 className="text-lg font-bold text-white text-center mb-1">{t.freqTitle}</h3>
        <p className="text-xs text-white/60 text-center mb-4">{t.freqDesc}</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={freqData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="num" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
            <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
              labelStyle={{ color: "#fff" }}
            />
            <Legend
              payload={[
                { value: t.red, type: "circle", color: "#ef4444" },
                { value: t.blue, type: "circle", color: "#3b82f6" },
                { value: t.green, type: "circle", color: "#22c55e" },
              ]}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {freqData.map((entry) => (
                <Cell key={entry.num} fill={getColor(entry.num)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Frequency Analysis — print only (plain HTML) */}
      <div className="hidden print-freq-section">
        <h3 className="print-freq-title">{t.freqTitle.replace("📊 ", "")}</h3>
        <p className="print-freq-desc">{t.freqDesc}</p>
        <div className="print-freq-grid">
          {freqData.map((entry) => {
            const maxCount = Math.max(...freqData.map(d => d.count));
            const pct = maxCount > 0 ? Math.round((entry.count / maxCount) * 100) : 0;
            return (
              <div key={entry.num} className="print-freq-row">
                <span className="print-freq-num">{entry.num}</span>
                <div className="print-freq-bar-bg">
                  <div className="print-freq-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="print-freq-count">{entry.count}x</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Warning + Footer Attribution — combined into one row for print */}
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-center print-warning-footer">
        <p className="text-xs text-red-400 leading-relaxed font-medium">{t.warning}</p>
        <p className="text-[10px] text-white/40 font-medium mt-2 print-footer-line">
          Report is created by dragongpai.com, powered by Gemini — Generated on: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* ── ACTION BAR ── */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2 print-hide">
        {/* Print Button */}
        <button 
          onClick={handlePrint} 
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
        >
          <Printer size={16} /> {t.print}
        </button>
        
        {/* Copy Text Button */}
        <button 
          onClick={handleCopyText} 
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            isCopied 
              ? 'bg-green-600 text-white' 
              : 'border border-white/30 text-white hover:bg-white/10'
          }`}
        >
          {isCopied ? <Check size={16} /> : <Copy size={16} />}
          {isCopied ? t.copied : t.copyText}
        </button>
        
        {/* WhatsApp Share Button */}
        <button 
          onClick={handleWhatsAppShare} 
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-[#25D366] text-white hover:bg-[#1da851] transition-colors"
        >
          <MessageCircle size={16} /> {t.shareWhatsApp}
        </button>
        
        {/* Line Share Button */}
        <button 
          onClick={handleLineShare} 
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-[#06C755] text-white hover:bg-[#05a848] transition-colors"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="shrink-0">
            <path d="M12 2C6.48 2 2 6.04 2 10.98c0 2.73 1.37 5.15 3.52 6.75.13.09.21.23.19.38l-.5 1.78c-.04.14.09.27.23.19l2.03-1.19c.12-.07.27-.07.39-.01.93.3 1.93.46 2.99.46 5.52 0 10-4.04 10-9 0-5.36-4.48-9-10-9z"/>
          </svg>
          {t.shareLine}
        </button>
        
        {/* Facebook Share Button */}
        <button 
          onClick={handleFacebookShare} 
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-[#1877f2] text-white hover:bg-[#0d65d9] transition-colors"
        >
          <Facebook size={16} /> {t.shareFacebook}
        </button>
        
        {/* Save as Text Button */}
        <button 
          onClick={handleSaveAsText} 
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition-colors"
        >
          <Download size={16} /> {t.saveAsText}
        </button>
        
        {/* Return to Game Button */}
        <button 
          onClick={handleReturn} 
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-amber-500 text-black hover:bg-amber-400 transition-colors"
        >
          <ArrowLeft size={16} /> {t.returnGame}
        </button>
      </div>

      <Link
        to="/ai-stocks"
        className="block w-full rounded-xl bg-gradient-to-r from-primary to-amber-500 py-4 text-center text-sm font-bold text-primary-foreground hover:from-primary/90 hover:to-amber-400 transition-colors print-hide"
      >
        <TrendingUp size={16} className="inline mr-2" />
        {t.goStocks}
      </Link>
    </div>
  );
};

export default Mark6FullReport;