import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield } from "lucide-react";

const text = {
  en: {
    title: "Disclaimer – Mark 6 Probability Simulation",
    body: 'Notice: This AI Probability Simulation is for educational and "Mental Gym" purposes only. It uses mathematical models (frequency analysis, Monte Carlo simulation, pattern recognition) to analyze historical draw data. It does NOT predict future lottery results and does NOT constitute gambling advice. All outcomes are random; please exercise your "Principle of Self-Decision."',
    checkbox: "I understand this is a mathematical simulation and does NOT predict lottery results.",
    view: "View Results",
    cancel: "Cancel",
  },
  tc: {
    title: "聲明 – Mark 6 概率模擬",
    body: "聲明：此 AI 概率模擬僅供教育及「心靈體操」之用。本系統利用數學模型（頻率分析、蒙特卡羅模擬、模式識別）分析歷史攪珠數據。它不能預測未來彩票結果，也不構成博弈建議。所有結果均為隨機；請踐行您的「自主決策原則」。",
    checkbox: "我明白這是數學模擬，不能預測彩票結果。",
    view: "查看結果",
    cancel: "取消",
  },
  sc: {
    title: "声明 – Mark 6 概率模拟",
    body: "声明：此 AI 概率模拟仅供教育及「心灵体操」之用。本系统利用数学模型（频率分析、蒙特卡罗模拟、模式识别）分析历史搅珠数据。它不能预测未来彩票结果，也不构成博弈建议。所有结果均为随机；请践行您的「自主决策原则」。",
    checkbox: "我明白这是数学模拟，不能预测彩票结果。",
    view: "查看结果",
    cancel: "取消",
  },
};

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const Mark6DisclaimerModal = ({ open, onConfirm, onCancel }: Props) => {
  const { lang } = useLanguage();
  const t = text[lang];
  const [checked, setChecked] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-card/80 backdrop-blur-xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <Shield className="text-primary shrink-0" size={24} />
          <h2 className="text-lg font-bold text-foreground">{t.title}</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{t.body}</p>
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
          />
          <span className="text-sm font-medium text-foreground">{t.checkbox}</span>
        </label>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={() => { if (checked) onConfirm(); }}
            disabled={!checked}
            className="flex-1 rounded-xl bg-gradient-to-r from-primary to-amber-500 py-3 text-sm font-bold text-primary-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:from-primary/90 hover:to-amber-400"
          >
            {t.view}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mark6DisclaimerModal;
