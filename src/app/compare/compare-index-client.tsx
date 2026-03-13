"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  GlowCard,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardContent,
} from "@/components/ui/glow-card";
import { trpc } from "@/lib/trpc";
import {
  GitCompareArrows,
  Search,
  ArrowRight,
  Loader2,
  Sparkles,
  X,
  ChevronRight,
} from "lucide-react";

// Popular comparisons for quick access
const popularComparisons = [
  { slugA: "llama-3.1-70b", slugB: "gpt-4-turbo", labelA: "Llama 3 70B", labelB: "GPT-4 Turbo", category: "General" },
  { slugA: "mixtral-8x7b", slugB: "llama-3.1-70b", labelA: "Mixtral 8x7B", labelB: "Llama 3 70B", category: "General" },
  { slugA: "deepseek-coder-v2", slugB: "code-llama-70b", labelA: "DeepSeek Coder V2", labelB: "Code Llama 70B", category: "Code" },
  { slugA: "phi-3.5-mini", slugB: "gemma-2.0-9b", labelA: "Phi-3 Mini", labelB: "Gemma 2 9B", category: "Small" },
  { slugA: "qwen-2-5-72b", slugB: "llama-3.1-70b", labelA: "Qwen 2.5 72B", labelB: "Llama 3 70B", category: "General" },
  { slugA: "mistral-large", slugB: "claude-3-opus", labelA: "Mistral Large", labelB: "Claude 3 Opus", category: "Enterprise" },
];

function ModelPicker({
  label,
  selected,
  onSelect,
  excludeSlug,
  accentColor,
}: {
  label: string;
  selected: { name: string; slug: string; parameterCount: string | null; architecture: string | null } | null;
  onSelect: (model: { name: string; slug: string; parameterCount: string | null; architecture: string | null }) => void;
  excludeSlug?: string;
  accentColor: "primary" | "emerald";
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data, isLoading } = trpc.models.list.useQuery({
    limit: 50,
    search: search || undefined,
    sort: "popular",
  });

  const filtered = data?.models.filter((m) => m.slug !== excludeSlug) ?? [];

  const colorClasses = {
    primary: "border-primary/30 text-primary",
    emerald: "border-emerald-500/30 text-emerald-500",
  };

  return (
    <div className="relative flex-1">
      <GlowCard
        className={`cursor-pointer transition-all ${
          selected ? colorClasses[accentColor] : "hover:border-primary/20"
        }`}
        onClick={() => setOpen(!open)}
      >
        <GlowCardHeader className="py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            {label}
          </p>
          {selected ? (
            <div>
              <h3 className="text-lg font-bold">{selected.name}</h3>
              <div className="flex gap-1.5 mt-2">
                {selected.parameterCount && (
                  <Badge variant="secondary" className="text-[10px]">{selected.parameterCount}</Badge>
                )}
                {selected.architecture && (
                  <Badge variant="outline" className="text-[10px]">{selected.architecture}</Badge>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Search className="h-4 w-4" />
              <span className="text-sm">Choose a model...</span>
            </div>
          )}
        </GlowCardHeader>
      </GlowCard>

      {selected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(null as unknown as { name: string; slug: string; parameterCount: string | null; architecture: string | null });
          }}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
        >
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      )}

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 left-0 right-0 z-50 rounded-xl border border-border/60 bg-card shadow-xl overflow-hidden">
            <div className="p-2 border-b border-border/40">
              <input
                type="text"
                placeholder="Search models..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-muted/50 rounded-lg outline-none focus:ring-2 focus:ring-primary/30"
                autoFocus
              />
            </div>
            <div className="max-h-72 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              ) : filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No models found</p>
              ) : (
                filtered.map((m) => (
                  <button
                    key={m.slug}
                    onClick={() => {
                      onSelect(m);
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {m.architecture} · {m.parameterCount}
                      </p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function CompareIndexClient() {
  const router = useRouter();
  const [modelA, setModelA] = useState<{ name: string; slug: string; parameterCount: string | null; architecture: string | null } | null>(null);
  const [modelB, setModelB] = useState<{ name: string; slug: string; parameterCount: string | null; architecture: string | null } | null>(null);

  const canCompare = modelA && modelB && modelA.slug !== modelB.slug;

  const handleCompare = useCallback(() => {
    if (canCompare) {
      router.push(`/compare/${modelA.slug}/vs/${modelB.slug}`);
    }
  }, [canCompare, modelA, modelB, router]);

  const handleSwap = useCallback(() => {
    const temp = modelA;
    setModelA(modelB);
    setModelB(temp);
  }, [modelA, modelB]);

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Compare" },
        ]}
      />

      <div className="flex-1 overflow-auto">
        <div className="relative">
          {/* Neural Glow Background */}
          <div
            className="hero-glow hero-glow-primary animate-glow-pulse"
            style={{ width: 500, height: 500, top: -100, right: "15%", opacity: 0.3 }}
          />
          <div
            className="hero-glow hero-glow-accent"
            style={{ width: 400, height: 400, bottom: -100, left: "10%", opacity: 0.25 }}
          />
          <div className="neural-line absolute top-1/3 left-0 right-0 opacity-15" />

          <div className="relative container mx-auto px-4 py-12 max-w-4xl">
            {/* Hero */}
            <div className="text-center mb-12 animate-fade-up">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                Side-by-side LLM comparison
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                Compare <span className="text-gradient-brand">AI Models</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Pick two models to see benchmarks, specs, and local execution details compared side by side.
              </p>
            </div>

            {/* Model Pickers */}
            <div className="flex items-stretch gap-4 mb-6 animate-fade-up-delay-1">
              <ModelPicker
                label="Model A"
                selected={modelA}
                onSelect={(m) => setModelA(m)}
                excludeSlug={modelB?.slug}
                accentColor="primary"
              />

              <div className="flex items-center">
                <button
                  onClick={handleSwap}
                  disabled={!modelA && !modelB}
                  className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-[0_0_20px_oklch(0.68_0.24_290_/_0.1)]"
                  title="Swap models"
                >
                  <GitCompareArrows className="h-5 w-5 text-primary group-hover:rotate-180 transition-transform duration-500" />
                </button>
              </div>

              <ModelPicker
                label="Model B"
                selected={modelB}
                onSelect={(m) => setModelB(m)}
                excludeSlug={modelA?.slug}
                accentColor="emerald"
              />
            </div>

            {/* Compare Button */}
            <div className="flex justify-center mb-16 animate-fade-up-delay-2">
              <Button
                size="lg"
                disabled={!canCompare}
                onClick={handleCompare}
                className="gap-2 px-10 shadow-[0_0_20px_oklch(0.68_0.24_290_/_0.2)] hover:shadow-[0_0_30px_oklch(0.68_0.24_290_/_0.3)] transition-all disabled:shadow-none"
              >
                Compare Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Popular Comparisons */}
            <section className="animate-fade-up-delay-3">
              <h2 className="text-xl font-bold mb-6 text-center">
                Popular Comparisons
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {popularComparisons.map((comp) => (
                  <Link
                    key={`${comp.slugA}-vs-${comp.slugB}`}
                    href={`/compare/${comp.slugA}/vs/${comp.slugB}`}
                    className="group"
                  >
                    <GlowCard className="p-4 h-full hover:border-primary/30 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-[10px]">
                          {comp.category}
                        </Badge>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                      <div className="text-sm font-medium group-hover:text-primary transition-colors">
                        {comp.labelA} <span className="text-muted-foreground font-normal">vs</span> {comp.labelB}
                      </div>
                    </GlowCard>
                  </Link>
                ))}
              </div>
            </section>

            {/* SEO Content */}
            <section className="mt-16 border-t border-border/60 pt-8 text-center">
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                LLM Trust provides comprehensive comparisons of open-source language models.
                Compare architecture, parameter count, context length, license, benchmarks, and local execution
                requirements. All model data sourced from HuggingFace and community evaluations.
              </p>
              <div className="flex justify-center gap-4 mt-6 flex-wrap">
                <Link href="/best/open-source-llms" className="text-sm text-primary hover:underline">
                  Best Open-Source LLMs
                </Link>
                <Link href="/best/code-llms" className="text-sm text-primary hover:underline">
                  Best Code LLMs
                </Link>
                <Link href="/best/small-llms" className="text-sm text-primary hover:underline">
                  Best Small LLMs
                </Link>
                <Link href="/models" className="text-sm text-primary hover:underline">
                  Browse All Models
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
