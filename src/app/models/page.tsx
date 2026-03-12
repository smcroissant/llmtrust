import type { Metadata } from "next";
import { TopBar } from "@/components/layout/top-bar";
import { ModelsPageClient } from "./models-client";

export const metadata: Metadata = {
  title: "Browse Open-Source LLMs",
  description:
    "Discover and compare open-source large language models. Filter by architecture, size, category, and more. Find the perfect model for your project.",
  openGraph: {
    title: "Browse Open-Source LLMs | LLM Trust",
    description:
      "Discover and compare open-source large language models. Filter by architecture, size, category, and more.",
  },
};

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
