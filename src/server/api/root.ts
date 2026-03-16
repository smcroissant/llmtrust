import { createTRPCRouter } from "./trpc";
import { modelsRouter } from "./routers/models";
import { userRouter } from "./routers/user";
import { reviewsRouter } from "./routers/reviews";
import { adminRouter } from "./routers/admin";
import { newsletterRouter } from "./routers/newsletter";
import { notificationsRouter } from "./routers/notifications";
import { billingRouter } from "./routers/billing";
import { trustScoresRouter } from "./routers/trust-scores";
import { tacRouter } from "./routers/tac";

export const appRouter = createTRPCRouter({
  models: modelsRouter,
  user: userRouter,
  reviews: reviewsRouter,
  admin: adminRouter,
  newsletter: newsletterRouter,
  notifications: notificationsRouter,
  billing: billingRouter,
  trustScores: trustScoresRouter,
  tac: tacRouter,
});

export type AppRouter = typeof appRouter;
