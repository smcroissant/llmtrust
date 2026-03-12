import { ModelCard } from "./model-card";

interface Model {
  slug: string;
  name: string;
  description: string;
  parameterCount: string | null;
  architecture: string | null;
  category: string | null;
  downloadCount: number;
  license: string | null;
  tags: string[];
}

interface ModelGridProps {
  models: Model[];
  emptyMessage?: string;
}

export function ModelGrid({ models, emptyMessage = "No models found." }: ModelGridProps) {
  if (models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {models.map((model) => (
        <ModelCard key={model.slug} model={model} />
      ))}
    </div>
  );
}
