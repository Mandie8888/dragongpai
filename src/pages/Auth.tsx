import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/hooks/useCredits";
import { Mail, Lock, Loader2 } from "lucide-react";

const t = {
  en: {
    login: "Log In",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    switchToSignup: "Don't have an account? Sign up",
    switchToLogin: "Already have an account? Log in",
    errorGeneric: "Something went wrong. Please try again.",
    checkEmail: "Check your email to confirm your account before logging in.",
    invalidCredentials: "Account not found or incorrect password. Please sign up first if you don't have an account.",
  },
  tc: {
    login: "登入",
    signup: "註冊",
    email: "電郵",
    password: "密碼",
    switchToSignup: "沒有帳戶？註冊",
    switchToLogin: "已有帳戶？登入",
    errorGeneric: "出了點問題，請再試一次。",
    checkEmail: "請查看您的電郵以確認帳戶後再登入。",
    invalidCredentials: "找不到帳戶或密碼錯誤。若尚未註冊，請先建立帳戶。",
  },
  sc: {
    login: "登录",
    signup: "注册",
    email: "邮箱",
    password: "密码",
    switchToSignup: "没有账户？注册",
    switchToLogin: "已有账户？登录",
    errorGeneric: "出了点问题，请再试一次。",
    checkEmail: "请查看您的邮箱以确认账户后再登录。",
    invalidCredentials: "找不到账户或密码错误。若尚未注册，请先创建账户。",
  },
};

const Auth = () => {
  const { lang } = useLanguage();
  const c = t[lang];
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { credits, loading: creditsLoading } = useCredits();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const returnTo = searchParams.get("returnTo");

  const getRedirectPath = () => {
    // Always honor explicit returnTo param (e.g., /ai-stocks?symbol=0700.HK)
    if (returnTo) return returnTo;
    // While credits are still loading, default to the main tool page (never /pricing)
    if (creditsLoading) return "/ai-stocks";
    return credits > 0 ? "/ai-stocks" : "/pricing";
  };

  useEffect(() => {
    if (user && !creditsLoading) {
      // If returnTo exists, always go there regardless of credit balance
      if (returnTo) {
        navigate(returnTo);
      } else {
        navigate(credits > 0 ? "/ai-stocks" : "/pricing");
      }
    }
  }, [user, creditsLoading, credits]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate(getRedirectPath());
      } else {
        const params = new URLSearchParams(window.location.search);
        const utmSource = params.get("utm_source") || "direct";
        const utmCampaign = params.get("utm_campaign") || "";
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              signup_source: utmSource,
              signup_campaign: utmCampaign,
            },
          },
        });
        if (error) throw error;
        setMessage(c.checkEmail);
      }
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.toLowerCase().includes("invalid login credentials")) {
        setError(c.invalidCredentials);
      } else {
        setError(msg || c.errorGeneric);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-primary text-center mb-6">
            {isLogin ? c.login : c.signup}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder={c.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                placeholder={c.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            {error && <p className="text-destructive text-xs text-center">{error}</p>}
            {message && <p className="text-primary text-xs text-center">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full bg-accent text-accent-foreground font-bold text-sm hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {isLogin ? c.login : c.signup}
            </button>
          </form>

          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); setMessage(""); }}
            className="w-full mt-4 text-center text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {isLogin ? c.switchToSignup : c.switchToLogin}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
