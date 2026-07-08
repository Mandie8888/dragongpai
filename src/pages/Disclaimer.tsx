import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const content = {
  en: {
    title: "Master Terms & Disclaimers",
    sections: [
      {
        heading: "1. Nature of Service: Mathematical Modeling",
        body: "DragonGPAi.com is a technology demonstration platform. All outputs are generated through mathematical modeling and algorithmic pattern recognition. These models aggregate public data to show statistical probabilities and are not a substitute for human judgment or professional analysis.",
      },
      {
        heading: "2. Principle of Self-Decision",
        body: "By using this platform, you acknowledge and agree to the principle of Self-Decision. DragonGPAi.com provides data-driven simulations, but the responsibility for any action taken—financial, strategic, or otherwise—rests solely with the user. You are the final decision-maker.",
      },
      {
        heading: "3. No Professional or Gambling Licenses",
        body: "DragonGPAi.com is not a licensed corporation under the HK Securities and Futures Ordinance or the Taiwan Securities Investment Trust and Consulting Act. Furthermore, we do not hold any gambling or gaming licenses. We have no links to any security firms, brokers, or organizations related to gambling. We do not bear any professional experience in the investment, security, or gambling fields.",
      },
      {
        heading: "4. Purpose: Cognitive Engagement & Entertainment",
        body: "All proposals or indications are not encouraging for any investment or gambling purpose. The purpose is for your health and brain activities to prevent cognitive deterioration. This is a way to pass time productively. We discourage taking our AI-generated outputs as a base for real-world investment or gambling activities.",
      },
      {
        heading: "5. Limitation of Liability",
        body: "All actual investments or gaming decisions should be made in consultation with certified professionals or licensed brokers. The operators of DragonGPAi.com shall not be held liable for any direct or indirect losses.",
      },
    ],
  },
  tc: {
    title: "法律聲明與服務條款",
    sections: [
      {
        heading: "1. 服務性質：數學模型演算法",
         body: "DragonGPAI 是一個技術演示平台。本平台所有輸出內容均透過「數學模型」與演算法模式識別生成。這些模型僅是針對公開數據進行統計學上的概率呈現，並不代表專業分析，亦不能取代人類的判斷。",
      },
      {
        heading: "2. 自主決策原則 (Self-Decision)",
        body: "當您使用本平台時，即代表您承認並同意「自主決策」原則。DragonGPAi.com 提供的是數據驅動的模擬結果，但任何進一步行動（無論是財務、策略或其他性質）的責任完全由用戶本人承擔。您是最終的決策者。",
      },
      {
        heading: "3. 無專業執照與博弈牌照聲明",
        body: "DragonGPAi.com 並非持牌證券投資顧問機構，亦不持有任何博弈（賭博）牌照。我們與任何證券公司、經紀行或博弈組織均無關聯。我們在投資、證券或博弈領域不具備任何專業執照或職業經驗。",
      },
      {
        heading: "4. 宗旨：認知參與、大腦活化與娛樂",
        body: "所有方案或指標並非鼓勵任何投資或博弈行為。本平台之初衷係通過數據分析活動協助用戶「鍛煉大腦、預防退化」及「消磨時間」。我們明確勸喻並反對用戶將 AI 生成內容作為實際投資或博弈的依據。",
      },
      {
        heading: "5. 責任限制",
        body: "所有實際投資或博弈決定應諮詢持牌專業經紀商、金融機構或專業顧問。用戶需「風險自擔」，本平台運營者對用戶做出之決定概不負責。",
      },
    ],
  },
  sc: {
    title: "法律声明与服务条款",
    sections: [
      {
        heading: "1. 服务性质：数学模型算法",
        body: "DragonGPAi.com 是一个技术演示平台。本平台所有输出内容均通过「数学模型」与算法模式识别生成。这些模型仅是针对公开数据进行统计学上的概率呈现，并不代表专业分析，亦不能取代人类的判断。",
      },
      {
        heading: "2. 自主决策原则 (Self-Decision)",
        body: "当您使用本平台时，即代表您承认并同意「自主决策」原则。DragonGPAi.com 提供的是数据驱动的模拟结果，但任何进一步行动（无论是财务、策略或其他性质）的责任完全由用户本人承担。您是最终的决策者。",
      },
      {
        heading: "3. 无专业执照与博弈牌照声明",
        body: "DragonGPAi.com 并非持牌证券投资顾问机构，亦不持有任何博弈（赌博）牌照。我们与任何证券公司、经纪行或博弈组织均无关联。我们在投资、证券或博弈领域不具备任何专业执照或职业经验。",
      },
      {
        heading: "4. 宗旨：认知参与、大脑活化与娱乐",
        body: "所有方案或指标并非鼓励任何投资或博弈行为。本平台之初衷系通过数据分析活动协助用户「锻炼大脑、预防退化」及「消磨时间」。我们明确劝喻并反对用户将 AI 生成内容作为实际投资或博弈的依据。",
      },
      {
        heading: "5. 责任限制",
        body: "所有实际投资或博弈决定应咨询持牌专业经纪商、金融机构或专业顾问。用户需「风险自担」，本平台运营者对用户做出之决定概不负责。",
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
