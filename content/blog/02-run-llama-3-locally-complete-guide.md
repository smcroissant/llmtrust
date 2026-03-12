---
title: "How to Run Llama 3 Locally: Complete Guide"
meta_title: "How to Run Llama 3 Locally: Complete Guide (2026)"
meta_description: "Step-by-step guide to running Llama 3 locally with Ollama, llama.cpp & more. Hardware requirements, installation, optimization & troubleshooting tips."
slug: /blog/run-llama-3-locally-complete-guide
keywords: [run llama 3 locally, llama 3 download, ollama llama 3, local llama 3, llama 3 local setup]
date: 2026-03-12
author: Pulse
categories: [Tutorials]
image: /blog/og-run-llama3.svg
---

# How to Run Llama 3 Locally: Complete Guide

Running large language models on your own hardware has never been more accessible. Meta's **Llama 3** family — from the nimble 8B parameter variant to the powerful 70B and 405B models — can all be run locally with the right setup. This guide covers everything you need to know to **run Llama 3 locally**, from hardware requirements to optimization techniques.

Whether you're concerned about data privacy, want to eliminate API costs, or need offline AI capabilities, running Llama 3 on your own machine gives you full control over your AI stack.

Before we dive in, you can [explore all Llama 3 variants](/models) on LLM Trust to see detailed specs and find the right model for your hardware.

## Prerequisites: What You Need

### Hardware Requirements

The hardware you need depends heavily on which Llama 3 model you plan to run:

#### Llama 3.2 1B & 3B (Lightweight)
- **RAM**: 4GB minimum (8GB recommended)
- **GPU**: Optional — runs efficiently on CPU
- **Storage**: 2-8GB
- **Best For**: Mobile devices, embedded systems, quick prototyping

#### Llama 3.2 11B Vision
- **RAM**: 16GB minimum (32GB recommended)
- **GPU**: 8GB+ VRAM (e.g., RTX 3070, RTX 4060)
- **Storage**: 20GB
- **Best For**: Image understanding tasks, multimodal applications

#### Llama 3.3 70B
- **RAM**: 64GB minimum (128GB recommended for full precision)
- **GPU**: 48GB+ VRAM for full precision, or 24GB with 4-bit quantization
- **Storage**: 140GB
- **Best For**: Production workloads, complex reasoning, code generation

#### Llama 3.1 405B
- **RAM**: 256GB+ system RAM
- **GPU**: Multiple A100/H100 GPUs, or high-RAM CPU inference
- **Storage**: 750GB+
- **Best For**: Research, maximum capability requirements

### Software Requirements

- **Operating System**: Linux (recommended), macOS, or Windows with WSL2
- **Python**: 3.10 or later
- **Git**: For cloning repositories
- **CUDA Toolkit**: 12.x (for NVIDIA GPU acceleration)
- **Package Manager**: pip, conda, or your system package manager

### Verify Your Hardware

Before proceeding, check your available resources:

```bash
# Check RAM
free -h

# Check GPU and VRAM (NVIDIA)
nvidia-smi

# Check disk space
df -h

# Check CPU info
lscpu | grep "Model name"
```

## Method 1: Ollama (Easiest Setup)

[Ollama](https://ollama.com) is the fastest way to get Llama 3 running locally. It handles model downloading, quantization, and serving in a single tool.

### Installation

**macOS:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Or download the macOS app from [ollama.com](https://ollama.com).

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows:**
Download the installer from [ollama.com](https://ollama.com/download/windows).

### Download and Run Llama 3

Once Ollama is installed, running Llama 3 is as simple as:

```bash
# Llama 3.2 3B (lightweight, great for testing)
ollama run llama3.2:3b

# Llama 3.3 70B (requires significant hardware)
ollama run llama3.3:70b

# Llama 3.2 11B Vision (multimodal)
ollama run llama3.2-vision:11b
```

Ollama automatically downloads the model on first run. Subsequent runs use the cached model.

### Available Llama 3 Models in Ollama

| Model | Size | Download Command |
|-------|------|-----------------|
| Llama 3.2 1B | ~1.3GB | `ollama run llama3.2:1b` |
| Llama 3.2 3B | ~2.0GB | `ollama run llama3.2:3b` |
| Llama 3.2 11B Vision | ~7.5GB | `ollama run llama3.2-vision:11b` |
| Llama 3.2 90B Vision | ~52GB | `ollama run llama3.2-vision:90b` |
| Llama 3.3 70B | ~40GB | `ollama run llama3.3:70b` |
| Llama 3.1 8B | ~4.7GB | `ollama run llama3.1:8b` |
| Llama 3.1 70B | ~40GB | `ollama run llama3.1:70b` |
| Llama 3.1 405B | ~231GB | `ollama run llama3.1:405b` |

### Using the Ollama API

Ollama exposes a local API on port 11434:

```bash
# Chat completion
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.3:70b",
  "messages": [
    {"role": "user", "content": "Explain quantum computing in simple terms."}
  ]
}'

# Simple generation
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2:3b",
  "prompt": "Write a Python function to calculate fibonacci numbers"
}'
```

### Python Integration

```python
import requests

def chat_with_llama(prompt, model="llama3.3:70b"):
    response = requests.post(
        "http://localhost:11434/api/chat",
        json={
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "stream": False
        }
    )
    return response.json()["message"]["content"]

print(chat_with_llama("What are the main benefits of running LLMs locally?"))
```

## Method 2: llama.cpp (Maximum Control)

[llama.cpp](https://github.com/ggerganov/llama.cpp) provides the most control over inference, including advanced quantization options and CPU-optimized execution.

### Installation

```bash
# Clone the repository
git clone https://github.com/ggerganov/llama.cpp.git
cd llama.cpp

# Build with CUDA support (if you have an NVIDIA GPU)
cmake -B build -DLLAMA_CUDA=ON
cmake --build build --config Release

# Or build for CPU-only
cmake -B build
cmake --build build --config Release
```

### Download Llama 3 Weights

You'll need the model weights in GGUF format. You can download pre-converted weights from Hugging Face:

```bash
# Install huggingface-cli
pip install huggingface_hub

# Download Llama 3.3 70B in Q4_K_M quantization (good quality/size balance)
huggingface-cli download bartowski/Llama-3.3-70B-Instruct-GGUF \
  --include "Llama-3.3-70B-Instruct-Q4_K_M.gguf" \
  --local-dir ./models/
```

### Quantization Options

Quantization reduces model size at the cost of some quality. Common options:

| Quantization | Bits/Weight | Size (70B) | Quality |
|-------------|-------------|-----------|---------|
| Q8_0 | 8 | ~70GB | Near-perfect |
| Q6_K | 6 | ~55GB | Excellent |
| Q5_K_M | 5 | ~47GB | Very good |
| Q4_K_M | 4 | ~40GB | Good (recommended) |
| Q3_K_M | 3 | ~32GB | Acceptable |
| Q2_K | 2 | ~25GB | Degraded |

### Running Inference

```bash
# Basic chat mode
./build/bin/llama-cli -m ./models/Llama-3.3-70B-Instruct-Q4_K_M.gguf \
  --interactive \
  --ctx-size 4096 \
  --n-gpu-layers 99

# With specific parameters
./build/bin/llama-server \
  -m ./models/Llama-3.3-70B-Instruct-Q4_K_M.gguf \
  --host 0.0.0.0 \
  --port 8080 \
  --ctx-size 8192 \
  --n-gpu-layers 99 \
  --threads 8
```

### Key Parameters Explained

- `--n-gpu-layers`: Number of layers to offload to GPU (99 = all layers)
- `--ctx-size`: Context window size (max tokens for input + output)
- `--threads`: CPU threads for inference
- `--batch-size`: Prompt processing batch size (larger = faster prompt ingestion)

## Method 3: Hugging Face Transformers

For integration with existing ML pipelines and research workflows:

### Setup

```bash
pip install transformers torch accelerate bitsandbytes
```

### Loading Llama 3

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model_id = "meta-llama/Llama-3.3-70B-Instruct"

# Load with 4-bit quantization for memory efficiency
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    torch_dtype=torch.bfloat16,
    device_map="auto",
    load_in_4bit=True,  # Requires bitsandbytes
)

tokenizer = AutoTokenizer.from_pretrained(model_id)

# Generate text
messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Explain the difference between a CPU and GPU."}
]

input_text = tokenizer.apply_chat_template(messages, tokenize=False)
inputs = tokenizer(input_text, return_tensors="pt").to(model.device)

outputs = model.generate(
    **inputs,
    max_new_tokens=512,
    temperature=0.7,
    top_p=0.9,
)

response = tokenizer.decode(outputs[0], skip_special_tokens=True)
print(response)
```

## Method 4: vLLM (Production Serving)

For production deployments with high throughput:

```bash
pip install vllm

# Start the server
vllm serve meta-llama/Llama-3.3-70B-Instruct \
  --tensor-parallel-size 2 \
  --max-model-len 8192 \
  --gpu-memory-utilization 0.9
```

vLLM provides an OpenAI-compatible API at `http://localhost:8000/v1`.

## Configuration and Optimization

### Prompt Templates

Llama 3 uses a specific chat template. The correct format:

```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are a helpful assistant.<|eot_id|><|start_header_id|>user<|end_header_id|>

What is machine learning?<|eot_id|><|start_header_id|>assistant<|end_header_id|>
```

Most tools (Ollama, Transformers) apply this template automatically.

### Memory Optimization Techniques

**1. Quantization** — The most effective technique. Q4_K_M reduces memory by ~75% with minimal quality loss.

**2. KV Cache Optimization:**
```bash
# In llama.cpp
--cache-type-k q8_0  # Quantize KV cache to 8-bit
```

**3. Context Length Management:**
```bash
# Use smaller context if you don't need full 128K
--ctx-size 4096  # Instead of 128K
```

**4. Flash Attention:**
```bash
# In vLLM or Transformers, flash attention is typically enabled by default
# In llama.cpp
--flash-attn
```

### Performance Benchmarks (llama.cpp, RTX 4090)

| Model | Quantization | Tokens/sec | VRAM Usage |
|-------|-------------|-----------|------------|
| Llama 3.2 3B | Q4_K_M | ~120 | ~2.5GB |
| Llama 3.1 8B | Q4_K_M | ~65 | ~5GB |
| Llama 3.3 70B | Q4_K_M | ~12 | ~40GB |
| Llama 3.3 70B | Q4_K_M (partial GPU) | ~6 | ~22GB |

## Troubleshooting

### Common Issues and Solutions

**"CUDA out of memory"**
```bash
# Reduce GPU layers or use more aggressive quantization
--n-gpu-layers 40  # Offload fewer layers to GPU
# Or use a smaller quantization
# Q4_K_M → Q3_K_M or Q2_K
```

**"Model file not found"**
- Ensure the path to your GGUF file is correct
- For Ollama: try `ollama pull llama3.3:70b` explicitly
- For Hugging Face: verify you have access (Llama models require approval)

**Slow inference on CPU**
```bash
# Ensure you're using all CPU threads
--threads $(nproc)

# Use optimized quantization for CPU
# Q4_0 and Q5_0 are faster on CPU than K-quants
```

**Garbage output**
- Verify you're using the correct prompt template
- Check that the model file isn't corrupted (compare SHA256)
- Try a higher quantization level

**Ollama not using GPU**
```bash
# Check if Ollama detects your GPU
ollama ps
# Force GPU usage
CUDA_VISIBLE_DEVICES=0 ollama run llama3.3:70b
```

### Platform-Specific Notes

**macOS (Apple Silicon):**
- Ollama and llama.cpp both support Metal acceleration
- M3 Max with 128GB RAM can run 70B models effectively
- Memory bandwidth is the bottleneck, not compute

**Windows:**
- WSL2 is recommended for most tools
- Direct Windows support varies by tool
- Ensure CUDA drivers are installed in WSL2 if using GPU

**Linux:**
- Best overall performance and compatibility
- Ensure NVIDIA drivers and CUDA are properly installed
- Consider `nvidia-persistenced` for consistent GPU performance

## Complete Workflow Summary

Here's the recommended path for most users:

1. **Start with Ollama**: Fastest way to test if Llama 3 works for your use case
2. **Benchmark**: Measure quality and speed with your specific prompts
3. **Optimize**: Adjust quantization, context length, and GPU offloading
4. **Scale Up**: Move to vLLM or TGI for production serving
5. **Fine-tune**: Use LoRA/QLoRA to customize for your domain

## Conclusion

Running Llama 3 locally gives you complete control over your AI infrastructure. Whether you choose the simplicity of Ollama, the flexibility of llama.cpp, or the production-readiness of vLLM, you now have the tools to deploy powerful AI on your own terms.

The key is matching your hardware to the right model size and quantization level. Start small, benchmark thoroughly, and scale up as needed.

**Want to compare Llama 3 against other models?** Use our [comparison tool](/compare) to see how Llama 3 stacks up against GPT-4, Claude, Mistral, and more.

**Looking for the right model for your setup?** [Browse our model catalog](/models) filtered by hardware requirements, or [sign up for LLM Trust](/auth/sign-up) to get personalized recommendations based on your specific needs.
