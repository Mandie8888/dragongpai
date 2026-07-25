// src/services/voiceService.ts

// Check if browser supports speech recognition
export const isSpeechRecognitionSupported = (): boolean => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

// Get the SpeechRecognition constructor
export const getSpeechRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  return SpeechRecognition;
};

// Text-to-Speech function with proper language support
export const speakText = (text: string, language: 'en-US' | 'zh-HK' | 'zh-CN' = 'en-US'): void => {
  if (!window.speechSynthesis) {
    console.warn('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set language
  utterance.lang = language;
  
  // Get available voices
  const voices = window.speechSynthesis.getVoices();
  
  // Try to find the best voice for the language
  let selectedVoice = null;
  
  if (language === 'zh-HK') {
    // Try Cantonese voices
    selectedVoice = voices.find(v => v.lang.includes('zh-HK') || v.lang.includes('yue'));
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.includes('zh'));
    }
  } else if (language === 'zh-CN') {
    // Try Mandarin voices
    selectedVoice = voices.find(v => v.lang.includes('zh-CN') || v.lang.includes('cmn'));
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.includes('zh'));
    }
  } else {
    // English
    selectedVoice = voices.find(v => v.lang.includes('en-US') && v.name.includes('Google'));
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.includes('en-US'));
    }
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.includes('en'));
    }
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  // Adjust speech parameters
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  window.speechSynthesis.speak(utterance);
};

// Stop speech
export const stopSpeaking = (): void => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

// Parse analysis into sections for better TTS
export const parseAnalysisForSpeech = (text: string): string[] => {
  const sections = [];
  const lines = text.split('\n');
  let currentSection = '';
  
  const sectionHeaders = [
    'Investment Analysis', 'Summary', 'Technical Analysis', 
    'Fundamental Analysis', 'News & Risk Analysis', 
    'Bullish Factors', 'Bearish Factors', 'Trading Advice',
    'Final Recommendation & Risk Rating',
    '投資分析', '摘要', '技術分析', '基本面分析', 
    '新聞與風險分析', '看好因素', '看淡因素', '買賣建議', 
    '最終建議及風險評級'
  ];
  
  for (const line of lines) {
    const isHeader = sectionHeaders.some(header => line.includes(header));
    
    if (isHeader && currentSection) {
      sections.push(currentSection.trim());
      currentSection = '';
    }
    
    if (line.trim()) {
      currentSection += (currentSection ? '\n' : '') + line;
    }
  }
  
  if (currentSection) {
    sections.push(currentSection.trim());
  }
  
  return sections.length > 0 ? sections : [text];
};

// Clean text for speech
export const cleanTextForSpeech = (text: string): string => {
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/[📊📈📉🔥⭐⚠️✅]/g, '')
    .replace(/\d\.\s/g, '')
    .replace(/•/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};