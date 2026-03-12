import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * HeroSection — LLM Trust's main hero.
 *
 * Design elements:
 * - Gradient text for the headline
 * - Floating glow orbs in background
 * - Subtle badge announcing model count
 * - Primary CTA with arrow + secondary ghost CTA
 * - Staggered fade-up animations
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Background glow orbs */}
      <div
        className="hero-glow hero-glow-primary animate-glow-pulse"
        style={{
          width: 500,
          height: 500,
          top: -100,
          right: "20%",
        }}
      />
      <div
        className="hero-glow hero-glow-accent"
        style={{
          width: 400,
          height: 400,
          bottom: -150,
          left: "10%",
          opacity: 0.5,
        }}
      />

      {/* Neural connection lines (decorative) */}
      <div className="neural-line absolute top-1/3 left-0 right-0" />
      <div className="neural-line absolute top-2/3 left-0 right-0 opacity-10" />

      <div className="relative container mx-auto px-6 text-center">
        {/* Announcement badge */}
        <div className="animate-fade-up">
          <Badge
            variant="secondary"
            className="mb-6 gap-1.5 px-3 py-1.5 text-sm border-primary/20"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>200+ open-source models curated</span>
          </Badge>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up-delay-1 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Discover & Run
          <br />
          <span className="text-gradient-brand">Open-Source LLMs</span>
          <br />
          Locally
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-up-delay-2 mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
          The trusted platform for discovering, comparing, and running AI models.
          Curated specs, community reviews, one-click downloads.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up-delay-3 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/models">
            <Button
              size="lg"
              className="gap-2 px-6 shadow-[0_0_20px_oklch(0.68_0.24_290_/_0.2)] hover:shadow-[0_0_30px_oklch(0.68_0.24_290_/_0.3)] transition-shadow"
            >
              Browse Models
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/docs/api">
            <Button size="lg" variant="ghost" className="px-6">
              API Documentation
            </Button>
          </Link>
        </div>

        {/* Quick stats */}
        <div className="animate-fade-up-delay-3 mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground md:gap-12">
          {[
            { value: "200+", label: "Models" },
            { value: "500K+", label: "Downloads" },
            { value: "15+", label: "Architectures" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="block text-lg font-bold text-foreground tabular-nums">
                {stat.value}
              </span>
              <span className="text-xs">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
