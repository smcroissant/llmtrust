import { init } from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN;

if (SENTRY_DSN) {
  init({
    dsn: SENTRY_DSN,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    debug: false,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 0.1,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
  });
}
