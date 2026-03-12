"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Heart,
  Settings,
  ArrowLeft,
  Sparkles,
  Star,
  Upload,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

const navDashboard = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Favorites", url: "/dashboard/favorites", icon: Heart },
];

const navAccount = [
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  const { data: userData } = trpc.user.me.useQuery();

  const isActive = (url: string) => {
    if (url === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(url);
  };

  const initials = userData?.name
    ? userData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-1 text-primary-foreground">
                <Sparkles className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">LLM Trust</span>
                <span className="text-xs text-muted-foreground">Dashboard</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Quick Stats */}
        {userData && (
          <SidebarGroup>
            <SidebarGroupLabel>Stats</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="grid grid-cols-3 gap-1 px-2 py-1">
                <div className="flex flex-col items-center rounded-md bg-muted/50 p-2">
                  <Heart className="size-3 text-primary mb-1" />
                  <span className="text-xs font-semibold">{userData.stats.favorites}</span>
                  <span className="text-[10px] text-muted-foreground">Favs</span>
                </div>
                <div className="flex flex-col items-center rounded-md bg-muted/50 p-2">
                  <Star className="size-3 text-accent mb-1" />
                  <span className="text-xs font-semibold">{userData.stats.reviews}</span>
                  <span className="text-[10px] text-muted-foreground">Reviews</span>
                </div>
                <div className="flex flex-col items-center rounded-md bg-muted/50 p-2">
                  <Upload className="size-3 text-chart-3 mb-1" />
                  <span className="text-xs font-semibold">{userData.stats.uploads}</span>
                  <span className="text-[10px] text-muted-foreground">Uploads</span>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Dashboard Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navDashboard.map((item) => (
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

        {/* Account */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navAccount.map((item) => (
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
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/models" />}>
              <ArrowLeft className="size-4" />
              <span>Back to Platform</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <Separator className="my-1" />

        {/* User Card */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard/settings" />}>
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userData?.image ?? ""} alt={userData?.name ?? "User"} />
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {userData?.name ?? "User"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {userData?.email ?? ""}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
