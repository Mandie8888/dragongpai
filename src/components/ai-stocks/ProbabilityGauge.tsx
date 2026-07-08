/** Circular SVG gauge showing probability percentage */
const ProbabilityGauge = ({
  value,
  size = 160,
  label,
}: {
  value: number;
  size?: number;
  label?: string;
}) => {
  const strokeW = 12;
  const r = (size - strokeW) / 2;
  const circumference = 2 * Math.PI * r;
  const arc = (value / 100) * circumference;
  const color =
    value >= 65 ? "#22c55e" : value >= 45 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="hsl(30 6% 18%)"
          strokeWidth={strokeW}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeW}
          strokeDasharray={`${arc} ${circumference - arc}`}
          strokeLinecap="round"
          className="transition-all duration-700"
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-3xl font-extrabold text-foreground">{value}%</span>
        {label && <span className="text-[10px] text-muted-foreground mt-0.5">{label}</span>}
      </div>
    </div>
  );
};

export default ProbabilityGauge;
