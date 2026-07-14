export type User = {
  _id: string
  name: string
  email: string
}

export type Expense = {
  _id: string
  amount: number
  description: string
  category: string
  date: string
  createdAt?: string
  updatedAt?: string
}

export type NewExpense = {
  amount: number
  description: string
  category: string
  date: string
}

export type ApiSuccessResponse<T> = {
  success: true
  data: T
}

export type ApiListResponse<T> = {
  success: true
  count: number
  totalAmount: number
  data: T[]
}

export type PeriodKey = "this-week" | "last-week"

export type ActivityRangeKey = "today" | "yesterday" | "week"

export type DashboardKpi = {
  label: string
  value: string
  change: number
  sparkline: number[]
}

export type DashboardMetrics = {
  period: PeriodKey
  range: { start: string; end: string }
  kpis: DashboardKpi[]
}

export type DashboardChartDay = {
  label: string
  fullLabel: string
  date: string
  amount: number
}

export type DashboardChart = {
  period: PeriodKey
  total: number
  change: number
  days: DashboardChartDay[]
}

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Other",
] as const
