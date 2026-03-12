import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Download, Star } from "lucide-react";

interface ModelCardProps {
  model: {
    slug: string;
    name: string;
    description: string;
    parameterCount: string | null;
    architecture: string | null;
    category: string | null;
    downloadCount: number;
    license: string | null;
    tags: string[];
  };
}

const badgeDescriptions: Record<string, string> = {
  // Architecture descriptions
  llama:
    "Meta's Llama architecture — decoder-only transformer optimized for efficiency.",
  mistral:
    "Mistral's sliding-window attention architecture — fast inference with strong performance.",
  qwen:
    "Alibaba's Qwen architecture — multilingual with strong reasoning capabilities.",
  phi: "Microsoft's Phi architecture — small but mighty models trained on curated data.",
  gemma: "Google's Gemma architecture — lightweight models based on Gemini research.",
  deepseek:
    "DeepSeek's MoE architecture — mixture of experts for efficient large-scale models.",
  gpt: "GPT-style decoder-only transformer — the foundational autoregressive architecture.",
  falcon: "TII's Falcon architecture — refined transformer with multi-query attention.",
  "command-r": "Cohere's Command-R architecture — optimized for RAG and tool use.",
  yi: "01.AI's Yi architecture — high-performance multilingual models.",
  // License descriptions
  "Apache 2.0":
    "Permissive license — free for commercial use, modification, and distribution.",
  MIT: "Very permissive — use freely with minimal restrictions.",
  "Llama 2 Community":
    "Meta's community license for Llama 2 — free for research and commercial use under 700M MAU.",
  "Llama 3 Community":
    "Meta's community license for Llama 3 — permissive with broad commercial usage rights.",
  "Mistral AI": "Mistral's model license — check terms for commercial usage.",
  "CC BY 4.0":
    "Creative Commons Attribution — free to use with credit required.",
  "CC BY-NC 4.0":
    "Creative Commons Non-Commercial — free for research and personal use only.",
  "OpenRAIL-M":
    "Responsible AI License — permissive with ethical use restrictions.",
  "GPL 3.0":
    "Copyleft license — derivative works must also be open-source.",
  Custom: "Custom license — check the model page for specific terms.",
};

// Generic category descriptions
const categoryInfo: Record<string, string> = {
  "text-generation":
    "General-purpose text generation — writing, chat, summarization.",
  code: "Optimized for code generation, completion, and programming tasks.",
  vision: "Multimodal model — can process images alongside text.",
  embedding: "Converts text to vectors for semantic search and RAG pipelines.",
  chat: "Fine-tuned for conversational interactions and chat interfaces.",
  instruction: "Trained to follow instructions and complete tasks.",
  summarization: "Specialized for condensing long documents into summaries.",
  translation: "Optimized for translating text between languages.",
};

export function ModelCard({ model }: ModelCardProps) {
  return (
    <Link href={`/models/${model.slug}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg line-clamp-1">{model.name}</CardTitle>
            {model.parameterCount && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="secondary" className="shrink-0">
                    {model.parameterCount}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>
                    {model.parameterCount} parameters — larger models are
                    generally more capable but require more compute.
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {model.description}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {model.architecture && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="text-xs">
                    {model.architecture}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>
                    {badgeDescriptions[model.architecture.toLowerCase()] ??
                      `${model.architecture} architecture — the underlying model design and training approach.`}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
            {model.category && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="text-xs">
                    {model.category}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>
                    {categoryInfo[model.category] ??
                      `${model.category} — primary use case for this model.`}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
            {model.license && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="text-xs">
                    {model.license}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>
                    {badgeDescriptions[model.license] ??
                      `${model.license} license — governs how you can use this model.`}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {model.downloadCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {model.tags.length} tags
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
