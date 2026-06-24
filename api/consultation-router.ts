import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { consultations } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const consultationRouter = createRouter({
  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(consultations).orderBy(desc(consultations.createdAt));
  }),

  create: publicQuery
    .input(
      z.object({
        fullName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        company: z.string().optional(),
        serviceInterest: z.string().optional(),
        projectDetails: z.string().optional(),
        budget: z.string().optional(),
        country: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(consultations).values({
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        company: input.company,
        serviceInterest: input.serviceInterest,
        projectDetails: input.projectDetails,
        budget: input.budget,
        country: input.country,
        status: "new",
      });
      return { id: Number(result[0].insertId) };
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "closed"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(consultations)
        .set({ status: input.status })
        .where(eq(consultations.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(consultations).where(eq(consultations.id, input.id));
      return { success: true };
    }),
});
