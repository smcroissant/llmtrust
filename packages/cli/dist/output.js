"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderComparisonTable = renderComparisonTable;
exports.renderModelDetail = renderModelDetail;
exports.renderModelsList = renderModelsList;
exports.renderCTA = renderCTA;
const cli_table3_1 = __importDefault(require("cli-table3"));
const chalk_1 = __importDefault(require("chalk"));
function formatCost(cost) {
    if (cost < 0.01)
        return `$${cost.toFixed(4)}`;
    if (cost < 1)
        return `$${cost.toFixed(2)}`;
    return `$${cost.toFixed(2)}`;
}
function formatContext(tokens) {
    if (tokens >= 1000000)
        return `${tokens / 1000000}M`;
    if (tokens >= 1000)
        return `${tokens / 1000}K`;
    return tokens.toString();
}
function formatLatency(ms) {
    if (ms >= 1000)
        return `${(ms / 1000).toFixed(1)}s`;
    return `${ms}ms`;
}
function renderComparisonTable(models) {
    const table = new cli_table3_1.default({
        head: [
            chalk_1.default.bold("Model"),
            chalk_1.default.bold("Provider"),
            chalk_1.default.bold("Input/1M"),
            chalk_1.default.bold("Output/1M"),
            chalk_1.default.bold("Context"),
            chalk_1.default.bold("Latency"),
        ],
        style: {
            head: [],
            border: [],
        },
        colWidths: [22, 12, 12, 12, 10, 10],
    });
    for (const model of models) {
        table.push([
            chalk_1.default.cyan(model.name),
            model.provider,
            chalk_1.default.green(formatCost(model.costPer1MInput)),
            chalk_1.default.yellow(formatCost(model.costPer1MOutput)),
            formatContext(model.contextWindow),
            formatLatency(model.latencyMs),
        ]);
    }
    console.log(table.toString());
}
function renderModelDetail(model) {
    console.log();
    console.log(chalk_1.default.bold.cyan(`  ${model.name}`));
    console.log(chalk_1.default.gray(`  ${model.provider} · Released ${model.releaseDate}`));
    console.log();
    const table = new cli_table3_1.default({
        style: { border: [] },
        colWidths: [20, 40],
    });
    table.push([chalk_1.default.bold("Model ID"), model.id], [chalk_1.default.bold("Provider"), model.provider], [chalk_1.default.bold("Input Cost"), `${formatCost(model.costPer1MInput)} per 1M tokens`], [chalk_1.default.bold("Output Cost"), `${formatCost(model.costPer1MOutput)} per 1M tokens`], [chalk_1.default.bold("Context Window"), `${formatContext(model.contextWindow)} tokens`], [chalk_1.default.bold("Max Output"), `${formatContext(model.maxOutput)} tokens`], [chalk_1.default.bold("Avg Latency"), formatLatency(model.latencyMs)], [chalk_1.default.bold("Capabilities"), model.capabilities.join(", ")], [chalk_1.default.bold("API Endpoint"), model.apiEndpoint]);
    console.log(table.toString());
    console.log();
}
function renderModelsList(models) {
    const table = new cli_table3_1.default({
        head: [
            chalk_1.default.bold("Model"),
            chalk_1.default.bold("Provider"),
            chalk_1.default.bold("Cost (in/out)"),
            chalk_1.default.bold("Context"),
        ],
        style: { head: [], border: [] },
        colWidths: [24, 12, 20, 10],
    });
    for (const model of models) {
        table.push([
            chalk_1.default.cyan(model.name),
            model.provider,
            `${formatCost(model.costPer1MInput)} / ${formatCost(model.costPer1MOutput)}`,
            formatContext(model.contextWindow),
        ]);
    }
    console.log(table.toString());
}
function renderCTA() {
    console.log();
    console.log(chalk_1.default.dim("  Want real-time trust scores from production data?"));
    console.log(chalk_1.default.cyan("  → Sign up free at ") + chalk_1.default.bold("llmtrust.com"));
    console.log();
    console.log(chalk_1.default.dim("  Powered by LLMTrust 🥐"));
    console.log();
}
//# sourceMappingURL=output.js.map