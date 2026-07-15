"use client"

import { useMemo, useState } from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CompassIcon,
  FilterIcon,
  MoreHorizontalIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react"

import { ExpenseMonitorFilterDialog } from "@/components/dashboard/expense-monitor-filter-dialog"
import {
  EMPTY_MONITOR_FILTERS,
  countActiveMonitorFilters,
  filterExpensesByMonitorFilters,
  type ExpenseMonitorFilters,
} from "@/components/dashboard/expense-monitor-filters"
import { KravioCard } from "@/components/dashboard/kravio-card"
import { DeleteExpenseDialog } from "@/components/expense-tracker/delete-expense-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { deleteExpense } from "@/lib/api"
import { categoryAccent } from "@/lib/dashboard-stats"
import { formatCurrency, formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Expense, PaginationMeta } from "@/lib/types"

type ExpenseMonitoringTableProps = {
  expenses: Expense[]
  meta: PaginationMeta
  isLoading?: boolean
  onDeleted?: (id: string) => void
  onPageChange: (page: number) => void
}

export function ExpenseMonitoringTable({
  expenses,
  meta,
  isLoading,
  onDeleted,
  onPageChange,
}: ExpenseMonitoringTableProps) {
  const [query, setQuery] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [appliedFilters, setAppliedFilters] =
    useState<ExpenseMonitorFilters>(EMPTY_MONITOR_FILTERS)
  const [pendingDelete, setPendingDelete] = useState<Expense | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const activeFilterCount = countActiveMonitorFilters(appliedFilters)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = filterExpensesByMonitorFilters(expenses, appliedFilters)
    if (!q) return filtered

    return filtered.filter(
      (expense) =>
        expense.description.toLowerCase().includes(q) ||
        expense.category.toLowerCase().includes(q) ||
        expense._id.toLowerCase().includes(q)
    )
  }, [expenses, query, appliedFilters])

  async function handleConfirmDelete() {
    if (!pendingDelete) return
    setIsDeleting(true)
    try {
      await deleteExpense(pendingDelete._id)
      const id = pendingDelete._id
      setPendingDelete(null)
      onDeleted?.(id)
    } finally {
      setIsDeleting(false)
    }
  }

  const headerActions = (
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
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(
          "h-8 gap-1.5",
          activeFilterCount > 0 &&
            "border-primary/40 bg-primary/5 text-primary"
        )}
        onClick={() => setFilterOpen(true)}
      >
        <FilterIcon className="size-3.5" />
        Filter
        {activeFilterCount > 0 ? (
          <span className="inline-flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {activeFilterCount}
          </span>
        ) : null}
      </Button>
      <Button variant="ghost" size="icon" className="size-8">
        <MoreHorizontalIcon className="size-4" />
      </Button>
    </div>
  )

  return (
    <KravioCard
      title="Expense Monitoring"
      icon={CompassIcon}
      iconPosition="left"
      headerActions={headerActions}
      innerClassName="overflow-hidden p-0"
    >
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
              Array.from({ length: 10 }).map((_, index) => (
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
                        disabled={
                          isDeleting && pendingDelete?._id === expense._id
                        }
                        onClick={() => setPendingDelete(expense)}
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

      {meta.totalPage > 1 ? (
        <div className="flex items-center justify-between gap-3 border-t px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Page {meta.page} of {meta.totalPage} · {meta.totalCount} total
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

      <ExpenseMonitorFilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        applied={appliedFilters}
        onApply={setAppliedFilters}
        onClear={() => setAppliedFilters(EMPTY_MONITOR_FILTERS)}
      />

      <DeleteExpenseDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setPendingDelete(null)
        }}
        expenseDescription={pendingDelete?.description ?? ""}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </KravioCard>
  )
}
