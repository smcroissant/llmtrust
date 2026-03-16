"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/empty-state";
import { Download, ExternalLink, Star, ArrowLeft, Cpu, Ruler, Scale, Clock, Heart, GitCompareArrows, Loader2, Send, Shield } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ModelDetailProps {
  model: {
    id: string;
    slug: string;
    name: string;
    description: string;
    longDescription: string;
    parameterCount: string;
    architecture: string;
    category: string;
    downloadCount: number;
    license: string;
    tags: string[];
    downloadUrl: string;
    author: string;
    contextLength: number;
    avgRating: number;
    reviewCount: number;
  };
}

export function ModelDetailPage({ model }: ModelDetailProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/models"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Models
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold">{model.name}</h1>
            <Badge variant="secondary" className="text-sm">
              {model.parameterCount}
            </Badge>
          </div>
          <p className="text-muted-foreground mb-3">{model.description}</p>
          <div className="flex flex-wrap gap-2">
            {model.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <FavoriteButton modelId={model.id} />
          <a href={model.downloadUrl} target="_blank" rel="noopener noreferrer">
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </a>
          <a href={model.downloadUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              Source
            </Button>
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Cpu className="h-4 w-4" />
              <span className="text-xs">Architecture</span>
            </div>
            <p className="font-semibold capitalize">{model.architecture}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Ruler className="h-4 w-4" />
              <span className="text-xs">Parameters</span>
            </div>
            <p className="font-semibold">{model.parameterCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Context Length</span>
            </div>
            <p className="font-semibold">{model.contextLength.toLocaleString()} tokens</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Scale className="h-4 w-4" />
              <span className="text-xs">License</span>
            </div>
            <p className="font-semibold">{model.license}</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({model.reviewCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>About {model.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {model.longDescription}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Author</h4>
                  <p className="text-muted-foreground">{model.author}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Category</h4>
                  <p className="text-muted-foreground capitalize">
                    {model.category.replace("-", " ")}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Downloads</h4>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {model.downloadCount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">License</h4>
                  <p className="text-muted-foreground">{model.license}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specs">
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Format</h4>
                    <p className="text-muted-foreground">GGUF (recommended), Safetensors</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Quantizations</h4>
                    <p className="text-muted-foreground">Q4_K_M, Q5_K_M, Q8_0</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Recommended RAM</h4>
                    <p className="text-muted-foreground">
                      {parseInt(model.parameterCount) <= 4
                        ? "8 GB"
                        : parseInt(model.parameterCount) <= 13
                          ? "16 GB"
                          : "32+ GB"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Template Format</h4>
                    <p className="text-muted-foreground">ChatML</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. Download from HuggingFace</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Click the download button above or visit the HuggingFace page directly.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">2. Use with Ollama</h4>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                  <code>ollama run {model.slug}</code>
                </pre>
              </div>
              <div>
                <h4 className="font-medium mb-2">3. Use with llama.cpp</h4>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                  <code>./main -m {model.slug}.gguf -p &quot;Hello&quot;</code>
                </pre>
              </div>
              <div>
                <h4 className="font-medium mb-2">4. Use with the LLM Trust Desktop App</h4>
                <p className="text-sm text-muted-foreground">
                  Coming soon — one-click download and local execution.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsSection modelId={model.id} modelName={model.name} avgRating={model.avgRating} reviewCount={model.reviewCount} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================
// Favorite Button Component
// ============================================
function FavoriteButton({ modelId }: { modelId: string }) {
  const { data: session } = useSession();
  const router = useRouter();

  const { data: favData, refetch } = trpc.user.isFavorite.useQuery(
    { modelId },
    { enabled: !!session }
  );

  const toggleFavorite = trpc.user.toggleFavorite.useMutation({
    onSuccess: (data) => {
      refetch();
      toast.success(data.favorited ? "Added to favorites" : "Removed from favorites");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      router.push("/auth/sign-in");
      return;
    }
    toggleFavorite.mutate({ modelId });
  };

  const isFav = favData?.favorited ?? false;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      disabled={toggleFavorite.isPending}
      className={`transition-all duration-200 ${isFav ? "text-red-500 border-red-500/30 hover:text-red-600" : ""}`}
    >
      {toggleFavorite.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={`h-4 w-4 transition-all ${isFav ? "fill-current animate-heart-pulse" : ""}`} />
      )}
    </Button>
  );
}

// ============================================
// Reviews Section Component
// ============================================
function ReviewsSection({
  modelId,
  modelName,
  avgRating,
  reviewCount,
}: {
  modelId: string;
  modelName: string;
  avgRating: number;
  reviewCount: number;
}) {
  const { data: session } = useSession();
  const utils = trpc.useUtils();

  const { data: reviewsData, isLoading } = trpc.reviews.list.useQuery({
    modelId,
    limit: 20,
  });

  const createReview = trpc.reviews.create.useMutation({
    onSuccess: () => {
      utils.reviews.list.invalidate({ modelId });
      setRating(0);
      setContent("");
      toast.success("Review submitted!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    createReview.mutate({
      modelId,
      rating,
      content: content.trim() || undefined,
    });
  };

  const roundedAvg = Math.round(avgRating * 10) / 10;

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold">{roundedAvg.toFixed(1)}</p>
              <div className="flex gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i <= Math.round(avgRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {reviewCount} review{reviewCount !== 1 ? "s" : ""}
              </p>
            </div>
            <Separator orientation="vertical" className="h-16" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Community reviews help others discover great models. Share your experience with {modelName}.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review Form */}
      {session ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Write a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Star Rating Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    className="p-0.5 transition-transform hover:scale-110"
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(i)}
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        i <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground self-center">
                    {rating}/5
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="text-sm font-medium mb-2 block">Review (optional)</label>
              <Textarea
                placeholder={`Share your experience with ${modelName}...`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={5000}
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {content.length}/5000 characters
              </p>
            </div>

            <Button onClick={handleSubmit} disabled={createReview.isPending || rating === 0}>
              {createReview.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Submit Review
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-3">
              Sign in to write a review
            </p>
            <Button variant="outline" render={<Link href="/auth/sign-in" />}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-full bg-muted animate-pulse rounded" />
                    <div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reviewsData && reviewsData.reviews.length > 0 ? (
        <div className="space-y-4">
          {reviewsData.reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.author.image ?? ""} />
                    <AvatarFallback>
                      {review.author.name?.charAt(0)?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm">{review.author.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.content && (
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {review.content}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          variant="no-data"
          title="No reviews yet"
          description={`Be the first to review ${modelName}!`}
        />
      )}
    </div>
  );
}
