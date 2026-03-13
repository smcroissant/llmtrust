import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { ItemListJsonLd, BreadcrumbJsonLd } from "@/components/seo/structured-data";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import { serverCaller } from "@/server/api/caller";
import { CategoryPageClient } from "./category-client";
import {
  MessageSquareCode,
  Code2,
  Eye,
  Brain,
  AudioLines,
  Globe,
  Layers,
  SlidersHorizontal,
  Gauge,
  Sparkles,
  Tag,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_META: Record<
  string,
  { description: string; longDescription: string; icon: LucideIcon }
> = {
  chat: {
    description:
      "Conversational AI models optimized for dialogue and instruction-following.",
    longDescription:
      "Chat models are trained or fine-tuned specifically for multi-turn conversations. They excel at following instructions, maintaining context, and producing helpful, coherent responses.",
    icon: MessageSquareCode,
  },
  code: {
    description:
      "Code generation, completion, and understanding models.",
    longDescription:
      "Code models are trained on large codebases across many programming languages. They can generate code, complete snippets, explain logic, debug, and translate between languages.",
    icon: Code2,
  },
  vision: {
    description:
      "Multimodal models that understand and reason about images.",
    longDescription:
      "Vision-language models can process both text and images, enabling tasks like visual question answering, image captioning, document analysis, and visual reasoning.",
    icon: Eye,
  },
  embedding: {
    description:
      "Models that produce dense vector representations for semantic search.",
    longDescription:
      "Embedding models convert text into high-dimensional vectors that capture semantic meaning. Essential for RAG pipelines, semantic search, clustering, and recommendation systems.",
    icon: Brain,
  },
  audio: {
    description:
      "Speech recognition, TTS, and audio understanding.",
    longDescription:
      "Audio models handle speech-to-text, text-to-speech, speaker identification, and audio classification. Some support real-time transcription and multilingual speech.",
    icon: AudioLines,
  },
  multilingual: {
    description:
      "Models trained across many languages for cross-lingual tasks.",
    longDescription:
      "Multilingual models support dozens or hundreds of languages, enabling translation, cross-lingual retrieval, and multilingual content generation.",
    icon: Globe,
  },
  "foundation-model": {
    description:
      "Base models pre-trained on large corpora.",
    longDescription:
      "Foundation models are large-scale pretrained models that serve as the starting point for fine-tuning. They have broad capabilities across many tasks.",
    icon: Layers,
  },
  "fine-tuned": {
    description:
      "Specialized models adapted for specific tasks or domains.",
    longDescription:
      "Fine-tuned models are foundation models that have been further trained on domain-specific data to excel at particular tasks like medical Q&A, legal analysis, or code generation.",
    icon: SlidersHorizontal,
  },
  small: {
    description: "Compact models (1-10B parameters) for edge deployment.",
    longDescription:
      "Small models trade some capability for speed and efficiency. They run on consumer hardware, mobile devices, and edge deployments while still delivering useful performance.",
    icon: Gauge,
  },
  medium: {
    description: "Balanced models (10-70B) with strong performance.",
    longDescription:
      "Medium models offer an excellent balance between capability and resource requirements. They deliver high-quality outputs suitable for most production workloads.",
    icon: Gauge,
  },
  large: {
    description: "Flagship models (70B+) for maximum quality.",
    longDescription:
      "Large models represent the frontier of open-source AI. They require significant compute but deliver the highest quality outputs, rivaling proprietary models.",
    icon: Sparkles,
  },
};

const DEFAULT_META = {
  description: "Explore models in this category.",
  longDescription: "Browse open-source large language models in this category.",
  icon: Tag,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = CATEGORY_META[slug] ?? DEFAULT_META;
  const categoryName = slug.replace(/-/g, " ");

  return generatePageMetadata({
    title: `${categoryName} LLMs`,
    description: meta.description,
    canonical: canonicalUrl(`/categories/${slug}`),
    type: "website",
  });
}

export async function generateStaticParams() {
  try {
    const categories = await serverCaller.models.categories();
    return categories
      .filter((c): c is { name: string; slug: string; count: number } => !!c.slug)
      .map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = CATEGORY_META[slug] ?? DEFAULT_META;
  const categoryName = slug.replace(/-/g, " ");

  let models: {
    id: string;
    slug: string;
    name: string;
    description: string;
    parameterCount: string | null;
    architecture: string | null;
    category: string | null;
    downloadCount: number;
    license: string | null;
    tags: unknown;
  }[] = [];

  try {
    const result = await serverCaller.models.list({
      category: categoryName,
      limit: 50,
      sort: "popular",
    });
    models = result.models;
  } catch {
    // fallback
  }

  if (models.length === 0) {
    try {
      const result = await serverCaller.models.list({
        category: slug,
        limit: 50,
        sort: "popular",
      });
      models = result.models;
    } catch {
      // fallback
    }
  }

  const modelEntries = models.map((m) => ({
    name: m.name,
    url: `https://llmtrust.com/models/${m.slug}`,
    description: m.description,
  }));

  const transformedModels = models.map((m) => ({
    id: m.id,
    slug: m.slug,
    name: m.name,
    description: m.description,
    parameterCount: m.parameterCount ?? "",
    architecture: m.architecture ?? "",
    category: m.category ?? "",
    downloadCount: m.downloadCount,
    license: m.license ?? "",
    tags: (m.tags as string[]) ?? [],
  }));

  const Icon = meta.icon;

  return (
    <>
      <ItemListJsonLd
        name={`${categoryName} LLMs`}
        description={`All open-source ${categoryName} large language models available on LLM Trust`}
        items={modelEntries}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://llmtrust.com" },
          { name: "Categories", url: "https://llmtrust.com/categories" },
          { name: categoryName, url: `https://llmtrust.com/categories/${slug}` },
        ]}
      />
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: categoryName },
        ]}
      />

      {/* Server-rendered header with SEO content */}
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Category Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="size-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight capitalize">
              {categoryName} Models
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {meta.longDescription}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {models.length} open-source model{models.length !== 1 ? "s" : ""} available
            </p>
          </div>
          <Link
            href="/categories"
            className="shrink-0 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← All Categories
          </Link>
        </div>

        {/* Client-side filters + model grid */}
        <CategoryPageClient
          slug={slug}
          categoryName={categoryName}
          initialModels={transformedModels}
        />
      </div>
    </>
  );
}
