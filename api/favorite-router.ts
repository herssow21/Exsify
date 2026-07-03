import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { favorites } from "@db/schema";
import { eq, desc, and } from "drizzle-orm";
import { generateId } from "@/utils/validators";

export const favoriteRouter = createRouter({
  byUser: publicQuery
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(favorites)
        .where(eq(favorites.userId, input.userId))
        .orderBy(desc(favorites.createdAt));
    }),

  create: publicQuery
    .input(
      z.object({
        id: z.string().min(1).optional(),
        userId: z.string().min(1),
        appId: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const id = input.id ?? generateId();
      // prevent duplicates
      await db
        .delete(favorites)
        .where(and(eq(favorites.userId, input.userId), eq(favorites.appId, input.appId)));
      await db.insert(favorites).values({
        id,
        userId: input.userId,
        appId: input.appId,
      });
      return { id };
    }),

  delete: publicQuery
    .input(
      z.object({
        id: z.string().min(1).optional(),
        userId: z.string().min(1).optional(),
        appId: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      if (input.id) {
        await db.delete(favorites).where(eq(favorites.id, input.id));
      } else if (input.userId && input.appId) {
        await db
          .delete(favorites)
          .where(and(eq(favorites.userId, input.userId), eq(favorites.appId, input.appId)));
      }
      return { success: true };
    }),

  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(favorites).orderBy(desc(favorites.createdAt));
  }),
});
