import { useState, useEffect } from "react";
import { useLanguage, type LangKey } from "@/contexts/LanguageContext";
import type { CharacterModel, CharacterConfig } from "./mark6-data";
import { getBallColor } from "./mark6-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Play } from "lucide-react";

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

/* ── Trilingual UI labels ── */
const labels = {
  select: { en: "Select this Model", tc: "選擇此模型", sc: "选择此模型" },
  habit: { en: "Mathematical Habit", tc: "數學習慣", sc: "数学习惯" },
  style: { en: "Analysis Style", tc: "分析風格", sc: "分析风格" },
  method: { en: "Mathematical Model", tc: "數學模型", sc: "数学模型" },
  disclaimer: {
    en: "This character uses a specific mathematical model for probability analysis; it is not a guarantee of results.",
    tc: "此角色使用特定的數學模型進行概率分析；不保證結果。",
    sc: "此角色使用特定的数学模型进行概率分析；不保证结果。",
  },
  // Elon
  bankerTitle: { en: "Select Banker Numbers (膽)", tc: "選擇膽碼", sc: "选择胆码" },
  bankerDesc: { en: "Choose 1–5 numbers as your Bankers", tc: "選擇1-5個號碼作為膽碼", sc: "选择1-5个号码作为胆码" },
  // Gambling
  patternTitle: { en: "Choose Pattern Type", tc: "選擇模式類型", sc: "选择模式类型" },
  hotPatterns: { en: "🔥 Hot Patterns", tc: "🔥 熱門模式", sc: "🔥 热门模式" },
  coldPatterns: { en: "❄️ Cold Patterns", tc: "❄️ 冷門模式", sc: "❄️ 冷门模式" },
  hotDesc: { en: "Focus on numbers with high recent frequency", tc: "專注於近期高頻號碼", sc: "专注于近期高频号码" },
  coldDesc: { en: "Focus on overdue numbers ready to break out", tc: "專注於即將突破的冷門號碼", sc: "专注于即将突破的冷门号码" },
  // Lucky Star
  autoTitle: { en: "Monte Carlo Simulation", tc: "蒙特卡羅模擬", sc: "蒙特卡罗模拟" },
  autoDesc: { en: "No configuration needed — runs 1,000,000 virtual draws automatically.", tc: "無需配置 — 自動進行一百萬次虛擬抽獎。", sc: "无需配置 — 自动进行一百万次虚拟抽奖。" },
  startSim: { en: "Start Simulation", tc: "開始模擬", sc: "开始模拟" },
  // Achelois
  distTitle: { en: "Choose Distribution Mode", tc: "選擇分佈模式", sc: "选择分布模式" },
  oddEven: { en: "Odd / Even", tc: "奇數 / 偶數", sc: "奇数 / 偶数" },
  highLow: { en: "High / Low", tc: "大號 / 小號", sc: "大号 / 小号" },
  selectRatio: { en: "Select Ratio", tc: "選擇比例", sc: "选择比例" },
  // Aladdin
  colorTitle: { en: "Select Vibration Color", tc: "選擇振動顏色", sc: "选择振动颜色" },
  colorDesc: { en: "Choose your preferred color frequency", tc: "選擇你偏好的顏色頻率", sc: "选择你偏好的颜色频率" },
  colorRatioTitle: { en: "Select Color Ratio (R:B:G)", tc: "選擇顏色比例 (紅:藍:綠)", sc: "选择颜色比例 (红:蓝:绿)" },
  colorRatioDesc: { en: "Distribution of 6 numbers across Red, Blue, Green", tc: "6 個號碼在紅、藍、綠中的分佈", sc: "6 个号码在红、蓝、绿中的分布" },
};

const l = (key: keyof typeof labels, lang: LangKey) => labels[key][lang];

const ratioOptions = ["6/0", "5/1", "4/2", "3/3", "2/4", "1/5", "0/6"];
const colorRatioOptions = ["3:2:1", "3:1:2", "2:2:2", "2:3:1", "2:1:3", "1:2:3", "1:3:2", "4:1:1", "1:4:1", "1:1:4"];

interface Props {
  character: CharacterModel | null;
  open: boolean;
  onClose: () => void;
  onSelect: (id: string, config: CharacterConfig) => void;
}

const CharacterProfileModal = ({ character, open, onClose, onSelect }: Props) => {
  const { lang } = useLanguage();

  // Config state
  const [bankerNumbers, setBankerNumbers] = useState<number[]>([]);
  const [pattern, setPattern] = useState<"hot" | "cold" | null>(null);
  const [distMode, setDistMode] = useState<"odd-even" | "high-low" | null>(null);
  const [distRatio, setDistRatio] = useState<string | null>(null);
  const [color, setColor] = useState<"red" | "blue" | "green" | null>(null);
  const [colorRatio, setColorRatio] = useState<string | null>(null);

  // Reset config when character changes
  useEffect(() => {
    setBankerNumbers([]);
    setPattern(null);
    setDistMode(null);
    setDistRatio(null);
    setColor(null);
    setColorRatio(null);
  }, [character?.id]);

  if (!character) return null;

  const accentBorder =
    character.accent === "amber"
      ? "border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
      : character.accent === "red"
      ? "border-red-400/60 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
      : character.accent === "emerald"
      ? "border-emerald-400/60 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
      : "border-blue-400/60 shadow-[0_0_30px_rgba(59,130,246,0.2)]";

  const accentGlow =
    character.accent === "amber"
      ? "from-amber-500 to-yellow-400"
      : character.accent === "red"
      ? "from-red-500 to-orange-400"
      : character.accent === "emerald"
      ? "from-emerald-500 to-teal-400"
      : "from-blue-500 to-cyan-400";

  const subtitleColor =
    character.accent === "amber" ? "text-amber-400" :
    character.accent === "red" ? "text-red-400" :
    character.accent === "emerald" ? "text-emerald-400" :
    "text-blue-400";

  // Build config & check validity
  const buildConfig = (): CharacterConfig | null => {
    switch (character.configType) {
      case "none": return { type: "none" };
      case "banker": return bankerNumbers.length >= 1 ? { type: "banker", bankerNumbers } : null;
      case "pattern": return pattern ? { type: "pattern", pattern } : null;
      case "auto": return { type: "auto" };
      case "distribution": return distMode && distRatio ? { type: "distribution", mode: distMode, ratio: distRatio } : null;
      case "color": return color && colorRatio ? { type: "color", color, colorRatio } : null;
      default: return null;
    }
  };

  const isReady = buildConfig() !== null;

  const handleSelect = () => {
    const cfg = buildConfig();
    if (cfg) {
      onSelect(character.id, cfg);
      onClose();
    }
  };

  const toggleBanker = (n: number) => {
    setBankerNumbers((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : prev.length < 5 ? [...prev, n] : prev
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className={`max-w-md max-h-[90vh] overflow-y-auto bg-black/80 backdrop-blur-xl border-2 ${accentBorder} rounded-2xl p-0`}
      >
        <div className={`h-1 bg-gradient-to-r ${accentGlow}`} />

        <div className="p-6 space-y-4">
          <DialogHeader className="items-center text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 mx-auto mb-2 shadow-lg">
              <img src={avatarMap[character.avatar]} alt={character.name.en} className="w-full h-full object-cover" />
            </div>
            <DialogTitle className="text-2xl font-extrabold text-foreground">{character.name[lang]}</DialogTitle>
            <DialogDescription className={`text-sm font-semibold ${subtitleColor}`}>
              {character.subtitle[lang]}
            </DialogDescription>
          </DialogHeader>

          {/* Bio */}
          <p className="text-xs text-white/90 text-center leading-relaxed italic">"{character.bio[lang]}"</p>

          {/* Method */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-1">
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider">📐 {l("method", lang)}</h4>
            <p className="text-sm font-semibold text-white">{character.method[lang]}</p>
          </div>

          {/* Habit */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-1">
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider">🧠 {l("habit", lang)}</h4>
            <p className="text-xs text-white/90 leading-relaxed">{character.habit[lang]}</p>
          </div>

          {/* Style */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-1">
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider">⚡ {l("style", lang)}</h4>
            <p className="text-xs text-white/90 leading-relaxed">{character.style[lang]}</p>
          </div>

          {/* ── Character-specific config ── */}
          {character.configType === "banker" && (
            <div className="rounded-xl border border-amber-400/30 bg-amber-950/20 p-3 space-y-2">
              <h4 className="text-xs font-bold text-amber-400">{l("bankerTitle", lang)}</h4>
              <p className="text-[10px] text-white/70">{l("bankerDesc", lang)}</p>
              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: 49 }, (_, i) => i + 1).map((n) => {
                  const sel = bankerNumbers.includes(n);
                  return (
                    <button
                      key={n}
                      onClick={() => toggleBanker(n)}
                      className={`aspect-square rounded-full text-[11px] font-extrabold transition-all flex items-center justify-center ${
                        sel
                          ? `${getBallColor(n)} text-white shadow-[0_0_12px_rgba(245,158,11,0.6)] ring-2 ring-amber-400 scale-110`
                          : `${getBallColor(n)} text-white opacity-60 hover:opacity-100 hover:scale-105`
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
              {bankerNumbers.length > 0 && (
                <div className="flex gap-1 mt-1">
                  <span className="text-[10px] text-amber-400 font-medium">膽:</span>
                  {bankerNumbers.sort((a, b) => a - b).map((n) => (
                    <span key={n} className={`w-6 h-6 rounded-full ${getBallColor(n)} text-white text-[9px] font-bold flex items-center justify-center`}>{n}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {character.configType === "pattern" && (
            <div className="rounded-xl border border-red-400/30 bg-red-950/20 p-3 space-y-2">
              <h4 className="text-xs font-bold text-red-400">{l("patternTitle", lang)}</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPattern("hot")}
                  className={`rounded-lg border p-3 text-center transition-all ${pattern === "hot" ? "border-red-400 bg-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.3)]" : "border-white/10 bg-white/[0.03] hover:border-white/20"}`}
                >
                  <div className="text-sm font-bold text-foreground">{l("hotPatterns", lang)}</div>
                  <div className="text-[9px] text-white/70 mt-1">{l("hotDesc", lang)}</div>
                </button>
                <button
                  onClick={() => setPattern("cold")}
                  className={`rounded-lg border p-3 text-center transition-all ${pattern === "cold" ? "border-blue-400 bg-blue-500/20 shadow-[0_0_12px_rgba(59,130,246,0.3)]" : "border-white/10 bg-white/[0.03] hover:border-white/20"}`}
                >
                  <div className="text-sm font-bold text-foreground">{l("coldPatterns", lang)}</div>
                  <div className="text-[9px] text-white/70 mt-1">{l("coldDesc", lang)}</div>
                </button>
              </div>
            </div>
          )}

          {character.configType === "auto" && (
            <div className="rounded-xl border border-amber-400/30 bg-amber-950/20 p-3 space-y-2 text-center">
              <h4 className="text-xs font-bold text-amber-400">{l("autoTitle", lang)}</h4>
              <p className="text-[10px] text-white/70">{l("autoDesc", lang)}</p>
            </div>
          )}

          {character.configType === "distribution" && (
            <div className="rounded-xl border border-blue-400/30 bg-blue-950/20 p-3 space-y-3">
              <h4 className="text-xs font-bold text-blue-400">{l("distTitle", lang)}</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setDistMode("odd-even"); setDistRatio(null); }}
                  className={`rounded-lg border-2 p-2 text-xs font-extrabold text-center transition-all ${distMode === "odd-even" ? "border-amber-400 bg-amber-500/20 text-white shadow-[0_0_12px_rgba(245,158,11,0.3)]" : "border-white/20 bg-white/[0.06] text-white/80 hover:border-white/40"}`}
                >
                  {l("oddEven", lang)}
                </button>
                <button
                  onClick={() => { setDistMode("high-low"); setDistRatio(null); }}
                  className={`rounded-lg border-2 p-2 text-xs font-extrabold text-center transition-all ${distMode === "high-low" ? "border-amber-400 bg-amber-500/20 text-white shadow-[0_0_12px_rgba(245,158,11,0.3)]" : "border-white/20 bg-white/[0.06] text-white/80 hover:border-white/40"}`}
                >
                  {l("highLow", lang)}
                </button>
              </div>
              {distMode && (
                <>
                  <p className="text-[10px] text-white/70">{l("selectRatio", lang)}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {ratioOptions.map((r) => (
                      <button
                        key={r}
                        onClick={() => setDistRatio(r)}
                        className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all ${distRatio === r ? "bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.4)]" : "bg-white/[0.08] text-white/80 border border-white/20 hover:border-white/40"}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {character.configType === "color" && (
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-950/20 p-3 space-y-3">
              <h4 className="text-xs font-bold text-emerald-400">{l("colorTitle", lang)}</h4>
              <p className="text-[10px] text-white/70">{l("colorDesc", lang)}</p>
              <div className="flex justify-center gap-4">
                {(["red", "blue", "green"] as const).map((c) => {
                  const bg = c === "red" ? "bg-red-500" : c === "blue" ? "bg-blue-500" : "bg-emerald-500";
                  const glow = c === "red" ? "shadow-[0_0_16px_rgba(239,68,68,0.6)]" : c === "blue" ? "shadow-[0_0_16px_rgba(59,130,246,0.6)]" : "shadow-[0_0_16px_rgba(16,185,129,0.6)]";
                  const label = c === "red" ? (lang === "en" ? "Red" : "紅") : c === "blue" ? (lang === "en" ? "Blue" : "藍") : (lang === "en" ? "Green" : "綠");
                  return (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`flex flex-col items-center gap-1 transition-all ${color === c ? "scale-110" : "opacity-60 hover:opacity-100"}`}
                    >
                      <div className={`w-12 h-12 rounded-full ${bg} ${color === c ? glow : ""} border-2 ${color === c ? "border-white" : "border-white/20"} transition-all`} />
                      <span className="text-xs font-bold text-white">{label}</span>
                    </button>
                  );
                })}
              </div>
              {/* Color Ratio Selection */}
              {color && (
                <>
                  <h4 className="text-xs font-bold text-emerald-400 mt-2">{l("colorRatioTitle", lang)}</h4>
                  <p className="text-[10px] text-white/70">{l("colorRatioDesc", lang)}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {colorRatioOptions.map((r) => (
                      <button
                        key={r}
                        onClick={() => setColorRatio(r)}
                        className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all ${colorRatio === r ? "bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.4)]" : "bg-white/[0.08] text-white/80 border border-white/20 hover:border-white/40"}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-[9px] text-white/50 text-center italic">{l("disclaimer", lang)}</p>

          {/* Select button */}
          <Button
            onClick={handleSelect}
            disabled={!isReady}
            className={`w-full rounded-full bg-gradient-to-r ${accentGlow} text-white font-bold py-3 hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            {character.configType === "auto" ? (
              <><Play size={16} className="mr-2" />{l("startSim", lang)}</>
            ) : (
              <><Sparkles size={16} className="mr-2" />{l("select", lang)}</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterProfileModal;
