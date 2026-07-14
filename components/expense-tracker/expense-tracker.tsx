"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { AddExpenseForm } from "@/components/expense-tracker/add-expense-form"
import { ExpenseList } from "@/components/expense-tracker/expense-list"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { getExpenses } from "@/lib/api"
import { percentChange } from "@/lib/dashboard-stats"
import { formatCurrency } from "@/lib/format"
import type { Expense } from "@/lib/types"

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <div className="flex flex-col gap-4">
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
