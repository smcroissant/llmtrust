import type { Metadata } from "next";
import { canonicalUrl } from "@/components/seo/page-seo";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Sign in or create your LLM Trust account.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: canonicalUrl("/auth/sign-in"),
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {children}
    </div>
  );
}
