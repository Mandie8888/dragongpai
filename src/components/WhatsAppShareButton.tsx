// src/components/WhatsAppShareButton.tsx
import { Button } from "@/components/ui/button";

interface WhatsAppShareButtonProps {
  message?: string;
  url?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function WhatsAppShareButton({ 
  message, 
  url, 
  className = "",
  size = "default"
}: WhatsAppShareButtonProps) {
  const shareUrl = url || window.location.href;
  const shareMessage = message || "Check out this AI Stock Analysis from DragonGp.Ai!";

  const handleShare = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage + " " + shareUrl)}`;
    window.open(waUrl, '_blank');
  };

  const sizeClasses = {
    sm: "h-7 px-2 text-[9px]",
    default: "h-9 px-3 text-sm",
    lg: "h-11 px-4 text-base",
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      className={`flex items-center gap-1 ${sizeClasses[size]} ${className}`}
      style={{ borderColor: "#25D366", color: "#25D366" }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
      <span className="hidden sm:inline">WhatsApp</span>
    </Button>
  );
}