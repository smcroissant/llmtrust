import { type NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },

  // Security headers are handled by middleware.ts (src/middleware.ts)
  // which also handles rate limiting, CORS, and CSP.
  // This keeps headers configuration in one place.
};

export default nextConfig;
