// src/components/ai-stocks/ReportActionBar.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Printer, Share2, ArrowLeft, Sparkles, Download, Star, FileDown, Loader2, Facebook, MessageCircle, Copy, Check } from "lucide-react";
import type { LangKey } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const labels = {
  en: {
    pickAnother: "Select Another Stock",
    print: "Print",
    share: "Share",
    shareWhatsApp: "Share",
    shareFacebook: "Share",
    shareLine: "Share",
    save: "Copy Text",
    downloadPdf: "Download PDF",
    downloading: "Generating…",
    saveWatchlist: "Save",
    explore: "Go to AI Mark6 Probability Game Now",
  },
  "zh-TW": {
    pickAnother: "選擇其他股票",
    print: "列印",
    share: "分享",
    shareWhatsApp: "分享",
    shareFacebook: "分享",
    shareLine: "分享",
    save: "複製文字",
    downloadPdf: "下載 PDF",
    downloading: "生成中…",
    saveWatchlist: "儲存",
    explore: "立即前往 AI Mark6 概率遊戲",
  },
  "zh-CN": {
    pickAnother: "选择其他股票",
    print: "打印",
    share: "分享",
    shareWhatsApp: "分享",
    shareFacebook: "分享",
    shareLine: "分享",
    save: "复制文字",
    downloadPdf: "下载 PDF",
    downloading: "生成中…",
    saveWatchlist: "保存",
    explore: "立即前往 AI Mark6 概率游戏",
  },
};

const marketLabels: Record<string, Record<LangKey, string>> = {
  us: { en: "US Market", "zh-TW": "美國市場", "zh-CN": "美国市场" },
  hk: { en: "Hong Kong Market", "zh-TW": "香港市場", "zh-CN": "香港市场" },
  tw: { en: "Taiwan Market", "zh-TW": "台灣市場", "zh-CN": "台湾市场" },
};

interface Props {
  lang: LangKey;
  ticker: string;
  market?: string;
  onReset: () => void;
  inWatchlist?: boolean;
  onAddWatchlist?: () => void;
  voiceText?: string;
  companyName?: string;
  price?: string;
  priceChange?: string;
  probability?: number;
  recommendation?: string;
  rsi?: number;
  rsiStatus?: string;
}

const ReportActionBar = ({ 
  lang, 
  ticker, 
  market = "us", 
  onReset, 
  inWatchlist, 
  onAddWatchlist,
  voiceText = '',
  companyName = '',
  price = '',
  priceChange = '',
  probability = 0,
  recommendation = '',
  rsi = 0,
  rsiStatus = '',
}: Props) => {
  const normalizedLang = ((): LangKey => {
    if (lang === 'en' || lang === 'zh-TW' || lang === 'zh-CN') return lang;
    if (lang === 'tc' || lang === 'tw' || lang === 'zh' || lang === 'zh_TW' || lang === 'zh_HK' || lang === 'zh-HK') return 'zh-TW';
    if (lang === 'sc' || lang === 'cn' || lang === 'zh_CN') return 'zh-CN';
    return 'en';
  })();

  const t = labels[normalizedLang] || labels.en;
  const mktLabel = marketLabels[market]?.[normalizedLang] ?? marketLabels.us[normalizedLang] ?? marketLabels.us.en;
  const [pdfLoading, setPdfLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handlePrint = () => window.print();

  const generateShareText = (): string => {
    const isChinese = normalizedLang === 'zh-TW' || normalizedLang === 'zh-CN';
    const isTraditional = normalizedLang === 'zh-TW';
    
    const getChineseTextLocal = (traditional: string, simplified: string) => {
      return isTraditional ? traditional : simplified;
    };

    const analysisText = voiceText || '';

    const parts: string[] = [];

    parts.push(isChinese 
      ? `📊 ${getChineseTextLocal('今日關注', '今日关注')}：${companyName || ticker} (${ticker})` 
      : `📊 Stock Watch: ${companyName || ticker} (${ticker})`);

    const changeDisplay = priceChange || '0.00%';
    parts.push(isChinese 
      ? `💰 ${getChineseTextLocal('股價', '股价')} ${price} (${changeDisplay})` 
      : `💰 Price ${price} (${changeDisplay})`);

    if (rsi) {
      let rsiStatusTranslated = rsiStatus;
      if (isChinese) {
        const statusMap: Record<string, string> = {
          'Overbought': getChineseTextLocal('超買', '超买'),
          'Oversold': getChineseTextLocal('超賣', '超卖'),
          'Neutral': getChineseTextLocal('中性', '中性'),
        };
        rsiStatusTranslated = statusMap[rsiStatus] || rsiStatus;
      }
      parts.push(isChinese 
        ? `📈 RSI(14) ${rsi.toFixed(1)} (${rsiStatusTranslated})` 
        : `📈 RSI(14) ${rsi.toFixed(1)} (${rsiStatus})`);
    }

    if (probability) {
      parts.push(isChinese 
        ? `🎯 AI ${getChineseTextLocal('預測概率', '预测概率')} ${probability}%` 
        : `🎯 AI Probability ${probability}%`);
    }

    let recommendationTranslated = recommendation;
    if (isChinese) {
      const recMap: Record<string, string> = {
        'Buy': getChineseTextLocal('買入', '买入'),
        'Hold': getChineseTextLocal('持有', '持有'),
        'Sell': getChineseTextLocal('賣出', '卖出'),
        'Strong Buy': getChineseTextLocal('強烈買入', '强烈买入'),
        'Strong Sell': getChineseTextLocal('強烈賣出', '强烈卖出'),
      };
      recommendationTranslated = recMap[recommendation] || recommendation;
    }
    parts.push(isChinese 
      ? `💡 AI ${getChineseTextLocal('建議', '建议')} ${recommendationTranslated}` 
      : `💡 AI Recommendation ${recommendation}`);

    if (analysisText) {
      parts.push('');
      parts.push(isChinese ? '📝 完整分析：' : '📝 Full Analysis:');
      parts.push(analysisText);
    }

    parts.push('');
    parts.push(isChinese 
      ? `⚡ 由 DragonGPAI.com 提供 AI 分析` 
      : `⚡ Powered by DragonGPAI.com`);
    
    parts.push(isChinese 
      ? `🔗 了解更多：https://www.dragongpai.com/ai-stocks?symbol=${ticker}` 
      : `🔗 Learn more: https://www.dragongpai.com/ai-stocks?symbol=${ticker}`);
    parts.push(isChinese 
      ? `📋 免責聲明：此分析僅供參考，不構成投資建議。股票選擇遵循自主決策原則。` 
      : `📋 Disclaimer: This analysis is for reference only, not investment advice. Stock selection follows the principle of self-decision.`);

    return parts.join('\n');
  };

  // ── Share Handlers ──
  
  // WhatsApp Share
  const handleWhatsAppShare = () => {
    const shareText = generateShareText();
    const encodedText = encodeURIComponent(shareText);
    const waUrl = `https://wa.me/?text=${encodedText}`;
    window.open(waUrl, "_blank");
  };

  // Line Share
  const handleLineShare = () => {
    const shareText = generateShareText();
    const encodedText = encodeURIComponent(shareText);
    
    const lineUrl = `https://line.me/R/share?text=${encodedText}`;
    const lineAppUrl = `line://msg/text/${encodedText}`;
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      const lineAppWindow = window.open(lineAppUrl, '_blank');
      if (!lineAppWindow) {
        window.open(lineUrl, '_blank');
      }
    } else {
      window.open(lineUrl, '_blank');
    }
  };

  // Facebook Share
  const handleFacebookShare = () => {
    const shareText = generateShareText();
    const encodedUrl = encodeURIComponent(window.location.href);
    
    // Copy text to clipboard first
    navigator.clipboard.writeText(shareText).then(() => {
      setIsCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setIsCopied(false), 3000);
      
      // Then open Facebook
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      window.open(fbUrl, '_blank');
    }).catch(() => {
      // If clipboard fails, just open Facebook
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      window.open(fbUrl, '_blank');
    });
  };

  // Copy Text (replaces Save as Text)
  const handleCopyText = () => {
    const shareText = generateShareText();
    navigator.clipboard.writeText(shareText).then(() => {
      setIsCopied(true);
      toast.success('✅ Report copied to clipboard!');
      setTimeout(() => setIsCopied(false), 3000);
    }).catch(() => {
      // Fallback: copy using textarea
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setIsCopied(true);
      toast.success('✅ Report copied to clipboard!');
      setTimeout(() => setIsCopied(false), 3000);
    });
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

      const noPrintEls = el.querySelectorAll<HTMLElement>(".no-print");
      noPrintEls.forEach((e) => (e.style.display = "none"));

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      noPrintEls.forEach((e) => (e.style.display = ""));

      const A4_W = 210;
      const A4_H = 297;
      const MARGIN_H = 15;
      const MARGIN_TOP = 22;
      const MARGIN_BOTTOM = 20;
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

        pdf.setFontSize(7);
        pdf.setTextColor(148, 163, 184);
        pdf.text("DragonGP AI — Institutional Research Report", MARGIN_H, 10);
        pdf.text(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), A4_W - MARGIN_H, 10, { align: "right" });
        pdf.setDrawColor(225, 231, 239);
        pdf.setLineWidth(0.3);
        pdf.line(MARGIN_H, 13, A4_W - MARGIN_H, 13);

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

        const footerY = A4_H - 10;
        pdf.setFontSize(6.5);
        pdf.setTextColor(148, 163, 184);
        pdf.text("CONFIDENTIAL — For Intended Recipient Only  |  This report does not constitute financial advice.", MARGIN_H, footerY);
        pdf.setFontSize(7);
        pdf.setTextColor(30, 41, 59);
        pdf.text(`Page ${page + 1} of ${totalPages}`, A4_W - MARGIN_H, footerY, { align: "right" });

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
        
        {/* WhatsApp Share Button */}
        <button onClick={handleWhatsAppShare} className={`${btnBase} bg-[#25D366] text-white hover:bg-[#20BD5A]`}>
          <MessageCircle size={16} /> {t.shareWhatsApp}
        </button>
        
        {/* Line Share Button */}
        <button onClick={handleLineShare} className={`${btnBase} bg-[#06C755] text-white hover:bg-[#05a848]`}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="shrink-0">
            <path d="M12 2C6.48 2 2 6.04 2 10.98c0 2.73 1.37 5.15 3.52 6.75.13.09.21.23.19.38l-.5 1.78c-.04.14.09.27.23.19l2.03-1.19c.12-.07.27-.07.39-.01.93.3 1.93.46 2.99.46 5.52 0 10-4.04 10-9 0-5.36-4.48-9-10-9z"/>
          </svg>
          {t.shareLine}
        </button>
        
        {/* Facebook Share Button */}
        <button onClick={handleFacebookShare} className={`${btnBase} bg-[#1877F2] text-white hover:bg-[#166FE5]`}>
          <Facebook size={16} /> {t.shareFacebook}
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Copy Text Button (replaces Save as Text) */}
        <button 
          onClick={handleCopyText}
          className={`${btnBase} ${isCopied ? 'bg-green-600 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}
        >
          {isCopied ? <Check size={16} /> : <Copy size={16} />}
          {isCopied ? 'Copied!' : t.save}
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