"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModelGrid } from "@/components/models/model-grid";
import { Search, SlidersHorizontal } from "lucide-react";

// Static model data for MVP (will be replaced by tRPC)
const allModels = [
  {
    slug: "llama-3-8b",
    name: "Llama 3 8B",
    description: "Meta's latest open-source LLM with strong performance across benchmarks.",
    parameterCount: "8B",
    architecture: "llama",
    category: "text-generation",
    downloadCount: 125000,
    license: "Llama 3",
    tags: ["chat", "code", "reasoning"],
  },
  {
    slug: "mistral-7b",
    name: "Mistral 7B",
    description: "Efficient 7B parameter model with strong reasoning capabilities.",
    parameterCount: "7B",
    architecture: "mistral",
    category: "text-generation",
    downloadCount: 98000,
    license: "Apache 2.0",
    tags: ["efficient", "reasoning"],
  },
  {
    slug: "phi-3-mini",
    name: "Phi-3 Mini",
    description: "Microsoft's compact model that punches above its weight class.",
    parameterCount: "3.8B",
    architecture: "phi",
    category: "text-generation",
    downloadCount: 75000,
    license: "MIT",
    tags: ["compact", "efficient"],
  },
  {
    slug: "gemma-2b",
    name: "Gemma 2B",
    description: "Google's lightweight model for on-device AI applications.",
    parameterCount: "2B",
    architecture: "gemma",
    category: "text-generation",
    downloadCount: 62000,
    license: "Gemma",
    tags: ["lightweight", "on-device"],
  },
  {
    slug: "codellama-13b",
    name: "Code Llama 13B",
    description: "Meta's code-specialized model for programming tasks and code generation.",
    parameterCount: "13B",
    architecture: "llama",
    category: "code",
    downloadCount: 54000,
    license: "Llama 2",
    tags: ["code", "programming"],
  },
  {
    slug: "stable-diffusion-xl",
    name: "Stable Diffusion XL",
    description: "Stability AI's flagship image generation model with stunning quality.",
    parameterCount: "3.5B",
    architecture: "diffusion",
    category: "vision",
    downloadCount: 210000,
    license: "OpenRAIL++",
    tags: ["image-generation", "creative"],
  },
];

const categories = ["All", "Text Generation", "Code", "Vision", "Embedding", "Audio"];
const architectures = ["All", "llama", "mistral", "phi", "gemma", "diffusion"];
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "downloads", label: "Most Downloads" },
  { value: "name", label: "Name A-Z" },
];

export function ModelsPageClient() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedArchitecture, setSelectedArchitecture] = useState("All");
  const [sortBy, setSortBy] = useState("popular");

  const filteredModels = allModels
    .filter((m) => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCategory !== "All" && m.category !== selectedCategory.toLowerCase().replace(" ", "-")) return false;
      if (selectedArchitecture !== "All" && m.architecture !== selectedArchitecture) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "downloads") return b.downloadCount - a.downloadCount;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return b.downloadCount - a.downloadCount; // default: popular
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Models</h1>
        <p className="text-muted-foreground">
          Discover open-source LLMs for your projects
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 mb-8">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm bg-background"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category badges */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>

        {/* Architecture badges */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground mr-2">Architecture:</span>
          {architectures.map((arch) => (
            <Badge
              key={arch}
              variant={selectedArchitecture === arch ? "secondary" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedArchitecture(arch)}
            >
              {arch}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 text-sm text-muted-foreground">
        {filteredModels.length} model{filteredModels.length !== 1 ? "s" : ""} found
      </div>

      <ModelGrid models={filteredModels} />
    </div>
  );
}
