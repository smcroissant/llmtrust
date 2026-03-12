import { cn } from "@/lib/utils";

/**
 * SkeletonGlow — LLM Trust's loading skeleton.
 *
 * Features a subtle violet shimmer sweep effect
 * instead of the plain gray skeleton.
 */
function SkeletonGlow({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-muted",
        className
      )}
      {...props}
    >
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, oklch(0.68 0.24 290 / 0.06) 50%, transparent 100%)",
          animation: "shimmer 2s linear infinite",
        }}
      />
    </div>
  );
}

/**
 * ModelCardSkeleton — Pre-built skeleton for model cards.
 */
function ModelCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5">
      {/* Title + badge */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <SkeletonGlow className="h-5 w-32" />
        <SkeletonGlow className="h-5 w-12" />
      </div>

      {/* Description lines */}
      <SkeletonGlow className="h-4 w-full mb-1.5" />
      <SkeletonGlow className="h-4 w-3/4 mb-4" />

      {/* Tags */}
      <div className="flex gap-1.5 mb-4">
        <SkeletonGlow className="h-5 w-16 rounded-md" />
        <SkeletonGlow className="h-5 w-20 rounded-md" />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between">
        <SkeletonGlow className="h-4 w-16" />
        <SkeletonGlow className="h-4 w-12" />
      </div>
    </div>
  );
}

/**
 * ModelGridSkeleton — Grid of model card skeletons.
 */
function ModelGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ModelCardSkeleton key={i} />
      ))}
    </div>
  );
}

export { SkeletonGlow, ModelCardSkeleton, ModelGridSkeleton };
