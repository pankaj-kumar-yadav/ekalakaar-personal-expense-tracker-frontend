"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { AddExpenseForm } from "@/components/expense-tracker/add-expense-form"
import { ExpenseList } from "@/components/expense-tracker/expense-list"
import { TotalSpent } from "@/components/expense-tracker/total-spent"
import { getExpenses } from "@/lib/api"
import type { Expense } from "@/lib/types"

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  )

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
      <TotalSpent total={total} isLoading={isLoading} />
      <div className="grid gap-4 lg:grid-cols-2">
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
