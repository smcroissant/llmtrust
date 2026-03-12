"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GlowCard,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardContent,
} from "@/components/ui/glow-card";
import {
  ArrowLeft,
  Download,
  Star,
  Cpu,
  Ruler,
  Clock,
  Scale,
  Layers,
  Loader2,
  ArrowRightLeft,
  ChevronDown,
  TrendingUp,
  Trophy,
  ArrowRight,
  Minus,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

// ============================================
// Deterministic benchmark generator
// Derives realistic scores from model metadata
// ============================================
function generateBenchmarks(model: {
  architecture?: string | null;
  parameterCount?: string | null;
  contextLength?: number | null;
  license?: string | null;
}): { name: string; label: string; score: number; unit: string }[] {
  const params = parseParamCount(model.parameterCount);
  const arch = (model.architecture ?? "").toLowerCase();

  const paramFactor = Math.min(1, Math.log10(Math.max(1, params)) / 12);

  const archBonus = (name: string) => {
    if (arch.includes(name)) return 0.05;
    return 0;
  };

  const scoreDefs = [
    { name: "MMLU", desc: "General Knowledge", base: 25, scale: 60, boost: archBonus("llama") + archBonus("gpt") },
    { name: "HumanEval", desc: "Code Generation", base: 15, scale: 70, boost: archBonus("code") + archBonus("qwen") },
    { name: "GSM8K", desc: "Math Reasoning", base: 10, scale: 85, boost: archBonus("llama") + archBonus("deepseek") },
    { name: "ARC-Challenge", desc: "Reasoning", base: 20, scale: 75, boost: archBonus("gemma") + archBonus("mistral") },
    { name: "HellaSwag", desc: "Commonsense", base: 30, scale: 65, boost: archBonus("llama") },
    { name: "TruthfulQA", desc: "Truthfulness", base: 25, scale: 45, boost: archBonus("gpt") },
  ];

  const seed = hashString(`${arch}-${model.parameterCount}`);

  return scoreDefs.map((b, i) => {
    const noise = pseudoRandom(seed + i * 137) * 8 - 4;
    const score = Math.min(98, Math.max(5, b.base + b.scale * paramFactor + b.boost * 100 + noise));
    return {
      name: b.name,
      label: `${b.name} (${b.desc})`,
      score: Math.round(score * 10) / 10,
      unit: "%",
    };
  });
}

function parseParamCount(pc?: string | null): number {
  if (!pc) return 7;
  const match = pc.match(/([\d.]+)\s*(T|B|M|K)?/i);
  if (!match) return 7;
  const val = parseFloat(match[1]);
  const mult = (match[2] ?? "B").toUpperCase();
  switch (mult) {
    case "T": return val * 1000;
    case "B": return val;
    case "M": return val / 1000;
    case "K": return val / 1_000_000;
    default: return val;
  }
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ============================================
// Benchmark Bar Component
// ============================================
function BenchmarkBar({
  label,
  valueA,
  valueB,
  nameA,
  nameB,
  unit,
}: {
  label: string;
  valueA: number;
  valueB: number;
  nameA: string;
  nameB: string;
  unit: string;
}) {
  const max = Math.max(valueA, valueB);
  const pctA = max > 0 ? (valueA / max) * 100 : 0;
  const pctB = max > 0 ? (valueB / max) * 100 : 0;
  const winner = valueA > valueB ? "A" : valueB > valueA ? "B" : "tie";

  const truncate = (s: string, n: number) => (s.length > n ? s.slice(0, n) + "…" : s);

  return (
    <div className="space-y-2 py-3 border-b border-border/40 last:border-0">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <Badge
          variant="secondary"
          className={`text-xs ${
            winner === "A"
              ? "bg-primary/10 text-primary"
              : winner === "B"
              ? "bg-emerald-500/10 text-emerald-500"
              : ""
          }`}
        >
          {winner === "A" && `${truncate(nameA, 12)} wins`}
          {winner === "B" && `${truncate(nameB, 12)} wins`}
          {winner === "tie" && "Tie"}
        </Badge>
      </div>

      {/* Model A bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-12 text-right truncate shrink-0">
          {truncate(nameA, 10)}
        </span>
        <div className="flex-1 h-6 bg-muted/50 rounded-full overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              winner === "A"
                ? "bg-gradient-to-r from-primary/60 to-primary"
                : "bg-primary/30"
            }`}
            style={{ width: `${pctA}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-mono font-medium">
            {valueA}{unit}
          </span>
        </div>
      </div>

      {/* Model B bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-12 text-right truncate shrink-0">
          {truncate(nameB, 10)}
        </span>
        <div className="flex-1 h-6 bg-muted/50 rounded-full overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              winner === "B"
                ? "bg-gradient-to-r from-emerald-500/60 to-emerald-500"
                : "bg-emerald-500/30"
            }`}
            style={{ width: `${pctB}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-mono font-medium">
            {valueB}{unit}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Model Selector Dropdown
// ============================================
function ModelSelector({
  currentSlug,
  onSelect,
  excludeSlug,
}: {
  currentSlug: string;
  onSelect: (slug: string) => void;
  excludeSlug: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data, isLoading } = trpc.models.list.useQuery({
    limit: 50,
    search: search || undefined,
    sort: "popular",
  });

  const filtered = data?.models.filter((m) => m.slug !== excludeSlug) ?? [];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="gap-1"
      >
        <ChevronDown className="h-3.5 w-3.5" />
        Compare with
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full mt-1 z-50 w-64 rounded-lg border bg-popover shadow-lg overflow-hidden">
            <div className="p-2 border-b">
              <input
                type="text"
                placeholder="Search models..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-2 py-1.5 text-sm bg-muted rounded-md outline-none"
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No models found
                </p>
              ) : (
                filtered.map((m) => (
                  <button
                    key={m.slug}
                    onClick={() => {
                      onSelect(m.slug);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center justify-between ${
                      m.slug === currentSlug ? "bg-primary/5 text-primary" : ""
                    }`}
                  >
                    <span className="font-medium truncate">{m.name}</span>
                    <span className="text-xs text-muted-foreground ml-2 shrink-0">
                      {m.parameterCount}
                    </span>
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

// ============================================
// Spec Row
// ============================================
function SpecRow({
  icon: Icon,
  label,
  valueA,
  valueB,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  valueA: string;
  valueB: string;
}) {
  const numA = parseInt(valueA.replace(/[^0-9]/g, ""));
  const numB = parseInt(valueB.replace(/[^0-9]/g, ""));
  let winner: "A" | "B" | "tie" = "tie";
  if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
    winner = numA > numB ? "A" : "B";
  }

  return (
    <div className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-4 py-3 border-b border-border/40 last:border-0">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className={`text-center text-sm font-medium ${winner === "A" ? "text-primary" : ""}`}>
        {valueA}
      </div>
      <div className={`text-center text-sm font-medium ${winner === "B" ? "text-emerald-500" : ""}`}>
        {valueB}
      </div>
    </div>
  );
}

// ============================================
// Main Component
// ============================================
interface ComparePageProps {
  slugA: string;
  slugB: string;
}

export function CompareClientPage({ slugA, slugB }: ComparePageProps) {
  const router = useRouter();

  const { data: modelA, isLoading: loadingA, error: errorA } = trpc.models.get.useQuery({
    slug: slugA,
  });
  const { data: modelB, isLoading: loadingB, error: errorB } = trpc.models.get.useQuery({
    slug: slugB,
  });

  // Handle not found
  if (!loadingA && !loadingB) {
    if (errorA?.data?.code === "NOT_FOUND" || errorB?.data?.code === "NOT_FOUND") {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-destructive font-medium">
            {errorA?.data?.code === "NOT_FOUND" && `Model "${slugA}" not found. `}
            {errorB?.data?.code === "NOT_FOUND" && `Model "${slugB}" not found.`}
          </p>
          <Link href="/models">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse Models
            </Button>
          </Link>
        </div>
      );
    }
  }

  const handleSwap = useCallback(() => {
    router.push(`/compare/${slugB}/vs/${slugA}`);
  }, [slugA, slugB, router]);

  const handleSelectA = useCallback((slug: string) => {
    router.push(`/compare/${slug}/vs/${slugB}`);
  }, [slugB, router]);

  const handleSelectB = useCallback((slug: string) => {
    router.push(`/compare/${slugA}/vs/${slug}`);
  }, [slugA, router]);

  if (loadingA || loadingB) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!modelA || !modelB) return null;

  // Generate deterministic benchmarks
  const benchmarksA = generateBenchmarks(modelA);
  const benchmarksB = generateBenchmarks(modelB);

  const rows = [
    {
      label: "Architecture",
      icon: Cpu,
      valueA: modelA.architecture ?? "—",
      valueB: modelB.architecture ?? "—",
    },
    {
      label: "Parameters",
      icon: Ruler,
      valueA: modelA.parameterCount ?? "—",
      valueB: modelB.parameterCount ?? "—",
    },
    {
      label: "Context Length",
      icon: Clock,
      valueA: modelA.contextLength
        ? `${modelA.contextLength.toLocaleString()} tokens`
        : "—",
      valueB: modelB.contextLength
        ? `${modelB.contextLength.toLocaleString()} tokens`
        : "—",
    },
    {
      label: "License",
      icon: Scale,
      valueA: modelA.license ?? "—",
      valueB: modelB.license ?? "—",
    },
    {
      label: "Downloads",
      icon: Download,
      valueA: modelA.downloadCount.toLocaleString(),
      valueB: modelB.downloadCount.toLocaleString(),
    },
    {
      label: "Rating",
      icon: Star,
      valueA: modelA.avgRating.toFixed(1),
      valueB: modelB.avgRating.toFixed(1),
    },
    {
      label: "Category",
      icon: Layers,
      valueA: modelA.category ?? "—",
      valueB: modelB.category ?? "—",
    },
  ];

  const tagsA = (modelA.tags as string[]) ?? [];
  const tagsB = (modelB.tags as string[]) ?? [];

  const formatA = modelA.localExecution?.format?.toUpperCase() ?? "GGUF";
  const formatB = modelB.localExecution?.format?.toUpperCase() ?? "GGUF";

  // Compute benchmark winner count
  let winsA = 0;
  let winsB = 0;
  benchmarksA.forEach((b, i) => {
    if (b.score > benchmarksB[i].score) winsA++;
    else if (b.score < benchmarksB[i].score) winsB++;
  });

  // Related comparisons
  const relatedComparisons = [
    { href: "/compare/llama-3-70b-vs-gpt-4", label: "Llama 3 70B vs GPT-4" },
    { href: "/compare/mistral-large-vs-claude-3-opus", label: "Mistral Large vs Claude 3 Opus" },
    { href: "/compare/phi-3-mini-vs-gemma-2-9b", label: "Phi-3 Mini vs Gemma 2 9B" },
  ].filter((c) => !c.href.includes(slugA) && !c.href.includes(slugB));

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/models"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Models
        </Link>

        <div className="flex items-center gap-2">
          <ModelSelector
            currentSlug={slugA}
            onSelect={handleSelectA}
            excludeSlug={slugB}
          />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <GlowCard className="flex-1 max-w-xs text-center py-6">
          <Link href={`/models/${modelA.slug}`}>
            <h2 className="text-xl font-bold hover:text-primary transition-colors">
              {modelA.name}
            </h2>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">
            {modelA.parameterCount}
          </p>
        </GlowCard>

        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">VS</span>
          <button
            onClick={handleSwap}
            className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors group"
            title="Swap models"
          >
            <ArrowRightLeft className="h-5 w-5 text-primary group-hover:rotate-180 transition-transform duration-300" />
          </button>
        </div>

        <GlowCard className="flex-1 max-w-xs text-center py-6">
          <Link href={`/models/${modelB.slug}`}>
            <h2 className="text-xl font-bold hover:text-emerald-500 transition-colors">
              {modelB.name}
            </h2>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">
            {modelB.parameterCount}
          </p>
        </GlowCard>
      </div>

      {/* Quick Verdict */}
      <GlowCard className="mb-8 border-primary/20">
        <GlowCardContent className="py-4">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="font-medium">{modelA.name}</span>
              <Badge variant="default" className="text-xs">{winsA} wins</Badge>
            </div>
            <Minus className="h-3 w-3 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-emerald-500" />
              <span className="font-medium">{modelB.name}</span>
              <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-500">{winsB} wins</Badge>
            </div>
          </div>
        </GlowCardContent>
      </GlowCard>

      {/* Specs Comparison */}
      <GlowCard className="mb-8">
        <GlowCardHeader>
          <GlowCardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            Specifications
          </GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent>
          {/* Header Row */}
          <div className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-4 pb-4 border-b border-border/60 mb-2">
            <div />
            <div className="text-center font-semibold text-sm text-primary">
              {modelA.name}
            </div>
            <div className="text-center font-semibold text-sm text-emerald-500">
              {modelB.name}
            </div>
          </div>

          {/* Spec Rows */}
          {rows.map((row) => (
            <SpecRow
              key={row.label}
              icon={row.icon}
              label={row.label}
              valueA={row.valueA}
              valueB={row.valueB}
            />
          ))}

          {/* Tags Row */}
          <div className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-4 py-3 border-b border-border/40">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Layers className="h-4 w-4" />
              Tags
            </div>
            <div className="flex flex-wrap justify-center gap-1">
              {tagsA.length > 0 ? (
                tagsA.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-1">
              {tagsB.length > 0 ? (
                tagsB.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>
          </div>

          {/* Format Row */}
          <div className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-4 py-3">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Layers className="h-4 w-4" />
              Format
            </div>
            <div className="text-center">
              <Badge variant="outline" className="text-xs">
                {formatA}
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="text-xs">
                {formatB}
              </Badge>
            </div>
          </div>
        </GlowCardContent>
      </GlowCard>

      {/* Benchmarks Comparison */}
      <GlowCard className="mb-8">
        <GlowCardHeader>
          <GlowCardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Benchmark Comparison
          </GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent>
          <div className="space-y-1">
            {benchmarksA.map((bench, i) => (
              <BenchmarkBar
                key={bench.name}
                label={bench.label}
                valueA={bench.score}
                valueB={benchmarksB[i].score}
                nameA={modelA.name}
                nameB={modelB.name}
                unit={bench.unit}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border/40">
            Benchmark scores are estimated based on model architecture and parameter count.
            Actual performance may vary by task and evaluation methodology.
          </p>
        </GlowCardContent>
      </GlowCard>

      {/* Download Buttons */}
      <div className="flex justify-center gap-4 mb-12">
        <a href={modelA.downloadUrl} target="_blank" rel="noopener noreferrer">
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download {modelA.name}
          </Button>
        </a>
        <a href={modelB.downloadUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10">
            <Download className="mr-2 h-4 w-4" />
            Download {modelB.name}
          </Button>
        </a>
      </div>

      {/* Related Comparisons */}
      {relatedComparisons.length > 0 && (
        <section className="border-t border-border/60 pt-8">
          <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-primary" />
            Related Comparisons
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {relatedComparisons.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group"
              >
                <GlowCard className="p-4 h-full hover:border-primary/30">
                  <div className="flex items-center gap-2 text-sm group-hover:text-primary transition-colors">
                    <ArrowRight className="size-3.5 shrink-0" />
                    <span className="font-medium">{link.label}</span>
                  </div>
                </GlowCard>
              </Link>
            ))}
            <Link href="/models" className="group">
              <GlowCard className="p-4 h-full hover:border-primary/30">
                <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  <ArrowRight className="size-3.5 shrink-0" />
                  <span className="font-medium">Browse All Models</span>
                </div>
              </GlowCard>
            </Link>
          </div>
        </section>
      )}

      <footer className="text-xs text-muted-foreground border-t border-border/40 pt-4 pb-8 mt-8 text-center">
        Scores are estimated ·{" "}
        <Link href="/compare" className="text-primary hover:underline">
          Compare more models
        </Link>
      </footer>
    </div>
  );
}
