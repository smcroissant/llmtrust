import { createTRPCRouter } from "./trpc";
import { modelsRouter } from "./routers/models";
import { userRouter } from "./routers/user";
import { reviewsRouter } from "./routers/reviews";
import { adminRouter } from "./routers/admin";

export const appRouter = createTRPCRouter({
  models: modelsRouter,
  user: userRouter,
  reviews: reviewsRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
