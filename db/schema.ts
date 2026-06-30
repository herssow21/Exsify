import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  decimal,
  json,
  boolean,
} from "drizzle-orm/mysql-core";

// ── OAuth Users (managed by Kimi auth) ──
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Local Auth Users (email/password for EXSIFY app) ──
export const localUsers = mysqlTable("local_users", {
  id: varchar("id", { length: 100 }).primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["customer", "admin"]).default("customer").notNull(),
  country: varchar("country", { length: 100 }),
  region: varchar("region", { length: 100 }),
  currency: varchar("currency", { length: 10 }).default("USD"),
  profileImage: text("profile_image"),
  passwordResetToken: varchar("password_reset_token", { length: 255 }),
  passwordResetExpires: varchar("password_reset_expires", { length: 100 }),
  requiresPasswordChange: boolean("requires_password_change").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type LocalUser = typeof localUsers.$inferSelect;
export type InsertLocalUser = typeof localUsers.$inferInsert;

// ── Software Apps ──
export const apps = mysqlTable("apps", {
  id: varchar("id", { length: 100 }).primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  nameAr: varchar("name_ar", { length: 255 }),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  shortDescriptionEn: varchar("short_description_en", { length: 500 }),
  shortDescriptionAr: varchar("short_description_ar", { length: 500 }),
  featuresEn: json("features_en").$type<string[]>(),
  featuresAr: json("features_ar").$type<string[]>(),
  category: varchar("category", { length: 100 }).notNull(),
  priceUsd: decimal("price_usd", { precision: 10, scale: 2 }).default("0"),
  screenshots: json("screenshots").$type<string[]>(),
  icon: varchar("icon", { length: 500 }),
  downloadCount: int("download_count").default(0),
  rating: decimal("rating", { precision: 3, scale: 1 }).default("0"),
  totalReviews: int("total_reviews").default(0),
  regionsAvailable: json("regions_available").$type<string[]>(),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  featured: boolean("featured").default(false),
  downloadUrl: varchar("download_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type App = typeof apps.$inferSelect;
export type InsertApp = typeof apps.$inferInsert;

// ── Reviews ──
export const reviews = mysqlTable("reviews", {
  id: varchar("id", { length: 100 }).primaryKey(),
  userId: varchar("user_id", { length: 100 }).notNull(),
  appId: varchar("app_id", { length: 100 }),
  userName: varchar("user_name", { length: 255 }).notNull(),
  userCompany: varchar("user_company", { length: 255 }),
  userCountry: varchar("user_country", { length: 100 }),
  rating: int("rating").notNull(),
  textEn: text("text_en"),
  textAr: text("text_ar"),
  status: mysqlEnum("status", ["published", "pending", "approved"]).default("pending"),
  verified: boolean("verified").default(false),
  featured: boolean("featured").default(false),
  approved: boolean("approved").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// ── Consultations (contact form submissions) ──
export const consultations = mysqlTable("consultations", {
  id: varchar("id", { length: 100 }).primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  serviceInterest: varchar("service_interest", { length: 255 }),
  projectDetails: text("project_details"),
  budget: varchar("budget", { length: 50 }),
  country: varchar("country", { length: 100 }),
  status: mysqlEnum("status", ["new", "contacted", "closed"]).default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = typeof consultations.$inferInsert;

// ── News Posts ──
export const newsPosts = mysqlTable("news_posts", {
  id: varchar("id", { length: 100 }).primaryKey(),
  titleEn: varchar("title_en", { length: 255 }).notNull(),
  titleAr: varchar("title_ar", { length: 255 }),
  contentEn: text("content_en"),
  contentAr: text("content_ar"),
  category: varchar("category", { length: 100 }),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
});

export type NewsPost = typeof newsPosts.$inferSelect;
export type InsertNewsPost = typeof newsPosts.$inferInsert;

// ── App Downloads tracking ──
export const downloads = mysqlTable("downloads", {
  id: varchar("id", { length: 100 }).primaryKey(),
  userId: varchar("user_id", { length: 100 }).notNull(),
  appId: varchar("app_id", { length: 100 }).notNull(),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
});

export type Download = typeof downloads.$inferSelect;
export type InsertDownload = typeof downloads.$inferInsert;

// ── Media Uploads ──
export const uploads = mysqlTable("uploads", {
  id: serial("id").primaryKey(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }),
  size: int("size"),
  url: varchar("url", { length: 500 }).notNull(),
  type: mysqlEnum("type", ["image", "document", "archive", "other"]).default("other"),
  uploadedBy: varchar("uploaded_by", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Upload = typeof uploads.$inferSelect;
export type InsertUpload = typeof uploads.$inferInsert;
