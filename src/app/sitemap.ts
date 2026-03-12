import type { MetadataRoute } from "next";
import { serverCaller } from "@/server/api/caller";

const BASE_URL = "https://llmtrust.com";

// Blog posts (would come from DB/CMS in production)
const blogSlugs = [
  "ultimate-guide-open-source-llms-2026",
  "run-llama-3-locally-complete-guide",
  "gpt-4-vs-claude-3-vs-llama-3-comparison",
  "best-small-language-models-laptop",
  "understanding-llm-benchmarks-mmlu-humaneval",
];

// Static pages for sitemap
const staticPages: {
  url: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { url: "/", priority: 1.0, changeFrequency: "daily" },
  { url: "/models", priority: 0.9, changeFrequency: "daily" },
  { url: "/categories", priority: 0.7, changeFrequency: "weekly" },
  { url: "/compare", priority: 0.7, changeFrequency: "weekly" },
  { url: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { url: "/docs", priority: 0.6, changeFrequency: "monthly" },
  { url: "/docs/api", priority: 0.8, changeFrequency: "monthly" },
  { url: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { url: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static entries
  const staticEntries = staticPages.map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // Model entries from DB
  let modelEntries: MetadataRoute.Sitemap = [];
  try {
    const { models } = await serverCaller.models.list({ limit: 100 });
    modelEntries = models.map((m) => ({
      url: `${BASE_URL}/models/${m.slug}`,
      lastModified: m.updatedAt ? new Date(m.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // Fallback: no model entries if DB is unavailable
  }

  // Category entries from DB
  let categoryEntries: MetadataRoute.Sitemap = [];
  try {
    const categories = await serverCaller.models.categories();
    categoryEntries = categories.map((cat) => ({
      url: `${BASE_URL}/categories/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // Fallback
  }

  // Blog entries
  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticEntries,
    ...modelEntries,
    ...categoryEntries,
    ...blogEntries,
  ];
}
