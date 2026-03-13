import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/seo/structured-data";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar-nav/app-sidebar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://llmtrust.com"),
  title: {
    default: "LLM Trust — Discover & Compare Open-Source LLMs",
    template: "%s | LLM Trust",
  },
  description:
    "Compare 200+ open-source LLMs with real benchmarks. GPT-4, Claude, Llama, Gemma — all models ranked. Find the best AI model for your project. Free.",
  keywords: [
    "LLM",
    "large language models",
    "open source AI",
    "local AI",
    "AI models",
    "machine learning",
    "HuggingFace",
    "GPT alternatives",
    "Ollama",
    "GGUF",
    "LLM comparison",
    "AI benchmarks",
    "run LLM locally",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "LLM Trust",
    title: "LLM Trust — Discover & Compare Open-Source LLMs",
    description:
      "Compare 200+ open-source LLMs with real benchmarks. Find the best AI model for your project.",
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: "LLM Trust — Discover & Compare Open-Source LLMs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LLM Trust — Discover & Compare Open-Source LLMs",
    description:
      "Compare 200+ open-source LLMs with real benchmarks. Find the best AI model for your project.",
    images: ["/og-default.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://llmtrust.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <WebsiteJsonLd />
        <OrganizationJsonLd />
        <Providers>
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>{children}</SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
