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
}
