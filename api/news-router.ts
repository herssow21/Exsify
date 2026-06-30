import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { newsPosts } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { generateId } from "@/utils/validators";

export const newsRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(newsPosts).orderBy(desc(newsPosts.publishedAt));
  }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(newsPosts)
      .where(sql`${newsPosts.featured} = true`)
      .orderBy(desc(newsPosts.publishedAt));
  }),

  create: adminQuery
    .input(
      z.object({
        id: z.string().min(1).optional(),
        titleEn: z.string().min(1),
        titleAr: z.string().optional(),
        contentEn: z.string().optional(),
        contentAr: z.string().optional(),
        category: z.string().optional(),
        imageUrl: z.string().optional(),
        featured: z.boolean().optional(),
        publishedAt: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const id = input.id ?? generateId();
      await db.insert(newsPosts).values({
        id,
        titleEn: input.titleEn,
        titleAr: input.titleAr,
        contentEn: input.contentEn,
        contentAr: input.contentAr,
        category: input.category,
        imageUrl: input.imageUrl,
        featured: input.featured,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : new Date(),
      });
      return { id };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.string().min(1),
        data: z.object({
          titleEn: z.string().optional(),
          titleAr: z.string().optional(),
          contentEn: z.string().optional(),
          contentAr: z.string().optional(),
          category: z.string().optional(),
          imageUrl: z.string().optional(),
          featured: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(newsPosts)
        .set(input.data)
        .where(eq(newsPosts.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(newsPosts).where(eq(newsPosts.id, input.id));
      return { success: true };
    }),
});
