import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, ArrowRight, Loader2, ShieldAlert } from "lucide-react";

const t = {
  headline: {
    en: "We're sorry to see you go!",
    tc: "很遺憾看到您離開！",
    sc: "很遗憾看到您离开！",
  },
  subtitle: {
    en: "Before you leave, we'd love to hear your feedback so we can improve.",
    tc: "在您離開之前，我們希望聽到您的意見，以便我們改進。",
    sc: "在您离开之前，我们希望听到您的意见，以便我们改进。",
  },
  noSub: {
    en: "You don't have an active subscription.",
    tc: "您目前沒有有效的訂閱。",
    sc: "您目前没有有效的订阅。",
  },
  notLoggedIn: {
    en: "Please log in to manage your subscription.",
    tc: "請先登入以管理您的訂閱。",
    sc: "请先登录以管理您的订阅。",
  },
  loginBtn: {
    en: "Log In",
    tc: "登入",
    sc: "登录",
  },
  backPricing: {
    en: "Back to Pricing",
    tc: "返回方案頁",
    sc: "返回方案页",
  },
  reasonLabel: {
    en: "Reason for leaving",
    tc: "離開原因",
    sc: "离开原因",
  },
  reasons: {
    price: { en: "Price too high", tc: "價格太高", sc: "价格太高" },
    boring: { en: "Not interesting", tc: "內容不感興趣", sc: "内容不感兴趣" },
    useless: { en: "Not helpful", tc: "沒有幫助", sc: "没有帮助" },
    other: { en: "Others (please specify)", tc: "其他（請提供具體訊息）", sc: "其他（请提供具体信息）" },
  },
  otherPlaceholder: {
    en: "Please tell us more...",
    tc: "請告訴我們更多...",
    sc: "请告诉我们更多...",
  },
  saveTitle: {
    en: "Would you like to switch to a lower-priced plan instead?",
    tc: "您想更換至較低價的方案嗎？",
    sc: "您想更换至较低价的方案吗？",
  },
  saveDesc: {
    en: "You can downgrade your current plan through our Customer Portal without cancelling.",
    tc: "您可以透過客戶門戶降級您的方案，而無需取消。",
    sc: "您可以通过客户门户降级您的方案，而无需取消。",
  },
  manageBtn: {
    en: "Manage Plan in Customer Portal",
    tc: "在客戶門戶管理方案",
    sc: "在客户门户管理方案",
  },
  warningTitle: {
    en: "Important Notice",
    tc: "重要聲明",
    sc: "重要声明",
  },
  warningText: {
    en: "In principle, there is No Refund Policy. Any refund requests based on your feedback will be evaluated manually by the system administrator.",
    tc: "原則上，本站不設退款政策。任何根據您反饋提出的退款申請將由系統管理員手動評估。",
    sc: "原则上，本站不设退款政策。任何根据您反馈提出的退款申请将由系统管理员手动评估。",
  },
  contactText: {
    en: "If you have questions, please email",
    tc: "如有疑問，請在確認前發送電郵至",
    sc: "如有疑问，请在确认前发送邮件至",
  },
  contactAfter: {
    en: "before confirming.",
    tc: "。",
    sc: "。",
  },
  confirmBtn: {
    en: "Confirm and Proceed to Cancel",
    tc: "確認並繼續取消",
    sc: "确认并继续取消",
  },
  loading: {
    en: "Checking subscription...",
    tc: "正在檢查訂閱狀態...",
    sc: "正在检查订阅状态...",
  },
  portalError: {
    en: "Could not open portal. Please try again.",
    tc: "無法打開門戶，請重試。",
    sc: "无法打开门户，请重试。",
  },
};

type ReasonKey = "price" | "boring" | "useless" | "other";

const Unsubscribe = () => {
  const { lang } = useLanguage();
  const { user, loading, subscription } = useAuth();
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState<ReasonKey | null>(null);
  const [otherText, setOtherText] = useState("");
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState(false);

  const openPortal = async () => {
    setPortalLoading(true);
    setPortalError(false);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
      else throw new Error("No URL");
    } catch {
      setPortalError(true);
    } finally {
      setPortalLoading(false);
    }
  };

  const reasons: { key: ReasonKey; label: string }[] = [
    { key: "price", label: t.reasons.price[lang] },
    { key: "boring", label: t.reasons.boring[lang] },
    { key: "useless", label: t.reasons.useless[lang] },
    { key: "other", label: t.reasons.other[lang] },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="animate-spin" size={20} />
            <span>{t.loading[lang]}</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-4">
            <ShieldAlert className="mx-auto text-amber-500" size={48} />
            <p className="text-lg font-medium text-slate-700">{t.notLoggedIn[lang]}</p>
            <Button onClick={() => navigate("/auth")} className="bg-amber-600 hover:bg-amber-700 text-white">
              {t.loginBtn[lang]}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // No active subscription
  if (!subscription.subscribed) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-4">
            <p className="text-lg font-medium text-slate-700">{t.noSub[lang]}</p>
            <Button onClick={() => navigate("/pricing")} variant="outline">
              {t.backPricing[lang]}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="mx-auto max-w-2xl space-y-10">
          {/* Headline */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">{t.headline[lang]}</h1>
            <p className="text-slate-500">{t.subtitle[lang]}</p>
          </div>

          {/* Feedback Form */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-5">
            <h2 className="text-lg font-semibold text-slate-700">{t.reasonLabel[lang]}</h2>
            <div className="space-y-3">
              {reasons.map((r) => (
                <label
                  key={r.key}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedReason === r.key
                      ? "border-amber-500 bg-amber-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    checked={selectedReason === r.key}
                    onChange={() => setSelectedReason(r.key)}
                    className="accent-amber-600 w-4 h-4"
                  />
                  <span className="text-slate-700">{r.label}</span>
                </label>
              ))}
            </div>
            {selectedReason === "other" && (
              <Textarea
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                placeholder={t.otherPlaceholder[lang]}
                className="border-slate-200 focus:border-amber-400 bg-white text-slate-700"
                rows={3}
              />
            )}
          </section>

          {/* Save the Sale */}
          <section className="bg-white rounded-2xl shadow-sm border border-amber-200 p-6 md:p-8 space-y-4">
            <h2 className="text-lg font-semibold text-amber-700">{t.saveTitle[lang]}</h2>
            <p className="text-slate-600 text-sm">{t.saveDesc[lang]}</p>
            <Button
              onClick={openPortal}
              disabled={portalLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
            >
              {portalLoading ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}
              {t.manageBtn[lang]}
            </Button>
            {portalError && <p className="text-sm text-red-500">{t.portalError[lang]}</p>}
          </section>

          {/* Warning */}
          <section className="bg-red-50 rounded-2xl border border-red-200 p-6 md:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-500 mt-0.5 flex-shrink-0" size={22} />
              <div className="space-y-2">
                <h3 className="font-semibold text-red-700">{t.warningTitle[lang]}</h3>
                <p className="text-sm text-red-600">{t.warningText[lang]}</p>
                <p className="text-sm text-slate-600">
                  {t.contactText[lang]}{" "}
                  <a href="mailto:contact@dragongpai.com" className="text-amber-700 underline font-medium">
                    contact@dragongpai.com
                  </a>{" "}
                  {t.contactAfter[lang]}
                </p>
              </div>
            </div>
          </section>

          {/* Confirm Cancel */}
          <div className="text-center pb-4">
            <Button
              onClick={openPortal}
              disabled={portalLoading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 text-base rounded-xl shadow-md gap-2"
              size="lg"
            >
              {portalLoading ? <Loader2 className="animate-spin" size={18} /> : null}
              {t.confirmBtn[lang]}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Unsubscribe;
