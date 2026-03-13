# Technical FAQ

## What is GGUF?

GGUF (GPT-Generated Unified Format) is a file format designed for storing and distributing large language models efficiently. Developed as the successor to the older GGML format, GGUF was created by the llama.cpp project to provide a standardized, extensible format that works across different inference engines and hardware platforms. It packages model weights, metadata, and tokenizer information into a single self-contained file.

The key advantage of GGUF is its support for quantization — the ability to compress model weights to lower precision levels, dramatically reducing file size and memory requirements without catastrophic quality loss. A model that might require 26 GB in full precision could be reduced to 4-6 GB with aggressive quantization, making it possible to run powerful models on consumer hardware including laptops and desktop GPUs. GGUF has become the de facto standard for local LLM deployment.

## What is context length?

Context length refers to the maximum number of tokens a language model can process in a single interaction, including both your input (prompt) and the model's generated output. It determines how much information the model can "remember" and reason about at once. A model with a 4,096-token context can process roughly 3,000 words of text in one go, while models with 128K or larger contexts can handle entire books or large codebases.

Context length is a critical specification because it directly affects what you can do with a model. Short context windows limit the model to brief conversations or small documents, while longer contexts enable complex tasks like analyzing lengthy reports, maintaining extended conversations, or processing large code files. On LLM Trust, you'll find context length clearly listed on every model page, and you can filter models by this attribute when searching. Be aware that longer contexts typically require more memory and can slow down generation speed.

## What are parameters?

Parameters are the learned weights inside a neural network — the numerical values that are adjusted during training to encode the model's knowledge and capabilities. The total number of parameters is a rough indicator of a model's complexity and capacity. Models are often described by their parameter count: a 7B model has approximately 7 billion parameters, while a 70B model has 70 billion, and a 405B model has 405 billion.

More parameters generally means the model can capture more nuanced patterns in language, leading to better reasoning, more accurate responses, and broader knowledge. However, more parameters also mean larger file sizes, higher memory requirements, and slower inference. The "best" model isn't always the largest one — a well-trained 7B model can outperform a poorly trained 70B model on many tasks. On LLM Trust, you can filter and sort models by parameter count to find options that match your hardware capabilities and performance needs.

## What benchmarks do you use?

LLM Trust aggregates benchmark results from several widely recognized evaluation frameworks used across the AI research community. These include MMLU (Massive Multitask Language Understanding) for general knowledge, HumanEval and MBPP for coding ability, HellaSwag and ARC for reasoning, TruthfulQA for factual accuracy, and GSM8K for mathematical problem solving. We also track newer benchmarks as they emerge and gain community adoption.

We display benchmark results transparently, clearly indicating the source of each score, the evaluation conditions, and any relevant caveats. Benchmark scores can vary based on evaluation methodology, prompting strategy, and quantization level, so we provide this context alongside raw numbers. Where possible, we link to the original evaluation results and papers. We believe benchmarks are useful directional indicators but should be considered alongside other factors like inference speed, memory efficiency, and real-world user feedback when making model selection decisions.

## How do I run a model locally?

Running a model locally depends on your hardware and the model's requirements, but the general process is straightforward. First, download a GGUF-quantized version of your chosen model from LLM Trust's download links. Then, install a compatible inference engine — popular options include llama.cpp (command-line), Ollama (simplified local server), LM Studio (graphical interface), or GPT4All (all-in-one desktop app). Most of these tools work on macOS, Windows, and Linux.

For the best experience, we recommend having at least 16 GB of RAM for 7B models, 32 GB for 13B models, and 64 GB or more for larger models. If you have a dedicated GPU with sufficient VRAM, inference will be significantly faster. On each model's detail page on LLM Trust, you'll find recommended minimum hardware specs, step-by-step quick-start guides for popular tools, and community tips for optimizing performance on specific hardware configurations. Start with a smaller, well-quantized model to verify your setup works before moving to larger models.
