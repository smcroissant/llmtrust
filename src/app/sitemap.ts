import type { MetadataRoute } from "next";

// Static pages for sitemap
const staticPages = [
  { url: "/", priority: 1.0, changeFrequency: "daily" as const },
  { url: "/models", priority: 0.9, changeFrequency: "daily" as const },
  { url: "/categories", priority: 0.7, changeFrequency: "weekly" as const },
  { url: "/compare", priority: 0.7, changeFrequency: "weekly" as const },
  { url: "/docs", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/docs/api", priority: 0.8, changeFrequency: "monthly" as const },
  { url: "/about", priority: 0.4, changeFrequency: "monthly" as const },
  { url: "/contact", priority: 0.3, changeFrequency: "monthly" as const },
  { url: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
  { url: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
];

// Static model slugs (will be replaced by DB query)
const modelSlugs = [
  "llama-3-8b",
  "mistral-7b",
  "phi-3-mini",
  "gemma-2b",
  "codellama-13b",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://llmtrust.com";

  const staticEntries = staticPages.map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const modelEntries = modelSlugs.map((slug) => ({
    url: `${baseUrl}/models/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...modelEntries];
}
