import { useState, useRef, useCallback } from "react";
import { useLanguage, type LangKey } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ScrollText, Globe } from "lucide-react";

/* ── Language toggle (mirrors header) ── */
const langOptions: { key: LangKey; label: string }[] = [
  { key: "en", label: "EN" },
  { key: "tc", label: "繁體" },
  { key: "sc", label: "简体" },
];

const ModalLangToggle = ({
  active,
  onChange,
}: {
  active: LangKey;
  onChange: (l: LangKey) => void;
}) => (
  <div className="inline-flex items-center rounded-full border border-primary/30 overflow-hidden">
    {langOptions.map((l) => (
      <button
        key={l.key}
        onClick={() => onChange(l.key)}
        className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium transition-colors ${
          active === l.key
            ? "bg-primary/20 text-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {l.key === "en" && <Globe size={11} />}
        {l.label}
      </button>
    ))}
  </div>
);

/* ── Trilingual content: Master Disclaimer + Refund Policy ── */
const modalContent = {
  en: {
    modalTitle: "Legal Acceptance: Master Disclaimer & Refund Policy",
    partA: "Part A — Master Disclaimer",
    partB: "Part B — Refund Policy (No Refund Policy)",
    noRefundBanner:
      "At DragonGPAi.com, we provide immediate access to digital content, therefore we do not offer refunds.",
    disclaimerSections: [
      {
        heading: "1. Nature of Service: Mathematical Modeling",
        body: "DragonGPAi.com is a technology demonstration platform. All outputs are generated through mathematical modeling and algorithmic pattern recognition. These models aggregate public data to show statistical probabilities and are not a substitute for human judgment or professional analysis.",
      },
      {
        heading: "2. Principle of Self-Decision",
        body: 'By using this platform, you acknowledge and agree to the principle of Self-Decision. DragonGPAi.com provides data-driven simulations, but the responsibility for any action taken—financial, strategic, or otherwise—rests solely with the user. You are the final decision-maker.',
      },
      {
        heading: "3. No Professional or Gambling Licenses",
        body: "DragonGPAi.com is not a licensed corporation under the HK Securities and Futures Ordinance or the Taiwan Securities Investment Trust and Consulting Act. Furthermore, we do not hold any gambling or gaming licenses.",
      },
      {
        heading: "4. Purpose: Cognitive Engagement & Entertainment",
        body: 'All proposals or indications are not encouraging for any investment or gambling purpose. The purpose is for your health and brain activities to prevent cognitive deterioration. We discourage taking our AI-generated outputs as a base for real-world investment or gambling activities.',
      },
      {
        heading: "5. Limitation of Liability",
        body: "All actual investments or gaming decisions should be made in consultation with certified professionals or licensed brokers. The operators of DragonGPAi.com shall not be held liable for any direct or indirect losses.",
      },
    ],
    refundSections: [
      {
        heading: "1. No Refund Policy",
        body: "Due to the nature of immediate access to digital mathematical models and AI-generated analysis, all sales are final. Once a subscription is activated, you receive instant access to our full suite of cognitive engagement tools, market data summaries, and AI probability analyses. Because this digital content is delivered immediately upon purchase, we are unable to offer refunds for any subscription period that has already begun.",
      },
      {
        heading: "2. How to Cancel (Self-Service)",
        body: 'DragonGPAi.com is a Self-Service platform. You are responsible for managing your own subscription. To cancel, visit our Unsubscribe page and follow the automated process through our Customer Portal (powered by Stripe). We do not process manual cancellations via email or any other channel.',
      },
      {
        heading: "3. Finality of Charges",
        body: "Once your unsubscription is confirmed through the Customer Portal, no further charges will occur. However, any payments already processed for current or previous billing cycles are non-refundable. You will continue to have access to the service until the end of your current paid period.",
      },
    ],
    scrollHint: "Scroll down to read the full terms",
    acceptBtn: "I Accept & Continue to Payment",
    readComplete: "You have read the full terms",
    simplifiedMsg:
      "You have previously accepted the Master Disclaimer & Refund Policy. Please confirm you still agree to proceed.",
    stillAgree: "I still agree",
  },
  tc: {
    modalTitle: "法律接受：法律聲明與退款政策",
    partA: "第 A 部分 — 法律聲明",
    partB: "第 B 部分 — 退款政策（無退款政策）",
    noRefundBanner:
      "DragonGPAi.com 提供即時存取數碼內容，因此我們不提供退款。",
    disclaimerSections: [
      {
        heading: "1. 服務性質：數學模型演算法",
        body: "DragonGPAi.com 是一個技術演示平台。本平台所有輸出內容均透過「數學模型」與演算法模式識別生成。這些模型僅是針對公開數據進行統計學上的概率呈現，並不代表專業分析，亦不能取代人類的判斷。",
      },
      {
        heading: "2. 自主決策原則 (Self-Decision)",
        body: "當您使用本平台時，即代表您承認並同意「自主決策」原則。DragonGPAi.com 提供的是數據驅動的模擬結果，但任何進一步行動的責任完全由用戶本人承擔。您是最終的決策者。",
      },
      {
        heading: "3. 無專業執照與博弈牌照聲明",
        body: "DragonGPAi.com 並非持牌證券投資顧問機構，亦不持有任何博弈（賭博）牌照。我們與任何證券公司、經紀行或博弈組織均無關聯。",
      },
      {
        heading: "4. 宗旨：認知參與、大腦活化與娛樂",
        body: "所有方案或指標並非鼓勵任何投資或博弈行為。本平台之初衷係通過數據分析活動協助用戶「鍛煉大腦、預防退化」及「消磨時間」。",
      },
      {
        heading: "5. 責任限制",
        body: "所有實際投資或博弈決定應諮詢持牌專業經紀商、金融機構或專業顧問。用戶需「風險自擔」，本平台運營者對用戶做出之決定概不負責。",
      },
    ],
    refundSections: [
      {
        heading: "1. 無退款政策",
        body: "由於數碼數學模型及 AI 生成分析的即時存取特性，所有銷售均為最終銷售。一旦訂閱啟動，您即可即時存取我們的全套認知參與工具、市場數據摘要及 AI 概率分析。因為此數碼內容在購買後即時交付，我們無法為任何已開始的訂閱期間提供退款。",
      },
      {
        heading: "2. 如何取消（自助服務）",
        body: "DragonGPAi.com 是一個「自助服務」平台。您有責任自行管理您的訂閱。如需取消，請前往我們的「取消訂閱」頁面，並透過我們的客戶門戶完成自動化流程。我們不處理透過電郵或任何其他渠道的人工取消請求。",
      },
      {
        heading: "3. 收費的最終性",
        body: "一旦您透過客戶門戶確認取消訂閱，將不會再產生任何費用。然而，已處理的當前或之前帳單週期的任何款項均不可退還。在您當前的已付費期間結束之前，您將繼續享有服務的存取權限。",
      },
    ],
    scrollHint: "請向下滾動以閱讀完整條款",
    acceptBtn: "我接受並繼續付款",
    readComplete: "您已閱讀完整條款",
    simplifiedMsg:
      "您先前已接受法律聲明及退款政策。請確認您仍然同意以繼續。",
    stillAgree: "我仍然同意",
  },
  sc: {
    modalTitle: "法律接受：法律声明与退款政策",
    partA: "第 A 部分 — 法律声明",
    partB: "第 B 部分 — 退款政策（无退款政策）",
    noRefundBanner:
      "DragonGPAi.com 提供即时访问数字内容，因此我们不提供退款。",
    disclaimerSections: [
      {
        heading: "1. 服务性质：数学模型算法",
        body: "DragonGPAi.com 是一个技术演示平台。本平台所有输出内容均通过「数学模型」与算法模式识别生成。这些模型仅是针对公开数据进行统计学上的概率呈现，并不代表专业分析，亦不能取代人类的判断。",
      },
      {
        heading: "2. 自主决策原则 (Self-Decision)",
        body: "当您使用本平台时，即代表您承认并同意「自主决策」原则。DragonGPAi.com 提供的是数据驱动的模拟结果，但任何进一步行动的责任完全由用户本人承担。您是最终的决策者。",
      },
      {
        heading: "3. 无专业执照与博弈牌照声明",
        body: "DragonGPAi.com 并非持牌证券投资顾问机构，亦不持有任何博弈（赌博）牌照。我们与任何证券公司、经纪行或博弈组织均无关联。",
      },
      {
        heading: "4. 宗旨：认知参与、大脑活化与娱乐",
        body: "所有方案或指标并非鼓励任何投资或博弈行为。本平台之初衷系通过数据分析活动协助用户「锻炼大脑、预防退化」及「消磨时间」。",
      },
      {
        heading: "5. 责任限制",
        body: "所有实际投资或博弈决定应咨询持牌专业经纪商、金融机构或专业顾问。用户需「风险自担」，本平台运营者对用户做出之决定概不负责。",
      },
    ],
    refundSections: [
      {
        heading: "1. 无退款政策",
        body: "由于数字数学模型及 AI 生成分析的即时访问特性，所有销售均为最终销售。一旦订阅激活，您即可即时访问我们的全套认知参与工具、市场数据摘要及 AI 概率分析。因为此数字内容在购买后即时交付，我们无法为任何已开始的订阅期间提供退款。",
      },
      {
        heading: "2. 如何取消（自助服务）",
        body: "DragonGPAi.com 是一个「自助服务」平台。您有责任自行管理您的订阅。如需取消，请前往我们的「取消订阅」页面，并通过我们的客户门户完成自动化流程。我们不处理通过邮件或任何其他渠道的人工取消请求。",
      },
      {
        heading: "3. 收费的最终性",
        body: "一旦您通过客户门户确认取消订阅，将不会再产生任何费用。然而，已处理的当前或之前账单周期的任何款项均不可退还。在您当前的已付费期间结束之前，您将继续享有服务的访问权限。",
      },
    ],
    scrollHint: "请向下滚动以阅读完整条款",
    acceptBtn: "我接受并继续付款",
    readComplete: "您已阅读完整条款",
    simplifiedMsg:
      "您先前已接受法律声明及退款政策。请确认您仍然同意以继续。",
    stillAgree: "我仍然同意",
  },
};

/* ── Component ── */
interface DisclaimerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  simplified?: boolean;
}

const DisclaimerModal = ({
  open,
  onOpenChange,
  onAccept,
  simplified,
}: DisclaimerModalProps) => {
  const { lang, setLang } = useLanguage();
  const c = modalContent[lang];
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const progress = Math.min(
      100,
      (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
    );
    setScrollProgress(progress);
    if (progress >= 95) setHasReachedBottom(true);
  }, []);

  const handleAccept = () => {
    onAccept();
    onOpenChange(false);
    setScrollProgress(0);
    setHasReachedBottom(false);
    setAgreed(false);
  };

  /* ── Simplified mode (returning users) ── */
  if (simplified) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md max-h-[90vh] bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-primary text-center text-base">
              {c.modalTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center space-y-4">
            <ModalLangToggle active={lang} onChange={setLang} />
            <ScrollText className="mx-auto text-primary" size={32} />
            <p className="text-sm text-muted-foreground">{c.simplifiedMsg}</p>
            <label className="flex items-center gap-2 justify-center cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="rounded border-primary text-primary w-4 h-4"
              />
              <span className="text-sm text-foreground">{c.stillAgree}</span>
            </label>
            <Button
              onClick={handleAccept}
              disabled={!agreed}
              className="w-full"
            >
              {c.acceptBtn}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  /* ── Full scroll-to-accept mode ── */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[95vh] sm:max-h-[85vh] flex flex-col p-0 gap-0 bg-background border-border">
        {/* Header with gold progress bar */}
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-border shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-primary text-sm sm:text-base font-bold">
              {c.modalTitle}
            </DialogTitle>
            <ModalLangToggle active={lang} onChange={setLang} />
          </div>

          {/* Gold progress bar */}
          <div className="space-y-1">
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${scrollProgress}%`,
                  background:
                    "linear-gradient(90deg, hsl(35 90% 45%), hsl(40 95% 55%), hsl(35 90% 45%))",
                }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1">
              {hasReachedBottom ? (
                <>
                  <Check size={12} className="text-emerald-500" />
                  {c.readComplete}
                </>
              ) : (
                <>
                  <ScrollText size={12} />
                  {c.scrollHint}
                </>
              )}
            </p>
          </div>
        </DialogHeader>

        {/* Scrollable legal content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-6 min-h-0"
        >
          {/* No-refund banner */}
          <div className="rounded-lg border border-primary/40 bg-primary/5 px-4 py-3 text-center">
            <p className="text-xs font-semibold text-primary">
              ⚠️ {c.noRefundBanner}
            </p>
          </div>

          {/* Part A: Master Disclaimer */}
          <h3 className="text-sm font-bold text-accent uppercase tracking-wider">
            {c.partA}
          </h3>
          {c.disclaimerSections.map((s, i) => (
            <section key={`d-${i}`} className="space-y-1.5">
              <h4 className="text-sm font-bold text-primary">{s.heading}</h4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </section>
          ))}

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Part B: Refund Policy */}
          <h3 className="text-sm font-bold text-accent uppercase tracking-wider">
            {c.partB}
          </h3>
          {c.refundSections.map((s, i) => (
            <section key={`r-${i}`} className="space-y-1.5">
              <h4 className="text-sm font-bold text-primary">{s.heading}</h4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </section>
          ))}
        </div>

        {/* Accept button */}
        <div className="px-6 py-4 border-t border-border shrink-0">
          <Button
            onClick={handleAccept}
            disabled={!hasReachedBottom}
            className="w-full"
          >
            {hasReachedBottom ? (
              <Check size={16} />
            ) : (
              <ScrollText size={16} />
            )}
            {c.acceptBtn}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisclaimerModal;
