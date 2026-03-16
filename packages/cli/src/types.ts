export interface TrustScore {
  overall: number; // 0-100
  reliability: number; // 0-100: uptime, consistency
  latency: number; // 0-100: speed score
  costEfficiency: number; // 0-100: value for money
  safety: number; // 0-100: content safety
  lastUpdated: string; // ISO date
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  costPer1MInput: number;
  costPer1MOutput: number;
  contextWindow: number;
  maxOutput: number;
  latencyMs: number;
  capabilities: string[];
  releaseDate: string;
  apiEndpoint: string;
  trustScore?: TrustScore;
}
