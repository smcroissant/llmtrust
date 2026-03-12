"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Stepper } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GlowCard,
  GlowCardContent,
  GlowCardHeader,
  GlowCardTitle,
} from "@/components/ui/glow-card";
import { ModelCard } from "@/components/models/model-card";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

// ============================================
// ZOD SCHEMA
// ============================================

const uploadSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  longDescription: z.string().optional().default(""),
  architecture: z.string().optional().default(""),
  parameterCount: z.string().optional().default(""),
  contextLength: z.union([z.coerce.number().int().positive(), z.literal("")]).optional(),
  license: z.string().optional().default(""),
  category: z.string().optional().default(""),
  downloadUrl: z.string().url("Must be a valid URL (https://...)"),
  tags: z.array(z.string()).default([]),
  format: z.enum(["gguf", "safetensors", "pytorch", "onnx"]).optional(),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

// ============================================
// CONSTANTS
// ============================================

const STEPS = [
  { title: "Basic Info", description: "Name, slug & description" },
  { title: "Technical", description: "Architecture & specs" },
  { title: "Links", description: "HuggingFace URL" },
  { title: "Details", description: "Tags & format" },
  { title: "Preview", description: "Review before submit" },
];

const ARCHITECTURES = [
  "llama",
  "mistral",
  "gpt",
  "falcon",
  "qwen",
  "phi",
  "gemma",
  "command-r",
  "deepseek",
  "yi",
  "mpt",
  "bloom",
  "other",
];

const LICENSES = [
  "Apache 2.0",
  "MIT",
  "Llama 2 Community",
  "Llama 3 Community",
  "Mistral AI",
  "CC BY 4.0",
  "CC BY-NC 4.0",
  "OpenRAIL-M",
  "GPL 3.0",
  "Custom",
];

const CATEGORIES = [
  "text-generation",
  "code",
  "vision",
  "embedding",
  "chat",
  "instruction",
  "summarization",
  "translation",
];

const SUGGESTED_TAGS = [
  "open-source",
  "fine-tuned",
  "quantized",
  "gguf",
  "chat",
  "coding",
  "multilingual",
  "reasoning",
  "small-model",
  "large-model",
  "instruction-tuned",
  "rlhf",
];

// ============================================
// HELPERS
// ============================================

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function UploadModelPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  const createModel = trpc.models.create.useMutation({
    onSuccess: (data) => {
      router.push(`/models/upload/success?slug=${data.slug}`);
    },
    onError: (error) => {
      setStepErrors({ submit: error.message });
      setIsSubmitting(false);
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema) as never,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      longDescription: "",
      architecture: "",
      parameterCount: "",
      contextLength: undefined,
      license: "",
      category: "",
      downloadUrl: "",
      tags: [],
      format: undefined,
    },
    mode: "onChange",
  });

  const watchedValues = watch();

  // Auto-generate slug from name
  useEffect(() => {
    if (watchedValues.name) {
      setValue("slug", generateSlug(watchedValues.name));
    }
  }, [watchedValues.name, setValue]);

  // Sync tags
  useEffect(() => {
    setValue("tags", selectedTags);
  }, [selectedTags, setValue]);

  // Auth guard
  useEffect(() => {
    if (!sessionLoading && !session) {
      router.push("/auth/sign-in?redirect=/models/upload");
    }
  }, [session, sessionLoading, router]);

  const addTag = useCallback(
    (tag: string) => {
      const normalized = tag.toLowerCase().trim();
      if (normalized && !selectedTags.includes(normalized) && selectedTags.length < 10) {
        setSelectedTags((prev) => [...prev, normalized]);
        setTagInput("");
      }
    },
    [selectedTags],
  );

  const removeTag = useCallback((tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  // Step validation
  const validateStep = async (step: number): Promise<boolean> => {
    setStepErrors({});
    const fieldsToValidate: (keyof UploadFormValues)[][] = [
      ["name", "slug", "description"], // Step 0: Basic Info
      [], // Step 1: Technical (all optional)
      ["downloadUrl"], // Step 2: Links
      [], // Step 3: Details (all optional)
      [], // Step 4: Preview
    ];

    if (fieldsToValidate[step].length > 0) {
      const result = await trigger(fieldsToValidate[step]);
      if (!result) return false;
    }

    return true;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
      setStepErrors({});
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setStepErrors({});
    }
  };

  const onSubmit = async (data: UploadFormValues) => {
    setIsSubmitting(true);
    setStepErrors({});

    const contextLength =
      typeof data.contextLength === "number" && data.contextLength > 0
        ? data.contextLength
        : undefined;

    createModel.mutate({
      name: data.name,
      slug: data.slug,
      description: data.description,
      longDescription: data.longDescription || undefined,
      architecture: data.architecture || undefined,
      parameterCount: data.parameterCount || undefined,
      contextLength,
      license: data.license || undefined,
      category: data.category || undefined,
      downloadUrl: data.downloadUrl,
      tags: selectedTags,
      format: data.format || undefined,
    });
  };

  if (sessionLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="size-5 text-primary" />
          <h1 className="text-2xl font-bold">Upload a Model</h1>
        </div>
        <p className="text-muted-foreground">
          Submit an open-source LLM to the community. All uploads are reviewed before publication.
        </p>
      </div>

      {/* Stepper */}
      <Stepper steps={STEPS} currentStep={currentStep} className="mb-10" />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit as never)}>
        <GlowCard noGlow>
          <GlowCardHeader>
            <GlowCardTitle>{STEPS[currentStep].title}</GlowCardTitle>
          </GlowCardHeader>
          <GlowCardContent className="space-y-6">
            {/* ---- STEP 0: Basic Info ---- */}
            {currentStep === 0 && (
              <div className="space-y-5 animate-fade-up">
                <div className="space-y-2">
                  <Label htmlFor="name">Model Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Llama 3 8B Instruct"
                    {...register("name")}
                    className="focus-glow"
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (auto-generated)</Label>
                  <Input
                    id="slug"
                    placeholder="llama-3-8b-instruct"
                    {...register("slug")}
                    className="focus-glow font-mono text-sm"
                  />
                  {errors.slug && (
                    <p className="text-xs text-destructive">{errors.slug.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="A concise description of what this model does (max 500 chars)"
                    rows={3}
                    {...register("description")}
                    className="focus-glow resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    {watchedValues.description?.length ?? 0}/500
                  </p>
                  {errors.description && (
                    <p className="text-xs text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longDescription">Long Description (optional)</Label>
                  <Textarea
                    id="longDescription"
                    placeholder="Detailed description, capabilities, benchmarks, use cases..."
                    rows={5}
                    {...register("longDescription")}
                    className="focus-glow resize-none"
                  />
                </div>
              </div>
            )}

            {/* ---- STEP 1: Technical ---- */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fade-up">
                <div className="space-y-2">
                  <Label htmlFor="architecture">Architecture</Label>
                  <Select
                    value={watchedValues.architecture || ""}
                    onValueChange={(value) => setValue("architecture", (value ?? "") as string)}
                  >
                    <SelectTrigger className="w-full focus-glow">
                      <SelectValue placeholder="Select architecture" />
                    </SelectTrigger>
                    <SelectContent>
                      {ARCHITECTURES.map((arch) => (
                        <SelectItem key={arch} value={arch}>
                          {arch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parameterCount">Parameter Count</Label>
                    <Input
                      id="parameterCount"
                      placeholder="e.g., 7B, 70B, 8x7B"
                      {...register("parameterCount")}
                      className="focus-glow"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contextLength">Context Length</Label>
                    <Input
                      id="contextLength"
                      type="number"
                      placeholder="e.g., 4096, 8192, 32768"
                      {...register("contextLength")}
                      className="focus-glow"
                    />
                    {errors.contextLength && (
                      <p className="text-xs text-destructive">
                        {errors.contextLength.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license">License</Label>
                  <Select
                    value={watchedValues.license || ""}
                    onValueChange={(value) => setValue("license", (value ?? "") as string)}
                  >
                    <SelectTrigger className="w-full focus-glow">
                      <SelectValue placeholder="Select license" />
                    </SelectTrigger>
                    <SelectContent>
                      {LICENSES.map((lic) => (
                        <SelectItem key={lic} value={lic}>
                          {lic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={watchedValues.category || ""}
                    onValueChange={(value) => setValue("category", (value ?? "") as string)}
                  >
                    <SelectTrigger className="w-full focus-glow">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* ---- STEP 2: Links ---- */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fade-up">
                <div className="space-y-2">
                  <Label htmlFor="downloadUrl">HuggingFace URL *</Label>
                  <Input
                    id="downloadUrl"
                    type="url"
                    placeholder="https://huggingface.co/username/model-name"
                    {...register("downloadUrl")}
                    className="focus-glow"
                  />
                  <p className="text-xs text-muted-foreground">
                    Link to the model on HuggingFace. We don&apos;t host models — users will be redirected to download from HuggingFace.
                  </p>
                  {errors.downloadUrl && (
                    <p className="text-xs text-destructive">{errors.downloadUrl.message}</p>
                  )}
                </div>

                {/* URL preview */}
                {watchedValues.downloadUrl && (
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Preview</p>
                    <a
                      href={watchedValues.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline break-all"
                    >
                      {watchedValues.downloadUrl}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* ---- STEP 3: Details ---- */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fade-up">
                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select
                    value={watchedValues.format || ""}
                    onValueChange={(value) =>
                      setValue("format", (value ?? undefined) as UploadFormValues["format"])
                    }
                  >
                    <SelectTrigger className="w-full focus-glow">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gguf">GGUF</SelectItem>
                      <SelectItem value="safetensors">Safetensors</SelectItem>
                      <SelectItem value="pytorch">PyTorch</SelectItem>
                      <SelectItem value="onnx">ONNX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="gap-1 cursor-pointer hover:bg-destructive/10"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <X className="size-3" />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      className="focus-glow"
                      disabled={selectedTags.length >= 10}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addTag(tagInput)}
                      disabled={!tagInput.trim() || selectedTags.length >= 10}
                    >
                      <Tag className="size-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedTags.length}/10 tags — Press Enter or comma to add
                  </p>

                  {/* Suggested tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {SUGGESTED_TAGS.filter((t) => !selectedTags.includes(t))
                      .slice(0, 8)
                      .map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary/10 text-xs"
                          onClick={() => addTag(tag)}
                        >
                          + {tag}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* ---- STEP 4: Preview ---- */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-up">
                <p className="text-sm text-muted-foreground">
                  This is how your model card will appear on the platform:
                </p>

                {/* Preview card */}
                <div className="max-w-sm">
                  <ModelCard
                    model={{
                      slug: watchedValues.slug || "preview",
                      name: watchedValues.name || "Model Name",
                      description: watchedValues.description || "Description",
                      parameterCount: watchedValues.parameterCount || null,
                      architecture: watchedValues.architecture || null,
                      category: watchedValues.category || null,
                      downloadCount: 0,
                      license: watchedValues.license || null,
                      tags: selectedTags,
                    }}
                  />
                </div>

                {/* Summary */}
                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                  <h4 className="font-semibold text-sm">Submission Summary</h4>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <dt className="text-muted-foreground">Name</dt>
                    <dd className="font-medium">{watchedValues.name}</dd>
                    <dt className="text-muted-foreground">Slug</dt>
                    <dd className="font-mono text-xs">{watchedValues.slug}</dd>
                    {watchedValues.architecture && (
                      <>
                        <dt className="text-muted-foreground">Architecture</dt>
                        <dd>{watchedValues.architecture}</dd>
                      </>
                    )}
                    {watchedValues.parameterCount && (
                      <>
                        <dt className="text-muted-foreground">Parameters</dt>
                        <dd>{watchedValues.parameterCount}</dd>
                      </>
                    )}
                    {watchedValues.contextLength && (
                      <>
                        <dt className="text-muted-foreground">Context Length</dt>
                        <dd>{Number(watchedValues.contextLength).toLocaleString()} tokens</dd>
                      </>
                    )}
                    {watchedValues.license && (
                      <>
                        <dt className="text-muted-foreground">License</dt>
                        <dd>{watchedValues.license}</dd>
                      </>
                    )}
                    {watchedValues.category && (
                      <>
                        <dt className="text-muted-foreground">Category</dt>
                        <dd>{watchedValues.category}</dd>
                      </>
                    )}
                    {watchedValues.format && (
                      <>
                        <dt className="text-muted-foreground">Format</dt>
                        <dd className="uppercase">{watchedValues.format}</dd>
                      </>
                    )}
                    <dt className="text-muted-foreground">Download URL</dt>
                    <dd className="truncate text-xs">{watchedValues.downloadUrl}</dd>
                    {selectedTags.length > 0 && (
                      <>
                        <dt className="text-muted-foreground">Tags</dt>
                        <dd className="flex flex-wrap gap-1">
                          {selectedTags.map((t) => (
                            <Badge key={t} variant="secondary" className="text-[10px]">
                              {t}
                            </Badge>
                          ))}
                        </dd>
                      </>
                    )}
                  </dl>
                </div>

                {/* Submit error */}
                {stepErrors.submit && (
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                    <p className="text-sm text-destructive">{stepErrors.submit}</p>
                  </div>
                )}
              </div>
            )}
          </GlowCardContent>
        </GlowCard>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button type="button" onClick={handleNext} className="gap-2">
              Next
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 bg-gradient-to-r from-primary to-chart-1 hover:opacity-90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  Submit Model
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
