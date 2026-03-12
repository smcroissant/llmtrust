"use client";

import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import {
  GlowCard,
} from "@/components/ui/glow-card";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function LatestModels() {
  const { data, isLoading } = trpc.models.list.useQuery({
    sort: "newest",
    limit: 3,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const models = data?.models ?? [];

  if (models.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-8 text-center">
        No models found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {models.map((model) => (
        <Link key={model.slug} href={`/models/${model.slug}`}>
          <GlowCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{model.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {model.architecture} · {model.parameterCount}
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {model.category?.replace("-", " ") ?? "model"}
              </Badge>
            </div>
          </GlowCard>
        </Link>
      ))}
    </div>
  );
}
