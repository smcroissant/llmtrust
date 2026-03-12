import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * GlowCard — LLM Trust's signature card component.
 *
 * A card with a subtle glow border effect on hover,
 * creating that "neural energy" feel.
 */
const GlowCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    /** Disable the glow hover effect */
    noGlow?: boolean;
  }
>(({ className, noGlow = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground transition-all duration-250",
      !noGlow && [
        "hover:border-primary/30",
        "hover:shadow-[0_0_0_1px_oklch(0.68_0.24_290_/_0.08),0_8px_24px_oklch(0_0_0_/_0.2),0_0_40px_oklch(0.68_0.24_290_/_0.06)]",
        "hover:-translate-y-0.5 hover:scale-[1.01]",
      ],
      className
    )}
    {...props}
  />
));
GlowCard.displayName = "GlowCard";

const GlowCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-5", className)}
    {...props}
  />
));
GlowCardHeader.displayName = "GlowCardHeader";

const GlowCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
GlowCardTitle.displayName = "GlowCardTitle";

const GlowCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground line-clamp-2", className)}
    {...props}
  />
));
GlowCardDescription.displayName = "GlowCardDescription";

const GlowCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
));
GlowCardContent.displayName = "GlowCardContent";

const GlowCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-5 pt-0", className)}
    {...props}
  />
));
GlowCardFooter.displayName = "GlowCardFooter";

export {
  GlowCard,
  GlowCardHeader,
  GlowCardFooter,
  GlowCardTitle,
  GlowCardDescription,
  GlowCardContent,
};
