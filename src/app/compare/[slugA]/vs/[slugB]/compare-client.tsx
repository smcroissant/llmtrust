"use client";

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
} from "lucide-react";
import { trpc } from "@/lib/trpc";

interface ComparePageProps {
  slugA: string;
  slugB: string;
}

export function CompareClientPage({ slugA, slugB }: ComparePageProps) {
  const { data: modelA, isLoading: loadingA } = trpc.models.get.useQuery({
    slug: slugA,
  });
  const { data: modelB, isLoading: loadingB } = trpc.models.get.useQuery({
    slug: slugB,
  });

  if (loadingA || loadingB) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!modelA || !modelB) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-destructive font-medium">Model(s) not found</p>
        <Link href="/models">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Models
          </Button>
        </Link>
      </div>
    );
  }

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

  const formatA =
    modelA.localExecution?.format?.toUpperCase() ?? "GGUF";
  const formatB =
    modelB.localExecution?.format?.toUpperCase() ?? "GGUF";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/models"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Models
        </Link>
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

        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 shrink-0">
          <ArrowRightLeft className="h-5 w-5 text-primary" />
        </div>

        <GlowCard className="flex-1 max-w-xs text-center py-6">
          <Link href={`/models/${modelB.slug}`}>
            <h2 className="text-xl font-bold hover:text-primary transition-colors">
              {modelB.name}
            </h2>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">
            {modelB.parameterCount}
          </p>
        </GlowCard>
      </div>

      {/* Comparison Table */}
      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle>Side-by-Side Comparison</GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent>
          {/* Header Row */}
          <div className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-4 pb-4 border-b border-border/60 mb-4">
            <div />
            <div className="text-center font-semibold text-sm">
              {modelA.name}
            </div>
            <div className="text-center font-semibold text-sm">
              {modelB.name}
            </div>
          </div>

          {/* Spec Rows */}
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-4 py-3 border-b border-border/40 last:border-0"
            >
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <row.icon className="h-4 w-4" />
                {row.label}
              </div>
              <div className="text-center text-sm font-medium">
                {row.valueA}
              </div>
              <div className="text-center text-sm font-medium">
                {row.valueB}
              </div>
            </div>
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

      {/* Download Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <a
          href={modelA.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download {modelA.name}
          </Button>
        </a>
        <a
          href={modelB.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download {modelB.name}
          </Button>
        </a>
      </div>
    </div>
  );
}
