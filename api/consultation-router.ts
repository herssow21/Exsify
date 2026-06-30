import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { consultations } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { generateId } from "@/utils/validators";

export const consultationRouter = createRouter({
  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(consultations).orderBy(desc(consultations.createdAt));
  }),

  create: publicQuery
    .input(
      z.object({
        id: z.string().min(1).optional(),
        fullName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        company: z.string().optional(),
        serviceInterest: z.string().optional(),
        projectDetails: z.string().optional(),
        budget: z.string().optional(),
        country: z.string().optional(),
        status: z.enum(["new", "contacted", "closed"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const id = input.id ?? generateId();
      await db.insert(consultations).values({
        id,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        company: input.company,
        serviceInterest: input.serviceInterest,
        projectDetails: input.projectDetails,
        budget: input.budget,
        country: input.country,
        status: input.status ?? "new",
      });
      return { id };
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.string().min(1),
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
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(consultations).where(eq(consultations.id, input.id));
      return { success: true };
    }),
});
