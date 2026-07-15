"use client"

import Link from "next/link"
import { BellIcon, HelpCircleIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

type Crumb = {
  label: string
  href?: string
}

export function DashboardHeader({
  breadcrumbs,
}: {
  breadcrumbs: Crumb[]
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/60 bg-card/40 px-4 backdrop-blur-sm">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-1 data-vertical:h-4 data-vertical:self-auto"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink render={<Link href="/dashboard" />}>
                Overview
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((item, index) => (
              <span key={item.label} className="contents">
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 || !item.href ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={item.href} />}>
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground"
          aria-label="Help"
        >
          <HelpCircleIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-8 text-muted-foreground"
          aria-label="Notifications"
        >
          <BellIcon className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-destructive" />
        </Button>
      </div>
    </header>
  )
}
