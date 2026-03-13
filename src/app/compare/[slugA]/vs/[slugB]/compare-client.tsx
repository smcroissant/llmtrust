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
import { TopBar } from "@/components/layout/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
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
  Sparkles,
  Gauge,
  HardDrive,
  Settings2,
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
  delay,
}: {
  label: string;
  valueA: number;
  valueB: number;
  nameA: string;
  nameB: string;
  unit: string;
  delay: number;
}) {
  const max = Math.max(valueA, valueB);
  const pctA = max > 0 ? (valueA / max) * 100 : 0;
  const pctB = max > 0 ? (valueB / max) * 100 : 0;
  const winner = valueA > valueB ? "A" : valueB > valueA ? "B" : "tie";
  const diff = Math.abs(valueA - valueB);

  const truncate = (s: string, n: number) => (s.length > n ? s.slice(0, n) + "…" : s);

  return (
    <div
      className="group py-4 border-b border-border/40 last:border-0 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold">{label}</span>
        <div className="flex items-center gap-2">
          {winner !== "tie" && (
            <span className="text-xs text-muted-foreground">
              +{diff.toFixed(1)}{unit}
            </span>
          )}
          <Badge
            variant="secondary"
            className={`text-xs ${
              winner === "A"
                ? "bg-primary/10 text-primary border-primary/20"
                : winner === "B"
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {winner === "A" && `🏆 ${truncate(nameA, 10)}`}
            {winner === "B" && `🏆 ${truncate(nameB, 10)}`}
            {winner === "tie" && "🤝 Tie"}
          </Badge>
        </div>
      </div>

      {/* Model A bar */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs text-muted-foreground w-16 text-right truncate shrink-0 font-medium">
          {truncate(nameA, 14)}
        </span>
        <div className="flex-1 h-7 bg-muted/40 rounded-lg overflow-hidden relative">
          <div
            className={`h-full rounded-lg transition-all duration-700 ease-out ${
              winner === "A"
                ? "bg-gradient-to-r from-primary/50 to-primary shadow-[0_0_12px_oklch(0.68_0.24_290_/_0.3)]"
                : "bg-primary/20"
            }`}
            style={{ width: `${pctA}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-end pr-3 text-xs font-mono font-semibold">
            {valueA}{unit}
          </span>
        </div>
      </div>

      {/* Model B bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-16 text-right truncate shrink-0 font-medium">
          {truncate(nameB, 14)}
        </span>
        <div className="flex-1 h-7 bg-muted/40 rounded-lg overflow-hidden relative">
          <div
            className={`h-full rounded-lg transition-all duration-700 ease-out ${
              winner === "B"
                ? "bg-gradient-to-r from-emerald-500/50 to-emerald-500 shadow-[0_0_12px_oklch(0.6_0.18_160_/_0.3)]"
                : "bg-emerald-500/20"
            }`}
            style={{ width: `${pctB}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-end pr-3 text-xs font-mono font-semibold">
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
  label,
}: {
  currentSlug: string;
  onSelect: (slug: string) => void;
  excludeSlug: string;
  label: string;
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
        className="gap-1.5 border-border/60 hover:border-primary/40"
      >
        <ChevronDown className="h-3.5 w-3.5" />
        {label}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full mt-2 z-50 w-72 rounded-xl border border-border/60 bg-card shadow-xl overflow-hidden">
            <div className="p-2 border-b border-border/40">
              <input
                type="text"
                placeholder="Search models..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-muted/50 rounded-lg outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                autoFocus
              />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              ) : filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
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
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors flex items-center justify-between ${
                      m.slug === currentSlug ? "bg-primary/5 text-primary" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {m.architecture} · {m.parameterCount}
                      </p>
                    </div>
                    {m.parameterCount && (
                      <Badge variant="secondary" className="text-[10px] ml-2 shrink-0">
                        {m.parameterCount}
                      </Badge>
                    )}
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
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  valueA: string;
  valueB: string;
  delay?: number;
}) {
  const numA = parseInt(valueA.replace(/[^0-9]/g, ""));
  const numB = parseInt(valueB.replace(/[^0-9]/g, ""));
  let winner: "A" | "B" | "tie" = "tie";
  if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
    winner = numA > numB ? "A" : "B";
  }

  return (
    <div
      className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-4 py-3 border-b border-border/40 last:border-0 group animate-fade-up"
      style={{ animationDelay: `${delay ?? 0}ms` }}
    >
      <div className="flex items-center gap-2 text-muted-foreground text-sm group-hover:text-foreground transition-colors">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className={`text-center text-sm font-medium transition-colors ${winner === "A" ? "text-primary font-semibold" : ""}`}>
        {valueA}
      </div>
      <div className={`text-center text-sm font-medium transition-colors ${winner === "B" ? "text-emerald-500 font-semibold" : ""}`}>
        {valueB}
      </div>
    </div>
  );
}

// ============================================
// Loading Skeleton
// ============================================
function CompareSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="flex items-center justify-center gap-4 mb-10">
        <Skeleton className="h-28 w-64 rounded-xl" />
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-28 w-64 rounded-xl" />
      </div>
      <Skeleton className="h-20 w-full rounded-xl mb-8" />
      <Skeleton className="h-80 w-full rounded-xl mb-8" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}

// ============================================
// 404 Component
// ============================================
function NotFoundDisplay({
  slugA,
  slugB,
  errorA,
  errorB,
}: {
  slugA: string;
  slugB: string;
  errorA: boolean;
  errorB: boolean;
}) {
  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Compare", href: "/compare" },
          { label: "Not Found" },
        ]}
      />
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="relative">
            <div
              className="hero-glow hero-glow-accent"
              style={{ width: 300, height: 300, top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0.4 }}
            />
            <div className="relative text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold mb-2">Model Not Found</h2>
              <p className="text-muted-foreground max-w-md">
                {errorA && errorB
                  ? `Neither "${slugA}" nor "${slugB}" exist in our database.`
                  : errorA
                  ? `Model "${slugA}" doesn't exist.`
                  : `Model "${slugB}" doesn't exist.`}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/models">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse Models
              </Button>
            </Link>
            <Link href="/compare">
              <Button>
                <Sparkles className="mr-2 h-4 w-4" />
                Popular Comparisons
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
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

  const handleSwap = useCallback(() => {
    router.push(`/compare/${slugB}/vs/${slugA}`);
  }, [slugA, slugB, router]);

  const handleSelectA = useCallback((slug: string) => {
    router.push(`/compare/${slug}/vs/${slugB}`);
  }, [slugB, router]);

  const handleSelectB = useCallback((slug: string) => {
    router.push(`/compare/${slugA}/vs/${slug}`);
  }, [slugA, router]);

  // Loading state
  if (loadingA || loadingB) {
    return (
      <>
        <TopBar
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Compare", href: "/compare" },
            { label: "Loading..." },
          ]}
        />
        <div className="flex-1 overflow-auto">
          <CompareSkeleton />
        </div>
      </>
    );
  }

  // 404 state
  const notFoundA = !modelA && !!errorA;
  const notFoundB = !modelB && !!errorB;
  if (notFoundA || notFoundB) {
    return <NotFoundDisplay slugA={slugA} slugB={slugB} errorA={notFoundA} errorB={notFoundB} />;
  }

  if (!modelA || !modelB) return null;

  // Generate deterministic benchmarks
  const benchmarksA = generateBenchmarks(modelA);
  const benchmarksB = generateBenchmarks(modelB);

  // Compute benchmark winner count
  let winsA = 0;
  let winsB = 0;
  benchmarksA.forEach((b, i) => {
    if (b.score > benchmarksB[i].score) winsA++;
    else if (b.score < benchmarksB[i].score) winsB++;
  });
  const totalBenchmarks = benchmarksA.length;
  const ties = totalBenchmarks - winsA - winsB;

  // Extract specs
  const formatA = modelA.localExecution?.format?.toUpperCase() ?? "GGUF";
  const formatB = modelB.localExecution?.format?.toUpperCase() ?? "GGUF";
  const quantsA = modelA.localExecution?.quantizations ?? [];
  const quantsB = modelB.localExecution?.quantizations ?? [];
  const ramA = modelA.localExecution?.recommendedRam;
  const ramB = modelB.localExecution?.recommendedRam;
  const tagsA = (modelA.tags as string[]) ?? [];
  const tagsB = (modelB.tags as string[]) ?? [];

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Compare", href: "/compare" },
          { label: `${modelA.name} vs ${modelB.name}` },
        ]}
      />

      <div className="flex-1 overflow-auto">
        <div className="relative">
          {/* Neural Glow Background */}
          <div
            className="hero-glow hero-glow-primary animate-glow-pulse"
            style={{ width: 500, height: 500, top: -100, right: "10%", opacity: 0.4 }}
          />
          <div
            className="hero-glow hero-glow-accent"
            style={{ width: 400, height: 400, bottom: -100, left: "5%", opacity: 0.3 }}
          />
          <div className="neural-line absolute top-1/4 left-0 right-0 opacity-20" />

          <div className="relative container mx-auto px-4 py-8 max-w-6xl">
            {/* Top Controls */}
            <div className="mb-8 flex items-center justify-between">
              <Link
                href="/compare"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Comparisons
              </Link>
              <div className="flex items-center gap-2">
                <ModelSelector
                  currentSlug={slugA}
                  onSelect={handleSelectA}
                  excludeSlug={slugB}
                  label="Change Model A"
                />
                <ModelSelector
                  currentSlug={slugB}
                  onSelect={handleSelectB}
                  excludeSlug={slugA}
                  label="Change Model B"
                />
              </div>
            </div>

            {/* VS Header */}
            <div className="flex items-stretch justify-center gap-4 md:gap-6 mb-10 animate-fade-up">
              {/* Model A Card */}
              <GlowCard className="flex-1 max-w-sm text-center py-8 px-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Link href={`/models/${modelA.slug}`} className="relative">
                  <p className="text-xs font-semibold text-primary/70 uppercase tracking-widest mb-2">Model A</p>
                  <h2 className="text-2xl font-bold hover:text-primary transition-colors">
                    {modelA.name}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    {modelA.parameterCount && (
                      <Badge variant="secondary" className="text-xs">{modelA.parameterCount}</Badge>
                    )}
                    {modelA.architecture && (
                      <Badge variant="outline" className="text-xs">{modelA.architecture}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
                    {modelA.description}
                  </p>
                </Link>
              </GlowCard>

              {/* VS + Swap */}
              <div className="flex flex-col items-center justify-center gap-3 shrink-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">VS</span>
                <button
                  onClick={handleSwap}
                  className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 hover:bg-primary/20 transition-all group shadow-[0_0_20px_oklch(0.68_0.24_290_/_0.15)] hover:shadow-[0_0_30px_oklch(0.68_0.24_290_/_0.25)]"
                  title="Swap models"
                >
                  <ArrowRightLeft className="h-5 w-5 text-primary group-hover:rotate-180 transition-transform duration-500" />
                </button>
                <span className="text-[10px] text-muted-foreground">Swap</span>
              </div>

              {/* Model B Card */}
              <GlowCard className="flex-1 max-w-sm text-center py-8 px-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Link href={`/models/${modelB.slug}`} className="relative">
                  <p className="text-xs font-semibold text-emerald-500/70 uppercase tracking-widest mb-2">Model B</p>
                  <h2 className="text-2xl font-bold hover:text-emerald-500 transition-colors">
                    {modelB.name}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    {modelB.parameterCount && (
                      <Badge variant="secondary" className="text-xs">{modelB.parameterCount}</Badge>
                    )}
                    {modelB.architecture && (
                      <Badge variant="outline" className="text-xs">{modelB.architecture}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
                    {modelB.description}
                  </p>
                </Link>
              </GlowCard>
            </div>

            {/* Verdict Banner */}
            <GlowCard className="mb-8 animate-fade-up-delay-1 border-primary/20 shadow-[0_0_30px_oklch(0.68_0.24_290_/_0.08)]">
              <GlowCardContent className="py-5">
                <div className="flex items-center justify-center gap-6 md:gap-12 text-sm flex-wrap">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{modelA.name}</span>
                    <Badge className="text-xs shadow-[0_0_10px_oklch(0.68_0.24_290_/_0.2)]">{winsA} wins</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Minus className="h-4 w-4" />
                    <span className="text-xs">{ties} ties</span>
                    <Minus className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-emerald-500" />
                    <span className="font-semibold">{modelB.name}</span>
                    <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{winsB} wins</Badge>
                  </div>
                </div>
              </GlowCardContent>
            </GlowCard>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Specifications */}
              <GlowCard className="animate-fade-up-delay-1">
                <GlowCardHeader>
                  <GlowCardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-primary" />
                    Specifications
                  </GlowCardTitle>
                </GlowCardHeader>
                <GlowCardContent>
                  {/* Column headers */}
                  <div className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-4 pb-3 border-b border-border/60 mb-1">
                    <div />
                    <div className="text-center font-semibold text-sm text-primary truncate">
                      {modelA.name}
                    </div>
                    <div className="text-center font-semibold text-sm text-emerald-500 truncate">
                      {modelB.name}
                    </div>
                  </div>

                  <SpecRow icon={Cpu} label="Architecture" valueA={modelA.architecture ?? "—"} valueB={modelB.architecture ?? "—"} delay={100} />
                  <SpecRow icon={Ruler} label="Parameters" valueA={modelA.parameterCount ?? "—"} valueB={modelB.parameterCount ?? "—"} delay={150} />
                  <SpecRow
                    icon={Clock}
                    label="Context"
                    valueA={modelA.contextLength ? `${modelA.contextLength.toLocaleString()} tokens` : "—"}
                    valueB={modelB.contextLength ? `${modelB.contextLength.toLocaleString()} tokens` : "—"}
                    delay={200}
                  />
                  <SpecRow icon={Scale} label="License" valueA={modelA.license ?? "—"} valueB={modelB.license ?? "—"} delay={250} />
                  <SpecRow
                    icon={Download}
                    label="Downloads"
                    valueA={modelA.downloadCount.toLocaleString()}
                    valueB={modelB.downloadCount.toLocaleString()}
                    delay={300}
                  />
                  <SpecRow
                    icon={Star}
                    label="Rating"
                    valueA={modelA.avgRating > 0 ? `${modelA.avgRating.toFixed(1)} ⭐` : "—"}
                    valueB={modelB.avgRating > 0 ? `${modelB.avgRating.toFixed(1)} ⭐` : "—"}
                    delay={350}
                  />
                  <SpecRow icon={Layers} label="Category" valueA={modelA.category ?? "—"} valueB={modelB.category ?? "—"} delay={400} />
                </GlowCardContent>
              </GlowCard>

              {/* Tags, Format & Quantizations */}
              <GlowCard className="animate-fade-up-delay-2">
                <GlowCardHeader>
                  <GlowCardTitle className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-primary" />
                    Local Execution
                  </GlowCardTitle>
                </GlowCardHeader>
                <GlowCardContent>
                  {/* Column headers */}
                  <div className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-4 pb-3 border-b border-border/60 mb-1">
                    <div />
                    <div className="text-center font-semibold text-sm text-primary truncate">
                      {modelA.name}
                    </div>
                    <div className="text-center font-semibold text-sm text-emerald-500 truncate">
                      {modelB.name}
                    </div>
                  </div>

                  {/* Format */}
                  <SpecRow icon={Gauge} label="Format" valueA={formatA} valueB={formatB} delay={100} />

                  {/* RAM */}
                  <SpecRow
                    icon={HardDrive}
                    label="RAM Needed"
                    valueA={ramA ? `${ramA} GB` : "—"}
                    valueB={ramB ? `${ramB} GB` : "—"}
                    delay={200}
                  />

                  {/* Quantizations */}
                  <div className="py-4 border-b border-border/40 animate-fade-up" style={{ animationDelay: "300ms" }}>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                      <Layers className="h-4 w-4" />
                      Quantizations
                    </div>
                    <div className="grid grid-cols-[1fr_1fr] gap-4">
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {quantsA.length > 0 ? (
                          quantsA.map((q) => (
                            <Badge key={q} variant="secondary" className="text-[10px] font-mono">
                              {q}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {quantsB.length > 0 ? (
                          quantsB.map((q) => (
                            <Badge key={q} variant="secondary" className="text-[10px] font-mono">
                              {q}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="pt-4 animate-fade-up" style={{ animationDelay: "400ms" }}>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                      <Layers className="h-4 w-4" />
                      Tags
                    </div>
                    <div className="grid grid-cols-[1fr_1fr] gap-4">
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {tagsA.length > 0 ? (
                          tagsA.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[10px]">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {tagsB.length > 0 ? (
                          tagsB.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[10px]">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                </GlowCardContent>
              </GlowCard>
            </div>

            {/* Benchmarks */}
            <GlowCard className="mb-8 animate-fade-up-delay-2 shadow-[0_0_30px_oklch(0.68_0.24_290_/_0.06)]">
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
                      delay={i * 80}
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
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-fade-up-delay-3">
              <a href={modelA.downloadUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="gap-2 px-8 shadow-[0_0_20px_oklch(0.68_0.24_290_/_0.2)] hover:shadow-[0_0_30px_oklch(0.68_0.24_290_/_0.3)] transition-shadow"
                >
                  <Download className="h-4 w-4" />
                  Download {modelA.name}
                </Button>
              </a>
              <a href={modelB.downloadUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 px-8 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/50"
                >
                  <Download className="h-4 w-4" />
                  Download {modelB.name}
                </Button>
              </a>
            </div>

            {/* Related Comparisons (from same category) */}
            <RelatedComparisons
              categoryA={modelA.category}
              categoryB={modelB.category}
              slugA={slugA}
              slugB={slugB}
            />

            {/* Footer */}
            <footer className="text-xs text-muted-foreground border-t border-border/40 pt-6 pb-8 mt-8 text-center">
              Scores are estimated ·{" "}
              <Link href="/compare" className="text-primary hover:underline">
                Compare more models
              </Link>
              {" · "}
              <Link href="/models" className="text-primary hover:underline">
                Browse all models
              </Link>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================
// Related Comparisons — Dynamic from same category
// ============================================
function RelatedComparisons({
  categoryA,
  categoryB,
  slugA,
  slugB,
}: {
  categoryA: string | null;
  categoryB: string | null;
  slugA: string;
  slugB: string;
}) {
  // Fetch models from the same categories
  const { data: relatedModelsA } = trpc.models.list.useQuery(
    { category: categoryA ?? undefined, limit: 6, sort: "popular" },
    { enabled: !!categoryA }
  );
  const { data: relatedModelsB } = trpc.models.list.useQuery(
    { category: categoryB ?? undefined, limit: 6, sort: "popular" },
    { enabled: !!categoryB && categoryB !== categoryA }
  );

  // Build comparison links
  const comparisons: { label: string; href: string; category: string }[] = [];

  if (relatedModelsA?.models) {
    relatedModelsA.models.forEach((m) => {
      if (m.slug !== slugA && m.slug !== slugB && comparisons.length < 4) {
        comparisons.push({
          label: `${slugToName(slugA)} vs ${m.name}`,
          href: `/compare/${slugA}/vs/${m.slug}`,
          category: categoryA ?? "Related",
        });
      }
    });
  }

  if (relatedModelsB?.models && comparisons.length < 4) {
    relatedModelsB.models.forEach((m) => {
      if (m.slug !== slugA && m.slug !== slugB && comparisons.length < 4) {
        comparisons.push({
          label: `${slugToName(slugB)} vs ${m.name}`,
          href: `/compare/${slugB}/vs/${m.slug}`,
          category: categoryB ?? "Related",
        });
      }
    });
  }

  if (comparisons.length === 0) return null;

  return (
    <section className="border-t border-border/60 pt-8 pb-4">
      <h2 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-2">
        <ArrowRight className="h-5 w-5 text-primary" />
        Related Comparisons
        <Badge variant="secondary" className="text-[10px] ml-1">
          Same category
        </Badge>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {comparisons.map((link) => (
          <Link key={link.href} href={link.href} className="group">
            <GlowCard className="p-4 h-full hover:border-primary/30 transition-all">
              <p className="text-xs text-muted-foreground mb-1">{link.category}</p>
              <div className="flex items-center gap-2 text-sm group-hover:text-primary transition-colors font-medium">
                <ArrowRight className="size-3.5 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                <span className="line-clamp-1">{link.label}</span>
              </div>
            </GlowCard>
          </Link>
        ))}
        <Link href="/compare" className="group">
          <GlowCard className="p-4 h-full hover:border-primary/30 transition-all border-dashed">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors h-full">
              <Sparkles className="size-3.5" />
              <span className="font-medium">Browse All</span>
            </div>
          </GlowCard>
        </Link>
      </div>
    </section>
  );
}

function slugToName(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
