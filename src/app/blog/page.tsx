import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { TopBar } from "@/components/layout/top-bar";
import { ItemListJsonLd, BreadcrumbJsonLd } from "@/components/seo/structured-data";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle, GlowCardDescription } from "@/components/ui/glow-card";
import { getAllBlogPostsMeta, getAllBlogCategories } from "@/lib/blog";
import { BookOpen, Clock, Calendar, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "LLM Blog — Guides, Comparisons & AI Insights",
  description: "Expert guides on open-source LLMs: model comparisons, benchmark analysis, local deployment tips & industry insights. Updated weekly.",
  canonical: canonicalUrl("/blog"),
});

const POSTS_PER_PAGE = 6;

export default function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return <BlogPageContent searchParams={searchParams} />;
}

async function BlogPageContent({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10));
  const posts = getAllBlogPostsMeta();
  const categories = getAllBlogCategories();

  // Featured = first (newest) post
  const featured = posts[0];
  const remainingPosts = posts.slice(1);

  // Pagination
  const totalPages = Math.ceil(remainingPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = remainingPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const itemListEntries = posts.map((post) => ({
    name: post.frontmatter.title,
    url: `https://llmtrust.com/blog/${post.slug}`,
    description: post.frontmatter.meta_description ?? post.frontmatter.title,
  }));

  return (
    <>
      <ItemListJsonLd
        name="LLM Trust Blog"
        description="Articles, guides, and insights about open-source LLMs"
        items={itemListEntries}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://llmtrust.com" },
          { name: "Blog", url: "https://llmtrust.com/blog" },
        ]}
      />
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-8 p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
            <BookOpen className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Guides, comparisons, and insights about open-source LLMs
            </p>
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blog"
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              All Posts
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/blog/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted text-muted-foreground border border-border hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        )}

        {/* Decorative line */}
        <div className="neural-line" />

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="relative mb-6">
              <div
                className="absolute inset-0 rounded-full blur-2xl opacity-20"
                style={{
                  background:
                    "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
                }}
              />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold tracking-tight mb-2">Coming soon</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              We&apos;re working on exciting content about open-source LLMs. Stay tuned!
            </p>
          </div>
        )}

        {/* Featured Article */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group block"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_0_1px_oklch(0.68_0.24_290_/_0.08),0_8px_24px_oklch(0_0_0_/_0.2),0_0_40px_oklch(0.68_0.24_290_/_0.06)]">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Cover Image */}
                {featured.frontmatter.image && (
                  <div className="relative aspect-video md:aspect-auto overflow-hidden bg-muted">
                    <Image
                      src={featured.frontmatter.image}
                      alt={featured.frontmatter.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent md:bg-gradient-to-r" />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary border border-primary/20">
                      <Sparkles className="size-3" />
                      Featured
                    </span>
                    {(featured.frontmatter.categories ?? []).map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold tracking-tight leading-tight mb-3 group-hover:text-primary transition-colors">
                    {featured.frontmatter.title}
                  </h2>

                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {featured.frontmatter.meta_description ?? ""}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(featured.frontmatter.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-border">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {featured.readingTime}
                    </span>
                    <span className="text-border">·</span>
                    <span className="inline-flex items-center gap-1 text-primary font-medium">
                      Read article
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Posts Grid */}
        {paginatedPosts.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block animate-fade-up"
                style={{ animationDelay: `${index * 0.08}s`, animationFillMode: "both" }}
              >
                <GlowCard className="h-full flex flex-col overflow-hidden">
                  {/* Cover Image */}
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
                    {/* Categories */}
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

                    {/* Date + Reading Time */}
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
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            {currentPage > 1 && (
              <Link
                href={`/blog?page=${currentPage - 1}`}
                className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                ← Previous
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Link
                key={pageNum}
                href={`/blog?page=${pageNum}`}
                className={`inline-flex items-center justify-center size-9 rounded-lg text-sm font-medium transition-colors ${
                  pageNum === currentPage
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {pageNum}
              </Link>
            ))}

            {currentPage < totalPages && (
              <Link
                href={`/blog?page=${currentPage + 1}`}
                className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
