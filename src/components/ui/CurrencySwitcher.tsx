import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, DollarSign } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import type { CurrencyCode } from '../../types';

const currencies: { code: CurrencyCode; symbol: string; name: string }[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'EGP', symbol: 'ج.م', name: 'Egyptian Pound' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
];

interface CurrencySwitcherProps {
  variant?: 'navbar' | 'menu';
}

export default function CurrencySwitcher({ variant = 'navbar' }: CurrencySwitcherProps) {
  const { currency, setCurrency } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCurrency = currencies.find(c => c.code === currency) || currencies[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
  };

  const isNavbar = variant === 'navbar';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 transition-colors ${
          isNavbar
            ? 'text-white/80 hover:text-white'
            : 'text-gray-700 dark:text-gray-200 hover:text-[hsl(var(--exsify-primary))] dark:hover:text-white'
        }`}
      >
        <DollarSign className="w-4 h-4" />
        <span className="text-sm font-medium">{currentCurrency.code}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => handleSelect(c.code)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                currency === c.code
                  ? 'bg-[hsl(var(--exsify-primary))] text-white'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-[hsl(var(--exsify-primary))]/10 hover:text-[hsl(var(--exsify-primary))]'
              }`}
            >
              <span>{c.code}</span>
              <span className="text-xs opacity-70">{c.symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
