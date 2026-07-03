import { authRouter } from "./auth-router";
import { localAuthRouter } from "./local-auth-router";
import { appRouter as appItemRouter } from "./app-router";
import { reviewRouter } from "./review-router";
import { consultationRouter } from "./consultation-router";
import { newsRouter } from "./news-router";
import { careerRouter } from "./career-router";
import { uploadRouter } from "./upload-router";
import { downloadRouter } from "./download-router";
import { jobApplicationRouter } from "./job-application-router";
import { favoriteRouter } from "./favorite-router";
import { visitRouter } from "./visit-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  apps: appItemRouter,
  review: reviewRouter,
  consultation: consultationRouter,
  news: newsRouter,
  careers: careerRouter,
  upload: uploadRouter,
  download: downloadRouter,
  jobApplications: jobApplicationRouter,
  favorite: favoriteRouter,
  visit: visitRouter,
});

export type AppRouter = typeof appRouter;
