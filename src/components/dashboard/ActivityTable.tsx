import { useNavigate } from "react-router-dom";
import { Eye, TrendingUp, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PartnerAvatar from "./PartnerAvatar";

interface AnalysisRecord {
  id: string;
  report_type: string;
  model_used: string;
  symbol: string | null;
  status: string;
  created_at: string;
}

interface Props {
  history: AnalysisRecord[];
  c: Record<string, string>;
}

const ActivityTable = ({ history, c }: Props) => {
  const navigate = useNavigate();

  if (history.length === 0) {
    return (
      <div className="text-center py-8 space-y-3">
        <p className="text-sm text-muted-foreground">{c.noActivity}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="sm" variant="outline" onClick={() => navigate("/ai-stocks")}>
            <TrendingUp size={14} className="mr-1" /> {c.goToStocks}
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate("/ai-games")}>
            <Gamepad2 size={14} className="mr-1" /> {c.goToGames}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-5 px-5">
      {/* Desktop table */}
      <table className="w-full text-sm hidden sm:table">
        <thead>
          <tr className="border-b border-border text-muted-foreground text-left">
            <th className="pb-2 pr-4">{c.date}</th>
            <th className="pb-2 pr-4">{c.type}</th>
            <th className="pb-2 pr-4">{c.model}</th>
            <th className="pb-2 pr-4">{c.symbol}</th>
            <th className="pb-2 pr-4">{c.status}</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {history.map((row) => (
            <tr key={row.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
              <td className="py-2.5 pr-4 text-muted-foreground whitespace-nowrap">
                {new Date(row.created_at).toLocaleDateString()}
              </td>
              <td className="py-2.5 pr-4">
                <div className="flex items-center gap-2">
                  <PartnerAvatar modelUsed={row.model_used} reportType={row.report_type} size={24} />
                  <span className="text-foreground">{row.report_type === "stock" ? c.stock : c.game}</span>
                </div>
              </td>
              <td className="py-2.5 pr-4 text-primary font-medium">{row.model_used}</td>
              <td className="py-2.5 pr-4">{row.symbol ?? "—"}</td>
              <td className="py-2.5 pr-4">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                  {c.completed}
                </span>
              </td>
              <td className="py-2.5">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-primary hover:text-primary"
                  onClick={() => {
                    if (row.report_type === "stock" && row.symbol) {
                      navigate(`/ai-stocks?symbol=${row.symbol}`);
                    } else {
                      navigate("/ai-games");
                    }
                  }}
                >
                  <Eye size={12} className="mr-1" /> {c.viewReport}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {history.map((row) => (
          <div key={row.id} className="rounded-lg border border-border/50 bg-secondary/20 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PartnerAvatar modelUsed={row.model_used} reportType={row.report_type} size={32} />
                <div>
                  <div className="text-sm font-medium text-foreground">{row.model_used}</div>
                  <div className="text-xs text-muted-foreground">
                    {row.report_type === "stock" ? c.stock : c.game}
                    {row.symbol && ` · ${row.symbol}`}
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">
                {c.completed}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{new Date(row.created_at).toLocaleDateString()}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-primary hover:text-primary"
                onClick={() => {
                  if (row.report_type === "stock" && row.symbol) {
                    navigate(`/ai-stocks?symbol=${row.symbol}`);
                  } else {
                    navigate("/ai-games");
                  }
                }}
              >
                <Eye size={12} className="mr-1" /> {c.viewReport}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTable;
