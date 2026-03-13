import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { TopBar } from "@/components/layout/top-bar";
import { ItemListJsonLd, BreadcrumbJsonLd } from "@/components/seo/structured-data";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
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

      <div className="flex flex-1 flex-col">
        {/* ═══════════════════════════════════════════
            HERO HEADER
            ═══════════════════════════════════════════ */}
        <div className="relative overflow-hidden border-b border-border">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)" }}
          />

          <div className="relative px-6 md:px-8 py-10 md:py-14">
            <div className="mb-5 animate-fade-up">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 group"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Blog
              </Link>
            </div>

            <div className="flex items-center gap-4 animate-fade-up-delay-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                <Tag className="size-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    {categoryName}
                  </span>
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {posts.length} article{posts.length !== 1 ? "s" : ""} in this category
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-8 py-8 md:py-10 space-y-8">
          {/* ═══════════════════════════════════════════
              CATEGORY PILLS
              ═══════════════════════════════════════════ */}
          <div className="flex flex-wrap gap-2 animate-fade-up">
            <Link
              href="/blog"
              className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-medium bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all duration-300"
            >
              All Posts
            </Link>
            {allCategories.map((cat) => (
              <Link
                key={cat}
                href={`/blog/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                  cat.toLowerCase() === categoryName.toLowerCase()
                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_oklch(0.68_0.24_290_/_0.3)]"
                    : "bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* ═══════════════════════════════════════════
              POSTS GRID
              ═══════════════════════════════════════════ */}
          {posts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <article
                    className="relative h-full flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_0_1px_oklch(0.68_0.24_290_/_0.08),0_12px_40px_oklch(0_0_0_/_0.3),0_0_60px_oklch(0.68_0.24_290_/_0.06)] hover:-translate-y-1 animate-fade-up"
                  >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

                    {post.frontmatter.image && (
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={post.frontmatter.image}
                          alt={post.frontmatter.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#161224] via-transparent to-transparent" />

                        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-white/90 border border-white/10">
                          <Clock className="size-3" />
                          {post.readingTime}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col flex-1 p-5">
                      {(post.frontmatter.categories ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {post.frontmatter.categories!.map((cat) => (
                            <span
                              key={cat}
                              className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                        <Calendar className="size-3" />
                        {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>

                      <h3 className="text-base font-bold leading-snug mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {post.frontmatter.title}
                      </h3>

                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-1">
                        {post.frontmatter.meta_description ?? ""}
                      </p>

                      <div className="flex items-center gap-2 text-xs font-semibold text-primary/70 group-hover:text-primary transition-all duration-300">
                        <span>Read article</span>
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="relative mb-8">
                <div
                  className="absolute inset-0 rounded-full blur-3xl opacity-30 scale-150"
                  style={{
                    background:
                      "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
                  }}
                />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-card border border-primary/20">
                  <Tag className="h-8 w-8 text-primary/50" />
                </div>
              </div>
              <h3 className="text-lg font-bold tracking-tight mb-2">No articles found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                No articles in this category yet.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                View all articles
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
