import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const content = {
  en: {
    title: "Privacy Policy",
    sections: [
      {
        heading: "1. Data Collection",
        body: "We collect minimal personal data—only your Email and Name—solely for account management purposes. We do not collect, store, or process any data beyond what is strictly necessary to operate your account.",
      },
      {
        heading: "2. Payment Security",
        body: "We do not store credit card details. All payments are processed securely by Stripe, a PCI-DSS Level 1 certified payment processor. Your financial information is handled entirely by Stripe's secure infrastructure and never touches our servers.",
      },
      {
        heading: "3. No Manual Access",
        body: "Consistent with our Terms of Service, user data is managed through automated systems to protect user privacy and maintain our 'No Manual Processing' policy. This ensures that your personal information is handled with the highest level of security and consistency.",
      },
      {
        heading: "4. Data Usage",
        body: "Your data is used exclusively for: account authentication, subscription management, and delivering AI-generated analysis reports. We do not sell, share, or distribute your personal data to any third parties.",
      },
      {
        heading: "5. Data Retention",
        body: "Account data is retained only for as long as your account is active. Upon account deletion, all associated personal data is removed from our systems in accordance with applicable data protection regulations.",
      },
    ],
  },
  tc: {
    title: "私隱政策",
    sections: [
      {
        heading: "1. 數據收集",
        body: "我們僅收集最少的個人資料——即您的電郵地址和姓名——僅用於帳戶管理目的。我們不會收集、儲存或處理超出帳戶運作所需的任何數據。",
      },
      {
        heading: "2. 付款安全",
        body: "我們不儲存信用卡資料。所有付款均通過 Stripe（PCI-DSS 一級認證的付款處理商）安全處理。您的財務資訊完全由 Stripe 的安全基礎設施處理，絕不會觸及我們的伺服器。",
      },
      {
        heading: "3. 無人工存取",
        body: "與我們的服務條款一致，用戶數據通過自動化系統管理，以保護用戶私隱並維護我們的「無人工處理」政策。這確保您的個人資訊以最高級別的安全性和一致性處理。",
      },
      {
        heading: "4. 數據使用",
        body: "您的數據僅用於：帳戶認證、訂閱管理以及提供 AI 生成的分析報告。我們不會向任何第三方出售、分享或分發您的個人數據。",
      },
      {
        heading: "5. 數據保留",
        body: "帳戶數據僅在您的帳戶處於活動狀態時保留。帳戶刪除後，所有相關個人數據將根據適用的數據保護法規從我們的系統中移除。",
      },
    ],
  },
  sc: {
    title: "隐私政策",
    sections: [
      {
        heading: "1. 数据收集",
        body: "我们仅收集最少的个人数据——即您的电邮地址和姓名——仅用于账户管理目的。我们不会收集、存储或处理超出账户运作所需的任何数据。",
      },
      {
        heading: "2. 付款安全",
        body: "我们不存储信用卡资料。所有付款均通过 Stripe（PCI-DSS 一级认证的付款处理商）安全处理。您的财务信息完全由 Stripe 的安全基础设施处理，绝不会触及我们的服务器。",
      },
      {
        heading: "3. 无人工访问",
        body: "与我们的服务条款一致，用户数据通过自动化系统管理，以保护用户隐私并维护我们的「无人工处理」政策。这确保您的个人信息以最高级别的安全性和一致性处理。",
      },
      {
        heading: "4. 数据使用",
        body: "您的数据仅用于：账户认证、订阅管理以及提供 AI 生成的分析报告。我们不会向任何第三方出售、分享或分发您的个人数据。",
      },
      {
        heading: "5. 数据保留",
        body: "账户数据仅在您的账户处于活动状态时保留。账户删除后，所有相关个人数据将根据适用的数据保护法规从我们的系统中移除。",
      },
    ],
  },
};

const Privacy = () => {
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

export default Privacy;
