"use client";

import { trpc } from "@/lib/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Brain, Download, Star, ArrowUpRight, Clock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  trend?: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          {trend && (
            <span className="flex items-center text-xs font-medium text-chart-5">
              <ArrowUpRight className="size-3" />
              {trend}
            </span>
          )}
          <Icon className="size-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="stat-number text-3xl">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </Card>
  );
}

export default function AdminOverviewPage() {
  const { data: stats, isLoading: statsLoading } = trpc.admin.stats.useQuery();
  const { data: activity, isLoading: activityLoading } =
    trpc.admin.recentActivity.useQuery({ limit: 5 });

  if (statsLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your LLM Trust platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          description={`${stats?.newUsersThisWeek ?? 0} new this week`}
          trend={
            stats?.newUsersThisWeek ? `+${stats.newUsersThisWeek}` : undefined
          }
        />
        <StatCard
          title="Total Models"
          value={stats?.totalModels ?? 0}
          icon={Brain}
          description={`${stats?.pendingModels ?? 0} pending approval`}
        />
        <StatCard
          title="Total Downloads"
          value={stats?.totalDownloads?.toLocaleString() ?? 0}
          icon={Download}
          description="Across all models"
        />
        <StatCard
          title="Total Reviews"
          value={stats?.totalReviews ?? 0}
          icon={Star}
          description="Community feedback"
        />
      </div>

      {/* Activity Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Models */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="size-4 text-primary" />
              Recent Models
            </CardTitle>
            <CardDescription>Latest model submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-3 w-24 bg-muted rounded mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activity?.models?.length ? (
              <div className="space-y-3">
                {activity.models.map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">
                        <Link
                          href={`/models/${m.modelSlug}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {m.modelName}
                        </Link>
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        by {m.userName ?? "Unknown"} &middot;{" "}
                        {m.status}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {m.createdAt
                        ? formatDistanceToNow(new Date(m.createdAt), {
                            addSuffix: true,
                          })
                        : ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent models</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="size-4 text-accent" />
              Recent Reviews
            </CardTitle>
            <CardDescription>Latest community feedback</CardDescription>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="h-4 w-4 bg-muted rounded" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-3 w-24 bg-muted rounded mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activity?.reviews?.length ? (
              <div className="space-y-3">
                {activity.reviews.map((r) => (
                  <div key={r.id} className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: r.rating ?? 0 }).map((_, i) => (
                        <Star
                          key={i}
                          className="size-3 fill-accent text-accent"
                        />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">
                        <span className="font-medium">{r.userName}</span>
                        <span className="text-muted-foreground"> on </span>
                        <Link
                          href={`/models/${r.modelSlug}`}
                          className="text-primary hover:underline"
                        >
                          {r.modelName}
                        </Link>
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {r.createdAt
                        ? formatDistanceToNow(new Date(r.createdAt), {
                            addSuffix: true,
                          })
                        : ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent reviews
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending Models Alert */}
      {stats && stats.pendingModels > 0 && (
        <Link href="/admin/models?status=draft">
          <Card className="hover:border-primary/30 transition-colors cursor-pointer group">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
                  <Clock className="size-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">
                    {stats.pendingModels} model
                    {stats.pendingModels > 1 ? "s" : ""} awaiting approval
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Click to review and manage pending submissions
                  </p>
                </div>
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        </Link>
      )}
    </div>
  );
}
