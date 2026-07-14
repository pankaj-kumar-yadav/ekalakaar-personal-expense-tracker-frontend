"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ArrowRightIcon, ReceiptIcon, WalletIcon } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getExpenses } from "@/lib/api"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Expense } from "@/lib/types"

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  )

  const recentExpenses = useMemo(
    () =>
      [...expenses]
        .sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, 5),
    [expenses]
  )

  const categories = useMemo(() => {
    const counts = new Map<string, number>()
    for (const expense of expenses) {
      counts.set(expense.category, (counts.get(expense.category) ?? 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
  }, [expenses])

  return (
    <>
      <DashboardHeader breadcrumbs={[{ label: "Dashboard" }]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your spending and recent activity.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <WalletIcon className="size-4" />
                Total Spent
              </CardDescription>
              <CardTitle className="text-2xl">
                {isLoading ? (
                  <Skeleton className="h-8 w-32" />
                ) : (
                  formatCurrency(total)
                )}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <ReceiptIcon className="size-4" />
                Total Expenses
              </CardDescription>
              <CardTitle className="text-2xl">
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  expenses.length
                )}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Top Categories</CardDescription>
              <CardTitle className="text-base font-medium">
                {isLoading ? (
                  <Skeleton className="h-6 w-full" />
                ) : categories.length ? (
                  categories
                    .map(([category, count]) => `${category} (${count})`)
                    .join(", ")
                ) : (
                  "No categories yet"
                )}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>
                Your latest transactions across all categories.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" render={<Link href="/expenses" />}>
              View all
              <ArrowRightIcon className="size-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : error ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
                <p className="text-destructive">{error}</p>
                <button
                  type="button"
                  onClick={loadExpenses}
                  className="mt-2 text-sm font-medium underline underline-offset-4"
                >
                  Try again
                </button>
              </div>
            ) : recentExpenses.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                <p>No expenses yet.</p>
                <Button className="mt-4" render={<Link href="/expenses" />}>
                  Add your first expense
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recentExpenses.map((expense) => (
                  <div
                    key={expense._id}
                    className="flex items-center justify-between gap-4 rounded-lg border p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.category} · {formatDate(expense.date)}
                      </p>
                    </div>
                    <p className="shrink-0 font-medium">
                      {formatCurrency(expense.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
