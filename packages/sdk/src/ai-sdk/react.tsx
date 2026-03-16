/**
 * LLMTrust — React Components for Vercel AI SDK
 *
 * Usage:
 *   import { ModelTrustBadge } from "llmtrust/ai-sdk/react";
 *
 *   <ModelTrustBadge model="claude-3.5-sonnet" provider="anthropic" />
 */

"use client";

import { useEffect, useState } from "react";
import type { TrustScore, TrustBand } from "../types";
import { BAND_COLORS, BAND_EMOJI } from "../types";
import { getDefaultClient } from "../client";

/* ── ModelTrustBadge ─────────────────────────────────────── */

export interface ModelTrustBadgeProps {
  provider: string;
  model: string;
  /** Auto-refresh interval in ms. 0 = no refresh. Default: 300000 (5 min) */
  refreshInterval?: number;
  /** Show the numeric score. Default: true */
  showScore?: boolean;
  /** Show the breakdown. Default: false */
  showBreakdown?: boolean;
  /** Compact mode (just band emoji + score). Default: false */
  compact?: boolean;
  /** Custom className */
  className?: string;
  /** Override score (skip fetch) */
  score?: TrustScore;
}

export function ModelTrustBadge({
  provider,
  model,
  refreshInterval = 300000,
  showScore = true,
  showBreakdown = false,
  compact = false,
  className = "",
  score: scoreProp,
}: ModelTrustBadgeProps) {
  const [score, setScore] = useState<TrustScore | null>(scoreProp ?? null);
  const [loading, setLoading] = useState(!scoreProp);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (scoreProp) {
      setScore(scoreProp);
      setLoading(false);
      return;
    }

    const fetchScore = async () => {
      try {
        setLoading(true);
        const client = getDefaultClient();
        const s = await client.score(provider, model);
        setScore(s);
        setError(false);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchScore();

    if (refreshInterval > 0) {
      const id = setInterval(fetchScore, refreshInterval);
      return () => clearInterval(id);
    }
  }, [provider, model, refreshInterval, scoreProp]);

  if (loading) {
    return (
      <span className={`llmtrust-badge llmtrust-badge--loading ${className}`}>
        ⏳ Loading trust...
      </span>
    );
  }

  if (error || !score) {
    return (
      <span className={`llmtrust-badge llmtrust-badge--error ${className}`}>
        ⚠️ Trust score unavailable
      </span>
    );
  }

  if (compact) {
    return (
      <span
        className={`llmtrust-badge llmtrust-badge--compact ${className}`}
        title={`${provider}/${model}: ${score.score}/100 (${score.band})`}
      >
        {BAND_EMOJI[score.band]} {showScore && score.score}
      </span>
    );
  }

  return (
    <div className={`llmtrust-badge llmtrust-badge--${score.band} ${className}`}>
      <div className="llmtrust-badge__header">
        <span className="llmtrust-badge__emoji">{BAND_EMOJI[score.band]}</span>
        <span className="llmtrust-badge__band" style={{ color: BAND_COLORS[score.band] }}>
          {score.band.toUpperCase()}
        </span>
        {showScore && (
          <span className="llmtrust-badge__score">{score.score}/100</span>
        )}
      </div>
      <div className="llmtrust-badge__model">
        {provider}/{model}
      </div>
      {showBreakdown && (
        <div className="llmtrust-badge__breakdown">
          <BreakdownBar label="Transparency" value={score.breakdown.transparency} />
          <BreakdownBar label="Consistency" value={score.breakdown.consistency} />
          <BreakdownBar label="Safety" value={score.breakdown.safety} />
          <BreakdownBar label="Performance" value={score.breakdown.performance} />
          <BreakdownBar label="Cost Efficiency" value={score.breakdown.costEfficiency} />
        </div>
      )}
    </div>
  );
}

/* ── TrustIndicator (inline, for use inside chat UIs) ─── */

export interface TrustIndicatorProps {
  score: TrustScore;
  /** Show as inline text vs badge */
  inline?: boolean;
  className?: string;
}

export function TrustIndicator({ score, inline = false, className = "" }: TrustIndicatorProps) {
  const color = BAND_COLORS[score.band];
  const emoji = BAND_EMOJI[score.band];

  if (inline) {
    return (
      <span className={`llmtrust-indicator llmtrust-indicator--inline ${className}`}>
        {emoji} {score.score}
      </span>
    );
  }

  return (
    <span
      className={`llmtrust-indicator ${className}`}
      style={{ borderColor: color }}
    >
      {emoji} {score.band} — {score.score}/100
    </span>
  );
}

/* ── ScoreBreakdown Chart ────────────────────────────── */

interface BreakdownBarProps {
  label: string;
  value: number;
}

function BreakdownBar({ label, value }: BreakdownBarProps) {
  const color = value >= 75 ? "#22c55e" : value >= 50 ? "#eab308" : "#ef4444";
  return (
    <div className="llmtrust-breakdown__row">
      <span className="llmtrust-breakdown__label">{label}</span>
      <div className="llmtrust-breakdown__bar-bg">
        <div
          className="llmtrust-breakdown__bar-fill"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="llmtrust-breakdown__value">{value}</span>
    </div>
  );
}

export interface ScoreBreakdownProps {
  score: TrustScore;
  className?: string;
}

export function ScoreBreakdownChart({ score, className = "" }: ScoreBreakdownProps) {
  return (
    <div className={`llmtrust-breakdown ${className}`}>
      <h4 className="llmtrust-breakdown__title">
        {BAND_EMOJI[score.band]} Trust Score Breakdown — {score.provider}/{score.model}
      </h4>
      <BreakdownBar label="Transparency" value={score.breakdown.transparency} />
      <BreakdownBar label="Consistency" value={score.breakdown.consistency} />
      <BreakdownBar label="Safety" value={score.breakdown.safety} />
      <BreakdownBar label="Performance" value={score.breakdown.performance} />
      <BreakdownBar label="Cost Efficiency" value={score.breakdown.costEfficiency} />
      <div className="llmtrust-breakdown__footer">
        Updated: {new Date(score.updatedAt).toLocaleString()}
      </div>
    </div>
  );
}

/* Re-export types */
export type { TrustScore, TrustBand } from "../types";
