import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield } from "lucide-react";

const disclaimerText = {
  en: {
    title: "Disclaimer – AI Stock Report",
    body: 'Notice: This AI Probability Analysis is for educational and "Mental Gym" purposes only. It uses mathematical models (RSI, MACD) to summarize market data. It does not constitute financial advice or a recommendation to buy or sell any security. All trading involves risk; please exercise your "Principle of Self-Decision" and consult a licensed professional before making any investment.',
    checkbox: "I understand this is a mathematical simulation and NOT financial advice.",
    view: "View Report",
    cancel: "Cancel",
  },
  tc: {
    title: "聲明 – AI 股票報告",
    body: "聲明：此 AI 概率分析僅供教育及「心靈體操」之用。本系統利用數學模型（RSI、MACD）對市場數據進行匯總，並不構成任何財務建議或買賣證券的推薦。所有交易均存在風險；請踐行您的「自主決策原則」，並在做出任何投資決定前諮詢專業持牌顧問。",
    checkbox: "我明白這是數學模擬，並非財務建議。",
    view: "查看報告",
    cancel: "取消",
  },
  sc: {
    title: "声明 – AI 股票报告",
    body: '声明：此 AI 概率分析仅供教育及\u201C心灵体操\u201D之用。本系统利用数学模型（RSI、MACD）对市场数据进行汇总，并不构成任何财务建议或买卖证券的推荐。所有交易均存在风险；请践行您的\u201C自主决策原则\u201D，并在做出任何投资决定前咨询专业持牌顾问。',
    checkbox: "我明白这是数学模拟，并非财务建议。",
    view: "查看报告",
    cancel: "取消",
  },
};

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const StockDisclaimerModal = ({ open, onConfirm, onCancel }: Props) => {
  const { lang } = useLanguage();
  const t = disclaimerText[lang];
  const [checked, setChecked] = useState(false);

  // Reset checkbox every time the modal opens
  useEffect(() => {
    if (open) setChecked(false);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal – glassmorphism */}
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
            onClick={() => {
              if (checked) onConfirm();
            }}
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

export default StockDisclaimerModal;
