import type { Metadata } from "next";
import { TopBar } from "@/components/layout/top-bar";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import { TACPageClient } from "./tac-client";

export const metadata: Metadata = generatePageMetadata({
  title: "Trust-Adjusted Cost — The True Price of AI Models",
  description:
    "Compare LLM models by their true cost when reliability, hallucination rates, and compliance are factored in. TAC reveals the real price of AI.",
  canonical: canonicalUrl("/trust-adjusted-cost"),
  type: "website",
});

export default function TrustAdjustedCostPage() {
  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Trust-Adjusted Cost" },
        ]}
      />
      <TACPageClient />
    </>
  );
}
