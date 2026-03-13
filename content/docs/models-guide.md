# Models Guide

A comprehensive guide to understanding LLM specifications, file formats, quantization, and running models locally.

---

## Understanding Model Specs

When evaluating a language model, several key specifications determine its capabilities and hardware requirements.

### Parameters

Parameters are the learned weights inside a neural network — the numerical values adjusted during training to encode the model's knowledge and capabilities. The total number of parameters is a rough indicator of a model's complexity and capacity.

**Common model sizes:**

| Size | Examples | Min RAM | Use Case |
|------|----------|---------|----------|
| 1B–3B | Phi-2, Gemma 2B, StableLM 3B | 4–8 GB | Edge devices, mobile, simple tasks |
| 7B–8B | Llama 3 8B, Mistral 7B, Qwen 2.5 7B | 16 GB | General purpose, coding, chat |
| 13B–14B | Llama 2 13B, Qwen 2.5 14B | 32 GB | Higher quality, complex reasoning |
| 30B–34B | CodeLlama 34B, DeepSeek Coder 33B | 48–64 GB | Specialized tasks, advanced coding |
| 70B–72B | Llama 3 70B, Qwen 2.5 72B | 64–128 GB | Near-frontier quality |
| 100B+ | Llama 3 405B, Command R+ | 128 GB+ | Frontier-level, research, server |

> **Important:** More parameters ≠ always better. A well-trained 7B model can outperform a poorly trained 70B model on many tasks. Always check benchmarks for your specific use case.

### Architecture

The architecture defines the model's fundamental design:

- **Dense models** — Every parameter is active for every token (e.g., Llama, Mistral, Qwen)
- **Mixture of Experts (MoE)** — Only a subset of parameters activate per token (e.g., Mixtral 8x7B). These models have large total parameter counts but run faster than equivalent dense models
- **State Space Models (SSM)** — Alternative to transformers, optimized for long sequences (e.g., Mamba)

On LLM Trust, each model page clearly indicates the architecture type.

### Context Length

Context length is the maximum number of tokens a model can process in a single interaction — including both your input (prompt) and the model's generated output.

**What this means in practice:**

| Context Length | Approximate Text | Use Cases |
|---------------|------------------|-----------|
| 4,096 tokens | ~3,000 words | Short conversations, simple Q&A |
| 8,192 tokens | ~6,000 words | Standard chat, code snippets |
| 32,768 tokens | ~24,000 words | Long documents, codebases |
| 128,000 tokens | ~100,000 words | Entire books, large code repos |
| 1,000,000+ tokens | ~750,000 words | Research, massive context tasks |

**Trade-offs:** Longer contexts require more memory and can slow down generation. For most use cases, 8K–32K is the sweet spot.

### License

The license determines how you can legally use the model:

- **Apache 2.0** — Fully permissive. Use commercially, modify, distribute. No restrictions.
- **MIT** — Similar to Apache 2.0. Very permissive.
- **Llama Community License** — Free for research and commercial use under 700M MAU. Requires attribution.
- **GPL** — Open source, but derivative works must also be open source.
- **Custom/Proprietary** — Check the specific terms carefully.

Always read the actual license before deploying a model in production.

---

## File Formats Explained

When downloading models, you'll encounter several file formats. Here's what each one means.

### GGUF

**GGUF (GPT-Generated Unified Format)** is the recommended format for local inference. It was created by the llama.cpp project as a successor to GGML.

**Why GGUF:**
- Self-contained single file (weights + metadata + tokenizer)
- Built-in quantization support
- Works across platforms (CPU, GPU, Apple Silicon)
- Compatible with llama.cpp, Ollama, LM Studio, GPT4All, and more
- Efficient memory mapping for fast loading

**Best for:** Running models locally on consumer hardware.

### SafeTensors

**SafeTensors** is a format developed by HuggingFace for safe and fast model loading.

**Why SafeTensors:**
- Prevents arbitrary code execution during loading (unlike pickle/PyTorch)
- Faster loading than traditional PyTorch format
- Memory-mapped for efficient loading
- Standard format on HuggingFace Hub

**Best for:** Python-based workflows, fine-tuning, research.

### PyTorch (.bin, .pt, .pth)

The native PyTorch serialization format. Models distributed in this format are typically full-precision (FP16 or FP32) and require the most storage and memory.

**Best for:** Training, fine-tuning, converting to other formats.

### ONNX

**Open Neural Network Exchange** — A framework-agnostic format for model interoperability.

**Best for:** Deploying models across different frameworks and runtimes.

### Format Comparison

| Format | Quantization | Size | Speed | Local Inference | Fine-tuning |
|--------|-------------|------|-------|-----------------|-------------|
| GGUF | Built-in | Small | Fast | ✅ Best | ❌ |
| SafeTensors | External | Large | Fast | ✅ Good | ✅ Best |
| PyTorch | External | Largest | Slow | ⚠️ Possible | ✅ Good |
| ONNX | External | Medium | Fast | ✅ Good | ❌ |

---

## Quantization Guide

Quantization is the process of reducing the precision of a model's weights to decrease file size and memory usage — enabling you to run powerful models on consumer hardware.

### How It Works

A full-precision model uses 32-bit (FP32) or 16-bit (FP16/BF16) floating-point numbers for each weight. Quantization compresses these to lower precision:

- **FP16/BF16** (16-bit) — Half precision, minimal quality loss
- **Q8_0** (8-bit) — ~50% size reduction, very minimal quality loss
- **Q5_K_M** (5-bit) — ~65% size reduction, slight quality loss
- **Q4_K_M** (4-bit) — ~75% size reduction, noticeable but acceptable quality loss
- **Q3_K_M** (3-bit) — ~85% size reduction, significant quality loss
- **Q2_K** (2-bit) — ~90% size reduction, substantial quality loss

### Decoding Quantization Labels

GGUF quantization labels follow a naming convention:

- **Q** = Quantized
- **Number** = Bits per weight
- **K** = K-quant (improved quantization method)
- **S/M/L** = Small/Medium/Large (variations in how different tensor types are quantized)

**Examples:**

- `Q4_K_M` — 4-bit quantization, K-method, medium variant (most popular choice)
- `Q5_K_S` — 5-bit quantization, K-method, small variant
- `Q8_0` — 8-bit quantization, legacy method (high quality)

### Choosing the Right Quantization

| Your Hardware | Recommended Quant | Expected Quality |
|--------------|-------------------|-----------------|
| 16 GB RAM | Q4_K_M (7B model) | Very good |
| 32 GB RAM | Q5_K_M (13B) or Q4_K_M (30B) | Excellent |
| 64 GB RAM | Q5_K_M (70B) or Q4_K_M (70B) | Excellent |
| GPU 8GB VRAM | Q4_K_M (7B) with GPU offload | Very good |
| GPU 16GB VRAM | Q5_K_M (13B) full GPU | Excellent |
| GPU 24GB VRAM | Q4_K_M (70B) partial GPU offload | Very good |

**General rule:** When in doubt, choose **Q4_K_M**. It offers the best balance of quality and efficiency for most users.

### Quality Benchmarks

Typical quality retention at different quantization levels (compared to FP16):

- **Q8_0:** ~99.5% quality retention
- **Q6_K:** ~98.5% quality retention
- **Q5_K_M:** ~97% quality retention
- **Q4_K_M:** ~95% quality retention
- **Q3_K_M:** ~90% quality retention
- **Q2_K:** ~80% quality retention

These are approximate; actual results vary by model and task.

---

## How to Run Locally

Running LLMs locally gives you complete privacy, no API costs, and full control. Here's how to get started.

### Hardware Requirements

**Minimum (basic inference):**

- 16 GB RAM for 7B models
- Modern CPU (any Intel/AMD from the last 5 years, or Apple Silicon)
- 10–20 GB free disk space

**Recommended (good experience):**

- 32 GB RAM
- Dedicated GPU with 12+ GB VRAM (NVIDIA RTX 3060+, Apple M2 Pro+)
- SSD storage for fast model loading

**Optimal (large models):**

- 64+ GB RAM
- NVIDIA RTX 4090 (24 GB VRAM) or Apple M2/M3 Ultra (up to 192 GB unified memory)

### Software Options

#### Ollama (Recommended for Beginners)

The easiest way to run models locally. One command to install, one command to run.

```bash
# Install Ollama (macOS, Linux, Windows)
curl -fsSL https://ollama.com/install.sh | sh

# Run a model
ollama run llama3

# Run with specific quantization
ollama run llama3:8b-q4_K_M
```

Ollama automatically handles downloading, quantization selection, and GPU acceleration.

#### llama.cpp (Recommended for Advanced Users)

The foundation of GGUF inference. Maximum control and performance.

```bash
# Clone and build
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp && make

# Download a GGUF model from HuggingFace
huggingface-cli download TheBloke/Llama-2-7B-GGUF llama-2-7b.Q4_K_M.gguf

# Run inference
./main -m llama-2-7b.Q4_K_M.gguf -p "Hello, I am" -n 128
```

#### LM Studio (Best Desktop GUI)

A polished desktop application with a chat interface. Great for non-technical users.

- Download from [lmstudio.ai](https://lmstudio.ai)
- Browse and download models directly in the app
- Chat interface with conversation history
- Supports GGUF models

#### GPT4All (All-in-One)

Another excellent desktop option with an emphasis on privacy.

- Download from [gpt4all.io](https://gpt4all.io)
- Built-in model browser
- LocalDocs feature for chatting with your documents
- No data leaves your machine

### Quick Start Checklist

1. ✅ Check your hardware (RAM, VRAM, disk space)
2. ✅ Choose a software option (Ollama recommended)
3. ✅ Pick a model and quantization (start with a 7B Q4_K_M)
4. ✅ Download and run
5. ✅ Experiment with different models and settings

### Troubleshooting

**Out of memory errors:**
- Try a smaller model or lower quantization
- Reduce context length (`--ctx-size` in llama.cpp)
- Use CPU-only mode if GPU VRAM is insufficient

**Slow generation:**
- Ensure GPU acceleration is enabled
- Use a lower quantization (Q4_K_M is faster than Q8_0)
- Reduce the number of layers offloaded to GPU if RAM is limited

**Model won't load:**
- Verify the download completed (check file size)
- Ensure the file format is compatible with your software
- Check that your software version supports the model architecture

---

## Contributing Models

Have you trained or fine-tuned a model? Share it with the community!

### Submission Requirements

- Your model must be open-source with a recognized license
- You need a free LLM Trust account
- A public download URL (HuggingFace recommended)
- Complete metadata (architecture, parameters, context length, license)

### How to Submit

1. Go to [/models/upload](/models/upload)
2. Fill in the model details
3. Add download links and tags
4. Submit for review

All submissions are reviewed by our team before publication to ensure quality and accuracy.

---

## Resources

- [Browse All Models](/models) — Explore 200+ open-source LLMs
- [Compare Models](/compare) — Side-by-side comparison tool
- [Account & API Guide](/docs/account) — API keys, Pro features, account management
- [Blog](/blog) — Latest news and technical guides

---

*Last updated: March 2026*
