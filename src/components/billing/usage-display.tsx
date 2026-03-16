"use client";

import { trpc } from "@/lib/trpc";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from "@/components/ui/glow-card";
import { Loader2, Activity, AlertTriangle } from "lucide-react";

export function UsageDisplay() {
  const { data: usage, isLoading, error } = trpc.billing.getUsage.useQuery({ days: 30 });

  if (isLoading) {
    return (
      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle className="flex items-center gap-2">
            <Activity className="size-5" />
            API Usage
          </GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        </GlowCardContent>
      </GlowCard>
    );
  }

  if (error || !usage) {
    return null;
  }

  const usagePercent = Math.min((usage.today / usage.dailyLimit) * 100, 100);
  const isNearLimit = usagePercent >= 80;
  const isOverLimit = usage.today >= usage.dailyLimit;

  return (
    <GlowCard>
      <GlowCardHeader>
        <GlowCardTitle className="flex items-center gap-2">
          <Activity className="size-5" />
          API Usage
        </GlowCardTitle>
      </GlowCardHeader>
      <GlowCardContent className="space-y-6">
        {/* Today's usage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-2xl font-bold">
                {usage.today.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  / {usage.dailyLimit.toLocaleString()} calls
                </span>
              </p>
            </div>
            {isOverLimit && (
              <div className="flex items-center gap-1.5 text-destructive text-sm">
                <AlertTriangle className="size-4" />
                <span>Limit reached</span>
              </div>
            )}
            {isNearLimit && !isOverLimit && (
              <div className="flex items-center gap-1.5 text-amber-500 text-sm">
                <AlertTriangle className="size-4" />
                <span>Near limit</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverLimit
                  ? "bg-destructive"
                  : isNearLimit
                    ? "bg-amber-500"
                    : "bg-primary"
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            {usagePercent.toFixed(1)}% of daily limit used
            {usage.tier === "free" && (
              <span className="ml-1">
                ·{" "}
                <a href="/pricing" className="text-primary hover:underline">
                  Upgrade for more
                </a>
              </span>
            )}
          </p>
        </div>

        {/* Usage sparkline (last 30 days) */}
        {usage.dailyUsage.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Last 30 days</p>
            <div className="flex items-end gap-0.5 h-16">
              {usage.dailyUsage.map((day) => {
                const height = usage.dailyLimit > 0
                  ? Math.min((day.count / usage.dailyLimit) * 100, 100)
                  : 0;
                return (
                  <div
                    key={day.date}
                    className="flex-1 rounded-t bg-primary/40 hover:bg-primary/60 transition-colors cursor-default min-w-[2px]"
                    style={{ height: `${Math.max(height, 2)}%` }}
                    title={`${day.date}: ${day.count} calls`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{usage.dailyUsage[0]?.date}</span>
              <span>{usage.dailyUsage[usage.dailyUsage.length - 1]?.date}</span>
            </div>
          </div>
        )}

        {/* Tier info */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 text-sm">
          <span className="text-muted-foreground">
            Plan: <span className="text-foreground font-medium capitalize">{usage.tier}</span>
          </span>
          <span className="text-muted-foreground capitalize">
            Status: {usage.status}
          </span>
        </div>
      </GlowCardContent>
    </GlowCard>
  );
}
