"use client"

import { SparklesIcon } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { KravioCard } from "@/components/dashboard/kravio-card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"

type DayPoint = {
  label: string
  amount: number
  fullLabel?: string
}

type SpendingChartProps = {
  title?: string
  total: number
  change: number
  days: DayPoint[]
  isLoading?: boolean
}

const chartConfig = {
  amount: {
    label: "Spending",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function SpendingChart({
  title = "Spending Trend",
  total,
  change,
  days,
  isLoading,
}: SpendingChartProps) {
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

      <div className="mt-6 flex min-h-[180px] flex-1 flex-col justify-end">
        {isLoading ? (
          <div className="h-[180px] w-full rounded-md bg-muted" />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[180px] w-full"
          >
            <AreaChart
              accessibilityLayer
              data={days}
              margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={48}
                tickFormatter={(value) =>
                  typeof value === "number"
                    ? new Intl.NumberFormat("en-IN", {
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(value)
                    : String(value)
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatCurrency(Number(value))}
                    labelFormatter={(_, payload) => {
                      const point = payload?.[0]?.payload as
                        | DayPoint
                        | undefined
                      return point?.fullLabel ?? point?.label ?? ""
                    }}
                  />
                }
              />
              <Area
                type="natural"
                dataKey="amount"
                stroke="var(--color-amount)"
                fill="var(--color-amount)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </div>
    </KravioCard>
  )
}
