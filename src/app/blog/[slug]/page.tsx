import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/structured-data";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle, GlowCardDescription } from "@/components/ui/glow-card";
import { getAllBlogSlugs, getBlogPost, getRelatedPosts } from "@/lib/blog";
import { ArrowLeft, Clock, Calendar, User, ArrowRight, List } from "lucide-react";

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

  const relatedPosts = getRelatedPosts(slug, 3);

  return (
    <>
      <ArticleJsonLd
        title={post.frontmatter.title}
        description={post.frontmatter.meta_description ?? ""}
        slug={slug}
        datePublished={post.frontmatter.date}
        authorName={post.frontmatter.author}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://llmtrust.com" },
          { name: "Blog", url: "https://llmtrust.com/blog" },
          { name: post.frontmatter.title, url: `https://llmtrust.com/blog/${slug}` },
        ]}
      />
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.frontmatter.title },
        ]}
      />

      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 gap-8 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {/* Main Content */}
          <article className="flex-1 min-w-0 max-w-3xl">
            {/* Back link */}
            <div className="mb-6">
              <Link
                href="/blog"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </div>

            {/* Header */}
            <header className="mb-10">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4">
                {post.frontmatter.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="text-border">·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" />
                  {post.readingTime}
                </span>
                {post.frontmatter.author && (
                  <>
                    <span className="text-border">·</span>
                    <span className="flex items-center gap-1.5">
                      <User className="size-4" />
                      {post.frontmatter.author}
                    </span>
                  </>
                )}
              </div>

              {/* Decorative line */}
              <div className="neural-line mt-6" />
            </header>

            {/* Rendered Content */}
            <div
              className="prose prose-neutral dark:prose-invert max-w-none
                prose-headings:scroll-mt-20
                prose-h2:text-2xl prose-h2:font-bold prose-h2:tracking-tight prose-h2:mt-12 prose-h2:mb-4
                prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
                prose-h4:text-lg prose-h4:font-semibold prose-h4:mt-6 prose-h4:mb-2
                prose-p:leading-relaxed prose-p:text-muted-foreground
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground
                prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
                prose-pre:bg-card prose-pre:border prose-pre:border-border prose-pre:rounded-xl
                prose-img:rounded-xl prose-img:border prose-img:border-border
                prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1
                prose-li:text-muted-foreground
                prose-table:text-sm
                prose-th:bg-muted prose-th:font-semibold prose-th:text-foreground
                prose-td:border-border prose-th:border-border
                prose-hr:border-border"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Table of Contents Sidebar */}
          {post.toc.length > 0 && (
            <aside className="hidden xl:block w-64 shrink-0">
              <nav className="sticky top-20">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
                  <List className="size-4" />
                  On this page
                </div>
                <ul className="space-y-1.5 border-l border-border pl-4">
                  {post.toc.map((entry) => (
                    <li key={entry.id}>
                      <a
                        href={`#${entry.id}`}
                        className={`block text-sm transition-colors hover:text-primary ${
                          entry.level === 2
                            ? "text-muted-foreground font-medium"
                            : entry.level === 3
                              ? "text-muted-foreground/70 pl-3"
                              : "text-muted-foreground/50 pl-6"
                        }`}
                      >
                        {entry.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-border p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-xl font-bold tracking-tight mb-6">Related Articles</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group block"
                  >
                    <GlowCard className="h-full">
                      <GlowCardHeader>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <Calendar className="size-3" />
                          {new Date(related.frontmatter.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                          <span className="text-border">·</span>
                          <Clock className="size-3" />
                          {related.readingTime}
                        </div>
                        <GlowCardTitle className="text-sm leading-snug group-hover:text-primary transition-colors">
                          {related.frontmatter.title}
                        </GlowCardTitle>
                        <GlowCardDescription className="line-clamp-2 text-xs">
                          {related.frontmatter.meta_description}
                        </GlowCardDescription>
                      </GlowCardHeader>
                      <GlowCardContent>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Read article
                          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </GlowCardContent>
                    </GlowCard>
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
