import { SkeletonGlow } from "@/components/ui/skeleton-glow";

export default function ModelDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-6">
        <SkeletonGlow className="h-5 w-36" />
      </div>

      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <SkeletonGlow className="h-9 w-56" />
            <SkeletonGlow className="h-6 w-16 rounded-md" />
          </div>
          <SkeletonGlow className="h-5 w-full max-w-lg mb-3" />
          <div className="flex flex-wrap gap-2">
            <SkeletonGlow className="h-5 w-16 rounded-full" />
            <SkeletonGlow className="h-5 w-20 rounded-full" />
            <SkeletonGlow className="h-5 w-14 rounded-full" />
          </div>
        </div>
        <div className="flex gap-3">
          <SkeletonGlow className="h-9 w-9 rounded-md" />
          <SkeletonGlow className="h-9 w-28 rounded-md" />
          <SkeletonGlow className="h-9 w-24 rounded-md" />
        </div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-4">
            <SkeletonGlow className="h-3 w-20 mb-3" />
            <SkeletonGlow className="h-6 w-24" />
          </div>
        ))}
      </div>

      {/* Tabs skeleton */}
      <div className="space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonGlow key={i} className="h-9 w-24 rounded-md" />
          ))}
        </div>

        {/* Content card skeleton */}
        <div className="rounded-xl border bg-card p-6">
          <SkeletonGlow className="h-6 w-48 mb-4" />
          <div className="space-y-2">
            <SkeletonGlow className="h-4 w-full" />
            <SkeletonGlow className="h-4 w-full" />
            <SkeletonGlow className="h-4 w-3/4" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <SkeletonGlow className="h-4 w-16 mb-2" />
                <SkeletonGlow className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
