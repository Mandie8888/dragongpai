// src/components/voice/ReadAloudButton.tsx
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import { speakText, stopSpeaking } from "@/services/voiceService";

interface ReadAloudButtonProps {
  text: string;
  className?: string;
  lang?: string;
}

export function ReadAloudButton({ text, className = "", lang = "en-US" }: ReadAloudButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        stopSpeaking();
      }
    };
  }, [isSpeaking]);

  const handleReadAloud = () => {
    if (!text) return;

    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    speakText(text, lang as 'en-US' | 'zh-HK' | 'zh-CN');
    
    // Check when speech ends
    const checkSpeechEnd = setInterval(() => {
      if (!window.speechSynthesis || !window.speechSynthesis.speaking) {
        setIsSpeaking(false);
        clearInterval(checkSpeechEnd);
      }
    }, 500);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={`h-10 w-10 ${className}`}
      onClick={handleReadAloud}
      disabled={!text}
      title={isSpeaking ? "Stop speaking" : "Read aloud"}
    >
      <Volume2 className={`h-4 w-4 ${isSpeaking ? "text-primary animate-pulse" : ""}`} />
    </Button>
  );
}