# llmtrust-python

Trust scores for LLMs in Python — OpenAI SDK wrapper + LangChain integration.

[![PyPI](https://img.shields.io/pypi/v/llmtrust)](https://pypi.org/project/llmtrust/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Install

```bash
pip install llmtrust
# With LangChain support
pip install llmtrust[langchain]
```

## Quick Start

```python
from llmtrust import LLMTrustClient

client = LLMTrustClient(api_key="your-key")  # or set LLMTRUST_API_KEY env
score = client.score("openai", "gpt-4o")
print(score.score)  # 85
print(score.band)   # "gold"
```

## OpenAI SDK Drop-in Wrapper

One line to add trust observability to any OpenAI call:

```python
from llmtrust import OpenAI

client = OpenAI(api_key="sk-...", trust_log=True)
# Same interface as official OpenAI SDK, just adds trust signals
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

Also works with async:

```python
from llmtrust import AsyncOpenAI

client = AsyncOpenAI(api_key="sk-...", trust_log=True)
response = await client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

## LangChain Integration

```python
from llmtrust.langchain import LLMTrustCallback, recommend, trust_aware_route

# Callback handler
callback = LLMTrustCallback(
    log_to_console=True,
    threshold=60,
    on_below_threshold=lambda score: print(f"Low trust: {score.score}/100")
)

chain.invoke({"input": "Hello"}, callbacks=[callback])

# Model recommendations
models = recommend(task="coding", budget="pro", limit=5)

# Trust-aware routing
result, provider, model, score = trust_aware_route(
    primary={"provider": "openai", "model": "gpt-4o", "llm": openai_llm},
    fallbacks=[{"provider": "anthropic", "model": "claude-3.5-sonnet", "llm": anthropic_llm}],
    min_score=60,
    invoke_fn=lambda llm: llm.invoke("Hello!")
)
```

## Trust Bands

| Band | Score | Emoji |
|------|-------|-------|
| Platinum | 90-100 | 💎 |
| Gold | 75-89 | 🥇 |
| Silver | 60-74 | 🥈 |
| Bronze | 40-59 | 🥉 |
| Red Flag | 0-39 | 🚩 |

## License

MIT — CroissantLabs 🥐
