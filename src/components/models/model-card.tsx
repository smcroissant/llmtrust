import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Star } from "lucide-react";

interface ModelCardProps {
  model: {
    slug: string;
    name: string;
    description: string;
    parameterCount: string | null;
    architecture: string | null;
    category: string | null;
    downloadCount: number;
    license: string | null;
    tags: string[];
  };
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <Link href={`/models/${model.slug}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg line-clamp-1">{model.name}</CardTitle>
            {model.parameterCount && (
              <Badge variant="secondary" className="shrink-0">
                {model.parameterCount}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {model.description}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {model.architecture && (
              <Badge variant="outline" className="text-xs">
                {model.architecture}
              </Badge>
            )}
            {model.category && (
              <Badge variant="outline" className="text-xs">
                {model.category}
              </Badge>
            )}
            {model.license && (
              <Badge variant="outline" className="text-xs">
                {model.license}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {model.downloadCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {model.tags.length} tags
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
