/**
 * Model data update script — run weekly via CI.
 * In production, this would fetch from provider APIs/docs.
 * For now, it validates the existing data structure.
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const modelsPath = resolve(__dirname, "../data/models.json");

interface Model {
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

async function main() {
  const raw = readFileSync(modelsPath, "utf-8");
  const models: Model[] = JSON.parse(raw);

  console.log(`Validating ${models.length} models...`);

  for (const model of models) {
    const required = [
      "id",
      "name",
      "provider",
      "costPer1MInput",
      "costPer1MOutput",
      "contextWindow",
      "maxOutput",
      "latencyMs",
      "capabilities",
      "releaseDate",
    ];

    for (const field of required) {
      if ((model as any)[field] === undefined) {
        throw new Error(`Model ${model.id} missing field: ${field}`);
      }
    }

    if (model.costPer1MInput < 0 || model.costPer1MOutput < 0) {
      throw new Error(`Model ${model.id}: negative cost`);
    }

    if (model.contextWindow <= 0) {
      throw new Error(`Model ${model.id}: invalid context window`);
    }
  }

  // Sort by provider then name
  models.sort((a, b) =>
    a.provider === b.provider
      ? a.name.localeCompare(b.name)
      : a.provider.localeCompare(b.provider)
  );

  writeFileSync(modelsPath, JSON.stringify(models, null, 2) + "\n");
  console.log(`✓ ${models.length} models validated and sorted.`);
}

main().catch((err) => {
  console.error("Update failed:", err);
  process.exit(1);
});
