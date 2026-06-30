import { z } from "zod";
import * as cookie from "cookie";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { localUsers } from "@db/schema";
import { eq } from "drizzle-orm";
import { getSessionCookieOptions } from "./lib/cookies";
import { signLocalSession, LOCAL_SESSION_COOKIE } from "./lib/localSession";
import { generateId } from "@/utils/validators";

// Simple base64 encode/decode for demo (replace with bcrypt in production)
function encodePassword(password: string): string {
  return Buffer.from(password).toString("base64");
}

function decodePassword(encoded: string): string {
  return Buffer.from(encoded, "base64").toString("utf-8");
}

function stripPassword<T extends { password: string }>(user: T): Omit<T, "password"> {
  const { password: _p, ...rest } = user;
  void _p;
  return rest;
}

export const localAuthRouter = createRouter({
  signup: publicQuery
    .input(
      z.object({
        id: z.string().min(1).optional(),
        fullName: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
        role: z.enum(["customer", "admin"]).optional(),
        country: z.string().optional(),
        region: z.string().optional(),
        currency: z.string().default("USD"),
        passwordIsEncoded: z.boolean().optional(),
        skipCookie: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.email, input.email));
      if (existing.length > 0) {
        throw new Error("An account with this email already exists");
      }

      const id = input.id ?? generateId();
      const role = input.role ?? "customer";
      const password = input.passwordIsEncoded ? input.password : encodePassword(input.password);
      await db.insert(localUsers).values({
        id,
        fullName: input.fullName,
        email: input.email,
        password,
        role,
        country: input.country,
        region: input.region,
        currency: input.currency,
      });

      if (!input.skipCookie) {
        const token = await signLocalSession(id);
        const opts = getSessionCookieOptions(ctx.req.headers);
        ctx.resHeaders.append(
          "set-cookie",
          cookie.serialize(LOCAL_SESSION_COOKIE, token, {
            ...opts,
            maxAge: 30 * 24 * 60 * 60,
          } as any)
        );
      }

      const user = await db.select().from(localUsers).where(eq(localUsers.id, id));
      return { user: stripPassword(user[0]) };
    }),

  login: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
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

      const token = await signLocalSession(user.id);
      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(LOCAL_SESSION_COOKIE, token, {
          ...opts,
          maxAge: 30 * 24 * 60 * 60,
        } as any)
      );

      return { user: stripPassword(user) };
    }),

  logout: publicQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(LOCAL_SESSION_COOKIE, "", {
        ...opts,
        maxAge: 0,
      } as any)
    );
    return { success: true };
  }),

  me: publicQuery
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.id, input.userId));
      if (rows.length === 0) return null;
      return stripPassword(rows[0]);
    }),

  list: publicQuery.query(async () => {
    const db = getDb();
    const rows = await db.select().from(localUsers);
    return rows.map((u) => stripPassword(u));
  }),

  update: publicQuery
    .input(
      z.object({
        id: z.string().min(1),
        data: z.object({
          fullName: z.string().optional(),
          email: z.string().email().optional(),
          country: z.string().optional(),
          region: z.string().optional(),
          currency: z.string().optional(),
          profileImage: z.string().optional(),
          role: z.enum(["customer", "admin"]).optional(),
          requiresPasswordChange: z.boolean().optional(),
          passwordResetToken: z.string().optional(),
          passwordResetExpires: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(localUsers).set(input.data).where(eq(localUsers.id, input.id));
      return { success: true };
    }),

  changePassword: publicQuery
    .input(
      z.object({
        id: z.string().min(1),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(localUsers)
        .set({
          password: encodePassword(input.password),
          passwordResetToken: null,
          passwordResetExpires: null,
          requiresPasswordChange: false,
        })
        .where(eq(localUsers.id, input.id));
      return { success: true };
    }),

  updateRole: adminQuery
    .input(
      z.object({
        id: z.string().min(1),
        role: z.enum(["customer", "admin"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(localUsers).set({ role: input.role }).where(eq(localUsers.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(localUsers).where(eq(localUsers.id, input.id));
      return { success: true };
    }),
});
