import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import * as cookie from "cookie";
import { authenticateRequest } from "./kimi/auth";
import { verifyLocalSession, LOCAL_SESSION_COOKIE } from "./lib/localSession";
import { getDb } from "./queries/connection";
import { localUsers } from "@db/schema";
import { eq } from "drizzle-orm";

export type TrpcUser = {
  id: number | string;
  role: string;
  name?: string | null;
  fullName?: string | null;
  email?: string | null;
  [key: string]: unknown;
};

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: TrpcUser;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  // Try Kimi OAuth session first
  try {
    const oauthUser = await authenticateRequest(opts.req.headers);
    if (oauthUser) {
      ctx.user = { ...oauthUser, role: oauthUser.role };
      return ctx;
    }
  } catch {
    // OAuth auth failed; try local session below
  }

  // Try local email/password session
  try {
    const cookies = cookie.parse(opts.req.headers.get("cookie") || "");
    const token = cookies[LOCAL_SESSION_COOKIE];
    if (token) {
      const userId = await verifyLocalSession(token);
      if (userId) {
        const db = getDb();
        const rows = await db.select().from(localUsers).where(eq(localUsers.id, userId));
        if (rows.length > 0) {
          const { password, ...withoutPassword } = rows[0];
          void password;
          ctx.user = { ...withoutPassword, role: withoutPassword.role };
        }
      }
    }
  } catch {
    // ignore local auth errors
  }

  return ctx;
}
