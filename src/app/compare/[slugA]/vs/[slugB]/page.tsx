import type { Metadata } from "next";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import { CompareClientPage } from "./compare-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slugA: string; slugB: string }>;
}): Promise<Metadata> {
  const { slugA, slugB } = await params;
  const nameA = slugA.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const nameB = slugB.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return generatePageMetadata({
    title: `${nameA} vs ${nameB} — LLM Comparison`,
    description: `Compare ${nameA} and ${nameB} side by side. Architecture, parameters, context length, benchmarks, and more on LLM Trust.`,
    canonical: canonicalUrl(`/compare/${slugA}/vs/${slugB}`),
  });
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slugA: string; slugB: string }>;
}) {
  const { slugA, slugB } = await params;

  return <CompareClientPage slugA={slugA} slugB={slugB} />;
}
