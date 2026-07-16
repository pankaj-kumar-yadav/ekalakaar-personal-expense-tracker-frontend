import axios, { isAxiosError } from "axios"

import type {
  ActivityRangeKey,
  ApiListResponse,
  ApiPaginatedResponse,
  ApiSuccessResponse,
  DashboardChart,
  DashboardMetrics,
  Expense,
  NewExpense,
  PaginatedResult,
  PeriodKey,
  User,
} from "@/lib/types"

// Same-origin so the HttpOnly `jwt` cookie is set on the frontend host
// (via next.config rewrites) and readable by proxy.ts.
export const api = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

type UnauthorizedHandler = () => void

let unauthorizedHandler: UnauthorizedHandler | null = null

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler
}

function isAuthCredentialRequest(url: string | undefined) {
  if (!url) {
    return false
  }
  return (
    url.includes("/api/users/login") || url.includes("/api/users/register")
  )
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      isAxiosError(error) &&
      error.response?.status === 401 &&
      !isAuthCredentialRequest(error.config?.url)
    ) {
      unauthorizedHandler?.()
    }
    return Promise.reject(error)
  }
)

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

export async function getExpenses(params?: {
  page?: number
  limit?: number
}): Promise<PaginatedResult<Expense>> {
  try {
    const { data } = await api.get<ApiPaginatedResponse<Expense>>(
      "/api/expenses",
      {
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 100,
        },
      }
    )
    return { data: data.data, meta: data.meta }
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getDashboardMetrics(
  period: PeriodKey = "this-week"
): Promise<DashboardMetrics> {
  try {
    const { data } = await api.get<ApiSuccessResponse<DashboardMetrics>>(
      "/api/dashboard/metrics",
      { params: { period } }
    )
    return data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getDashboardChart(
  period: PeriodKey = "this-week"
): Promise<DashboardChart> {
  try {
    const { data } = await api.get<ApiSuccessResponse<DashboardChart>>(
      "/api/dashboard/chart",
      { params: { period } }
    )
    return data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getDashboardActivity(params?: {
  range?: ActivityRangeKey
  q?: string
}): Promise<Expense[]> {
  try {
    const { data } = await api.get<ApiListResponse<Expense>>(
      "/api/dashboard/activity",
      { params: { range: params?.range ?? "week", q: params?.q ?? "" } }
    )
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

export async function seedExpenses(): Promise<Expense[]> {
  try {
    const { data } = await api.post<ApiListResponse<Expense>>(
      "/api/expenses/seed"
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
