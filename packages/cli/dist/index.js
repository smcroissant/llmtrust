#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const models_js_1 = require("./models.js");
const output_js_1 = require("./output.js");
const program = new commander_1.Command();
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
    .action((modelIds, opts) => {
    if (modelIds.length < 2) {
        console.error(chalk_1.default.red("\n  ✗ Need at least 2 models to compare.\n"));
        console.log(chalk_1.default.dim("  Usage: llmtrust compare gpt-4o claude-3.5-sonnet\n"));
        process.exit(1);
    }
    const models = modelIds.map((id) => (0, models_js_1.findModel)(id)).filter((m) => Boolean(m));
    const found = models;
    const notFound = modelIds.filter((id) => !(0, models_js_1.findModel)(id));
    if (notFound.length > 0) {
        console.error(chalk_1.default.yellow(`\n  ⚠ Model not found: ${notFound.join(", ")}\n`));
        console.log(chalk_1.default.dim("  Run 'llmtrust models' to see available models.\n"));
    }
    if (found.length < 2) {
        console.error(chalk_1.default.red("\n  ✗ Need at least 2 valid models to compare.\n"));
        process.exit(1);
    }
    console.log(chalk_1.default.bold(`\n  LLM Model Comparison (${found.length} models)\n`));
    (0, output_js_1.renderComparisonTable)(found);
    (0, output_js_1.renderCTA)();
});
// ─── models command ───────────────────────────────────────────
program
    .command("models")
    .description("List all supported models")
    .option("-p, --provider <provider>", "Filter by provider")
    .action((opts) => {
    let models = (0, models_js_1.getAllModels)();
    if (opts.provider) {
        models = (0, models_js_1.getModelsByProvider)(opts.provider);
        if (models.length === 0) {
            console.error(chalk_1.default.yellow(`\n  ⚠ No models found for provider: ${opts.provider}\n`));
            console.log(chalk_1.default.dim(`  Available providers: ${(0, models_js_1.getProviders)().join(", ")}\n`));
            process.exit(1);
        }
    }
    console.log(chalk_1.default.bold(`\n  All Supported Models (${models.length})\n`));
    (0, output_js_1.renderModelsList)(models);
    console.log(chalk_1.default.dim(`\n  Providers: ${(0, models_js_1.getProviders)().join(", ")}`));
    console.log(chalk_1.default.dim("  Use 'llmtrust info <model>' for detailed info.\n"));
});
// ─── info command ─────────────────────────────────────────────
program
    .command("info")
    .description("Show detailed information about a model")
    .argument("<model>", "Model ID (e.g., gpt-4o)")
    .action((modelId) => {
    const model = (0, models_js_1.findModel)(modelId);
    if (!model) {
        console.error(chalk_1.default.yellow(`\n  ⚠ Model not found: ${modelId}\n`));
        console.log(chalk_1.default.dim("  Run 'llmtrust models' to see available models.\n"));
        process.exit(1);
    }
    (0, output_js_1.renderModelDetail)(model);
    (0, output_js_1.renderCTA)();
});
// ─── providers command ────────────────────────────────────────
program
    .command("providers")
    .description("List all available providers")
    .action(() => {
    const providers = (0, models_js_1.getProviders)();
    console.log(chalk_1.default.bold(`\n  Providers (${providers.length})\n`));
    for (const p of providers) {
        const count = (0, models_js_1.getModelsByProvider)(p).length;
        console.log(`  ${chalk_1.default.cyan("●")} ${p} ${chalk_1.default.dim(`(${count} model${count > 1 ? "s" : ""})`)}`);
    }
    console.log();
});
// ─── parse ────────────────────────────────────────────────────
program.parse();
//# sourceMappingURL=index.js.map