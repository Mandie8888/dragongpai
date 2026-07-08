import { useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const labels = {
  en: {
    heading: "Rate Your Experience",
    question: "How would you rate your experience?",
    stars: ["Poor", "Fair", "Good", "Very Good", "Excellent"],
    placeholder: "Your Comments (optional)",
    submit: "Submit Feedback",
    thanks:
      'Thank you for your feedback! Your rating and comments help our "Mental Gym" grow.',
  },
  tc: {
    heading: "評價您的體驗",
    question: "您對本次體驗的評分？",
    stars: ["極差", "尚可", "良好", "很好", "極佳"],
    placeholder: "您的意見（選填）",
    submit: "提交回饋",
    thanks: "感謝您的回饋！您的評分與建議將助我們的「心靈體操」不斷成長。",
  },
  sc: {
    heading: "评价您的体验",
    question: "您对本次体验的评分？",
    stars: ["极差", "尚可", "良好", "很好", "极佳"],
    placeholder: "您的意见（选填）",
    submit: "提交反馈",
    thanks: "感谢您的反馈！您的评分与建议将助我们的「心灵体操」不断成长。",
  },
};

const FeedbackWidget = () => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const t = labels[lang];

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0 || submitting) return;
    if (!user) return;
    setSubmitting(true);
    try {
      await supabase.from("marketing_feedback").insert({
        rating,
        comment: comment.trim() || null,
        language: lang,
        user_id: user?.id ?? null,
      });
      setSubmitted(true);
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8 px-4 space-y-2">
        <div className="flex justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={20}
              className="fill-primary text-primary animate-pulse"
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {t.thanks}
        </p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 space-y-4 max-w-md mx-auto text-center">
      <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70">
        {t.heading}
      </h3>
      <p className="text-xs text-muted-foreground">{t.question}</p>

      {/* Star rating */}
      <div className="flex justify-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="group relative p-1 transition-transform hover:scale-110"
            aria-label={t.stars[star - 1]}
          >
            <Star
              size={28}
              className={`transition-colors duration-200 ${
                star <= (hover || rating)
                  ? "fill-primary text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.6)]"
                  : "text-muted-foreground/40 hover:text-muted-foreground"
              }`}
            />
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {t.stars[star - 1]}
            </span>
          </button>
        ))}
      </div>

      {/* Comment box */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, 500))}
        placeholder={t.placeholder}
        rows={2}
        className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
      />

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={rating === 0 || submitting}
        className="rounded-full bg-primary/20 border border-primary/40 px-6 py-2 text-xs font-semibold text-primary hover:bg-primary/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t.submit}
      </button>
    </div>
  );
};

export default FeedbackWidget;
