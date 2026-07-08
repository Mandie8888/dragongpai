import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}

const EmptyState = ({ icon, title, subtitle, ctaLabel, ctaHref, onCtaClick }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    {/* Glow ring */}
    <div className="relative mb-6">
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-150" />
      <div className="relative w-20 h-20 rounded-full border-2 border-primary/40 bg-card flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.15)]">
        {icon ?? <Sparkles size={32} className="text-primary" />}
      </div>
    </div>

    <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">{subtitle}</p>

    {ctaLabel && ctaHref && (
      <Link
        to={ctaHref}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-amber-500 px-7 py-3 text-sm font-bold text-primary-foreground hover:from-primary/90 hover:to-amber-400 transition-all shadow-lg shadow-primary/20"
      >
        <Sparkles size={14} />
        {ctaLabel}
      </Link>
    )}

    {ctaLabel && onCtaClick && !ctaHref && (
      <button
        onClick={onCtaClick}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-amber-500 px-7 py-3 text-sm font-bold text-primary-foreground hover:from-primary/90 hover:to-amber-400 transition-all shadow-lg shadow-primary/20"
      >
        <Sparkles size={14} />
        {ctaLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
