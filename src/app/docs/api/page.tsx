import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";

export default function ApiDocsPage() {
  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "API" },
        ]}
      />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">API Reference</h1>
        <p className="text-muted-foreground mb-8">
          Integrate LLM Trust into your applications with our REST API.
        </p>

        <div className="space-y-6">
          <div className="card-glow p-6">
            <h2 className="text-lg font-semibold mb-2">Authentication</h2>
            <p className="text-sm text-muted-foreground mb-4">
              All API requests require an API key. Generate one from your dashboard.
            </p>
            <code className="text-sm bg-muted px-3 py-1.5 rounded-md block">
              Authorization: Bearer llmt_your_api_key
            </code>
          </div>

          <div className="card-glow p-6">
            <h2 className="text-lg font-semibold mb-2">Models Endpoint</h2>
            <p className="text-sm text-muted-foreground mb-4">
              List and search available models.
            </p>
            <code className="text-sm bg-muted px-3 py-1.5 rounded-md block">
              GET /api/v1/models
            </code>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/docs" className="text-primary text-sm hover:underline">
            ← Back to docs
          </Link>
        </div>
      </div>
    </>
  );
}
