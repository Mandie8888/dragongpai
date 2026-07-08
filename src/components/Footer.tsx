import { Link } from "react-router-dom";
import dragonLogo from "@/assets/dragon-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: {
    brand: "AI-powered mathematical modeling for cognitive engagement.",
    product: "Product",
    resources: "Resources",
    legal: "Legal",
    pricing: "Pricing",
    howItWorks: "How It Works",
    aiStocks: "AI Stocks",
    contact: "Contact Us",
    feedback: "Feedback",
    affiliate: "Affiliate",
    disclaimer: "Master Disclaimer",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    refund: "Refund Policy",
    shortDisclaimer:
      "DragonGPAi.com is a mathematical modeling tool for cognitive engagement. We are not financial advisors or licensed gaming operators. All actions taken are the user\u2019s Self-Decision.",
  },
  tc: {
    brand: "以 AI 驅動的數學模型，用於認知參與。",
    product: "產品",
    resources: "資源",
    legal: "法律",
    pricing: "價格方案",
    howItWorks: "運作原理",
    aiStocks: "AI 股票",
    contact: "聯絡我們",
    feedback: "意見反饋",
    affiliate: "聯盟計劃",
    disclaimer: "法律聲明",
    terms: "服務條款",
    privacy: "私隱政策",
    refund: "退款政策",
    shortDisclaimer:
      "DragonGPAi.com 是一個用於認知參與的數學模型演算法工具。我們不是財務顧問，亦不持有博弈牌照。所有行動均屬用戶的「自主決策」。",
  },
  sc: {
    brand: "以 AI 驱动的数学模型，用于认知参与。",
    product: "产品",
    resources: "资源",
    legal: "法律",
    pricing: "价格方案",
    howItWorks: "运作原理",
    aiStocks: "AI 股票",
    contact: "联系我们",
    feedback: "意见反馈",
    affiliate: "联盟计划",
    disclaimer: "法律声明",
    terms: "服务条款",
    privacy: "隐私政策",
    refund: "退款政策",
    shortDisclaimer:
      "DragonGPAi.com 是一个用于认知参与的数学模型算法工具。我们不是财务顾问，亦不持有博弈牌照。所有行动均属用户的「自主决策」。",
  },
};

const Footer = () => {
  const { lang } = useLanguage();
  const t = labels[lang];

  return (
    <footer className="border-t border-border bg-[hsl(222,47%,11%)] py-10 text-[hsl(214,32%,71%)]">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* 4-column grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <img src={dragonLogo} alt="DragonGPAi.com" className="h-8 w-8 rounded-lg" />
              <span className="font-bold text-foreground">DragonGPAi.com</span>
            </div>
            <p className="text-xs leading-relaxed">{t.brand}</p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/70">
              {t.product}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/pricing" className="hover:text-primary transition-colors">
                  {t.pricing}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-primary transition-colors">
                  {t.howItWorks}
                </Link>
              </li>
              <li>
                <Link to="/ai-stocks" className="hover:text-primary transition-colors">
                  {t.aiStocks}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/70">
              {t.resources}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  {t.contact}
                </Link>
              </li>
              <li>
                <a href="https://dragongpai.com/feedback" className="hover:text-primary transition-colors">
                  {t.feedback}
                </a>
              </li>
              <li>
                <a href="https://dragongp.ai" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  {t.affiliate}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/70">
              {t.legal}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/disclaimer" className="hover:text-primary transition-colors">
                  {t.disclaimer}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  {t.terms}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-primary transition-colors">
                  {t.refund}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Short-form disclaimer */}
        <div className="border-t border-border pt-6">
          <p className="text-[11px] leading-relaxed text-muted-foreground/70 max-w-4xl">
            {t.shortDisclaimer}
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-4 text-center">
          <span className="text-xs">© 2026 DragonGPAI.com. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
