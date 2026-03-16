"""LLMTrust types."""

from dataclasses import dataclass, field
from typing import Literal, Optional
from datetime import datetime

TrustBand = Literal["platinum", "gold", "silver", "bronze", "red-flag"]

TRUST_BAND_THRESHOLDS = {
    "platinum": (90, 100),
    "gold": (75, 89),
    "silver": (60, 74),
    "bronze": (40, 59),
    "red-flag": (0, 39),
}

BAND_EMOJI = {
    "platinum": "💎",
    "gold": "🥇",
    "silver": "🥈",
    "bronze": "🥉",
    "red-flag": "🚩",
}


def score_to_band(score: float) -> TrustBand:
    for band, (min_s, max_s) in TRUST_BAND_THRESHOLDS.items():
        if min_s <= score <= max_s:
            return band  # type: ignore
    return "red-flag"


@dataclass
class ScoreBreakdown:
    transparency: float = 0.0
    consistency: float = 0.0
    safety: float = 0.0
    performance: float = 0.0
    cost_efficiency: float = 0.0


@dataclass
class TrustScore:
    provider: str
    model: str
    score: float  # 0-100
    band: TrustBand = "silver"
    breakdown: ScoreBreakdown = field(default_factory=ScoreBreakdown)
    updated_at: str = ""
    cached: bool = False

    def __post_init__(self):
        if not self.band or self.band == "silver" and self.score != 0:
            self.band = score_to_band(self.score)
        if not self.updated_at:
            self.updated_at = datetime.utcnow().isoformat()


@dataclass
class RecommendOptions:
    task: Optional[str] = None
    budget: Optional[str] = None
    min_score: Optional[float] = None
    limit: Optional[int] = None
    provider: Optional[str] = None


@dataclass
class ModelRecommendation:
    provider: str
    model: str
    score: float
    band: TrustBand
    reason: str = ""
