import { TrendingUp, Target, ArrowUpRight } from "lucide-react";
import type { LangKey } from "@/contexts/LanguageContext";

const labels = {
  en: {
    rating: "AI Rating",
    targetPrice: "12-Mo Target Price",
    upside: "Upside Potential",
    consensus: "Consensus",
    overweight: "OVERWEIGHT",
    buy: "BUY",
    hold: "HOLD",
    sell: "SELL",
    underweight: "UNDERWEIGHT",
  },
  tc: {
    rating: "AI 評級",
    targetPrice: "12個月目標價",
    upside: "上升潛力",
    consensus: "共識",
    overweight: "增持",
    buy: "買入",
    hold: "持有",
    sell: "賣出",
    underweight: "減持",
  },
  sc: {
    rating: "AI 评级",
    targetPrice: "12个月目标价",
    upside: "上升潜力",
    consensus: "共识",
    overweight: "增持",
    buy: "买入",
    hold: "持有",
    sell: "卖出",
    underweight: "减持",
  },
};

interface Props {
  lang: LangKey;
  currentPrice: string;
  targetPrice: string;
  buyPct: number;
  holdPct: number;
  sellPct: number;
}

const RecommendationSidebar = ({ lang, currentPrice, targetPrice, buyPct, holdPct, sellPct }: Props) => {
  const l = labels[lang];

  const parsePrice = (v: string) => parseFloat(v.replace(/[^0-9.\-]/g, ""));
  const cur = parsePrice(currentPrice);
  const tgt = parsePrice(targetPrice);
  const upside = cur > 0 ? (((tgt - cur) / cur) * 100).toFixed(1) : "—";
  const upsideNum = parseFloat(upside as string);
  const isPositive = !isNaN(upsideNum) && upsideNum > 0;

  // Determine rating based on buy/hold/sell consensus
  let ratingLabel = l.hold;
  let ratingColor = "#b45309";
  let ratingBg = "#fffbeb";
  let ratingBorder = "#fbbf24";
  if (buyPct >= 60) {
    ratingLabel = l.buy;
    ratingColor = "#15803d";
    ratingBg = "#f0fdf4";
    ratingBorder = "#86efac";
  } else if (buyPct >= 45) {
    ratingLabel = l.overweight;
    ratingColor = "#0f766e";
    ratingBg = "#f0fdfa";
    ratingBorder = "#5eead4";
  } else if (sellPct >= 50) {
    ratingLabel = l.sell;
    ratingColor = "#dc2626";
    ratingBg = "#fef2f2";
    ratingBorder = "#fca5a5";
  } else if (sellPct >= 35) {
    ratingLabel = l.underweight;
    ratingColor = "#c2410c";
    ratingBg = "#fff7ed";
    ratingBorder = "#fdba74";
  }

  return (
    <div
      style={{
        border: `2px solid ${ratingBorder}`,
        background: ratingBg,
        borderRadius: "6px",
        pageBreakInside: "avoid",
        breakInside: "avoid",
      }}
      className="p-5 space-y-4"
    >
      {/* Rating */}
      <div className="text-center">
        <p className="text-[9px] uppercase tracking-[0.15em] mb-1" style={{ color: "#94a3b8" }}>
          {l.rating}
        </p>
        <div
          className="inline-flex items-center gap-2 px-5 py-3"
          style={{
            background: "linear-gradient(135deg, #D4AF37, #F7EF8A)",
            color: "#1e293b",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "18px",
            fontWeight: 900,
            letterSpacing: "0.05em",
            clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
            boxShadow: "0 2px 12px rgba(212,175,55,0.35)",
          }}
        >
          <TrendingUp size={18} />
          {ratingLabel}
        </div>
      </div>

      {/* Target Price */}
      <div className="text-center pt-2" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <p className="text-[9px] uppercase tracking-[0.15em] mb-1" style={{ color: "#94a3b8" }}>
          <Target size={10} className="inline mr-1" />
          {l.targetPrice}
        </p>
        <p className="text-[24px] font-bold" style={{ color: "#1e293b", fontFamily: "'Inter', sans-serif" }}>
          {targetPrice}
        </p>
      </div>

      {/* Upside */}
      <div className="text-center pt-2" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <p className="text-[9px] uppercase tracking-[0.15em] mb-1" style={{ color: "#94a3b8" }}>
          <ArrowUpRight size={10} className="inline mr-1" />
          {l.upside}
        </p>
        <p
          className="text-[28px] font-black"
          style={{ color: isPositive ? "#15803d" : "#dc2626" }}
        >
          {isPositive ? "+" : ""}{upside}%
        </p>
      </div>

      {/* Consensus breakdown */}
      <div className="pt-2" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <p className="text-[9px] uppercase tracking-[0.15em] mb-2 text-center" style={{ color: "#94a3b8" }}>
          {l.consensus}
        </p>
        <div className="flex gap-1 h-[6px] rounded-full overflow-hidden">
          <div style={{ width: `${buyPct}%`, background: "#15803d" }} />
          <div style={{ width: `${holdPct}%`, background: "#b45309" }} />
          <div style={{ width: `${sellPct}%`, background: "#dc2626" }} />
        </div>
        <div className="flex justify-between mt-1 text-[9px]" style={{ color: "#64748b" }}>
          <span>{l.buy} {buyPct}%</span>
          <span>{l.hold} {holdPct}%</span>
          <span>{l.sell} {sellPct}%</span>
        </div>
      </div>
    </div>
  );
};

export default RecommendationSidebar;
