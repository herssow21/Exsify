import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { careers } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { generateId } from "@/utils/validators";

export const careerRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(careers).orderBy(desc(careers.createdAt));
  }),

  active: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(careers)
      .where(sql`${careers.status} = 'active'`)
      .orderBy(desc(careers.createdAt));
  }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(careers)
      .where(sql`${careers.status} = 'active' AND ${careers.featured} = true`)
      .orderBy(desc(careers.createdAt));
  }),

  byId: publicQuery
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db.select().from(careers).where(eq(careers.id, input.id));
      return rows[0] ?? null;
    }),

  create: adminQuery
    .input(
      z.object({
        id: z.string().min(1).optional(),
        titleEn: z.string().min(1),
        titleAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        department: z.string().optional(),
        location: z.string().optional(),
        type: z.enum(["full-time", "part-time", "contract", "remote"]),
        status: z.enum(["active", "inactive", "closed"]).optional(),
        featured: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const id = input.id ?? generateId();
      await db.insert(careers).values({
        id,
        titleEn: input.titleEn,
        titleAr: input.titleAr,
        descriptionEn: input.descriptionEn,
        descriptionAr: input.descriptionAr,
        department: input.department,
        location: input.location,
        type: input.type,
        status: input.status ?? "active",
        featured: input.featured ?? false,
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
          descriptionEn: z.string().optional(),
          descriptionAr: z.string().optional(),
          department: z.string().optional(),
          location: z.string().optional(),
          type: z.enum(["full-time", "part-time", "contract", "remote"]).optional(),
          status: z.enum(["active", "inactive", "closed"]).optional(),
          featured: z.boolean().optional(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(careers)
        .set(input.data)
        .where(eq(careers.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(careers).where(eq(careers.id, input.id));
      return { success: true };
    }),
});
