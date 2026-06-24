import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { apps } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const appRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(apps).orderBy(desc(apps.createdAt));
  }),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db.select().from(apps).where(eq(apps.slug, input.slug));
      return rows[0] ?? null;
    }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(apps).where(sql`${apps.featured} = true`);
  }),

  create: adminQuery
    .input(
      z.object({
        slug: z.string().min(1),
        nameEn: z.string().min(1),
        nameAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        shortDescriptionEn: z.string().optional(),
        shortDescriptionAr: z.string().optional(),
        featuresEn: z.array(z.string()).optional(),
        featuresAr: z.array(z.string()).optional(),
        category: z.string().min(1),
        priceUsd: z.string().optional(),
        screenshots: z.array(z.string()).optional(),
        icon: z.string().optional(),
        regionsAvailable: z.array(z.string()).optional(),
        status: z.enum(["active", "inactive"]).optional(),
        featured: z.boolean().optional(),
        downloadUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(apps).values({
        slug: input.slug,
        nameEn: input.nameEn,
        nameAr: input.nameAr,
        descriptionEn: input.descriptionEn,
        descriptionAr: input.descriptionAr,
        shortDescriptionEn: input.shortDescriptionEn,
        shortDescriptionAr: input.shortDescriptionAr,
        featuresEn: input.featuresEn,
        featuresAr: input.featuresAr,
        category: input.category,
        priceUsd: input.priceUsd,
        screenshots: input.screenshots,
        icon: input.icon,
        regionsAvailable: input.regionsAvailable,
        status: input.status,
        featured: input.featured,
        downloadUrl: input.downloadUrl,
      });
      return { id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          slug: z.string().optional(),
          nameEn: z.string().optional(),
          nameAr: z.string().optional(),
          descriptionEn: z.string().optional(),
          descriptionAr: z.string().optional(),
          shortDescriptionEn: z.string().optional(),
          shortDescriptionAr: z.string().optional(),
          featuresEn: z.array(z.string()).optional(),
          featuresAr: z.array(z.string()).optional(),
          category: z.string().optional(),
          priceUsd: z.string().optional(),
          screenshots: z.array(z.string()).optional(),
          icon: z.string().optional(),
          downloadCount: z.number().optional(),
          rating: z.string().optional(),
          totalReviews: z.number().optional(),
          regionsAvailable: z.array(z.string()).optional(),
          status: z.enum(["active", "inactive"]).optional(),
          featured: z.boolean().optional(),
          downloadUrl: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(apps).set(input.data).where(eq(apps.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(apps).where(eq(apps.id, input.id));
      return { success: true };
    }),
});
