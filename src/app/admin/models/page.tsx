"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  CheckCircle,
  XCircle,
  Archive,
  Search,
  Star,
  StarOff,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const STATUS_CONFIG = {
  draft: { label: "Pending", variant: "secondary" as const },
  published: { label: "Approved", variant: "default" as const },
  archived: { label: "Archived", variant: "outline" as const },
};

type ModelStatus = "all" | "draft" | "published" | "archived";

export default function AdminModelsPage() {
  const searchParams = useSearchParams();
  const initialStatus = (searchParams.get("status") as ModelStatus) || "all";

  const [status, setStatus] = useState<ModelStatus>(initialStatus);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.admin.models.useQuery({
    status,
    search: search || undefined,
    page,
    limit: 20,
  });

  const updateStatus = trpc.admin.updateModelStatus.useMutation({
    onSuccess: () => {
      utils.admin.models.invalidate();
      utils.admin.stats.invalidate();
      toast.success("Model status updated");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const toggleFeatured = trpc.admin.toggleFeatured.useMutation({
    onSuccess: () => {
      utils.admin.models.invalidate();
      toast.success("Featured status toggled");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleStatusChange = (
    modelId: string,
    newStatus: "draft" | "published" | "archived",
  ) => {
    updateStatus.mutate({ modelId, status: newStatus });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Model Management</h1>
        <p className="text-muted-foreground">
          Review, approve, and manage model submissions.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Status Tabs */}
            <div className="flex gap-1">
              {(
                [
                  ["all", "All"],
                  ["draft", "Pending"],
                  ["published", "Approved"],
                  ["archived", "Archived"],
                ] as const
              ).map(([value, label]) => (
                <Button
                  key={value}
                  variant={status === value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setStatus(value);
                    setPage(1);
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search models..."
                className="pl-8"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Models Table */}
      <Card>
        <CardHeader>
          <CardTitle>Models</CardTitle>
          <CardDescription>
            {data?.total ?? 0} model{data?.total !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : data?.models?.length ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.models.map((m) => {
                    const config =
                      STATUS_CONFIG[m.status as keyof typeof STATUS_CONFIG] ??
                      STATUS_CONFIG.draft;
                    return (
                      <TableRow key={m.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{m.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {m.slug}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={config.variant}>{config.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{m.category ?? "—"}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono">
                            {m.downloadCount?.toLocaleString() ?? 0}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toggleFeatured.mutate({ modelId: m.id })
                            }
                            disabled={toggleFeatured.isPending}
                          >
                            {m.isFeatured ? (
                              <Star className="size-4 fill-accent text-accent" />
                            ) : (
                              <StarOff className="size-4 text-muted-foreground" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {m.createdAt
                              ? formatDistanceToNow(new Date(m.createdAt), {
                                  addSuffix: true,
                                })
                              : "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/models/${m.slug}`} target="_blank">
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="size-3.5" />
                              </Button>
                            </Link>
                            {m.status !== "published" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(m.id, "published")
                                }
                                disabled={updateStatus.isPending}
                                className="text-chart-5 hover:text-chart-5"
                              >
                                <CheckCircle className="size-3.5" />
                              </Button>
                            )}
                            {m.status !== "draft" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(m.id, "draft")
                                }
                                disabled={updateStatus.isPending}
                                className="text-accent hover:text-accent"
                              >
                                <XCircle className="size-3.5" />
                              </Button>
                            )}
                            {m.status !== "archived" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(m.id, "archived")
                                }
                                disabled={updateStatus.isPending}
                              >
                                <Archive className="size-3.5" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm text-muted-foreground">
                    Page {data.page} of {data.totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="size-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(data.totalPages, p + 1))
                      }
                      disabled={page === data.totalPages}
                    >
                      Next
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="size-8 mb-2" />
              <p>No models found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
