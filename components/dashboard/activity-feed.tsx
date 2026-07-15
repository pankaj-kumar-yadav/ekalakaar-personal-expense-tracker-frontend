"use client"

import { useEffect, useState } from "react"
import { format, parseISO } from "date-fns"
import {
  CarIcon,
  LayersIcon,
  PlusCircleIcon,
  ReceiptIcon,
  SearchIcon,
  TagIcon,
  type LucideIcon,
} from "lucide-react"

import { KravioCard } from "@/components/dashboard/kravio-card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { getDashboardActivity } from "@/lib/api"
import type { ActivityRangeKey, Expense } from "@/lib/types"
import { cn } from "@/lib/utils"

function activityStyle(category: string): {
  icon: LucideIcon
  bubble: string
} {
  switch (category) {
    case "Food":
      return {
        icon: ReceiptIcon,
        bubble:
          "bg-rose-500/15 text-rose-600",
      }
    case "Transport":
      return {
        icon: CarIcon,
        bubble:
          "bg-sky-500/15 text-sky-600",
      }
    case "Bills":
      return {
        icon: TagIcon,
        bubble:
          "bg-violet-500/15 text-violet-600",
      }
    default:
      return {
        icon: PlusCircleIcon,
        bubble:
          "bg-emerald-500/15 text-emerald-600",
      }
  }
}

export function ActivityFeed() {
  const [tab, setTab] = useState<ActivityRangeKey>("week")
  const [query, setQuery] = useState("")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadActivity() {
      setIsLoading(true)
      try {
        const data = await getDashboardActivity({ range: tab, q: query })
        if (!cancelled) {
          setExpenses(data)
        }
      } catch {
        if (!cancelled) {
          setExpenses([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadActivity()

    return () => {
      cancelled = true
    }
  }, [query, tab])

  const tabs: { key: ActivityRangeKey; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "week", label: "This week" },
  ]

  return (
    <KravioCard
      title="Latest Updates"
      icon={LayersIcon}
      iconPosition="right"
      className="h-full"
      innerClassName="flex flex-1 flex-col p-4"
    >
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={cn(
              "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
              tab === item.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="relative mt-3">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search activity"
          className="h-8 pl-8 text-sm"
        />
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-2 overflow-auto">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))
        ) : expenses.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No activity for this period.
          </p>
        ) : (
          expenses.slice(0, 6).map((expense) => {
            const { icon: Icon, bubble } = activityStyle(expense.category)
            const stamp = format(
              parseISO(expense.createdAt ?? expense.date),
              "h:mm a"
            )
            return (
              <div
                key={expense._id}
                className="flex items-start gap-3 rounded-lg border border-transparent p-2 hover:border-border hover:bg-muted/40"
              >
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full",
                    bubble
                  )}
                >
                  <Icon className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">Expense added</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {expense.description} · {expense.category}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {stamp}
                </span>
              </div>
            )
          })
        )}
      </div>
    </KravioCard>
  )
}
