import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { localUsers } from "@db/schema";
import { eq } from "drizzle-orm";

// Simple base64 encode/decode for demo (replace with bcrypt in production)
function encodePassword(password: string): string {
  return Buffer.from(password).toString("base64");
}

function decodePassword(encoded: string): string {
  return Buffer.from(encoded, "base64").toString("utf-8");
}

export const localAuthRouter = createRouter({
  signup: publicQuery
    .input(
      z.object({
        fullName: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
        country: z.string().optional(),
        currency: z.string().default("USD"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      // Check if user exists
      const existing = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.email, input.email));
      if (existing.length > 0) {
        throw new Error("An account with this email already exists");
      }

      const result = await db.insert(localUsers).values({
        fullName: input.fullName,
        email: input.email,
        password: encodePassword(input.password),
        role: "customer",
        country: input.country,
        currency: input.currency,
      });

      const user = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.id, Number(result[0].insertId)));

      return { user: user[0] };
    }),

  login: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const rows = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.email, input.email));

      if (rows.length === 0) {
        throw new Error("Invalid email or password");
      }

      const user = rows[0];
      if (decodePassword(user.password) !== input.password) {
        throw new Error("Invalid email or password");
      }

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      void password;
      return { user: userWithoutPassword };
    }),

  me: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.id, input.userId));
      if (rows.length === 0) return null;
      const { password, ...userWithoutPassword } = rows[0];
      void password;
      return userWithoutPassword;
    }),

  list: publicQuery.query(async () => {
    const db = getDb();
    const rows = await db.select().from(localUsers);
    return rows.map((u) => {
      const { password, ...without } = u;
      void password;
      return without;
    });
  }),

  updateRole: publicQuery
    .input(
      z.object({
        id: z.number(),
        role: z.enum(["customer", "admin"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(localUsers)
        .set({ role: input.role })
        .where(eq(localUsers.id, input.id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(localUsers).where(eq(localUsers.id, input.id));
      return { success: true };
    }),
});
