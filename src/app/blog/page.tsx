import type { Metadata } from "next";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { ItemListJsonLd } from "@/components/seo/structured-data";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle, GlowCardDescription } from "@/components/ui/glow-card";
import { getAllBlogPostsMeta } from "@/lib/blog";
import { BookOpen, Clock, Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "LLM Blog — Guides, Comparisons & AI Insights",
  description: "Expert guides on open-source LLMs: model comparisons, benchmark analysis, local deployment tips & industry insights. Updated weekly.",
  canonical: canonicalUrl("/blog"),
});

export default function BlogPage() {
  const posts = getAllBlogPostsMeta();

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

        {/* Posts Grid */}
        {posts.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`group block animate-fade-up animate-fade-up-delay-${Math.min(index, 3)}`}
                style={{ animationDelay: `${index * 0.08}s`, animationFillMode: "both" }}
              >
                <GlowCard className="h-full flex flex-col">
                  <GlowCardHeader>
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
      </div>
    </>
  );
}
