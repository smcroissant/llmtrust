import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";

export function getTRPCUrl() {
  const base = (() => {
    if (typeof window !== "undefined") return "";
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return "http://localhost:3000";
  })();
  return `${base}/api/trpc`;
}

export const trpcClientConfig = {
  links: [
    httpBatchLink({
      url: getTRPCUrl(),
      transformer: superjson,
    }),
  ],
};
