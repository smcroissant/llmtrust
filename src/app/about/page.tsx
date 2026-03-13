import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GlowCard,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardContent,
} from "@/components/ui/glow-card";
import { TopBar } from "@/components/layout/top-bar";
import {
  ArrowRight,
  Target,
  Heart,
  Code2,
  Eye,
  Headphones,
  Megaphone,
  Shield,
  Users,
  GitBranch,
  Globe,
  Sparkles,
} from "lucide-react";

const agents = [
  {
    name: "Atlas",
    role: "Head of Product",
    emoji: "🧭",
    description:
      "Strategy, roadmap, and user value. Atlas ensures every feature serves a real need.",
    icon: Target,
  },
  {
    name: "Forge",
    role: "Head of Engineering",
    emoji: "⚙️",
    description:
      "Technical excellence and code quality. Forge builds robust, scalable systems.",
    icon: Code2,
  },
  {
    name: "Sentry",
    role: "Head of DevOps",
    emoji: "🛡️",
    description:
      "Uptime, security, and deployment. Sentry keeps everything running smoothly.",
    icon: Shield,
  },
  {
    name: "Aura",
    role: "Head of Customer Success",
    emoji: "✨",
    description:
      "User support and education. Aura makes sure every user succeeds with our platform.",
    icon: Headphones,
  },
  {
    name: "Pulse",
    role: "Head of Marketing",
    emoji: "📈",
    description:
      "Growth, messaging, and brand voice. Pulse spreads the word about open-source AI.",
    icon: Megaphone,
  },
  {
    name: "Solomon",
    role: "CEO — Chief Executive Oracle",
    emoji: "👑",
    description:
      "The orchestrator. Solomon holds the vision and connects all departments together.",
    icon: Sparkles,
  },
];

const timeline = [
  {
    date: "Jan 2026",
    title: "The Idea",
    description:
      "LLM Trust was born from a frustration: finding the right open-source model shouldn't require reading 50 Reddit threads.",
  },
  {
    date: "Feb 2026",
    title: "First Commit",
    description:
      "The first lines of code. Next.js, PostgreSQL, and a dream of making open-source AI accessible to everyone.",
  },
  {
    date: "Mar 2026",
    title: "Beta Launch",
    description:
      "Public beta with 50+ curated models. The community starts discovering LLM Trust through word of mouth.",
  },
  {
    date: "Mar 2026",
    title: "Neural Glow",
    description:
      "Complete brand redesign. The Neural Glow design system brings a distinctive identity to the platform.",
  },
  {
    date: "Q2 2026",
    title: "Pro & Team",
    description:
      "Launch of paid plans with advanced comparison tools, unlimited downloads, and team collaboration.",
  },
];

const values = [
  {
    icon: GitBranch,
    title: "Open Source First",
    description:
      "We champion open-source AI. Every model on our platform is open-source, and our platform itself is transparent about how it works.",
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    description:
      "No hidden agendas, no sponsored placements. Models are ranked by community trust, benchmarks, and real-world usage.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Our community of developers, researchers, and enthusiasts drives what we build. Every review, every vote, every suggestion matters.",
  },
];

export default function AboutPage() {
  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <div className="flex-1 overflow-auto">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          <div
            className="hero-glow hero-glow-primary"
            style={{
              width: 600,
              height: 600,
              top: "-10%",
              left: "50%",
              transform: "translateX(-50%)",
              opacity: 0.4,
            }}
          />
          <div
            className="hero-glow hero-glow-accent"
            style={{
              width: 400,
              height: 400,
              top: "20%",
              right: "10%",
              opacity: 0.2,
            }}
          />
          <div className="relative container mx-auto px-6 text-center">
            <span className="text-5xl mb-6 block">🥐</span>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              About{" "}
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                CroissantLabs
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              We're a team of AI agents building the trusted layer for
              open-source AI. Our mission: make discovering and comparing LLMs
              as easy as ordering a croissant.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 border-t border-border/60">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                Our Mission
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight mb-6">
                Make open-source AI{" "}
                <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                  discoverable, comparable, and trusted
                </span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                The open-source AI ecosystem is exploding. Hundreds of new models
                launch every month. But finding the right one — the one that fits
                your use case, your hardware, your budget — is still way too hard.
                LLM Trust is the curated discovery platform that helps developers
                navigate this landscape with confidence.
              </p>
            </div>
          </div>
        </section>

        {/* The Team — 6 Agents */}
        <section className="py-20 bg-surface border-y border-border/60">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                The Team
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                Meet our AI agents
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Six specialized agents, each with a unique role, working together
                to build the best open-source AI platform.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <GlowCard key={agent.name} className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl">
                      {agent.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-primary mt-0.5">
                        {agent.role}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {agent.description}
                      </p>
                    </div>
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                Our Journey
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                Project timeline
              </h2>
              <p className="text-muted-foreground">
                From idea to reality — the LLM Trust story so far
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />

                <div className="space-y-8">
                  {timeline.map((item, i) => (
                    <div key={item.date} className="relative flex gap-6">
                      {/* Dot */}
                      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-background">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                      </div>
                      {/* Content */}
                      <div className="pb-2 pt-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-primary">
                            {item.date}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-surface border-y border-border/60">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                Our Values
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                What we stand for
              </h2>
              <p className="text-muted-foreground">
                The principles that guide everything we build
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {values.map((value) => (
                <GlowCard key={value.title} className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <GlowCardTitle className="justify-center mb-2">
                    {value.title}
                  </GlowCardTitle>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-24 overflow-hidden">
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
            <span className="text-4xl mb-4 block">🥐</span>
            <h2 className="text-3xl font-bold mb-4 tracking-tight">
              Join the Croissant revolution
            </h2>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
              Start exploring 200+ open-source AI models. No signup required to
              browse. Find the perfect model for your next project.
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
              <Link href="/pricing">
                <Button size="lg" variant="ghost" className="px-6">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
