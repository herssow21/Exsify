import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { CurrencyCode } from '../types';

interface SettingsContextType {
  language: string;
  currency: CurrencyCode;
  isRTL: boolean;
  setLanguage: (lang: string) => void;
  setCurrency: (currency: CurrencyCode) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState('en');
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem('exsify_language') || 'en';
    const storedCurrency = localStorage.getItem('exsify_currency') as CurrencyCode || 'USD';
    
    setLanguageState(storedLang);
    setCurrencyState(storedCurrency);
    setIsRTL(storedLang === 'ar');
    
    i18n.changeLanguage(storedLang);
    document.documentElement.dir = storedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = storedLang;
  }, [i18n]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    setIsRTL(lang === 'ar');
    localStorage.setItem('exsify_language', lang);
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('exsify_currency', newCurrency);
  };

  return (
    <SettingsContext.Provider
      value={{
        language,
        currency,
        isRTL,
        setLanguage,
        setCurrency
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
