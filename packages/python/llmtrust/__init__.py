"""LLMTrust — Trust scores for LLMs in Python."""

from llmtrust.client import LLMTrustClient
from llmtrust.types import TrustScore, TrustBand, ScoreBreakdown, score_to_band

# OpenAI wrapper (optional import)
try:
    from llmtrust.openai_wrapper import OpenAI, AsyncOpenAI
except ImportError:
    pass

__version__ = "0.1.0"
__all__ = [
    "LLMTrustClient",
    "TrustScore",
    "TrustBand",
    "ScoreBreakdown",
    "score_to_band",
    "OpenAI",
    "AsyncOpenAI",
]
