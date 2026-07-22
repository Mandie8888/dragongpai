import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage, type LangKey } from "@/contexts/LanguageContext";
import type { CharacterModel, CharacterConfig } from "./mark6-data";
import { getBallColor } from "./mark6-data";
import { Printer, ArrowLeft, TrendingUp, MessageCircle, Shield, AlertTriangle, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts";

import dragonImg from "@/assets/dragon-master.png";
import phoenixImg from "@/assets/phoenix-trend.png";
import tigerImg from "@/assets/tiger-volatility.png";
import elonImg from "@/assets/elon-v2.png";
import gamblingImg from "@/assets/gambling-v2.png";
import aladdinImg from "@/assets/aladdin-v2.png";
import luckyStarImg from "@/assets/lucky-star-v2.png";
import acheloisImg from "@/assets/achelois-v2.png";

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
    returnGame: "Return to Game",
    goStocks: "Go to AI Stocks Probability",
    red: "Red (紅/红)",
    blue: "Blue (藍/蓝)",
    green: "Green (綠/绿)",
    langTabs: ["English", "繁體中文", "简体中文"],
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
    returnGame: "返回遊戲",
    goStocks: "前往 AI 股票概率",
    red: "紅",
    blue: "藍",
    green: "綠",
    langTabs: ["English", "繁體中文", "简体中文"],
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
    returnGame: "返回游戏",
    goStocks: "前往 AI 股票概率",
    red: "红",
    blue: "蓝",
    green: "绿",
    langTabs: ["English", "繁體中文", "简体中文"],
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
  },
};

/* ── Constrained number generation ── */

const REDS = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46];
const BLUES = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48];
const GREENS = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49];

/** Generate 10 sets of 6 numbers respecting character config as hard constraints */
const generatePredictions = (config: CharacterConfig): number[][] => {
  const bankerNums = config.type === "banker" ? config.bankerNumbers : [];
  const sets: number[][] = [];

  for (let i = 0; i < 10; i++) {
    const nums = new Set<number>();

    // Step 1: ALWAYS add ALL banker numbers first — hard constraint
    bankerNums.forEach((n) => nums.add(n));

    // Step 2: Build pool & enforce constraints
    const allPool: number[] = [];
    for (let n = 1; n <= 49; n++) allPool.push(n);

    if (config.type === "pattern") {
      const hotNums = [12, 18, 36, 44, 46, 31, 22, 3, 7, 14, 27, 35];
      const coldNums = [43, 32, 25, 48, 47, 17, 4, 15, 20, 26];
      let pool = [...allPool];
      if (config.pattern === "hot") {
        pool = [...pool, ...hotNums, ...hotNums, ...hotNums];
      } else {
        pool = [...pool, ...coldNums, ...coldNums, ...coldNums];
      }
      const remaining = pool.filter((n) => !nums.has(n));
      while (nums.size < 6) {
        const pick = remaining[Math.floor(Math.random() * remaining.length)];
        if (pick && !nums.has(pick)) nums.add(pick);
      }
    } else if (config.type === "distribution") {
      const [firstTarget, secondTarget] = config.ratio.split("/").map(Number);
      const needed = 6 - nums.size;
      const total = firstTarget + secondTarget;
      const firstCount = total > 0 ? Math.round((firstTarget / total) * needed) : Math.floor(needed / 2);
      const secondCount = needed - firstCount;

      let firstPool: number[];
      let secondPool: number[];
      if (config.mode === "odd-even") {
        firstPool = allPool.filter((n) => !nums.has(n) && n % 2 !== 0);
        secondPool = allPool.filter((n) => !nums.has(n) && n % 2 === 0);
      } else {
        firstPool = allPool.filter((n) => !nums.has(n) && n >= 25);
        secondPool = allPool.filter((n) => !nums.has(n) && n < 25);
      }

      const shuffleAndPick = (pool: number[], count: number) => {
        const shuffled = pool.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
      };

      shuffleAndPick(firstPool, firstCount).forEach((n) => nums.add(n));
      shuffleAndPick(secondPool, secondCount).forEach((n) => nums.add(n));

      const fallback = allPool.filter((n) => !nums.has(n)).sort(() => Math.random() - 0.5);
      let fi = 0;
      while (nums.size < 6 && fi < fallback.length) { nums.add(fallback[fi++]); }
    } else if (config.type === "color") {
      if (config.colorRatio) {
        const [rTarget, bTarget, gTarget] = config.colorRatio.split(":").map(Number);
        const needed = 6 - nums.size;
        const total = rTarget + bTarget + gTarget;
        const rCount = total > 0 ? Math.round((rTarget / total) * needed) : 2;
        const bCount = total > 0 ? Math.round((bTarget / total) * needed) : 2;
        const gCount = needed - rCount - bCount;

        const pick = (pool: number[], count: number) => {
          const available = pool.filter((n) => !nums.has(n)).sort(() => Math.random() - 0.5);
          return available.slice(0, Math.max(0, count));
        };
        pick(REDS, rCount).forEach((n) => nums.add(n));
        pick(BLUES, bCount).forEach((n) => nums.add(n));
        pick(GREENS, gCount).forEach((n) => nums.add(n));
      } else {
        const colorPool = config.color === "red" ? REDS : config.color === "blue" ? BLUES : GREENS;
        const needed = 6 - nums.size;
        const colorTarget = Math.min(3, needed);
        const available = colorPool.filter((n) => !nums.has(n)).sort(() => Math.random() - 0.5);
        for (let j = 0; j < colorTarget && j < available.length; j++) nums.add(available[j]);
      }

      const fallback = allPool.filter((n) => !nums.has(n)).sort(() => Math.random() - 0.5);
      let fi = 0;
      while (nums.size < 6 && fi < fallback.length) { nums.add(fallback[fi++]); }
    } else {
      // "none", "auto", "banker" — fill remaining slots randomly
      const remaining = allPool.filter((n) => !nums.has(n)).sort(() => Math.random() - 0.5);
      let ri = 0;
      while (nums.size < 6 && ri < remaining.length) { nums.add(remaining[ri++]); }
    }

    // Step 3: SAFETY — verify all bankers are present (should always be true)
    const finalSet = [...nums];
    for (const b of bankerNums) {
      if (!finalSet.includes(b)) finalSet.push(b);
    }

    sets.push(finalSet.sort((a, b) => a - b).slice(0, Math.max(6, finalSet.length)));
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
}

const langKeys: LangKey[] = ["en", "tc", "sc"];

const Mark6FullReport = ({ character, config, onReset }: Props) => {
  const { lang, setLang } = useLanguage();
  const t = labels[lang];
  
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

  const predictions = useState(() => generatePredictions(config))[0];
  const freqData = computeFreqFromSets(predictions);
  const constrainedNums = getConstrainedNumbers(config);
  const [showDragon, setShowDragon] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowDragon(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  const handlePrint = () => window.print();
  const handleShare = () => {
    const partnerLabel = character.name?.[lang] || character.name?.en || character.id;
    const text = lang === "en"
      ? `I just ran an AI Probability Analysis with ${partnerLabel} on DragonGPAi.com! 🐲🎯 Check it out: ${window.location.origin}/ai-games`
      : lang === "tc"
        ? `我剛在 DragonGPAi.com 上用 ${partnerLabel} 進行了 AI 概率分析！🐲🎯 查看：${window.location.origin}/ai-games`
        : `我刚在 DragonGPAi.com 上用 ${partnerLabel} 进行了 AI 概率分析！🐲🎯 查看：${window.location.origin}/ai-games`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const stars = 3;
  
  // Safe access for character properties with fallbacks
  const charName = character.name?.[lang] || character.name?.en || character.id;
  const charSubtitle = character.subtitle?.[lang] || character.subtitle?.en || '';
  const charMethod = character.method?.[lang] || character.method?.en || '';
  const charBio = character.bio?.[lang] || character.bio?.en || '';
  const charAvatar = character.avatar || '';

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

      {/* Language toggle — hidden in print */}
      <div className="flex items-center justify-center gap-1 text-sm print-lang-toggle">
        {langKeys.map((lk, i) => (
          <span key={lk} className="flex items-center gap-1">
            {i > 0 && <span className="text-white/30 mx-1">|</span>}
            <button
              onClick={() => setLang(lk)}
              className={`transition-colors ${lang === lk ? "text-amber-300 font-semibold [text-shadow:0_0_6px_rgba(245,158,11,0.4)]" : "text-white/50 hover:text-white/80"}`}
            >
              {t.langTabs[i]}
            </button>
          </span>
        ))}
      </div>

      {/* Header Card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 print-header-card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/40 shadow-lg shrink-0">
            <img 
              src={avatarMap[charAvatar] || avatarMap["dragon-master"]} 
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

      {/* ── Configuration Summary ── */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 backdrop-blur-md p-5 print-config-summary">
        <div className="flex items-center gap-2 mb-3">
          <Settings2 size={18} className="text-amber-400" />
          <h3 className="text-base font-bold text-amber-400">{t.configSummary}</h3>
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

      {/* 10 Prediction Sets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {predictions.map((set, i) => (
          <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md p-4 print-prediction-set">
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full ${getBallColor(i + 1)} text-white text-xs font-bold flex items-center justify-center`}>{i + 1}</span>
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

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 print-hide">
        <button onClick={handlePrint} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors">
          <Printer size={16} /> {t.print}
        </button>
        <button onClick={handleShare} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors">
          <MessageCircle size={16} /> {t.share}
        </button>
        <button onClick={onReset} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold bg-amber-500 text-black hover:bg-amber-400 transition-colors">
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