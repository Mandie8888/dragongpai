// src/hooks/useSpeech.ts
import { useState, useCallback, useRef, useEffect } from 'react';

interface UseSpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

export const useSpeech = (options: UseSpeechOptions = {}) => {
  const {
    lang = 'zh-HK',
    rate = 0.9,
    pitch = 1,
    volume = 1,
    onStart,
    onEnd,
    onError,
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const queueRef = useRef<string[]>([]);
  const isProcessingQueue = useRef(false);

  // Check if speech synthesis is supported
  const isSupported = typeof window !== 'undefined' && !!window.speechSynthesis;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        try {
          window.speechSynthesis?.cancel();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [isSpeaking]);

  const processQueue = useCallback(() => {
    if (queueRef.current.length === 0) {
      isProcessingQueue.current = false;
      setIsSpeaking(false);
      return;
    }

    isProcessingQueue.current = true;
    const text = queueRef.current.shift();
    if (!text) {
      processQueue();
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        onStart?.();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        onEnd?.();
        // Process next item in queue after a delay
        setTimeout(() => {
          processQueue();
        }, 300);
      };

      utterance.onerror = (event) => {
        // Ignore 'interrupted' and 'canceled' errors as they are normal
        if (event.error === 'interrupted' || event.error === 'canceled') {
          console.debug('Speech was interrupted or canceled');
        } else {
          console.warn('Speech error:', event);
          onError?.(new Error(event.error));
        }
        setIsSpeaking(false);
        setIsPaused(false);
        // Don't stop queue on error, just move to next
        setTimeout(() => {
          processQueue();
        }, 300);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn('Speech synthesis error:', error);
      setIsSpeaking(false);
      setIsPaused(false);
      // Continue with queue
      setTimeout(() => {
        processQueue();
      }, 300);
    }
  }, [lang, rate, pitch, volume, onStart, onEnd, onError]);

  const speak = useCallback((text: string, immediate = true) => {
    if (!isSupported) {
      onError?.(new Error('Speech synthesis not supported'));
      return;
    }

    if (!text || text.trim().length === 0) {
      return;
    }

    // Cancel current speech if immediate
    if (immediate) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // Ignore cancel errors
      }
      queueRef.current = [];
      isProcessingQueue.current = false;
    }

    // Add to queue
    queueRef.current.push(text);

    // If not already processing, start processing queue
    if (!isProcessingQueue.current) {
      processQueue();
    }
  }, [isSupported, onError, processQueue]);

  const pause = useCallback(() => {
    if (isSupported && window.speechSynthesis.speaking) {
      try {
        window.speechSynthesis.pause();
        setIsPaused(true);
      } catch (e) {
        console.debug('Pause error:', e);
      }
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (isSupported && window.speechSynthesis.paused) {
      try {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } catch (e) {
        console.debug('Resume error:', e);
      }
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.debug('Stop error:', e);
      }
      queueRef.current = [];
      isProcessingQueue.current = false;
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    }
  }, [isSupported]);

  const togglePause = useCallback(() => {
    if (isPaused) {
      resume();
    } else if (isSpeaking) {
      pause();
    }
  }, [isPaused, isSpeaking, pause, resume]);

  return {
    speak,
    pause,
    resume,
    stop,
    togglePause,
    isSpeaking,
    isPaused,
    isSupported,
    hasUtterance: !!utteranceRef.current,
  };
};