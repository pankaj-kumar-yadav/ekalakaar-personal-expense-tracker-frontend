"use client"

import { useState } from "react"
import { SparklesIcon } from "lucide-react"

import { KravioCard } from "@/components/dashboard/kravio-card"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"

type DayPoint = {
  label: string
  amount: number
}

type SpendingChartProps = {
  title?: string
  total: number
  change: number
  days: DayPoint[]
  isLoading?: boolean
}

export function SpendingChart({
  title = "Spending Trend",
  total,
  change,
  days,
  isLoading,
}: SpendingChartProps) {
  const max = Math.max(...days.map((d) => d.amount), 1)
  const peakIndex = days.reduce(
    (best, day, index) => (day.amount > days[best].amount ? index : best),
    0
  )
  const [active, setActive] = useState(peakIndex)
  const positive = change >= 0

  return (
    <KravioCard
      title={title}
      icon={SparklesIcon}
      iconPosition="left"
      className="h-full"
      innerClassName="flex flex-1 flex-col p-4"
    >
      <div>
        <p className="text-2xl font-semibold tracking-tight">
          {isLoading ? "—" : formatCurrency(total)}
        </p>
        <p
          className={cn(
            "text-xs font-medium",
            positive ? "text-emerald-600" : "text-red-600"
          )}
        >
          {positive ? "+" : ""}
          {change.toFixed(1)}% vs prior period
        </p>
      </div>

      <div className="mt-6 flex flex-1 items-end gap-2">
        {isLoading
          ? Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div className="h-28 w-full rounded-md bg-muted" />
                <span className="text-[11px] text-muted-foreground">—</span>
              </div>
            ))
          : days.map((day, index) => {
              const height = Math.max((day.amount / max) * 120, 8)
              const isActive = index === active
              return (
                <button
                  key={day.label}
                  type="button"
                  className="group relative flex flex-1 flex-col items-center gap-2"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                >
                  {isActive ? (
                    <span className="absolute -top-8 rounded-md bg-primary px-2 py-1 text-[11px] whitespace-nowrap text-primary-foreground">
                      {day.label}: {formatCurrency(day.amount)}
                    </span>
                  ) : null}
                  <div
                    className={cn(
                      "w-full rounded-md transition-colors",
                      isActive
                        ? "bg-primary"
                        : "bg-muted group-hover:bg-primary/40"
                    )}
                    style={{ height }}
                  />
                  <span className="text-[11px] text-muted-foreground">
                    {day.label}
                  </span>
                </button>
              )
            })}
      </div>
    </KravioCard>
  )
}
