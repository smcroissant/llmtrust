"""LLMTrust API client with caching."""

import os
import time
from typing import Optional, Dict, Tuple

import httpx

from llmtrust.types import (
    TrustScore,
    ScoreBreakdown,
    RecommendOptions,
    ModelRecommendation,
    score_to_band,
)

DEFAULT_API_BASE = "https://api.llmtrust.io"
CACHE_TTL_SECONDS = 300  # 5 minutes


class LLMTrustClient:
    def __init__(
        self,
        api_key: Optional[str] = None,
        api_base: Optional[str] = None,
    ):
        self.api_key = api_key or os.environ.get("LLMTRUST_API_KEY", "")
        self.api_base = api_base or os.environ.get("LLMTRUST_API_URL", DEFAULT_API_BASE)
        self._cache: Dict[str, Tuple[TrustScore, float]] = {}

    def _headers(self) -> dict:
        if self.api_key:
            return {"Authorization": f"Bearer {self.api_key}"}
        return {}

    def score(self, provider: str, model: str) -> TrustScore:
        key = f"{provider}:{model}"
        cached = self._cache.get(key)
        if cached and time.time() - cached[1] < CACHE_TTL_SECONDS:
            cached_score = cached[0]
            cached_score.cached = True
            return cached_score

        try:
            resp = httpx.get(
                f"{self.api_base}/v1/scores/{provider}/{model}",
                headers=self._headers(),
                timeout=10.0,
            )
            resp.raise_for_status()
            data = resp.json()

            breakdown = ScoreBreakdown(
                transparency=data.get("breakdown", {}).get("transparency", 0),
                consistency=data.get("breakdown", {}).get("consistency", 0),
                safety=data.get("breakdown", {}).get("safety", 0),
                performance=data.get("breakdown", {}).get("performance", 0),
                cost_efficiency=data.get("breakdown", {}).get("costEfficiency", 0),
            )

            trust_score = TrustScore(
                provider=provider,
                model=model,
                score=data.get("score", 0),
                band=data.get("band", score_to_band(data.get("score", 0))),
                breakdown=breakdown,
                updated_at=data.get("updatedAt", ""),
            )
            self._cache[key] = (trust_score, time.time())
            return trust_score
        except Exception:
            return self._fallback_score(provider, model)

    def recommend(self, options: Optional[RecommendOptions] = None) -> list[ModelRecommendation]:
        options = options or RecommendOptions()
        try:
            params = {}
            if options.task:
                params["task"] = options.task
            if options.budget:
                params["budget"] = options.budget
            if options.min_score is not None:
                params["minScore"] = str(options.min_score)
            if options.limit is not None:
                params["limit"] = str(options.limit)
            if options.provider:
                params["provider"] = options.provider

            resp = httpx.get(
                f"{self.api_base}/v1/recommend",
                params=params,
                headers=self._headers(),
                timeout=10.0,
            )
            resp.raise_for_status()
            data = resp.json()

            return [
                ModelRecommendation(
                    provider=m["provider"],
                    model=m["model"],
                    score=m["score"],
                    band=m.get("band", score_to_band(m["score"])),
                    reason=m.get("reason", ""),
                )
                for m in data.get("models", [])
            ]
        except Exception:
            return []

    def _fallback_score(self, provider: str, model: str) -> TrustScore:
        return TrustScore(
            provider=provider,
            model=model,
            score=50,
            band="silver",
            breakdown=ScoreBreakdown(50, 50, 50, 50, 50),
        )

    def clear_cache(self) -> None:
        self._cache.clear()
