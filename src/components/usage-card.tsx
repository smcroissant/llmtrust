"use client";

import { trpc } from "@/lib/trpc";
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
} from "@/components/ui/glow-card";
import { Loader2, Zap, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * UsageCard — Displays the user's API usage stats for the current billing period.
 *
 * Shows:
 * - Calls used today vs. daily limit
 * - Visual progress bar
 * - Reset time (midnight UTC)
 * - Tier info (free=100/day, pro/team=unlimited)
 */
export function UsageCard() {
  const { data: usage, isLoading } = trpc.billing.getUsage.useQuery();

  if (isLoading) {
    return (
      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle className="flex items-center gap-2">
            <Zap className="size-5" />
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

  if (!usage) return null;

  const isUnlimited = usage.limit === Infinity;
  const percentUsed = isUnlimited ? 0 : Math.min(100, (usage.count / usage.limit) * 100);
  const isNearLimit = !isUnlimited && percentUsed >= 80;
  const isAtLimit = !isUnlimited && !usage.allowed;

  // Format reset time
  const resetDate = new Date(usage.resetAt * 1000);
  const now = new Date();
  const diffMs = resetDate.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const resetLabel =
    diffHours > 0 ? `${diffHours}h ${diffMinutes}m` : `${diffMinutes}m`;

  return (
    <GlowCard>
      <GlowCardHeader>
        <GlowCardTitle className="flex items-center gap-2">
          <Zap className="size-5" />
          API Usage
        </GlowCardTitle>
      </GlowCardHeader>
      <GlowCardContent className="space-y-4">
        {/* Usage Count */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold tabular-nums">
              {usage.count.toLocaleString()}
              {isUnlimited ? (
                <span className="text-base font-normal text-muted-foreground ml-2">
                  calls today
                </span>
              ) : (
                <span className="text-base font-normal text-muted-foreground">
                  {" "}
                  / {usage.limit.toLocaleString()}
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isUnlimited
                ? "Unlimited API calls on your plan"
                : `API calls used today`}
            </p>
          </div>
          {!isUnlimited && (
            <div className="text-right">
              <p
                className={cn(
                  "text-sm font-semibold",
                  isAtLimit
                    ? "text-destructive"
                    : isNearLimit
                      ? "text-amber-500"
                      : "text-primary"
                )}
              >
                {usage.remaining.toLocaleString()} left
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {!isUnlimited && (
          <div className="space-y-2">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isAtLimit
                    ? "bg-destructive"
                    : isNearLimit
                      ? "bg-amber-500"
                      : "bg-primary"
                )}
                style={{ width: `${percentUsed}%` }}
              />
            </div>
            {isAtLimit && (
              <p className="text-xs text-destructive font-medium">
                Daily limit reached. Upgrade to Pro for unlimited access.
              </p>
            )}
            {isNearLimit && !isAtLimit && (
              <p className="text-xs text-amber-500 font-medium">
                Approaching daily limit ({Math.round(percentUsed)}% used)
              </p>
            )}
          </div>
        )}

        {/* Reset Timer */}
        <div className="flex items-center gap-4 pt-2 border-t border-border/60">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            Resets in {resetLabel}
          </div>
          {!isUnlimited && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="size-3.5" />
              {usage.count} total today
            </div>
          )}
        </div>
      </GlowCardContent>
    </GlowCard>
  );
}
