import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { LangKey } from "@/contexts/LanguageContext";

const labels = {
  en: {
    title: "12-Month Price vs. Index Performance",
    stock: "Stock",
    index: "Index",
    legend: "Indexed to 100 at start of period. Past performance is not indicative of future results.",
  },
  tc: {
    title: "12個月股價 vs 指數表現",
    stock: "股票",
    index: "指數",
    legend: "以期初為基數 100 計算。過往表現並非未來表現的指標。",
  },
  sc: {
    title: "12个月股价 vs 指数表现",
    stock: "股票",
    index: "指数",
    legend: "以期初为基数 100 计算。过往表现并非未来表现的指标。",
  },
};

/* Generate synthetic 12-month performance data based on ticker */
const generatePerformanceData = (ticker: string) => {
  const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
  const seed = ticker.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = (i: number) => Math.sin(seed * 0.1 + i * 0.7) * 0.5 + 0.5;

  let stockVal = 100;
  let indexVal = 100;

  return months.map((m, i) => {
    if (i > 0) {
      stockVal += (rng(i) - 0.4) * 8;
      indexVal += (rng(i + 50) - 0.45) * 5;
    }
    return {
      month: m,
      stock: Math.round(stockVal * 10) / 10,
      index: Math.round(indexVal * 10) / 10,
    };
  });
};

/* Map ticker to benchmark */
const getIndexName = (ticker: string): string => {
  if (ticker.endsWith(".HK")) return "HSI";
  if (ticker.endsWith(".TW")) return "TAIEX";
  return "S&P 500";
};

interface Props {
  lang: LangKey;
  ticker: string;
  companyName?: string;
}

const PriceVsIndexChart = ({ lang, ticker, companyName }: Props) => {
  const l = labels[lang];
  const data = generatePerformanceData(ticker);
  const indexName = getIndexName(ticker);
  const stockLabel = companyName || ticker;

  return (
    <div style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
      <h3
        className="text-[15px] font-bold tracking-wide uppercase pb-2 mb-4"
        style={{
          fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
          color: "#1e293b",
          borderBottom: "2px solid #1e293b",
        }}
      >
        {l.title}
      </h3>

      <div
        className="rounded p-4"
        style={{ border: "1px solid #e5e7eb", background: "#fafbfc" }}
      >
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              domain={[(dataMin: number) => Math.floor(Math.min(dataMin, 95)), (dataMax: number) => Math.ceil(Math.max(dataMax, 105))]}
            />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "none",
                borderRadius: "4px",
                fontSize: "11px",
                color: "#ffffff",
              }}
              itemStyle={{ color: "#ffffff" }}
              labelStyle={{ color: "#94a3b8", fontSize: "10px" }}
            />
            <Legend
              wrapperStyle={{ fontSize: "10px", color: "#64748b" }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="stock"
              name={`${stockLabel} (${l.stock})`}
              stroke="#003366"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: "#003366" }}
            />
            <Line
              type="monotone"
              dataKey="index"
              name={indexName}
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              dot={false}
              activeDot={{ r: 3, fill: "#94a3b8" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-2 text-[9px] italic leading-relaxed" style={{ color: "#94a3b8" }}>
        {l.legend}
      </p>
    </div>
  );
};

export default PriceVsIndexChart;
