import { Newspaper, ExternalLink } from "lucide-react";
import type { LangKey } from "@/contexts/LanguageContext";
import type { StockNewsItem } from "@/hooks/useStockData";

const t = {
  en: {
    title: "Latest News",
    readMore: "Read More",
    noNews: "No recent news available for this ticker.",
    disclaimer: "News sourced from third-party providers. DragonGP AI does not verify or endorse the content.",
  },
  tc: {
    title: "最新新聞",
    readMore: "閱讀更多",
    noNews: "此股票代碼暫無最新新聞。",
    disclaimer: "新聞來源於第三方提供商。DragonGP AI 不對內容進行驗證或背書。",
  },
  sc: {
    title: "最新新闻",
    readMore: "阅读更多",
    noNews: "此股票代码暂无最新新闻。",
    disclaimer: "新闻来源于第三方提供商。DragonGP AI 不对内容进行验证或背书。",
  },
};

interface Props {
  lang: LangKey;
  news: StockNewsItem[];
}

const formatDate = (iso: string | null): string => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
};

const NewsSection = ({ lang, news }: Props) => {
  const l = t[lang];
  // Limit to top 3 most recent items
  const limitedNews = news.slice(0, 3);

  return (
    <div className="py-2" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
      <h3
        className="text-[13px] font-bold tracking-wide uppercase pb-1.5 mb-2"
        style={{
          fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
          color: "#1e293b",
          borderBottom: "2px solid #1e293b",
        }}
      >
        <span className="inline-flex items-center gap-2">
          <Newspaper size={14} />
          {l.title}
        </span>
      </h3>

      {limitedNews.length === 0 ? (
        <p className="text-[10px] italic py-2 text-center" style={{ color: "#94a3b8" }}>
          {l.noNews}
        </p>
      ) : (
        <div className="space-y-1">
          {limitedNews.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 p-1.5 rounded transition-colors no-print"
              style={{ border: "1px solid #e5e7eb", background: "#ffffff" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f8fafc"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#ffffff"; }}
            >
              <p className="text-[10px] font-semibold leading-tight truncate flex-1 min-w-0" style={{ color: "#1e293b" }}>
                {item.title}
              </p>
              <span className="text-[8px] shrink-0" style={{ color: "#94a3b8" }}>
                {item.publisher}{item.publishedAt ? ` · ${formatDate(item.publishedAt)}` : ""}
              </span>
              <ExternalLink size={10} className="shrink-0" style={{ color: "#94a3b8" }} />
            </a>
          ))}
          {/* Print-friendly version — single lines */}
          <div className="hidden print:block space-y-0.5">
            {limitedNews.map((item, i) => (
              <p key={`print-${i}`} className="text-[8px] truncate" style={{ color: "#475569" }}>
                • {item.title} — {item.publisher}
              </p>
            ))}
          </div>
        </div>
      )}

      <p className="mt-1 text-[7px] italic" style={{ color: "#94a3b8" }}>
        {l.disclaimer}
      </p>
    </div>
  );
};

export default NewsSection;
