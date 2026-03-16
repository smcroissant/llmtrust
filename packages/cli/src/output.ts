import Table from "cli-table3";
import chalk from "chalk";
import { Model, TrustScore } from "./types.js";

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

function trustScoreColor(score: number): typeof chalk.green {
  if (score >= 85) return chalk.green;
  if (score >= 70) return chalk.yellow;
  if (score >= 50) return chalk.hex("#FFA500");
  return chalk.red;
}

function trustScoreBar(score: number, width: number = 10): string {
  const filled = Math.round((score / 100) * width);
  const empty = width - filled;
  const color = trustScoreColor(score);
  return color("█".repeat(filled)) + chalk.dim("░".repeat(empty));
}

function trustScoreEmoji(score: number): string {
  if (score >= 90) return "🟢";
  if (score >= 75) return "🟡";
  if (score >= 60) return "🟠";
  return "🔴";
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

export function renderSearchResults(models: readonly Model[], query: string): void {
  console.log();
  console.log(chalk.bold(`  Search results for "${query}" (${models.length} found)\n`));

  const table = new Table({
    head: [
      chalk.bold("Model"),
      chalk.bold("Provider"),
      chalk.bold("Trust"),
      chalk.bold("Cost (in/out)"),
      chalk.bold("Context"),
      chalk.bold("Latency"),
    ],
    style: { head: [], border: [] },
    colWidths: [20, 12, 16, 20, 10, 10],
  });

  for (const model of models) {
    const trust = model.trustScore;
    const trustStr = trust
      ? `${trustScoreEmoji(trust.overall)} ${trust.overall}/100`
      : chalk.dim("N/A");
    table.push([
      chalk.cyan(model.name),
      model.provider,
      trustStr,
      `${formatCost(model.costPer1MInput)} / ${formatCost(model.costPer1MOutput)}`,
      formatContext(model.contextWindow),
      formatLatency(model.latencyMs),
    ]);
  }

  console.log(table.toString());
}

export function renderTrustScore(model: Model): void {
  const score = model.trustScore;
  console.log();
  console.log(chalk.bold.cyan(`  ${model.name}`) + chalk.gray(` — Trust Score`));
  console.log(chalk.gray(`  ${model.provider} · Last updated ${score?.lastUpdated ?? "N/A"}`));
  console.log();

  if (!score) {
    console.log(chalk.yellow("  No trust score data available for this model."));
    console.log(chalk.dim("  Trust scores are generated from production telemetry data."));
    console.log();
    renderCTA();
    return;
  }

  const table = new Table({
    style: { border: [] },
    colWidths: [22, 14, 30],
  });

  const metrics: { label: string; key: keyof TrustScore }[] = [
    { label: "Overall Score", key: "overall" },
    { label: "Reliability", key: "reliability" },
    { label: "Latency Score", key: "latency" },
    { label: "Cost Efficiency", key: "costEfficiency" },
    { label: "Safety", key: "safety" },
  ];

  for (const { label, key } of metrics) {
    const value = score[key];
    if (typeof value === "number") {
      table.push([
        chalk.bold(label),
        trustScoreColor(value)(`${value}/100`),
        trustScoreBar(value, 20),
      ]);
    }
  }

  console.log(table.toString());

  // Overall grade
  const grade =
    score.overall >= 90 ? "A+" : score.overall >= 85 ? "A" : score.overall >= 80 ? "B+" :
    score.overall >= 75 ? "B" : score.overall >= 70 ? "C+" : score.overall >= 60 ? "C" : "D";

  console.log();
  console.log(
    chalk.bold("  Overall Grade: ") +
    trustScoreColor(score.overall)(chalk.bold(grade)) +
    chalk.dim(` (${score.overall}/100)`)
  );
  console.log();
  renderCTA();
}

export function renderScoreBoard(models: readonly Model[]): void {
  console.log();
  console.log(chalk.bold(`  Trust Score Leaderboard (${models.length} models)\n`));

  const table = new Table({
    head: [
      chalk.bold("#"),
      chalk.bold("Model"),
      chalk.bold("Provider"),
      chalk.bold("Trust Score"),
      chalk.bold("Reliability"),
      chalk.bold("Latency"),
      chalk.bold("Cost"),
      chalk.bold("Safety"),
    ],
    style: { head: [], border: [] },
    colWidths: [4, 18, 12, 14, 12, 10, 10, 10],
  });

  models.forEach((model, i) => {
    const score = model.trustScore;
    const rank = i < 3 ? ["🥇", "🥈", "🥉"][i] : `${i + 1}`;
    table.push([
      rank,
      chalk.cyan(model.name),
      model.provider,
      score ? trustScoreColor(score.overall)(`${score.overall}`) : chalk.dim("—"),
      score ? trustScoreColor(score.reliability)(`${score.reliability}`) : chalk.dim("—"),
      score ? trustScoreColor(score.latency)(`${score.latency}`) : chalk.dim("—"),
      score ? trustScoreColor(score.costEfficiency)(`${score.costEfficiency}`) : chalk.dim("—"),
      score ? trustScoreColor(score.safety)(`${score.safety}`) : chalk.dim("—"),
    ]);
  });

  console.log(table.toString());
  console.log();
  renderCTA();
}
