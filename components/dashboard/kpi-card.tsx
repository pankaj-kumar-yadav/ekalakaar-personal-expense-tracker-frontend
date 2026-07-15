"use client"

import type { LucideIcon } from "lucide-react"

import {
  KRAVIO_CARD_INNER_CLASSNAME,
  KRAVIO_CARD_INNER_OFFSET_CLASSNAME,
  KRAVIO_CARD_OUTER_CLASSNAME,
} from "@/components/dashboard/kravio-card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export type KravioMetricTrendDirection = "up" | "down" | "neutral"

export type KravioMetricTrend = {
  value: number
  direction: KravioMetricTrendDirection
  label?: string
}

const TREND_TEXT_CLASS: Record<KravioMetricTrendDirection, string> = {
  up: "text-emerald-600",
  down: "text-red-600",
  neutral: "text-muted-foreground",
}

const TREND_CHART_CLASS: Record<KravioMetricTrendDirection, string> = {
  up: "text-emerald-600",
  down: "text-red-600",
  neutral: "text-muted-foreground",
}

const DEFAULT_SPARKLINE: Record<KravioMetricTrendDirection, number[]> = {
  up: [3, 3.5, 3.2, 4.1, 3.8, 4.6, 5.2],
  down: [5.2, 4.8, 4.5, 4.2, 3.9, 3.6, 3.2],
  neutral: [0, 0, 0, 0, 0, 0, 0],
}

export const KRAVIO_METRIC_CARD_INNER_CLASSNAME = cn(
  KRAVIO_CARD_INNER_CLASSNAME,
  "px-3 py-2.5 sm:px-3.5 sm:py-3"
)

function Sparkline({
  data,
  direction = "neutral",
}: {
  data: number[]
  direction?: KravioMetricTrendDirection
}) {
  if (data.length < 2) return null

  const width = 88
  const height = 40
  const padding = 2
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2)
    const y = padding + (1 - (point - min) / range) * (height - padding * 2)
    return { x, y }
  })

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ")
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-10 w-[5.5rem] shrink-0", TREND_CHART_CLASS[direction])}
      aria-hidden
    >
      <path d={areaPath} className="fill-current opacity-[0.14]" />
      <path
        d={linePath}
        fill="none"
        className="stroke-current"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function formatTrendValue(trend: KravioMetricTrend): string {
  const prefix =
    trend.direction === "up" ? "+" : trend.direction === "down" ? "-" : ""
  const magnitude =
    trend.direction === "down" ? Math.abs(trend.value) : trend.value
  return `${prefix}${magnitude.toFixed(1)}%`
}

type KpiCardProps = {
  label: string
  value: string
  change: number
  sparkline: number[]
  isLoading?: boolean
  formatValue?: (raw: string) => string
  icon: LucideIcon
}

export function KpiCard({
  label,
  value,
  change,
  sparkline,
  isLoading,
  formatValue,
  icon: Icon,
}: KpiCardProps) {
  const direction: KravioMetricTrendDirection =
    change > 0 ? "up" : change < 0 ? "down" : "neutral"
  const trend: KravioMetricTrend = {
    value: Math.abs(change),
    direction,
    label: "vs prior period",
  }
  const display = formatValue ? formatValue(value) : value
  const chartData =
    sparkline.length >= 2 ? sparkline : DEFAULT_SPARKLINE[direction]

  return (
    <article className={cn(KRAVIO_CARD_OUTER_CLASSNAME, "h-full")}>
      <div className="flex items-start justify-between gap-2 px-1 sm:px-1.5">
        <p className="min-w-0 flex-1 text-sm font-medium text-muted-foreground">
          {label}
        </p>
        <Icon
          className="h-[1.125rem] w-[1.125rem] shrink-0 text-muted-foreground/80"
          strokeWidth={1.75}
          aria-hidden
        />
      </div>

      <div
        className={cn(
          KRAVIO_CARD_INNER_OFFSET_CLASSNAME,
          "flex min-h-0 w-full flex-1 flex-col",
          KRAVIO_METRIC_CARD_INNER_CLASSNAME
        )}
      >
        {isLoading ? (
          <Skeleton className="h-10 w-28" />
        ) : (
          <div className="flex min-w-0 flex-1 items-end justify-between gap-2">
            <div className="min-w-0 flex-1 space-y-1.5">
              <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {display}
              </p>
              <p className="text-xs leading-snug sm:text-sm">
                <span
                  className={cn("font-semibold", TREND_TEXT_CLASS[direction])}
                >
                  {formatTrendValue(trend)}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  {trend.label}
                </span>
              </p>
            </div>
            <Sparkline data={chartData} direction={direction} />
          </div>
        )}
      </div>
    </article>
  )
}
