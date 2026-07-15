"use client"

import { useCallback, useEffect, useState } from "react"

import {
  getDashboardChart,
  getDashboardMetrics,
  getExpenses,
} from "@/lib/api"
import type {
  DashboardChart,
  DashboardMetrics,
  Expense,
  PeriodKey,
} from "@/lib/types"

export function useDashboard() {
  const [period, setPeriod] = useState<PeriodKey>("this-week")
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [chart, setChart] = useState<DashboardChart | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
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
    void reload()
  }, [reload])

  const onExpenseDeleted = useCallback((id: string) => {
    setExpenses((current) => current.filter((item) => item._id !== id))
  }, [])

  return {
    period,
    setPeriod,
    metrics,
    chart,
    expenses,
    isLoading,
    error,
    reload,
    onExpenseDeleted,
  }
}
