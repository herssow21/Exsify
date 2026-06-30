import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { downloads, apps } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { generateId } from "@/utils/validators";

export const downloadRouter = createRouter({
  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(downloads).orderBy(desc(downloads.downloadedAt));
  }),

  byUser: publicQuery
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(downloads)
        .where(eq(downloads.userId, input.userId))
        .orderBy(desc(downloads.downloadedAt));
    }),

  byApp: publicQuery
    .input(z.object({ appId: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(downloads)
        .where(eq(downloads.appId, input.appId))
        .orderBy(desc(downloads.downloadedAt));
    }),

  hasDownloaded: publicQuery
    .input(
      z.object({
        userId: z.string().min(1),
        appId: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db
        .select()
        .from(downloads)
        .where(eq(downloads.userId, input.userId) && eq(downloads.appId, input.appId));
      return rows.length > 0;
    }),

  create: publicQuery
    .input(
      z.object({
        id: z.string().min(1).optional(),
        userId: z.string().min(1),
        appId: z.string().min(1),
        downloadedAt: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const id = input.id ?? generateId();
      await db.insert(downloads).values({
        id,
        userId: input.userId,
        appId: input.appId,
        downloadedAt: input.downloadedAt ? new Date(input.downloadedAt) : new Date(),
      });

      // Increment app download count
      const appRows = await db.select().from(apps).where(eq(apps.id, input.appId));
      if (appRows.length > 0) {
        await db
          .update(apps)
          .set({ downloadCount: (appRows[0].downloadCount ?? 0) + 1 })
          .where(eq(apps.id, input.appId));
      }

      return { id };
    }),

  delete: adminQuery
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(downloads).where(eq(downloads.id, input.id));
      return { success: true };
    }),
});
