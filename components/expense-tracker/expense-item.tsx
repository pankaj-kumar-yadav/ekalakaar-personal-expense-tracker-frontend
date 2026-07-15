"use client"

import { useState } from "react"
import { Trash2Icon } from "lucide-react"

import { DeleteExpenseDialog } from "@/components/expense-tracker/delete-expense-dialog"
import { Button } from "@/components/ui/button"
import { deleteExpense } from "@/lib/api"
import { categoryAccent } from "@/lib/dashboard-stats"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Expense } from "@/lib/types"

type ExpenseItemProps = {
  expense: Expense
  onDeleted: (id: string) => void
}

export function ExpenseItem({ expense, onDeleted }: ExpenseItemProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirmDelete() {
    setError(null)
    setIsDeleting(true)
    try {
      await deleteExpense(expense._id)
      setConfirmOpen(false)
      onDeleted(expense._id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete expense.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 px-3 py-3 first:rounded-t-lg last:rounded-b-lg">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-medium">{expense.description}</p>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              <span
                className={`size-1.5 rounded-sm ${categoryAccent(expense.category)}`}
              />
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
        <div className="flex shrink-0 items-center gap-2">
          <p className="font-semibold tabular-nums">
            {formatCurrency(expense.amount)}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            onClick={() => setConfirmOpen(true)}
            disabled={isDeleting}
            aria-label="Delete expense"
          >
            <Trash2Icon className="size-4" />
          </Button>
        </div>
      </div>

      <DeleteExpenseDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        expenseDescription={expense.description}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
