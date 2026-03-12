"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <React.Fragment key={index}>
              {/* Step indicator + label */}
              <div className="flex flex-col items-center gap-2 min-w-0">
                <div
                  className={cn(
                    "flex items-center justify-center size-9 rounded-full border-2 text-sm font-semibold transition-all duration-300 shrink-0",
                    isCompleted && [
                      "border-primary bg-primary text-primary-foreground",
                      "shadow-[0_0_12px_oklch(0.68_0.24_290_/_0.3)]",
                    ],
                    isCurrent && [
                      "border-primary bg-background text-primary",
                      "shadow-[0_0_16px_oklch(0.68_0.24_290_/_0.25)]",
                    ],
                    isUpcoming && "border-muted-foreground/30 bg-background text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="text-center hidden sm:block">
                  <p
                    className={cn(
                      "text-xs font-medium transition-colors duration-200",
                      isCurrent && "text-foreground",
                      isCompleted && "text-primary",
                      isUpcoming && "text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-[10px] text-muted-foreground mt-0.5 hidden md:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 flex items-center px-2 mt-[18px]">
                  <div
                    className={cn(
                      "h-0.5 w-full rounded-full transition-all duration-500",
                      isCompleted
                        ? "bg-primary shadow-[0_0_6px_oklch(0.68_0.24_290_/_0.3)]"
                        : "bg-muted-foreground/20",
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
