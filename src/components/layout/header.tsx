import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/notification-bell";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              LLM Trust
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/models"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Models
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/compare"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Compare
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <NotificationBell />
          <Link href="/auth/sign-in">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
