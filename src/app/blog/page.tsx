import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { TopBar } from "@/components/layout/top-bar";
import { ItemListJsonLd, BreadcrumbJsonLd } from "@/components/seo/structured-data";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import { getAllBlogPostsMeta, getAllBlogCategories } from "@/lib/blog";
import { BookOpen, Clock, Calendar, ArrowRight, Sparkles, Zap } from "lucide-react";

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

  const featured = posts[0];
  const remainingPosts = posts.slice(1);

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

      <div className="flex flex-1 flex-col">
        {/* ═══════════════════════════════════════════
            HERO HEADER with gradient backdrop
            ═══════════════════════════════════════════ */}
        <div className="relative overflow-hidden border-b border-border">
          {/* Animated gradient orbs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)" }}
          />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)" }}
          />

          <div className="relative px-6 md:px-8 py-12 md:py-16">
            <div className="max-w-5xl">
              <div className="flex items-center gap-3 mb-4 animate-fade-up">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                  <BookOpen className="size-5 text-primary" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
                  Knowledge Hub
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4 animate-fade-up-delay-1">
                <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                  LLM Intelligence
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary via-primary to-[#F59E0B] bg-clip-text text-transparent">
                  Delivered Weekly
                </span>
              </h1>

              <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed animate-fade-up-delay-2">
                Expert guides on open-source models, benchmark deep-dives, and deployment strategies.
                Everything you need to master local LLMs.
              </p>

              {/* Stats bar */}
              <div className="flex flex-wrap gap-6 mt-8 animate-fade-up-delay-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="size-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">{posts.length}+</div>
                    <div className="text-xs text-muted-foreground">Articles</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                    <Sparkles className="size-4 text-[#F59E0B]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">{categories.length}</div>
                    <div className="text-xs text-muted-foreground">Categories</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <BookOpen className="size-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">Weekly</div>
                    <div className="text-xs text-muted-foreground">Updates</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-8 py-8 md:py-10 space-y-10">
          {/* ═══════════════════════════════════════════
              CATEGORY PILLS
              ═══════════════════════════════════════════ */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 animate-fade-up">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold bg-primary text-primary-foreground shadow-[0_0_20px_oklch(0.68_0.24_290_/_0.3)] transition-all hover:shadow-[0_0_30px_oklch(0.68_0.24_290_/_0.5)]"
              >
                All Posts
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-medium bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}

          {/* ═══════════════════════════════════════════
              EMPTY STATE
              ═══════════════════════════════════════════ */}
          {posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="relative mb-8">
                <div
                  className="absolute inset-0 rounded-full blur-3xl opacity-30 scale-150"
                  style={{
                    background:
                      "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
                  }}
                />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-card border border-primary/20">
                  <BookOpen className="h-10 w-10 text-primary/50" />
                </div>
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-3">Coming soon</h3>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                We&apos;re crafting exciting content about open-source LLMs. Stay tuned!
              </p>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              FEATURED ARTICLE — Hero Card
              ═══════════════════════════════════════════ */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group block animate-fade-up"
            >
              <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-card transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_0_1px_oklch(0.68_0.24_290_/_0.1),0_20px_60px_oklch(0_0_0_/_0.4),0_0_80px_oklch(0.68_0.24_290_/_0.08)]">
                {/* Top gradient line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

                <div className="grid md:grid-cols-5 gap-0">
                  {/* Cover Image — takes 3 cols */}
                  {featured.frontmatter.image && (
                    <div className="relative md:col-span-3 aspect-video md:aspect-auto overflow-hidden">
                      <Image
                        src={featured.frontmatter.image}
                        alt={featured.frontmatter.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 60vw"
                        priority
                      />
                      {/* Multi-layer overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B14] via-[#0D0B14]/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#161224]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B14]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  )}

                  {/* Content — takes 2 cols */}
                  <div className="md:col-span-2 p-6 md:p-10 flex flex-col justify-center relative">
                    {/* Subtle inner glow */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-32 h-32 rounded-full opacity-10 blur-3xl pointer-events-none"
                      style={{ background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)" }}
                    />

                    <div className="relative">
                      {/* Badges */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary border border-primary/25 shadow-[0_0_12px_oklch(0.68_0.24_290_/_0.15)]">
                          <Sparkles className="size-3" />
                          Featured
                        </span>
                        {(featured.frontmatter.categories ?? []).slice(0, 2).map((cat) => (
                          <span
                            key={cat}
                            className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-muted-foreground border border-white/10"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight mb-4 group-hover:text-primary transition-colors duration-300">
                        {featured.frontmatter.title}
                      </h2>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                        {featured.frontmatter.meta_description ?? ""}
                      </p>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="size-3.5" />
                          {new Date(featured.frontmatter.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="w-px h-3 bg-border" />
                        <span className="flex items-center gap-1.5">
                          <Clock className="size-3.5" />
                          {featured.readingTime}
                        </span>
                      </div>

                      {/* CTA */}
                      <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all duration-300">
                        Read article
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* ═══════════════════════════════════════════
              SECTION TITLE
              ═══════════════════════════════════════════ */}
          {paginatedPosts.length > 0 && (
            <div className="flex items-center gap-4 animate-fade-up">
              <div className="neural-line flex-1" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Latest Articles
              </h2>
              <div className="neural-line flex-1" />
            </div>
          )}

          {/* ═══════════════════════════════════════════
              POSTS GRID — Enhanced Cards
              ═══════════════════════════════════════════ */}
          {paginatedPosts.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <article
                    className="relative h-full flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_0_1px_oklch(0.68_0.24_290_/_0.08),0_12px_40px_oklch(0_0_0_/_0.3),0_0_60px_oklch(0.68_0.24_290_/_0.06)] hover:-translate-y-1 animate-fade-up"
                  >
                    {/* Glow top line on hover */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

                    {/* Cover Image */}
                    {post.frontmatter.image && (
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={post.frontmatter.image}
                          alt={post.frontmatter.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {/* Image overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#161224] via-transparent to-transparent" />

                        {/* Reading time badge on image */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-white/90 border border-white/10">
                          <Clock className="size-3" />
                          {post.readingTime}
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5">
                      {/* Categories */}
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

                      {/* Date */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                        <Calendar className="size-3" />
                        {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold leading-snug mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {post.frontmatter.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-1">
                        {post.frontmatter.meta_description ?? ""}
                      </p>

                      {/* Read more CTA */}
                      <div className="flex items-center gap-2 text-xs font-semibold text-primary/70 group-hover:text-primary transition-all duration-300">
                        <span>Read article</span>
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* ═══════════════════════════════════════════
              PAGINATION — Styled
              ═══════════════════════════════════════════ */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {currentPage > 1 && (
                <Link
                  href={`/blog?page=${currentPage - 1}`}
                  className="inline-flex items-center gap-1 rounded-lg px-4 py-2.5 text-sm font-medium bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                >
                  <ArrowRight className="size-3.5 rotate-180" />
                  Previous
                </Link>
              )}

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/blog?page=${pageNum}`}
                    className={`inline-flex items-center justify-center size-10 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      pageNum === currentPage
                        ? "bg-primary text-primary-foreground shadow-[0_0_20px_oklch(0.68_0.24_290_/_0.3)]"
                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}
              </div>

              {currentPage < totalPages && (
                <Link
                  href={`/blog?page=${currentPage + 1}`}
                  className="inline-flex items-center gap-1 rounded-lg px-4 py-2.5 text-sm font-medium bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                >
                  Next
                  <ArrowRight className="size-3.5" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
