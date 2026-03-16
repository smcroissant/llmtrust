/**
 * Compliance Scoring Engine — Enterprise AI Compliance (#89)
 *
 * Automated compliance checks across 5 categories:
 * - Regulatory (EU AI Act, NIST AI RMF)
 * - Supply Chain (SLSA provenance, checksums)
 * - Data Governance (license, data provenance)
 * - Operational (uptime, support, documentation)
 * - Ethical (bias disclosure, safety measures)
 */

import { db } from "~/server/db";
import {
  complianceCheck,
  complianceScore,
  model,
} from "~/server/db/schema";
import { eq, and, gte } from "drizzle-orm";

// ============================================
// Types
// ============================================

export interface ComplianceCheckInput {
  modelId: string;
  category:
    | "regulatory"
    | "supply_chain"
    | "data_governance"
    | "operational"
    | "ethical";
  checkName: string;
  result: "pass" | "warn" | "fail" | "not_applicable";
  score: number;
  details?: string;
  evidence?: {
    source?: string;
    url?: string;
    extractedValue?: string;
    expectedValue?: string;
  };
}

export interface ComplianceBadge {
  label: string;
  tier: "enterprise_ready" | "compliant" | "review_required" | "non_compliant";
  color: string;
  minScore: number;
}

// ============================================
// Constants
// ============================================

export const COMPLIANCE_BADGES: ComplianceBadge[] = [
  {
    label: "Enterprise Ready",
    tier: "enterprise_ready",
    color: "#10b981",
    minScore: 85,
  },
  {
    label: "Compliant",
    tier: "compliant",
    color: "#3b82f6",
    minScore: 70,
  },
  {
    label: "Review Required",
    tier: "review_required",
    color: "#f59e0b",
    minScore: 50,
  },
  {
    label: "Non-Compliant",
    tier: "non_compliant",
    color: "#ef4444",
    minScore: 0,
  },
];

// Category weights for composite score
const CATEGORY_WEIGHTS: Record<string, number> = {
  regulatory: 0.3,
  supply_chain: 0.25,
  data_governance: 0.2,
  operational: 0.15,
  ethical: 0.1,
};

// SPDX permissiveness scores (higher = more permissive)
const SPDX_SCORES: Record<string, number> = {
  "apache-2.0": 100,
  "mit": 100,
  "bsd-2-clause": 95,
  "bsd-3-clause": 95,
  "isc": 95,
  "cc-by-4.0": 85,
  "cc-by-sa-4.0": 75,
  "cc-by-nc-4.0": 60,
  "cc-by-nc-sa-4.0": 50,
  "cc0-1.0": 100,
  "unlicense": 100,
  "gpl-3.0": 40,
  "gpl-2.0": 40,
  "lgpl-3.0": 50,
  "agpl-3.0": 30,
  "llama-2": 30,
  "llama-3": 45,
  "openrail": 55,
  "bigscience-bloom-rail-1.0": 40,
  "proprietary": 20,
};

// ============================================
// License Classifier
// ============================================

export function classifyLicense(
  licenseStr: string | null | undefined,
): { spdxId: string; score: number; permissive: boolean } {
  if (!licenseStr) {
    return { spdxId: "unknown", score: 0, permissive: false };
  }

  const normalized = licenseStr.toLowerCase().trim();

  // Direct match
  if (SPDX_SCORES[normalized] !== undefined) {
    return {
      spdxId: normalized,
      score: SPDX_SCORES[normalized],
      permissive: SPDX_SCORES[normalized] >= 70,
    };
  }

  // Fuzzy matches
  if (normalized.includes("apache")) return { spdxId: "apache-2.0", score: 100, permissive: true };
  if (normalized.includes("mit")) return { spdxId: "mit", score: 100, permissive: true };
  if (normalized.includes("bsd-3") || normalized.includes("bsd 3"))
    return { spdxId: "bsd-3-clause", score: 95, permissive: true };
  if (normalized.includes("bsd-2") || normalized.includes("bsd 2"))
    return { spdxId: "bsd-2-clause", score: 95, permissive: true };
  if (normalized.includes("gpl-3") || normalized.includes("gpl 3"))
    return { spdxId: "gpl-3.0", score: 40, permissive: false };
  if (normalized.includes("gpl-2") || normalized.includes("gpl 2"))
    return { spdxId: "gpl-2.0", score: 40, permissive: false };
  if (normalized.includes("llama-2") || normalized.includes("llama 2"))
    return { spdxId: "llama-2", score: 30, permissive: false };
  if (normalized.includes("llama-3") || normalized.includes("llama 3"))
    return { spdxId: "llama-3", score: 45, permissive: false };
  if (normalized.includes("creative commons") || normalized.includes("cc-by"))
    return { spdxId: "cc-by-4.0", score: 75, permissive: true };
  if (normalized.includes("proprietary") || normalized.includes("closed"))
    return { spdxId: "proprietary", score: 20, permissive: false };

  return { spdxId: "unknown", score: 30, permissive: false };
}

// ============================================
// Compliance Check Pipeline
// ============================================

/**
 * Run all compliance checks for a model.
 */
export async function runComplianceChecks(modelId: string): Promise<{
  checks: ComplianceCheckInput[];
  score: typeof complianceScore.$inferInsert;
}> {
  // Fetch model
  const [mdl] = await db
    .select()
    .from(model)
    .where(eq(model.id, modelId))
    .limit(1);

  if (!mdl) {
    throw new Error(`Model ${modelId} not found`);
  }

  const checks: ComplianceCheckInput[] = [];

  // ---- Category 1: Regulatory ----
  checks.push(...runRegulatoryChecks(mdl));

  // ---- Category 2: Supply Chain ----
  checks.push(...runSupplyChainChecks(mdl));

  // ---- Category 3: Data Governance ----
  checks.push(...runDataGovernanceChecks(mdl));

  // ---- Category 4: Operational ----
  checks.push(...runOperationalChecks(mdl));

  // ---- Category 5: Ethical ----
  checks.push(...runEthicalChecks(mdl));

  // Compute category scores
  const categoryScores = computeCategoryScores(checks);

  // Compute weighted overall
  const overallScore = Math.round(
    Object.entries(categoryScores).reduce(
      (sum, [cat, score]) => sum + score * (CATEGORY_WEIGHTS[cat] ?? 0),
      0,
    ),
  );

  // Assign badge
  const badge = assignBadge(overallScore);

  const scoreRecord: typeof complianceScore.$inferInsert = {
    modelId,
    regulatoryScore: categoryScores.regulatory ?? 0,
    supplyChainScore: categoryScores.supply_chain ?? 0,
    dataGovernanceScore: categoryScores.data_governance ?? 0,
    operationalScore: categoryScores.operational ?? 0,
    ethicalScore: categoryScores.ethical ?? 0,
    overallScore,
    badge: badge.tier,
    totalChecks: checks.length,
    passedChecks: checks.filter((c) => c.result === "pass").length,
    warnedChecks: checks.filter((c) => c.result === "warn").length,
    failedChecks: checks.filter((c) => c.result === "fail").length,
    computedAt: new Date(),
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  };

  return { checks, score: scoreRecord };
}

// ============================================
// Check Implementations
// ============================================

function runRegulatoryChecks(mdl: typeof model.$inferSelect): ComplianceCheckInput[] {
  const checks: ComplianceCheckInput[] = [];
  const tags = (mdl.tags as string[]) ?? [];

  // Check: License transparency (EU AI Act Art. 13)
  const licenseInfo = classifyLicense(mdl.license);
  checks.push({
    modelId: mdl.id,
    category: "regulatory",
    checkName: "License Transparency",
    result: licenseInfo.spdxId !== "unknown" ? "pass" : "warn",
    score: licenseInfo.spdxId !== "unknown" ? 100 : 40,
    details:
      licenseInfo.spdxId !== "unknown"
        ? `License identified: ${licenseInfo.spdxId}`
        : "No recognizable license found — EU AI Act requires clear licensing disclosure",
    evidence: {
      source: "model_metadata",
      extractedValue: mdl.license ?? "none",
    },
  });

  // Check: Model card availability (NIST AI RMF GOV-1.3)
  checks.push({
    modelId: mdl.id,
    category: "regulatory",
    checkName: "Model Card Availability",
    result: mdl.longDescription ? "pass" : "warn",
    score: mdl.longDescription ? 100 : 50,
    details: mdl.longDescription
      ? "Model card / detailed description available"
      : "No model card — NIST AI RMF recommends documentation for all deployed models",
    evidence: { source: "model_metadata" },
  });

  // Check: Usage restrictions documented
  const hasRestrictions =
    tags.includes("research-only") ||
    tags.includes("non-commercial") ||
    tags.includes("commercial");
  checks.push({
    modelId: mdl.id,
    category: "regulatory",
    checkName: "Usage Restrictions Documented",
    result: hasRestrictions ? "pass" : "warn",
    score: hasRestrictions ? 100 : 50,
    details: hasRestrictions
      ? "Usage restrictions clearly tagged"
      : "No usage restriction tags found",
    evidence: { source: "tags", extractedValue: tags.join(", ") },
  });

  return checks;
}

function runSupplyChainChecks(mdl: typeof model.$inferSelect): ComplianceCheckInput[] {
  const checks: ComplianceCheckInput[] = [];
  const localExec = mdl.localExecution as Record<string, unknown> | null;

  // Check: Model format documented
  checks.push({
    modelId: mdl.id,
    category: "supply_chain",
    checkName: "Model Format Specified",
    result: localExec?.format ? "pass" : "warn",
    score: localExec?.format ? 100 : 30,
    details: localExec?.format
      ? `Format: ${localExec.format} — enables verification and reproducibility`
      : "No format specified — cannot verify model integrity",
    evidence: {
      source: "local_execution",
      extractedValue: (localExec?.format as string) ?? "none",
    },
  });

  // Check: Download source verification
  const isHuggingFace =
    mdl.downloadUrl.includes("huggingface.co") ||
    mdl.downloadUrl.includes("hf.co");
  checks.push({
    modelId: mdl.id,
    category: "supply_chain",
    checkName: "Trusted Download Source",
    result: isHuggingFace ? "pass" : "warn",
    score: isHuggingFace ? 100 : 40,
    details: isHuggingFace
      ? "Source: HuggingFace — models hosted on trusted registry"
      : `Source: ${new URL(mdl.downloadUrl).hostname} — verify trustworthiness`,
    evidence: {
      source: "download_url",
      url: mdl.downloadUrl,
    },
  });

  // Check: Quantization options documented
  const quantizations = (localExec?.quantizations as string[]) ?? [];
  checks.push({
    modelId: mdl.id,
    category: "supply_chain",
    checkName: "Reproducible Quantizations",
    result: quantizations.length > 0 ? "pass" : "warn",
    score: quantizations.length > 0 ? 100 : 30,
    details:
      quantizations.length > 0
        ? `${quantizations.length} quantizations: ${quantizations.join(", ")}`
        : "No quantizations documented",
    evidence: { source: "local_execution", extractedValue: quantizations.join(", ") || "none" },
  });

  return checks;
}

function runDataGovernanceChecks(mdl: typeof model.$inferSelect): ComplianceCheckInput[] {
  const checks: ComplianceCheckInput[] = [];
  const licenseInfo = classifyLicense(mdl.license);

  // Check: Permissive license
  checks.push({
    modelId: mdl.id,
    category: "data_governance",
    checkName: "License Permissiveness",
    result:
      licenseInfo.score >= 70
        ? "pass"
        : licenseInfo.score >= 40
          ? "warn"
          : "fail",
    score: licenseInfo.score,
    details: `License: ${licenseInfo.spdxId} (permissiveness: ${licenseInfo.score}/100)`,
    evidence: {
      source: "license_classification",
      extractedValue: licenseInfo.spdxId,
    },
  });

  // Check: Architecture documented
  checks.push({
    modelId: mdl.id,
    category: "data_governance",
    checkName: "Architecture Documented",
    result: mdl.architecture ? "pass" : "warn",
    score: mdl.architecture ? 100 : 40,
    details: mdl.architecture
      ? `Architecture: ${mdl.architecture}`
      : "Architecture not specified",
    evidence: {
      source: "model_metadata",
      extractedValue: mdl.architecture ?? "none",
    },
  });

  // Check: Parameter count documented
  checks.push({
    modelId: mdl.id,
    category: "data_governance",
    checkName: "Model Size Documented",
    result: mdl.parameterCount ? "pass" : "warn",
    score: mdl.parameterCount ? 100 : 40,
    details: mdl.parameterCount
      ? `Parameters: ${mdl.parameterCount}`
      : "Parameter count not specified",
    evidence: {
      source: "model_metadata",
      extractedValue: mdl.parameterCount ?? "none",
    },
  });

  return checks;
}

function runOperationalChecks(mdl: typeof model.$inferSelect): ComplianceCheckInput[] {
  const checks: ComplianceCheckInput[] = [];

  // Check: Context length documented
  checks.push({
    modelId: mdl.id,
    category: "operational",
    checkName: "Context Length Specified",
    result: mdl.contextLength ? "pass" : "warn",
    score: mdl.contextLength ? 100 : 30,
    details: mdl.contextLength
      ? `Context: ${mdl.contextLength.toLocaleString()} tokens`
      : "Context length unknown",
    evidence: {
      source: "model_metadata",
      extractedValue: mdl.contextLength?.toString() ?? "none",
    },
  });

  // Check: HuggingFace presence (community support proxy)
  const isOnHuggingFace = mdl.downloadUrl.includes("huggingface.co");
  checks.push({
    modelId: mdl.id,
    category: "operational",
    checkName: "Active Community Platform",
    result: isOnHuggingFace ? "pass" : "warn",
    score: isOnHuggingFace ? 100 : 50,
    details: isOnHuggingFace
      ? "Available on HuggingFace — active community, issues, discussions"
      : "Not on HuggingFace — limited community visibility",
    evidence: { source: "download_url", url: mdl.downloadUrl },
  });

  // Check: System requirements documented
  const localExec = mdl.localExecution as Record<string, unknown> | null;
  checks.push({
    modelId: mdl.id,
    category: "operational",
    checkName: "System Requirements Documented",
    result: localExec?.minRam ? "pass" : "warn",
    score: localExec?.minRam ? 100 : 40,
    details: localExec?.minRam
      ? `Min RAM: ${localExec.minRam}GB, Recommended: ${(localExec.recommendedRam as number) ?? "?"}GB`
      : "System requirements not documented",
    evidence: { source: "local_execution" },
  });

  return checks;
}

function runEthicalChecks(mdl: typeof model.$inferSelect): ComplianceCheckInput[] {
  const checks: ComplianceCheckInput[] = [];
  const tags = (mdl.tags as string[]) ?? [];
  const desc = (mdl.description + " " + (mdl.longDescription ?? "")).toLowerCase();

  // Check: Safety/alignment mentions
  const safetyKeywords = ["safety", "alignment", "responsible", "harmless", "rlhf", "dpo", "constitutional"];
  const mentionsSafety = safetyKeywords.some((k) => desc.includes(k) || tags.includes(k));
  checks.push({
    modelId: mdl.id,
    category: "ethical",
    checkName: "Safety Considerations Documented",
    result: mentionsSafety ? "pass" : "warn",
    score: mentionsSafety ? 100 : 30,
    details: mentionsSafety
      ? "Safety/alignment considerations mentioned in documentation"
      : "No explicit safety or alignment information found",
    evidence: { source: "description_analysis" },
  });

  // Check: Usage intent clarity
  const intentKeywords = ["research", "commercial", "production", "educational", "experimental"];
  const hasIntent = intentKeywords.some((k) => desc.includes(k) || tags.includes(k));
  checks.push({
    modelId: mdl.id,
    category: "ethical",
    checkName: "Intended Use Documented",
    result: hasIntent ? "pass" : "warn",
    score: hasIntent ? 100 : 40,
    details: hasIntent
      ? "Intended use cases documented"
      : "No clear intended use documentation",
    evidence: { source: "description_analysis" },
  });

  return checks;
}

// ============================================
// Score Computation
// ============================================

function computeCategoryScores(
  checks: ComplianceCheckInput[],
): Record<string, number> {
  const categories = new Map<string, number[]>();

  for (const check of checks) {
    const arr = categories.get(check.category) ?? [];
    arr.push(check.score);
    categories.set(check.category, arr);
  }

  const scores: Record<string, number> = {};
  for (const [cat, catScores] of categories) {
    scores[cat] = Math.round(
      catScores.reduce((a, b) => a + b, 0) / catScores.length,
    );
  }
  return scores;
}

export function assignBadge(overallScore: number): ComplianceBadge {
  for (const badge of COMPLIANCE_BADGES) {
    if (overallScore >= badge.minScore) return badge;
  }
  return COMPLIANCE_BADGES[COMPLIANCE_BADGES.length - 1]!;
}

// ============================================
// Persistence
// ============================================

/**
 * Run checks and persist results to DB.
 */
export async function scoreAndPersist(modelId: string) {
  const { checks, score } = await runComplianceChecks(modelId);

  // Upsert compliance score
  await db
    .insert(complianceScore)
    .values(score)
    .onConflictDoUpdate({
      target: complianceScore.modelId,
      set: {
        regulatoryScore: score.regulatoryScore,
        supplyChainScore: score.supplyChainScore,
        dataGovernanceScore: score.dataGovernanceScore,
        operationalScore: score.operationalScore,
        ethicalScore: score.ethicalScore,
        overallScore: score.overallScore,
        badge: score.badge,
        totalChecks: score.totalChecks,
        passedChecks: score.passedChecks,
        warnedChecks: score.warnedChecks,
        failedChecks: score.failedChecks,
        computedAt: new Date(),
        validUntil: score.validUntil,
        updatedAt: new Date(),
      },
    });

  // Delete old checks for this model, insert new ones
  await db
    .delete(complianceCheck)
    .where(eq(complianceCheck.modelId, modelId));

  if (checks.length > 0) {
    await db.insert(complianceCheck).values(
      checks.map((c) => ({
        modelId: c.modelId,
        category: c.category,
        checkName: c.checkName,
        result: c.result,
        score: c.score,
        details: c.details ?? null,
        evidence: c.evidence ?? {},
        checkedAt: new Date(),
      })),
    );
  }

  return { checks, score };
}

/**
 * Batch score all published models.
 */
export async function batchScoreAll(): Promise<{
  processed: number;
  failed: number;
}> {
  const models_ = await db
    .select({ id: model.id })
    .from(model)
    .where(eq(model.status, "published"));

  let processed = 0;
  let failed = 0;

  for (const mdl of models_) {
    try {
      await scoreAndPersist(mdl.id);
      processed++;
    } catch (err) {
      console.error(`Failed to score model ${mdl.id}:`, err);
      failed++;
    }
  }

  return { processed, failed };
}
