/**
 * Currency conversion utilities
 */

import type { CurrencyCode } from '@/types';

// Exchange rates (base: 1 USD)
export const exchangeRates: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  SAR: 3.75,
  KES: 145.00,
};

// Currency symbols
export const currencySymbols: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  SAR: '﷼',
  KES: 'KSh',
};

/**
 * Converts a price from USD to target currency
 * @param priceInUSD - Price in USD
 * @param targetCurrency - Target currency code
 * @returns Converted price
 */
export function convertPrice(priceInUSD: number, targetCurrency: CurrencyCode): number {
  return priceInUSD * exchangeRates[targetCurrency];
}

/**
 * Formats a price with proper currency symbol and formatting
 * @param priceInUSD - Price in USD
 * @param currency - Currency code
 * @returns Formatted price string
 */
export function formatPrice(priceInUSD: number, currency: CurrencyCode): string {
  const converted = convertPrice(priceInUSD, currency);
  
  const formatters: Record<CurrencyCode, Intl.NumberFormat> = {
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
    SAR: new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }),
    KES: new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }),
  };
  
  return formatters[currency].format(converted);
}

/**
 * Formats a price in compact notation (e.g., $1.2K, $1.5M)
 * @param priceInUSD - Price in USD
 * @param currency - Currency code
 * @returns Compact formatted price string
 */
export function formatPriceCompact(priceInUSD: number, currency: CurrencyCode): string {
  const converted = convertPrice(priceInUSD, currency);
  const symbol = currencySymbols[currency];
  
  if (converted >= 1000000) {
    return `${symbol}${(converted / 1000000).toFixed(1)}M`;
  }
  if (converted >= 1000) {
    return `${symbol}${(converted / 1000).toFixed(1)}K`;
  }
  return `${symbol}${converted.toFixed(0)}`;
}

/**
 * Gets the currency symbol for a currency code
 * @param currency - Currency code
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency: CurrencyCode): string {
  return currencySymbols[currency];
}

/**
 * Formats a number with commas (e.g., 15,420)
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}
