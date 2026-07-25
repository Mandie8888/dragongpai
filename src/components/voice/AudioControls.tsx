// src/components/voice/AudioControls.tsx
import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";
import { useState, useEffect } from "react";
import { speakText, stopSpeaking } from "@/services/voiceService";

interface AudioControlsProps {
  text: string;
  className?: string;
  lang?: string;
}

export function AudioControls({ text, className = "", lang = "en-US" }: AudioControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handlePlay = () => {
    if (!text) return;

    // Cancel any ongoing speech
    stopSpeaking();
    
    setIsPlaying(true);
    setIsPaused(false);
    speakText(text, lang as 'en-US' | 'zh-HK' | 'zh-CN');
    
    // Check when speech ends
    const checkSpeechEnd = setInterval(() => {
      if (!window.speechSynthesis || !window.speechSynthesis.speaking) {
        setIsPlaying(false);
        setIsPaused(false);
        clearInterval(checkSpeechEnd);
      }
    }, 500);
  };

  const handlePause = () => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    stopSpeaking();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!text) return null;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {!isPlaying ? (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handlePlay}
          title="Play audio"
        >
          <Play className="h-3 w-3" />
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handlePause}
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleStop}
            title="Stop"
          >
            <Square className="h-3 w-3" />
          </Button>
        </>
      )}
    </div>
  );
}