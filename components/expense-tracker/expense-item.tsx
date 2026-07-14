"use client"

import { useState } from "react"
import { Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { deleteExpense } from "@/lib/api"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Expense } from "@/lib/types"

type ExpenseItemProps = {
  expense: Expense
  onDeleted: (id: string) => void
}

export function ExpenseItem({ expense, onDeleted }: ExpenseItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    if (!window.confirm("Delete this expense?")) {
      return
    }

    setError(null)
    setIsDeleting(true)
    try {
      await deleteExpense(expense._id)
      onDeleted(expense._id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete expense.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium">{expense.description}</p>
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {expense.category}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatDate(expense.date)}
        </p>
        {error ? (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <p className="font-medium">{formatCurrency(expense.amount)}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2Icon className="size-4" />
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  )
}
