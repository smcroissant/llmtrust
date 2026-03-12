import { SkeletonGlow } from "@/components/ui/skeleton-glow";

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header skeleton */}
      <div>
        <SkeletonGlow className="h-8 w-64 mb-2" />
        <SkeletonGlow className="h-5 w-48" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <SkeletonGlow className="h-4 w-16" />
              <SkeletonGlow className="h-8 w-8 rounded-lg" />
            </div>
            <SkeletonGlow className="h-8 w-12 mb-1" />
            <SkeletonGlow className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Recent favorites skeleton */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <SkeletonGlow className="h-6 w-40" />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border bg-card p-5">
              <div className="flex items-start justify-between mb-2">
                <SkeletonGlow className="h-5 w-28" />
                <SkeletonGlow className="h-5 w-12 rounded-md" />
              </div>
              <SkeletonGlow className="h-4 w-full mb-1" />
              <SkeletonGlow className="h-4 w-2/3 mb-3" />
              <SkeletonGlow className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent reviews skeleton */}
      <div>
        <SkeletonGlow className="h-6 w-36 mb-4" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <SkeletonGlow className="h-5 w-32 mb-1" />
                  <SkeletonGlow className="h-4 w-full" />
                </div>
                <SkeletonGlow className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
