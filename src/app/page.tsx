import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TopBar } from "@/components/layout/top-bar";
import { HeroSection } from "@/components/hero-section";
import { StatsBar } from "@/components/stats-bar";
import { ModelCardEnhanced } from "@/components/models/model-card-enhanced";
import {
  GlowCard,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardContent,
} from "@/components/ui/glow-card";
import { ArrowRight, Search, Download, Zap } from "lucide-react";
import { serverCaller } from "@/server/api/caller";
import { LatestModels } from "./latest-models";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LLM Trust",
  url: "https://llmtrust.com",
  logo: "https://llmtrust.com/logo.png",
  description:
    "Discover, compare, and run open-source LLMs. The trusted platform for AI model discovery and local execution.",
  sameAs: [],
};

const features = [
  {
    icon: Search,
    title: "Curated Discovery",
    description:
      "Find the right model for your use case with detailed specs, benchmarks, and community reviews.",
  },
  {
    icon: Download,
    title: "Direct Downloads",
    description:
      "Download models directly from HuggingFace. No hosting fees, always the latest versions.",
  },
  {
    icon: Zap,
    title: "Run Locally",
    description:
      "Use our CLI to download and run models locally with one command. Privacy-first.",
  },
];

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

export default async function HomePage() {
  // Fetch data from DB via tRPC
  const [featuredData, categoriesData, statsData] = await Promise.all([
    serverCaller.models.list({ featured: true, limit: 4, sort: "popular" }).catch(() => null),
    serverCaller.models.categories().catch(() => []),
    serverCaller.models.stats().catch(() => ({ totalModels: 0, totalDownloads: 0 })),
  ]);

  const featuredModels: FeaturedModel[] = (featuredData?.models ?? []).map((m: { id: string; slug: string; name: string; description: string; parameterCount: string | null; architecture: string | null; category: string | null; downloadCount: number; license: string | null; tags: unknown }) => ({
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
  })) ?? [];

  const categoryIcons: Record<string, string> = {
    "text-generation": "💬",
    "code": "💻",
    "vision": "👁️",
    "embedding": "🔢",
    "audio": "🎵",
  };

  const categories: { name: string; count: number; icon: string }[] = categoriesData.map((c: { name: string | null; count: number }) => ({
    name: c.name ?? "Unknown",
    count: c.count,
    icon: categoryIcons[c.name?.toLowerCase().replace(/\s+/g, "-") ?? ""] ?? "📦",
  }));

  return (
    <>
      <Script
        id="jsonld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <TopBar breadcrumbs={[{ label: "Home" }]} />

      <div className="flex-1 overflow-auto">
        {/* Hero Section */}
        <HeroSection />

        {/* Stats Bar */}
        <StatsBar />

        {/* Features */}
        <section className="py-20 border-b border-border/60">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-center mb-4 tracking-tight">
              Why LLM Trust?
            </h2>
            <p className="text-muted-foreground text-center max-w-lg mx-auto mb-12">
              Built by developers, for developers. Everything you need to discover and run open-source AI.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <GlowCard key={feature.title} className="text-center p-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <GlowCardTitle className="justify-center mb-2">
                    {feature.title}
                  </GlowCardTitle>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Models */}
        {featuredModels.length > 0 && (
          <section className="py-20">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Featured Models
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Hand-picked models trusted by the community
                  </p>
                </div>
                <Link href="/models">
                  <Button variant="ghost" className="gap-2">
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredModels.map((model, i) => (
                  <ModelCardEnhanced key={model.slug} model={model} delay={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <section className="py-20 bg-surface border-y border-border/60">
            <div className="container mx-auto px-6">
              <h2 className="text-2xl font-bold mb-2 text-center tracking-tight">
                Browse by Category
              </h2>
              <p className="text-muted-foreground text-center text-sm mb-10">
                Find models by use case
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={`/models?category=${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <GlowCard className="text-center py-6 px-4 cursor-pointer">
                      <span className="text-3xl mb-3 block">{cat.icon}</span>
                      <p className="font-medium text-sm capitalize">{cat.name.replace("-", " ")}</p>
                      <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                        {cat.count} model{cat.count !== 1 ? "s" : ""}
                      </p>
                    </GlowCard>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Latest Additions */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Latest Additions
                </h2>
                <p className="text-muted-foreground text-sm">
                  Recently added models to the platform
                </p>
              </div>
              <Link href="/models?sort=newest">
                <Button variant="ghost" className="gap-2">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <LatestModels />
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-24 border-t border-border/60 overflow-hidden">
          {/* Background glow */}
          <div
            className="hero-glow hero-glow-primary"
            style={{
              width: 600,
              height: 600,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0.3,
            }}
          />
          <div className="relative container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">
              Ready to explore open-source AI?
            </h2>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
              Join thousands of developers discovering and running open-source AI models locally.
              Free forever, no credit card required.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/models">
                <Button
                  size="lg"
                  className="gap-2 px-6 shadow-[0_0_20px_oklch(0.68_0.24_290_/_0.2)]"
                >
                  Explore Models
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="ghost" className="px-6">
                  Read the Docs
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/60 py-8">
          <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
            <p className="font-medium text-foreground/80">
              LLM Trust
            </p>
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
