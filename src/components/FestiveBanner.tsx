import { useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { isPromoActive, promoDaysRemaining } from "@/lib/promo";

const bannerText = {
  en: "🧧 Happy Lunar New Year & Valentine's! Enjoy 10 days of Free AI Probability Analysis. Gifted credits added to your account!",
  tc: "🧧 賀新禧、慶元宵！連續10天免費體驗 AI 概率分析。贈送積分已存入您的賬戶！",
  sc: "🧧 贺新禧、庆元宵！连续10天免费体验 AI 概率分析。赠送积分已存入您的账户！",
};

const FestiveBanner = () => {
  const { lang } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (!isPromoActive() || dismissed) return null;

  return (
    <div className="relative w-full bg-gradient-to-r from-red-700 via-amber-600 to-red-700 text-white py-2.5 px-4 text-center text-sm font-semibold shadow-lg z-50">
      <span>{bannerText[lang]}</span>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default FestiveBanner;
