import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage, type LangKey } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/hooks/useCredits";
import { supabase } from "@/integrations/supabase/client";
import { Coins, Shield, Play, TrendingUp, Gamepad2, Download, FileText, Sparkles, Zap, BarChart3, ChevronDown } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/hooks/use-toast";
import InsufficientCreditsModal from "@/components/InsufficientCreditsModal";
import GamingDisclaimerModal from "@/components/ai-games/GamingDisclaimerModal";
import Mark6FullReport from "@/components/ai-games/Mark6FullReport";
import CharacterProfileModal from "@/components/ai-games/CharacterProfileModal";
import {
  allCharacters,
  mark6Labels,
  type CharacterModel,
  type CharacterConfig,
} from "@/components/ai-games/mark6-data";

import elonImg from "@/assets/elon-v2.png";
import gamblingImg from "@/assets/gambling-v2.png";
import aladdinImg from "@/assets/aladdin-v2.png";
import luckyStarImg from "@/assets/lucky-star-v2.png";
import acheloisImg from "@/assets/achelois-v2.png";
import dragonGenieImg from "@/assets/dragon-genie.png";
import dragonMasterImg from "@/assets/dragon-master.png";
import phoenixTrendImg from "@/assets/phoenix-trend.png";
import tigerVolatilityImg from "@/assets/tiger-volatility.png";

const avatarMap: Record<string, string> = {
  "elon-v2": elonImg,
  "gambling-v2": gamblingImg,
  "aladdin-v2": aladdinImg,
  "lucky-star-v2": luckyStarImg,
  "achelois-v2": acheloisImg,
  "dragon-master": dragonMasterImg,
  "phoenix-trend": phoenixTrendImg,
  "tiger-volatility": tigerVolatilityImg,
};

const langKeys: LangKey[] = ["en", "tc", "sc"];

type LottoType = "hk" | "tw";

const Glass = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-xl glass-casino shadow-lg p-5 ${className}`}>
    {children}
  </div>
);

const AIGames = () => {
  const { lang, setLang } = useLanguage();
  const t = mark6Labels[lang];
  const { user, subscription } = useAuth();
  const { credits, loading: creditsLoading, refetch: refetchCredits } = useCredits();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const [activeConfig, setActiveConfig] = useState<CharacterConfig | null>(null);
  const [showGamingDisclaimer, setShowGamingDisclaimer] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [profileChar, setProfileChar] = useState<CharacterModel | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [lottoType, setLottoType] = useState<LottoType>("hk");
  const [showHowToUse, setShowHowToUse] = useState(false);

  const hasAccess = subscription.subscribed || credits > 0 || creditsLoading;

  const isStartEnabled = !!activeCharacterId && !!activeConfig;

  const handleReset = () => {
    setShowReport(false);
    setActiveCharacterId(null);
    setActiveConfig(null);
  };

  const handleStartGame = () => {
    if (!isStartEnabled) return;
    if (!user) {
      navigate("/auth?returnTo=/ai-games");
      return;
    }
    if (!hasAccess) {
      setShowCreditsModal(true);
      return;
    }
    setShowGamingDisclaimer(true);
  };

  const handleDisclaimerAccept = async () => {
    setShowGamingDisclaimer(false);
    if (!subscription.subscribed && user) {
      const { error } = await supabase.rpc("deduct_credit", { p_report_type: "game" });
      if (error) {
        console.error("Credit deduction failed:", error.message);
        toast({ title: "Error", description: "Failed to deduct credit. Please try again.", variant: "destructive" });
        return;
      }
      refetchCredits();
    }

    if (user && activeChar) {
      await supabase.from("analysis_history").insert({
        user_id: user.id,
        report_type: "game",
        model_used: activeChar.name.en,
        symbol: null,
        status: "completed",
        report_data: { character: activeChar.id, config: activeConfig, lottoType } as any,
      });
    }
    
    setShowReport(true);
  };

  const handleDisclaimerDecline = () => {
    setShowGamingDisclaimer(false);
  };

  const handleCharacterSelect = (id: string, config: CharacterConfig) => {
    setActiveCharacterId(id);
    setActiveConfig(config);
  };

  const activeChar = allCharacters.find((c) => c.id === activeCharacterId);

  const getLottoTitle = () => {
    if (lang === "en") {
      return "AI Mark6 and TW Big Lotto";
    } else if (lang === "tc") {
      return "AI 六合彩及台灣大樂透";
    } else {
      return "AI 六合彩及台湾大乐透";
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-white casino-bg-pattern" style={{ background: 'linear-gradient(160deg, hsl(162 89% 16%) 0%, hsl(155 50% 18%) 40%, hsl(162 89% 20%) 70%, hsl(155 60% 14%) 100%)' }}>
      <Header />

      <GamingDisclaimerModal open={showGamingDisclaimer} onAccept={handleDisclaimerAccept} onDecline={handleDisclaimerDecline} />
      <InsufficientCreditsModal open={showCreditsModal} onClose={() => setShowCreditsModal(false)} />
      <CharacterProfileModal character={profileChar} open={showProfile} onClose={() => setShowProfile(false)} onSelect={handleCharacterSelect} />

      <main className="flex-1 flex flex-col">
        {showReport && activeChar && activeConfig ? (
          <Mark6FullReport character={activeChar} config={activeConfig} onReset={handleReset} />
        ) : (
          <>
            {/* ── Hero ── */}
            <section className="pt-6 pb-4 px-4 md:px-6 text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-casino-gold">{getLottoTitle()}</h1>
              <p className="text-white/80 text-lg md:text-2xl font-bold italic">{t.subtitle}</p>

              {user && (
                <div className="flex items-center justify-center gap-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full glass-casino px-4 py-2 text-sm">
                    <Coins size={16} className="text-casino-gold" />
                    <span className="font-semibold text-white">{credits}</span>
                    <span className="text-white/60 font-semibold">{t.credits}</span>
                  </div>
                  <Link to="/pricing" className="inline-flex items-center gap-1.5 rounded-full btn-casino px-5 py-2 text-sm transition-colors shadow-sm">
                    ⚡ {t.topUp}
                  </Link>
                </div>
              )}

              {/* Language toggle */}
              <div className="flex items-center justify-center gap-1 text-sm">
                {langKeys.map((lk, i) => (
                  <span key={lk} className="flex items-center gap-1">
                    {i > 0 && <span className="text-muted-foreground mx-1">|</span>}
                    <button
                      onClick={() => setLang(lk)}
                      className={`transition-colors ${lang === lk ? "text-casino-gold font-semibold" : "text-white/50 hover:text-white"}`}
                    >
                      {t.langTabs[i]}
                    </button>
                  </span>
                ))}
              </div>

              {/* Lotto Type Selector */}
              <div className="flex items-center justify-center gap-3 mt-2">
                <button
                  onClick={() => setLottoType("hk")}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    lottoType === "hk"
                      ? "btn-casino shadow-lg"
                      : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20"
                  }`}
                >
                  {lang === "en" ? "HK Mark6" : lang === "tc" ? "香港六合彩" : "香港六合彩"}
                </button>
                <button
                  onClick={() => setLottoType("tw")}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    lottoType === "tw"
                      ? "btn-casino shadow-lg"
                      : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20"
                  }`}
                >
                  {lang === "en" ? "TW Big Lotto" : lang === "tc" ? "台灣大樂透" : "台湾大乐透"}
                </button>
              </div>

              <p className="text-casino-gold text-sm font-medium italic">{t.whichGenius}</p>
            </section>

            {/* ── Unified 8 AI Characters ── */}
            <section className="max-w-4xl w-full mx-auto px-4 md:px-6 mb-6">
              <Glass>
                <h3 className="text-base md:text-lg font-bold text-casino-gold italic text-center mb-1">{t.chooseModel}</h3>
                <p className="text-[10px] text-white/50 text-center mb-4">{t.chooseModelDesc}</p>
                <div className="grid grid-cols-4 gap-3">
                  {allCharacters.map((c) => {
                    const isActive = activeCharacterId === c.id;
                    const borderColor =
                      c.accent === "amber" ? "border-amber-400" :
                      c.accent === "red" ? "border-red-400" :
                      c.accent === "emerald" ? "border-emerald-400" :
                      "border-blue-400";
                    const glowColor =
                      c.accent === "amber" ? "shadow-[0_0_14px_rgba(245,158,11,0.5)]" :
                      c.accent === "red" ? "shadow-[0_0_14px_rgba(239,68,68,0.5)]" :
                      c.accent === "emerald" ? "shadow-[0_0_14px_rgba(16,185,129,0.5)]" :
                      "shadow-[0_0_14px_rgba(59,130,246,0.5)]";
                    const textColor =
                      c.accent === "amber" ? "text-amber-400" :
                      c.accent === "red" ? "text-red-400" :
                      c.accent === "emerald" ? "text-emerald-400" :
                      "text-blue-400";

                    return (
                      <button
                        key={c.id}
                        onClick={() => { setProfileChar(c); setShowProfile(true); }}
                        className={`flex flex-col items-center gap-1 transition-all ${isActive ? "scale-105" : "opacity-50 hover:opacity-100 hover:scale-105"}`}
                      >
                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 transition-all ${isActive ? `${borderColor} ${glowColor}` : "border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.15)]"}`}>
                          <img src={avatarMap[c.avatar]} alt={c.name.en} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-bold text-white leading-tight text-center">{c.name[lang]}</span>
                        <span className={`text-[8px] font-medium leading-tight text-center ${isActive ? textColor : "text-white/40"}`}>{c.subtitle[lang]}</span>
                        {isActive && (
                          <span className={`text-[8px] font-bold ${textColor}`}>✓ ACTIVE</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Glass>
            </section>

            {/* ── Dragon Genie + Start ── */}
            <section className="max-w-3xl w-full mx-auto px-4 md:px-6 mb-8">
              <Glass className="flex flex-col items-center justify-center gap-3">
                {!activeCharacterId ? (
                  <EmptyState
                    icon={<Gamepad2 size={32} className="text-primary" />}
                    title={lang === "en" ? "You haven't run any analyses yet!" : lang === "tc" ? "您尚未進行任何分析！" : "您尚未进行任何分析！"}
                    subtitle={lang === "en" ? "Choose an AI Partner above to begin your probability analysis." : lang === "tc" ? "請從上方選擇一位 AI 夥伴，開始您的概率分析。" : "请从上方选择一位 AI 伙伴，开始您的概率分析。"}
                  />
                ) : (
                  <>
                    <img src={dragonGenieImg} alt="Dragon AI" className="w-36 h-36 object-contain" />
                    <p className="text-[10px] text-white/40">{t.poweredBy}</p>
                    <div className="text-center">
                      <span className="text-xs text-casino-gold font-semibold">{activeChar?.name[lang]}</span>
                      <span className="text-xs text-white/50 ml-1">({activeChar?.method[lang]})</span>
                    </div>
                    <button
                      onClick={handleStartGame}
                      disabled={!isStartEnabled}
                      className={`inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-bold transition-all ${
                        isStartEnabled
                          ? "btn-casino shadow-lg"
                          : "bg-white/10 text-white/30 cursor-not-allowed opacity-50"
                      }`}
                    >
                      <Play size={16} /> {t.startGame}
                    </button>
                  </>
                )}
              </Glass>
            </section>

            {/* ── How to Use AI Predictions (Collapsible) ── */}
            <section className="max-w-3xl w-full mx-auto px-4 md:px-6 mb-8">
              <Glass>
                <button
                  onClick={() => setShowHowToUse(!showHowToUse)}
                  className="w-full flex items-center justify-between group"
                >
                  <h3 className="font-bold text-casino-gold text-base text-center flex-1">
                    {lang === "en" ? "How to Use AI Predictions" : lang === "tc" ? "如何使用 AI 預測" : "如何使用 AI 预测"}
                  </h3>
                  <div className={`transform transition-transform duration-300 ${showHowToUse ? "rotate-180" : ""}`}>
                    <ChevronDown size={20} className="text-casino-gold" />
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${showHowToUse ? "max-h-[800px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
                  <p className="text-[10px] text-white/50 text-center mb-4">
                    {lang === "en" ? "3 simple steps to get your AI-powered predictions" : lang === "tc" ? "3 個簡單步驟獲取 AI 預測號碼" : "3 个简单步骤获取 AI 预测号码"}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        icon: <Gamepad2 size={20} className="text-amber-400" />,
                        title: { en: "Choose AI Model", tc: "選擇 AI 模型", sc: "选择 AI 模型" },
                        desc: { en: "Pick your favourite AI prediction partner from the 8 geniuses above.", tc: "從上方 8 位天才中選擇您喜歡的 AI 預測夥伴。", sc: "从上方 8 位天才中选择您喜欢的 AI 预测伙伴。" },
                      },
                      {
                        icon: <BarChart3 size={20} className="text-emerald-400" />,
                        title: { en: "Generate Numbers", tc: "生成號碼", sc: "生成号码" },
                        desc: { en: "AI runs advanced simulations based on mathematical models and pattern analysis.", tc: "AI 會根據數學模型和模式分析進行高級模擬。", sc: "AI 会根据数学模型和模式分析进行高级模拟。" },
                      },
                      {
                        icon: <Sparkles size={20} className="text-violet-400" />,
                        title: { en: "Get Inspiration", tc: "獲取靈感", sc: "获取灵感" },
                        desc: { en: "Download your personalised prediction report with recommended number sets.", tc: "下載您的專屬預測報告與推薦號碼組合。", sc: "下载您的专属预测报告与推荐号码组合。" },
                      },
                    ].map((s, i) => (
                      <div key={i} className="rounded-lg felt-card p-4 space-y-2 text-center">
                        <div className="mx-auto w-10 h-10 rounded-full bg-casino-gold/15 flex items-center justify-center">{s.icon}</div>
                        <div className="text-xs font-bold text-casino-gold">Step {i + 1}</div>
                        <h4 className="text-sm font-bold text-white">{s.title[lang]}</h4>
                        <p className="text-[11px] text-white/50 leading-relaxed">{s.desc[lang]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Glass>
            </section>

            {/* ── PDF Download ── */}
            <section className="max-w-3xl w-full mx-auto px-4 md:px-6 mb-8 flex justify-center">
              <a
                href="/AI_Mark6_Analysis_Guide.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-xl border border-casino-gold/30 bg-casino-gold/10 px-6 py-3 text-casino-gold font-semibold hover:bg-casino-gold/20 transition-all group text-sm"
              >
                <FileText size={18} className="group-hover:scale-110 transition-transform" />
                {lang === "en" ? "Download: AI Mark6 Analysis Guide (PDF)" : lang === "tc" ? "下載：AI 六合彩分析指南 (PDF)" : "下载：AI 六合彩分析指南 (PDF)"}
                <Download size={16} />
              </a>
            </section>

            {/* ── Go to AI Stocks ── */}
            <section className="max-w-3xl w-full mx-auto px-4 md:px-6 mb-8">
              <Link to="/ai-stocks" className="block w-full rounded-xl btn-casino py-4 text-center text-sm shadow-md">
                <TrendingUp size={16} className="inline mr-2" />
                {t.goToStocks}
              </Link>
            </section>
          </>
        )}

        {/* ── Disclaimer bar ── */}
        <div className="max-w-3xl mx-auto px-4 md:px-6 mb-8">
          <div className="rounded-xl glass-casino p-3 flex items-start gap-2">
            <Shield className="text-casino-gold shrink-0 mt-0.5" size={16} />
            <p className="text-[11px] text-white/50 leading-relaxed">{t.disclaimer}</p>
          </div>
        </div>
        
      </main>

      <Footer />
    </div>
  );
};

export default AIGames;