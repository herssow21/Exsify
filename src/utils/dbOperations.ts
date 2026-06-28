/**
 * Database Operations
 * 
 * All data stored in separate localStorage keys matching seedDatabase format:
 * - exsify_apps, exsify_users, exsify_reviews, exsify_news, 
 *   exsify_consultations, exsify_downloads, exsify_region_stats
 */

import type { 
  User, 
  App, 
  Download, 
  Consultation, 
  Review, 
  RegionStat, 
  NewsPost, 
} from '@/types';
import { generateId } from './validators';

// ============ HELPERS ============

function getItem<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

const KEYS = {
  apps: 'exsify_apps',
  users: 'exsify_users',
  reviews: 'exsify_reviews',
  news: 'exsify_news',
  consultations: 'exsify_consultations',
  downloads: 'exsify_downloads',
  regionStats: 'exsify_region_stats',
} as const;

// ============ USER OPERATIONS ============

export function getUsers(): User[] {
  return getItem<User[]>(KEYS.users, []);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id);
}

export function addUser(user: Omit<User, 'id' | 'createdAt'>): User {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  setItem(KEYS.users, users);
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  setItem(KEYS.users, users);
  return users[index];
}

export function deleteUser(id: string): boolean {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return false;
  users.splice(index, 1);
  setItem(KEYS.users, users);
  return true;
}

// ============ APP OPERATIONS ============

export function getApps(): App[] {
  return getItem<App[]>(KEYS.apps, []);
}

export function getAppById(id: string): App | undefined {
  return getApps().find(a => a.id === id);
}

export function getAppBySlug(slug: string): App | undefined {
  return getApps().find(a => a.slug === slug);
}

export function getFeaturedApps(): App[] {
  return getApps().filter(a => a.featured && a.status === 'active');
}

export function getActiveApps(): App[] {
  return getApps().filter(a => a.status === 'active');
}

export function getAppsByCategory(category: string): App[] {
  if (category === 'All') return getActiveApps();
  return getApps().filter(a => a.category === category && a.status === 'active');
}

export function addApp(app: Omit<App, 'id'>): App {
  const apps = getApps();
  const newApp: App = { ...app, id: generateId() };
  apps.push(newApp);
  setItem(KEYS.apps, apps);
  return newApp;
}

export function updateApp(id: string, updates: Partial<App>): App | null {
  const apps = getApps();
  const index = apps.findIndex(a => a.id === id);
  if (index === -1) return null;
  apps[index] = { ...apps[index], ...updates };
  setItem(KEYS.apps, apps);
  return apps[index];
}

export function deleteApp(id: string): boolean {
  const apps = getApps();
  const index = apps.findIndex(a => a.id === id);
  if (index === -1) return false;
  apps.splice(index, 1);
  setItem(KEYS.apps, apps);
  return true;
}

// ============ DOWNLOAD OPERATIONS ============

export function getDownloads(): Download[] {
  return getItem<Download[]>(KEYS.downloads, []);
}

export function getDownloadsByUser(userId: string): Download[] {
  return getDownloads().filter(d => d.userId === userId);
}

export function getDownloadedAppsByUser(userId: string): App[] {
  const downloads = getDownloadsByUser(userId);
  const apps = getApps();
  return downloads.map(d => apps.find(a => a.id === d.appId)).filter(Boolean) as App[];
}

export function hasUserDownloaded(userId: string, appId: string): boolean {
  return getDownloads().some(d => d.userId === userId && d.appId === appId);
}

export function addDownload(userId: string, appId: string): Download {
  const downloads = getDownloads();
  const apps = getApps();
  const newDownload: Download = {
    id: generateId(),
    userId,
    appId,
    downloadedAt: new Date().toISOString(),
  };
  downloads.push(newDownload);
  // Update app download count
  const appIndex = apps.findIndex(a => a.id === appId);
  if (appIndex !== -1) {
    apps[appIndex].downloadCount += 1;
    setItem(KEYS.apps, apps);
  }
  setItem(KEYS.downloads, downloads);
  return newDownload;
}

// ============ FAVORITE OPERATIONS ============

function favoritesKey(userId: string): string {
  return `exsify_favorites_${userId}`;
}

export function getFavorites(userId: string): string[] {
  return getItem<string[]>(favoritesKey(userId), []);
}

export function isFavorite(userId: string, appId: string): boolean {
  return getFavorites(userId).includes(appId);
}

export function addFavorite(userId: string, appId: string): void {
  const favorites = getFavorites(userId);
  if (!favorites.includes(appId)) {
    favorites.push(appId);
    setItem(favoritesKey(userId), favorites);
  }
}

export function removeFavorite(userId: string, appId: string): void {
  const favorites = getFavorites(userId).filter(id => id !== appId);
  setItem(favoritesKey(userId), favorites);
}

export function toggleFavorite(userId: string, appId: string): boolean {
  if (isFavorite(userId, appId)) {
    removeFavorite(userId, appId);
    return false;
  }
  addFavorite(userId, appId);
  return true;
}

// ============ CONSULTATION OPERATIONS ============

export function getConsultations(): Consultation[] {
  return getItem<Consultation[]>(KEYS.consultations, []);
}

export function addConsultation(consultation: Omit<Consultation, 'id' | 'submittedAt' | 'status'>): Consultation {
  const consultations = getConsultations();
  const newConsultation: Consultation = {
    ...consultation,
    id: generateId(),
    status: 'new',
    submittedAt: new Date().toISOString(),
  };
  consultations.push(newConsultation);
  setItem(KEYS.consultations, consultations);
  return newConsultation;
}

export function updateConsultationStatus(id: string, status: 'new' | 'contacted' | 'closed'): Consultation | null {
  const consultations = getConsultations();
  const index = consultations.findIndex(c => c.id === id);
  if (index === -1) return null;
  consultations[index].status = status;
  setItem(KEYS.consultations, consultations);
  return consultations[index];
}

export function deleteConsultation(id: string): boolean {
  const consultations = getConsultations();
  const index = consultations.findIndex(c => c.id === id);
  if (index === -1) return false;
  consultations.splice(index, 1);
  setItem(KEYS.consultations, consultations);
  return true;
}

// ============ REVIEW OPERATIONS ============

export function getReviews(): Review[] {
  return getItem<Review[]>(KEYS.reviews, []);
}

export function getApprovedReviews(): Review[] {
  return getReviews().filter(r => r.approved);
}

export function getFeaturedReviews(): Review[] {
  return getReviews().filter(r => r.featured && r.approved);
}

export function getReviewsByApp(appId: string): Review[] {
  return getApprovedReviews().filter(r => r.appId === appId);
}

export function addReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
  const reviews = getReviews();
  const newReview: Review = {
    ...review,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  reviews.push(newReview);
  setItem(KEYS.reviews, reviews);
  return newReview;
}

export function updateReview(id: string, updates: Partial<Review>): Review | null {
  const reviews = getReviews();
  const index = reviews.findIndex(r => r.id === id);
  if (index === -1) return null;
  reviews[index] = { ...reviews[index], ...updates };
  setItem(KEYS.reviews, reviews);
  return reviews[index];
}

export function deleteReview(id: string): boolean {
  const reviews = getReviews();
  const index = reviews.findIndex(r => r.id === id);
  if (index === -1) return false;
  reviews.splice(index, 1);
  setItem(KEYS.reviews, reviews);
  return true;
}

// ============ NEWS OPERATIONS ============

export function getNews(): NewsPost[] {
  return getItem<NewsPost[]>(KEYS.news, []);
}

export function getFeaturedNews(): NewsPost[] {
  return getNews()
    .filter(n => n.featured)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getLatestNews(limit = 3): NewsPost[] {
  return getNews()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export function addNews(news: Omit<NewsPost, 'id' | 'publishedAt'>): NewsPost {
  const allNews = getNews();
  const newItem: NewsPost = {
    ...news,
    id: generateId(),
    publishedAt: new Date().toISOString(),
  };
  allNews.push(newItem);
  setItem(KEYS.news, allNews);
  return newItem;
}

export function updateNews(id: string, updates: Partial<NewsPost>): NewsPost | null {
  const allNews = getNews();
  const index = allNews.findIndex(n => n.id === id);
  if (index === -1) return null;
  allNews[index] = { ...allNews[index], ...updates };
  setItem(KEYS.news, allNews);
  return allNews[index];
}

export function deleteNews(id: string): boolean {
  const allNews = getNews();
  const index = allNews.findIndex(n => n.id === id);
  if (index === -1) return false;
  allNews.splice(index, 1);
  setItem(KEYS.news, allNews);
  return true;
}

// ============ REGION OPERATIONS ============

export function getRegions(): RegionStat[] {
  return getItem<RegionStat[]>(KEYS.regionStats, []);
}

// ============ STATISTICS ============

export function getStats() {
  const users = getUsers();
  const apps = getApps();
  const downloads = getDownloads();
  const consultations = getConsultations();
  const reviews = getReviews();
  const uniqueCountries = new Set(users.map(u => u.country));

  return {
    totalDownloads: downloads.length,
    activeUsers: users.length,
    totalRevenue: apps.reduce((acc, app) => acc + (app.price_usd * app.downloadCount), 0),
    pendingReviews: reviews.filter(r => !r.approved).length,
    newConsultations: consultations.filter(c => c.status === 'new').length,
    growth: 12,
    totalApps: apps.filter(a => a.status === 'active').length,
    countriesServed: uniqueCountries.size,
    customerSatisfaction: 98,
  };
}

// ============ CSV EXPORTS ============

export function exportUsersToCSV(): string {
  const users = getUsers();
  const headers = ['ID', 'Full Name', 'Email', 'Role', 'Country', 'Currency', 'Created At'];
  const rows = users.map(u => [u.id, u.fullName, u.email, u.role, u.country, u.currency, u.createdAt]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function exportConsultationsToCSV(): string {
  const consultations = getConsultations();
  const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Company', 'Service Interest', 'Budget', 'Country', 'Status', 'Submitted At'];
  const rows = consultations.map(c => [
    c.id, c.fullName, c.email, c.phone || '', c.company, c.serviceInterest, c.budget, c.country, c.status, c.submittedAt
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
