import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";

// Load .env from project root (works on all platforms)
const __dirname = fileURLToPath(new URL("../..", import.meta.url));
config({ path: resolve(__dirname, ".env") });

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.warn(`[env] Warning: ${name} is not set`);
  }
  return value ?? "";
}

export const env = {
  appId: getEnv("APP_ID"),
  appSecret: getEnv("APP_SECRET"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: getEnv("DATABASE_URL"),
  kimiAuthUrl: getEnv("KIMI_AUTH_URL"),
  kimiOpenUrl: getEnv("KIMI_OPEN_URL"),
  ownerUnionId: process.env.OWNER_UNION_ID ?? "",
};
