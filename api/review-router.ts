import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { reviews } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const reviewRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(reviews).orderBy(desc(reviews.createdAt));
  }),

  byApp: publicQuery
    .input(z.object({ appId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(reviews)
        .where(eq(reviews.appId, input.appId))
        .orderBy(desc(reviews.createdAt));
    }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(reviews)
      .where(sql`${reviews.featured} = true AND ${reviews.approved} = true`)
      .orderBy(desc(reviews.createdAt));
  }),

  create: publicQuery
    .input(
      z.object({
        userId: z.string().min(1),
        userName: z.string().min(1),
        appId: z.number().optional(),
        userCompany: z.string().optional(),
        userCountry: z.string().optional(),
        rating: z.number().min(1).max(5),
        textEn: z.string().optional(),
        textAr: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(reviews).values({
        userId: input.userId,
        userName: input.userName,
        appId: input.appId,
        userCompany: input.userCompany,
        userCountry: input.userCountry,
        rating: input.rating,
        textEn: input.textEn,
        textAr: input.textAr,
        status: "pending",
        verified: false,
        featured: false,
        approved: false,
      });
      return { id: Number(result[0].insertId) };
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["published", "pending", "approved"]).optional(),
        approved: z.boolean().optional(),
        featured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const updateData: Record<string, unknown> = {};
      if (input.status !== undefined) updateData.status = input.status;
      if (input.approved !== undefined) updateData.approved = input.approved;
      if (input.featured !== undefined) updateData.featured = input.featured;
      await db.update(reviews).set(updateData).where(eq(reviews.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(reviews).where(eq(reviews.id, input.id));
      return { success: true };
    }),
});
