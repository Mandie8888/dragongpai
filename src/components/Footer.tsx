import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: {
    brand: "DragonGPAi.com",
    product: "Product",
    resources: "Resources",
    legal: "Legal",
    pricing: "Pricing",
    howItWorks: "How It Works",
    aiStocks: "AI Stocks",
    contact: "Contact",
    feedback: "Feedback",
    affiliate: "Affiliate",
    disclaimer: "Disclaimer",
    terms: "Terms",
    privacy: "Privacy",
    refund: "Refund Policy",
    shortDisclaimer:
      "DragonGPAi.com is a mathematical modeling tool for cognitive engagement. Not financial advice. All actions are user's Self-Decision.",
    copyright: "© 2026 DragonGPAI.com. All Rights Reserved.",
  },
  tc: {
    brand: "DragonGPAi.com",
    product: "產品",
    resources: "資源",
    legal: "法律",
    pricing: "價格",
    howItWorks: "運作原理",
    aiStocks: "AI 股票",
    contact: "聯絡",
    feedback: "反饋",
    affiliate: "聯盟",
    disclaimer: "聲明",
    terms: "條款",
    privacy: "隱私",
    refund: "退款政策",
    shortDisclaimer:
      "DragonGPAi.com 是用於認知參與的數學模型工具。非財務建議。所有行動均屬用戶自主決策。",
    copyright: "© 2026 DragonGPAI.com. 版權所有。",
  },
  sc: {
    brand: "DragonGPAi.com",
    product: "产品",
    resources: "资源",
    legal: "法律",
    pricing: "价格",
    howItWorks: "运作原理",
    aiStocks: "AI 股票",
    contact: "联络",
    feedback: "反馈",
    affiliate: "联盟",
    disclaimer: "声明",
    terms: "条款",
    privacy: "隐私",
    refund: "退款政策",
    shortDisclaimer:
      "DragonGPAi.com 是用于认知参与的数学模型工具。非财务建议。所有行动均属用户自主决策。",
    copyright: "© 2026 DragonGPAI.com. 版权所有。",
  },
};

const Footer = () => {
  const { lang } = useLanguage();
  const t = labels[lang];

  return (
    <footer className="border-t border-border bg-[hsl(222,47%,11%)] py-3 sm:py-4 text-[hsl(214,32%,71%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top row: Brand + Quick Links */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/30">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs sm:text-sm text-foreground">{t.brand}</span>
            <span className="text-[10px] text-muted-foreground/60 hidden xs:inline">|</span>
            <p className="text-[10px] text-muted-foreground/60 hidden xs:block max-w-xs leading-tight">
              {t.shortDisclaimer}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-xs">
            <Link to="/pricing" className="hover:text-primary transition-colors">{t.pricing}</Link>
            <Link to="/how-it-works" className="hover:text-primary transition-colors">{t.howItWorks}</Link>
            <Link to="/ai-stocks" className="hover:text-primary transition-colors">{t.aiStocks}</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">{t.contact}</Link>
            <Link to="/disclaimer" className="hover:text-primary transition-colors">{t.disclaimer}</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">{t.privacy}</Link>
          </div>
        </div>

        {/* Bottom row: Copyright */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <span className="text-[10px] text-muted-foreground/60">
            {t.copyright}
          </span>
          <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground/50">
            <Link to="/terms" className="hover:text-primary transition-colors">{t.terms}</Link>
            <Link to="/refund-policy" className="hover:text-primary transition-colors">{t.refund}</Link>
            <a href="https://dragongp.ai" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              {t.affiliate}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;