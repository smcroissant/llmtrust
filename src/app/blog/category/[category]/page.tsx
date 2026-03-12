import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { TopBar } from "@/components/layout/top-bar";
import { ItemListJsonLd, BreadcrumbJsonLd } from "@/components/seo/structured-data";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle, GlowCardDescription } from "@/components/ui/glow-card";
import {
  getAllBlogCategorySlugs,
  categorySlugToName,
  getPostsByCategory,
  getAllBlogCategories,
} from "@/lib/blog";
import { ArrowLeft, ArrowRight, Clock, Calendar, Tag } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const categoryName = categorySlugToName(category);

  return generatePageMetadata({
    title: `${categoryName} — Blog`,
    description: `Browse all blog articles in the ${categoryName} category. Expert guides and insights about open-source LLMs.`,
    canonical: canonicalUrl(`/blog/category/${category}`),
  });
}

export async function generateStaticParams() {
  return getAllBlogCategorySlugs().map((category) => ({ category }));
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryName = categorySlugToName(category);
  const posts = getPostsByCategory(categoryName);
  const allCategories = getAllBlogCategories();

  if (posts.length === 0 && !allCategories.includes(categoryName)) {
    notFound();
  }

  const itemListEntries = posts.map((post) => ({
    name: post.frontmatter.title,
    url: `https://llmtrust.com/blog/${post.slug}`,
    description: post.frontmatter.meta_description ?? post.frontmatter.title,
  }));

  return (
    <>
      <ItemListJsonLd
        name={`${categoryName} Blog Articles`}
        description={`All articles in the ${categoryName} category`}
        items={itemListEntries}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://llmtrust.com" },
          { name: "Blog", url: "https://llmtrust.com/blog" },
          { name: categoryName, url: `https://llmtrust.com/blog/category/${category}` },
        ]}
      />
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: categoryName },
        ]}
      />
      <div className="flex flex-1 flex-col gap-8 p-6 md:p-8">
        {/* Back link */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
            <Tag className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{categoryName}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {posts.length} article{posts.length !== 1 ? "s" : ""} in this category
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted text-muted-foreground border border-border hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-colors"
          >
            All Posts
          </Link>
          {allCategories.map((cat) => (
            <Link
              key={cat}
              href={`/blog/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                cat.toLowerCase() === categoryName.toLowerCase()
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-muted text-muted-foreground border-border hover:bg-primary/10 hover:text-primary hover:border-primary/20"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Decorative line */}
        <div className="neural-line" />

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block animate-fade-up"
                style={{ animationDelay: `${index * 0.08}s`, animationFillMode: "both" }}
              >
                <GlowCard className="h-full flex flex-col overflow-hidden">
                  {post.frontmatter.image && (
                    <div className="relative aspect-video overflow-hidden bg-muted border-b border-border">
                      <Image
                        src={post.frontmatter.image}
                        alt={post.frontmatter.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}

                  <GlowCardHeader>
                    {(post.frontmatter.categories ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {post.frontmatter.categories!.map((cat) => (
                          <span
                            key={cat}
                            className="inline-flex items-center rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-medium text-primary/80"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-border">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {post.readingTime}
                      </span>
                    </div>
                    <GlowCardTitle className="text-base leading-snug group-hover:text-primary transition-colors">
                      {post.frontmatter.title}
                    </GlowCardTitle>
                    <GlowCardDescription className="line-clamp-3">
                      {post.frontmatter.meta_description ?? ""}
                    </GlowCardDescription>
                  </GlowCardHeader>
                  <GlowCardContent className="mt-auto">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Read article
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </GlowCardContent>
                </GlowCard>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground">No articles found in this category.</p>
            <Link href="/blog" className="mt-4 text-sm text-primary hover:underline">
              View all articles →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
