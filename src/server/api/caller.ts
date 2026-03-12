import { createCallerFactory } from "./trpc";
import { appRouter } from "./root";

/**
 * Server-side tRPC caller for use in Server Components and API routes.
 * Provides direct access to tRPC procedures without going through HTTP.
 */
export const serverCaller = createCallerFactory(appRouter)({});
