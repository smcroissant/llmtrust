import type { Metadata } from "next";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { GitCompareArrows } from "lucide-react";

export const metadata: Metadata = {
  title: "Compare Models",
  description: "Compare open-source LLM models side by side.",
};

export default function ComparePage() {
  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Compare" },
        ]}
      />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <GitCompareArrows className="size-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Compare Models</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Select two models to compare their capabilities, performance, and specifications side by side.
        </p>
        <Link
          href="/models"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Browse Models
        </Link>
      </div>
    </>
  );
}
