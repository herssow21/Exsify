/**
 * EXSIFY Database Types
 * 
 * This file contains all TypeScript interfaces and types used throughout the application.
 */

export type UserRole = 'admin' | 'customer';
export type CurrencyCode = 'USD' | 'EUR' | 'SAR' | 'KES' | 'AED' | 'EGP' | 'NGN' | 'ZAR';
export type LanguageCode = 'en' | 'ar';
export type AppStatus = 'active' | 'inactive';
export type ConsultationStatus = 'new' | 'contacted' | 'closed';

/**
 * User interface representing a registered user
 */
export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string; // base64 encoded for demo
  role: UserRole;
  country: string;
  currency: CurrencyCode;
  createdAt: string;
  profileImage?: string;
}

/**
 * App interface representing a software product
 */
export interface App {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  shortDescription_en?: string;
  shortDescription_ar?: string;
  features_en: string[];
  features_ar: string[];
  category: string;
  price_usd: number;
  screenshots: string[];
  icon: string;
  downloadCount: number;
  rating: number;
  totalReviews: number;
  reviewCount?: number;
  regionsAvailable: string[];
  status: AppStatus;
  featured: boolean;
  downloadUrl: string;
  tags?: string[];
}

/**
 * Download interface representing a user downloading an app
 */
export interface Download {
  id: string;
  userId: string;
  appId: string;
  downloadedAt: string;
}

/**
 * Consultation interface representing a contact form submission
 */
export interface Consultation {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  company: string;
  serviceInterest: string;
  projectDetails: string;
  budget: string;
  country: string;
  status: ConsultationStatus;
  submittedAt: string;
}

/**
 * Review interface representing a user review
 */
export interface Review {
  id: string;
  userId: string;
  appId?: string;
  userName: string;
  userCompany?: string;
  userCountry: string;
  rating: number;
  text_en: string;
  text_ar: string;
  /** @deprecated Use text_en instead */
  comment_en?: string;
  /** @deprecated Use text_ar instead */
  comment_ar?: string;
  status?: 'published' | 'pending' | 'approved';
  verified: boolean;
  featured: boolean;
  approved: boolean;
  createdAt: string;
}

/**
 * RegionStat interface representing statistics per country
 */
export interface RegionStat {
  country: string;
  countryCode: string;
  userCount: number;
  downloadCount: number;
  activeUsers?: number;
  growth?: number;
}

/**
 * NewsPost interface representing a news article
 */
export interface NewsPost {
  id: string;
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  category: string;
  imageUrl: string;
  publishedAt: string;
  featured: boolean;
}

/**
 * Settings interface representing application settings
 */
export interface Settings {
  defaultCurrency: CurrencyCode;
  maintenanceMode: boolean;
}

/**
 * Main database interface
 */
export interface EXSIFY_DB {
  users: User[];
  apps: App[];
  downloads: Download[];
  consultations: Consultation[];
  reviews: Review[];
  regions: RegionStat[];
  news: NewsPost[];
  settings: Settings;
}

/**
 * Auth context type
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

/**
 * Signup data type
 */
export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  country: string;
  currency: CurrencyCode;
}

/**
 * Settings context type
 */
export interface SettingsContextType {
  language: LanguageCode;
  currency: CurrencyCode;
  setLanguage: (lang: LanguageCode) => void;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (priceInUSD: number) => string;
  convertPrice: (priceInUSD: number) => number;
  t: (key: string, options?: Record<string, unknown>) => string;
  dir: 'ltr' | 'rtl';
}

/**
 * Toast notification type
 */
export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

/**
 * Toast context type
 */
export interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

// Exchange rates (base: 1 USD)
export const exchangeRates: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  SAR: 3.75,
  KES: 145.00,
  AED: 3.67,
  EGP: 49.50,
  NGN: 1550.00,
  ZAR: 18.50,
};

// Currency symbols
export const currencySymbols: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  SAR: '﷼',
  KES: 'KSh',
  AED: 'د.إ',
  EGP: 'ج.م',
  NGN: '₦',
  ZAR: 'R',
};

// Countries list
export const countries = [
  'Kenya',
  'Saudi Arabia',
  'United Arab Emirates',
  'Egypt',
  'Nigeria',
  'Qatar',
  'Oman',
  'Tanzania',
  'Uganda',
  'Rwanda',
  'Ghana',
  'Senegal',
  'Morocco',
  'Algeria',
  'Ethiopia',
  'South Africa',
  'Jordan',
  'Kuwait',
  'Bahrain',
  'Lebanon',
];

// App categories
export const appCategories = [
  'All',
  'Retail',
  'Logistics',
  'FinTech',
  'HealthTech',
  'PropTech',
  'EdTech',
  'E-commerce',
];

// Budget ranges
export const budgetRanges = [
  { value: '<$5k', label: 'Under $5,000' },
  { value: '$5k-$20k', label: '$5,000 - $20,000' },
  { value: '$20k+', label: '$20,000+' },
];

// Service options for consultation
export const serviceOptions = [
  'KaatibPOS',
  'Bxsfy',
  'CargoFlow',
  'AqariX',
  'StockPulse',
  'VaultFin',
  'MarketCore',
  'AfyaCare',
  'Custom Development',
];

// Type alias for News (NewsPost)
export type News = NewsPost;
