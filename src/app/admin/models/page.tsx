"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { GlowCard, GlowCardContent, GlowCardHeader } from "@/components/ui/glow-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Cpu,
  Search,
  Check,
  X,
  Archive,
  Star,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminModelsPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published" | "archived">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = trpc.admin.models.useQuery({
    status: statusFilter,
    search: search || undefined,
    page,
    limit: 15,
  });

  const updateStatus = trpc.admin.updateModelStatus.useMutation({
    onSuccess: () => {
      toast.success("Model status updated");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleStatusChange = (
    modelId: string,
    newStatus: "draft" | "published" | "archived"
  ) => {
    updateStatus.mutate({ modelId, status: newStatus });
  };

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case "published":
        return "default" as const;
      case "draft":
        return "secondary" as const;
      case "archived":
        return "outline" as const;
      default:
        return "secondary" as const;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Cpu className="size-6 text-primary" />
          Model Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Review, approve, and manage all models on the platform
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search models..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-8"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val as typeof statusFilter);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Pending</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Models Table */}
      <GlowCard noGlow>
        <GlowCardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : data?.models && data.models.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Architecture</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.models.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-medium">{m.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {m.description}
                            </p>
                          </div>
                          {m.isFeatured && (
                            <Star className="size-3 text-accent fill-accent shrink-0" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {m.category ?? "uncategorized"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {m.architecture ?? "—"}
                        {m.parameterCount && (
                          <span className="ml-1">({m.parameterCount})</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant(m.status ?? "draft")}>
                          {m.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {(m.downloadCount ?? 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {m.authorName ?? "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          {m.status !== "published" && (
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => handleStatusChange(m.id, "published")}
                              disabled={updateStatus.isPending}
                              title="Approve & Publish"
                            >
                              <Check className="size-3.5 text-green-500" />
                            </Button>
                          )}
                          {m.status !== "archived" && (
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => handleStatusChange(m.id, "archived")}
                              disabled={updateStatus.isPending}
                              title="Archive"
                            >
                              <Archive className="size-3.5 text-muted-foreground" />
                            </Button>
                          )}
                          {m.status !== "draft" && (
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => handleStatusChange(m.id, "draft")}
                              disabled={updateStatus.isPending}
                              title="Set to Pending"
                            >
                              <X className="size-3.5 text-destructive" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            render={<a href={`/models/${m.slug}`} target="_blank" rel="noopener noreferrer" />}
                            title="View on platform"
                          >
                            <ExternalLink className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <p className="text-sm text-muted-foreground">
                    {data.total} model{data.total !== 1 ? "s" : ""} total
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {data.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= data.totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Cpu className="size-10 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No models found</p>
            </div>
          )}
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
