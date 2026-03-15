"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Loader2, TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { cn } from "@/lib/utils";

function ScoreBar({ score, max = 100 }: { score: number; max?: number }) {
  const percentage = (score / max) * 100;
  const color =
    score >= 80
      ? "bg-emerald-500"
      : score >= 60
        ? "bg-yellow-500"
        : score >= 40
          ? "bg-orange-500"
          : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium tabular-nums w-8">{score}</span>
    </div>
  );
}

function TrendIcon({ trend }: { trend: string | null }) {
  if (!trend) return <Minus className="h-4 w-4 text-muted-foreground" />;
  if (trend === "up")
    return <TrendingUp className="h-4 w-4 text-emerald-500" />;
  if (trend === "down")
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

export function TrustScoresClient() {
  const [sort, setSort] = useState<
    "overall" | "reliability" | "consistency" | "cost_efficiency"
  >("overall");
  const [periodDays, setPeriodDays] = useState<number>(7);

  const { data, isLoading } = trpc.trustScores.list.useQuery({
    sort,
    periodDays,
    limit: 50,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Trust Scores
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Real trust scores computed from actual LLM API traffic. No synthetic
          benchmarks — just honest reliability, consistency, and cost efficiency
          metrics from production workloads.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Select
          value={sort}
          onValueChange={(v) => setSort(v as typeof sort)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overall">Overall Score</SelectItem>
            <SelectItem value="reliability">Reliability</SelectItem>
            <SelectItem value="consistency">Consistency</SelectItem>
            <SelectItem value="cost_efficiency">Cost Efficiency</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={String(periodDays)}
          onValueChange={(v) => setPeriodDays(Number(v))}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 days</SelectItem>
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !data?.scores?.length ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">
            No trust scores available yet. Scores are computed from production
            telemetry data.
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]">#</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1">
                      Overall <Info className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Weighted composite of all dimensions</p>
                    </TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1">
                      Reliability <Info className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Uptime and error rate</p>
                    </TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1">
                      Consistency <Info className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Latency variance and output stability</p>
                    </TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1">
                      Cost Efficiency <Info className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Quality per dollar spent</p>
                    </TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead className="w-[60px]">Trend</TableHead>
                <TableHead className="text-right">Samples</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.scores.map((score, i) => (
                <TableRow key={score.id}>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {i + 1}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/models/${score.modelSlug}`}
                      className="hover:underline"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{score.modelName}</span>
                        <span className="text-xs text-muted-foreground">
                          {score.providerId}
                          {score.modelParameterCount &&
                            ` · ${score.modelParameterCount}`}
                        </span>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <ScoreBar score={score.overallScore} />
                  </TableCell>
                  <TableCell>
                    <ScoreBar score={score.reliabilityScore} />
                  </TableCell>
                  <TableCell>
                    <ScoreBar score={score.consistencyScore} />
                  </TableCell>
                  <TableCell>
                    <ScoreBar score={score.costEfficiencyScore} />
                  </TableCell>
                  <TableCell>
                    <TrendIcon trend={score.trend} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground text-sm">
                    {score.sampleSize.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
