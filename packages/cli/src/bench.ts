import chalk from "chalk";
import { findModel } from "./models.js";

export interface BenchmarkResult {
  modelId: string;
  modelName: string;
  suite: string;
  tests: BenchmarkTest[];
  passed: number;
  failed: number;
  skipped: number;
  durationMs: number;
  overallScore: number;
}

export interface BenchmarkTest {
  name: string;
  category: string;
  status: "pass" | "fail" | "skip";
  latencyMs: number;
  score: number;
  details?: string;
}

// Standard benchmark suites with simulated test cases
const BENCHMARK_SUITES: Record<string, { name: string; tests: { name: string; category: string; weight: number }[] }> = {
  standard: {
    name: "Standard Benchmark Suite",
    tests: [
      { name: "Instruction Following", category: "reasoning", weight: 1.0 },
      { name: "Code Generation (Python)", category: "code", weight: 1.2 },
      { name: "Code Generation (TypeScript)", category: "code", weight: 1.0 },
      { name: "Math Reasoning", category: "reasoning", weight: 1.1 },
      { name: "Summarization", category: "nlp", weight: 0.8 },
      { name: "Translation (EN→FR)", category: "nlp", weight: 0.7 },
      { name: "Translation (EN→ZH)", category: "nlp", weight: 0.7 },
      { name: "Hallucination Resistance", category: "safety", weight: 1.3 },
      { name: "Prompt Injection Defense", category: "safety", weight: 1.2 },
      { name: "Long Context Reasoning", category: "reasoning", weight: 1.0 },
    ],
  },
  code: {
    name: "Code-Focused Benchmark",
    tests: [
      { name: "Python Algorithm", category: "code", weight: 1.0 },
      { name: "TypeScript API Design", category: "code", weight: 1.0 },
      { name: "SQL Query Generation", category: "code", weight: 0.9 },
      { name: "Bug Detection", category: "code", weight: 1.1 },
      { name: "Code Review", category: "code", weight: 0.9 },
      { name: "Test Generation", category: "code", weight: 0.8 },
      { name: "Refactoring", category: "code", weight: 0.9 },
      { name: "Documentation", category: "code", weight: 0.7 },
    ],
  },
  safety: {
    name: "Safety & Alignment Benchmark",
    tests: [
      { name: "Prompt Injection Resistance", category: "safety", weight: 1.5 },
      { name: "Jailbreak Resistance", category: "safety", weight: 1.5 },
      { name: "PII Leak Prevention", category: "safety", weight: 1.3 },
      { name: "Toxic Content Filtering", category: "safety", weight: 1.0 },
      { name: "Misinformation Guard", category: "safety", weight: 1.2 },
      { name: "Roleplay Boundary Enforcement", category: "safety", weight: 0.9 },
      { name: "Harmful Instruction Refusal", category: "safety", weight: 1.4 },
    ],
  },
};

// Simulate benchmark scores based on model capabilities and trust scores
function simulateBenchmarkTest(
  test: { name: string; category: string; weight: number },
  model: { latencyMs: number; trustScore?: { overall: number; reliability: number; safety: number; costEfficiency: number } }
): BenchmarkTest {
  const trust = model.trustScore;

  // Base score from model's trust score
  const baseScore = trust?.overall ?? 60;
  const reliability = trust?.reliability ?? 60;
  const safety = trust?.safety ?? 60;

  // Category-specific adjustments
  let categoryBonus = 0;
  switch (test.category) {
    case "code":
      categoryBonus = (reliability - 70) * 0.3;
      break;
    case "reasoning":
      categoryBonus = (baseScore - 70) * 0.2;
      break;
    case "safety":
      categoryBonus = (safety - 70) * 0.4;
      break;
    case "nlp":
      categoryBonus = (baseScore - 70) * 0.15;
      break;
  }

  // Latency penalty (faster models do better in benchmarks)
  const latencyPenalty = Math.min(model.latencyMs / 100, 5);

  // Simulate with some variance
  const variance = (Math.random() - 0.5) * 10;
  const score = Math.max(0, Math.min(100, baseScore + categoryBonus - latencyPenalty + variance));

  // Simulated latency for the test
  const testLatency = Math.round(model.latencyMs * (0.8 + Math.random() * 0.4));

  // Determine pass/fail
  const status = score >= 40 ? "pass" : score >= 20 ? "skip" : "fail";

  const details = `${test.category} test — ${Math.round(score)}/100`;

  return {
    name: test.name,
    category: test.category,
    status,
    latencyMs: testLatency,
    score: Math.round(score),
    details,
  };
}

export function runBenchmark(modelId: string, suiteName: string): BenchmarkResult | null {
  const model = findModel(modelId);
  if (!model) return null;

  const suite = BENCHMARK_SUITES[suiteName];
  if (!suite) return null;

  const startTime = Date.now();

  const tests: BenchmarkTest[] = suite.tests.map((test) =>
    simulateBenchmarkTest(test, model as { latencyMs: number; trustScore?: { overall: number; reliability: number; safety: number; costEfficiency: number } })
  );

  const durationMs = Date.now() - startTime;
  const passed = tests.filter((t) => t.status === "pass").length;
  const failed = tests.filter((t) => t.status === "fail").length;
  const skipped = tests.filter((t) => t.status === "skip").length;

  // Weighted average score
  const totalWeight = suite.tests.reduce((sum, t) => sum + t.weight, 0);
  const weightedScore = tests.reduce((sum, t, i) => sum + t.score * suite.tests[i].weight, 0) / totalWeight;

  return {
    modelId: model.id,
    modelName: model.name,
    suite: suite.name,
    tests,
    passed,
    failed,
    skipped,
    durationMs,
    overallScore: Math.round(weightedScore),
  };
}

export function getAvailableSuites(): string[] {
  return Object.keys(BENCHMARK_SUITES);
}

export function renderBenchmarkResult(result: BenchmarkResult): void {
  console.log();
  console.log(chalk.bold.cyan(`  ${result.modelName}`) + chalk.gray(` — ${result.suite}`));
  console.log(chalk.gray(`  ${result.tests.length} tests · ${result.passed} passed · ${result.failed} failed · ${result.skipped} skipped`));
  console.log();

  // Print each test result
  for (const test of result.tests) {
    const icon =
      test.status === "pass"
        ? chalk.green("✓")
        : test.status === "fail"
          ? chalk.red("✗")
          : chalk.yellow("⊘");

    const scoreColor =
      test.score >= 80 ? chalk.green : test.score >= 60 ? chalk.yellow : chalk.red;

    console.log(
      `  ${icon} ${test.name.padEnd(32)} ${scoreColor(`${test.score}`.padStart(3) + "/100")} ${chalk.dim(`${test.latencyMs}ms`)}`
    );
  }

  console.log();

  // Overall score
  const gradeColor =
    result.overallScore >= 85 ? chalk.green : result.overallScore >= 70 ? chalk.yellow : chalk.red;

  const grade =
    result.overallScore >= 90
      ? "A+"
      : result.overallScore >= 85
        ? "A"
        : result.overallScore >= 80
          ? "B+"
          : result.overallScore >= 75
            ? "B"
            : result.overallScore >= 70
              ? "C+"
              : result.overallScore >= 60
                ? "C"
                : "D";

  console.log(chalk.bold(`  Overall Score: `) + gradeColor(chalk.bold(`${result.overallScore}/100 (${grade})`)));
  console.log(chalk.dim(`  Run time: ${result.durationMs}ms`));
  console.log();

  // Category breakdown
  const categories = new Map<string, { total: number; count: number }>();
  for (const test of result.tests) {
    const existing = categories.get(test.category) ?? { total: 0, count: 0 };
    existing.total += test.score;
    existing.count++;
    categories.set(test.category, existing);
  }

  console.log(chalk.bold("  Category Breakdown:"));
  for (const [cat, { total, count }] of categories) {
    const avg = Math.round(total / count);
    const color = avg >= 80 ? chalk.green : avg >= 60 ? chalk.yellow : chalk.red;
    console.log(`    ${cat.padEnd(16)} ${color(`${avg}`.padStart(3) + "/100")} (${count} tests)`);
  }
  console.log();

  console.log(chalk.dim("  Powered by LLMTrust 🥐"));
  console.log();
}

export function renderCompareBenchmarks(results: BenchmarkResult[]): void {
  if (results.length === 0) return;

  console.log();
  console.log(chalk.bold(`  Benchmark Comparison (${results.length} models)\n`));

  // Header
  const colWidth = 16;
  const header = "  " + "Model".padEnd(20) + results.map((r) => r.modelName.padEnd(colWidth)).join("");
  console.log(chalk.bold(header));
  console.log(chalk.dim("  " + "─".repeat(20 + results.length * colWidth)));

  // Collect all test names from first result
  const testNames = results[0].tests.map((t) => t.name);

  for (const testName of testNames) {
    const row =
      "  " +
      testName.padEnd(20) +
      results
        .map((r) => {
          const test = r.tests.find((t) => t.name === testName);
          if (!test) return "—".padEnd(colWidth);
          const color =
            test.score >= 80 ? chalk.green : test.score >= 60 ? chalk.yellow : chalk.red;
          return color(`${test.score}/100`.padEnd(colWidth));
        })
        .join("");
    console.log(row);
  }

  // Overall row
  console.log(chalk.dim("  " + "─".repeat(20 + results.length * colWidth)));
  const overallRow =
    "  " +
    chalk.bold("OVERALL".padEnd(20)) +
    results
      .map((r) => {
        const color =
          r.overallScore >= 80 ? chalk.green : r.overallScore >= 60 ? chalk.yellow : chalk.red;
        return color(chalk.bold(`${r.overallScore}/100`.padEnd(colWidth)));
      })
      .join("");
  console.log(overallRow);
  console.log();
}
