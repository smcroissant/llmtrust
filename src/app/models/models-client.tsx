"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModelGrid } from "@/components/models/model-grid";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { trpc } from "@/lib/trpc";
import {
  Search,
  Loader2,
  Upload,
  Info,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  SlidersHorizontal,
  Download,
  Star,
  Cpu,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

// ─── Constants ────────────────────────────────────────────────

const ITEMS_PER_PAGE = 20;

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "text-generation", label: "Text Generation" },
  { value: "chat", label: "Chat" },
  { value: "code", label: "Code" },
  { value: "vision", label: "Vision" },
  { value: "embedding", label: "Embedding" },
  { value: "instruction", label: "Instruction" },
  { value: "summarization", label: "Summarization" },
];

const SIZE_OPTIONS = [
  { value: "all", label: "All Sizes" },
  { value: "lt1b", label: "< 1B" },
  { value: "1b-10b", label: "1B – 10B" },
  { value: "10b-70b", label: "10B – 70B" },
  { value: "70bplus", label: "70B+" },
];

const ARCHITECTURE_OPTIONS = [
  { value: "all", label: "All Architectures" },
  { value: "Transformer", label: "Transformer" },
  { value: "Mamba", label: "Mamba" },
  { value: "MoE", label: "MoE" },
];

const LICENSE_OPTIONS = [
  { value: "all", label: "All Licenses" },
  { value: "Apache-2.0", label: "Apache 2.0" },
  { value: "MIT", label: "MIT" },
  { value: "Llama", label: "Llama" },
  { value: "OpenRAIL", label: "OpenRAIL" },
  { value: "CC BY", label: "CC BY" },
  { value: "GPL", label: "GPL" },
];

const SORT_OPTIONS = [
  { value: "downloads", label: "Most Downloads", description: "Highest download count first." },
  { value: "newest", label: "Newest", description: "Most recently added models first." },
  { value: "name", label: "Name A–Z", description: "Alphabetical order." },
  { value: "parameters", label: "Parameters", description: "Largest models first." },
];

type ViewMode = "grid" | "table";

interface FiltersState {
  search: string;
  category: string;
  size: string;
  architecture: string;
  license: string;
  sort: "downloads" | "newest" | "name" | "parameters";
  page: number;
  view: ViewMode;
}

// ─── Helpers ──────────────────────────────────────────────────

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-primary/20 text-foreground rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function formatDownloadCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
  return count.toString();
}

function getActiveFilterCount(f: FiltersState): number {
  let count = 0;
  if (f.category !== "all") count++;
  if (f.size !== "all") count++;
  if (f.architecture !== "all") count++;
  if (f.license !== "all") count++;
  return count;
}

// ─── URL State Sync ───────────────────────────────────────────

function filtersFromURL(searchParams: URLSearchParams): Partial<FiltersState> {
  return {
    search: searchParams.get("q") ?? "",
    category: searchParams.get("category") ?? "all",
    size: searchParams.get("size") ?? "all",
    architecture: searchParams.get("arch") ?? "all",
    license: searchParams.get("license") ?? "all",
    sort: (searchParams.get("sort") as FiltersState["sort"]) ?? "downloads",
    page: parseInt(searchParams.get("page") ?? "1", 10),
    view: (searchParams.get("view") as ViewMode) ?? "grid",
  };
}

function filtersToURL(f: FiltersState): string {
  const params = new URLSearchParams();
  if (f.search) params.set("q", f.search);
  if (f.category !== "all") params.set("category", f.category);
  if (f.size !== "all") params.set("size", f.size);
  if (f.architecture !== "all") params.set("arch", f.architecture);
  if (f.license !== "all") params.set("license", f.license);
  if (f.sort !== "downloads") params.set("sort", f.sort);
  if (f.page > 1) params.set("page", f.page.toString());
  if (f.view !== "grid") params.set("view", f.view);
  const str = params.toString();
  return str ? `?${str}` : "";
}

// ─── Sub-Components ───────────────────────────────────────────

function ActiveFilters({
  filters,
  onClear,
  onRemove,
}: {
  filters: FiltersState;
  onClear: () => void;
  onRemove: (key: string) => void;
}) {
  const chips: { key: string; label: string }[] = [];
  if (filters.category !== "all") {
    const opt = CATEGORY_OPTIONS.find((o) => o.value === filters.category);
    chips.push({ key: "category", label: opt?.label ?? filters.category });
  }
  if (filters.size !== "all") {
    const opt = SIZE_OPTIONS.find((o) => o.value === filters.size);
    chips.push({ key: "size", label: opt?.label ?? filters.size });
  }
  if (filters.architecture !== "all") {
    const opt = ARCHITECTURE_OPTIONS.find((o) => o.value === filters.architecture);
    chips.push({ key: "architecture", label: opt?.label ?? filters.architecture });
  }
  if (filters.license !== "all") {
    const opt = LICENSE_OPTIONS.find((o) => o.value === filters.license);
    chips.push({ key: "license", label: opt?.label ?? filters.license });
  }
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">Active:</span>
      {chips.map((chip) => (
        <Badge
          key={chip.key}
          variant="secondary"
          className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={() => onRemove(chip.key)}
        >
          {chip.label}
          <X className="h-3 w-3" />
        </Badge>
      ))}
      <button
        onClick={onClear}
        className="text-xs text-muted-foreground hover:text-destructive transition-colors underline underline-offset-2"
      >
        Clear all
      </button>
    </div>
  );
}

function ModelTableView({
  models,
  search,
}: {
  models: Array<{
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
  }>;
  search: string;
}) {
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="font-semibold">Model</TableHead>
            <TableHead className="font-semibold">Architecture</TableHead>
            <TableHead className="font-semibold">Size</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold">License</TableHead>
            <TableHead className="font-semibold text-right">Downloads</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((m) => (
            <TableRow
              key={m.id}
              className="cursor-pointer hover:bg-primary/5 transition-colors group"
            >
              <TableCell>
                <Link href={`/models/${m.slug}`} className="block">
                  <div className="font-medium group-hover:text-primary transition-colors">
                    {highlightMatch(m.name, search)}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                    {highlightMatch(m.description, search)}
                  </div>
                </Link>
              </TableCell>
              <TableCell>
                {m.architecture && (
                  <Badge variant="outline" className="text-xs font-medium">
                    <Cpu className="mr-1 h-3 w-3" />
                    {highlightMatch(m.architecture, search)}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {m.parameterCount && (
                  <span className="text-xs font-semibold text-primary">
                    {m.parameterCount}
                  </span>
                )}
              </TableCell>
              <TableCell>
                {m.category && (
                  <span className="text-xs text-muted-foreground capitalize">
                    {m.category.replace("-", " ")}
                  </span>
                )}
              </TableCell>
              <TableCell>
                {m.license && (
                  <span className="text-xs text-muted-foreground">{m.license}</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground tabular-nums">
                  <Download className="h-3 w-3" />
                  {formatDownloadCount(m.downloadCount)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(1)}
        className="h-8 w-8 p-0"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(p)}
            className={cn(
              "h-8 w-8 p-0",
              p === page && "bg-primary text-primary-foreground shadow-sm"
            )}
          >
            {p}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(totalPages)}
        className="h-8 w-8 p-0"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────

export function ModelsPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize from URL
  const [filters, setFilters] = useState<FiltersState>(() => ({
    search: "",
    category: "all",
    size: "all",
    architecture: "all",
    license: "all",
    sort: "downloads",
    page: 1,
    view: "grid",
    ...filtersFromURL(searchParams),
  }));

  // Debounced search for the query
  const [searchInput, setSearchInput] = useState(filters.search);
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  // Debounce 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sync debounced search to filters
  useEffect(() => {
    setFilters((prev) => {
      if (prev.search === debouncedSearch) return prev;
      return { ...prev, search: debouncedSearch, page: 1 };
    });
  }, [debouncedSearch]);

  // Sync filters to URL
  useEffect(() => {
    const url = filtersToURL(filters);
    router.replace(`${pathname}${url}`, { scroll: false });
  }, [filters, router, pathname]);

  // Listen to browser back/forward
  useEffect(() => {
    const urlFilters = filtersFromURL(searchParams);
    setFilters((prev) => ({ ...prev, ...urlFilters }));
    setSearchInput(urlFilters.search ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  // Build tRPC query input
  const queryInput = useMemo(
    () => ({
      category: filters.category !== "all" ? filters.category : undefined,
      architecture: filters.architecture !== "all" ? filters.architecture : undefined,
      license: filters.license !== "all" ? filters.license : undefined,
      size: filters.size !== "all" ? (filters.size as "lt1b" | "1b-10b" | "10b-70b" | "70bplus") : undefined,
      search: filters.search || undefined,
      sort: filters.sort,
      page: filters.page,
      limit: ITEMS_PER_PAGE,
    }),
    [filters]
  );

  const { data, isLoading, error } = trpc.models.list.useQuery(queryInput);
  const { data: filtersData } = trpc.models.filters.useQuery();

  // Map DB models
  const models = useMemo(
    () =>
      data?.models.map((m) => ({
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
      })) ?? [],
    [data?.models]
  );

  // Handlers
  const updateFilter = useCallback(
    (key: keyof FiltersState, value: string | number | null) => {
      if (value === null) return;
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        page: key !== "page" ? 1 : (value as number),
      }));
    },
    []
  );

  const removeFilter = useCallback(
    (key: string) => {
      updateFilter(key as keyof FiltersState, key === "sort" ? "downloads" : "all");
    },
    [updateFilter]
  );

  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      category: "all",
      size: "all",
      architecture: "all",
      license: "all",
      sort: "downloads",
      page: 1,
      view: filters.view,
    });
    setSearchInput("");
  }, [filters.view]);

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Browse Models</h1>
          <p className="text-muted-foreground">
            Discover open-source LLMs for your projects
          </p>
        </div>
        <Tooltip>
          <TooltipTrigger>
            <Button className="gap-2" render={<Link href="/models/upload" />}>
              <Upload className="size-4" />
              Upload Model
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p>
              Any registered user can submit an open-source model. All uploads
              are reviewed before publication.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search models by name, description, or architecture…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchInput && (
          <button
            onClick={() => {
              setSearchInput("");
              setDebouncedSearch("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          
          {/* Category */}
          <Select
            value={filters.category}
            onValueChange={(v) => updateFilter("category", v)}
          >
            <SelectTrigger size="sm" className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Size */}
          <Select
            value={filters.size}
            onValueChange={(v) => updateFilter("size", v)}
          >
            <SelectTrigger size="sm" className="w-[130px]">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {SIZE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Architecture */}
          <Select
            value={filters.architecture}
            onValueChange={(v) => updateFilter("architecture", v)}
          >
            <SelectTrigger size="sm" className="w-[150px]">
              <SelectValue placeholder="Architecture" />
            </SelectTrigger>
            <SelectContent>
              {ARCHITECTURE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* License */}
          <Select
            value={filters.license}
            onValueChange={(v) => updateFilter("license", v)}
          >
            <SelectTrigger size="sm" className="w-[140px]">
              <SelectValue placeholder="License" />
            </SelectTrigger>
            <SelectContent>
              {LICENSE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <Select
            value={filters.sort}
            onValueChange={(v) => updateFilter("sort", v)}
          >
            <SelectTrigger size="sm" className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-6" />

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border bg-muted/30 p-0.5">
            <button
              onClick={() => updateFilter("view", "grid")}
              className={cn(
                "rounded-md p-1.5 transition-all",
                filters.view === "grid"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => updateFilter("view", "table")}
              className={cn(
                "rounded-md p-1.5 transition-all",
                filters.view === "table"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      <ActiveFilters
        filters={filters}
        onClear={clearFilters}
        onRemove={removeFilter}
      />

      <Separator className="my-4" />

      {/* Error state */}
      {error && (
        <div className="text-center py-20">
          <p className="text-destructive mb-2">Failed to load models</p>
          <p className="text-muted-foreground text-sm">{error.message}</p>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && data?.total === 0 && (
        <EmptyState
          variant="no-results"
          title="No models found"
          description="Try different filters or search terms."
          action={
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          }
        />
      )}

      {/* Results */}
      {!isLoading && !error && (data?.total ?? 0) > 0 && (
        <>
          {/* Results count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {data?.total ?? 0}
              </span>{" "}
              model{(data?.total ?? 0) !== 1 ? "s" : ""} found
              {filters.search && (
                <span>
                  {" "}
                  for &quot;
                  <span className="text-foreground font-medium">
                    {filters.search}
                  </span>
                  &quot;
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              Page {data?.page ?? 1} of {data?.totalPages ?? 1}
            </p>
          </div>

          {/* Grid or Table view */}
          {filters.view === "grid" ? (
            <ModelGrid models={models} />
          ) : (
            <ModelTableView models={models} search={filters.search} />
          )}

          {/* Pagination */}
          <PaginationControls
            page={filters.page}
            totalPages={data?.totalPages ?? 1}
            onPageChange={(p) => updateFilter("page", p)}
          />
        </>
      )}
    </div>
  );
}
