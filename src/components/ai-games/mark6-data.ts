// src/components/ai-games/mark6-data.ts

export interface CharacterModel {
  id: string;
  name: { en: string; tc: string; sc: string };
  subtitle: { en: string; tc: string; sc: string };
  method: { en: string; tc: string; sc: string };
  avatar: string;
  accent: "amber" | "red" | "emerald" | "blue";
  description: { en: string; tc: string; sc: string };
}

export interface CharacterConfig {
  id: string;
  label: { en: string; tc: string; sc: string };
  desc: { en: string; tc: string; sc: string };
  method: string;
}

export interface DrawData {
  id: string;
  date: string;
  numbers: number[];
  extra: number;
}

// Historical draws for HK Mark6
export const historicalDraws: DrawData[] = [
  { id: "26/014", date: "2026-02-11", numbers: [5, 12, 18, 23, 29, 36], extra: 41 },
  { id: "26/013", date: "2026-02-08", numbers: [3, 8, 15, 22, 31, 38], extra: 44 },
  { id: "26/012", date: "2026-02-04", numbers: [7, 14, 19, 25, 33, 37], extra: 42 },
  { id: "26/011", date: "2026-02-01", numbers: [2, 9, 16, 21, 28, 35], extra: 45 },
  { id: "26/010", date: "2026-01-28", numbers: [6, 11, 20, 26, 30, 34], extra: 48 },
  { id: "26/009", date: "2026-01-25", numbers: [4, 10, 17, 24, 27, 32], extra: 43 },
  { id: "26/008", date: "2026-01-21", numbers: [1, 13, 22, 29, 36, 38], extra: 46 },
  { id: "26/007", date: "2026-01-18", numbers: [8, 12, 18, 23, 31, 37], extra: 49 },
  { id: "26/006", date: "2026-01-14", numbers: [5, 9, 14, 20, 28, 33], extra: 42 },
  { id: "26/005", date: "2026-01-11", numbers: [3, 7, 15, 22, 30, 35], extra: 47 },
];

// Color function for HK Mark6 balls
export const getBallColor = (num: number): string => {
  if (num <= 10) return "bg-red-500";
  if (num <= 20) return "bg-blue-500";
  if (num <= 30) return "bg-green-500";
  if (num <= 40) return "bg-yellow-500";
  return "bg-purple-500";
};

// Compute frequency from historical data
export const computeFrequency = (): Map<number, number> => {
  const freq = new Map<number, number>();
  for (let i = 1; i <= 49; i++) {
    freq.set(i, 0);
  }
  historicalDraws.forEach((draw) => {
    draw.numbers.forEach((n) => {
      freq.set(n, (freq.get(n) || 0) + 1);
    });
    if (draw.extra && draw.extra > 0 && draw.extra <= 49) {
      freq.set(draw.extra, (freq.get(draw.extra) || 0) + 1);
    }
  });
  return freq;
};

// All AI Characters
export const allCharacters: CharacterModel[] = [
  {
    id: "elon",
    name: { en: "Elon", tc: "Elon", sc: "Elon" },
    subtitle: { en: "Master Model", tc: "大師模型", sc: "大师模型" },
    method: { en: "Banker Strategy", tc: "膽拖策略", sc: "胆拖策略" },
    avatar: "elon-v2",
    accent: "amber",
    description: {
      en: "Uses advanced Monte Carlo simulations with banker strategy optimization.",
      tc: "使用先進的蒙特卡羅模擬與膽拖策略優化。",
      sc: "使用先进的蒙特卡罗模拟与胆拖策略优化。"
    }
  },
  {
    id: "gambling",
    name: { en: "God of Gambling", tc: "賭神", sc: "赌神" },
    subtitle: { en: "Chaos Analysis", tc: "波動分析", sc: "波动分析" },
    method: { en: "Chaos Theory", tc: "混沌理論", sc: "混沌理论" },
    avatar: "gambling-v2",
    accent: "red",
    description: {
      en: "Analyzes patterns using chaos theory and statistical anomalies.",
      tc: "使用混沌理論與統計異常分析模式。",
      sc: "使用混沌理论与统计异常分析模式。"
    }
  },
  {
    id: "lucky-star",
    name: { en: "Lucky Star", tc: "幸運星", sc: "幸运星" },
    subtitle: { en: "Lucky Star", tc: "幸運星", sc: "幸运星" },
    method: { en: "Neural Network", tc: "神經網絡", sc: "神经网络" },
    avatar: "lucky-star-v2",
    accent: "emerald",
    description: {
      en: "Deep learning model trained on historical draw patterns.",
      tc: "基於歷史開獎模式訓練的深度學習模型。",
      sc: "基于历史开奖模式训练的深度学习模型。"
    }
  },
  {
    id: "achelois",
    name: { en: "Achelois", tc: "月光女神", sc: "月光女神" },
    subtitle: { en: "Moon of Goddess", tc: "月光女神", sc: "月光女神" },
    method: { en: "Lunar Cycle", tc: "月相週期", sc: "月相周期" },
    avatar: "achelois-v2",
    accent: "blue",
    description: {
      en: "Uses lunar phase analysis combined with historical data.",
      tc: "結合月相分析與歷史數據。",
      sc: "结合月相分析与历史数据。"
    }
  },
  {
    id: "aladdin",
    name: { en: "Aladdin", tc: "阿拉丁", sc: "阿拉丁" },
    subtitle: { en: "Quantum Color", tc: "量子色彩", sc: "量子色彩" },
    method: { en: "Quantum Algorithm", tc: "量子算法", sc: "量子算法" },
    avatar: "aladdin-v2",
    accent: "amber",
    description: {
      en: "Quantum-inspired algorithm for number pattern recognition.",
      tc: "量子啟發的數字模式識別算法。",
      sc: "量子启发的数字模式识别算法。"
    }
  },
  {
    id: "dragon-master",
    name: { en: "Dragon Master", tc: "龍之大師", sc: "龙之大师" },
    subtitle: { en: "Dragon Master", tc: "龍之大師", sc: "龙之大师" },
    method: { en: "Dragon Strategy", tc: "龍之策略", sc: "龙之策略" },
    avatar: "dragon-master",
    accent: "red",
    description: {
      en: "Ancient wisdom combined with modern statistical analysis.",
      tc: "古老智慧結合現代統計分析。",
      sc: "古老智慧结合现代统计分析。"
    }
  },
  {
    id: "phoenix-trend",
    name: { en: "Phoenix", tc: "鳳凰", sc: "凤凰" },
    subtitle: { en: "Phoenix Trend", tc: "鳳凰趨勢", sc: "凤凰趋势" },
    method: { en: "Trend Analysis", tc: "趨勢分析", sc: "趋势分析" },
    avatar: "phoenix-trend",
    accent: "emerald",
    description: {
      en: "Detects rising and falling trends in number sequences.",
      tc: "偵測數字序列中的上升與下降趨勢。",
      sc: "侦测数字序列中的上升与下降趋势。"
    }
  },
  {
    id: "tiger-volatility",
    name: { en: "Tiger", tc: "老虎", sc: "老虎" },
    subtitle: { en: "Tiger Volatility", tc: "老虎波動", sc: "老虎波动" },
    method: { en: "Volatility Model", tc: "波動模型", sc: "波动模型" },
    avatar: "tiger-volatility",
    accent: "blue",
    description: {
      en: "Analyzes volatility patterns in lottery number distributions.",
      tc: "分析彩票號碼分佈的波動模式。",
      sc: "分析彩票号码分布的波动模式。"
    }
  }
];

// Character configs
export const characterConfigs: Record<string, CharacterConfig[]> = {
  elon: [
    {
      id: "monte-carlo",
      label: { en: "Monte Carlo", tc: "蒙特卡羅", sc: "蒙特卡罗" },
      desc: { en: "500,000 simulations", tc: "50萬次模擬", sc: "50万次模拟" },
      method: "monte-carlo"
    }
  ],
  gambling: [
    {
      id: "chaos",
      label: { en: "Chaos Master", tc: "混沌大師", sc: "混沌大师" },
      desc: { en: "Chaos Theory", tc: "混沌理論", sc: "混沌理论" },
      method: "chaos"
    }
  ],
  "lucky-star": [
    {
      id: "neural",
      label: { en: "Neural Network", tc: "神經網絡", sc: "神经网络" },
      desc: { en: "Deep Learning", tc: "深度學習", sc: "深度学习" },
      method: "neural"
    }
  ],
  achelois: [
    {
      id: "lunar",
      label: { en: "Lunar Cycle", tc: "月相週期", sc: "月相周期" },
      desc: { en: "Moon Phases", tc: "月相分析", sc: "月相分析" },
      method: "lunar"
    }
  ],
  aladdin: [
    {
      id: "quantum",
      label: { en: "Quantum Algorithm", tc: "量子算法", sc: "量子算法" },
      desc: { en: "Quantum Inspired", tc: "量子啟發", sc: "量子启发" },
      method: "quantum"
    }
  ],
  "dragon-master": [
    {
      id: "dragon",
      label: { en: "Dragon Strategy", tc: "龍之策略", sc: "龙之策略" },
      desc: { en: "Ancient Wisdom", tc: "古老智慧", sc: "古老智慧" },
      method: "dragon"
    }
  ],
  "phoenix-trend": [
    {
      id: "trend",
      label: { en: "Trend Analysis", tc: "趨勢分析", sc: "趋势分析" },
      desc: { en: "Pattern Detection", tc: "模式偵測", sc: "模式侦测" },
      method: "trend"
    }
  ],
  "tiger-volatility": [
    {
      id: "volatility",
      label: { en: "Volatility Model", tc: "波動模型", sc: "波动模型" },
      desc: { en: "Volatility Analysis", tc: "波動分析", sc: "波动分析" },
      method: "volatility"
    }
  ]
};

// Labels for the UI
export const mark6Labels = {
  en: {
    title: "AI Mark6 & TW Big Lotto",
    subtitle: "Choose Your AI Partner for Probability Analysis",
    credits: "credits",
    topUp: "Top Up",
    langTabs: ["English", "繁體中文", "简体中文"],
    whichGenius: "Which genius shall guide your luck today?",
    chooseModel: "Choose Your AI Model",
    chooseModelDesc: "Click a character to configure and select their model",
    poweredBy: "Powered by Dragon AI",
    startGame: "Start Analysis",
    heatmapTitle: "🔥 Frequency Heatmap",
    hot: "🔥 Hot",
    cold: "❄️ Cold",
    historicalTitle: "📜 Historical Draw Results",
    drawId: "Draw No.",
    date: "Date",
    numbers: "Numbers",
    extra: "Extra",
    disclaimer: "⚠️ This tool provides AI-generated predictions for entertainment and reference only. Please gamble responsibly.",
    goToStocks: "📈 Go to AI Stocks",
  },
  tc: {
    title: "AI 六合彩及台灣大樂透",
    subtitle: "選擇您的 AI 夥伴進行概率分析",
    credits: "積分",
    topUp: "充值",
    langTabs: ["English", "繁體中文", "简体中文"],
    whichGenius: "今天哪位天才為你指點迷津？",
    chooseModel: "選擇你的 AI 模型",
    chooseModelDesc: "點擊角色以配置和選擇其模型",
    poweredBy: "由 Dragon AI 提供支持",
    startGame: "開始分析",
    heatmapTitle: "🔥 頻率熱圖",
    hot: "🔥 熱門",
    cold: "❄️ 冷門",
    historicalTitle: "📜 歷史攪珠結果",
    drawId: "期數",
    date: "日期",
    numbers: "號碼",
    extra: "特別號碼",
    disclaimer: "⚠️ 此工具提供的 AI 預測僅供娛樂和參考之用。請理性投注。",
    goToStocks: "📈 前往 AI 股票",
  },
  sc: {
    title: "AI 六合彩及台湾大乐透",
    subtitle: "选择您的 AI 伙伴进行概率分析",
    credits: "积分",
    topUp: "充值",
    langTabs: ["English", "繁體中文", "简体中文"],
    whichGenius: "今天哪位天才为你指点迷津？",
    chooseModel: "选择你的 AI 模型",
    chooseModelDesc: "点击角色以配置和选择其模型",
    poweredBy: "由 Dragon AI 提供支持",
    startGame: "开始分析",
    heatmapTitle: "🔥 频率热图",
    hot: "🔥 热门",
    cold: "❄️ 冷门",
    historicalTitle: "📜 历史开奖结果",
    drawId: "期数",
    date: "日期",
    numbers: "号码",
    extra: "特别号码",
    disclaimer: "⚠️ 此工具提供的 AI 预测仅供娱乐和参考之用。请理性投注。",
    goToStocks: "📈 前往 AI 股票",
  }
};

// Mock data functions
export const getMockHKMark6Data = (limit: number = 10): DrawData[] => {
  return historicalDraws.slice(0, limit);
};

// Async function to fetch real data (placeholder - implement actual API call)
export const getHKMark6Draws = async (limit: number = 10): Promise<DrawData[]> => {
  // TODO: Implement actual API call to HKJC
  // For now, return mock data
  return getMockHKMark6Data(limit);
};