"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  ChartNoAxesColumnIcon,
  DatabaseIcon,
  ReceiptIcon,
  WalletIcon,
} from "lucide-react"

import { AddExpenseForm } from "@/components/expense-tracker/add-expense-form"
import { ExpenseList } from "@/components/expense-tracker/expense-list"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { Button } from "@/components/ui/button"
import { getExpenses, seedExpenses } from "@/lib/api"
import { percentChange } from "@/lib/dashboard-stats"
import { formatCurrency } from "@/lib/format"
import type { Expense, PaginationMeta } from "@/lib/types"

const PAGE_SIZE = 5

const EMPTY_META: PaginationMeta = {
  page: 1,
  limit: PAGE_SIZE,
  totalCount: 0,
  totalPage: 0,
  hasNext: false,
  hasPrev: false,
}

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(EMPTY_META)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSeeding, setIsSeeding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [seedError, setSeedError] = useState<string | null>(null)

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  )

  const avg = expenses.length ? total / expenses.length : 0
  const sparkline = useMemo(() => {
    const last = [...expenses]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7)
      .map((expense) => expense.amount)
    return last.length ? last : [0]
  }, [expenses])

  const loadExpenses = useCallback(async (nextPage: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getExpenses({ page: nextPage, limit: PAGE_SIZE })
      setExpenses(result.data)
      setMeta(result.meta)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load expenses.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadExpenses(page)
  }, [page, loadExpenses])

  function handleExpenseAdded(expense: Expense) {
    if (page === 1) {
      setExpenses((current) => [expense, ...current].slice(0, PAGE_SIZE))
      setMeta((current) => {
        const totalCount = current.totalCount + 1
        const totalPage = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
        return {
          ...current,
          totalCount,
          totalPage,
          hasNext: totalPage > 1,
        }
      })
      return
    }
    setPage(1)
  }

  async function handleExpenseDeleted() {
    if (expenses.length === 1 && page > 1) {
      setPage((current) => current - 1)
      return
    }
    await loadExpenses(page)
  }

  async function handleSeed() {
    setIsSeeding(true)
    setSeedError(null)
    try {
      await seedExpenses()
      if (page === 1) {
        await loadExpenses(1)
      } else {
        setPage(1)
      }
    } catch (err) {
      setSeedError(
        err instanceof Error ? err.message : "Failed to seed expenses."
      )
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Expenses
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add, review, and remove expenses in one place.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-9 gap-2 bg-card"
          disabled={isSeeding || isLoading}
          onClick={() => void handleSeed()}
        >
          <DatabaseIcon className="size-4" />
          {isSeeding ? "Seeding…" : "Seed Data"}
        </Button>
      </div>

      {seedError ? (
        <p className="text-sm text-destructive">{seedError}</p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Total Spent"
          value={String(total)}
          change={0}
          sparkline={sparkline}
          isLoading={isLoading}
          icon={WalletIcon}
          formatValue={(raw) => formatCurrency(Number(raw))}
        />
        <KpiCard
          label="All Expenses"
          value={String(meta.totalCount)}
          change={percentChange(
            meta.totalCount,
            Math.max(meta.totalCount - 1, 0)
          )}
          sparkline={sparkline}
          isLoading={isLoading}
          icon={ReceiptIcon}
        />
        <KpiCard
          label="Average"
          value={String(avg)}
          change={0}
          sparkline={sparkline}
          isLoading={isLoading}
          icon={ChartNoAxesColumnIcon}
          formatValue={(raw) => formatCurrency(Number(raw))}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <AddExpenseForm onExpenseAdded={handleExpenseAdded} />
        <ExpenseList
          expenses={expenses}
          meta={meta}
          isLoading={isLoading}
          error={error}
          onRetry={() => void loadExpenses(page)}
          onDeleted={() => void handleExpenseDeleted()}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
