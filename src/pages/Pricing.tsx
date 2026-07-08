import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DisclaimerModal from "@/components/DisclaimerModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/hooks/useCredits";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_PLANS } from "@/lib/stripe-plans";
import { isPromoActive, PROMO_CREDITS, STANDARD_CREDITS } from "@/lib/promo";
import { Gift, Coffee, Star, Crown, Check, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const t = {
  en: {
    title: "Select Your AI Plan",
    subtitle: "Unbiased Math Logic. No Broker Bias.",
    secure: "Secure Stripe Payments",
    free: "FREE",
    mostPopular: "MOST POPULAR",
    successMsg: "Payment successful! Thank you.",
    canceledMsg: "Payment was canceled.",
    plans: [
      { name: "Explorer Gift", icon: "gift", price: "$0", period: "FREE", features: ["48-Hour Full Access", "5 AI Reports", "No Credit Card Required"], cta: "Claim Free Gift", badge: "free", planKey: null },
      { name: "Coffee Plan", icon: "coffee", price: "$2.00", period: "One-time", features: ["5 Additional AI Reports", "Instant Top-Up", "No Subscription"], cta: "Get Coffee Boost", planKey: "coffee" },
      { name: "Pro Monthly", icon: "star", price: "$10.00", period: "/month", features: ["50 Reports per Month", "Advanced Indicator Logic", "Email Support", "Watchlist Limit: 20"], cta: "Choose Pro", badge: "popular", planKey: "pro" },
      { name: "VIP Annual", icon: "crown", price: "$50.00", period: "/year", features: ["100 Reports per Month", "Early Access to New Features", "Priority Server Speed", "1-on-1 Setup Support"], cta: "Join VIP Elite", planKey: "vip" },
    ],
  },
  tc: {
    title: "選擇您的 AI 計劃",
    subtitle: "公正數學邏輯・無經紀偏見",
    secure: "安全 Stripe 付款",
    free: "免費",
    mostPopular: "最受歡迎",
    successMsg: "付款成功！謝謝你。",
    canceledMsg: "付款已取消。",
    plans: [
      { name: "探索者禮物", icon: "gift", price: "$0", period: "免費", features: ["48小時完整存取", "5份AI報告", "無需信用卡"], cta: "領取免費禮物", badge: "free", planKey: null },
      { name: "咖啡計劃", icon: "coffee", price: "$2.00", period: "一次性", features: ["額外5份AI報告", "即時充值", "無需訂閱"], cta: "獲取咖啡加持", planKey: "coffee" },
      { name: "專業月費", icon: "star", price: "$10.00", period: "/月", features: ["每月50份報告", "進階指標邏輯", "電郵支援", "監察名單上限：20"], cta: "選擇專業版", badge: "popular", planKey: "pro" },
      { name: "VIP 年費", icon: "crown", price: "$50.00", period: "/年", features: ["每月100份報告", "搶先體驗新功能", "優先伺服器速度", "一對一設置支援"], cta: "加入VIP精英", planKey: "vip" },
    ],
  },
  sc: {
    title: "选择您的 AI 计划",
    subtitle: "公正数学逻辑・无经纪偏见",
    secure: "安全 Stripe 付款",
    free: "免费",
    mostPopular: "最受欢迎",
    successMsg: "付款成功！谢谢你。",
    canceledMsg: "付款已取消。",
    plans: [
      { name: "探索者礼物", icon: "gift", price: "$0", period: "免费", features: ["48小时完整访问", "5份AI报告", "无需信用卡"], cta: "领取免费礼物", badge: "free", planKey: null },
      { name: "咖啡计划", icon: "coffee", price: "$2.00", period: "一次性", features: ["额外5份AI报告", "即时充值", "无需订阅"], cta: "获取咖啡加持", planKey: "coffee" },
      { name: "专业月费", icon: "star", price: "$10.00", period: "/月", features: ["每月50份报告", "进阶指标逻辑", "邮件支持", "监察名单上限：20"], cta: "选择专业版", badge: "popular", planKey: "pro" },
      { name: "VIP 年费", icon: "crown", price: "$50.00", period: "/年", features: ["每月100份报告", "抢先体验新功能", "优先服务器速度", "一对一设置支持"], cta: "加入VIP精英", planKey: "vip" },
    ],
  },
};

const iconMap = { gift: Gift, coffee: Coffee, star: Star, crown: Crown };

const cardColors = [
  "border-emerald-700/60",
  "border-amber-700/60",
  "border-primary shadow-[0_0_30px_-5px_hsl(35_90%_55%/0.35)]",
  "border-sky-600/60",
];

const ctaColors = [
  "bg-emerald-600 hover:bg-emerald-500 text-white",
  "bg-amber-600 hover:bg-amber-500 text-white",
  "bg-accent hover:bg-accent/90 text-accent-foreground",
  "bg-gradient-to-r from-primary to-amber-400 hover:from-primary/90 hover:to-amber-300 text-primary-foreground",
];

const Pricing = () => {
  const { lang } = useLanguage();
  const c = t[lang];
  const { user, subscription } = useAuth();
  const { credits, loading: creditsLoading, refetch: refetchCredits } = useCredits();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [claimingGift, setClaimingGift] = useState(false);

  // Whether the logged-in user has already claimed the Explorer Gift
  const giftAlreadyClaimed = !!user && !creditsLoading && credits > 0;

  // Disclaimer modal state
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [pendingPlanKey, setPendingPlanKey] = useState<string | null>(null);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean | null>(null);

  // Show toast on return from Stripe
  useEffect(() => {
    if (searchParams.get("success")) {
      toast({ title: c.successMsg });
    } else if (searchParams.get("canceled")) {
      toast({ title: c.canceledMsg, variant: "destructive" });
    }
  }, []);

  // Check if user has previously accepted disclaimer
  useEffect(() => {
    if (!user) {
      setDisclaimerAccepted(null);
      return;
    }
    const checkAcceptance = async () => {
      const { data } = await supabase
        .from("disclaimer_acceptances")
        .select("accepted_at")
        .eq("user_id", user.id)
        .maybeSingle();
      setDisclaimerAccepted(!!data);
    };
    checkAcceptance();
  }, [user]);

  const proceedToCheckout = async (planKey: string) => {
    const plan = STRIPE_PLANS[planKey as keyof typeof STRIPE_PLANS];
    if (!plan) return;

    setLoadingPlan(planKey);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: plan.price_id, mode: plan.mode },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast({ title: err.message || "Error", variant: "destructive" });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleSelectPlan = (planKey: string) => {
    // 1. Auth check
    if (!user) {
      navigate(`/auth?returnTo=${encodeURIComponent("/pricing")}`);
      return;
    }

    // 2. Check disclaimer acceptance
    if (disclaimerAccepted === true) {
      // Returning user — show simplified confirmation
      setPendingPlanKey(planKey);
      setShowDisclaimer(true);
    } else {
      // New user — show full scroll-to-unlock modal
      setPendingPlanKey(planKey);
      setShowDisclaimer(true);
    }
  };

  const handleDisclaimerAccept = async () => {
    if (!user || !pendingPlanKey) return;

    // Save acceptance if first time
    if (!disclaimerAccepted) {
      await supabase.from("disclaimer_acceptances").upsert({
        user_id: user.id,
        accepted_at: new Date().toISOString(),
      });
      setDisclaimerAccepted(true);
    }

    // Proceed to checkout
    proceedToCheckout(pendingPlanKey);
    setPendingPlanKey(null);
  };

  const isCurrentPlan = (planKey: string | null) => {
    if (!planKey || !subscription.subscribed) return false;
    const plan = STRIPE_PLANS[planKey as keyof typeof STRIPE_PLANS];
    return plan?.product_id === subscription.productId;
  };

  const handleClaimGift = async () => {
    if (!user) {
      navigate(`/auth?returnTo=${encodeURIComponent("/pricing")}`);
      return;
    }

    setClaimingGift(true);

    // Re-check if already claimed
    const { data } = await supabase
      .from("user_credits")
      .select("credit_balance")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data && data.credit_balance > 0) {
      toast({
        title: lang === "en"
          ? "You have already claimed your Explorer credits! Enjoy your analysis."
          : lang === "tc"
          ? "您已領取探索者積分！請享受您的分析。"
          : "您已领取探索者积分！请享受您的分析。",
      });
      setClaimingGift(false);
      setTimeout(() => navigate("/ai-stocks"), 2000);
      return;
    }

    // Grant credits for new user
    const gift = isPromoActive() ? PROMO_CREDITS : STANDARD_CREDITS;
    await supabase
      .from("user_credits")
      .insert({ user_id: user.id, credit_balance: gift });

    await refetchCredits();
    setClaimingGift(false);

    toast({
      title: lang === "en"
        ? `🎉 ${gift} free credits granted! Welcome aboard.`
        : lang === "tc"
        ? `🎉 已發放 ${gift} 個免費積分！歡迎加入。`
        : `🎉 已发放 ${gift} 个免费积分！欢迎加入。`,
    });
    setTimeout(() => navigate("/ai-stocks"), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">{c.title}</h1>
          <p className="text-muted-foreground text-lg">{c.subtitle}</p>
          <p className="text-muted-foreground text-sm mt-2 flex items-center justify-center gap-1.5">
            <Shield size={14} className="text-primary" /> {c.secure}
          </p>
        </div>

        <div className="w-full mx-auto flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap justify-center items-stretch gap-4 px-2">
          {c.plans.map((plan, i) => {
            const Icon = iconMap[plan.icon as keyof typeof iconMap];
            const isPopular = plan.badge === "popular";
            const isFree = plan.badge === "free";
            const current = isCurrentPlan(plan.planKey);

            // Hide Explorer Gift card if already claimed
            if (isFree && giftAlreadyClaimed) return null;

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-xl border bg-card/80 backdrop-blur-sm overflow-hidden transition-transform hover:scale-[1.02] lg:max-w-[280px] lg:min-w-0 lg:flex-1 sm:w-[calc(50%-0.5rem)] ${cardColors[i]} ${isPopular ? "ring-2 ring-primary/50" : ""} ${current ? "ring-2 ring-emerald-500" : ""}`}
              >
                {isFree && (
                  <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    🎁 {c.free}
                  </span>
                )}
                {isPopular && (
                  <div className="bg-primary/20 text-center py-1 text-[10px] font-bold text-primary tracking-wide">
                    ⭐ {c.mostPopular} ✨
                  </div>
                )}
                {current && (
                  <div className="bg-emerald-600/20 text-center py-1 text-[10px] font-bold text-emerald-400 tracking-wide">
                    ✅ Your Plan
                  </div>
                )}

                <div className="flex-1 flex flex-col items-center px-4 pt-5 pb-4">
                  <div className={`mb-2 ${isPopular ? "text-primary" : "text-muted-foreground"}`}>
                    <Icon size={24} />
                  </div>
                  <h2 className={`text-base font-bold mb-2 ${isPopular ? "text-primary" : "text-foreground"}`}>
                    {plan.name}
                  </h2>
                  <div className="mb-4">
                    <span className={`text-2xl font-extrabold ${isPopular ? "text-primary" : "text-foreground"}`}>
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-xs ml-1">{plan.period}</span>
                  </div>

                  <ul className="w-full space-y-1.5 text-left mb-5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <Check size={13} className="text-primary mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-4 pb-4">
                  {plan.planKey ? (
                    <button
                      onClick={() => handleSelectPlan(plan.planKey!)}
                      disabled={loadingPlan === plan.planKey || current}
                      className={`block w-full text-center py-2 rounded-full font-bold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-60 ${ctaColors[i]}`}
                    >
                      {loadingPlan === plan.planKey && <Loader2 size={14} className="animate-spin" />}
                      {current ? "✅ Active" : plan.cta}
                    </button>
                  ) : (
                    <button
                      onClick={handleClaimGift}
                      disabled={claimingGift}
                      className={`block w-full text-center py-2 rounded-full font-bold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-60 ${ctaColors[i]}`}
                    >
                      {claimingGift && <Loader2 size={14} className="animate-spin" />}
                      {plan.cta}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />

      <DisclaimerModal
        open={showDisclaimer}
        onOpenChange={(open) => {
          setShowDisclaimer(open);
          if (!open) setPendingPlanKey(null);
        }}
        onAccept={handleDisclaimerAccept}
        simplified={disclaimerAccepted === true}
      />
    </div>
  );
};

export default Pricing;
