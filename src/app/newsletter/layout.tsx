import type { Metadata } from "next";
import { generatePageMetadata, canonicalUrl } from "@/components/seo/page-seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Newsletter — LLM Trust Weekly Digest",
  description:
    "Subscribe to the LLM Trust newsletter. Weekly updates on new AI models, benchmarks, deployment tips, and open-source AI news. Free, no spam.",
  canonical: canonicalUrl("/newsletter"),
});

export default function NewsletterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
