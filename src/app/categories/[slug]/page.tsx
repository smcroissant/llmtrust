import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { ModelGrid } from "@/components/models/model-grid";
import { ItemListJsonLd, BreadcrumbJsonLd } from "@/components/seo/structured-data";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import { serverCaller } from "@/server/api/caller";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug.replace(/-/g, " ");

  return generatePageMetadata({
    title: `${categoryName} LLMs`,
    description: `Browse and compare open-source ${categoryName} large language models. Find the best ${categoryName} models for local AI.`,
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
    // Also try the slug directly as category
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/categories"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 capitalize">{categoryName} Models</h1>
          <p className="text-muted-foreground">
            {models.length} open-source model{models.length !== 1 ? "s" : ""} in this category
          </p>
        </div>

        {transformedModels.length > 0 ? (
          <ModelGrid models={transformedModels} />
        ) : (
          <p className="text-muted-foreground text-center py-20">
            No models found in this category.
          </p>
        )}
      </div>
    </>
  );
}
