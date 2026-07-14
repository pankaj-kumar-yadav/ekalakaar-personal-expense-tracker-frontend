"use client"

import { useCallback, useEffect, useState } from "react"
import { ChevronDownIcon } from "lucide-react"

import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ExpenseMonitoringTable } from "@/components/dashboard/expense-monitoring-table"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { SpendingChart } from "@/components/dashboard/spending-chart"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  getDashboardChart,
  getDashboardMetrics,
  getExpenses,
} from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { formatCurrency } from "@/lib/format"
import type {
  DashboardChart,
  DashboardMetrics,
  Expense,
  PeriodKey,
} from "@/lib/types"

const PERIOD_OPTIONS: { key: PeriodKey; label: string }[] = [
  { key: "this-week", label: "This week" },
  { key: "last-week", label: "Last week" },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [period, setPeriod] = useState<PeriodKey>("this-week")
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [chart, setChart] = useState<DashboardChart | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboard = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [metricsData, chartData, expensesData] = await Promise.all([
        getDashboardMetrics(period),
        getDashboardChart(period),
        getExpenses(),
      ])
      setMetrics(metricsData)
      setChart(chartData)
      setExpenses(expensesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard.")
    } finally {
      setIsLoading(false)
    }
  }, [period])

  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  const periodLabel =
    PERIOD_OPTIONS.find((option) => option.key === period)?.label ?? "This week"

  return (
    <>
      <DashboardHeader breadcrumbs={[{ label: "Dashboard" }]} />
      <div className="flex flex-1 flex-col gap-5 p-4 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Hello, {user?.name ?? "there"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Here&apos;s your spending overview for the selected period.
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" className="h-9 gap-2 bg-card" />
              }
            >
              {periodLabel}
              <ChevronDownIcon className="size-4 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {PERIOD_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.key}
                  onClick={() => setPeriod(option.key)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
            <p className="text-destructive">{error}</p>
            <button
              type="button"
              onClick={loadDashboard}
              className="mt-2 text-sm font-medium underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          {(
            metrics?.kpis ?? [
              {
                label: "Total Spent",
                value: "0",
                change: 0,
                sparkline: [0],
              },
              {
                label: "Expenses Logged",
                value: "0",
                change: 0,
                sparkline: [0],
              },
              {
                label: "Avg. Expense",
                value: "0",
                change: 0,
                sparkline: [0],
              },
            ]
          ).map((kpi) => (
            <KpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              change={kpi.change}
              sparkline={kpi.sparkline}
              isLoading={isLoading}
              formatValue={
                kpi.label === "Expenses Logged"
                  ? undefined
                  : (raw) => formatCurrency(Number(raw))
              }
            />
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <SpendingChart
            total={chart?.total ?? 0}
            change={chart?.change ?? 0}
            days={chart?.days ?? []}
            isLoading={isLoading}
          />
          <ActivityFeed />
        </div>

        <ExpenseMonitoringTable
          expenses={expenses}
          isLoading={isLoading}
          onDeleted={(id) =>
            setExpenses((current) => current.filter((item) => item._id !== id))
          }
        />
      </div>
    </>
  )
}
