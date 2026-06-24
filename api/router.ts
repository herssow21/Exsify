import { authRouter } from "./auth-router";
import { localAuthRouter } from "./local-auth-router";
import { appRouter as appItemRouter } from "./app-router";
import { reviewRouter } from "./review-router";
import { consultationRouter } from "./consultation-router";
import { newsRouter } from "./news-router";
import { uploadRouter } from "./upload-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  apps: appItemRouter,
  review: reviewRouter,
  consultation: consultationRouter,
  news: newsRouter,
  upload: uploadRouter,
});

export type AppRouter = typeof appRouter;
