import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, DollarSign } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import type { CurrencyCode } from '../../types';

const currencies: { code: CurrencyCode; symbol: string; name: string }[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
];

export default function CurrencySwitcher() {
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white transition-colors"
      >
        <DollarSign className="w-4 h-4" />
        <span className="text-sm font-medium">{currentCurrency.code}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => handleSelect(c.code)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                currency === c.code
                  ? 'bg-[hsl(var(--exsify-primary))] text-white'
                  : 'text-gray-700 hover:bg-[hsl(var(--exsify-primary))]/10 hover:text-[hsl(var(--exsify-primary))]'
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
