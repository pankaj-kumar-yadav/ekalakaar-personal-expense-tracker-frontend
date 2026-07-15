import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ReceiptIcon,
} from "lucide-react"

import { KravioCard } from "@/components/dashboard/kravio-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ExpenseItem } from "@/components/expense-tracker/expense-item"
import type { Expense, PaginationMeta } from "@/lib/types"

type ExpenseListProps = {
  expenses: Expense[]
  meta: PaginationMeta
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  onDeleted: (id: string) => void
  onPageChange: (page: number) => void
}

export function ExpenseList({
  expenses,
  meta,
  isLoading = false,
  error = null,
  onRetry,
  onDeleted,
  onPageChange,
}: ExpenseListProps) {
  const description = meta.totalCount
    ? `Page ${meta.page} of ${meta.totalPage} · ${meta.totalCount} total`
    : "Your expense history will appear here."

  return (
    <KravioCard
      title="All Expenses"
      description={description}
      icon={ReceiptIcon}
      iconPosition="left"
      innerClassName="flex flex-col gap-4 p-4 sm:p-5"
    >
      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <p className="text-destructive">{error}</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-sm font-medium underline underline-offset-4"
            >
              Try again
            </button>
          ) : null}
        </div>
      ) : expenses.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No expenses yet. Add your first expense to the left.
        </div>
      ) : (
        <div className="flex flex-col divide-y rounded-lg border">
          {expenses.map((expense) => (
            <ExpenseItem
              key={expense._id}
              expense={expense}
              onDeleted={onDeleted}
            />
          ))}
        </div>
      )}

      {meta.totalPage > 1 ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Showing {expenses.length} of {meta.totalCount}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              disabled={!meta.hasPrev || isLoading}
              onClick={() => onPageChange(meta.page - 1)}
            >
              <ChevronLeftIcon className="size-3.5" />
              Prev
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              disabled={!meta.hasNext || isLoading}
              onClick={() => onPageChange(meta.page + 1)}
            >
              Next
              <ChevronRightIcon className="size-3.5" />
            </Button>
          </div>
        </div>
      ) : null}
    </KravioCard>
  )
}
