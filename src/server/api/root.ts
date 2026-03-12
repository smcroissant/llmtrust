import { createTRPCRouter } from "./trpc";
import { modelsRouter } from "./routers/models";
import { userRouter } from "./routers/user";
import { reviewsRouter } from "./routers/reviews";
import { adminRouter } from "./routers/admin";
import { newsletterRouter } from "./routers/newsletter";

export const appRouter = createTRPCRouter({
  models: modelsRouter,
  user: userRouter,
  reviews: reviewsRouter,
  admin: adminRouter,
  newsletter: newsletterRouter,
});

export type AppRouter = typeof appRouter;
