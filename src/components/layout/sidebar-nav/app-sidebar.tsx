"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

const navMain = [
  { title: "Home", url: "/", icon: Home },
  { title: "Models", url: "/models", icon: LayoutGrid },
  { title: "Compare", url: "/compare", icon: GitCompareArrows },
  { title: "Blog", url: "/blog", icon: BookOpen },
];

const navApp = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];

const categories = [
  { name: "Text Generation", slug: "text-generation", icon: MessageSquareCode, count: 145 },
  { name: "Code", slug: "code", icon: Hash, count: 89 },
  { name: "Vision", slug: "vision", icon: Eye, count: 34 },
  { name: "Embedding", slug: "embedding", icon: Hash, count: 28 },
  { name: "Audio", slug: "audio", icon: AudioLines, count: 15 },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  const isActive = (url: string) => {
    if (url === "/") return pathname === "/";
    return pathname.startsWith(url);
  };

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
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search models..."
                className="h-8 pl-8 text-sm"
              />
            </div>
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

        {/* Popular Categories */}
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
                <DropdownMenuItem render={<Link href="/settings" />}>
                  <Settings className="mr-2 size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/login" />}>
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
