"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, Copy, Check, AlertTriangle, Info, Lightbulb, AlertCircle } from "lucide-react";

// ============================================
// Callout / Alert boxes
// ============================================

interface CalloutProps {
  type?: "info" | "warning" | "tip" | "danger";
  title?: string;
  children: ReactNode;
}

const calloutStyles = {
  info: {
    bg: "bg-blue-500/5 border-blue-500/20",
    icon: <Info className="size-5 text-blue-400 shrink-0" />,
    titleColor: "text-blue-400",
  },
  warning: {
    bg: "bg-amber-500/5 border-amber-500/20",
    icon: <AlertTriangle className="size-5 text-amber-400 shrink-0" />,
    titleColor: "text-amber-400",
  },
  tip: {
    bg: "bg-emerald-500/5 border-emerald-500/20",
    icon: <Lightbulb className="size-5 text-emerald-400 shrink-0" />,
    titleColor: "text-emerald-400",
  },
  danger: {
    bg: "bg-red-500/5 border-red-500/20",
    icon: <AlertCircle className="size-5 text-red-400 shrink-0" />,
    titleColor: "text-red-400",
  },
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const style = calloutStyles[type];
  return (
    <div className={`my-8 rounded-xl border ${style.bg} p-5 flex gap-4`}>
      {style.icon}
      <div className="flex-1 min-w-0">
        {title && (
          <div className={`font-bold text-sm mb-1 ${style.titleColor}`}>{title}</div>
        )}
        <div className="text-sm text-muted-foreground leading-relaxed [&_p]:m-0 [&_p+p]:mt-2">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Code Block with copy button
// ============================================

interface CodeBlockProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function CodeBlock({ children, className, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lang = className?.replace("language-", "") ?? "";

  const copyCode = () => {
    const code = typeof children === "string" ? children : "";
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative my-8 rounded-2xl border border-primary/10 bg-[#161224] overflow-hidden shadow-[0_4px_20px_oklch(0_0_0_/_0.3)]">
      {(title || lang) && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-primary/10 bg-white/[0.02]">
          {title ? (
            <span className="text-xs font-medium text-muted-foreground">{title}</span>
          ) : (
            <span className="text-xs font-mono text-primary/60 uppercase tracking-wider">{lang}</span>
          )}
          <button
            onClick={copyCode}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                Copy
              </>
            )}
          </button>
        </div>
      )}
      <div className="overflow-x-auto p-4">
        <pre className="text-sm leading-relaxed">{children}</pre>
      </div>
    </div>
  );
}

// ============================================
// Accordion / Collapsible
// ============================================

interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="my-6 rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-card hover:bg-card/80 transition-colors"
      >
        <span className="font-semibold text-sm">{title}</span>
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed [&_p]:mt-0">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Stats / Info Card
// ============================================

interface StatCardProps {
  label: string;
  value: string;
  detail?: string;
}

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 text-center">
      <div className="text-2xl font-extrabold bg-gradient-to-r from-primary to-[#F59E0B] bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-sm font-semibold text-foreground mt-1">{label}</div>
      {detail && <div className="text-xs text-muted-foreground mt-1">{detail}</div>}
    </div>
  );
}

// ============================================
// Comparison Table wrapper (responsive)
// ============================================

interface ComparisonTableProps {
  children: ReactNode;
}

export function ComparisonTable({ children }: ComparisonTableProps) {
  return (
    <div className="my-8 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

// ============================================
// YouTube Embed
// ============================================

interface YouTubeEmbedProps {
  id: string;
  title?: string;
}

export function YouTubeEmbed({ id, title = "YouTube video" }: YouTubeEmbedProps) {
  return (
    <div className="my-8 rounded-xl overflow-hidden border border-primary/10 shadow-[0_4px_20px_oklch(0_0_0_/_0.3)]">
      <div className="relative aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}

// ============================================
// MDX Component Map — exported for MDXRemote
// ============================================

export const mdxComponents = {
  // Custom components
  Callout,
  CodeBlock,
  Accordion,
  StatCard,
  ComparisonTable,
  YouTubeEmbed,

  // Override default HTML elements with styled versions
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...props}
      className="text-2xl md:text-3xl font-extrabold tracking-tight mt-16 mb-6 scroll-mt-20 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...props}
      className="text-xl md:text-2xl font-bold mt-10 mb-4 text-primary scroll-mt-20"
    />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      {...props}
      className="text-lg font-semibold mt-8 mb-3 scroll-mt-20"
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className="leading-[1.8] text-muted-foreground text-base mb-4" />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} className="text-primary no-underline hover:underline font-medium" />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong {...props} className="text-foreground font-bold" />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const isBlock = props.className?.includes("language-");
    if (isBlock) return <code {...props} />;
    return (
      <code
        {...props}
        className="text-primary bg-primary/10 px-2 py-0.5 rounded-md text-sm font-mono"
      />
    );
  },
  pre: (props: React.HTMLAttributes<HTMLPreElement> & { title?: string }) => {
    const child = props.children as React.ReactElement<{ className?: string; children?: ReactNode }>;
    const className = child?.props?.className ?? "";
    const code = child?.props?.children ?? "";
    return <CodeBlock className={className}>{code}</CodeBlock>;
  },
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      {...props}
      className="border-l-[3px] border-l-primary bg-primary/5 rounded-r-2xl py-4 px-6 my-8 text-muted-foreground"
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className="my-4 pl-6 space-y-2 list-disc marker:text-primary" />
  ),
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol {...props} className="my-4 pl-6 space-y-2 list-decimal marker:text-primary" />
  ),
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li {...props} className="text-muted-foreground leading-relaxed pl-1" />
  ),
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="my-8 overflow-x-auto rounded-xl border border-border">
      <table {...props} className="w-full text-sm" />
    </div>
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th {...props} className="bg-primary/10 font-bold text-foreground px-4 py-3 text-left" />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td {...props} className="border-t border-primary/10 px-4 py-3 text-muted-foreground" />
  ),
  hr: () => <hr className="border-primary/20 my-12" />,
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} className="rounded-2xl border border-primary/10 shadow-[0_8px_30px_oklch(0_0_0_/_0.3)] my-8" />
  ),
};
