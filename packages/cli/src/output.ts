import Table from "cli-table3";
import chalk from "chalk";
import { Model } from "./types.js";

function formatCost(cost: number): string {
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  if (cost < 1) return `$${cost.toFixed(2)}`;
  return `$${cost.toFixed(2)}`;
}

function formatContext(tokens: number): string {
  if (tokens >= 1000000) return `${tokens / 1000000}M`;
  if (tokens >= 1000) return `${tokens / 1000}K`;
  return tokens.toString();
}

function formatLatency(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${ms}ms`;
}

export function renderComparisonTable(models: readonly Model[]): void {
  const table = new Table({
    head: [
      chalk.bold("Model"),
      chalk.bold("Provider"),
      chalk.bold("Input/1M"),
      chalk.bold("Output/1M"),
      chalk.bold("Context"),
      chalk.bold("Latency"),
    ],
    style: {
      head: [],
      border: [],
    },
    colWidths: [22, 12, 12, 12, 10, 10],
  });

  for (const model of models) {
    table.push([
      chalk.cyan(model.name),
      model.provider,
      chalk.green(formatCost(model.costPer1MInput)),
      chalk.yellow(formatCost(model.costPer1MOutput)),
      formatContext(model.contextWindow),
      formatLatency(model.latencyMs),
    ]);
  }

  console.log(table.toString());
}

export function renderModelDetail(model: Model): void {
  console.log();
  console.log(chalk.bold.cyan(`  ${model.name}`));
  console.log(chalk.gray(`  ${model.provider} · Released ${model.releaseDate}`));
  console.log();

  const table = new Table({
    style: { border: [] },
    colWidths: [20, 40],
  });

  table.push(
    [chalk.bold("Model ID"), model.id],
    [chalk.bold("Provider"), model.provider],
    [chalk.bold("Input Cost"), `${formatCost(model.costPer1MInput)} per 1M tokens`],
    [chalk.bold("Output Cost"), `${formatCost(model.costPer1MOutput)} per 1M tokens`],
    [chalk.bold("Context Window"), `${formatContext(model.contextWindow)} tokens`],
    [chalk.bold("Max Output"), `${formatContext(model.maxOutput)} tokens`],
    [chalk.bold("Avg Latency"), formatLatency(model.latencyMs)],
    [chalk.bold("Capabilities"), model.capabilities.join(", ")],
    [chalk.bold("API Endpoint"), model.apiEndpoint]
  );

  console.log(table.toString());
  console.log();
}

export function renderModelsList(models: Model[]): void {
  const table = new Table({
    head: [
      chalk.bold("Model"),
      chalk.bold("Provider"),
      chalk.bold("Cost (in/out)"),
      chalk.bold("Context"),
    ],
    style: { head: [], border: [] },
    colWidths: [24, 12, 20, 10],
  });

  for (const model of models) {
    table.push([
      chalk.cyan(model.name),
      model.provider,
      `${formatCost(model.costPer1MInput)} / ${formatCost(model.costPer1MOutput)}`,
      formatContext(model.contextWindow),
    ]);
  }

  console.log(table.toString());
}

export function renderCTA(): void {
  console.log();
  console.log(
    chalk.dim("  Want real-time trust scores from production data?")
  );
  console.log(
    chalk.cyan("  → Sign up free at ") + chalk.bold("llmtrust.com")
  );
  console.log();
  console.log(chalk.dim("  Powered by LLMTrust 🥐"));
  console.log();
}
