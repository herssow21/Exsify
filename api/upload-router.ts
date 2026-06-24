import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { uploads } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const uploadRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(uploads).orderBy(desc(uploads.createdAt));
  }),

  byType: publicQuery
    .input(z.object({ type: z.enum(["image", "document", "archive", "other"]) }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(uploads)
        .where(eq(uploads.type, input.type))
        .orderBy(desc(uploads.createdAt));
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(uploads).where(eq(uploads.id, input.id));
      return { success: true };
    }),
});
