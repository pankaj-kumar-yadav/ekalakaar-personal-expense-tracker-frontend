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

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Other",
] as const
