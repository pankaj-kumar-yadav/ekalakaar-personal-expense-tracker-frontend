import axios, { isAxiosError } from "axios"

import type {
  ApiListResponse,
  ApiSuccessResponse,
  Expense,
  NewExpense,
  User,
} from "@/lib/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
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

export async function registerUser(payload: {
  name: string
  email: string
  password: string
}): Promise<User> {
  try {
    const { data } = await api.post<ApiSuccessResponse<User>>(
      "/api/users/register",
      payload
    )
    return data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function loginUser(payload: {
  email: string
  password: string
}): Promise<User> {
  try {
    const { data } = await api.post<ApiSuccessResponse<User>>(
      "/api/users/login",
      payload
    )
    return data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post("/api/users/logout")
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getMe(): Promise<User> {
  try {
    const { data } = await api.get<ApiSuccessResponse<User>>("/api/users/me")
    return data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getExpenses(): Promise<Expense[]> {
  try {
    const { data } = await api.get<ApiListResponse<Expense>>("/api/expenses")
    return data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function createExpense(payload: NewExpense): Promise<Expense> {
  try {
    const { data } = await api.post<ApiSuccessResponse<Expense>>(
      "/api/expenses",
      payload
    )
    return data.data
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
