import { useSpeech } from './useSpeech';

interface Mark6SpeechOptions {
  lang: string;
}

export const useMark6Speech = (options: Mark6SpeechOptions) => {
  const { lang } = options;
  const { speak, isSpeaking, stop, isSupported } = useSpeech({ lang });

  // Simple speak function
  const speakSimple = (text: string) => {
    if (!text || text.trim().length === 0) return;
    speak(text);
  };

  // Welcome message for Mark6 Game
  const speakWelcome = (gameType: 'hk' | 'tw') => {
    const gameName = gameType === 'tw' ? '台灣大樂透' : '香港六合彩';
    
    const messages: Record<string, string> = {
      'en': `Welcome to ${gameName}. Select your AI partner.`,
      'zh-HK': `歡迎到${gameName}。選AI夥伴。`,
      'zh-CN': `欢迎到${gameName}。选AI伙伴。`,
    };
    
    const message = messages[lang] || messages['en'];
    speakSimple(message);
  };

  // Partner introduction - ONLY METHOD NAME
  const speakPartnerIntro = (partnerId: string) => {
    const methodNames: Record<string, Record<string, string>> = {
      'en': {
        'elon': 'Banker and Leg Strategy',
        'god-of-gambling': 'Chaos Theory',
        'lucky-star': 'Monte Carlo Simulation',
        'achelois': 'Neural Network Entropy',
        'aladdin': 'Quantum Spooky Sync',
      },
      'zh-HK': {
        'elon': '膽拖策略',
        'god-of-gambling': '混沌理論',
        'lucky-star': '蒙特卡羅模擬',
        'achelois': '神經網絡熵值',
        'aladdin': '量子幽靈同步',
      },
      'zh-CN': {
        'elon': '胆拖策略',
        'god-of-gambling': '混沌理论',
        'lucky-star': '蒙特卡罗模拟',
        'achelois': '神经网络熵值',
        'aladdin': '量子幽灵同步',
      },
    };
    
    const langMessages = methodNames[lang] || methodNames['en'];
    const message = langMessages[partnerId] || 'Analysis Result';
    speakSimple(message);
  };

  const getPartnerMethod = (partnerId: string, language: string): string => {
    const isChinese = language === 'zh-TW' || language === 'zh-CN';
    
    const methods: Record<string, { en: string; zh: string }> = {
      'elon': { en: 'Banker & Leg Strategy', zh: '膽拖策略' },
      'god-of-gambling': { en: 'Chaos Theory', zh: '混沌理論' },
      'lucky-star': { en: 'Monte Carlo Simulation', zh: '蒙特卡羅模擬' },
      'achelois': { en: 'Neural Network Entropy', zh: '神經網絡熵值' },
      'aladdin': { en: 'Quantum Spooky Sync', zh: '量子幽靈同步' },
    };
    
    const method = methods[partnerId] || methods['elon'];
    return isChinese ? method.zh : method.en;
  };

  const getPartnerName = (partnerId: string, language: string): string => {
    const isChinese = language === 'zh-TW' || language === 'zh-CN';
    
    const names: Record<string, { en: string; zh: string }> = {
      'elon': { en: 'Elon', zh: '馬神' },
      'god-of-gambling': { en: 'God of Gambling', zh: '賭神' },
      'lucky-star': { en: 'Lucky Star', zh: '幸運星' },
      'achelois': { en: 'Achelois', zh: '月光女神' },
      'aladdin': { en: 'Aladdin', zh: '阿拉丁' },
    };
    
    const name = names[partnerId] || names['elon'];
    return isChinese ? name.zh : name.en;
  };

  const speakFullReport = (partnerId: string) => {
    speakPartnerIntro(partnerId);
  };

  return {
    speakWelcome,
    speakPartnerIntro,
    speakPredictionSummary: () => {},
    speakFullReport,
    getPartnerMethod,
    getPartnerName,
    isSpeaking,
    stop,
    isSupported,
  };
};