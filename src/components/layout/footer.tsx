import Link from "next/link";

const footerLinks = {
  Models: [
    { name: "All Models", href: "/models" },
    { name: "Categories", href: "/categories" },
    { name: "Compare LLMs", href: "/compare" },
    { name: "Latest Additions", href: "/models?sort=newest" },
  ],
  Resources: [
    { name: "Blog", href: "/blog" },
    { name: "Documentation", href: "/docs" },
    { name: "API Reference", href: "/docs/api" },
    { name: "Changelog", href: "/changelog" },
  ],
  Categories: [
    { name: "Text Generation", href: "/categories/text-generation" },
    { name: "Code", href: "/categories/code" },
    { name: "Vision", href: "/categories/vision" },
    { name: "Embeddings", href: "/categories/embedding" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              LLM Trust
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              The trusted platform for discovering, comparing, and running LLMs locally.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold">{category}</h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} LLM Trust. All rights reserved.</p>
          <p className="mt-1">
            Models are sourced from{" "}
            <a
              href="https://huggingface.co"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              HuggingFace
            </a>{" "}
            and their respective authors.
          </p>
        </div>
      </div>
    </footer>
  );
}
