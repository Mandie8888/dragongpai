import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import founderAvatar from "@/assets/founder-avatar.png";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/hooks/useCredits";
import { toast } from "@/hooks/use-toast";

const welcomeToast = {
  en: "Welcome Back!",
  tc: "歡迎回來！",
  sc: "欢迎回来！",
};

const content = {
  en: {
    heroTitle: "The Story Behind the Screen",
    heroDesc:
      "Welcome to DragonGPAi.com. This platform was born from the study of a retired veteran who refuses to let the mind slow down. I am not a financial tycoon or a licensed broker; I am simply an individual who believes the AI Era offers unprecedented tools to explore information.",
    missionTitle: "Our Mission: Intelligence, Not Investment",
    missionBody:
      "DragonGPAi.com was created for those interested in stock patterns and game theory. My goal is to save you hours of research by using AI to summarize market data, sparking your own creative ideas.",
    cogTitle: "Cognitive Engagement & Brain Vitality",
    cogBody:
      'The core purpose of this website is mental exercise. We believe analyzing patterns keeps the brain sharp. However, we strictly advocate for the',
    cogBold: "Principle of Self-Decision.",
    disclaimerTitle: "Principle of Self-Decision",
    disclaimerBody:
      'All information is a "Market Data Summary" and should not be taken as financial advice. We are NOT brokers, financial advisors, or tycoons. We are technology enthusiasts who believe in the power of information. All decisions you make based on our analysis are YOUR decisions. We provide the tools; you make the calls.',
    founderTitle: "Founder's Note",
    founderQuote:
      "AI can find patterns in endless oceans of data, but it will never feel the flutter of a human heart making a choice. Use this tool wisely — let the numbers inform you, but let your own intuition guide you.",
    cta: "Get Started — Join Free",
  },
  tc: {
    heroTitle: "螢幕背後的故事",
    heroDesc:
      "歡迎來到 DragonGPAi.com。這個平台源自一位退休老兵的研究，他拒絕讓思維放慢腳步。我不是金融大亨，也不是持牌經紀人；我只是一個相信 AI 時代為探索資訊提供了前所未有工具的人。",
    missionTitle: "我們的使命：智慧，而非投資",
    missionBody:
      "DragonGPAi.com 專為對股票模式和博弈論感興趣的人而建。我的目標是利用 AI 總結市場數據，為您節省數小時的研究時間，激發您自己的創意。",
    cogTitle: "認知參與與大腦活力",
    cogBody: "這個網站的核心目的是腦力鍛煉。我們相信分析模式能保持大腦敏銳。然而，我們嚴格倡導",
    cogBold: "自主決策原則。",
    disclaimerTitle: "自主決策原則",
    disclaimerBody:
      "所有資訊均為「市場數據摘要」，不應被視為財務建議。我們不是經紀人、財務顧問或大亨。我們是相信資訊力量的科技愛好者。您基於我們分析所做的所有決定都是您自己的決定。我們提供工具，您自己做主。",
    founderTitle: "創辦人的話",
    founderQuote:
      "AI 能在無盡的數據海洋中找到模式，但它永遠無法感受人類做選擇時的心跳。明智地使用這個工具——讓數字告知你，但讓你自己的直覺引導你。",
    cta: "立即開始 — 免費加入",
  },
  sc: {
    heroTitle: "屏幕背后的故事",
    heroDesc:
      "欢迎来到 DragonGPAi.com。这个平台源自一位退休老兵的研究，他拒绝让思维放慢脚步。我不是金融大亨，也不是持牌经纪人；我只是一个相信 AI 时代为探索信息提供了前所未有工具的人。",
    missionTitle: "我们的使命：智慧，而非投资",
    missionBody:
      "DragonGPAi.com 专为对股票模式和博弈论感兴趣的人而建。我的目标是利用 AI 总结市场数据，为您节省数小时的研究时间，激发您自己的创意。",
    cogTitle: "认知参与与大脑活力",
    cogBody: "这个网站的核心目的是脑力锻炼。我们相信分析模式能保持大脑敏锐。然而，我们严格倡导",
    cogBold: "自主决策原则。",
    disclaimerTitle: "自主决策原则",
    disclaimerBody:
      "所有信息均为「市场数据摘要」，不应被视为财务建议。我们不是经纪人、财务顾问或大亨。我们是相信信息力量的科技爱好者。您基于我们分析所做的所有决定都是您自己的决定。我们提供工具，您自己做主。",
    founderTitle: "创办人的话",
    founderQuote:
      "AI 能在无尽的数据海洋中找到模式，但它永远无法感受人类做选择时的心跳。明智地使用这个工具——让数字告知你，但让你自己的直觉引导你。",
    cta: "立即开始 — 免费加入",
  },
};

function AboutContent({ lang, onCtaClick }: { lang: keyof typeof content; onCtaClick: () => void }) {
  const c = content[lang];
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold italic text-accent">{c.heroTitle}</h1>
        <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground italic">{c.heroDesc}</p>
      </div>

      {/* Two-column cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card/50 p-5 space-y-2">
          <h2 className="text-lg font-bold text-accent italic">{c.missionTitle}</h2>
          <p className="text-sm text-muted-foreground italic">{c.missionBody}</p>
        </div>
        <div className="rounded-xl border bg-card/50 p-5 space-y-2">
          <h2 className="text-lg font-bold text-accent italic">{c.cogTitle}</h2>
          <p className="text-sm text-muted-foreground italic">
            {c.cogBody} <span className="font-bold text-foreground not-italic">{c.cogBold}</span>
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border-2 border-accent/60 bg-accent/5 p-5 space-y-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-accent shrink-0" size={18} />
          <h3 className="font-bold text-accent">{c.disclaimerTitle}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{c.disclaimerBody}</p>
      </div>

      {/* Founder's Note */}
      <div className="rounded-xl border bg-card p-5 flex items-start gap-4">
        <img src={founderAvatar} alt="Founder" className="h-16 w-16 rounded-full object-cover shrink-0" />
        <div className="space-y-2">
          <h3 className="font-bold text-primary">{c.founderTitle}</h3>
          <p className="text-sm text-primary/80 italic">{c.founderQuote}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-2 pb-4">
        <button
          onClick={onCtaClick}
          className="inline-block rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {c.cta}
        </button>
      </div>
    </div>
  );
}

const About = () => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const { credits } = useCredits();
  const navigate = useNavigate();

  const handleCta = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    toast({ title: welcomeToast[lang] });
    if (credits > 0) {
      navigate("/ai-stocks");
    } else {
      navigate("/pricing");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <AboutContent lang={lang} onCtaClick={handleCta} />
      </main>
      <Footer />
    </div>
  );
};

export default About;
