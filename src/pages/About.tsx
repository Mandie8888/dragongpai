import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import founderAvatar from "@/assets/founder-avatar.png";
import { AlertTriangle, Rocket, Zap, Users, Brain, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/hooks/useCredits";
import { toast } from "@/hooks/use-toast";

const welcomeToast = {
  en: "Welcome Back! 🚀",
  tc: "歡迎回來！🚀",
  sc: "欢迎回来！🚀",
};

const content = {
  en: {
    heroTitle: "The Future of Intelligence",
    heroSub: "We're building the bridge between raw data and human intuition.",
    heroDesc:
      "Welcome to DragonGPAi.com. We're a team of curious minds who believe the AI Era is about more than just automation — it's about expanding how we think. We're not financial advisors or brokers; we're tech enthusiasts building tools that make complex data feel human again.",
    missionTitle: "Our Mission: Spark Curiosity, Not Anxiety",
    missionBody:
      "We built DragonGPAi.com for explorers — people who love patterns, probabilities, and the thrill of discovery. Our AI doesn't make decisions for you; it organizes the noise so you can think clearly. We save you hours of research so you can focus on what matters: your ideas.",
    cogTitle: "Brain Gym for the Digital Age",
    cogBody:
      "Every analysis on this platform is designed to be a mental workout. We believe that engaging with complex patterns keeps the mind agile. But we never forget:",
    cogBold: "You are the decision-maker. We're just the spotlight.",
    disclaimerTitle: "Our Promise: Radical Transparency",
    disclaimerBody:
      "Everything you see here is a 'Market Data Summary' — a mathematical snapshot, not financial advice. We're not brokers, advisors, or tycoons. We're data enthusiasts who believe in the power of clear information. Every decision you make from our tools is yours alone. We light the path; you choose the direction.",
    founderTitle: "From the Founder's Desk",
    founderQuote:
      "We built this platform because we believe intelligence is about connection — between data and insight, between curiosity and discovery. AI can find patterns in endless oceans of numbers, but it will never replace the human spark of intuition. Use our tools to inform your mind, then trust your own voice to guide you.",
    cta: "Join the Movement — Free",
    teamTitle: "We Are DragonGP",
    teamDesc: "A collective of analysts, engineers, and dreamers who believe data should be empowering, not overwhelming.",
  },
  tc: {
    heroTitle: "智能的未來",
    heroSub: "我們正在搭建原始數據與人類直覺之間的橋樑。",
    heroDesc:
      "歡迎來到 DragonGPAi.com。我們是一群充滿好奇心的團隊，相信 AI 時代不僅關乎自動化 —— 更關乎拓展我們的思維方式。我們不是財務顧問或經紀人；我們是科技愛好者，正在建造讓複雜數據重新變得人性化的工具。",
    missionTitle: "我們的使命：激發好奇心，而非焦慮",
    missionBody:
      "我們為探索者打造了 DragonGPAi.com —— 為那些熱愛模式、概率和發現樂趣的人們。我們的 AI 不為你做決定；它整理雜訊，讓你能清晰思考。我們為你節省數小時的研究時間，讓你能專注於真正重要的事：你的想法。",
    cogTitle: "數位時代的大腦健身房",
    cogBody:
      "這個平台上的每一次分析都是一次腦力訓練。我們相信與複雜模式互動能保持思維敏捷。但我們從不忘記：",
    cogBold: "你是決策者。我們只是聚光燈。",
    disclaimerTitle: "我們的承諾：徹底透明",
    disclaimerBody:
      "你在這裡看到的一切都是「市場數據摘要」—— 數學快照，而非財務建議。我們不是經紀人、顧問或大亨。我們是相信清晰資訊力量的數據愛好者。你根據我們的工具所做的每一個決定都由你全權負責。我們點亮道路；你選擇方向。",
    founderTitle: "創辦人的話",
    founderQuote:
      "我們建造這個平台，是因為我們相信智能關乎連結 —— 數據與洞察之間的連結，好奇心與發現之間的連結。AI 能在無盡的數字海洋中找到模式，但它永遠無法取代人類直覺的火花。用我們的工具來啟發你的思維，然後相信你自己的聲音來引導你。",
    cta: "加入運動 — 免費",
    teamTitle: "我們是 DragonGP",
    teamDesc: "一群分析師、工程師和夢想家的集合體，他們相信數據應該賦能，而非壓倒。",
  },
  sc: {
    heroTitle: "智能的未来",
    heroSub: "我们正在搭建原始数据与人类直觉之间的桥梁。",
    heroDesc:
      "欢迎来到 DragonGPAi.com。我们是一群充满好奇心的团队，相信 AI 时代不仅关乎自动化 —— 更关乎拓展我们的思维方式。我们不是财务顾问或经纪人；我们是科技爱好者，正在建造让复杂数据重新变得人性化的工具。",
    missionTitle: "我们的使命：激发好奇心，而非焦虑",
    missionBody:
      "我们为探索者打造了 DragonGPAi.com —— 为那些热爱模式、概率和发现乐趣的人们。我们的 AI 不为你做决定；它整理杂讯，让你能清晰思考。我们为你节省数小时的研究时间，让你能专注于真正重要的事：你的想法。",
    cogTitle: "数字时代的大脑健身房",
    cogBody:
      "这个平台上的每一次分析都是一次脑力训练。我们相信与复杂模式互动能保持思维敏捷。但我们从不忘記：",
    cogBold: "你是决策者。我们只是聚光灯。",
    disclaimerTitle: "我们的承诺：彻底透明",
    disclaimerBody:
      "你在这里看到的一切都是「市场数据摘要」—— 数学快照，而非财务建议。我们不是经纪人、顾问或大亨。我们是相信清晰资讯力量的数据爱好者。你根据我们的工具所做的每一个决定都由你全权负责。我们点亮道路；你选择方向。",
    founderTitle: "创办人的话",
    founderQuote:
      "我们建造这个平台，是因为我们相信智能关乎连结 —— 数据与洞察之间的连结，好奇心与发现之间的连结。AI 能在无尽的数字海洋中找到模式，但它永远无法取代人类直觉的火花。用我们的工具来启发你的思维，然后相信你自己的声音来引导你。",
    cta: "加入运动 — 免费",
    teamTitle: "我们是 DragonGP",
    teamDesc: "一群分析师、工程师和梦想家的集合体，他们相信数据应该赋能，而非压倒。",
  },
};

function AboutContent({ lang, onCtaClick }: { lang: keyof typeof content; onCtaClick: () => void }) {
  const c = content[lang];
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/50 border border-blue-200/30 text-sm font-medium text-blue-700 mb-2">
          <Rocket size={14} />
          <span>{lang === "en" ? "v2.0 — Built for Explorers" : "v2.0 — 為探索者打造"}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
          {c.heroTitle}
        </h1>
        <p className="text-lg text-blue-600 font-semibold italic">{c.heroSub}</p>
        <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-600 leading-relaxed">
          {c.heroDesc}
        </p>
      </div>

      {/* Team Badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200/50 shadow-sm">
          <Users className="text-blue-600" size={20} />
          <div className="text-left">
            <p className="text-sm font-bold text-gray-800">{c.teamTitle}</p>
            <p className="text-xs text-gray-500">{c.teamDesc}</p>
          </div>
        </div>
      </div>

      {/* Two-column cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-blue-200/50 bg-white/80 backdrop-blur-sm p-5 space-y-3 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2">
            <Sparkles className="text-blue-500" size={18} />
            <h2 className="text-lg font-bold text-blue-700">{c.missionTitle}</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{c.missionBody}</p>
        </div>
        <div className="rounded-xl border border-blue-200/50 bg-white/80 backdrop-blur-sm p-5 space-y-3 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2">
            <Brain className="text-blue-500" size={18} />
            <h2 className="text-lg font-bold text-blue-700">{c.cogTitle}</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {c.cogBody} <span className="font-bold text-blue-700">{c.cogBold}</span>
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border-2 border-blue-200/60 bg-blue-50/50 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-blue-600 shrink-0" size={18} />
          <h3 className="font-bold text-blue-700">{c.disclaimerTitle}</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{c.disclaimerBody}</p>
      </div>

      {/* Founder's Note */}
      <div className="rounded-xl border border-blue-200/50 bg-gradient-to-br from-white to-blue-50/50 p-5 flex items-start gap-4 hover:shadow-lg transition-all duration-300">
        <img 
          src={founderAvatar} 
          alt="Founder" 
          className="h-16 w-16 rounded-full object-cover shrink-0 border-2 border-blue-200" 
        />
        <div className="space-y-2">
          <h3 className="font-bold text-blue-700 flex items-center gap-2">
            <Zap size={16} className="text-blue-500" />
            {c.founderTitle}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed italic">"{c.founderQuote}"</p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-2 pb-4">
        <button
          onClick={onCtaClick}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
        >
          <Rocket size={18} />
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
    <div className="min-h-screen bg-page text-gray-800">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <AboutContent lang={lang} onCtaClick={handleCta} />
      </main>
      <Footer />
    </div>
  );
};

export default About;