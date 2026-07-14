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

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Other",
] as const
