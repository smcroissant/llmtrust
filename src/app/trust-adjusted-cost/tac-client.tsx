"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { formatTAC, getTACGrade } from "@/lib/tac";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  ArrowUpDown,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function TACPageClient() {
  const [sortBy, setSortBy] = useState<"tac" | "nominal" | "penalty">("tac");
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [compareModels, setCompareModels] = useState<string[]>([]);

  const { data: providers } = trpc.tac.providers.useQuery();

  const { data: leaderboardData, isLoading } =
    trpc.tac.computeFromTrustScores.useQuery({
      limit: 50,
    });

  // Filter by provider
  const filteredScores =
    leaderboardData?.scores.filter(
      (s) =>
        selectedProvider === "all" || s.providerId === selectedProvider,
    ) ?? [];

  // Sort
  const sortedScores = [...filteredScores].sort((a, b) => {
    if (sortBy === "tac") return a.tacPerMToken - b.tacPerMToken;
    if (sortBy === "nominal")
      return a.nominalCostPerMToken - b.nominalCostPerMToken;
    return a.savingsOrPenalty - b.savingsOrPenalty;
  });

  const toggleCompare = (modelId: string) => {
    setCompareModels((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : prev.length < 4
          ? [...prev, modelId]
          : prev,
    );
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="h-8 w-8 text-emerald-500" />
          <h1 className="text-3xl font-bold tracking-tight">
            Trust-Adjusted Cost
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl">
          The <span className="font-semibold text-foreground">nominal price</span> of
          an LLM is just the sticker price. <span className="font-semibold text-foreground">TAC</span> reveals
          the true cost when you factor in reliability, hallucination rates,
          consistency, and compliance risk.
        </p>
      </div>

      {/* How TAC Works */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5" />
            How TAC is Calculated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-red-500/10 p-2">
                <TrendingUp className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Reliability</p>
                <p className="text-xs text-muted-foreground">
                  Unreliable models need retries, increasing effective cost
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-orange-500/10 p-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Hallucination</p>
                <p className="text-xs text-muted-foreground">
                  Hallucinated outputs need human review and re-generation
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-yellow-500/10 p-2">
                <BarChart3 className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Consistency</p>
                <p className="text-xs text-muted-foreground">
                  Inconsistent models waste tokens on re-prompts
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Compliance</p>
                <p className="text-xs text-muted-foreground">
                  Non-compliant models carry regulatory risk cost
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-muted p-4">
            <code className="text-sm">
              TAC = nominalCost × (1 / reliability) × (1 + hallucinationRate × 3) ×
              consistencyPenalty × compliancePenalty
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Filters & Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select
            value={sortBy}
            onValueChange={(v) => { if (v) setSortBy(v as typeof sortBy); }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tac">TAC (lowest first)</SelectItem>
              <SelectItem value="nominal">Nominal Cost</SelectItem>
              <SelectItem value="penalty">TAC Penalty</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Provider:</span>
          <Select value={selectedProvider} onValueChange={(v) => { if (v) setSelectedProvider(v); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              {providers?.map((p) => (
                <SelectItem key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {compareModels.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/trust-adjusted-cost/compare?models=${compareModels.join(",")}`} />}
          >
            Compare {compareModels.length} models
          </Button>
        )}
      </div>

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">TAC Leaderboard</CardTitle>
          <CardDescription>
            Models ranked by trust-adjusted cost — lower is better
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead className="text-right">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1 ml-auto">
                        Nominal <Info className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>Cost per 1M tokens (sticker price)</TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="text-right">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1 ml-auto">
                        TAC <Info className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>Trust-Adjusted Cost per 1M tokens</TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="text-right">Penalty</TableHead>
                  <TableHead className="text-right">Grade</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedScores.map((score, i) => {
                  const ratio =
                    score.nominalCostPerMToken > 0
                      ? score.tacPerMToken / score.nominalCostPerMToken
                      : 1;
                  const grade = getTACGrade(ratio);

                  return (
                    <TableRow key={`${score.modelId}-${score.providerId}`}>
                      <TableCell className="font-medium text-muted-foreground">
                        {i + 1}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/models/${score.modelSlug}`}
                          className="font-medium hover:underline"
                        >
                          {score.modelName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{score.providerId}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatTAC(score.nominalCostPerMToken)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-semibold">
                        {formatTAC(score.tacPerMToken)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={cn(
                            "text-sm font-mono",
                            score.savingsOrPenalty > 0
                              ? "text-red-500"
                              : "text-emerald-500",
                          )}
                        >
                          {score.savingsOrPenalty > 0 ? "+" : ""}
                          {formatTAC(Math.abs(score.savingsOrPenalty))}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={cn(
                            grade.color === "emerald" && "border-emerald-500 text-emerald-600",
                            grade.color === "green" && "border-green-500 text-green-600",
                            grade.color === "lime" && "border-lime-500 text-lime-600",
                            grade.color === "yellow" && "border-yellow-500 text-yellow-600",
                            grade.color === "orange" && "border-orange-500 text-orange-600",
                            grade.color === "red" && "border-red-500 text-red-600",
                          )}
                        >
                          {grade.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={compareModels.includes(score.modelId) ? "default" : "ghost"}
                          size="sm"
                          onClick={() => toggleCompare(score.modelId)}
                          disabled={
                            !compareModels.includes(score.modelId) &&
                            compareModels.length >= 4
                          }
                        >
                          {compareModels.includes(score.modelId) ? "✓" : "+"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {sortedScores.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Best TAC Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {sortedScores[0]?.modelName}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatTAC(sortedScores[0]?.tacPerMToken ?? 0)} per 1M tokens
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg TAC Penalty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatTAC(
                  sortedScores.reduce((sum, s) => sum + s.savingsOrPenalty, 0) /
                    sortedScores.length,
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                Average overhead above nominal cost
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Models Tracked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{sortedScores.length}</p>
              <p className="text-sm text-muted-foreground">
                Across {new Set(sortedScores.map((s) => s.providerId)).size}{" "}
                providers
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">
          Want real-time trust scores from your production data?
        </p>
        <Button render={<Link href="/docs/api" />}>
          Explore the Enterprise API
        </Button>
      </div>
    </div>
  );
}
