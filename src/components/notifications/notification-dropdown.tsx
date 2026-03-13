"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import {
  Check,
  CheckCheck,
  Bell,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  Info,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { NotificationType } from "@/server/db/schema";

interface NotificationDropdownProps {
  onClose: () => void;
}

const NOTIFICATION_ICONS: Record<
  NotificationType,
  { icon: typeof CheckCircle; color: string }
> = {
  model_approved: { icon: CheckCircle, color: "text-chart-5" },
  model_rejected: { icon: XCircle, color: "text-destructive" },
  new_review: { icon: MessageSquare, color: "text-primary" },
  system: { icon: Info, color: "text-muted-foreground" },
};

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.notifications.list.useQuery({
    limit: 5,
    page: 1,
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
    <div
      className={cn(
        "absolute right-0 top-full mt-2 z-50",
        "w-80 sm:w-96",
        "rounded-xl border border-border",
        "bg-card/95 backdrop-blur-xl",
        "shadow-[0_0_0_1px_oklch(0.68_0.24_290_/_0.06),0_8px_32px_oklch(0_0_0_/_0.3),0_0_48px_oklch(0.55_0.22_290_/_0.08)]",
        "overflow-hidden",
        "animate-scale-in"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-semibold text-sm">Notifications</h3>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={() => markAllAsRead.mutate()}
            className={cn(
              "flex items-center gap-1.5 text-xs text-muted-foreground",
              "hover:text-primary transition-colors",
              "disabled:opacity-50"
            )}
            disabled={markAllAsRead.isPending}
          >
            <CheckCheck className="size-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Bell className="size-8 mb-2 opacity-40" />
            <p className="text-sm">No notifications yet</p>
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
                    "flex items-start gap-3 px-4 py-3",
                    "transition-colors duration-150",
                    "hover:bg-accent/30",
                    !n.read && "bg-primary/[0.03]"
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex-shrink-0 mt-0.5",
                      "flex items-center justify-center",
                      "size-8 rounded-lg",
                      "bg-surface",
                      config.color
                    )}
                  >
                    <Icon className="size-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm leading-tight",
                          !n.read && "font-medium"
                        )}
                      >
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="flex-shrink-0 size-2 rounded-full bg-primary mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground">
                        {n.createdAt
                          ? formatDistanceToNow(new Date(n.createdAt), {
                              addSuffix: true,
                            })
                          : ""}
                      </span>
                      {n.link && (
                        <Link
                          href={n.link}
                          onClick={onClose}
                          className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
                        >
                          View <ExternalLink className="size-2.5" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Mark as read button */}
                  {!n.read && (
                    <button
                      onClick={() => markAsRead.mutate({ id: n.id })}
                      className={cn(
                        "flex-shrink-0 mt-0.5",
                        "p-1 rounded-md",
                        "text-muted-foreground hover:text-primary",
                        "hover:bg-accent/50",
                        "transition-colors",
                        "opacity-0 group-hover:opacity-100"
                      )}
                      title="Mark as read"
                    >
                      <Check className="size-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border">
        <Link
          href="/notifications"
          onClick={onClose}
          className={cn(
            "block text-center py-2.5 text-xs font-medium",
            "text-primary hover:text-primary/80",
            "transition-colors"
          )}
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
}
