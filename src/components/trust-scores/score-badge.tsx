import { getScoreBand, type ScoreBand } from "@/lib/trust-score-utils";
import { cn } from "@/lib/utils";

/**
 * Score Badge — shows the score band label with color coding
 */
export function ScoreBadge({
  score,
  size = "sm",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const band = getScoreBand(score);

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        band.bgColor,
        band.textColor,
        sizeClasses[size],
      )}
    >
      {band.emoji} {band.label}
    </span>
  );
}

/**
 * Data Coverage Badge — warns when sample count is too low
 */
export function DataCoverageBadge({ sampleSize }: { sampleSize: number }) {
  const threshold = 100;

  if (sampleSize >= threshold) {
    return (
      <span className="text-xs text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
        ✓ {sampleSize.toLocaleString()} samples
      </span>
    );
  }

  return (
    <span className="text-xs text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
      ⚠ {sampleSize.toLocaleString()} samples (need {threshold})
    </span>
  );
}
