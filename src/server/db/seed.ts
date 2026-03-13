import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

type LocalExecution = {
  format: "gguf" | "safetensors" | "pytorch" | "onnx";
  quantizations: string[];
  defaultQuantization: string;
  templateFormat?: "chatml" | "llama" | "mistral" | "alpaca" | "custom";
  recommendedRam: number;
  minRam: number;
  systemPrompt?: string;
  stopTokens?: string[];
  customTemplate?: string;
  eosToken?: string;
  bosToken?: string;
};

type ModelSeed = {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  architecture: string;
  parameterCount: string;
  contextLength: number;
  license: string;
  downloadUrl: string;
  category: string;
  tags: string[];
  status: string;
  isFeatured: boolean;
  downloadCount: number;
  localExecution: LocalExecution;
};

const models: ModelSeed[] = [
  // ============================================
  // META — LLaMA Family
  // ============================================
  {
    slug: "llama-3-405b",
    name: "LLaMA 3.1 405B",
    description: "Meta's largest open model with 405B parameters. State-of-the-art performance across reasoning, code, and multilingual tasks.",
    longDescription: "LLaMA 3.1 405B is the most capable openly available LLM to date. It rivals GPT-4 on many benchmarks while being fully open-weight. Supports 128K context length, function calling, and multilingual generation across 8 languages.",
    architecture: "llama",
    parameterCount: "405B",
    contextLength: 131072,
    license: "Llama 3.1 Community License",
    downloadUrl: "https://huggingface.co/meta-llama/Llama-3.1-405B",
    category: "text-generation",
    tags: ["open-source", "reasoning", "multilingual", "code", "128k-context"],
    status: "published",
    isFeatured: true,
    downloadCount: 2847563,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q6_K", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "llama",
      recommendedRam: 256,
      minRam: 192,
    },
  },
  {
    slug: "llama-3-70b",
    name: "LLaMA 3.1 70B",
    description: "Meta's 70B parameter model offering excellent performance with lower resource requirements than 405B.",
    longDescription: "LLaMA 3.1 70B provides a great balance between capability and efficiency. It excels at coding, math, and reasoning while being runnable on consumer hardware with sufficient RAM.",
    architecture: "llama",
    parameterCount: "70B",
    contextLength: 131072,
    license: "Llama 3.1 Community License",
    downloadUrl: "https://huggingface.co/meta-llama/Llama-3.1-70B-Instruct",
    category: "text-generation",
    tags: ["open-source", "reasoning", "code", "128k-context"],
    status: "published",
    isFeatured: true,
    downloadCount: 8934201,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q6_K", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "llama",
      recommendedRam: 48,
      minRam: 36,
    },
  },
  {
    slug: "llama-3-8b",
    name: "LLaMA 3.1 8B",
    description: "Compact yet capable 8B parameter model. Runs on consumer hardware while maintaining impressive performance.",
    longDescription: "LLaMA 3.1 8B is designed for efficiency without sacrificing quality. It supports 128K context and is ideal for local deployment on gaming PCs and laptops.",
    architecture: "llama",
    parameterCount: "8B",
    contextLength: 131072,
    license: "Llama 3.1 Community License",
    downloadUrl: "https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct",
    category: "text-generation",
    tags: ["open-source", "local-friendly", "128k-context", "efficient"],
    status: "published",
    isFeatured: true,
    downloadCount: 15672340,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q6_K", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "llama",
      recommendedRam: 8,
      minRam: 6,
    },
  },

  // ============================================
  // MISTRAL AI
  // ============================================
  {
    slug: "mistral-large-2",
    name: "Mistral Large 2",
    description: "Mistral's flagship 123B parameter model with strong multilingual and coding capabilities.",
    longDescription: "Mistral Large 2 (123B) is designed for complex reasoning, code generation, and multilingual tasks. It features a 128K context window and excels at instruction following.",
    architecture: "mistral",
    parameterCount: "123B",
    contextLength: 131072,
    license: "Mistral Research License",
    downloadUrl: "https://huggingface.co/mistralai/Mistral-Large-Instruct-2407",
    category: "text-generation",
    tags: ["open-source", "multilingual", "code", "reasoning", "128k-context"],
    status: "published",
    isFeatured: true,
    downloadCount: 1243567,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "mistral",
      recommendedRam: 80,
      minRam: 64,
    },
  },
  {
    slug: "mistral-7b-v3",
    name: "Mistral 7B v0.3",
    description: "Efficient 7B parameter model with sliding window attention. Excellent for local deployment.",
    longDescription: "Mistral 7B v0.3 is a powerful yet efficient model using grouped-query attention and sliding window attention. It outperforms LLaMA 2 13B on most benchmarks.",
    architecture: "mistral",
    parameterCount: "7B",
    contextLength: 32768,
    license: "Apache 2.0",
    downloadUrl: "https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3",
    category: "text-generation",
    tags: ["open-source", "local-friendly", "efficient", "apache-2.0"],
    status: "published",
    isFeatured: false,
    downloadCount: 9823451,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q6_K", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "mistral",
      recommendedRam: 6,
      minRam: 4,
    },
  },
  {
    slug: "mixtral-8x22b",
    name: "Mixtral 8x22B",
    description: "Sparse mixture-of-experts model with 141B total / 39B active parameters. Outstanding efficiency.",
    longDescription: "Mixtral 8x22B uses a sparse MoE architecture with 8 experts, activating only 2 per token. This provides the quality of a much larger model with the speed of a smaller one.",
    architecture: "mistral",
    parameterCount: "141B",
    contextLength: 65536,
    license: "Apache 2.0",
    downloadUrl: "https://huggingface.co/mistralai/Mixtral-8x22B-Instruct-v0.1",
    category: "text-generation",
    tags: ["open-source", "moe", "efficient", "apache-2.0", "code"],
    status: "published",
    isFeatured: true,
    downloadCount: 1876543,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "mistral",
      recommendedRam: 96,
      minRam: 72,
    },
  },

  // ============================================
  // QWEN (Alibaba)
  // ============================================
  {
    slug: "qwen-2-72b",
    name: "Qwen 2.5 72B",
    description: "Alibaba's flagship 72B model with exceptional coding and mathematical reasoning.",
    longDescription: "Qwen 2.5 72B is trained on 18T tokens and excels at coding, mathematics, and structured data tasks. It supports 128K context and 29+ languages.",
    architecture: "qwen",
    parameterCount: "72B",
    contextLength: 131072,
    license: "Apache 2.0",
    downloadUrl: "https://huggingface.co/Qwen/Qwen2.5-72B-Instruct",
    category: "text-generation",
    tags: ["open-source", "code", "math", "multilingual", "128k-context"],
    status: "published",
    isFeatured: true,
    downloadCount: 3456789,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q6_K", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 48,
      minRam: 40,
    },
  },
  {
    slug: "qwen-2-coder-32b",
    name: "Qwen 2.5 Coder 32B",
    description: "Specialized coding model from Alibaba with state-of-the-art code generation capabilities.",
    longDescription: "Qwen 2.5 Coder 32B is specifically trained for code generation, debugging, and explanation. It rivals GPT-4 on HumanEval and MBPP benchmarks.",
    architecture: "qwen",
    parameterCount: "32B",
    contextLength: 131072,
    license: "Apache 2.0",
    downloadUrl: "https://huggingface.co/Qwen/Qwen2.5-Coder-32B-Instruct",
    category: "code",
    tags: ["open-source", "code", "coding-specialist", "128k-context"],
    status: "published",
    isFeatured: true,
    downloadCount: 2134567,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q6_K", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 24,
      minRam: 20,
    },
  },
  {
    slug: "qwen-2-7b",
    name: "Qwen 2.5 7B",
    description: "Compact Qwen model with strong performance for its size. Great for local deployment.",
    longDescription: "Qwen 2.5 7B punches above its weight with excellent instruction following and multilingual capabilities. Perfect for resource-constrained environments.",
    architecture: "qwen",
    parameterCount: "7B",
    contextLength: 131072,
    license: "Apache 2.0",
    downloadUrl: "https://huggingface.co/Qwen/Qwen2.5-7B-Instruct",
    category: "text-generation",
    tags: ["open-source", "local-friendly", "efficient", "128k-context"],
    status: "published",
    isFeatured: false,
    downloadCount: 7654321,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q6_K", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 8,
      minRam: 6,
    },
  },

  // ============================================
  // GOOGLE — Gemma
  // ============================================
  {
    slug: "gemma-2-27b",
    name: "Gemma 2 27B",
    description: "Google's powerful 27B model with knowledge distillation from Gemini. Excellent quality.",
    longDescription: "Gemma 2 27B uses knowledge distillation from larger Gemini models to achieve remarkable performance. It features sliding window attention and soft capping for stable training.",
    architecture: "gemma",
    parameterCount: "27B",
    contextLength: 8192,
    license: "Gemma Terms of Use",
    downloadUrl: "https://huggingface.co/google/gemma-2-27b-it",
    category: "text-generation",
    tags: ["open-source", "google", "reasoning", "knowledge-distillation"],
    status: "published",
    isFeatured: true,
    downloadCount: 2345678,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q6_K", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 20,
      minRam: 16,
    },
  },
  {
    slug: "gemma-2-9b",
    name: "Gemma 2 9B",
    description: "Efficient 9B model from Google with strong reasoning. Fits on most modern GPUs.",
    longDescription: "Gemma 2 9B offers a sweet spot between performance and efficiency. It outperforms models twice its size on several benchmarks thanks to knowledge distillation.",
    architecture: "gemma",
    parameterCount: "9B",
    contextLength: 8192,
    license: "Gemma Terms of Use",
    downloadUrl: "https://huggingface.co/google/gemma-2-9b-it",
    category: "text-generation",
    tags: ["open-source", "google", "efficient", "local-friendly"],
    status: "published",
    isFeatured: false,
    downloadCount: 4567890,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q6_K", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 10,
      minRam: 8,
    },
  },
  {
    slug: "gemma-2-2b",
    name: "Gemma 2 2B",
    description: "Ultra-lightweight 2B model. Runs on phones and edge devices.",
    longDescription: "Gemma 2 2B is designed for edge deployment. Despite its tiny size, it delivers surprisingly good results for simple tasks, chat, and summarization.",
    architecture: "gemma",
    parameterCount: "2B",
    contextLength: 8192,
    license: "Gemma Terms of Use",
    downloadUrl: "https://huggingface.co/google/gemma-2-2b-it",
    category: "text-generation",
    tags: ["open-source", "google", "edge", "mobile", "ultra-light"],
    status: "published",
    isFeatured: false,
    downloadCount: 6789012,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 4,
      minRam: 3,
    },
  },

  // ============================================
  // DEEPSEEK
  // ============================================
  {
    slug: "deepseek-v3",
    name: "DeepSeek V3",
    description: "DeepSeek's 671B MoE model with 37B active parameters. Matches GPT-4o on many benchmarks.",
    longDescription: "DeepSeek V3 uses a Mixture-of-Experts architecture with auxiliary-loss-free load balancing. Trained on 14.8T tokens with multi-token prediction, it achieves state-of-the-art performance.",
    architecture: "deepseek",
    parameterCount: "671B",
    contextLength: 131072,
    license: "DeepSeek License",
    downloadUrl: "https://huggingface.co/deepseek-ai/DeepSeek-V3",
    category: "text-generation",
    tags: ["open-source", "moe", "reasoning", "code", "128k-context"],
    status: "published",
    isFeatured: true,
    downloadCount: 1567890,
    localExecution: {
      format: "safetensors",
      quantizations: ["FP8", "Q4_K_M", "Q5_K_M"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 384,
      minRam: 256,
    },
  },
  {
    slug: "deepseek-coder-v2",
    name: "DeepSeek Coder V2",
    description: "236B MoE coding model that rivals GPT-4 Turbo on code tasks.",
    longDescription: "DeepSeek Coder V2 is a 236B MoE model (21B active) specialized for code. It supports 338 programming languages and 128K context for large codebases.",
    architecture: "deepseek",
    parameterCount: "236B",
    contextLength: 131072,
    license: "DeepSeek License",
    downloadUrl: "https://huggingface.co/deepseek-ai/DeepSeek-Coder-V2-Instruct",
    category: "code",
    tags: ["open-source", "code", "moe", "coding-specialist", "128k-context"],
    status: "published",
    isFeatured: true,
    downloadCount: 987654,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 160,
      minRam: 128,
    },
  },

  // ============================================
  // CODE MODELS
  // ============================================
  {
    slug: "code-llama-70b",
    name: "Code Llama 70B",
    description: "Meta's code-specialized 70B model. Fine-tuned from LLaMA 2 for programming tasks.",
    longDescription: "Code Llama 70B is fine-tuned on 500B tokens of code. It excels at code generation, infilling, and instruction following for programming tasks across many languages.",
    architecture: "llama",
    parameterCount: "70B",
    contextLength: 16384,
    license: "Llama 2 Community License",
    downloadUrl: "https://huggingface.co/codellama/CodeLlama-70b-Instruct-hf",
    category: "code",
    tags: ["open-source", "code", "coding-specialist", "meta"],
    status: "published",
    isFeatured: false,
    downloadCount: 1234567,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "llama",
      recommendedRam: 48,
      minRam: 40,
    },
  },
  {
    slug: "starcoder2-15b",
    name: "StarCoder2 15B",
    description: "BigCode's 15B code model trained on 600+ programming languages.",
    longDescription: "StarCoder2 15B is trained on The Stack v2 dataset covering 619 programming languages. It features fill-in-the-middle capability and supports 16K context.",
    architecture: "starcoder",
    parameterCount: "15B",
    contextLength: 16384,
    license: "BigCode OpenRAIL-M",
    downloadUrl: "https://huggingface.co/bigcode/starcoder2-15b-instruct",
    category: "code",
    tags: ["open-source", "code", "fill-in-middle", "multilingual-code"],
    status: "published",
    isFeatured: false,
    downloadCount: 456789,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 12,
      minRam: 10,
    },
  },

  // ============================================
  // PHI (Microsoft)
  // ============================================
  {
    slug: "phi-3-mini",
    name: "Phi 3.5 Mini",
    description: "Microsoft's 3.8B parameter model that punches far above its weight class.",
    longDescription: "Phi 3.5 Mini achieves performance comparable to models 10x its size. Trained on high-quality synthetic and web data, it excels at reasoning and coding.",
    architecture: "phi",
    parameterCount: "3.8B",
    contextLength: 131072,
    license: "MIT",
    downloadUrl: "https://huggingface.co/microsoft/Phi-3.5-mini-instruct",
    category: "text-generation",
    tags: ["open-source", "tiny-but-mighty", "efficient", "mit-license", "128k-context"],
    status: "published",
    isFeatured: true,
    downloadCount: 5678901,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 4,
      minRam: 3,
    },
  },
  {
    slug: "phi-3-medium",
    name: "Phi 3 Medium",
    description: "Microsoft's 14B parameter model with excellent reasoning capabilities.",
    longDescription: "Phi 3 Medium (14B) bridges the gap between tiny and large models. It offers strong reasoning and coding performance with moderate resource requirements.",
    architecture: "phi",
    parameterCount: "14B",
    contextLength: 131072,
    license: "MIT",
    downloadUrl: "https://huggingface.co/microsoft/Phi-3-medium-128k-instruct",
    category: "text-generation",
    tags: ["open-source", "reasoning", "mit-license", "128k-context"],
    status: "published",
    isFeatured: false,
    downloadCount: 2345678,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 12,
      minRam: 10,
    },
  },

  // ============================================
  // YI (01.AI)
  // ============================================
  {
    slug: "yi-1.5-34b",
    name: "Yi 1.5 34B",
    description: "01.AI's 34B parameter model with strong bilingual (EN/CN) capabilities.",
    longDescription: "Yi 1.5 34B is trained on 3.1T tokens with a focus on bilingual English-Chinese performance. It excels at reasoning, coding, and math.",
    architecture: "yi",
    parameterCount: "34B",
    contextLength: 4096,
    license: "Apache 2.0",
    downloadUrl: "https://huggingface.co/01-ai/Yi-1.5-34B-Chat",
    category: "text-generation",
    tags: ["open-source", "bilingual", "chinese", "reasoning"],
    status: "published",
    isFeatured: false,
    downloadCount: 876543,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 24,
      minRam: 20,
    },
  },

  // ============================================
  // COMMAND R (Cohere)
  // ============================================
  {
    slug: "command-r-plus",
    name: "Command R+",
    description: "Cohere's 104B parameter model optimized for RAG and tool use.",
    longDescription: "Command R+ is designed for production RAG applications with strong tool use and multilingual capabilities. It excels at grounded generation with citations.",
    architecture: "command-r",
    parameterCount: "104B",
    contextLength: 131072,
    license: "CC-BY-NC-4.0",
    downloadUrl: "https://huggingface.co/CohereForAI/c4ai-command-r-plus",
    category: "text-generation",
    tags: ["open-source", "rag", "tool-use", "multilingual", "128k-context"],
    status: "published",
    isFeatured: false,
    downloadCount: 654321,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 72,
      minRam: 56,
    },
  },
  {
    slug: "command-r",
    name: "Command R",
    description: "Cohere's 35B model for RAG, summarization, and tool use.",
    longDescription: "Command R (35B) is optimized for conversational AI with tool use and RAG capabilities. It offers a good balance of quality and efficiency.",
    architecture: "command-r",
    parameterCount: "35B",
    contextLength: 131072,
    license: "CC-BY-NC-4.0",
    downloadUrl: "https://huggingface.co/CohereForAI/c4ai-command-r-v01",
    category: "text-generation",
    tags: ["open-source", "rag", "tool-use", "multilingual"],
    status: "published",
    isFeatured: false,
    downloadCount: 543210,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 28,
      minRam: 24,
    },
  },

  // ============================================
  // FALCON (TII)
  // ============================================
  {
    slug: "falcon-180b",
    name: "Falcon 180B",
    description: "TII's massive 180B model trained on 3.5T tokens of RefinedWeb data.",
    longDescription: "Falcon 180B is one of the largest open-source models. Trained primarily on web data, it performs well across general language tasks and reasoning.",
    architecture: "falcon",
    parameterCount: "180B",
    contextLength: 2048,
    license: "Falcon-180B TII License",
    downloadUrl: "https://huggingface.co/tiiuae/falcon-180B-chat",
    category: "text-generation",
    tags: ["open-source", "massive", "reasoning"],
    status: "published",
    isFeatured: false,
    downloadCount: 432109,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "custom",
      recommendedRam: 128,
      minRam: 96,
    },
  },

  // ============================================
  // VISION / MULTIMODAL
  // ============================================
  {
    slug: "llava-1.6-34b",
    name: "LLaVA 1.6 34B",
    description: "Large vision-language model combining LLaMA with visual understanding.",
    longDescription: "LLaVA 1.6 34B processes images alongside text for visual question answering, image captioning, and visual reasoning. Built on Yi-34B.",
    architecture: "llava",
    parameterCount: "34B",
    contextLength: 4096,
    license: "Apache 2.0",
    downloadUrl: "https://huggingface.co/liuhaotian/llava-v1.6-34b",
    category: "vision",
    tags: ["open-source", "multimodal", "vision", "image-understanding"],
    status: "published",
    isFeatured: true,
    downloadCount: 1234567,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 28,
      minRam: 24,
    },
  },
  {
    slug: "qwen-2-vl-7b",
    name: "Qwen2-VL 7B",
    description: "Alibaba's compact vision-language model with strong image and video understanding.",
    longDescription: "Qwen2-VL 7B understands images and videos alongside text. It supports dynamic resolution and can process any resolution without fixed-size constraints.",
    architecture: "qwen",
    parameterCount: "7B",
    contextLength: 32768,
    license: "Apache 2.0",
    downloadUrl: "https://huggingface.co/Qwen/Qwen2-VL-7B-Instruct",
    category: "vision",
    tags: ["open-source", "multimodal", "vision", "video", "local-friendly"],
    status: "published",
    isFeatured: false,
    downloadCount: 2345678,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 10,
      minRam: 8,
    },
  },

  // ============================================
  // EMBEDDING MODELS
  // ============================================
  {
    slug: "bge-large-en-v1.5",
    name: "BGE Large EN v1.5",
    description: "BAAI's high-performance English text embedding model. Top of MTEB leaderboard.",
    longDescription: "BGE Large EN v1.5 produces 1024-dimensional embeddings optimized for retrieval. It's one of the best open-source embedding models for RAG applications.",
    architecture: "bert",
    parameterCount: "335M",
    contextLength: 512,
    license: "MIT",
    downloadUrl: "https://huggingface.co/BAAI/bge-large-en-v1.5",
    category: "embedding",
    tags: ["open-source", "embedding", "retrieval", "rag", "mit-license"],
    status: "published",
    isFeatured: false,
    downloadCount: 3456789,
    localExecution: {
      format: "onnx",
      quantizations: ["FP32", "FP16", "INT8"],
      defaultQuantization: "FP16",
      recommendedRam: 2,
      minRam: 1,
    },
  },
  {
    slug: "gte-qwen2-7b",
    name: "GTE-Qwen2 7B",
    description: "Alibaba's top-performing 7B multilingual embedding model.",
    longDescription: "GTE-Qwen2 7B produces high-quality multilingual embeddings. It leads the MTEB and C-MTEB benchmarks for text retrieval and semantic similarity.",
    architecture: "qwen",
    parameterCount: "7B",
    contextLength: 32768,
    license: "Apache 2.0",
    downloadUrl: "https://huggingface.co/Alibaba-NLP/gte-Qwen2-7B-instruct",
    category: "embedding",
    tags: ["open-source", "embedding", "multilingual", "retrieval", "rag"],
    status: "published",
    isFeatured: true,
    downloadCount: 1567890,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 8,
      minRam: 6,
    },
  },

  // ============================================
  // MATH & REASONING
  // ============================================
  {
    slug: "wizardmath-70b",
    name: "WizardMath 70B",
    description: "Math-specialized LLaMA 2 70B fine-tuned with RLHF for mathematical reasoning.",
    longDescription: "WizardMath 70B is specifically trained for mathematical problem solving using Evol-Instruct and RLHF. It achieves strong results on GSM8K and MATH benchmarks.",
    architecture: "llama",
    parameterCount: "70B",
    contextLength: 4096,
    license: "Llama 2 Community License",
    downloadUrl: "https://huggingface.co/WizardLM/WizardMath-70B-V1.0",
    category: "text-generation",
    tags: ["open-source", "math", "reasoning", "specialized"],
    status: "published",
    isFeatured: false,
    downloadCount: 765432,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "llama",
      recommendedRam: 48,
      minRam: 40,
    },
  },

  // ============================================
  // NEWER / TRENDING MODELS
  // ============================================
  {
    slug: "llama-3-3b",
    name: "LLaMA 3.2 3B",
    description: "Meta's lightweight 3B model for edge and mobile deployment.",
    longDescription: "LLaMA 3.2 3B brings LLaMA 3 quality to edge devices. It supports 128K context and is optimized for on-device inference with strong instruction following.",
    architecture: "llama",
    parameterCount: "3B",
    contextLength: 131072,
    license: "Llama 3.2 Community License",
    downloadUrl: "https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct",
    category: "text-generation",
    tags: ["open-source", "edge", "mobile", "efficient", "128k-context"],
    status: "published",
    isFeatured: true,
    downloadCount: 4567890,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "llama",
      recommendedRam: 4,
      minRam: 3,
    },
  },
  {
    slug: "llama-3-11b-vision",
    name: "LLaMA 3.2 11B Vision",
    description: "Meta's multimodal model with vision capabilities. 11B parameters.",
    longDescription: "LLaMA 3.2 11B Vision adds image understanding to the LLaMA 3.2 family. It can reason about images, answer visual questions, and understand charts and diagrams.",
    architecture: "llama",
    parameterCount: "11B",
    contextLength: 131072,
    license: "Llama 3.2 Community License",
    downloadUrl: "https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct",
    category: "vision",
    tags: ["open-source", "multimodal", "vision", "reasoning", "128k-context"],
    status: "published",
    isFeatured: true,
    downloadCount: 2345678,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "llama",
      recommendedRam: 12,
      minRam: 10,
    },
  },
  {
    slug: "granite-3-8b",
    name: "Granite 3.1 8B",
    description: "IBM's enterprise-grade 8B model with strong reasoning and code capabilities.",
    longDescription: "Granite 3.1 8B is IBM's open-source model trained for enterprise use. It features strong instruction following, code generation, and tool use capabilities.",
    architecture: "granite",
    parameterCount: "8B",
    contextLength: 131072,
    license: "Apache 2.0",
    downloadUrl: "https://huggingface.co/ibm-granite/granite-3.1-8b-instruct",
    category: "text-generation",
    tags: ["open-source", "enterprise", "reasoning", "code", "tool-use"],
    status: "published",
    isFeatured: false,
    downloadCount: 345678,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 8,
      minRam: 6,
    },
  },
  {
    slug: "smollm2-1.7b",
    name: "SmolLM2 1.7B",
    description: "HuggingFace's ultra-compact 1.7B model. Best-in-class for its size.",
    longDescription: "SmolLM2 1.7B is trained on 11T tokens of curated data. Despite its tiny size, it outperforms larger models on many tasks and is perfect for resource-constrained environments.",
    architecture: "smollm",
    parameterCount: "1.7B",
    contextLength: 8192,
    license: "Apache 2.0",
    downloadUrl: "https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B-Instruct",
    category: "text-generation",
    tags: ["open-source", "tiny", "efficient", "edge", "apache-2.0"],
    status: "published",
    isFeatured: false,
    downloadCount: 1234567,
    localExecution: {
      format: "gguf",
      quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
      defaultQuantization: "Q4_K_M",
      templateFormat: "chatml",
      recommendedRam: 3,
      minRam: 2,
    },
  },
];

async function seed() {
  console.log("🌱 Seeding database with LLM models...");

  // Clear existing models
  console.log("  Clearing existing models...");
  await db.delete(schema.model);

  // Insert models
  console.log(`  Inserting ${models.length} models...`);
  for (const m of models) {
    await db.insert(schema.model).values({
      slug: m.slug,
      name: m.name,
      description: m.description,
      longDescription: m.longDescription,
      architecture: m.architecture,
      parameterCount: m.parameterCount,
      contextLength: m.contextLength,
      license: m.license,
      downloadUrl: m.downloadUrl,
      downloadCount: m.downloadCount,
      category: m.category,
      tags: m.tags,
      status: m.status,
      isFeatured: m.isFeatured,
      localExecution: m.localExecution,
      metaTitle: `${m.name} — LLM Trust`,
      metaDescription: m.description,
    });
    console.log(`  ✓ ${m.name}`);
  }

  console.log(`\n✅ Seeded ${models.length} models successfully!`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
