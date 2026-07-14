"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { DatabaseIcon } from "lucide-react"

import { AddExpenseForm } from "@/components/expense-tracker/add-expense-form"
import { ExpenseList } from "@/components/expense-tracker/expense-list"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { Button } from "@/components/ui/button"
import { getExpenses, seedExpenses } from "@/lib/api"
import { percentChange } from "@/lib/dashboard-stats"
import { formatCurrency } from "@/lib/format"
import type { Expense } from "@/lib/types"

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([])
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

  const loadExpenses = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getExpenses()
      setExpenses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load expenses.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadExpenses()
  }, [loadExpenses])

  function handleExpenseAdded(expense: Expense) {
    setExpenses((current) => [expense, ...current])
  }

  function handleExpenseDeleted(id: string) {
    setExpenses((current) => current.filter((expense) => expense._id !== id))
  }

  async function handleSeed() {
    setIsSeeding(true)
    setSeedError(null)
    try {
      const created = await seedExpenses()
      setExpenses((current) => [...created, ...current])
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
          formatValue={(raw) => formatCurrency(Number(raw))}
        />
        <KpiCard
          label="All Expenses"
          value={String(expenses.length)}
          change={percentChange(expenses.length, Math.max(expenses.length - 1, 0))}
          sparkline={sparkline}
          isLoading={isLoading}
        />
        <KpiCard
          label="Average"
          value={String(avg)}
          change={0}
          sparkline={sparkline}
          isLoading={isLoading}
          formatValue={(raw) => formatCurrency(Number(raw))}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <AddExpenseForm onExpenseAdded={handleExpenseAdded} />
        <ExpenseList
          expenses={expenses}
          isLoading={isLoading}
          error={error}
          onRetry={loadExpenses}
          onDeleted={handleExpenseDeleted}
        />
      </div>
    </div>
  )
}
