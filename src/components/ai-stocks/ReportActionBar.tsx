import { useState } from "react";
import { Link } from "react-router-dom";
import { Printer, Share2, ArrowLeft, Sparkles, Download, Star, FileDown, Loader2 } from "lucide-react";
import type { LangKey } from "@/contexts/LanguageContext";

const labels = {
  en: {
    pickAnother: "Select Another Stock",
    print: "Print",
    share: "Share",
    save: "Save as Text",
    downloadPdf: "Download PDF",
    downloading: "Generating…",
    saveWatchlist: "Save to My Watchlist",
    explore: "Go to AI Mark6 Probability Game Now",
  },
  tc: {
    pickAnother: "選擇其他股票",
    print: "列印",
    share: "分享",
    save: "儲存為文字",
    downloadPdf: "下載 PDF",
    downloading: "生成中…",
    saveWatchlist: "儲存至我的監察名單",
    explore: "立即前往 AI Mark6 概率遊戲",
  },
  sc: {
    pickAnother: "选择其他股票",
    print: "打印",
    share: "分享",
    save: "保存为文本",
    downloadPdf: "下载 PDF",
    downloading: "生成中…",
    saveWatchlist: "保存到我的监察名单",
    explore: "立即前往 AI Mark6 概率游戏",
  },
};

const marketLabels: Record<string, Record<LangKey, string>> = {
  us: { en: "US Market", tc: "美國市場", sc: "美国市场" },
  hk: { en: "Hong Kong Market", tc: "香港市場", sc: "香港市场" },
  tw: { en: "Taiwan Market", tc: "台灣市場", sc: "台湾市场" },
};

interface Props {
  lang: LangKey;
  ticker: string;
  market?: string;
  onReset: () => void;
  inWatchlist?: boolean;
  onAddWatchlist?: () => void;
}

const ReportActionBar = ({ lang, ticker, market = "us", onReset, inWatchlist, onAddWatchlist }: Props) => {
  const t = labels[lang];
  const mktLabel = marketLabels[market]?.[lang] ?? marketLabels.us[lang];
  const [pdfLoading, setPdfLoading] = useState(false);

  const handlePrint = () => window.print();

  const handleShare = () => {
    const url = `${window.location.origin}/ai-stocks?symbol=${encodeURIComponent(ticker)}`;
    const text = lang === "en"
      ? `I just ran an AI Probability Analysis on ${ticker} (${mktLabel})! 🐲🎯 Check it out: ${url}`
      : lang === "tc"
        ? `我剛在 DragonGP 上對 ${ticker}（${mktLabel}）進行了 AI 概率分析！🐲🎯 查看：${url}`
        : `我刚在 DragonGP 上对 ${ticker}（${mktLabel}）进行了 AI 概率分析！🐲🎯 查看：${url}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  const handleSave = () => {
    const el = document.getElementById("stock-report");
    if (!el) return;
    const text = el.innerText;
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${ticker}-report.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleDownloadPdf = async () => {
    const el = document.getElementById("stock-report");
    if (!el) return;
    setPdfLoading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      // Hide no-print elements temporarily
      const noPrintEls = el.querySelectorAll<HTMLElement>(".no-print");
      noPrintEls.forEach((e) => (e.style.display = "none"));

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      // Restore hidden elements
      noPrintEls.forEach((e) => (e.style.display = ""));

      // A4 dimensions in mm
      const A4_W = 210;
      const A4_H = 297;
      const MARGIN_H = 15; // horizontal margin mm
      const MARGIN_TOP = 22; // top margin mm (room for header)
      const MARGIN_BOTTOM = 20; // bottom margin mm (room for footer)
      const usableW = A4_W - MARGIN_H * 2;
      const usableH = A4_H - MARGIN_TOP - MARGIN_BOTTOM;

      const imgW = usableW;
      const imgH = (canvas.height / canvas.width) * imgW;

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageImgH = usableH;
      let position = 0;
      let page = 0;
      const totalPages = Math.ceil(imgH / pageImgH);

      while (position < imgH) {
        if (page > 0) pdf.addPage();

        // ── Professional Header ──
        pdf.setFontSize(7);
        pdf.setTextColor(148, 163, 184); // #94a3b8
        pdf.text("DragonGP AI — Institutional Research Report", MARGIN_H, 10);
        pdf.text(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), A4_W - MARGIN_H, 10, { align: "right" });
        pdf.setDrawColor(225, 231, 239); // #e1e7ef
        pdf.setLineWidth(0.3);
        pdf.line(MARGIN_H, 13, A4_W - MARGIN_H, 13);

        // ── Content slice ──
        const sliceH = Math.min(pageImgH, imgH - position);
        const srcY = (position / imgH) * canvas.height;
        const srcH = (sliceH / imgH) * canvas.height;

        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = srcH;
        const ctx = sliceCanvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
        }

        const imgData = sliceCanvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", MARGIN_H, MARGIN_TOP, imgW, sliceH);

        // ── Footer with page number ──
        const footerY = A4_H - 10;
        pdf.setFontSize(6.5);
        pdf.setTextColor(148, 163, 184);
        pdf.text("CONFIDENTIAL — For Intended Recipient Only  |  This report does not constitute financial advice.", MARGIN_H, footerY);
        pdf.setFontSize(7);
        pdf.setTextColor(30, 41, 59); // #1e293b
        pdf.text(`Page ${page + 1} of ${totalPages}`, A4_W - MARGIN_H, footerY, { align: "right" });

        // Thin line above footer
        pdf.setDrawColor(225, 231, 239);
        pdf.setLineWidth(0.3);
        pdf.line(MARGIN_H, footerY - 3, A4_W - MARGIN_H, footerY - 3);

        position += pageImgH;
        page++;
      }

      pdf.save(`${ticker}-report.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setPdfLoading(false);
    }
  };

  const btnBase =
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors";

  return (
    <div className="space-y-3 pt-2">
      {/* Row 1: Pick another, Print, Share */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onReset}
          className={`${btnBase} bg-primary text-primary-foreground hover:bg-primary/90`}
        >
          <ArrowLeft size={16} /> {t.pickAnother}
        </button>
        <button onClick={handlePrint} className={`${btnBase} bg-emerald-600 text-white hover:bg-emerald-500`}>
          <Printer size={16} /> {t.print}
        </button>
        <button onClick={handleShare} className={`${btnBase} bg-emerald-600 text-white hover:bg-emerald-500`}>
          <Share2 size={16} /> {t.share}
        </button>
      </div>

      {/* Row 2: Save + PDF + Watchlist */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button onClick={handleSave} className={`${btnBase} bg-emerald-600 text-white hover:bg-emerald-500`}>
          <Download size={16} /> {t.save}
        </button>
        <button
          onClick={handleDownloadPdf}
          disabled={pdfLoading}
          className={`${btnBase} bg-[#003366] text-white hover:bg-[#004080] disabled:opacity-60`}
        >
          {pdfLoading ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
          {pdfLoading ? t.downloading : t.downloadPdf}
        </button>
        {onAddWatchlist && !inWatchlist && (
          <button onClick={onAddWatchlist} className={`${btnBase} bg-emerald-600 text-white hover:bg-emerald-500`}>
            <Star size={16} className="text-amber-400 fill-amber-400" /> {t.saveWatchlist}
          </button>
        )}
      </div>

      {/* Row 3: Explore AI Games */}
      <Link
        to="/ai-games"
        className="block w-full max-w-2xl mx-auto rounded-xl bg-gradient-to-r from-primary to-amber-500 py-4 text-center text-sm font-bold text-primary-foreground hover:from-primary/90 hover:to-amber-400 transition-colors"
      >
        <Sparkles size={16} className="inline mr-2" />
        {t.explore}
      </Link>
    </div>
  );
};

export default ReportActionBar;
