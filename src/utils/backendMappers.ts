import type {
  App,
  User,
  Review,
  Consultation,
  NewsPost,
  Download,
  Career,
} from '@/types';

// ── Apps ──
export function fromApiApp(api: any): App {
  return {
    id: String(api.id),
    slug: api.slug,
    name_en: api.nameEn ?? api.name_en ?? '',
    name_ar: api.nameAr ?? api.name_ar ?? '',
    description_en: api.descriptionEn ?? api.description_en ?? '',
    description_ar: api.descriptionAr ?? api.description_ar ?? '',
    shortDescription_en: api.shortDescriptionEn ?? api.shortDescription_en,
    shortDescription_ar: api.shortDescriptionAr ?? api.shortDescription_ar,
    features_en: (api.featuresEn ?? api.features_en ?? []) as string[],
    features_ar: (api.featuresAr ?? api.features_ar ?? []) as string[],
    category: api.category,
    price_usd: Number(api.priceUsd ?? api.price_usd ?? 0),
    screenshots: (api.screenshots ?? []) as string[],
    icon: api.icon ?? '',
    downloadCount: Number(api.downloadCount ?? api.download_count ?? 0),
    rating: Number(api.rating ?? api.rating ?? 0),
    totalReviews: Number(api.totalReviews ?? api.total_reviews ?? 0),
    regionsAvailable: (api.regionsAvailable ?? api.regions_available ?? []) as string[],
    status: api.status ?? 'active',
    featured: Boolean(api.featured),
    downloadUrl: api.downloadUrl ?? api.download_url ?? '',
    playStoreUrl: api.playStoreUrl ?? api.play_store_url,
    appStoreUrl: api.appStoreUrl ?? api.app_store_url,
    desktopUrl: api.desktopUrl ?? api.desktop_url,
    tags: api.tags,
  };
}

export function toApiApp(app: App): any {
  return {
    id: app.id,
    slug: app.slug,
    nameEn: app.name_en,
    nameAr: app.name_ar,
    descriptionEn: app.description_en,
    descriptionAr: app.description_ar,
    shortDescriptionEn: app.shortDescription_en,
    shortDescriptionAr: app.shortDescription_ar,
    featuresEn: app.features_en,
    featuresAr: app.features_ar,
    category: app.category,
    priceUsd: String(app.price_usd),
    screenshots: app.screenshots,
    icon: app.icon,
    downloadCount: app.downloadCount,
    rating: String(app.rating),
    totalReviews: app.totalReviews,
    regionsAvailable: app.regionsAvailable,
    status: app.status,
    featured: app.featured,
    downloadUrl: app.downloadUrl || undefined,
    playStoreUrl: app.playStoreUrl,
    appStoreUrl: app.appStoreUrl,
    desktopUrl: app.desktopUrl,
  };
}

export function toApiAppUpdates(updates: Partial<App>): any {
  const map: Record<string, any> = {};
  if (updates.slug !== undefined) map.slug = updates.slug;
  if (updates.name_en !== undefined) map.nameEn = updates.name_en;
  if (updates.name_ar !== undefined) map.nameAr = updates.name_ar;
  if (updates.description_en !== undefined) map.descriptionEn = updates.description_en;
  if (updates.description_ar !== undefined) map.descriptionAr = updates.description_ar;
  if (updates.shortDescription_en !== undefined) map.shortDescriptionEn = updates.shortDescription_en;
  if (updates.shortDescription_ar !== undefined) map.shortDescriptionAr = updates.shortDescription_ar;
  if (updates.features_en !== undefined) map.featuresEn = updates.features_en;
  if (updates.features_ar !== undefined) map.featuresAr = updates.features_ar;
  if (updates.category !== undefined) map.category = updates.category;
  if (updates.price_usd !== undefined) map.priceUsd = String(updates.price_usd);
  if (updates.screenshots !== undefined) map.screenshots = updates.screenshots;
  if (updates.icon !== undefined) map.icon = updates.icon;
  if (updates.downloadCount !== undefined) map.downloadCount = updates.downloadCount;
  if (updates.rating !== undefined) map.rating = String(updates.rating);
  if (updates.totalReviews !== undefined) map.totalReviews = updates.totalReviews;
  if (updates.regionsAvailable !== undefined) map.regionsAvailable = updates.regionsAvailable;
  if (updates.status !== undefined) map.status = updates.status;
  if (updates.featured !== undefined) map.featured = updates.featured;
  if (updates.downloadUrl !== undefined) map.downloadUrl = updates.downloadUrl || undefined;
  if (updates.playStoreUrl !== undefined) map.playStoreUrl = updates.playStoreUrl;
  if (updates.appStoreUrl !== undefined) map.appStoreUrl = updates.appStoreUrl;
  if (updates.desktopUrl !== undefined) map.desktopUrl = updates.desktopUrl;
  return map;
}

// ── Users ──
export function fromApiUser(api: any): User {
  return {
    id: String(api.id),
    fullName: api.fullName ?? api.full_name ?? '',
    email: api.email ?? '',
    password: '',
    role: (api.role ?? 'customer') as User['role'],
    country: api.country ?? '',
    region: api.region,
    currency: (api.currency ?? 'USD') as User['currency'],
    createdAt:
      (api.createdAt ? new Date(api.createdAt).toISOString() : undefined) ??
      (api.created_at ? new Date(api.created_at).toISOString() : undefined) ??
      new Date().toISOString(),
    profileImage: api.profileImage ?? api.profile_image,
    passwordResetToken: api.passwordResetToken ?? api.password_reset_token,
    passwordResetExpires: api.passwordResetExpires ?? api.password_reset_expires,
    requiresPasswordChange: Boolean(api.requiresPasswordChange ?? api.requires_password_change),
  };
}

export function toApiSignup(user: Omit<User, 'id' | 'createdAt'> & { password: string }): any {
  return {
    fullName: user.fullName,
    email: user.email,
    password: user.password,
    role: user.role,
    country: user.country,
    region: user.region,
    currency: user.currency,
  };
}

export function toApiUserUpdates(updates: Partial<User>): any {
  const map: Record<string, any> = {};
  if (updates.fullName !== undefined) map.fullName = updates.fullName;
  if (updates.email !== undefined) map.email = updates.email;
  if (updates.country !== undefined) map.country = updates.country;
  if (updates.region !== undefined) map.region = updates.region;
  if (updates.currency !== undefined) map.currency = updates.currency;
  if (updates.profileImage !== undefined) map.profileImage = updates.profileImage;
  if (updates.role !== undefined) map.role = updates.role;
  if (updates.requiresPasswordChange !== undefined) map.requiresPasswordChange = updates.requiresPasswordChange;
  if (updates.passwordResetToken !== undefined) map.passwordResetToken = updates.passwordResetToken;
  if (updates.passwordResetExpires !== undefined) map.passwordResetExpires = updates.passwordResetExpires;
  return map;
}

// ── Reviews ──
export function fromApiReview(api: any): Review {
  return {
    id: String(api.id),
    userId: String(api.userId ?? api.user_id ?? ''),
    appId: api.appId ?? api.app_id ? String(api.appId ?? api.app_id) : undefined,
    userName: api.userName ?? api.user_name ?? '',
    userCompany: api.userCompany ?? api.user_company,
    userCountry: api.userCountry ?? api.user_country,
    rating: Number(api.rating),
    text_en: api.textEn ?? api.text_en ?? '',
    text_ar: api.textAr ?? api.text_ar ?? '',
    status: (api.status ?? 'pending') as Review['status'],
    verified: Boolean(api.verified),
    featured: Boolean(api.featured),
    approved: Boolean(api.approved),
    createdAt:
      (api.createdAt ? new Date(api.createdAt).toISOString() : undefined) ??
      (api.created_at ? new Date(api.created_at).toISOString() : undefined) ??
      new Date().toISOString(),
  };
}

export function toApiReview(review: Review): any {
  return {
    id: review.id,
    userId: review.userId,
    userName: review.userName,
    appId: review.appId,
    userCompany: review.userCompany,
    userCountry: review.userCountry,
    rating: review.rating,
    textEn: review.text_en,
    textAr: review.text_ar,
    status: review.status,
    verified: review.verified,
    featured: review.featured,
    approved: review.approved,
  };
}

export function toApiReviewUpdates(updates: Partial<Review>): any {
  const map: Record<string, any> = {};
  if (updates.userId !== undefined) map.userId = updates.userId;
  if (updates.appId !== undefined) map.appId = updates.appId;
  if (updates.userName !== undefined) map.userName = updates.userName;
  if (updates.userCompany !== undefined) map.userCompany = updates.userCompany;
  if (updates.userCountry !== undefined) map.userCountry = updates.userCountry;
  if (updates.rating !== undefined) map.rating = updates.rating;
  if (updates.text_en !== undefined) map.textEn = updates.text_en;
  if (updates.text_ar !== undefined) map.textAr = updates.text_ar;
  if (updates.status !== undefined) map.status = updates.status;
  if (updates.verified !== undefined) map.verified = updates.verified;
  if (updates.featured !== undefined) map.featured = updates.featured;
  if (updates.approved !== undefined) map.approved = updates.approved;
  return map;
}

// ── Consultations ──
export function fromApiConsultation(api: any): Consultation {
  return {
    id: String(api.id),
    fullName: api.fullName ?? api.full_name ?? '',
    email: api.email ?? '',
    phone: api.phone,
    company: api.company ?? '',
    serviceInterest: api.serviceInterest ?? api.service_interest ?? '',
    projectDetails: api.projectDetails ?? api.project_details ?? '',
    budget: api.budget ?? '',
    country: api.country ?? '',
    status: (api.status ?? 'new') as Consultation['status'],
    submittedAt:
      (api.createdAt ? new Date(api.createdAt).toISOString() : undefined) ??
      (api.created_at ? new Date(api.created_at).toISOString() : undefined) ??
      (api.submittedAt ? new Date(api.submittedAt).toISOString() : undefined) ??
      (api.submitted_at ? new Date(api.submitted_at).toISOString() : undefined) ??
      new Date().toISOString(),
  };
}

export function toApiConsultation(c: Consultation): any {
  return {
    id: c.id,
    fullName: c.fullName,
    email: c.email,
    phone: c.phone,
    company: c.company,
    serviceInterest: c.serviceInterest,
    projectDetails: c.projectDetails,
    budget: c.budget,
    country: c.country,
    status: c.status,
  };
}

// ── News ──
export function fromApiNews(api: any): NewsPost {
  return {
    id: String(api.id),
    title_en: api.titleEn ?? api.title_en ?? '',
    title_ar: api.titleAr ?? api.title_ar ?? '',
    content_en: api.contentEn ?? api.content_en ?? '',
    content_ar: api.contentAr ?? api.content_ar ?? '',
    category: api.category ?? '',
    imageUrl: api.imageUrl ?? api.image_url ?? '',
    featured: Boolean(api.featured),
    publishedAt:
      (api.publishedAt ? new Date(api.publishedAt).toISOString() : undefined) ??
      (api.published_at ? new Date(api.published_at).toISOString() : undefined) ??
      new Date().toISOString(),
  };
}

export function toApiNews(n: NewsPost): any {
  return {
    id: n.id,
    titleEn: n.title_en,
    titleAr: n.title_ar,
    contentEn: n.content_en,
    contentAr: n.content_ar,
    category: n.category,
    imageUrl: n.imageUrl,
    featured: n.featured,
    publishedAt: n.publishedAt,
  };
}

export function toApiNewsUpdates(updates: Partial<NewsPost>): any {
  const map: Record<string, any> = {};
  if (updates.title_en !== undefined) map.titleEn = updates.title_en;
  if (updates.title_ar !== undefined) map.titleAr = updates.title_ar;
  if (updates.content_en !== undefined) map.contentEn = updates.content_en;
  if (updates.content_ar !== undefined) map.contentAr = updates.content_ar;
  if (updates.category !== undefined) map.category = updates.category;
  if (updates.imageUrl !== undefined) map.imageUrl = updates.imageUrl;
  if (updates.featured !== undefined) map.featured = updates.featured;
  if (updates.publishedAt !== undefined) map.publishedAt = updates.publishedAt;
  return map;
}

// ── Careers ──
export function fromApiCareer(api: any): Career {
  return {
    id: String(api.id),
    title_en: api.titleEn ?? api.title_en ?? '',
    title_ar: api.titleAr ?? api.title_ar ?? '',
    description_en: api.descriptionEn ?? api.description_en ?? '',
    description_ar: api.descriptionAr ?? api.description_ar ?? '',
    department: api.department ?? '',
    location: api.location ?? '',
    type: (api.type ?? 'full-time') as Career['type'],
    status: (api.status ?? 'active') as Career['status'],
    featured: Boolean(api.featured),
    createdAt:
      (api.createdAt ? new Date(api.createdAt).toISOString() : undefined) ??
      (api.created_at ? new Date(api.created_at).toISOString() : undefined) ??
      new Date().toISOString(),
    updatedAt:
      (api.updatedAt ? new Date(api.updatedAt).toISOString() : undefined) ??
      (api.updated_at ? new Date(api.updated_at).toISOString() : undefined),
  };
}

export function toApiCareer(c: Career): any {
  return {
    id: c.id,
    titleEn: c.title_en,
    titleAr: c.title_ar,
    descriptionEn: c.description_en,
    descriptionAr: c.description_ar,
    department: c.department,
    location: c.location,
    type: c.type,
    status: c.status,
    featured: c.featured,
  };
}

export function toApiCareerUpdates(updates: Partial<Career>): any {
  const map: Record<string, any> = {};
  if (updates.title_en !== undefined) map.titleEn = updates.title_en;
  if (updates.title_ar !== undefined) map.titleAr = updates.title_ar;
  if (updates.description_en !== undefined) map.descriptionEn = updates.description_en;
  if (updates.description_ar !== undefined) map.descriptionAr = updates.description_ar;
  if (updates.department !== undefined) map.department = updates.department;
  if (updates.location !== undefined) map.location = updates.location;
  if (updates.type !== undefined) map.type = updates.type;
  if (updates.status !== undefined) map.status = updates.status;
  if (updates.featured !== undefined) map.featured = updates.featured;
  return map;
}

// ── Downloads ──
export function fromApiDownload(api: any): Download {
  return {
    id: String(api.id),
    userId: String(api.userId ?? api.user_id ?? ''),
    appId: String(api.appId ?? api.app_id ?? ''),
    downloadedAt:
      (api.downloadedAt ? new Date(api.downloadedAt).toISOString() : undefined) ??
      (api.downloaded_at ? new Date(api.downloaded_at).toISOString() : undefined) ??
      new Date().toISOString(),
  };
}

export function toApiDownload(d: Download): any {
  return {
    id: d.id,
    userId: d.userId,
    appId: d.appId,
    downloadedAt: d.downloadedAt,
  };
}
