"use client";

import { useState } from "react";
import { Twitter, Linkedin, LinkIcon, Share2, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = `https://llmtrust.com/blog/${slug}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Share2 className="size-4" />
          Share this article
        </span>
        <div className="flex items-center gap-2">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center size-9 rounded-lg bg-muted text-muted-foreground hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] transition-colors"
            aria-label="Share on Twitter"
          >
            <Twitter className="size-4" />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center size-9 rounded-lg bg-muted text-muted-foreground hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] transition-colors"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="size-4" />
          </a>
          <button
            onClick={copyLink}
            className="inline-flex items-center justify-center size-9 rounded-lg bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            aria-label="Copy link"
          >
            {copied ? <Check className="size-4 text-green-500" /> : <LinkIcon className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
