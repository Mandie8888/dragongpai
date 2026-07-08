import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield } from "lucide-react";

const text = {
  en: {
    title: "Gaming Strategy Disclaimer",
    body: "This analysis is a mathematical simulation based on technical indicators. It is intended to help you exercise your \"Open Eye\" and master the probabilities of market movements. Like any strategy game, past performance does not guarantee future results. You are the lead player; all moves and decisions are made at your own risk.",
    checkbox: "I understand this is a mathematical simulation and all decisions are at my own risk.",
    accept: "Accept & Generate Report",
    decline: "Decline",
    cost: "This will use 1 credit from your balance.",
  },
  tc: {
    title: "博弈策略聲明",
    body: "本分析是基於技術指標的數學模擬。其目的在於幫助您鍛煉「慧眼」，掌握市場波動的概率邏輯。與任何策略遊戲一樣，過往表現不代表未來結果。您是主導玩家；所有操作與決策均由您自行承擔風險。",
    checkbox: "我明白這是數學模擬，所有決策均由我自行承擔風險。",
    accept: "接受並生成報告",
    decline: "取消",
    cost: "此操作將從您的餘額中扣除 1 積分。",
  },
  sc: {
    title: "博弈策略声明",
    body: "本分析是基于技术指标的数学模拟。其目的在于帮助您锻炼「慧眼」，掌握市场波动的概率逻辑。与任何策略游戏一样，过往表现不代表未来结果。您是主导玩家；所有操作与决策均由您自行承担风险。",
    checkbox: "我明白这是数学模拟，所有决策均由我自行承担风险。",
    accept: "接受并生成报告",
    decline: "取消",
    cost: "此操作将从您的余额中扣除 1 积分。",
  },
};

interface Props {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const GamingDisclaimerModal = ({ open, onAccept, onDecline }: Props) => {
  const { lang } = useLanguage();
  const t = text[lang];
  const [checked, setChecked] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onDecline} />
      <div className="relative w-full max-w-lg rounded-2xl border border-amber-400/30 bg-card/80 backdrop-blur-xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <Shield className="text-amber-400 shrink-0" size={24} />
          <h2 className="text-lg font-bold text-foreground">{t.title}</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{t.body}</p>
        <div className="rounded-lg border border-amber-400/20 bg-amber-500/5 p-3 text-center">
          <p className="text-xs font-semibold text-amber-400">⚡ {t.cost}</p>
        </div>
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
            onClick={onDecline}
            className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.decline}
          </button>
          <button
            onClick={() => { if (checked) onAccept(); }}
            disabled={!checked}
            className="flex-1 rounded-xl bg-gradient-to-r from-primary to-amber-500 py-3 text-sm font-bold text-primary-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:from-primary/90 hover:to-amber-400"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamingDisclaimerModal;
