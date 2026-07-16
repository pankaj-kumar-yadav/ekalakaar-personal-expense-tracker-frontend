"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import {
  HelpCircleIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  ReceiptIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react"

import { NavUser } from "@/components/sidebar/nav-user"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { APP_INFO } from "@/lib/app-info"
import { useAuth } from "@/lib/auth-context"
import { getUserAvatarUrl } from "@/services/avatar"

const mainNav = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Expenses",
    url: "/expenses",
    icon: ReceiptIcon,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <Sidebar {...props}>
      <SidebarHeader className="relative h-14 shrink-0 justify-center gap-0 px-2 py-0 after:pointer-events-none after:absolute after:inset-x-4 after:bottom-0 after:border-b-2 after:border-dashed after:border-border/60">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <APP_INFO.Icon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold tracking-tight">
                  {APP_INFO.name}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            {mainNav.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={pathname === item.url}
                  tooltip={item.title}
                  render={<Link href={item.url} />}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <NavUser
            user={{
              name: user.name,
              email: user.email,
              avatar: getUserAvatarUrl(user.email),
            }}
          />
        ) : null}
      </SidebarFooter>
    </Sidebar>
  )
}
