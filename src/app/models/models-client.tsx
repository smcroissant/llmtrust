"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModelGrid } from "@/components/models/model-grid";
import { trpc } from "@/lib/trpc";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";

const categories = ["All", "text-generation", "code", "vision", "embedding"];
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "downloads", label: "Most Downloads" },
  { value: "name", label: "Name A-Z" },
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Models</h1>
        <p className="text-muted-foreground">
          Discover open-source LLMs for your projects
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 mb-8">
        <div className="flex gap-4">
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
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as typeof sortBy);
              setPage(1);
            }}
            className="px-3 py-2 border rounded-md text-sm bg-background"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category badges */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
            >
              {cat === "All" ? "All" : cat.replace("-", " ")}
            </Badge>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-20">
          <p className="text-destructive mb-2">Failed to load models</p>
          <p className="text-muted-foreground text-sm">{error.message}</p>
        </div>
      )}

      {/* Results */}
      {!isLoading && !error && (
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
