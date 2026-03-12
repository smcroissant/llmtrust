/**
 * scripts/seed-prod.ts
 * 
 * Seeds the production database with initial data.
 * Run after migrations on a fresh production DB.
 * 
 * Usage: DATABASE_URL=<prod-url> npx tsx scripts/seed-prod.ts
 */

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../src/server/db/schema";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

type LocalExecution = {
  format: "gguf" | "safetensors" | "pytorch" | "onnx";
  quantizations: string[];
  defaultQuantization: string;
  templateFormat?: "chatml" | "llama" | "mistral" | "alpaca" | "custom";
  recommendedRam: number;
  minRam: number;
};

type ModelSeed = {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  architecture: string;
  parameterCount: string;
  contextLength: number;
  license: string;
  downloadUrl: string;
  category: string;
  tags: string[];
  isFeatured: boolean;
  downloadCount: number;
  localExecution: LocalExecution;
};

// Production seed — curated subset of top models
const PROD_MODELS: ModelSeed[] = [
  {
    slug: "llama-3.1-8b",
    name: "LLaMA 3.1 8B",
    description: "Compact yet capable 8B parameter model. Runs on consumer hardware while maintaining impressive performance.",
    longDescription: "LLaMA 3.1 8B is designed for efficiency without sacrificing quality. It supports 128K context and is ideal for local deployment on gaming PCs and laptops.",
    architecture: "llama",
    parameterCount: "8B",
    contextLength: 131072,
    license: "Llama 3.1 Community License",
    downloadUrl: "https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct",
    category: "text-generation",
    tags: ["open-source", "local-friendly", "128k-context", "efficient"],
    isFeatured: true,
    downloadCount: 15672340,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q6_K", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "llama",
      recommendedRam: 8,
      minRam: 6,
    },
  },
  {
    slug: "llama-3.1-70b",
    name: "LLaMA 3.1 70B",
    description: "Meta's 70B parameter model offering excellent performance with lower resource requirements than 405B.",
    longDescription: "LLaMA 3.1 70B provides a great balance between capability and efficiency. It excels at coding, math, and reasoning while being runnable on consumer hardware with sufficient RAM.",
    architecture: "llama",
    parameterCount: "70B",
    contextLength: 131072,
    license: "Llama 3.1 Community License",
    downloadUrl: "https://huggingface.co/meta-llama/Llama-3.1-70B-Instruct",
    category: "text-generation",
    tags: ["open-source", "reasoning", "code", "128k-context"],
    isFeatured: true,
    downloadCount: 8934201,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q6_K", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "llama",
      recommendedRam: 48,
      minRam: 36,
    },
  },
  {
    slug: "mistral-7b-v0.3",
    name: "Mistral 7B v0.3",
    description: "Efficient 7B parameter model with sliding window attention. Excellent for local deployment.",
    longDescription: "Mistral 7B v0.3 is a powerful yet efficient model using grouped-query attention and sliding window attention. It outperforms LLaMA 2 13B on most benchmarks.",
    architecture: "mistral",
    parameterCount: "7B",
    contextLength: 32768,
    license: "Apache 2.0",
    downloadUrl: "https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3",
    category: "text-generation",
    tags: ["open-source", "local-friendly", "efficient", "apache-2.0"],
    isFeatured: false,
    downloadCount: 9823451,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q6_K", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "mistral",
      recommendedRam: 6,
      minRam: 4,
    },
  },
  {
    slug: "qwen-2.5-7b",
    name: "Qwen 2.5 7B",
    description: "Compact Qwen model with strong performance for its size. Great for local deployment.",
    longDescription: "Qwen 2.5 7B punches above its weight with excellent instruction following and multilingual capabilities. Perfect for resource-constrained environments.",
    architecture: "qwen",
    parameterCount: "7B",
    contextLength: 131072,
    license: "Apache 2.0",
    downloadUrl: "https://huggingface.co/Qwen/Qwen2.5-7B-Instruct",
    category: "text-generation",
    tags: ["open-source", "local-friendly", "efficient", "128k-context"],
    isFeatured: false,
    downloadCount: 7654321,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q6_K", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 8,
      minRam: 6,
    },
  },
  {
    slug: "phi-3.5-mini",
    name: "Phi 3.5 Mini",
    description: "Microsoft's 3.8B parameter model that punches far above its weight class.",
    longDescription: "Phi 3.5 Mini achieves performance comparable to models 10x its size. Trained on high-quality synthetic and web data, it excels at reasoning and coding.",
    architecture: "phi",
    parameterCount: "3.8B",
    contextLength: 131072,
    license: "MIT",
    downloadUrl: "https://huggingface.co/microsoft/Phi-3.5-mini-instruct",
    category: "text-generation",
    tags: ["open-source", "tiny-but-mighty", "efficient", "mit-license", "128k-context"],
    isFeatured: true,
    downloadCount: 5678901,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 4,
      minRam: 3,
    },
  },
];

async function seedProd() {
  // Safety confirmation
  if (process.env.CONFIRM_PROD_SEED !== "true") {
    console.log("⚠️  Production seed requires CONFIRM_PROD_SEED=true");
    console.log("   Usage: CONFIRM_PROD_SEED=true DATABASE_URL=<url> npx tsx scripts/seed-prod.ts");
    process.exit(1);
  }

  console.log("🌱 Seeding production database...");

  // Check if models already exist
  const existing = await db.select({ count: schema.model.id }).from(schema.model);
  if (existing.length > 0) {
    console.log(`⚠️  Database already has ${existing.length} models.`);
    console.log("   This script only inserts new models (upsert by slug).");
  }

  for (const m of PROD_MODELS) {
    await db
      .insert(schema.model)
      .values({
        slug: m.slug,
        name: m.name,
        description: m.description,
        longDescription: m.longDescription,
        architecture: m.architecture,
        parameterCount: m.parameterCount,
        contextLength: m.contextLength,
        license: m.license,
        downloadUrl: m.downloadUrl,
        downloadCount: m.downloadCount,
        category: m.category,
        tags: m.tags,
        status: "published",
        isFeatured: m.isFeatured,
        localExecution: m.localExecution,
        metaTitle: `${m.name} — LLM Trust`,
        metaDescription: m.description,
      })
      .onConflictDoNothing({ target: schema.model.slug });
    console.log(`  ✓ ${m.name}`);
  }

  console.log(`\n✅ Production seed complete! (${PROD_MODELS.length} models)`);
}

seedProd()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
