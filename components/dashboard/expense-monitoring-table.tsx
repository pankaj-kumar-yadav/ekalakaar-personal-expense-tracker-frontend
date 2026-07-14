"use client"

import { useMemo, useState } from "react"
import { FilterIcon, MoreHorizontalIcon, SearchIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { deleteExpense } from "@/lib/api"
import { categoryAccent } from "@/lib/dashboard-stats"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Expense } from "@/lib/types"

type ExpenseMonitoringTableProps = {
  expenses: Expense[]
  isLoading?: boolean
  onDeleted?: (id: string) => void
}

export function ExpenseMonitoringTable({
  expenses,
  isLoading,
  onDeleted,
}: ExpenseMonitoringTableProps) {
  const [query, setQuery] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q
      ? expenses.filter(
          (expense) =>
            expense.description.toLowerCase().includes(q) ||
            expense.category.toLowerCase().includes(q) ||
            expense._id.toLowerCase().includes(q)
        )
      : expenses

    return [...filtered]
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 8)
  }, [expenses, query])

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this expense?")) return
    setDeletingId(id)
    try {
      await deleteExpense(id)
      onDeleted?.(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
        <h2 className="font-semibold tracking-tight">Expense Monitoring</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search expense"
              className="h-8 w-44 pl-8 text-sm"
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1.5">
            <FilterIcon className="size-3.5" />
            Filter
          </Button>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index} className="border-b">
                  <td colSpan={7} className="px-4 py-3">
                    <Skeleton className="h-8 w-full" />
                  </td>
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No expenses to monitor yet.
                </td>
              </tr>
            ) : (
              rows.map((expense) => (
                <tr
                  key={expense._id}
                  className="border-b last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    #{expense._id.slice(-4)}
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 font-medium">
                    {expense.description}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={`size-2 rounded-sm ${categoryAccent(expense.category)}`}
                      />
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(expense.date)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                      <span className="size-1.5 rounded-full bg-success" />
                      Recorded
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {onDeleted ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        disabled={deletingId === expense._id}
                        onClick={() => handleDelete(expense._id)}
                        aria-label="Delete expense"
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
