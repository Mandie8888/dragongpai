import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const content = {
  en: {
    title: "Refund Policy",
    intro:
      "DragonGPAi.com provides immediate access to AI-powered mathematical models and cognitive engagement tools. Please read this Refund Policy carefully before subscribing.",
    sections: [
      {
        heading: "1. No Refund Policy",
        body: "Due to the nature of immediate access to digital mathematical models and AI-generated analysis, all sales are final. Once a subscription is activated, you receive instant access to our full suite of cognitive engagement tools, market data summaries, and AI probability analyses. Because this digital content is delivered immediately upon purchase, we are unable to offer refunds for any subscription period that has already begun.",
      },
      {
        heading: "2. How to Cancel (Self-Service)",
        body: 'DragonGPAi.com is a Self-Service platform. You are responsible for managing your own subscription. To cancel, visit our Unsubscribe page and follow the automated process through our Customer Portal (powered by Stripe). We do not process manual cancellations via email or any other channel. This is by design, to maintain the simplicity and integrity of the founder\'s "retirement project."',
      },
      {
        heading: "3. Finality of Charges",
        body: "Once your unsubscription is confirmed through the Customer Portal, no further charges will occur. However, any payments already processed for current or previous billing cycles are non-refundable. You will continue to have access to the service until the end of your current paid period.",
      },
      {
        heading: "4. Contact",
        body: "If you have questions about this policy, you may reach us at:",
      },
    ],
  },
  tc: {
    title: "退款政策",
    intro:
      "DragonGPAi.com 提供即時存取 AI 驅動的數學模型及認知參與工具。請在訂閱前仔細閱讀本退款政策。",
    sections: [
      {
        heading: "1. 不退款政策",
        body: "由於數碼數學模型及 AI 生成分析的即時存取特性，所有銷售均為最終銷售。一旦訂閱啟動，您即可即時存取我們的全套認知參與工具、市場數據摘要及 AI 概率分析。因為此數碼內容在購買後即時交付，我們無法為任何已開始的訂閱期間提供退款。",
      },
      {
        heading: "2. 如何取消（自助服務）",
        body: "DragonGPAi.com 是一個「自助服務」平台。您有責任自行管理您的訂閱。如需取消，請前往我們的「取消訂閱」頁面，並透過我們的客戶門戶（由 Stripe 提供）完成自動化流程。我們不處理透過電郵或任何其他渠道的人工取消請求。這是刻意設計的，以維持創辦人「退休項目」的簡約性與完整性。",
      },
      {
        heading: "3. 收費的最終性",
        body: "一旦您透過客戶門戶確認取消訂閱，將不會再產生任何費用。然而，已處理的當前或之前帳單週期的任何款項均不可退還。在您當前的已付費期間結束之前，您將繼續享有服務的存取權限。",
      },
      {
        heading: "4. 聯絡方式",
        body: "如您對本政策有任何疑問，可透過以下方式聯絡我們：",
      },
    ],
  },
  sc: {
    title: "退款政策",
    intro:
      "DragonGPAi.com 提供即时访问 AI 驱动的数学模型及认知参与工具。请在订阅前仔细阅读本退款政策。",
    sections: [
      {
        heading: "1. 不退款政策",
        body: "由于数字数学模型及 AI 生成分析的即时访问特性，所有销售均为最终销售。一旦订阅激活，您即可即时访问我们的全套认知参与工具、市场数据摘要及 AI 概率分析。因为此数字内容在购买后即时交付，我们无法为任何已开始的订阅期间提供退款。",
      },
      {
        heading: "2. 如何取消（自助服务）",
        body: "DragonGPAi.com 是一个「自助服务」平台。您有责任自行管理您的订阅。如需取消，请前往我们的「取消订阅」页面，并通过我们的客户门户（由 Stripe 提供）完成自动化流程。我们不处理通过邮件或任何其他渠道的人工取消请求。这是刻意设计的，以维持创办人「退休项目」的简约性与完整性。",
      },
      {
        heading: "3. 收费的最终性",
        body: "一旦您通过客户门户确认取消订阅，将不会再产生任何费用。然而，已处理的当前或之前账单周期的任何款项均不可退还。在您当前的已付费期间结束之前，您将继续享有服务的访问权限。",
      },
      {
        heading: "4. 联系方式",
        body: "如您对本政策有任何疑问，可通过以下方式联系我们：",
      },
    ],
  },
};

const RefundPolicy = () => {
  const { lang } = useLanguage();
  const c = content[lang];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-accent mb-4 text-center">
          {c.title}
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-10 max-w-xl mx-auto">
          {c.intro}
        </p>
        <div className="space-y-8">
          {c.sections.map((s, i) => (
            <section key={i} className="space-y-2">
              <h2 className="text-lg font-bold text-primary">{s.heading}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
              {/* Contact email after last section */}
              {i === c.sections.length - 1 && (
                <p className="text-sm text-muted-foreground mt-2">
                  📧{" "}
                  <a
                    href="mailto:contact@dragongp.ai"
                    className="text-primary hover:underline"
                  >
                    contact@dragongp.ai
                  </a>
                </p>
              )}
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

export default RefundPolicy;
