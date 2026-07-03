import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { visits } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { generateId } from "@/utils/validators";

export const visitRouter = createRouter({
  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(visits).orderBy(desc(visits.visitedAt));
  }),

  create: publicQuery
    .input(
      z.object({
        id: z.string().min(1).optional(),
        sessionId: z.string().optional(),
        visitedAt: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const id = input.id ?? generateId();
      await db.insert(visits).values({
        id,
        sessionId: input.sessionId,
        visitedAt: input.visitedAt ? new Date(input.visitedAt) : new Date(),
      });
      return { id };
    }),

  delete: adminQuery
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(visits).where(eq(visits.id, input.id));
      return { success: true };
    }),
});
