# LLMTrust CLI

Compare LLM models from your terminal — powered by [LLMTrust](https://llmtrust.com).

## Quick Start

```bash
# Run without installing
npx llmtrust compare gpt-4o claude-3.5-sonnet gemini-1.5-pro

# Or install globally
npm install -g llmtrust-cli
llmtrust compare gpt-4o claude-3.5-sonnet
```

## Commands

### `compare` — Side-by-side comparison

```bash
llmtrust compare gpt-4o claude-3.5-sonnet gemini-1.5-pro
```

Shows latency, cost, and context window for each model.

### `models` — List all models

```bash
llmtrust models                    # all models
llmtrust models --provider OpenAI  # filter by provider
```

### `info` — Detailed model info

```bash
llmtrust info gpt-4o
```

### `providers` — List providers

```bash
llmtrust providers
```

## Supported Providers

- OpenAI (GPT-4o, GPT-4o Mini, GPT-4 Turbo, o1, o1 Mini)
- Anthropic (Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus)
- Google (Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini 2.0 Flash)
- Mistral (Mistral Large, Mistral Small, Codestral)
- Meta (Llama 3.1 405B, 70B, 8B)
- Cohere (Command R+, Command R)
- DeepSeek (DeepSeek V3)

## Telemetry

By default, the CLI collects anonymous usage data (hashed model comparisons, no PII). To disable:

```bash
llmtrust compare gpt-4o claude --no-telemetry
# or
LLMTRUST_NO_TELEMETRY=1 llmtrust compare gpt-4o claude
```

## Development

```bash
cd packages/cli
npm install
npm run build
npm start -- compare gpt-4o claude-3.5-sonnet
```

## License

MIT — CroissantLabs
