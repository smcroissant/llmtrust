"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  GlowCard,
  GlowCardHeader,
  GlowCardContent,
} from "@/components/ui/glow-card";
import { Download, Star, Cpu, Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSession } from "@/lib/auth-client";

interface ModelCardProps {
  model: {
    id: string;
    slug: string;
    name: string;
    description: string;
    parameterCount: string | null;
    architecture: string | null;
    category: string | null;
    downloadCount: number;
    license: string | null;
    tags: string[];
  };
  /** Stagger animation delay index (0-3) */
  delay?: number;
}

/**
 * ModelCard — LLM Trust's enhanced model card.
 *
 * Features:
 * - Glow border on hover
 * - Gradient accent on parameter count badge
 * - Staggered fade-up animation
 * - Architecture + category pills
 * - Download count with icon
 * - Favorite heart toggle
 */
export function ModelCardEnhanced({ model, delay = 0 }: ModelCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const utils = trpc.useUtils();

  const delayClass =
    delay === 0
      ? "animate-fade-up"
      : delay === 1
        ? "animate-fade-up-delay-1"
        : delay === 2
          ? "animate-fade-up-delay-2"
          : "animate-fade-up-delay-3";

  // Favorites
  const { data: favoriteData } = trpc.user.isFavorite.useQuery(
    { modelId: model.id },
    { enabled: !!session?.user }
  );

  const toggleFavorite = trpc.user.toggleFavorite.useMutation({
    onSuccess: () => {
      utils.user.isFavorite.invalidate({ modelId: model.id });
    },
  });

  const isFavorite = favoriteData?.favorited ?? false;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      router.push("/auth/sign-in");
      return;
    }
    toggleFavorite.mutate({ modelId: model.id });
  };

  return (
    <Link href={`/models/${model.slug}`} className="block h-full">
      <GlowCard className={`h-full cursor-pointer relative ${delayClass}`}>
        {/* Heart button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-background/80 transition-all duration-200 z-10 hover:scale-110"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`h-4 w-4 transition-all duration-200 ${
              isFavorite
                ? "fill-red-500 text-red-500 animate-heart-pulse"
                : "text-muted-foreground hover:text-red-400"
            }`}
          />
        </button>

        <GlowCardHeader className="pb-3">
          {/* Top row: Name + Param Count */}
          <div className="flex items-start justify-between gap-2 pr-8">
            <h3 className="text-base font-semibold leading-tight line-clamp-1 tracking-tight">
              {model.name}
            </h3>
            {model.parameterCount && (
              <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {model.parameterCount}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
            {model.description}
          </p>
        </GlowCardHeader>

        <GlowCardContent>
          {/* Tags row */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {model.architecture && (
              <Badge variant="outline" className="text-xs font-medium">
                <Cpu className="mr-1 h-3 w-3" />
                {model.architecture}
              </Badge>
            )}
            {model.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1 tabular-nums">
              <Download className="h-3 w-3" />
              {formatDownloadCount(model.downloadCount)}
            </span>
            {model.license && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {model.license}
              </span>
            )}
          </div>
        </GlowCardContent>
      </GlowCard>
    </Link>
  );
}

function formatDownloadCount(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(0)}K`;
  }
  return count.toString();
}
