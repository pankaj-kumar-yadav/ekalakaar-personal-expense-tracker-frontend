import { endOfDay, parseISO, startOfDay } from "date-fns"

import type { Expense } from "@/lib/types"

export type ExpenseMonitorFilters = {
  categories: string[]
  from: string
  to: string
}

export const EMPTY_MONITOR_FILTERS: ExpenseMonitorFilters = {
  categories: [],
  from: "",
  to: "",
}

export function countActiveMonitorFilters(filters: ExpenseMonitorFilters) {
  return (
    filters.categories.length +
    (filters.from !== "" ? 1 : 0) +
    (filters.to !== "" ? 1 : 0)
  )
}

export function hasActiveMonitorFilters(filters: ExpenseMonitorFilters) {
  return countActiveMonitorFilters(filters) > 0
}

export function filterExpensesByMonitorFilters(
  expenses: Expense[],
  filters: ExpenseMonitorFilters
) {
  return expenses.filter((expense) => {
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(expense.category)
    ) {
      return false
    }

    if (!filters.from && !filters.to) return true

    const date = parseISO(expense.date)

    if (filters.from) {
      const start = startOfDay(parseISO(filters.from))
      if (date < start) return false
    }

    if (filters.to) {
      const end = endOfDay(parseISO(filters.to))
      if (date > end) return false
    }

    return true
  })
}
