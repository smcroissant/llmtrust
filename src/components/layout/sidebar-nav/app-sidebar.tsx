"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  LayoutGrid,
  GitCompareArrows,
  BookOpen,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronUp,
  Sparkles,
  Search,
  MessageSquareCode,
  Eye,
  Hash,
  AudioLines,
  Loader2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

const navMain = [
  { title: "Home", url: "/", icon: Home },
  { title: "Models", url: "/models", icon: LayoutGrid },
  { title: "Compare", url: "/compare", icon: GitCompareArrows },
  { title: "Blog", url: "/blog", icon: BookOpen },
];

const navApp = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Search models via tRPC
  const { data: searchResults, isLoading: isSearching } =
    trpc.models.list.useQuery(
      { search: searchQuery, limit: 5 },
      { enabled: searchQuery.length >= 2 }
    );

  // Fetch categories from DB
  const { data: categoriesData } = trpc.models.categories.useQuery();

  const categories =
    categoriesData?.map((c) => ({
      name: c.name ?? "Unknown",
      slug: (c.name ?? "unknown").toLowerCase().replace(/\s+/g, "-"),
      icon: getCategoryIcon(c.name ?? ""),
      count: c.count,
    })) ?? [];

  const isActive = (url: string) => {
    if (url === "/") return pathname === "/";
    return pathname.startsWith(url);
  };

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && searchQuery.trim()) {
        router.push(`/models?search=${encodeURIComponent(searchQuery.trim())}`);
        setShowResults(false);
        setSearchQuery("");
      }
      if (e.key === "Escape") {
        setShowResults(false);
      }
    },
    [searchQuery, router]
  );

  const handleResultClick = useCallback(() => {
    setShowResults(false);
    setSearchQuery("");
  }, []);

  return (
    <Sidebar collapsible="icon">
      {/* Header / Brand */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/" />}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-1 text-primary-foreground">
                <Sparkles className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">LLM Trust</span>
                <span className="text-xs text-muted-foreground">
                  AI Model Discovery
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Search Bar */}
        {state === "expanded" && (
          <div className="px-3 pb-2 relative">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search models..."
                className="h-8 pl-8 text-sm"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(e.target.value.length >= 2);
                }}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
              />
              {isSearching && (
                <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3 animate-spin text-muted-foreground" />
              )}
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults && searchResults.models.length > 0 && (
              <div className="absolute left-3 right-3 top-full mt-1 z-50 rounded-lg border border-border bg-popover shadow-lg overflow-hidden">
                <div className="p-1">
                  {searchResults.models.map((model) => (
                    <Link
                      key={model.slug}
                      href={`/models/${model.slug}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent text-sm transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{model.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {model.architecture} · {model.parameterCount}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-[10px] shrink-0">
                        {model.category?.replace("-", " ")}
                      </Badge>
                    </Link>
                  ))}
                </div>
                {searchResults.total > 5 && (
                  <Link
                    href={`/models?search=${encodeURIComponent(searchQuery)}`}
                    onClick={handleResultClick}
                    className="block px-3 py-2 text-xs text-center text-primary hover:bg-accent border-t transition-colors"
                  >
                    View all {searchResults.total} results
                  </Link>
                )}
              </div>
            )}

            {/* No results */}
            {showResults && searchResults && searchResults.models.length === 0 && searchQuery.length >= 2 && !isSearching && (
              <div className="absolute left-3 right-3 top-full mt-1 z-50 rounded-lg border border-border bg-popover shadow-lg p-3 text-center">
                <p className="text-sm text-muted-foreground">No models found</p>
              </div>
            )}
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    render={<Link href={item.url} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* App Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>My Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navApp.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    render={<Link href={item.url} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categories from DB */}
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((cat) => (
                <SidebarMenuItem key={cat.slug}>
                  <SidebarMenuButton
                    isActive={isActive(`/models?category=${cat.slug}`)}
                    tooltip={cat.name}
                    render={<Link href={`/models?category=${cat.slug}`} />}
                  >
                    <cat.icon />
                    <span>{cat.name}</span>
                    <Badge variant="secondary" className="ml-auto text-[10px] px-1.5">
                      {cat.count}
                    </Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer / User Menu */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="rounded-lg bg-primary/10">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Guest</span>
                    <span className="truncate text-xs text-muted-foreground">
                      Sign in to sync
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
                  <Settings className="mr-2 size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/auth/sign-in" />}>
                  <LogOut className="mr-2 size-4" />
                  Sign In
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function getCategoryIcon(name: string) {
  const lower = name.toLowerCase().replace(/\s+/g, "-");
  if (lower.includes("text") || lower.includes("generation")) return MessageSquareCode;
  if (lower.includes("code")) return Hash;
  if (lower.includes("vision")) return Eye;
  if (lower.includes("embedding")) return Hash;
  if (lower.includes("audio")) return AudioLines;
  return Hash;
}
