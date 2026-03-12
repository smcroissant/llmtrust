import type { Metadata } from "next";
import { TopBar } from "@/components/layout/top-bar";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import { ModelsPageClient } from "./models-client";

export const metadata: Metadata = generatePageMetadata({
  title: "Browse Open-Source LLMs — Compare 200+ AI Models",
  description:
    "Explore 200+ open-source LLMs by architecture, size & category. Compare benchmarks, download counts & find the perfect model for your project.",
  canonical: canonicalUrl("/models"),
  type: "website",
});

export default function ModelsPage() {
  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Models" },
        ]}
      />
      <ModelsPageClient />
    </>
  );
}
