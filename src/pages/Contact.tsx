import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Send, CheckCircle } from "lucide-react";

const t = {
  en: {
    headline: "Contact Us",
    subtitle: "Have a question or feedback? We'd love to hear from you.",
    emailLabel: "Email Us Directly",
    nameLabel: "Name",
    namePlaceholder: "Your full name",
    emailFieldLabel: "Email Address",
    emailFieldPlaceholder: "you@example.com",
    subjectLabel: "Subject",
    subjectPlaceholder: "What is this about?",
    messageLabel: "Message",
    messagePlaceholder: "Write your message here...",
    send: "Send Message",
    success: "Thank you for reaching out. The DragonGPAi.com team will respond to you shortly.",
    required: "This field is required.",
    invalidEmail: "Please enter a valid email address.",
  },
  tc: {
    headline: "聯絡我們",
    subtitle: "有任何問題或意見？我們很樂意聽取您的意見。",
    emailLabel: "直接電郵我們",
    nameLabel: "姓名",
    namePlaceholder: "您的全名",
    emailFieldLabel: "電子郵件地址",
    emailFieldPlaceholder: "you@example.com",
    subjectLabel: "主題",
    subjectPlaceholder: "這是關於什麼？",
    messageLabel: "訊息",
    messagePlaceholder: "在此輸入您的訊息...",
    send: "發送訊息",
    success: "感謝您的來信。DragonGPAi.com 團隊將盡快回覆您。",
    required: "此欄位為必填。",
    invalidEmail: "請輸入有效的電子郵件地址。",
  },
  sc: {
    headline: "联系我们",
    subtitle: "有任何问题或反馈？我们很乐意听取您的意见。",
    emailLabel: "直接邮件联系",
    nameLabel: "姓名",
    namePlaceholder: "您的全名",
    emailFieldLabel: "电子邮件地址",
    emailFieldPlaceholder: "you@example.com",
    subjectLabel: "主题",
    subjectPlaceholder: "这是关于什么？",
    messageLabel: "消息",
    messagePlaceholder: "在此输入您的消息...",
    send: "发送消息",
    success: "感谢您的来信。DragonGPAi.com 团队将尽快回复您。",
    required: "此字段为必填。",
    invalidEmail: "请输入有效的电子邮件地址。",
  },
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Contact = () => {
  const { lang } = useLanguage();
  const c = t[lang];

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = c.required;
    if (!form.email.trim()) errs.email = c.required;
    else if (!emailRegex.test(form.email.trim())) errs.email = c.invalidEmail;
    if (!form.subject.trim()) errs.subject = c.required;
    if (!form.message.trim()) errs.message = c.required;
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  };

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl">
          {/* Headline */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-3">{c.headline}</h1>
            <p className="text-muted-foreground text-sm md:text-base">{c.subtitle}</p>
          </div>

          {/* Email link */}
          <div className="flex items-center justify-center gap-2 mb-10 p-4 rounded-xl border border-primary/30 bg-primary/5">
            <Mail size={20} className="text-primary shrink-0" />
            <span className="text-sm text-muted-foreground">{c.emailLabel}:</span>
            <a
              href="mailto:contact@dragongpai.com"
              className="text-sm font-semibold text-primary hover:underline"
            >
              contact@dragongpai.com
            </a>
          </div>

          {submitted ? (
            <div className="text-center p-8 rounded-2xl border border-primary/30 bg-primary/5 animate-in fade-in">
              <CheckCircle size={48} className="text-primary mx-auto mb-4" />
              <p className="text-foreground font-semibold text-lg">{c.success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{c.nameLabel}</label>
                <input
                  type="text"
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder={c.namePlaceholder}
                  className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{c.emailFieldLabel}</label>
                <input
                  type="email"
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder={c.emailFieldPlaceholder}
                  className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{c.subjectLabel}</label>
                <input
                  type="text"
                  maxLength={200}
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  placeholder={c.subjectPlaceholder}
                  className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{c.messageLabel}</label>
                <textarea
                  maxLength={1000}
                  rows={5}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder={c.messagePlaceholder}
                  className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
                {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-full bg-accent py-3 font-bold text-sm text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                <Send size={16} />
                {c.send}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
