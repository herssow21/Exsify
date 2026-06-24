import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { newsPosts } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

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
        titleEn: z.string().min(1),
        titleAr: z.string().optional(),
        contentEn: z.string().optional(),
        contentAr: z.string().optional(),
        category: z.string().optional(),
        imageUrl: z.string().optional(),
        featured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(newsPosts).values({
        titleEn: input.titleEn,
        titleAr: input.titleAr,
        contentEn: input.contentEn,
        contentAr: input.contentAr,
        category: input.category,
        imageUrl: input.imageUrl,
        featured: input.featured,
      });
      return { id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
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
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(newsPosts).where(eq(newsPosts.id, input.id));
      return { success: true };
    }),
});
