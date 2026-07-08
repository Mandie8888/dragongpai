import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import dragonLogo from "@/assets/dragon-logo.png";
import { Globe, Menu, LogOut, Coins, ChevronDown, LayoutDashboard, Star, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/hooks/useCredits";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage, type LangKey } from "@/contexts/LanguageContext";

const navLabels = {
  en: ["Home", "About us", "How it Works", "AI Stocks", "My Watchlist", "AI Games"],
  tc: ["首頁", "關於我們", "運作方式", "AI 股票", "我的關注", "AI 遊戲"],
  sc: ["首页", "关于我们", "运作方式", "AI 股票", "我的关注", "AI 游戏"],
};
const navHrefs = ["/", "/about", "/how-it-works", "/ai-stocks", "/watchlist", "/ai-games"];

const langOptions = [
  { key: "en" as const, label: "EN" },
  { key: "tc" as const, label: "繁體" },
  { key: "sc" as const, label: "简体" },
];

const LanguageDropdown = ({
  activeLang,
  onChange,
  className = "",
  variant = "default",
}: {
  activeLang: LangKey;
  onChange: (lang: LangKey) => void;
  className?: string;
  variant?: "default" | "games" | "stocks";
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeLabel = langOptions.find((l) => l.key === activeLang)?.label ?? "EN";

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${variant === "games" ? "border-white/30 text-white [text-shadow:0_0_6px_rgba(255,255,255,0.3)] hover:bg-white/10" : "border-primary/30 text-foreground hover:bg-primary/10"}`}
      >
        <Globe size={14} />
        {activeLabel}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 rounded-lg border border-border bg-white shadow-lg py-1 min-w-[100px]">
          {langOptions.map((l) => (
            <button
              key={l.key}
              onClick={() => { onChange(l.key); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                activeLang === l.key
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const UserDropdown = ({ user, signOut, variant = "default" }: { user: User; signOut: () => Promise<void>; variant?: "default" | "games" | "stocks" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const displayName = user.email?.split("@")[0] ?? "User";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Star, label: "My Watchlist", href: "/watchlist" },
    { icon: Settings, label: "Settings", href: "/pricing" },
  ];

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 text-sm font-semibold transition-colors ${variant === "games" ? "text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)] hover:text-casino-gold" : "text-primary hover:text-primary/80"}`}
      >
        <span className="text-right leading-tight">
          <span className="block text-xs opacity-70">Welcome back,</span>
          <span className="block">{displayName}!</span>
        </span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-52 rounded-lg border border-border bg-white shadow-xl py-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
          <div className="border-t border-border my-1" />
          <button
            onClick={() => { signOut(); setOpen(false); }}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-accent/30 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang } = useLanguage();
  const { user, signOut } = useAuth();
  const { credits } = useCredits();
  const location = useLocation();

  const isStocks = location.pathname.startsWith("/ai-stocks");
  const isGames = location.pathname.startsWith("/ai-games");

  const navClass = isGames
    ? "sticky top-0 z-50 border-b border-white/10 bg-[hsl(162,89%,16%)] backdrop-blur-md"
    : isStocks
      ? "sticky top-0 z-50 border-b border-[hsl(43,74%,52%,0.2)] glass-gold"
      : "sticky top-0 z-50 border-b border-border/50 glass";

  const linkColor = isGames ? "text-white/70 hover:text-casino-gold" : isStocks ? "text-navy/70 hover:text-gold" : "text-muted-foreground hover:text-primary";
  const logoBox = isGames ? "h-20 w-20 rounded-lg bg-[hsl(155,50%,18%)] shadow-md border border-white/10" : isStocks ? "h-20 w-20 rounded-lg bg-champagne shadow-md border border-gold/20" : "h-20 w-20 rounded-lg bg-white shadow-md border border-border/30";

  return (
    <nav className={navClass}>
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-2">
        <Link to="/" className="flex-shrink-0">
          <div className={`${logoBox} flex items-center justify-center overflow-hidden`}>
            <img src={dragonLogo} alt="DragonGPAi.com" className="h-16 w-16 object-contain" />
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-5">
          {navHrefs.map((href, i) => (
            <Link key={href} to={href} className={`text-sm ${linkColor} transition-colors whitespace-nowrap`}>{navLabels[lang][i]}</Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <div className={`hidden md:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm ${isGames ? "glass-casino" : isStocks ? "glass-gold" : "glass shadow-sm"}`}>
              <Coins size={14} className={isGames ? "text-casino-gold" : isStocks ? "text-gold" : "text-primary"} />
              <span className={`font-semibold ${isGames ? "text-white" : "text-foreground"}`}>{credits}</span>
            </div>
          )}
          <LanguageDropdown activeLang={lang} onChange={setLang} className="hidden md:inline-flex" variant={isGames ? "games" : isStocks ? "stocks" : "default"} />
          {user ? (
            <UserDropdown user={user} signOut={signOut} variant={isGames ? "games" : isStocks ? "stocks" : "default"} />
          ) : (
            <Link to="/auth" className={`rounded-full px-6 py-2.5 text-sm font-bold transition-colors shadow-md ${isGames ? "btn-casino" : isStocks ? "btn-gold" : "btn-gradient"}`}>
              Join/Login
            </Link>
          )}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className={`md:hidden p-2 transition-colors ${isGames ? "text-white hover:text-casino-gold" : "text-muted-foreground hover:text-foreground"}`}>
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className={`w-72 pt-12 ${isGames ? "bg-[hsl(155,50%,14%)]/95 backdrop-blur-md text-white" : "bg-background/95 backdrop-blur-md"}`}>
              <nav className="flex flex-col gap-4">
                <LanguageDropdown activeLang={lang} onChange={(l) => { setLang(l); }} className="mb-2" />
                {navHrefs.map((href, i) => (
                  <Link key={href} to={href} onClick={() => setMobileOpen(false)} className="text-base text-muted-foreground hover:text-primary transition-colors px-2 py-1.5">{navLabels[lang][i]}</Link>
                ))}
                {user ? (
                  <>
                    <div className="px-2 py-2 text-xs text-muted-foreground">Welcome back, <span className="text-primary font-semibold">{user.email?.split("@")[0]}</span>!</div>
                    <div className="border-t border-border my-1" />
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-2 py-2 text-base text-muted-foreground hover:text-primary transition-colors"><LayoutDashboard size={16} /> Dashboard</Link>
                    <Link to="/watchlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-2 py-2 text-base text-muted-foreground hover:text-primary transition-colors"><Star size={16} /> My Watchlist</Link>
                    <Link to="/pricing" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-2 py-2 text-base text-muted-foreground hover:text-primary transition-colors"><Settings size={16} /> Settings</Link>
                    <div className="border-t border-border my-1" />
                    <button onClick={() => { signOut(); setMobileOpen(false); }} className="flex items-center gap-3 w-full px-2 py-2 text-base text-destructive hover:text-destructive/80 transition-colors">
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setMobileOpen(false)} className={`mt-4 rounded-full px-6 py-2.5 text-sm font-bold text-center shadow-md ${isGames ? "btn-casino" : isStocks ? "btn-gold" : "btn-gradient"}`}>
                    Join/Login
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Header;
