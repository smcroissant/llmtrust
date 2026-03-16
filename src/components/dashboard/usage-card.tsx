"use client";

import { trpc } from "@/lib/trpc";
import {
  GlowCard,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardContent,
} from "@/components/ui/glow-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, Zap } from "lucide-react";

/**
 * UsageCard — Displays current API usage for the authenticated user.
 *
 * Shows:
 * - Calls used today vs. daily limit
 * - Progress bar with color coding (green → yellow → red)
 * - Tier badge (Free / Pro / Team)
 * - Reset time (midnight UTC)
 */
export function UsageCard() {
  const { data, isLoading, error } = trpc.billing.getUsage.useQuery();

  if (isLoading) {
    return (
      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            API Usage
          </GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </GlowCardContent>
      </GlowCard>
    );
  }

  if (error || !data) {
    return (
      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            API Usage
          </GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent>
          <p className="text-sm text-muted-foreground">
            Unable to load usage data
          </p>
        </GlowCardContent>
      </GlowCard>
    );
  }

  const { count, limit, remaining, resetAt, tier } = data;
  const isUnlimited = limit === 0 || limit > 100000;
  const percentage = isUnlimited ? 0 : Math.min(100, (count / limit) * 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = remaining <= 0;

  // Color coding
  const barColor = isAtLimit
    ? "bg-red-500"
    : isNearLimit
      ? "bg-yellow-500"
      : "bg-emerald-500";

  // Format reset time
  const resetDate = new Date(resetAt * 1000);
  const resetTime = resetDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <GlowCard>
      <GlowCardHeader>
        <GlowCardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            API Usage
          </span>
          <Badge
            variant={tier === "free" ? "secondary" : "default"}
            className="capitalize"
          >
            {tier === "free" ? (
              "Free"
            ) : (
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {tier}
              </span>
            )}
          </Badge>
        </GlowCardTitle>
      </GlowCardHeader>
      <GlowCardContent className="space-y-4">
        {/* Count display */}
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-bold">{count.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground">
            {isUnlimited ? "unlimited" : `of ${limit.toLocaleString()} today`}
          </span>
        </div>

        {/* Progress bar */}
        {!isUnlimited && (
          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{remaining.toLocaleString()} remaining</span>
              <span>Resets at {resetTime} UTC</span>
            </div>
          </div>
        )}

        {/* Unlimited indicator */}
        {isUnlimited && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Unlimited API access — no daily limits
          </div>
        )}

        {/* Warning when near limit */}
        {isNearLimit && !isAtLimit && (
          <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
            <AlertTriangle className="h-4 w-4" />
            Approaching daily limit — {remaining} calls left
          </div>
        )}

        {/* Blocked indicator */}
        {isAtLimit && (
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertTriangle className="h-4 w-4" />
            Daily limit reached — upgrade for unlimited access
          </div>
        )}
      </GlowCardContent>
    </GlowCard>
  );
}
