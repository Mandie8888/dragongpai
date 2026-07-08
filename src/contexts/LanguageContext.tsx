import { createContext, useContext, useState, ReactNode } from "react";

export type LangKey = "en" | "tc" | "sc";

interface LanguageContextType {
  lang: LangKey;
  setLang: (lang: LangKey) => void;
}

const LanguageContext = createContext<LanguageContextType>({ lang: "en", setLang: () => {} });

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<LangKey>("en");
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};
