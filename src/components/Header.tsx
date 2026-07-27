// src/components/Header.tsx
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import dragonLogo from "@/assets/dragon-logo.png";
import { Globe, Menu, LogOut, Coins, ChevronDown, LayoutDashboard, Star, Settings, X, User as UserIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/hooks/useCredits";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage, type LangKey } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

const navLabels = {
  en: ["Home", "About us", "How it Works", "AI Stocks", "My Watchlist", "AI Mark6/Lotto"],
  tc: ["首頁", "關於我們", "運作方式", "AI 股票", "我的關注", "AI 六合彩/大樂透"],
  sc: ["首页", "关于我们", "运作方式", "AI 股票", "我的关注", "AI 六合彩/大乐透"],
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
}: {
  activeLang: LangKey;
  onChange: (lang: LangKey) => void;
  className?: string;
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
        className="flex items-center gap-1 rounded-full border border-blue-300/40 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50/50 transition-colors"
      >
        <Globe size={14} />
        {activeLabel}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 rounded-lg border border-blue-200 bg-white shadow-lg py-1 min-w-[100px]">
          {langOptions.map((l) => (
            <button
              key={l.key}
              onClick={() => { onChange(l.key); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                activeLang === l.key
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-600 hover:text-blue-700 hover:bg-blue-50/50"
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

const UserDropdown = ({ user, signOut }: { user: User; signOut: () => Promise<void> }) => {
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
        className="flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-500 transition-colors"
      >
        <span className="text-right leading-tight">
          <span className="block text-xs opacity-70">Welcome back,</span>
          <span className="block">{displayName}!</span>
        </span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-52 rounded-lg border border-blue-200 bg-white shadow-xl py-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50/50 transition-colors"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
          <div className="border-t border-gray-200 my-1" />
          <button
            onClick={() => { signOut(); setOpen(false); }}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-50/50 transition-colors"
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
  const isMobile = useIsMobile();

  const navClass = "sticky top-0 z-50 bg-gradient-to-r from-green-50 via-green-100/80 to-green-50 border-b border-green-200/50 shadow-sm";

  const linkColor = (path: string) => {
    const isActive = location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
    return isActive 
      ? "text-blue-700 font-bold border-b-2 border-blue-500" 
      : "text-blue-600 hover:text-blue-800 hover:font-semibold";
  };

  const logoBox = "h-16 w-16 rounded-lg bg-white shadow-md border border-green-200/50 flex items-center justify-center overflow-hidden";

  return (
    <nav className={navClass}>
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-2">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <div className={logoBox}>
            <img src={dragonLogo} alt="DragonGPAi.com" className="h-12 w-12 object-contain" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navHrefs.map((href, i) => (
            <Link 
              key={href} 
              to={href} 
              className={`text-sm ${linkColor(href)} transition-all duration-200 whitespace-nowrap`}
            >
              {navLabels[lang][i]}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden md:flex items-center gap-1.5 rounded-full bg-white/80 border border-green-200/50 px-3 py-1.5 text-sm shadow-sm">
              <Coins size={14} className="text-blue-600" />
              <span className="font-semibold text-gray-800">{credits}</span>
            </div>
          )}
          
          <LanguageDropdown activeLang={lang} onChange={setLang} className="hidden md:inline-flex" />
          
          {user ? (
            <UserDropdown user={user} signOut={signOut} />
          ) : (
            <Link 
              to="/auth" 
              className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition-all duration-200"
            >
              Join/Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Logout at TOP for easy access */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] z-50 bg-white/98 backdrop-blur-md animate-in slide-in-from-right">
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Close Button */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-700">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* User Info Bar - Always visible at top */}
            {user && (
              <div className="px-4 py-3 bg-blue-50/50 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {user.email?.split("@")[0] || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[140px]">{user.email}</p>
                    </div>
                  </div>
                  {/* LOGOUT BUTTON - RIGHT HERE AT THE TOP! */}
                  <button
                    onClick={() => { 
                      signOut(); 
                      setMobileOpen(false); 
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors shadow-sm"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-3 space-y-0.5 overflow-y-auto">
              <LanguageDropdown activeLang={lang} onChange={(l) => { setLang(l); }} className="w-full mb-3" />
              
              {navHrefs.map((href, i) => {
                const isActive = location.pathname === href || (href !== "/" && location.pathname.startsWith(href));
                return (
                  <Link 
                    key={href} 
                    to={href} 
                    onClick={() => setMobileOpen(false)} 
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive 
                        ? "bg-blue-50 text-blue-700 font-bold" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-blue-700"
                    }`}
                  >
                    {navLabels[lang][i]}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Section - User Links (Dashboard, Watchlist, Settings) */}
            {user && (
              <div className="border-t border-gray-200 px-4 py-3 bg-gray-50/50">
                <div className="space-y-0.5">
                  <Link 
                    to="/dashboard" 
                    onClick={() => setMobileOpen(false)} 
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-700 transition-colors"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link 
                    to="/watchlist" 
                    onClick={() => setMobileOpen(false)} 
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-700 transition-colors"
                  >
                    <Star size={16} /> My Watchlist
                  </Link>
                  <Link 
                    to="/pricing" 
                    onClick={() => setMobileOpen(false)} 
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-700 transition-colors"
                  >
                    <Settings size={16} /> Settings
                  </Link>
                </div>
              </div>
            )}

            {!user && (
              <div className="border-t border-gray-200 px-4 py-4">
                <Link 
                  to="/auth" 
                  onClick={() => setMobileOpen(false)} 
                  className="block w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white text-center shadow-md hover:bg-blue-700 transition-all"
                >
                  Join/Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;