import type { Metadata } from "next";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";
import CompareIndexClient from "./compare-index-client";

export const metadata: Metadata = generatePageMetadata({
  title: "Compare LLM Models Side by Side",
  description: "Compare open-source LLMs head-to-head. Benchmarks, pricing, features & real-world performance. Find the best AI model for your use case.",
  canonical: canonicalUrl("/compare"),
});

export default function ComparePage() {
  return <CompareIndexClient />;
}
