import type { LangKey } from "@/contexts/LanguageContext";

const convictionLabels = {
  en: { title: "Analyst Confidence", low: "Low", medium: "Medium", high: "High" },
  tc: { title: "分析師信心度", low: "低", medium: "中", high: "高" },
  sc: { title: "分析师信心度", low: "低", medium: "中", high: "高" },
};

interface Props {
  value: number; // 0–100
  lang: LangKey;
}

const AnalystConfidenceGauge = ({ value, lang }: Props) => {
  const l = convictionLabels[lang];
  const clamped = Math.max(0, Math.min(100, value));

  // Map value to conviction tier
  let tier = l.low;
  let tierColor = "#dc2626";
  if (clamped >= 65) { tier = l.high; tierColor = "#15803d"; }
  else if (clamped >= 40) { tier = l.medium; tierColor = "#b45309"; }

  // Semi-circle SVG
  const W = 130;
  const H = 78;
  const cx = W / 2;
  const cy = 68;
  const r = 52;
  const strokeW = 10;

  // Arc from 180° (left) to 0° (right) — semi-circle
  const startAngle = Math.PI; // left
  const endAngle = 0; // right
  const totalArc = Math.PI; // 180°

  // Background arc path (full semi-circle)
  const bgPath = describeArc(cx, cy, r, startAngle, endAngle);

  // Value arc
  const valueAngle = startAngle - (clamped / 100) * totalArc;
  const valuePath = describeArc(cx, cy, r, startAngle, valueAngle);

  // Needle position
  const needleAngle = startAngle - (clamped / 100) * totalArc;
  const needleLen = r - 8;
  const nx = cx + needleLen * Math.cos(needleAngle);
  const ny = cy - needleLen * Math.sin(needleAngle);

  return (
    <div className="flex flex-col items-center" style={{ minWidth: 130 }}>
      <p
        className="text-[9px] uppercase tracking-[0.15em] mb-1 text-center"
        style={{ color: "#94a3b8" }}
      >
        {l.title}
      </p>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* Background track */}
        <path
          d={bgPath}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
        {/* Colored arc segments — low/mid/high */}
        <defs>
          <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
        </defs>
        <path
          d={valuePath}
          fill="none"
          stroke="url(#gauge-grad)"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke="#1e293b"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={3.5} fill="#1e293b" />
        {/* Tick labels */}
        <text x={8} y={cy + 14} fill="#94a3b8" fontSize="8" textAnchor="start">0</text>
        <text x={cx} y={10} fill="#94a3b8" fontSize="8" textAnchor="middle">50</text>
        <text x={W - 8} y={cy + 14} fill="#94a3b8" fontSize="8" textAnchor="end">100</text>
      </svg>
      {/* Score + tier */}
      <div className="text-center -mt-1">
        <span className="text-[20px] font-black" style={{ color: "#1e293b" }}>{clamped}</span>
        <span className="text-[10px] ml-1" style={{ color: "#94a3b8" }}>/100</span>
      </div>
      <span
        className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded mt-0.5"
        style={{ background: `${tierColor}18`, color: tierColor }}
      >
        {tier}
      </span>
    </div>
  );
};

/* Helper: SVG arc path from angle A to angle B (in radians, counter-clockwise from 3-o'clock) */
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy - r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy - r * Math.sin(endAngle);
  const largeArc = Math.abs(startAngle - endAngle) > Math.PI ? 1 : 0;
  // Sweep: clockwise when going from startAngle (left) to endAngle (right) on top semi
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

export default AnalystConfidenceGauge;
