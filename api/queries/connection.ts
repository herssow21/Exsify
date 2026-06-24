import { drizzle } from "drizzle-orm/mysql2";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

type DbInstance = ReturnType<typeof drizzle<typeof fullSchema>>;

let instance: DbInstance | null = null;
let initError: string | null = null;

export function getDb(): DbInstance {
  if (initError) {
    throw new Error(initError);
  }
  if (!instance) {
    const url = env.databaseUrl;
    if (!url) {
      initError =
        "DATABASE_URL is not set. " +
        "Please create a .env file in your project root with:\n" +
        'DATABASE_URL=mysql://user:password@host:port/database';
      throw new Error(initError);
    }
    instance = drizzle(url, {
      mode: "planetscale",
      schema: fullSchema,
    });
  }
  return instance;
}
