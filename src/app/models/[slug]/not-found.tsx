import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ArrowLeft, LayoutGrid } from "lucide-react";

export default function ModelNotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/models"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Models
        </Link>
      </div>

      <EmptyState
        variant="not-found"
        title="Model not found"
        description="The model you're looking for doesn't exist or may have been removed."
        action={
          <div className="flex gap-3">
            <Button render={<Link href="/models" />}>
              <LayoutGrid className="mr-2 h-4 w-4" />
              Browse Models
            </Button>
            <Button variant="outline" render={<Link href="/" />}>
              Go Home
            </Button>
          </div>
        }
      />
    </div>
  );
}
