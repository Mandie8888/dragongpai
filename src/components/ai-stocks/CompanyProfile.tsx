import { Building2 } from "lucide-react";
import type { LangKey } from "@/contexts/LanguageContext";

const t = {
  en: {
    title: "Company Profile",
    about: "About",
    noDescription: "Company description not available for this ticker.",
  },
  tc: {
    title: "公司簡介",
    about: "關於",
    noDescription: "此股票代碼暫無公司簡介。",
  },
  sc: {
    title: "公司简介",
    about: "关于",
    noDescription: "此股票代码暂无公司简介。",
  },
};

interface Props {
  lang: LangKey;
  companyName: string;
  description: string;
  sector: string;
  industry: string;
}

const CompanyProfile = ({ lang, companyName, description, sector, industry }: Props) => {
  const l = t[lang];

  return (
    <div className="py-5" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
      <h3
        className="text-[15px] font-bold tracking-wide uppercase pb-2 mb-3"
        style={{
          fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
          color: "#1e293b",
          borderBottom: "2px solid #1e293b",
        }}
      >
        {l.title}
      </h3>

      <div className="p-4 rounded" style={{ border: "1px solid #e5e7eb", background: "#f8fafc" }}>
        <div className="flex items-center gap-2 mb-3">
          <Building2 size={16} style={{ color: "#1e293b" }} />
          <span className="text-[13px] font-bold" style={{ color: "#1e293b" }}>
            {l.about} {companyName}
          </span>
        </div>

        {description ? (
          <p className="text-[11px] leading-relaxed" style={{ color: "#475569" }}>
            {description}
          </p>
        ) : (
          <p className="text-[11px] italic" style={{ color: "#94a3b8" }}>
            {l.noDescription}
          </p>
        )}

        {(sector || industry) && (
          <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: "1px dashed #d1d5db" }}>
            {sector && (
              <span className="text-[9px] px-2 py-0.5 rounded" style={{ background: "#e2e8f0", color: "#475569", fontWeight: 600 }}>
                {sector}
              </span>
            )}
            {industry && (
              <span className="text-[9px] px-2 py-0.5 rounded" style={{ background: "#e2e8f0", color: "#475569", fontWeight: 600 }}>
                {industry}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
