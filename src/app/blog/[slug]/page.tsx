import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { TopBar } from "@/components/layout/top-bar";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/structured-data";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import { getAllBlogSlugs, getBlogPost, getRelatedByCategory } from "@/lib/blog";
import { ArrowLeft, Clock, Calendar, User, ArrowRight, List, Sparkles } from "lucide-react";
import { ReadingProgress } from "./reading-progress";
import { ShareButtons } from "./share-buttons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return generatePageMetadata({
    title: post.frontmatter.meta_title ?? post.frontmatter.title,
    description: post.frontmatter.meta_description ?? "",
    canonical: canonicalUrl(`/blog/${slug}`),
    ogImage: post.frontmatter.image,
    type: "article",
  });
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedByCategory(slug, 3);

  return (
    <>
      <ArticleJsonLd
        title={post.frontmatter.title}
        description={post.frontmatter.meta_description ?? ""}
        slug={slug}
        datePublished={post.frontmatter.date}
        authorName={post.frontmatter.author}
        image={post.frontmatter.image}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://llmtrust.com" },
          { name: "Blog", url: "https://llmtrust.com/blog" },
          { name: post.frontmatter.title, url: `https://llmtrust.com/blog/${slug}` },
        ]}
      />

      {/* Reading Progress Bar */}
      <ReadingProgress />

      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.frontmatter.title },
        ]}
      />

      <div className="flex flex-1 flex-col">
        {/* ═══════════════════════════════════════════
            HERO SECTION
            ═══════════════════════════════════════════ */}
        <header className="relative overflow-hidden border-b border-border">
          {/* Background orbs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)" }}
          />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)" }}
          />

          <div className="relative px-6 md:px-8 pt-6 pb-8 md:pb-12 max-w-4xl mx-auto w-full">
            {/* Back link */}
            <div className="mb-6 animate-fade-up">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 group"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Blog
              </Link>
            </div>

            {/* Categories */}
            {(post.frontmatter.categories ?? []).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 animate-fade-up-delay-1">
                {post.frontmatter.categories!.map((cat) => (
                  <Link
                    key={cat}
                    href={`/blog/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                    className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20 hover:bg-primary/15 hover:shadow-[0_0_12px_oklch(0.68_0.24_290_/_0.15)] transition-all duration-300"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] mb-6 animate-fade-up-delay-1">
              <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                {post.frontmatter.title}
              </span>
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground animate-fade-up-delay-2">
              {post.frontmatter.author && (
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <User className="size-3.5 text-primary" />
                  <span className="font-medium">{post.frontmatter.author}</span>
                </span>
              )}
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <Calendar className="size-3.5" />
                {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <Clock className="size-3.5" />
                {post.readingTime}
              </span>
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════
            MAIN CONTENT
            ═══════════════════════════════════════════ */}
        <div className="flex flex-1 gap-10 px-6 md:px-8 py-8 md:py-12 max-w-7xl mx-auto w-full">
          {/* Article */}
          <article className="flex-1 min-w-0 max-w-3xl">
            {/* Cover Image */}
            {post.frontmatter.image && (
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 border border-primary/10 shadow-[0_20px_60px_oklch(0_0_0_/_0.4)] animate-fade-up">
                <Image
                  src={post.frontmatter.image}
                  alt={post.frontmatter.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                />
                {/* Bottom gradient for blending */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B14]/30 to-transparent" />
              </div>
            )}

            {/* Decorative line */}
            <div className="neural-line mb-10" />

            {/* Rendered Content — Enhanced typography */}
            <div
              className="prose prose-lg prose-neutral dark:prose-invert max-w-none
                prose-headings:scroll-mt-20 prose-headings:font-extrabold
                prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:tracking-tight prose-h2:mt-16 prose-h2:mb-6 prose-h2:bg-gradient-to-r prose-h2:from-foreground prose-h2:to-foreground/70 prose-h2:bg-clip-text
                prose-h3:text-xl md:prose-h3:text-2xl prose-h3:font-bold prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-primary
                prose-h4:text-lg prose-h4:font-semibold prose-h4:mt-8 prose-h4:mb-3
                prose-p:leading-[1.8] prose-p:text-muted-foreground prose-p:text-base
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                prose-strong:text-foreground prose-strong:font-bold
                prose-code:text-primary prose-code:bg-primary/10 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
                prose-pre:bg-[#161224] prose-pre:border prose-pre:border-primary/10 prose-pre:rounded-2xl prose-pre:shadow-[0_4px_20px_oklch(0_0_0_/_0.3)]
                prose-img:rounded-2xl prose-img:border prose-img:border-primary/10 prose-img:shadow-[0_8px_30px_oklch(0_0_0_/_0.3)]
                prose-blockquote:border-l-[3px] prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-2xl prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8
                prose-li:text-muted-foreground prose-li:leading-relaxed
                prose-table:text-sm
                prose-th:bg-primary/10 prose-th:font-bold prose-th:text-foreground prose-th:px-4 prose-th:py-3
                prose-td:border-primary/10 prose-th:border-primary/10 prose-td:px-4 prose-td:py-3
                prose-hr:border-primary/20 prose-hr:my-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Decorative line before share */}
            <div className="neural-line my-12" />

            {/* Share Buttons */}
            <ShareButtons
              title={post.frontmatter.title}
              slug={slug}
            />
          </article>

          {/* ═══════════════════════════════════════════
              TABLE OF CONTENTS — Sidebar
              ═══════════════════════════════════════════ */}
          {post.toc.length > 0 && (
            <aside className="hidden xl:block w-72 shrink-0">
              <nav className="sticky top-24">
                <div className="rounded-xl border border-border bg-card p-5 shadow-[0_4px_20px_oklch(0_0_0_/_0.2)]">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-foreground mb-4 pb-3 border-b border-border">
                    <List className="size-3.5 text-primary" />
                    On this page
                  </div>
                  <ul className="space-y-0.5">
                    {post.toc.map((entry) => (
                      <li key={entry.id}>
                        <a
                          href={`#${entry.id}`}
                          className={`block py-1.5 text-[13px] transition-all duration-300 hover:text-primary border-l-2 border-transparent hover:border-primary/40 ${
                            entry.level === 2
                              ? "text-muted-foreground font-medium pl-3"
                              : entry.level === 3
                                ? "text-muted-foreground/70 pl-6"
                                : "text-muted-foreground/50 pl-9"
                          }`}
                        >
                          {entry.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
            </aside>
          )}
        </div>

        {/* ═══════════════════════════════════════════
            RELATED ARTICLES
            ═══════════════════════════════════════════ */}
        {relatedPosts.length > 0 && (
          <section className="relative border-t border-border overflow-hidden">
            {/* Background accent */}
            <div className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 50% 0%, oklch(0.68 0.24 290 / 0.06) 0%, transparent 60%)",
              }}
            />

            <div className="relative px-6 md:px-8 py-12 md:py-16 max-w-7xl mx-auto">
              {/* Section header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <h2 className="text-xl font-extrabold tracking-tight">Related Articles</h2>
                </div>
                <div className="neural-line flex-1" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((related, index) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group block"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <article
                      className="relative h-full rounded-xl border border-border bg-card overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_0_1px_oklch(0.68_0.24_290_/_0.08),0_12px_40px_oklch(0_0_0_/_0.3),0_0_60px_oklch(0.68_0.24_290_/_0.06)] hover:-translate-y-1 animate-fade-up"
                    >
                      {/* Glow top line on hover */}
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500 z-10" />

                      {related.frontmatter.image && (
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={related.frontmatter.image}
                            alt={related.frontmatter.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#161224] via-transparent to-transparent" />

                          {/* Reading time badge */}
                          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-white/90 border border-white/10">
                            <Clock className="size-3" />
                            {related.readingTime}
                          </div>
                        </div>
                      )}

                      <div className="p-5">
                        {/* Categories */}
                        {(related.frontmatter.categories ?? []).length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {related.frontmatter.categories!.map((cat) => (
                              <span
                                key={cat}
                                className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                          <Calendar className="size-3" />
                          {new Date(related.frontmatter.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>

                        <h3 className="text-sm font-bold leading-snug mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {related.frontmatter.title}
                        </h3>

                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                          {related.frontmatter.meta_description}
                        </p>

                        <div className="flex items-center gap-2 text-xs font-semibold text-primary/70 group-hover:text-primary transition-all duration-300">
                          <span>Read article</span>
                          <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
