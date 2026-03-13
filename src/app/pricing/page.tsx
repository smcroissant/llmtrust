"use client";

import { useState } from "react";
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
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ArrowRight,
  Check,
  X,
  Sparkles,
  Zap,
  Users,
  HelpCircle,
  Loader2,
} from "lucide-react";

const plansData = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for exploring open-source AI models",
    icon: Sparkles,
    cta: "Get Started",
    href: "/models",
    featured: false,
    isCheckout: false,
    features: [
      "Browse unlimited models",
      "Compare models",
      "Download models (unlimited)",
      "Community reviews",
      "Basic API access (100 calls/day)",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    description: "For developers who need more power",
    icon: Zap,
    cta: "Upgrade to Pro",
    plan: "pro" as const,
    featured: true,
    isCheckout: true,
    features: [
      "Everything in Free",
      "Cloud inference (run models without GPU)",
      "Unlimited API access",
      "Advanced benchmarks & analytics",
      "Priority support",
      "Custom watchlists",
    ],
  },
  {
    name: "Team",
    price: "$49",
    period: "/mo",
    description: "Collaborate with your team on AI model selection",
    icon: Users,
    cta: "Upgrade to Team",
    plan: "team" as const,
    featured: false,
    isCheckout: true,
    features: [
      "Everything in Pro",
      "5 seats",
      "Shared workspaces",
      "Admin dashboard",
      "Usage analytics",
      "SSO",
      "API management",
    ],
  },
];

const comparisonFeatures = [
  {
    category: "Discovery",
    features: [
      { name: "Browse unlimited models", free: true, pro: true, team: true },
      { name: "Compare models", free: true, pro: true, team: true },
      { name: "Community reviews", free: true, pro: true, team: true },
      { name: "Advanced benchmarks & analytics", free: false, pro: true, team: true },
    ],
  },
  {
    category: "Downloads & API",
    features: [
      { name: "Downloads", free: "Unlimited", pro: "Unlimited", team: "Unlimited" },
      { name: "API access", free: "100 calls/day", pro: "Unlimited", team: "Unlimited" },
    ],
  },
  {
    category: "Inference",
    features: [
      { name: "Cloud inference (no GPU needed)", free: false, pro: true, team: true },
    ],
  },
  {
    category: "Advanced",
    features: [
      { name: "Custom watchlists", free: false, pro: true, team: true },
      { name: "Priority support", free: false, pro: true, team: true },
    ],
  },
  {
    category: "Team & Support",
    features: [
      { name: "Seats", free: "1", pro: "1", team: "5" },
      { name: "Shared workspaces", free: false, pro: false, team: true },
      { name: "Admin dashboard", free: false, pro: false, team: true },
      { name: "Usage analytics", free: false, pro: false, team: true },
      { name: "SSO", free: false, pro: false, team: true },
      { name: "API management", free: false, pro: false, team: true },
    ],
  },
];

const faqs = [
  {
    question: "Is LLM Trust really free?",
    answer:
      "Yes! Our free tier gives you full access to browse unlimited models, compare them, download models without limits, and read community reviews. We believe in making open-source AI accessible to everyone.",
  },
  {
    question: "What do I get with Pro?",
    answer:
      "Pro ($19/mo) includes everything in Free, plus cloud inference (run models without needing a GPU), unlimited API access, advanced benchmarks & analytics, custom watchlists, and priority support.",
  },
  {
    question: "What's included in the Team plan?",
    answer:
      "Team ($49/mo) includes everything in Pro, plus 5 seats, shared workspaces, an admin dashboard, usage analytics, SSO, and API management tools.",
  },
  {
    question: "Can I upgrade from Free to Pro later?",
    answer:
      "Absolutely! You can upgrade at any time. Your data, watchlists, and preferences will carry over seamlessly. No disruption to your workflow.",
  },
  {
    question: "Do you offer annual billing?",
    answer:
      "Yes, annual plans come with a 20% discount. Pro annual is $182/yr ($15.17/mo) and Team annual is $470/yr ($39.17/mo).",
  },
  {
    question: "What models are available?",
    answer:
      "We curate models from HuggingFace, including Llama, Mistral, Gemma, Phi, Qwen, and many more. We focus on models that are well-documented, actively maintained, and popular in the community.",
  },
  {
    question: "Do you host the models?",
    answer:
      "No. We don't host model weights. All downloads go directly through HuggingFace. We're a discovery and trust layer, not a hosting platform. This means zero hosting costs — savings we pass on to you.",
  },
];

function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm font-medium">{value}</span>;
  }
  if (value) {
    return <Check className="h-4 w-4 text-primary" />;
  }
  return <X className="h-4 w-4 text-muted-foreground/40" />;
}

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const createCheckout = trpc.billing.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (err) => {
      toast.error(err.message);
      setLoadingPlan(null);
    },
  });

  const handleUpgrade = (plan: "pro" | "team") => {
    setLoadingPlan(plan);
    createCheckout.mutate({ plan });
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]} />

      <div className="flex-1 overflow-auto">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          <div
            className="hero-glow hero-glow-primary"
            style={{
              width: 500,
              height: 500,
              top: "-20%",
              left: "50%",
              transform: "translateX(-50%)",
              opacity: 0.4,
            }}
          />
          <div className="relative container mx-auto px-6 text-center">
            <Badge variant="secondary" className="mb-4">
              Simple, transparent pricing
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Start free.{" "}
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Scale when ready.
              </span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Discover and compare open-source AI models without paying a cent.
              Upgrade when you need more power.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plansData.map((plan) => (
                <GlowCard
                  key={plan.name}
                  className={`relative flex flex-col p-6 ${
                    plan.featured
                      ? "border-primary/30 shadow-[0_0_0_1px_oklch(0.68_0.24_290_/_0.1),0_0_40px_oklch(0.68_0.24_290_/_0.08)]"
                      : ""
                  }`}
                >
                  <GlowCardHeader className="p-0 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <plan.icon className="h-4 w-4 text-primary" />
                      </div>
                      <GlowCardTitle className="text-lg">{plan.name}</GlowCardTitle>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {plan.description}
                    </p>
                  </GlowCardHeader>
                  <GlowCardContent className="p-0 flex-1">
                    <ul className="space-y-2.5 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </GlowCardContent>
                  <div className="mt-auto pt-4 border-t border-border/60">
                    {plan.isCheckout ? (
                      <Button
                        variant={plan.featured ? "default" : "outline"}
                        className="w-full gap-2"
                        size="lg"
                        onClick={() => handleUpgrade(plan.plan!)}
                        disabled={loadingPlan !== null}
                      >
                        {loadingPlan === plan.plan ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            {plan.cta}
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Link href={plan.href!}>
                        <Button
                          variant={plan.featured ? "default" : "outline"}
                          className="w-full gap-2"
                          size="lg"
                        >
                          {plan.cta}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 bg-surface border-y border-border/60">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                Compare all features
              </h2>
              <p className="text-muted-foreground">
                Everything included in each plan
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <GlowCard className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/60">
                        <th className="text-left p-4 font-semibold text-sm w-[40%]">
                          Feature
                        </th>
                        <th className="text-center p-4 font-semibold text-sm w-[20%]">
                          Free
                        </th>
                        <th className="text-center p-4 font-semibold text-sm w-[20%]">
                          <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                            Pro
                          </span>
                        </th>
                        <th className="text-center p-4 font-semibold text-sm w-[20%]">
                          Team
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonFeatures.map((section) => (
                        <>
                          <tr key={`cat-${section.category}`}>
                            <td
                              colSpan={4}
                              className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30"
                            >
                              {section.category}
                            </td>
                          </tr>
                          {section.features.map((feature) => (
                            <tr
                              key={feature.name}
                              className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors"
                            >
                              <td className="p-4 text-sm">{feature.name}</td>
                              <td className="p-4 text-center">
                                <div className="flex justify-center">
                                  <FeatureCell value={feature.free} />
                                </div>
                              </td>
                              <td className="p-4 text-center">
                                <div className="flex justify-center">
                                  <FeatureCell value={feature.pro} />
                                </div>
                              </td>
                              <td className="p-4 text-center">
                                <div className="flex justify-center">
                                  <FeatureCell value={feature.team} />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlowCard>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                Frequently asked questions
              </h2>
              <p className="text-muted-foreground">
                Everything you need to know about LLM Trust pricing
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-border/60 bg-card transition-all duration-200 hover:border-primary/20 open:border-primary/20"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-medium list-none [&::-webkit-details-marker]:hidden">
                    <span>{faq.question}</span>
                    <span className="ml-4 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-24 border-t border-border/60 overflow-hidden">
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
              Start exploring for free
            </h2>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
              No credit card required. Browse 200+ open-source models and find
              the perfect fit for your project.
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
      </div>
    </>
  );
}
