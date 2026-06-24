import { relations } from "drizzle-orm";
import { apps, reviews, consultations, newsPosts, downloads, localUsers } from "./schema";

export const appsRelations = relations(apps, ({ many }) => ({
  reviews: many(reviews),
  downloads: many(downloads),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  app: one(apps, {
    fields: [reviews.appId],
    references: [apps.id],
  }),
}));
