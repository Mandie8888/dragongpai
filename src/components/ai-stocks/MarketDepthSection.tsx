import type { LangKey } from "@/contexts/LanguageContext";

const t = {
  en: {
    title: "Market Depth",
    bid: "Bid",
    ask: "Ask",
    dayRange: "Day Range",
    volume: "Volume",
    size: "Size",
    marketStatus: "Market Status",
    open: "Market Open",
    closed: "Market Closed",
    preMarket: "Pre-Market",
    afterHours: "After Hours",
    prevCloseVol: "Prev. Close Vol",
  },
  tc: {
    title: "市場深度",
    bid: "買入價",
    ask: "賣出價",
    dayRange: "日內波幅",
    volume: "成交量",
    size: "手數",
    marketStatus: "市場狀態",
    open: "交易中",
    closed: "已收市",
    preMarket: "盤前交易",
    afterHours: "盤後交易",
    prevCloseVol: "前日成交量",
  },
  sc: {
    title: "市场深度",
    bid: "买入价",
    ask: "卖出价",
    dayRange: "日内波幅",
    volume: "成交量",
    size: "手数",
    marketStatus: "市场状态",
    open: "交易中",
    closed: "已收市",
    preMarket: "盘前交易",
    afterHours: "盘后交易",
    prevCloseVol: "前日成交量",
  },
};

interface Props {
  lang: LangKey;
  bid: number;
  ask: number;
  bidSize: number;
  askSize: number;
  dayRange: string;
  volume: string;
  marketState: string;
  currencySymbol: string;
  previousCloseVolume?: string;
}

const MarketDepthSection = ({
  lang, bid, ask, bidSize, askSize, dayRange, volume, marketState, currencySymbol, previousCloseVolume,
}: Props) => {
  const l = t[lang];

  const getMarketStatusLabel = () => {
    switch (marketState) {
      case "REGULAR": return { label: l.open, color: "#15803d", bg: "#dcfce7" };
      case "PRE": case "PREPRE": return { label: l.preMarket, color: "#b45309", bg: "#fef3c7" };
      case "POST": case "POSTPOST": return { label: l.afterHours, color: "#7c3aed", bg: "#ede9fe" };
      default: return { label: l.closed, color: "#dc2626", bg: "#fee2e2" };
    }
  };

  const status = getMarketStatusLabel();
  const isMarketClosed = marketState !== "REGULAR";
  const displayVolume = isMarketClosed && volume === "0" && previousCloseVolume
    ? previousCloseVolume
    : volume;

  return (
    <div className="py-5" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-[15px] font-bold tracking-wide uppercase pb-2"
          style={{
            fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
            color: "#1e293b",
            borderBottom: "2px solid #1e293b",
            flex: 1,
          }}
        >
          {l.title}
        </h3>
        <span
          className="text-[10px] font-bold px-3 py-1 rounded-full ml-3 shrink-0"
          style={{ background: status.bg, color: status.color }}
        >
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Bid */}
        <div className="p-3 text-center rounded" style={{ border: "1px solid rgba(21,128,61,0.2)", background: "#f0fdf4" }}>
          <p className="text-[10px] uppercase tracking-[0.1em]" style={{ color: "#64748b" }}>{l.bid}</p>
          <p className="text-[15px] font-bold mt-1" style={{ color: "#15803d" }}>
            {currencySymbol}{bid.toFixed(2)}
          </p>
          <p className="text-[9px] mt-0.5" style={{ color: "#94a3b8" }}>
            {l.size}: {bidSize.toLocaleString()}
          </p>
        </div>

        {/* Ask */}
        <div className="p-3 text-center rounded" style={{ border: "1px solid rgba(220,38,38,0.2)", background: "#fef2f2" }}>
          <p className="text-[10px] uppercase tracking-[0.1em]" style={{ color: "#64748b" }}>{l.ask}</p>
          <p className="text-[15px] font-bold mt-1" style={{ color: "#dc2626" }}>
            {currencySymbol}{ask.toFixed(2)}
          </p>
          <p className="text-[9px] mt-0.5" style={{ color: "#94a3b8" }}>
            {l.size}: {askSize.toLocaleString()}
          </p>
        </div>

        {/* Day Range */}
        <div className="p-3 text-center rounded" style={{ border: "1px solid #e5e7eb", background: "#f8fafc" }}>
          <p className="text-[10px] uppercase tracking-[0.1em]" style={{ color: "#64748b" }}>{l.dayRange}</p>
          <p className="text-[13px] font-bold mt-1" style={{ color: "#1e293b" }}>{dayRange}</p>
        </div>

        {/* Volume */}
        <div className="p-3 text-center rounded" style={{ border: "1px solid #e5e7eb", background: "#f8fafc" }}>
          <p className="text-[10px] uppercase tracking-[0.1em]" style={{ color: "#64748b" }}>
            {isMarketClosed && previousCloseVolume ? l.prevCloseVol : l.volume}
          </p>
          <p className="text-[15px] font-bold mt-1" style={{ color: "#b45309" }}>{displayVolume}</p>
        </div>
      </div>
    </div>
  );
};

export default MarketDepthSection;
