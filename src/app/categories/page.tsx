import type { Metadata } from "next";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { ItemListJsonLd } from "@/components/seo/structured-data";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import { serverCaller } from "@/server/api/caller";
import { Tag } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Browse LLM Categories",
  description:
    "Explore open-source LLMs by category: text generation, code, vision, embeddings, and more. Find the right model for your use case.",
  canonical: canonicalUrl("/categories"),
});

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
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Tag className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
            <p className="text-sm text-muted-foreground">
              Browse models by category and use case
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {safeCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col gap-2 rounded-xl border p-5 transition-colors hover:bg-muted/50"
            >
              <h2 className="font-semibold capitalize group-hover:text-primary transition-colors">
                {cat.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {cat.count} model{cat.count !== 1 ? "s" : ""}
              </p>
            </Link>
          ))}
          {safeCategories.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center py-10">
              No categories found.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
