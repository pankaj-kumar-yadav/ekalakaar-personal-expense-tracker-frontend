import axios, { isAxiosError } from "axios"

import type { Expense, NewExpense } from "@/lib/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data
    if (typeof data === "string" && data) {
      return data
    }
    if (data && typeof data === "object" && "message" in data) {
      return String(data.message)
    }
    return error.message || `Request failed (${error.response?.status ?? "unknown"})`
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Request failed"
}

export async function getExpenses(): Promise<Expense[]> {
  try {
    const { data } = await api.get<Expense[]>("/api/expenses")
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function createExpense(payload: NewExpense): Promise<Expense> {
  try {
    const { data } = await api.post<Expense>("/api/expenses", payload)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function deleteExpense(id: string): Promise<void> {
  try {
    await api.delete(`/api/expenses/${id}`)
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
