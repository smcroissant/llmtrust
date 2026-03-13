"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { NotificationDropdown } from "./notification-dropdown";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: unreadData } = trpc.notifications.unreadCount.useQuery(
    undefined,
    {
      refetchInterval: 30000, // Poll every 30s
    }
  );

  const unreadCount = unreadData ?? 0;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative flex items-center justify-center size-9 rounded-lg",
          "transition-all duration-200",
          "hover:bg-accent/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          isOpen && "bg-accent/30"
        )}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <Bell
          className={cn(
            "size-5 transition-colors",
            unreadCount > 0
              ? "text-primary"
              : "text-muted-foreground"
          )}
        />

        {/* Badge */}
        {unreadCount > 0 && (
          <span
            className={cn(
              "absolute -top-0.5 -right-0.5",
              "flex items-center justify-center",
              "min-w-[18px] h-[18px] px-1",
              "rounded-full bg-primary text-primary-foreground",
              "text-[10px] font-bold leading-none",
              "shadow-[0_0_8px_oklch(0.55_0.22_290_/_0.4)]",
              "animate-glow-pulse"
            )}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}

        {/* Glow ring when unread */}
        {unreadCount > 0 && (
          <span className="absolute inset-0 rounded-lg animate-glow-pulse opacity-20 bg-primary/10" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <NotificationDropdown onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}
