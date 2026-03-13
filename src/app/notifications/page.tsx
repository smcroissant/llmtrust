"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
} from "@/components/ui/glow-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  CheckCheck,
  Bell,
  CheckCircle,
  XCircle,
  MessageSquare,
  Info,
  ExternalLink,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { NotificationType } from "@/server/db/schema";

const NOTIFICATION_ICONS: Record<
  NotificationType,
  { icon: typeof CheckCircle; color: string; bg: string }
> = {
  model_approved: {
    icon: CheckCircle,
    color: "text-chart-5",
    bg: "bg-chart-5/10",
  },
  model_rejected: {
    icon: XCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  new_review: {
    icon: MessageSquare,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  system: {
    icon: Info,
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
};

const TYPE_LABELS: Record<NotificationType, string> = {
  model_approved: "Approval",
  model_rejected: "Rejection",
  new_review: "Review",
  system: "System",
};

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.notifications.list.useQuery({
    page,
    limit: 20,
    unreadOnly: filter === "unread",
  });

  const markAsRead = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.unreadCount.invalidate();
      utils.notifications.list.invalidate();
    },
  });

  const markAllAsRead = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.unreadCount.invalidate();
      utils.notifications.list.invalidate();
    },
  });

  const notifications = data?.notifications ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="size-6 text-primary" />
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay updated on your models and reviews.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => markAllAsRead.mutate()}
          disabled={markAllAsRead.isPending}
          className="gap-2"
        >
          <CheckCheck className="size-4" />
          Mark all read
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => {
            setFilter("all");
            setPage(1);
          }}
        >
          All
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "ghost"}
          size="sm"
          onClick={() => {
            setFilter("unread");
            setPage(1);
          }}
        >
          Unread
        </Button>
      </div>

      {/* Notification List */}
      <GlowCard>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Bell className="size-12 mb-3 opacity-30" />
            <p className="text-lg font-medium">All caught up!</p>
            <p className="text-sm mt-1">
              {filter === "unread"
                ? "No unread notifications."
                : "No notifications yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {notifications.map((n) => {
              const config =
                NOTIFICATION_ICONS[n.type as NotificationType] ??
                NOTIFICATION_ICONS.system;
              const Icon = config.icon;

              return (
                <div
                  key={n.id}
                  className={cn(
                    "flex items-start gap-4 px-6 py-4",
                    "transition-all duration-150",
                    "hover:bg-accent/20",
                    !n.read &&
                      "bg-primary/[0.02] border-l-2 border-l-primary"
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex-shrink-0",
                      "flex items-center justify-center",
                      "size-10 rounded-xl",
                      config.bg,
                      config.color
                    )}
                  >
                    <Icon className="size-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className={cn(
                          "text-sm",
                          !n.read && "font-semibold"
                        )}
                      >
                        {n.title}
                      </p>
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                      >
                        {TYPE_LABELS[n.type as NotificationType] ?? "System"}
                      </Badge>
                      {!n.read && (
                        <span className="size-2 rounded-full bg-primary animate-glow-pulse" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {n.message}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {n.createdAt
                          ? formatDistanceToNow(new Date(n.createdAt), {
                              addSuffix: true,
                            })
                          : ""}
                      </span>
                      {n.link && (
                        <Link
                          href={n.link}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          View details{" "}
                          <ExternalLink className="size-3" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0">
                    {!n.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead.mutate({ id: n.id })}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Check className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Page {data.page} of {data.totalPages} · {data.total} notifications
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
      </GlowCard>
    </div>
  );
}
