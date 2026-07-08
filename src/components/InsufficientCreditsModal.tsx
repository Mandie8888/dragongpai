import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lock } from "lucide-react";

const labels = {
  en: {
    title: "Insufficient Credits",
    body: "Please Subscribe or Top Up to view this Analysis.",
    subscribe: "Subscribe Now",
    topUp: "Top Up Credits",
    cancel: "Cancel",
  },
  tc: {
    title: "餘額不足",
    body: "請訂閱或充值以查看此分析。",
    subscribe: "立即訂閱",
    topUp: "充值積分",
    cancel: "取消",
  },
  sc: {
    title: "余额不足",
    body: "请订阅或充值以查看此分析。",
    subscribe: "立即订阅",
    topUp: "充值积分",
    cancel: "取消",
  },
};

interface Props {
  open: boolean;
  onClose: () => void;
}

const InsufficientCreditsModal = ({ open, onClose }: Props) => {
  const { lang } = useLanguage();
  const t = labels[lang];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-card/80 backdrop-blur-xl shadow-2xl p-6 space-y-5 text-center">
        <Lock className="mx-auto text-primary" size={32} />
        <h2 className="text-lg font-bold text-foreground">{t.title}</h2>
        <p className="text-sm text-muted-foreground">{t.body}</p>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.cancel}
          </button>
          <Link
            to="/pricing"
            className="flex-1 rounded-xl bg-gradient-to-r from-primary to-amber-500 py-3 text-sm font-bold text-primary-foreground text-center hover:from-primary/90 hover:to-amber-400 transition-colors"
          >
            {t.subscribe}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InsufficientCreditsModal;
