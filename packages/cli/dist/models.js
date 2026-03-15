"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllModels = getAllModels;
exports.findModel = findModel;
exports.getModelsByProvider = getModelsByProvider;
exports.getProviders = getProviders;
const models_json_1 = __importDefault(require("../data/models.json"));
function getAllModels() {
    return models_json_1.default;
}
function findModel(query) {
    const models = getAllModels();
    const lower = query.toLowerCase();
    return models.find((m) => m.id.toLowerCase() === lower ||
        m.name.toLowerCase() === lower ||
        m.id.toLowerCase().replace(/\s+/g, "-") === lower.replace(/\s+/g, "-"));
}
function getModelsByProvider(provider) {
    const models = getAllModels();
    return models.filter((m) => m.provider.toLowerCase() === provider.toLowerCase());
}
function getProviders() {
    const models = getAllModels();
    return [...new Set(models.map((m) => m.provider))].sort();
}
//# sourceMappingURL=models.js.map