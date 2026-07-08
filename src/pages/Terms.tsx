import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const content = {
  en: {
    title: "Terms of Service",
    sections: [
      {
        heading: "1. Agreement to Terms",
        body: "By accessing Dragongpai.com, you agree to be bound by these Terms and our Master Disclaimer. If you do not agree, please do not use this service.",
      },
      {
        heading: "2. Eligibility",
        body: "This website is intended for adults seeking cognitive engagement and entertainment. By using this site, you confirm you are of legal age in your jurisdiction.",
      },
      {
        heading: "3. Nature of Service: The \u201COpen Eye\u201D Principle",
         body: "Dragongpai.com provides \"Market Data Summaries\" and \"AI Probability Analysis.\" We offer tools for \"Mental Gym\" exercises. We do not provide financial, investment, or gambling advice.",
      },
      {
        heading: "4. User Responsibility (Self-Decision)",
        body: "You agree that all actions taken based on the information provided are your Self-Decisions. You are responsible for verifying any data with a licensed professional before taking real-world action.",
      },
      {
        heading: "5. Subscription & Automatic Billing",
        body: "Payments: All payments are handled automatically via Stripe. No Manual Processing: To maintain the founder's retirement lifestyle, we do not accept manual bank transfers. Cancellations: You may cancel your subscription at any time through the automated Customer Portal. No refunds are provided for partial months.",
      },
      {
        heading: "6. Intellectual Property",
        body: "The AI-generated insights and website content are the property of DragonGP AI. You may use them for personal, non-commercial \"Mental Exercises\" only.",
      },
      {
        heading: "7. Limitation of Liability",
        body: "To the maximum extent permitted by law, Dragongpai.com and its founder shall not be liable for any financial losses, damages, or emotional distress resulting from the use of this service.",
      },
    ],
  },
  tc: {
    title: "服務條款",
    sections: [
      {
        heading: "1. 同意條款",
        body: "透過訪問 Dragongpai.com，即表示您同意受本條款及我們的「法律聲明」之約束。如果您不同意，請勿使用本服務。",
      },
      {
        heading: "2. 使用者資格",
        body: "本網站旨在為尋求「認知參與」與「娛樂」的成年人提供服務。使用本網站即表示您確認已達到所屬司法管轄區的法定年齡。",
      },
      {
        heading: "3. 服務性質：「睜開眼」原則",
        body: "Dragongpai.com 提供「市場數據摘要」和「AI 概率分析」。我們提供的是「大腦健身房」練習工具。我們不提供財務、投資或博弈建議。",
      },
      {
        heading: "4. 用戶責任（自主決策）",
        body: "您同意，基於所提供資訊而採取的任何行動均屬您的「自主決策」。在採取任何實際行動之前，您有責任向持牌專業人士核實相關數據。",
      },
      {
        heading: "5. 訂閱與自動結算",
        body: "付款方式：所有款項均透過 Stripe 自動處理。無人工處理：為維持創辦人的退休生活品質，我們不接受人工銀行轉帳。取消訂閱：您可隨時透過自動化客戶門戶取消訂閱。不滿整月的費用恕不退還。",
      },
      {
        heading: "6. 知識產權",
        body: "AI 生成的見解及網站內容均屬 DragonGP AI 所有。您僅能將其用於個人的、非商業性的「大腦練習」。",
      },
      {
        heading: "7. 責任限制",
        body: "在法律允許的最大範圍內，Dragongpai.com 及其創辦人對於因使用本服務而導致的任何財務損失、損害或情感困擾，概不承擔任何責任。",
      },
    ],
  },
  sc: {
    title: "服务条款",
    sections: [
      {
        heading: "1. 同意条款",
        body: "访问 Dragongpai.com 即表示您同意受本条款及我们的「法律声明」约束。如果您不同意，请勿使用本服务。",
      },
      {
        heading: "2. 用户资格",
        body: "本网站旨在为寻求「认知参与」与「娱乐」的成年人提供服务。使用本网站即确认您已达到所属司法管辖区的法定年龄。",
      },
      {
        heading: "3. 服务性质：「睁开眼」原则",
        body: "Dragongpai.com 提供「市场数据摘要」和「AI 概率分析」。我们提供的是「大脑健身房」练习工具。我们不提供财务、投资或博弈建议。",
      },
      {
        heading: "4. 用户责任（自主决策）",
        body: "您同意，基于所提供信息而采取的任何行动均属您的「自主决策」。在采取任何实际行动之前，您有责任向持牌专业人士核实相关数据。",
      },
      {
        heading: "5. 订阅与自动结算",
        body: "付款方式：所有款项均通过 Stripe 自动处理。无人工处理：为维持创办人的退休生活品质，我们不接受人工银行转账。取消订阅：您可随时通过自动化客户门户取消订阅。不满整月的费用恕不退还。",
      },
      {
        heading: "6. 知识产权",
        body: "AI 生成的见解及网站内容均属 DragonGP AI 所有。您仅能将其用于个人的、非商业性的「大脑练习」。",
      },
      {
        heading: "7. 责任限制",
        body: "在法律允许的最大范围内，Dragongpai.com 及其创办人对于因使用本服务而导致的任何财务损失、损害或情感困扰，概不承担任何责任。",
      },
    ],
  },
};

const Terms = () => {
  const { lang } = useLanguage();
  const c = content[lang];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-accent mb-10 text-center">
          {c.title}
        </h1>
        <div className="space-y-8">
          {c.sections.map((s, i) => (
            <section key={i} className="space-y-2">
              <h2 className="text-lg font-bold text-primary">{s.heading}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-12 text-center text-xs text-muted-foreground">
          © 2026 DragonGPAI.com. All Rights Reserved.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
