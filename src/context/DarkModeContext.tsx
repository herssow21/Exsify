import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface DarkModeContextType {
  isDark: boolean;
  toggle: () => void;
  setDark: (value: boolean) => void;
}

const STORAGE_KEY = 'exsify_dark_mode';
const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setIsDark(stored === 'true');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, String(isDark));
  }, [isDark, mounted]);

  const toggle = () => setIsDark(prev => !prev);
  const setDark = (value: boolean) => setIsDark(value);

  return (
    <DarkModeContext.Provider value={{ isDark, toggle, setDark }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const ctx = useContext(DarkModeContext);
  if (!ctx) throw new Error('useDarkMode must be used within a DarkModeProvider');
  return ctx;
}
