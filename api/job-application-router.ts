import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { jobApplications } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { generateId } from "@/utils/validators";

export const jobApplicationRouter = createRouter({
  list: adminQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(jobApplications)
      .orderBy(desc(jobApplications.createdAt));
  }),

  create: publicQuery
    .input(
      z.object({
        id: z.string().min(1).optional(),
        careerId: z.string().optional(),
        jobTitle: z.string().optional(),
        name: z.string().min(1),
        email: z.string().email(),
        message: z.string().optional(),
        cvName: z.string().optional(),
        cvData: z.string().optional(),
        status: z.enum(["new", "reviewed", "shortlisted", "rejected"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const id = input.id ?? generateId();
      await db.insert(jobApplications).values({
        id,
        careerId: input.careerId,
        jobTitle: input.jobTitle,
        name: input.name,
        email: input.email,
        message: input.message,
        cvName: input.cvName,
        cvData: input.cvData,
        status: input.status ?? "new",
      });
      return { id };
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.string().min(1),
        status: z.enum(["new", "reviewed", "shortlisted", "rejected"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(jobApplications)
        .set({ status: input.status })
        .where(eq(jobApplications.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(jobApplications).where(eq(jobApplications.id, input.id));
      return { success: true };
    }),
});
