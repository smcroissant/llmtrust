import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TopBar } from "@/components/layout/top-bar";
import {
  GlowCard,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardContent,
} from "@/components/ui/glow-card";
import {
  ArrowRight,
  Search,
  GitCompareArrows,
  Download,
  Sparkles,
  BookOpen,
  Clock,
  ChevronRight,
} from "lucide-react";
import { serverCaller } from "@/server/api/caller";
import { getAllBlogPostsMeta } from "@/lib/blog";
import { LatestModels } from "./latest-models";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LLM Trust",
  url: "https://llmtrust.com",
  logo: "https://llmtrust.com/logo.png",
  description:
    "Discover, compare, and run open-source LLMs. The trusted platform for AI model discovery and local execution.",
  foundingDate: "2026-01",
  sameAs: [
    "https://github.com/smcroissant/llmtrust",
  ],
};

type FeaturedModel = {
  id: string;
  slug: string;
  name: string;
  description: string;
  parameterCount: string;
  architecture: string;
  category: string;
  downloadCount: number;
  license: string;
  tags: string[];
};

const howItWorks = [
  {
    icon: Search,
    title: "Browse",
    description:
      "Explore 200+ curated open-source models with detailed specs, benchmarks, and community reviews.",
    step: "01",
  },
  {
    icon: GitCompareArrows,
    title: "Compare",
    description:
      "Compare models side-by-side on performance, size, license, and architecture to find your perfect match.",
    step: "02",
  },
  {
    icon: Download,
    title: "Download",
    description:
      "One-click downloads directly from HuggingFace. Run locally with our CLI in seconds.",
    step: "03",
  },
];

const modelCreators = [
  { name: "Meta", logo: "🦙" },
  { name: "Mistral AI", logo: "🌊" },
  { name: "Google", logo: "🔷" },
  { name: "Microsoft", logo: "🟦" },
  { name: "Alibaba", logo: "🟠" },
  { name: "Stability AI", logo: "🎨" },
  { name: "EleutherAI", logo: "⚡" },
  { name: "BigScience", logo: "🌸" },
];

export default async function HomePage() {
  const [featuredData, statsData] = await Promise.all([
    serverCaller.models
      .list({ featured: true, limit: 6, sort: "popular" })
      .catch(() => null),
    serverCaller.models
      .stats()
      .catch(() => ({ totalModels: 0, totalDownloads: 0 })),
  ]);

  const featuredModels: FeaturedModel[] =
    (featuredData?.models ?? []).map(
      (m: {
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
      }) => ({
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
      })
    ) ?? [];

  // Blog posts — get latest 3
  let latestPosts: {
    slug: string;
    title: string;
    date: string;
    readingTime: string;
    image?: string;
  }[] = [];
  try {
    const allPosts = getAllBlogPostsMeta();
    latestPosts = allPosts.slice(0, 3).map((p) => ({
      slug: p.slug,
      title: p.frontmatter.title,
      date: p.frontmatter.date,
      readingTime: p.readingTime,
      image: p.frontmatter.image,
    }));
  } catch {
    // blog may not be set up
  }

  const totalModels = statsData?.totalModels ?? 200;
  const totalDownloads = statsData?.totalDownloads ?? 500000;

  return (
    <>
      <Script
        id="jsonld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <TopBar breadcrumbs={[{ label: "Home" }]} />

      <div className="flex-1 overflow-auto">
        {/* ═══════════════════════════════════════════
            1. HERO SECTION
            ═══════════════════════════════════════════ */}
        <section className="relative overflow-hidden py-24 md:py-32">
          {/* Background glow orbs */}
          <div
            className="hero-glow hero-glow-primary animate-glow-pulse"
            style={{ width: 600, height: 600, top: -150, right: "15%" }}
          />
          <div
            className="hero-glow hero-glow-accent"
            style={{
              width: 450,
              height: 450,
              bottom: -100,
              left: "5%",
              opacity: 0.5,
            }}
          />
          {/* Neural connection lines */}
          <div className="neural-line absolute top-1/4 left-0 right-0" />
          <div className="neural-line absolute top-3/4 left-0 right-0 opacity-10" />

          <div className="relative container mx-auto px-6 text-center">
            {/* Announcement badge */}
            <div className="animate-fade-up">
              <Badge
                variant="secondary"
                className="mb-6 gap-1.5 px-4 py-1.5 text-sm border-primary/20"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>The open-source AI revolution starts here</span>
              </Badge>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up-delay-1 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              The trusted marketplace
              <br />
              for{" "}
              <span className="text-gradient-brand">open-source LLMs</span>
            </h1>

            {/* Subheadline */}
            <p className="animate-fade-up-delay-2 mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
              Discover, compare, and download the best open-source AI models.
              Trusted by thousands of developers worldwide. Free forever.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up-delay-3 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/models">
                <Button
                  size="lg"
                  className="gap-2 px-8 shadow-[0_0_20px_oklch(0.68_0.24_290_/_0.2)] hover:shadow-[0_0_30px_oklch(0.68_0.24_290_/_0.3)] transition-shadow text-base"
                >
                  Browse Models
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs/api">
                <Button
                  size="lg"
                  variant="ghost"
                  className="px-8 text-base"
                >
                  Read the Docs
                </Button>
              </Link>
            </div>

            {/* Real-time stats */}
            <div className="animate-fade-up-delay-3 mt-16 flex items-center justify-center gap-10 text-sm text-muted-foreground md:gap-16">
              {[
                {
                  value: `${totalModels}+`,
                  label: "Models",
                },
                {
                  value:
                    totalDownloads >= 1000000
                      ? `${(totalDownloads / 1000000).toFixed(1)}M+`
                      : `${Math.round(totalDownloads / 1000)}K+`,
                  label: "Downloads",
                },
                { value: "100%", label: "Free & Open" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="block text-2xl font-bold text-foreground tabular-nums">
                    {stat.value}
                  </span>
                  <span className="text-xs mt-0.5 block">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            2. FEATURED MODELS (6 GlowCards)
            ═══════════════════════════════════════════ */}
        {featuredModels.length > 0 && (
          <section className="py-20 border-t border-border/60">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    Featured Models
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Hand-picked models trusted by the community
                  </p>
                </div>
                <Link href="/models">
                  <Button variant="ghost" className="gap-2">
                    View all models
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredModels.map((model, i) => (
                  <Link key={model.slug} href={`/models/${model.slug}`}>
                    <GlowCard
                      className="h-full p-5 cursor-pointer group"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <GlowCardHeader className="p-0">
                        <div className="flex items-start justify-between mb-3">
                          <Badge
                            variant="secondary"
                            className="text-xs font-medium"
                          >
                            {model.parameterCount || model.architecture}
                          </Badge>
                          {model.license && (
                            <span className="text-xs text-muted-foreground">
                              {model.license}
                            </span>
                          )}
                        </div>
                        <GlowCardTitle className="text-base group-hover:text-primary transition-colors">
                          {model.name}
                        </GlowCardTitle>
                      </GlowCardHeader>
                      <GlowCardContent className="p-0 mt-2">
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {model.description}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex gap-1.5 flex-wrap">
                            {(model.tags ?? []).slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {model.downloadCount >= 1000
                              ? `${(model.downloadCount / 1000).toFixed(1)}K`
                              : model.downloadCount}{" "}
                            downloads
                          </span>
                        </div>
                      </GlowCardContent>
                    </GlowCard>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════
            3. HOW IT WORKS
            ═══════════════════════════════════════════ */}
        <section className="py-20 bg-surface border-y border-border/60">
          <div className="container mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold tracking-tight">
                How It Works
              </h2>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                From discovery to deployment in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {howItWorks.map((step, i) => (
                <div key={step.title} className="relative text-center group">
                  {/* Connector line */}
                  {i < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 to-transparent" />
                  )}

                  <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/10 group-hover:bg-primary/15 group-hover:border-primary/20 transition-all duration-300">
                    <step.icon className="h-8 w-8 text-primary" />
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/models">
                <Button className="gap-2 shadow-[0_0_20px_oklch(0.68_0.24_290_/_0.15)]">
                  Get Started
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            4. BLOG PREVIEW (3 latest articles)
            ═══════════════════════════════════════════ */}
        {latestPosts.length > 0 && (
          <section className="py-20">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    Latest from the Blog
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Guides, comparisons, and AI insights
                  </p>
                </div>
                <Link href="/blog">
                  <Button variant="ghost" className="gap-2">
                    All articles
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {latestPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}>
                    <GlowCard className="h-full p-5 cursor-pointer group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Article</span>
                        </div>
                        <span className="text-xs text-muted-foreground">·</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{post.readingTime}</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-3">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </GlowCard>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════
            5. SOCIAL PROOF — Model Creators
            ═══════════════════════════════════════════ */}
        <section className="py-16 border-y border-border/60 bg-surface">
          <div className="container mx-auto px-6">
            <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-widest">
              Models from the world&apos;s leading AI labs
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {modelCreators.map((creator) => (
                <div
                  key={creator.name}
                  className="flex items-center gap-2 text-muted-foreground/60 hover:text-foreground transition-colors duration-300"
                >
                  <span className="text-2xl">{creator.logo}</span>
                  <span className="text-sm font-medium hidden sm:inline">
                    {creator.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            6. FINAL CTA → /models
            ═══════════════════════════════════════════ */}
        <section className="relative py-28 border-t border-border/60 overflow-hidden">
          {/* Background glow */}
          <div
            className="hero-glow hero-glow-primary"
            style={{
              width: 700,
              height: 700,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0.25,
            }}
          />
          <div
            className="hero-glow hero-glow-accent"
            style={{
              width: 400,
              height: 400,
              top: "30%",
              right: "10%",
              opacity: 0.2,
            }}
          />

          <div className="relative container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Start building with
              <br />
              <span className="text-gradient-brand">open-source AI</span>
            </h2>
            <p className="text-muted-foreground mb-12 max-w-lg mx-auto text-lg leading-relaxed">
              Join thousands of developers discovering, comparing, and running
              open-source AI models. Free forever, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/models">
                <Button
                  size="lg"
                  className="gap-2 px-10 text-base shadow-[0_0_25px_oklch(0.68_0.24_290_/_0.25)] hover:shadow-[0_0_40px_oklch(0.68_0.24_290_/_0.35)] transition-shadow"
                >
                  Explore All Models
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button
                  size="lg"
                  variant="ghost"
                  className="px-10 text-base"
                >
                  Documentation
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/60 py-8">
          <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
            <p className="font-medium text-foreground/80">LLM Trust</p>
            <p className="mt-1">
              © {new Date().getFullYear()} · Models sourced from{" "}
              <a
                href="https://huggingface.co"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-primary"
              >
                HuggingFace
              </a>
              . Built with ❤️ for the open-source community.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
