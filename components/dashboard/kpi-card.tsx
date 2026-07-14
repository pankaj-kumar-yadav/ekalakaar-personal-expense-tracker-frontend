import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type KpiCardProps = {
  label: string
  value: string
  change: number
  sparkline: number[]
  isLoading?: boolean
  formatValue?: (raw: string) => string
}

function Sparkline({
  values,
  positive,
}: {
  values: number[]
  positive: boolean
}) {
  const max = Math.max(...values, 1)
  const points = values
    .map((value, index) => {
      const x = values.length === 1 ? 0 : (index / (values.length - 1)) * 64
      const y = 22 - (value / max) * 18
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg viewBox="0 0 64 24" className="h-8 w-16 overflow-visible" aria-hidden>
      <polyline
        fill="none"
        stroke={positive ? "var(--success)" : "var(--destructive)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

export function KpiCard({
  label,
  value,
  change,
  sparkline,
  isLoading,
  formatValue,
}: KpiCardProps) {
  const positive = change >= 0
  const display = formatValue ? formatValue(value) : value

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      {isLoading ? (
        <Skeleton className="mt-2 h-8 w-28" />
      ) : (
        <div className="mt-1 flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-semibold tracking-tight">{display}</p>
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                positive ? "text-success" : "text-destructive"
              )}
            >
              {positive ? "+" : ""}
              {change.toFixed(1)}% vs prior period
            </p>
          </div>
          <Sparkline values={sparkline} positive={positive} />
        </div>
      )}
    </div>
  )
}
