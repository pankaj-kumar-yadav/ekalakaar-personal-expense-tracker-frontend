"use client"

import { ChevronDownIcon } from "lucide-react"

import {
  getPeriodLabel,
  PERIOD_OPTIONS,
} from "@/components/dashboard/dashboard-constants"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { PeriodKey } from "@/lib/types"

type DashboardGreetingProps = {
  userName?: string | null
  period: PeriodKey
  onPeriodChange: (period: PeriodKey) => void
}

export function DashboardGreeting({
  userName,
  period,
  onPeriodChange,
}: DashboardGreetingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Hello, {userName ?? "there"}{" "}
          <span aria-hidden="true" className="inline-block animate-wave">
            👋
          </span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s your spending overview for the selected period.
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" className="h-9 gap-2 bg-card" />}
        >
          {getPeriodLabel(period)}
          <ChevronDownIcon className="size-4 opacity-60" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {PERIOD_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.key}
              onClick={() => onPeriodChange(option.key)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
