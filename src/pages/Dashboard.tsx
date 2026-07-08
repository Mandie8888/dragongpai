import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FestiveBanner from "@/components/FestiveBanner";
import FestiveLoginPopup from "@/components/FestiveLoginPopup";
import FeedbackWidget from "@/components/FeedbackWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/hooks/useCredits";
import { supabase } from "@/integrations/supabase/client";
import { Coins, RefreshCw, Zap, CreditCard, ExternalLink, Timer } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { dashboardT } from "@/components/dashboard/DashboardTranslations";
import DashboardSidebar, { sidebarItems } from "@/components/dashboard/DashboardSidebar";
import ActivityTable from "@/components/dashboard/ActivityTable";
import WatchlistPanel from "@/components/dashboard/WatchlistPanel";
import { isPromoActive, promoDaysRemaining } from "@/lib/promo";

interface AnalysisRecord {
  id: string;
  report_type: string;
  model_used: string;
  symbol: string | null;
  status: string;
  created_at: string;
}

interface WatchlistItem {
  id: string;
  symbol: string;
  market: string;
}

const Dashboard = () => {
  const { lang } = useLanguage();
  const c = dashboardT[lang];
  const { user, loading: authLoading, subscription } = useAuth();
  const { credits, loading: creditsLoading } = useCredits();
  const navigate = useNavigate();

  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [vitality] = useState(() => Math.floor(Math.random() * 30) + 65);

  const username = user?.email?.split("@")[0] ?? "User";

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [historyRes, watchlistRes] = await Promise.all([
        supabase
          .from("analysis_history")
          .select("id, report_type, model_used, symbol, status, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("user_watchlists")
          .select("id, symbol, market")
          .eq("user_id", user.id)
          .order("added_at", { ascending: false })
          .limit(10),
      ]);
      if (historyRes.data) setHistory(historyRes.data);
      if (watchlistRes.data) setWatchlist(watchlistRes.data);
    };
    fetchData();
  }, [user]);

  const nextRefresh = subscription.subscriptionEnd
    ? new Date(subscription.subscriptionEnd).toLocaleDateString()
    : c.na;

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {
      navigate("/pricing");
    }
  };

  if (authLoading || creditsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <FestiveBanner />
      <FestiveLoginPopup />
      <div className="flex-1 flex">
        <DashboardSidebar c={c} activeSection={activeSection} setActiveSection={setActiveSection} />

        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-auto">
          {/* Welcome header */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              {c.welcome} <span className="text-foreground">{username}!</span>
            </h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Zap size={14} className="text-amber-400" />
              <span>{c.brainActive} <span className="text-primary font-bold">{vitality}%</span> {c.activeToday}</span>
            </div>
            <div className="max-w-xs">
              <div className="text-xs text-muted-foreground mb-1">{c.mentalVitality}</div>
              <Progress value={vitality} className="h-2" />
            </div>

            {isPromoActive() && (
              <div className="flex items-center gap-2 text-sm text-amber-400 font-semibold">
                <Timer size={14} />
                <span>
                  {lang === "en" && `🧧 Special Festive Trial ends in: ${promoDaysRemaining()} days`}
                  {lang === "tc" && `🧧 節日限定體驗將在 ${promoDaysRemaining()} 天後結束`}
                  {lang === "sc" && `🧧 节日限定体验将在 ${promoDaysRemaining()} 天后结束`}
                </span>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Credit Widget + Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Credit Widget */}
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary/20 flex items-center justify-center">
                    <Coins size={24} className="text-primary sm:hidden" />
                    <Coins size={28} className="text-primary hidden sm:block" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">{c.credits}</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-red-500">{credits}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-start sm:items-end w-full sm:w-auto">
                  <Button size="sm" onClick={() => navigate("/pricing")} className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                    {c.quickTopUp}
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {c.nextRefresh}: <span className="text-foreground">{nextRefresh}</span>
                  </span>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <h2 className="text-lg font-bold text-foreground mb-4">{c.recentActivity}</h2>
                <ActivityTable history={history} c={c} />
              </div>

              {/* Billing Section */}
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <CreditCard size={18} className="text-primary" />
                    {c.billing}
                  </h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {subscription.subscribed && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={handleManageSubscription}
                    >
                      <ExternalLink size={14} />
                      {c.manageSubscription}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={handleManageSubscription}
                  >
                    <ExternalLink size={14} />
                    {c.transactionHistory}
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: Watchlist Side Panel */}
            <div className="space-y-4">
              <WatchlistPanel watchlist={watchlist} c={c} />

              {/* Mobile sidebar links */}
              <div className="md:hidden rounded-xl border border-border bg-card p-4 space-y-1">
                {sidebarItems(c).map((item) => {
                  const isHash = item.href.startsWith("#");
                  return isHash ? (
                    <button
                      key={item.label}
                      onClick={() => setActiveSection(item.href.slice(1))}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors w-full text-left"
                    >
                      <item.icon size={14} /> {item.label}
                    </button>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                    >
                      <item.icon size={14} /> {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Feedback Widget during promo */}
            {isPromoActive() && (
              <div className="lg:col-span-3">
                <div className="rounded-xl border border-primary/30 bg-card">
                  <FeedbackWidget />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
