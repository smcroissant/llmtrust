"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModelGrid } from "@/components/models/model-grid";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { trpc } from "@/lib/trpc";
import { Search, SlidersHorizontal, Loader2, Upload, HelpCircle, Info } from "lucide-react";

const categories = ["All", "text-generation", "code", "vision", "embedding"];

const categoryDescriptions: Record<string, string> = {
  All: "Show all models regardless of their primary use case.",
  "text-generation":
    "General-purpose models for writing, summarization, and conversational AI.",
  code: "Models optimized for code generation, completion, and debugging.",
  vision: "Multimodal models that can process and understand images.",
  embedding: "Models that convert text into vector representations for search and RAG.",
};

const sortOptions = [
  { value: "popular", label: "Most Popular", description: "Ranked by community engagement and ratings." },
  { value: "newest", label: "Newest", description: "Most recently added or updated models first." },
  { value: "downloads", label: "Most Downloads", description: "Models with the highest download counts." },
  { value: "name", label: "Name A-Z", description: "Alphabetical order by model name." },
];

export function ModelsPageClient() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "downloads" | "name">("popular");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = trpc.models.list.useQuery({
    category: selectedCategory !== "All" ? selectedCategory : undefined,
    search: search || undefined,
    sort: sortBy,
    page,
    limit: 20,
  });

  // Get architectures for filter
  const { data: categoriesData } = trpc.models.categories.useQuery();

  const architectures = categoriesData
    ?.map((c) => c.name)
    .filter(Boolean) ?? [];

  // Transform DB models to match the model card interface
  const models = data?.models.map((m) => ({
    id: m.id,
    slug: m.slug,
    name: m.name,
    description: m.description,
    parameterCount: m.parameterCount ?? "",
    architecture: m.architecture ?? "",
    category: m.category ?? "",
    downloadCount: m.downloadCount,
    license: m.license ?? "",
    tags: (m.tags as string[]) ?? [],
  })) ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Browse Models</h1>
          <p className="text-muted-foreground">
            Discover open-source LLMs for your projects
          </p>
        </div>

        {/* Upload button with tooltip */}
        <Tooltip>
          <TooltipTrigger>
            <Button className="gap-2" render={<Link href="/models/upload" />}>
              <Upload className="size-4" />
              Upload Model
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p>
              Any registered user can submit an open-source model. All uploads are
              reviewed by our team before publication. You&apos;ll need a HuggingFace URL
              and model details.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search models..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Sort dropdown with tooltip */}
          <Tooltip>
            <TooltipTrigger>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as typeof sortBy);
                    setPage(1);
                  }}
                  className="px-3 py-2 border rounded-md text-sm bg-background pr-8"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <Info className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p>
                {sortOptions.find((o) => o.value === sortBy)?.description}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Category badges with tooltips */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Tooltip key={cat}>
              <TooltipTrigger>
                <Badge
                  variant={selectedCategory === cat ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setPage(1);
                  }}
                >
                  {cat === "All" ? "All" : cat.replace("-", " ")}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p>{categoryDescriptions[cat]}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="text-center py-20">
          <p className="text-destructive mb-2">Failed to load models</p>
          <p className="text-muted-foreground text-sm">{error.message}</p>
        </div>
      )}

      {/* Empty state - no results from search/filter */}
      {!isLoading && !error && data?.total === 0 && (
        <EmptyState
          variant="no-results"
          title="No models found"
          description="Try different filters or search terms."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          }
        />
      )}

      {/* Results */}
      {!isLoading && !error && (data?.total ?? 0) > 0 && (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {data?.total ?? 0} model{(data?.total ?? 0) !== 1 ? "s" : ""} found
          </div>

          <ModelGrid models={models} />

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {data.page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
