import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";
import readingTime from "reading-time";
import { codeToHtml } from "shiki";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

// ============================================
// Types
// ============================================

export interface BlogFrontmatter {
  title: string;
  meta_title?: string;
  meta_description?: string;
  slug: string;
  keywords?: string[];
  date: string;
  author?: string;
  image?: string;
  categories?: string[];
  tags?: string[];
}

export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

export interface BlogPost {
  frontmatter: BlogFrontmatter;
  content: string; // rendered HTML
  slug: string; // extracted from frontmatter or filename
  readingTime: string;
  wordCount: number;
  toc: TocEntry[];
}

export interface BlogPostMeta {
  frontmatter: BlogFrontmatter;
  slug: string;
  readingTime: string;
  wordCount: number;
}

// ============================================
// Helpers
// ============================================

/**
 * Extract slug from frontmatter slug field (e.g. "/blog/my-post" → "my-post")
 * or from filename (e.g. "01-my-post.md" → "01-my-post")
 */
function extractSlug(frontmatterSlug: string | undefined, filename: string): string {
  if (frontmatterSlug) {
    // Remove leading/trailing slashes and /blog/ prefix
    return frontmatterSlug.replace(/^\/?(blog\/)?/, "").replace(/\/$/, "");
  }
  // Remove numeric prefix and .md extension: "01-my-post.md" → "my-post"
  return filename.replace(/^\d+-/, "").replace(/\.md$/, "");
}

/**
 * Generate a URL-safe ID from heading text
 */
function headingToId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

/**
 * Extract headings from markdown content and build TOC
 */
function extractToc(markdown: string): TocEntry[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const entries: TocEntry[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length; // ## = 2, ### = 3, #### = 4
    const text = match[2].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"); // strip markdown links
    const id = headingToId(text);
    entries.push({ id, text, level });
  }

  return entries;
}

/**
 * Apply Shiki syntax highlighting to HTML code blocks
 */
async function highlightCodeBlocks(html: string): Promise<string> {
  // Match <pre><code class="language-xxx">...</code></pre>
  const codeBlockRegex =
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g;

  const replacements: { original: string; highlighted: string }[] = [];

  // We need to collect matches first because we can't use async in replace callback directly
  let match;
  const matches: { lang: string; code: string; full: string }[] = [];
  while ((match = codeBlockRegex.exec(html)) !== null) {
    matches.push({ lang: match[1], code: match[2], full: match[0] });
  }

  for (const m of matches) {
    try {
      // Decode HTML entities
      const code = m.code
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      const highlighted = await codeToHtml(code, {
        lang: m.lang,
        theme: "github-dark",
      });

      replacements.push({ original: m.full, highlighted });
    } catch {
      // If language not supported by shiki, keep original
    }
  }

  let result = html;
  for (const r of replacements) {
    result = result.replace(r.original, r.highlighted);
  }

  return result;
}

/**
 * Add IDs to headings in rendered HTML for TOC anchor links
 */
function addHeadingIds(html: string): string {
  return html.replace(/<h([2-4])>([\s\S]*?)<\/h\1>/g, (_match, level, text) => {
    const plainText = text.replace(/<[^>]+>/g, "").trim();
    const id = headingToId(plainText);
    return `<h${level} id="${id}">${text}</h${level}>`;
  });
}

// ============================================
// Public API
// ============================================

/**
 * Get all blog post slugs (for generateStaticParams)
 */
export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, f), "utf-8");
      const { data } = matter(raw);
      return extractSlug(data.slug, f);
    });
}

/**
 * Get metadata for all blog posts (sorted by date, newest first)
 */
export function getAllBlogPostsMeta(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts: BlogPostMeta[] = files.map((filename) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
    const { data, content } = matter(raw);
    const slug = extractSlug(data.slug, filename);
    const stats = readingTime(content);

    return {
      frontmatter: data as BlogFrontmatter,
      slug,
      readingTime: stats.text,
      wordCount: stats.words,
    };
  });

  // Sort by date descending
  return posts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
}

/**
 * Get a single blog post by slug with rendered HTML content
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!fs.existsSync(BLOG_DIR)) return null;

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  for (const filename of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
    const { data, content: markdown } = matter(raw);
    const postSlug = extractSlug(data.slug, filename);

    if (postSlug === slug) {
      const stats = readingTime(markdown);
      const toc = extractToc(markdown);

      // Render markdown to HTML
      const processed = await remark()
        .use(remarkGfm)
        .use(remarkHtml, { sanitize: false })
        .process(markdown);

      let html = processed.toString();

      // Add IDs to headings
      html = addHeadingIds(html);

      // Apply syntax highlighting
      html = await highlightCodeBlocks(html);

      return {
        frontmatter: data as BlogFrontmatter,
        content: html,
        slug: postSlug,
        readingTime: stats.text,
        wordCount: stats.words,
        toc,
      };
    }
  }

  return null;
}

/**
 * Get related posts based on shared keywords/tags
 */
export function getRelatedPosts(
  currentSlug: string,
  limit = 3
): BlogPostMeta[] {
  const allPosts = getAllBlogPostsMeta();
  const current = allPosts.find((p) => p.slug === currentSlug);
  if (!current) return [];

  const currentKeywords = new Set(
    [...(current.frontmatter.keywords ?? []), ...(current.frontmatter.tags ?? [])]
      .map((k) => k.toLowerCase())
  );

  // Score each post by shared keywords
  const scored = allPosts
    .filter((p) => p.slug !== currentSlug)
    .map((post) => {
      const postKeywords = new Set(
        [...(post.frontmatter.keywords ?? []), ...(post.frontmatter.tags ?? [])]
          .map((k) => k.toLowerCase())
      );
      const shared = [...currentKeywords].filter((k) => postKeywords.has(k)).length;
      return { post, score: shared };
    })
    .sort((a, b) => b.score - a.score);

  // If we have keyword matches, return those; otherwise return most recent
  const withScore = scored.filter((s) => s.score > 0);
  if (withScore.length >= limit) {
    return withScore.slice(0, limit).map((s) => s.post);
  }

  // Fill remaining slots with recent posts
  const result = withScore.map((s) => s.post);
  const remaining = allPosts
    .filter((p) => p.slug !== currentSlug && !result.find((r) => r.slug === p.slug))
    .slice(0, limit - result.length);

  return [...result, ...remaining];
}
