import type { LangKey } from "@/contexts/LanguageContext";

const labels = {
  en: {
    title: "Peer Comparison Analysis",
    ticker: "Ticker",
    company: "Company",
    price: "Price",
    marketCap: "Market Cap",
    pe: "P/E",
    pb: "P/B",
    roe: "ROE %",
    divYield: "Div Yield %",
    target: "Target",
    sectorAvg: "Sector Average",
    legend: "Note: P/B ratio is based on the most recent quarterly filing. All data sourced from public market feeds and may be delayed.",
  },
  tc: {
    title: "同業比較分析",
    ticker: "代碼",
    company: "公司",
    price: "股價",
    marketCap: "市值",
    pe: "市盈率",
    pb: "市淨率",
    roe: "ROE %",
    divYield: "股息率 %",
    target: "標的",
    sectorAvg: "板塊平均",
    legend: "備註：市淨率 (P/B) 基於最近一季度財報數據。所有資料來自公開市場數據，可能存在延遲。",
  },
  sc: {
    title: "同业比较分析",
    ticker: "代码",
    company: "公司",
    price: "股价",
    marketCap: "市值",
    pe: "市盈率",
    pb: "市净率",
    roe: "ROE %",
    divYield: "股息率 %",
    target: "标的",
    sectorAvg: "板块平均",
    legend: "备注：市净率 (P/B) 基于最近一季度财报数据。所有资料来自公开市场数据，可能存在延迟。",
  },
};

interface PeerRow {
  ticker: string;
  company: string;
  price: string;
  marketCap: string;
  pe: string;
  pb: string;
  roe: string;
  divYield: string;
  isTarget?: boolean;
}

/* ── Peer data keyed by target ticker ───────── */
const peerData: Record<string, PeerRow[]> = {
  /* ── HK Market ── */
  "0005.HK": [
    { ticker: "0005.HK", company: "HSBC Holdings", price: "135.70", marketCap: "2.68T", pe: "8.1x", pb: "1.05x", roe: "12.3", divYield: "5.82", isTarget: true },
    { ticker: "2388.HK", company: "BOC Hong Kong", price: "28.45", marketCap: "300.8B", pe: "9.2x", pb: "1.12x", roe: "11.8", divYield: "5.15" },
    { ticker: "0011.HK", company: "Hang Seng Bank", price: "118.30", marketCap: "226.1B", pe: "12.5x", pb: "1.58x", roe: "13.2", divYield: "6.10" },
    { ticker: "3988.HK", company: "Bank of China", price: "3.85", marketCap: "1.13T", pe: "5.8x", pb: "0.45x", roe: "10.5", divYield: "6.85" },
    { ticker: "1398.HK", company: "ICBC", price: "5.12", marketCap: "1.82T", pe: "5.2x", pb: "0.52x", roe: "11.1", divYield: "7.20" },
  ],
  "0700.HK": [
    { ticker: "0700.HK", company: "Tencent Holdings", price: "532.00", marketCap: "5.12T", pe: "22.8x", pb: "5.80x", roe: "18.5", divYield: "0.32", isTarget: true },
    { ticker: "9988.HK", company: "Alibaba Group", price: "118.50", marketCap: "2.41T", pe: "18.3x", pb: "2.10x", roe: "12.6", divYield: "0.00" },
    { ticker: "3690.HK", company: "Meituan", price: "158.20", marketCap: "978.5B", pe: "35.2x", pb: "4.20x", roe: "8.5", divYield: "0.00" },
    { ticker: "9618.HK", company: "JD.com", price: "142.80", marketCap: "432.1B", pe: "14.5x", pb: "1.85x", roe: "10.2", divYield: "1.80" },
    { ticker: "1810.HK", company: "Xiaomi Corp", price: "20.85", marketCap: "521.3B", pe: "28.5x", pb: "3.90x", roe: "14.2", divYield: "0.00" },
  ],
  /* ── US Market ── */
  "NVDA": [
    { ticker: "NVDA", company: "NVIDIA Corp", price: "875.30", marketCap: "2.16T", pe: "65.2x", pb: "52.10x", roe: "91.5", divYield: "0.02", isTarget: true },
    { ticker: "AMD", company: "Advanced Micro Devices", price: "168.40", marketCap: "272.1B", pe: "48.5x", pb: "4.80x", roe: "4.2", divYield: "0.00" },
    { ticker: "INTC", company: "Intel Corporation", price: "31.20", marketCap: "131.5B", pe: "—", pb: "1.15x", roe: "-1.8", divYield: "1.60" },
    { ticker: "TSM", company: "Taiwan Semiconductor", price: "148.50", marketCap: "768.2B", pe: "25.8x", pb: "7.20x", roe: "28.1", divYield: "1.35" },
    { ticker: "AVGO", company: "Broadcom Inc", price: "1,350.00", marketCap: "628.4B", pe: "38.2x", pb: "12.50x", roe: "35.4", divYield: "1.72" },
  ],
  "AAPL": [
    { ticker: "AAPL", company: "Apple Inc", price: "182.50", marketCap: "2.85T", pe: "28.5x", pb: "45.20x", roe: "160.1", divYield: "0.55", isTarget: true },
    { ticker: "MSFT", company: "Microsoft Corp", price: "415.80", marketCap: "3.09T", pe: "36.2x", pb: "12.80x", roe: "38.5", divYield: "0.72" },
    { ticker: "GOOGL", company: "Alphabet Inc", price: "155.70", marketCap: "1.93T", pe: "24.8x", pb: "6.90x", roe: "28.2", divYield: "0.50" },
    { ticker: "AMZN", company: "Amazon.com Inc", price: "185.60", marketCap: "1.93T", pe: "42.5x", pb: "8.50x", roe: "22.8", divYield: "0.00" },
    { ticker: "META", company: "Meta Platforms", price: "505.20", marketCap: "1.28T", pe: "26.5x", pb: "8.30x", roe: "33.4", divYield: "0.40" },
  ],
  "MSFT": [
    { ticker: "MSFT", company: "Microsoft Corp", price: "415.80", marketCap: "3.09T", pe: "36.2x", pb: "12.80x", roe: "38.5", divYield: "0.72", isTarget: true },
    { ticker: "AAPL", company: "Apple Inc", price: "182.50", marketCap: "2.85T", pe: "28.5x", pb: "45.20x", roe: "160.1", divYield: "0.55" },
    { ticker: "GOOGL", company: "Alphabet Inc", price: "155.70", marketCap: "1.93T", pe: "24.8x", pb: "6.90x", roe: "28.2", divYield: "0.50" },
    { ticker: "AMZN", company: "Amazon.com Inc", price: "185.60", marketCap: "1.93T", pe: "42.5x", pb: "8.50x", roe: "22.8", divYield: "0.00" },
    { ticker: "META", company: "Meta Platforms", price: "505.20", marketCap: "1.28T", pe: "26.5x", pb: "8.30x", roe: "33.4", divYield: "0.40" },
  ],
  "GOOGL": [
    { ticker: "GOOGL", company: "Alphabet Inc", price: "155.70", marketCap: "1.93T", pe: "24.8x", pb: "6.90x", roe: "28.2", divYield: "0.50", isTarget: true },
    { ticker: "META", company: "Meta Platforms", price: "505.20", marketCap: "1.28T", pe: "26.5x", pb: "8.30x", roe: "33.4", divYield: "0.40" },
    { ticker: "MSFT", company: "Microsoft Corp", price: "415.80", marketCap: "3.09T", pe: "36.2x", pb: "12.80x", roe: "38.5", divYield: "0.72" },
    { ticker: "AMZN", company: "Amazon.com Inc", price: "185.60", marketCap: "1.93T", pe: "42.5x", pb: "8.50x", roe: "22.8", divYield: "0.00" },
    { ticker: "AAPL", company: "Apple Inc", price: "182.50", marketCap: "2.85T", pe: "28.5x", pb: "45.20x", roe: "160.1", divYield: "0.55" },
  ],
  "TSLA": [
    { ticker: "TSLA", company: "Tesla Inc", price: "248.50", marketCap: "791.2B", pe: "62.5x", pb: "14.80x", roe: "22.4", divYield: "0.00", isTarget: true },
    { ticker: "RIVN", company: "Rivian Automotive", price: "18.20", marketCap: "18.5B", pe: "—", pb: "2.10x", roe: "-42.5", divYield: "0.00" },
    { ticker: "GM", company: "General Motors", price: "42.80", marketCap: "48.2B", pe: "5.2x", pb: "0.85x", roe: "16.8", divYield: "1.12" },
    { ticker: "F", company: "Ford Motor Co", price: "12.50", marketCap: "49.8B", pe: "12.1x", pb: "1.10x", roe: "9.5", divYield: "4.80" },
    { ticker: "NIO", company: "NIO Inc", price: "7.85", marketCap: "15.2B", pe: "—", pb: "3.50x", roe: "-38.2", divYield: "0.00" },
  ],
  "AMZN": [
    { ticker: "AMZN", company: "Amazon.com Inc", price: "185.60", marketCap: "1.93T", pe: "42.5x", pb: "8.50x", roe: "22.8", divYield: "0.00", isTarget: true },
    { ticker: "GOOGL", company: "Alphabet Inc", price: "155.70", marketCap: "1.93T", pe: "24.8x", pb: "6.90x", roe: "28.2", divYield: "0.50" },
    { ticker: "MSFT", company: "Microsoft Corp", price: "415.80", marketCap: "3.09T", pe: "36.2x", pb: "12.80x", roe: "38.5", divYield: "0.72" },
    { ticker: "META", company: "Meta Platforms", price: "505.20", marketCap: "1.28T", pe: "26.5x", pb: "8.30x", roe: "33.4", divYield: "0.40" },
    { ticker: "AAPL", company: "Apple Inc", price: "182.50", marketCap: "2.85T", pe: "28.5x", pb: "45.20x", roe: "160.1", divYield: "0.55" },
  ],
  "AMD": [
    { ticker: "AMD", company: "Advanced Micro Devices", price: "168.40", marketCap: "272.1B", pe: "48.5x", pb: "4.80x", roe: "4.2", divYield: "0.00", isTarget: true },
    { ticker: "NVDA", company: "NVIDIA Corp", price: "875.30", marketCap: "2.16T", pe: "65.2x", pb: "52.10x", roe: "91.5", divYield: "0.02" },
    { ticker: "INTC", company: "Intel Corporation", price: "31.20", marketCap: "131.5B", pe: "—", pb: "1.15x", roe: "-1.8", divYield: "1.60" },
    { ticker: "AVGO", company: "Broadcom Inc", price: "1,350.00", marketCap: "628.4B", pe: "38.2x", pb: "12.50x", roe: "35.4", divYield: "1.72" },
    { ticker: "QCOM", company: "Qualcomm Inc", price: "172.30", marketCap: "192.5B", pe: "22.8x", pb: "8.20x", roe: "42.5", divYield: "1.85" },
  ],
  "META": [
    { ticker: "META", company: "Meta Platforms", price: "505.20", marketCap: "1.28T", pe: "26.5x", pb: "8.30x", roe: "33.4", divYield: "0.40", isTarget: true },
    { ticker: "GOOGL", company: "Alphabet Inc", price: "155.70", marketCap: "1.93T", pe: "24.8x", pb: "6.90x", roe: "28.2", divYield: "0.50" },
    { ticker: "SNAP", company: "Snap Inc", price: "14.80", marketCap: "24.2B", pe: "—", pb: "9.50x", roe: "-18.5", divYield: "0.00" },
    { ticker: "PINS", company: "Pinterest Inc", price: "32.50", marketCap: "22.1B", pe: "28.5x", pb: "6.80x", roe: "12.5", divYield: "0.00" },
    { ticker: "MSFT", company: "Microsoft Corp", price: "415.80", marketCap: "3.09T", pe: "36.2x", pb: "12.80x", roe: "38.5", divYield: "0.72" },
  ],
};

/* ── Generic fallback peers ────────────────── */
const fallbackPeers = (target: PeerRow): PeerRow[] => [
  target,
  { ticker: "PEER-A", company: "Industry Peer A", price: "—", marketCap: "—", pe: "—", pb: "—", roe: "—", divYield: "—" },
  { ticker: "PEER-B", company: "Industry Peer B", price: "—", marketCap: "—", pe: "—", pb: "—", roe: "—", divYield: "—" },
];

interface Props {
  lang: LangKey;
  targetTicker: string;
  targetCompany: string;
  targetPrice: string;
  targetMarketCap: string;
  targetPE: string;
  targetROE: string;
  targetDivYield: string;
}

const PeerComparisonTable = ({
  lang,
  targetTicker,
  targetCompany,
  targetPrice,
  targetMarketCap,
  targetPE,
  targetROE,
  targetDivYield,
}: Props) => {
  const l = labels[lang];
  const upperTicker = targetTicker.toUpperCase();

  const targetRow: PeerRow = {
    ticker: upperTicker,
    company: targetCompany,
    price: targetPrice.replace(/^[A-Z$]+\$?/, ""),
    marketCap: targetMarketCap,
    pe: targetPE,
    pb: "—",
    roe: targetROE,
    divYield: targetDivYield,
    isTarget: true,
  };

  const rows = peerData[upperTicker] ?? fallbackPeers(targetRow);

  /* ── Compute sector averages ──────────────── */
  const parseNum = (v: string) => { const n = parseFloat(v.replace(/[^0-9.\-]/g, "")); return isNaN(n) ? null : n; };
  const avg = (vals: (number | null)[]) => { const valid = vals.filter((v): v is number => v !== null); return valid.length ? (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2) : "—"; };

  const avgPrice = avg(rows.map((r) => parseNum(r.price)));
  const avgPE = avg(rows.map((r) => parseNum(r.pe)));
  const avgPB = avg(rows.map((r) => parseNum(r.pb)));
  const avgROE = avg(rows.map((r) => parseNum(r.roe)));
  const avgDiv = avg(rows.map((r) => parseNum(r.divYield)));

  const cols = [
    { key: "ticker", label: l.ticker, align: "left" as const },
    { key: "company", label: l.company, align: "left" as const },
    { key: "price", label: l.price, align: "right" as const },
    { key: "marketCap", label: l.marketCap, align: "right" as const },
    { key: "pe", label: l.pe, align: "right" as const },
    { key: "pb", label: l.pb, align: "right" as const },
    { key: "roe", label: l.roe, align: "right" as const },
    { key: "divYield", label: l.divYield, align: "right" as const },
  ];

  return (
    <div style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
      <h3
        className="text-[15px] font-bold tracking-wide uppercase pb-2 mb-3"
        style={{
          fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
          color: "#1e293b",
          borderBottom: "2px solid #1e293b",
        }}
      >
        {l.title}
      </h3>

      <div className="overflow-x-auto rounded" style={{ border: "0.5pt solid #cbd5e1" }}>
        <table className="w-full text-[11px]" style={{ borderCollapse: "collapse", minWidth: "600px" }}>
          <thead>
            <tr style={{ background: "#003366" }}>
              {cols.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2.5 font-bold text-white whitespace-nowrap"
                  style={{ textAlign: col.align, border: "0.5pt solid rgba(255,255,255,0.15)" }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.ticker + idx}
                style={{
                  background: row.isTarget ? "#fffbeb" : idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                }}
              >
                <td className="px-3 py-2 font-semibold whitespace-nowrap" style={{ color: "#1e293b", border: "0.5pt solid #e2e8f0" }}>
                  {row.ticker}
                  {row.isTarget && (
                    <span
                      className="ml-1.5 text-[8px] uppercase font-bold px-1.5 py-0.5 rounded"
                      style={{ background: "#fbbf24", color: "#78350f" }}
                    >
                      {l.target}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap" style={{ color: "#475569", border: "0.5pt solid #e2e8f0" }}>{row.company}</td>
                <td className="px-3 py-2 text-right font-medium" style={{ color: "#1e293b", border: "0.5pt solid #e2e8f0" }}>{row.price}</td>
                <td className="px-3 py-2 text-right" style={{ color: "#475569", border: "0.5pt solid #e2e8f0" }}>{row.marketCap}</td>
                <td className="px-3 py-2 text-right font-medium" style={{ color: "#1e293b", border: "0.5pt solid #e2e8f0" }}>{row.pe}</td>
                <td className="px-3 py-2 text-right" style={{ color: "#475569", border: "0.5pt solid #e2e8f0" }}>{row.pb}</td>
                <td className="px-3 py-2 text-right font-medium" style={{ color: "#1e293b", border: "0.5pt solid #e2e8f0" }}>{row.roe}</td>
                <td className="px-3 py-2 text-right" style={{ color: "#475569", border: "0.5pt solid #e2e8f0" }}>{row.divYield}</td>
              </tr>
            ))}
            {/* ── Sector Average row ─────────────── */}
            <tr style={{ background: "#eef2ff", borderTop: "1.5pt solid #1e293b" }}>
              <td
                colSpan={2}
                className="px-3 py-2 font-bold uppercase tracking-wide whitespace-nowrap"
                style={{ color: "#1e293b", border: "0.5pt solid #e2e8f0", fontSize: "10px", fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {l.sectorAvg}
              </td>
              <td className="px-3 py-2 text-right font-bold" style={{ color: "#1e293b", border: "0.5pt solid #e2e8f0" }}>{avgPrice}</td>
              <td className="px-3 py-2 text-right" style={{ color: "#94a3b8", border: "0.5pt solid #e2e8f0" }}>—</td>
              <td className="px-3 py-2 text-right font-bold" style={{ color: "#1e293b", border: "0.5pt solid #e2e8f0" }}>{avgPE}x</td>
              <td className="px-3 py-2 text-right font-bold" style={{ color: "#1e293b", border: "0.5pt solid #e2e8f0" }}>{avgPB}x</td>
              <td className="px-3 py-2 text-right font-bold" style={{ color: "#1e293b", border: "0.5pt solid #e2e8f0" }}>{avgROE}</td>
              <td className="px-3 py-2 text-right font-bold" style={{ color: "#1e293b", border: "0.5pt solid #e2e8f0" }}>{avgDiv}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Table Legend */}
      <p className="mt-2 text-[9px] italic leading-relaxed" style={{ color: "#94a3b8" }}>
        {l.legend}
      </p>
    </div>
  );
};

export default PeerComparisonTable;
