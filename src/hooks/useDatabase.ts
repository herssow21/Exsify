import { useState, useEffect, useCallback } from 'react';
import type { App, User, Review, News, Consultation, Download } from '../types';
import {
  getApps,
  getUsers,
  getReviews,
  getNews,
  getConsultations,
  getDownloads,
  addApp,
  updateApp,
  deleteApp,
  addReview,
  updateReview,
  deleteReview,
  addNews,
  updateNews,
  deleteNews,
  updateConsultationStatus,
  deleteConsultation,
  updateUser,
  deleteUser,
  getStats
} from '../utils/dbOperations';

export function useApps() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setApps(getApps());
    setLoading(false);
  }, []);

  const refresh = useCallback(() => {
    setApps(getApps());
  }, []);

  const create = useCallback((app: Omit<App, 'id'>) => {
    const newApp = addApp(app);
    refresh();
    return newApp;
  }, [refresh]);

  const update = useCallback((id: string, updates: Partial<App>) => {
    const updated = updateApp(id, updates);
    refresh();
    return updated;
  }, [refresh]);

  const remove = useCallback((id: string) => {
    const success = deleteApp(id);
    refresh();
    return success;
  }, [refresh]);

  return { apps, loading, refresh, create, update, remove };
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUsers(getUsers());
    setLoading(false);
  }, []);

  const refresh = useCallback(() => {
    setUsers(getUsers());
  }, []);

  const update = useCallback((id: string, updates: Partial<User>) => {
    updateUser(id, updates);
    refresh();
  }, [refresh]);

  const remove = useCallback((id: string) => {
    deleteUser(id);
    refresh();
  }, [refresh]);

  return { users, loading, refresh, update, remove };
}

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setReviews(getReviews());
    setLoading(false);
  }, []);

  const refresh = useCallback(() => {
    setReviews(getReviews());
  }, []);

  const create = useCallback((review: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview = addReview(review);
    refresh();
    return newReview;
  }, [refresh]);

  const update = useCallback((id: string, updates: Partial<Review>) => {
    const updated = updateReview(id, updates);
    refresh();
    return updated;
  }, [refresh]);

  const remove = useCallback((id: string) => {
    const success = deleteReview(id);
    refresh();
    return success;
  }, [refresh]);

  return { reviews, loading, refresh, create, update, remove };
}

export function useNews() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setNews(getNews());
    setLoading(false);
  }, []);

  const refresh = useCallback(() => {
    setNews(getNews());
  }, []);

  const create = useCallback((item: Omit<News, 'id'>) => {
    const newItem = addNews(item);
    refresh();
    return newItem;
  }, [refresh]);

  const update = useCallback((id: string, updates: Partial<News>) => {
    const updated = updateNews(id, updates);
    refresh();
    return updated;
  }, [refresh]);

  const remove = useCallback((id: string) => {
    const success = deleteNews(id);
    refresh();
    return success;
  }, [refresh]);

  return { news, loading, refresh, create, update, remove };
}

export function useConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setConsultations(getConsultations());
    setLoading(false);
  }, []);

  const refresh = useCallback(() => {
    setConsultations(getConsultations());
  }, []);

  const updateStatus = useCallback((id: string, status: 'new' | 'contacted' | 'closed') => {
    const updated = updateConsultationStatus(id, status);
    refresh();
    return updated;
  }, [refresh]);

  const remove = useCallback((id: string) => {
    const success = deleteConsultation(id);
    refresh();
    return success;
  }, [refresh]);

  return { consultations, loading, refresh, updateStatus, remove };
}

export function useDownloads() {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDownloads(getDownloads());
    setLoading(false);
  }, []);

  const refresh = useCallback(() => {
    setDownloads(getDownloads());
  }, []);

  return { downloads, loading, refresh };
}

export function useStats() {
  const [stats, setStats] = useState({
    totalDownloads: 0,
    activeUsers: 0,
    totalRevenue: 0,
    pendingReviews: 0,
    newConsultations: 0,
    growth: 0,
    totalApps: 0,
    countriesServed: 0,
    customerSatisfaction: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setStats(getStats());
    setLoading(false);
  }, []);

  const refresh = useCallback(() => {
    setStats(getStats());
  }, []);

  return { stats, loading, refresh };
}
