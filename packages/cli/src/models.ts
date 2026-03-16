import { Model } from "./types.js";
import modelsData from "../data/models.json";

export function getAllModels(): Model[] {
  return modelsData as Model[];
}

export function findModel(query: string): Model | undefined {
  const models = getAllModels();
  const lower = query.toLowerCase();
  return models.find(
    (m) =>
      m.id.toLowerCase() === lower ||
      m.name.toLowerCase() === lower ||
      m.id.toLowerCase().replace(/\s+/g, "-") === lower.replace(/\s+/g, "-")
  );
}

export function getModelsByProvider(provider: string): Model[] {
  const models = getAllModels();
  return models.filter((m) => m.provider.toLowerCase() === provider.toLowerCase());
}

export function getProviders(): string[] {
  const models = getAllModels();
  return [...new Set(models.map((m) => m.provider))].sort();
}
