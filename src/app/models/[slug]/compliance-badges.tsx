"use client";

import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, ShieldCheck, ShieldAlert, ShieldX, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

const BADGE_CONFIG = {
  enterprise_ready: { icon: ShieldCheck, color: "bg-emerald-500", textColor: "text-emerald-700", bgLight: "bg-emerald-50 dark:bg-emerald-950", label: "Enterprise Ready" },
  compliant: { icon: Shield, color: "bg-blue-500", textColor: "text-blue-700", bgLight: "bg-blue-50 dark:bg-blue-950", label: "Compliant" },
  review_required: { icon: ShieldAlert, color: "bg-amber-500", textColor: "text-amber-700", bgLight: "bg-amber-50 dark:bg-amber-950", label: "Review Required" },
  non_compliant: { icon: ShieldX, color: "bg-red-500", textColor: "text-red-700", bgLight: "bg-red-50 dark:bg-red-950", label: "Non-Compliant" },
} as const;

const CATEGORY_LABELS: Record<string, string> = {
  regulatory: "Regulatory",
  supply_chain: "Supply Chain",
  data_governance: "Data Governance",
  operational: "Operational",
  ethical: "Ethical",
};

export function ComplianceBadges({ slug }: { slug: string }) {
  const { data, isLoading } = trpc.compliance.getScore.useQuery({ slug });
  const { data: checksData } = trpc.compliance.getChecks.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!data?.score) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No compliance data available yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Compliance scores are computed from model metadata.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const score = data.score;
  const badge = data.badge;
  if (!badge) return null;

  const config = BADGE_CONFIG[badge.tier as keyof typeof BADGE_CONFIG] ?? BADGE_CONFIG.non_compliant;
  const Icon = config.icon;

  const categories = [
    { key: "regulatory", score: score.regulatoryScore },
    { key: "supply_chain", score: score.supplyChainScore },
    { key: "data_governance", score: score.dataGovernanceScore },
    { key: "operational", score: score.operationalScore },
    { key: "ethical", score: score.ethicalScore },
  ];

  return (
    <div className="space-y-6">
      {/* Main Badge Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`${config.bgLight} p-3 rounded-xl`}>
                <Icon className={`h-8 w-8 ${config.textColor}`} />
              </div>
              <div>
                <p className={`text-lg font-bold ${config.textColor}`}>{config.label}</p>
                <p className="text-sm text-muted-foreground">Overall Compliance Score</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{score.overallScore}</p>
              <p className="text-xs text-muted-foreground">/ 100</p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="flex gap-6 mt-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-lg font-semibold text-emerald-600">{score.passedChecks}</p>
              <p className="text-xs text-muted-foreground">Passed</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-amber-600">{score.warnedChecks}</p>
              <p className="text-xs text-muted-foreground">Warnings</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-red-600">{score.failedChecks}</p>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{score.totalChecks}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{CATEGORY_LABELS[cat.key] ?? cat.key}</span>
                <span className="text-sm font-semibold">{cat.score}/100</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    cat.score >= 70 ? "bg-emerald-500" : cat.score >= 50 ? "bg-amber-500" : "bg-red-500"
                  }`}
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Individual Checks */}
      {checksData && checksData.checks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detailed Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {checksData.checks.map((check) => (
                <div key={check.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="mt-0.5">
                    {check.result === "pass" && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                    {check.result === "warn" && <ShieldAlert className="h-4 w-4 text-amber-500" />}
                    {check.result === "fail" && <ShieldX className="h-4 w-4 text-red-500" />}
                    {check.result === "not_applicable" && <Shield className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{check.checkName}</p>
                      <Badge variant="outline" className="text-xs">
                        {check.score}/100
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{check.details}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {check.category.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
