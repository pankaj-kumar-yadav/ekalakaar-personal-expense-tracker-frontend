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
  PaginationMeta,
  PeriodKey,
} from "@/lib/types"

const TABLE_PAGE_SIZE = 10

const EMPTY_META: PaginationMeta = {
  page: 1,
  limit: TABLE_PAGE_SIZE,
  totalCount: 0,
  totalPage: 0,
  hasNext: false,
  hasPrev: false,
}

export function useDashboard() {
  const [period, setPeriod] = useState<PeriodKey>("this-week")
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [chart, setChart] = useState<DashboardChart | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [expenseMeta, setExpenseMeta] = useState<PaginationMeta>(EMPTY_META)
  const [expensePage, setExpensePage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reloadOverview = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [metricsData, chartData] = await Promise.all([
        getDashboardMetrics(period),
        getDashboardChart(period),
      ])
      setMetrics(metricsData)
      setChart(chartData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard.")
    } finally {
      setIsLoading(false)
    }
  }, [period])

  const reloadExpenses = useCallback(async (page: number) => {
    setIsTableLoading(true)
    try {
      const result = await getExpenses({ page, limit: TABLE_PAGE_SIZE })
      setExpenses(result.data)
      setExpenseMeta(result.meta)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load expenses.")
    } finally {
      setIsTableLoading(false)
    }
  }, [])

  useEffect(() => {
    void reloadOverview()
  }, [reloadOverview])

  useEffect(() => {
    void reloadExpenses(expensePage)
  }, [expensePage, reloadExpenses])

  const reload = useCallback(async () => {
    await Promise.all([reloadOverview(), reloadExpenses(expensePage)])
  }, [expensePage, reloadExpenses, reloadOverview])

  const onExpenseDeleted = useCallback(async () => {
    if (expenses.length === 1 && expensePage > 1) {
      setExpensePage((current) => current - 1)
      return
    }
    await reloadExpenses(expensePage)
  }, [expensePage, expenses.length, reloadExpenses])

  return {
    period,
    setPeriod,
    metrics,
    chart,
    expenses,
    expenseMeta,
    setExpensePage,
    isLoading,
    isTableLoading,
    error,
    reload,
    onExpenseDeleted,
  }
}
