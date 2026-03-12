import { SkeletonGlow, ModelGridSkeleton } from "@/components/ui/skeleton-glow";

export default function ModelsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <SkeletonGlow className="h-9 w-48 mb-2" />
        <SkeletonGlow className="h-5 w-80" />
      </div>

      {/* Search & filters skeleton */}
      <div className="space-y-4 mb-8">
        <div className="flex gap-4">
          <SkeletonGlow className="h-10 flex-1 rounded-md" />
          <SkeletonGlow className="h-10 w-36 rounded-md" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonGlow key={i} className="h-6 w-20 rounded-full" />
          ))}
        </div>
      </div>

      {/* Model count skeleton */}
      <SkeletonGlow className="h-4 w-32 mb-4" />

      {/* Grid skeleton */}
      <ModelGridSkeleton count={12} />
    </div>
  );
}
