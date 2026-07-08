import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { isPromoActive } from "@/lib/promo";
import { Button } from "@/components/ui/button";

// Partner imports
import dragonImg from "@/assets/dragon-master.png";
import elonImg from "@/assets/elon.png";
import acheloisImg from "@/assets/achelois.png";
import aladdinImg from "@/assets/aladdin.png";
import gamblingImg from "@/assets/gambling.png";
import luckyStarImg from "@/assets/lucky-star.png";
import phoenixImg from "@/assets/phoenix-trend.png";
import tigerImg from "@/assets/tiger-volatility.png";

const partners = [
  { name: "Dragon Master", img: dragonImg },
  { name: "Elon", img: elonImg },
  { name: "Achelois", img: acheloisImg },
  { name: "Aladdin", img: aladdinImg },
  { name: "Gambling Guru", img: gamblingImg },
  { name: "Lucky Star", img: luckyStarImg },
  { name: "Phoenix", img: phoenixImg },
  { name: "Tiger", img: tigerImg },
];

const popupText = {
  en: {
    title: "🧧 Happy Lunar New Year & Valentine's!",
    subtitle: "Your 8 AI Partners wish you Good Luck & Mental Vitality!",
    body: "We've gifted you 10 free credits to celebrate. Enjoy your AI Probability journey!",
    cta: "Let's Go! 🎉",
  },
  tc: {
    title: "🧧 恭賀新禧、情人節快樂！",
    subtitle: "8 位 AI 夥伴祝您好運連連、腦力充沛！",
    body: "我們已贈送 10 積分至您的賬戶，歡迎體驗 AI 概率分析之旅！",
    cta: "開始探索 🎉",
  },
  sc: {
    title: "🧧 恭贺新禧、情人节快乐！",
    subtitle: "8 位 AI 伙伴祝您好运连连、脑力充沛！",
    body: "我们已赠送 10 积分至您的账户，欢迎体验 AI 概率分析之旅！",
    cta: "开始探索 🎉",
  },
};

const STORAGE_KEY = "festive_popup_shown";

const FestiveLoginPopup = () => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const t = popupText[lang];

  useEffect(() => {
    if (!user || !isPromoActive()) return;
    const shown = localStorage.getItem(STORAGE_KEY);
    if (!shown) {
      setOpen(true);
      localStorage.setItem(STORAGE_KEY, "true");
    }
  }, [user]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md border-amber-500/50 bg-gradient-to-b from-card to-background">
        <DialogHeader>
          <DialogTitle className="text-xl text-center text-primary">{t.title}</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-sm">
            {t.subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-3 py-4">
          {partners.map((p) => (
            <div key={p.name} className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/40 shadow-md">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] text-muted-foreground text-center leading-tight">{p.name}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-foreground">{t.body}</p>

        <Button onClick={() => setOpen(false)} className="w-full bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold hover:from-red-700 hover:to-amber-600">
          {t.cta}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FestiveLoginPopup;
