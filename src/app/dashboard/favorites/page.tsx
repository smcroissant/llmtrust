"use client";

import { trpc } from "@/lib/trpc";
import { ModelCardEnhanced } from "@/components/models/model-card-enhanced";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Sparkles, Loader2 } from "lucide-react";

export default function FavoritesPage() {
  const { data: favorites, isLoading } = trpc.user.favorites.useQuery();

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const modelCards =
    favorites?.map((fav) => ({
      id: fav.model.id,
      slug: fav.model.slug,
      name: fav.model.name,
      description: fav.model.description,
      parameterCount: fav.model.parameterCount,
      architecture: fav.model.architecture,
      category: null,
      downloadCount: 0,
      license: null,
      tags: [] as string[],
    })) ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Heart className="size-5 text-primary" />
            My Favorites
          </h1>
          <p className="text-muted-foreground mt-1">
            {favorites?.length ?? 0} model{(favorites?.length ?? 0) !== 1 ? "s" : ""} saved
          </p>
        </div>
      </div>

      {/* Grid */}
      {modelCards.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {modelCards.map((model, index) => (
            <ModelCardEnhanced
              key={model.slug}
              model={model}
              delay={index % 4}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          variant="no-data"
          title="No favorites yet"
          description="Browse our collection of open-source LLMs and save the ones you love."
          action={
            <Button onClick={() => { window.location.href = "/models"; }}>
              <Sparkles className="mr-2 size-4" />
              Browse Models
            </Button>
          }
        />
      )}
    </div>
  );
}
