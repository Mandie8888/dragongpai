// src/components/FacebookShareButton.tsx
import { Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FacebookShareButtonProps {
  url?: string;
  quote?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function FacebookShareButton({ 
  url, 
  quote, 
  className = "",
  size = "default"
}: FacebookShareButtonProps) {
  const shareUrl = url || window.location.href;
  const shareText = quote || "Check out this AI Stock Analysis from DragonGp.Ai!";

  const handleShare = () => {
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(fbShareUrl, '_blank', 'width=600,height=400');
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
      style={{ borderColor: "#1877f2", color: "#1877f2" }}
    >
      <Facebook className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Facebook</span>
    </Button>
  );
}