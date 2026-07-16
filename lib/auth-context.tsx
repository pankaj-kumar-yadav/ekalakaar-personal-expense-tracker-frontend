"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  loginUser,
  logoutUser,
  registerUser,
  setUnauthorizedHandler,
} from "@/lib/api"
import type { User } from "@/lib/types"

type AuthContextValue = {
  user: User | null
  login: (email: string, password: string) => Promise<User>
  register: (name: string, email: string, password: string) => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function isPublicPath(pathname: string) {
  return pathname === "/" || pathname.startsWith("/signup")
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null)
      // Clear HttpOnly jwt so proxy.ts does not bounce expired sessions back to /dashboard.
      void logoutUser()
        .catch(() => undefined)
        .finally(() => {
          if (
            typeof window !== "undefined" &&
            !isPublicPath(window.location.pathname)
          ) {
            window.location.replace("/")
          }
        })
    })

    return () => setUnauthorizedHandler(null)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const loggedInUser = await loginUser({ email, password })
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const newUser = await registerUser({ name, email, password })
      setUser(newUser)
      return newUser
    },
    []
  )

  const logout = useCallback(async () => {
    try {
      await logoutUser()
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
    }),
    [user, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
