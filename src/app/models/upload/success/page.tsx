"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
} from "@/components/ui/glow-card";
import { CheckCircle, ArrowRight, Plus, LayoutDashboard, Eye } from "lucide-react";

export default function UploadSuccessPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  return (
    <div className="container mx-auto max-w-lg px-4 py-16">
      <div className="text-center mb-8 animate-fade-up">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
          <CheckCircle className="size-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Model Submitted!</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your model has been submitted for review. It will appear on the platform once approved by our team.
        </p>
      </div>

      <GlowCard className="animate-fade-up-delay-1">
        <GlowCardHeader>
          <GlowCardTitle>What happens next?</GlowCardTitle>
          <GlowCardDescription>
            Here&apos;s the review process timeline
          </GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 size-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                1
              </div>
              <div>
                <p className="font-medium text-sm">Automated checks</p>
                <p className="text-xs text-muted-foreground">
                  We verify the HuggingFace URL and metadata completeness
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 size-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                2
              </div>
              <div>
                <p className="font-medium text-sm">Community review</p>
                <p className="text-xs text-muted-foreground">
                  Our team reviews the model details for accuracy and quality
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 size-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                3
              </div>
              <div>
                <p className="font-medium text-sm">Publication</p>
                <p className="text-xs text-muted-foreground">
                  Once approved, your model goes live on LLM Trust
                </p>
              </div>
            </div>
          </div>
        </GlowCardContent>
      </GlowCard>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8 animate-fade-up-delay-2">
        {slug && (
          <Button variant="outline" className="flex-1 gap-2" render={<Link href={`/models/${slug}`} />}>
            <Eye className="size-4" />
            View Model Page
          </Button>
        )}
        <Button variant="outline" className="flex-1 gap-2" render={<Link href="/dashboard" />}>
          <LayoutDashboard className="size-4" />
          Dashboard
        </Button>
        <Button className="flex-1 gap-2 bg-gradient-to-r from-primary to-chart-1 hover:opacity-90" render={<Link href="/models/upload" />}>
          <Plus className="size-4" />
          Upload Another
        </Button>
      </div>
    </div>
  );
}
