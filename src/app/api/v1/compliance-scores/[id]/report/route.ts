/**
 * GET /v1/compliance-scores/{id}/report?format=pdf
 *
 * Generates a downloadable PDF compliance report for a model.
 */

import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { complianceCheck, complianceScore, complianceReport, model } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { assignBadge } from "~/server/api/services/compliance";
import PDFDocument from "pdfkit";
import type { Buffer } from "node:buffer";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: modelId } = await params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") ?? "pdf";

    // Fetch model
    const [mdl] = await db
      .select()
      .from(model)
      .where(eq(model.id, modelId))
      .limit(1);

    if (!mdl) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    // Fetch compliance score
    const [score] = await db
      .select()
      .from(complianceScore)
      .where(eq(complianceScore.modelId, modelId))
      .limit(1);

    if (!score) {
      return NextResponse.json(
        { error: "No compliance score available. Run scoring first." },
        { status: 404 },
      );
    }

    // Fetch individual checks
    const checks = await db
      .select()
      .from(complianceCheck)
      .where(eq(complianceCheck.modelId, modelId))
      .orderBy(desc(complianceCheck.checkedAt));

    const badge = assignBadge(score.overallScore);

    // JSON format
    if (format === "json") {
      return NextResponse.json({
        model: { id: mdl.id, slug: mdl.slug, name: mdl.name },
        score,
        badge,
        checks,
        generatedAt: new Date().toISOString(),
      });
    }

    // PDF format
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));

    // ---- PDF Content ----

    // Header
    doc.fontSize(24).font("Helvetica-Bold").text("Compliance Report", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(12).font("Helvetica").fillColor("#666666").text(
      `LLMTrust — Enterprise AI Compliance Assessment`,
      { align: "center" },
    );
    doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}`, {
      align: "center",
    });
    doc.moveDown(2);

    // Model info
    doc.fontSize(16).font("Helvetica-Bold").fillColor("#000000").text("Model Information");
    doc.moveDown(0.5);
    doc.fontSize(11).font("Helvetica");
    doc.text(`Name: ${mdl.name}`);
    doc.text(`Slug: ${mdl.slug}`);
    doc.text(`Architecture: ${mdl.architecture ?? "Not specified"}`);
    doc.text(`Parameters: ${mdl.parameterCount ?? "Not specified"}`);
    doc.text(`License: ${mdl.license ?? "Not specified"}`);
    doc.moveDown(1.5);

    // Executive Summary
    doc.fontSize(16).font("Helvetica-Bold").text("Executive Summary");
    doc.moveDown(0.5);

    // Badge
    doc.fontSize(12).font("Helvetica-Bold").fillColor(badge.color);
    doc.text(`Compliance Status: ${badge.label}`);
    doc.fillColor("#000000").font("Helvetica");
    doc.moveDown(0.5);

    doc.fontSize(11).text(`Overall Score: ${score.overallScore}/100`);
    doc.text(`Total Checks: ${score.totalChecks}`);
    doc.text(`Passed: ${score.passedChecks} | Warnings: ${score.warnedChecks} | Failed: ${score.failedChecks}`);
    doc.moveDown(1.5);

    // Category Breakdown
    doc.fontSize(16).font("Helvetica-Bold").text("Category Breakdown");
    doc.moveDown(0.5);

    const categories = [
      { name: "Regulatory (EU AI Act, NIST AI RMF)", score: score.regulatoryScore },
      { name: "Supply Chain (SLSA, Provenance)", score: score.supplyChainScore },
      { name: "Data Governance (License, Provenance)", score: score.dataGovernanceScore },
      { name: "Operational (Uptime, Documentation)", score: score.operationalScore },
      { name: "Ethical (Safety, Bias)", score: score.ethicalScore },
    ];

    for (const cat of categories) {
      doc.fontSize(11).font("Helvetica-Bold").text(`${cat.name}: ${cat.score}/100`);
      // Simple bar
      const barWidth = 200;
      const filled = (cat.score / 100) * barWidth;
      doc.rect(doc.x, doc.y, barWidth, 12).stroke("#cccccc");
      doc.rect(doc.x, doc.y, filled, 12).fill(cat.score >= 70 ? "#10b981" : cat.score >= 50 ? "#f59e0b" : "#ef4444");
      doc.fillColor("#000000").font("Helvetica");
      doc.moveDown(1);
    }

    doc.moveDown(1);

    // Detailed Checks
    doc.addPage();
    doc.fontSize(16).font("Helvetica-Bold").text("Detailed Checks");
    doc.moveDown(0.5);

    const checksByCategory = new Map<string, typeof checks>();
    for (const check of checks) {
      const arr = checksByCategory.get(check.category) ?? [];
      arr.push(check);
      checksByCategory.set(check.category, arr);
    }

    for (const [category, catChecks] of checksByCategory) {
      doc.fontSize(13).font("Helvetica-Bold").text(
        category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      );
      doc.moveDown(0.3);

      for (const check of catChecks) {
        const icon = check.result === "pass" ? "✓" : check.result === "warn" ? "⚠" : "✗";
        doc.fontSize(10).font("Helvetica-Bold").text(`${icon} ${check.checkName}: ${check.score}/100`);
        doc.font("Helvetica").fontSize(9).fillColor("#555555").text(check.details ?? "No details");
        doc.fillColor("#000000");
        doc.moveDown(0.5);
      }
      doc.moveDown(0.5);
    }

    // Recommendations
    doc.addPage();
    doc.fontSize(16).font("Helvetica-Bold").text("Recommendations");
    doc.moveDown(0.5);

    const failedOrWarned = checks.filter((c) => c.result === "fail" || c.result === "warn");
    if (failedOrWarned.length === 0) {
      doc.fontSize(11).font("Helvetica").text("All checks passed. No action required.");
    } else {
      const recommendations = failedOrWarned
        .sort((a: typeof checks[number], b: typeof checks[number]) => a.score - b.score)
        .slice(0, 10);

      for (let i = 0; i < recommendations.length; i++) {
        const rec = recommendations[i]!;
        doc.fontSize(11).font("Helvetica-Bold").text(`${i + 1}. ${rec.checkName} (${rec.category})`);
        doc.font("Helvetica").text(`   Current: ${rec.score}/100 — ${rec.details ?? "Improve this area"}`);
        doc.moveDown(0.3);
      }
    }

    // Footer
    doc.moveDown(2);
    doc.fontSize(8).fillColor("#999999").text(
      "This report was auto-generated by LLMTrust Compliance Scoring Engine. Scores are computed from available model metadata and may not reflect all compliance requirements. For a complete assessment, contact enterprise@llmtrust.dev.",
      { align: "center" },
    );

    doc.end();

    // Collect PDF buffer
    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
    });

    // Record report generation
    await db.insert(complianceReport).values({
      modelId,
      complianceScoreId: score.id,
      format: "pdf",
      fileSize: pdfBuffer.length,
    });

    const filename = `compliance-${mdl.slug}-${new Date().toISOString().split("T")[0]}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Compliance report error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 },
    );
  }
}
