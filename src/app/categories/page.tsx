import type { Metadata } from "next";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { ItemListJsonLd } from "@/components/seo/structured-data";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import { serverCaller } from "@/server/api/caller";
import {
  GlowCard,
  GlowCardHeader,
  GlowCardContent,
  GlowCardTitle,
  GlowCardDescription,
} from "@/components/ui/glow-card";
import { Badge } from "@/components/ui/badge";
import {
  Tag,
  MessageSquareCode,
  Code2,
  Eye,
  Brain,
  AudioLines,
  Globe,
  Layers,
  Sparkles,
  SlidersHorizontal,
  Gauge,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Browse LLM Categories",
  description:
    "Explore open-source LLMs by category: chat, code, vision, embeddings, audio, and more. Find the right model for your use case.",
  canonical: canonicalUrl("/categories"),
});

// Curated category definitions with descriptions and icons
const CATEGORY_META: Record<
  string,
  { description: string; icon: LucideIcon; group: string }
> = {
  chat: {
    description:
      "Conversational AI models optimized for dialogue, instruction-following, and assistant tasks.",
    icon: MessageSquareCode,
    group: "Use Case",
  },
  code: {
    description:
      "Code generation, completion, and understanding models trained on programming languages.",
    icon: Code2,
    group: "Use Case",
  },
  vision: {
    description:
      "Multimodal models capable of understanding and generating images alongside text.",
    icon: Eye,
    group: "Use Case",
  },
  embedding: {
    description:
      "Models that convert text into dense vector representations for semantic search and RAG.",
    icon: Brain,
    group: "Use Case",
  },
  audio: {
    description:
      "Speech recognition, text-to-speech, and audio understanding models.",
    icon: AudioLines,
    group: "Use Case",
  },
  multilingual: {
    description:
      "Models trained across many languages for translation and cross-lingual tasks.",
    icon: Globe,
    group: "Use Case",
  },
  "foundation-model": {
    description:
      "Base models pre-trained on large corpora, ready for fine-tuning or direct use.",
    icon: Layers,
    group: "Type",
  },
  "fine-tuned": {
    description:
      "Specialized models adapted from foundation models for specific tasks or domains.",
    icon: SlidersHorizontal,
    group: "Type",
  },
  "small": {
    description:
      "Compact models (1-10B parameters) optimized for speed and edge deployment.",
    icon: Gauge,
    group: "Size",
  },
  "medium": {
    description:
      "Balanced models (10-70B parameters) offering strong performance with reasonable resource needs.",
    icon: Gauge,
    group: "Size",
  },
  "large": {
    description:
      "Flagship models (70B+ parameters) delivering maximum capability and quality.",
    icon: Sparkles,
    group: "Size",
  },
};

const DEFAULT_META = {
  description: "Explore models in this category.",
  icon: Tag,
  group: "Other",
};

export default async function CategoriesPage() {
  let categories: { name: string | null; slug: string | undefined; count: number }[] = [];
  try {
    categories = await serverCaller.models.categories();
  } catch {
    // fallback: empty list
  }

  const safeCategories = categories.filter(
    (c): c is { name: string; slug: string; count: number } =>
      !!c.name && !!c.slug
  );

  // Enrich with metadata
  const enriched = safeCategories.map((cat) => {
    const meta = CATEGORY_META[cat.slug] ?? DEFAULT_META;
    return { ...cat, ...meta };
  });

  // Group by group name
  const groups = enriched.reduce(
    (acc, cat) => {
      const g = cat.group;
      if (!acc[g]) acc[g] = [];
      acc[g].push(cat);
      return acc;
    },
    {} as Record<string, typeof enriched>
  );

  const itemListEntries = safeCategories.map((cat) => ({
    name: `${cat.name} Models`,
    url: `https://llmtrust.com/categories/${cat.slug}`,
    description: `${cat.count} open-source LLM models in the ${cat.name} category`,
  }));

  return (
    <>
      <ItemListJsonLd
        name="LLM Trust Model Categories"
        description="Browse open-source LLMs organized by category and use case"
        items={itemListEntries}
      />
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Categories" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-8 p-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Tag className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
            <p className="text-sm text-muted-foreground">
              Browse {safeCategories.length} categories across use cases, types, and sizes
            </p>
          </div>
        </div>

        {/* Grouped Categories */}
        {Object.entries(groups).map(([groupName, cats]) => (
          <section key={groupName} className="space-y-4">
            <h2 className="text-lg font-semibold text-muted-foreground uppercase tracking-wider text-xs">
              {groupName}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cats.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    className="group block h-full"
                  >
                    <GlowCard className="h-full">
                      <GlowCardHeader>
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                            <Icon className="size-4.5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <GlowCardTitle className="capitalize group-hover:text-primary transition-colors">
                              {cat.name}
                            </GlowCardTitle>
                            <GlowCardDescription className="mt-1">
                              {cat.description}
                            </GlowCardDescription>
                          </div>
                        </div>
                      </GlowCardHeader>
                      <GlowCardContent>
                        <Badge variant="secondary" className="text-xs">
                          {cat.count} model{cat.count !== 1 ? "s" : ""}
                        </Badge>
                      </GlowCardContent>
                    </GlowCard>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        {safeCategories.length === 0 && (
          <p className="text-muted-foreground text-center py-20">
            No categories found.
          </p>
        )}
      </div>
    </>
  );
}
