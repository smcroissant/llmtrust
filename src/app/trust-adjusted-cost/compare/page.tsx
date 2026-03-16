"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { trpc } from "@/lib/trpc";
import { formatTAC, getTACGrade } from "@/lib/tac";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Zap,
  Shield,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

function CompareContent() {
  const searchParams = useSearchParams();
  const modelSlugs = searchParams.get("models")?.split(",").filter(Boolean) ?? [];

  const { data, isLoading } = trpc.tac.compare.useQuery(
    { slugs: modelSlugs },
    { enabled: modelSlugs.length > 0 }
  );

  if (modelSlugs.length === 0) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No models selected for comparison.</p>
            <Button
              variant="outline"
              className="mt-4"
              render={<Link href="/trust-adjusted-cost" />}
            >
              Back to TAC Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2"
          render={<Link href="/trust-adjusted-cost" />}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to TAC Dashboard
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <Zap className="h-7 w-7 text-emerald-500" />
          <h1 className="text-2xl font-bold tracking-tight">TAC Comparison</h1>
        </div>
        <p className="text-muted-foreground">
          Side-by-side trust-adjusted cost comparison for up to 4 models
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modelSlugs.map((slug) => (
            <Skeleton key={slug} className="h-64 w-full" />
          ))}
        </div>
      ) : data?.models && data.models.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.models.map((item) => {
            const bestScore = item.tacScores[0];
            if (!bestScore) {
              return (
                <Card key={item.model.slug}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.model.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">No TAC data available</p>
                  </CardContent>
                </Card>
              );
            }

            const nominalCost = parseFloat(bestScore.nominalCostPerMToken);
            const tacCost = parseFloat(bestScore.tacPerMToken);
            const ratio = nominalCost > 0 ? tacCost / nominalCost : 1;
            const grade = getTACGrade(ratio);
            const penalty = tacCost - nominalCost;

            return (
              <Card key={item.model.slug} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.model.name}</CardTitle>
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
                  </div>
                  <CardDescription>
                    <Badge variant="secondary" className="mt-1">
                      {bestScore.providerId}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  {/* Cost comparison */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Nominal</span>
                      <span className="font-mono text-sm">{formatTAC(nominalCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">TAC</span>
                      <span className="font-mono text-sm font-bold text-emerald-600">
                        {formatTAC(tacCost)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Penalty</span>
                      <span
                        className={cn(
                          "font-mono text-sm",
                          penalty > 0 ? "text-red-500" : "text-emerald-500"
                        )}
                      >
                        {penalty > 0 ? "+" : ""}
                        {formatTAC(Math.abs(penalty))}
                      </span>
                    </div>
                  </div>

                  {/* Score breakdown */}
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Shield className="h-3 w-3 text-red-500" />
                      <span className="text-xs flex-1">Reliability</span>
                      <span className="text-xs font-mono">{bestScore.reliabilityScore}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-orange-500" />
                      <span className="text-xs flex-1">Hallucination</span>
                      <span className="text-xs font-mono">
                        {(parseFloat(bestScore.hallucinationRate) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs flex-1">Consistency</span>
                      <span className="text-xs font-mono">{bestScore.consistencyScore}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-blue-500" />
                      <span className="text-xs flex-1">Compliance</span>
                      <span className="text-xs font-mono">{bestScore.complianceScore}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No TAC data found for the selected models.</p>
            <Button
              variant="outline"
              className="mt-4"
              render={<Link href="/trust-adjusted-cost" />}
            >
              Back to TAC Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function TACComparePage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
