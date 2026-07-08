import type { LangKey } from "@/contexts/LanguageContext";

/** Mock historical Mark 6 draw results */
export const historicalDraws = [
  { id: "26/014", date: "2026-02-11", numbers: [3, 12, 18, 27, 35, 44], extra: 9 },
  { id: "26/013", date: "2026-02-08", numbers: [7, 14, 22, 31, 38, 46], extra: 19 },
  { id: "26/012", date: "2026-02-04", numbers: [1, 11, 23, 29, 37, 49], extra: 42 },
  { id: "26/011", date: "2026-02-01", numbers: [5, 16, 24, 33, 41, 47], extra: 8 },
  { id: "26/010", date: "2026-01-28", numbers: [2, 10, 19, 28, 36, 45], extra: 30 },
  { id: "26/009", date: "2026-01-25", numbers: [6, 13, 21, 34, 39, 48], extra: 15 },
  { id: "26/008", date: "2026-01-21", numbers: [4, 17, 25, 32, 40, 43], extra: 26 },
  { id: "26/007", date: "2026-01-18", numbers: [8, 15, 20, 30, 36, 46], extra: 11 },
  { id: "26/006", date: "2026-01-14", numbers: [9, 18, 26, 33, 42, 49], extra: 3 },
  { id: "26/005", date: "2026-01-11", numbers: [1, 12, 22, 31, 38, 44], extra: 47 },
  { id: "26/004", date: "2026-01-07", numbers: [7, 14, 19, 27, 35, 41], extra: 23 },
  { id: "26/003", date: "2026-01-04", numbers: [3, 10, 16, 29, 37, 48], extra: 5 },
  { id: "25/052", date: "2025-12-30", numbers: [6, 11, 24, 34, 40, 45], extra: 17 },
  { id: "25/051", date: "2025-12-27", numbers: [2, 13, 21, 28, 39, 43], extra: 32 },
  { id: "25/050", date: "2025-12-23", numbers: [5, 17, 23, 30, 36, 47], extra: 14 },
];

/** Get ball color based on Mark 6 official color scheme */
export const getBallColor = (n: number): string => {
  const reds = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46];
  const blues = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48];
  if (reds.includes(n)) return "bg-red-500";
  if (blues.includes(n)) return "bg-blue-500";
  return "bg-emerald-500";
};

/** Compute frequency map from historical draws */
export const computeFrequency = (): Map<number, number> => {
  const freq = new Map<number, number>();
  for (let i = 1; i <= 49; i++) freq.set(i, 0);
  historicalDraws.forEach((d) => {
    d.numbers.forEach((n) => freq.set(n, (freq.get(n) || 0) + 1));
    freq.set(d.extra, (freq.get(d.extra) || 0) + 1);
  });
  return freq;
};

/* ────────────────────────────────────────────
   Unified AI Character model (all 8 partners)
   ──────────────────────────────────────────── */

export type ConfigType = "none" | "banker" | "pattern" | "auto" | "distribution" | "color";

export interface CharacterModel {
  id: string;
  name: { en: string; tc: string; sc: string };
  subtitle: { en: string; tc: string; sc: string };
  method: { en: string; tc: string; sc: string };
  bio: { en: string; tc: string; sc: string };
  habit: { en: string; tc: string; sc: string };
  style: { en: string; tc: string; sc: string };
  avatar: string;
  accent: string;
  configType: ConfigType;
  reportEmphasis: string;
}

/** Character-specific config value types */
export type CharacterConfig =
  | { type: "none" }
  | { type: "banker"; bankerNumbers: number[] }
  | { type: "pattern"; pattern: "hot" | "cold" }
  | { type: "auto" }
  | { type: "distribution"; mode: "odd-even" | "high-low"; ratio: string }
  | { type: "color"; color: "red" | "blue" | "green"; colorRatio?: string };

export const allCharacters: CharacterModel[] = [
  // ── Dragon / Phoenix / Tiger ──
  {
    id: "dragon",
    name: { en: "The Dragon", tc: "龍", sc: "龙" },
    subtitle: { en: "Master Model", tc: "大師模型", sc: "大师模型" },
    method: { en: "Symmetry & Equilibrium", tc: "對稱均衡", sc: "对称均衡" },
    habit: {
      en: "High-level pattern synthesis. Looks for 'Symmetry' and 'Global Equilibrium' in the last 100 draws.",
      tc: "高層次模式綜合。在最近100期中尋找「對稱性」與「全局均衡」。",
      sc: "高层次模式综合。在最近100期中寻找「对称性」与「全局均衡」。",
    },
    style: {
      en: "Balanced, authoritative, and focuses on long-term probability.",
      tc: "平衡、權威，專注於長期概率。",
      sc: "平衡、权威，专注于长期概率。",
    },
    bio: {
      en: "The Dragon sees the full picture — 100 draws of data distilled into equilibrium patterns. Its analysis is calm, deliberate, and rooted in mathematical symmetry.",
      tc: "龍縱觀全局 — 將100期數據提煉為均衡模式。分析冷靜、審慎，植根於數學對稱性。",
      sc: "龙纵观全局 — 将100期数据提炼为均衡模式。分析冷静、审慎，植根于数学对称性。",
    },
    avatar: "dragon-master",
    accent: "amber",
    configType: "none",
    reportEmphasis: "equilibrium",
  },
  {
    id: "phoenix",
    name: { en: "The Phoenix", tc: "鳳", sc: "凤" },
    subtitle: { en: "Trend Follower", tc: "趨勢追蹤", sc: "趋势追踪" },
    method: { en: "Hot Number Momentum", tc: "熱門號碼動量", sc: "热门号码动量" },
    habit: {
      en: "Aggressive trend recognition. Prioritizes 'Hot Numbers' and recent momentum from the last 10-20 draws.",
      tc: "積極趨勢識別。優先考慮「熱門號碼」及最近10-20期的勢頭。",
      sc: "积极趋势识别。优先考虑「热门号码」及最近10-20期的势头。",
    },
    style: {
      en: "Sharp, focused on 'Heat Maps' and immediate flow.",
      tc: "敏銳，專注於「熱力圖」與即時趨勢。",
      sc: "敏锐，专注于「热力图」与即时趋势。",
    },
    bio: {
      en: "The Phoenix rides the wave of momentum — tracking the hottest numbers across recent draws. When the heat rises, the Phoenix strikes.",
      tc: "鳳乘勢而動 — 追蹤近期最熱門號碼。當熱度上升，鳳便出擊。",
      sc: "凤乘势而动 — 追踪近期最热门号码。当热度上升，凤便出击。",
    },
    avatar: "phoenix-trend",
    accent: "red",
    configType: "none",
    reportEmphasis: "momentum",
  },
  {
    id: "tiger",
    name: { en: "The Tiger", tc: "虎", sc: "虎" },
    subtitle: { en: "Volatility Specialist", tc: "波動分析", sc: "波动分析" },
    method: { en: "Cold Number Breakout", tc: "冷門號碼突破", sc: "冷门号码突破" },
    habit: {
      en: "Chaos and outlier detection. Specifically looks for 'Cold Numbers' or numbers that have defied probability for too long.",
      tc: "混沌與離群值偵測。專門尋找「冷門號碼」或長期違反概率的號碼。",
      sc: "混沌与离群值侦测。专门寻找「冷门号码」或长期违反概率的号码。",
    },
    style: {
      en: "Bold, unpredictable, and focuses on 'Breakout' patterns.",
      tc: "大膽、不可預測，專注於「突破」模式。",
      sc: "大胆、不可预测，专注于「突破」模式。",
    },
    bio: {
      en: "The Tiger hunts in the shadows — finding cold numbers due for a breakout. Where others see randomness, the Tiger sees opportunity.",
      tc: "虎伏於暗處 — 尋找即將突破的冷門號碼。他人眼中的隨機，虎視為機遇。",
      sc: "虎伏于暗处 — 寻找即将突破的冷门号码。他人眼中的随机，虎视为机遇。",
    },
    avatar: "tiger-volatility",
    accent: "blue",
    configType: "none",
    reportEmphasis: "breakout",
  },
  // ── 5 AI Partners ──
  {
    id: "elon",
    name: { en: "Elon", tc: "Elon", sc: "Elon" },
    subtitle: { en: "馬神", tc: "馬神", sc: "马神" },
    method: { en: "Banker & Leg Strategy", tc: "膽拖策略", sc: "胆拖策略" },
    habit: {
      en: "Strategic Game Theory — simulates air turbulence to find optimal Banker & Leg combinations.",
      tc: "策略博弈論 — 模擬氣流擾動，尋找最佳膽拖組合。",
      sc: "策略博弈论 — 模拟气流扰动，寻找最佳胆拖组合。",
    },
    style: {
      en: "Visionary, analytical, focuses on strategic distribution.",
      tc: "遠見卓識，專注於策略分配。",
      sc: "远见卓识，专注于策略分配。",
    },
    bio: {
      en: "Elon is a modern enigma; no one truly knows his origin—though some whisper he arrived from Mars. Driven by a passion for Game Theory, he envisions a future where robots handle the labor while he builds foundations that span the universe. His analytical focus is on strategic distribution, utilizing the Banker & Leg model to find logic within the chaos.",
      tc: "Elon 是現代奇才；無人真正知曉其來歷——有人低語他來自火星。驅動他的是博弈論的熱情，他構想的未來由機器人承擔勞動，而他建立跨越宇宙的基石。他的分析專注於策略分配，利用膽拖模型在混沌中尋找邏輯。",
      sc: "Elon 是现代奇才；无人真正知晓其来历——有人低语他来自火星。驱动他的是博弈论的热情，他构想的未来由机器人承担劳动，而他建立跨越宇宙的基石。他的分析专注于策略分配，利用胆拖模型在混沌中寻找逻辑。",
    },
    avatar: "elon-v2",
    accent: "amber",
    configType: "banker",
    reportEmphasis: "strategic",
  },
  {
    id: "gambling",
    name: { en: "God of Gambling", tc: "賭神", sc: "赌神" },
    subtitle: { en: "Chaos Master", tc: "混沌大師", sc: "混沌大师" },
    method: { en: "Consecutive & Trailing Digits", tc: "連號與尾數分析", sc: "连号与尾数分析" },
    habit: {
      en: "Identifies hidden 'order' within randomness — specializing in Consecutive Numbers and Trailing Digits analysis.",
      tc: "從隨機中識別隱藏的「秩序」— 專精於連號與尾數分析。",
      sc: "从随机中识别隐藏的「秩序」— 专精于连号与尾数分析。",
    },
    style: {
      en: "Legendary, compassionate, finds patterns of connection in data.",
      tc: "傳奇、慈悲，在數據中尋找聯繫的模式。",
      sc: "传奇、慈悲，在数据中寻找联系的模式。",
    },
    bio: {
      en: "The original legend from the streets of Hong Kong, his journey began in humble poverty. Despite his title, he is a man of profound justice and compassion, treating everyone as a friend. He looks for patterns of connection, specializing in Consecutive Numbers and Trailing Digits—mathematical signs of love and companionship in the data.",
      tc: "源自香港街頭的傳奇，旅程始於貧寒。儘管擁有「賭神」之名，他卻是正義慈悲之人，視眾生為友。他尋找數據中的聯繫模式，專精於連號與尾數——數據中愛與陪伴的數學符號。",
      sc: "源自香港街头的传奇，旅程始于贫寒。尽管拥有「赌神」之名，他却是正义慈悲之人，视众生为友。他寻找数据中的联系模式，专精于连号与尾数——数据中爱与陪伴的数学符号。",
    },
    avatar: "gambling-v2",
    accent: "red",
    configType: "pattern",
    reportEmphasis: "chaos",
  },
  {
    id: "luckystar",
    name: { en: "Lucky Star", tc: "幸運星", sc: "幸运星" },
    subtitle: { en: "Monte Carlo", tc: "百萬模擬", sc: "百万模拟" },
    method: { en: "1,000,000 Virtual Draws", tc: "百萬次虛擬抽獎", sc: "百万次虚拟抽奖" },
    habit: {
      en: "Runs 1,000,000 brute force virtual draws to find 'survivor' number sets.",
      tc: "進行一百萬次暴力虛擬抽獎，尋找「倖存者」號碼組合。",
      sc: "进行一百万次暴力虚拟抽奖，寻找「幸存者」号码组合。",
    },
    style: {
      en: "Unpredictable, brilliant, joy-driven analysis.",
      tc: "不可預測、才華橫溢、以快樂驅動分析。",
      sc: "不可预测、才华横溢、以快乐驱动分析。",
    },
    bio: {
      en: "Known affectionately as 'Grandpa of Star', he believes that joy is the greatest success of all. His behavior is unpredictable. A hardworking and brilliant mind, he employs Frequency Analysis using Hot & Cold Numbers through massive Monte Carlo simulations.",
      tc: "人稱「星爺」，他相信快樂是最大的成功。行為不可預測，勤奮而才華橫溢，運用百萬次蒙特卡羅模擬進行冷熱號碼頻率分析。",
      sc: "人称「星爷」，他相信快乐是最大的成功。行为不可预测，勤奋而才华横溢，运用百万次蒙特卡罗模拟进行冷热号码频率分析。",
    },
    avatar: "lucky-star-v2",
    accent: "amber",
    configType: "auto",
    reportEmphasis: "montecarlo",
  },
  {
    id: "achelois",
    name: { en: "Achelois", tc: "月光女神", sc: "月光女神" },
    subtitle: { en: "Moon of Goddess", tc: "神經網絡", sc: "神经网络" },
    method: { en: "Odd/Even & High/Low Distribution", tc: "奇偶/大小分佈", sc: "奇偶/大小分布" },
    habit: {
      en: "Neural Entropy model — meticulously analyzes the distribution of Odd/Even and High/Low values.",
      tc: "神經熵模型 — 精確分析奇偶與大小值的分佈。",
      sc: "神经熵模型 — 精确分析奇偶与大小值的分布。",
    },
    style: {
      en: "Balanced, cyclical, seeks harmony in numbers.",
      tc: "平衡、循環，在數字中尋求和諧。",
      sc: "平衡、循环，在数字中寻求和谐。",
    },
    bio: {
      en: "An ancient Greek deity whose name has echoed since 2000 BCE, Achelois is the 'washer of pain' who seeks to help the honest and the good. Much like the cycles of the moon, she views the world through balance. Her model focuses on the Property of Numbers, meticulously analyzing the distribution of Odd/Even and High/Low values.",
      tc: "自公元前2000年便流傳至今的古希臘神祇，月光女神是「洗滌痛苦者」，幫助善良誠實之人。如同月之循環，她以平衡視角看待世界。她的模型專注於數字屬性，精確分析奇偶與大小值分佈。",
      sc: "自公元前2000年便流传至今的古希腊神祇，月光女神是「洗涤痛苦者」，帮助善良诚实之人。如同月之循环，她以平衡视角看待世界。她的模型专注于数字属性，精确分析奇偶与大小值分布。",
    },
    avatar: "achelois-v2",
    accent: "blue",
    configType: "distribution",
    reportEmphasis: "distribution",
  },
  {
    id: "aladdin",
    name: { en: "Aladdin", tc: "阿拉丁", sc: "阿拉丁" },
    subtitle: { en: "Quantum Color", tc: "量子色彩", sc: "量子色彩" },
    method: { en: "Color Spectrum Distribution", tc: "顏色光譜分佈", sc: "颜色光谱分布" },
    habit: {
      en: "Synchronizes historical color frequency with probability — tracking Red, Blue, and Green patterns.",
      tc: "同步歷史顏色頻率與概率 — 追蹤紅、藍、綠模式。",
      sc: "同步历史颜色频率与概率 — 追踪红、蓝、绿模式。",
    },
    style: {
      en: "Generous, mystical, finds beauty in the visual array.",
      tc: "慷慨、神秘，在視覺排列中發現美感。",
      sc: "慷慨、神秘，在视觉排列中发现美感。",
    },
    bio: {
      en: "Hailing from the ancient Middle East, Aladdin spent centuries hidden within his magic lamp. He is a generous spirit who wishes to grant three mathematical insights to those with a good heart. He finds beauty in the visual array, specializing in the Color Spectrum Distribution, where he tracks the vibrant patterns of Red, Blue, and Green colors.",
      tc: "來自古代中東，阿拉丁在神燈中隱居了數個世紀。他是慷慨的精靈，願向心地善良之人贈予三項數學洞察。他在視覺排列中發現美感，專精於顏色光譜分佈，追蹤紅、藍、綠的繽紛模式。",
      sc: "来自古代中东，阿拉丁在神灯中隐居了数个世纪。他是慷慨的精灵，愿向心地善良之人赠予三项数学洞察。他在视觉排列中发现美感，专精于颜色光谱分布，追踪红、蓝、绿的缤纷模式。",
    },
    avatar: "aladdin-v2",
    accent: "emerald",
    configType: "color",
    reportEmphasis: "color",
  },
];

// Keep backward-compat exports
export const aiPartners = allCharacters.filter((c) =>
  ["elon", "gambling", "aladdin", "luckystar", "achelois"].includes(c.id)
);
export const characterModels = allCharacters.filter((c) =>
  ["dragon", "phoenix", "tiger"].includes(c.id)
);

/** Generate mock simulation result */
export const runSimulation = (selectedNumbers: number[], partnerId: string) => {
  const probability = Math.floor(Math.random() * 30) + 25;
  const volatility = Math.floor(Math.random() * 40) + 30;
  const patternDensity = Math.floor(Math.random() * 50) + 30;
  const oddCount = selectedNumbers.filter((n) => n % 2 !== 0).length;
  const evenCount = 6 - oddCount;
  const sum = selectedNumbers.reduce((a, b) => a + b, 0);
  const highCount = selectedNumbers.filter((n) => n >= 25).length;
  const lowCount = 6 - highCount;
  const hasConsecutive = selectedNumbers.sort((a, b) => a - b).some((n, i, arr) => i > 0 && n - arr[i - 1] === 1);

  return {
    probability,
    volatility,
    patternDensity,
    oddEven: `${oddCount}:${evenCount}`,
    highLow: `${highCount}:${lowCount}`,
    sum,
    sumRange: sum >= 91 && sum <= 230 ? "optimal" : "outside",
    hasConsecutive,
    hotNumbers: selectedNumbers.filter((n) => [12, 18, 36, 44, 46, 31, 22].includes(n)),
    coldNumbers: selectedNumbers.filter((n) => [43, 32, 25, 48, 47].includes(n)),
  };
};

/** Trilingual labels for the AI Games page */
export const mark6Labels = {
  en: {
    title: "AI Mark 6 Probability",
    subtitle: "Choose Your AI Partner for Probability Analysis",
    whichGenius: "Which genius shall guide your luck today?",
    credits: "Credits",
    topUp: "TOP-UP",
    langTabs: ["English", "繁體中文", "简体中文"],
    aiPartners: "AI Partners",
    clickPartner: "Click any partner to view their profile",
    select: "SELECT",
    startGame: "START GAME",
    poweredBy: "Powered by Dragon AI",
    historicalTitle: "📜 Historical Draw Results",
    drawId: "Draw",
    date: "Date",
    numbers: "Numbers",
    extra: "Extra",
    heatmapTitle: "🔥 Frequency Heatmap",
    hot: "Hot",
    cold: "Cold",
    pickNumbers: "🎯 Pick Your Numbers",
    pickDesc: "Select 6 numbers (1-49) for probability simulation",
    selected: "Selected",
    clear: "Clear",
    runSimulation: "Run Probability Simulation",
    loginRequired: "Please log in to use AI analysis",
    disclaimer: "Principle of Self-Decision: This is a mathematical AI model for cognitive engagement. It does NOT predict lottery results.",
    goToStocks: "Go to AI Stocks Probability Now",
    chooseModel: "Choose Your AI Model",
    chooseModelDesc: "Click a character to configure and select their model",
  },
  tc: {
    title: "AI Mark 6 概率分析",
    subtitle: "選擇您的 AI 夥伴進行概率分析",
    whichGenius: "今天哪位天才為你指點迷津？",
    credits: "積分",
    topUp: "充值",
    langTabs: ["English", "繁體中文", "简体中文"],
    aiPartners: "AI 夥伴",
    clickPartner: "點擊任何夥伴查看其簡介",
    select: "選擇",
    startGame: "開始遊戲",
    poweredBy: "由 Dragon AI 驅動",
    historicalTitle: "📜 歷史攪珠結果",
    drawId: "期數",
    date: "日期",
    numbers: "號碼",
    extra: "特別號碼",
    heatmapTitle: "🔥 冷熱號碼頻率",
    hot: "熱門",
    cold: "冷門",
    pickNumbers: "🎯 選擇號碼",
    pickDesc: "選擇 6 個號碼 (1-49) 進行概率模擬",
    selected: "已選",
    clear: "清除",
    runSimulation: "運行概率模擬",
    loginRequired: "請登入以使用 AI 分析",
    disclaimer: "自主決策原則：本網站為數學 AI 模型，用於認知參與，不能預測彩票結果。",
    goToStocks: "立即前往 AI 股票概率",
    chooseModel: "選擇你的 AI 模型",
    chooseModelDesc: "點擊角色以配置和選擇其模型",
  },
  sc: {
    title: "AI Mark 6 概率分析",
    subtitle: "选择您的 AI 伙伴进行概率分析",
    whichGenius: "今天哪位天才为你指点迷津？",
    credits: "积分",
    topUp: "充值",
    langTabs: ["English", "繁體中文", "简体中文"],
    aiPartners: "AI 伙伴",
    clickPartner: "点击任何伙伴查看其简介",
    select: "选择",
    startGame: "开始游戏",
    poweredBy: "由 Dragon AI 驱动",
    historicalTitle: "📜 历史搅珠结果",
    drawId: "期数",
    date: "日期",
    numbers: "号码",
    extra: "特别号码",
    heatmapTitle: "🔥 冷热号码频率",
    hot: "热门",
    cold: "冷门",
    pickNumbers: "🎯 选择号码",
    pickDesc: "选择 6 个号码 (1-49) 进行概率模拟",
    selected: "已选",
    clear: "清除",
    runSimulation: "运行概率模拟",
    loginRequired: "请登入以使用 AI 分析",
    disclaimer: "自主决策原则：本网站为数学 AI 模型，用于认知参与，不能预测彩票结果。",
    goToStocks: "立即前往 AI 股票概率",
    chooseModel: "选择你的 AI 模型",
    chooseModelDesc: "点击角色以配置和选择其模型",
  },
};
