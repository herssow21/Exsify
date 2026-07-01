import { trpcClient } from './trpcVanilla';
import {
  fromApiApp,
  fromApiUser,
  fromApiReview,
  fromApiConsultation,
  fromApiNews,
  fromApiDownload,
  fromApiCareer,
} from './backendMappers';

const KEYS = {
  apps: 'exsify_apps',
  users: 'exsify_users',
  reviews: 'exsify_reviews',
  consultations: 'exsify_consultations',
  news: 'exsify_news',
  careers: 'exsify_careers',
  downloads: 'exsify_downloads',
} as const;

function setItem<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export async function syncApps() {
  try {
    const rows = await trpcClient.apps.list.query();
    setItem(KEYS.apps, rows.map(fromApiApp));
  } catch {
    // offline / error — keep localStorage data
  }
}

export async function syncUsers() {
  try {
    const rows = await trpcClient.localAuth.list.query();
    setItem(KEYS.users, rows.map(fromApiUser));
  } catch {
    // offline / error
  }
}

export async function syncReviews() {
  try {
    const rows = await trpcClient.review.list.query();
    setItem(KEYS.reviews, rows.map(fromApiReview));
  } catch {
    // offline / error
  }
}

export async function syncConsultations() {
  try {
    const rows = await trpcClient.consultation.list.query();
    setItem(KEYS.consultations, rows.map(fromApiConsultation));
  } catch {
    // offline / error
  }
}

export async function syncNews() {
  try {
    const rows = await trpcClient.news.list.query();
    setItem(KEYS.news, rows.map(fromApiNews));
  } catch {
    // offline / error
  }
}

export async function syncCareers() {
  try {
    const rows = await trpcClient.careers.list.query();
    setItem(KEYS.careers, rows.map(fromApiCareer));
  } catch {
    // offline / error
  }
}

export async function syncDownloads() {
  try {
    const rows = await trpcClient.download.list.query();
    setItem(KEYS.downloads, rows.map(fromApiDownload));
  } catch {
    // offline / error
  }
}

export async function syncAll() {
  await Promise.all([
    syncApps(),
    syncUsers(),
    syncReviews(),
    syncConsultations(),
    syncNews(),
    syncCareers(),
    syncDownloads(),
  ]);
}
