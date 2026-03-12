import { cn } from "@/lib/utils";
import { SearchX, Database, FileQuestion, Sparkles } from "lucide-react";

type EmptyStateVariant = "no-results" | "no-data" | "not-found" | "generic";

interface EmptyStateProps {
  /** Variant determines icon and default messages */
  variant?: EmptyStateVariant;
  /** Custom title (overrides variant default) */
  title?: string;
  /** Custom description */
  description?: string;
  /** Optional action element (button, link, etc.) */
  action?: React.ReactNode;
  className?: string;
}

const variantConfig: Record<
  EmptyStateVariant,
  { icon: React.ElementType; title: string; description: string }
> = {
  "no-results": {
    icon: SearchX,
    title: "No models found",
    description: "Try adjusting your search or filter criteria.",
  },
  "no-data": {
    icon: Database,
    title: "Nothing here yet",
    description: "This section will be populated as data becomes available.",
  },
  "not-found": {
    icon: FileQuestion,
    title: "Not found",
    description: "The resource you're looking for doesn't exist.",
  },
  generic: {
    icon: Sparkles,
    title: "Coming soon",
    description: "We're working on something exciting. Stay tuned!",
  },
};

/**
 * EmptyState — LLM Trust's empty state component.
 *
 * Shows a centered icon, title, description, and optional action.
 * Uses a subtle radial gradient background for the icon area.
 */
export function EmptyState({
  variant = "generic",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      {/* Icon container with glow */}
      <div className="relative mb-6">
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-20"
          style={{
            background:
              "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
          }}
        />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold tracking-tight mb-2">
        {title ?? config.title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description ?? config.description}
      </p>

      {/* Optional action */}
      {action}
    </div>
  );
}
