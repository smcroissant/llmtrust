import { Model, TrustScore } from "./types.js";
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

export interface SearchFilter {
  maxLatency?: number;
  maxCost?: number;
  minContext?: number;
  capability?: string;
  provider?: string;
  minTrustScore?: number;
}

export function searchModels(query: string, filters?: SearchFilter): Model[] {
  let models = getAllModels();
  const lower = query.toLowerCase();

  // Text search: match against name, id, provider, capabilities
  models = models.filter((m) => {
    return (
      m.name.toLowerCase().includes(lower) ||
      m.id.toLowerCase().includes(lower) ||
      m.provider.toLowerCase().includes(lower) ||
      m.capabilities.some((c) => c.toLowerCase().includes(lower))
    );
  });

  // Apply filters
  if (filters) {
    if (filters.maxLatency !== undefined) {
      models = models.filter((m) => m.latencyMs <= filters.maxLatency!);
    }
    if (filters.maxCost !== undefined) {
      models = models.filter(
        (m) => m.costPer1MInput <= filters.maxCost! && m.costPer1MOutput <= filters.maxCost!
      );
    }
    if (filters.minContext !== undefined) {
      models = models.filter((m) => m.contextWindow >= filters.minContext!);
    }
    if (filters.capability) {
      models = models.filter((m) =>
        m.capabilities.some((c) => c.toLowerCase() === filters.capability!.toLowerCase())
      );
    }
    if (filters.provider) {
      models = models.filter((m) => m.provider.toLowerCase() === filters.provider!.toLowerCase());
    }
    if (filters.minTrustScore !== undefined) {
      models = models.filter((m) => (m.trustScore?.overall ?? 0) >= filters.minTrustScore!);
    }
  }

  // Sort by trust score descending
  models.sort((a, b) => (b.trustScore?.overall ?? 0) - (a.trustScore?.overall ?? 0));

  return models;
}

export function getModelsByTrustScore(sort: "asc" | "desc" = "desc"): Model[] {
  const models = getAllModels();
  return models.sort((a, b) => {
    const aScore = a.trustScore?.overall ?? 0;
    const bScore = b.trustScore?.overall ?? 0;
    return sort === "desc" ? bScore - aScore : aScore - bScore;
  });
}
