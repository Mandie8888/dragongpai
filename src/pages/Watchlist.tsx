import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Star, Trash2, Loader2 } from "lucide-react";

const labels = {
  en: {
    title: "My Watchlist",
    empty: "Your watchlist is empty. Analyze a stock and add it!",
    symbol: "Symbol",
    market: "Market",
    added: "Added",
    remove: "Remove",
    loginRequired: "Please log in to view your watchlist.",
    login: "Log In",
    goAnalyze: "Go to AI Stocks",
  },
  tc: {
    title: "我的自選清單",
    empty: "您的自選清單為空。分析股票後可添加！",
    symbol: "股票代碼",
    market: "市場",
    added: "添加日期",
    remove: "移除",
    loginRequired: "請登入以查看您的自選清單。",
    login: "登入",
    goAnalyze: "前往 AI 股票",
  },
  sc: {
    title: "我的自选清单",
    empty: "您的自选清单为空。分析股票后可添加！",
    symbol: "股票代码",
    market: "市场",
    added: "添加日期",
    remove: "移除",
    loginRequired: "请登入以查看您的自选清单。",
    login: "登入",
    goAnalyze: "前往 AI 股票",
  },
};

interface WatchlistItem {
  id: string;
  symbol: string;
  market: string;
  added_at: string;
}

const Watchlist = () => {
  const { lang } = useLanguage();
  const t = labels[lang];
  const { user } = useAuth();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    if (!user) { setLoading(false); return; }
    const { data } = await supabase
      .from("user_watchlists")
      .select("*")
      .order("added_at", { ascending: false });
    setItems((data as WatchlistItem[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchWatchlist(); }, [user]);

  const handleRemove = async (id: string) => {
    await supabase.from("user_watchlists").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10 space-y-6">
        <h1 className="text-3xl font-extrabold text-primary flex items-center gap-3">
          <Star size={28} /> {t.title}
        </h1>

        {!user ? (
          <div className="text-center space-y-4 py-10">
            <p className="text-muted-foreground">{t.loginRequired}</p>
            <Link to="/auth" className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">
              {t.login}
            </Link>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center space-y-4 py-10">
            <p className="text-muted-foreground">{t.empty}</p>
            <Link to="/ai-stocks" className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">
              {t.goAnalyze}
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border bg-card/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left px-4 py-3 font-medium">{t.symbol}</th>
                  <th className="text-left px-4 py-3 font-medium">{t.market}</th>
                  <th className="text-left px-4 py-3 font-medium">{t.added}</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-foreground">{item.symbol}</td>
                    <td className="px-4 py-3 text-muted-foreground uppercase">{item.market}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(item.added_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Watchlist;
