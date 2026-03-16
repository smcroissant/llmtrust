"use client";

import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Clock, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreBadge, DataCoverageBadge } from "@/components/trust-scores/score-badge";
import { RadarChart } from "@/components/trust-scores/radar-chart";
import { Sparkline } from "@/components/trust-scores/sparkline";
import { getScoreBand, SCORE_WEIGHTS } from "@/lib/trust-score-utils";
import { cn } from "@/lib/utils";

interface Snapshot {
  overallScore: number;
  reliabilityScore: number;
  consistencyScore: number;
  costEfficiencyScore: number;
  sampleSize: number;
  snapshotDate: string;
}

interface Props {
  model: {
    name: string;
    slug: string;
    description: string;
    parameterCount: string | null;
    architecture: string | null;
  };
  providerId: string;
  currentScore: {
    overallScore: number;
    reliabilityScore: number;
    consistencyScore: number;
    costEfficiencyScore: number;
    sampleSize: number;
    periodDays: number;
    previousOverallScore: number | null;
    trend: string | null;
    computedAt: string;
  };
  snapshots: Snapshot[];
}

function TrendIcon({ trend }: { trend: string | null }) {
  if (trend === "up") return <TrendingUp className="h-5 w-5 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="h-5 w-5 text-red-500" />;
  return <Minus className="h-5 w-5 text-muted-foreground" />;
}

function ScoreGauge({ score, label, weight }: { score: number; label: string; weight?: number }) {
  const band = getScoreBand(score);
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r="36" fill="none" stroke="currentColor" strokeOpacity={0.1} strokeWidth="6" />
        <circle
          cx="48" cy="48" r="36" fill="none"
          stroke={band.color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 48 48)"
        />
        <text x="48" y="48" textAnchor="middle" dominantBaseline="central" className="text-2xl font-bold fill-current">
          {score}
        </text>
      </svg>
      <span className="text-sm font-medium">{label}</span>
      {weight !== undefined && (
        <span className="text-xs text-muted-foreground">{Math.round(weight * 100)}% weight</span>
      )}
      <ScoreBadge score={score} size="sm" />
    </div>
  );
}

export function TrustScoreDetailClient({ model, providerId, currentScore, snapshots }: Props) {
  // Build sparkline data from snapshots (overall score trend)
  const sparklineData = snapshots.length > 1
    ? snapshots.map((s) => s.overallScore)
    : [currentScore.overallScore];

  // Radar chart dimensions
  const radarDimensions = [
    { label: "Reliability", value: currentScore.reliabilityScore },
    { label: "Consistency", value: currentScore.consistencyScore },
    { label: "Cost Efficiency", value: currentScore.costEfficiencyScore },
  ];

  // Signal breakdown cards
  const signals = [
    {
      name: "Reliability",
      score: currentScore.reliabilityScore,
      weight: SCORE_WEIGHTS.reliability,
      description: "Based on error rates, rate-limit frequency, and HTTP status distribution.",
    },
    {
      name: "Consistency",
      score: currentScore.consistencyScore,
      weight: SCORE_WEIGHTS.consistency,
      description: "Based on latency standard deviation relative to mean response time.",
    },
    {
      name: "Cost Efficiency",
      score: currentScore.costEfficiencyScore,
      weight: SCORE_WEIGHTS.costEfficiency,
      description: "Output tokens per dollar spent — higher is better value.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/trust-scores" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Leaderboard
        </Link>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {model.name}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-muted-foreground">
              <span className="font-medium">{providerId}</span>
              {model.parameterCount && <span>· {model.parameterCount}</span>}
              {model.architecture && <span>· {model.architecture}</span>}
            </div>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              {model.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ScoreBadge score={currentScore.overallScore} size="lg" />
            <TrendIcon trend={currentScore.trend} />
          </div>
        </div>
      </div>

      {/* Top section: Overall score gauge + radar chart + sparkline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Overall Score */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall Trust Score</CardTitle>
            <CardDescription>
              Weighted composite score
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-4">
            <ScoreGauge score={currentScore.overallScore} label="Overall" />
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Score Breakdown</CardTitle>
            <CardDescription>
              Dimensional view of trust signals
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-4">
            <RadarChart dimensions={radarDimensions} size={240} />
          </CardContent>
        </Card>

        {/* 30-Day Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">30-Day Trend</CardTitle>
            <CardDescription>
              Historical score trajectory
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-4 gap-4">
            {snapshots.length > 1 ? (
              <>
                <Sparkline data={sparklineData} width={200} height={60} strokeWidth={2} />
                <div className="text-sm text-muted-foreground">
                  {snapshots.length} data points
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Not enough history yet.</p>
                <p className="text-xs mt-1">Trends appear after multiple score computations.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Signal Breakdown */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Signal Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {signals.map((signal) => {
            const band = getScoreBand(signal.score);
            return (
              <Card key={signal.name}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{signal.name}</CardTitle>
                    <span
                      className="text-2xl font-bold tabular-nums"
                      style={{ color: band.color }}
                    >
                      {signal.score}
                    </span>
                  </div>
                  <CardDescription>{signal.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${signal.score}%`,
                        backgroundColor: band.color,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Weight: {Math.round(signal.weight * 100)}%</span>
                    <span>{band.label}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Score History Table */}
      {snapshots.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Score History</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium text-right">Overall</th>
                      <th className="pb-2 font-medium text-right">Reliability</th>
                      <th className="pb-2 font-medium text-right">Consistency</th>
                      <th className="pb-2 font-medium text-right">Cost Eff.</th>
                      <th className="pb-2 font-medium text-right">Samples</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...snapshots].reverse().slice(0, 14).map((snapshot, i) => {
                      const date = new Date(snapshot.snapshotDate);
                      return (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-2 text-muted-foreground">
                            {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </td>
                          <td className="py-2 text-right font-medium tabular-nums">
                            {snapshot.overallScore}
                          </td>
                          <td className="py-2 text-right tabular-nums">{snapshot.reliabilityScore}</td>
                          <td className="py-2 text-right tabular-nums">{snapshot.consistencyScore}</td>
                          <td className="py-2 text-right tabular-nums">{snapshot.costEfficiencyScore}</td>
                          <td className="py-2 text-right tabular-nums text-muted-foreground">
                            {snapshot.sampleSize.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Metadata */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Computed {new Date(currentScore.computedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>{currentScore.periodDays}-day window</span>
            </div>
            <DataCoverageBadge sampleSize={currentScore.sampleSize} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
