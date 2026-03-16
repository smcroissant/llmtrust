import type { Metadata } from "next";
import { TopBar } from "@/components/layout/top-bar";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import { TrustScoresClient } from "./trust-scores-client";

export const metadata: Metadata = generatePageMetadata({
  title: "LLM Trust Scores — Real Production Data Rankings",
  description:
    "Real trust scores computed from actual LLM API traffic. No synthetic benchmarks — just honest reliability, consistency, and cost efficiency metrics from production workloads.",
  canonical: canonicalUrl("/trust-scores"),
  type: "website",
});

export default function TrustScoresPage() {
  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Trust Scores" },
        ]}
      />
      <TrustScoresClient />
    </>
  );
}
