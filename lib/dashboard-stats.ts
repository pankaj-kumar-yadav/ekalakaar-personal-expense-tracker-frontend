import {
  eachDayOfInterval,
  endOfDay,
  endOfWeek,
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfWeek,
  subWeeks,
} from "date-fns"

import type { Expense } from "@/lib/types"

export type PeriodKey = "this-week" | "last-week"

export type PeriodRange = {
  start: Date
  end: Date
  label: string
  previous: { start: Date; end: Date }
}

export function getPeriodRange(period: PeriodKey, now = new Date()): PeriodRange {
  if (period === "last-week") {
    const start = startOfWeek(subWeeks(now, 1), { weekStartsOn: 0 })
    const end = endOfWeek(subWeeks(now, 1), { weekStartsOn: 0 })
    return {
      start,
      end,
      label: "Last week",
      previous: {
        start: startOfWeek(subWeeks(now, 2), { weekStartsOn: 0 }),
        end: endOfWeek(subWeeks(now, 2), { weekStartsOn: 0 }),
      },
    }
  }

  const start = startOfWeek(now, { weekStartsOn: 0 })
  const end = endOfWeek(now, { weekStartsOn: 0 })
  return {
    start,
    end,
    label: "This week",
    previous: {
      start: startOfWeek(subWeeks(now, 1), { weekStartsOn: 0 }),
      end: endOfWeek(subWeeks(now, 1), { weekStartsOn: 0 }),
    },
  }
}

function inRange(expense: Expense, start: Date, end: Date) {
  const date = parseISO(expense.date)
  return isWithinInterval(date, { start: startOfDay(start), end: endOfDay(end) })
}

export function filterByRange(expenses: Expense[], start: Date, end: Date) {
  return expenses.filter((expense) => inRange(expense, start, end))
}

export function sumAmount(expenses: Expense[]) {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0)
}

export function percentChange(current: number, previous: number) {
  if (previous === 0) {
    return current === 0 ? 0 : 100
  }
  return ((current - previous) / previous) * 100
}

export type KpiStat = {
  label: string
  value: string
  change: number
  sparkline: number[]
}

export function buildDailyTotals(
  expenses: Expense[],
  start: Date,
  end: Date
): { label: string; fullLabel: string; amount: number; date: Date }[] {
  return eachDayOfInterval({ start, end }).map((day) => {
    const dayExpenses = expenses.filter((expense) =>
      isWithinInterval(parseISO(expense.date), {
        start: startOfDay(day),
        end: endOfDay(day),
      })
    )
    return {
      label: format(day, "EEE"),
      fullLabel: format(day, "EEE"),
      amount: sumAmount(dayExpenses),
      date: day,
    }
  })
}

export function buildDashboardStats(expenses: Expense[], period: PeriodKey) {
  const range = getPeriodRange(period)
  const current = filterByRange(expenses, range.start, range.end)
  const previous = filterByRange(
    expenses,
    range.previous.start,
    range.previous.end
  )

  const currentTotal = sumAmount(current)
  const previousTotal = sumAmount(previous)
  const currentCount = current.length
  const previousCount = previous.length
  const currentAvg = currentCount ? currentTotal / currentCount : 0
  const previousAvg = previousCount ? previousTotal / previousCount : 0

  const daily = buildDailyTotals(expenses, range.start, range.end)
  const sparkline = daily.map((d) => d.amount)

  const kpis: KpiStat[] = [
    {
      label: "Total Spent",
      value: currentTotal.toFixed(2),
      change: percentChange(currentTotal, previousTotal),
      sparkline,
    },
    {
      label: "Expenses Logged",
      value: String(currentCount),
      change: percentChange(currentCount, previousCount),
      sparkline: daily.map((d) =>
        filterByRange(expenses, d.date, d.date).length
      ),
    },
    {
      label: "Avg. Expense",
      value: currentAvg.toFixed(2),
      change: percentChange(currentAvg, previousAvg),
      sparkline,
    },
  ]

  const recent = [...expenses]
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? b.date).getTime() -
        new Date(a.createdAt ?? a.date).getTime()
    )
    .slice(0, 8)

  return {
    range,
    current,
    currentTotal,
    daily,
    kpis,
    recent,
  }
}

export function categoryAccent(category: string) {
  switch (category) {
    case "Food":
      return "bg-red-500"
    case "Transport":
      return "bg-orange-400"
    case "Bills":
      return "bg-amber-400"
    default:
      return "bg-sky-500"
  }
}
