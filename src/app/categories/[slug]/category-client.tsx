"use client";

import { useState, useMemo } from "react";
import { ModelGrid } from "@/components/models/model-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────

interface Model {
  id: string;
  slug: string;
  name: string;
  description: string;
  parameterCount: string;
  architecture: string;
  category: string;
  downloadCount: number;
  license: string;
  tags: string[];
}

interface CategoryPageClientProps {
  slug: string;
  categoryName: string;
  initialModels: Model[];
}

type SortKey = "popular" | "newest" | "name" | "parameters";

// ─── Helpers ──────────────────────────────────────────────────

function parseParamSize(paramCount: string): number | null {
  if (!paramCount) return null;
  const match = paramCount.match(/([\d.]+)/);
  if (!match) return null;
  const num = parseFloat(match[1]);
  if (paramCount.toLowerCase().includes("t")) return num * 1000;
  if (paramCount.toLowerCase().includes("b")) return num;
  if (paramCount.toLowerCase().includes("m")) return num / 1000;
  return num;
}

function formatParamSize(paramCount: string): string {
  return paramCount || "—";
}

// ─── Sort Options ─────────────────────────────────────────────

const SORT_OPTIONS: { value: SortKey; label: string; icon: typeof ArrowUpDown }[] = [
  { value: "popular", label: "Most Popular", icon: ArrowDown },
  { value: "newest", label: "Newest", icon: ArrowDown },
  { value: "name", label: "Name A–Z", icon: ArrowUp },
  { value: "parameters", label: "Largest First", icon: ArrowDown },
];

const SIZE_OPTIONS = [
  { value: "all", label: "All Sizes" },
  { value: "lt1b", label: "< 1B" },
  { value: "1b-10b", label: "1B – 10B" },
  { value: "10b-70b", label: "10B – 70B" },
  { value: "70bplus", label: "70B+" },
];

// ─── Component ────────────────────────────────────────────────

export function CategoryPageClient({
  slug,
  categoryName,
  initialModels,
}: CategoryPageClientProps) {
  const [sort, setSort] = useState<SortKey>("popular");
  const [size, setSize] = useState("all");
  const [architecture, setArchitecture] = useState("all");

  // Derive unique architectures from initial models
  const architectures = useMemo(() => {
    const set = new Set<string>();
    initialModels.forEach((m) => {
      if (m.architecture) set.add(m.architecture);
    });
    return Array.from(set).sort();
  }, [initialModels]);

  // Filter + sort
  const filteredModels = useMemo(() => {
    let result = [...initialModels];

    // Size filter
    if (size !== "all") {
      result = result.filter((m) => {
        const sizeInB = parseParamSize(m.parameterCount);
        if (sizeInB === null) return size === "lt1b";
        switch (size) {
          case "lt1b":
            return sizeInB < 1;
          case "1b-10b":
            return sizeInB >= 1 && sizeInB < 10;
          case "10b-70b":
            return sizeInB >= 10 && sizeInB < 70;
          case "70bplus":
            return sizeInB >= 70;
          default:
            return true;
        }
      });
    }

    // Architecture filter
    if (architecture !== "all") {
      result = result.filter((m) => m.architecture === architecture);
    }

    // Sort
    switch (sort) {
      case "popular":
        result.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case "newest":
        // Already sorted by server; keep order
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "parameters":
        result.sort((a, b) => {
          const aSize = parseParamSize(a.parameterCount) ?? 0;
          const bSize = parseParamSize(b.parameterCount) ?? 0;
          return bSize - aSize;
        });
        break;
    }

    return result;
  }, [initialModels, sort, size, architecture]);

  const activeFilters = [size !== "all", architecture !== "all"].filter(Boolean).length;

  const clearFilters = () => {
    setSize("all");
    setArchitecture("all");
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card/50 p-3">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <SlidersHorizontal className="size-4" />
          <span className="font-medium">Filters</span>
        </div>

        {/* Size Filter */}
        <Select value={size} onValueChange={(v) => setSize(v ?? "all")}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            {SIZE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Architecture Filter */}
        {architectures.length > 0 && (
          <Select value={architecture} onValueChange={(v) => setArchitecture(v ?? "all")}>
            <SelectTrigger className="h-8 w-[150px] text-xs">
              <SelectValue placeholder="Architecture" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                All Architectures
              </SelectItem>
              {architectures.map((arch) => (
                <SelectItem key={arch} value={arch} className="text-xs">
                  {arch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Sort */}
        <Select value={sort} onValueChange={(v) => setSort((v ?? "popular") as SortKey)}>
          <SelectTrigger className="h-8 w-[145px] text-xs">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear filters */}
        {activeFilters > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 size-3" />
            Clear ({activeFilters})
          </Button>
        )}

        {/* Results count */}
        <div className="ml-auto text-xs text-muted-foreground">
          {filteredModels.length} model{filteredModels.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Model Grid */}
      {filteredModels.length > 0 ? (
        <ModelGrid models={filteredModels} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-muted-foreground">
            No models match the selected filters.
          </p>
          <Button
            variant="link"
            onClick={clearFilters}
            className="mt-2 text-sm text-primary"
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
