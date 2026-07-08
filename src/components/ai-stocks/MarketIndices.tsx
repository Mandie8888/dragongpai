import SparklineChart from "./SparklineChart";
import type { LangKey } from "@/contexts/LanguageContext";

const indices = [
  {
    symbol: "S&P 500",
    price: "5,842.31",
    change: "+1.12%",
    up: true,
    data: [40, 42, 38, 44, 43, 47, 45, 50, 48, 52, 54, 53, 56],
  },
  {
    symbol: "NASDAQ",
    price: "18,421.07",
    change: "+1.58%",
    up: true,
    data: [30, 33, 29, 35, 37, 34, 39, 42, 40, 44, 46, 45, 48],
  },
  {
    symbol: "HSI",
    price: "22,156.80",
    change: "-0.47%",
    up: false,
    data: [55, 53, 56, 52, 50, 51, 48, 49, 46, 47, 44, 45, 43],
  },
  {
    symbol: "TAIEX",
    price: "22,880.15",
    change: "+0.83%",
    up: true,
    data: [38, 40, 37, 41, 39, 43, 44, 42, 46, 45, 47, 49, 50],
  },
];

const indicatorLabels: Record<string, Record<LangKey, string>> = {
  rsi: { en: "RSI", tc: "RSI", sc: "RSI" },
  macd: { en: "MACD", tc: "MACD", sc: "MACD" },
  bb: { en: "Bollinger", tc: "布林帶", sc: "布林带" },
};

const indicatorData = [
  { key: "rsi", value: "57.0", status: "Neutral", data: [45, 48, 52, 55, 58, 56, 54, 57, 59, 57] },
  { key: "macd", value: "1.36", status: "Bullish", data: [20, 22, 25, 28, 30, 29, 32, 35, 33, 36] },
  { key: "bb", value: "Mid-Band", status: "Stable", data: [50, 48, 52, 49, 53, 51, 54, 52, 55, 53] },
];

const MarketIndices = ({ lang }: { lang: LangKey }) => (
  <div className="max-w-5xl w-full mx-auto px-6 space-y-4 mb-8">
    {/* Index ticker strip */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {indices.map((idx) => (
        <div
          key={idx.symbol}
          className="rounded-xl border border-white/5 bg-white/[0.03] backdrop-blur-md p-3 flex items-center gap-3"
        >
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">{idx.symbol}</p>
            <p className="text-sm font-bold text-foreground">{idx.price}</p>
            <p className={`text-xs font-semibold ${idx.up ? "text-emerald-400" : "text-red-400"}`}>
              {idx.change}
            </p>
          </div>
          <SparklineChart data={idx.data} color={idx.up ? "#22c55e" : "#ef4444"} width={80} height={32} />
        </div>
      ))}
    </div>

    {/* Technical indicator mini-widgets */}
    <div className="grid grid-cols-3 gap-3">
      {indicatorData.map((ind) => (
        <div
          key={ind.key}
          className="rounded-xl border border-white/5 bg-white/[0.03] backdrop-blur-md p-3 text-center space-y-1"
        >
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {indicatorLabels[ind.key][lang]}
          </p>
          <SparklineChart data={ind.data} color="#f59e0b" width={100} height={24} />
          <p className="text-sm font-bold text-foreground">{ind.value}</p>
          <p className="text-[10px] text-amber-400 font-medium">{ind.status}</p>
        </div>
      ))}
    </div>
  </div>
);

export default MarketIndices;
