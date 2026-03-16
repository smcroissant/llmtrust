#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { getAllModels, findModel, getModelsByProvider, getProviders, searchModels, getModelsByTrustScore, SearchFilter } from "./models.js";
import { renderComparisonTable, renderModelDetail, renderModelsList, renderCTA, renderSearchResults, renderTrustScore, renderScoreBoard } from "./output.js";
import { runBenchmark, renderBenchmarkResult, renderCompareBenchmarks, getAvailableSuites } from "./bench.js";
import { renderAuthStatus, login, logout } from "./auth.js";
import { generateCompletions } from "./completions.js";

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
  .action((modelIds: string[], _opts: { telemetry: boolean }) => {
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

// ─── search command ───────────────────────────────────────────

program
  .command("search")
  .description("Search for models by name, provider, or capability")
  .argument("<query>", "Search query (e.g., 'code generation', 'vision', 'cheap')")
  .option("--max-latency <ms>", "Maximum latency in ms", parseFloat)
  .option("--max-cost <dollars>", "Maximum cost per 1M tokens (input & output)", parseFloat)
  .option("--min-context <tokens>", "Minimum context window", parseInt)
  .option("--capability <cap>", "Filter by capability (text, vision, function-calling, etc.)")
  .option("--provider <name>", "Filter by provider")
  .option("--min-trust <score>", "Minimum trust score (0-100)", parseInt)
  .option("--no-telemetry", "Disable anonymous usage telemetry")
  .action((query: string, opts: {
    maxLatency?: number;
    maxCost?: number;
    minContext?: number;
    capability?: string;
    provider?: string;
    minTrust?: number;
    telemetry: boolean;
  }) => {
    const filters: SearchFilter = {};
    if (opts.maxLatency !== undefined) filters.maxLatency = opts.maxLatency;
    if (opts.maxCost !== undefined) filters.maxCost = opts.maxCost;
    if (opts.minContext !== undefined) filters.minContext = opts.minContext;
    if (opts.capability) filters.capability = opts.capability;
    if (opts.provider) filters.provider = opts.provider;
    if (opts.minTrust !== undefined) filters.minTrustScore = opts.minTrust;

    const results = searchModels(query, Object.keys(filters).length > 0 ? filters : undefined);

    if (results.length === 0) {
      console.log(chalk.yellow(`\n  ⚠ No models found for "${query}"\n`));
      console.log(chalk.dim("  Try a different search term or remove some filters.\n"));
      console.log(chalk.dim("  Run 'llmtrust models' to see all available models.\n"));
      process.exit(1);
    }

    renderSearchResults(results, query);
  });

// ─── score command ────────────────────────────────────────────

program
  .command("score")
  .description("View trust scores for models")
  .argument("[model]", "Model ID (omit to see leaderboard)")
  .option("--all", "Show all models on the leaderboard")
  .option("--sort <order>", "Sort order: desc (default) or asc", "desc")
  .option("--no-telemetry", "Disable anonymous usage telemetry")
  .action((modelId: string | undefined, opts: { all: boolean; sort: string; telemetry: boolean }) => {
    if (modelId) {
      // Show detailed score for a specific model
      const model = findModel(modelId);
      if (!model) {
        console.error(chalk.yellow(`\n  ⚠ Model not found: ${modelId}\n`));
        console.log(chalk.dim("  Run 'llmtrust models' to see available models.\n"));
        process.exit(1);
      }
      renderTrustScore(model);
    } else {
      // Show leaderboard
      const sortOrder = opts.sort === "asc" ? "asc" : "desc";
      const models = getModelsByTrustScore(sortOrder);
      renderScoreBoard(models);
    }
  });

// ─── bench command ──────────────────────────────────────────

program
  .command("bench")
  .description("Run benchmarks on models")
  .argument("<models...>", "Model IDs to benchmark (e.g., gpt-4o claude-3.5-sonnet)")
  .option("-s, --suite <suite>", "Benchmark suite to run (standard, code, safety)", "standard")
  .option("--compare", "Compare benchmarks side-by-side (when multiple models)")
  .option("--no-telemetry", "Disable anonymous usage telemetry")
  .action((modelIds: string[], opts: { suite: string; compare?: boolean; telemetry: boolean }) => {
    const availableSuites = getAvailableSuites();
    if (!availableSuites.includes(opts.suite)) {
      console.error(chalk.red(`\n  ✗ Unknown suite: ${opts.suite}`));
      console.log(chalk.dim(`  Available suites: ${availableSuites.join(", ")}\n`));
      process.exit(1);
    }

    if (modelIds.length < 1) {
      console.error(chalk.red("\n  ✗ Need at least 1 model to benchmark.\n"));
      console.log(chalk.dim("  Usage: llmtrust bench gpt-4o --suite standard\n"));
      process.exit(1);
    }

    const results = modelIds
      .map((id) => runBenchmark(id, opts.suite))
      .filter((r): r is NonNullable<typeof r> => r !== null);

    const notFound = modelIds.filter((id) => !findModel(id));
    if (notFound.length > 0) {
      console.error(chalk.yellow(`\n  ⚠ Model not found: ${notFound.join(", ")}`));
      console.log(chalk.dim("  Run 'llmtrust models' to see available models.\n"));
    }

    if (results.length === 0) {
      console.error(chalk.red("\n  ✗ No valid models to benchmark.\n"));
      process.exit(1);
    }

    if (opts.compare && results.length > 1) {
      renderCompareBenchmarks(results);
    } else {
      for (const result of results) {
        renderBenchmarkResult(result);
      }
    }
  });

// ─── auth command ───────────────────────────────────────────

const authCmd = program
  .command("auth")
  .description("Manage authentication");

authCmd
  .command("status")
  .description("Show authentication status")
  .action(() => {
    renderAuthStatus();
  });

authCmd
  .command("login")
  .description("Authenticate with an API key")
  .requiredOption("--api-key <key>", "Your LLMTrust API key")
  .option("--email <email>", "Your email (optional)")
  .action((opts: { apiKey: string; email?: string }) => {
    login(opts.apiKey, opts.email);
  });

authCmd
  .command("logout")
  .description("Log out and clear stored credentials")
  .action(() => {
    logout();
  });

// ─── completions command ─────────────────────────────────────

program
  .command("completions")
  .description("Generate shell completions")
  .argument("<shell>", "Shell type (bash, zsh, fish)")
  .option("-o, --output <path>", "Output directory for completion file")
  .action((shell: string, opts: { output?: string }) => {
    generateCompletions(shell, opts.output);
  });

// ─── parse ────────────────────────────────────────────────────

program.parse();

// Ensure clean exit in CI environments where open handles may prevent natural exit.
// This is a no-op for commands that already exit cleanly, but prevents flaky CI failures.
if (!process.exitCode) {
  setImmediate(() => process.exit(0));
}
