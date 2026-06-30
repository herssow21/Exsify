import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { reviews } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { generateId } from "@/utils/validators";

export const reviewRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(reviews).orderBy(desc(reviews.createdAt));
  }),

  byApp: publicQuery
    .input(z.object({ appId: z.string().min(1) }))
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
        id: z.string().min(1).optional(),
        userId: z.string().min(1),
        userName: z.string().min(1),
        appId: z.string().min(1).optional(),
        userCompany: z.string().optional(),
        userCountry: z.string().optional(),
        rating: z.number().min(1).max(5),
        textEn: z.string().optional(),
        textAr: z.string().optional(),
        status: z.enum(["published", "pending", "approved"]).optional(),
        verified: z.boolean().optional(),
        featured: z.boolean().optional(),
        approved: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const id = input.id ?? generateId();
      await db.insert(reviews).values({
        id,
        userId: input.userId,
        userName: input.userName,
        appId: input.appId,
        userCompany: input.userCompany,
        userCountry: input.userCountry,
        rating: input.rating,
        textEn: input.textEn,
        textAr: input.textAr,
        status: input.status ?? "pending",
        verified: input.verified ?? false,
        featured: input.featured ?? false,
        approved: input.approved ?? false,
      });
      return { id };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.string().min(1),
        data: z.object({
          userId: z.string().optional(),
          userName: z.string().optional(),
          appId: z.string().optional(),
          userCompany: z.string().optional(),
          userCountry: z.string().optional(),
          rating: z.number().min(1).max(5).optional(),
          textEn: z.string().optional(),
          textAr: z.string().optional(),
          status: z.enum(["published", "pending", "approved"]).optional(),
          verified: z.boolean().optional(),
          featured: z.boolean().optional(),
          approved: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(reviews).set(input.data).where(eq(reviews.id, input.id));
      return { success: true };
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.string().min(1),
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
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(reviews).where(eq(reviews.id, input.id));
      return { success: true };
    }),
});
