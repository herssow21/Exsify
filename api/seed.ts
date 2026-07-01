import { getDb } from "./queries/connection";
import {
  apps,
  localUsers,
  downloads,
  reviews,
  consultations,
  newsPosts,
  careers,
} from "@db/schema";
import {
  seedApps,
  seedUsers,
  seedDownloads,
  seedReviews,
  seedConsultations,
  seedNews,
  seedCareers,
} from "@/utils/seedDatabase";
import type { App, User, Download, Review, Consultation, NewsPost, Career } from "@/types";

export async function seedDatabaseIfEmpty() {
  const db = getDb();

  // Seed apps
  const existingApps = await db.select({ id: apps.id }).from(apps).limit(1);
  if (existingApps.length === 0) {
    for (const app of seedApps as App[]) {
      await db.insert(apps).values({
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
      });
    }
    console.log("[seed] Apps seeded");
  }

  // Seed local users
  const existingUsers = await db.select({ id: localUsers.id }).from(localUsers).limit(1);
  if (existingUsers.length === 0) {
    for (const user of seedUsers as User[]) {
      await db.insert(localUsers).values({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        password: user.password,
        role: user.role as "customer" | "admin",
        country: user.country,
        region: user.region,
        currency: user.currency,
        profileImage: user.profileImage,
        passwordResetToken: user.passwordResetToken,
        passwordResetExpires: user.passwordResetExpires,
        requiresPasswordChange: user.requiresPasswordChange ?? false,
        createdAt: new Date(user.createdAt),
      });
    }
    console.log("[seed] Local users seeded");
  }

  // Seed downloads
  const existingDownloads = await db.select({ id: downloads.id }).from(downloads).limit(1);
  if (existingDownloads.length === 0) {
    for (const dl of seedDownloads as Download[]) {
      await db.insert(downloads).values({
        id: dl.id,
        userId: dl.userId,
        appId: dl.appId,
        downloadedAt: new Date(dl.downloadedAt),
      });
    }
    console.log("[seed] Downloads seeded");
  }

  // Seed reviews
  const existingReviews = await db.select({ id: reviews.id }).from(reviews).limit(1);
  if (existingReviews.length === 0) {
    for (const review of seedReviews as Review[]) {
      await db.insert(reviews).values({
        id: review.id,
        userId: review.userId,
        appId: review.appId,
        userName: review.userName,
        userCompany: review.userCompany,
        userCountry: review.userCountry,
        rating: review.rating,
        textEn: review.text_en,
        textAr: review.text_ar,
        status: review.status ?? "pending",
        verified: review.verified,
        featured: review.featured,
        approved: review.approved,
        createdAt: new Date(review.createdAt),
      });
    }
    console.log("[seed] Reviews seeded");
  }

  // Seed consultations
  const existingConsultations = await db
    .select({ id: consultations.id })
    .from(consultations)
    .limit(1);
  if (existingConsultations.length === 0) {
    for (const c of seedConsultations as Consultation[]) {
      await db.insert(consultations).values({
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
        createdAt: new Date(c.submittedAt),
      });
    }
    console.log("[seed] Consultations seeded");
  }

  // Seed news
  const existingNews = await db.select({ id: newsPosts.id }).from(newsPosts).limit(1);
  if (existingNews.length === 0) {
    for (const n of seedNews as NewsPost[]) {
      await db.insert(newsPosts).values({
        id: n.id,
        titleEn: n.title_en,
        titleAr: n.title_ar,
        contentEn: n.content_en,
        contentAr: n.content_ar,
        category: n.category,
        imageUrl: n.imageUrl,
        featured: n.featured,
        publishedAt: new Date(n.publishedAt),
      });
    }
    console.log("[seed] News seeded");
  }

  // Seed careers
  const existingCareers = await db.select({ id: careers.id }).from(careers).limit(1);
  if (existingCareers.length === 0) {
    for (const c of seedCareers as Career[]) {
      await db.insert(careers).values({
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
        createdAt: new Date(c.createdAt),
      });
    }
    console.log("[seed] Careers seeded");
  }
}
