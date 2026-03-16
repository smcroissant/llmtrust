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
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  Zap,
  Shield,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TACModelDetailClientProps {
  model: { id: string; name: string; slug: string };
  scores: Array<{
    providerId: string;
    nominalCostPerMToken: string;
    tacPerMToken: string;
    reliabilityScore: number;
    consistencyScore: number;
    complianceScore: number;
    hallucinationRate: string;
    reliabilityMultiplier: string;
    hallucinationOverhead: string;
    consistencyPenalty: string;
    compliancePenalty: string;
    sampleSize: number;
    computedAt: Date;
  }>;
  slug: string;
}

export function TACModelDetailClient({ model, scores, slug }: TACModelDetailClientProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>(
    scores[0]?.providerId ?? ""
  );
  const [historyDays, setHistoryDays] = useState<number>(30);

  const currentScore = scores.find((s) => s.providerId === selectedProvider) ?? scores[0];

  const { data: historyData, isLoading: historyLoading } = trpc.tac.history.useQuery(
    {
      modelId: model.id,
      providerId: selectedProvider,
      days: historyDays,
    },
    { enabled: !!model.id && !!selectedProvider }
  );

  if (!currentScore) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No TAC data available for this model yet.</p>
            <Button variant="outline" className="mt-4" render={<Link href="/trust-adjusted-cost" />}>Back to TAC Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const nominalCost = parseFloat(currentScore.nominalCostPerMToken);
  const tacCost = parseFloat(currentScore.tacPerMToken);
  const ratio = nominalCost > 0 ? tacCost / nominalCost : 1;
  const grade = getTACGrade(ratio);
  const penalty = tacCost - nominalCost;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4 -ml-2" render={<Link href="/trust-adjusted-cost" />}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to TAC Dashboard
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-7 w-7 text-emerald-500" />
              <h1 className="text-2xl font-bold tracking-tight">{model.name}</h1>
            </div>
            <p className="text-muted-foreground">
              Trust-Adjusted Cost breakdown — the true cost when reliability, hallucination,
              consistency, and compliance are factored in.
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-lg px-3 py-1",
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
        </div>
      </div>

      {/* Provider selector */}
      {scores.length > 1 && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-muted-foreground">Provider:</span>
          <Select value={selectedProvider} onValueChange={(v) => { if (v) setSelectedProvider(v); }}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {scores.map((s) => (
                <SelectItem key={s.providerId} value={s.providerId}>
                  {s.providerId.charAt(0).toUpperCase() + s.providerId.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* TAC Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nominal Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-mono">{formatTAC(nominalCost)}</p>
            <p className="text-xs text-muted-foreground">per 1M tokens (sticker price)</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-500/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Trust-Adjusted Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-mono text-emerald-600">{formatTAC(tacCost)}</p>
            <p className="text-xs text-muted-foreground">per 1M tokens (true cost)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              TAC Penalty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={cn(
              "text-3xl font-bold font-mono",
              penalty > 0 ? "text-red-500" : "text-emerald-500"
            )}>
              {penalty > 0 ? "+" : ""}{formatTAC(Math.abs(penalty))}
            </p>
            <p className="text-xs text-muted-foreground">
              {penalty > 0 ? "overhead above nominal" : "below nominal cost"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TAC Breakdown */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            TAC Breakdown
          </CardTitle>
          <CardDescription>
            How each factor contributes to the trust-adjusted cost
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reliability */}
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-red-500/10 p-2.5 shrink-0">
                <Shield className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">Reliability</p>
                  <span className="text-sm font-mono">{currentScore.reliabilityScore}/100</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-1">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${currentScore.reliabilityScore}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Multiplier: {currentScore.reliabilityMultiplier}× —
                  unreliable models need retries, increasing effective cost
                </p>
              </div>
            </div>

            {/* Hallucination */}
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-orange-500/10 p-2.5 shrink-0">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">Hallucination</p>
                  <span className="text-sm font-mono">{(parseFloat(currentScore.hallucinationRate) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-1">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${parseFloat(currentScore.hallucinationRate) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Overhead: {currentScore.hallucinationOverhead}× —
                  hallucinated outputs need human review and re-generation
                </p>
              </div>
            </div>

            {/* Consistency */}
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-yellow-500/10 p-2.5 shrink-0">
                <BarChart3 className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">Consistency</p>
                  <span className="text-sm font-mono">{currentScore.consistencyScore}/100</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-1">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${currentScore.consistencyScore}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Penalty: {currentScore.consistencyPenalty}× —
                  inconsistent models waste tokens on re-prompts
                </p>
              </div>
            </div>

            {/* Compliance */}
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-blue-500/10 p-2.5 shrink-0">
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">Compliance</p>
                  <span className="text-sm font-mono">{currentScore.complianceScore}/100</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-1">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${currentScore.complianceScore}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Penalty: {currentScore.compliancePenalty}× —
                  non-compliant models carry regulatory risk cost
                </p>
              </div>
            </div>
          </div>

          {/* Formula */}
          <div className="mt-6 rounded-lg bg-muted p-4">
            <p className="text-xs text-muted-foreground mb-1">Formula:</p>
            <code className="text-sm">
              {formatTAC(nominalCost)} × {currentScore.reliabilityMultiplier} × {currentScore.hallucinationOverhead} × {currentScore.consistencyPenalty} × {currentScore.compliancePenalty} = <strong>{formatTAC(tacCost)}</strong>
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Historical Trend */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                TAC History
              </CardTitle>
              <CardDescription>Trust-adjusted cost over time</CardDescription>
            </div>
            <Select value={String(historyDays)} onValueChange={(v) => { if (v) setHistoryDays(Number(v)); }}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : historyData?.history && historyData.history.length > 0 ? (
            <div className="space-y-2">
              {/* Simple text-based trend (no chart library needed) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {historyData.history.slice(-4).map((h, i) => (
                  <div key={i} className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">
                      {new Date(h.snapshotDate).toLocaleDateString()}
                    </p>
                    <p className="text-lg font-bold font-mono">{formatTAC(parseFloat(h.tacPerMToken))}</p>
                    <p className="text-xs text-muted-foreground">
                      Nominal: {formatTAC(parseFloat(h.nominalCostPerMToken))}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                {historyData.history.length} data points over {historyDays} days
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No historical data yet. TAC snapshots are collected daily.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Sample size info */}
      <div className="text-center text-xs text-muted-foreground">
        Based on {currentScore.sampleSize} trust signal samples · Computed{" "}
        {new Date(currentScore.computedAt).toLocaleDateString()}
      </div>
    </div>
  );
}
