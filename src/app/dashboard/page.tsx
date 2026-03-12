"use client";

import { trpc } from "@/lib/trpc";
import { GlowCard, GlowCardContent, GlowCardHeader } from "@/components/ui/glow-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import {
  Heart,
  Star,
  Upload,
  Activity,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const { data: userData, isLoading } = trpc.user.me.useQuery();
  const { data: favorites } = trpc.user.favorites.useQuery();

  const recentFavorites = favorites?.slice(0, 3) ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {userData?.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s your activity overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <GlowCard>
          <GlowCardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Favorites</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Heart className="size-4 text-primary" />
              </div>
            </div>
          </GlowCardHeader>
          <GlowCardContent>
            <p className="text-3xl font-bold">{userData?.stats.favorites ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">models saved</p>
          </GlowCardContent>
        </GlowCard>

        <GlowCard>
          <GlowCardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Reviews</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                <Star className="size-4 text-accent" />
              </div>
            </div>
          </GlowCardHeader>
          <GlowCardContent>
            <p className="text-3xl font-bold">{userData?.stats.reviews ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">reviews written</p>
          </GlowCardContent>
        </GlowCard>

        <GlowCard>
          <GlowCardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Uploads</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10">
                <Upload className="size-4 text-chart-3" />
              </div>
            </div>
          </GlowCardHeader>
          <GlowCardContent>
            <p className="text-3xl font-bold">{userData?.stats.uploads ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">models uploaded</p>
          </GlowCardContent>
        </GlowCard>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            Recent Favorites
          </h2>
          {recentFavorites.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => { window.location.href = "/dashboard/favorites"; }}>
              View all
              <ArrowRight className="ml-1 size-3" />
            </Button>
          )}
        </div>

        {recentFavorites.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-3">
            {recentFavorites.map((fav) => (
              <GlowCard key={fav.id} className="cursor-pointer">
                <Link href={`/models/${fav.model.slug}`}>
                  <GlowCardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold line-clamp-1">
                        {fav.model.name}
                      </h3>
                      {fav.model.parameterCount && (
                        <Badge variant="secondary" className="text-[10px] shrink-0">
                          {fav.model.parameterCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {fav.model.description}
                    </p>
                  </GlowCardHeader>
                  <GlowCardContent>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      Added {new Date(fav.createdAt).toLocaleDateString()}
                    </div>
                  </GlowCardContent>
                </Link>
              </GlowCard>
            ))}
          </div>
        ) : (
          <GlowCard>
            <GlowCardContent className="pt-6">
              <EmptyState
                variant="no-data"
                title="No favorites yet"
                description="Start exploring models and save your favorites here."
                action={
                  <Button render={<Link href="/models" />}>
                    <Sparkles className="mr-2 size-4" />
                    Browse Models
                  </Button>
                }
              />
            </GlowCardContent>
          </GlowCard>
        )}
      </div>
    </div>
  );
}
