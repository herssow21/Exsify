import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { Paths } from "@contracts/constants";
import { getDb } from "./queries/connection";
import { uploads } from "@db/schema";
import { writeFile, unlink, readFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import { join, resolve } from "path";
import { lookup } from "mime-types";
import crypto from "crypto";
import { eq } from "drizzle-orm";

const UPLOAD_DIR = join(process.cwd(), "uploads");
if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });

function getMimeCategory(mime: string): "image" | "document" | "archive" | "other" {
  if (mime.startsWith("image/")) return "image";
  if (mime.includes("pdf") || mime.includes("doc") || mime.includes("text")) return "document";
  if (mime.includes("zip") || mime.includes("tar") || mime.includes("rar")) return "archive";
  return "other";
}

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// Custom file serving for uploads (works on all platforms, dev + production)
app.get("/uploads/*", async (c) => {
  try {
    const url = new URL(c.req.url);
    const fileName = url.pathname.replace("/uploads/", "").split("/").pop();
    if (!fileName || fileName.includes("..") || fileName.includes("~")) {
      return c.json({ error: "Invalid filename" }, 400);
    }
    const filePath = resolve(UPLOAD_DIR, fileName);
    // Security: ensure file is inside uploads directory
    if (!filePath.startsWith(resolve(UPLOAD_DIR))) {
      return c.json({ error: "Access denied" }, 403);
    }
    if (!existsSync(filePath)) {
      return c.json({ error: "File not found" }, 404);
    }
    const content = await readFile(filePath);
    const mimeType = lookup(filePath) || "application/octet-stream";
    c.header("Content-Type", mimeType);
    c.header("Cache-Control", "public, max-age=86400");
    return c.body(content);
  } catch {
    return c.json({ error: "Failed to serve file" }, 500);
  }
});

// File upload endpoint
app.post("/api/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File | null;
    const uploadedBy = (formData.get("uploadedBy") as string) || "admin";

    if (!file || file.size === 0) {
      return c.json({ error: "No file provided" }, 400);
    }

    if (file.size > 20 * 1024 * 1024) {
      return c.json({ error: "File too large. Maximum size is 20MB" }, 400);
    }

    const ext = file.name.split(".").pop() || "bin";
    const hash = crypto.randomBytes(8).toString("hex");
    const fileName = `${Date.now()}-${hash}.${ext}`;
    const filePath = join(UPLOAD_DIR, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const type = getMimeCategory(file.type);

    const db = getDb();
    const url = `/uploads/${fileName}`;
    const result = await db.insert(uploads).values({
      originalName: file.name,
      fileName,
      mimeType: file.type,
      size: file.size,
      url,
      type,
      uploadedBy,
    });

    return c.json({
      success: true,
      id: Number(result[0].insertId),
      url,
      originalName: file.name,
      fileName,
      size: file.size,
      type,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return c.json({ error: "Upload failed" }, 500);
  }
});

// Delete uploaded file
app.delete("/api/upload/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const db = getDb();
    const rows = await db.select().from(uploads).where(eq(uploads.id, id));

    if (rows.length === 0) {
      return c.json({ error: "File not found" }, 404);
    }

    const upload = rows[0];
    const filePath = join(UPLOAD_DIR, upload.fileName);

    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    await db.delete(uploads).where(eq(uploads.id, id));

    return c.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return c.json({ error: "Delete failed" }, 500);
  }
});

// OAuth callback
app.get(Paths.oauthCallback, createOAuthCallbackHandler());

// tRPC handler
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
