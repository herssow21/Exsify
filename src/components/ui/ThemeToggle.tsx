import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../../context/DarkModeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md';
}

export default function ThemeToggle({ className = '', size = 'md' }: ThemeToggleProps) {
  const { isDark, toggle } = useDarkMode();
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const buttonSize = size === 'sm' ? 'w-9 h-9' : 'w-11 h-11';

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`
        ${buttonSize} rounded-full flex items-center justify-center
        bg-white dark:bg-[#1E293B] text-[hsl(var(--exsify-primary))] dark:text-[hsl(var(--exsify-accent))]
        border border-gray-200 dark:border-white/10 shadow-md hover:shadow-lg
        transition-all duration-200 hover:scale-105
        ${className}
      `}
    >
      {isDark ? (
        <Sun className={`${iconSize}`} />
      ) : (
        <Moon className={`${iconSize}`} />
      )}
    </button>
  );
}
