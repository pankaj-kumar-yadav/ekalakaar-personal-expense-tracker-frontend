import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ExpenseItem } from "@/components/expense-item"
import type { Expense } from "@/lib/types"

type ExpenseListProps = {
  expenses: Expense[]
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  onDeleted: (id: string) => void
}

export function ExpenseList({
  expenses,
  isLoading = false,
  error = null,
  onRetry,
  onDeleted,
}: ExpenseListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Expenses</CardTitle>
        <CardDescription>
          {expenses.length
            ? `${expenses.length} expense${expenses.length === 1 ? "" : "s"} recorded`
            : "Your expense history will appear here."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
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
            No expenses yet. Add your first expense above.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {expenses.map((expense) => (
              <ExpenseItem
                key={expense._id}
                expense={expense}
                onDeleted={onDeleted}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
