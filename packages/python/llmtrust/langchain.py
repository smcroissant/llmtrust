"""LLMTrust — LangChain Python Integration.

Usage:
    from llmtrust.langchain import LLMTrustCallback, recommend, trust_aware_route

    callback = LLMTrustCallback(threshold=60)
    chain.invoke({"input": "Hello"}, callbacks=[callback])
"""

from typing import Any, Optional, Callable, List, Dict
import logging

from llmtrust.client import LLMTrustClient
from llmtrust.types import TrustScore, RecommendOptions, ModelRecommendation, score_to_band

logger = logging.getLogger("llmtrust.langchain")


class LLMTrustCallback:
    """LangChain callback handler that logs trust scores alongside chain execution."""

    def __init__(
        self,
        log_to_console: bool = True,
        threshold: Optional[float] = None,
        on_score: Optional[Callable[[TrustScore], None]] = None,
        on_below_threshold: Optional[Callable[[TrustScore], None]] = None,
    ):
        self.log_to_console = log_to_console
        self.threshold = threshold
        self.on_score = on_score
        self.on_below_threshold = on_below_threshold
        self._client = LLMTrustClient()

    @property
    def name(self) -> str:
        return "llmtrust_callback"

    def on_llm_end(self, response: Any, **kwargs) -> None:
        """Called when an LLM call completes."""
        try:
            # Extract provider/model from response metadata
            llm_output = getattr(response, "llm_output", {}) or {}
            model_name = llm_output.get("model_name", "")

            if "/" in model_name:
                provider, model = model_name.split("/", 1)
            elif model_name:
                provider = "openai"
                model = model_name
            else:
                provider = "unknown"
                model = "unknown"

            score = self._client.score(provider, model)

            emoji_map = {"platinum": "💎", "gold": "🥇", "silver": "🥈", "bronze": "🥉", "red-flag": "🚩"}
            emoji = emoji_map.get(score.band, "❓")

            if self.log_to_console:
                logger.info(f"[LLMTrust] {emoji} {provider}/{model} → {score.score}/100 ({score.band})")

            if self.on_score:
                self.on_score(score)

            if self.threshold and score.score < self.threshold:
                if self.on_below_threshold:
                    self.on_below_threshold(score)
                else:
                    logger.warning(f"[LLMTrust] ⚠️ Score {score.score}/100 below threshold {self.threshold}")

        except Exception as e:
            logger.debug(f"[LLMTrust] Callback error: {e}")


def recommend(
    task: Optional[str] = None,
    budget: Optional[str] = None,
    min_score: Optional[float] = None,
    limit: Optional[int] = None,
    provider: Optional[str] = None,
) -> List[ModelRecommendation]:
    """Get model recommendations from LLMTrust."""
    client = LLMTrustClient()
    options = RecommendOptions(
        task=task,
        budget=budget,
        min_score=min_score,
        limit=limit,
        provider=provider,
    )
    return client.recommend(options)


def trust_aware_route(
    primary: Dict[str, Any],
    fallbacks: List[Dict[str, Any]],
    min_score: float = 60,
    invoke_fn: Optional[Callable] = None,
    verbose: bool = False,
) -> tuple:
    """Auto-switch to fallback model if primary model's trust score drops below threshold.

    Args:
        primary: {"provider": str, "model": str, "llm": Any}
        fallbacks: List of fallback configs in same format
        min_score: Minimum trust score threshold
        invoke_fn: Function to call with the selected LLM
        verbose: Log routing decisions

    Returns:
        Tuple of (result, used_provider, used_model, trust_score)
    """
    client = LLMTrustClient()

    primary_score = client.score(primary["provider"], primary["model"])

    if primary_score.score >= min_score:
        if verbose:
            logger.info(f"✅ Using primary: {primary['provider']}/{primary['model']} ({primary_score.score}/100)")
        result = invoke_fn(primary["llm"]) if invoke_fn else None
        return result, primary["provider"], primary["model"], primary_score

    if verbose:
        logger.warning(f"⚠️ Primary below threshold ({primary_score.score}/100 < {min_score}). Trying fallbacks...")

    for fb in fallbacks:
        fb_score = client.score(fb["provider"], fb["model"])
        if fb_score.score >= min_score:
            if verbose:
                logger.info(f"🔄 Routing to: {fb['provider']}/{fb['model']} ({fb_score.score}/100)")
            result = invoke_fn(fb["llm"]) if invoke_fn else None
            return result, fb["provider"], fb["model"], fb_score

    # All below threshold
    logger.warning(f"🚩 All models below threshold {min_score}. Using primary anyway.")
    result = invoke_fn(primary["llm"]) if invoke_fn else None
    return result, primary["provider"], primary["model"], primary_score


__all__ = ["LLMTrustCallback", "recommend", "trust_aware_route"]
