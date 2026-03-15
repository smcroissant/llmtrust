#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { getAllModels, findModel, getModelsByProvider, getProviders } from "./models.js";
import { renderComparisonTable, renderModelDetail, renderModelsList, renderCTA } from "./output.js";

const program = new Command();

program
  .name("llmtrust")
  .description("Compare LLM models from your terminal — powered by LLMTrust")
  .version("0.1.0");

// ─── compare command ──────────────────────────────────────────

program
  .command("compare")
  .description("Compare LLM models side-by-side")
  .argument("<models...>", "Model IDs to compare (e.g., gpt-4o claude-3.5-sonnet gemini-1.5-pro)")
  .option("--no-telemetry", "Disable anonymous usage telemetry")
  .action((modelIds: string[], opts: { telemetry: boolean }) => {
    if (modelIds.length < 2) {
      console.error(chalk.red("\n  ✗ Need at least 2 models to compare.\n"));
      console.log(chalk.dim("  Usage: llmtrust compare gpt-4o claude-3.5-sonnet\n"));
      process.exit(1);
    }

    const models = modelIds.map((id) => findModel(id)).filter((m): m is NonNullable<typeof m> => Boolean(m));
    const found = models;
    const notFound = modelIds.filter((id) => !findModel(id));

    if (notFound.length > 0) {
      console.error(chalk.yellow(`\n  ⚠ Model not found: ${notFound.join(", ")}\n`));
      console.log(chalk.dim("  Run 'llmtrust models' to see available models.\n"));
    }

    if (found.length < 2) {
      console.error(chalk.red("\n  ✗ Need at least 2 valid models to compare.\n"));
      process.exit(1);
    }

    console.log(chalk.bold(`\n  LLM Model Comparison (${found.length} models)\n`));
    renderComparisonTable(found);
    renderCTA();
  });

// ─── models command ───────────────────────────────────────────

program
  .command("models")
  .description("List all supported models")
  .option("-p, --provider <provider>", "Filter by provider")
  .action((opts: { provider?: string }) => {
    let models = getAllModels();

    if (opts.provider) {
      models = getModelsByProvider(opts.provider);
      if (models.length === 0) {
        console.error(chalk.yellow(`\n  ⚠ No models found for provider: ${opts.provider}\n`));
        console.log(chalk.dim(`  Available providers: ${getProviders().join(", ")}\n`));
        process.exit(1);
      }
    }

    console.log(chalk.bold(`\n  All Supported Models (${models.length})\n`));
    renderModelsList(models);

    console.log(chalk.dim(`\n  Providers: ${getProviders().join(", ")}`));
    console.log(chalk.dim("  Use 'llmtrust info <model>' for detailed info.\n"));
  });

// ─── info command ─────────────────────────────────────────────

program
  .command("info")
  .description("Show detailed information about a model")
  .argument("<model>", "Model ID (e.g., gpt-4o)")
  .action((modelId: string) => {
    const model = findModel(modelId);

    if (!model) {
      console.error(chalk.yellow(`\n  ⚠ Model not found: ${modelId}\n`));
      console.log(chalk.dim("  Run 'llmtrust models' to see available models.\n"));
      process.exit(1);
    }

    renderModelDetail(model);
    renderCTA();
  });

// ─── providers command ────────────────────────────────────────

program
  .command("providers")
  .description("List all available providers")
  .action(() => {
    const providers = getProviders();
    console.log(chalk.bold(`\n  Providers (${providers.length})\n`));
    for (const p of providers) {
      const count = getModelsByProvider(p).length;
      console.log(`  ${chalk.cyan("●")} ${p} ${chalk.dim(`(${count} model${count > 1 ? "s" : ""})`)}`);
    }
    console.log();
  });

// ─── parse ────────────────────────────────────────────────────

program.parse();
