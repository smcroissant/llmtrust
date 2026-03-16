"""OpenAI SDK drop-in wrapper with trust logging.

Usage:
    from llmtrust import OpenAI

    client = OpenAI(api_key="...", trust_log=True)
    response = client.chat.completions.create(model="gpt-4o", messages=[...])
"""

from typing import Any, Optional
import logging

logger = logging.getLogger("llmtrust")


class OpenAI:
    """Wraps openai.OpenAI with trust score logging."""

    def __init__(self, api_key: Optional[str] = None, trust_log: bool = True, **kwargs):
        try:
            import openai as _openai
        except ImportError:
            raise ImportError("openai package required: pip install openai")

        self._client = _openai.OpenAI(api_key=api_key, **kwargs)
        self._trust_log = trust_log
        self._llmtrust_client = None

        if trust_log:
            from llmtrust.client import LLMTrustClient
            self._llmtrust_client = LLMTrustClient()

        # Wrap chat.completions.create
        self.chat = _WrappedChat(self._client.chat, self._llmtrust_client)
        self.completions = _WrappedCompletions(self._client.completions, self._llmtrust_client)

    def __getattr__(self, name: str) -> Any:
        return getattr(self._client, name)


class AsyncOpenAI:
    """Async version of the OpenAI wrapper."""

    def __init__(self, api_key: Optional[str] = None, trust_log: bool = True, **kwargs):
        try:
            import openai as _openai
        except ImportError:
            raise ImportError("openai package required: pip install openai")

        self._client = _openai.AsyncOpenAI(api_key=api_key, **kwargs)
        self._trust_log = trust_log
        self._llmtrust_client = None

        if trust_log:
            from llmtrust.client import LLMTrustClient
            self._llmtrust_client = LLMTrustClient()

        self.chat = _AsyncWrappedChat(self._client.chat, self._llmtrust_client)

    def __getattr__(self, name: str) -> Any:
        return getattr(self._client, name)


class _WrappedChat:
    def __init__(self, chat, llmtrust_client):
        self._chat = chat
        self.completions = _WrappedCompletions(chat.completions, llmtrust_client)

    def __getattr__(self, name: str) -> Any:
        return getattr(self._chat, name)


class _AsyncWrappedChat:
    def __init__(self, chat, llmtrust_client):
        self._chat = chat
        self.completions = _AsyncWrappedCompletions(chat.completions, llmtrust_client)

    def __getattr__(self, name: str) -> Any:
        return getattr(self._chat, name)


class _WrappedCompletions:
    def __init__(self, completions, llmtrust_client):
        self._completions = completions
        self._llmtrust = llmtrust_client

    def create(self, model: str, **kwargs) -> Any:
        response = self._completions.create(model=model, **kwargs)

        if self._llmtrust:
            provider = model.split("/")[0] if "/" in model else "openai"
            clean_model = model.split("/")[-1] if "/" in model else model
            try:
                score = self._llmtrust.score(provider, clean_model)
                emoji = {"platinum": "💎", "gold": "🥇", "silver": "🥈", "bronze": "🥉", "red-flag": "🚩"}.get(score.band, "❓")
                logger.info(
                    f"[LLMTrust] {emoji} {provider}/{clean_model} → {score.score}/100 ({score.band})"
                )
                # Attach score to response
                response._llmtrust_score = score
            except Exception as e:
                logger.debug(f"[LLMTrust] Failed to fetch score: {e}")

        return response

    def __getattr__(self, name: str) -> Any:
        return getattr(self._completions, name)


class _AsyncWrappedCompletions:
    def __init__(self, completions, llmtrust_client):
        self._completions = completions
        self._llmtrust = llmtrust_client

    async def create(self, model: str, **kwargs) -> Any:
        response = await self._completions.create(model=model, **kwargs)

        if self._llmtrust:
            provider = model.split("/")[0] if "/" in model else "openai"
            clean_model = model.split("/")[-1] if "/" in model else model
            try:
                score = self._llmtrust.score(provider, clean_model)
                emoji = {"platinum": "💎", "gold": "🥇", "silver": "🥈", "bronze": "🥉", "red-flag": "🚩"}.get(score.band, "❓")
                logger.info(
                    f"[LLMTrust] {emoji} {provider}/{clean_model} → {score.score}/100 ({score.band})"
                )
                response._llmtrust_score = score
            except Exception as e:
                logger.debug(f"[LLMTrust] Failed to fetch score: {e}")

        return response

    def __getattr__(self, name: str) -> Any:
        return getattr(self._completions, name)
