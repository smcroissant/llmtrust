"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Search,
  GitCompareArrows,
  Heart,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";

const STORAGE_KEY = "llmtrust-quick-tour-completed";

interface TourStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  illustration: string;
  cta: string;
  href: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Browse Models",
    description:
      "Explore 200+ open-source LLMs. Filter by category, architecture, or parameter count to find the perfect model for your project.",
    icon: <Search className="size-6" />,
    illustration: "🔍",
    cta: "Browse Models",
    href: "/models",
  },
  {
    title: "Compare Side-by-Side",
    description:
      "Pick any two models and compare their specs, benchmarks, community reviews, and download counts at a glance.",
    icon: <GitCompareArrows className="size-6" />,
    illustration: "⚡",
    cta: "Compare Models",
    href: "/compare",
  },
  {
    title: "Save Your Favorites",
    description:
      "Click the heart icon on any model to save it to your dashboard. Build your personal library of go-to LLMs.",
    icon: <Heart className="size-6" />,
    illustration: "⭐",
    cta: "View Dashboard",
    href: "/dashboard",
  },
  {
    title: "Share Your Reviews",
    description:
      "Used a model? Share your experience! Your reviews help the community make better decisions and earn you Trusted Reviewer status.",
    icon: <MessageSquare className="size-6" />,
    illustration: "📝",
    cta: "Explore Models",
    href: "/models",
  },
];

export function QuickTour() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      // Small delay so the dashboard loads first
      const timer = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      handleClose();
    }
  }, [currentStep, handleClose]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleCtaClick = useCallback(() => {
    const step = TOUR_STEPS[currentStep];
    handleClose();
    router.push(step.href);
  }, [currentStep, handleClose, router]);

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;
  const isFirst = currentStep === 0;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleSkip()}>
      <DialogContent className="sm:max-w-md gap-0 p-0 overflow-hidden">
        {/* Progress bar */}
        <div className="flex h-1 w-full bg-muted">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 transition-all duration-300 ${
                i <= currentStep ? "bg-primary" : ""
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-6 pb-4">
          <DialogHeader className="items-center text-center space-y-4">
            {/* Illustration */}
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-4xl">
              {step.illustration}
            </div>

            <div className="space-y-2">
              <DialogTitle className="text-xl">{step.title}</DialogTitle>
              <DialogDescription className="text-sm leading-relaxed">
                {step.description}
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-1.5 pb-4">
          {TOUR_STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`size-2 rounded-full transition-all ${
                i === currentStep
                  ? "bg-primary w-6"
                  : i < currentStep
                    ? "bg-primary/50"
                    : "bg-muted-foreground/20"
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 border-t p-4 bg-muted/30">
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            Skip tour
          </Button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ArrowLeft className="size-3.5 mr-1" />
                Back
              </Button>
            )}
            {isLast ? (
              <Button size="sm" onClick={handleCtaClick} className="gap-1.5">
                <Check className="size-3.5" />
                Get Started
              </Button>
            ) : (
              <Button size="sm" onClick={handleNext} className="gap-1.5">
                Next
                <ArrowRight className="size-3.5" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Utility to reset the tour (for testing or re-showing)
export function resetQuickTour() {
  localStorage.removeItem(STORAGE_KEY);
}

// Utility to check if tour was completed
export function isQuickTourCompleted(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(STORAGE_KEY) === "true";
}
