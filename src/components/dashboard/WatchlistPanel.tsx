import { useNavigate } from "react-router-dom";
import { TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WatchlistItem {
  id: string;
  symbol: string;
  market: string;
}

interface Props {
  watchlist: WatchlistItem[];
  c: Record<string, string>;
}

const WatchlistPanel = ({ watchlist, c }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <h2 className="text-lg font-bold text-foreground mb-4">{c.myWatchlist}</h2>
      {watchlist.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">{c.emptyWatchlist}</p>
      ) : (
        <ul className="space-y-2">
          {watchlist.map((item) => (
            <li key={item.id} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <TrendingUp size={14} className="text-emerald-400 shrink-0" />
                <span className="font-medium text-sm truncate">{item.symbol}</span>
                <span className="text-xs text-muted-foreground uppercase shrink-0">{item.market}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-primary hover:text-primary shrink-0 gap-1"
                onClick={() => navigate(`/ai-stocks?symbol=${item.symbol}&market=${item.market}`)}
              >
                <Zap size={12} />
                <span className="hidden sm:inline">{c.quickRun}</span>
                <span className="sm:hidden">▶</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WatchlistPanel;
