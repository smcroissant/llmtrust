import { createTRPCRouter } from "./trpc";
import { modelsRouter } from "./routers/models";
import { userRouter } from "./routers/user";
import { reviewsRouter } from "./routers/reviews";

export const appRouter = createTRPCRouter({
  models: modelsRouter,
  user: userRouter,
  reviews: reviewsRouter,
});

export type AppRouter = typeof appRouter;
