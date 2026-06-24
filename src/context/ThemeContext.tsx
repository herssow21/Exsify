import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  accent: string;
  accentDark: string;
  dark: string;
  darkLighter: string;
  success: string;
  error: string;
  warning: string;
}

// ── Default hex colors (for color inputs) ──
const DEFAULT_HEX: ThemeColors = {
  primary: '#3A6B9B',
  primaryDark: '#2B5A8A',
  accent: '#F8C463',
  accentDark: '#D4A13F',
  dark: '#1E293B',
  darkLighter: '#334155',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
};

const STORAGE_KEY = 'exsify_theme_hex';

// ── HSL variable names mapping ──
const VAR_MAP: Record<keyof ThemeColors, string> = {
  primary: '--exsify-primary',
  primaryDark: '--exsify-primary-dark',
  accent: '--exsify-accent',
  accentDark: '--exsify-accent-dark',
  dark: '--exsify-dark',
  darkLighter: '--exsify-dark-lighter',
  success: '--exsify-success',
  error: '--exsify-error',
  warning: '--exsify-warning',
};

interface ThemeContextType {
  colors: ThemeColors;
  updateColor: (key: keyof ThemeColors, value: string) => void;
  resetTheme: () => void;
  isLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ── Convert Hex → HSL (for CSS variables) ──
function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// ── Apply theme colors to CSS variables ──
function applyThemeToRoot(theme: ThemeColors) {
  const root = document.documentElement;
  (Object.entries(VAR_MAP) as [keyof ThemeColors, string][]).forEach(([key, varName]) => {
    root.style.setProperty(varName, hexToHsl(theme[key]));
  });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<ThemeColors>(DEFAULT_HEX);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let initial = DEFAULT_HEX;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate it's a hex color before applying
        const isValidHex = (v: unknown) => typeof v === 'string' && /^#[0-9A-Fa-f]{6}$/.test(v);
        const merged: ThemeColors = { ...DEFAULT_HEX };
        (Object.keys(DEFAULT_HEX) as Array<keyof ThemeColors>).forEach(k => {
          if (isValidHex(parsed[k])) merged[k] = parsed[k];
        });
        initial = merged;
      }
    } catch { /* ignore corrupt storage */ }

    setColors(initial);
    applyThemeToRoot(initial);
    setIsLoaded(true);
  }, []);

  const updateColor = useCallback((key: keyof ThemeColors, value: string) => {
    setColors(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      applyThemeToRoot(next);
      return next;
    });
  }, []);

  const resetTheme = useCallback(() => {
    setColors(DEFAULT_HEX);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_HEX));
    applyThemeToRoot(DEFAULT_HEX);
  }, []);

  return (
    <ThemeContext.Provider value={{ colors, updateColor, resetTheme, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}
