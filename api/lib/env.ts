import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";

// Load .env from project root (works on all platforms)
const __dirname = fileURLToPath(new URL("../..", import.meta.url));
config({ path: resolve(__dirname, ".env") });

const isProduction = process.env.NODE_ENV === "production";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value && isProduction) {
    console.warn(`[env] Warning: ${name} is not set`);
  }
  return value ?? "";
}

// Fallback secret for local development only. In production APP_SECRET must be set.
const appSecret =
  getEnv("APP_SECRET") ||
  (isProduction
    ? ""
    : "exsify-local-dev-secret-do-not-use-in-production");

export const env = {
  appId: getEnv("APP_ID"),
  appSecret,
  isProduction,
  databaseUrl: getEnv("DATABASE_URL"),
  kimiAuthUrl: getEnv("KIMI_AUTH_URL"),
  kimiOpenUrl: getEnv("KIMI_OPEN_URL"),
  ownerUnionId: process.env.OWNER_UNION_ID ?? "",
};
